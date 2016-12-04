import { FruitView, SnakeView } from 'view';

export default function GameView(game) {
  const fruitView = new FruitView(game.fruit);

  return {
    paint(context) {
      game.forEachPlayer(player => {
        const { snake } = player;
        const snakeView = new SnakeView(snake);
        snakeView.paint(context);
      });

      fruitView.paint(context);
    }
  };
}
