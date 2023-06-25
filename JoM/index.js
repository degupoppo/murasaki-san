

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

    初期スポーン地点の考察
        パーリンノイズで土地のレア度を割り当てて、
            特殊な建造物はレア度の高い土地にしか出現しないようにする。
        初期スポーン地点は乱数で選択して、
            ノイズ値が十分に低い（＝レア度の高い土地まで十分に距離のある）
            土地を選択する。
        メインhex座標とは別に、高次元のスポーンhex座標を別に用意する。
            スポーンはスポーンhex座標を中心から埋めていき、
            スポーンhexに応じたメインhex座標からランダムで選択する。
            埋まったスポーンhex座標には別のプレイヤーはスポーンできない。
            1つのスポーンhex座標には、例えば64*64程度のメインhexを割り当てる。
        

    プレイのラフな段階
        拠点の周辺で資源収集
        拠点の周辺で建造物を建てて地形改善
        資源に余裕ができてきたら、遠方のより効率的なhexからも資源収集
        旅の準備を整えて、遠方へ出発、道の地形探索
        引っ越しの準備を整えて、遠方へ移住、
            余剰資源により効率的な立ち上げ
    
    
    旅のシステム
        旅のタイミング
            JoM開始直後はHoM近傍の地形改善を行い、経済基盤を整える
            どこかで余剰資源が生まれるので、道の地形探索のために旅に出れるようになる。
        旅の目的
            HoM周辺以外の外の地形の把握
            珍しい建設物の発見
            他のプレイヤーとの接触
            より肥沃な地形の発見
            プレイ目的にマッチした地形の発見
                コイン多め、リーフ多め、温帯・冷帯、など。
                みなが一つの最適解に収束するのではなく、
                いくつかの選択肢が成立するように設計したい。
        旅の条件
            最初はHoMからあまり遠くへ離れられないペナルティが存在する
                移動にコストがかかる、余剰食料がない、など。
            余剰資源により長距離移動に耐えれること
            長距離移動用の装備が整うこと
                移動コストの軽減装備のクラフト
                即時帰還アイテムの確保
                    使用には例えば24時間の事前準備が必要だが、
                    起動すればどこからでもHoMに帰還可能、など。
        旅のペナルティ
            移動中はむらさきさんが資源収集に従事できない
            食料が底を尽きるなど、資源がなくなったときのペナルティをどうするか。


    メインコンセプトはなにか
        リアルタイム多人数参加のmap開拓ゲーム
        1st seasonのNFTを使用してさらにゲームを続ける
        2nd seasonの資源を1st seasonに持っていくこともできる
        2ndは1stのNFTがあると有利になり、
            1stは2ndの資源を持ち込むことで有利になる。
        つまり、2ndは1stの拡張版で、相互にメリットが有る設計にする。
    
    
    Web3的体験はなにか
        1st NFTのユースケースを与える場
        共通mapを利用したserverlessのリアルタイムゲーム
        各hexとweb3要素をうまく融合させたいところだが、どうするか。
            look & feelも重視し、直感的に理解し納得できるUI/UXにしたい
            chain上の情報を可能な限りhexに対応させたい。
        JoMでは土地=各hexがメカニズムの中心となる
            1stではhouse=walletのコンセプトであった
           *hexはweb3上の何に相当するのだろうか。
           *何かしら意味のある、有限であるか、
                唯一無二である意味論を各hexにもたせてみたい。


    旅の目的はなにか
        資源を集める
            1stよりも高効率で収集可能になる
        地形改善
            mining, farming, craftingの効率上昇施設
                鉱山、農場、工房
            groomingの効率上昇施設
                テント
        珍しいお花を集める
            そのユースケースは？
            mining, farming, craftingに対応する3色にするか。
            持っていると恒常的に全体にブーストが掛かる。


    プレイヤー（＝むらさきさん）が選択可能な行動
        move
        mining
        farming
        building
        staking
            petをhexにstakingすることでmining/farmingを委託する
            fluffyをhexにstakingすることでhexの効率が上昇する
        migrating（引っ越し）
            HoMを別のhexに移動させる
            もしくはHoMをたたんで移動可能にして持ってゆく
            通常よりコストを高く設定する
            また、全petの集合が必要など、資源的に不利にする
            migration中は資源を全く得られず、
                事前準備が必要なようにバランス調整する

    食料資源について
        HoMではプレイヤーが無制限に用意できた
        JoMでは、マップからの回収が必要なルールとするか。
        HoMは最低限＋aの食料を生産する
            HoMがあれば、むらさきさんとpet 3匹が飢えることはない。
        より効率的にmining/farming/craftingしようとすると、追加で食料が必要になる。
            食料が0になるとworkingが中断される
        食料＝おはな、とする。


    土地の種類と属性
        種類
            森, farming
            山, mining
            平原, crafting
            水
        属性
            熱帯, +情熱, passion
            温帯, +温厚, kindness
            冷帯, +冷静, calmness
    
    
    建造物
        ルールなど
            HoMの影響範囲内しか建設できない
        鉱山
            mountainのhexに建設可能
            そのhexのminingの効率上昇
        農場
            forrestのhexに建設可能
            そのhexのfarming効率上昇
        テント
    
    
    HoMの成長
        HoM周辺のhexで活動するとHoMのレベルが上昇して文化圏が広がる。
            expの加算量、加算タイミング、必要expなどが明確に説明できるように。
        HoMの文化圏内の地形しか建造物を建てることができない。


    ゲームシステム案
        手持ちのNFTを資源として配置可能
            鉱山・農場にfluffyを配置する
            3匹のペットは本体の50%程度の出力でmining/farming可能
            crafting（開発）はむらさきさんしかできない？
        育成
            feeding：
                常に可能
                +100% exp
            grooming: 
                resting時に可能
                拠点で+100% exp, 準拠点（テント）で+50%など効率低下
        
    
    UIの実装
        移動
        システムボタン
            zoomIn
            zoomOut
            center
            home(HP)
            rotate


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
let scene_system;
let turn = 0;
let cameraTargetX = 0;
let cameraTargetY = 0;
let murasakisan;
let currentPos = [0,0];
//let targetPos = [0,0];
let summoner = 1;
let summonerMode;
let hexMatrix;
let hexInfoWindow;
let hexInfoText;
let hexInfoButton;

