import 'babel-polyfill';
import 'node-normalize-scss/_normalize.scss';
import 'styles/main.scss';
import FastClick from 'fastclick';
import { KeysListener } from 'utils';
import { CANVAS_ID, CANVAS_HEIGHT, CANVAS_WIDTH, SNAKE_MOVE_TIME } from 'constants';
import { CanvasView, SnakeView } from 'view';
import { Point, Snake } from 'model';

FastClick.attach(document.body);
main();

function main() {
  const keysListener = new KeysListener();
  keysListener.attach();
  const snake = createSnake(keysListener);
  const snakeView = new SnakeView(snake);
  const canvasView = createCanvasView();
  canvasView.addView(snakeView);
  canvasView.paint();

  setInterval(run, SNAKE_MOVE_TIME);

  function run() {
    snake.move();
  }
}

function createCanvasView() {
  return new CanvasView({
    id: CANVAS_ID,
    height: CANVAS_HEIGHT,
    width: CANVAS_WIDTH
  });
}

function createSnake(keysListener) {
  return Snake.create({
    id: 'kamil',
    keysListener,
    start: new Point({
      x: 100,
      y: 100
    })
  });
}
