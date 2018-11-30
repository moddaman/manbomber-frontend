export class Bomb extends Phaser.GameObjects.Sprite {
  time: any;
  exploded:boolean;


  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    params.scene.physics.world.enable(this);
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

  explode() {
    console.log('exlode');
    this.exploded=true;
    this.x = -100;
    this.y = -100;
  }

  update(time: number) {

    //her skal manbomber sin shit ligge

  }
}

