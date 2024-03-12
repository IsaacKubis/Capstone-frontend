import Phaser, { GameObjects } from "phaser";
import background from '../../assets/spaceinvaders-images/SpaceInvaders_Background.png'
import borderBox from '../../assets/spaceinvaders-images/SpaceInvaders_Borders.png'
import spaceBackGround from '../../assets/tilemaps/spaceinvaderstile._background.csv'
import ui from '../../assets/tilemaps/spaceinvaderstile._ui_ui.csv'
import logo from '../../assets/spaceinvaders-images/SpaceInvaders_LogoLarge.png'
import HealthBar from '../../assets/spaceinvaders-images/SpaceInvaders_Health.png'
import spaceInvaders from '../../assets/spaceinvaders-images/SpaceInvaders.png'
import spaceInvadersJson from '../../assets/Atlas-jsons/SpaceInvaders.json'
import laserShot from '../../assets/spaceinvaders-sounds/shoot02wav-14562.mp3'
import { act } from "@testing-library/react";
function SpaceInvaders() {
    class Laser extends Phaser.Physics.Arcade.Sprite 
    {
        constructor(scene, x, y) {
            super(scene,x,y,'invaders', 'player-laser-0')
        }

        fire(x,y) {
            this.enableBody(true, x+1, y, true, true)
            // this.body.reset(x+1,y);
            // this.body.setSize(5,10)
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
        constructor(scene,x,y) {
            super(scene,x,y, 'invaders', 'Invader1-0');
        }
        createEnemies() {
            this.enableBody(true, this.x, this.y, true, true)
            this.setScale(2);
            this.setActive(true);
            this.setVisible(true);
            this.setFrame('Invader1-0')
            
        };
    }
    class EnemyGroup extends Phaser.Physics.Arcade.Group
    {
        constructor(scene) {
            super(scene.physics.world, scene);
            this.createMultiple([
                {
                    classType: Enemy,
                    frameQuantity: 9,
                    setXY: {x: 100, y: 200, stepX: 50},
                    active: false,
                    visible: false,
                    key: 'enemy'
                },
                {
                    classType: Enemy,
                    frameQuantity: 9,
                    setXY: {x: 100, y: 250, stepX: 50},
                    active: false,
                    visible: false,
                    key: 'enemy'
                },
                {
                    classType: Enemy,
                    frameQuantity: 9,
                    setXY: {x: 100, y: 300, stepX: 50},
                    active: false,
                    visible: false,
                    key: 'enemy'
                },
                {
                    classType: Enemy,
                    frameQuantity: 9,
                    setXY: {x: 100, y: 350, stepX: 50},
                    active: false,
                    visible: false,
                    key: 'enemy'
                },
                {
                    classType: Enemy,
                    frameQuantity: 9,
                    setXY: {x: 100, y: 400, stepX: 50},
                    active: false,
                    visible: false,
                    key: 'enemy'
                }
            ])
        }
        createEnemy(group) {
            let grouping = group.getChildren();
            let invaders = grouping[0].getChildren();
            invaders.forEach(enemy => {
                enemy.createEnemies();
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
            this.enemyGroups();
        }
        addEvents() {
            this.input.keyboard.on('keydown-SPACE', shoot => {
                this.shootLaser();
            });
        }

        shootLaser() {
            this.laserGroup.fireLaser(this.ship.x, this.ship.y, this.laserShot)
            this.physics.add.overlap(this.laserGroup, this.enemyGroup, destroyEnemy, null, this)
            function destroyEnemy(laser, enemy) {
                laser.disableBody(true,true)
                enemy.disableBody(true,true)
                // enemy.destroy();
                this.score += 100;
                this.scoreText.setText('Score: ' + this.score);
                if(this.enemyGroup.countActive(true) === 0){
                    this.enemyGroups();
                    this.wave += 1;
                    this.waveText.setText('Wave: ' + this.wave);
                }
            }
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
        enemyGroups() {
            const group = this.add.group([this.enemyGroup]);
            this.enemyGroup.createEnemy(group)
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
            
        };
    }

    const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 920,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
                gravity: { y: 0 }
            }
        },
        scene: SpaceInvaders
    };

    const game = new Phaser.Game(config);
}

export default SpaceInvaders;