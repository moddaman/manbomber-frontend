import Network, {ManbomberNameMap} from './Network';
import {Manbomber} from "../objects/Manbomber";
import {Fire} from "../objects/Fire";

class TestScene extends Phaser.Scene {
  private player: Manbomber;
  squares: any;
  bomb: Phaser.GameObjects.Sprite;
  network: Network;
  enemies: ManbomberNameMap;
  bombCounter: number;
  private fires: Phaser.GameObjects.Group;

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
    this.load.image('bullet', '/assets/sprites/purple_ball.png');

  }

  create() {
    this.player = new Manbomber({
      scene: this,
      x: 100,
      y: 100,
      key: "player_0"
    }, this.network);
    this.player.setCollideWorldBounds(true);

    this.fires = this.add.group({
      runChildUpdate: true
    });

    this.squares = this.physics.add.staticGroup();
    for (var i = 50; i < 470; i += 70) {
      for (var j = 50; j < 610; j += 70) {
        this.squares.create(j, i, 'black-square');
        this.squares.enableBody = true;
      }
    }
    this.physics.add.collider(this.player, this.squares);
    this.physics.add.collider(this.fires, this.squares, this.killFire);
    this.physics.add.overlap(this.player, this.fires, this.killPlayer, null, this);
    this.bombCounter = 0;

  }

  killFire(fire, square) {
    fire.destroy();
  }

  killPlayer(player, fire) {
    player.x = 0;
    player.y = 0;
    fire.destroy()
    console.log('DØD!!!!')
  }

  getFire(x, y, xSpeed, ySpeed) {
    return new Fire({
      scene: this,
      x: x,
      y: y,
      key: "bullet",
      fireProperties: {
        ySpeed: ySpeed,
        xSpeed: xSpeed
      }
    })
  }

  public fire(x, y) {
    this.fires.add(
      this.getFire(x, y, 100, 0),
    );
    this.fires.add(
      this.getFire(x, y, -100, 0),
    );
    this.fires.add(
      this.getFire(x, y, 0, 100),
    );
    this.fires.add(
      this.getFire(x, y, 0, -100),
    );
  }

  update(time: number, delta: number) {
    this.physics.add.collider(this.player, this.squares); // denne burde fungere, men det gjør den ikke
    this.network.update(time, this.player);

    this.player.update(time);
  }
}

export default TestScene;
