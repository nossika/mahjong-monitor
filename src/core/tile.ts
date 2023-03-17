export enum TileType {
  Wan = 1,
  Tong,
  Tiao,
  Feng,
  Jian,
}

export interface TileNormal {
  number: TileNumber,
  type: TileType,
}

export interface TileFeng {
  number: TileFengNumber,
  type: TileType,
}

export interface TileJian {
  number: TileJianNumber,
  type: TileType,
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
      return `wan${tile.number}`;
    case TileType.Tong:
      return `tong${tile.number}`;
    case TileType.Tiao:
      return `tiao${tile.number}`;
    case TileType.Feng:
      return getFengName(tile.number);
    case TileType.Jian:
      return getJianName(tile.number);
  }
}

const getFengName = (number: number) => {
  switch (number) {
    case TileFengNumber.Dong:
      return 'dong';
    case TileFengNumber.Nan:
      return 'nan';
    case TileFengNumber.Xi:
      return 'xi';
    case TileFengNumber.Bei:
      return 'bei';
    default:
      throw new Error(`invalid feng number: ${number}`);
  }
}

const getJianName = (number: number) => {
  switch (number) {
    case TileJianNumber.Zhong:
      return 'zhong';
    case TileJianNumber.Fa:
      return 'fa';
    case TileJianNumber.Bai:
      return 'bai';
      default:
        throw new Error(`invalid jian number: ${number}`);
  }
}