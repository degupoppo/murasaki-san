

/*

//---ToDo

    フレーバーテキストの吟味
        物語のバックグラウンドを中心に
        自分語りは避ける
    NFTポップアップウィンドウの実装
        NFTのクリックでポップアップウィンドウを表示する。
        フレーバーテキストも一緒に見れるように。
    init関数を用意する
        addressとabiをどうやって管理するか
        別ファイルとするかどうか。
    リファクタリング
        call回数の最適化
            auctionなどは最初に1回だけcallする？
            その他、on-chainデータ読み込み回数の最適化を図る
        関数のモジュール化と整理整頓
 ok user NFT一覧表示を実装する
 ok     NFTを2つ以上表示すると、colorが混線するバグの修正
 ok ランダムNFT表示を実装する
 ng     クリックでTofuNFTへ飛ぶ？
 ok オークションメカニズムの試行
 ok     cycle早めで一通り挙動を確認する
 ok     NFT所持後、user NFTとrandom NFTを実装する
 ok     bidder lessオークションの挙動を確認する
 ok     可能であれば、end時にブラウザリロードなしでend button表示へ移行したい。
 ok 携帯への最適化
 ok     小さな画面での回り込みや<br>などの配置を詰める
 ok オークション終了時のUIを実装する
 ok     auction.settled=trueをチェックし、Conclude the auctionボタンを設置する
 ok     winnerとbid価格を表示する
 ok     下に処理の説明を記載する
 ok         winnerにNFTが転送される
 ok         次のオークションが開始される
 ok bid履歴にsummoner nameを表示するよう修正する
 ok     tableを使って左合わせをきれいにする
 ok オークションルールの整備
 ok presentbox連携の実装
 ok     オークションをmintするとHoMにもpresentboxが届くようにする
 ok         summonerウォレット限定
 ok     mcにauctionHouseをpermitし、auctionHouseにpresentbox_mintを実装する
 ok 要修正
 ok     bidderが現れずにtimeupした際の処理の実装
 ok         投票してから1時間、誰も投票しなければ勝ちとするか。
 ok         bidder=0なら、残り時間が1時間から減らないようにする
 ok         → 特に手を加えず、endTimeが来たらsettleして次のauctionを開始する
 ok            その際、bidder=0xならば何もしない。
 ok            おなじidのNFTが再度オークションにかけられる
 ok     flavorTextはコントラクトからのcallしか受け付けないようにする
 ok フロントエンド修正
 ok     読み込み中のローディングsvgを実装する
 ok インデックス128色でmain絵の用意
 ok 名前の決定
 ok     Memorabilia
 ok     Memento
 ig 説明文の用意と実装
 ok ピッペルの色決定
 ok オークションコントラの実装
 ok     オークション開始時にはNFTをmintせず、
 ok     勝利者決定後、オークションsettle時にmintしてtransferする
 ok     user msgはbid時に入力を受けて保持しつつ、settle時に渡してmintする。
 ok フロントエンドの実装
 ok     user msgの入力をいつ行うか。
 ok     オークションへのbid時に入力させるか。
 ok     オークション勝利後に入力しつつmintさせるか。
 ok     → 勝利後にmint待ちさせると次のオークションを始められないので
 ok     やはりbid時にメッセージ入力を聞くUIとする。
 ok オークション履歴用のstructを実装する
 ok     auction No
 ok     bidder address
 ok     price
 ok     MoM tokenId
 ok bid logを実装する
 ok     time
 ok     bidder
 ok     amount
 ok MoMにremarkableを実装する
 ok     wallet addressから所有tokenIdを取得できるように。
 ok Reveal前のSVG絵の用意
 ok     JSでuserMsgを動的に修正する
 ok         もしくはpreviewボタンで再読み込みさせる
 ok     実際はauction settle時にmintなのだが、
 ok         UI的にはsettle時にrevealされるのと同じだろうか。
 ok     よって、auction中はランダムな候補絵を表示するのではなく、
 ok         オークション終了時に決定するよう、未開封絵を表示させておく
 ok     実際の表示絵は、過去のMoMを下に表示させることで例示する。
 ok     つまり、Unrevealed用SVGと
 ok         これを表示するjs関数を実装する
 ok         userMsg, tokenId, Dateを引数にとり、
 ok         Unrevealed SVGを返すjs
                

init
    MurasakiAuctionHouse    0xd675daceecafC225690327d38D652eFf4EE9cA0d
        _set0_Murasaki_Craft(address_Murasaki_Craft)    0x143C0Fe403C0328B2AD77a0D1Cb0F6F2A66A8bDE
        _set0_Murasaki_Main(address_Murasaki_Main)  0x4925561b0a524B98F950F07A40F6DFc70B64CaD5
        _set0_NFTAddress(address_Murasaki_Memento)  0x20f18BeDd45a6d6631D3a92ac501d03a51Ac9D18
        _set0_VaultAddress(address_BufferVault) 0xf2a7319Fd847fD79097D74de7F7Df5ae37b4871C
    Murasaki_Memento    0x20f18BeDd45a6d6631D3a92ac501d03a51Ac9D18
        _add_permitted_address(address_MurasakiAuctionHouse)    0xd675daceecafC225690327d38D652eFf4EE9cA0d
        _set_address_Murasaki_Memento_codex(address_Murasaki_Memento_codex) 0xD647049142909C78C1B809dDeb283fb546012668
    Murasaki_Memento_codex  0xD647049142909C78C1B809dDeb283fb546012668
        _set_address_Murasaki_Memento   0x20f18BeDd45a6d6631D3a92ac501d03a51Ac9D18
        _set_address_Murasaki_Memento_flavorText    0xEC0E79Ac007B898158b9e52cf4C50E23D744FD69
        _set_address_Murasaki_Memento_mainPng_01    0x71c91F52135afdff323795dbe3Cb34BfC38654f6
        _set_address_Murasaki_Memento_mainPng_02    0xdCCCd34d80f4CbeB34c5f58Ff34a1786525Ef4B1
        _set_address_Murasaki_Memento_mainPng_03    0xB930d720F57924345B49894283b7fD1eA9850381
        _set_address_Murasaki_Memento_mainPng_04    0xDcDc90a7776EF123e2d47bFc9D091D818f8ed8eC
        _set_address_Murasaki_Memento_mainPng_05    0x07A44EaAaF3745cA6fECe7071ABe38c885b2D2d7
        _set_address_Murasaki_Memento_mainPng_06    0x9552409fF6C4c3B1CddAB2DA6f2ac9892d50F47c
    Murasaki_Craft
        _add_permitted_address(MurasakiAuctionHouse)    0xd675daceecafC225690327d38D652eFf4EE9cA0d
*/



// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;



// openzeppelin v4.8
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/Base64.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/Strings.sol"; 
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/structs/EnumerableSet.sol";

// library, timestamp to date
// https://github.com/RollaProject/solidity-datetime#timestamptodatetime
import "https://github.com/RollaProject/solidity-datetime/blob/master/contracts/DateTime.sol";



//---MurasakiAuctionHouse

/*
 * @MoM dev:
 * This contract was built based on NounsAuctionHouse
 * Modification points:
 *  - mint NFT at the auction settlement insted of the auction creation.
 *  - user msg string has been added into the Auction struct.
 *  - bid log recording functions have been added.
 *  - MoM minting functions have been included.
 */

// https://github.com/nounsDAO/nouns-monorepo/packages/nouns-contracts/contracts/NounsAuctionHouse.sol
// https://github.com/ourzora/auction-house/blob/main/contracts/AuctionHouse.sol

interface IWETH {
    function deposit() external payable;
    function withdraw(uint wad) external;

    function transfer(address to, uint256 value) external returns (bool);
}

// interface of HoM
// used for presentbox bonus
interface Murasaki_Craft {
    function craft(
        uint _item_type, 
        uint _summoner, 
        address _wallet, 
        uint _seed, 
        string memory _memo,
        uint _item_subtype
    ) external;
}

interface Murasaki_Main {
    function tokenOf(address _owner) external view returns (uint);
}

