import 'babel-polyfill';
import 'node-normalize-scss/_normalize.scss';
import 'styles/main.scss';
import { FIELD_HEIGHT, FIELD_WIDTH, SNAKE_MOVE_TIME } from 'constants';
import { KeysListener } from 'utils';
import {
  MESSAGE_PING, MESSAGE_CHAT,
  MESSAGE_GAME_START,
  MESSAGE_GAME_STOP,
  MESSAGE_PLAYER_LEFT,
  MESSAGE_FRUITS_UPDATED, MESSAGE_STATE_UPDATED
} from 'api';
import ApiClient from 'api/client';
import { Chat, Fruit, Game } from 'model';
import { CanvasView, ChatView, GameView, GameControlView, LoginView, PlayersView } from 'view';

main();

function main() {
  const game = new Game();
  const chat = new Chat();
  const chatView = new ChatView({ onSubmitMessage });
  const loginView = new LoginView({ onSubmitName });
  const playersView = new PlayersView();
  const startStopView = new GameControlView({ onStartStopGame, onResetGame });
  const gameView = new GameView(game);
  const canvasView = createCanvasView();
  canvasView.addView(gameView);
  canvasView.paint();

  let updateGameInterval = setInterval(() => game.step(), SNAKE_MOVE_TIME);
  setInterval(updateMenu, 300);

  const apiClient = new ApiClient({
    customHandlers: {
      [MESSAGE_CHAT]: (ws, { name, message }) => {
        chat.say(name, message);
      },

      [MESSAGE_PING]: () => {
        apiClient.pong();
      },

      [MESSAGE_GAME_START]: () => {
        game.startClient();
      },

      [MESSAGE_GAME_STOP]: () => {
        game.stop();
      },

      [MESSAGE_PLAYER_LEFT]: (ws, { id }) => {
        game.deletePlayer(id);
      },

      [MESSAGE_FRUITS_UPDATED]: (ws, payload) => {
        const [eatenFruitsIds, newFruits] = payload;
        game.deleteFruits(eatenFruitsIds);
        game.addFruits(newFruits.map(Fruit.fromJSON));
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
      if(['ArrowLeft', 'ArrowRight'].includes(key) && apiClient.isLoggedIn) {
        apiClient.pressKey(key);
        game.pressKey(apiClient.id, key);
      }
    },

    onKeyUp({ key }) {
      if(['ArrowLeft', 'ArrowRight'].includes(key) && apiClient.isLoggedIn) {
        apiClient.releaseKey(key);
        game.releaseKey(apiClient.id, key);
      }
    }
  });
  keysListener.attach();

  function onSubmitMessage(message) {
    apiClient.chat(message);
  }

  function onSubmitName(name) {
    apiClient.signIn(name);
  }

  function onStartStopGame() {
    if(game.isRunning) {
      apiClient.stopGame();
    } else {
      apiClient.startGame();
    }
  }

  function onResetGame() {
    apiClient.resetGame();
  }

  function updateMenu() {
    loginView.paint(apiClient.isLoggedIn);
    startStopView.paint(game.isRunning);
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
