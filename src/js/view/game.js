import { FruitView, SnakeView } from 'view';
import { FIELD_HEIGHT, FIELD_WIDTH } from 'constants';

const GAME_OVER_MESSAGE = 'Game over';
const GAME_OVER_MESSAGE_SIZE = 48;

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

      if (!game.isRunning) {
        context.fillStyle = 'black';
        context.font = `${GAME_OVER_MESSAGE_SIZE}px Arial`;
        const { width: gameOverMessageWidth } = context.measureText(GAME_OVER_MESSAGE);
        context.fillText(GAME_OVER_MESSAGE, (FIELD_WIDTH - gameOverMessageWidth)/2, FIELD_HEIGHT/4);

        if(game.winner) {
          context.font = `${GAME_OVER_MESSAGE_SIZE - 10}px Arial`;
          const winnerMessage = `${game.winner.name} wins`;
          const { width: winnerMessageWidth } = context.measureText(winnerMessage);
          context.fillText(winnerMessage, (FIELD_WIDTH - winnerMessageWidth)/2, FIELD_HEIGHT/4 + GAME_OVER_MESSAGE_SIZE + 10);
        }
      }
    }
  };
}
