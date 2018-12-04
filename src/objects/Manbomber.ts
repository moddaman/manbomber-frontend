import {Bomb} from "../objects/Bomb";
import Network from "../scenes/Network";

export class Manbomber extends Phaser.GameObjects.Sprite {
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
    // this.scene=params.scene;
    params.scene.physics.world.enable(this);
    this.cursors = params.scene.input.keyboard.createCursorKeys();
    this.spacebar = params.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // this.bombs = params.scene.physics.add.staticGroup();
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

      if(this.network){
        // Only player has network. not enemies
        this.network.sendDroppedBomb(x, y);
      }

    }
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

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.tryUseBomb(this.x, this.y);
    }
  }
}

