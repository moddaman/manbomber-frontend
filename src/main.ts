import 'phaser';

import TestScene from './scenes/PlayScene';
import { Chat } from './chat';
import { getUrlParam } from './network/socket';

new Chat();


const player = getUrlParam('player');
if (!player) {
  console.log('Fin net navn ass');


} else {
  const config: GameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 672,
    height: 480,
    resolution: 1,
    backgroundColor: "#0C6991",
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [
      TestScene
    ]
  };

  new Phaser.Game(config);

}




