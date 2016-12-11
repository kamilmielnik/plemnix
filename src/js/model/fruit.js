import {
  FIELD_WIDTH, FIELD_HEIGHT,
  FRUIT_COLOR, MAX_FRUIT_SIZE, MIN_FRUIT_SIZE,
  SNAKE_HEAD_RADIUS
} from '../constants';
import { pointInCircle } from '../utils';

export default function Fruit({ color, hasBeenEaten, point, size }) {
  return {
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
      color = json[0];
      hasBeenEaten = json[1] === 1 ? true : false;
      point = {
        x: json[2][0],
        y: json[2][1]
      };
      size = json[3];
    },

    toJSON() {
      return [
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
  color: json[0],
  hasBeenEaten: json[1] === 1 ? true : false,
  point: {
    x: json[2][0],
    y: json[2][1]
  },
  size: json[3]
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
