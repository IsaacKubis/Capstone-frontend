/* eslint-disable no-unused-expressions */

import Phaser from "phaser";
import background from '../../assets/spaceinvaders-images/SpaceInvaders_Background.png'
import borderBox from '../../assets/spaceinvaders-images/SpaceInvaders_Borders.png'
import spaceBackGround from '../../assets/tilemaps/spaceinvaderstile._background.csv'
import ui from '../../assets/tilemaps/spaceinvaderstile._ui_ui.csv'
import logo from '../../assets/spaceinvaders-images/SpaceInvaders_LogoLarge.png'
import HealthBar from '../../assets/spaceinvaders-images/SpaceInvaders_Health.png'
import spaceInvaders from '../../assets/spaceinvaders-images/SpaceInvaders.png'

function SpaceInvaders() {
    class Laser extends Phaser.Physics.Arcade.Sprite 
    {
        constructor(scene, x, y) {
            super(scene,x,y, 'spaceInvaders', 2)
        }

        fire(x,y) {
            this.body.reset(x+3,y);
            this.setScale(2)
            this.setActive(true);
            this.setVisible(true);
            this.setVelocityY(-250);
        }
        preUpdate(time, delta) {
            super.preUpdate(time, delta);
            if (this.y <= 170) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    }
    class LaserGroup extends Phaser.Physics.Arcade.Group
    {
        constructor(scene) {
            super(scene.physics.world, scene);
            this.createMultiple({
                classType: Laser,
                frameQuantity: 1,
                active: false,
                visible: false,
                key: 'laser'
            })
        }
        fireLaser(x,y) {
            const laser = this.getFirstDead(false);
            if (laser) {
                laser.fire(x,y)
            }
        }
    }
    // class Enemy extends Phaser.Physics.Arcade.Sprite
    // {
    //     constructor(scene) {
    //         super(scene, 'spaceinvaders', 1);
    //     }
    //     createEnemies() {
    //         let x = 300;
    //         let y = 300;
    //         this.body.reset(x,y);
    //         this.setScale(2)
    //         this.setActive(true);
    //         this.setVisible(true);
    //     };
    // }
    // class EnemyGroup extends Phaser.Physics.Arcade.Group
    // {
    //     constructor(scene) {
    //         super(scene.physics.world, scene);
    //         this.createMultiple({
    //             classType: Enemy,
    //             frameQuantity: 5,
    //             active: false,
    //             visible: false,
    //             key: 'enemy'
    //         })
    //     }
    //     createEnemy() {
    //         const enemy = this.getFirstDead(false);
    //         enemy.createEnemies()
    //     }
    // }
    class SpaceInvaders extends Phaser.Scene
    {
        constructor() {
            super();
            this.ship;
            this.backGround;
            this.laserGroup;
            // this.enemeyGroup;
            this.enemy;
        }

        preload() {
            this.load.tilemapCSV('map', spaceBackGround);
            this.load.image('background', background);
            this.load.image('borderBox', borderBox);
            this.load.tilemapCSV('ui', ui);
            this.load.image('logo', logo);
            this.load.spritesheet({
                key: 'spaceInvaders',
                url: spaceInvaders,
                frameConfig: {
                    frameWidth: 16,
                    frameHeight: 16,
                }
            })
            this.load.spritesheet({
                key: 'healthBar',
                url: HealthBar,
                frameConfig: {
                    frameWidth: 32,
                    frameHeight: 16,
                }
            });
        }

        create() {
            this.BackGround();
            this.createUi();
            this.addEvents();
            this.laserGroup = new LaserGroup(this);
            this.addShip();
            this.enemyGroup();
            // this.enemyGroup = new EnemyGroup(this);
        }
        addEvents() {
            this.input.keyboard.on('keydown-SPACE', shoot => {
                this.shootLaser();
            });
            this.physics.add.overlap(Laser, this.enemy, destroyEnemy, null, this)
            function destroyEnemy() {
                this.enemy.disableBody(true,true)
            }
        }

        shootLaser() {
            this.laserGroup.fireLaser(this.ship.x, this.ship.y)
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
            this.scoreText = this.add.text(385, 55, 'Score: 0', { fontSize: '24px', fill: '#000' });
            this.waveText = this.add.text(400, 75, 'Wave: 0', { fontSize: '24px', fill: '#000' });
            this.coinText = this.add.text(400, 95, 'Coin: 0', { fontSize: '24px', fill: '#000' });
            this.livesText = this.add.text(360,850, 'Lives', { fontSize: '24px', fill: '#000' });
            this.healthText = this.add.text(200, 850, 'Health', { fontSize: '24px', fill: '#000'});
            this.healthImage = this.add.sprite(240, 890, 'healthBar')
            this.healthImage.setScale(2)
            this.livesImage = this.add.group();
            this.livesImage.createMultiple({
                key: 'spaceInvaders',
                frame: '4',
                setXY: {x: 370, y:890, stepX: 25},
                repeat: 2,
                setScale: { x: 2, y: 2},
            })
        }
        addShip() {
            this.ship = this.physics.add.sprite(320, 780, 'spaceInvaders', 4);
            this.ship.setCollideWorldBounds(true);
            this.ship.setScale(3)
        }
        enemyGroup() {
            this.enemy = this.physics.add.group({
                key: 'spaceInvaders',
                repeat: 9,
                setScale: {x: 2, y: 2},
                setXY: { x: 100, y: 200, stepX: 50 }
            })
        }
        update() {
            let cursors = this.input.keyboard.addKeys(
                {up:Phaser.Input.Keyboard.KeyCodes.W,
                down:Phaser.Input.Keyboard.KeyCodes.S,
                left:Phaser.Input.Keyboard.KeyCodes.A,
                right:Phaser.Input.Keyboard.KeyCodes.D});

            if (cursors.left.isDown)
            {
                this.ship.setVelocityX(-180);
            }
            else if (cursors.right.isDown)
            {
                this.ship.setVelocityX(180);
            } else {
                this.ship.setVelocityX(0)
            }
        }
        
    }

    const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 920,
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