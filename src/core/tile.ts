
export enum TileType {
  Wan = 1, // 万
  Tong, // 筒
  Tiao, // 条
  Feng, // 风牌：东、南、西、北
  Jian, // 箭牌：中、发、白
}

export type TileNormalType = TileType.Wan | TileType.Tong | TileType.Tiao;

export interface TileNormal {
  number: TileNumber,
  type: TileNormalType,
}

export interface TileFeng {
  number: TileFengNumber,
  type: TileType.Feng,
}

export interface TileJian {
  number: TileJianNumber,
  type: TileType.Jian,
}

export enum TileNumber {
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
}

export enum TileFengNumber {
  Dong = 1,
  Nan = 3,
  Xi = 5,
  Bei = 7,
}

export enum TileJianNumber {
  Zhong = 1,
  Fa = 3,
  Bai = 5,
}

export type Tile = TileNormal | TileFeng | TileJian;

export const getTileName = (tile: Tile) => {
  switch (tile.type) {
    case TileType.Wan:
      return `${tile.number}万`;
    case TileType.Tong:
      return `${tile.number}筒`;
    case TileType.Tiao:
      return `${tile.number}条`;
    case TileType.Feng:
      return getFengName(tile.number);
    case TileType.Jian:
      return getJianName(tile.number);
  }
}

const getFengName = (number: number) => {
  switch (number) {
    case TileFengNumber.Dong:
      return '东';
    case TileFengNumber.Nan:
      return '南';
    case TileFengNumber.Xi:
      return '西';
    case TileFengNumber.Bei:
      return '北';
    default:
      throw new Error(`invalid feng number: ${number}`);
  }
}

const getJianName = (number: number) => {
  switch (number) {
    case TileJianNumber.Zhong:
      return '中';
    case TileJianNumber.Fa:
      return '发';
    case TileJianNumber.Bai:
      return '白';
      default:
        throw new Error(`invalid jian number: ${number}`);
  }
}
