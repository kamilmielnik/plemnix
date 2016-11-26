export default function Point({ x, y }) {
  return {
    get x() {
      return x;
    },

    get y() {
      return y;
    }
  };
}
