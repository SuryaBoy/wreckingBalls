import * as Phaser from 'phaser';
// https://newdocs.phaser.io
import MenuScene from './menu.js';
import GameScene from './gameScene.js';
import SplashScene from './splashScene.js';

// our game scene
const menuScene = new MenuScene();
const gameScene = new GameScene();
const splashScene = new SplashScene();

let config = {
    type: Phaser.AUTO,
    scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '80%',
    height: '100%',
    },
    backgrounColor: 0xff0000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        }
    },
};

const game = new Phaser.Game(config);

// console.log(splashScene);

// load scene
// Note: remember any "key" is global and cannot be reused

game.scene.add('menuScene', menuScene);
game.scene.add('gameScene',gameScene);
game.scene.add('splashScene',splashScene);

// start title
game.scene.start('SplashScene');
// game.scene.stop(splashScene);
// console.log(game.scene);

export default game;