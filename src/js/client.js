import 'babel-polyfill';
import 'node-normalize-scss/_normalize.scss';
import 'styles/main.scss';
import { CANVAS_ID, CANVAS_HEIGHT, CANVAS_WIDTH, SNAKE_MOVE_TIME } from 'constants';
import { KeysListener } from 'utils';
import { MESSAGE_STATE_UPDATED } from 'api';
import ApiClient from 'api/client';
import { Game, Snake } from 'model';
import { CanvasView, GameView } from 'view';

main();

function main() {
  const game = new Game();
  const gameView = new GameView(game);
  const canvasView = createCanvasView();
  canvasView.addView(gameView);
  canvasView.paint();

  setInterval(() => game.step(), SNAKE_MOVE_TIME);

  const apiClient = new ApiClient({
    onOpen: () => apiClient.signIn('kamil'),
    customHandlers: {
      [MESSAGE_STATE_UPDATED]: (ws, { state }) => {
        game.fromJSON(state);
      }
    }
  });

  const keysListener = new KeysListener({
    onKeyDown: ({ key }) => apiClient.pressKey(key),
    onKeyUp: ({ key }) => apiClient.releaseKey(key)
  });
  keysListener.attach();
}

function createCanvasView() {
  return new CanvasView({
    id: CANVAS_ID,
    height: CANVAS_HEIGHT,
    width: CANVAS_WIDTH
  });
}
