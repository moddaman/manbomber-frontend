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

  isInRadius(x: number, y: number, explosionRadius: ExplotionRadius) {
    return (Math.abs(x - explosionRadius.x) < 100 && Math.abs(y - explosionRadius.y) < 15) ||
      (Math.abs(y - explosionRadius.y) < 100 && Math.abs(x - explosionRadius.x) < 15)
  }

  isDead(x: number, y: number, explosionRadiuses: Array<ExplotionRadius>) {
    return (explosionRadiuses !== undefined && explosionRadiuses.length > 0) && explosionRadiuses.some(e => {
      return this.isInRadius(this.x, this.y, e);
    })
  }


  update(time: number) {
    if (this.cursors.left.isDown) {
      this.setVelocityX(-5)
    }
    if (this.cursors.right.isDown) {
      this.setVelocityX(5)
    }
    if (this.cursors.down.isDown) {
      this.setVelocityY(5)
    }
    if (this.cursors.up.isDown) {
      this.setVelocityY(-5)
    }

    const exlodedBoms = this.bombs
      .filter(b => b.hasExploded())
      .map(e => e.getExplotionRadius());

    if (this.isDead(this.x, this.y, exlodedBoms)) {
      console.log('YOU DEAD');
    }

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.tryUseBomb(this.x, this.y);
    }
  }
}

