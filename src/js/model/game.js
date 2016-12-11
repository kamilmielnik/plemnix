import {
  MIN_FRUIT_REGENERATE_TIMEOUT,
  MAX_FRUIT_REGENERATE_TIMEOUT,
  WINNING_POINTS_TRESHOLD
} from '../constants';
import { Fruit, Player } from 'model';

export default function Game() {
  let isOver = true;
  let isRunning = false;
  let hasStarted = false;
  let players = {};
  let fruits = [Fruit.create()];
  let addFruitTimeout = null;

  return {
    get fruits() {
      return fruits;
    },

    get isOver() {
      return isOver;
    },

    get hasStarted() {
      return hasStarted;
    },

    get isRunning() {
      return isRunning;
    },

    get players() {
      return players;
    },

    get winner() {
      return Object.values(players).find((player) => player.hasWon);
    },

    addPlayer(token, player) {
      players[token] = player;
    },

    deletePlayer(token) {
      Reflect.deleteProperty(players, token);
    },

    ping(token) {
      players[token].registerPing();
    },

    pong(token) {
      players[token].registerPong();
    },

    pressKey(token, key) {
      const player = players[token];
      player.pressedKeys.press(key);
    },

    releaseKey(token, key) {
      const player = players[token];
      player.pressedKeys.release(key);
    },

    forEachPlayer(callback) {
      Object.values(players).forEach(callback);
    },

    step() {
      if(isRunning) {
        handleKeyboardInput();
        moveSnakes();
        handleFruitsCollisions();
        handleSnakesCollisions();
        handleGameEnd();
      }
    },

    stepServer() {
      this.step();
    },

    start() {
      this.startClient();
      addFruitTimeout = setTimeout(addFruit);
    },

    startClient() {
      isRunning = true;
      hasStarted = true;
      isOver = false;
    },

    stop() {
      isRunning = false;
      clearTimeout(addFruitTimeout);
    },

    reset() {
      isRunning = false;
      hasStarted = false;
      isOver = true;
      do {
        Object.values(players).forEach((player) => player.reset());
        handleSnakesCollisions();
      } while (Object.values(players).some(({ isAlive }) => !isAlive));
      clearTimeout(addFruitTimeout);
      fruits = [Fruit.create()];
    },

    fromJSON(json) {
      fruits = json.fruits.map((fruit) => new Fruit(fruit));
      const serverPlayers = Object.keys(json.players);
      const clientPlayers = Object.keys(players).filter((token) => serverPlayers.includes(token));
      const newPlayers = serverPlayers.filter((token) => !clientPlayers.includes(token));

      const updatedPlayers = {};
      clientPlayers.forEach((token) => {
        players[token].fromJSON(json.players[token]);
        updatedPlayers[token] = players[token];
      });
      newPlayers.forEach((token) => {
        updatedPlayers[token] = new Player({
          name: json.players[token].name
        });
        updatedPlayers[token].fromJSON(json.players[token]);
      });

      players = updatedPlayers;
      isOver = json.isOver;
      isRunning = json.isRunning;
      hasStarted = json.hasStarted;
    },

    toJSON() {
      return {
        fruits: fruits.map((fruit) => fruit.toJSON()),
        isOver,
        isRunning,
        hasStarted,
        players: Object.keys(players).reduce((json, key) => ({
          ...json,
          [key]: players[key].toJSON()
        }), {})
      };
    }
  };

  function getWinner() {
    if(!hasStarted) {
      return null;
    }

    const alivePlayers = Object.values(players).filter(({ isAlive }) => isAlive);
    alivePlayers.sort((a, b) => a.score < b.score);
    return alivePlayers[0];
  }

  function handleKeyboardInput() {
    Object.values(players).forEach((player) => {
      const { pressedKeys, snake } = player;

      if(pressedKeys.isPressed('ArrowLeft')) {
        snake.turnLeft();
      }

      if(pressedKeys.isPressed('ArrowRight')) {
        snake.turnRight();
      }
    });
  }

  function addFruit() {
    if(__SERVER__) {
      fruits.push(Fruit.create());
      const timeout = (MAX_FRUIT_REGENERATE_TIMEOUT - MIN_FRUIT_REGENERATE_TIMEOUT) * Math.random() + MIN_FRUIT_REGENERATE_TIMEOUT;
      clearTimeout(addFruitTimeout);
      addFruitTimeout = setTimeout(addFruit, timeout);
    }
  }

  function moveSnakes() {
    Object.values(players).forEach(({ snake }) => snake.step());
  }

  function handleFruitsCollisions() {
    fruits
      .filter(({ hasBeenEaten }) => !hasBeenEaten)
      .forEach((fruit) => {
        Object.values(players).forEach((player) => {
          const { snake } = player;
          if(fruit.collidesWithSnakeHead(snake)) {
            snake.eatFruit(fruit);
            fruit.hasBeenEaten = true;
          }
        });
      });

    fruits = fruits.filter(({ hasBeenEaten }) => !hasBeenEaten);
    if(fruits.length === 0) {
      addFruit();
    }
  }

  function handleSnakesCollisions() {
    Object.values(players).forEach(({ snake }) => {
      Object.values(players).forEach((player) => {
        if(snake.hasCrashedIntoSnake(player.snake)) {
          snake.kill();
        }
      });
    });
  }

  function handleGameEnd() {
    const numberOfPlayers = Object.values(players).length;
    const numberOfAlivePlayers = Object.values(players).filter(({ isAlive }) => isAlive).length;
    const isEnoughPlayersAlive = [
      numberOfPlayers === 1 && numberOfAlivePlayers === 1,
      numberOfAlivePlayers > 1
    ].some(Boolean);

    const highestScore = Object.values(players).reduce(
      (maxPoints, { score }) => Math.max(maxPoints, score),
      0
    );

    isRunning = isEnoughPlayersAlive && highestScore < WINNING_POINTS_TRESHOLD;
    isOver = !isRunning;
    const winner = getWinner();
    if(isOver) {
      clearTimeout(addFruitTimeout);
    }
    if(winner) {
      winner.setAsWinner();
    }
  }
}
