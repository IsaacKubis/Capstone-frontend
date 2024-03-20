import Phaser, { NONE } from "phaser";
import Enemy from "./Enemy";
class EnemyGroup extends Phaser.Physics.Arcade.Group
    {
        constructor(scene) {
            super(scene.physics.world, scene);
            this.createAnimations();
            this.resetEnemies();
        }


        createAnimations() {
            this.scene.anims.create({
                key: 'invader1', frames: this.scene.anims.generateFrameNames('invaders', {frames: ['Invader1-0', 'Invader2-0']}), frameRate: 1, repeat: -1
            })
            this.scene.anims.create({
                key: 'invader2', frames: this.scene.anims.generateFrameNames('invaders', {frames: ['Invader3-0', 'Invader4-0']}), frameRate: 1, repeat: -1
            })
            this.scene.anims.create({
                key: 'invader3', frames: this.scene.anims.generateFrameNames('invaders', {frames: ['Invader5-0', 'Invader6-0']}), frameRate: 1, repeat: -1
            })
            this.scene.anims.create({
                key: 'invader4', frames: this.scene.anims.generateFrameNames('invaders', {frames: ['Invader7-0', 'Invader8-0']}), frameRate: 1, repeat: -1
            })
            this.scene.anims.create({
                key: 'invader5', frames: this.scene.anims.generateFrameNames('invaders', {frames: ['Invader9-0', 'Invader10-0']}), frameRate: 1, repeat: -1
            })
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
            this.speed = 0.05 + this.scene.wave / 100; // speed invaders move - you could change this per wave
            console.log(this.speed)
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
            const invaders = this.getChildren()
            if (this.scene.wave === 2) {
                invaders.forEach(invader => {
                    if (invader.frame.name === 'Invader1-0') {
                        invader.frame.name = 'Invader9-0'
                    }
                })
            }
            console.log(this.scene.wave)
            invaders.forEach(invader => {
                if (invader.frame.name === 'Invader1-0') {
                    invader.play('invader1')
                    invader.health = 2;
                    invader.points = 200;
                } else if (invader.frame.name === 'Invader3-0') {
                    invader.play('invader2')
                    invader.health = 1;
                    invader.points = 100;
                } else if (invader.frame.name === 'Invader5-0') {
                    invader.play('invader3')
                    invader.health = 1;
                    invader.points = 100;
                } else if (invader.frame.name === 'Invader7-0') {
                    invader.play('invader4')
                    invader.health = 2;
                    invader.points = 300;
                } else if (invader.frame.name === 'Invader9-0') {
                    invader.play('invader5')
                    invader.health = 3;
                    invader.points = 400;
                }
            })
        }   
        

        update (delta) {
            const prevX = this.x;

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
                // move invader 
                invader.x -= moveX;
                if(this.x === 230) {
                    invader.y += this.y
                } else if (this.x === 440) {
                    invader.y += this.y
                }
                //end game if y reaches to low
                if(invader.y >= 700 && invader.active === true) {
                    console.log(invader)
                    this.scene.gameOver();
                }
                // set tint to allow player to know health of enemy
                if (invader.health === 3) {
                    invader.setTint(0x1A2421)
                } else if (invader.health === 2) {
                    invader.setTint(0x0B6623)
                } else if (invader.health === 1) {
                    invader.clearTint()
                }
            });
             // timer to trigger random shots
            this.timer += delta;

            while(this.timer >= (2000 - (this.scene.wave * 100))) {
                let i = 0;
                let attacks = Phaser.Math.RND.integerInRange(0, this.scene.wave + 1);
                while(i < attacks) {
                    let aliveInvaders = this.getChildren().filter(e => e.active === true);
                    let randomInvader = aliveInvaders[Phaser.Math.RND.integerInRange(0,aliveInvaders.length - 1)]
                    this.scene.enemyLaserGroup.fireEnemyLaser(randomInvader.x, randomInvader.y);
                    i++
                }
                this.timer -= (2000 - (this.scene.wave * 100));
            }
        }
    }
    export default EnemyGroup;