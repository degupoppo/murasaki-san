

//===Header==================================================================================

/*

interface IERC721 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function setApprovalForAll(address operator, bool _approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;
}

library Strings {
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract ERC721 is IERC721 {
    using Strings for uint256;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balances[owner];
    }
    
*/


//===ToDo==================================================================================


/*


    メインコンセプトはなにか
        リアルタイム
    
    
    Web3的体験はなにか


    旅の目的はなにか
        お花を集める
        資源を集める
        地形改善


    選択可能な行動
        移動
        開拓？


    土地の種類と属性
        種類
            森
            山
            平原
            水
        属性
            
        
    
    UIの実装
        移動


    コントラ実装
        hex structure
            id, x, y, material, 建造物, 所有者？などの情報
        2次元mapping
            hexを格納する
            もしくはhexIdを格納する
        caller
            hex_currentのxとyを引数に、周辺hexの情報を返す
            最低限、32*32=1024のhex情報を一度にcallできると良いのだが。
                次点で、24*24=576, 18*18=324, 12*12=144あたりだろうか。
        caller2
            所有しているhexの情報をすべて返す
                所有hexについては、距離に関わらずmapに常に表示したいため
        hex viewer
            hexのidかposを引数に、typeやmaterialなどの情報を返す
            バイオームをうまくアルゴリズム化する必要がある
                予めすべてのhexのtypeを定義しておくことは困難なため、
                要求があった際にその都度計算させて取得可能にしたい。
            パーリンノイズ：
                https://github.com/0x10f/solidity-perlin-noise
                x, y座標を渡せばパーリンノイズ乱数が返ってくるコントラを実装できる
                これでheightを取得し、閾値を決めて山・森・平原・水に変換する
                また、同様に別のパーリンノイズ乱数を用いて、
                    例えば熱帯・温帯・寒冷などのバイオームを設定する
                    熱帯の山、寒冷の平原、など、バイオーム x 高さ。
                jsのパーリンノイズライブラリ：
                    https://github.com/josephg/noisejs
                inkではないがrustのライブラリ
                    https://github.com/RyanMarcus/perlin
        初期値の割当
            誰かに会うためには少なくとも1ヶ月程度かかる間隔でバラけさせる
            近接する資源を固定化もしくは削除して優劣を軽減させる
            もしくは、追加料金を支払って再ロール可能とする。
    

*/


//===Global==================================================================================


//global
let scene_main;
let turn = 0;
let cameraTargetX = 0;
let cameraTargetY = 0;
let murasakisan;
let currentPos = [0,0];

//flag
let flag_drag = 0;
let flag_moving = 0;

//group
let group_update;
let group_hex;

//hex
let hex_selected;
let hex_current;
let hex_current_indicator;
let hex_targetted;
let hex_targetted_indicator;



//===on-chain==================================================================================


async function get_mapType (x, y) {
    noise.seed(1);
    let _perlin = noise.perlin2(x/10, y/10);
    let _type = 0;
    if (_perlin <= -0.7) {
        _type = 5;  //sea
    } else if (_perlin <= -0.5) {
        _type = 4;  //water
    } else if (_perlin <= -0.1) {
        _type = 3;  //plain
    } else if (_perlin <= 0.2) {
        _type = 1;  //forest
    } else if (_perlin <= 1.00) {
        _type = 2;  //mountain
    }
    return _type;
}

async function get_mapClimate (x, y) {
    noise.seed(4);
    let _perlin = noise.perlin2(x/50, y/50);
    let _climate;
    if (_perlin <= -0.2) {
        _climate = 1;
    } else {
        _climate = 2;
    }
    return _climate;
}

async function get_materials (x, y) {
    let _mapType = await get_mapType(x, y);
    noise.seed(3);
    let _rnd = noise.simplex2(x, y)*50+50;
    let _count = 0;
    if (_rnd <= 3) {
        _count = 3;
    } else if (_rnd <= 10) {
        _count = 2;
    } else if (_rnd <= 30) {
        _count = 1;
    }
    let _li_mat = [0,0,0,0]
    if (_mapType == 3) {
        _li_mat[3] += _count;
    } else if (_mapType == 2) {
        _li_mat[2] += _count;
    } else if (_mapType == 1) {
        _li_mat[1] += _count;
    }
    return _li_mat;
}

async function get_currentPos() {
    let _currentPos = [4564, 1188966];
    if (localStorage.getItem("currentPos") != null) {
        let _json = localStorage.getItem("currentPos");
        _currentPos = JSON.parse(_json);
    }
    return _currentPos;
}

