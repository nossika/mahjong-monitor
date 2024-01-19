import { Tile, getTileName, keyToTile, shapeToTiles, tileToKey, tilesToShape } from '@/core/tile';
import { PlayerAction, PlayerActionType, PlayerReaction } from '@/core/game';
import { tidy } from '@/core/deck';
import { wait } from '@/util/time';
import { canHu, canHuShape } from '@/util/judge';
import { select } from '@/util/inquirer';
import logger from '@/util/logger';

export class Player {
  id = 0; // 玩家 ID
  tiles: Tile[] = []; // 手牌
  melds: Tile[][] = []; // 已经组对的明牌（吃/碰/杠的牌）
  drawTile: Tile | null = null;

  constructor(id: number) {
    this.id = id;
  }

  // 行动
  async action(drawTile?: Tile): Promise<PlayerAction> {
    logger.log('Your turn.');
    if (drawTile) {
      logger.log(`Draw tile: ${getTileName(drawTile)}`);
    }
    logger.log(`Your hand tiles: ${this.tiles.map(t => getTileName(t)).join(' ')}`);

    // 可出牌
    const actionTypes = [PlayerActionType.Discard];

    const shape = tilesToShape(this.tiles);

    // 增加可杠选项
    const kongTileKeys = Object
      .entries(shape)
      .filter(([, value]) => value >= 4)
      .map(([key]) => key);
    if (kongTileKeys.length) {
      actionTypes.unshift(PlayerActionType.KongSelf);
    }

    // 增加可胡选项
    if (canHuShape(shape)) {
      actionTypes.unshift(PlayerActionType.HuSelf);
    }

    const type = await select(
      'Your action',
      actionTypes.map(type => ({
        value: type,
        label: type,
      })),
    ) as PlayerActionType;

    const actionTiles: Tile[] = [];

    if (type === PlayerActionType.Discard) {
      const discardTileKey = await select(
        'Discard tile',
        this.tiles.map((t, i) => ({
          value: tileToKey(t),
          label: `${i + 1}) ${getTileName(t)}`,
        })),
        drawTile && tileToKey(drawTile),
      );
      const discardTile = keyToTile(discardTileKey);
      actionTiles.push(discardTile);
    } else if (type === PlayerActionType.KongSelf) {
      const kongTileKey = await select(
        'Kong tile',
        kongTileKeys.map(key => ({
          value: key,
          label: `${getTileName(keyToTile(key))}`,
        })),
      );
      const kongTile = keyToTile(kongTileKey);
      actionTiles.push(kongTile);
    }

    return {
      type,
      playerID: this.id,
      tiles: actionTiles,
    };
  }

  // 响应公共牌
  async reaction(tile: Tile): Promise<PlayerReaction> {
    await wait(1);
    // todo

    return Promise.reject();
  }

  // 初始化
  init(tiles: Tile[]) {
    this.tiles = tiles;
    this.tidy();
  }

  // 摸牌
  draw(tile: Tile) {
    this.drawTile = tile;
    this.tiles.push(tile);
    this.tidy();
  }

  // 出牌
  discard(tile: Tile) {
    const discardIndex = this.tiles.findIndex(t => t.number === tile.number && t.type === tile.type);
    if (discardIndex === -1) {
      throw new Error(`tile not found: ${getTileName(tile)}`);
    }

    this.tiles.splice(discardIndex, 1);
  }

  // 加入组对明牌区（吃/碰/杠的牌）
  makeMelts(selfTiles: Tile[], addtionTile?: Tile) {
    const meltTiles = [...selfTiles, addtionTile];
    this.melds.push(meltTiles);

    const shape = tilesToShape(this.tiles);
    selfTiles.forEach(t => {
      shape[tileToKey(t)] -= 1;
    });
    this.tiles = shapeToTiles(shape);
    this.tidy();
  }

  tidy() {
    this.tiles = tidy(this.tiles);
  }

  canReaction(tile: Tile) {
    // todo

    return false;
  }
}