const colors = [
  '#1e7145', '#ff0097', '#9f00a7', '#603cba', '#1d1d1d', '#00aba9', '#2d89ef', '#ffc40d', '#ee1111'
];

const generator = getColor();

export default function getRandomColor() {
  return generator.next().value;
}

function *getColor() {
  let index = 0;

  while (true) {
    yield colors[index++ % colors.length];
  }
}
