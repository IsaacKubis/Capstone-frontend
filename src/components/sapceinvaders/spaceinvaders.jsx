import Phaser, { GameObjects } from "phaser";
import './spaceInvadersfont.scss'
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
import LaserGroup from "./spaceinvadersclasses/LaserGroup";
import EnemyGroup from "./spaceinvadersclasses/EnemyGroup";
import EnemyLaserGroup from "./spaceinvadersclasses/EnemyLaserGroup";
import GameMusic from '../../assets/spaceinvaders-sounds/game-Music.mp3'
function SpaceInvaders() {
    class BarrierGroup extends Phaser.Physics.Arcade.Group 
    {

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
            this.health = 5;
            this.lives = 3;
            this.frame = 0;
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
            this.load.audio('music', GameMusic)
            this.loadFont();
            
        }

        restart() {

        }

        create() {
            this.BackGround();
            this.createUi();
            this.laserGroup = new LaserGroup(this);
            this.enemyLaserGroup = new EnemyLaserGroup(this);
            this.enemyGroup = new EnemyGroup(this);
            this.laserShot = this.sound.add('laserShot');
            this.music = this.sound.add('music');
            this.music.play();
            this.music.setLoop(true);
            this.music.setVolume(.8)
            this.createText();
            this.addEvents();
            this.addShip();
            this.createHealth();
            this.createLives();
            this.barrierGroup = new BarrierGroup(this);
            //  You should do this only once, not in the update loop
            this.cursors = this.input.keyboard.addKeys(
                {up:Phaser.Input.Keyboard.KeyCodes.W,
                down:Phaser.Input.Keyboard.KeyCodes.S,
                left:Phaser.Input.Keyboard.KeyCodes.A,
                right:Phaser.Input.Keyboard.KeyCodes.D});
        }
        loadFont(){
            const fontLoader = this.add.text(0,0,'.', {fontFamily: 'munro'})
        }
        addEvents() {
            this.input.keyboard.on('keydown-SPACE', shoot => {
                this.shootLaser();
            });
        }

        shootLaser() {
            this.laserGroup.fireLaser(this.ship.x, this.ship.y, this.laserShot)
            this.physics.add.overlap(this.laserGroup, this.enemyGroup, this.damageEnemy, null, this)
        }

        damageEnemy (laser, enemy) {
            laser.disableBody(true,true)
            enemy.health -=1
            if (enemy.health === 0) {
            enemy.disableBody(true,true)
            this.score += enemy.points;
                this.scoreText.setText('Score: ' + this.score);
                if(this.enemyGroup.countActive(true) === 0){
                    this.wave += 1;
                    this.waveText.setText('Wave: ' + this.wave);
                    this.spawnEnemyGroup();
                }
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
        }

        createText() {
            this.scoreText = this.add.text(400, 55, 'Score: ' + this.score, { fontSize: '24px', color: '#9cdc44', fontFamily: 'munro'});
            this.waveText = this.add.text(400, 75, 'Wave: 1', { fontSize: '24px', color: '#9cdc44', fontFamily: 'munro' });
            this.coinText = this.add.text(414, 95, 'Coin: 0', { fontSize: '24px', color: '#9cdc44', fontFamily: 'munro' });
            this.livesText = this.add.text(375,850, 'Lives', { fontSize: '24px', color: '#9cdc44', fontFamily: 'munro' });
            this.healthText = this.add.text(210, 850, 'Health', { fontSize: '24px', color: '#9cdc44', fontFamily: 'munro'});
        }
        createHealth() {
            this.healthImage = this.add.sprite(240, 890, 'healthBar', 0)
            this.healthImage.setScale(2)

            this.physics.add.overlap(this.enemyLaserGroup, this.ship, this.takeDamage, null, this)
        }
        createLives() {
            this.livesImage = this.add.group();
            this.livesImage.createMultiple({
                key: 'invaders',
                frame: 'ship-0',
                setXY: {x: 370, y:890, stepX: 25},
                active: true,
                visible: true,
                repeat: 2,
                setScale: { x: 2, y: 2},
            });
        }
        takeDamage(ship, enemyLaser) {
            enemyLaser.disableBody(true,true)
            this.health -= 1;
            this.frame += 1
            this.healthImage.setFrame(this.frame)
            if(this.health === 0 && this.lives === 0) {
                this.gameOver();
            } else if (this.health === 0) {
                this.health = 5;
                this.frame = 0;
                this.healthImage.setFrame(this.frame)
                this.lives -= 1;
                let life = this.livesImage.getChildren().filter(e => e.active === true);
                life[life.length - 1].setTint(0xff0000)
                life[life.length - 1].setActive(false)
            } 
        }
        addShip() {
            this.ship = this.physics.add.sprite(320, 780, 'invaders', 'ship-0');
            this.ship.setCollideWorldBounds(true);
            this.ship.setScale(3)
        }
        gameOver() {
            this.scene.pause()

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