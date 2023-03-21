import { Tile, TileNumber, TileType } from '@/core/tile';

interface TilesShape {
  [tileKey: number]: number,
}

export const tilesToShape = (tiles: Tile[]): TilesShape => {
  const shape: TilesShape = Object.create(null);

  tiles.forEach(t => {
    const tileKey = `${t.type}${t.number}`;
    if (!shape[tileKey]) {
      shape[tileKey] = 0;
    }

    shape[tileKey] += 1;
  });

  return shape;
}

export const tileKeyToTile = (tileKey: string): Tile => {
  const [typeStr, numberStr] = tileKey.split('');

  const type: TileType = +typeStr;
  if (!(type in TileType)) throw new Error(`invalid TileType: ${type}`);

  const number: TileNumber = +numberStr;
  if (!(number in TileNumber)) throw new Error(`invalid TileNumber: ${type}`);

  return {
    type,
    number,
  } as Tile;
}

export const shapeToTiles = (shape: TilesShape): Tile[] => {
  const tiles: Tile[] = [];

  for (const [tileKey, count] of Object.entries(shape)) {
    const tile = tileKeyToTile(tileKey);
    for (let i = 0; i < count; i += 1) {
      tiles.push(tile);
    }
  }

  return tiles;
};


const jiangCombinationGenerator = function* (shape: TilesShape): Generator<{
  key: string,
  shape: TilesShape,
}> {
  const tileKeys = Object.keys(shape);
  for (const tileKey of tileKeys) {
    if (shape[tileKey] >= 2) {
      const jiangKey = tileKey;
      const shapeCopy: TilesShape = JSON.parse(JSON.stringify(shape));
      deleteFromShape(shapeCopy, jiangKey, 2);

      yield {
        key: jiangKey,
        shape: shapeCopy,
      }
    }
  }
}

const deleteFromShape = (shape: TilesShape, key: string | number, count: number) => {
  shape[key] -= count;
  if (shape[key] <= 0) {
    Reflect.deleteProperty(shape, key);
  }
};

const isTripleShape = (shape: TilesShape): boolean => {
  const loopShape = (shape: TilesShape) => {

    const tileKeys = Object.keys(shape);
    if (!tileKeys.length) return true;
    const minKey = +tileKeys[0];
    if (shape[minKey] >= 3) {
      // try kezi
      deleteFromShape(shape, minKey, 3);
    } else {
      // try shunzi
      for (const key of [minKey, minKey + 1, minKey + 2]) {
        if (!(shape[key] > 0)) return false;
        deleteFromShape(shape, key, 1);
      }
    }

    return loopShape(shape);
  }

  const shapeCopy: TilesShape = JSON.parse(JSON.stringify(shape));

  return loopShape(shapeCopy);
};

const is13Yao = (shape: TilesShape) => {
  return [
    '11',
    '19',
    '21',
    '29',
    '31',
    '39',
    '41',
    '43',
    '45',
    '47',
    '51',
    '53',
    '55',
  ].every(key => shape[key] >= 1);
}

const is7Pairs = (shape: TilesShape) => {
  return Object.values(shape).every(number => number === 2);
}

const matchHuShape = (shape: TilesShape) => {
  switch (true) {
    case is13Yao(shape):
    case is7Pairs(shape):
    case isTripleShape(shape):
      return true;
    default:
      return false;
  }
};

export const canHu = (shape: TilesShape): boolean => {
  switch (true) {
    case is13Yao(shape):
    case is7Pairs(shape):
      return true;
    default:
  }

  const jiangCombination = jiangCombinationGenerator(shape);

  for (const c of jiangCombination) {
    const ok = isTripleShape(c.shape);
    if (ok) {
      return true;
    }
  }

  return false;
};
