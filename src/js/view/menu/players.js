export default function PlayersView() {
  const playersNode = document.getElementById('players');

  return {
    paint(players = {}) {
      const documentFragment = document.createDocumentFragment();
      documentFragment.appendChild(createHeaderRow());
      Object.values(players)
        .sort((player1, player2) => {
          if(player1.isAlive && !player2.isAlive) {
            return -1;
          }
          if(!player1.isAlive && player2.isAlive) {
            return 1;
          }
          return player2.score - player1.score;
        })
        .forEach(player => {
          const playerRow = createPlayerRow(player);
          documentFragment.appendChild(playerRow);
        });

      playersNode.innerHTML = '';
      playersNode.appendChild(documentFragment);
    }
  };

  function createHeaderRow() {
    const headerRow = createPlayerRow({
      isAlive: true,
      name: 'Name',
      ping: 'Ping',
      score: 'Score'
    });
    headerRow.classList.add('header');
    return headerRow;
  }

  function createPlayerRow(player) {
    const playerRow = document.createElement('div');
    playerRow.classList.add('player');
    playerRow.appendChild(createPingNode(player));
    playerRow.appendChild(createColorNode(player));
    playerRow.appendChild(createNameNode(player));
    playerRow.appendChild(createScoreNode(player));
    return playerRow;
  }

  function createPingNode({ ping }) {
    const pingNode = document.createElement('div');
    pingNode.classList.add('ping');
    pingNode.textContent = ping || '?';
    return pingNode;
  }

  function createColorNode({ color }) {
    const colorNode = document.createElement('div');
    colorNode.classList.add('color');
    colorNode.style.backgroundColor = color;
    return colorNode;
  }

  function createNameNode({ isAlive, name }) {
    const nameNode = document.createElement('div');
    nameNode.classList.add('name');
    if(!isAlive) {
      nameNode.classList.add('dead');
    }
    nameNode.textContent = name;
    return nameNode;
  }

  function createScoreNode({ score }) {
    const scoreNode = document.createElement('div');
    scoreNode.classList.add('score');
    scoreNode.textContent = score;
    return scoreNode;
  }
}
