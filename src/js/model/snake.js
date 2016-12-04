import { getRandomColor, PressedKeys } from 'utils';
import {
  FIELD_WIDTH, FIELD_HEIGHT, FRUIT_VALUE,
  INITIAL_SNAKE_LENGTH, SNAKE_STEP_LENGTH, SNAKE_TURN_ANGLE
} from '../constants';

export default function Snake({ color, direction = 0, points = [], pointsToAdd = 0 } = {}) {
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

    eatFruit() {
      pointsToAdd += FRUIT_VALUE;
    },

    step() {
      const head = points[points.length - 1];
      const newHead = getNextPoint(head, direction);
      if(pointsToAdd > 0) {
        --pointsToAdd;
      } else {
        points.splice(0, 1);
      }
      points.push(newHead);
    },

    turnLeft() {
      direction += SNAKE_TURN_ANGLE;
    },

    turnRight() {
      direction -= SNAKE_TURN_ANGLE;
    },

    fromJSON(json) {
      color = json.color;
      direction = json.direction;
      points = json.points;
      pointsToAdd = json.pointsToAdd;
    },

    toJSON() {
      return {
        color,
        direction,
        points,
        pointsToAdd
      };
    }
  };
}

Snake.create = ({ start }) => new Snake({
  color: getRandomColor(),
  direction: 0,
  points: [start],
  pointsToAdd: INITIAL_SNAKE_LENGTH
});

function getNextPoint(point, direction) {
  let x = point.x + Math.cos(direction) * SNAKE_STEP_LENGTH;
  let y = point.y - Math.sin(direction) * SNAKE_STEP_LENGTH;

  if(x < 0) {
    x = FIELD_WIDTH + x;
  }

  if(x >= FIELD_WIDTH) {
    x -= FIELD_WIDTH;
  }

  if(y < 0) {
    y = FIELD_HEIGHT + y;
  }

  if(y >= FIELD_HEIGHT) {
    y -= FIELD_HEIGHT;
  }

  return { x, y };
}
