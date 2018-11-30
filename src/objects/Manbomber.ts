import {Bomb} from "../objects/Bomb";

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
    // this.scene=params.scene;
    params.scene.physics.world.enable(this);
    this.cursors = params.scene.input.keyboard.createCursorKeys();
    this.spacebar = params.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // this.bombs = params.scene.physics.add.staticGroup();
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

  // useBomb() {
    
  // }

  update(time: number) {
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
    // this.bombs.forEach(bomb => {
    //   bomb.update();
    // });
    //this.bombs[0].update(time);

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.tryUseBomb(this.x, this.y);
    }
  }
}

