import { generateToken, PressedKeys } from 'utils';
import { Snake } from 'model';

export default function Player({
  name,
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

    registerPing() {
      lastPing = Number(new Date());
    },

    registerPong() {
      ping = Number(new Date()) - lastPing;
    },

    fromJSON(json) {
      name = json.name;
      ping = json.ping;
      pressedKeys.fromJSON(json.pressedKeys);
      snake.fromJSON(json.snake);
    },

    toJSON() {
      return {
        name,
        ping,
        pressedKeys: pressedKeys.toJSON(),
        snake: snake.toJSON()
      };
    }
  };
}
