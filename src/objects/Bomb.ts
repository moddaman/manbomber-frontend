
export class Bomb extends Phaser.GameObjects.Sprite {
    timer: any;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        params.scene.physics.world.enable(this);
        params.scene.add.existing(this);
    }

    update() {
        //her skal manbomber sin shit ligge
    }
}

