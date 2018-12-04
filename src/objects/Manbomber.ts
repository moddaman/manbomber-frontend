import {Bomb} from "../objects/Bomb";
import { ExplotionRadius } from '../types'

export class Manbomber extends Phaser.GameObjects.Sprite {
  usedBombs: number = 0;
  maxBombs: number = 5;
  explodeTime: number = 2000;
  cursors: any;
  spacebar: any;
  bombs: Bomb[];
  bombCounter: number;
  time: any;


  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    params.scene.physics.world.enable(this);
    this.cursors = params.scene.input.keyboard.createCursorKeys();
    this.spacebar = params.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.bombCounter = 0;
    this.time = params.scene.time;

    params.scene.add.existing(this);


  }

  setBombs(bombs) {
    this.bombs = bombs;
  }

  getNewBomb () {
    console.log('Player got new bomb');
    this.usedBombs -= 1;
  }

  tryUseBomb(x:any, y:any) {
    if(this.usedBombs < this.maxBombs) {
      this.bombs[this.usedBombs].use(x, y, this.explodeTime);
      this.usedBombs += 1;
      this.time.addEvent({
        delay: this.explodeTime,
        callback: () => this.getNewBomb(),
        callbackScope: this
      })
    }
  }

  isInRadius(x:number, y:number, explosionRadius: ExplotionRadius) {
    return (Math.abs(x-explosionRadius.x) < 100  && Math.abs(y - explosionRadius.y) < 15)   ||
      (Math.abs(y - explosionRadius.y) < 100 && Math.abs(x - explosionRadius.x) < 15)
  }

  isDead(x:number, y:number, explosionRadiuses: Array<ExplotionRadius>) {
    return (explosionRadiuses !== undefined && explosionRadiuses.length > 0) && explosionRadiuses.some(e => {
      return this.isInRadius(this.x, this.y, e);
    })
  }


  update(time: number, explosionRadiuses: Array<ExplotionRadius> ) {
    if (this.cursors.left.isDown) {
      this.x -= 5;
    }
    if (this.cursors.right.isDown) {
      this.x += 5;
    }
    if (this.cursors.down.isDown) {
      this.y += 5;
    }
    if (this.cursors.up.isDown) {
      this.y -= 5;
    }
    if(this.isDead(this.x, this.y, explosionRadiuses)) {
        console.log('YOU DEAD');
      }

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.tryUseBomb(this.x, this.y);
    }
  }
}

