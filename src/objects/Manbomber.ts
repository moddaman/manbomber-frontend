import { Bomb } from "../objects/Bomb";
import { ExplotionRadius, PlayerState, BombState } from '../types'
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
  lastX: number;
  lastY: number;
  username: string;
  id: string;

  constructor(params, id: string, network?: Network) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    params.scene.physics.world.enable(this);
    this.cursors = params.scene.input.keyboard.createCursorKeys();
    this.spacebar = params.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.bombCounter = 0;
    this.time = params.scene.time;
    this.network = network;
    this.lastX = params.x;
    this.lastY = params.y;
    this.id = id;

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

  setId(id: string) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  getNewBomb() {
    console.log('Player got new bomb');
    this.usedBombs -= 1;
  }

  tryUseBomb(x: number, y: number) {
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

  updateBeta(player: PlayerState, index: number) {
    this.setVelocityY(0)
    this.setVelocityX(0)

    if (player.x < this.lastX) {
      this.setVelocityX(-150)
      this.anims.play(`${index}_left`, true);

    }
    if (player.x > this.lastX) {
      this.setVelocityX(150)
      this.anims.play(`${index}_right`, true);

    }
    if (player.y > this.y) {
      this.setVelocityY(150)
      this.anims.play(`${index}_down`, true);

    }
    if (player.y < this.y) {
      this.setVelocityY(-150)
      this.anims.play(`${index}_up`, true);

    }
    // if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
    //   this.tryUseBomb(this.x, this.y);
    // }
  }
  update(time: number, index: number) {
    console.log('dsadsølsadølsadsa');

    this.setVelocityY(0)
    this.setVelocityX(0)
    if (this.cursors.left.isDown) {
      this.setVelocityX(-150)
      this.anims.play(`${index}_left`, true);

    }
    if (this.cursors.right.isDown) {
      this.setVelocityX(150)
      this.anims.play(`${index}_right`, true);

    }
    if (this.cursors.down.isDown) {
      this.setVelocityY(150)
      this.anims.play(`${index}_down`, true);

    }
    if (this.cursors.up.isDown) {
      this.setVelocityY(-150)
      this.anims.play(`${index}_up`, true);

    }

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.tryUseBomb(this.x, this.y);
    }
  }
}

