


class TestScene extends Phaser.Scene {
	player: any;
	squares: any;
	cursors: any;

	constructor() {
    super({
			key: 'TestScene'
		});
	}

	b():any {
		console.log('hello')
		return 'hello';
	}

	test():Function {
		return () => this.b();
	}
	
	preload() {
		this.load.image('player', '/assets/sprites/player.png');
		this.load.image('black-square', '/assets/sprites/black-square.png');

	}

	create() {
		//var map:Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: 'map' });
	
		
		this.player = this.physics.add.sprite(100, 100, 'player'); // this.add.sprite(100, 100, 'player');
		this.player.setCollideWorldBounds(true);
		this.player.enableBody(true);
		this.physics.world.enable(this.player);
		
		this.cursors = this.input.keyboard.createCursorKeys();
		this.squares = this.physics.add.staticGroup();
		for(var i = 70; i < 400; i += 80) {
			for(var j = 80; j < 600; j+= 80) {
				this.squares.create(j, i, 'black-square');
			}
		}
	}

	update(time: number, delta:number) {
		this.physics.add.collider(this.player, this.squares);
		
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
	}
}

export default TestScene;