
//--- ToDo
/*


 ok 耐性メカニズムの実装
    
    紋章システムの実装
        死亡時にtotal expを蓄積させる
        蓄積値に応じてproof of XXXを発行する
            SBTにするか、struct内の変数にするか。
    
    MoMボーナスの実装
    

    改善案
        itemのNFT化
            強化の検討
                目的が難しい
                上のランクのアイテムを得ることとの差別化は？
            使用時の総獲得exp値
            帰還階は誰かがロストしたNFTを獲得する可能性がある
            NFTは無限にmintされてしまうが、冒険でロストするので減る
            合成の検討
                NFT消費メカニズムのひとつ
                ゴミアイテムの減少
    
    バランス
        最終到達点
            HP  2100
            ATK 1024 +100 boost
            DEF 1024 +100 boost
            全耐性
            属性攻撃不要
        BTC
            HP  2100
            ATK 1328
            DEF 915
            全属性攻撃
            耐性なし
        BTCからの攻撃：(100+rnd)*10 = 1020
            DEF MaxでHPが2～44残る
        BTCへの攻撃
            ATK Max +100 boosで2100を確定で削りきれる
            耐性なしなので耐性抜けは狙えない
            育成と装備を用意すれば確定で勝てる
        最終ステータス内訳
            ATK/DEF
                初期値24
                Lv50なので10pint/Lvがmax成長 = +490
                うち、もとから+2/Lvされる, 残りの+8は装備か紋章で稼ぐ
                装備による補正上限 = +522
                合計 24 + 490 + 510 = 1024
                最終戦勝利には、成長値ATK+10, DEF+10, 装備補正+522を用意する
                ATKは武器、DEFは防具で+補正を稼ぐ
            HP
                初期値 240
                20 point/Lvで+980
                装備で+880
                maxHPはアクセサリー枠で+補正を稼ぐ
                基本的には、ちょっと足りないDEF差をHPでカバーする
                    が、高いHPにはあまり意味はなく、Lvや進行度の指標の位置づけ。
                    耐性抜けやDEF不足はだいたい一撃死のため。
                乱数で1Floor=10Battle=100stepで100～500のダメージを受ける。平均250。
                    ATK高く早めに敵を倒せればその分被ダメージは小さくなる。
            耐性
                種類は4+4
                防具で付けられるのは3つまで
                アクセサリーで付けられるのは3つまで
                加護で付けられるのは3つまで。
        紋章案
            紋章なしでギリギリカンスト可能
            紋章あればその分カンストまでの準備が楽
                HP+10
                HP+20
                HP+30
                HP+40   (合計+100）
                火炎耐性
                冷気耐性（耐性パズル有利）
                ATK成長+1
                ATK成長+1
                DEF成長+1
                DEF成長+1（合計+2）
                ATK+10
                DEF+10
        加護案
            何かしらの耐性付与
            何かしらの攻撃属性付与（四元素まで）
            あとはHP+10やATK+10など適当なものを割り振る
            最終的には、耐性の穴を加護で埋めることになる。
        MoMボーナス
            成長率に+1
        防具案
            基本性能は一定で、耐性のみ異なるシリーズを用意する
                耐性のリング：耐火耐冷耐電耐酸のうちどれか
                上位耐性のリング：暗黒地獄混沌毒のうちどれか、など。
                上質な殻：下位耐性１つ＋上位耐性１つ、など。
            補正値は+10が成長値最大のLv1分に相当する。
        武器案
            成長値重視の育成装備か、成長値0で補正値大の最終装備かに分類する。
            ロスト前提のため、合成を必要とする武器強化は必須としない。

    resume関数の実装
    bossの実装
        クエスト階の10番目の敵がbossになる
        flagで管理してbossを倒せばtrueとなり以降出てこない
        bossを倒せばその次の階へのrecallが解禁となる
        boss踏破にはそれなりの報酬を用意しておく
        また、bossとの戦闘は特別なfunctionを用意してもよいだろうか
            enemyIdで引っ掛けて分岐させる
    属性攻撃の実装
        全部で8種類（下位4 + 上位4）
        二進法でtrue/falseを表す
            11111111 = 255で全属性
            11011011 = 219で6属性、など。
        攻撃属性に対して防御側が属性なければそのままのダメージ
            防御側が属性耐性あれば1/3のダメージ
            属性攻撃は強めに設定する
            また、すべての耐性をつけないと防御効果は得られない
        防御側：
            攻撃属性全てに耐性持ちの時：DEF*3
        攻撃側：
            属性攻撃は基本的にダメージ多めに設定する
        「物理」という属性も加える
            物理耐性ありの敵は、何かしらの別耐性で攻撃する必要がある。
        耐性持ちの敵は、耐性以外で攻撃しないとほとんど倒せない
            「物理」が主となるだろう。物理耐性持ちを突破するために、属性攻撃にインセンティブをつける
    報酬とDoA由来itemによるブーストの実装
    勝利の実装
    恒常的なブースト：勲章システムの実装
        Proof of the Wisdom, などを10種類ほど考える
        後半のものほど効果が高い
    戦闘補正案
        ArthSwapで24hrで+3%以上ならばburish補正がつく
        可能であれば、各tokenもburish bearish補正を考える
        Astarから参照可能なtokenはどれだろうか。

*/


// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;


// openzeppelin v4.8
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/ReentrancyGuard.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/ERC721.sol";



