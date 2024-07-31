
// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;

// 240801, v0.1.0

// openzeppelin v4.8
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/Base64.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/Strings.sol"; 
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/structs/EnumerableSet.sol";
import "github.com/AstarNetwork/astarbase/contract/example/IAstarBase.sol";


//---NFT
interface tokenURIGenerator {function tokenURI(uint _tokenId) external view returns (string memory);}
contract Murasaki_Terrarium is ERC721, Ownable, Pausable {

    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}
    
    // permittable
    mapping(address => bool) private permitted_address;
    function _add_permitted_address(address _address) external onlyOwner {permitted_address[_address] = true;}
    function _remove_permitted_address(address _address) external onlyOwner {permitted_address[_address] = false;}
    modifier onlyPermitted {require(permitted_address[msg.sender]);_;}
    
    // address
    address public address_tokenURIGenerator;
    function _set_address_tokenURIGenerator (address _address) external onlyOwner {
        address_tokenURIGenerator = _address;
    }

    //name
    constructor() ERC721("Terrarium of Murasaki-san", "ToM") {}

    // nft struct
    uint public next_nft = 1;
    struct nft {
        uint NFTSeed;
        uint mintTime;
        uint blockNumber;
    }
    mapping(uint => nft) public nfts;
    function get_NFTSeed (uint _nftId) external view returns (uint) {return nfts[_nftId].NFTSeed;}
    function get_mintTime (uint _nftId) external view returns (uint) {return nfts[_nftId].mintTime;}
    function get_blockNumber (uint _nftId) external view returns (uint) {return nfts[_nftId].blockNumber;}
    
    // flavor text
    mapping(uint => uint) public flavorTextId;

    // getters
    function NFTSeed (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].NFTSeed;
    }
    function mintTime (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].mintTime;
    }
    function blockNumber (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].blockNumber;
    }

    // mint
    function mint (
        uint _NFTSeed,
        address _wallet
    ) external whenNotPaused onlyPermitted {
    
        // prepare id
        uint _mintingId = next_nft;

        // update struct
        nfts[_mintingId] = nft(
            _NFTSeed,
            block.timestamp,
            block.number
        );
        
        // enumerable
        mySet[_wallet].add(_mintingId);
        
        // increment
        next_nft++;
        
        // mint
        _safeMint(_wallet, _mintingId);
    }
    
    // burn
    function burn (uint _tokenId) external whenNotPaused onlyPermitted {
        _burn(_tokenId);
    }
    
    // tokenURI, override
    function tokenURI (uint _tokenId) public view override whenNotPaused returns (string memory) {
        return tokenURIGenerator(address_tokenURIGenerator).tokenURI(_tokenId);
    }
    
    // enumerable
    using EnumerableSet for EnumerableSet.UintSet;
    mapping(address => EnumerableSet.UintSet) private mySet;
    function myListLength(address user) external view returns (uint) {
        return mySet[user].length();
    }
    function myListsAt(
        address user,
        uint start,
        uint count
    ) external view returns (uint[] memory rIds) {
        rIds = new uint[](count);
        for (uint idx = 0; idx < count; idx++) {
            rIds[idx] = mySet[user].at(start + idx);
        }
    }
    
    //override ERC721 transfer, 
    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal virtual override {
        mySet[_from].remove(_tokenId);
        mySet[_to].add(_tokenId);
        ERC721._transfer(_from, _to, _tokenId);
    }
    
    //override ERC721 burn
    function _burn(uint256 _tokenId) internal virtual override {
        address _owner = ERC721.ownerOf(_tokenId);
        mySet[_owner].remove(_tokenId);
        ERC721._burn(_tokenId);
    }
}



//---Storage
contract Murasaki_Terrarium_Storage is Ownable, Pausable {
    
    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}
    
    // permittable
    mapping(address => bool) private permitted_address;
    function _add_permitted_address(address _address) external onlyOwner {permitted_address[_address] = true;}
    function _remove_permitted_address(address _address) external onlyOwner {permitted_address[_address] = false;}
    modifier onlyPermitted {require(permitted_address[msg.sender]);_;}
    
    // Global parameters
    uint public CLEANING_LIMIT = 86400 * 30;   // 30 days
    uint public WEATHER_INVERVAL = 86400 * 3;   // 3 days
    uint public FLUFFY_CUTOFFSCORE = 100000;
    uint public SPEED = 100;    // 100=x1, 200=x2
    uint public LAST_ASTRPRICE = 1000000;   // $1 x 10**6
    function set_CLEANING_LIMIT (uint _val) external onlyOwner {CLEANING_LIMIT = _val;}
    function set_WEATHER_INVERVAL (uint _val) external onlyOwner {WEATHER_INVERVAL = _val;}
    function set_FLUFFY_CUTOFFSCORE (uint _val) external onlyOwner {FLUFFY_CUTOFFSCORE = _val;}
    function set_SPEED (uint _val) external onlyOwner {SPEED = _val;}
    function set_LAST_ASTRPRICE (uint _val) external onlyOwner {LAST_ASTRPRICE = _val;}
    
    // fluffy optimal parameter definitions
    mapping (uint => string) public fluffyColorsHex;
    mapping (uint => uint[3]) public fluffyColorsRGB;
    mapping (uint => uint) public fluffyOptimalTemperatures; 
    mapping (uint => uint) public fluffyOptimalHumids;
    function set_fluffyColorsHex (uint _no, string memory _str) external onlyOwner {fluffyColorsHex[_no] = _str;}
    function set_fluffyColorsRGB (uint _no, uint[3] memory _vals) external onlyOwner {fluffyColorsRGB[_no] = _vals;}
    function set_fluffyOptimalTemperatures (uint _no, uint _val) external onlyOwner {fluffyOptimalTemperatures[_no] = _val;}
    function set_fluffyOptimalHumids (uint _no, uint _val) external onlyOwner {fluffyOptimalHumids[_no] = _val;}
    function get_fluffyColorsHex (uint _type) external view returns (string memory) {return fluffyColorsHex[_type];}
    function get_fluffyColorsRGB (uint _type) external view returns (uint[3] memory) {return fluffyColorsRGB[_type];}
    function get_fluffyOptimalTemperature (uint _type) external view returns (uint) {return fluffyOptimalTemperatures[_type];}
    function get_fluffyOptimalHumid (uint _type) external view returns (uint) {return fluffyOptimalHumids[_type];}
    
    // pippel color definitions
    mapping (uint => string) public pippelColorStyle;
    function set_pippelColorStyle (uint _no, string memory _str) external onlyOwner {pippelColorStyle[_no] = _str;}
    function get_pippelColorStyle (uint _type) external view returns (string memory) {return pippelColorStyle[_type];}
    
    // Global status
    uint public global_weather; // 1-10000
    uint public global_weather_updatedTime;
    string public global_weather_str;
    function set_global_weather (uint _val) external onlyPermitted {global_weather = _val;}
    function set_global_weather_updatedTime (uint _val) external onlyPermitted {global_weather_updatedTime = _val;}
    function set_global_weather_str (string memory _str) external onlyPermitted {global_weather_str = _str;}
    
    // NFT parameters
    mapping (uint => uint) public temperature;      // 14-26
    mapping (uint => uint) public wateringAmount;   // 0-500
    mapping (uint => uint) public lightIntensity;   // 0-1000
    mapping (uint => string) public blackOpacity;   // .000-.200
    mapping (uint => string) public floorOpaci;     // .000-.200
    mapping (uint => string) public lumpScale;      // 14-24
    mapping (uint => uint) public local_weather;
    mapping (uint => string) public local_weather_str;
    function set_temperature (uint _tokenId, uint _val) external onlyPermitted {temperature[_tokenId] = _val;}
    function set_wateringAmount (uint _tokenId, uint _val) external onlyPermitted {wateringAmount[_tokenId] = _val;}
    function set_lightIntensity (uint _tokenId, uint _val) external onlyPermitted {lightIntensity[_tokenId] = _val;}
    function set_blackOpacity (uint _tokenId, string memory _val) external onlyPermitted {blackOpacity[_tokenId] = _val;}
    function set_floorOpaci (uint _tokenId, string memory _val) external onlyPermitted {floorOpaci[_tokenId] = _val;}
    function set_lumpScale (uint _tokenId, string memory _val) external onlyPermitted {lumpScale[_tokenId] = _val;}
    function set_local_weather (uint _tokenId, uint _val) external onlyPermitted {local_weather[_tokenId] = _val;}
    function set_local_weather_str (uint _tokenId, string memory _val) external onlyPermitted {local_weather_str[_tokenId] = _val;}
    
    // NFT degin parameters
    mapping (uint => string) public colorOfFlame_hex;
    mapping (uint => uint[3]) public colorOfFlame_rgb;
    mapping (uint => string) public colorOfYarnBall1_hex;
    mapping (uint => string) public colorOfYarnBall2_hex;
    mapping (uint => uint[3]) public colorOfYarnBall1_rgb;
    mapping (uint => uint[3]) public colorOfYarnBall2_rgb;
    function get_colorOfFlame_rgb (uint _nftId) external view returns (uint[3] memory) {return colorOfFlame_rgb[_nftId];}
    function get_colorOfYarnBall1_rgb (uint _nftId) external view returns (uint[3] memory) {return colorOfYarnBall1_rgb[_nftId];}
    function get_colorOfYarnBall2_rgb (uint _nftId) external view returns (uint[3] memory) {return colorOfYarnBall2_rgb[_nftId];}
    function set_colorOfYarnBall1_hex (uint _tokenId, string memory _val) external onlyPermitted {colorOfYarnBall1_hex[_tokenId] = _val;}
    function set_colorOfYarnBall2_hex (uint _tokenId, string memory _val) external onlyPermitted {colorOfYarnBall2_hex[_tokenId] = _val;}
    function set_colorOfYarnBall1_rgb (uint _tokenId, uint[3] memory _vals) external onlyPermitted {colorOfYarnBall1_rgb[_tokenId] = _vals;}
    function set_colorOfYarnBall2_rgb (uint _tokenId, uint[3] memory _vals) external onlyPermitted {colorOfYarnBall2_rgb[_tokenId] = _vals;}
    function set_colorOfFlame_hex (uint _tokenId, string memory _val) external onlyPermitted {colorOfFlame_hex[_tokenId] = _val;}
    function set_colorOfFlame_rgb (uint _tokenId, uint[3] memory _vals) external onlyPermitted {colorOfFlame_rgb[_tokenId] = _vals;}
    
    // NFT message parameters
    mapping (uint => string) public messageColor;
    mapping (uint => string) public messageText;
    function set_messageColor (uint _tokenId, string memory _val) external onlyPermitted {messageColor[_tokenId] = _val;}
    function set_messageText (uint _tokenId, string memory _val) external onlyPermitted {messageText[_tokenId] = _val;}
    
    // NFT laste updated status
    mapping (uint => uint) public last_updatedTime;
    mapping (uint => uint) public last_humidity;    // 0-100
    mapping (uint => uint) public last_nutrition;   // 0-255
    mapping (uint => uint) public last_score;
    mapping (uint => uint) public addPerHr_humidity;
    mapping (uint => bool) public addPerHr_humidity_isPositive;
    mapping (uint => uint) public addPerHr_nutrition;
    mapping (uint => bool) public addPerHr_nutrition_isPositive;
    mapping (uint => uint) public targetHumidity;
    mapping (uint => uint) public cleanCount;
    function set_last_updatedTime (uint _tokenId, uint _val) external onlyPermitted {last_updatedTime[_tokenId] = _val;}
    function set_last_humidity (uint _tokenId, uint _val) external onlyPermitted {last_humidity[_tokenId] = _val;}
    function set_last_nutrition (uint _tokenId, uint _val) external onlyPermitted {last_nutrition[_tokenId] = _val;}
    function set_last_score (uint _tokenId, uint _val) external onlyPermitted {last_score[_tokenId] = _val;}
    function set_addPerHr_humidity (uint _tokenId, uint _val) external onlyPermitted {addPerHr_humidity[_tokenId] = _val;}
    function set_addPerHr_humidity_isPositive (uint _tokenId, bool _val) external onlyPermitted {addPerHr_humidity_isPositive[_tokenId] = _val;}
    function set_addPerHr_nutrition (uint _tokenId, uint _val) external onlyPermitted {addPerHr_nutrition[_tokenId] = _val;}
    function set_addPerHr_nutrition_isPositive (uint _tokenId, bool _val) external onlyPermitted {addPerHr_nutrition_isPositive[_tokenId] = _val;}
    function set_targetHumidity (uint _tokenId, uint _val) external onlyPermitted {targetHumidity[_tokenId] = _val;}
    function set_cleanCount (uint _tokenId, uint _val) external onlyPermitted {cleanCount[_tokenId] = _val;}
    function increment_cleanCount (uint _tokenId) external onlyPermitted {cleanCount[_tokenId] += 1;}
    
    // NFT fluffy status
    mapping (uint => uint[13]) public fluffyScores;
    mapping (uint => string[10]) public fluffyString;
    function get_fluffyScore (uint _nftId, uint _type) external view returns (uint) {return fluffyScores[_nftId][_type];}
    function get_fluffyScores (uint _nftId) external view returns (uint[13] memory) {return fluffyScores[_nftId];}
    function get_fluffyString (uint _nftId) external view returns (string[10] memory) {return fluffyString[_nftId];}
    function set_fluffyScores (uint _tokenId, uint _type, uint _val) external onlyPermitted {fluffyScores[_tokenId][_type] = _val;}
    function set_fluffyString (uint _tokenId, string[10] memory _str) external onlyPermitted {fluffyString[_tokenId] = _str;}
    
    // init fluffy color definition, pippel color definition, global params
    constructor () {
        fluffyColorsHex[1] = "#FBFFF0";
        fluffyColorsHex[2] = "#FFE381";
        fluffyColorsHex[3] = "#FFD5D5";
        fluffyColorsHex[4] = "#FFBDA8";
        fluffyColorsHex[5] = "#FF686B";
        fluffyColorsHex[6] = "#FDBEFF";
        fluffyColorsHex[7] = "#DAB3FF";
        fluffyColorsHex[8] = "#8EACFF";
        fluffyColorsHex[9] = "#A9E8FF";
        fluffyColorsHex[10] = "#B7FFD0";
        fluffyColorsHex[11] = "#D8BFAC";
        fluffyColorsHex[12] = "#B3BFC7";
        fluffyColorsRGB[1] = [251,255,240];
        fluffyColorsRGB[2] = [255,227,129];
        fluffyColorsRGB[3] = [255,213,213];
        fluffyColorsRGB[4] = [255,189,168];
        fluffyColorsRGB[5] = [255,104,107];
        fluffyColorsRGB[6] = [253,190,255];
        fluffyColorsRGB[7] = [218,179,255];
        fluffyColorsRGB[8] = [142,172,255];
        fluffyColorsRGB[9] = [169,232,255];
        fluffyColorsRGB[10] = [183,255,208];
        fluffyColorsRGB[11] = [216,191,172];
        fluffyColorsRGB[12] = [179,191,199];
        fluffyOptimalTemperatures[1] = 26;
        fluffyOptimalTemperatures[2] = 25;
        fluffyOptimalTemperatures[3] = 24;
        fluffyOptimalTemperatures[4] = 23;
        fluffyOptimalTemperatures[5] = 22;
        fluffyOptimalTemperatures[6] = 21;
        fluffyOptimalTemperatures[7] = 20;
        fluffyOptimalTemperatures[8] = 19;
        fluffyOptimalTemperatures[9] = 18;
        fluffyOptimalTemperatures[10] = 17;
        fluffyOptimalTemperatures[11] = 16;
        fluffyOptimalTemperatures[12] = 15;
        fluffyOptimalHumids[1] = 38;
        fluffyOptimalHumids[2] = 40;
        fluffyOptimalHumids[3] = 42;
        fluffyOptimalHumids[4] = 44;
        fluffyOptimalHumids[5] = 46;
        fluffyOptimalHumids[6] = 48;
        fluffyOptimalHumids[7] = 50;
        fluffyOptimalHumids[8] = 52;
        fluffyOptimalHumids[9] = 54;
        fluffyOptimalHumids[10] = 56;
        fluffyOptimalHumids[11] = 58;
        fluffyOptimalHumids[12] = 60;
        pippelColorStyle[1] = "--pc1:#DFF1F4;--pc2:#F4EF86;--pc3:#E1D6E9;--pc4:#F19EC2;";   // white
        pippelColorStyle[2] = "--pc1:#FFFA70;--pc2:#F8BF7F;--pc3:#F4A33C;--pc4:#EC6D4E;";   // yellow
        pippelColorStyle[3] = "--pc1:#72BCE9;--pc2:#C6BFDF;--pc3:#12A3FC;--pc4:#FFFA70;";   // blue
        pippelColorStyle[4] = "--pc1:#F6CFD6;--pc2:#F19EC2;--pc3:#ED7BAC;--pc4:#9FCBF2;";   // pink
        pippelColorStyle[5] = "--pc1:#EEB7EE;--pc2:#D580E2;--pc3:#FAB2D4;--pc4:#C48DED;";   // purple
        global_weather = 5000;
        global_weather_updatedTime = block.timestamp;
        global_weather_str = "&#x2601;CL";
    }
}



