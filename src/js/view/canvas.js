export default function CanvasView({ id, width, height }) {
  const canvas = document.getElementById(id);
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  const views = [];

  return {
    addView: view => views.push(view),
    paint: function paint() {
      context.clearRect(0, 0, width, height);
      views.forEach(view => view.paint(context));
      window.requestAnimationFrame(paint);
    }
  };
}