//local variants
let local_currentPos;
let local_targetPos;
let local_summonerMode;
let local_moving_reminingTime;
let local_moving_reminingPercent;
let local_coin = 0;
let local_leaf = 0;

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


async function onChain_call_mapType (x, y) {
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

async function onChain_call_mapClimate (x, y) {
    noise.seed(4);
    let _perlin = noise.perlin2(x/50, y/50);
    let _climate;
    if (_perlin <= -0.3) {
        _climate = 1;
    } else if (_perlin >= 0.3) {
        _climate = 3;
    } else {
        _climate = 2;
    }
    return _climate;
}

async function onChain_call_materials (x, y) {
    let _mapType = await onChain_call_mapType(x, y);
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
        //_li_mat[3] += _count;
    } else if (_mapType == 2) {
        _li_mat[2] += _count;
    } else if (_mapType == 1) {
        _li_mat[1] += _count;
    }
    //flower
    noise.seed(5);
    _rnd = noise.simplex2(x, y)*50+50;
    if (_rnd <= 3) {
        //_li_mat[3] += 2;
    } else if (_rnd <= 10) {
        _li_mat[3] += 1;
    }
    return _li_mat;
}

async function onChain_call_currentPos(_summoner) {
    let _currentPos = [1000, 1000];
    if (localStorage.getItem("currentPos") != null) {
        let _json = localStorage.getItem("currentPos");
        _currentPos = JSON.parse(_json);
    }
    if (JSON.parse(localStorage.getItem("summonerMode")) == "moving"){
        let _moving_reminingTime = _calc_movingReminintTime();
        if (_moving_reminingTime == 0) {
            _currentPos = JSON.parse(localStorage.getItem("targetPos"));
            onChain_send_currentPos(summoner, _currentPos);
            localStorage.setItem("summonerMode", JSON.stringify("resting"));
        }
    }
    return _currentPos;
}

async function onChain_call_summonerMode(_summoner) {
    let _summonerMode = "resting";
    if (localStorage.getItem("summonerMode") != null) {
        _summonerMode = JSON.parse(localStorage.getItem("summonerMode"));
    }
    if (_summonerMode == "moving"){
        let _moving_reminingTime = _calc_movingReminintTime();
        if (_moving_reminingTime == 0) {
            _summonerMode = "resting";
        }
    }
    return _summonerMode;
}

