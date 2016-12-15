import { getRandomColor, pointInCircle } from 'utils';
import {
  FIELD_WIDTH, FIELD_HEIGHT, INITIAL_SNAKE_LENGTH,
  MIN_POINTS_TO_COMPUTE_SELF_COLLISIONS,
  SNAKE_HEAD_RADIUS, SNAKE_STEP_LENGTH, SNAKE_TURN_ANGLE,
  SNAKES_LIGHT_JSON_POINTS
} from '../constants';

export default function Snake({ color, direction = 0, isAlive = true, points = [], pointsToAdd = 0 } = {}) {
  return {
    get color() {
      return color;
    },

    get direction() {
      return direction;
    },

    get head() {
      return points[points.length - 1];
    },

    get isAlive() {
      return isAlive;
    },

    get points() {
      return [...points];
    },

    get pointsToAdd() {
      return pointsToAdd;
    },

    set pointsToAdd(value) {
      pointsToAdd = value;
    },

    get score() {
      return points.length + pointsToAdd - INITIAL_SNAKE_LENGTH;
    },

    eatFruit(fruit) {
      pointsToAdd += fruit.size;
    },

    hasCrashedIntoSnake(snake) {
      const head = points[points.length - 1];
      let pointsToCheck = null;

      if(snake === this) {
        if(points.length < MIN_POINTS_TO_COMPUTE_SELF_COLLISIONS) {
          return false;
        }
        pointsToCheck = points.slice(0, points.length - MIN_POINTS_TO_COMPUTE_SELF_COLLISIONS);
      } else {
        pointsToCheck = snake.points;
      }

      return pointsToCheck.some((point) => pointInCircle(head, point, SNAKE_HEAD_RADIUS));
    },

    kill() {
      isAlive = false;
    },

    step() {
      if(!isAlive) {
        return;
      }

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

    reset() {
      const defaultSnake = getDefaultSnakeConfig();
      direction = defaultSnake.direction;
      points = defaultSnake.points;
      pointsToAdd = defaultSnake.pointsToAdd;
      isAlive = true;
    },

    fromLightJSON(json) {
      direction = json[0];
      isAlive = Boolean(json[1]);
      pointsToAdd = json[2];
      const numberOfPoints = json[3];
      const headPoints = json[4][0].map((x, index) => ({ x, y: json[4][1][index] }));
      if(headPoints.length > 0) {
        const firstHeadPoint = headPoints[0];
        const firstHeadPointIndexInSnake = points.findIndex(
          ({ x, y }) => x === firstHeadPoint.x && y === firstHeadPoint.y
        );

        points = [
          ...points.slice(0, Math.max(0, firstHeadPointIndexInSnake)),
          ...headPoints
        ].slice(-numberOfPoints);
      }
    },

    toLightJSON() {
      const sliceStartIndex = Math.max(points.length - SNAKES_LIGHT_JSON_POINTS + 1, 0);

      return [
        direction,
        isAlive ? 1 : 0,
        pointsToAdd,
        points.length,
        points.slice(sliceStartIndex).reduce((acc, { x, y }) => {
          acc[0].push(x);
          acc[1].push(y);
          return acc;
        }, [[], []])
      ];
    },

    fromJSON(json) {
      color = json[0];
      direction = json[1];
      isAlive = Boolean(json[2]);
      const y = json[3][1];
      points = json[3][0].reduce((acc, x, index) => {
        acc.push({ x, y: y[index] });
        return acc;
      }, []);
      pointsToAdd = json[4];
    },

    toJSON() {
      return [
        color,
        direction,
        isAlive ? 1 : 0,
        [
          points.map(({ x }) => x),
          points.map(({ y }) => y)
        ],
        pointsToAdd
      ];
    }
  };
}

Snake.create = () => new Snake(getDefaultSnakeConfig());

function getDefaultSnakeConfig() {
  return {
    color: getRandomColor(),
    direction: Math.random() * 2 * Math.PI,
    points: [
      {
        x: Math.random() * FIELD_WIDTH,
        y: Math.random() * FIELD_HEIGHT
      }
    ],
    pointsToAdd: INITIAL_SNAKE_LENGTH - 1
  };
}

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
