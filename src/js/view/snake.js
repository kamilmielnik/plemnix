import { SNAKE_HEAD_RADIUS, SNAKE_STEP_LENGTH, SNAKE_WIDTH } from 'constants';

export default function SnakeView(snake) {
  return {
    paint(context) {
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
      paintHead(context, snake);
    }
  };

  function paintHead(context, snake) {
    const { color, head } = snake;
    context.beginPath();
    context.strokeStyle = color;
    context.ellipse(head.x, head.y, SNAKE_HEAD_RADIUS, SNAKE_HEAD_RADIUS, 0, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.stroke();
  }
}

function lineCrossesBounds(start, end) {
  const xDifference = Math.abs(start.x - end.x);
  const yDifference = Math.abs(start.y - end.y);
  return [xDifference, yDifference].some(difference => difference > SNAKE_STEP_LENGTH);
}
