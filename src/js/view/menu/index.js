import PlayersView from './players';

export default function MenuView(game) {
  const playersView = new PlayersView();

  return {
    paint() {
      playersView.paint(game.players);
    }
  };
}
