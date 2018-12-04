import Network, {ManbomberNameMap} from './Network';
import {Manbomber} from "../objects/Manbomber";

class TestScene extends Phaser.Scene {
  private player: Manbomber;
  squares: any;
  bomb: Phaser.GameObjects.Sprite;
  network: Network;
  enemies: ManbomberNameMap;
  bombCounter: number;

  constructor() {
    super({
      key: 'TestScene'
    });

    this.enemies = {};
    this.network = new Network(this, this.enemies);

  }

  preload() {
    this.load.image('player_0', '/assets/sprites/player_0.png');
    this.load.image('player_1', '/assets/sprites/player_1.png');
    this.load.image('player_2', '/assets/sprites/player_2.png');
    this.load.image('player_3', '/assets/sprites/player_3.png');

    this.load.image('black-square', '/assets/sprites/green-square.png');
    this.load.image('bomb', '/assets/sprites/bomb.png');
  }

  create() {
    this.player = new Manbomber({
      scene: this,
      x: 100,
      y: 100,
      key: "player_0"
    }, this.network);
    this.player.setCollideWorldBounds(true);


    this.squares = this.physics.add.staticGroup();
    for (var i = 50; i < 470; i += 70) {
      for (var j = 50; j < 610; j += 70) {
        this.squares.create(j, i, 'black-square');
        this.squares.enableBody = true;
      }
    }
    this.physics.add.collider(this.player, this.squares);

    this.bombCounter = 0;

  }

  update(time: number, delta: number) {
    this.physics.add.collider(this.player, this.squares); // denne burde fungere, men det gjør den ikke
    this.network.update(time, this.player);

    this.player.update(time);
  }
}

export default TestScene;
