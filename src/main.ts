import 'phaser';

import TestScene from './scenes/PlayScene';
import {Chat} from './chat';
import {getUrlParam} from './network/socket';

new Chat();


const player = getUrlParam('player');
if (!player) {
  console.log('Fin net navn ass');


} else {
  const config: GameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 600,
    height: 450,
    resolution: 1,
    backgroundColor: "#EDEEC9",
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 0},
        debug: false
      }
    },
    scene: [
      TestScene
    ]
  };

  new Phaser.Game(config);

}




