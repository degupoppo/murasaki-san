// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;


//---Ownable-----------------------------------------------------------------------------------------------------

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;
    RandomDataGuard internal _rdg;
    string internal _planetsBaseURI;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _setOwner(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }
    
    function setRDG(address rdg)public virtual onlyOwner {
        _rdg = RandomDataGuard(rdg);    
    }

    function setBaseURI(string memory pBaseURI)public virtual onlyOwner {
        _planetsBaseURI = pBaseURI;    
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _setOwner(newOwner);
    }

    function _setOwner(address newOwner) private {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

interface RandomDataGuard {
    function randomGuard(uint256 random) external view returns(uint256);
}


//---Murasaki_Mail-----------------------------------------------------------------------------------------------------


contract Murasaki_Mail is Ownable {

    //address
    address public murasaki_function_address;
    function _set_murasaki_function_address(address _address) public onlyOwner {
        murasaki_function_address = _address;
    }
    
    //mapping
    mapping(address => address) public sending_from2to;     //[_summoner_from] = _summoner_to
    mapping(address => address) public sending_to2from;     //[_summoner_to] = _summoner_from
    mapping(uint32 => uint32) public last_sending_time;     //[_summoner_from] = block.time
    mapping(uint32 => uint32) public last_receving_time;    //[_summoner_to] = block.time
    
    //variants
    interval_sec = 60 * 60 * 24 * 3;    // 3 days
    
    //check mail
    function check_receving_mail(uint32 _summoner_to) public view returns (bool) {
        if (
            last_receving_time <= interval_sec 
            && sending_to2from[_summoner_to] != 0x0000000000000000000000000000000000000000
        ) {
            return true;
        } else {
            return false;
        }
    }
    
    //send mail
    function send_mail(uint32 _summoner_from, uint32 _item_mail_nft) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address):
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        //check owner
        require(mfs.check_owner(_summoner_from, msg.sender));
        //burn mail nft
        _burn_mail_nft(_item_mail_nft);
        //select _summoner_to
        uint32 _summoner_to = _select_random_summoner_to(_summoner_from);
        //update parameters
        sending_from2to[_summoner_from] = _summoner_to;
        sending_to2from[_summoner_to] = _summoner_from;
        uint32 _now = uint32(block.timestamp);
        last_sending_time[_summoner_from] = _now;
        last_receving_time[_summoner_to] = _now;
    }
    function _select_random_summoner_to(uint32 _summoner_from) internal {
        //***
    }
    function _burn_mail_nft(_item) internal {
        //***
    }
    
    //open mail
    function open_mail(uint32 _summoner_to) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        //check owner
        require(mfs.check_owner(_summoner_to, msg.sender));
        //check mail
        require(check_receving_mail);
        //get _summoner_from
        uint32 _summoner_from = sending_to2from(_summoner_to);
        //reset parameters
        sending_to2from[_summoner_to] = 0x0000000000000000000000000000000000000000;
        //mint heart
        _create_tiny_heart(_summoner_to, _summoner_from);
    }
    function _create_tiny_heart(uint32 _summoner_to, uint32 _summoner_from) internal {
        //***
    }
}
