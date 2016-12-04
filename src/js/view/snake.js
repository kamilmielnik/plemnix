import { SNAKE_STEP_LENGTH, SNAKE_WIDTH } from 'constants';

export default function SnakeView(snake) {
  return {
    paint: context => {
      const { color, points } = snake;
      const [firstPoint, ...restOfPoints] = points;
      context.beginPath();
      context.lineWidth = SNAKE_WIDTH;
      context.strokeStyle = color;
      context.moveTo(firstPoint.x, firstPoint.y);
      restOfPoints.forEach((point, index) => {
        const previousPoint = restOfPoints[index - 1] || firstPoint;
        if(lineCrossesBounds(previousPoint, point)) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      });
      context.stroke();
    }
  };
}

function lineCrossesBounds(start, end) {
  const xDifference = Math.abs(start.x - end.x);
  const yDifference = Math.abs(start.y - end.y);
  return [xDifference, yDifference].some(difference => difference > SNAKE_STEP_LENGTH);
}
