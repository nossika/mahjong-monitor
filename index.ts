import { Deck, tidy } from '@/core/deck';
import { canHu } from '@/core/judge';
import { getTileName } from '@/core/tile';
import logger from '@/util/logger';

const tryGenHuShape = () => {
  const deck = new Deck();
  const hand = deck.draw(14);
  return canHu(hand) ? hand : null;
}

let count = 0;

while (true) {
  count += 1;
  const huHand = tryGenHuShape();
  logger.log('try count', count);
  if (huHand) {
    logger.log(
      'hu!',
      '---',
      tidy(huHand).map(tile => getTileName(tile)),
    );
    break;
  }
}
