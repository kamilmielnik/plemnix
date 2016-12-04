import { generateToken, PressedKeys } from 'utils';
import { Snake } from 'model';

export default function Player({
  name,
  pressedKeys = new PressedKeys(),
  snake = new Snake(),
  socket,
  token = generateToken()
}) {
  return {
    get name() {
      return name;
    },

    get snake() {
      return snake;
    },

    get pressedKeys() {
      return pressedKeys;
    },

    get socket() {
      return socket;
    },

    get token() {
      return token;
    },

    fromJSON(json) {
      name = json.name;
      pressedKeys.fromJSON(json.pressedKeys);
      snake.fromJSON(json.snake);
    },

    toJSON() {
      return {
        name,
        pressedKeys: pressedKeys.toJSON(),
        snake: snake.toJSON()
      };
    }
  };
}
