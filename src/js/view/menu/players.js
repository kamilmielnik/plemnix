import { FRUIT_RADIUS } from 'constants';

export default function PlayersView() {
  const playersNode = document.getElementById('players');

  return {
    paint(players = {}) {
      const documentFragment = document.createDocumentFragment();
      documentFragment.appendChild(createHeaderRow())
      const playersRows = Object.values(players).forEach((player) => {
        const playerRow = createPlayerRow(player);
        documentFragment.appendChild(playerRow);
      });

      playersNode.innerHTML = '';
      playersNode.appendChild(documentFragment);
    }
  };

  function createHeaderRow() {
    const headerRow = createPlayerRow({
      name: 'Name',
      ping: 'Ping',
      score: 'Score'
    });
    headerRow.classList.add('header');
    return headerRow;
  }

  function createPlayerRow({ color, name, ping, score }) {
    const playerRow = document.createElement('div');
    playerRow.classList.add('player');
    playerRow.appendChild(createPingNode(ping));
    playerRow.appendChild(createColorNode(color));
    playerRow.appendChild(createNameNode(name));
    playerRow.appendChild(createScoreNode(score));
    return playerRow;
  }

  function createPingNode(ping) {
    const pingNode = document.createElement('div');
    pingNode.classList.add('ping');
    pingNode.textContent = ping || '?';
    return pingNode;
  }

  function createColorNode(color) {
    const colorNode = document.createElement('div');
    colorNode.classList.add('color');
    colorNode.style.backgroundColor = color;
    return colorNode;
  }

  function createNameNode(name) {
    const nameNode = document.createElement('div');
    nameNode.classList.add('name');
    nameNode.textContent = name;
    return nameNode;
  }

  function createScoreNode(score) {
    const scoreNode = document.createElement('div');
    scoreNode.classList.add('score');
    scoreNode.textContent = score;
    return scoreNode;
  }
}
