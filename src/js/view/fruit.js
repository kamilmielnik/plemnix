import { FRUIT_RADIUS } from 'constants';

export default function FruitView(fruit) {
  return {
    paint(context) {
      if(fruit.hasBeenEaten) {
        return;
      }

      const { color, point } = fruit;
      context.beginPath();
      context.strokeStyle = color;
      context.ellipse(point.x, point.y, FRUIT_RADIUS, FRUIT_RADIUS, 0, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();
      context.stroke();
    }
  };
}
