export default function Message({ type, token, payload }) {
  return {
    serialize() {
      return JSON.stringify({
        type,
        token,
        payload
      });
    }
  };
}

Message.deserialize = stringified => new Message(JSON.parse(stringified));
