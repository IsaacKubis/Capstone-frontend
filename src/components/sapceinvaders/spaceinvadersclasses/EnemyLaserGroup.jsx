import Phaser from "phaser";
import EnemyLaser from "./EnemyLaser";
class EnemyLaserGroup extends Phaser.Physics.Arcade.Group
    {
        constructor(scene) {
            super(scene.physics.world, scene,{
                classType: EnemyLaser,
                frameQuantity: 10,
                active: false,
                visible: false,
                key: 'enemylaser'
            })
        }
        fireEnemyLaser(x,y) {
            const enemyLaser = this.getFirstDead(false);
            if (enemyLaser) {
                enemyLaser.fire(x,y);
            }
        }
    }
export default EnemyLaserGroup;