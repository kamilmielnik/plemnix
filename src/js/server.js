import 'babel-polyfill';
import { Server as WebSocketServer } from 'ws';
import http from 'http';
import {
  SERVER_PORT, CONNECTION_ESTABLISHED,
  GAME_SYNC_TIME, PING_SYNC_TIME, CHAT_SYNC_TIME, SNAKE_MOVE_TIME
} from './constants';
import {
  Message,
  MESSAGE_PING, MESSAGE_PONG, MESSAGE_CHAT,
  MESSAGE_SIGN_IN, MESSAGE_SIGN_IN_RESPONSE,
  MESSAGE_KEY_PRESSED, MESSAGE_KEY_RELEASED,
  MESSAGE_CHAT_UPDATED, MESSAGE_STATE_UPDATED
} from './api';
import { Chat, Game, Player, Snake } from './model';

main();

function main() {
  const game = new Game();
  const chat = new Chat();
  const handlers = {
    [MESSAGE_CHAT]: (socket, token, { message }) => {
      const { name } = game.players[token];
      chat.say(name, message);
    },

    [MESSAGE_PONG]: (socket, token) => {
      game.pong(token);
    },

    [MESSAGE_SIGN_IN]: (socket, _, { name }) => {
      const player = new Player({
        name,
        snake: createDefaultSnake(),
        socket
      });
      const { token } = player;
      game.addPlayer(token, player);
      socket.token = token;
      socket.on('close', args => {
        console.log('closing connection', token, args);
        clearInterval(pingSyncInterval);
        game.deletePlayer(token);
      });
      socket.on('error', (args) => console.log('connection error', token, args));
      socket.send(createSignInResponseMessage(token).serialize());
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
    }
  };

  const { server, wsServer } = createServers();
  server.listen(SERVER_PORT, () => console.log(`HTTP server started at http://localhost:${SERVER_PORT}/`));
  wsServer.on('connection', socket => {
    socket.on('message', message => {
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
  setInterval(() => broadcast({
    wsServer,
    message: createChatUpdatedMessage(chat.toJSON()).serialize()
  }), CHAT_SYNC_TIME);
}

function createPingMessage() {
  return new Message({
    type: MESSAGE_PING
  });
}

function createChatUpdatedMessage(chat) {
  return new Message({
    type: MESSAGE_CHAT_UPDATED,
    payload: {
      chat
    }
  });
}

function createSignInResponseMessage(token) {
  return new Message({
    type: MESSAGE_SIGN_IN_RESPONSE,
    payload: {
      token
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

function createDefaultSnake() {
  return Snake.create({
    start: {
      x: 100,
      y: 100
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
};

const noop = () => undefined;
