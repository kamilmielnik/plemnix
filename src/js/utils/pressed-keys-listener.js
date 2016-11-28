export default function PressedKeysListener() {
  const keys = {};

  return {
    isPressed: key => Boolean(keys[key]),
    press: (key) => keys[key] = true,
    release: (key) => keys[key] = false
  };
}

PressedKeysListener.nullListener = {
  isPressed: () => false,
  press: () => undefined,
  release: () => undefined
};
