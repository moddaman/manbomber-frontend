


export class Manbomber extends Phaser.GameObjects.Sprite {
    bombs: any;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        params.scene.physics.world.enable(this);
        console.log('hello')
        params.scene.add.existing(this);
    }

    numberOfBombs: number = 5;

    canUseBomb() {
        console.log(this.numberOfBombs);
        
        return this.numberOfBombs > 0;
    }
    useBomb() {
        this.numberOfBombs =- 1;
    }

    update() {
        console.log('hei');
    }
}

