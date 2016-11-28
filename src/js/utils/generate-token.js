export default function generateToken() {
  const now = new Date().valueOf();
  return Number(now).toString(32);
}
