
import Phaser from "phaser";

class Laser extends Phaser.Physics.Arcade.Sprite 
    {
        constructor(scene, x, y) {
            super(scene,x,y,'invaders', 'player-laser-0')
            this.setScale(2)
        }

        fire(x,y) {
            this.enableBody(true, x+1, y, true, true)
            this.setVelocityY(-350);
        }
        
        preUpdate(time, delta) {
            super.preUpdate(time, delta);
            if (this.y <= 170) {
                this.disableBody(true, true);
            }
        }
    }

export default Laser;