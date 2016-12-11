import { generateToken, PressedKeys } from 'utils';
import { Snake } from 'model';

export default function Player({
  name,
  hasWon = false,
  ping = NaN,
  pressedKeys = new PressedKeys(),
  snake = new Snake(),
  socket,
  token = generateToken()
}) {
  let lastPing = null;

  return {
    get color() {
      return snake.color;
    },

    get isAlive() {
      return snake.isAlive;
    },

    get hasWon() {
      return hasWon;
    },

    get name() {
      return name;
    },

    get ping() {
      return ping;
    },

    get pressedKeys() {
      return pressedKeys;
    },

    get score() {
      return snake.score;
    },

    get snake() {
      return snake;
    },

    get socket() {
      return socket;
    },

    get token() {
      return token;
    },

    setAsWinner() {
      hasWon = true;
    },

    setAsLoser() {
      hasWon = false;
    },

    registerPing() {
      lastPing = Number(new Date());
    },

    registerPong() {
      ping = Number(new Date()) - lastPing;
    },

    reset() {
      pressedKeys = new PressedKeys();
      snake.reset();
      hasWon = false;
    },

    fromJSON(json) {
      name = json.name;
      hasWon = json.hasWon;
      ping = json.ping;
      pressedKeys.fromJSON(json.pressedKeys);
      snake.fromJSON(json.snake);
    },

    toJSON() {
      return {
        name,
        hasWon,
        ping,
        pressedKeys: pressedKeys.toJSON(),
        snake: snake.toJSON()
      };
    }
  };
}
