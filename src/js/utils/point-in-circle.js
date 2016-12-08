const EPSILON = 1 / 10000;

export default function pointInCircle(point, circleCenter, circleRadius) {
  const xDifference = point.x - circleCenter.x;
  const yDifference = point.y - circleCenter.y;

  return xDifference * xDifference + yDifference * yDifference < circleRadius * circleRadius + EPSILON;
}