contract Murasaki_AuctionHouse is Pausable, ReentrancyGuard, Ownable {

    // ### from INounsAuctionHouse ###
    
    // auction struct
    struct Auction {
        // ID for the Noun (ERC721 token ID)
        uint256 nounId;
        // The current highest bid amount
        uint256 amount;
        // The time that the auction started
        uint256 startTime;
        // The time that the auction is scheduled to end
        uint256 endTime;
        // The address of the current highest bid
        address payable bidder;
        // Whether or not the auction has been settled
        bool settled;
        // @MoM dev: User Msg
        string userMsg;
    }

    // event 
    event AuctionCreated(uint256 indexed nounId, uint256 startTime, uint256 endTime);
    event AuctionBid(uint256 indexed nounId, address sender, uint256 value, bool extended);
    event AuctionExtended(uint256 indexed nounId, uint256 endTime);
    event AuctionSettled(uint256 indexed nounId, address winner, uint256 amount);
    event AuctionTimeBufferUpdated(uint256 timeBuffer);
    event AuctionReservePriceUpdated(uint256 reservePrice);
    event AuctionMinBidIncrementPercentageUpdated(uint256 minBidIncrementPercentage);

    event DurationUpdated(uint256 duration);
    
    // @MoM dev: bid log mapping

    // struct
    struct bidLog {
        uint bidTime;
        address bidder;
        uint bidAmount;
    }

    // mapping, counts and logs
    mapping (uint => uint) public bidCounts;     // auctionNo(=tokenId) => bid count
    mapping (uint => mapping(uint => bidLog)) public bidLogs;   //auctionNo(=tokenId) => bid No => bid log
    
    
    // @MoM dev; auction log mapping
    mapping (uint => Auction) public auctionLogs;    // tokenId => log
    

    // getter for bid logs
    function call_bidLog (uint _tokenId) external view returns (
        uint[10] memory, 
        address[10] memory, 
        uint[10] memory
    ) {
        // prepare bid count
        uint _bidCount = bidCounts[_tokenId];
        require(_bidCount > 0, "not bid yet");
        
        // prepare result arrays
        uint[10] memory _bidTimes;
        address[10] memory _bidders;
        uint[10] memory _bidAmounts;
        
        // calc loop count, max=10
        uint _loopCountLimit = 10;
        for (uint i = _bidCount - 1; i>=0; i--) {
        
            // append bid info
            _bidTimes[i] = bidLogs[_tokenId][i].bidTime;
            _bidders[i] = bidLogs[_tokenId][i].bidder;
            _bidAmounts[i] = bidLogs[_tokenId][i].bidAmount;
            
            // check bid count
            // break when i=0 or reach limit count
            if (i == 0) {
                break;
            } else {
                _loopCountLimit--;
                if (_loopCountLimit <= 0) {
                    break;
                }
            }
        }
        
        // return three arrays
        return (
            _bidTimes,
            _bidders,
            _bidAmounts
        );
    }


    // ### from NounsAuctionHouse ###
    
    // @MoM dev: predefine auction params
    //  timeBuffer = 1 hr
    //  reservePrice = 25 $ASTR
    //  minBidIncrement% = 5%
    //  duration = 72 hr

    // The Nouns ERC721 token contract
    Murasaki_Memento public nouns;

    // The address of the WETH contract
    //address public weth;
    address public weth = 0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720;   // Wrapped Astar

    // The minimum amount of time left in an auction after a new bid is created
    uint256 public timeBuffer = 3600;   // 1 hr

    // The minimum price accepted in an auction
    uint256 public reservePrice = 20 * 10**18;  // 20 $ASTR = $1

    // The minimum percentage difference between the last bid amount and the current bid
    uint8 public minBidIncrementPercentage = 5; // 5%

    // The duration of a single auction
    uint256 public duration = 86400 * 3;    // 3 days

    // The active auction
    //INounsAuctionHouse.Auction public auction;
    Auction public auction;


    // @MoM dev; total auction amount
    uint public totalAuctionAmount;
    

    // @MoM dev: initialization of first auction
    // @MoM dev: mom nft begin tokenId=1
    /*
    constructor() {
        auction = Auction({
            nounId: 1,
            amount: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            bidder: payable(0),
            settled: false,
            userMsg: ""
        });
    }
    */
    function start_firstAuction () external onlyOwner {
        auction = Auction({
            nounId: 1,
            amount: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            bidder: payable(0),
            settled: false,
            userMsg: ""
        });
    }


    // @MoM dev: The address of valut
    address public vault_address;
    function _set0_VaultAddress(address _address) external onlyOwner {
        vault_address = _address;
    }
    
    // @MoM dev: set NFT address
    function _set0_NFTAddress(address _address) external onlyOwner {
        nouns = Murasaki_Memento(_address);
    }


    /**
     * @notice Settle the current auction, mint a new Noun, and put it up for auction.
     */
    function settleCurrentAndCreateNewAuction() external nonReentrant whenNotPaused {
        _settleAuction();
        _createAuction();
    }

    /**
     * @notice Settle the current auction.
     * @dev This function can only be called when the contract is paused.
     */
    function settleAuction() external whenPaused nonReentrant {
        _settleAuction();
    }

    /**
     * @notice Create a bid for a Noun, with a given amount.
     * @dev This contract only accepts payment in ETH.
     */
    function createBid(uint256 nounId, string memory _userMsg) external payable nonReentrant {
        //INounsAuctionHouse.Auction memory _auction = auction;
        Auction memory _auction = auction;

        require(_auction.nounId == nounId, 'Noun not up for auction');
        require(block.timestamp < _auction.endTime, 'Auction expired');
        require(msg.value >= reservePrice, 'Must send at least reservePrice');
        require(
            msg.value >= _auction.amount + ((_auction.amount * minBidIncrementPercentage) / 100),
            'Must send more than last bid by minBidIncrementPercentage amount'
        );

        address payable lastBidder = _auction.bidder;
        
        // @MoM dev: check and update user msg
        if (bytes(_userMsg).length == 0) {
            _userMsg = "&#x273f; Memento of Murasaki-san, built on Astar.";
        } else {
            require(validate_msg(_userMsg), "invalid msg");
        }
        auction.userMsg = _userMsg;

        // Refund the last bidder, if applicable
        if (lastBidder != address(0)) {
            _safeTransferETHWithFallback(lastBidder, _auction.amount);
        }

        auction.amount = msg.value;
        auction.bidder = payable(msg.sender);

        // Extend the auction if the bid was received within `timeBuffer` of the auction end time
        bool extended = _auction.endTime - block.timestamp < timeBuffer;
        if (extended) {
            auction.endTime = _auction.endTime = block.timestamp + timeBuffer;
        }
        
        // @MoM dev: recode bid log
        _recodeBidLog(nounId, block.timestamp, msg.sender, msg.value);

        emit AuctionBid(_auction.nounId, msg.sender, msg.value, extended);

        if (extended) {
            emit AuctionExtended(_auction.nounId, _auction.endTime);
        }
    }
    

    // @MoM dev: recode bid log
    function _recodeBidLog (
        uint _tokenId, 
        uint _bidTime, 
        address _bidder, 
        uint _bidAmount
    ) internal {
        uint _bidCount = bidCounts[_tokenId];
        bidLogs[_tokenId][_bidCount] = bidLog({
            bidTime: _bidTime,
            bidder: _bidder,
            bidAmount: _bidAmount
        });
        bidCounts[_tokenId]++;
    } 


    /**
     * @notice Pause the Nouns auction house.
     * @dev This function can only be called by the owner when the
     * contract is unpaused. While no new auctions can be started when paused,
     * anyone can settle an ongoing auction.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the Nouns auction house.
     * @dev This function can only be called by the owner when the
     * contract is paused. If required, this function will start a new auction.
     */
    function unpause() external onlyOwner {
        _unpause();

        if (auction.startTime == 0 || auction.settled) {
            _createAuction();
        }
    }

    /**
     * @notice Set the auction time buffer.
     * @dev Only callable by the owner.
     */
    function setTimeBuffer(uint256 _timeBuffer) external onlyOwner {
        timeBuffer = _timeBuffer;

        emit AuctionTimeBufferUpdated(_timeBuffer);
    }

    /**
     * @notice Set the auction reserve price.
     * @dev Only callable by the owner.
     */
    function setReservePrice(uint256 _reservePrice) external onlyOwner {
        reservePrice = _reservePrice;

        emit AuctionReservePriceUpdated(_reservePrice);
    }

    /**
     * @notice Set the auction minimum bid increment percentage.
     * @dev Only callable by the owner.
     */
    function setMinBidIncrementPercentage(uint8 _minBidIncrementPercentage) external onlyOwner {
        minBidIncrementPercentage = _minBidIncrementPercentage;

        emit AuctionMinBidIncrementPercentageUpdated(_minBidIncrementPercentage);
    }

    // @MoM dev: set duration
    function setDuration(uint256 _duration) external onlyOwner {
        duration = _duration;
        emit DurationUpdated(_duration);
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the `auction` state variable and emit an AuctionCreated event.
     * If the mint reverts, the minter was updated without pausing this contract first. To remedy this,
     * catch the revert and pause this contract.
     */
    function _createAuction() internal {
    
        // @MoM dev: not mint NFT at auction creation
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;
        
        uint nounId = nouns.next_nft();

        auction = Auction({
            nounId: nounId,
            amount: 0,
            startTime: startTime,
            endTime: endTime,
            bidder: payable(0),
            settled: false,
            userMsg: ""
        });

        emit AuctionCreated(nounId, startTime, endTime);
    }

    /**
     * @notice Settle an auction, finalizing the bid and paying out to the owner.
     * @dev If there are no bids, the Noun is burned.
     */
    function _settleAuction() internal {
    
        // @MoM dev: mint random NFT at auction settle

        Auction memory _auction = auction;

        require(_auction.startTime != 0, "Auction hasn't begun");
        require(!_auction.settled, 'Auction has already been settled');
        require(block.timestamp >= _auction.endTime, "Auction hasn't completed");

        auction.settled = true;
        
        // @MoM dev: mint random NFT
        if (_auction.bidder != address(0)) {
            _mintMoM(_auction.bidder, _auction.userMsg);
            
            // check HoM summoner and presentbox bonus
            if (Murasaki_Main(address_Murasaki_Main).tokenOf(_auction.bidder) > 0) {
                _mint_presentbox(_auction.bidder);
            }
        }

        // @MoM dev: transfer all amount for buffer vault contract
        if (_auction.amount > 0) {
            _safeTransferETHWithFallback(vault_address, _auction.amount);
        }
        
        // @MoM dev; auction log
        auctionLogs[_auction.nounId] = _auction;
        
        // @MoM dev; update totalAuctionAmount
        totalAuctionAmount += _auction.amount;

        emit AuctionSettled(_auction.nounId, _auction.bidder, _auction.amount);
    }

    /**
     * @notice Transfer ETH. If the ETH transfer fails, wrap the ETH and try send it as WETH.
     */
    function _safeTransferETHWithFallback(address to, uint256 amount) internal {
        if (!_safeTransferETH(to, amount)) {
            IWETH(weth).deposit{ value: amount }();
            IERC20(weth).transfer(to, amount);
        }
    }

    /**
     * @notice Transfer ETH and return the success status.
     * @dev This function only forwards 30,000 gas to the callee.
     */
    function _safeTransferETH(address to, uint256 value) internal returns (bool) {
        (bool success, ) = to.call{ value: value, gas: 30_000 }(new bytes(0));
        return success;
    }
    

    // ### @MoM dev: For minting MoM ###

    // max number of param
    uint public numberOfColor = 12;
    uint public numberOfMain = 6;
    uint public numberOfOhana = 6;
    uint public numberOfPippel = 5;
    uint public numberOfFluffy = 12;
    uint public numberOfFlavorText = 28;
    function _set_numberOfColor (uint _val) external onlyOwner {
        numberOfColor = _val;
    }
    function _set_numberOfMain (uint _val) external onlyOwner {
        numberOfMain = _val;
    }
    function _set_numberOfOhana (uint _val) external onlyOwner {
        numberOfOhana = _val;
    }
    function _set_numberOfPippel (uint _val) external onlyOwner {
        numberOfPippel = _val;
    }
    function _set_numberOfFluffy (uint _val) external onlyOwner {
        numberOfFluffy = _val;
    }
    function _set_numberOfFlavorText (uint _val) external onlyOwner {
        numberOfFlavorText = _val;
    }

    // mint
    function _mintMoM (address _bidder, string memory _userMsg) internal {

        // prevent stack too deep error
        nouns.mint(
            _dn(1,numberOfColor)+1,  // _dn(xxx,3)+1 -> 1-3
            _dn(2,numberOfMain)+1,
            _dn(3,numberOfOhana)+1,
            _dn(4,numberOfPippel)+1,
            _dn(5,numberOfFluffy)+1,
            _seed(7),
            _userMsg,
            _bidder,
            _dn(6,numberOfFlavorText)+1
        );
    }
    
    // check msg, from rarity_names
    function validate_msg(string memory str) internal pure returns (bool){
        bytes memory b = bytes(str);
        if(b.length < 1) return false;
        if(b.length > 50) return false; // Cannot be longer than 12 characters
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

    // internal, random, salt
    uint private _salt = 0;
    function update_salt(uint _summoner) external onlyOwner {
        _salt = _dn(_summoner, 10);
    }
    function _dn(uint _summoner, uint _number) internal view returns (uint) {
        return _seed(_summoner) % _number;
    }
    function _random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
    function _seed(uint _summoner) internal view returns (uint rand) {
        rand = _random(
            string(
                abi.encodePacked(
                    block.timestamp,
                    blockhash(block.number - 1 - _salt),
                    block.coinbase,
                    _summoner,
                    msg.sender
                )
            )
        );
    }
    
    
    // ### presentbox bonus for HoM ###
    
    // set Murasaki_Craft address of HoM
    address public address_Murasaki_Craft;
    function _set0_address_Murasaki_Craft(address _address) external onlyOwner {
        address_Murasaki_Craft = _address;
    }
    
    // set Murasaki_Main address of HoM
    // used in _settle function
    address public address_Murasaki_Main;
    function _set0_address_Murasaki_Main(address _address) external onlyOwner {
        address_Murasaki_Main = _address;
    }

    //internal, mint presentbox
    function _mint_presentbox(address _wallet_to) internal {
        Murasaki_Craft mc = Murasaki_Craft(address_Murasaki_Craft);
        uint __seed = _seed(200);
        uint _item_type = 200;
        string memory _memo = "Auction Winner Bonus!";
        mc.craft(_item_type, 0, _wallet_to, __seed, _memo, 0);
    }
}



//---Murasaki_Memento
contract Murasaki_Memento is ERC721, Ownable, Pausable {

    //pausable
    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }

    //permitted address
    mapping(address => bool) private permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }

    // modifier, only permitted
    modifier onlyPermitted {
        require(permitted_address[msg.sender]);
        _;
    }

    // codex address
    address public address_Murasaki_Memento_codex;
    function _set_address_Murasaki_Memento_codex(address _address) external onlyOwner {
        address_Murasaki_Memento_codex = _address;
    }

    //name
    constructor() ERC721("Memorabilia of Murasaki-san", "MoM") {}

    // nft struct
    uint public next_nft = 1;
    struct nft {
        uint colorId;
        uint mainId;
        uint ohanaId;
        uint pippelId;
        uint fluffyId;
        uint NFTSeed;
        uint mintTime;
        uint blockNumber;
        string mintDate;
        string tokenId;
        string userMsg;
        string blockNumberString;
    }
    mapping(uint => nft) public nfts;
    
    // flavor text
    mapping(uint => uint) public flavorTextId;

    // getters
    function colorId (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].colorId;
    }
    function mainId (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].mainId;
    }
    function ohanaId (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].ohanaId;
    }
    function pippelId (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].pippelId;
    }
    function fluffyId (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].fluffyId;
    }
    function NFTSeed (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].NFTSeed;
    }
    function mintTime (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].mintTime;
    }
    function blockNumber (uint _tokenId) public view returns (uint) {
        return nfts[_tokenId].blockNumber;
    }
    function mintDate (uint _tokenId) public view returns (string memory) {
        return nfts[_tokenId].mintDate;
    }
    function tokenId (uint _tokenId) public view returns (string memory) {
        return nfts[_tokenId].tokenId;
    }
    function userMsg (uint _tokenId) public view returns (string memory) {
        return nfts[_tokenId].userMsg;
    }
    function blockNumberString (uint _tokenId) public view returns (string memory) {
        return nfts[_tokenId].blockNumberString;
    }
    function flavorText (uint _tokenId) public view returns (string memory) {
        return nfts[_tokenId].blockNumberString;
    }

    // mint
    function mint (
        uint _colorId,
        uint _mainId,
        uint _ohanaId,
        uint _pippelId,
        uint _fluffyId,
        uint _NFTSeed,
        string memory _userMsg,
        address _wallet,
        uint _flavorTextId
    ) external whenNotPaused onlyPermitted {
    
        // prepare id
        uint _mintingId = next_nft;

        // def param
        string memory _mintDateString = _get_mintDateString();
        string memory _tokenIdString = _get_tokenIdString();
        string memory _blockNumberString = _get_blockNumberString();

        // update struct
        nfts[_mintingId] = nft(
            _colorId,
            _mainId,
            _ohanaId,
            _pippelId,
            _fluffyId,
            _NFTSeed,
            block.timestamp,
            block.number,
            _mintDateString,
            _tokenIdString,
            _userMsg,
            _blockNumberString
        );
        
        // flavor text
        flavorTextId[_mintingId] = _flavorTextId;
        
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
    
    // internal, get string params
    function _get_mintDateString () internal view returns (string memory) {
        uint _year = DateTime.getYear(block.timestamp);
        uint _month = DateTime.getMonth(block.timestamp);
        uint _day = DateTime.getDay(block.timestamp);
        string memory output = string(abi.encodePacked(
            Strings.toString(_year),
            ".",
            Strings.toString(_month),
            ".",
            Strings.toString(_day)
        ));
        return output;
    }
    function _get_tokenIdString () internal view returns (string memory) {
        string memory output = string(abi.encodePacked(
            "#",
            Strings.toString(next_nft)
        ));
        return output;
    }
    function _get_blockNumberString () public view returns (string memory) {
        string memory output = string(abi.encodePacked(
            "#",
            Strings.toString(block.number)
        ));
        return output;
    }

    // tokenURI, override
    function tokenURI (uint _tokenId) public view override whenNotPaused returns (string memory) {
        require(nfts[_tokenId].mainId != 0, "not exist");
        return Murasaki_Memento_codex(address_Murasaki_Memento_codex).tokenURI(_tokenId);
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



//---Murasaki_Memento_codex
contract Murasaki_Memento_codex is Ownable, Pausable {
    
    // pausable
    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }

    // address POAP
    address public address_Murasaki_Memento;
    function _set_address_Murasaki_Memento(address _address) external onlyOwner {
        address_Murasaki_Memento = _address;
    }

    // address subcodex
    address public address_Murasaki_Memento_mainPng_01;
    address public address_Murasaki_Memento_mainPng_02;
    address public address_Murasaki_Memento_mainPng_03;
    address public address_Murasaki_Memento_mainPng_04;
    address public address_Murasaki_Memento_mainPng_05;
    address public address_Murasaki_Memento_mainPng_06;
    address public address_Murasaki_Memento_mainPng_07;
    address public address_Murasaki_Memento_mainPng_08;
    address public address_Murasaki_Memento_mainPng_09;
    function _set_address_Murasaki_Memento_mainPng_01 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_01 = _address;
    }
    function _set_address_Murasaki_Memento_mainPng_02 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_02 = _address;
    }
    function _set_address_Murasaki_Memento_mainPng_03 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_03 = _address;
    }
    function _set_address_Murasaki_Memento_mainPng_04 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_04 = _address;
    }
    function _set_address_Murasaki_Memento_mainPng_05 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_05 = _address;
    }
    function _set_address_Murasaki_Memento_mainPng_06 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_06 = _address;
    }
    function _set_address_Murasaki_Memento_mainPng_07 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_07 = _address;
    }
    function _set_address_Murasaki_Memento_mainPng_08 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_08 = _address;
    }
    function _set_address_Murasaki_Memento_mainPng_09 (address _address) external onlyOwner {
        address_Murasaki_Memento_mainPng_09 = _address;
    }
    
    // flavor text
    address public address_Murasaki_Memento_flavorText;
    function _set_address_Murasaki_Memento_flavorText (address _address) external onlyOwner {
        address_Murasaki_Memento_flavorText = _address;
    }    
    
    // tokenURI
    function tokenURI (uint _tokenId) public view whenNotPaused returns (string memory) {

        // construct strings
        string memory _header1 = _get_header1(_tokenId);
        string memory _header2 = _get_header2(_tokenId);
        string memory _mainPng = _get_mainPng(_tokenId);
        string memory _footer = _get_footer(_tokenId);
        
        // prepare flavorText
        string memory _flavorText = _get_flavorText(_tokenId);
        
        // bind strings
        string memory output = string(abi.encodePacked(
            _header1,
            _header2,
            _mainPng,
            _footer
        ));
        output = Base64.encode(bytes(string(abi.encodePacked(
            '{"name": "Memento of Murasaki-san #', 
            Strings.toString(_tokenId), 
            '", "description": "This full-on-chain NFT is a side project of House of Murasaki-san (https://murasaki-san.com).   -*-*-*- Rumor says, ',
            _flavorText,
            ' -*-*-*-", "image": "data:image/svg+xml;base64,', 
            Base64.encode(bytes(output)), 
            '"}'
        ))));
        output = string(abi.encodePacked('data:application/json;base64,', output));
        return output;
    }

    // _header1    
    function _get_header1 (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        string memory _context1 = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128"><rect width="128" height="128" fill="#ffffff" rx="12" ry="12"/><defs><style>:root {';
        string memory _context2 = '}</style></defs><g fill="var(--myColor)" fill-opacity="0.125"><defs> <filter id="gfgid4"><feGaussianBlur stdDeviation="0.5"/></filter></defs><path id="astar" d="M127.8 59.7A64 64 0 0 0 16 21.7l-.2.4a63.8 63.8 0 0 0-15 51.2v.2A78.6 78.6 0 0 0 2 79.6a64 64 0 0 0 126-20zm-13.9 1a48 48 0 0 1-.8 12.6 50.7 50.7 0 0 0-21.9-24.1C93 30 86.4 21.9 79 20.5a10.7 10.7 0 1 0-1.8 21.2v2a57.3 57.3 0 0 0-25.5-.6c.7-6.5 3.2-13.8 7.9-19a21.9 21.9 0 0 1 23.2-6.4 50.1 50.1 0 0 1 31 43h.1zm-44.6 9.7a45 45 0 0 1-5.5 6.5c-3-3.3-5.7-7-7.7-10.9l-.3-.6a45.6 45.6 0 0 1-2.9-8c4.6-1 9-1.5 13.3-1.2h.7c2.7.2 5.4.7 8.3 1.5a47.6 47.6 0 0 1-6 12.7zM47.4 16.8a50.7 50.7 0 0 0-9.9 31C20 56 16.3 65.7 18.8 72.8l.3.5a10.7 10.7 0 1 0 19-9.6l1.8-1A57.2 57.2 0 0 0 52 85c-6 2.6-13.5 4.1-20.5 2.7a22 22 0 0 1-17-16.7 49.6 49.6 0 0 1 33-54.3zm20 97.1a49.8 49.8 0 0 1-36-12A50.6 50.6 0 0 0 63.2 95c15.8 11 26.1 9.4 31 3.7a10.7 10.7 0 1 0-16.7-13.4l-.8 1.3-1.8-1a57.1 57.1 0 0 0 13.3-21.8 35.3 35.3 0 0 1 12.6 16.4 22 22 0 0 1-6 23.1A49.7 49.7 0 0 1 67.5 114z"/><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" from="360 64 64" to="0 64 64" dur="60s"/></g><defs><linearGradient id="grad1" x1="-1000%" y1="-1000%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="var(--myColor)"/></linearGradient></defs><rect width="128" height="128" fill="url(#grad1)" rx="12" ry="12" fill-opacity="0.6"/><path d="M 111 8 Q 120 8 120 17 L 120 111 Q 120 120 111 120 L 17 120 Q 8 120 8 111 L 8 17 Q 8 8 17 8 Z" fill="none" id="text-path-a"/><text text-rendering="optimizeSpeed" fill="#ffffff" font-family="arial" font-size="9px" font-weight="bold" fill-opacity="0.8"><textPath startOffset="0%" xlink:href="#text-path-a">';
        string memory _context3 = '<animate additive="sum" attributeName="startOffset" from="100%" to="0%" begin="0s" dur="20s" repeatCount="indefinite"/></textPath><textPath startOffset="-100%" xlink:href="#text-path-a">';
        string memory _colors = _get_colors(_tokenId);
        string memory output = string(abi.encodePacked(
            _context1,
            _colors,
            _context2,
            mm.userMsg(_tokenId),
            _context3,
            mm.userMsg(_tokenId)
        ));
        return output;
    }

    // _header2
    function _get_header2 (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        string memory _context4 = '<animate additive="sum" attributeName="startOffset" from="100%" to="0%" begin="0s" dur="20s" repeatCount="indefinite" /></textPath></text><g fill="var(--myColor)" font-family="arial" font-weight="bold"><text x="14" y="23" font-size="14px" text-anchor="start">';
        string memory _context5 = '</text><text x="114" y="21" font-size="10px" text-anchor="end">';
        string memory _context6 = '</text><text x="108" y="117" font-size="2.5px" text-anchor="end">Minted in block ';
        string memory _context7 = ' on the Astar Substrate EVM</text><g><use xlink:href="#astar" transform="translate(108,116.4) scale(0.005,0.005)"/><animate attributeName="fill-opacity" values="1; 1; 0; 0; 1" keyTimes="0; 0.5; 0.5; 1; 1" dur="3s" repeatCount="indefinite"/></g></g><rect x="10" y="10" width="108" height="108" fill="#ffffff" rx="10" ry="10" fill-opacity="0.3"/>';
        string memory output = string(abi.encodePacked(
            _context4,
            mm.tokenId(_tokenId),
            _context5,
            mm.mintDate(_tokenId),
            _context6,
            mm.blockNumberString(_tokenId),
            _context7            
        ));
        return output;
    }
    
    // _colors
    function _get_colors (uint _tokenId) internal view returns (string memory) {
        string memory output = string(abi.encodePacked(
            "--myColor:",
            _get_mainColor(_tokenId),
            ";--ohanaColor:",
            _get_ohanaColor(_tokenId),
            ";--fluffyColor:",
            _get_fluffyColor(_tokenId),
            ";",
            _get_pippelColors(_tokenId)
        ));
        return output;
    }
    
    // _mainColor
    function _get_mainColor (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        uint _mainId = mm.mainId(_tokenId);
        string memory _mainColor;
        if (_mainId == 1) {
            _mainColor = "#E60012";
        } else if (_mainId == 2) {
            _mainColor = "#F39800";
        } else if (_mainId == 3) {
            _mainColor = "#2f34d3";
        } else if (_mainId == 4) {
            _mainColor = "#8FC31F";
        } else if (_mainId == 5) {
            _mainColor = "#009944";
        } else if (_mainId == 6) {
            _mainColor = "#009E96";
        } else if (_mainId == 7) {
            _mainColor = "#00A0E9";
        } else if (_mainId == 8) {
            _mainColor = "#0068B7";
        } else if (_mainId == 9) {
            _mainColor = "#1D2088";
        } else if (_mainId == 10) {
            _mainColor = "#920783";
        } else if (_mainId == 11) {
            _mainColor = "#E4007F";
        } else if (_mainId == 12) {
            _mainColor = "#E5004F";
        }
        return _mainColor;
    }
    
    // _ohanaColor
    function _get_ohanaColor (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        uint _ohanaId = mm.ohanaId(_tokenId);
        string memory _ohanaColor;
        if (_ohanaId == 1) {
            _ohanaColor = "#F996A0";
        } else if (_ohanaId == 2) {
            _ohanaColor = "#73A2E4";
        } else if (_ohanaId == 3) {
            _ohanaColor = "#F98977";
        } else if (_ohanaId == 4) {
            _ohanaColor = "#F9B65B";
        } else if (_ohanaId == 5) {
            _ohanaColor = "#AFE2F2";
        } else if (_ohanaId == 6) {
            _ohanaColor = "#FEF8E5";
        }
        return _ohanaColor;
    }
    
    // _fluffyColor
    function _get_fluffyColor (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        uint _fluffyId = mm.fluffyId(_tokenId);
        string memory _fluffyColor;
        if (_fluffyId == 1) {
            _fluffyColor = "#FBFFF0";
        } else if (_fluffyId == 2) {
            _fluffyColor = "#FFE381";
        } else if (_fluffyId == 3) {
            _fluffyColor = "#FFD5D5";
        } else if (_fluffyId == 4) {
            _fluffyColor = "#FFBDA8";
        } else if (_fluffyId == 5) {
            _fluffyColor = "#FF686B";
        } else if (_fluffyId == 6) {
            _fluffyColor = "#FDBEFF";
        } else if (_fluffyId == 7) {
            _fluffyColor = "#DAB3FF";
        } else if (_fluffyId == 8) {
            _fluffyColor = "#8EACFF";
        } else if (_fluffyId == 9) {
            _fluffyColor = "#A9E8FF";
        } else if (_fluffyId == 10) {
            _fluffyColor = "#B7FFD0";
        } else if (_fluffyId == 11) {
            _fluffyColor = "#D8BFAC";
        } else if (_fluffyId == 12) {
            _fluffyColor = "#B3BFC7";
        }
        return _fluffyColor;
    }
    
    // _pippelColor
    function _get_pippelColors (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        uint _pippelId = mm.pippelId(_tokenId);
        string memory _pippelColors;
        if (_pippelId == 1) {
            _pippelColors = "--pc1:#F6CFD6;--pc2:#F19EC2;--pc3:#ED7BAC;--pc4:#9FCBF2;";
        } else if (_pippelId == 2) {
            _pippelColors = "--pc1:#72BCE9;--pc2:#C6BFDF;--pc3:#12A3FC;--pc4:#FFFA70;";
        } else if (_pippelId == 3) {
            _pippelColors = "--pc1:#FFFA70;--pc2:#F8BF7F;--pc3:#F4A33C;--pc4:#EC6D4E;";
        } else if (_pippelId == 4) {
            _pippelColors = "--pc1:#DFF1F4;--pc2:#F4EF86;--pc3:#E1D6E9;--pc4:#F19EC2;";
        } else if (_pippelId == 5) {
            _pippelColors = "--pc1:#EEB7EE;--pc2:#D580E2;--pc3:#FAB2D4;--pc4:#C48DED;";
        }
        return _pippelColors;
    }

    // mainPng
    function _get_mainPng (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        uint _mainId = mm.mainId(_tokenId);
        string memory _mainPng;
        if (_mainId == 1) {
            _mainPng = Murasaki_Memento_mainPng_01(address_Murasaki_Memento_mainPng_01).mainPng();
        } else if (_mainId == 2) {
            _mainPng = Murasaki_Memento_mainPng_02(address_Murasaki_Memento_mainPng_02).mainPng();
        } else if (_mainId == 3) {
            _mainPng = Murasaki_Memento_mainPng_03(address_Murasaki_Memento_mainPng_03).mainPng();
        } else if (_mainId == 4) {
            _mainPng = Murasaki_Memento_mainPng_04(address_Murasaki_Memento_mainPng_04).mainPng();
        } else if (_mainId == 5) {
            _mainPng = Murasaki_Memento_mainPng_05(address_Murasaki_Memento_mainPng_05).mainPng();
        } else if (_mainId == 6) {
            _mainPng = Murasaki_Memento_mainPng_06(address_Murasaki_Memento_mainPng_06).mainPng();
        }
        return _mainPng;
    }

    // footer
    function _get_footer (uint _tokenId) internal view returns (string memory) {
        string memory _context1 = '<g stroke="#866F52" stroke-width="1.2" stroke-opacity="0.8" transform="translate(';
        string memory _context2 = ') scale(0.75)"><path d="m-3.6-5.2c-.1-2.3 1.6-4.2 3.9-4.3 2.3-.1 4.2 1.6 4.3 3.9 0 .2 0 .4-0 .7 1.8-.8 3.9.1 4.7 1.9.8 1.9-.1 4-2 4.8-.2.1-.5.2-.8.2 1.4 1.4 1.4 3.7-.1 5.1-1.5 1.4-3.8 1.4-5.2-.1-.4-.4-.7-1-.9-1-.7 1.5-2.9 2.8-5 2.2-2.1-.6-3.3-2.8-2.7-4.9.2-.6.5-1.2.9-1.6-2.2-.5-3.4-2.5-2.9-4.5.5-2 2.6-3.3 4.6-2.7.4.1.7.3 0 0z" fill="var(--ohanaColor)" stroke-linejoin="round"/><circle cx="0" cy="0" r="3.2" fill="#FFEE57"/><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="20s" repeatCount="indefinite" additive="sum"/></g><g transform="translate(23 116.5) scale(0.25 0.25)"><defs><linearGradient id="grad2" x1="0%" y1="1000%" x2="0%" y2="0%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#73EAA1"/></linearGradient></defs><g stroke="#ffffff" stroke-opacity="0.2" stroke-width="10"><path d="m0 0c2.5-16.4 5.6-33.3 5.7-47.8 0-14.5-4.4-32.3-5.4-39.4-1-7.1-1.5-8.8-1.7-12-.2-3.2.2-6.7.6-9.8" id="pippelStem" fill="none" stroke-linecap="round"/></g><use xlink:href="#pippelStem" stroke-opacity="1" stroke="url(#grad2)" stroke-width="8"/><g fill="#73EAA1" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1" fill-opacity="1"><path d="m8 -45c.1-.1-.2-3.3 2-5.2 2.1-1.9 9.3-10.8 12.4-10.8 3 0 5.3 7.5 5.8 10.8.5 3.2-.9 6.5-2.9 8.7-2 2.2-6.6 4.3-9.2 4.7-2.6.4-5-1-6.4-2.4-1.4-1.4-1.5-3.6-1.7-5.8z"/><path d="m0 -20c-1.1-1.9-4.3-5.2-6.8-7.2-2.5-2-6-4.2-8-4.7-2-.5-3.2.6-4 1.7-.7 1.2-.5 3.5-.3 5.2.1 1.7.5 3.6 1 5.2.5 1.5 1.2 2.8 1.9 3.9.7 1.1 1.1 1.9 2.5 2.5 1.3.6 3.7 1.3 5.6 1.1 1.8-.2 4.1-1.5 5.4-2.1 1.3-.6 2.2-.7 2.6-1.5.5-.9 1.1-2.1 0-4z"/></g></g><g transform="translate(23 85) scale(';
        string memory _context3 = ')" fill-opacity="0.6"><defs> <filter id="gfgid3"> <feGaussianBlur stdDeviation="0.1"/> </filter> <filter id="gfgid4"> <feGaussianBlur stdDeviation="2"/> </filter>     </defs> <circle cx="0" cy="0" r="1.5" fill="var(--pc1)" fill-opacity="0.6" filter="url(#gfgid3)"/><g transform="scale(3 3)" filter="url(#gfgid3)"><circle cx="2" cy="0" r="1" fill="var(--pc1)"/><circle cx="1.73" cy="1" r="0.8" fill="var(--pc2)"/><circle cx="1" cy="1.73" r="1" fill="var(--pc3)"/><circle cx="0" cy="2" r="0.8" fill="var(--pc4)"/><circle cx="-1" cy="1.73" r="1" fill="var(--pc1)"/><circle cx="-1.73" cy="1" r="0.8" fill="var(--pc2)"/><circle cx="-2" cy="0" r="1" fill="var(--pc3)"/><circle cx="-1.73" cy="-1" r="0.8" fill="var(--pc1)"/><circle cx="-1" cy="-1.73" r="1" fill="var(--pc2)"/><circle cx="0" cy="-2" r="0.8" fill="var(--pc1)"/><circle cx="1" cy="-1.73" r="1" fill="var(--pc1)" /><circle cx="1.73" cy="-1" r="0.8" fill="var(--pc1)"/><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="90s" repeatCount="indefinite" additive="sum"/></g><g transform="scale(2 2)" filter="url(#gfgid3)"><circle cx="2" cy="0" r="1.5" fill="var(--pc4)"/><circle cx="1.73" cy="1" r="1" fill="var(--pc3)"/><circle cx="1" cy="1.73" r="1" fill="var(--pc2)"/><circle cx="0" cy="2" r="1.5" fill="var(--pc1)"/><circle cx="-1" cy="1.73" r="1" fill="var(--pc4)"/><circle cx="-1.73" cy="1" r="1" fill="var(--pc3)"/><circle cx="-2" cy="0" r="1.5" fill="var(--pc2)"/><circle cx="-1.73" cy="-1" r="1" fill="var(--pc4)"/><circle cx="-1" cy="-1.73" r="1" fill="var(--pc3)"/><circle cx="0" cy="-2" r="1.5" fill="var(--pc4)"/><circle cx="1" cy="-1.73" r="1" fill="var(--pc4)"/><circle cx="1.73" cy="-1" r="1" fill="var(--pc4)"/><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="60s" repeatCount="indefinite" additive="sum"/></g></g><g transform="translate(100 100) scale(0.9)"><defs> <filter id="gfgid"> <feGaussianBlur stdDeviation="0.6"/> </filter> <filter id="gfgid2"> <feGaussianBlur stdDeviation="0.25"/> </filter> <radialGradient id="grad5"><stop offset="50%" stop-color="#ffffff" stop-opacity="1"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="2" cy="2" r="12" fill="url(#grad5)"/><circle cx="2" cy="2" r="11" fill="var(--fluffyColor)" filter="url(#gfgid)" fill-opacity="0.9"/><g fill="#000000" fill-opacity="0.5" filter="url(#gfgid2)" ><circle cx="-3" cy="-1" r="1"/><circle cx="7" cy="-1" r="1"/><animateTransform attributeName="transform" type="scale" values="1,1; 1,1; 1,0.2; 1,0.2; 1,1; 1,1" keyTimes="0; 0.4; 0.4; 0.42; 0.42; 1" dur="10s" repeatCount="indefinite" additive="sum"/></g><g fill="#FBAED2" fill-opacity="0.35" filter="url(#gfgid2)"><circle cx="-6" cy="4" r="2"/><circle cx="10" cy="4" r="2"/></g><animateTransform attributeName="transform" type="translate" values="0 0; 0 0; 0 -1; 0 -1; 0 0" keyTimes="0; 0.5; 0.5; 1; 1" dur="4s" repeatCount="indefinite" additive="sum"/></g><defs><style>#stroke {stroke-dasharray:500 500;stroke-dashoffset: 500;animation: write-the-text 3s linear forwards;}@keyframes write-the-text {0% { stroke-dashoffset:500; }20% { stroke-dashoffset:500; }100% { stroke-dashoffset:0; }}</style></defs><g fill="none" transform="translate(40 111) scale(0.05)" stroke-opacity="0.5" stroke="var(--myColor)" id="stroke"><path id="mask-line" d="M48.8 71v35.7c0 4.6-3.7 8.3-8.3 8.3h-81.2a8.3 8.3 0 0 1-8.3-8.3v-60" stroke-width="10.56"/><path d="M-31.4 50.4c0-1.5 1.2-2.7 2.7-2.7H9.7c1.5 0 2.7 1.2 2.7 2.7v38.3c0 1.5-1.2 2.7-2.7 2.7h-38.4a2.7 2.7 0 0 1-2.7-2.7Z" stroke-width="6.6"/><path d="m0 0-70.8 41M-.1 0l70.8 41" stroke-width="17.16" stroke-linecap="round"/></g></svg>';
        string memory _ohanaPos = _get_ohanaPos(_tokenId);
        string memory _pippelScale = _get_pippelScale(_tokenId);
        string memory output = string(abi.encodePacked(
            _context1,
            _ohanaPos,
            _context2,
            _pippelScale,
            _context3
        ));
        return output;
    }
    
    // _ohanaPos
    function _get_ohanaPos (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        uint _mainId = mm.mainId(_tokenId);
        string memory _ohanaPos;
        if (_mainId == 1) {
            _ohanaPos = '85 45';
        } else if (_mainId == 2) {
            _ohanaPos = '65 41';
        } else if (_mainId == 3) {
            _ohanaPos = '82 48';
        } else if (_mainId == 4) {
            _ohanaPos = '80 52';
        } else if (_mainId == 5) {
            _ohanaPos = '80 65';
        } else if (_mainId == 6) {
            _ohanaPos = '85 52';
        }
        return _ohanaPos;
    }
    
    // _pippelScale
    function _get_pippelScale (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        uint _mintTime = mm.mintTime(_tokenId);
        uint _deltaTime = block.timestamp - _mintTime;
        string memory _scaleString;
        if (_deltaTime < 2592000*1) {   // < 1 mo
            _scaleString = "0.9";
        } else if (_deltaTime < 2592000*2) {
            _scaleString = "0.95";
        } else if (_deltaTime < 2592000*3) {
            _scaleString = "1";
        } else if (_deltaTime < 2592000*4) {
            _scaleString = "1.05";
        } else if (_deltaTime < 2592000*5) {
            _scaleString = "1.1";
        } else if (_deltaTime < 2592000*6) {
            _scaleString = "1.15";
        } else {    // > 6 mo
            _scaleString = "1.2";
        }
        return _scaleString;
    }
    
    // flavor text
    function _get_flavorText (uint _tokenId) internal view returns (string memory) {
        Murasaki_Memento mm = Murasaki_Memento(address_Murasaki_Memento);
        uint _flavorTextId = mm.flavorTextId(_tokenId);
        Murasaki_Memento_flavorText mpf = Murasaki_Memento_flavorText(address_Murasaki_Memento_flavorText);
        return mpf.flavorText(_flavorTextId);
    }
}



