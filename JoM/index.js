

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

    
    
    
        
    

*/


//===Global==================================================================================

/*
let selected_hex;
let selected_posX = 20;
let selected_posY = 21;
let targeted_posX;
let targeted_posY;
let hex_selected;
*/

//global
let scene_main;
let turn = 0;
let cameraTargetX = 0;
let cameraTargetY = 0;
let murasakisan;
let hexMatrix;

//flag
let flag_drag = 0;
let flag_moving = 0;


//group
let group_update;
let group_hex;

//hex
let hex_current;
let hex_selected;
let hex_targetted;
let hex_current_posX = 19;
let hex_current_posY = 20;

let map = [
4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,2,2,2,2,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,2,2,2,2,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,2,2,2,2,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,0,0,2,2,4,4,4,4,4,4,4,
4,4,4,4,4,4,2,2,2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,4,4,4,4,4,4,
4,4,4,4,4,2,2,2,2,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,4,4,4,4,4,
4,4,4,4,2,2,2,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,4,4,4,4,
4,4,4,2,2,2,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,4,4,4,4,
4,4,4,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,4,4,4,
4,4,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,4,4,
4,4,2,2,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,4,4,
4,4,2,2,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,3,3,3,4,4,
4,4,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,4,4,
4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,4,4,0,0,0,0,0,0,0,0,0,3,3,3,3,3,4,4,
4,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,3,3,3,3,3,0,4,
4,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0,0,3,3,3,3,3,0,4,
4,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,
4,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,
4,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
4,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
4,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,4,
4,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0,4,
4,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,4,
4,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,4,
4,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,4,
4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,4,
4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,4,
4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,4,
4,4,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,4,4,
4,4,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,
4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,
4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,
4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,
4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,
4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,
4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,
4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,
4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,2,0,0,0,0,2,2,2,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,2,0,0,0,0,2,2,0,0,0,0,0,2,2,2,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,3,3,3,4,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,3,4,4,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
]



//===Class==================================================================================