//---Function1, mint/set/update
interface IDappsStaking {
    function read_contract_stake (address) external view returns (uint128);
    function read_staked_amount (bytes memory) external view returns (uint128);
    function read_staked_amount_on_contract (address, bytes memory) external view returns (uint128);
}
contract Murasaki_Terrarium_Function1 is Ownable, Pausable, ReentrancyGuard {

    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}
    
    // address
    address public address_Murasaki_Terrarium;
    address public address_Murasaki_Terrarium_Storage;
    address public address_Murasaki_Terrarium_Codex;
    address public address_Murasaki_Terrarium_WalletScore;
    address public address_Murasaki_Memento;
    address public address_Murasaki_Terrarium_AstarPrice;
    // local: 0xD0b9D72CcA4f7257181c62bAED1f466b842507f6
    // Astar: 0x8E2fa5A4D4e4f0581B69aF2f8F2Ef2CF205aE8F0
    address public address_AstarBase = 0xD0b9D72CcA4f7257181c62bAED1f466b842507f6;
    address public address_Murasaki_Main;
    function _set_address_Murasaki_Terrarium(address _address) external onlyOwner {address_Murasaki_Terrarium = _address;}
    function _set_address_Murasaki_Terrarium_Storage (address _address) external onlyOwner {address_Murasaki_Terrarium_Storage = _address;}
    function _set_address_Murasaki_Terrarium_Codex (address _address) external onlyOwner {address_Murasaki_Terrarium_Codex = _address;}
    function _set_address_Murasaki_Terrarium_WalletScore (address _address) external onlyOwner {address_Murasaki_Terrarium_WalletScore = _address;}
    function _set_address_Murasaki_Memento (address _address) external onlyOwner {address_Murasaki_Memento = _address;}
    function _set_address_Murasaki_Terrarium_AstarPrice (address _address) external onlyOwner {address_Murasaki_Terrarium_AstarPrice = _address;}
    function _set_address_AstarBase (address _address) external onlyOwner {address_AstarBase = _address;}
    function _set_address_Murasaki_Main (address _address) external onlyOwner {address_Murasaki_Main = _address;}
    
    // permittable
    mapping(address => bool) private permitted_address;
    function _add_permitted_address(address _address) external onlyOwner {permitted_address[_address] = true;}
    function _remove_permitted_address(address _address) external onlyOwner {permitted_address[_address] = false;}
    modifier onlyPermitted {require(permitted_address[msg.sender]);_;}
    
    // etc
    function absOfDiff (uint a, uint b) internal pure returns (uint) {
        if (a == b) {
            return 0;
        } else if (a > b) {
            return a - b;
        } else {
            return b -a;
        }
    }
    function rgbToHex(uint r, uint g, uint b) internal pure returns (string memory) {
        require(r <= 255 && g <= 255 && b <= 255, "Invalid RGB values");
        string memory hexR = _toHex(r);
        string memory hexG = _toHex(g);
        string memory hexB = _toHex(b);
        string memory hexColor = string(abi.encodePacked("#", hexR, hexG, hexB));
        return hexColor;
    }
    function _toHex(uint x) internal pure returns (string memory) {
        bytes memory hexDigits = "0123456789ABCDEF";
        bytes memory result = new bytes(2);
        result[0] = hexDigits[x >> 4];
        result[1] = hexDigits[x & 0x0F];
        return string(result);
    }
    function _checkOwner (address _wallet, uint _nftId) internal view returns (bool) {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        if (mt.ownerOf(_nftId) == _wallet) {
            return true;
        } else {
            return false;
        }
    }
    
    // mint NFT
    function mint (address _wallet) external onlyPermitted whenNotPaused {
        _mint(_wallet);
    }
    function _mint (address _wallet) internal {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        uint _nftId = mt.next_nft();
        uint _rnd = uint(keccak256(abi.encodePacked(block.timestamp, _wallet, _nftId)));
        mt.mint(_rnd, _wallet);
        _initNFT(_nftId, _rnd);
    }
    function _initNFT (uint _nftId, uint _rnd) internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        mts.set_last_humidity(_nftId, 50*100);
        mts.set_last_nutrition(_nftId, 20*100);
        // random fluffy born
        mts.set_fluffyScores(_nftId, _rnd % 12 + 1, mts.FLUFFY_CUTOFFSCORE());    // random 5d age fluffy
        //mts.set_fluffyScores(_nftId, 1, 120000);    // random 5d age fluffy
        mts.set_last_updatedTime(_nftId, block.timestamp);
        uint[3] memory _color1 = [uint(210), uint(102), uint(201)];
        uint[3] memory _color2 = [uint(52), uint(181), uint(0)];
        uint[3] memory _color3 = [uint(78), uint(149), uint(217)];
        _set_allParams(_nftId, 20, 200, 500, _color1, _color2, _color3);
    }
    
    // set NFT parameters
    function set_allParams (
        uint _nftId, 
        uint _temp, 
        uint _water, 
        uint _light,
        uint[3] memory _colorOfBall1,
        uint[3] memory _colorOfBall2,
        uint[3] memory _colorOfFlame
    ) external whenNotPaused nonReentrant {
        require(_checkOwner(msg.sender, _nftId));
        _set_allParams(_nftId, _temp, _water, _light, _colorOfBall1, _colorOfBall2, _colorOfFlame);
    }
    function _set_allParams (
        uint _nftId, 
        uint _temp, 
        uint _water, 
        uint _light,
        uint[3] memory _colorOfBall1,
        uint[3] memory _colorOfBall2,
        uint[3] memory _colorOfFlame
    ) internal {
        require(_temp >= 15 && _temp <= 26);
        require(_water >= 0 && _water <= 400);
        require(_light >= 0 && _light <= 1000);
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        // update and clean first
        _update_status(_nftId);
        // temp and floorOpaci
        mts.set_temperature(_nftId, _temp);
        string memory _floorOpaci;
        if (_temp >= 24) {
            _floorOpaci = ".200";
        } else if (_temp >= 22) {
            _floorOpaci = ".160";
        } else if (_temp >= 20) {
            _floorOpaci = ".120";
        } else if (_temp >= 18) {
            _floorOpaci = ".80";
        } else if (_temp >= 16) {
            _floorOpaci = ".40";
        } else {
            _floorOpaci = ".0";
        }
        mts.set_floorOpaci(_nftId, _floorOpaci);
        // water
        mts.set_wateringAmount(_nftId, _water);
        // light and lumpScale, blackOpaci
        mts.set_lightIntensity(_nftId, _light);
        string memory _blackOpacity;
        string memory _lumpScale;
        if (_light >= 750) {
            _blackOpacity = ".000";
            _lumpScale = "25";
        } else if (_light >= 500) {
            _blackOpacity = ".000";
            _lumpScale = "22";
        } else if (_light >= 250) {
            _blackOpacity = ".100";
            _lumpScale = "19";
        } else {
            _blackOpacity = ".200";
            _lumpScale = "16";
        }
        mts.set_blackOpacity(_nftId, _blackOpacity);
        mts.set_lumpScale(_nftId, _lumpScale);
        // colors
        _set_colorOfYarnBall1(_nftId, _colorOfBall1);
        _set_colorOfYarnBall2(_nftId, _colorOfBall2);
        _set_colorOfFlame(_nftId, _colorOfFlame);
        // update last
        _update_status_afterParamSet(_nftId);
    }
    function _set_colorOfYarnBall1 (uint _nftId, uint[3] memory _vals) internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        mts.set_colorOfYarnBall1_rgb(_nftId, _vals);
        string memory _hex = rgbToHex(_vals[0], _vals[1], _vals[2]);
        mts.set_colorOfYarnBall1_hex(_nftId, _hex);
    }
    function _set_colorOfYarnBall2 (uint _nftId, uint[3] memory _vals) internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        mts.set_colorOfYarnBall2_rgb(_nftId, _vals);
        string memory _hex = rgbToHex(_vals[0], _vals[1], _vals[2]);
        mts.set_colorOfYarnBall2_hex(_nftId, _hex);
    }
    function _set_colorOfFlame (uint _nftId, uint[3] memory _vals) internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        mts.set_colorOfFlame_rgb(_nftId, _vals);
        string memory _hex = rgbToHex(_vals[0], _vals[1], _vals[2]);
        mts.set_colorOfFlame_hex(_nftId, _hex);
    }
    
    // set message parameters
    function set_message (
        uint _nftId, 
        uint _colorR,
        uint _colorG,
        uint _colorB,
        string memory _text
    ) external whenNotPaused nonReentrant {
        require(_checkOwner(msg.sender, _nftId));
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        mts.set_messageColor(_nftId, rgbToHex(_colorR, _colorG, _colorB));
        require(_validate_msg(_text));
        mts.set_messageText(_nftId, _text);
    }
    function _validate_msg (string memory str) internal pure returns (bool){
        bytes memory b = bytes(str);
        if(b.length < 1) return false;
        if(b.length > 40) return false; // Cannot be longer than 40 characters
        if(b[0] == 0x20) return false; // Leading space
        if (b[b.length - 1] == 0x20) return false; // Trailing space
        bytes1 last_char = b[0];
        for(uint i; i<b.length; i++){
            bytes1 char = b[i];
            // can contain [0-9], [a-z], [A-z], [space], [#;&@.,!?-]
            if(
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x20) && //space
                !(char == 0x23) && //#
                !(char == 0x3b) && //;
                !(char == 0x26) && //&
                !(char == 0x2c) && //,
                !(char == 0x2e) && //.
                !(char == 0x21) && //!
                !(char == 0x3f) && //?
                !(char == 0x2d) && //-
                !(char == 0x40)  //@
            )
                return false;
            last_char = char;
        }
        return true;
    }
    
    // update
    // update NFT status and resete cleanliness
    // confirm: last_humid, last_nut, score, +nut, +humid, fluffyScores, time
    // realtime calc: humid, nut, clean
    // any player can execute
    function update_status (uint _nftId) external whenNotPaused nonReentrant {
        _update_status(_nftId);
    }
    function _update_status (uint _nftId) internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        // calc deltaSec to skip too close update for reducing gas cost
        uint _deltaSec = block.timestamp - mts.last_updatedTime(_nftId);
        uint _speed = mts.SPEED();
        if (_deltaSec * _speed / 100 > 3600 || mts.last_score(_nftId) == 0) {  // skip score update within 1 hr
            // update fluffy
            _update_fluffy(_nftId);
            // update humid, nut
            mts.set_last_humidity(_nftId, call_humidity(_nftId));
            mts.set_last_nutrition(_nftId, call_nutrition(_nftId));
            // update score
            uint _score = call_score(_nftId);
            mts.set_last_score(_nftId, _score);
            // update wallet score
            _update_walletScore(_nftId, _score);
            // update time and reset cleanliness
            mts.set_last_updatedTime(_nftId, block.timestamp);
            // increment cleaning count
            mts.increment_cleanCount(_nftId);
        }
        // update local weather, before humid and nut updating
        mts.set_local_weather(_nftId, mts.global_weather());
        mts.set_local_weather_str(_nftId, mts.global_weather_str());
        // update target humid
        mts.set_targetHumidity(_nftId, _calc_targetHumidity(_nftId));
        // update +nut
        (uint _val, bool _bool) = _calc_addPerHr_nutrition(_nftId);
        mts.set_addPerHr_nutrition(_nftId, _val);
        mts.set_addPerHr_nutrition_isPositive(_nftId, _bool);
        // try to update next global weather
        _update_globalWeather();
    }
    function _update_status_afterParamSet (uint _nftId) internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        // update fluffy
        //_update_fluffy(_nftId);
        // update humid, nut, score
        //mts.set_last_humidity(_nftId, call_humidity(_nftId));
        //mts.set_last_nutrition(_nftId, call_nutrition(_nftId));
        // update score
        //uint _score = call_score(_nftId);
        //mts.set_last_score(_nftId, _score);
        // update wallet score
        //_update_walletScore(_nftId, _score);
        // update local weather, before humid and nut updating
        //mts.set_local_weather(_nftId, mts.global_weather());
        //mts.set_local_weather_str(_nftId, mts.global_weather_str());
        // update target humid
        mts.set_targetHumidity(_nftId, _calc_targetHumidity(_nftId));
        // update +nut
        (uint _val, bool _bool) = _calc_addPerHr_nutrition(_nftId);
        mts.set_addPerHr_nutrition(_nftId, _val);
        mts.set_addPerHr_nutrition_isPositive(_nftId, _bool);
        // update time and reset cleanliness
        //mts.set_last_updatedTime(_nftId, block.timestamp);
        // try to update next global weather
        //_update_globalWeather();
    }
    
    // internal, update wallet score
    function _update_walletScore (uint _nftId, uint _newScore) internal {
        Murasaki_Terrarium_WalletScore mtws = Murasaki_Terrarium_WalletScore(address_Murasaki_Terrarium_WalletScore);
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        address _nftOwner = mt.ownerOf(_nftId);
        if (mtws.call_walletScore(_nftOwner) < _newScore) {
            mtws.set_walletScore(_nftOwner, _newScore);
        }
    }
    
    // internal, update fluffy status
    function _update_fluffy (uint _nftId) internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        // calc deltaScore
        uint _deltaScore = _calc_deltaScore(_nftId);
        // update each fluffy scores
        uint _temp = mts.temperature(_nftId);
        uint _humid = call_humidity(_nftId);
        uint[3] memory _averageColors = _calc_averageColors(_nftId);
        uint[13] memory _fluffyScores;
        for (uint _type=1; _type<=12; _type++) {
            uint _lastScore = mts.get_fluffyScore(_nftId, _type);
            uint _addScore = _calc_fluffyScoreAddition(_deltaScore, _type, _temp, _humid, _averageColors);
            uint _latestScore = _lastScore + _addScore;
            if (_latestScore > 4200000) {
                _latestScore = 4200000;     // max: 4200000, score max: 4,200,000 x5 = 21,000,000
            }
            mts.set_fluffyScores(_nftId, _type, _latestScore);
            _fluffyScores[_type] = _latestScore;
        }
        // update strings
        _update_fluffyString(_nftId, _fluffyScores);
    }
    
    // internal, update fluffy string
    struct IndexValue {
        uint fluffyType; 
        uint score;
    }
    function _update_fluffyString (uint _nftId, uint[13] memory _fluffyScores) internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        IndexValue[5] memory topFive = _getTopFive(_fluffyScores);
        string[10] memory _fluffyString;
        for (uint i=0; i<5; i++) {
            _fluffyString[i] = mts.get_fluffyColorsHex(topFive[i].fluffyType);
            // nex score = score / 1.4, scake step = -0.1, 1d = 23333 score
            if (topFive[i].score == 4200000) {
                _fluffyString[i+5] = "1.6";   // 0.6-1.6
            } else if (topFive[i].score >= 3000000) {
                _fluffyString[i+5] = "1.5";
            } else if (topFive[i].score >= 2142857) {
                _fluffyString[i+5] = "1.4";
            } else if (topFive[i].score >= 1530612) {
                _fluffyString[i+5] = "1.3";
            } else if (topFive[i].score >= 1093294) {
                _fluffyString[i+5] = "1.2";
            } else if (topFive[i].score >= 780925) {
                _fluffyString[i+5] = "1.1";
            } else if (topFive[i].score >= 557803) {
                _fluffyString[i+5] = "1.0";
            } else if (topFive[i].score >= 398431) {
                _fluffyString[i+5] = "0.9";
            } else if (topFive[i].score >= 284594) {
                _fluffyString[i+5] = "0.8";
            } else if (topFive[i].score >= 203281) {
                _fluffyString[i+5] = "0.7";
            } else if (topFive[i].score >= 145201) {
                _fluffyString[i+5] = "0.6";
            } else if (topFive[i].score >= mts.FLUFFY_CUTOFFSCORE()) {
                _fluffyString[i+5] = "0.5";
            } else {
                _fluffyString[i+5] = "0";
            }
        }
        mts.set_fluffyString(_nftId, _fluffyString);
    }
    function _getTopFive (uint[13] memory arr) internal pure returns (IndexValue[5] memory) {
        IndexValue[5] memory topFive;
        for (uint8 i = 1; i < 13; i++) {
            for (uint8 j = 0; j < 5; j++) {
                if (arr[i] > topFive[j].score) {
                    for (uint8 k = 4; k > j; k--) {
                        topFive[k] = topFive[k-1];
                    }
                    topFive[j] = IndexValue(i, arr[i]);
                    break;
                }
            }
        }
        return topFive;
    }
    
    // internal, update global weather
    function _update_globalWeather () internal {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _deltaSec = block.timestamp - mts.global_weather_updatedTime();
        _deltaSec *= mts.SPEED()/100;
        if (_deltaSec >= mts.WEATHER_INVERVAL()) {
            uint _weather = _calcAndUpdate_nextWeather();
            // prep weather icon and string
            if (_weather >= 8000) {
                mts.set_global_weather_str("&#x1f31e;CLR");
            } else if (_weather >= 6000) {
                mts.set_global_weather_str("&#x26c5;SUN");
            } else if (_weather >= 4000) {
                mts.set_global_weather_str("&#x2601;CLD");
            } else if (_weather >= 2000) {
                mts.set_global_weather_str("&#x1f302;DZL");
            } else {
                mts.set_global_weather_str("&#x2614;RAI");
            }
            mts.set_global_weather(_weather);
            mts.set_global_weather_updatedTime(block.timestamp);
        }
    }
    
    // internal, calc next weather from current price and update lasat ASTR price
    function _calcAndUpdate_nextWeather () internal returns (uint) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        Murasaki_Terrarium_AstarPrice mtp = Murasaki_Terrarium_AstarPrice(address_Murasaki_Terrarium_AstarPrice);
        uint _astarPrice = mtp.call_price();    // 10**6/USDC
        uint _weather;
        uint _delta;
        uint _lastAstarPrice = mts.LAST_ASTRPRICE();
        // +10%:10000 ~ -10%:0 /3d
        if (_astarPrice == _lastAstarPrice || _lastAstarPrice == 0) {
            _weather = 5000;
        } else if (_astarPrice > _lastAstarPrice) {
            _delta = ( (_astarPrice - _lastAstarPrice) * 100 / _lastAstarPrice ) * 5000 / 10; // max: +10%
            if (_delta > 5000) {
                _delta = 5000;
            }
            _weather = 5000 + _delta;
        } else {
            _delta = ( (_lastAstarPrice - _astarPrice) * 100 / _lastAstarPrice ) * 5000 / 10; // min: -10%
            if (_delta > 5000) {
                _delta = 5000;
            }
            _weather = 5000 - _delta;
        }
        // update last price
        mts.set_LAST_ASTRPRICE(_astarPrice);
        return _weather;
    }
    
    // internal, calc average color rgb of balls and flame
    function _calc_averageColors (uint _nftId) internal view returns (uint[3] memory) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint[3] memory _ball1 = mts.get_colorOfYarnBall1_rgb(_nftId);
        uint[3] memory _ball2 = mts.get_colorOfYarnBall2_rgb(_nftId);
        uint[3] memory _flame = mts.get_colorOfFlame_rgb(_nftId);
        uint[3] memory _ballAverage;
        // color effect: big ball > small ball > flame
        _ballAverage[0] = (_ball1[0] * 3 + _ball2[0] * 2 + _flame[0]) / 6;
        _ballAverage[1] = (_ball1[1] * 3 + _ball2[1] * 2 + _flame[1]) / 6;
        _ballAverage[2] = (_ball1[2] * 3 + _ball2[2] * 2 + _flame[2]) / 6;
        return _ballAverage;
    }
    
    // internal, calc delta of fluffy score addition from last updated time
    // light: affects by setting value
    // clean, humid: affects by crrent value
    // nut: affects by integrated value
    function _calc_deltaScore (uint _nftId) internal view returns (uint) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _deltaSec = block.timestamp - mts.last_updatedTime(_nftId);
        uint _light = mts.lightIntensity(_nftId);
        uint _clean = call_cleanliness(_nftId);
        uint _nut = call_nutrition(_nftId);
        uint _lastNut = mts.last_nutrition(_nftId);
        uint _addPerHr_nut = mts.addPerHr_nutrition(_nftId);
        // when nut=0, activeSec = sec during nut>0
        if (_nut == 0 && _deltaSec > 0 && _addPerHr_nut > 0) {
            _deltaSec = _lastNut * 3600 / _addPerHr_nut;
        }
        _deltaSec *= mts.SPEED()/100;
        _deltaSec = _deltaSec / 2;     // max=4,200,000/100d -> 42,000/d = 86400sec/2
        _deltaSec = _deltaSec * _light / 1000;              // light: 0=0%, 1000=100%
        _deltaSec = _deltaSec * (_clean + 1000) / (10000 + 1000);             // clean: 0=10%, 10000=100%
        // magni staking bonus + MoM bonus, staking: x1-x1.32, mom: +1%/nft
        //_deltaSec = _deltaSec * (calc_stakingBonusMagni(_nftId) + calc_MoMBonusMagni(_nftId))/100;
        _deltaSec = _deltaSec * calc_stakingBonusMagni(_nftId)/100;
        return _deltaSec;
    }
    
    // calc staking bonus
    function calc_stakingBonusMagni (uint _nftId) public view returns (uint) {  // 100=x1
        uint _amount = calc_dappStakingAmount(_nftId);
        uint _magni;
        if (_amount >= 128000) {
            _magni = 132;
        } else if (_amount >= 64000) {
            _magni = 128;
        } else if (_amount >= 32000) {
            _magni = 124;
        } else if (_amount >= 16000) {
            _magni = 120;
        } else if (_amount >= 8000) {
            _magni = 116;
        } else if (_amount >= 4000) {
            _magni = 112;
        } else if (_amount >= 2000) {
            _magni = 108;
        } else if (_amount >= 1000) {
            _magni = 104;
        } else {
            _magni = 100;
        }
        // additional bonus: MoM, +1%/nft
        _magni += calc_MoMBonusMagni(_nftId);
        return _magni;
    }
    
    // calc dapps staking amount ($ASTR)
    function calc_dappStakingAmount (uint _nftId) public view returns (uint) {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        address _owner = mt.ownerOf(_nftId);
        uint _staker = _get_staking_amount_wasm(_owner) + _get_staking_amount_evm(_owner);
        return _staker;
    }
    function _get_staking_amount_wasm (address _owner) internal view returns (uint) {
        IAstarBase ASTARBASE = IAstarBase(address_AstarBase);
        uint _staker_raw = ASTARBASE.checkStakerStatusOnContract(_owner, address_Murasaki_Main);
        uint _staker = _staker_raw / (10 ** 18);
        return _staker;
    }
    function _get_staking_amount_evm (address _owner) internal view returns (uint) {
        IDappsStaking DappsStaking = IDappsStaking(0x0000000000000000000000000000000000005001);
        uint _staker_raw = DappsStaking.read_staked_amount_on_contract(
            address_Murasaki_Main, 
            _addressToBytes(_owner)
        );
        uint _staker = _staker_raw / (10 ** 18);
        return _staker;
    }
    function _addressToBytes (address _address) internal pure returns (bytes memory) {
        bytes20 convertedBytes = bytes20(_address);
        return abi.encodePacked(convertedBytes);
    }
    
    // calc MoM bonus, +1%/nft
    function calc_MoMBonusMagni (uint _nftId) public view returns (uint) {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        ERC721 mom = ERC721(address_Murasaki_Memento);
        address _owner = mt.ownerOf(_nftId);
        return mom.balanceOf(_owner);
    }
    
    // internal, calc individual fluffy score addition (%)
    function _calc_fluffyScoreAddition (
        uint _deltaScore, 
        uint _fluffyType, 
        uint _temp, 
        uint _humid, 
        uint[3] memory _ballColors
    ) internal view returns (uint) {
        uint _coef_emv = _calc_coef_emv(_temp, _humid, _fluffyType);
        if (_coef_emv == 0) {return 0;}
        uint _coef_color = _calc_coef_color(_ballColors, _fluffyType);
        // coef_emv 50% x coef_color 50%
        return _deltaScore * (_coef_emv + _coef_color)/2/100;
    }
    function _calc_coef_emv (uint _temp, uint _humid, uint _fluffyType) internal view returns (uint) {
        if (_temp == 0 || _humid == 0) {return 0;}
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _coef_temp = 100 - absOfDiff(_temp, mts.get_fluffyOptimalTemperature(_fluffyType))*100/12;
        //uint _coef_light = 100 - absOfDiff(_light, mts.get_fluffyOptimalLight(_fluffyType))*100/1000;
        uint _coef_humid = 100 - absOfDiff(_humid, mts.get_fluffyOptimalHumid(_fluffyType))*100/7000;
        return _coef_temp * _coef_humid / 100;    // %
    }
    function _calc_coef_color (uint[3] memory _ballColors, uint _fluffyType) internal view returns (uint) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint[3] memory _optColors = mts.get_fluffyColorsRGB(_fluffyType);
        uint _coef_r = 100 - absOfDiff(_ballColors[0], _optColors[0])*100/255;
        uint _coef_g = 100 - absOfDiff(_ballColors[1], _optColors[1])*100/255;
        uint _coef_b = 100 - absOfDiff(_ballColors[2], _optColors[2])*100/255;
        return ((_coef_r + _coef_g + _coef_b)/3)**5 * 100 / 100**5;  // %
    }
    
    // internal, calc target humidity
    function _calc_targetHumidity (uint _nftId) internal view returns (uint) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _weather = mts.local_weather(_nftId);
        uint _temperature = mts.temperature(_nftId);
        uint _wateringAmount = mts.wateringAmount(_nftId);
        return __calc_targetHumidity(_weather, _temperature, _wateringAmount);
    }
    function __calc_targetHumidity (
        uint _weather,          // 0-10000
        uint _temperature,      // 15-26
        uint _wateringAmount    // 0-400
    ) internal pure returns (uint) {
        uint _targetHumid = _wateringAmount * 100 / 4;  // 0-10000, _water/4*100
        if (_weather >= 5000) { // good weather: -500 ~ 0
            if ( (_weather - 5000)/10 < _targetHumid) {
                _targetHumid -= (_weather - 5000) / 10;
            } else {
                _targetHumid = 0;
            }
        } else { // bad weather: 0 ~ +500
            _targetHumid += ( 5000 - _weather) / 10;
        }
        if (_temperature >= 20) {   // -600 ~ +600
            _targetHumid += (_temperature - 20) * 100;
        } else {
            if (_targetHumid >= (20 -_temperature) * 100) {
                _targetHumid -= (20 - _temperature) * 100;
            } else {
                _targetHumid = 0;
            }
        }
        if (_targetHumid > 100 * 100) {
            _targetHumid = 100 * 100;
        }
        return _targetHumid;
    }
    
    // internal, calc addPerHr_nutrition
    function _calc_addPerHr_nutrition (uint _nftId) internal view returns (uint, bool) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _weather = mts.local_weather(_nftId);
        uint _lightIntensity = mts.lightIntensity(_nftId);
        uint _fluffyScore = call_score(_nftId);
        return (__calc_addPerHr_nutrition(_weather, _lightIntensity, _fluffyScore));
    }
    function __calc_addPerHr_nutrition (
        uint _weather,
        uint _lightIntensity,
        uint _fluffyScore
    ) internal pure returns (uint, bool) {
        int _addPerHr_nut_int = 200;                            // base: +2/hr
        _addPerHr_nut_int += int(_weather) / 25;                // 10000=+4, 0=0
        _addPerHr_nut_int -= int(_fluffyScore) / 52500;         // 21,000,000=-4, 0=0
        _addPerHr_nut_int -= int(_lightIntensity) * 10 / 25;    // 0=0, 1000=-4
        bool _isPositive;
        uint _addPerHr_nut;
        if (_addPerHr_nut_int >= 0) {
            _isPositive = true;
            _addPerHr_nut = uint(_addPerHr_nut_int);
        } else {
            _isPositive = false;
            _addPerHr_nut = uint(-_addPerHr_nut_int);
        }
        return (_addPerHr_nut, _isPositive);
    }
    
    // call cleanliness, dynamic, [0-10000] from last_updatedTime
    function call_cleanliness (uint _nftId) public view whenNotPaused returns (uint) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _last_updatedTime = mts.last_updatedTime(_nftId);
        uint _CLEANING_LIMIT = mts.CLEANING_LIMIT();
        uint _deltaSec = block.timestamp - _last_updatedTime;
        _deltaSec *=  mts.SPEED()/100;
        uint _dirty = 10000 * _deltaSec / _CLEANING_LIMIT;
        uint _cleanliness;
        if (_dirty > 10000) {
            _cleanliness = 0;
        } else {
            _cleanliness = 10000 - _dirty;
        }
        return _cleanliness;
    }
    
    // call humidity2, dyanmic, calc from targetHumid, lastHumid, and deltaSec
    function call_humidity (uint _nftId) public view whenNotPaused returns (uint) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _targetHumid = mts.targetHumidity(_nftId);
        uint _lastHumid = mts.last_humidity(_nftId);
        uint _deltaSec = block.timestamp - mts.last_updatedTime(_nftId);
        return _call_humidity (_targetHumid, _lastHumid, _deltaSec);
    }
    function _call_humidity (uint _targetHumid, uint _lastHumid, uint _deltaSec) internal pure returns (uint) {
        uint _res;
        // after 3 days, set to targetHumid
        if (_deltaSec >= 86400 * 3 || _targetHumid == _lastHumid) {
            _res = _targetHumid;
        } else {
            // (_tgt - _last) x _time / (2 + _time) + _last
            if (_targetHumid > _lastHumid) {
                _res = _lastHumid + (_targetHumid - _lastHumid) * (_deltaSec/3600) / (2 + _deltaSec/3600);
            } else {
                _res = _lastHumid - (_lastHumid - _targetHumid) * (_deltaSec/3600) / (2 + _deltaSec/3600);
            }
        }
        return _res;
    }
    
    // calc nutrition, dynamic, mg * 100
    function call_nutrition (uint _nftId) public view whenNotPaused returns (uint) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _lastVal = mts.last_nutrition(_nftId);
        uint _deltaSec = block.timestamp - mts.last_updatedTime(_nftId);
        _deltaSec *= mts.SPEED()/100;
        uint _addPerHr = mts.addPerHr_nutrition(_nftId);
        bool _addPerHr_isPosi = mts.addPerHr_nutrition_isPositive(_nftId);
        uint _currentVal = 0;
        uint _deltaVal = _deltaSec * _addPerHr / 3600;
        if (_addPerHr_isPosi) {
            _currentVal = _lastVal + _deltaVal;
        } else {
            if (_lastVal < _deltaVal) {
                _currentVal = 0;
            } else {
                _currentVal = _lastVal - _deltaVal;
            }
        }
        if (_currentVal > 255 * 100) {
            _currentVal = 255 * 100;
        }
        return _currentVal;
    }
    
    // call score, not dynamic
    // sum of top 5 fluffy scores, max: 21,000,000 (=4,200,000 x5)
    function call_score (uint _nftId) public view whenNotPaused returns (uint) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint[13] memory _fluffyScores;
        for (uint _type=1; _type<=12; _type++) {
            _fluffyScores[_type] = mts.get_fluffyScore(_nftId, _type);
        }
        return _getTopFiveSum(_fluffyScores, mts.FLUFFY_CUTOFFSCORE());
    }
    // Sums top 5 numbers above cutoff from 13 integers; returns highest if all below cutoff.
    function _getTopFiveSum(uint[13] memory numbers, uint _cutOff) internal pure returns (uint) {
        uint first = 0;
        uint second = 0;
        uint third = 0;
        uint fourth = 0;
        uint fifth = 0;
        for (uint i = 0; i < numbers.length; i++) {
            if (numbers[i] > first) {
                fifth = fourth;
                fourth = third;
                third = second;
                second = first;
                first = numbers[i];
            } else if (numbers[i] > second) {
                fifth = fourth;
                fourth = third;
                third = second;
                second = numbers[i];
            } else if (numbers[i] > third) {
                fifth = fourth;
                fourth = third;
                third = numbers[i];
            } else if (numbers[i] > fourth) {
                fifth = fourth;
                fourth = numbers[i];
            } else if (numbers[i] > fifth) {
                fifth = numbers[i];
            }
        }
        uint sum = 0;
        uint count = 0;
        if (first >= _cutOff) {
            sum += first;
            count++;
        }
        if (second >= _cutOff) {
            sum += second;
            count++;
        }
        if (third >= _cutOff) {
            sum += third;
            count++;
        }
        if (fourth >= _cutOff) {
            sum += fourth;
            count++;
        }
        if (fifth >= _cutOff) {
            sum += fifth;
            count++;
        }
        if (count == 0) {
            return first;
        }
        return sum;
    }
    
    // fusion NFTs
    // nftId1: fusion_to, nftId2: fusion_from, will be burned
    function fusion (uint _nftId_fusionTo, uint _nftId_fusionFrom) external whenNotPaused nonReentrant {
        require(_checkOwner(msg.sender, _nftId_fusionTo));
        require(_checkOwner(msg.sender, _nftId_fusionFrom));
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        _update_status(_nftId_fusionTo);
        _update_status(_nftId_fusionFrom);
        // add 1/2 nut of fusion_from
        uint _newNut = mts.last_nutrition(_nftId_fusionTo) + mts.last_nutrition(_nftId_fusionFrom)/2;
        if (_newNut > 255 * 100) {
            _newNut = 255 * 100;
        }
        mts.set_last_nutrition(_nftId_fusionTo, _newNut);
        // add 1/2 each fluffy score of fusion_from
        uint _newFluffyScore;
        for (uint i=1; i<=12; i++) {
            _newFluffyScore = mts.get_fluffyScore(_nftId_fusionTo, i) + mts.get_fluffyScore(_nftId_fusionFrom, i)/2;
            if (_newFluffyScore > 4200000) {
                _newFluffyScore = 4200000;
            }
            mts.set_fluffyScores(_nftId_fusionTo, i, _newFluffyScore);
        }
        _update_status(_nftId_fusionTo);
        mt.burn(_nftId_fusionFrom);
    }
}



