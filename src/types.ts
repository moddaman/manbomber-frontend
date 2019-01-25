export interface ExplotionRadius {
    x: number,
    y: number
}


export interface GameState {
  players: PlayerState[]
  tiles: BombType[];
}

export interface PlayerState {
  x: number;
  y: number;
  name: string;
  bombs: BombState[];

}

export interface BombState {
  x: number;
  y: number;
}

export type BombType = 'BLOCK' | 'BOX' | 'EMPTY' | 'SPEED'

