import { Fruit, Player } from 'model';

export default function Game() {
  let players = {};
  const fruit = Fruit.create();

  return {
    get fruit() {
      return fruit;
    },

    get players() {
      return players;
    },

    addPlayer(token, player) {
      players[token] = player;
    },

    deletePlayer(token) {
      delete players[token];
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
      handleKeyboardInput();
      moveSnakes();
      handleFruitCollisions();
      handleSnakesCollisions();
    },

    fromJSON(json) {
      fruit.fromJSON(json.fruit);
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
    },

    toJSON() {
      return {
        fruit: fruit.toJSON(),
        players: Object.keys(players).reduce((json, key) => ({
          ...json,
          [key]: players[key].toJSON()
        }), {})
      };
    }
  };

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

  function moveSnakes() {
    Object.values(players).forEach(({ snake }) => snake.step());
  }

  function handleFruitCollisions() {
    if(fruit.hasBeenEaten) {
      return;
    }

    Object.values(players).forEach((player) => {
      const { snake } = player;
      if(fruit.collidesWithSnakeHead(snake)) {
        snake.eatFruit(fruit);
        fruit.hasBeenEaten = true;
      }
    });
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
}