async function write_currentPos(_currentPos) {
    localStorage.setItem("currentPos", JSON.stringify(_currentPos));
}

async function update_dynamicStatus() {
    //currentPos
    //summoner mode
    //moving: targetPos
    //moving: percentase
    //moving: reminingTime
    ;
}


//===Class==================================================================================


//---Murasakisan
class Murasakisan extends Phaser.GameObjects.Sprite{
    
    //### constructor
    constructor(scene, x, y, hex_current) {
        super(scene, x, y, "murasaki_right");
        this.scene.add.existing(this);
        this.x = x;
        this.y = y;
        this.hex_current = hex_current;
        this.anims.play("murasaki_right", true);
        this.dist = "right";
        this.setInteractive({useHandCursor: true});
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.mode = "resting";
        this.submode = 0;
        this.count = 0;
        this.setOrigin(0.5);
        group_update.add(this);
        this.hex_targetted = 0;
        this.name = scene.add.text(this.x, this.y-37, "Kapico")
            .setOrigin(0.5)
            .setDepth(201)
            .setColor("#000000")
            .setVisible(false);
        // summoner info window
        this.window = scene.add.graphics();
        this.window.fillStyle(0xFFF100, 0.9).fillRect(0, 0, 162, 100);
        this.window.depth = 300;
        this.window.visible = false;
        let _text = "";
        _text += "[Mining]\n"
        _text += "\n";
        _text += "[Farming]\n";
        this.windowText = scene.add.text(0, 0, _text)
            .setDepth(301).setColor("#000000").setVisible(false);
    }



    //### on_click
    on_click() {
        this.name.visible = true;
        this.window.x = this.x +30;
        this.window.y = this.y -100;
        this.windowText.x = this.window.x +5;
        this.windowText.y = this.window.y +5;
        this.window.visible = true;
        this.windowText.visible = true;
        setTimeout( () => {
            this.name.visible = false;
            this.window.visible = false;
            this.windowText.visible = false;
        }, 5000 );
    }
    
