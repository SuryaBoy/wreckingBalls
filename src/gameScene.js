import * as Phaser from 'phaser';

class GameScene extends Phaser.Scene {

	constructor() {
		super({key : 'GameScene', active:false})
		this.gameSceneBackgroundImage = null;
		this.pan = null;
		this.panWidth = 100;
		this.panHeight = 25;
		this.cursors =null;
		this.panVel = 100;
		this.balls =null;
		this.bricks =null;
		this.gameover = false;
		this.ground =null;
		this.platforms =null;
		this.ballWidth = 25;
		this.ballYVel = 10;
		this.ballOnPan = true;	
		this.gameText = null;
		this.gameTextStyle = {font:'40px Arial',
				fill: '#e6e150',
				align:'center',
				wordWrap:{width:this.screenWidth/0.8},
			};
		this.centerX = null;
		this.centerY = null;
		this.screenWidth = null;
		this.screenHeight = null;
		this.staticBricks = null;
		this.levels = null;
		this.currentLevel = 9;
		this.gameMusic = null;
		this.gamePaused = false;
	}

	init(data) {
		this.cameras.main.setBackgroundColor('#000000');
		this.gameover = false;
		this.gameText = null;
		this.ballOnPan = true;
		this.gamePaused = false;
		console.log('In the init function , Ball on pan status : ' + this.ballOnPan)
		// this.ball = null;
	}

	preload() {
		console.log("gameScene");
	    this.load.image('ball', '../assets/ball3.png');
	    this.load.image('pan', '../assets/pan5.png');
	    // this.load.audio('panSound','../assets/panSound.ogg')
	    this.load.audio('brickSound','../assets/brickSound.ogg')
	    this.load.audio('selectSound','../assets/select.ogg')
	    this.load.audio('gameOverSound','../assets/gameOver.ogg')
	    this.load.audio('levelUpSound','../assets/levelUp.ogg')
	    this.load.audio('powerUpSound','../assets/powerUp.ogg')
		this.load.audio('gameMusic','../assets/gameMusic.mp3')
		this.load.json('levelsData', '../src/levels.json');
	}

	handlePointerMove(pointer) {
	  // Update sprite's x position based on mouse movement
	  this.pan.setVelocityX(-2*(this.pan.x-pointer.x)) ; 
	}

	create(data) {
		this.physics.resume();
	    // Get the center position of the game screen
	    this.centerX = this.scale.displaySize.width / 2;
	    this.centerY = this.scale.displaySize.height / 2;
 		this.screenWidth = this.scale.displaySize.width;
 		this.screenHeight = this.scale.displaySize.height;

	    this.pan = this.physics.add.sprite(this.centerX,this.cameras.main.height, 'pan');
	    this.pan.setScale(this.screenWidth/(900+this.panWidth));
	    this.pan.setCollideWorldBounds(true);
	    this.pan.setImmovable(true);

		const levelsData = this.cache.json.get('levelsData');
		this.levels = levelsData.levels;

		console.log(this.levels);
	    this.balls = this.physics.add.group();
	    this.addBallonPan(this.pan)
	    this.physics.add.collider(this.balls, this.pan, this.panBallCollide, null,this);
    	    // Initialize the first level
    	this.initializeLevel();
	    // this.physics.add.collider(this.balls,this.bricks, this.ballHitBrick,null,this)
	    //  Input Events

	    // Enable mouse input
	    this.input.on('pointermove', this.handlePointerMove, this);

	    this.input.on('pointerdown', this.shootBall, this);

	    this.physics.world.on('worldbounds', this.collidedWorld, this);

        // this.panSound = this.sound.add('panSound');
        this.brickSound = this.sound.add('brickSound');
        this.gameMusic = this.sound.add('gameMusic');
        this.gameMusic.volume = 0.3
        this.input.keyboard.on('keydown-SPACE', this.gamePause,this)
	}

	update(time, delta) {
		// console.log("Delta : " + delta)
	    if(this.balls.countActive() < 1) {
    		if(!this.gameover) {
				this.gameOver();
    		}
			// console.log('gameover')
	    }
        if (!this.gameMusic.isPlaying && !this.gameMusic.isPaused)
        {	
        	if(!this.gameover || !this.gamePaused)
            	{
            		this.gameMusic.play();
            	}
        }
	}

	ballHitBrick(ball, brick) {
		this.sound.play('brickSound')
	    // first of all get the item data from brick to check if it has item    
		switch(brick.getData('item')) {
			case 1:
				this.createBall(brick)
		      break;
			case 2:

		      break;
			default:
				// nothing
		}	    

	    // For example, you can remove the brick and change the ball's velocity
	    if(brick.getData('strength') <= 1) {
	    	brick.destroy(); // Remove the brick	
	    } else {
	    	brick.data.values.strength = brick.data.values.strength - 1;
	    }

	    console.log(this.bricks.countActive())
	    // if all the bricks are hit
	    if(this.bricks.countActive() < 1) {

    		this.transitionToNextLevel()
	    }
	}	