// dungeon of astar
contract Dungeon_of_Astar is Ownable, ReentrancyGuard, Pausable {
    
    // sueside
    function QyAt (uint _astarId) external nonReentrant whenNotPaused () {
        //***TODO*** sueside
    }
    
    // internal, check element resistance
    // element info shows uint8 numerics (0-255)
    // ex) attaker: 253 (11111101) vs defender: 255 (11111111) -> resist
    // ex) attaker: 3 (00000011) vs defender: 253 (11111101) -> not resist
    function _checkElementResistance (uint _attacker, uint _defender) public pure returns (bool) {
        bool[8] memory _attackerElementList = _convertToBinary(uint8(_attacker));
        bool[8] memory _defenderElementList = _convertToBinary(uint8(_defender));
        return _isElementDefenced(_attackerElementList, _defenderElementList);
    }
    
    // internal, convert uint8 to bool[8]
    // ex) 11111101 -> 253
    function _convertToBinary(uint8 number) public pure returns (bool[8] memory) {
        bool[8] memory binaryArray;
        for (uint8 i = 0; i < 8;) {
            unchecked {
                if (number & 1 == 1) {
                    binaryArray[7 - i] = true;
                } else {
                    binaryArray[7 - i] = false;
                }
                number = number >> 1;
                i++;
            }
        }
        return binaryArray;
    }

    // internal, convert bool[8] to uint[8]
    function _convertToUint8 (bool[8] memory binaryArray) public pure returns (uint8) {
        uint8 number = 0;
        for (uint8 i = 0; i < 8; i++) {
            if (binaryArray[i]) {
                number |= uint8(1 << (7 - i));
            }
        }
        return number;
    }
    
    // internal, comparison attacker element and defender element
    // when all elements of the attacker are defensed, return true
    function _isElementDefenced (
        bool[8] memory _attackerElements, 
        bool[8] memory _defenderElements
    ) public pure returns (bool) {
        for (uint8 i = 0; i < 8;) {
            unchecked {
                if (_attackerElements[i] && !_defenderElements[i]) {
                    return false; // A=true, B=false -> Return false immediately
                }
                i++;
            }
        }
        return true; // No mismatch found, return true
    }
    
    // internal, combine the element/resi
    // ex) 00011110 (30) + 01001111 (79) -> 01011111 (95)
    function _combineElement (uint _elem1, uint _elem2) public pure returns (uint) {
        bool[8] memory _elem1Bool = _convertToBinary(uint8(_elem1));
        bool[8] memory _elem2Bool = _convertToBinary(uint8(_elem2));
        for (uint8 i = 0; i < 8;) {
            unchecked {
                // update elem1Bool
                // elem1Bool[x] == true or elem2Bool[x] == true -> elem1Bool = true
                if (_elem2Bool[i] == true && _elem1Bool[i] == false) {
                    _elem1Bool[i] = true;
                }
                i++;
            }
        }
        return uint(_convertToUint8(_elem1Bool));
    }
    
    //pausable
    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    } 
    
    
    //--- variants
    
    // global variants
    uint public TIME_PER_FLOOR = 1;
    
    // current adventure info
    struct adventureInfo {
        bool inAdventure;
        bool isAlive;
        uint embarkTime;
        uint embarkFloor;
        uint[8] astarStatus;    // MaxHP, ATK, DEF, EXP, elem, resi
        uint[8] astarStatusAtEnd; // HP, ATK, DEF, EXP
        uint astarHpAtEnd;
        uint recallFloorLevel;
        uint masterSeed;
        uint endTime;
        uint[8] nftIdOfHoM;
        uint[3] astarAdd;   // HP, ATK, DEF, add point per level-up
    }
    mapping (uint => adventureInfo) public adventureInfos;  // astarId => info
    // getter
    function call_adventureInfos (uint _astarId) external whenNotPaused view returns (
        bool inAdventure,
        bool isAlive,
        uint embarkTime,
        uint embarkFloor,
        uint[8] memory astarStatus,    // MaxHP, ATK, DEF, EXP
        uint[8] memory astarStatusAtEnd, // HP, ATK, DEF, EXP
        uint astarHpAtEnd,
        //uint astarLv,
        uint recallFloorLevel,
        uint masterSeed,
        uint endTime,
        uint[8] memory nftIdOfHoM,
        uint[3] memory astarAdd   // HP, ATK, DEF, add point per level-up
    ) {
        inAdventure = adventureInfos[_astarId].inAdventure;
        isAlive = adventureInfos[_astarId].isAlive;
        embarkTime = adventureInfos[_astarId].embarkTime;
        embarkFloor = adventureInfos[_astarId].embarkFloor;
        astarStatus = adventureInfos[_astarId].astarStatus;
        astarStatusAtEnd = adventureInfos[_astarId].astarStatusAtEnd;
        astarHpAtEnd = adventureInfos[_astarId].astarHpAtEnd;
        //astarLv = _calc_level(astarStatusAtEnd[3]);
        recallFloorLevel = adventureInfos[_astarId].recallFloorLevel;
        masterSeed = adventureInfos[_astarId].masterSeed;
        endTime = adventureInfos[_astarId].endTime;
        nftIdOfHoM = adventureInfos[_astarId].nftIdOfHoM;
        astarAdd = adventureInfos[_astarId].astarAdd;
    }
    
    // past adventure info
    // astarId => adventureNum => info
    mapping (uint => mapping (uint => adventureInfo)) public pastAdventureInfos;
    // getter
    function call_pastAdventureInfos (uint _astarId, uint _num) external whenNotPaused view returns (
        bool inAdventure,
        bool isAlive,
        uint embarkTime,
        uint embarkFloor,
        uint[8] memory astarStatus,    // MaxHP, ATK, DEF, EXP
        uint[8] memory astarStatusAtEnd, // HP, ATK, DEF, EXP
        uint astarHpAtEnd,
        uint recallFloorLevel,
        uint masterSeed,
        uint endTime,
        uint[8] memory nftIdOfHoM,
        uint[3] memory astarAdd   // HP, ATK, DEF, add point per level-up
    ) {
        inAdventure = pastAdventureInfos[_astarId][_num].inAdventure;
        isAlive = pastAdventureInfos[_astarId][_num].isAlive;
        embarkTime = pastAdventureInfos[_astarId][_num].embarkTime;
        embarkFloor = pastAdventureInfos[_astarId][_num].embarkFloor;
        astarStatus = pastAdventureInfos[_astarId][_num].astarStatus;
        astarStatusAtEnd = pastAdventureInfos[_astarId][_num].astarStatusAtEnd;
        astarHpAtEnd = pastAdventureInfos[_astarId][_num].astarHpAtEnd;
        recallFloorLevel = pastAdventureInfos[_astarId][_num].recallFloorLevel;
        masterSeed = pastAdventureInfos[_astarId][_num].masterSeed;
        endTime = pastAdventureInfos[_astarId][_num].endTime;
        nftIdOfHoM = pastAdventureInfos[_astarId][_num].nftIdOfHoM;
        astarAdd = pastAdventureInfos[_astarId][_num].astarAdd;
    }
    
    // astar info
    struct astarInfo {
        uint[64] rewardItems;
        uint countOfAdventure;
        uint countOfLose;
        uint floorReached;
        uint countOfVictory;
        bool[12] defeatedBosses;
        bool[24] earnedProofs;
        uint totalExp;
    }
    mapping (uint => astarInfo) public astarInfos;  // astarId => info
    // getter
    function call_astarInfo (uint _astarId) external whenNotPaused view returns (
        uint[64] memory rewardItems,
        uint countOfAdventure,
        uint countOfLose,
        uint floorReached,
        uint countOfVictory,
        bool[12] memory defeatedBosses,
        bool[24] memory earnedProofs,
        uint totalExp
    ) {
        rewardItems = astarInfos[_astarId].rewardItems;
        countOfAdventure = astarInfos[_astarId].countOfAdventure;
        countOfLose = astarInfos[_astarId].countOfLose;
        floorReached = astarInfos[_astarId].floorReached;
        countOfVictory = astarInfos[_astarId].countOfVictory;
        defeatedBosses = astarInfos[_astarId].defeatedBosses;
        earnedProofs = astarInfos[_astarId].earnedProofs;
        totalExp = astarInfos[_astarId].totalExp;
    }
    
    
    //--- embark adventure
    
    // embark adventure
    // args: astar ID, NFT list of HoM, recall floor level
    function embarkAdventure (
        uint _astarId, 
        uint[8] memory _nftIds, 
        uint _recallFloorLevel
    ) external nonReentrant whenNotPaused {
        
        // check astar ID
        require(_checkEmbarkAdventure(_astarId, msg.sender));
        
        // check NFTs
        require(_checkNFTs(_astarId, _nftIds, msg.sender));
        
        // update parameters
        _setAdventureInfo(_astarId, _nftIds, _recallFloorLevel);
    }
    
    // internal, check astar ID 
    function _checkEmbarkAdventure (uint _astarId, address _wallet) public view returns (bool) {
        //***TODO*** check astarId
        // HoMを参照してastarの所有者をチェックする
        require(adventureInfos[_astarId].inAdventure == false);
        return true;
    }
    
    // internal, chekc NFT
    function _checkNFTs (uint _astarId, uint[8] memory _nftIds, address _wallet) public view returns (bool) {
        //***TODO*** check NFT
        // Homを参照して所有者チェック
        return true;
    }
    
    // internal, update adventure parameters
    function _setAdventureInfo (
        uint _astarId,
        uint[8] memory _nftIds, 
        uint _recallFloorLevel
    ) public {
        // prepare astar status
        uint[8] memory _astarStatus = _get_astarStatus(_astarId);
        // prepare master seed
        uint _masterSeed = _get_masterSeed(_astarId);
        // prepare status add point
        uint[3] memory _astarAdd = _get_astarAdd(_nftIds);
        // initialize adventure info
        adventureInfos[_astarId] = adventureInfo(
            true,
            true,
            block.timestamp,
            1,
            _astarStatus,
            _astarStatus,
            _astarStatus[0], // HP
            _recallFloorLevel,
            _masterSeed,
            0,
            _nftIds,
            _astarAdd
        );
    }
    
    // internal, get astar status
    function _get_astarStatus (uint _astarId) public view returns (uint[8] memory) {
        //***TODO*** astar status
        // 装備品による初期ブーストなどの計算する
        // initial astar status
        uint[8] memory _astarStatus = [uint(500), 50, 50, 0, 1, 0, 0, 0];
        // when astar is alive, get previous status from current adventure info
        if (adventureInfos[_astarId].isAlive) {
            _astarStatus = adventureInfos[_astarId].astarStatusAtEnd;
        }
        return _astarStatus;
    }
    
    // internal, get master seed for the current adventure
    function _get_masterSeed (uint _astarId) public view returns (uint) {
        // generate seed, 0-65534
        string memory _input = string(
            abi.encodePacked(
                block.timestamp,
                blockhash(block.number - 1),
                block.coinbase,
                _astarId,
                msg.sender
            )
        );
        return uint256(keccak256(abi.encodePacked(_input))) % 65535;
    }
    
    // internal, get astar add point per level-up
    function _get_astarAdd (uint[8] memory _nftIds) public view returns (uint[3] memory) {
        //***TODO*** add point
        // 加護につけるNFTや武器などによって成長率に加算する
        return [uint(10), 1, 1];
    }
        
    
    //--- end adventure
    
    // arg: just astar ID
    function endAdventure (
        uint _astarId
    ) external nonReentrant whenNotPaused {
        
        //***TODO*** reward
        // rewardの処理を考える
        // 持っていくのか、取得したものはどうするのか、帰還時にどこに加算するのか
        
        // check astar ID
        require(_checkEndAdventure(_astarId, msg.sender));
        
        // get current floor infos
        (
            uint _clearedFloorLevel,    // cloared floor leve, not greater than recall floor level
            bool _isEndable,    // when reached to the recall floor level or dead -> true
            bool _isAlive,  // when HP > 0 at the end of battles in the current floor -> true
            uint _astarHp,
            uint[8] memory _astarStatus,    // hpMax, atk, def, exp
            uint[64] memory _rewardItems    // accumulated items from embark level to current level
        ) = _get_clearedFloorLevelAndInfos(_astarId);
        
        // check endable
        require(_isEndable);
        
        // when not alive, just isAlive=false
        // calc total exp and check proof gain
        if (!_isAlive) {
            adventureInfos[_astarId].isAlive = false;
            _updateExpAndCheckProof(_astarId, _astarStatus);
        }
        
        // when alive and reached the recall floor leve, update status and reward items
        if (_isAlive) {
            // update astar status
            adventureInfos[_astarId].astarStatusAtEnd = _astarStatus;
            adventureInfos[_astarId].astarHpAtEnd = _astarHp;
            astarInfos[_astarId].rewardItems = _rewardItems;
        }
        
        // end adventure
        _endAdventure(_astarId, _clearedFloorLevel);
    }
    
    // internal, check astar ID
    function _checkEndAdventure (uint _astarId, address _wallet) public view returns (bool) {
        //***TODO*** astar id
        // 所有権のチェック
        require(adventureInfos[_astarId].inAdventure == true);
        return true;
    }
    
    // internal, get cleared floor level
    function _get_clearedFloorLevelAndInfos (uint _astarId) public view returns (
        uint,   // _clearedFloorLevel,
        bool,   // _isEndable,
        bool,   // _isAlive,
        uint,   // _astarHp,
        uint[8] memory, // astarStatus
        uint[64] memory // rewardItems
    ) {
        
        // calc current floor level
        uint _currentFloorLevel = _get_currentFloorLevel(_astarId);
        
        // prepare previous floor level
        uint _previousFloorLevel = _currentFloorLevel - 1;
        require(_previousFloorLevel > 0);   // require >0
        
        // check recall floor and update previous floor
        // when previous floor > recall floor, previous floor will be replaced to recall floor
        bool _isEndable;
        if (adventureInfos[_astarId].recallFloorLevel < _previousFloorLevel) {
            _previousFloorLevel = adventureInfos[_astarId].recallFloorLevel;
            // when reached recall floor, endable
            _isEndable = true;
        }
        
        // calc whole adventure log from embark floor level to current floor level
        (
            uint _astarHp,  // final astar HP, HP=0 -> dead, HP>0 -> alive
            uint[8] memory _astarStatus,   // maxHP, ATK, DEF, Exp
            uint[64] memory _rewardItems    // items possesed before adv. + items rewarded during adv.
        ) = _calc_adventureLog(_astarId, _previousFloorLevel);
        
        // judge alive or dead, and endable or not
        bool _isAlive;
        if (_astarHp > 0) {
            _isAlive = true;
        } else {
            // when dead, endable
            _isEndable = true;
        }
        
        return (
            _previousFloorLevel,
            _isEndable,
            _isAlive,
            _astarHp,
            _astarStatus,
            _rewardItems
        );
    }
    
    // internal, get current floor level depends on delta sec
    function _get_currentFloorLevel (uint _astarId) public view returns (uint) {
        uint _deltaSec = block.timestamp - adventureInfos[_astarId].embarkTime;
        uint _currentFloorLevel = adventureInfos[_astarId].embarkFloor + _deltaSec / TIME_PER_FLOOR;
        return _currentFloorLevel;
    }
    
    // internal, calc whole adventure log from embark floor to previous floor
    function _calc_adventureLog (uint _astarId, uint _previousFloorLevel) public view returns (
        uint _astarHp,  // final astar HP
        uint[8] memory _astarStatus,    // max HP, ATK, DEF, EXP, after level-up
        uint[64] memory _rewardItems    // items possessed before adv. + items rewarded during adv.
    ) {
        
        // prepare astar status at the embark adventure
        _astarStatus = _get_astarStatus(_astarId);  // maxHP, ATK, DEF, Exp
        _rewardItems = astarInfos[_astarId].rewardItems;
        
        // calc astat status at the end of each floor level
        uint _numberOfEnemyDefeated;
        for (uint i=adventureInfos[_astarId].embarkFloor; i<_previousFloorLevel+1;) {
            
            // get result of the floor: final astar HP, number of enemy defeated, accumulated items
            // the adventure result will be calculated depending on the astar max HP
            // (the astar HP will be recovered at earch tyming of floor cleared)
            (_astarHp, _numberOfEnemyDefeated, _rewardItems) = _calc_floorClear(
                _astarStatus,   // max HP, ATK, DEF, EXP(not required)
                i,  // floor level
                adventureInfos[_astarId].masterSeed,
                _rewardItems    // accumulated items
            );
            
            // check alive
            if (_astarHp > 0) {
                // calc exp and try level-up
                uint _astarExpAdd = _calc_expAdd(i, _numberOfEnemyDefeated);
                uint _deltaAstarLevel = _calc_deltaAstarUp(_astarStatus[3], _astarExpAdd);
                // update status depends on level-up
                _astarStatus[0] += adventureInfos[_astarId].astarAdd[0] * _deltaAstarLevel; // max HP
                _astarStatus[1] += adventureInfos[_astarId].astarAdd[1] * _deltaAstarLevel; // ATK
                _astarStatus[2] += adventureInfos[_astarId].astarAdd[2] * _deltaAstarLevel; // DEF
                _astarStatus[3] += _astarExpAdd; // EXP
            } else {
                // when dead, break the loop with 0 value of astar HP
                break;
            }
            
            // increment
            unchecked {
                i++;
            }
        }
        return (_astarHp, _astarStatus, _rewardItems);
    }
    
    // internal, calc exp add point depends on the number of enemy defeated and floor level
    function _calc_expAdd (uint _floorLevel, uint _numberOfEnemyDefeated) public view returns (uint) {
        //***TODO*** exp add
        return _numberOfEnemyDefeated*10;
    }
    
    // internal, calc delta level-up of astar depending on previous exp and added exp
    function _calc_deltaAstarUp (uint _previousExp, uint _expAdd) public pure returns (uint) {
        uint _previousLevel = _calc_level(_previousExp);
        uint _currentLevel = _calc_level(_previousExp + _expAdd);
        return _currentLevel - _previousLevel;
    }
    
    // internal, define astar level from astar exp
    function _calc_level (uint _exp) public pure returns (uint _level) {
        //***TODO*** astar Lv
        if (_exp >= 122500) {
            _level = 50;
        } else if (_exp >= 117600) {
            _level = 49;
        } else if (_exp >= 112800) {
            _level = 48;
        } else if (_exp >= 108100) {
            _level = 47;
        } else if (_exp >= 103500) {
            _level = 46;
        } else if (_exp >= 99000) {
            _level = 45;
        } else if (_exp >= 94600) {
            _level = 44;
        } else if (_exp >= 90300) {
            _level = 43;
        } else if (_exp >= 86100) {
            _level = 42;
        } else if (_exp >= 82000) {
            _level = 41;
        } else if (_exp >= 78000) {
            _level = 40;

        } else if (_exp >= 19000) {
            _level = 20;
        } else if (_exp >= 17100) {
            _level = 19;
        } else if (_exp >= 15300) {
            _level = 18;
        } else if (_exp >= 13600) {
            _level = 17;
        } else if (_exp >= 12000) {
            _level = 16;
        } else if (_exp >= 10500) {
            _level = 15;
        } else if (_exp >= 9100) {
            _level = 14;
        } else if (_exp >= 7800) {
            _level = 13;
        } else if (_exp >= 6600) {
            _level = 12;
        } else if (_exp >= 5500) {
            _level = 11;

        } else if (_exp >= 4500) {
            _level = 10;
        } else if (_exp >= 3600) {
            _level = 9;
        } else if (_exp >= 2800) {
            _level = 8;
        } else if (_exp >= 2100) {
            _level = 7;
        } else if (_exp >= 1500) {
            _level = 6;
        } else if (_exp >= 1000) {
            _level = 5;
        } else if (_exp >= 600) {
            _level = 4;
        } else if (_exp >= 300) {
            _level = 3;
        } else if (_exp >= 100) {
            _level = 2;
        } else {
            _level = 1;
        }
    }

    // internal, overhead processing at the end of adventure 
    function _endAdventure (uint _astarId, uint _clearedFloorLevel) public {
        // update current adventure info
        adventureInfos[_astarId].endTime = block.timestamp;
        adventureInfos[_astarId].inAdventure = false;
        // update astar info
        astarInfos[_astarId].countOfAdventure++;
        if (adventureInfos[_astarId].isAlive == false) {
            astarInfos[_astarId].countOfLose++;
        }
        if (astarInfos[_astarId].floorReached < _clearedFloorLevel) {
            astarInfos[_astarId].floorReached = _clearedFloorLevel;
        }
        // store past adventure info
        pastAdventureInfos[_astarId][astarInfos[_astarId].countOfAdventure] = adventureInfos[_astarId];
        // ***TODO*** nft transfer
        // nftを返還する
    }
    
    // internal, judge floor clear
    // calc final astar HP and rewards from astar status and floor level
    function _calc_floorClear (
        uint[8] memory _astarStatus,    // max HP, ATK, DEF, EXP(not required)
        uint _floorLevel,
        uint _masterSeed,
        uint[64] memory _rewardItems
    ) public view returns (
        uint,   // _astarHp
        uint,   // _numberOfEnemyDefeated,
        uint[64] memory // rewardItems
    ) {
        
        // prepare enemy id list from floor level
        uint[10] memory _enemyIds = _get_enemyIds(_floorLevel, _masterSeed);
        
        // simulate battle and get HP lists
        // using the same function in the adventure log
        /*
        (
            uint[101] memory _astarHps, 
            uint[101] memory _enemyHps, 
            uint _numberOfEnemyDefeated
        ) = _simulateBattle(_astarStatus, _enemyIds, _masterSeed);

        // prepare final astar HP at the end of floor
        uint _astarHp = _astarHps[100];
        */
        
        // simulate battle simple
        (
            uint _astarHp,
            uint _numberOfEnemyDefeated
        ) = _simulateBattleSimple(_astarStatus, _enemyIds, _masterSeed);
        
        
        // when alive, update reward items
        if (_astarHp > 0) {
            _rewardItems = _update_rewardItems(
                _floorLevel, 
                _masterSeed, 
                _numberOfEnemyDefeated, 
                _rewardItems
            );
        }
        
        return (
            _astarHp,
            _numberOfEnemyDefeated,
            _rewardItems
        );
    }
    
    // internal, get enemy id list from floor level
    function _get_enemyIds (uint _floorLevel, uint _seed) public view returns (uint[10] memory) {
        //***TODO*** enemy list
        /*
        uint[10] memory _enemyIds = [
            uint(_floorLevel),
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel,
            _floorLevel
            ];
        */
        uint[10] memory _enemyIds = [ uint(1), 1,1,1,1,1,1,1,1,1];
        return _enemyIds;
    }
    
    // internal, prepare enemu status from enemy ID
    // return enemyId itself as the 4th value
    function _get_enemyStatus (uint _enemyId) public view returns (uint[8] memory) {
        uint _enemyHp = _table_enemyHp[_enemyId];
        uint _enemyAtk = _table_enemyAtk[_enemyId];
        uint _enemyDef = _table_enemyDef[_enemyId];
        return [_enemyHp, _enemyAtk, _enemyDef, _enemyId, 0, 0, 0, 0];
    }
    
    // internal, update reward items depends on floor leve
    // previous item list -> accumulated item list
    function _update_rewardItems (
        uint _floorLevel, 
        uint _seed, 
        uint _numberOfEnemyDefeated,
        uint[64] memory _rewardItems
    ) public view returns (uint[64] memory) {
        //***TODO*** reward items
        _rewardItems[1]++;
        _rewardItems[2]++;
        _rewardItems[3]++;
        return _rewardItems;
    }
    
    // internal, update total Exp and check proof obtaining
    function _updateExpAndCheckProof (uint _astarId, uint[8] memory _astarStatus) public {
        // update total Exp
        uint _totalExp = astarInfos[_astarId].totalExp + _astarStatus[3];
        astarInfos[_astarId].totalExp = _totalExp;
        // check and obtain proof
        if (_totalExp >= 7800 *100) {
            astarInfos[_astarId].earnedProofs[11] = true;
        }
        if (_totalExp >= 6600 *100) {
            astarInfos[_astarId].earnedProofs[10] = true;
        }
        if (_totalExp >= 5500 *100) {
            astarInfos[_astarId].earnedProofs[9] = true;
        }
        if (_totalExp >= 4500 *100) {
            astarInfos[_astarId].earnedProofs[8] = true;
        }
        if (_totalExp >= 3600 *100) {
            astarInfos[_astarId].earnedProofs[7] = true;
        }
        if (_totalExp >= 2800 *100) {
            astarInfos[_astarId].earnedProofs[6] = true;
        }
        if (_totalExp >= 2100 *100) {
            astarInfos[_astarId].earnedProofs[5] = true;
        }
        if (_totalExp >= 1500 *100) {
            astarInfos[_astarId].earnedProofs[4] = true;
        }
        if (_totalExp >= 1000 *100) {
            astarInfos[_astarId].earnedProofs[3] = true;
        }
        if (_totalExp >= 600 *100) {
            astarInfos[_astarId].earnedProofs[2] = true;
        }
        if (_totalExp >= 300 *100) {
            astarInfos[_astarId].earnedProofs[1] = true;
        }
        if (_totalExp >= 100 *100) {
            astarInfos[_astarId].earnedProofs[0] = true;
        }
    }
    
    
    //--- adventure log

    // art: astar ID, adventure number, astar status, astar level-up point
    // return: enemy ID list, HP change lists, final astar status, accumulative reward items
    function adventureLog (
        uint _astarId,
        uint _adventureNum,
        uint[8] memory _astarStatus, 
        uint[4] memory _astarAdd,
        uint _floorLevel
    ) external whenNotPaused view returns (
        uint[10] memory _enemyIds,
        uint[101] memory _astarHps,
        uint[101] memory _enemyHps,
        uint[8] memory _endAstarStatus,
        uint[64] memory _rewardItems
    ) {
    
        // check integrity of parameters
        require(_check_adventureLog(_astarId, _adventureNum, _floorLevel));
        
        // prepare seed
        uint _seed;
        // when adventure num == 0, seed = master seed of current adventure
        if (_adventureNum == 0) {
            _seed = adventureInfos[_astarId].masterSeed;
        // else, seed = master seed of past adventure
        } else {
            _seed = pastAdventureInfos[_astarId][_adventureNum].masterSeed;
        }
        return(_adventureLog(
            _astarStatus, 
            _astarAdd,
            _seed,
            _floorLevel
        ));
    }
    
    // internal, check the integrity of log parameters
    function _check_adventureLog (
        uint _astarId, 
        uint _adventureNum, 
        uint _floorLevel
    ) public view returns (bool) {
        //***TODO*** check adv.
        // astarIdとadventure numberをチェックし、
        // すでに出発済みの冒険でしかlogを生成させない
        return true;
    }

    // internal, generate all adventure log infos 
    // from astar status, astar level-up point, floor level, and seed
    // return: enemy ID list, astar hp list, enemy hp list, astar status at the end, accumulated reward items
    function _adventureLog (
        uint[8] memory _astarStatus, 
        uint[4] memory _astarAdd,
        uint _seed,
        uint _floorLevel
    ) public view returns (
        uint[10] memory _enemyIds,
        uint[101] memory _astarHps,
        uint[101] memory _enemyHps,
        uint[8] memory _endAstarStatus,
        uint[64] memory _rewardItems
    ) {
    
        // prepare end status at first
        _endAstarStatus = _astarStatus;

        // prepare enemy id
        _enemyIds = _get_enemyIds(_floorLevel, _seed+_floorLevel);
        
        // calc whole HP change list and enemy defeated count from astar status and enemy ID list
        uint _numberOfEnemyDefeated;
        (
            _astarHps, 
            _enemyHps, 
            _numberOfEnemyDefeated
        ) = _simulateBattle(_astarStatus, _enemyIds, _seed);
        
        // when alive, update astar status
        if (_astarHps[100] > 0) {

            // calc exp and try level-up
            uint _astarExpAdd = _calc_expAdd(_floorLevel, _numberOfEnemyDefeated);
            uint _deltaAstarLevel = _calc_deltaAstarUp(_astarStatus[3], _astarExpAdd);

            // update end astar status
            _endAstarStatus[0] += _astarAdd[0] * _deltaAstarLevel;
            _endAstarStatus[1] += _astarAdd[1] * _deltaAstarLevel;
            _endAstarStatus[2] += _astarAdd[2] * _deltaAstarLevel;
            _endAstarStatus[3] += _astarExpAdd;
            
            // update reward items
            _rewardItems = _update_rewardItems(_floorLevel, _numberOfEnemyDefeated, _seed, _rewardItems);
        
        // when not alive, final HP = 0
        } else {
            _endAstarStatus[0] = 0;
        }
        
        return (
            _enemyIds,
            _astarHps,
            _enemyHps,
            _endAstarStatus,
            _rewardItems
        );
    }

    // internal, simulate battle result, also used in the endAdventure()
    // arg: astar status, enemy ID list
    // return: whole HP change list and number of enemy defeated
    function _simulateBattle (
        uint[8] memory _astarStatus, 
        uint[10] memory _enemyIds,
        uint _seed
    ) public view returns (
        uint[101] memory _astarHps, // [100] = final astar HP
        uint[101] memory _enemyHps,
        uint _numberOfEnemyDefeated
    ) {

        // prepare HPs
        uint _astarHp = _astarStatus[0];

        // prepare current astar HP
        _astarHps[0] = _astarHp;
        
        // prepare index (cumulative number of battles in the floor)
        uint _index = 1;

        // simulat each battle
        for (uint i=0; i<10;) {
            
            // prepare enemy ID and status
            uint _enemyId = _enemyIds[i];
            uint[8] memory _enemyStatus = _get_enemyStatus(_enemyId);
            uint _enemyHp = _enemyStatus[0];
            
            // prepare elem and resi
            // when Astar attack is resisted, Astar ATK /2
            // to avoid stack too deep error, enemy DEF = Astar ATK /2
            if ( _checkElementResistance(_astarStatus[4], _enemyStatus[5]) ){
                _enemyStatus[2] *= _astarStatus[1]/2;
            }
            // when Enemy attack is not resisted, enemy ATK *2
            if ( !_checkElementResistance(_enemyStatus[4], _astarStatus[5]) ){
                _enemyStatus[1] *= 2;
            }
            
            // simulate each battle step
            for (uint j=0; j<10;) {
                
                // calc astar HP and enemy HP after battle step from both status
                (_astarHp, _enemyHp) = _calc_hpsOfBattleStepV2(
                    _astarHp,
                    _enemyHp,
                    _astarStatus, 
                    _enemyStatus, 
                    _seed 
                    //_index
                );
                
                // store hp change in the HP list
                _astarHps[_index] = _astarHp;
                _enemyHps[_index] = _enemyHp;
                
                // increment
                unchecked {
                    j++;
                    _index++;
                }
            }
            
            // after the battle, check enemy defeated
            if (_enemyHp == 0) {
                _numberOfEnemyDefeated++;
            }
            
            // increment
            unchecked {
                i++;
            }
        }
    }
    
    // internal, simulate battle simple
    // HP change lists were removed and asta HP final was added
    function _simulateBattleSimple (
        uint[8] memory _astarStatus, 
        uint[10] memory _enemyIds,
        uint _seed
    ) public view returns (
        uint _astarHpFinal, // added
        //uint[101] memory _astarHps, // [100] = final astar HP
        //uint[101] memory _enemyHps,
        uint _numberOfEnemyDefeated
    ) {

        // prepare HPs
        uint _astarHp = _astarStatus[0];

        // prepare current astar HP
        //_astarHps[0] = _astarHp;
        
        // prepare index (cumulative number of battles in the floor)
        //uint _index = 1;

        // simulat each battle
        for (uint i=0; i<10;) {
            
            // prepare enemy ID and status
            uint _enemyId = _enemyIds[i];
            uint[8] memory _enemyStatus = _get_enemyStatus(_enemyId);
            uint _enemyHp = _enemyStatus[0];
            
            // prepare elem and resi
            if ( _checkElementResistance(_astarStatus[4], _enemyStatus[5]) ){
                _enemyStatus[2] *= _astarStatus[1]/2;
            }
            // when Enemy attack is not resisted, enemy ATK *2
            if ( !_checkElementResistance(_enemyStatus[4], _astarStatus[5]) ){
                _enemyStatus[1] *= 2;
            }
            
            // simulate each battle step
            for (uint j=0; j<10;) {
                
                // calc astar HP and enemy HP after battle step from both status
                (_astarHp, _enemyHp) = _calc_hpsOfBattleStepV2(
                    _astarHp,
                    _enemyHp,
                    _astarStatus, 
                    _enemyStatus, 
                    _seed 
                    //_index
                );
                
                // store hp change in the HP list
                //_astarHps[_index] = _astarHp;
                //_enemyHps[_index] = _enemyHp;
                
                // increment
                unchecked {
                    j++;
                    //_index++;
                }
            }
            
            // after the battle, check enemy defeated
            if (_enemyHp == 0) {
                _numberOfEnemyDefeated++;
            }
            
            // increment
            unchecked {
                i++;
            }
        }
        
        _astarHpFinal = _astarHp;
        return(_astarHpFinal, _numberOfEnemyDefeated);
    }
    
    // internal, simulate battle step V1
    // arg: astar and enemy status, and _seed and _index for generate rnd
    // return: astar and enemy final HPs
    /*
    function _calc_hpsOfBattleStepV1 (
        uint _astarHp,
        uint _enemyHp,
        uint[4] memory _astarStatus,
        uint[4] memory _enemyStatus,
        uint _seed,
        uint _index
    ) public pure returns (
        uint,   // astarHp
        uint    // enemyHp
    ) {

        // prepare each astar status
        uint _astarAtk = _astarStatus[1];
        uint _astarDef = _astarStatus[2];

        // prepare each enemy status
        uint _enemyAtk = _enemyStatus[1];
        uint _enemyDef = _enemyStatus[2];
        uint _enemyId = _enemyStatus[3];

        // calc damage for enemy
        uint _dmgForEnemy;
        if (_astarAtk > _enemyDef) {
            _dmgForEnemy = _astarAtk - _enemyDef;
        }
        if (_astarHp == 0) {
            _dmgForEnemy = 0;
        } else {
            _dmgForEnemy += _xorshift(_seed + _enemyId + _index, 3);
        }
        
        // calc damage for astar
        uint _dmgForAstar;
        if (_enemyAtk > _astarDef) {
            _dmgForAstar = _enemyAtk - _astarDef;
        }
        if (_enemyHp == 0) {
            _dmgForAstar = 0;
        } else {
            _dmgForAstar += _xorshift(_seed + _enemyId + _index + 1, 3);
        }

        // recalc HPs
        if (_astarHp > _dmgForAstar) {
            _astarHp -= _dmgForAstar;
        } else {
            _astarHp = 0;
        }
        if (_enemyHp > _dmgForEnemy) {
            _enemyHp -= _dmgForEnemy;
        } else {
            _enemyHp = 0;
        }
        
        return (_astarHp, _enemyHp);
    }
    */

    // internal, simulate battle step V2
    // optimized by ChatGPT
    function _calc_hpsOfBattleStepV2 (
        uint _astarHp,
        uint _enemyHp,
        uint[8] memory _astarStatus,
        uint[8] memory _enemyStatus,
        uint _seed
    ) public pure returns (uint, uint) {
        uint _astarAtk = _astarStatus[1];
        uint _astarDef = _astarStatus[2];
        uint _enemyAtk = _enemyStatus[1];
        uint _enemyDef = _enemyStatus[2];

        uint _dmgForEnemy = _astarHp > 0 ? (_astarAtk > _enemyDef ? _astarAtk - _enemyDef : 0) + _xorshift(_seed + _astarHp, 5) : 0;
        uint _dmgForAstar = _enemyHp > 0 ? (_enemyAtk > _astarDef ? _enemyAtk - _astarDef : 0) + _xorshift(_seed + _astarHp + 1, 5) : 0;

        _astarHp = _astarHp > _dmgForAstar ? _astarHp - _dmgForAstar : 0;
        _enemyHp = _enemyHp > _dmgForEnemy ? _enemyHp - _dmgForEnemy : 0;

        return (_astarHp, _enemyHp);
    }

    // internal, xorshift to generate rnd
    function _xorshift (uint _seed, uint _num) public pure returns (uint) {
        _seed ^= (_seed << 13);
        _seed ^= (_seed >> 17);
        _seed ^= (_seed << 5);
        return _seed % _num + 1;    // ignore 0 damage
    }


    //--- codex

    // reward EXP list for each floor breakthrough
    uint[11] public _table_expList = [
        0,  // 0F, dummy
        100,
        200,
        400,
        800,
        1600,
        3200,
        6400,
        12800,
        256000,
        512000
    ];
    
    uint[10] public _table_enemyHp = [
        100,
        200,
        300,
        400,
        500,
        600,
        700,
        800,
        900,
        1000
    ];

    uint[10] public _table_enemyAtk = [
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100
    ];

    uint[10] public _table_enemyDef = [
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100
    ];
    
    
    //--- admin
    
    // modify time per floor
    function admin_set_TIME_PER_FLOOR (uint _val) external onlyOwner {
        TIME_PER_FLOOR = _val;
    }
    
    // override adventure info
    function admin_modify_adventureInfo1 (
        uint _astarId,
        bool inAdventure,
        bool isAlive,
        uint embarkTime,
        uint embarkFloor,
        uint[8] memory astarStatus,
        uint[8] memory astarStatusAtEnd
    ) external onlyOwner {
        adventureInfos[_astarId].inAdventure = inAdventure;
        adventureInfos[_astarId].isAlive = isAlive;
        adventureInfos[_astarId].embarkTime = embarkTime;
        adventureInfos[_astarId].embarkFloor = embarkFloor;
        adventureInfos[_astarId].astarStatus = astarStatus;
        adventureInfos[_astarId].astarStatusAtEnd = astarStatusAtEnd;
    }
    function admin_modify_adventureInfo2 (
        uint _astarId,
        uint astarHp,
        uint recallFloorLevel,
        uint masterSeed,
        uint endTime,
        uint[8] memory nftIdOfHoM,
        uint[3] memory astarAdd
    ) external onlyOwner {
        adventureInfos[_astarId].astarHpAtEnd = astarHp;
        adventureInfos[_astarId].recallFloorLevel = recallFloorLevel;
        adventureInfos[_astarId].masterSeed = masterSeed;
        adventureInfos[_astarId].endTime = endTime;
        adventureInfos[_astarId].nftIdOfHoM = nftIdOfHoM;
        adventureInfos[_astarId].astarAdd = astarAdd;
    }
}


