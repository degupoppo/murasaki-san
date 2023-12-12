

//231212
version = "v0.1.5";
document.getElementById("version").innerText = version;

/*

ToDo
    pop演出の変更
 ng     可能ならお花まきの演出
    BGMならない問題の修正
 ok 画面端の挙動の改善
 ok     跳ね返ることがあったので、ランダムで回転させるのを無効化
 ok 説明文の実装
 ok スコア表示の独自化
 ng 床の絵の変更HoMの床と同一とする
 ng ホームボタンの実装
 ok SEの選別
 ok bgmの設定
 ok lose heightの調整
 ok 画面外に捨てれるバグの修正
 ok 画面をちょっと動かす機能
*/


// prepare matter.js
const {Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Events} = Matter;


// define game parameters
const wallPad = 64;
const loseHeight = 84;
const statusBarHeight = 48;
const friction = {
    friction: 0.006*10,
    frictionStatic: 0.006*10,
    frictionAir: 0,
    restitution: 0.1
};


// define e game status
const GameStates = {
    MENU: 0,
    READY: 1,
    DROP: 2,
    LOSE: 3,
    SHAKE: 4,
};



//--- class: Game2
class class_Game2 {
    
    //### constructor
    constructor() {

        this.width = 640;
        this.height = 960;

    	this.elements = {
    		canvas: document.getElementById('canvas'),
    		ui: document.getElementById('ui'),
    		score: document.getElementById('current-score'),
    		end: document.getElementById('end-container'),
    		endTitle: document.getElementById('end-title'),
    		statusValue: document.getElementById('highscore-value'),
    		nextFruitImg: document.getElementById('next-fluffy'),
    		previewBall: null,
    		shakeButton: document.getElementById('shakeButton'),
    	};

    	this.fruitSizes = [
    		{ radius: 24,  scoreValue: 1,  img: './assets/png/circle0.png'  },
    		{ radius: 32,  scoreValue: 3,  img: './assets/png/circle1.png'  },
    		{ radius: 40,  scoreValue: 6,  img: './assets/png/circle2.png'  },
    		{ radius: 56,  scoreValue: 10, img: './assets/png/circle3.png'  },
    		{ radius: 64,  scoreValue: 15, img: './assets/png/circle4.png'  },
    		{ radius: 72,  scoreValue: 21, img: './assets/png/circle5.png'  },
    		{ radius: 84,  scoreValue: 28, img: './assets/png/circle6.png'  },
    		{ radius: 96,  scoreValue: 36, img: './assets/png/circle7.png'  },
    		{ radius: 128, scoreValue: 45, img: './assets/png/circle8.png'  },
    		{ radius: 160, scoreValue: 55, img: './assets/png/circle9.png'  },
    		{ radius: 192, scoreValue: 66, img: './assets/png/circle10.png' },
    	];
    	
    	this.cache = { highscore: 0 };
    	this.stateIndex = GameStates.MENU;
    	this.score = 0;
    	this.fruitsMerged = [];
    	this.currentFruitSize = 0;
    	this.nextFruitSize = 0;
        
        // prepare walls
        const wallProps = {
        	isStatic: true,
        	render: { fillStyle: '#FDBEFF', layer: 1 },
        	...friction,
        };
        this.gameStatics = [
        	// Left
        	Bodies.rectangle(-(wallPad / 2), this.height / 2, wallPad, this.height, wallProps),
        	// Right
        	Bodies.rectangle(this.width + (wallPad / 2), this.height / 2, wallPad, this.height, wallProps),
        	// Bottom
        	Bodies.rectangle(this.width / 2, this.height + (wallPad / 2) - statusBarHeight, this.width, wallPad, wallProps),
        ];
        
    	// prepare sounds
    	this.sounds = {
    		click: new Audio('./assets/sound/click.mp3'),
    		pop0: new Audio('./assets/sound/pop0.mp3'),
    		pop1: new Audio('./assets/sound/pop1.mp3'),
    		pop2: new Audio('./assets/sound/pop2.mp3'),
    		pop3: new Audio('./assets/sound/pop3.mp3'),
    		pop4: new Audio('./assets/sound/pop4.mp3'),
    		pop5: new Audio('./assets/sound/pop5.mp3'),
    		pop6: new Audio('./assets/sound/pop6.mp3'),
    		pop7: new Audio('./assets/sound/pop7.mp3'),
    		pop8: new Audio('./assets/sound/pop8.mp3'),
    		pop9: new Audio('./assets/sound/pop9.mp3'),
    		pop10: new Audio('./assets/sound/pop10.mp3'),
    		fluffy2: new Audio("./assets/sound/fluffy2.mp3"),
    		fluffy3: new Audio("./assets/sound/fluffy3.mp3"),
    		fluffy4: new Audio("./assets/sound/fluffy4.mp3"),
    		fluffy5: new Audio("./assets/sound/fluffy5.mp3"),
    		shake: new Audio("./assets/sound/shake.mp3"),
    	};
    	this.sounds.fluffy2.volume = 0.3;
    	this.sounds.fluffy3.volume = 0.3;
    	this.sounds.fluffy4.volume = 0.3;
    	this.sounds.fluffy5.volume = 0.3;
    	this.sounds.shake.volume = 0.3;

        // prepare music
        this.music = new Audio("./assets/music/パステルハウス.mp3");
        this.music.loop = true;
		this.music.volume = 0.08;
    }