	addBallonPan(sprite) {
		const y = sprite.y - sprite.displayHeight
		
		const ball = this.balls.create(sprite.x, y, 'ball');
		//scalling the ball according the screen width 
		ball.setScale(this.screenWidth/(900+this.ballWidth));
		// set active and visible
		ball.setActive(true)
		ball.setVisible(true)
	    ball.setBounce(0);
	    ball.setCollideWorldBounds(true);

	    ball.allowGravity = true;
	    ball.body.onWorldBounds = true;
	    ball.setGravityY(100);
		// this.add.existing(carrot)
		// update the physics body size
		// carrot.body.setSize(carrot.width, carrot.height)
		// make sure body is enabed in the physics world
		this.physics.world.enable(ball)

		return (ball)
	}

	createBall(sprite) {
		const y = sprite.y + sprite.displayHeight + 20
		const x = sprite.x + sprite.displayWidth/2
		const ball = this.balls.create(x, y, 'ball');
		//scalling the ball according the screen width 
		ball.setScale(this.screenWidth/(900+this.ballWidth));
		ball.setCircle(ball.width/2);
		// set active and visible
		ball.setActive(true)
		ball.setVisible(true)
	    ball.setBounce(1);
	    ball.setCollideWorldBounds(true);

	    ball.allowGravity = false;
	    ball.body.onWorldBounds = true;
	    ball.setVelocity(100,-this.screenHeight/2)

		this.physics.world.enable(ball)
		this.sound.play('powerUpSound')
		return (ball)
	}

	resetScene() {

	    this.pan.setPosition(this.centerX,this.cameras.main.height);
	    this.ballOnPan = true;
	    this.currentLevel = 0;
	    this.physics.resume();
	    
	    this.scene.restart();
	    this.scene.switch('SplashScene');
	}

	panBallCollide(panCollide, ballCollide) {
        // if (!this.ballOnPan)
        // {
        //     this.panSound.play();
        // }
	}

	shootBall(the_ball) {
		console.log("On shoot Ball, ball on pan = " + this.ballOnPan)
		console.log("pan velocity = " + this.pan.body.velocity.x)
		if(this.ballOnPan == true) {
				const ball = this.balls.getFirst(true)
				if(ball) {
					ball.allowGravity = false;
					//if pan velocity is greater than 100 set the velocity
					// as its x velocity else give a 100 velocity to ball 
					// to avoid ball going directly up with no x velocity
					if(this.pan.body.speed > 100) {
						ball.setVelocity(this.pan.body.velocity.x/2,-this.screenHeight/2);
					} else {
						ball.setVelocity(100,-this.screenHeight/2);
					}
					ball.setBounce(1);
					ball.setGravityY(0);
					ball.setCircle(ball.width/2);
				}

			this.ballOnPan = false;
		}
 	}

 	// listener for pan if it collides with the world 
 	// for checking if it collids with the ground or bottom of the world
 	collidedWorld(sprite,up,down,left,right) {
 		// console.log('Collided World');
 		console.log('Ball bottom collide : ' + down);
 		console.log(sprite)
 		if(down) {
 			// destroying the sprite 
 			// which is the ball in most case
 			sprite.gameObject.destroy();
 		}
 	}

 	gameOver() {
 		this.physics.pause();
 		this.gameMusic.pause();
 		this.sound.play('gameOverSound');
			this.balls.children.iterate(child => {
				const ball = child
				ball.body.onWorldBounds = false
				this.balls.killAndHide(ball)
				this.physics.world.disableBody(ball)
			})
 		// this.physics.world.disableBody(this.ball);
 		this.gameTextStyle.wordWrap = {width : 0.9*this.screenWidth}
		this.gameText = this.add.text(0,0,'Game Over! \n Click to Play Again.', this.gameTextStyle);
		this.gameText.setPosition(this.centerX - this.gameText.width/2, this.centerY - this.gameText.height/2);
		this.gameText.setInteractive({useHandCursor:true});
		this.gameText.on('pointerdown', this.resetScene,this);

		this.gameover = true;
 	}

	createBricksForLevel(level) {
		const brickLayout  = level.brickLayout;
 		const cellWidth = Math.floor(this.screenWidth/brickLayout[0].length);
 		const cellHeight = Math.floor(cellWidth/3);
 		const bricks = this.physics.add.staticGroup();
 		const nRows = brickLayout.length;
 		const nCols = brickLayout[0].length;
	    const startX = (this.screenWidth - nCols * cellWidth)/2;
	    let startY = 0;

	    // if number of rows is less than or equal to 6
	    // its for adjusting the brick vertical placement 
	    if(nRows <= 6) {
	    	startY = (this.screenHeight/3 - nRows * cellHeight)/2;
	    } else {
	    	startY = (this.screenHeight/1.8 - nRows * cellHeight)/2;
	    }
	    
		for (let row = 0; row < nRows; row++) {
		    for (let col = 0; col < nCols; col++) {
		      const x = startX + col * cellWidth;
		      const y = startY + row * cellHeight;
		      // create brick for the number except 0
		      if (brickLayout[row][col] != 0) {
		      	const brickType = brickLayout[row][col] ;
		      	const brick = this.createBrick(x,y,cellWidth,cellHeight,brickType) ;
		      	bricks.add(brick);
		      }
		    }
	  	}
	  	this.add.existing(bricks);
	  	return bricks;
	}