//---Function2, tokenURI, lootLike
contract Murasaki_Terrarium_Function2 is Ownable, Pausable {
    
    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}
    
    // address
    address public address_Murasaki_Terrarium;
    address public address_Murasaki_Terrarium_Storage;
    address public address_Murasaki_Terrarium_Codex;
    address public address_Murasaki_Terrarium_Function1;
    function _set_address_Murasaki_Terrarium(address _address) external onlyOwner {address_Murasaki_Terrarium = _address;}
    function _set_address_Murasaki_Terrarium_Storage (address _address) external onlyOwner {address_Murasaki_Terrarium_Storage = _address;}
    function _set_address_Murasaki_Terrarium_Codex (address _address) external onlyOwner {address_Murasaki_Terrarium_Codex = _address;}
    function _set_address_Murasaki_Terrarium_Function1 (address _address) external onlyOwner {address_Murasaki_Terrarium_Function1 = _address;}
    
    // tokenURI
    function tokenURI (uint _nftId) public view whenNotPaused returns (string memory) {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        require(mt.ownerOf(_nftId) != 0x0000000000000000000000000000000000000000);
        string memory output = string(abi.encodePacked(
            _prep_basic(_nftId),
            _prep_pippel(_nftId),
            _prep_fluffy(_nftId),
            _prep_basic2(),
            _prep_text(_nftId),
            _prep_footer(_nftId)
        ));
        output = Base64.encode(bytes(string(abi.encodePacked(
            '{"name": "Terrarium of Murasaki-san #', 
            Strings.toString(_nftId), 
            '", "description": "This full-on-chain NFT is a side project of House of Murasaki-san (https://murasaki-san.com).", "image": "data:image/svg+xml;base64,', 
            Base64.encode(bytes(output)), 
            '"}'
        ))));
        output = string(abi.encodePacked('data:application/json;base64,', output));
        return output;
    }
    
    // internal, svg prep functions
    function _prep_basic (uint _nftId) internal view returns (string memory) {
        Murasaki_Terrarium_Codex mtc = Murasaki_Terrarium_Codex(address_Murasaki_Terrarium_Codex);
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        Murasaki_Terrarium_Function1 mtf1 = Murasaki_Terrarium_Function1(address_Murasaki_Terrarium_Function1);
        string[7] memory _str;
        _str[0] = mts.colorOfFlame_hex(_nftId);
        _str[1] = mts.colorOfYarnBall1_hex(_nftId);
        _str[2] = mts.colorOfYarnBall2_hex(_nftId);
        _str[3] = mts.floorOpaci(_nftId);
        string memory _bedOpaci;    
        uint _clean = mtf1.call_cleanliness(_nftId);
        if (_clean >= 7500) {
            _bedOpaci = "0";
        } else if (_clean >= 5000) {
            _bedOpaci = ".050";
        } else if (_clean >= 2500) {
            _bedOpaci = ".100";
        } else if (_clean >= 1000) {
            _bedOpaci = ".150";
        } else {
            _bedOpaci = ".200";
        }
        _str[4] = _bedOpaci;    // dynamic
        _str[5] = mts.lumpScale(_nftId);
        string memory _dropScale;
        uint _humid = mtf1.call_humidity(_nftId);
        if (_humid >= 8000) {
            _dropScale = "14";
        } else if (_humid >= 6000) {
            _dropScale = "11";
        } else if (_humid >= 4000) {
            _dropScale = "8";
        } else if (_humid >= 2000) {
            _dropScale = "5";
        } else {
            _dropScale = "2";
        }
        _str[6] = _dropScale;    // dynamic
        return mtc.svg_basic(_str);
    }
    function _prep_pippel (uint _nftId) internal view returns (string memory) {
        Murasaki_Terrarium_Codex mtc = Murasaki_Terrarium_Codex(address_Murasaki_Terrarium_Codex);
        Murasaki_Terrarium_Function1 mtf1 = Murasaki_Terrarium_Function1(address_Murasaki_Terrarium_Function1);
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint _nut = mtf1.call_nutrition(_nftId);
        string memory _pippelStyle; // dynamic
        if (_nut >= 20000) {
            _pippelStyle = mts.get_pippelColorStyle(5);
        } else if (_nut >= 15000) {
            _pippelStyle = mts.get_pippelColorStyle(4);
        } else if (_nut >= 10000) {
            _pippelStyle = mts.get_pippelColorStyle(3);
        } else if (_nut >= 5000) {
            _pippelStyle = mts.get_pippelColorStyle(2);
        } else {
            _pippelStyle = mts.get_pippelColorStyle(1);
        }
        return mtc.svg_pippel(_pippelStyle);
    }
    function _prep_fluffy (uint _nftId) internal view returns (string memory) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        Murasaki_Terrarium_Codex mtc = Murasaki_Terrarium_Codex(address_Murasaki_Terrarium_Codex);
        return mtc.svg_fluffy(mts.get_fluffyString(_nftId));
    }
    function _prep_basic2 () internal view returns (string memory) {
        Murasaki_Terrarium_Codex mtc = Murasaki_Terrarium_Codex(address_Murasaki_Terrarium_Codex);
        return mtc.svg_basic2();
    }
    function _prep_text (uint _nftId) internal view returns (string memory) {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        Murasaki_Terrarium_Codex mtc = Murasaki_Terrarium_Codex(address_Murasaki_Terrarium_Codex);
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        Murasaki_Terrarium_Function1 mtf1 = Murasaki_Terrarium_Function1(address_Murasaki_Terrarium_Function1);
        string[11] memory _str;
        _str[0] = Strings.toString(_nftId);
        _str[1] = mts.local_weather_str(_nftId);
        _str[2] = Strings.toString(mts.temperature(_nftId));
        _str[3] = Strings.toString(mts.lightIntensity(_nftId));
        _str[4] = Strings.toString(mtf1.call_cleanliness(_nftId)/100);  // dynamic
        _str[5] = Strings.toString(mtf1.call_humidity(_nftId)/100);     // dynamic
        _str[6] = Strings.toString(mtf1.call_nutrition(_nftId)/100);    // dynamic
        _str[7] = Strings.toString(mts.last_score(_nftId));
        _str[8] = Strings.toString(mt.get_blockNumber(_nftId));
        _str[9] = mts.messageColor(_nftId);
        _str[10] = mts.messageText(_nftId);
        return mtc.svg_text(_str);
    }
    function _prep_footer (uint _nftId) internal view returns (string memory) {
        Murasaki_Terrarium_Codex mtc = Murasaki_Terrarium_Codex(address_Murasaki_Terrarium_Codex);
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        return mtc.svg_footer(mts.blackOpacity(_nftId));
    }
    
    // fluffy infos
    string[36] private fluffyCharacter = [
        "Curious",
        "Adaptable",
        "Enthusiastic",
        "Sensitive",
        "Imaginative",
        "Affectionate",
        "Playful",
        "Gentle",
        "Cuddly",
        "Fluffy",
        "Bubbly",
        "Cheerful",
        "Adorable",
        "Cozy",
        "Snuggly",
        "Whimsical",
        "Tiny",
        "Bouncy",
        "Mischievous",
        "Soft",
        "Fuzzy",
        "Quirky",
        "Squishy",
        "Giggly",
        "Curios",
        "Pudgy",
        "Wispy",
        "Perky",
        "Docile",
        "Dainty",
        "Gregarious",
        "Empathetic",
        "Loyal",
        "Attentive",
        "Patient",
        "Charismatic"
    ];
    string[13] private fluffyName = [
        "",
        "white fluffy",
        "yellow fluffy",
        "pink fluffy",
        "orange fluffy",
        "red fluffy",
        "redpurple fluffy",
        "purple fluffy",
        "blue fluffy",
        "lightblue fluffy",
        "limegreen fluffy",
        "beige fluffy",
        "gray fluffy"
    ];
    function _call_fluffyCharacter (uint _nftId, uint _fluffyType) internal view returns (string memory) {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        uint _seed = mt.get_NFTSeed(_nftId);
        uint _rnd = uint(keccak256(abi.encodePacked(_seed, _fluffyType))) % 36;
        return fluffyCharacter[_rnd];
    }
    function _prep_fluffyDescriptions (uint _nftId, uint _fluffyType, uint _rank) internal view returns (string memory) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        string memory _chara = _call_fluffyCharacter(_nftId, _fluffyType);
        string memory _name = fluffyName[_fluffyType];
        uint _score = mts.get_fluffyScore(_nftId, _fluffyType);
        string memory _res;
        if (_rank >= 1 && _score <= mts.FLUFFY_CUTOFFSCORE()) {
            _res = "---";
        } else {
            _res = string(abi.encodePacked(
                _chara,
                " ",
                _name,
                " (&#x2764;",
                Strings.toString(_score),
                ")"
            ));
        }
        return _res;
    }
    function _call_topFiveFluffyDescriptions (uint _nftId) internal view returns (string[5] memory) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        uint[13] memory _fluffyScores;
        for (uint _type=1; _type<=12; _type++) {
            _fluffyScores[_type] = mts.get_fluffyScore(_nftId, _type);
        }
        IndexValue[5] memory topFive = _getTopFive(_fluffyScores);
        string[5] memory _res;
        for (uint i=0; i<5; i++) {
            _res[i] = _prep_fluffyDescriptions(_nftId, topFive[i].fluffyType, i);
        }
        return _res;
    }
    struct IndexValue {
        uint fluffyType; 
        uint score;
    }
    function _getTopFive (uint[13] memory arr) internal pure returns (IndexValue[5] memory) {
        IndexValue[5] memory topFive;
        for (uint8 i = 1; i < 13; i++) {
            for (uint8 j = 0; j < 5; j++) {
                if (arr[i] > topFive[j].score) {
                    for (uint8 k = 4; k > j; k--) {
                        topFive[k] = topFive[k-1];
                    }
                    topFive[j] = IndexValue(i, arr[i]);
                    break;
                }
            }
        }
        return topFive;
    }
    
    // call all info
    function call_infoInt (uint _nftId) external view whenNotPaused returns (uint[33] memory) {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        Murasaki_Terrarium_Function1 mtf1 = Murasaki_Terrarium_Function1(address_Murasaki_Terrarium_Function1);
        uint[33] memory _res;
        // storage infos
        _res[0] = block.timestamp - mt.get_mintTime(_nftId);
        _res[1] = mts.global_weather();
        _res[2] = mts.temperature(_nftId);
        _res[3] = mts.wateringAmount(_nftId);
        _res[4] = mts.lightIntensity(_nftId);
        _res[5] = mts.local_weather(_nftId);
        _res[6] = mts.last_updatedTime(_nftId);
        _res[7] = mts.last_humidity(_nftId);
        _res[8] = mts.last_nutrition(_nftId);
        _res[9] = mts.last_score(_nftId);
        _res[10] = mts.cleanCount(_nftId);
        //_res[10] = mts.addPerHr_humidity(_nftId);
        _res[11] = block.timestamp;
        /*
        bool _bool = mts.addPerHr_humidity_isPositive(_nftId);
        uint _tmp = uint(0);
        if (_bool) {_tmp=uint(1);}
        _res[12] = _tmp;
        */
        _res[12] = mts.targetHumidity(_nftId);
        _res[13] = mts.addPerHr_nutrition(_nftId);
        uint _tmp = uint(0);
        bool _bool = mts.addPerHr_nutrition_isPositive(_nftId);
        if (_bool) {_tmp=uint(1);}
        _res[14] = _tmp;
        // storage fluffy infos
        uint[13] memory _fluffyScores = mts.get_fluffyScores(_nftId);
        _res[15] = _fluffyScores[1];
        _res[16] = _fluffyScores[2];
        _res[17] = _fluffyScores[3];
        _res[18] = _fluffyScores[4];
        _res[19] = _fluffyScores[5];
        _res[20] = _fluffyScores[6];
        _res[21] = _fluffyScores[7];
        _res[22] = _fluffyScores[8];
        _res[23] = _fluffyScores[9];
        _res[24] = _fluffyScores[10];
        _res[25] = _fluffyScores[11];
        _res[26] = _fluffyScores[12];
        // calc infos
        _res[27] = mtf1.calc_stakingBonusMagni(_nftId);
        _res[28] = mtf1.calc_dappStakingAmount(_nftId);
        _res[29] = mtf1.call_cleanliness(_nftId);
        _res[30] = mtf1.call_humidity(_nftId);
        _res[31] = mtf1.call_nutrition(_nftId);
        _res[32] = mts.SPEED();
        return _res;
    }
    function call_infoStr (uint _nftId) external view whenNotPaused returns (string[10] memory) {
        Murasaki_Terrarium_Storage mts = Murasaki_Terrarium_Storage(address_Murasaki_Terrarium_Storage);
        string[10] memory _res;
        _res[0] = mts.global_weather_str();
        _res[1] = mts.colorOfFlame_hex(_nftId);
        _res[2] = mts.colorOfYarnBall1_hex(_nftId);
        _res[3] = mts.colorOfYarnBall2_hex(_nftId);
        // fluffy descriptions
        string[5] memory _fluffyDescriptions = _call_topFiveFluffyDescriptions(_nftId);
        _res[4] = _fluffyDescriptions[0];
        _res[5] = _fluffyDescriptions[1];
        _res[6] = _fluffyDescriptions[2];
        _res[7] = _fluffyDescriptions[3];
        _res[8] = _fluffyDescriptions[4];
        _res[9] = mts.local_weather_str(_nftId);
        return _res;
    }
}



