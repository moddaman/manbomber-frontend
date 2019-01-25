export interface ExplotionRadius {
    x: number,
    y: number
}


interface GameState {
  players: PlayerState[]
  tiles: BombType[];
}

interface PlayerState {
  x: number;
  y: number;
  name: string;
  bombs: BombState[];

}

interface BombState {
  x: number;
  y: number;
}

type BombType = 'BLOCK' | 'BOX' | 'EMPTY' | 'SPEED'

