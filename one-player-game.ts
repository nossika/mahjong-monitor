import { Deck } from '@/core/deck';
import { Game } from '@/core/game';
import { Player } from '@/core/player';

export const startOnePlayerGame = () => {
  const game = new Game();
  const player = new Player(Date.now());
  game.playerJoin(player);
  game.start();
};