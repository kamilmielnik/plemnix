import 'babel-polyfill';
import { Server as WebSocketServer } from 'ws';
import http from 'http';
import {
  SERVER_PORT,
  GAME_SYNC_TIME, PING_SYNC_TIME, PLAYER_INFO_SYNC_TIME, SNAKES_SYNC_TIME,
  SNAKE_MOVE_TIME
} from './constants';
import {
  Message,
  MESSAGE_PING, MESSAGE_PONG, MESSAGE_CHAT,
  MESSAGE_SIGN_IN, MESSAGE_SIGN_IN_RESPONSE,
  MESSAGE_KEY_PRESSED, MESSAGE_KEY_RELEASED,
  MESSAGE_GAME_START, MESSAGE_GAME_STOP, MESSAGE_GAME_RESET,
  MESSAGE_PLAYER_LEFT,
  MESSAGE_FRUITS_UPDATED, MESSAGE_PLAYERS_INFO_UPDATED,
  MESSAGE_SNAKES_UPDATED, MESSAGE_STATE_UPDATED
} from './api';
import { Game, Player } from './model';

main();

function main() {
  const { server, wsServer } = createServers();
  const game = new Game({ onAddFruit });
  const handlers = {
    [MESSAGE_CHAT]: (socket, token, { message }) => {
      const { name } = game.players[token];
      broadcast({
        wsServer,
        message: createChatMessage(name, message).serialize()
      });
    },

    [MESSAGE_PONG]: (socket, token) => {
      game.pong(token);
    },

    [MESSAGE_SIGN_IN]: (socket, _, { name }) => {
      const player = new Player({ name, socket });
      const { token } = player;
      game.addPlayer(token, player);
      socket.token = token;
      socket.on('close', onCloseConnection);
      socket.on('error', onError);
      socket.send(createSignInResponseMessage(token, player.id).serialize());
      const pingSyncInterval = setInterval(ping, PING_SYNC_TIME);
      broadcastStateUpdate();

      function ping() {
        game.ping(token);
        socket.send(createPingMessage().serialize());
      }

      function onCloseConnection(args) {
        console.log('closing connection', token, args);
        clearInterval(pingSyncInterval);
        const { id } = game.players[token];
        game.deletePlayer(token);

        broadcast({
          wsServer,
          message: createPlayerLeftMessage(id).serialize()
        });
      }

      function onError(args) {
        console.log('connection error', token, args);
      }
    },

    [MESSAGE_KEY_PRESSED]: (ws, token, { key }) => {
      game.pressKey(token, key);
    },

    [MESSAGE_KEY_RELEASED]: (ws, token, { key }) => {
      game.releaseKey(token, key);
    },

    [MESSAGE_GAME_START]: () => {
      game.start();
      /*broadcast({
        wsServer,
        message: createGameStartMessage().serialize()
      });*/
      broadcastStateUpdate();
    },

    [MESSAGE_GAME_STOP]: () => {
      game.stop();
      broadcast({
        wsServer,
        message: createGameStopMessage().serialize()
      });
      broadcastStateUpdate();
    },

    [MESSAGE_GAME_RESET]: () => {
      game.reset();
      broadcastStateUpdate();
    }
  };

  server.listen(SERVER_PORT, () => console.log(`HTTP server started at http://localhost:${SERVER_PORT}/`));
  wsServer.on('connection', (socket) => {
    socket.on('message', (message) => {
      try {
        const { type, token, payload } = JSON.parse(message);
        const handler = handlers[type];
        if(handler) {
          handler(socket, token, payload);
        } else {
          console.log(`no handler for "${type}"`);
        }
      } catch (error) {
        console.log('JSON parsing error: ', error);
      }
    });
  });

  setInterval(() => {
    const oldFruits = [...game.fruits];
    game.stepServer();
    const eatenFruits = oldFruits.filter((fruit) => !game.fruits.includes(fruit));
    const newFruits = game.fruits.filter((fruit) => !oldFruits.includes(fruit));

    if(eatenFruits.length || newFruits.length) {
      broadcast({
        wsServer,
        message: createFruitsUpdatedMessage(eatenFruits, newFruits).serialize()
      });
    }
  }, SNAKE_MOVE_TIME);

  setInterval(broadcastStateUpdate, GAME_SYNC_TIME);
  setInterval(broadcastPlayersInfoUpdate, PLAYER_INFO_SYNC_TIME);
  setInterval(broadcastSnakesUpdate, SNAKES_SYNC_TIME);

  function onAddFruit(fruit) {
    broadcast({
      wsServer,
      message: createFruitsUpdatedMessage([], [fruit]).serialize()
    });
  }

  function broadcastPlayersInfoUpdate() {
    broadcast({
      wsServer,
      message: createPlayersInfoUpdatedMessage(game.players).serialize()
    });
  }

  function broadcastSnakesUpdate() {
    broadcast({
      wsServer,
      message: createSnakesUpdatedMessage(game).serialize()
    });
  }

  function broadcastStateUpdate() {
    broadcast({
      wsServer,
      message: createStateUpdatedMessage(game.toJSON()).serialize()
    });
  }
}

function createPingMessage() {
  return new Message({
    type: MESSAGE_PING
  });
}

function createChatMessage(name, message) {
  return new Message({
    type: MESSAGE_CHAT,
    payload: {
      name,
      message
    }
  });
}

function createSignInResponseMessage(token, id) {
  return new Message({
    type: MESSAGE_SIGN_IN_RESPONSE,
    payload: {
      token,
      id
    }
  });
}

function createFruitsUpdatedMessage(eatenFruits, newFruits) {
  return new Message({
    type: MESSAGE_FRUITS_UPDATED,
    payload: [
      eatenFruits.map(({ id }) => id),
      newFruits.map((fruit) => fruit.toJSON())
    ]
  });
}

function createPlayersInfoUpdatedMessage(players) {
  return new Message({
    type: MESSAGE_PLAYERS_INFO_UPDATED,
    payload: {
      players: Object.values(players).reduce((payload, { id, ping }) => {
        payload[id] = [ping];
        return payload;
      }, {})
    }
  });
}

function createSnakesUpdatedMessage(game) {
  return new Message({
    type: MESSAGE_SNAKES_UPDATED,
    payload: Object.values(game.players).reduce((payload, { id, snake }) => {
      payload[id] = snake.toLightJSON();
      return payload;
    }, {})
  });
}

function createStateUpdatedMessage(state) {
  return new Message({
    type: MESSAGE_STATE_UPDATED,
    payload: {
      state
    }
  });
}

function createGameStartMessage() {
  return new Message({
    type: MESSAGE_GAME_START
  });
}

function createGameStopMessage() {
  return new Message({
    type: MESSAGE_GAME_STOP
  });
}

function createPlayerLeftMessage(id) {
  return new Message({
    type: MESSAGE_PLAYER_LEFT,
    payload: {
      id
    }
  });
}

function createServers() {
  const server = http.createServer();
  const wsServer = new WebSocketServer({ server });
  return { server, wsServer };
}

function broadcast({ wsServer, message, onAck = noop, onBeforeSend = noop }) {
  wsServer.clients.forEach((client) => {
    onBeforeSend(client);
    client.send(message, () => onAck(client));
  });
}

const noop = () => undefined;
