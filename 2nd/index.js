


//https://github.com/rexrainbow/phaser3-rex-notes/blob/master/docs/docs/board-hexagonmap.md


const Random = Phaser.Math.Between;
let scene_main;
let turn = 0;
let flag_drag = 0;
//let cameraX = 640;
//let cameraY = 480;

class Demo extends Phaser.Scene {

    constructor() {
        super({
            key: 'examples'
        })
        this.cameraTargetX = 0;
        this.cameraTargetY = 0;
    }

    preload() {
        this.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');    
    }

    create() {
        var print = this.add.text(0, 0, 'Click any tile').setColor("black");

        var staggeraxis = 'x';
        var staggerindex = 'odd';
        var board = this.rexBoard.add.board({
            grid: {
                gridType: 'hexagonGrid',
                x: 240,
                y: 120,
                size: 50,
                staggeraxis: staggeraxis,
                staggerindex: staggerindex
            }
        })
            .setInteractive()
            .on('tiledown', function (pointer, tileXY) {
                print.text = `${tileXY.x},${tileXY.y}`;
            })

        var tileXYArray = board.fit(this.rexBoard.hexagonMap.hexagon(board, 5));

        var graphics = this.add.graphics({
            lineStyle: {
                width: 5,
                color: 0x000000,
                alpha: 1
            }
        });
        var tileXY, worldXY;
        for (var i in tileXYArray) {
            tileXY = tileXYArray[i];
            graphics.strokePoints(board.getGridPoints(tileXY.x, tileXY.y, true), true);

            worldXY = board.tileXYToWorldXY(tileXY.x, tileXY.y);
            this.add.text(worldXY.x, worldXY.y, `${tileXY.x},${tileXY.y}`).setOrigin(0.5).setColor("black");
        }
        scene_main = this;
    }

    update() {
    
        turn += 1;

        this.input.on("pointerdown", () => {
            if (flag_drag == 0) {
                flag_drag = 1;
                this.cameraTargetX = game.input.activePointer.x;
                this.cameraTargetY = game.input.activePointer.y;
                console.log(this.cameraTargetX, this.cameraTargetY);
            }
        });
        
        if (flag_drag == 1) {
            let _cameraX = this.cameras.main.worldView.x + 640;
            let _cameraY = this.cameras.main.worldView.y + 480;
            let _deltaX = this.cameraTargetX - _cameraX;
            let _deltaY = this.cameraTargetY - _cameraY;
            if ( Math.abs(_deltaX) > 5 ) {
                _cameraX = _cameraX + _deltaX/10;
            }
            if ( Math.abs(_deltaY) > 5 ) {
                _cameraY = _cameraY + _deltaY/10;
            }
            this.cameras.main.centerOn(_cameraX, _cameraY);
            if (Math.abs(_deltaX) <= 5 && Math.abs(_deltaY) <= 5) {
                flag_drag = 0;
                console.log("end", _cameraX, _cameraY);
            }
            //console.log(_x, _y);
        }

        /*
        this.input.on("drag", () => {
            let pointer_x = game.input.activePointer.x;
            let pointer_y = game.input.activePointer.y;
            this.cameras.main.centerOn(pointer_x, pointer_y);
            console.log(pointer_x, pointer_y);
        });
        */


        
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: "888888",
    width: 1280,
    height: 960,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Demo,
    fps: {
        target: 60,
        //forceSetTimeOut: true
    },
    /*
    plugins: {
          scene: [{
              key: 'rexBoard',
              plugin: rexboardplugin,
              mapping: 'rexBoard'
          }]
    }
    */
};

var game = new Phaser.Game(config);