    //### init
	init() {
		
        // init matter.js
        this.engine = Engine.create();
        this.runner = Runner.create();
        this.render = Render.create({
        	element: this.elements.canvas,
        	engine: this.engine,
        	options: {
        		width: this.width,
        		height: this.height,
        		wireframes: false,
        		background: '#fff1ff'
        	}
        });

		// resize
		this.resizeCanvas();
        
        // prepare menu statics
        const menuStatics = [
        	Bodies.rectangle(this.width / 2, this.height * 0.35, 512, 512, {
        		isStatic: true,
        		render: { sprite: { texture: './assets/png/bg-menu.png' } },
        	}),

        	// Add each fruit in a circle
        	...Array.apply(null, Array(this.fruitSizes.length)).map((_, index) => {
        		const x = (this.width / 2) + 192 * Math.cos((Math.PI * 2 * index)/12);
        		const y = (this.height * 0.35) + 192 * Math.sin((Math.PI * 2 * index)/12);
        		const r = 64;

        		return Bodies.circle(x, y, r, {
        			isStatic: true,
        			render: {
        				sprite: {
        					texture: `./assets/png/circle${index}.png`,
        					xScale: r / 1024,
        					yScale: r / 1024,
        				},
        			},
        		});
        	}),

        	Bodies.rectangle(this.width / 2, this.height * 0.75, 512, 96, {
        		isStatic: true,
        		label: 'btn-start',
        		render: { sprite: { texture: './assets/png/btn-start.png' } },
        	}),
        ];
        this.menuStatics = menuStatics;

        // prepare mouse control
        const mouse = Mouse.create(this.render.canvas);
        const mouseConstraint = MouseConstraint.create(this.engine, {
        	mouse: mouse,
        	constraint: {
        		stiffness: 0.2,
        		render: {
        			visible: false,
        		},
        	},
        });
        this.mouseConstraint = mouseConstraint;
        this.render.mouse = mouse;

        // start render
		Render.run(this.render);
		Runner.run(this.runner, this.engine);

        // prepare game menu
		Composite.add(this.engine.world, this.menuStatics);

        // init
		this.loadHighscore();
		this.elements.ui.style.display = 'none';
		this.fruitsMerged = Array.apply(null, Array(this.fruitSizes.length)).map(() => 0);

        // prepare start button
		const menuMouseDown = () => {
			if (this.mouseConstraint.body === null || this.mouseConstraint.body?.label !== 'btn-start') {
				return;
			}
			Events.off(this.mouseConstraint, 'mousedown', menuMouseDown);
			this.startGame();
		}
		Events.on(this.mouseConstraint, 'mousedown', menuMouseDown);
		
		// show description
		let _text = "- Combine two fluffies of the same size to evolve into one larger fluffy.<br>- Pressing the shake button will make the fluffies bounce a little.<br>- The game ends when the fluffies' lower limit exceeds the dashed line.<br>";
		document.getElementById("description").innerHTML = _text;

	}


