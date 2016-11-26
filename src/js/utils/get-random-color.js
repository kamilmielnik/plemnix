const colors = [
  '#99b433', '#00a300', '#1e7145', '#ff0097', '#9f00a7', '#7e3878', '#603cba',
  '#1d1d1d', '#00aba9', '#eff4ff', '#2d89ef', '#2b5797', '#ffc40d', '#e3a21a',
  '#da532c', '#ee1111', '#b91d47'
];

export default function getRandomColor() {
  const colorIndex = Math.ceil(Math.random() * colors.length);
  return colors[colorIndex];
}
