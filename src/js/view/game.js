import { SnakeView } from 'view';

export default function GameView(game) {
  return {
    paint(context) {
      game.forEachPlayer((player) => {
        const { snake } = player;
        const snakeView = new SnakeView(snake);
        snakeView.paint(context);
      });
    }
  };
}