	//### startGame
	startGame() {
		
		// remove version and description
		document.getElementById("version").innerText = "";
		document.getElementById("description").innerText = "";
		
		// start music
		this.music.play();
        
        // remove game menu
		Composite.remove(this.engine.world, this.menuStatics);
		
		// prepare walls
		Composite.add(this.engine.world, this.gameStatics);
		
		// prepare shake button
	    this.shakeButton = Bodies.rectangle(
	        615,
	        935,
	        10,
	        10,
	        {
	            isStatic: true,
	            render: {
	                sprite: {
	                    texture: './assets/png/icon_shake.png',
    					xScale: 0.1,
    					yScale: 0.1,
	                },
	                layer: 0,
	            }
	        }
	    )
		Composite.add(this.engine.world, [this.shakeButton]);
        
		this.calculateScore();
		this.elements.endTitle.innerText = 'Too Many Fluffies!';
		this.elements.ui.style.display = 'block';
		this.elements.end.style.display = 'none';
		this.elements.previewBall = this.generateFruitBody(this.width / 2, 50, 0, { isStatic: true });
		Composite.add(this.engine.world, this.elements.previewBall);

		setTimeout(() => {
			this.stateIndex = GameStates.READY;
		}, 250);
        
        // event: mouse click
		Events.on(this.mouseConstraint, 'mouseup', (e) => {
		    // get mouse position
		    const mousePosition = e.mouse.position;
		    console.log(Math.floor(mousePosition.x), Math.floor(mousePosition.y));
		    // shake button
		    if (
		        mousePosition.x > 595 
		        && mousePosition.y > (this.height-statusBarHeight) 
		    ) {
		        this.shake();
		    // drop fluffy
		    } else if (mousePosition.y <= (this.height-statusBarHeight)) {
    			this.addFruit(e.mouse.position.x);
    	    }
		});
        
        // event: mouse move
		Events.on(this.mouseConstraint, 'mousemove', (e) => {
			if (this.stateIndex !== GameStates.READY) return;
			if (this.elements.previewBall === null) return;
			this.elements.previewBall.position.x = e.mouse.position.x;
			// check radius
			if (this.elements.previewBall.position.x < this.fruitSizes[this.elements.previewBall.sizeIndex].radius) {
			    this.elements.previewBall.position.x = this.fruitSizes[this.elements.previewBall.sizeIndex].radius;
			} else if (this.elements.previewBall.position.x > this.width - this.fruitSizes[this.elements.previewBall.sizeIndex].radius) {
			    this.elements.previewBall.position.x = this.width - this.fruitSizes[this.elements.previewBall.sizeIndex].radius;
			}
		});

		Events.on(this.engine, 'collisionStart', (e) => {
			for (let i = 0; i < e.pairs.length; i++) {
				const { bodyA, bodyB } = e.pairs[i];

				// Skip if collision is wall
				if (bodyA.isStatic || bodyB.isStatic) continue;

				const aY = bodyA.position.y + bodyA.circleRadius;
				const bY = bodyB.position.y + bodyB.circleRadius;

				// Uh oh, too high!
				//***TODO*** lose line
				if (aY < loseHeight || bY < loseHeight) {
				    if (this.stateIndex != GameStates.SHAKE) {
    					this.loseGame();
    					return;
    			    }
				}

				// Skip different sizes
				if (bodyA.sizeIndex !== bodyB.sizeIndex) continue;

				let newSize = bodyA.sizeIndex + 1;

				// Go back to smallest size
				if (bodyA.circleRadius >= this.fruitSizes[this.fruitSizes.length - 1].radius) {
					newSize = 0;
				}

				this.fruitsMerged[bodyA.sizeIndex] += 1;

				// Therefore, circles are same size, so merge them.
				const midPosX = (bodyA.position.x + bodyB.position.x) / 2;
				const midPosY = (bodyA.position.y + bodyB.position.y) / 2;
				
				this.sounds[`pop${bodyA.sizeIndex}`].play();
				Composite.remove(this.engine.world, [bodyA, bodyB]);
				Composite.add(this.engine.world, this.generateFruitBody(midPosX, midPosY, newSize));
				this.addPop(midPosX, midPosY, bodyA.circleRadius);
				this.calculateScore();
			}
		});
	}


    //### other functions

	calculateScore() {
		const score = this.fruitsMerged.reduce((total, count, sizeIndex) => {
			const value = this.fruitSizes[sizeIndex].scoreValue * count;
			return total + value;
		}, 0);
		this.score = score;
		this.elements.score.innerText = this.score;
	}


	setNextFruitSize() {
		this.nextFruitSize = Math.floor(Math.random() * 5);
		this.elements.nextFruitImg.src = `./assets/png/circle${this.nextFruitSize}.png`;
	}


	showHighscore() {
		this.elements.statusValue.innerText = this.cache.highscore;
	}


	loadHighscore() {
		const gameCache = localStorage.getItem('suika-game-cache');
		if (gameCache === null) {
			this.saveHighscore();
			return;
		}
		this.cache = JSON.parse(gameCache);
		this.showHighscore();
	}


	saveHighscore() {
		this.calculateScore();
		if (this.score < this.cache.highscore) return;
		this.cache.highscore = this.score;
		this.showHighscore();
		this.elements.endTitle.innerText = 'New Best Score!';
		localStorage.setItem('suika-game-cache', JSON.stringify(this.cache));
	}


