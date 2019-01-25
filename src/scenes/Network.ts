import { BOMB_UPDATE_KEY, getUrlParam, PLAYER_UPDATE_KEY, socket } from '../network/socket';
import { Manbomber } from "../objects/Manbomber";
import Scene = Phaser.Scene;
import { GameState } from "../types";


interface NetworkMsgPlay {
  name: string;
  x: number;
  y: number;
  bomb?: {
    x: number;
    y: number;
    exploded: boolean;
  }
}

interface NetworkMsgBomb {
  name: string;
  x: number;
  y: number;
}

const randomName = () => {
  return 'oystein' + Math.round(Math.random() * 100);
};

const SOCKET_GAME_STATE_KEY = 'game_state';

export interface ManbomberNameMap {
  [name: string]: Manbomber
}

class Network {
  networkCount: number;
  lastPlayerMsg: NetworkMsgPlay;
  enemiesMap: ManbomberNameMap;
  scene: Scene;
  gameState: GameState;
  socketId: any;

  constructor(scene: Scene, enemiesMap: ManbomberNameMap) {
    this.scene = scene;
    this.enemiesMap = enemiesMap;
    this.gameState = { players: [], tiles: [] }
    socket.on(PLAYER_UPDATE_KEY, (data) => {
      this.onPlayersUpdate(data);
    });
    socket.on(BOMB_UPDATE_KEY, (data) => {
      this.onBombUpdate(data);
    });
    this.socketId = socket.id;

    console.log('hører på game state opdpateringeng');
    socket.on(SOCKET_GAME_STATE_KEY, (data: GameState) => {
      this.gameState = data;
      console.log('--- Game State ----');
      console.log('Players');
      console.table(data.players);
      console.log('Tiles');
      console.log(data.tiles)
    });

    this.networkCount = 0;

    this.lastPlayerMsg = {
      name: getUrlParam('player') || randomName(),
      x: 0,
      y: 0
    };
    console.log('name', this.lastPlayerMsg.name);
  }


  create() {
    this.networkCount = 0;

  }

  isYou(newMsg: NetworkMsgPlay) {
    return newMsg.name != this.lastPlayerMsg.name
  }

  onPlayersUpdate(newMsg: NetworkMsgPlay) {
    if (!this.isYou(newMsg)) return;

    const imgId = (1 + Object.keys(this.enemiesMap).length) % 3;
    let foundEnemy = this.enemiesMap[newMsg.name];
    if (!foundEnemy) {
      // Lag ny enemy
      this.enemiesMap[newMsg.name] = new Manbomber({
        scene: this.scene,
        x: -100,
        y: -100,
        key: "player_" + imgId
      });
      foundEnemy = this.enemiesMap[newMsg.name];
    }
    // Oppdater enemy posisjon
    foundEnemy.x = newMsg.x;
    foundEnemy.y = newMsg.y;


    console.log("Fiende bevegelse", newMsg);


  }

  onBombUpdate(bombMsg: NetworkMsgBomb) {
    console.log("ny bombe satt over nett ", bombMsg);

    let enemyDroppingBomb = this.enemiesMap[bombMsg.name];
    if (enemyDroppingBomb) {
      enemyDroppingBomb.tryUseBomb(bombMsg.x, bombMsg.y)
    }


  }

  sendDroppedBomb(x: number, y: number) {
    const msg: NetworkMsgBomb = { x, y, name: this.lastPlayerMsg.name };
    socket.emit(BOMB_UPDATE_KEY, msg)
  }

  update(
    time: number,
    player: Phaser.GameObjects.Sprite,
  ) {
    this.networkCount++;

    if (this.networkCount % 1 === 0) {

      if (this.lastPlayerMsg.x != player.x || this.lastPlayerMsg.y != player.y) {

        const myPos: NetworkMsgPlay = {
          name: this.lastPlayerMsg.name,
          x: player.x,
          y: player.y
        };
        this.lastPlayerMsg = myPos;
        socket.emit(PLAYER_UPDATE_KEY, myPos);
      }

    }


  }


}

export default Network;
