import { getRandomColor } from 'utils';
import { INITIAL_SNAKE_LENGTH, SNAKE_STEP_LENGTH } from 'constants';
import { Point } from 'model';

export default function Snake({ id, points, color }) {
  const direction = 0;

  return {
    get id() {
      return id;
    },

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

    },

    move() {
      const head = points[points.length - 1];
      points.splice(0, 1);
      points.push(new Point({
        x: head.x + 1,
        y: head.y + 1
      }));
    }
  };
}

Snake.create = ({ id, start }) => {
  const points = [start];
  const color = getRandomColor();

  for (let i = 1; i < INITIAL_SNAKE_LENGTH; ++i) {
    const nextPointXOffset = SNAKE_STEP_LENGTH * i;
    points.push(new Point({
      x: start.x + nextPointXOffset,
      y: start.y
    }));
  }

  return new Snake({ id, points, color });
};