//---Codex
contract Murasaki_Terrarium_Codex is Ownable, Pausable {
    
    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}
    
    // basic
    // mainColor, ballColor1, ballColor2, floorOpaci, bedOpaci, lumpScale, dropScale, , 
    function svg_basic (string[7] memory _str) external view whenNotPaused returns (string memory) {
        string memory part1 = _svg_basic1(_str);
        string memory part2 = _svg_basic2(_str);
        return string(abi.encodePacked(part1, part2));
    }
    function _svg_basic1 (string[7] memory _str) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMinYMin meet" viewBox="0 0 500 500"><style>:root{--bc1:',
            _str[0],
            ';--kc1:',
            _str[1],
            ';--kc2:',
            _str[2],
            ';}</style><defs><filter id="b.5"><feGaussianBlur stdDeviation=".5"/></filter><filter id="b1"><feGaussianBlur stdDeviation="1"/></filter><filter id="b2"><feGaussianBlur stdDeviation="2"/></filter><filter id="b3"><feGaussianBlur stdDeviation="2"/></filter><filter id="b5"><feGaussianBlur stdDeviation="5"/></filter></defs><g><rect width="500" height="500" fill="var(--bc1)" fill-opacity=".15"/><circle cx="250" cy="250" r="250" fill="#FFF" fill-opacity="0.5"><animate attributeName="r" values="250;260;250" dur="5s" repeatCount="indefinite"/></circle><g filter="url(#b1)"><rect y="463" width="323" height="37" fill="#E1CBBD"/><rect x="276" y="463" width="224" height="37" fill="#F7E1C3"/><rect y="430" width="163" height="40" fill="#F7E1C3"/><rect x="109" y="430" width="391" height="40" fill="#F5DBCD"/><line x1="1" y1="429" x2="500" y2="430" stroke="#A6A6A6" stroke-width="2"/></g><rect y="430" width="500" height="70" fill="#F15A22" fill-opacity="',
            _str[3]
        ));
    }
    function _svg_basic2 (string[7] memory _str) private pure returns (string memory) {
        return string(abi.encodePacked(
            '"/><ellipse cx="250" cy="449" rx="175" ry="14" fill="var(--bc1)" fill-opacity=".3"/><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF"/><stop offset="1" stop-color="var(--bc1)"/></linearGradient><g style="fill-opacity:0.25;" fill="url(#h)"><path d="m38 260 92-183h242l92 183-92 184H130L38 260Z"/></g><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF"/><stop offset="0.7" stop-color="var(--kc1)"/><stop offset="1" stop-color="var(--kc1)"/></linearGradient><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF"/><stop offset="0.7" stop-color="var(--kc2)"/><stop offset="1" stop-color="var(--kc2)"/></linearGradient><g filter="url(#b2)"><circle cx="230" cy="274" r="82" fill="url(#b)"/><circle cx="193" cy="237" r="20" fill="#FFF" fill-opacity="0.2"/></g><g filter="url(#b1)"><circle cx="146" cy="294" r="59" fill="url(#c)"/><circle cx="116" cy="264" r="10" fill="#FFF" fill-opacity="0.2"/></g><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF"/><stop offset="0.3" stop-color="#F2EBD3"/><stop offset="1" stop-color="#d9d3bd"/></linearGradient><pattern id="ct" width="20" height="20" patternUnits="userSpaceOnUse" fill="#717375"><circle cx="5" cy="5" r="2" fill-opacity="0.2"/><circle cx="15" cy="15" r="2" fill-opacity="0.2"/><circle cx="10" cy="10" r="1.5" fill-opacity="0.1"/></pattern><polygon points="74,339 428,339 374,445 128,445" fill="url(#d)" stroke="rgba(0,0,0,0.05)" stroke-width="3"/><polygon points="74,339 428,339 374,445 128,445" fill="url(#ct)" fill-opacity="0.7"/><polygon points="74,339 428,339 374,445 128,445" fill="000" fill-opacity="',
            _str[4],
            '"/><g fill="#8B4513" filter="url(#b.5)"><path d="M342 93h5v68h-5V93Zm18 0h5v68h-5V93Z"/><path d="M342 93h23v5h-23v-5Zm0 63h23v5h-23v-5Zm0-63 11-9 12 9h-23Z"/><circle cx="353.5" cy="84" r="4"/></g><circle cx="353" cy="125" fill="#f5e247" fill-opacity=".7" filter="url(#b3)"><animate attributeName="r" values="12;',
            _str[5],
            ';12" dur="5s" repeatCount="indefinite"/></circle><circle cx="180" cy="78" r="',
            _str[6],
            '" fill="#A6CAEC"><animateTransform attributeName="transform" type="translate" values="0 0;0 300;0 300;0 0" keyTimes="0;0.8;1;1" dur="8s" repeatCount="indefinite"/><animate attributeName="opacity" keyTimes="0;0.8;1;1" values="0.7;0;0;0" dur="8s" repeatCount="indefinite" /></circle><circle cx="310" cy="78" r="',
            _str[6],
            '" fill="#c0d9f1"><animateTransform attributeName="transform" type="translate" values="0 0;0 300;0 300;0 0" keyTimes="0;0.8;1;1" dur="8s" repeatCount="indefinite" begin="4s"/><animate attributeName="opacity" keyTimes="0;0.8;1;1" values="0.7;0;0;0" dur="8s" repeatCount="indefinite" begin="4s"/></circle><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ab7152"/><stop offset="1" stop-color="#933d10"/></linearGradient><g><path fill="#933D10" fill-rule="evenodd" d="M240 45a11 11 0 1 1 22 0 11 11 0 0 1-22 0Z"/><rect x="145" y="44" width="210" height="34" rx="7" ry="7" fill="url(#a)"/></g><linearGradient id="e" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF"/><stop offset="0.2" stop-color="var(--bc1)"/><stop offset="1" stop-color="var(--bc1)"/></linearGradient><use xlink:href="#x" style="fill-opacity:0; stroke-opacity:0.8" stroke="url(#e)" stroke-width="18" stroke-linejoin="round" filter="url(#b.5)"/></g>'
        ));
    }
    
    // pippel
    // color1, 2, 3, 4
    function svg_pippel (string memory _str) external view whenNotPaused returns (string memory) {
        string memory _res = string(abi.encodePacked(
            '<style>:root {',
            _str,
            '}</style><g transform="translate(390 277) scale(2)"><g transform="translate(0 31.5) scale(0.25)"><g stroke="#ffffff" stroke-opacity="0.2" stroke-width="10"><path d="m0 0c2.5-16.4 5.6-33.3 5.7-47.8 0-14.5-4.4-32.3-5.4-39.4-1-7.1-1.5-8.8-1.7-12-.2-3.2.2-6.7.6-9.8" id="pippelStem" fill="none" stroke-linecap="round"/></g><linearGradient id="grad2" x1="0%" y1="500%" x2="0%" y2="0%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#73EAA1"/></linearGradient><use xlink:href="#pippelStem" stroke-opacity="1" stroke="url(#grad2)" stroke-width="8"/><g fill="#73EAA1" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1" fill-opacity="1"><path d="m8 -45c.1-.1-.2-3.3 2-5.2 2.1-1.9 9.3-10.8 12.4-10.8 3 0 5.3 7.5 5.8 10.8.5 3.2-.9 6.5-2.9 8.7-2 2.2-6.6 4.3-9.2 4.7-2.6.4-5-1-6.4-2.4-1.4-1.4-1.5-3.6-1.7-5.8z"/><path d="m0 -20c-1.1-1.9-4.3-5.2-6.8-7.2-2.5-2-6-4.2-8-4.7-2-.5-3.2.6-4 1.7-.7 1.2-.5 3.5-.3 5.2.1 1.7.5 3.6 1 5.2.5 1.5 1.2 2.8 1.9 3.9.7 1.1 1.1 1.9 2.5 2.5 1.3.6 3.7 1.3 5.6 1.1 1.8-.2 4.1-1.5 5.4-2.1 1.3-.6 2.2-.7 2.6-1.5.5-.9 1.1-2.1 0-4z"/></g></g><g transform="translate(0 3) scale(1.0)" fill-opacity="0.5"><circle cx="0" cy="0" r="8" fill="#ffffff" fill-opacity="0.6" filter="url(#b1)"/><circle cx="0" cy="0" r="1.5" fill="var(--pc1)" fill-opacity="0.6"/><g transform="scale(3 3)"><circle cx="2" cy="0" r="1" fill="var(--pc1)"/><circle cx="1.73" cy="1" r="0.8" fill="var(--pc2)"/><circle cx="1" cy="1.73" r="1" fill="var(--pc3)"/><circle cx="0" cy="2" r="0.8" fill="var(--pc1)"/><circle cx="-1" cy="1.73" r="1" fill="var(--pc2)"/><circle cx="-1.73" cy="1" r="0.8" fill="var(--pc1)"/><circle cx="-2" cy="0" r="1" fill="var(--pc3)"/><circle cx="-1.73" cy="-1" r="0.8" fill="var(--pc1)"/><circle cx="-1" cy="-1.73" r="1" fill="var(--pc2)"/><circle cx="0" cy="-2" r="0.8" fill="var(--pc4)"/><circle cx="1" cy="-1.73" r="1" fill="var(--pc1)" /><circle cx="1.73" cy="-1" r="0.8" fill="var(--pc3)"/><animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="90s" repeatCount="indefinite" additive="sum"/></g><g transform="scale(2 2)"><circle cx="2" cy="0" r="1.5" fill="var(--pc1)"/><circle cx="1.73" cy="1" r="1" fill="var(--pc2)"/><circle cx="1" cy="1.73" r="1" fill="var(--pc1)"/><circle cx="0" cy="2" r="1.5" fill="var(--pc4)"/><circle cx="-1" cy="1.73" r="1" fill="var(--pc1)"/><circle cx="-1.73" cy="1" r="1" fill="var(--pc2)"/><circle cx="-2" cy="0" r="1.5" fill="var(--pc3)"/><circle cx="-1.73" cy="-1" r="1" fill="var(--pc2)"/><circle cx="-1" cy="-1.73" r="1" fill="var(--pc3)"/><circle cx="0" cy="-2" r="1.5" fill="var(--pc1)"/><circle cx="1" cy="-1.73" r="1" fill="var(--pc4)"/><circle cx="1.73" cy="-1" r="1" fill="var(--pc3)"/><animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="60s" repeatCount="indefinite" additive="sum"/></g></g></g>'
        ));
        return _res;
    }
    
    // fluffy
    // scale1,2,3,4,5, color1,2,3,4,5
    function svg_fluffy (string[10] memory _str) external view whenNotPaused returns (string memory) {
        string memory part1 = _svg_fluffy1(_str);
        string memory part2 = _svg_fluffy2(_str);
        string memory part3 = _svg_fluffy3(_str);
        return string(abi.encodePacked(part1, part2, part3));
    }
    function _svg_fluffy1 (string[10] memory _str) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<style>:root {--fc1:',
            _str[0],
            ';--fc2:',
            _str[1],
            ';--fc3:',
            _str[2],
            ';--fc4:',
            _str[3]
        ));
    }
    function _svg_fluffy2 (string[10] memory _str) private pure returns (string memory) {
        return string(abi.encodePacked(
            ';--fc5:',
            _str[4],
            ';}</style><g><filter id="fluffyShadow"><feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/><feOffset dx="2" dy="2" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.75"/></feComponentTransfer><feMerge> <feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><style>.f1 circle,.f1 use{animation:moveX 3.3s linear infinite;}.f2 circle,.f2 use{animation:moveX 3.0s linear infinite;}.f3 circle,.f3 use{animation:moveX 3.9s linear infinite;}.f4 circle,.f4 use{animation:moveX 3.6s linear infinite;}.f5 circle,.f5 use{animation:moveX 3.0s linear infinite;}@keyframes moveX {0%,49%,100%{transform:translateY(0);}50%,99%{transform:translateY(-2px);}}</style><defs><g id="f"><circle cx="2" cy="2" r="12" fill="#FFF" fill-opacity="0.4" filter="url(#b1)"/><circle cx="2" cy="2" r="11" filter="url(#b.5)"/><g fill="#000000" fill-opacity="0.5"><circle cx="-3" cy="-1" r="1"/><circle cx="7" cy="-1" r="1"/><animateTransform attributeName="transform" type="scale" values="1,1;1,1;1,0.2;1,0.2;1,1;1,1" keyTimes="0;0.4;0.4;0.42;0.42;1" dur="10s" repeatCount="indefinite" additive="sum"/></g><g fill="#FBAED2" fill-opacity="0.5"><circle cx="-6" cy="4" r="2"/><circle cx="10" cy="4" r="2"/></g></g></defs><g filter="url(#fluffyShadow)"><g transform="translate(240 330) scale(',
            _str[5],
            ')" fill="var(--fc1)" class="f1"><use xlink:href="#f"/></g><g transform="translate(290 330) scale(',
            _str[6],
            ')" fill="var(--fc2)" class="f2"><use xlink:href="#f"/></g><g transform="translate(190 330) scale(',
            _str[7]
        ));
    }
    function _svg_fluffy3 (string[10] memory _str) private pure returns (string memory) {
        return string(abi.encodePacked(
            ')" fill="var(--fc3)" class="f3"><use xlink:href="#f"/></g><g transform="translate(340 330) scale(',
            _str[8],
            ')" fill="var(--fc4)" class="f4"><use xlink:href="#f"/></g><g transform="translate(140 330) scale(',
            _str[9],
            ')" fill="var(--fc5)" class="f5"><use xlink:href="#f"/></g></g></g>'
        ));
    }
    
    // basic2
    function svg_basic2 () external view whenNotPaused returns (string memory) {
        return '<g style="fill-opacity:0.1;"><path id="x" d="m38 260 92-183h242l92 183-92 184H130L38 260Z"/><animate attributeName="fill" values="#E60012;#F39800;#2f34d3;#8FC31F;#009944;#009E96;#00A0E9;#0068B7;#1D2088;#920783;#E4007F;#E5004F" keyTimes="0.00;0.09;0.18;0.27;0.36;0.45;0.55;0.64;0.73;0.82;0.91;1.00" dur="120s" repeatCount="indefinite"/></g><radialGradient id="str"><stop offset="0%" stop-color="#FFF" stop-opacity="1"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></radialGradient><g fill="url(#str)"><circle cx="150" cy="150" r="6"><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/></circle><circle cx="200" cy="120" r="5"><animate attributeName="opacity" values="1;0;1" dur="3.5s" repeatCount="indefinite"/></circle><circle cx="250" cy="160" r="3"><animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite"/></circle><circle cx="300" cy="130" r="3"><animate attributeName="opacity" values="1;0;1" dur="4.5s" repeatCount="indefinite"/></circle><circle cx="350" cy="200" r="5"><animate attributeName="opacity" values="0;1;0" dur="3.2s" repeatCount="indefinite"/></circle></g>';
    }
    
    // text
    // id, weather, temp, light, clean, humid, nut, score, block
    function svg_text (string[11] memory _str) external view whenNotPaused returns (string memory) {
        string memory part1 = _svg_text1(_str);
        string memory part2 = _svg_text2(_str);
        string memory part3 = _svg_text3(_str);
        return string(abi.encodePacked(part1, part2, part3));
    }
    function _svg_text1 (string[11] memory _str) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<g font-family="Segoe UI Emoji" text-anchor="end"><text fill="#FFF" font-size="15" x="348" y="63">#',
            _str[0],
            '</text><text font-size="11" x="365" y="413">',
            _str[1],
            ' &#x1f321;',
            _str[2],
            'C &#x2600;',
            _str[3],
            ' lx</text>'
        ));
    }
    function _svg_text2 (string[11] memory _str) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<text font-size="11" x="365" y="429">&#x2728;',
            _str[4],
            '% &#128167;',
            _str[5],
            '% &#127856;',
            _str[6],
            ' mg</text>'
        ));
    }
    function _svg_text3 (string[11] memory _str) private pure returns (string memory) {
        return string(abi.encodePacked(
            '<text fill="#00F" font-size="18" x="7" y="493" text-anchor="start">&#x2764;',
            _str[7],
            '</text><text fill="var(--bc1)" font-size="9" x="495" y="484">Terrarium of Murasaki-san</text><text fill="var(--bc1)" font-size="9" x="495" y="495">Minted at #',
            _str[8],
            ' on the Astar EVM</text></g>',
            '<text font-size="14"><textPath href="#x" text-anchor="start" fill="',
            _str[9],
            '"><tspan dx="10" dy="5">',
            _str[10],
            '</tspan></textPath></text>'
        ));
    }
    
    // footer
    // blackOpaci
    function svg_footer (string memory _blackOpaci) external view whenNotPaused returns (string memory) {
        string memory _res = string(abi.encodePacked(
            '<g fill="none" transform="translate(384 476) scale(0.07)" stroke="var(--bc1)" id="stroke"><style>#stroke{stroke-dasharray:500 500;stroke-dashoffset:500;animation:_logo 3s linear forwards;}@keyframes _logo{0%{stroke-dashoffset:500;}20%{stroke-dashoffset:500;}100%{stroke-dashoffset:0;}}</style><path d="M48.8 71v35.7c0 4.6-3.7 8.3-8.3 8.3h-81.2a8.3 8.3 0 0 1-8.3-8.3v-60" stroke-width="10.56"/><path d="M-31.4 50.4c0-1.5 1.2-2.7 2.7-2.7H9.7c1.5 0 2.7 1.2 2.7 2.7v38.3c0 1.5-1.2 2.7-2.7 2.7h-38.4a2.7 2.7 0 0 1-2.7-2.7Z" stroke-width="6.6"/><path d="m0 0-70.8 41M-.1 0l70.8 41" stroke-width="17.16" stroke-linecap="round"/></g><rect width="500" height="500" fill-opacity="',
            _blackOpaci, // .000 - .200
            '"/></svg>'
        ));
        return _res;
    }
    
    /*
    // test
    function test () public view returns (string memory) {
        string memory _res = string(abi.encodePacked(
            svg_basic(["#4E95D9","#34b500","#d266c9","0.0","0.0","24","7"]),
            svg_pippel("--pc1:#F6CFD6;--pc2:#F19EC2;--pc3:#ED7BAC;--pc4:#9FCBF2;"),
            svg_fluffy(["#FBFFF0","#B3BFC7","#FF686B","#DAB3FF","#A9E8FF","1.2","1.0","0.8","1.5","1.0"]),
            svg_basic2(),
            svg_text(["005","&#x2614;R","24","1000","100","100","255","21000000","387651"]),
            svg_footer(".000")
        ));
        return _res;
    }
    function test2 () public returns (string memory) {
        return test();
    }
    */
}


