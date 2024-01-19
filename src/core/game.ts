import { Deck } from '@/core/deck';
import { Player } from '@/core/player';
import { Tile } from '@/core/tile';
import { wait } from '@/util/time';

export enum PlayerActionType {
  KongSelf = 'Kong(Self)', // 自杠
  HuSelf = 'Hu(Self)', // 自摸
  Discard = 'Discard', // 出牌
}

export enum PlayerReactionType {
  Chow = 'Chow', // 吃
  Pong = 'Pong', // 碰
  Kong = 'Kong', // 杠
  Hu = 'Hu', // 胡
}

export enum GameStatus {
  Init, // 初始阶段
  Wating, // 等待阶段
  Playing, // 出牌阶段
  End, // 结束
};

export interface BasePlayerAction {
  playerID: number;
  tiles?: Tile[];
};

export interface PlayerReaction extends BasePlayerAction {
  type: PlayerReactionType;
};

export interface PlayerAction extends BasePlayerAction {
  type: PlayerActionType;
};

export class Game {
  deck: Deck; // 牌堆
  discards = []; // 已出的牌
  players: Player[] = []; // 玩家
  currentPlayerIndex = 0; // 当前玩家
  currentDiscardTile: Tile | null = null; // 当前打出的公共牌
  status: GameStatus;

  constructor() {
    this.deck = new Deck();
    this.status = GameStatus.Init;
  }

  playerJoin(player: Player) {
    if (this.players.length >= 4) return false;

    this.players.push(player);

    return true;
  }

  async start() {
    if (this.status !== GameStatus.Init) {
      throw new Error('game is not init');
    }

    this.players.forEach(player => {
      const handTiles = this.deck.draw(13);

      player.init(handTiles);
    });

    this.status = GameStatus.Wating;
    this.currentPlayerIndex = 0;

    // 开始游戏
    while (true) {
      // 等待阶段，等待公共牌响应，决定下一个行动的玩家
      const [playerIndex, needDraw] = await this.wait(this.currentDiscardTile);
      this.currentPlayerIndex = playerIndex;

      // 出牌阶段，等待玩家行动
      const discardTile = await this.play(this.players[this.currentPlayerIndex], needDraw);
      this.currentDiscardTile = discardTile;

      // 如果未出牌，则认为游戏结束
      if (!discardTile) break;

      // 否则继续下个轮回
    }

    // 进入结算阶段
    this.end();
  }

  // 等待阶段，等玩家响应公共牌（比如吃/碰），并转移行动顺序
  async wait(tile?: Tile): Promise<[number, boolean]> {
    this.status = GameStatus.Wating;

    let nextPlayerIndex = this.currentPlayerIndex + 1 >= this.players.length 
      ? 0 
      : this.currentPlayerIndex + 1;

    let needDraw = true;

    // 判断是否有可响应公共牌的玩家
    if (!tile) return [nextPlayerIndex, needDraw];
    const canTakePlayers = this.players.filter(player => player.canReaction(tile));
    if (!canTakePlayers.length) return [nextPlayerIndex, needDraw];
 
    // 等待可行动的玩家行动，最多 10 秒
    const action = await Promise.race([
      ...canTakePlayers.map(player => player.reaction(tile)),
      wait(10),
    ]);

    // 如果有玩家行动，则下一位行动玩家改为该玩家
    if (action) {
      await this.execPlayerReaction(action);
      nextPlayerIndex = this.findPlayerIndex(action.playerID);
      // 玩家选择吃/碰的话，不需要再摸牌
      needDraw = ![
        PlayerReactionType.Chow,
        PlayerReactionType.Pong,
      ].includes(action.type);
    }

    return [nextPlayerIndex, needDraw];
  }

  // 出牌阶段，等待玩家行动
  async play(player: Player, needDraw = true) {
    this.status = GameStatus.Playing;
    const action = await this.playerTurn(player, needDraw)
    const discardTile = await this.execPlayerAction(action);

    return discardTile;
  }

  async execPlayerReaction(action: PlayerReaction) {
    const player = this.players[this.findPlayerIndex(action.playerID)];

    switch (action.type) {
      // todo
      case PlayerReactionType.Hu: {
        this.end(player);
        break;
      }
    }
  }

  async execPlayerAction(action: PlayerAction): Promise<Tile | null> {
    const player = this.players[this.findPlayerIndex(action.playerID)];

    switch (action.type) {
      case PlayerActionType.HuSelf: {
        this.end(player);
        return null;
      }

      case PlayerActionType.Discard: {
        const tile = action.tiles[0];
        player.discard(tile);
        this.discards.push(tile);
        return tile;
      }

      case PlayerActionType.KongSelf: {
        const tile = action.tiles[0];
        player.makeMelts(new Array(4).fill(tile));
        const discardTile = await this.play(player);
        return discardTile;
      }
    }
  }

  async playerTurn(player: Player, needDraw = true) {
    let tile: Tile | null = null;

    if (needDraw) {
      [tile] = this.deck.draw();
      if (!tile) {
        this.end(player);
        return Promise.reject();
      }

      player.draw(tile);
    }

    return player.action(tile);
  }

  private findPlayerIndex(playerID: number) {
    return this.players.findIndex(player => player.id === playerID);
  }

  // 结算阶段，判断胜利者
  end(player?: Player) {
    this.status = GameStatus.End;

    // todo
    console.log(player);
  }
}