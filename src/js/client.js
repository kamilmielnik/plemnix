import 'babel-polyfill';
import 'node-normalize-scss/_normalize.scss';
import 'styles/main.scss';
import FastClick from 'fastclick';
import { KeysListener } from 'utils';
import {
  CANVAS_ID,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  SNAKE_MOVE_TIME,
  SERVER_URL,
  SERVER_PORT
} from 'constants';
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
    snake.step();
  }

  connect(
    () => {

    },
    (message) => {
      console.log('message', message);
    }
  );
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

function connect(onOpen, onMessage) {
  const connection = new WebSocket(`ws://${SERVER_URL}:${SERVER_PORT}`, 'multiplayer-snake');
  connection.onopen = onOpen;
  connection.onerror = (error) => console.log('onerror' + error);
  connection.onmessage = (message) => {
    try {
      const json = JSON.parse(message.data);
      onMessage(json);
    } catch (error) {
      console.log(error);
    }
  };
}
