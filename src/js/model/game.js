import {
  MIN_FRUIT_REGENERATE_TIMEOUT,
  MAX_FRUIT_REGENERATE_TIMEOUT,
  WINNING_POINTS_TRESHOLD
} from '../constants';
import { Fruit, Player } from 'model';

export default function Game({ onAddFruit } = {}) {
  let isOver = true;
  let isRunning = false;
  let hasStarted = false;
  let players = {};
  let fruits = __SERVER__ ? [Fruit.create()] : [];
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

    addFruits(newFruits) {
      newFruits.forEach((fruit) => fruits.push(fruit));
    },

    deleteFruits(eatenFruitsIds) {
      fruits = fruits.filter(({ id }) => !eatenFruitsIds.includes(id));
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
      addFruitTimeout = setTimeout(addFruit, getRandomFruitTimeout(0, MAX_FRUIT_REGENERATE_TIMEOUT / 2));
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
      fruits = __SERVER__ ? [Fruit.create()] : [];
    },

    fromJSON(json) {
      fruits = json[0].map(Fruit.fromJSON);
      const serverPlayers = Object.keys(json[4]);
      const clientPlayers = Object.keys(players).filter((id) => serverPlayers.includes(id));
      const newPlayers = serverPlayers.filter((id) => !clientPlayers.includes(id));

      const updatedPlayers = {};
      clientPlayers.forEach((id) => {
        players[id].fromJSON(json[4][id]);
        updatedPlayers[id] = players[id];
      });
      newPlayers.forEach((id) => {
        updatedPlayers[id] = new Player({
          id: json[4][id][0],
          name: json[4][id][1]
        });
        updatedPlayers[id].fromJSON(json[4][id]);
      });

      players = updatedPlayers;
      isOver = json[1] === 1 ? true : false;
      isRunning = json[2] === 1 ? true : false;
      hasStarted = json[3] === 1 ? true : false;
    },

    toJSON() {
      return [
        fruits.map((fruit) => fruit.toJSON()),
        isOver ? 1 : 0,
        isRunning ? 1 : 0,
        hasStarted ? 1 : 0,
        Object.keys(players).reduce((json, key) => ({
          ...json,
          [players[key].id]: players[key].toJSON()
        }), {})
      ];
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
      const fruit = Fruit.create();
      fruits.push(fruit);
      clearTimeout(addFruitTimeout);
      addFruitTimeout = setTimeout(addFruit, getRandomFruitTimeout());
      onAddFruit(fruit);
    }
  }

  function getRandomFruitTimeout(min = MIN_FRUIT_REGENERATE_TIMEOUT, max = MAX_FRUIT_REGENERATE_TIMEOUT) {
    return (max - min) * Math.random() + min;
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
    Object.values(players).forEach((player) => player.setAsLoser());
    if(winner) {
      winner.setAsWinner();
    }
  }
}
