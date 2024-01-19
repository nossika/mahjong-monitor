import { Deck, tidy } from '@/core/deck';
import { getTileName } from '@/core/tile';
import { canHu } from '@/util/judge';
import logger from '@/util/logger';

export const tryGenHuShape = () => {
  const deck = new Deck();
  const hand = deck.draw(14);
  return canHu(hand) ? hand : null;
}

export const autoGenerateHu = () => {
  let count = 0;

  let huHand = null;

  while (!huHand) {
    count += 1;
    huHand = tryGenHuShape();
    logger.log('try count', count);
  };

  logger.log(
    'hu!',
    '---',
    tidy(huHand).map(tile => getTileName(tile)),
  );

  return tidy(huHand);
};

