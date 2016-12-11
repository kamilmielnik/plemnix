export default function FruitView(fruit) {
  return {
    paint(context) {
      if(fruit.hasBeenEaten) {
        return;
      }

      const { color, point, size } = fruit;
      context.beginPath();
      context.strokeStyle = color;
      context.ellipse(point.x, point.y, size, size, 0, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();
      context.stroke();
    }
  };
}
