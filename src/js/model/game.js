import { Fruit, Player } from 'model';

export default function Game() {
  let players = {};
  let isRunning = false;
  const fruit = Fruit.create();

  return {
    get fruit() {
      return fruit;
    },

    get isRunning() {
      return isRunning;
    },

    get players() {
      return players;
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
      if (isRunning) {
        handleKeyboardInput();
        moveSnakes();
        handleFruitCollisions();
        handleSnakesCollisions();
        handleGameEnd();
      }
    },

    stepServer() {
      this.step();
      if(fruit.hasBeenEaten) {
        fruit.revive();
      }
    },

    start() {
      isRunning = true;
    },

    stop() {
      isRunning = false;
    },

    reset() {
      this.stop();
      do {
        Object.values(players).forEach((player) => player.reset());
        handleSnakesCollisions();
      } while (Object.values(players).some(({ isAlive }) => !isAlive));
      fruit.reset();
    },

    fromJSON(json) {
      fruit.fromJSON(json.fruit);
      const serverPlayers = Object.keys(json.players);
      const clientPlayers = Object.keys(players).filter(token => serverPlayers.includes(token));
      const newPlayers = serverPlayers.filter(token => !clientPlayers.includes(token));

      const updatedPlayers = {};
      clientPlayers.forEach(token => {
        players[token].fromJSON(json.players[token]);
        updatedPlayers[token] = players[token];
      });
      newPlayers.forEach(token => {
        updatedPlayers[token] = new Player({
          name: json.players[token].name
        });
        updatedPlayers[token].fromJSON(json.players[token]);
      });

      players = updatedPlayers;
      isRunning = json.isRunning;
    },

    toJSON() {
      return {
        fruit: fruit.toJSON(),
        isRunning,
        players: Object.keys(players).reduce((json, key) => ({
          ...json,
          [key]: players[key].toJSON()
        }), {})
      };
    }
  };

  function handleKeyboardInput() {
    Object.values(players).forEach(player => {
      const { pressedKeys, snake } = player;

      if(pressedKeys.isPressed('ArrowLeft')) {
        snake.turnLeft();
      }

      if(pressedKeys.isPressed('ArrowRight')) {
        snake.turnRight();
      }
    });
  }

  function moveSnakes() {
    Object.values(players).forEach(({ snake }) => snake.step());
  }

  function handleFruitCollisions() {
    if(fruit.hasBeenEaten) {
      return;
    }

    Object.values(players).forEach(player => {
      const { snake } = player;
      if(fruit.collidesWithSnakeHead(snake)) {
        snake.eatFruit(fruit);
        fruit.hasBeenEaten = true;
      }
    });
  }

  function handleSnakesCollisions() {
    Object.values(players).forEach(({ snake }) => {
      Object.values(players).forEach(player => {
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
    isRunning = isEnoughPlayersAlive;
  }
}
