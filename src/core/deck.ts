import { Tile, TileFeng, TileFengNumber, TileJian, TileJianNumber, TileNormal, TileNormalType, TileNumber, TileType } from './tile';

const genDeck = () => {
  const deck: Tile[] = [];

  for (let repeat = 0; repeat < 4; repeat += 1) {
    const normalTypes: TileNormalType[] = [
      TileType.Wan,
      TileType.Tong,
      TileType.Tiao,
    ];

    normalTypes.forEach((type) => {
      const normalTiles: TileNormal[] = [
        TileNumber.One,
        TileNumber.Two,
        TileNumber.Three,
        TileNumber.Four,
        TileNumber.Five,
        TileNumber.Six,
        TileNumber.Seven,
        TileNumber.Eight,
        TileNumber.Nine, 
      ].map(number => ({
        type,
        number,
      }));

      deck.push(...normalTiles);
    });

    const fengTiles: TileFeng[] = [
      TileFengNumber.Dong,
      TileFengNumber.Nan,
      TileFengNumber.Xi,
      TileFengNumber.Bei,
    ].map(number => ({
      type: TileType.Feng,
      number,
    }));

    deck.push(...fengTiles);

    const jianTiles: TileJian[] = [
      TileJianNumber.Zhong,
      TileJianNumber.Fa,
      TileJianNumber.Bai,
    ].map(number => ({
      type: TileType.Jian,
      number,
    }));

    deck.push(...jianTiles);
  }

  const shuffledDeck = shuffle(deck);

  return shuffledDeck;
};

export class Deck {
  tiles: Tile[] = [];
  constructor() {
    this.tiles = genDeck();
  }

  draw(count = 1) {
    return this.tiles.splice(0, count);
  }
}


export const shuffle = <T,>(arr: T[]): T[] => {
  const shuffled = arr.slice();
  for (let i = 0; i < shuffled.length; i++) {
    const random = Math.random() * (shuffled.length - i) | 0;
    const fixed = shuffled.length - i - 1;
    [shuffled[random], shuffled[fixed]] = [shuffled[fixed], shuffled[random]];
  }

  return shuffled;
}

export const tidy = (tiles: Tile[]): Tile[] => {
  const tidied = tiles.slice();
  tidied.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type - b.type;
    }

    return a.number - b.number;
  });

  return tidied;
}