//---Murasakisan
class Murasakisan extends Phaser.GameObjects.Sprite{
    
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
    }
    
    on_click() {
    }
    
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
            this.moving_count -= 1;
            if (this.moving_count <= 0) {
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            this.mode = "resting";
            this.submode = 0;
        }
    }
    
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
            if (
                this.x >= this.hex_targetted.x-10 
                && this.x <= this.hex_targetted.x+10 
                && this.y >= this.hex_targetted.y-10 
                && this.y <= this.hex_targetted.y+10
            ) {
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            hex_current.x = this.hex_targetted.x;
            hex_current.y = this.hex_targetted.y;
            this.hex_targetted = 0;
            hex_targetted.visible = false;
            this.mode = "happy";
            this.submode = 0;
            flag_moving = 0;
        }
    }
    
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
        this.load.image("hex_98", "hex_98.png");
        this.load.image("hex_99", "hex_99.png");
        this.load.image("coin", "coin.png");
        this.load.image("leaf", "leaf.png");
        this.load.spritesheet("murasaki_right", "murasaki_right.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_working_right", "murasaki_working_right.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_sleeping", "murasaki_sleeping2.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_happy", "murasaki_happy.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("flowers", "flowers.png", {frameWidth: 370, frameHeight: 320});
    }


    //### create
    create() {
    
        // prepare groups
        group_update = this.add.group();
        group_update.runChildUpdate = true;
        
        // set initial zoom
        this.cameras.main.zoom = 1.8;
    
        // prepare hexagons

        // set hexagon position parameters
        let _numberX = 50;
        let _numberY = 49;
        let _startPosX = -2500;
        let _startPosY = -2500;
        let _hexagonWidth = 168;
        let _hexagonHeight = 196;
        let _adjustWidth = -5;
        let _adjustHeight = -10;
        _hexagonWidth += _adjustWidth;
        let _dicHex = {
            0: "Unknown",
            1: "Forest",
            2: "Mountain",
            3: "Plain",
            4: "Water",
        }
        hexMatrix = new Array(99);
        for (let i=0; i<=99; i++){
            hexMatrix[i] = new Array(99);
        }
        
        // prepare hex info window
        let _hexInfo = this.add.graphics();
        _hexInfo.fillStyle(0xFFF100, 0.9).fillRect(0, 0, 162, 100);
        _hexInfo.depth = 300;
        _hexInfo.visible = false;
        let _hexInfoText = this.add.text(0, 0, "").setDepth(301).setColor("#000000");
        
        // prepare hex info button
        let _hexInfoButton = this.add.text(0, 0, "[Move]")
            .setDepth(301)
            .setColor("#000000")
            .setInteractive({useHandCursor: true})
            .setVisible(false);
        _hexInfoButton.on("pointerdown", () => {
            murasakisan.hex_targetted = hex_selected;
            _hexInfoButton.visible = false;
            hex_targetted.visible = true;
            hex_targetted.x = hex_selected.x;
            hex_targetted.y = hex_selected.y;
            flag_moving = 1;
        });
        
        // prepare hexagons
        group_hex = this.add.group();
        let _posX = 0 -1;
        let _posY = 0 -1;
        let _pos = 0;
        for (let iy=0; iy<_numberY; iy++) {
            _posY += 1;
            _posX = 0 -1;
            for (let ix=0; ix<_numberX; ix++) {
                _posX += 1;
                // def x, y
                let _x = _startPosX + ix * _hexagonWidth + (iy % 2) * _hexagonWidth/2;
                let _y = _startPosY + iy * _hexagonWidth - iy * (_hexagonHeight/8 +_adjustHeight);
                //map pos
                _pos += 1;
                let _map = map[_pos];

                // def hexagon

                let hex;

                // set texture depends on map type
                if (_map == 0) {
                    hex = this.add.sprite(_x, _y, "hex_00")
                } else if (_map == 1) {
                    hex = this.add.sprite(_x, _y, "hex_01")
                } else if (_map == 2) {
                    hex = this.add.sprite(_x, _y, "hex_02")
                } else if (_map == 3) {
                    hex = this.add.sprite(_x, _y, "hex_03")
                } else if (_map == 4) {
                    hex = this.add.sprite(_x, _y, "hex_04")
                }
                
                // set hex variants
                hex.pos = _pos;
                hex.type = map[_pos];
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
                        _text += _dicHex[hex.type] + "\n";
                        //_text += hex.x + ", " + hex.y;
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
                        _hexInfoText.setText(_text);
                        
                        // move button
                        if (flag_moving == 0) {
                            _hexInfoButton.x = _hexInfo.x+50;
                            _hexInfoButton.y = _hexInfo.y+65;
                            _hexInfoButton.visible = true;
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
                
                // put materials
                // def count
                let _rnd = Math.random()*100;
                let _count = 0;
                if (_rnd <= 1) {
                    _count = 3;
                } else if (_rnd <= 3) {
                    _count = 2;
                } else if (_rnd <= 10) {
                    _count = 1;
                }
                // put depends on count
                if (_count > 0) {
                    for (let i=0; i<_count; i++) {
                        let _x = hex.x-40+Math.random()*80;
                        let _y = hex.y-40+Math.random()*80;
                        let _material;
                        // put each materials depends on map type
                        if (hex.type == 1) {
                            _material = this.add.sprite(_x, _y, "leaf");
                            _material.setOrigin(0.5);
                            _material.setScale(0.1);
                            _material.setDepth(101);
                            hex.leaf += 1;
                        } else if (hex.type == 2) {
                            _material = this.add.sprite(_x, _y, "coin");
                            _material.setOrigin(0.5);
                            _material.setScale(0.1);
                            _material.setDepth(101);
                            hex.coin += 1;
                        } else if (hex.type == 3) {
                            _material = this.add.sprite(_x, _y, "flowers");
                            _material.setFrame(Math.round(Math.random()*5));
                            _material.setAngle(360*Math.random());
                            _material.setOrigin(0.5);
                            _material.setScale(0.15);
                            _material.setDepth(101);
                            hex.flower += 1;
                        }
                    }
                }
                
                // insert into hex matrix
                hexMatrix[_posX][_posY] = hex;
            }
        }
        
        //prepare hex_current
        //let hex_selected;
        {
            let ix = hex_current_posX;
            let iy = hex_current_posY;
            let _x = _startPosX + ix * _hexagonWidth + (iy % 2) * _hexagonWidth/2;
            let _y = _startPosY + iy * _hexagonWidth - iy * (_hexagonHeight/8 +_adjustHeight);
            hex_current = this.add.sprite(_x, _y, "hex_99")
            hex_current.setAlpha(0.5);
            hex_current.setOrigin(0.5);
            hex_current.depth = 102;
            hex_current.posX = hex_current_posX;
            hex_current.posY = hex_current_posY;
        }
        
        //prepare hex_targetted
        hex_targetted = this.add.sprite(0, 0, "hex_98")
            .setAlpha(0.5)
            .setOrigin(0.5)
            .setDepth(102)
            .setVisible(false);
        

        // detect mouse wheel
        this.input.on("wheel", (pointer) => {
            flag_drag = 0;  // reset dragging
            // increase/decrease camera zoom
            if (pointer.deltaY > 0) {
                //this.cameras.main.zoom -= 0.1;
                this.cameras.main.zoom *= 0.9;
                if (this.cameras.main.zoom <= 0.4) {
                    this.cameras.main.zoom = 0.4;   // zoomOut limit
                }
            } else {
                //this.cameras.main.zoom += 0.1;
                this.cameras.main.zoom *= 1.1;
                if (this.cameras.main.zoom >= 3) {
                    this.cameras.main.zoom = 3; // zoomIn limit
                }
            }
        });
        
        //animation
        this.anims.create({
            key: "murasaki_right",
            frames: this.anims.generateFrameNumbers("murasaki_right", {start:0, end:3}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: "murasaki_working_right",
            frames: this.anims.generateFrameNumbers("murasaki_working_right", {start:0, end:1}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: "murasaki_sleeping",
            frames: this.anims.generateFrameNumbers("murasaki_sleeping", {frames:[0,0,0,1,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: "murasaki_happy",
            frames: this.anims.generateFrameNumbers("murasaki_happy", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        
        //summoner
        murasakisan = new Murasakisan(this, hex_current.x, hex_current.y, hex_current)
            .setOrigin(0.5)
            .setScale(0.2)
            .setDepth(200);
        
        //key
        this.keys = {};
        this.keys.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //for debug
        scene_main = this;
    }


    //### update
    update() {
    
        turn += 1;
        
        // detect dragging
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
        
        // key
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