async function onChain_send_currentPos(_summoner, _currentPos) {
    localStorage.setItem("currentPos", JSON.stringify(_currentPos));
}

async function onChain_send_startMoving(_summoner, _targetPos) {
    localStorage.setItem("summonerMode", JSON.stringify("moving"));    
    localStorage.setItem("targetPos", JSON.stringify(_targetPos)); 
    localStorage.setItem("move_startTime", JSON.stringify(Math.round(Date.now()/1000)));
}

function _calc_movingReminintTime(){
    let _reminingTime = 0;
    if (JSON.parse(localStorage.getItem("summonerMode")) == "moving") {
        let _json = localStorage.getItem("move_startTime");
        let _startTime = JSON.parse(_json);
        let _endTime = _startTime + 60;
        _reminingTime = _endTime - Math.round(Date.now()/1000)
        if (_reminingTime < 0) {
            _reminingTime = 0;
        }
    }
    return _reminingTime;
}

function _calc_movingReminingPercent() {
    let _reminingTime = _calc_movingReminintTime();
    let _percent = _reminingTime/60;
    _percent = Math.round(_percent*100)/100;
    return _percent;
}

async function onChain_update_dynamicStatus() {
    local_currentPos = await onChain_call_currentPos(summoner);
    local_targetPos = JSON.parse(localStorage.getItem("targetPos"));
    local_summonerMode = await onChain_call_summonerMode(summoner);
    local_moving_reminingTime = _calc_movingReminintTime();
    local_moving_reminingPercent = _calc_movingReminingPercent();
    local_coin = JSON.parse(localStorage.getItem("coin"));
    local_leaf = JSON.parse(localStorage.getItem("leaf"));
    console.log(
        "currentPos:", local_currentPos,
        "targetPos:", local_targetPos,
        "summonerMode:", local_summonerMode,
        "moving_reminingTime:", local_moving_reminingTime,
        "moving_reminingPercent", local_moving_reminingPercent,
        "coin:", local_coin,
        "leaf:", local_leaf,
    );
}

function _calc_summonerMode() {
    let _summonerMode = JSON.parse(localStorage.getItem("summonerMode"));
    if (_summonerMode == "moving") {
        let _moving_reminingTime = _calc_movingReminintTime();
        if (_moving_reminingTime == 0) {
            return "resting";
        }
    }
    return _summonerMode;
}

function onChain_reset() {
}


async function onChain_send_startMining(_summoner) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "mining");
    let _now = Math.round(Date.now()/1000);
    localStorage.setItem("mining_startTime", JSON.stringify(_now));
}

async function onChain_call_calcMining(_summoner) {
    let _mining_startTime = JSON.parse(localStorage.getItem("mining_startTime"));
    let _now = Math.round(Date.now()/1000);
    let _delta = _now - _mining_startTime;
    let _calc = _delta/86400 * 3000;
    let _boostRate = 1.00;
    _calc *= _boostRate;
    _calc = Math.round(_calc);
    return _calc;
}

function _write_summonerMode(_summoner, mode){
    localStorage.setItem("summonerMode", JSON.stringify(mode));
}

async function onChain_send_stopMining(_summoner) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "resting");
    let _calcMining = await onChain_call_calcMining(_summoner);
    let _coin = 0;
    if (JSON.parse(localStorage.getItem("coin")) != null) {
        _coin = JSON.parse(localStorage.getItem("coin"));
    }
    localStorage.setItem("coin", JSON.stringify(_coin + _calcMining));
}


async function onChain_send_startFarming(_summoner) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "farming");
    let _now = Math.round(Date.now()/1000);
    localStorage.setItem("farming_startTime", JSON.stringify(_now));
}

async function onChain_call_calcFarming(_summoner) {
    let _farming_startTime = JSON.parse(localStorage.getItem("farming_startTime"));
    let _now = Math.round(Date.now()/1000);
    let _delta = _now - _farming_startTime;
    let _calc = _delta/86400 * 3000;
    let _boostRate = 1.00;
    let _mapType = onChain_call_mapType(local_currentPos[0], local_currentPos[1]);
    if (_mapType == 1) {
        _boostRate += 0.5;
    }
    _calc *= _boostRate;
    _calc = Math.round(_calc);
    return _calc;
}

