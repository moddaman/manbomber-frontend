import Network, { ManbomberNameMap } from './Network';
import { Manbomber } from "../objects/Manbomber";
import { Fire } from "../objects/Fire";
import { isOdd, isEven } from "../utils";

class TestScene extends Phaser.Scene {
  private player: Manbomber;
  squares: any;
  boxes: any;
  bomb: Phaser.GameObjects.Sprite;
  network: Network;
  enemies: ManbomberNameMap;
  bombCounter: number;
  gameWidth: number = 672; //Bør være mulig å hente dette fra config, men fant det ikke.
  gameHeight: number = 480;
  numberOfXCells: number;
  numberOfYCells: number;
  cellSize: number = 32; // height and width Square
  private fires: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: 'TestScene'
    });

    console.log(this.gameWidth, this.cellSize, this.gameWidth / this.cellSize)
    this.numberOfXCells = this.gameWidth / this.cellSize;
    this.numberOfYCells = this.gameHeight / this.cellSize;
    this.enemies = {};
    this.network = new Network(this, this.enemies);
  }

  preload() {
    this.load.spritesheet('player_0', '/assets/sprites/Bombah-animated.png', { frameWidth: 22, frameHeight: 30 });
    //this.load.image('player_0', '/assets/sprites/Bombah.png');
    this.load.image('player_1', '/assets/sprites/player_1.png');
    this.load.image('player_2', '/assets/sprites/player_2.png');
    this.load.image('player_3', '/assets/sprites/player_3.png');

    this.load.image('green-brick', '/assets/sprites/green_brick.png');
    this.load.image('black-square', '/assets/sprites/green-square.png');
    this.load.image('bomb', '/assets/sprites/bomb.png');
    this.load.image('bullet', '/assets/sprites/purple_ball.png');

  }



  isPlayerStartZone(xCell, yCell) {

    if (xCell == 1) {
      if (yCell == 1 || (yCell + 2) == this.numberOfYCells) {
        return false
      }
    }
    if ((xCell + 2) == this.numberOfXCells) {
      if (yCell == 1 || (yCell + 2) == this.numberOfYCells) {
        return false
      }
    }
    if (xCell < 2) {
      return yCell < 2 || (yCell + 2) >= this.numberOfYCells;
    }
    if ((xCell + 2) >= this.numberOfXCells) {
      return yCell < 2 || (yCell + 2) >= this.numberOfYCells;
    }
  }

  create() {
    this.player = new Manbomber({
      scene: this,
      x: 12,
      y: 12,
      key: "player_0"
    }, this.network);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player_0', { frames: [0] }),
      frameRate: 0,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player_0', { frames: [1] }),
      frameRate: 0,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player_0', { frames: [2] }),
      frameRate: 0,
      repeat: -1
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player_0', { frames: [3] }),
      frameRate: 0,
      repeat: -1
    });


    this.fires = this.add.group({
      runChildUpdate: true
    });
    this.squares = this.physics.add.staticGroup();
    this.boxes = this.physics.add.staticGroup();


    var xGrid = 0;
    var yGrid = 0;

    for (var j = 0; j <= this.numberOfXCells; j++) {
      for (var i = 0; i <= this.numberOfYCells; i++) {
        if (!this.isPlayerStartZone(j, i)) {
          if (isEven(xGrid) || isEven(yGrid)) {
            this.boxes.create((j * 32) + 16, (i * 32) + 16, 'green-brick');
            this.boxes.enableBody = true;
          }
          if (isOdd(xGrid) && isOdd(yGrid)) {
            this.squares.create((j * 32) + 16, (i * 32) + 16, 'black-square');
            this.squares.enableBody = true;
          }
        }
        yGrid += 1;
      }
      xGrid += 1;
    }


    this.physics.add.collider(this.player, this.boxes);
    this.physics.add.collider(this.player, this.squares);
    this.physics.add.collider(this.fires, this.squares, this.killFire);
    this.physics.add.collider(this.fires, this.boxes, this.killBox);

    this.physics.add.overlap(this.player, this.fires, this.killPlayer, null, this);
    this.bombCounter = 0;
  }

  killBox(fire, box) {
    box.destroy();
    fire.destroy();
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
    //this.physics.add.collider(this.player, this.squares); // denne burde fungere, men det gjør den ikke

    this.player.update(time);
  }
}

export default TestScene;
