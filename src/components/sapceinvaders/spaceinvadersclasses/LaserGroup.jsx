import Phaser from "phaser";
import Laser from './Laser'
class LaserGroup extends Phaser.Physics.Arcade.Group
    {
        constructor(scene) {
            super(scene.physics.world, scene,{
                classType: Laser,
                frameQuantity: 10,
                active: false,
                visible: false,
                key: 'laser'
            })
        }
        fireLaser(x,y, laserShot) {
            const laser = this.getFirstDead(false);
            if (laser) {
                laser.fire(x,y);
                laserShot.setVolume(0.5);
                laserShot.play();
            }
        }
    }

export default LaserGroup;
