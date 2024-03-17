import Phaser from "phaser";
class EnemyLaser extends Phaser.Physics.Arcade.Sprite 
    {
        constructor(scene, x, y) {
            super(scene,x,y,'invaders', 'enemy-laser-0')
            this.setScale(2)
        }

        fire(x,y) {
            this.enableBody(true, x+1, y, true, true)
            let speed = Phaser.Math.RND.integerInRange(200,450)
            this.setVelocityY(speed);
        }
        
        preUpdate(time, delta) {
            super.preUpdate(time, delta);
            if (this.y >= 820) {
                this.disableBody(true, true);
            }
        }
    }

export default EnemyLaser;