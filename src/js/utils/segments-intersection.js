export default function segmentsIntersection(p1, p2, q1, q2) {
  const s1 = { x: p2.x - p1.x, y: p2.y - p1.y };
  const s2 = { x: q2.x - q1.x, y: q2.y - q1.y };
  const denominator = -s2.x * s1.y + s1.x * s2.y;
  const s = (-s1.y * (p1.x - q1.x) + s1.x * (p1.y - q1.y)) / denominator;
  const t = (Number(s2.x) * (p1.y - q1.y) - s2.y * (p1.x - q1.x)) / denominator;
  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}
