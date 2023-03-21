import { genDeck, tidy } from '@/core/deck';
import { canHu, shapeToTiles, tilesToShape } from '@/core/judge';
import logger from '@/util/logger';

const getHuShape = () => {
  const deck = genDeck();
  const hand = tidy(deck.slice(0, 14));
  const shape = tilesToShape(hand);
  return canHu(shape) ? shape : null;
}

getHuShape();

let count = 0;

while (true) {
  count += 1;
  const huShape = getHuShape();
  logger.log('count', count);
  if (huShape) {
    logger.log('hu!', shapeToTiles(huShape), huShape);
    break;
  }
}
