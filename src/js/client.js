import 'babel-polyfill';
import 'node-normalize-scss/_normalize.scss';
import 'styles/main.scss';
import { FIELD_HEIGHT, FIELD_WIDTH, SNAKE_MOVE_TIME } from 'constants';
import { KeysListener } from 'utils';
import { MESSAGE_PING, MESSAGE_CHAT_UPDATED, MESSAGE_STATE_UPDATED } from 'api';
import ApiClient from 'api/client';
import { Chat, Game, Snake } from 'model';
import { CanvasView, ChatView, GameView, PlayersView } from 'view';

main();

function main() {
  const game = new Game();
  const chat = new Chat();
  game.fruit.hasBeenEaten = true;
  const chatView = new ChatView(onSubmitMessage);
  const playersView = new PlayersView();
  const gameView = new GameView(game);
  const canvasView = createCanvasView();
  canvasView.addView(gameView);
  canvasView.paint();

  let updateGameInterval = setInterval(() => game.step(), SNAKE_MOVE_TIME);
  let updateMenuInterval = setInterval(updateMenu, 300);

  const apiClient = new ApiClient({
    onOpen: () => apiClient.signIn('kamil'),
    customHandlers: {
      [MESSAGE_PING]: () => {
        apiClient.pong();
      },

      [MESSAGE_CHAT_UPDATED]: (ws, { chat: chatJSON }) => {
        chat.fromJSON(chatJSON);
      },

      [MESSAGE_STATE_UPDATED]: (ws, { state }) => {
        clearInterval(updateGameInterval);
        game.fromJSON(state);
        updateGameInterval = setInterval(() => game.step(), SNAKE_MOVE_TIME);
      }
    }
  });

  const keysListener = new KeysListener({
    onKeyDown({ key }) {
      if (['ArrowLeft', 'ArrowRight'].includes(key)) {
        apiClient.pressKey(key);
        game.pressKey(apiClient.token, key);
      }
    },

    onKeyUp({ key }) {
      if (['ArrowLeft', 'ArrowRight'].includes(key)) {
        apiClient.releaseKey(key);
        game.releaseKey(apiClient.token, key);
      }
    }
  });
  keysListener.attach();

  function onSubmitMessage(message) {
    apiClient.chat(message);
  }

  function updateMenu() {
    chatView.paint(chat);
    playersView.paint(game.players);
  }
}

function createCanvasView() {
  return new CanvasView({
    height: FIELD_HEIGHT,
    width: FIELD_WIDTH
  });
}
