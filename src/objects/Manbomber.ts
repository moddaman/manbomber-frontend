
export class Manbomber extends Phaser.GameObjects.Sprite {
    bombs: any;
    numberOfBombs: number = 5;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        params.scene.physics.world.enable(this);
        params.scene.add.existing(this);
    }


    canUseBomb() {

        return this.numberOfBombs > 0;
    }
    useBomb() {
        this.numberOfBombs -= 1;
    }

    update() {
        //her skal manbomber sin shit ligge
    }
}

