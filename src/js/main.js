import 'babel-polyfill';
import 'node-normalize-scss/_normalize.scss';
import 'styles/main.scss';
import FastClick from 'fastclick';
import { CANVAS_ID, CANVAS_HEIGHT, CANVAS_WIDTH } from 'constants';
import { CanvasView, SnakeView } from 'view';
import { Point, Snake } from 'model';

FastClick.attach(document.body);
main();

function main() {
  const snake = createSnake();
  const snakeView = new SnakeView(snake);
  const canvasView = createCanvasView();
  canvasView.addView(snakeView);
  canvasView.paint();

  setInterval(run, 10);

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

function createSnake() {
  return Snake.create({
    id: 'kamil',
    start: new Point({
      x: 100,
      y: 100
    })
  });
}
