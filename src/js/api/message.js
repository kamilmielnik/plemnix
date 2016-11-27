export default function Message({ type, /*timestamp, */payload }) {
  return {
    serialize() {
      return JSON.stringify({
        type,
        /*timestamp,*/
        payload
      });
    }
  };
}

Message.deserialize = stringified => new Message(JSON.parse(stringified));
