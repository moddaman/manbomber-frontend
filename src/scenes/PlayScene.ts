import Network, { ManbomberNameMap } from './Network';
import { Manbomber } from "../objects/Manbomber";
import { Fire } from "../objects/Fire";
import { Cell } from "../objects/Cell";
import { isOdd, isEven } from "../utils";
import { PlayerState } from '../types';



class Grid {
  private grid: Array<Cell> = [];
  private numberOfColumns: number = 3;

  constructor() {
    for (var j = 0; j < 9; j++) {
      this.grid.push(new Cell(j, j));
    }
  }

  getCell(row: number, column: number) {

    console.log(this.grid);
    return this.grid[(row * this.numberOfColumns) + column];
  }

}


class TestScene extends Phaser.Scene {
  private player: Manbomber;
  private player2: Manbomber;
  private playas: Array<Manbomber>;

  id: string;
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
    this.playas = [];
    console.log(this.gameWidth, this.cellSize, this.gameWidth / this.cellSize)
    this.numberOfXCells = this.gameWidth / this.cellSize;
    this.numberOfYCells = this.gameHeight / this.cellSize;
    this.enemies = {};
    this.network = new Network(this, this.enemies);
  }

  preload() {
    this.load.spritesheet('player_0', '/assets/sprites/Bombah-animated.png', { frameWidth: 22, frameHeight: 30 });
    this.load.spritesheet('player_1', '/assets/sprites/Bombah-animated.png', { frameWidth: 22, frameHeight: 30 });
    this.load.spritesheet('player_2', '/assets/sprites/Bombah-animated.png', { frameWidth: 22, frameHeight: 30 });
    this.load.spritesheet('player_3', '/assets/sprites/Bombah-animated.png', { frameWidth: 22, frameHeight: 30 });

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



  setupAnimation(id: string) {

    this.anims.create({
      key: `${id}_up`,
      frames: this.anims.generateFrameNumbers(`player_${id}`, { frames: [0] }),
      frameRate: 0,
      repeat: -1
    });
    this.anims.create({
      key: `${id}_down`,
      frames: this.anims.generateFrameNumbers(`player_${id}`, { frames: [1] }),
      frameRate: 0,
      repeat: -1
    });
    this.anims.create({
      key: `${id}_right`,
      frames: this.anims.generateFrameNumbers(`player_${id}`, { frames: [2] }),
      frameRate: 0,
      repeat: -1
    });
    this.anims.create({
      key: `${id}_left`,
      frames: this.anims.generateFrameNumbers(`player_${id}`, { frames: [3] }),
      frameRate: 0,
      repeat: -1
    });
  }

  create() {


    this.fires = this.add.group({
      runChildUpdate: true
    });
    this.squares = this.physics.add.staticGroup();
    this.boxes = this.physics.add.staticGroup();


    var xGrid = 0;
    var yGrid = 0;

    var g = new Grid();

    console.log(g.getCell(2, 2));

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


    this.physics.add.collider(this.fires, this.squares, this.killFire);
    this.physics.add.collider(this.fires, this.boxes, this.killBox);

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


  createPlayer(p: PlayerState) {
    const player = new Manbomber({
      scene: this,
      x: 12,
      y: 12,
      key: "player_0"
    }, p.id, this.network);
    player.setCollideWorldBounds(true);
    this.setupAnimation(p.id)
    this.physics.add.collider(player, this.boxes);
    this.physics.add.collider(player, this.squares);
    this.physics.add.overlap(player, this.fires, this.killPlayer, null, this);
    this.playas.push(player);
  }

  mPlayer(myId: string): Manbomber {
    return this.playas.find(p => p.id == myId);
  }

  update(time: number, delta: number) {
    //this.physics.add.collider(this.player, this.squares); // denne burde fungere, men det gjør den ikke
    //Finn ut hvilken spiller klienten er
    const myId = this.network.socketId;


    const game = this.network.gameState;
    const myPlayer = this.mPlayer(myId);
    if (!myPlayer && game.players.length < 3) { //sjekk også om socket id ikke finnes
      this.createPlayer(game.players[game.players.length - 1])
    }
    if (myPlayer) {
      myPlayer.update(time, 0);
      this.network.update(time, myPlayer);
    }

    if (game.players[1]) {
      this.player2.updateBeta(game.players[1], 1);
    }
  };


}

export default TestScene;