
// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol";


//---interfaces

interface Murasaki_Address {
    function address_Murasaki_Function_Share() external view returns (address);
    function address_Murasaki_Craft() external view returns (address);
    function address_Murasaki_Main() external view returns (address);
    function address_Murasaki_Storage() external view returns (address);
    function address_BufferVault() external view returns (address);
    function address_BuybackTreasury() external view returns (address);
}

interface Murasaki_Function_Share {
    function not_petrified(uint) external view returns (bool);
}

interface Murasaki_Craft {
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

interface Murasaki_Main {
    function tokenOf(address) external view returns (uint);
}

interface Murasaki_Storage {
    function isActive(uint) external view returns (bool);
}

interface BuybackTreasury {
    function calc_buybackPrice(uint) external view returns (uint);
}


//---Market

// @dev of HoM: Following codes are based on "SummonerMarket" contract 
// @dev of HoM: from Rarity game by Andre Cronje on the Fantom chain.
// @dev of HoM: Contract address on the Fantom: 0xee973c3bb8bc27a76bcdf91e6e0921cf78d8e1ff

/// @dev Summoner market to allow trading of summoners
/// @author swit.eth (@nomorebear) + nipun (@nipun_pit) + jade (@jade_arin)
contract Murasaki_Market_Item is Ownable, ReentrancyGuard, ERC721Holder {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    using EnumerableSet for EnumerableSet.UintSet;

    event List(uint indexed id, address indexed lister, uint price);
    event Unlist(uint indexed id, address indexed lister);
    event Buy(uint indexed id, address indexed seller, address indexed buyer, uint price, uint fee);
    event SetFeeBps(uint feeBps);

    //IERC721 public rarity;
    uint public feeBps = 500;
    uint public lowestPrice = 1 * 10**18;   // 1 $ASTR
    uint public dutchAuction_interval = 24 * 60 * 60;   //24 hr
    uint public dutchAuction_minimumStartPrice = 20 * 10**18;   //20 $ASTR
    EnumerableSet.UintSet private set;
    mapping(address => EnumerableSet.UintSet) private mySet;

    //mapping
    mapping(uint => uint) public prices;
    mapping(uint => address) public listers;
    mapping(uint => uint) public listedTime;
    mapping(uint => uint) public averageSoldPrice;  //per item_type
    mapping(uint => uint) public soldCount;         //per item_type
    
    // set lowestPrice
    function setLowestPrice(uint _value) external onlyOwner {
        lowestPrice = _value;
    }

    /// @dev Updates fee. Only callable by owner.
    function setFeeBps(uint _feeBps) external onlyOwner {
        feeBps = _feeBps;
        emit SetFeeBps(_feeBps);
    }
    
    //admin set variants
    function set_dutchAuction_interval (uint _value) external onlyOwner {
        dutchAuction_interval = _value;
    }
    function set_dutchAuction_minimumStartPrice (uint _value) external onlyOwner {
        dutchAuction_minimumStartPrice = _value;
    }

    /// @dev Lists the given summoner. This contract will take custody until bought / unlisted.
    function list(uint _item, uint price) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        _check_wallet(msg.sender);
        require(price > 0, 'bad price');
        require(prices[_item] == 0, 'already listed');
        require(price >= lowestPrice, 'under the lowest price');
        require(price >= _get_buybackPrice(_item));  //buyback price check
        //rarity.safeTransferFrom(msg.sender, address(this), summonerId);
        mc.safeTransferFrom(msg.sender, address(this), _item);
        prices[_item] = price;
        listers[_item] = msg.sender;
        listedTime[_item] = block.timestamp;
        set.add(_item);
        mySet[msg.sender].add(_item);
        emit List(_item, msg.sender, price);
    }
    function _get_buybackPrice (uint _item) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        BuybackTreasury bbt = BuybackTreasury(ma.address_BuybackTreasury());
        return bbt.calc_buybackPrice(_item);
    }

    /// @dev Unlists the given summoner. Must be the lister.
    function unlist(uint _item) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        _check_wallet(msg.sender);
        require(prices[_item] > 0, 'not listed');
        require(listers[_item] == msg.sender, 'not lister');
        prices[_item] = 0;
        listers[_item] = address(0);
        //rarity.safeTransferFrom(address(this), msg.sender, summonerId);
        mc.safeTransferFrom(address(this), msg.sender, _item);
        set.remove(_item);
        mySet[msg.sender].remove(_item);
        emit Unlist(_item, msg.sender);
    }

    /// @dev Buys the given summoner. Must pay the exact correct prirce.
    function buy(uint _item) external payable nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        _check_wallet(msg.sender);
        require(prices[_item] > 0, 'not listed');
        //uint price = prices[_item];
        uint price = _get_price(_item);
        require(msg.value >= price, 'bad msg.value');
        uint fee = (price * feeBps) / 10000;
        uint get = price - fee;
        address lister = listers[_item];
        prices[_item] = 0;
        listers[_item] = address(0);
        //rarity.safeTransferFrom(address(this), msg.sender, summonerId);
        mc.safeTransferFrom(address(this), msg.sender, _item);
        payable(lister).transfer(get);
        set.remove(_item);
        mySet[lister].remove(_item);
        //fee transfer
        payable(ma.address_BufferVault()).transfer(address(this).balance);
        emit Buy(_item, lister, msg.sender, price, fee);
    }
    //dutch auction
    function _get_price (uint _item) internal view returns (uint) {
        uint _minimumPrice = prices[_item];
        //uint _startPrice = 0;
        uint _deltaSec = block.timestamp - listedTime[_item];
        uint _price;
        if (_deltaSec >= dutchAuction_interval) {
            _price = _minimumPrice;
        } else {
            _price = _minimumPrice;
        }
        return _price;
    }

    //check wallet
    function _check_wallet(address _wallet) public view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        //check summoner possession
        uint _summoner = mm.tokenOf(_wallet);
        require(_summoner > 0);
        //check summoner activation
        require(ms.isActive(_summoner));
        //check summoner petrification
        require(mfs.not_petrified(_summoner));
        return true;
    }

    /// @dev Withdraw trading fees. Only called by owner.
    /*
    function withdraw(uint amount) external onlyOwner {
        payable(msg.sender).transfer(amount == 0 ? address(this).balance : amount);
    }
    */
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    /// @dev Returns list the total number of listed summoners.
    function listLength() external view returns (uint) {
        return set.length();
    }

    /// @dev Returns the ids and the prices of the listed summoners.
    function listsAt(uint start, uint count)
        external
        view
        returns (uint[] memory rIds, uint[] memory rPrices)
    {
        rIds = new uint[](count);
        rPrices = new uint[](count);
        for (uint idx = 0; idx < count; idx++) {
            rIds[idx] = set.at(start + idx);
            rPrices[idx] = prices[rIds[idx]];
        }
    }

    /// @dev Returns list the total number of listed summoners of the given user.
    function myListLength(address user) external view returns (uint) {
        return mySet[user].length();
    }

    /// @dev Returns the ids and the prices of the listed summoners of the given user.
    function myListsAt(
        address user,
        uint start,
        uint count
    ) external view returns (uint[] memory rIds, uint[] memory rPrices) {
        rIds = new uint[](count);
        rPrices = new uint[](count);
        for (uint idx = 0; idx < count; idx++) {
            rIds[idx] = mySet[user].at(start + idx);
            rPrices[idx] = prices[rIds[idx]];
        }
    }
}

