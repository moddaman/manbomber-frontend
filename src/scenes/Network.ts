import {getUrlParam, PLAYER_UPDATE_KEY, socket} from '../network/socket'
import {Bomb} from '../objects/Bomb';


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

const randomName = () => {
  return 'oystein' + Math.round(Math.random() * 100);
};


class Network {
  networkCount: number;
  lastPlayerMsg: NetworkMsgPlay;

  currentEnemyPlayerMsg: NetworkMsgPlay;
  enemiesMap: {
    [id: number]: NetworkMsgPlay
  };


  constructor() {

    socket.on(PLAYER_UPDATE_KEY, (data) => {
      this.onPlayersUpdate(data);
    });
    this.networkCount = 0;

    this.lastPlayerMsg = {
      name: getUrlParam('player') || randomName(),
      x: 0,
      y: 0
    };
    console.log('name', this.lastPlayerMsg.name);

    this.currentEnemyPlayerMsg = {
      name: 'inge her',
      x: 0, y: 0
    };
    this.enemiesMap = {};
  }


  create() {
    this.networkCount = 0;

  }

  isYou(newMsg: NetworkMsgPlay) {
    return newMsg.name != this.lastPlayerMsg.name
  }

  getIdForArraySpriteOrUndefined() {

  }

  isNewUnkownEnemy(newMsg: NetworkMsgPlay) {

    Object.keys(this.enemiesMap).forEach(key => {
      let value = this.enemiesMap[key];
      if (value && value.name === newMsg.name) {
        return true;
      }

    });

    return newMsg.name != this.lastPlayerMsg.name
  }

  onPlayersUpdate(newMsg: NetworkMsgPlay) {
    if (!this.isYou(newMsg)) return;


    this.enemiesMap[newMsg.name] = newMsg;

    console.log("Fiende bevegelse", newMsg);

    // Object.keys(this.enemiesMap).forEach(key => {
    //     let value = this.enemiesMap[key];
    //
    //
    // });


    this.currentEnemyPlayerMsg = newMsg;


  }

  update(time: number, player: Phaser.GameObjects.Sprite, enemies: Phaser.GameObjects.Sprite[], bomb: Bomb) {
    this.networkCount++;

    if (this.networkCount % 1 === 0) {
      // console.log('update', time);

      if (this.lastPlayerMsg.x != player.x || this.lastPlayerMsg.y != player.y) {

        const myPos: NetworkMsgPlay = {
          name: this.lastPlayerMsg.name,
          x: player.x,
          y: player.y,
          bomb: {
            x: bomb.x,
            y: bomb.y,
            exploded: bomb.exploded
          }
        };
        this.lastPlayerMsg = myPos;
        socket.emit(PLAYER_UPDATE_KEY, myPos);
        //console.log('sender ny socket siden endring', myPos);
      }

    }

    for (var i = 0; i < enemies.length; i++) {
      const enemySprite = enemies[i];
      let eMap = this.enemiesMap[i];
      if (eMap) {
        enemySprite.visible = true;
        enemySprite.x = eMap.x;
        enemySprite.y = eMap.y;
      }
    }

    //enemy.x = this.currentEnemyPlayerMsg.x;
    //enemy.y = this.currentEnemyPlayerMsg.y;

    //
  }
}

export default Network;