	addPop (x, y, r) {
		const circle = Bodies.circle(x, y, r, {
			isStatic: true,
			collisionFilter: { mask: 0x0040 },
			angle: Math.random() * (Math.PI * 2),
			render: {
				sprite: {
					texture: './assets/png/pop.png',
					//xScale: r / 384,
					//yScale: r / 384,
					//texture: './assets/png/ohana2.png',
					xScale: r / 100,
					yScale: r / 100,
				}
			},
		});
		Composite.add(this.engine.world, circle);
		setTimeout(() => {
			Composite.remove(this.engine.world, circle);
		}, 100);
	}


	loseGame () {
		this.stateIndex = GameStates.LOSE;
		this.elements.end.style.display = 'flex';
		this.runner.enabled = false;
		this.saveHighscore();
	}


	// Returns an index, or null
	lookupFruitIndex (radius) {
		const sizeIndex = this.fruitSizes.findIndex(size => size.radius == radius);
		if (sizeIndex === undefined) return null;
		if (sizeIndex === this.fruitSizes.length - 1) return null;
		return sizeIndex;
	}


	generateFruitBody (x, y, sizeIndex, extraConfig = {}) {
		const size = this.fruitSizes[sizeIndex];
		const circle = Bodies.circle(x, y, size.radius, {
			...friction,
			...extraConfig,
			render: { sprite: { texture: size.img, xScale: size.radius / 512 *1.1, yScale: size.radius / 512 *1.1 }, layer:0 },
		});
		circle.sizeIndex = sizeIndex;
		return circle;
	}


	addFruit (x) {
		if (this.stateIndex !== GameStates.READY) return;

        // sound effect
		let _rnd = Math.floor(Math.random()*4)+2;
		eval("this.sounds.fluffy" + _rnd + ".play();");
		
		// check x limit
		if (x<0) {
		    x = 0;
		}
		if (x>this.width) {
		    x = this.width;
		}

        // drop new fluffy
		this.stateIndex = GameStates.DROP;
		const latestFruit = this.generateFruitBody(x, 50, this.currentFruitSize);
		Composite.add(this.engine.world, latestFruit);
		// set initial velocity
		Matter.Body.setVelocity(latestFruit,{x:0, y:3});
		//let angleVelocity = (Math.random() * 0.02 - 0.01);
		//Matter.Body.setAngularVelocity(latestFruit, angleVelocity);

		this.currentFruitSize = this.nextFruitSize;
		this.calculateScore();

		Composite.remove(this.engine.world, this.elements.previewBall);
		this.elements.previewBall = this.generateFruitBody(this.render.mouse.position.x, 50, this.currentFruitSize, {
			isStatic: true,
			collisionFilter: { mask: 0x0040 }
		});

		setTimeout(() => {
			if (this.stateIndex === GameStates.DROP) {
				Composite.add(this.engine.world, this.elements.previewBall);
				this.stateIndex = GameStates.READY;
        		this.setNextFruitSize();
			}
		}, 500);
	}


    resizeCanvas() {
    	const screenWidth = document.body.clientWidth;
    	const screenHeight = document.body.clientHeight;

    	let newWidth = this.width;
    	let newHeight = this.height;
    	let scaleUI = 1;

    	if (screenWidth * 1.5 > screenHeight) {
    		newHeight = Math.min(this.height, screenHeight);
    		newWidth = newHeight / 1.5;
    		scaleUI = newHeight / this.height;
    	} else {
    		newWidth = Math.min(this.width, screenWidth);
    		newHeight = newWidth * 1.5;
    		scaleUI = newWidth / this.width;
    	}

    	this.render.canvas.style.width = `${newWidth}px`;
    	this.render.canvas.style.height = `${newHeight}px`;

    	this.elements.ui.style.width = `${this.width}px`;
    	this.elements.ui.style.height = `${this.height}px`;
    	this.elements.ui.style.transform = `scale(${scaleUI})`;
    }


    shake(_y=5) {
        if (this.stateIndex == GameStates.READY) {
            this.sounds.shake.play();
            this.gameStatics[2].position.y -= _y;
    		this.stateIndex = GameStates.SHAKE;
        	setTimeout(() => {
                this.gameStatics[2].position.y += _y;
        	}, 100);
        	setTimeout(() => {
    			this.stateIndex = GameStates.READY;
        	}, 1000);
        }
    }
}


// load and init game
window.onload = () => {
    // prepare Game2 class
    Game2 = new class_Game2();
    Game2.init();
}

// resize game
window.onresize = () => {
    Game2.resizeCanvas();
};

