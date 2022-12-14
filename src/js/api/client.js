import { SERVER_PORT } from '../constants';
import {
  MESSAGE_PONG, MESSAGE_CHAT,
  MESSAGE_KEY_PRESSED, MESSAGE_KEY_RELEASED,
  MESSAGE_SIGN_IN, MESSAGE_SIGN_IN_RESPONSE,
  MESSAGE_GAME_START, MESSAGE_GAME_STOP, MESSAGE_GAME_RESET
} from './types';
import Message from './message';

export default function ApiClient({ onOpen, customHandlers = {} }) {
  let token = null;
  let id = null;
  const handlers = {
    [MESSAGE_SIGN_IN_RESPONSE]: (ws, { token: apiToken, id: playerId }) => {
      token = apiToken;
      id = playerId;
    }
  };

  const ws = connect(onOpen, (message) => {
    const { type, payload } = message;
    const handler = handlers[type];
    const customHandler = customHandlers[type];
    if(handler) {
      handler(ws, payload);
    }

    if(Boolean(token)) {
      if(customHandler) {
        customHandler(ws, payload);
      }
    }
  });

  return {
    get token() {
      return token;
    },

    get id() {
      return id;
    },

    get isLoggedIn() {
      return Boolean(token);
    },

    pong() {
      ws.send(createPongMessage().serialize());
    },

    chat(message) {
      ws.send(createChatMessage(message).serialize());
    },

    signIn(name) {
      ws.send(createSignInMessage(name).serialize());
    },

    pressKey(key) {
      ws.send(createPressKeyMessage(key).serialize());
    },

    releaseKey(key) {
      ws.send(createReleaseKeyMessage(key).serialize());
    },

    startGame() {
      ws.send(createStartGameMessage().serialize());
    },

    stopGame() {
      ws.send(createStopGameMessage().serialize());
    },

    resetGame() {
      ws.send(createResetGameMessage().serialize());
    }
  };

  function createPongMessage() {
    return new Message({
      type: MESSAGE_PONG,
      token
    });
  }

  function createStartGameMessage() {
    return new Message({
      type: MESSAGE_GAME_START,
      token
    });
  }

  function createStopGameMessage() {
    return new Message({
      type: MESSAGE_GAME_STOP,
      token
    });
  }

  function createResetGameMessage() {
    return new Message({
      type: MESSAGE_GAME_RESET,
      token
    });
  }

  function createChatMessage(message) {
    return new Message({
      type: MESSAGE_CHAT,
      token,
      payload: {
        message
      }
    });
  }

  function createSignInMessage(name) {
    return new Message({
      type: MESSAGE_SIGN_IN,
      payload: {
        name
      }
    });
  }

  function createPressKeyMessage(key) {
    return new Message({
      type: MESSAGE_KEY_PRESSED,
      token,
      payload: {
        key
      }
    });
  }

  function createReleaseKeyMessage(key) {
    return new Message({
      type: MESSAGE_KEY_RELEASED,
      token,
      payload: {
        key
      }
    });
  }
}

function connect(onOpen, onMessage) {
  const ws = new WebSocket(`ws://${window.location.hostname}:${SERVER_PORT}`, null);
  ws.onopen = onOpen;
  ws.onerror = (error) => console.log('Error: ', error);
  ws.onmessage = (message) => {
    try {
      const json = JSON.parse(message.data);
      onMessage(json);
    } catch (error) {
      console.log('JSON parsing error: ', error);
    }
  };
  return ws;
}
