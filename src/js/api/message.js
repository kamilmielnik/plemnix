export default function Message({ type, token, /*timestamp, */payload }) {
  return {
    serialize() {
      return JSON.stringify({
        type,
        token,
        /*timestamp,*/
        payload
      });
    }
  };
}

Message.deserialize = stringified => new Message(JSON.parse(stringified));