//---old

/*

    階層テーマ案：
        なにもなしフロア
            単純に階層ごとに強さが徐々にインフレする
        物理耐性層
            何かしらの属性を付与しないと攻撃が通らない
        火炎攻撃層
            火炎属性でATK高めに設定
            火炎耐性必須
        火炎＋冷気攻撃層
            火炎・冷気耐性必須
        4元素攻撃層
            4元素耐性を確保するまで苦戦を強いられる
        上位属性層
            威力の高い上位属性１種類を多用する層
            4元素は相変わらず必須
        上位属性複数層
            威力の高い上位属性２種類を多用する層
            4元素は相変わらず必須
        雷しか通らない層
            物理耐性を含め、雷以外の全耐性を有する敵が頻出する
        タフ層
            単純に高いATKを要求してくる層
            耐性抜けをついても厳しい

    階層案
        前提
            すべての階層で、最初の1-3Fは対策なしでも死なない
                その階の雰囲気を探るお試し階
            最初の1-3Fでその階層の解答を収集する
            後半のフロア数では、前階層のレアアイテムが潤沢に入手できる
            後半のフロアで準備し、最終フロアのクエストボスに挑む
            bossを倒せば、次の回へのrecallが解禁される
        1-10F: ノーマル
            属性攻撃なし・耐性なし
            階層に応じてATK/DEFが増えた敵が出現する
            boss: ATK/DEF高め
            reward: 特徴特になし
        11-20F: 火炎攻撃フロア
            耐性なし・火炎属性の攻撃が頻出
            防具に火炎耐性を付与しないと突破が難しい
            boss: 火炎攻撃, 火炎耐性で突破可能
            reward: 耐火ポーション, 耐火装備
        21-30F: 冷気攻撃フロア
            耐性なし・冷気属性の攻撃が頻出
            冷気耐性必須
            boss: 冷気攻撃, 冷気耐性で突破可能
            reward: 耐冷ポーション, 耐冷装備
        31-40F: 四元素フロア・物理耐性
            何かしらの四元素攻撃を行う敵が頻出
            四元素すべての耐性を確保しないと運ゲー
            殆どが物理耐性持ち。
            こちらも何かしらの属性攻撃を付与しないと攻撃が通らない
            boss: 四元素攻撃・物理耐性, 四元素耐性と属性攻撃で突破可能
            reward: 火炎属性付与ポーション, 火炎武器
        41-50F: 毒攻撃フロア・物理耐性
            全員が毒耐性を行う
            四元素耐性を全員が持つ
            なんとかして毒耐性を付けないと厳しい
            何かしらの属性攻撃が必須
            boss: 四元素毒攻撃・物理耐性, 毒耐性と属性攻撃で突破可能
            reward: 耐性ポーション, 元素耐性装備
        51-60F: 暗黒攻撃フロア
            全員が暗黒攻撃を行う
            boss: 暗黒攻撃・物理耐性, 暗黒耐性で突破可能
        61-70F: 地獄攻撃フロア
            全員が暗黒＋地獄攻撃を行う
            boss: 暗黒＋地獄攻撃・物理耐性, 地獄耐性で突破可能
        71-80F: 混沌攻撃フロア
            全員が暗黒＋地獄＋混沌攻撃を行う
            boss: 暗黒＋地獄＋混沌攻撃・物理耐性, 混沌耐性で突破可能
        81-90F: ガチンコフロア
            無属性攻撃・無耐性
            HP/ATK/DEFが純粋に高い
            boss: 高ステータス, 良い武具が必須
        91-98F: 全属性攻撃・物理四元素耐性
            全耐性の網羅が必須
            何かしらの上位属性攻撃が必須
            最初は薬で一時的に攻撃属性を付与し、いずれは恒常的な属性付与された武器を見つける
        99F: ETH, the Queen戦
            1種類の上位耐性抜け
            日によって抜けてる耐性が変化する
            全属性の攻撃
            全耐性と耐性抜けを突いた武器の用意が必須
        100F: BTC, the King戦
            全耐性・全属性攻撃
            限界成長率のLv50+優秀な武器・防具で踏破可能
            育成計画こそが全て。

*/