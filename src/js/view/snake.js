import { SNAKE_WIDTH } from 'constants';

export default function SnakeView(snake) {
  return {
    paint: context => {
      const color = snake.color;
      const points = snake.points;
      const [firstPoint, ...restOfPoints] = points;
      context.beginPath();
      context.lineWidth = SNAKE_WIDTH;
      context.strokeStyle = color;
      context.moveTo(firstPoint.x, firstPoint.y);
      restOfPoints.forEach(point => context.lineTo(point.x, point.y));
      context.stroke();
    }
  };
}
