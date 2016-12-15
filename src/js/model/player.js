import { generateToken, PressedKeys } from 'utils';
import { Snake } from 'model';

let nextId = 0;

export default function Player({
  id = nextId++,
  name,
  hasWon = false,
  ping = NaN,
  pressedKeys = new PressedKeys(),
  snake = Snake.create(),
  socket,
  token = generateToken()
}) {
  let lastPing = null;

  return {
    get id() {
      return id;
    },

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

    set ping(value) {
      ping = value;
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
      id = json[0];
      name = json[1];
      hasWon = Boolean(json[2]);
      ping = json[3];
      pressedKeys.fromJSON(json[4]);
      snake.fromJSON(json[5]);
    },

    toJSON() {
      return [
        id,
        name,
        hasWon ? 1 : 0,
        ping,
        pressedKeys.toJSON(),
        snake.toJSON()
      ];
    }
  };
}
