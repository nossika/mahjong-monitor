import { Tile, TilesShape, tilesToShape } from '@/core/tile';


/**
 * 根据所有可能的“将牌”，组合出迭代器
 * 
 * “将牌”指 2 张一样的牌
 */
const jiangCombinationGenerator = function* (shape: TilesShape): Generator<{
  key: string,
  shape: TilesShape,
}> {
  const tileKeys = Object.keys(shape);

  // 将所有可能的“将牌”都加入迭代器
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
  if (!shape[key]) {
    throw new Error(`not enough ${key}`);
  }
  
  shape[key] -= count;
  if (shape[key] <= 0) {
    Reflect.deleteProperty(shape, key);
  }
};

/**
 * 判断是否符合“面子”
 * 
 * “顺子”或“刻子”都称为“面子”
 * “顺子”指 3 张同花色且点数连续的牌
 * “刻子”指 3 张一样的牌
 */
const isTripleShape = (shape: TilesShape): boolean => {
  const loopShape = (shape: TilesShape) => {

    const tileKeys = Object.keys(shape);
    if (!tileKeys.length) return true;
    const minKey = +tileKeys[0];

    /**
     * 优先尝试组成“刻子”， 然后尝试组成“顺子”
     * 因为 key 是排序过的，会先遍历到最小的 key
     * 所以 一种 key “刻子”和“顺子”同时可满足的情况下，必须优先满足“刻子”，否则拿去组“顺子”的话，剩余的两张牌就无法匹配
     */
    if (shape[minKey] >= 3) {
      deleteFromShape(shape, minKey, 3);
    } else {
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

/**
 * 十三幺
 * 条件：存在这 13 张牌，每种花色的 1、9 各 1 张，全部风牌、箭牌各 1 张
 */
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

/**
 * 七小对
 * 条件：全部由“对子”组成（一种牌有 4 张也成立，称为龙七对）
 */
const is7Pairs = (shape: TilesShape) => {
  return Object.values(shape).every(number => number === 2 || number === 4);
}

/**
 * 判断牌型（shape）是否可胡
 * 1、尝试匹配特殊胡法：十三幺、七小对
 * 2、尝试匹配正常胡法：一对“将牌”，且剩余牌可全部组成”面子“
 */
export const canHuShape = (shape: TilesShape): boolean => {
  switch (true) {
    case is13Yao(shape):
    case is7Pairs(shape):
      return true;
    default:
  }

  // 计算牌型中所有可能的“将牌”，组成迭代器
  const jiangCombination = jiangCombinationGenerator(shape);

  // 对各种将牌下的牌型判断，剩余牌是否可全部组成“面子”
  for (const c of jiangCombination) {
    const ok = isTripleShape(c.shape);
    if (ok) {
      return true;
    }
  }

  return false;
};

/**
 * 判断牌是否可胡
 */
export const canHu = (tiles: Tile[]): boolean => {
  const shape = tilesToShape(tiles);
  return canHuShape(shape);
};
