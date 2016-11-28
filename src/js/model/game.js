import { Player } from 'model';

export default function Game() {
  let players = {};

  return {
    addPlayer(token, player) {
      players[token] = player;
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
      Object.values(players).forEach((player) => {
        const { pressedKeys, snake } = player;

        if(pressedKeys.isPressed('ArrowLeft')) {
          snake.turnLeft();
        }

        if(pressedKeys.isPressed('ArrowRight')) {
          snake.turnRight();
        }

        snake.step();
      });
    },

    fromJSON(json) {
      const serverPlayers = Object.keys(json);
      const clientPlayers = Object.keys(players).filter((token) => serverPlayers.includes(token));
      const newPlayers = serverPlayers.filter((token) => !clientPlayers.includes(token));

      const updatedPlayers = {};
      clientPlayers.forEach((token) => {
        players[token].fromJSON(json[token]);
      });
      newPlayers.forEach((token) => {
        updatedPlayers[token] = new Player(json[token].name);
        updatedPlayers[token].fromJSON(json[token]);
      });

      players = updatedPlayers;
    },

    toJSON() {
      return Object.keys(players).reduce((json, key) => {
        json[key] = players[key].toJSON();
        return json;
      }, {});
    }
  };
}
