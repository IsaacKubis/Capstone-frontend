import Phaser from "phaser";
import Enemy from "./Enemy";
class EnemyGroup extends Phaser.Physics.Arcade.Group
    {
        constructor(scene) {
            super(scene.physics.world, scene);

            this.resetEnemies();
            console.log()
        }

        resetEnemies ()
        {
            //  Clear everything in this Group
            this.clear(true, true);
            // timer for random shots
            this.timer = 0;

            this.direction = 0; // 0 = left, 1 = right
            this.x = 320; // the middle of the screen
            this.y = 20; // how much to move invaders per step
            this.speed = 0.05; // speed invaders move - you could change this per wave

            //  Create a grid of invaders - you could change the frame per wave
            this.createMultiple(
                [
                    {
                        classType: Enemy,
                        frameQuantity: 9,
                        setXY: {x: 100, y: 200, stepX: 50},
                        key: 'invaders',
                        frame: 'Invader1-0'
                    },
                    {
                        classType: Enemy,
                        frameQuantity: 9,
                        setXY: {x: 100, y: 250, stepX: 50},
                        key: 'invaders',
                        frame: 'Invader3-0'
                    },
                    {
                        classType: Enemy,
                        frameQuantity: 9,
                        setXY: {x: 100, y: 300, stepX: 50},
                        key: 'invaders',
                        frame: 'Invader3-0'
                    },
                    {
                        classType: Enemy,
                        frameQuantity: 9,
                        setXY: {x: 100, y: 350, stepX: 50},
                        key: 'invaders',
                        frame: 'Invader5-0'
                    },
                    {
                        classType: Enemy,
                        frameQuantity: 9,
                        setXY: {x: 100, y: 400, stepX: 50},
                        key: 'invaders',
                        frame: 'Invader5-0'
                    }
                ]
            );
        }
        

        update (delta) {
            
            const prevX = this.x;
            const prevY = this.y;

            if (this.direction === 0)
            {
                this.x -= (delta * this.speed);

                if (this.x <= 230)
                {
                    this.direction = 1;
                    this.x = 230;
                }
            }
            else
            {
                this.x += (delta * this.speed);

                if (this.x >= 440)
                {
                    this.direction = 0;
                    this.x = 440;
                }
            }
            const invaders = this.getChildren();

            //  Amount to move each invader by
            const moveX = prevX - this.x;


            invaders.forEach(invader => {
                invader.x -= moveX;
                if(this.x === 230) {
                    invader.y += this.y
                } else if (this.x === 440) {
                    invader.y += this.y
                }
                if (invader.y === 760) {
                    this.scene.gameOver();
                }
            });
             // timer to trigger random shots
            this.timer += delta;

            while(this.timer >= 1000) {
                let i = 0;
                let attacks = Phaser.Math.RND.integerInRange(0, this.scene.wave);
                while(i < attacks) {
                    let aliveInvaders = this.getChildren().filter(e => e.active === true);
                    let randomInvader = aliveInvaders[Phaser.Math.RND.integerInRange(0,aliveInvaders.length - 1)]
                    this.scene.enemyLaserGroup.fireEnemyLaser(randomInvader.x, randomInvader.y);
                    i++
                }
                this.timer -= 1000;
            }
        }
    }
    export default EnemyGroup;