import Network from './Network';
import { Manbomber } from "../objects/Manbomber";

class TestScene extends Phaser.Scene {
  private player: Manbomber;
  squares: any;
  cursors: any;
  bomb: Phaser.GameObjects.Sprite;
  network: Network;
  enemies: Phaser.GameObjects.Sprite[];
  spacebar: any;
  bombs: any;
  bombCounter: number;

  constructor() {
    super({
      key: 'TestScene'
    });

    this.network = new Network();
  }

  preload() {
    this.load.image('player', '/assets/sprites/player.png');
    this.load.image('black-square', '/assets/sprites/black-square.png');
    this.load.image('bomb', '/assets/sprites/bomb.png');
  }

  create() {
    this.player = new Manbomber({
      scene: this,
      x: 100,
      y: 100,
      key: "player"
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.squares = this.physics.add.staticGroup();
    for (var i = 70; i < 400; i += 80) {
      for (var j = 80; j < 600; j += 80) {
        this.squares.create(j, i, 'black-square');
      }
    }
    this.bombs = this.physics.add.staticGroup();
    this.bombCounter = 0;
    this.enemies = [];
    for (let i = 0; i < 10; i++) {
      this.enemies[i] = this.add.sprite(0, 0, 'player');
      this.enemies[i].visible = false;

    }

  }

  update(time: number, delta: number) {
    this.physics.add.collider(this.player, this.squares);
    this.network.update(time, this.player, this.enemies);

    if (this.cursors.left.isDown) {
      this.player.x -= 5;
    }
    if (this.cursors.right.isDown) {
      this.player.x += 5;
    }
    if (this.cursors.down.isDown) {
      this.player.y += 5;
    }
    if (this.cursors.up.isDown) {
      this.player.y -= 5;
    }

    this.player.update();
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      console.log(this.player.canUseBomb());
      if (this.player.canUseBomb()) {
        this.bombs.create(this.player.x, this.player.y, 'bomb');
        console.log('DROP BOMB');
        this.player.useBomb()
      }

    }
  }
}

export default TestScene;
