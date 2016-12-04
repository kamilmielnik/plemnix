import { FIELD_WIDTH, FIELD_HEIGHT, FRUIT_COLOR, FRUIT_RADIUS } from '../constants';

export default function Fruit({ color, point, hasBeenEaten }) {
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

    isPointInRange(otherPoint) {
      const xDifference = otherPoint.x - point.x;
      const yDifference = otherPoint.y - point.y;
      return xDifference * xDifference + yDifference * yDifference < FRUIT_RADIUS * FRUIT_RADIUS;
    },

    revive() {
      hasBeenEaten = false;
      point = getRandomPoint();
    },

    fromJSON(json) {
      color = json.color;
      hasBeenEaten = json.hasBeenEaten;
      point = json.point;
    },

    toJSON() {
      return {
        color,
        hasBeenEaten,
        point
      };
    }
  };
}

Fruit.create = () => new Fruit({
  color: FRUIT_COLOR,
  point: getRandomPoint()
});

function getRandomPoint() {
  return {
    x: FRUIT_RADIUS + getRandomNumber(FIELD_WIDTH - 2 * FRUIT_RADIUS),
    y: FRUIT_RADIUS + getRandomNumber(FIELD_HEIGHT - 2 * FRUIT_RADIUS)
  };
}

function getRandomNumber(max) {
  return Math.random() * max;
}
