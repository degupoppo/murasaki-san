
/*

ToDo
    SEの選別
    bgmの設定
    lose heightの調整
    ホームボタンの実装
    bgmのボリュームコントロールボタンを実装
    スコア表示の独自化
    床の絵の変更HoMの床と同一とする
*/


// def music
const music = new Audio("./assets/music/パステルハウス.mp3");
music.loop = true;


const {Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Events} = Matter;

const wallPad = 64;
const loseHeight = 84;
const statusBarHeight = 48;
const friction = {
    friction: 0.006*10,
    frictionStatic: 0.006*10,
    frictionAir: 0,
    restitution: 0.1
};

const GameStates = {
    MENU: 0,
    READY: 1,
    DROP: 2,
    LOSE: 3,
};

const Game = {
	width: 640,
	height: 960,
	elements: {
		canvas: document.getElementById('canvas'),
		ui: document.getElementById('ui'),
		score: document.getElementById('current-score'),
		end: document.getElementById('end-container'),
		endTitle: document.getElementById('end-title'),
		statusValue: document.getElementById('highscore-value'),
		nextFruitImg: document.getElementById('next-fluffy'),
		previewBall: null,
	},
	cache: { highscore: 0 },
	sounds: {
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
	},

	stateIndex: GameStates.MENU,

	score: 0,
	fruitsMerged: [],
	calculateScore: function () {
		const score = Game.fruitsMerged.reduce((total, count, sizeIndex) => {
			const value = Game.fruitSizes[sizeIndex].scoreValue * count;
			return total + value;
		}, 0);

		Game.score = score;
		Game.elements.score.innerText = Game.score;
	},

	fruitSizes: [
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
	],
	currentFruitSize: 0,
	nextFruitSize: 0,
	setNextFruitSize: function () {
		//Game.nextFruitSize = Math.floor(rand() * 5);
		Game.nextFruitSize = Math.floor(Math.random() * 5);
		Game.elements.nextFruitImg.src = `./assets/png/circle${Game.nextFruitSize}.png`;
	},

	showHighscore: function () {
		Game.elements.statusValue.innerText = Game.cache.highscore;
	},
	loadHighscore: function () {
		const gameCache = localStorage.getItem('suika-game-cache');
		if (gameCache === null) {
			Game.saveHighscore();
			return;
		}

		Game.cache = JSON.parse(gameCache);
		Game.showHighscore();
	},
	saveHighscore: function () {
		Game.calculateScore();
		if (Game.score < Game.cache.highscore) return;

		Game.cache.highscore = Game.score;
		Game.showHighscore();
		Game.elements.endTitle.innerText = 'New Best Score!';

		localStorage.setItem('suika-game-cache', JSON.stringify(Game.cache));
	},

	init: function () {
		Render.run(render);
		Runner.run(runner, engine);

		Composite.add(engine.world, menuStatics);

		Game.loadHighscore();
		Game.elements.ui.style.display = 'none';
		Game.fruitsMerged = Array.apply(null, Array(Game.fruitSizes.length)).map(() => 0);

		const menuMouseDown = function () {
			if (mouseConstraint.body === null || mouseConstraint.body?.label !== 'btn-start') {
				return;
			}

			Events.off(mouseConstraint, 'mousedown', menuMouseDown);
			Game.startGame();
		}

		Events.on(mouseConstraint, 'mousedown', menuMouseDown);
	},

	startGame: function () {
		//Game.sounds.click.play();
		//Game.sounds.fluffy2.play();

    	Game.sounds.fluffy2.volume = 0.3;
    	Game.sounds.fluffy3.volume = 0.3;
    	Game.sounds.fluffy4.volume = 0.3;
    	Game.sounds.fluffy5.volume = 0.3;
		
		music.play();
		music.volume = 0.08;

		Composite.remove(engine.world, menuStatics);
		Composite.add(engine.world, gameStatics);

		Game.calculateScore();
		Game.elements.endTitle.innerText = 'Too Many Fluffies!';
		Game.elements.ui.style.display = 'block';
		Game.elements.end.style.display = 'none';
		//Game.elements.previewBall = Game.generateFruitBody(Game.width / 2, 0, 0, { isStatic: true });
		Game.elements.previewBall = Game.generateFruitBody(Game.width / 2, 50, 0, { isStatic: true });
		Composite.add(engine.world, Game.elements.previewBall);

		setTimeout(() => {
			Game.stateIndex = GameStates.READY;
		}, 250);

		Events.on(mouseConstraint, 'mouseup', function (e) {
			Game.addFruit(e.mouse.position.x);
		});

		Events.on(mouseConstraint, 'mousemove', function (e) {
			if (Game.stateIndex !== GameStates.READY) return;
			if (Game.elements.previewBall === null) return;

			Game.elements.previewBall.position.x = e.mouse.position.x;
		});

		Events.on(engine, 'collisionStart', function (e) {
			for (let i = 0; i < e.pairs.length; i++) {
				const { bodyA, bodyB } = e.pairs[i];

				// Skip if collision is wall
				if (bodyA.isStatic || bodyB.isStatic) continue;

				const aY = bodyA.position.y + bodyA.circleRadius;
				const bY = bodyB.position.y + bodyB.circleRadius;

				// Uh oh, too high!
				if (aY < loseHeight || bY < loseHeight) {
					Game.loseGame();
					return;
				}

				// Skip different sizes
				if (bodyA.sizeIndex !== bodyB.sizeIndex) continue;

				let newSize = bodyA.sizeIndex + 1;

				// Go back to smallest size
				if (bodyA.circleRadius >= Game.fruitSizes[Game.fruitSizes.length - 1].radius) {
					newSize = 0;
				}

				Game.fruitsMerged[bodyA.sizeIndex] += 1;

				// Therefore, circles are same size, so merge them.
				const midPosX = (bodyA.position.x + bodyB.position.x) / 2;
				const midPosY = (bodyA.position.y + bodyB.position.y) / 2;

				Game.sounds[`pop${bodyA.sizeIndex}`].play();
				Composite.remove(engine.world, [bodyA, bodyB]);
				Composite.add(engine.world, Game.generateFruitBody(midPosX, midPosY, newSize));
				Game.addPop(midPosX, midPosY, bodyA.circleRadius);
				Game.calculateScore();
			}
		});
	},

	addPop: function (x, y, r) {
		const circle = Bodies.circle(x, y, r, {
			isStatic: true,
			collisionFilter: { mask: 0x0040 },
			//angle: rand() * (Math.PI * 2),
			angle: Math.random() * (Math.PI * 2),
			render: {
				sprite: {
					texture: './assets/png/pop.png',
					xScale: r / 384,
					yScale: r / 384,
				}
			},
		});

		Composite.add(engine.world, circle);
		setTimeout(() => {
			Composite.remove(engine.world, circle);
		}, 100);
	},

	loseGame: function () {
		Game.stateIndex = GameStates.LOSE;
		Game.elements.end.style.display = 'flex';
		runner.enabled = false;
		Game.saveHighscore();
	},

	// Returns an index, or null
	lookupFruitIndex: function (radius) {
		const sizeIndex = Game.fruitSizes.findIndex(size => size.radius == radius);
		if (sizeIndex === undefined) return null;
		if (sizeIndex === Game.fruitSizes.length - 1) return null;

		return sizeIndex;
	},

	generateFruitBody: function (x, y, sizeIndex, extraConfig = {}) {
		const size = Game.fruitSizes[sizeIndex];
		const circle = Bodies.circle(x, y, size.radius, {
			...friction,
			...extraConfig,
			render: { sprite: { texture: size.img, xScale: size.radius / 512, yScale: size.radius / 512 }, layer:0 },
		});
		circle.sizeIndex = sizeIndex;

		return circle;
	},

	addFruit: function (x) {
		if (Game.stateIndex !== GameStates.READY) return;

		//Game.sounds.click.play();
		let _rnd = Math.floor(Math.random()*4)+2;
		//Game.sounds.fluffy`_soundName`.play();
		eval("Game.sounds.fluffy" + _rnd + ".play();");

		Game.stateIndex = GameStates.DROP;
		//const latestFruit = Game.generateFruitBody(x, 0, Game.currentFruitSize);
		const latestFruit = Game.generateFruitBody(x, 50, Game.currentFruitSize);
		Composite.add(engine.world, latestFruit);

		Game.currentFruitSize = Game.nextFruitSize;
		//Game.setNextFruitSize();
		Game.calculateScore();

		Composite.remove(engine.world, Game.elements.previewBall);
		//Game.elements.previewBall = Game.generateFruitBody(render.mouse.position.x, 0, Game.currentFruitSize, {
		Game.elements.previewBall = Game.generateFruitBody(render.mouse.position.x, 50, Game.currentFruitSize, {
			isStatic: true,
			collisionFilter: { mask: 0x0040 }
		});

		setTimeout(() => {
			if (Game.stateIndex === GameStates.DROP) {
				Composite.add(engine.world, Game.elements.previewBall);
				Game.stateIndex = GameStates.READY;

        		Game.setNextFruitSize();

			}
		}, 500);
	}
}