async function onChain_send_stopFarming(_summoner) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "resting");
    let _calcFarming = await onChain_call_calcFarming(_summoner);
    let _leaf = 0;
    if (JSON.parse(localStorage.getItem("leaf")) != null) {
        _leaf = JSON.parse(localStorage.getItem("leaf"));
    }
    localStorage.setItem("leaf", JSON.stringify(_leaf + _calcFarming));
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
        this.buttonMining = scene.add.sprite(0, 0, "button_mining")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_startMining(summoner);
                this.hide_window();
            });
        this.buttonMining_stop = scene.add.sprite(0, 0, "button_mining_stop")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_stopMining(summoner);
                this.hide_window();
            });
        this.buttonFarming = scene.add.sprite(0, 0, "button_farming")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_startFarming(summoner);
                this.hide_window();
            });
        this.buttonFarming_stop = scene.add.sprite(0, 0, "button_farming_stop")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_stopFarming(summoner);
                this.hide_window();
            });
        this.buttonCrafting = scene.add.sprite(0, 0, "button_crafting")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_startCrafting(summoner);
                this.hide_window();
            });
    }
    
    //### adjust_window
    adjust_window() {
        this.name.x = this.x;
        this.name.y = this.y - 37;
        this.window.x = this.x +30;
        this.window.y = this.y -100;
        this.windowText.x = this.window.x +5;
        this.windowText.y = this.window.y +5;
        this.buttonMining.x = this.window.x +25;
        this.buttonMining.y = this.window.y +75;
        this.buttonMining_stop.x = this.window.x +25;
        this.buttonMining_stop.y = this.window.y +75;
        this.buttonFarming.x = this.window.x +25+50;
        this.buttonFarming.y = this.window.y +75;
        this.buttonFarming_stop.x = this.window.x +25+50;
        this.buttonFarming_stop.y = this.window.y +75;
        this.buttonCrafting.x = this.window.x +25+50+50;
        this.buttonCrafting.y = this.window.y +75;
    }
    
    //### show_window
    show_window() {
        this.name.visible = true;
        this.window.visible = true;
        this.windowText.visible = true;
        if (this.mode == "mining") {
            this.buttonMining_stop.visible = true;
        } else if (this.mode == "farming") {
            this.buttonFarming_stop.visible = true;
        } else {
            this.buttonMining.visible = true;
            this.buttonFarming.visible = true;
            this.buttonCrafting.visible = true;
        }
    }
    
    
    //### hide_window
    hide_window() {
        this.name.visible = false;
        this.window.visible = false;
        this.windowText.visible = false;
        this.buttonMining.visible = false;
        this.buttonMining_stop.visible = false;
        this.buttonFarming.visible = false;
        this.buttonFarming_stop.visible = false;
        this.buttonCrafting.visible = false;
    }

    //### on_click
    on_click() {
        this.adjust_window();
        this.show_window();
        setTimeout( () => {
            this.hide_window();
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
                /*
                if (this.hex_targetted != 0) {
                    this.mode = "moving_toHex";
                    this.submode = 0;
                }
                */
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
                //console.log("limitX1")
            }else if (this.x > _hexX+25 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree += 180;
                //console.log("limitX2")
            }
            //out of area check, y
            //let _hexY = hexMatrix[this.posX][this.posY].y;
            let _hexY = this.hex_current.y;
            if (this.y > _hexY+25 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
                //console.log("limitY1")
            }else if (this.y < _hexY-25 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
                //console.log("limitY2")
            }

            //console.log("_hexX:", _hexX, "_hexY:", _hexY, "x:", this.x, "y:", this.y);

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
            let _deltaX = this.hex_targetted.x - this.hex_current.x;
            let _deltaY = this.hex_targetted.y - this.hex_current.y;
            let _deltaX2 = _deltaX * (1-local_moving_reminingPercent);
            let _deltaY2 = _deltaY * (1-local_moving_reminingPercent);
            this.x = this.hex_current.x + _deltaX2;
            this.y = this.hex_current.y + _deltaY2;
            /*
            let _deltaX = this.hex_targetted.x - this.x;
            let _deltaY = this.hex_targetted.y - this.y;
            let _deltaX2 = _deltaX / (Math.abs(_deltaX) + Math.abs(_deltaY)) * 0.2;
            let _deltaY2 = _deltaY / (Math.abs(_deltaX) + Math.abs(_deltaY)) * 0.2;
            this.x += _deltaX2;
            this.y += _deltaY2;
            */
            this.name.x = this.x;
            this.name.y = this.y -37;
            if (
                local_moving_reminingTime == 0
                /*
                this.x >= this.hex_targetted.x-10 
                && this.x <= this.hex_targetted.x+10 
                && this.y >= this.hex_targetted.y-10 
                && this.y <= this.hex_targetted.y+10
                */
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
    
    //### mining
    mining() {
        if (this.submode == 0) {
            this.anims.play("murasaki_mining", true);
            this.dist = "left"
            this.flipX = false;
            this.submode += 1;
        } else if (this.submode == 1) {
        }
    }

    //### farming
    farming() {
        if (this.submode == 0) {
            this.anims.play("murasaki_farming", true);
            this.dist = "left"
            this.flipX = false;
            this.submode += 1;
        } else if (this.submode == 1) {
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
        else if (this.mode == "mining") {this.mining();}
        else if (this.mode == "farming") {this.farming();}
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

        // hex
        this.load.image("hex_00", "png/hex_00.png");
        this.load.image("hex_01", "png/hex_01.png");
        this.load.image("hex_02", "png/hex_02.png");
        this.load.image("hex_03", "png/hex_03.png");
        this.load.image("hex_04", "png/hex_04.png");
        this.load.image("hex_05", "png/hex_05.png");
        this.load.image("hex_10", "png/hex_10.png");
        this.load.image("hex_11", "png/hex_11.png");
        this.load.image("hex_98", "png/hex_98.png");
        this.load.image("hex_99", "png/hex_99.png");

        // material
        this.load.image("coin", "png/mat_coin.png");
        this.load.image("leaf", "png/mat_leaf.png");
        this.load.spritesheet("flowers", "png/mat_flowers.png", {frameWidth: 370, frameHeight: 320});

        // etc
        this.load.image("logo_icon", "png/logo_icon.png");
        this.load.image("icon_zoomIn", "png/icon_zoomIn.png");
        this.load.image("icon_zoomOut", "png/icon_zoomOut.png");
        this.load.image("icon_zoomReset", "png/icon_zoomReset.png");

        // murasakisan
        this.load.spritesheet("murasaki_right", "png/murasaki_right.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_working_right", "png/murasaki_working_right.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_sleeping", "png/murasaki_sleeping2.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_happy", "png/murasaki_happy.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_mining", "png/murasaki_mining.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_farming", "png/murasaki_farming.png", {frameWidth: 370, frameHeight: 320});

        //craft
        this.load.image("craft_mining", "png/craft_mining.png");
        this.load.image("craft_farming", "png/craft_farming.png");
        this.load.image("craft_crafting", "png/craft_crafting.png");
        
        //button
        this.load.image("button_mining", "png/button_mining_enable.png");
        this.load.image("button_mining_stop", "png/button_mining_pointerover_stop.png");
        this.load.image("button_farming", "png/button_farming_enable.png");
        this.load.image("button_farming_stop", "png/button_farming_pointerover_stop.png");
        this.load.image("button_crafting", "png/button_crafting_enable.png");
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
        local_currentPos = await onChain_call_currentPos(summoner);

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
        
        // load scene
        this.scene.launch("System");
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
        scene.anims.create({
            key: "murasaki_mining",
            frames: scene.anims.generateFrameNumbers("murasaki_mining", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_farming",
            frames: scene.anims.generateFrameNumbers("murasaki_farming", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
    }
    

    //$$$ fc: hex
    async load_hex(scene) {

        // set hexagon position parameters
        
        let _numberX = 28;  // must be even number to calc _starHex
        let _numberY = 28;
        let _startHex = [local_currentPos[0]-_numberX/2, local_currentPos[1]-_numberY/2];
        let _hexagonWidth = game.textures.list["hex_00"].source[0].width;
        let _hexagonHeight = game.textures.list["hex_00"].source[0].height;
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
            3: "tropical",
        }

        // prepare hex matrix
        hexMatrix = new Array();
        //hexMatrix = new Array(65535);
        //for (let i=0; i<=65535; i++){
        //    hexMatrix[i] = new Array(63353);
        //}
        
        // prepare hex info window
        hexInfoWindow = scene.add.graphics();
        hexInfoWindow.fillStyle(0xFFF100, 0.9).fillRect(0, 0, 162, 100);
        hexInfoWindow.depth = 300;
        hexInfoWindow.visible = false;
        hexInfoText = scene.add.text(0, 0, "").setDepth(301).setColor("#000000");
        
        // prepare hex info button
        hexInfoButton = scene.add.text(0, 0, "[Move]")
            .setDepth(301)
            .setColor("#000000")
            .setInteractive({useHandCursor: true})
            .setVisible(false);
        hexInfoButton.on("pointerdown", () => {
            if (this.cameras.main.zoom >= 0.8) { // only when zoomOut
                onChain_send_startMoving(summoner, [hex_selected.posX, hex_selected.posY]);
                hexInfoButton.visible = false;
                /*
                murasakisan.hex_targetted = hex_selected;   //***TODO*** for onChain
                hex_targetted = hex_selected;
                _hexInfoButton.visible = false;
                hex_targetted_indicator.visible = true;
                hex_targetted_indicator.x = hex_selected.x;
                hex_targetted_indicator.y = hex_selected.y;
                onChain_send_currentPos([hex_targetted.posX, hex_targetted.posY]);
                flag_moving = 1;
                */
            }
        });
        
        // generate hexagons
        group_hex = scene.add.group();
        let _countX;
        let _countY;
        let _num;
        
        // for each y row
        // to adjust mergin, +1 in _numberX and _numberY
        _num = -1;
        _countY = -1;
        for (let iy=0; iy<_numberY+1; iy++) {
            _countY += 1;
            _countX = -1;
            
            // for each x column
            for (let ix=0; ix<_numberX+1; ix++) {
                _countX += 1;
                _num += 1;

                // def pixel x, y
                let _x = _startPosX + ix * _hexagonWidth + (iy % 2) * _hexagonWidth/2;
                let _y = _startPosY + iy * _hexagonWidth - iy * (_hexagonHeight/8 +_adjustHeight);
                
                // recalc hex pos
                let _posX = _startHex[0] + _countX;
                let _posY = _startHex[1] + _countY;

                // call hex type
                let _type = await onChain_call_mapType(_posX, _posY);
                
                // call hex climate
                let _climate = await onChain_call_mapClimate(_posX, _posY);

                // override, out of range
                let _dist = Math.sqrt( Math.pow(_countX-_numberX/2,2) + Math.pow(_countY-_numberY/2,2));
                if (_dist >= 14) {
                    continue;
                } else if (_dist >= 12) {
                    _type = 0;
                    _climate = 0;
                }

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
                } else if (_climate == 3) {
                    scene.add.sprite(_x, _y, "hex_11").setAlpha(0.1).setDepth(101);
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
                if (hex.type != 0) {
                    // call mat
                    let _li_mats = await onChain_call_materials(_posX, _posY);
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
                }
                
                // insert into hex matrix
                //hexMatrix[_posX][_posY] = hex;
                if (hexMatrix[_posX] == null) {
                    hexMatrix[_posX] = new Array();
                }
                hexMatrix[_posX][_posY] = hex;
                
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
                            //console.log("start dragging:", cameraTargetX, cameraTargetY);
                        }

                        // move hexInfo window
                        // only when zoomIn
                        hexInfoWindow.visible = true;
                        hexInfoWindow.x = hex.x + 40;
                        hexInfoWindow.y = hex.y + 75;

                        // prepare text
                        hexInfoText.x = hexInfoWindow.x+5;
                        hexInfoText.y = hexInfoWindow.y+5;
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
                        hexInfoText.visible = true;
                        hexInfoText.setText(_text);
                        
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
                            hexInfoButton.x = hexInfoWindow.x+50;
                            hexInfoButton.y = hexInfoWindow.y+68;
                            hexInfoButton.visible = true;
                        } else {
                            hexInfoButton.visible = false;
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
                if (hex.posX == local_currentPos[0] && hex.posY == local_currentPos[1]) {
                    hex_current = hex;
                }
            }
        }
        
        //prepare hex_current
        //hex_current = hexMatrix[currentPos[0]][currentPos[1]];
        hex_current_indicator = scene.add.sprite(hex_current.x, hex_current.y, "hex_99")
            .setAlpha(0.5)
            .setOrigin(0.5)
            .setDepth(102)
            .setScale(0.95);
                
        //prepare hex_targetted
        hex_targetted_indicator = scene.add.sprite(0, 0, "hex_98")
            .setAlpha(0.5)
            .setOrigin(0.5)
            .setDepth(102)
            .setVisible(false)
            .setScale(0.95);
        
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
                //console.log("end dragging", _cameraX, _cameraY);
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
        
        //$$$ onChain update
        if (turn % 200 == 0) {
            onChain_update_dynamicStatus();
        }
        
        //$$$ mode
        if (turn % 200 == 10) {
        
            // moving
            if (murasakisan.mode != "moving" && local_summonerMode == "moving"){
                hex_targetted = hexMatrix[local_targetPos[0]][local_targetPos[1]];
                murasakisan.hex_targetted = hex_targetted;
                murasakisan.mode = "moving_toHex";
                murasakisan.submode = 0;
                hexInfoButton.visible = false;
                hex_targetted_indicator.visible = true;
                hex_targetted_indicator.x = hex_targetted.x;
                hex_targetted_indicator.y = hex_targetted.y;
                flag_moving = 1;
            }

            // mining
            if (murasakisan.mode != "mining" && local_summonerMode == "mining"){
                murasakisan.mode = "mining";
                murasakisan.submode = 0;
            }

            // farming
            if (murasakisan.mode != "farming" && local_summonerMode == "farming"){
                murasakisan.mode = "farming";
                murasakisan.submode = 0;
            }
            
            // resting
            if (murasakisan.mode != "resting" && local_summonerMode == "resting"){
                murasakisan.mode = "resting";
                murasakisan.submode = 0;
            }
        }
        
        //$$$ icon
        //this.icon_zoomIn.scale
    }
}


//---System

class System extends Phaser.Scene {

    constructor() {
        super({ key:"System", active:false });
    }

    create() {
        
        //info
        this.icon_coin = this.add.sprite(668, 25, "coin")
            .setScale(0.07)
            .setDepth(500);
        this.text_coin = this.add.text(685, 15, "")
            .setColor("#000000");
        this.icon_leaf = this.add.sprite(815, 25, "leaf")
            .setScale(0.07)
            .setDepth(500);
        this.text_leaf = this.add.text(830, 15, "")
            .setColor("#000000");
        
        // system icon
        this.icon_zoomIn = this.add.sprite(1080, 915-15, "icon_zoomIn")
            .setOrigin(0.5)
            .setScale(0.02)
            .setDepth(500)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                scene_main.cameras.main.zoom *= 1.2;
                if (scene_main.cameras.main.zoom >= 3) {
                    scene_main.cameras.main.zoom = 3; // zoomIn limit
                }
            });
        this.icon_zoomOut = this.add.sprite(1080+75, 915-15, "icon_zoomOut")
            .setOrigin(0.5)
            .setScale(0.02)
            .setDepth(500)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                scene_main.cameras.main.zoom *= 0.8;
                if (scene_main.cameras.main.zoom <= 0.3) {
                    scene_main.cameras.main.zoom = 0.3; // zoomIn limit
                }
            });
        this.icon_zoomReset = this.add.sprite(1080+75+75, 915-15, "icon_zoomReset")
            .setOrigin(0.5)
            .setScale(0.02)
            .setDepth(500)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                scene_main.cameras.main.zoom = 1;
                scene_main.cameras.main.centerOn(murasakisan.x, murasakisan.y);
            });
        
        scene_system = this;
    }
    update() {
        if (turn % 200 == 100) {
            this.text_coin.setText(local_coin);
            this.text_leaf.setText(local_leaf);
        }
    }
}


//===Phaser3==================================================================================


var config = {
    //type: Phaser.AUTO,
    //parent: 'phaser-example',
    type: Phaser.CANVAS,
    parent: 'canvas',
    //backgroundColor: "E3E3E3",
    backgroundColor: "E3E3E3",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 960,
    },
    scene: [
        Main,
        System,
    ],
    fps: {
        target: 60,
    },
};


var game = new Phaser.Game(config);

