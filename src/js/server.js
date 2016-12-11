import 'babel-polyfill';
import { Server as WebSocketServer } from 'ws';
import http from 'http';
import {
  SERVER_PORT,
  GAME_SYNC_TIME, PING_SYNC_TIME, SNAKE_MOVE_TIME
} from './constants';
import {
  Message,
  MESSAGE_PING, MESSAGE_PONG, MESSAGE_CHAT,
  MESSAGE_SIGN_IN, MESSAGE_SIGN_IN_RESPONSE,
  MESSAGE_KEY_PRESSED, MESSAGE_KEY_RELEASED,
  MESSAGE_GAME_START, MESSAGE_GAME_STOP, MESSAGE_GAME_RESET,
  MESSAGE_STATE_UPDATED
} from './api';
import { Game, Player, Snake } from './model';

main();

function main() {
  const { server, wsServer } = createServers();
  const game = new Game();
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
      const player = new Player({
        name,
        snake: Snake.create(),
        socket
      });
      const { token } = player;
      game.addPlayer(token, player);
      socket.token = token;
      socket.on('close', (args) => {
        console.log('closing connection', token, args);
        clearInterval(pingSyncInterval);
        game.deletePlayer(token);
      });
      socket.on('error', (args) => console.log('connection error', token, args));
      socket.send(createSignInResponseMessage(token, player.id).serialize());
      setTimeout(ping, 10);
      const pingSyncInterval = setInterval(ping, PING_SYNC_TIME);

      function ping() {
        game.ping(token);
        socket.send(createPingMessage().serialize());
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
    },

    [MESSAGE_GAME_STOP]: () => {
      game.stop();
    },

    [MESSAGE_GAME_RESET]: () => {
      game.reset();
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

  setInterval(() => game.stepServer(), SNAKE_MOVE_TIME);
  setInterval(() => broadcast({
    wsServer,
    message: createStateUpdatedMessage(game.toJSON()).serialize()
  }), GAME_SYNC_TIME);
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

function createStateUpdatedMessage(state) {
  return new Message({
    type: MESSAGE_STATE_UPDATED,
    payload: {
      state
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
