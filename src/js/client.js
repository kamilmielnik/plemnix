import 'babel-polyfill';
import 'node-normalize-scss/_normalize.scss';
import 'styles/main.scss';
import { CANVAS_ID, FIELD_HEIGHT, FIELD_WIDTH, SNAKE_MOVE_TIME } from 'constants';
import { KeysListener } from 'utils';
import { MESSAGE_STATE_UPDATED } from 'api';
import ApiClient from 'api/client';
import { Game, Snake } from 'model';
import { CanvasView, GameView, MenuView } from 'view';

main();

function main() {
  const game = new Game();
  game.fruit.hasBeenEaten = true;
  const menuView = new MenuView(game);
  const gameView = new GameView(game);
  const canvasView = createCanvasView();
  canvasView.addView(gameView);
  canvasView.paint();

  let updateGameInterval = setInterval(() => game.step(), SNAKE_MOVE_TIME);
  let updateMenuInterval = setInterval(() => menuView.paint(), 300);

  const apiClient = new ApiClient({
    onOpen: () => apiClient.signIn('kamil'),
    customHandlers: {
      [MESSAGE_STATE_UPDATED]: (ws, { state }) => {
        clearInterval(updateGameInterval);
        game.fromJSON(state);
        updateGameInterval = setInterval(() => game.step(), SNAKE_MOVE_TIME);
      }
    }
  });

  const keysListener = new KeysListener({
    onKeyDown({ key }) {
      apiClient.pressKey(key);
      game.pressKey(apiClient.token, key);
    },

    onKeyUp({ key }) {
      apiClient.releaseKey(key);
      game.releaseKey(apiClient.token, key);
    }
  });
  keysListener.attach();
}

function createCanvasView() {
  return new CanvasView({
    id: CANVAS_ID,
    height: FIELD_HEIGHT,
    width: FIELD_WIDTH
  });
}
