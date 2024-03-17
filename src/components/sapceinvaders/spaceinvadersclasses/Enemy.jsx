import Phaser from "phaser";
class Enemy extends Phaser.Physics.Arcade.Sprite
    {
        constructor(scene,x,y,key,frame) {
            super(scene,x,y,key,frame);
            this.setScale(2);
        }
    }
export default Enemy;