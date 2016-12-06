export default function pointInCircle(point, circleCenter, circleRadius) {
  const xDifference = point.x - circleCenter.x;
  const yDifference = point.y - circleCenter.y;

  return xDifference * xDifference + yDifference * yDifference < circleRadius * circleRadius;
}
