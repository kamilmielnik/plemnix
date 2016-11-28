import { getRandomColor, PressedKeysListener } from 'utils';
import { INITIAL_SNAKE_LENGTH, SNAKE_STEP_LENGTH, SNAKE_TURN_ANGLE } from 'constants';

export default function Snake({ points, direction = 0, color }) {
  return {
    get color() {
      return color;
    },

    get direction() {
      return direction;
    },

    get points() {
      return [...points];
    },

    grow() {
      const head = points[points.length - 1];
      const newHead = getNextPoint(head, direction);
      points.push(newHead);
    },

    step() {
      const head = points[points.length - 1];
      const newHead = getNextPoint(head, direction);
      points.splice(0, 1);
      points.push(newHead);
    },

    turnLeft() {
      direction += SNAKE_TURN_ANGLE;
    },

    turnRight() {
      direction -= SNAKE_TURN_ANGLE;
    },

    fromJSON(json) {
      points = json.points;
      color = json.color;
    },

    toJSON() {
      return {
        points,
        color
      };
    }
  };
}

Snake.create = ({ start }) => {
  const points = [start];
  const color = getRandomColor();
  const direction = 0;

  for (let i = 1; i < INITIAL_SNAKE_LENGTH; ++i) {
    points.push(getNextPoint(start, direction));
  }

  return new Snake({ points, direction, color });
};

function getNextPoint(point, direction) {
  return {
    x: point.x + Math.cos(direction) * SNAKE_STEP_LENGTH,
    y: point.y - Math.sin(direction) * SNAKE_STEP_LENGTH
  };
}