	createBrick(x,y,cellWidth,cellHeight,brickType) {
		// Define properties based on the brick type
		let fillColor;
		let strokeColor;
		let strength;
		let item;

		switch(brickType) {
			case 1:
		      fillColor = 0x8bd4e0; 
		      strokeColor = 0xf7ab1e;
		      strength = 1;
		      item = 0;
		      break;
			case 2:
		      fillColor = 0x8bd4e0; 
		      strokeColor = 0xf7ab1e;
		      strength = 1;
		      item = 1;
		      break;
			default:
				fillColor = 0xffffff; // Default to white
				strokeColor = 0xaaaaaa;
				strength = 1;
				item = 0;
		}
		const rectangle = this.add.rectangle(x, y, cellWidth, cellHeight, fillColor);
		rectangle.setStrokeStyle(2, strokeColor);
		rectangle.setOrigin(0, 0);
		rectangle.setData({item: item, strength: strength});

		return rectangle;
	}

	initializeLevel() {
		const bricksForLevel = this.createBricksForLevel(this.levels[this.currentLevel]);

		// initialize the velocity of ball based on the level
		this.ballYVel = this.levels[this.currentLevel].velocityIncrement + (this.screenHeight/2);
		// Other level-specific setup

		// Add bricksForLevel to your scene as needed
		this.bricks = null;
		this.bricks = bricksForLevel;
		this.physics.resume();
		this.physics.add.collider(this.balls,this.bricks, this.ballHitBrick,null,this)
	}

	transitionToNextLevel() {
		this.currentLevel++;
		this.sound.play('levelUpSound')
		if (this.currentLevel < this.levels.length) {
			
			this.physics.pause();
			//remove the shootball function on pointer down as we are transiting towards nextlevel
			this.input.removeListener('pointerdown',this.shootball,this)
			this.resetBallPan();
			this.gameText = this.add.text(0,0,
			'Congratulations \n Click To Play Next Level.',
			 {font:'40px Arial',
			 fill: '#12c20c',
			 align:'center',
			 wordWrap:{width:0.9*this.screenWidth},
			});
			this.gameText.setPosition(this.centerX - this.gameText.width/2,
	 			this.centerY - this.gameText.height/2);
			this.gameText.setInteractive({useHandCursor:true});
			this.gameText.on('pointerdown', this.refreshScene,this);
		} else {
		  this.victory();
		}
	}

	resetBallPan() {
	    this.pan.setPosition(this.centerX,this.cameras.main.height);
	    this.balls.clear(true,true);
	    this.addBallonPan(this.pan);
	    this.ballOnPan = true;
	}

	clearText() {
		this.gameText.setText('');
		this.gameText.removeListener();
	}

	victory() {
    	this.physics.pause();
		this.gameText = this.add.text(0,0,
			'Congratulations You Won \n Click to Play Again.',
			 {font:'40px Arial',
			 fill: '#12c20c',
			 align:'center',
			 wordWrap:{width:0.9*this.screenWidth},
			});
		this.gameText.setPosition(this.centerX - this.gameText.width/2,
	 	this.centerY - this.gameText.height/2);
		this.gameText.setInteractive({useHandCursor:true});
		this.gameText.on('pointerdown', this.resetScene,this);
	}

	// before transiting to next level refresh the objects:
	refreshScene() {
		this.clearText();
		this.sound.play('selectSound');
		this.initializeLevel();
		this.gameover = false;
		// as the level has been initialized now when mouse is clicked the ball shoots
	    const timerEvent = this.time.addEvent({
	        delay: 500,
	        callback: this.delayPointerdown,
	        callbackScope: this,
	    });
		// this.input.on('pointerdown',this.shootBall,this)
	}

	delayPointerdown() {
		this.input.on('pointerdown',this.shootBall,this)
	}

	gamePause () {
		this.gamePaused = true;
		this.gameMusic.pause();
		this.physics.pause();
		if(this.gameText) {
			this.clearText()	
		}
		this.gameText = this.add.text(0,0,
			'Game Paused \n Click to Resume',
			 {font:'40px Arial',
			 fill: '#f0781d',
			 align:'center',
			 wordWrap:{width:0.9*this.screenWidth},
			});
		this.gameText.setPosition(this.centerX - this.gameText.width/2,
	 	this.centerY - this.gameText.height/2);
		this.gameText.setInteractive({useHandCursor:true});
		this.gameText.on('pointerdown', this.gameResume ,this);
		this.input.keyboard.on('keydown-SPACE', this.gameResume,this)
	}

	gameResume () {
		this.gameMusic.resume();
		this.gamePaused = false;
		this.clearText();
		this.physics.resume();
		this.sound.play('selectSound');
		this.input.keyboard.on('keydown-SPACE', this.gamePause,this)
	}

}

export default GameScene;