    //### happy
    happy() {
        if (this.submode == 0) {
            this.anims.play("murasaki_happy", true);
            this.happy_count = 300;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.happy_count -= 1;
            if (this.happy_count <= 0) {
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            this.mode = "resting";
            this.submode = 0;
        }
    }
    
    //### resting
    resting() {
        if (this.submode == 0) {
            this.anims.play("murasaki_right", true);
            if (this.dist == "right") {
                this.flipX = false;
            } else if (this.dist == "left") {
                this.flipX = true;
            }
            this.restingCount = 100 + Math.random() * 100;
            //this.restingCount = 10;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.restingCount -= 1;
            if (this.restingCount <= 0){
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            let _tmp = Math.random() * 100;
            if (_tmp <= 10) {
                this.mode = "sleeping";
                this.submode = 0;
            } else {
                this.mode = "moving";
                this.submode = 0;
                if (this.hex_targetted != 0) {
                    this.mode = "moving_toHex";
                    this.submode = 0;
                }
            }
        }
    }
    
    //### sleeping
    sleeping() {
        if (this.submode == 0) {
            this.anims.play("murasaki_sleeping", true);
            this.sleeping_count = 1000 + Math.random()* 500;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.sleeping_count -= 1;
            if (this.sleeping_count <= 0) {
                this.mode = "resting";
                this.submode = 0;
            }
        }
    }
    
    //### moving
    moving() {
        if (this.submode == 0) {
            //let li = [0,10,20,30,40,50,130,140,150,160,170,180,190,200,210,220,230,310,320,330,340,350];
            //this.moving_degree = li[Math.floor(Math.random() * li.length)];
            this.moving_degree = Math.random()*360;
            //out of area check, x
            //let _hexX = hexMatrix[this.posX][this.posY].x;
            let _hexX = this.hex_current.x;
            if (this.x < _hexX-25 && this.moving_degree > 90 && this.moving_degree < 270) {
                this.moving_degree += 180;
                console.log("limitX1")
            }else if (this.x > _hexX+25 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree += 180;
                console.log("limitX2")
            }
            //out of area check, y
            //let _hexY = hexMatrix[this.posX][this.posY].y;
            let _hexY = this.hex_current.y;
            if (this.y > _hexY+25 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
                console.log("limitY1")
            }else if (this.y < _hexY-25 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
                console.log("limitY2")
            }

            console.log("_hexX:", _hexX, "_hexY:", _hexY, "x:", this.x, "y:", this.y);

            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.flipX = true;
            }else {
                this.dist = "right";
                this.flipX = false;
            }
            //determine speed, count
            this.moving_speed = 0.1 + Math.random() * 0.05;  //0.5-0.8
            this.moving_count = 70 + Math.random() * 30;    //70-100
            this.submode += 1;
        } else if (this.submode == 1) {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.name.x = this.x;
            this.name.y = this.y - 37;
            this.moving_count -= 1;
            if (this.moving_count <= 0) {
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            this.mode = "resting";
            this.submode = 0;
        }
    }
    
    //### moving_toHex
    moving_toHex() {
        if (this.submode == 0) {
            this.anims.play("murasaki_working_right", true);
            let _delta_x = this.hex_targetted.x - this.x;
            if (_delta_x > 0){
                this.dist = "right";
                this.flipX = false;
            } else {
                this.dist = "left";
                this.flipX = true;
            }
            this.submode += 1;
        } else if (this.submode == 1) {
            let _deltaX = this.hex_targetted.x - this.x;
            let _deltaY = this.hex_targetted.y - this.y;
            let _deltaX2 = _deltaX / (Math.abs(_deltaX) + Math.abs(_deltaY)) * 0.2;
            let _deltaY2 = _deltaY / (Math.abs(_deltaX) + Math.abs(_deltaY)) * 0.2;
            this.x += _deltaX2;
            this.y += _deltaY2;
            this.name.x = this.x;
            this.name.y = this.y -37;
            if (
                this.x >= this.hex_targetted.x-10 
                && this.x <= this.hex_targetted.x+10 
                && this.y >= this.hex_targetted.y-10 
                && this.y <= this.hex_targetted.y+10
            ) {
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            hex_current = this.hex_targetted
            hex_current_indicator.x = hex_current.x;
            hex_current_indicator.y = hex_current.y;
            this.hex_current = hex_current;
            this.hex_targetted = 0;
            hex_targetted_indicator.visible = false;
            this.mode = "happy";
            this.submode = 0;
            flag_moving = 0;
        }
    }
    
    //### update
    update() {
        this.count += 1;
        if (this.mode == "resting") {this.resting();}
        else if (this.mode == "moving") {this.moving();}
        else if (this.mode == "moving_toHex") {this.moving_toHex();}
        else if (this.mode == "sleeping") {this.sleeping();}
        else if (this.mode == "happy") {this.happy();}
    }
}



//===Scene==================================================================================


//---Main
class Main extends Phaser.Scene {


    //### constructor
    constructor() {
        super({
            key: 'examples'
        })
    }


    //### preload
    preload() {
        this.load.image("hex_00", "hex_00.png");
        this.load.image("hex_01", "hex_01.png");
        this.load.image("hex_02", "hex_02.png");
        this.load.image("hex_03", "hex_03.png");
        this.load.image("hex_04", "hex_04.png");
        this.load.image("hex_05", "hex_05.png");
        this.load.image("hex_10", "hex_10.png");
        this.load.image("hex_98", "hex_98.png");
        this.load.image("hex_99", "hex_99.png");
        this.load.image("coin", "coin.png");
        this.load.image("leaf", "leaf.png");
        this.load.image("logo_icon", "logo_icon.png");
        this.load.image("icon_zoomIn", "icon_home.png");
        this.load.spritesheet("murasaki_right", "murasaki_right.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_working_right", "murasaki_working_right.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_sleeping", "murasaki_sleeping2.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_happy", "murasaki_happy.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("flowers", "flowers.png", {frameWidth: 370, frameHeight: 320});
    }


    //### create
    async create() {
    
        // group
        group_update = this.add.group();
        group_update.runChildUpdate = true;
        
        // init
        this.cameras.main.zoom = 1;
        scene_main = this;
        
        // call current pos
        currentPos = await get_currentPos();

        // generate hex map
        await this.load_hex(this);

        // def key
        // detect mouse wheel
        this.input.on("wheel", (pointer) => {
            flag_drag = 0;  // reset dragging
            // increase/decrease camera zoom
            if (pointer.deltaY > 0) {
                this.cameras.main.zoom *= 0.9;
                if (this.cameras.main.zoom <= 0.3) {
                    this.cameras.main.zoom = 0.3;   // zoomOut limit
                }
            } else {
                this.cameras.main.zoom *= 1.1;
                if (this.cameras.main.zoom >= 3) {
                    this.cameras.main.zoom = 3; // zoomIn limit
                }
            }
        });
        // detect keyboard
        this.keys = {};
        this.keys.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // prepare animation
        await this.load_anims(this);

        // create summoner
        murasakisan = new Murasakisan(this, hex_current.x, hex_current.y, hex_current)
            .setOrigin(0.5)
            .setScale(0.2)
            .setDepth(200);
        
        // focus camera to summoner
        this.cameras.main.centerOn(murasakisan.x, murasakisan.y);
        
        // system icon
        /*
        let icon_zoomIn = this.add.sprite(1155, 915-15, "icon_zoomIn")
            .setOrigin(0.5)
            .setScale(0.15)
            .setDepth(500)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                this.cameras.main.zoom *= 1.1;
                if (this.cameras.main.zoom >= 3) {
                    this.cameras.main.zoom = 3; // zoomIn limit
                }
            });
        */
    }
    

    //$$$ fc: anims
    async load_anims(scene) {
        scene.anims.create({
            key: "murasaki_right",
            frames: scene.anims.generateFrameNumbers("murasaki_right", {start:0, end:3}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_working_right",
            frames: scene.anims.generateFrameNumbers("murasaki_working_right", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_sleeping",
            frames: scene.anims.generateFrameNumbers("murasaki_sleeping", {frames:[0,0,0,1,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_happy",
            frames: scene.anims.generateFrameNumbers("murasaki_happy", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
    }
    

    //$$$ fc: hex
    async load_hex(scene) {

        // set hexagon position parameters
        
        let _numberX = 28;
        let _numberY = 28;
        let _startHex = [currentPos[0]-_numberX/2, currentPos[1]-_numberY/2];
        let _hexagonWidth = game.textures.list["hex_00"].source[0].width;
        let _hexagonHeight = game.textures.list["hex_00"].source[0].height;
        //let _hexagonWidth = 168;
        //let _hexagonHeight = 196;
        let _startPosX = scene.sys.game.config.width/2 - _hexagonWidth*_numberX/2;
        let _startPosY = scene.sys.game.config.height/2 - _hexagonHeight*_numberY/2;

        let _adjustWidth = -4;
        let _adjustHeight = -10;
        _hexagonWidth += _adjustWidth;
        
        // prepare name dic
        let _dicHex = {
            0: "Unknown",
            1: "Forest",
            2: "Mountain",
            3: "Plain",
            4: "Water",
            5: "Sea",
        }
        let _dicClimate = {
            0: "Unknown",
            1: "Frigid",
            2: "Temperate",
        }

        // prepare hex matrix
        //hexMatrix = new Array(65535);
        //for (let i=0; i<=65535; i++){
        //    hexMatrix[i] = new Array(63353);
        //}
        
        // prepare hex info window
        let _hexInfo = scene.add.graphics();
        _hexInfo.fillStyle(0xFFF100, 0.9).fillRect(0, 0, 162, 100);
        _hexInfo.depth = 300;
        _hexInfo.visible = false;
        let _hexInfoText = scene.add.text(0, 0, "").setDepth(301).setColor("#000000");
        
        // prepare hex info button
        let _hexInfoButton = scene.add.text(0, 0, "[Move]")
            .setDepth(301)
            .setColor("#000000")
            .setInteractive({useHandCursor: true})
            .setVisible(false);
        _hexInfoButton.on("pointerdown", () => {
            murasakisan.hex_targetted = hex_selected;   //***TODO*** for onChain
            hex_targetted = hex_selected;
            _hexInfoButton.visible = false;
            hex_targetted_indicator.visible = true;
            hex_targetted_indicator.x = hex_selected.x;
            hex_targetted_indicator.y = hex_selected.y;
            write_currentPos([hex_targetted.posX, hex_targetted.posY]);
            flag_moving = 1;
        });
        
        // generate hexagons
        group_hex = scene.add.group();
        let _countX;
        let _countY;
        let _num;
        
        // for each y row
        _num = -1;
        _countY = -1;
        for (let iy=0; iy<_numberY; iy++) {
            _countY += 1;
            _countX = -1;
            
            // for each x column
            for (let ix=0; ix<_numberX; ix++) {
                _countX += 1;
                _num += 1;

                // def pixel x, y
                let _x = _startPosX + ix * _hexagonWidth + (iy % 2) * _hexagonWidth/2;
                let _y = _startPosY + iy * _hexagonWidth - iy * (_hexagonHeight/8 +_adjustHeight);
                
                // recalc hex pos
                let _posX = _startHex[0] + _countX;
                let _posY = _startHex[1] + _countY;

                // call hex type
                let _type = await get_mapType(_posX, _posY);
                
                // call hex climate
                let _climate = await get_mapClimate(_posX, _posY);

                // override, out of range
                /*
                let __x = _startPosX + _numberX/2 * _hexagonWidth + (_numberY/2 % 2) * _hexagonWidth/2;
                let __y = _startPosY + _numberY/2 * _hexagonWidth - _numberY/2 * (_hexagonHeight/8 +_adjustHeight);
                let _dist = Math.sqrt( Math.pow(__x-_x,2) + Math.pow(__y-_y,2));
                if (_dist >= 1800) {
                    _type = 0;
                    _climate = 0;
                }
                */

                // generate hexagon sprite

                let hex;

                // set texture depends on map type
                if (_type == 0) {
                    hex = scene.add.sprite(_x, _y, "hex_00")
                } else if (_type == 1) {
                    hex = scene.add.sprite(_x, _y, "hex_01")
                } else if (_type == 2) {
                    hex = scene.add.sprite(_x, _y, "hex_02")
                } else if (_type == 3) {
                    hex = scene.add.sprite(_x, _y, "hex_03")
                } else if (_type == 4) {
                    hex = scene.add.sprite(_x, _y, "hex_04")
                } else if (_type == 5) {
                    hex = scene.add.sprite(_x, _y, "hex_05")
                }
                
                // overshow biome hex
                if (_climate == 1) {
                    scene.add.sprite(_x, _y, "hex_10").setAlpha(0.2).setDepth(101);
                }
                
                // set hex variants
                hex.climate = _climate
                hex.num = _num;
                hex.type = _type;
                hex.posX = _posX;
                hex.posY = _posY;
                hex.depth = 100;
                hex.leaf = 0;
                hex.coin = 0;
                hex.flower = 0;

                // init hex
                group_hex.add(hex);
                hex.setAlpha(0.5);
                hex.setOrigin(0.5);
                hex.setInteractive({useHandCursor: true});

                // show materials
                // call mat
                let _li_mats = await get_materials(_posX, _posY);
                // put mat
                for (let _matType=1; _matType<=3; _matType++) {
                    let _count = _li_mats[_matType];
                    if (_count > 0) {
                        for (let i=0; i<_count; i++) {
                            let _x = hex.x-40+Math.random()*80;
                            let _y = hex.y-40+Math.random()*80;
                            let _material;
                            // put each materials
                            if (_matType == 1) {
                                _material = scene.add.sprite(_x, _y, "leaf");
                                _material.setOrigin(0.5);
                                _material.setScale(0.1);
                                _material.setDepth(101);
                                hex.leaf += 1;
                            } else if (_matType == 2) {
                                _material = scene.add.sprite(_x, _y, "coin");
                                _material.setOrigin(0.5);
                                _material.setScale(0.07);
                                _material.setDepth(101);
                                hex.coin += 1;
                            } else if (_matType == 3) {
                                _material = scene.add.sprite(_x, _y, "flowers");
                                _material.setFrame(Math.round(Math.random()*5));
                                _material.setAngle(360*Math.random());
                                _material.setOrigin(0.5);
                                _material.setScale(0.15);
                                _material.setDepth(101);
                                hex.flower += 1;
                            }
                        }
                    }
                }
                
                // insert into hex matrix
                //hexMatrix[_posX][_posY] = hex;
                
                // prepare pointerdown fc
                hex.on("pointerdown", () => {
                    if (flag_drag == 0) {   // ignore in mouse dragging

                        // reset map alpha
                        group_hex.setAlpha(0.5);

                        // select hex
                        hex.setAlpha(1);
                        hex_selected = hex;

                        // try dragging
                        if (flag_drag == 0) {
                            flag_drag = 1;
                            cameraTargetX = hex.x;
                            cameraTargetY = hex.y;
                            console.log("start dragging:", cameraTargetX, cameraTargetY);
                        }

                        // move hexInfo window
                        _hexInfo.visible = true;
                        _hexInfo.x = hex.x + 40;
                        _hexInfo.y = hex.y + 75;

                        // prepare text
                        _hexInfoText.x = _hexInfo.x+5;
                        _hexInfoText.y = _hexInfo.y+5;
                        let _text = "";
                        _text += hex.posX + ", " + hex.posY + "\n";
                        _text += _dicClimate[hex.climate] + "\n";
                        _text += _dicHex[hex.type] + "\n";
                        if (hex.coin > 0) {
                            _text += "Coin: " + hex.coin + "\n";
                        }
                        if (hex.leaf > 0) {
                            _text += "Leaf: " + hex.leaf + "\n";
                        }
                        if (hex.flower > 0) {
                            _text += "Flower: " + hex.flower + "\n";
                        }
                        
                        // update text
                        _hexInfoText.visible = true;
                        _hexInfoText.setText(_text);
                        
                        // calc distance
                        let _dist = 
                            Math.sqrt( Math.pow(hex_current.x-hex.x,2) 
                            + Math.pow(hex_current.y-hex.y,2));
                        
                        // move button
                        if (
                            flag_moving == 0 
                            && hex != hex_current 
                            && hex.type != 5 
                            && hex.type != 4 
                            && _dist <= _hexagonWidth*2.1
                        ) {
                            _hexInfoButton.x = _hexInfo.x+50;
                            _hexInfoButton.y = _hexInfo.y+68;
                            _hexInfoButton.visible = true;
                        } else {
                            _hexInfoButton.visible = false;
                        }
                    }
                });
                
                // prepare poiterover and pointerout fc
                hex.on("pointerover", () => {
                    hex.setAlpha(1);
                });
                hex.on("pointerout", () => {
                    // when not selected, reset alpha
                    if (hex != hex_selected) {
                        hex.setAlpha(0.5);
                    }
                });
                
                // check current hex
                if (hex.posX == currentPos[0] && hex.posY == currentPos[1]) {
                    hex_current = hex;
                }
            }
        }
        
        //prepare hex_current
        //hex_current = hexMatrix[currentPos[0]][currentPos[1]];
        hex_current_indicator = scene.add.sprite(hex_current.x, hex_current.y, "hex_99")
            .setAlpha(0.5)
            .setOrigin(0.5)
            .setDepth(102);
                
        //prepare hex_targetted
        hex_targetted_indicator = scene.add.sprite(0, 0, "hex_98")
            .setAlpha(0.5)
            .setOrigin(0.5)
            .setDepth(102)
            .setVisible(false);
        
        // show house icon
        let _house = scene.add.sprite(hex_current.x, hex_current.y, "logo_icon")
            .setOrigin(0.5)
            .setScale(0.05)
            .setDepth(101);
    }


    //### update
    update() {
    
        turn += 1;
        
        //$$$ detect dragging
        if (flag_drag == 1) {
            // get current camera position
            let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
            let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
            // calc delta between target pos and current camera pos
            let _deltaX = cameraTargetX - _cameraX;
            let _deltaY = cameraTargetY - _cameraY;
            // def camera moving degree
            if ( Math.abs(_deltaX) > 5 ) {
                _cameraX = _cameraX + _deltaX/10;
            }
            if ( Math.abs(_deltaY) > 5 ) {
                _cameraY = _cameraY + _deltaY/10;
            }
            // camera moving
            this.cameras.main.centerOn(_cameraX, _cameraY);
            // detect dragging end
            if (Math.abs(_deltaX) <= 5 && Math.abs(_deltaY) <= 5) {
                flag_drag = 0;
                console.log("end dragging", _cameraX, _cameraY);
            }
        }
        
        //$$$ key
        if (flag_drag == 0) {
            if (this.keys.keyW.isDown) {
                let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
                let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
                this.cameras.main.centerOn(_cameraX, _cameraY-10);
            }
            if (this.keys.keyA.isDown) {
                let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
                let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
                this.cameras.main.centerOn(_cameraX-10, _cameraY);
            }
            if (this.keys.keyD.isDown) {
                let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
                let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
                this.cameras.main.centerOn(_cameraX+10, _cameraY);
            }
            if (this.keys.keyS.isDown) {
                let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
                let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
                this.cameras.main.centerOn(_cameraX, _cameraY+10);
            }
            if (this.keys.keySPACE.isDown) {
                this.cameras.main.centerOn(murasakisan.x, murasakisan.y);
            }
        }
        
        //$$$ update
        if (turn % 200 == 0) {
            update_dynamicStatus();
        }
    }
}



//===Phaser3==================================================================================


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: "E3E3E3",
    width: 1280,
    height: 960,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Main,
    fps: {
        target: 60,
    },
};


var game = new Phaser.Game(config);

