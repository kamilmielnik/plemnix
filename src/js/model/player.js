import { generateToken, PressedKeysListener } from 'utils';
import { Snake } from 'model';

export default function Player({ name, snake = new Snake(), socket }) {
  const token = generateToken();

  return {
    get name() {
      return name;
    },

    get snake() {
      return snake;
    },

    token,
    pressedKeys: new PressedKeysListener(),
    socket,

    fromJSON(json) {
      name = json.name;
      snake.fromJSON(json.snake);
    },

    toJSON() {
      return {
        name,
        snake: snake.toJSON()
      };
    }
  };
}
