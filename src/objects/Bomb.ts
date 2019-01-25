import { ExplotionRadius } from '../types'
import Scene = Phaser.Scene;


export class Bomb extends Phaser.GameObjects.Sprite {
  time: any;
  exploded: boolean;
  private currentScene: Phaser.Scene;


  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    params.scene.physics.world.enable(this);
    this.currentScene = params.scene;
    params.scene.add.existing(this);
    this.time = params.scene.time;

  }


  use(x: number, y: number, timeToExplode: number) {
    this.x = x;
    this.y = y;
    this.time.addEvent({
      delay: timeToExplode,
      callback: () => this.explode(),
      callbackScope: this
    })
  }

  getExplotionRadius(): ExplotionRadius {
    if (this.exploded) {
      return { y: this.y, x: this.x };
    }

  }

  hasExploded(): boolean {
    return this.exploded;
  }

  reset() {
    this.exploded = false;
    this.x = -100;
    this.y = -100;
  }

  explode() {
    console.log('exlode');
    this.exploded = true;
    this.currentScene.fire(this.x, this.y);
    this.time.addEvent({
      delay: 500,
      callback: () => this.reset(),
      callbackScope: this
    })


  }

  update(time: number) {
    //her skal manbomber sin shit ligge

  }
}
