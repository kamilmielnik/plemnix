import { FruitView, SnakeView } from 'view';
import { FIELD_HEIGHT, FIELD_WIDTH } from 'constants';

const AWAITING_MESSAGE = 'Awaiting players';
const GAME_OVER_MESSAGE = 'Game over';
const PAUSE_MESSAGE = 'Pause';
const LARGE_MESSAGE_SIZE = 48;
const MEDIUM_MESSAGE_SIZE = 38;

export default function GameView(game) {
  const fruitView = new FruitView(game.fruit);

  return {
    paint(context) {
      game.forEachPlayer((player) => {
        const { snake } = player;
        const snakeView = new SnakeView(snake);
        snakeView.paint(context);
      });

      fruitView.paint(context);

      if(game.isOver) {
        if(game.winner) {
          paintGameOverMessage(context);
          paintWinnerMessage(context);
        } else {
          paintAwaitingMessage(context);
        }
      } else if(!game.isRunning) {
        paintPauseMessage(context);
      }
    }
  };

  function paintGameOverMessage(context) {
    context.fillStyle = 'black';
    context.font = `${LARGE_MESSAGE_SIZE}px Arial`;
    const { width: gameOverMessageWidth } = context.measureText(GAME_OVER_MESSAGE);
    context.fillText(GAME_OVER_MESSAGE, (FIELD_WIDTH - gameOverMessageWidth) / 2, FIELD_HEIGHT / 4);
  }

  function paintWinnerMessage(context) {
    context.fillStyle = 'black';
    context.font = `${MEDIUM_MESSAGE_SIZE}px Arial`;
    const winnerMessage = `${game.winner.name} wins`;
    const { width: winnerMessageWidth } = context.measureText(winnerMessage);
    context.fillText(winnerMessage, (FIELD_WIDTH - winnerMessageWidth) / 2, FIELD_HEIGHT / 4 + MEDIUM_MESSAGE_SIZE);
  }

  function paintAwaitingMessage(context) {
    context.fillStyle = 'black';
    context.font = `${LARGE_MESSAGE_SIZE}px Arial`;
    const { width: awaitingMessageWidth } = context.measureText(AWAITING_MESSAGE);
    context.fillText(AWAITING_MESSAGE, (FIELD_WIDTH - awaitingMessageWidth) / 2, FIELD_HEIGHT / 4);
  }

  function paintPauseMessage(context) {
    context.fillStyle = 'black';
    context.font = `${LARGE_MESSAGE_SIZE}px Arial`;
    const { width: pauseMessageWidth } = context.measureText(PAUSE_MESSAGE);
    context.fillText(PAUSE_MESSAGE, (FIELD_WIDTH - pauseMessageWidth) / 2, FIELD_HEIGHT / 4);
  }
}
