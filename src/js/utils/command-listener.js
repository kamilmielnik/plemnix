export default function CommandListener(key, command) {
  return {
    attach() {
      window.addEventListener('keydown', listener);
    },

    detach() {
      window.removeEventListener('keydown', listener);
    }
  };

  function listener(event) {
    if (key === event.key) {
      command();
    }
  }
};