//---walletScore
// store highest score of all ToM in the wallet to refer from othe project
// update score when ToM was cleaned
// bonus for HoM
// show in the HoM house.
contract Murasaki_Terrarium_WalletScore is Ownable, Pausable {
    
    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}
    
    // permittable
    mapping(address => bool) private permitted_address;
    function _add_permitted_address(address _address) external onlyOwner {permitted_address[_address] = true;}
    function _remove_permitted_address(address _address) external onlyOwner {permitted_address[_address] = false;}
    modifier onlyPermitted {require(permitted_address[msg.sender]);_;}
    
    // address
    address public address_Murasaki_Terrarium;
    function _set_address_Murasaki_Terrarium(address _address) external onlyOwner {address_Murasaki_Terrarium = _address;}
    
    // variants
    mapping (address => uint) walletScore;
    
    // set highest score
    function set_walletScore (address _wallet, uint _score) external onlyPermitted whenNotPaused {
        walletScore[_wallet] = _score;
    }
    
    // call highest score
    function call_walletScore (address _wallet) external view returns (uint) {
        Murasaki_Terrarium mt = Murasaki_Terrarium(address_Murasaki_Terrarium);
        uint _balance = mt.balanceOf(_wallet);
        uint _score = 0;
        if (_balance > 0) {
            _score = walletScore[_wallet];
        }
        return _score;
    }
}


