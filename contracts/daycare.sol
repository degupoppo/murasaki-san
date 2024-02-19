
// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/structs/EnumerableSet.sol";


interface Murasaki_Function_Feeding_and_Grooming {
    function feeding (uint, uint) external;
    function grooming (uint, uint) external;
}

interface Murasaki_Function_Share {
    function not_petrified (uint) external view returns (bool);
    function calc_satiety (uint) external view returns (uint);
    function calc_happy (uint) external view returns (uint);
    function call_name_from_summoner (uint) external view returns (string memory);
}

interface Murasaki_Storage {
    function isActive (uint) external view returns (bool);
    function working_status (uint) external view returns (uint);
}

interface Murasaki_Main {
    function tokenOf (address) external view returns (uint);
}

interface Murasaki_Address {
    function address_Murasaki_Function_Feeding_and_Grooming () external view returns (address);
    function address_Murasaki_Main () external view returns (address);
    function address_BufferVault () external view returns (address);
    function address_Murasaki_Function_Share () external view returns (address);
    function address_Murasaki_Storage () external view returns (address);
}


//---Daycare V3

// setup: _set_address_Murasaki_Address(0xa5026DD6ff355f2944FE1F32Ca1C29425Ab7aF75)

contract Daycare is Ownable, Pausable, ReentrancyGuard {
    
    using EnumerableSet for EnumerableSet.UintSet;

    // receivable
    receive() external payable {}
    fallback() external payable {}

    // admin, set pause
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}

    // admin, emergency withdraw
    // *CAUTION* the mapping databases will be destroyed, only in emergency
    function withdraw(address rec) public onlyOwner {payable(rec).transfer(address(this).balance);}

    // admin, prepare murasaki_address contract
    address public address_Murasaki_Address = 0xa5026DD6ff355f2944FE1F32Ca1C29425Ab7aF75;
    function _set_address_Murasaki_Address (address _address) external onlyOwner {address_Murasaki_Address = _address;}

    // admin, set price per day
    uint public PRICE_PER_ACTION = 30 * 10**16; // player cost, 0.51-0.72/24hr
    uint public FEE_PER_ACTION = 2 * 10**16;   // platform fee
    function _set_PRICE_PER_ACTION (uint _val) external onlyOwner {PRICE_PER_ACTION = _val;}
    function _set_FEE_PER_ACTION (uint _val) external onlyOwner {FEE_PER_ACTION = _val;}

    //admin, add or remove permitted_address
    mapping(address => bool) private permitted_address;
    function _add_permitted_address(address _address) external onlyOwner {permitted_address[_address] = true;}
    function _remove_permitted_address(address _address) external onlyOwner {permitted_address[_address] = false;}
    //modifier onlyPermitted {require(permitted_address[msg.sender]);_;}

    // registered counts for each summoners
    mapping (uint => uint) public registered_count;
    
    // registered summoner IDs with remining days > 0
    EnumerableSet.UintSet private registered_set;
    
    // statistic variants
    uint public total_daycare_count;
    uint public total_daycare_reward;
    
    // call set info
    // first, call the length of the set, then call listsAt() with start=0, count=length
    function call_setLength () external view whenNotPaused returns (uint) {
        return registered_set.length();
    }
    // call summoner id list
    function call_listsAt (uint start, uint count) external view whenNotPaused returns (uint[] memory _summoners) {
        _summoners = new uint[](count);
        for (uint idx = 0; idx < count; idx++) {
            _summoners[idx] = registered_set.at(start + idx);
        }
    }
    // call list of summoner id, satiety, happy, name
    function call_listsAt_withParameter (uint start, uint count) public view whenNotPaused returns (
        uint[] memory _summoners,
        uint[] memory _satieties,
        uint[] memory _happies,
        string[] memory _names,
        uint[] memory _working_statuses,
        uint[] memory _registered_count
    ) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        _summoners = new uint[](count);
        _satieties = new uint[](count);
        _happies = new uint[](count);
        _names = new string[](count);
        _working_statuses = new uint[](count);
        _registered_count = new uint[](count);
        for (uint idx = 0; idx < count;) {
            unchecked{
                _summoners[idx] = registered_set.at(start + idx);
                _satieties[idx] = mfs.calc_satiety(_summoners[idx]);
                _happies[idx] = mfs.calc_happy(_summoners[idx]);
                _names[idx] = mfs.call_name_from_summoner(_summoners[idx]);
                _working_statuses[idx] = ms.working_status(_summoners[idx]);
                _registered_count[idx] = registered_count[_summoners[idx]];
                idx++;
            }
        }
    }

    // register feeding/grooming, pay PRICE_PER_ACTION fees
    // the action count is shared in feeding and grooming
    function register (uint _summoner, uint _days) external payable nonReentrant whenNotPaused {
        require(_check_summonerAndWallet(_summoner, msg.sender));
        require(_days>0);
        require(msg.value == PRICE_PER_ACTION * _days);
        // when new summoner, add to the set
        if(registered_count[_summoner] == 0){
            registered_set.add(_summoner);
        }
        registered_count[_summoner] += _days;
    }
    function register_dev (uint _summoner, uint _days) external payable nonReentrant whenNotPaused {
        //require(_check_summonerAndWallet(_summoner, msg.sender));
        require(_days>0);
        require(msg.value == PRICE_PER_ACTION * _days);
        // when new summoner, add to the set
        if(registered_count[_summoner] == 0){
            registered_set.add(_summoner);
        }
        registered_count[_summoner] += _days;
    }

    // unregister
    function unregister (uint _summoner, uint _days) external nonReentrant whenNotPaused {
        require(_check_summonerAndWallet(_summoner, msg.sender));
        require(_days>0);
        require(registered_count[_summoner] >= _days);
        registered_count[_summoner] -= _days;
        // when days=0, remove from the set
        if(registered_count[_summoner] == 0){
            registered_set.remove(_summoner);
        }
        payable(msg.sender).transfer(_days*(PRICE_PER_ACTION));
    }

    // internal, check summonerId and msg.sender
    function _check_summonerAndWallet (uint _summoner, address _owner) internal view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        // check summoner and wallet
        bool _res;
        if (
            _summoner > 0
            && mm.tokenOf(_owner) == _summoner
            && ms.isActive(_summoner)
            && mfs.not_petrified(_summoner)
        ) {
            _res = true;
        }
        return _res;
    }
    
    // batch caring
    // arg: summoner id list
    // No check mechanism for summoners, so prechecks off-chain are needed.
    // exp efficacy = 80%
    function batch_caring (uint[] memory _summoners, uint[] memory _modes) external nonReentrant whenNotPaused {
        // only wallet possessing active SBT can emit
        require(_check_wallet(msg.sender));
        // batch grooming
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Feeding_and_Grooming mffg = Murasaki_Function_Feeding_and_Grooming(ma.address_Murasaki_Function_Feeding_and_Grooming());
        uint _count;
        for (_count=0; _count<_summoners.length;) {
            unchecked{
                uint _summoner = _summoners[_count];
                require(registered_count[_summoner]>0);
                registered_count[_summoner] -= 1;
                // when days=0, remove from the set
                if(registered_count[_summoner] == 0){
                    registered_set.add(_summoner);
                }
                if (_modes[_count] == 1) {
                    mffg.feeding(_summoner, 0);
                } else if (_modes[_count] == 2)  {
                    mffg.grooming(_summoner, 0);
                }
                _count++;
            }
        }
        // update variants
        total_daycare_count += _count;
        total_daycare_reward += _count * (PRICE_PER_ACTION - FEE_PER_ACTION);
        // transfer platform fee and get the rest for the daycare reward
        payable(ma.address_BufferVault()).transfer(_count*FEE_PER_ACTION);
        payable(msg.sender).transfer(_count*(PRICE_PER_ACTION - FEE_PER_ACTION));
    }

    // internal, check if the wallet possess active summoner SBT
    function _check_wallet (address _wallet) internal view returns (bool) {
        // exception: check the permitted address
        // used for the public botter address
        if (permitted_address[_wallet]) {
            return true;
        }
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        uint _summoner = mm.tokenOf(_wallet);
        bool _res;
        if (
            _summoner > 0
            && ms.isActive(_summoner)
            && mfs.not_petrified(_summoner)
        ) {
            _res = true;
        }
        return _res;
    }
}

