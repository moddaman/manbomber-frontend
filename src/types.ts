export interface ExplotionRadius {
  x: number,
  y: number
}


export interface GameState {
  players: PlayerState[]
  tiles: Tiletype[];
}

export interface PlayerState {
  id: string;
  x: number;
  y: number;
  name: string;
  bombs: BombState[];
  occupied: boolean;

}

export interface BombState {
  x: number;
  y: number;
}

export type Tiletype = 'BLOCK' | 'BOX' | 'EMPTY' | 'SPEED'

