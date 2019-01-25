
export class Fire extends Phaser.GameObjects.Image {
  private currentScene: Phaser.Scene;

  constructor(params) {
    super(params.scene, params.x, params.y, params.key);

    this.currentScene = params.scene;
    this.initImage();
    this.currentScene.physics.world.enable(this);
    const x = <Phaser.Physics.Arcade.Body>this.body
    x.setVelocityY(params.fireProperties.ySpeed);
    x.setVelocityX(params.fireProperties.xSpeed);
    x.setSize(1, 8);


    this.currentScene.add.existing(this);
  }


  private initImage(): void {
    this.setOrigin(0.5, 0.5);
  }

  update(): void {
    if (this.y < 0 || this.y > this.currentScene.sys.canvas.height) {
      this.destroy();
    }
  }
}