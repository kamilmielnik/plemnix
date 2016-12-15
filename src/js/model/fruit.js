import {
  FIELD_WIDTH, FIELD_HEIGHT,
  FRUIT_COLOR, MAX_FRUIT_SIZE, MIN_FRUIT_SIZE,
  SNAKE_HEAD_RADIUS
} from '../constants';
import { pointInCircle } from '../utils';

let nextId = 0;

export default function Fruit({ id = nextId++, color, hasBeenEaten, point, size }) {
  return {
    get id() {
      return id;
    },

    get color() {
      return color;
    },

    get hasBeenEaten() {
      return hasBeenEaten;
    },

    set hasBeenEaten(value) {
      hasBeenEaten = value;
    },

    get point() {
      return point;
    },

    get size() {
      return size;
    },

    collidesWithSnakeHead(snake) {
      const { head } = snake;
      return pointInCircle(head, point, size + SNAKE_HEAD_RADIUS);
    },

    fromJSON(json) {
      id = json[0];
      color = json[1];
      hasBeenEaten = Boolean(json[2]);
      point = {
        x: json[3][0],
        y: json[3][1]
      };
      size = json[4];
    },

    toJSON() {
      return [
        id,
        color,
        hasBeenEaten ? 1 : 0,
        [point.x, point.y],
        size
      ];
    }
  };
}

Fruit.create = () => {
  const size = getRandomSize();

  return new Fruit({
    color: FRUIT_COLOR,
    point: getRandomPoint(size),
    size
  });
};

Fruit.fromJSON = (json) => new Fruit({
  id: json[0],
  color: json[1],
  hasBeenEaten: Boolean(json[2]),
  point: {
    x: json[3][0],
    y: json[3][1]
  },
  size: json[4]
});

function getRandomPoint(size) {
  return {
    x: size + getRandomNumber(FIELD_WIDTH - 2 * size),
    y: size + getRandomNumber(FIELD_HEIGHT - 2 * size)
  };
}

function getRandomSize() {
  return Math.round(MIN_FRUIT_SIZE + getRandomNumber(MAX_FRUIT_SIZE - MIN_FRUIT_SIZE));
}

function getRandomNumber(max) {
  return Math.random() * max;
}
