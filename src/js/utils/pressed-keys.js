export default function PressedKeys() {
  let keys = {};

  return {
    isPressed(key) {
      return Boolean(keys[key]);
    },

    press(key) {
      keys[key] = true;
    },

    release(key) {
      keys[key] = false;
    },

    fromJSON(json) {
      keys = json;
    },

    toJSON() {
      return keys;
    }
  };
}

PressedKeys.nullListener = {
  isPressed: () => false,
  press: () => undefined,
  release: () => undefined
};