//---mainPng
contract Murasaki_Memento_mainPng_01 is Ownable {
    function mainPng () external pure returns (string memory) {
        string memory _mainPng = '<image width="72" height="72" x="28" y="32" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAB5CAMAAADLY6lvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKaUExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXVVVVU5OTltbW1VVVVBQUFpaWlVVVVFRUVlZWVVVVVVVVVhYTlVVVVJSUlhYT1VVVVJSUlhYUFVVVVNTU1dXUFVVVVNTU1dXUVVVVVNTU1VVVVNZU1FXUVVVVVNZU1VVVVJXUlVVVVNYU1JXUlVVVVNYU1JXUlVVVVRYVFJWUlVVVVJWUlVVVVJWUlRYVFNWU1VVUVRXVFNWU1VVUVRXVFNWU1VVUlRXVFNWU1RXVFNWU1VVUlRXVFRXVFNWU1VVUlRXVFVVUlNWU1VVUlRXVFNWU1VVUlRXVFNWU1NWU1VVU1RXVFNWU1VVU1RXVFVVU1RXUlNWU1VVU1NWU1VVU1RWVFVVU1RWUlRWVFVVU1RWUlRWVFVVU1RWUlRWVFVVU1RWUlNXU1RWVFRWUlRWVFRWU1RWVFNXU1RWU1RWVFNXU1RWU1RWVFNXU1RWVFNXU1RWU1RWUlNXU1RWU1RWUlNXU1NXU1RWU1RWUlNXU1RWU1RWUlNXU1RWU1RWUlNXU1RWUlRWU1RWU1VWU1VWU1RWVFVWU1RVU1RWVFVWU1RVU1RWVFVWU1RWVFVWU1RVU1RWVFVWU1RVU1RWUlVWU1RVU1RWUlRVU1RWUlVWU1RWUlVWU1RWU1VWU1RVU1RWU1VWU1RVU1RWU1RWU1NWU1RXU1NWU1RXU1RWU1NWU1RXU1NWU1RXU1RWU1NWU1RWU1RWVFRWVFRWU1RWU1RWUlRWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU2dpZo+GhLWmouPIweXBqPvK0f/I1v/X0//f0jEw/gQAAADUdFJOUwABAgMEBQYHCAkKCwwNDg8QERITFBUYGhscHR4fICEiIyQlJicoKissLS4wMjM0NTY3ODk6Ozw+P0FDREVGR0hJSktMTU9QUVJVVldYWlxdXl9gYWJlZmdoaWpsbW5vcXJ0dXZ3eHl6e3x9fn+Bg4WGiImKi4yNjo+QkpOUlZaXmJmcnZ6foKGio6Slp6mqrK+xsrO0tba3uLq7vL2+v8DBwsPFxsfJyszNzs/Q0dLV1tfZ2tvc3d/g4eLj5ejp6uvs7e7v8PHy8/T19vf4+fr7/P3+KTmAoQAAAAlwSFlzAAAOwwAADsMBx2+oZAAACgRJREFUeF7tm+ufVVUZx8+ZGRQHAzTByEsKaWVp4CWoNAtERc2IEi27iYqgFgYBhjlg3soblXhBS8FCu2k3zJKImfGCzIDgOfucvc9w5n/p9zzr2fe1917rXHzRh++bOWfvtZ7nt5/1rOvZUzrC+0bvBFCWL+0yXf5aMuGitX/ev3//gU0Xy4V2OH3D46O/XHWSfDNn+soXHGFkw9FysWXufJMtDa6fJhfMOG/Lbq4nbO6V663Ru74qhpw/LZRrBkxYsZ+q1Oqu53luzXEqC+ROaywjYy5bcg5umiRXi/jkb1mE640zXt1x9hwn91rhnGFYI2NKyFOfluv5rEGtUATw8H2F3GyFx0UFmSId++bJjRx61lA71kMRwHWc10+Q+/bMOeA4rlji0Dpv3zFB7mVRXs2hkEoCPcMNUsCeX8FgUyyNjze5Ye7vkZsZrE+FgsAjPNcnJWyZjejGHqtBOh7MM9ezDnXSKsYb6CyttsoDCMaY2FFwgtyX3S49P9LGYnx8DBVvlkKWfGAoEQzACfJg5lj04wwVnKSvSCFLbgq7SQjreCijXa7WtwiBPrvvTClmB8agZDAAt8vXpUic2f4oo6EJ+ddLOStO2ec4Opuk450LpVCUPBXcKjukoBU/ifXWCKRj9PNSKuSoraigCZ+AVql8XIpaMPFv2jYhqN+OfkHKBdD0k62Cxae1FzInJ8KkY5+sZWYtWrb9ykWTSp/AiFvXRk9AcvxMVbHh3jyrHI/jMXKfdN87CILjDG1+KS8xCCTHA2LbnGP/mRti2HRemDJ5aYVFCDnlAar8/Rixbsy5BQ9HOu58npzXXbeO4BQ0CedodapYN2YVzEp9LTQOEDWXhnsPqvKbBDWgNZXXBZT1Y1cEHsaCMbPp1hvqUzYQPjowMHD5ieLDgJNHC5/Oq9dqbn47xMEsywytPlm8FHItglzoomkjAkg7Os5rp4qbIl4pSI2W8BpYpnM6/8ZsvzD130Wp0To8R39WHOUzrzjxW4c62XNG4VhQOAq0A3L1oMGKcMb3/9uN1Aigvv498ZXNgp2UzV2UQV3mu+IsiykbabdTy1jLdYZiGWft6LoIAxkLaSdeKxyX2wO5UblIHOqYeNlByor43qTzUE/JOXc55hcUim4NWwE0bmzJ2YKuJRW6rPA6OobQFHeOuNRALaLLTUylnYwQBWOruNRwwbt6FajW0Y5D67bfzRanaZ7KaJFGZ3NWLZecl78hbhOcnzxF8PE6O4jQARTx3jW6U9u+p9Ek3ZvNQrBcVGvo6nXiOsoJENjJUQve6jmJTU3z9ofFd4T5yIwOBkMt3At0PJ9ulh90dk5Vy9+8B6MOk97TdlgGOQF58UW8tqWOryCjk2OUkuFHo8mozwHUZVLhKI4Gpbhx11Xdkh9MaWD4lg+lz63iPeCrhSlKD2i+BHBrNVVYFCj4lg8Mpk4aPggfuc9KR4o2Q0tTzYfK/djYmPrAtwTIGBbvARNfKkgONQjbjnDsGyKYhA7IeEy8hyA5EiFnEwR/UzJs05iqiwgQGCO0uVH60H8SzUJ1BP5OuaGdgXMCRJVFAuPbIui55ovzCAsr0MGnFQxZCKErDTfZU5qu28RqJDunqCr7P3yY//imCATjrWPFd5RbKOo1t0EFqTyQmlkPjLESk5SBjMMgIYOOz1aK5xjlmw6REDZL5f1w8mepHIdnjrylmW+EZJCO0BI1yS79D6vlM37OOtyYilwd6YaK4VtJRYNUVDSZofgon+w1gmAKQW1bfDuiIjDEP8zcLU5TzNqFu/WUivZl+PiGqNc5u2aJ2wTTSQUdZ2XVtifDUKNG4XhR/3vISlIhlTsnI2IptOPREaaj/Y148lv+KBmv3I6MmCn6HNihXrbjKHEdZXkwjHJ5qUtEq9vCtkLkKqBTY90RKdrEHwK4hmhIPIWeRh00tH2Xa/vINYJOjW8T11F2JmT4Oviz3IjieQ1XZnPOfARTv6VhA4R8F1BJJ2M4skVQ1XwNOhXqV3s1K4sKkCNEPoag1m5xHSUqIx5KjQolgnB5RYQ9kOgyPsBGcqSWPWB72ChABDByKUS1Qq1Ou6+ahxmOc3vMpTnGeOONAV0n41ZYkBKMaMhSwW9G0KjcgHOpqH7Gz5lyo2RE4xoYMNu7kwr1zNT7KQZBGPko2mzHgyC+Ia6jTM7a0ycJVfBnapnw+SkgRlao6l3iOkr5XrN40iQdtH9KBu6bnVGRmRvFdYzTR6nFC23Ac6iWZKAd4otpE6g5B3WLwFJpAZ2KouvlZwg8B1FP5YYxsKIPBvjiAdyEklwdTS+SCdQgkGG9Dacutj3zLb1zt5EMwx4HqIF53LA7HuNpfmfOT27zSYV5iFkBabFIDvmhy7lMXOqg80ALk5ShvOUwbxVeziMWs3JenLwABWzSDY+F4giH+eaW9+TDd+f+CHoPnsvYIKirPPLMTz44djtOEX8Z/NSy71n5F9CQT4q7DPqxb7MfAixBNB4Sfxn0v9d9GZSiBa+1vB8yqHt/Tvxl0Bdf+nQFpMar4i6TTS2My3ZQMNaIt0yW2ozkLYFgjBS+STsVuwQ/HK10xkJoSrtdnOXwLRpGyf0YVlGdDww1yeDx4iuH/ieho1ZXs4/lvJkmeQjDK1Wjl6xn0+mC0G620sQXnRpIRXWt2f8CTLz+H6JC+2aiBTyJhYtKtXtYLW6KmfKpjQPrFrXfJggGqKs1ZZMbxLmj4FXkJHMSAW0B9guQarLSGVxi1iIhRe+fhWR1bPSKQ8sfwfQQ8IezxLg5X9LKGEvtQajF9bsKtAl2ZR97tEovhDjVyouX6g53CqAXNZO5oXnjTI42dO2HNlkFQz2TPrMcfKW/6EV5LWeOpNa5nGQJbUqFbkKkfnKtGGuD3ydbRdaysUSgUXHX3Jd1OrBot38jMs3V1fhgTiqq9IqsfGdwbWhmaZpOB249YtsvdPw11gIci82X41pEG564cguKTtsdvw6oTQondBMwgIU7d86L1047cU/0salJ/shP/GUsYuOnPFA4bP8PTxrK34Zn9d8u6rztX6eWSj+MhIgCdFD+legKegcl2l1wb5u61S5Tt9DYU6vzEZfjbPwIrs14IwwH9ZKlqmiptBFfIunhOc6hvLeZrPgmuVcMrlCzwa+Dp6YmeSI4oeh/AorDHo5g7JE77VOe+fBeFrH3tslyaV5FxhNqkr1ny1VwNkoGaYrM0Pys2AZ9i5csWfK1cADofVbCQU3yHbnInP9moIMCNWT6f1+tMRfukQS0qNwaf+vzdtxhHdytCvYi7dLzDCUBqXh9plwSegcwidUaHh2UVte19399xcwYwrOCyiVyIaBM3cXhbrVeLnWR69Qr/8vka4SeDXwHS71ODONFXPGXSvXVxTpPfXOfHRkZ2X1et1tEUb5qcdaastwL5PMRjvD/Qqn0P0r8h+wcf1H4AAAAAElFTkSuQmCC"/>';
        return _mainPng;
    }
}
contract Murasaki_Memento_mainPng_02 is Ownable {
    function mainPng () external pure returns (string memory) {
        string memory _mainPng = '<image width="80" height="80" x="24" y="28" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAACjCAMAAABytvoxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKCUExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXU5OTltbW1VVVVBQUFpaWlVVVVFRUVlZWVVVVVFRUVlZTlVVVVhYTlVVVVJSUlhYT1VVVVJSUlhYUFVVVVNTU1dXUFVVVVNTU1dXUVNTU1NZU1NZU1FXUVVVVVJXUlVVVVJXUlVVVVNYU1JXUlVVVVJWUlVVVVRYVFJWUlVVVVRYVFJWUlVVUVRYVFNWU1VVUVRXVFNWU1VVUVNWU1VVUlNWU1VVUlRXVFNWU1NWU1RXVFNWU1VVUlRXVFNWU1VVUlRXVFNWU1NWU1RXVFNWU1NWU1VVU1VVU1RXUlNWU1VVU1RWVFRWUlRWVFVVU1RWUlRWVFVVU1RWUlRWVFNXU1RWUlRWVFNXU1NXU1RWU1RWVFRWU1NXU1RWU1RWVFNXU1RWU1NXU1RWU1NXU1RWUlNXU1RWU1NXU1RWU1RWUlRWU1RWUlRWU1RWUlNXU1RWU1RWUlNXU1RWU1RWU1RWVFVWU1VWU1RVU1RWVFVWU1RVU1RWVFVWU1RVU1VWU1RVU1RWVFVWU1RVU1RWVFVWU1RVU1RWUlVWU1RVU1VWU1RVU1RWUlVWU1RVU1RWUlVWU1RVU1RWU1VWU1RVU1RVU1VWU1RVU1RWU1NWU1RXU1RWU1NWU1RXU1RWU1NWU1RXU1RWU1RXU1NWU1RWU1RWVFRWU1RWU1RWVFRWU1RWU1RWUlRWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU2dpZndHT4+GhJKvpbHAxrWmoro2RNbZ1uPIwfYkJ/vK0f/X0yp9y40AAADJdFJOUwABAgMEBQYHCAkKCw0ODxAREhMUFRYXGBobHB0eHyAhIiMkJSYoKy4vMDIzNTY3ODk7PD0+P0BBQkNERUZHSEpLTU5PUFNVVldYWVpbX2JkZWtsb3BxcnR2d3t8fX5/gIGCg4SHiImLjY6PkJGTlJaYmZqcnZ6goaOkpaanqKmqq6yvsLGys7S1tri5uru8vb6/wMHCxMXGx8jJysvMzc7R09TV1tfY2drb3N3e4OLj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"/>';
        return _mainPng;
    }
}
contract Murasaki_Memento_mainPng_03 is Ownable {
    function mainPng () external pure returns (string memory) {
        string memory _mainPng = '<image width="70" height="70" x="28" y="32" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABnCAMAAAAAL11kAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJPUExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXU5OTltbW1VVVVBQUFpaWlVVVVFRUVlZWVlZTlJSUlhYTlVVVVhYT1VVVVhYUFVVVVNTU1dXUFNTU1dXUVVVVVNTU1dXUVVVVVNZU1NZU1FXUVVVVVNYU1JXUlVVVVNYU1JXUlJXUlRYVFJWUlVVVVRYVFJWUlVVUVVVUVRXVFVVUVVVUlRXVFNWU1VVUlRXVFVVUlRXVFVVUlNWU1VVUlNWU1RXVFVVUlNWU1RXVFNWU1VVU1RXVFNWU1VVU1NWU1VVU1RXUlVVU1RWUlRWVFVVU1RWUlRWVFVVU1RWUlVVU1RWUlRWVFNXU1RWUlRWVFNXU1RWVFNXU1RWU1RWVFNXU1RWVFNXU1RWVFNXU1RWU1RWVFNXU1RWUlNXU1RWU1RWUlNXU1RWU1RWUlRWU1RWUlNXU1RWU1RWUlNXU1RWU1RWVFRVU1RWVFRVU1RWVFVWU1RVU1VWU1RVU1RWVFVWU1RVU1VWU1VWU1RVU1RWUlVWU1RWUlVWU1RVU1RWUlVWU1RVU1RWU1VWU1RWU1VWU1RVU1RWU1NWU1RXU1RWU1RXU1RWU1NWU1RXU1RWU1NWU1RXU1RWU1NWU1RWU1RWU1RWVFRWU1RWVFRWU1RWU1RWUlRWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU2dpZndHT4+GhLHAxrWmoro2RMeGkNbZ1uXBqP9SgNxSmtkAAAC6dFJOUwABAgMEBQYHCAkKCw0ODxAREhMUFxkaGx0eICEiIyUmJygpKisuLzAxMjM0NTg6Ozw9QUJFRkhLT1BUVVdYWlxdX2FjZWdoaWprbG5vcHJzdHV2d3h5e3x9gYKDhIaHiImKjI2PkJGSk5iZmpucnZ6goaKjpKWqq62usLGys7W2t7i5u76/wMHDx8jJysvM0NLT1NXW19ja29zd3t/g4eLj5OXm6Onq6+3u7/Dx8vP09fb3+Pn6+/z9/t1YWtIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAX/SURBVGhD7Zr5fxNV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"/>';
        return _mainPng;
    }
}
contract Murasaki_Memento_mainPng_04 is Ownable {
    function mainPng () external pure returns (string memory) {
        string memory _mainPng = '<image width="60" height="60" x="34" y="38" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAACOCAMAAAAGhhpfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIfUExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXVVVVU5OTltbW1VVVVpaWlVVVVFRUVVVVVFdUVlZWVVVVVhYWFVVVVJbUlhYWFVVVVJaUlhYWFVVVVVVVVNaU1dXV1VVVVNZU1VVVVNYU1NYU1dXUlVVVVZWUlZWUlRXVFRXVFVYVVRXVFVYVVRXVFVYVVZWU1RXVFVYVVRXVFZWU1VYVVZWU1VXVVRXVF9iX1VXVVZYU1VXVVRXVFZYU1VXVVRWVFZYVFRWVFZYVFRWVFZYVFVXVVZYVFRWVFVXU1RWVFZXVFVXU1RWVFZXVFVXU1RWVFZXVFRWVFZXVFVXU1RYVFZXVFVXU1RYVFZXVFVXU1RYVGBhXlZXVFVXU1RYVFZXVFVXU1RYVFZXVFZXVFVXU1RYVFZXVFVWVFVXVVVXVFVXVVVWVFVXVVVWVFVXVVVWVFVXVVVXVVVXVVVXVFVYVGBhX1VXVFVXVVVYVFVXVFVXVFVXVVVXVFVXU1VXVFVXU1VXU1VXVFVXU2BhX1VXU1VXVFVWVFVXVFVXVFVYVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVElLSFVXVGBhX2hqZ29KUXFwb4BsdYV/fpFeYZI4SpaQj5d/jaeFqLBBSrKhnbV5rsKgqtWo19a+teCl5frU/Py+//9SgP/I1hVLV2MAAACddFJOUwABAgMEBQYHCAkKCwwNDg8REhMVFhcYGhscHR4fICEkJSYqLjAxNDU8PkFJTE5PVFVXWVtdYWJjaGlqa2xub3BxcnN0dnd5ent9f4GFiYqLjJCRkpSVlpeYmZqbnJ2dnp+goaKjpKeoqaqrrK2vsbW3uLq7vsTFxsfIyszR0tPV1tjZ3N3f3+Ll5ufo7O3u7/Dx8vX29/j5+vv8/f41c9IuAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAKXklEQVR4Xu2b7b/cRBXHty3YB0QREXkqVkQrogIFRBBBK1SLFi2IgKJeEOVZsTwKgorWB0QFrBZKb+be3aUk0MTcS/9Az5zzSzKTnSSTnXz48GK/L9qbyeTM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"/>';
        return _mainPng;
    }
}
contract Murasaki_Memento_mainPng_05 is Ownable {
    function mainPng () external pure returns (string memory) {
        string memory _mainPng = '<image width="60" height="60" x="34" y="44" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAABSCAMAAAC8NLwUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI0UExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXVVVVVtbW1BQUFpaWlVVVVFRUVlZWVVVVVlZWVVVVVJcUlhYWFVVVVhYWFVVVVJaUlhYWFNaU1dXV1VVVVdXV1VVVVNZU1VVVVNZU1VVVVdXUVVVVVNYU1dXUlNYU1dXUlNYU1RYVFVVVVRYVFZWUlZWUlVZVVRYVFVZVVRXVFZWU1VZVVRXVFVYVVZWU1VYVVZWU1RXVFZWU1RXVFVYVVZWU1VYVVRXVFZWU1ZWU1VYVVRXVFZWU1VYVVZWU1ZYU1VXVVZYU1VXVVZYU1RWVFRWVFVXVVRWVFZYVFVXVVVXVVRWVFZYVFVXU1RWVFZYVFRWVFZXVFZXVFVXU1ZXVFVXU1RWVFZXVFVXU1ZXVFZXVFZXVFVXU1RYVFZXVFZXVFRYVFZXVFVXU1RYVFZXVFVXU1RYVFZXVFVXVVVXVFVWVFVXVFVWVFVXVVVXVVVXVVVYVFVXVFVYVFVXVVVXVFVYVFVXVVVYVFVXVVVXVFVXVFVXVVVXVFVXVVVXVFVXVFVXU1VXVFVXU1VXVFVXVFVXU1VXVFVXVFVXVFVXVFVWVFVXVFVWVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVF9hX1VXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVElLSFVXVGBhX2hqZ3Fwb4BsdYV/fpeDdqGKar+meMOrn+O/gOXBqPDgoH7mTLoAAACudFJOUwABAgMEBQYHCAkKCwwOEBESExQVFxgZGhsdHh8gIiMkJicoKistLzAxMjQ1Nzo8PT5BQkNFRkdISUtNTlBSU1VXWVpbXF9jZGVmaGtsbm9xc3Z4eXp7fn+AgYKDhYmMjY+QkZKTlZibnJ2eoaOkpaanqKmqrK2us7S1uLvAwsPExcbHzM3Oz9DR09TV1tfZ2tvc3d7g4ePl5urr7e7v8PHy8/P09fb3+Pn6+/z9/s8Pi4UAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAaHSURBVGhD7Zr5exRFEIYnB8EjqAhKRCOKCioYREXxxpuoiCJ4K94XciioeIGgKBIVPPEI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"/>';
        return _mainPng;
    }
}
contract Murasaki_Memento_mainPng_06 is Ownable {
    function mainPng () external pure returns (string memory) {
        string memory _mainPng = '<image width="70" height="70" x="29" y="31" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAABiCAMAAABUFxzqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALfUExURQAAAAAA/4CA/1VV/0BA/zMz/1VV/0lJ/0BA/zlV/01N/0ZG/0BA/05O/0lJ/0RE/0BQ/0tL/0dH/0NR/0BN/0lJ/0ZG/0NO/0pK/0dH/0VO/0JM/0lJ/0ZG/0RN/0pK/0hI/0RL/0lJ/0dH/0VM/0NK/0hI/0ZN/0RL/0lJ/0dH/0ZL/0hI/0dM/0VK/0RJ/0dN/0ZL/0VK/0hI/0dM/0ZK/0RJ/0hM/0ZL/0VJ/0RI/0dL/0ZK/0VJ/0hM/0dL/0ZJ/0VI/0dL/0VJ/0RL/0dK/0ZJ/0VI/0dL/0ZK/0ZJ/0VL/0dK/0ZJ/0VM/0hL/0dK/0ZJ/0VL/0dK/0ZJ/0ZL/0VK/0dK/0ZJ/0VL/0dJ/0ZL/0VK/0dK/0ZJ/0ZL/0dJ/0ZL/0VK/0dK/0ZJ/0ZL/0VK/0dJ/0ZL/0ZK/0VK/0dL/0ZK/0VK/0dJ/0ZL/0ZK/0VJ/0dL/0ZK/0ZK/0VJ/0ZL/0ZK/0VJ/0dL/0ZK/0ZK/0VJ/0dL/0ZK/0ZJ/0dL/0ZK/0ZK/0VJ/0dK/0ZK/0ZJ/0VL/0dK/0ZK/0ZJ/0ZK/0ZJ/0VL/0ZK/0ZL/0VK/0ZK/0ZJ/0ZL/0dK/0ZK/0ZL/0VK/0dK/0ZJ/0ZK/0VK/0ZK/0ZL/0ZK/0dK/0ZJ/0ZK/0VK/0dK/0ZL/0ZK/0VK/0ZJ/0ZK/0ZK/0dJ/0ZL/0ZK/0ZK/0dJ/0ZK/0ZK/0ZK/0ZK/0ZK/0VJ/0ZK/0ZK/0ZK/0dL/0ZK/0ZK/0ZJ/0ZK/0ZK/0ZK/0VK/0ZK/0ZK/0ZJ/0dK/0ZK/0ZK/0ZK/0ZK/0ZK/0ZL/0VK/0ZK/0ZK/0ZK/0dK/0ZK/0ZL/0ZK/0ZK/0ZK/0ZK/0VK/0ZK/0ZK/0ZK/0ZK/0ZJ/0ZK/0ZK/0ZK/0ZK/0ZK/0dK/0ZJ/0ZK/0ZK/0ZK/0ZK/0ZK/0ZK/0ZL/0ZK/0ZK/0ZK/0ZK/0ZK/0ZK/0ZK/0ZK/0ZK/0ZK/0ZK/0ZK/3e89aYAAAD0dFJOUwABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICIjJCUmJygpKissLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RGR0hJSktMTU5PUFFSU1RVVldYWVpbXF5fYGFiY2VmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+RkpOVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbW2t7i5uru9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f77+BQXAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAJNklEQVRoQ+2a6X+U1RXH72SCCUzYsg2yFUxQVLAgVCpGrTQUFAoICWLqxrRWi0ICJVpIqMZCEAWbAFFoCwwoqERcWEQticG6AS0BLVBZhkS2TGJCZub+Ab3n3PM888yzZSaBT/si3xfk/M65z3Nmnucu596BddJJJ5108r+he2ZmfzIBd2Y3sq4et37MecPqQaR++k49r93Zh9RVoscnHNjpRJXyA6oDblRXiwpMwvkdqLaT2onKBmcXMtpBwgnKsgDUtSR4DQZNcGRnv+gVfPSVd3PO+HjyxoaLksicfUhY5ez97GFqIKnzPbfInUbBqHF+SJdH5tyCQT15FykcQXBHSYxp59OV+D5dR6W4MAJjkbgPhGTUSFNhCjWKil6/PiFuFSyT/XbiF0HOQ+dHoYigyx++owSmnLzPQQ2jIu52j+cnyhVxwzyebJlfS/ITZ+jml6qrV1bWkdAQqpl6ZQdY1n668+XyvqDTp2+9LB2/K61plBbn9X/qwADSk91Md60eQh7GbruAnoZBLH7+t2gKasz6QXtwzqOUFydpv8cY+YD3dBVdb3YD2pw3LonptQ7Ozc2dTHYEr8rb1S3UjQjXbvS/Dvb1a9AWFGOsbZKX+vz+FnFByL9iqXaNEcRTykrxfYCuw5aXPtwDzcQ9EAh5UHSbK3tZw3CUbZH8BbYmGu8it2QuOkPLKeVInIiqk1Ak4eNtpjWp199w/NZdI6UtKf+ApmE+Jj8yDt9lax7JROouD0o59hKIUikYG45JN5GywaVLyYM/p4gg6SB6lJSsBFtwfpz0IyAOJpByFELSlqkkrXkGLovgk/ByUQY6+BAp5vgnNhBdmBwMHdNJMLYX5CEcwzbc3ATNIpFdRHAXPqwXSTE2IoBxTc4/gjpMgrE06ImaC0xJ9EEjHUrOOOyYR6j7CPBRAvvJwYaAOkFCUAr6QCIpUxK2QRs9Ss478Gv+ipQAH7WgeQI5GPtMyFPKCxVP/98Qt32jedDCgJJzFYi3SAAfgSMY2KqZO2rAdScJQTHorSTMcHwNLQxQTvf3IGShJMGcv3Bq57eXwZVFQjAQ9AW1RxjJwYen5704GV0M4lj4uVHOCS7XxPz8ggwXNvsNuF7GKOLEOnISKRM2QtzANoq+AeIBEogohTlXV5F3vN6SsR6w1lEceAgc5rUNsg/iBjbKYCLUupe7SyGZJxtoCOBMpM3ZFYZLi/VewDznfTL4INjKd0by5Jpp5DVqgLwJnhwSBpJP4xV66GW8BPZ6aQM2NVirtgbDz2rZc6/DC/Rc6imj74MId4ZcpQYL1ZeVC3YFAprPcJIejqDfeaHPppLSY57zHEUhZ9OPSLAZoiCUeGWJ5nA67/FsCz+pNer4OAByIgk9bec8Tzb7JU6kyOfaHcMYcgr2jiHfIlDlJPSY5/ySotqcffCz8434ZcPzL2PL0S9pGCt9N4GILedzFNXkdOEyyjfJQuVx6URwFZhCNVjjSPQlgh1bzucpqsn5AgY2OmWlMlc6gYFYRvRm1++Cv3y3C5y2OUdgQz3GnFPQv0P0Hbzia3Qij4E+JKbH/mBwPhOctjmXYTs9hpwjca4/dYMwB8CscEYdjMn4TGcL62kwxFoLXtucS7GdHm3OlmEiD4w3HrwRnViLPIGm4ANQWPc9BZaYKn8s7A7m5JOZoxL+hvKl81kQ9VROzsZSZRWYlJNPE3YHcuKXeJzdjePjFXJecwrUIrQHHwN7N07n9Gz5/cK+F4zYcq6g6KMgKuVG/FN1kikA2Qp9xf0fMP1yfHSvBsHPwhPA7/wSuo2Y51TmgWtx6pkK/zTfTD7RbfDtBsSyuhYMPo/8N8Go+R5eJ1sJfpNtM2Kes1n2FsZwzLXCP2+TB5gADh7YLndFG9Q6Jbng0FLcCnapFf5W0flMMc8p+o3kTtKch7+m2DStJydwRLejAnIgEC55dVjkfIPCvZTV632UcdPLy1ePEwvKX8nN+TcDMBLJZojgMYwZFjn9ctfFWCE5HgXR34v278U3LaaF83g/bBZJF9z1m0UQi5xqSTxU3rsJbAfV074k9zPnpMnPhEtrhdSFVRCpsjwhs8p5kOJOuWX7M9i3KUVBneZgKuTLT1P2Ca70lN4ztlPFZF3IhztJJD8MpQYzUd4D5m/RNOHgu5KjvEn9NBetj6jM1zLBHGrAcNiXgYWVVZjGDRGbcx2WPcgm516q5NkKUKFsYcUr20AgtC6DpW6xLAO5zZlzP/U4SUdQ2bX2wMd1YrAwc+gUivOa9ThrOG7ZdJI8OmyqeMb+To0MYLcBZuGXOQKzTU6j399YUbokQ0aA5PFrG/HAhTf5gaNyYrQ9mZI1hwnn1OkSK2v+mvKwTRiam5s7U64BWX5obLWkSG5Vi1Y9e6gFi1uNep3x3NFIFr6r/TafT+DEGdyMgHpu0V8eTVeQtCFJ7tjg5dvgkD86mBG6jtqwvvIguVIt6S3oi4cmrVAd2aKUFCYcVZeMfrA4iSKsRFtM63E8hrtCvoO0NWmyPjflsHrMM0A5Mn/a6uA98ZF/ySa7bY9MJOO0Q11HrXogNknZrdQVu4yHpU73fDwtEciiui1wprEgOIsasYG4R0De8k7UHM4xlp2P7xHZE1VKlmFyDqZyeYdyUB/3pLKAAT7fX4qKihYXFW3wac60vptm98K1aEsNE96eQVl7Ftj+8MBbStrq2GF6UgexpGntHDnkEgrPksvIsTVWG2tT7g1vZ60IVM3Cb5sypyJgnLpCF8rGaE+RoiHVbikkQl8Vj8ZzBucoz6vVVeoa01JVvXZ8NPOinuTP6Q72nH5S/d1hUGZmZkZhaenPon+HetK+pNu2wbder3dBdvvzRNBtidXybUKDz+c7WyLGSvGg9HRZ4KULHhaexTCApqRHN0xZBm75YmcfFmAkFL4pj+4Vx+fV0xVXglPKpqcN3Kusq6qYOR3l786O0cuqj9M1HWYh3TQKemaVLjuPZU0H2Uc3jJrpW5TfWNtNzDnFZn3BZzEMHxN20Y1iY8gr6jE45+/B/0rYHH0nC+Eupx0kuKblCwpSXfLAn3VzTfbW1tYetqkuJAH1J7YrxvBRK+HcuPxYIIALTUj8DVQ8Nfr21eguX2B1nHAFiHM6nSM8Hs/94m97VpdOOvm/hbH/AllSZf//gABwAAAAAElFTkSuQmCC"/>';
        return _mainPng;
    }
}



