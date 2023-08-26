import * as Phaser from 'phaser';


class MenuScene extends Phaser.Scene {
	constructor() {
		super({key : 'MenuScene', active:false})
		this.menuSceneBackgroundImage = null;
		this.textStyle = {font:'35px Arial', fill: '#555555', align:'center'};
	}

	init(data) {
		this.cameras.main.setBackgroundColor('#cccccc')
	}

	preload() {
		console.log("MenuScene");
		// this.load.image('menuSceneBackground', 'assets/aliens_screen_image2.jpg')
		this.load.image('startButton', '../assets/start.png')
		this.load.audio('selectSound','../assets/select.ogg')
	}

	create(data) {
		
		const startButton = this.add.sprite(0,0, 'startButton');
		// this.startButton = this.add.sprite(0,0, 'startButton');
		startButton.x = this.scale.displaySize.width/2;
		startButton.y = this.scale.displaySize.height/2;
		startButton.setScale(this.scale.displaySize.width/(1000));
		console.log(startButton);

		startButton.setInteractive({useHandCursor:true});
		startButton.on('pointerdown', () => this.clickButton())
		this.textStyle.wordWrap = {width : 0.9*this.scale.displaySize.width}
		const wellMessage = this.add.text(0,0,"Welcome\nTo The Brick Bang",this.textStyle)
		wellMessage.x = this.scale.displaySize.width/2 - wellMessage.width/2;
		wellMessage.y = startButton.y - wellMessage.height - 100;
        wellMessage.setStroke('#de77ae', 7);
        wellMessage.setShadow(2, 2, '#333333', 2, true, true);

        const howTitle = this.add.text(0,0,"How To Play :",this.textStyle)
		howTitle.x = 10;
		howTitle.y = this.scale.displaySize.height/1.5 - wellMessage.height/2;
		const howContent = [
			'- Click the Left Mouse Button To Shoot The Ball',
			'- Move the mouse left and right to move the pan',
			'- Press Space Bar to pause the game',
			'- Enjoy !!!'
		]
		this.textStyle.font = '20px Arial'
		this.textStyle.align = 'left'
		const howContentText = this.add.text(0,0,howContent,this.textStyle)
		howContentText.x = 10;
		howContentText.y = howTitle.y + howTitle.height + 10;
	}

	update(time, delta) {

	}
	clickButton() {
		console.log("Start Menu");
		this.sound.play('selectSound');
		this.scene.switch('GameScene');
	}
}

export default MenuScene;