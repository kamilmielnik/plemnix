export default function KeysListener() {
  const keys = {};

  return {
    isPressed: key => Boolean(keys[key]),

    attach() {
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
    },

    detach() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    }
  };

  function onKeyDown(event) {
    const { key } = event;
    keys[key] = true;
  }

  function onKeyUp(event) {
    const { key } = event;
    keys[key] = false;
  }
}

KeysListener.nullKeysListener = {
  isPressed: () => false,
  attach: () => undefined,
  detach: () => undefined
};
