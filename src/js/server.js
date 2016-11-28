import { Server as WebSocketServer } from 'ws';
import http from 'http';
import { SERVER_PORT, SNAKE_MOVE_TIME } from './constants';
import {
  Message,
  MESSAGE_SIGN_IN, MESSAGE_SIGN_IN_RESPONSE,
  MESSAGE_KEY_PRESSED, MESSAGE_KEY_RELEASED,
  MESSAGE_STATE_UPDATED
} from './api';
import { Game, Player } from './model';

const game = new Game();
const handlers = {
  [MESSAGE_SIGN_IN]: (socket, _, { name }) => {
    const player = new Player(name, socket);
    const { token } = player;
    game.addPlayer(token, player);
    socket.send(createSignInResponseMessage(token).serialize());
  },

  [MESSAGE_KEY_PRESSED]: (ws, token, { key }) => {
    game.pressKey(token, key);
  },

  [MESSAGE_KEY_RELEASED]: (ws, token, { key }) => {
    game.releaseKey(token, key);
  }
};

const { server, wsServer } = createServers();
server.listen(SERVER_PORT, () => console.log(`HTTP server started at ${SERVER_PORT}`));
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
  game.step();
  const gameJSON = game.toJSON();
  const message = createStateUpdatedMessage(gameJSON);
  game.forEachPlayer(({ socket }) => socket.send(message.serialize()));
}, SNAKE_MOVE_TIME);

function createServers() {
  const server = http.createServer();
  const wsServer = new WebSocketServer({
    server
  });
  return { server, wsServer };
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