//---Auction
// need to add permit in mtf1
contract Murasaki_Terrarium_StepupAuction is Ownable, Pausable, ReentrancyGuard {
    
    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}
    
    // permittable
    mapping(address => bool) private permitted_address;
    function _add_permitted_address(address _address) external onlyOwner {permitted_address[_address] = true;}
    function _remove_permitted_address(address _address) external onlyOwner {permitted_address[_address] = false;}
    modifier onlyPermitted {require(permitted_address[msg.sender]);_;}
    
    // address
    address public address_Murasaki_Terrarium;
    address public address_Murasaki_Terrarium_Function1;
    address public address_BufferVault;
    function _set_address_Murasaki_Terrarium(address _address) external onlyOwner {address_Murasaki_Terrarium = _address;}
    function _set_address_Murasaki_Terrarium_Function1 (address _address) external onlyOwner {address_Murasaki_Terrarium_Function1 = _address;}
    function _set_address_BufferVault (address _address) external onlyOwner {address_BufferVault = _address;}
    
    // variants
    uint public price = 50 * 10**18;
    uint public stepupPercent = 100;       // 100 = 0.1%
    uint public mintedLimit = 3;
    mapping (address => uint) private mintedCount;
    function _set_price (uint _val) external onlyOwner {price = _val;}
    function _set_stepupPercent (uint _val) external onlyOwner {stepupPercent = _val;}
    function _set_mintedLimit (uint _val) external onlyOwner {mintedLimit = _val;}
    
    //admin, withdraw
    function withdraw (address rec) external onlyOwner{
        payable(rec).transfer(address(this).balance);
    }
    
    // buy ToM
    function buy () external whenNotPaused nonReentrant payable {
        require(msg.value >= price);
        require(mintedCount[msg.sender] < mintedLimit);
        // update price, +0.1%
        price = price * (100000 + stepupPercent) / 100000;
        // mint NFT
        _mint(msg.sender);
        mintedCount[msg.sender] += 1;
        // transfer fee
        payable(address_BufferVault).transfer(address(this).balance);
    }
    
    // internal, mint
    function _mint (address _wallet) internal {
        Murasaki_Terrarium_Function1 mtf1 = Murasaki_Terrarium_Function1(address_Murasaki_Terrarium_Function1);
        mtf1.mint(_wallet);
    }
}


