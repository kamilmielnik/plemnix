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
      keys = {};
      json.forEach((key) => {
        keys[key] = true;
      });
    },

    toJSON() {
      return Object.keys(keys).filter((key) => keys[key]);
    }
  };
}

PressedKeys.nullListener = {
  isPressed: () => false,
  press: () => undefined,
  release: () => undefined
};
