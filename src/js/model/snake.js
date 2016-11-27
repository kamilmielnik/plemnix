import { getRandomColor } from 'utils';
import { INITIAL_SNAKE_LENGTH, SNAKE_STEP_LENGTH, SNAKE_TURN_ANGLE } from 'constants';
import { Point } from 'model';

export default function Snake({ id, keysListener, points, color }) {
  let direction = 0;

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
      const head = points[points.length - 1];
      const newHead = getNextPoint(head, direction);
      points.push(newHead);
    },

    move() {
      handleKeyboardInput();
      const head = points[points.length - 1];
      const newHead = getNextPoint(head, direction);
      points.splice(0, 1);
      points.push(newHead);
    }
  };

  function handleKeyboardInput() {
    if(keysListener.isPressed('ArrowLeft')) {
      turnLeft();
    } else if(keysListener.isPressed('ArrowRight')) {
      turnRight();
    }
  }

  function turnLeft() {
    direction += SNAKE_TURN_ANGLE;
  }

  function turnRight() {
    direction -= SNAKE_TURN_ANGLE;
  }
}

Snake.create = ({ id, keysListener, start }) => {
  const points = [start];
  const color = getRandomColor();

  for (let i = 1; i < INITIAL_SNAKE_LENGTH; ++i) {
    points.push(new Point({
      x: start.x + SNAKE_STEP_LENGTH * i,
      y: start.y
    }));
  }

  return new Snake({ id, keysListener, points, color });
};

function getNextPoint(point, direction) {
  return new Point({
    x: point.x + Math.cos(direction) * SNAKE_STEP_LENGTH,
    y: point.y - Math.sin(direction) * SNAKE_STEP_LENGTH
  });
}