//---flavorText
contract Murasaki_Memento_flavorText is Ownable {

    // flavor texts
    string[101] private flavorTexts = [
        "",

        // Murasaki-san
        "Murasaki-san's favorite food is baked purple sweet potatoes.",
        "the birthday of the Murasaki-san is March 8th, 2021.",
        "Murasaki-san can create anything with their favorite sewing machine using coins and leaves.",
        "there are so many coins buried in the sandbox that Murasaki-san can't dig them all up.",
        "the plants in the room are mysterious trees that instantly grow when Murasaki-san water them.",
        "Murasaki-san loves being petted on the head and eagerly looks forward to being petted by a large teddy bear plush.",

        // Fluffy
        "Fluffy is the little lint that comes off sweaters or blankets, and Murasaki-san collects it as a treasure.",
        "Fluffies love Murasaki-san and dream of becoming like Murasaki-san.",
        "when Fluffy is consistently treated with care, it begins to develop a sense of self.",
        
        // Pippel
        "Pippel is a new species of flower that blooms for only a few hours a day.",
        "the flower names of the Pippel NFTs are allocated based on the birth flowers of Eastern Asia.",
        'the name "Pippel" was created by a tex generation AI.',
        
        // Nainai-san
        "Nainai-san's favorite food is konpeito.",
        "Nainai-san is a small, cheerful fairy who visits House of Murasaki-san during the Fluffy Festival.",
        "Nainai-san can produce an infinite number of flower petals from their palm.",

        // Nyuinyui-san
        "Nyuinyui-san is a slightly shy, tiny fairy who lives in the corner of the house.",
        "Nyuinyui-san's body changes to a pink color when they are happy.",
        "Nyuinyui-san's favorite food is cotton candy.",
        
        // Mogumogu-san
        "Mogumogu-san is a small mole fairy and a friend of Nyuinyui-san.",
        "Murasaki-san might meet Mogumogu-san during a stroll.",
        
        // Cat
        "The cat that has taken up residence in the house has a calm disposition and often sleeps.",
        "Murasaki-san's ear shape is just like that of a cat and very cute.",
        
        // Nui
        "Fluffy Doll is made using Fluffy as the material and hand-sewn by Murasaki-san.",
        "the Fluffy Doll blinks at night.",

        // Meta info
        '"Murasaki-san" means "Mr. Purple" in Japanese.',
        "the music played during the lights-off time is performed by the developer themselves using Kalimba.",
        "the petals of the Pippel in the NFT will grow just a little bit over time.",
        "the concept for House of Murasaki-san project was conceived on February 1, 2022.",
        
        ""

        // NG
        /*
        "on the coder's desk, there is a Murasaki-san made of wool felt.",
        "Nyuinyui-san was created on the illustrator's iPad when she feel a sense of ennui.",
        "Nainai-san is modeled after the illustrator's favorite fluffy doll.",
        "pets like Mr.Astar were drawn by the coder using a pen tablet.",
        "there are a total of 20,736 possible combinations for this POAP artwork.",
        "within this POAP artwork, there is one hidden Astar logo.",
        "the house cat is modeled after a cat that the illustrator used to live with in the past.",
        "Murasaki-san has four limbs.",
        "coder's favorite flower is the sunflower, and the illustrator's favorite flower is the tulip.",
        "House of Murasaki-san was influenced by the Rarity project created by Andre Cronje.",
        "House of Murasaki-san was influenced by the Loot project created by Dom Hofmann."
        */
    ];

    // getter
    function flavorText (uint _flavorTextId) external view returns (string memory) {
        require(_isContract(msg.sender));
        return flavorTexts[_flavorTextId];
    }

    // check msg.sender
    function _isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}