// def matter.js
const engine = Engine.create();
const runner = Runner.create();
const render = Render.create({
	element: Game.elements.canvas,
	engine,
	options: {
		width: Game.width,
		height: Game.height,
		wireframes: false,
		background: '#fff1ff'
	}
});


// def menu
const menuStatics = [
	Bodies.rectangle(Game.width / 2, Game.height * 0.4, 512, 512, {
		isStatic: true,
		render: { sprite: { texture: './assets/png/bg-menu.png' } },
	}),

	// Add each fruit in a circle
	...Array.apply(null, Array(Game.fruitSizes.length)).map((_, index) => {
		const x = (Game.width / 2) + 192 * Math.cos((Math.PI * 2 * index)/12);
		const y = (Game.height * 0.4) + 192 * Math.sin((Math.PI * 2 * index)/12);
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

	Bodies.rectangle(Game.width / 2, Game.height * 0.75, 512, 96, {
		isStatic: true,
		label: 'btn-start',
		render: { sprite: { texture: './assets/png/btn-start.png' } },
	}),
];

const wallProps = {
	isStatic: true,
	render: { fillStyle: '#FFEEDB' },
	...friction,
};

const gameStatics = [
	// Left
	Bodies.rectangle(-(wallPad / 2), Game.height / 2, wallPad, Game.height, wallProps),

	// Right
	Bodies.rectangle(Game.width + (wallPad / 2), Game.height / 2, wallPad, Game.height, wallProps),

	// Bottom
	Bodies.rectangle(Game.width / 2, Game.height + (wallPad / 2) - statusBarHeight, Game.width, wallPad, wallProps),
];

// add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
	mouse: mouse,
	constraint: {
		stiffness: 0.2,
		render: {
			visible: false,
		},
	},
});
render.mouse = mouse;


// def resize canvas
function resizeCanvas() {
	const screenWidth = document.body.clientWidth;
	const screenHeight = document.body.clientHeight;

	let newWidth = Game.width;
	let newHeight = Game.height;
	let scaleUI = 1;

	if (screenWidth * 1.5 > screenHeight) {
		newHeight = Math.min(Game.height, screenHeight);
		newWidth = newHeight / 1.5;
		scaleUI = newHeight / Game.height;
	} else {
		newWidth = Math.min(Game.width, screenWidth);
		newHeight = newWidth * 1.5;
		scaleUI = newWidth / Game.width;
	}

	render.canvas.style.width = `${newWidth}px`;
	render.canvas.style.height = `${newHeight}px`;

	Game.elements.ui.style.width = `${Game.width}px`;
	Game.elements.ui.style.height = `${Game.height}px`;
	Game.elements.ui.style.transform = `scale(${scaleUI})`;
};


// load game
window.onload = () => {
  Game.init();
  resizeCanvas();
}
// resize game
window.onresize = resizeCanvas;

