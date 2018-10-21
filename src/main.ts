import 'phaser';

import TestScene from './scenes/PlayScene';
import {Chat} from './chat';
new Chat();

const config: GameConfig = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 640,
  height: 480,
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

