import {Bomb} from "../objects/Bomb";
import {ExplotionRadius} from '../types'
import Network from "../scenes/Network";

export class Manbomber extends Phaser.Physics.Arcade.Sprite {
  usedBombs: number = 0;
  maxBombs: number = 5;
  explodeTime: number = 2000;
  cursors: any;
  spacebar: any;
  bombs: Bomb[];
  bombCounter: number;
  time: any;
  network?: Network;

  constructor(params, network?: Network) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    params.scene.physics.world.enable(this);
    this.cursors = params.scene.input.keyboard.createCursorKeys();
    this.spacebar = params.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.bombCounter = 0;
    this.time = params.scene.time;
    this.network = network;

    params.scene.add.existing(this);

    this.bombs = [];
    for (let i = 0; i < 5; i++) {
      this.bombs.push(new Bomb({
        scene: params.scene,
        x: -100,
        y: -100,
        key: "bomb"
      }));
    }


  }

  getNewBomb() {
    console.log('Player got new bomb');
    this.usedBombs -= 1;
  }

  tryUseBomb(x: any, y: any) {
    if (this.usedBombs < this.maxBombs) {
      this.bombs[this.usedBombs].use(x, y, this.explodeTime);
      this.usedBombs += 1;
      this.time.addEvent({
        delay: this.explodeTime,
        callback: () => this.getNewBomb(),
        callbackScope: this
      });

      if (this.network) {
        // Only player has network. not enemies
        this.network.sendDroppedBomb(x, y);
      }

    }
  }

  
  update(time: number) {
    this.setVelocityY(0)
    this.setVelocityX(0)
    if (this.cursors.left.isDown) {
      this.setVelocityX(-150)
    }
    if (this.cursors.right.isDown) {
      this.setVelocityX(150)
    }
    if (this.cursors.down.isDown) {
      this.setVelocityY(150)
    }
    if (this.cursors.up.isDown) {
      this.setVelocityY(-150)
    } 

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.tryUseBomb(this.x, this.y);
    }
  }
}

