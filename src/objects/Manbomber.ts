import {Bomb} from "../objects/Bomb";

export class Manbomber extends Phaser.GameObjects.Sprite {
  numberOfBombs: number = 5;
  cursors: any;
  spacebar: any;
  bombs: Bomb[];
  bombCounter: number;


  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    // this.scene=params.scene;
    params.scene.physics.world.enable(this);
    this.cursors = params.scene.input.keyboard.createCursorKeys();
    this.spacebar = params.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // this.bombs = params.scene.physics.add.staticGroup();
    this.bombCounter = 0;
    params.scene.add.existing(this);


  }

  setBombs(bombs) {
    this.bombs = bombs;
  }

  canUseBomb() {
    return this.numberOfBombs > 0;
  }

  useBomb() {
    this.numberOfBombs -= 1;
  }

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
    this.bombs[0].update(time);


    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      console.log(this.canUseBomb());
      if (this.canUseBomb()) {


        this.bombs[0].use(this.x, this.y, time);
        // this.useBomb()
      }
    }
  }
}

