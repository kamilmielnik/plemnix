const MESSAGE_LIMIT = 50;

export default function Chat({ messages = [] } = {}) {
  return {
    get messages() {
      return messages;
    },

    say(who, what) {
      const message = `${who}: ${what}`;
      messages.push(message);
      const numberOfExpiredMessages = messages.length - MESSAGE_LIMIT;
      messages = messages.slice(numberOfExpiredMessages);
    },

    fromJSON(json) {
      messages = json;
    },

    toJSON() {
      return messages;
    }
  };
}
