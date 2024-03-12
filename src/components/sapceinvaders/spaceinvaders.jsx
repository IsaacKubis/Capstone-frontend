import Phaser, { GameObjects } from "phaser";

import HealthBar from '../../assets/spaceinvaders-images/SpaceInvaders_Health.png'
import { act } from "@testing-library/react";
import background from '../../assets/spaceinvaders-images/SpaceInvaders_Background.png'
import borderBox from '../../assets/spaceinvaders-images/SpaceInvaders_Borders.png'
import laserShot from '../../assets/spaceinvaders-sounds/shoot02wav-14562.mp3'
import logo from '../../assets/spaceinvaders-images/SpaceInvaders_LogoLarge.png'
import spaceBackGround from '../../assets/tilemaps/spaceinvaderstile._background.csv'
import spaceInvaders from '../../assets/spaceinvaders-images/SpaceInvaders.png'
import spaceInvadersJson from '../../assets/Atlas-jsons/SpaceInvaders.json'
import ui from '../../assets/tilemaps/spaceinvaderstile._ui_ui.csv'

function SpaceInvaders() {
    class Laser extends Phaser.Physics.Arcade.Sprite 
    {
        constructor(scene, x, y) {
            super(scene,x,y,'invaders', 'player-laser-0')
            this.setScale(2)
        }

        fire(x,y) {
            this.enableBody(true, x+1, y, true, true)
            this.setVelocityY(-250);
        }
        
        preUpdate(time, delta) {
            super.preUpdate(time, delta);
            if (this.y <= 170) {
                this.disableBody(true, true);
            }
        }
    }
    class LaserGroup extends Phaser.Physics.Arcade.Group
    {
        constructor(scene) {
            super(scene.physics.world, scene,{
                classType: Laser,
                frameQuantity: 1,
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
    class Enemy extends Phaser.Physics.Arcade.Sprite
    {
        constructor(scene,x,y,key,frame) {
            super(scene,x,y,key,frame);
            this.setScale(2);
        }
    }
    class EnemyGroup extends Phaser.Physics.Arcade.Group
    {
        constructor(scene) {
            super(scene.physics.world, scene);

            this.resetEnemies();
        }

        resetEnemies ()
        {
            //  Clear everything in this Group
            this.clear(true, true);

            this.direction = 0; // 0 = left, 1 = right
            this.x = 320; // the middle of the screen
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
                        frame: 'Invader2-0'
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
                        frame: 'Invader4-0'
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

            //  Amount to move each invader by
            const moveX = prevX - this.x;

            const invaders = this.getChildren();

            invaders.forEach(invader => {

                invader.x -= moveX;

            });
        }
    }

    class SpaceInvaders extends Phaser.Scene
    {
        score;

        constructor() {
            super();
            this.ship = null;
            this.backGround = null;
            this.laserGroup = null;
            this.enemyGroup = null;
            this.enemy = null;
            this.score = 0;
            this.wave = 1;
        }

        preload() {
            this.load.tilemapCSV('map', spaceBackGround);
            this.load.image('background', background);
            this.load.image('borderBox', borderBox);
            this.load.tilemapCSV('ui', ui);
            this.load.image('logo', logo);
            this.load.atlas('invaders', spaceInvaders, spaceInvadersJson)
            this.load.spritesheet({
                key: 'healthBar',
                url: HealthBar,
                frameConfig: {
                    frameWidth: 32,
                    frameHeight: 16,
                }
            });
            this.load.audio('laserShot', laserShot)
        }

        create() {
            this.BackGround();
            this.createUi();
            this.laserGroup = new LaserGroup(this);
            this.enemyGroup = new EnemyGroup(this);
            this.laserShot = this.sound.add('laserShot');
            this.createText();
            this.addEvents();
            this.addShip();

            //  You should do this only once, not in the update loop
            this.cursors = this.input.keyboard.addKeys(
                {up:Phaser.Input.Keyboard.KeyCodes.W,
                down:Phaser.Input.Keyboard.KeyCodes.S,
                left:Phaser.Input.Keyboard.KeyCodes.A,
                right:Phaser.Input.Keyboard.KeyCodes.D});
        }
        addEvents() {
            this.input.keyboard.on('keydown-SPACE', shoot => {
                this.shootLaser();
            });
        }

        shootLaser() {
            this.laserGroup.fireLaser(this.ship.x, this.ship.y, this.laserShot)
            this.physics.add.overlap(this.laserGroup, this.enemyGroup, this.destroyEnemy, null, this)
        }

        destroyEnemy (laser, enemy) {
            laser.disableBody(true,true)
            enemy.disableBody(true,true)
            // enemy.destroy();
            this.score += 100;
            this.scoreText.setText('Score: ' + this.score);
            if(this.enemyGroup.countActive(true) === 0){
                this.spawnEnemyGroup();
                this.wave += 1;
                this.waveText.setText('Wave: ' + this.wave);
            }
        }

        spawnEnemyGroup() {
            this.enemyGroup.resetEnemies();
        }

        BackGround() {
            const map = this.make.tilemap({key: 'map', tileWidth: 16, tileHeight: 16});
            const tileSet = map.addTilesetImage('background')
            const layer = map.createLayer(0, tileSet, 0, 0);
        }
        
        createUi() {
            const map2 = this.make.tilemap({key: 'ui', tileWidth: 16, tileHeight: 16});
            const tileSet2 = map2.addTilesetImage('borderBox')
            const layer2 = map2.createLayer(0, tileSet2, 0, 0);
            this.spriteLogo = this.add.image(200,110, 'logo')
            this.spriteLogo.setScale(.5);
            this.healthImage = this.add.sprite(240, 890, 'healthBar', 0)
            this.healthImage.setScale(2)
            this.livesImage = this.add.group();
            this.livesImage.createMultiple({
                key: 'invaders',
                frame: 'ship-0',
                setXY: {x: 370, y:890, stepX: 25},
                repeat: 2,
                setScale: { x: 2, y: 2},
            });
        }

        createText() {
            this.scoreText = this.add.text(385, 55, 'Score: ' + this.score, { fontSize: '24px', fill: '#000' });
            this.waveText = this.add.text(400, 75, 'Wave: 1', { fontSize: '24px', fill: '#000' });
            this.coinText = this.add.text(400, 95, 'Coin: 0', { fontSize: '24px', fill: '#000' });
            this.livesText = this.add.text(360,850, 'Lives', { fontSize: '24px', fill: '#000' });
            this.healthText = this.add.text(200, 850, 'Health', { fontSize: '24px', fill: '#000'});
        }
        addShip() {
            this.ship = this.physics.add.sprite(320, 780, 'invaders', 'ship-0');
            this.ship.setCollideWorldBounds(true);
            this.ship.setScale(3)
        }

        update(time, delta) {

            this.enemyGroup.update(delta);

            if (this.cursors.left.isDown)
            {
                this.ship.setVelocityX(-180);
            }
            else if (this.cursors.right.isDown)
            {
                this.ship.setVelocityX(180);
            } else {
                this.ship.setVelocityX(0)
            }
            
        };
    }

    const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 920,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { y: 0 }
            }
        },
        scene: SpaceInvaders
    };

    const game = new Phaser.Game(config);
}

export default SpaceInvaders;