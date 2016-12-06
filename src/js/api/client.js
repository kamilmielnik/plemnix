import { SERVER_URL, SERVER_PORT } from '../constants';
import {
  MESSAGE_PONG, MESSAGE_CHAT,
  MESSAGE_KEY_PRESSED, MESSAGE_KEY_RELEASED,
  MESSAGE_SIGN_IN, MESSAGE_SIGN_IN_RESPONSE
} from './types';
import Message from './message';

export default function ApiClient({ onOpen, customHandlers = {} }) {
  let token = null;
  const handlers = {
    ...customHandlers,

    [MESSAGE_SIGN_IN_RESPONSE]: (ws, { token: apiToken }) => {
      token = apiToken;
    }
  };

  const ws = connect(onOpen, message => {
    const { type, payload } = message;
    const handler = handlers[type];
    if(handler) {
      handler(ws, payload);
    } else {
      console.log(`no handler for "${type}"`);
    }
  });

  return {
    get token() {
      return token;
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
    }
  };

  function createPongMessage() {
    return new Message({
      type: MESSAGE_PONG,
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
  const ws = new WebSocket(`ws://${SERVER_URL}:${SERVER_PORT}`, null);
  ws.onopen = onOpen;
  ws.onerror = error => console.log('Error: ', error);
  ws.onmessage = message => {
    try {
      const json = JSON.parse(message.data);
      onMessage(json);
    } catch (error) {
      console.log('JSON parsing error: ', error);
    }
  };
  return ws;
}
