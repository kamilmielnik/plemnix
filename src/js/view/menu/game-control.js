export default function GameControlView({ onStartStopGame, onResetGame }) {
  const startStopNode = document.getElementById('game-control-start-stop');
  const resetNode = document.getElementById('game-control-reset');

  startStopNode.addEventListener('click', onStartStopGame);
  resetNode.addEventListener('click', onResetGame);

  return {
    paint(isRunning) {
      startStopNode.textContent = isRunning ? 'Stop' : 'Start';
    }
  };
}
