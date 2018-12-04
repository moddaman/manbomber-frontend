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
    }, this.network);
    this.player.physicsBodyType = Phaser.Physics.ARCADE;
    this.player.body.collideWorldBounds = true;

    this.squares = this.physics.add.staticGroup();
    for (var i = 70; i < 400; i += 80) {
      for (var j = 80; j < 600; j += 80) {
        this.squares.create(j, i, 'black-square');
        this.squares.enableBody = true;
      }
    }

    this.bombCounter = 0;

  }

  update(time: number, delta: number) {
    this.physics.add.collider(this.player, this.squares); // denne burde fungere, men det gjør den ikke
    this.network.update(time, this.player);
    const x = this.bombs[0].getExplotionRadius();
    var t = this.bombs.filter(b => {
      return b.hasExploded();
    }).map(e => {
      return e.getExplotionRadius();
    })
    this.player.update(time, t);
  }
}

export default TestScene;