//---Done

/*

contract Murasaki_Memento_function is Ownable, Pausable, ReentrancyGuard {

    // pausable
    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }

    // address POAP
    address public address_Murasaki_Memento;
    function _set_address_Murasaki_Memento(address _address) external onlyOwner {
        address_Murasaki_Memento = _address;
    }

    // admin, withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    // max number of param
    uint public numberOfColor = 12;
    uint public numberOfMain = 6;
    uint public numberOfOhana = 6;
    uint public numberOfPippel = 5;
    uint public numberOfFluffy = 12;
    uint public numberOfFlavorText = 21;
    function _set_numberOfColor (uint _val) external onlyOwner {
        numberOfColor = _val;
    }
    function _set_numberOfMain (uint _val) external onlyOwner {
        numberOfMain = _val;
    }
    function _set_numberOfOhana (uint _val) external onlyOwner {
        numberOfOhana = _val;
    }
    function _set_numberOfPippel (uint _val) external onlyOwner {
        numberOfPippel = _val;
    }
    function _set_numberOfFluffy (uint _val) external onlyOwner {
        numberOfFluffy = _val;
    }
    function _set_numberOfFlavorText (uint _val) external onlyOwner {
        numberOfFlavorText = _val;
    }

    // mint
    function mintPOAP (string memory _userMsg) external payable nonReentrant whenNotPaused {

        // def random params
        uint _colorId = _dn(1,numberOfColor)+1;  // _dn(888,3)+1 -> 1-3
        uint _mainId = _dn(2,numberOfMain)+1;
        uint _ohanaId = _dn(3,numberOfOhana)+1;
        uint _pippelId = _dn(4,numberOfPippel)+1;
        uint _fluffyId = _dn(5,numberOfFluffy)+1;
        uint _flavorTextId = _dn(6,numberOfFlavorText)+1;
        uint _NFTSeed = _seed(7);
        
        // when emtpy, default user msg
        if (bytes(_userMsg).length == 0) {
            _userMsg = "&#x273f; House of Murasaki-san, built on Astar.";
        } else {
            require(validate_msg(_userMsg), "invalid msg");
        }
        
        Murasaki_Memento(address_Murasaki_Memento).mint(
            _colorId,
            _mainId,
            _ohanaId,
            _pippelId,
            _fluffyId,
            _NFTSeed,
            _userMsg,
            msg.sender,
            _flavorTextId
        );
    }
    
    // check msg, from rarity_names
    function validate_msg(string memory str) internal pure returns (bool){
        bytes memory b = bytes(str);
        if(b.length < 1) return false;
        if(b.length > 50) return false; // Cannot be longer than 12 characters
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

    // internal, random, salt
    uint private _salt = 0;
    function update_salt(uint _summoner) external onlyOwner {
        _salt = _dn(_summoner, 10);
    }
    function _dn(uint _summoner, uint _number) internal view returns (uint) {
        return _seed(_summoner) % _number;
    }
    function _random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
    function _seed(uint _summoner) internal view returns (uint rand) {
        rand = _random(
            string(
                abi.encodePacked(
                    block.timestamp,
                    blockhash(block.number - 1 - _salt),
                    block.coinbase,
                    _summoner,
                    msg.sender
                )
            )
        );
    }
}

*/