//---price
contract Murasaki_Terrarium_AstarPrice is Ownable, Pausable {
    
    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}
    
    // address
    address public address_WASTR = 0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720;  // decimals=18
    address public address_USDC = 0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98;   // decimals=6
    address public address_LP = 0xBB1290c1829007F440C771b37718FAbf309cd527;     // arthswap WASTR-USDC
    function _set_address_WASTR(address _address) external onlyOwner {address_WASTR = _address;}
    function _set_address_USDC(address _address) external onlyOwner {address_USDC = _address;}
    function _set_address_LP(address _address) external onlyOwner {address_LP = _address;}
    
    // call price
    function call_price () external view whenNotPaused returns (uint) {
        //***TODO*** price test
        return _call_priceTest();
    }
    function _call_price () internal view returns (uint) {
        ERC20 wastr = ERC20(address_WASTR);
        ERC20 usdc = ERC20(address_USDC);
        uint _wastr = wastr.balanceOf(address_LP);
        uint _usdc = usdc.balanceOf(address_LP);
        uint _price = _usdc * 10**6 / (_wastr/10**12); // x10**6 $ASTR
        return _price;
    }
    function _call_priceTest () internal view returns (uint) {
        uint _rnd = uint(keccak256(abi.encodePacked(block.timestamp))) % 400000;
        return 800000 + _rnd;   // 4000000-12000000 random uint
    }
}

