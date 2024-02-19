
// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/utils/ERC721Holder.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/structs/EnumerableSet.sol";


interface Murasaki_Address {
    function address_Murasaki_Function_Share () external view returns (address);
    function address_Murasaki_Storage () external view returns (address);
    function address_Murasaki_Main () external view returns (address);
}
interface Murasaki_Function_Share {
    function get_summoner (address) external view returns (uint);
    function get_owner (uint) external view returns (address);
    function dn (uint, uint) external view returns (uint);
    function calc_satiety (uint) external view returns (uint);
    function calc_happy (uint) external view returns (uint);
}
interface Murasaki_Storage {
    function isActive (uint) external view returns (bool);
    function level (uint) external view returns (uint);
}
interface Murasaki_Main {
    function next_token () external view returns (uint);
}


//---PeddlerCat

contract PeddlerCat is ERC721, Ownable, Pausable, ReentrancyGuard, ERC721Holder {
    
    // setup

    //name
    constructor() ERC721("Murasaki Stray Cat", "MSC") {}

    // pausable
    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }

    // address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    // forbit user transfer, override transfer functions
    function safeTransferFrom(address, address, uint256) public pure override {
        revert();
    }
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert();
    }
    function transferFrom(address, address, uint256) public pure override {
        revert();
    }

    // modify _transfer, need token isActive
    function _beforeTokenTransfer(address, address, uint256 _tokenId, uint256) internal view override {
        require(cats[_tokenId].isActive);
    }
    
    // storage
    
    // parameters
    uint public visitingTimeLimit = 604800; // 7d
    uint public coolTime = 259200;  // 3d
    uint public limit_level = 5;
    uint public limit_happy = 30;
    uint public limit_satiety = 30;
    
    // statics
    uint public total_tradeCount;
    
    // Cat
    struct Cat {
        uint spawnTime;
        uint tradeCount;
        uint lastVisitingTime;
        bool isActive;
    }
    mapping (uint => Cat) public cats;
    uint public nextCat = 1;
    
    // NFT info
    struct NFTInfo {
        uint catId;
        uint giveTime;
        address giver;
        uint giverSummoner;
        address tokenAddress;
        uint tokenId;
        bool isKept;
        uint takeTime;
        address taker;
        uint takerSummoner;
    }
    mapping (uint => NFTInfo) public NFTInfos;
    uint public nextNFT = 1;

    // NFT enumerable set of each catId
    using EnumerableSet for EnumerableSet.UintSet;
    mapping(uint => EnumerableSet.UintSet) private catNFTs;    // catId => enuSet
    
    
    // admin

    // spawn cat
    // only admin, mint to address(this), then toToNewOwner()
    function spawnCat (address _owner) external onlyOwner {
        cats[nextCat] = Cat(
            block.timestamp,
            0,
            0,
            true
        );
        _mint(_owner, nextCat);
        nextCat++;
    }
    
    // burn cat
    function burnCat (uint _catId) external onlyOwner {
        // send to address(0)
        admin_forcedToHome(_catId, address(this));
        // forbit _transfer
        cats[_catId].isActive = false;
        cats[_catId].lastVisitingTime = 5364662400;
    }

    // forced to go home, usually to address(0)
    function admin_forcedToHome (uint _catId, address _newOwner) public onlyOwner {
        // prepare old owner
        address _oldOwner = ownerOf(_catId);
        // transfer self, using _transfer without any approval
        _transfer(_oldOwner, _newOwner, _catId);
        // update last visit time
        cats[_catId].lastVisitingTime = block.timestamp;
    }

    // admin, give NFT to the cat
    // give initial NFTs, summonerId is not required, used when the cat spawn
    function admin_giveNFT (uint _catId, address _tokenAddress, uint _tokenId) external onlyOwner {
        // transfer NFT to this
        IERC721(_tokenAddress).safeTransferFrom(msg.sender, address(this), _tokenId);
        // prepare summonerId
        uint _summoner = 0;
        // store NFT info
        NFTInfos[nextNFT] = NFTInfo(
            _catId,
            block.timestamp,
            msg.sender,
            _summoner,
            _tokenAddress,
            _tokenId,
            true,
            0,
            address(0),
            0
        );
        // update mySet
        catNFTs[_catId].add(nextNFT);
        // increment next NFT id
        nextNFT++;
    }

    // set limits
    function admin_set_visitingTimeLimit (uint _val) external onlyOwner {
        visitingTimeLimit = _val;
    }
    function admin_set_coolTimeLimit (uint _val) external onlyOwner {
        coolTime = _val;
    }
    function admin_set_limitLevel (uint _val) external onlyOwner {
        limit_level = _val;
    }
    function admin_set_limitHappy (uint _val) external onlyOwner {
        limit_happy = _val;
    }
    function admin_set_limitSatiety (uint _val) external onlyOwner {
        limit_satiety = _val;
    }
    
    // emergency, salvage ERC721 token
    /// @notice this will destroy the integrity of the database
    function admin_salvageNFT (address _tokenAddress, address _taker, uint _tokenId) external onlyOwner {
        IERC721(_tokenAddress).safeTransferFrom(address(this), _taker, _tokenId);
    }

    
    // player executable

    // give your NFT and take random NFT
    // approval of the NFT for this contract is needed
    function giveAndTakeNFT (
        uint _catId, 
        address _tokenAddress, 
        uint _tokenId
    ) external nonReentrant whenNotPaused {
    
        // check cool time
        require(_isCooled(_catId), "not cooled yet");
    
        // check ERC721 interface
        require(_isIERC721Compliant(_tokenAddress), "not ERC721 contract");
        
        // check token owned
        require(_isTokenOwned(_tokenAddress, _tokenId, msg.sender), "not owned token");

        // check token approval
        require(_isTokenApproved(_tokenAddress, _tokenId), "not approved token");

        // check msgSender
        require(_checkSender(_catId, msg.sender), "invalid sender");
        
        // first, take random NFT
        _takeNFT(_catId, msg.sender);
        
        // second, give new NFT
        _giveNFT(_catId, msg.sender, _tokenAddress, _tokenId);
        
        // third, transfer self to the new owner of summoner
        _transferSelfToNewOwner(_catId);
        
        // update param
        cats[_catId].tradeCount++;
        total_tradeCount++;
    }

    // go to the new owner when visiting time limit, anyone can execute
    function goToNewOwner (uint _catId) external nonReentrant whenNotPaused {
        // check visiting time limit
        uint _deltaSec = block.timestamp - cats[_catId].lastVisitingTime;
        require(_deltaSec >= visitingTimeLimit);
        // transfer self to new owner
        _transferSelfToNewOwner(_catId);
    }


    // viewer

    /// @dev Returns list the total number of listed summoners of the given user.
    function myListLength(uint _cadIt) public view returns (uint) {
        return catNFTs[_cadIt].length();
    }

    // call list of nft id kept by the cat
    /// @dev Returns the ids and the prices of the listed summoners of the given user.
    function myListsAt(
        uint _catId,
        uint start,
        uint count
    ) public view returns (uint[] memory rIds) {
        rIds = new uint[](count);
        for (uint idx = 0; idx < count; idx++) {
            rIds[idx] = catNFTs[_catId].at(start + idx);
        }
    }
    
    // check and call cat visiting, 0=no cat, >0=visiting catId
    function call_visitingCat (uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        address _owner = mfs.get_owner(_summoner);
        uint _catId;
        if (balanceOf(_owner) == 0) {
            _catId = 0;
        } else {
            for (uint i=1; i<nextCat; i++) {
                if (ownerOf(i) == _owner) {
                    _catId = i;
                }
            }
        }
        return _catId;
    }


    // URI

    // url
    string public baseURI = "https://murasaki-san.com/src/json/straycat/";
    string public tailURI = ".json";
    function set_baseURI(string memory _string) external onlyOwner {
        baseURI = _string;
    }
    function set_tailURI(string memory _string) external onlyOwner {
        tailURI = _string;
    }
    //override tokenURI
    function tokenURI (uint _tokenId) public view override returns (string memory) {
        return string(
            abi.encodePacked(
                baseURI,
                Strings.toString(_tokenId),
                tailURI
            )
        );
    }


    // internal functions
    
    // internal, check cool time
    function _isCooled (uint _catId) public view returns (bool) {
        return (block.timestamp - cats[_catId].lastVisitingTime > coolTime);
    }
       
    // internal, check the msg.sender, owner of summoner, owner of the cat, and is active.
    function _checkSender (uint _catId, address _sender) public view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        uint _owner_summoner = mfs.get_summoner(_sender);
        if (
            _owner_summoner != 0 &&
            ms.isActive(_owner_summoner) &&
            ownerOf(_catId) == _sender
        ) {
            return true;
        }
        return false;
    }
    
    // internal, take random NFT
    function _takeNFT (uint _catId, address _taker) public {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        // prepare summoner
        uint _takerSummoner = mfs.get_summoner(_taker);
        // choose random NFT
        uint _nftId = _get_randomNFTId(_catId);
        address _tokenAddress = NFTInfos[_nftId].tokenAddress;
        uint _tokenId = NFTInfos[_nftId].tokenId;
        // transfer NFT to the taker
        IERC721(_tokenAddress).safeTransferFrom(address(this), _taker, _tokenId);
        // update mySet
        catNFTs[_catId].remove(_nftId);
        // update NFT info
        NFTInfos[_nftId].isKept = false;
        NFTInfos[_nftId].takeTime = block.timestamp;
        NFTInfos[_nftId].taker = _taker;
        NFTInfos[_nftId].takerSummoner = _takerSummoner;
    }
    
    // internal, get random NFT info id to take
    function _get_randomNFTId (uint _catId) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        uint _rnd = mfs.dn(_catId, catNFTs[_catId].length());
        uint _nftInfoId = catNFTs[_catId].at(_rnd);
        return _nftInfoId;
    }
    
    // internal, give NFT and store info
    function _giveNFT (uint _catId, address _giver, address _tokenAddress, uint _tokenId) public {
        // transfer NFT to this
        IERC721(_tokenAddress).safeTransferFrom(_giver, address(this), _tokenId);
        // get summonerId
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        uint _summoner = mfs.get_summoner(_giver);
        // store NFT info
        NFTInfos[nextNFT] = NFTInfo(
            _catId,
            block.timestamp,
            _giver,
            _summoner,
            _tokenAddress,
            _tokenId,
            true,
            0,
            address(0),
            0
        );
        // update mySet
        catNFTs[_catId].add(nextNFT);
        // increment next NFT id
        nextNFT++;
    }
    
    // internal, transfer self to the new owner of summoner
    function _transferSelfToNewOwner (uint _catId) public {
        // prepare owners
        address _oldOwner = ownerOf(_catId);
        address _newOwner = _get_newOwner(_catId);    
        // transfer self, using _transfer without approval
        _transfer(_oldOwner, _newOwner, _catId);
        // update last visit time
        cats[_catId].lastVisitingTime = block.timestamp;
    }
    
    // internal get new owner address
    function _get_newOwner (uint _catId) public view returns (address) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        // prepare old owner of summoner
        address _oldOwner = ownerOf(_catId);
        uint _oldOwnerSummoner;
        if (_oldOwner == address(this)) {
            // when owner is this (at thome), summoner=0
            _oldOwnerSummoner = 0;
        } else {
            _oldOwnerSummoner = mfs.get_summoner(_oldOwner);
        }
        // select new owner of summoner
        uint _newOwnerSummoner = _select_random_summoner_to(_oldOwnerSummoner);
        // prepare owner address
        address _newOwner;
        if (_newOwnerSummoner == 0) {
            // when sutable summoner was not found, return to the home address
            _newOwner = address(this);
        } else {
            _newOwner = mfs.get_owner(_newOwnerSummoner);
        }
        return _newOwner;
    }
    
    // internal, ERC721 validator
    function _isIERC721Compliant(address contractAddress) public view returns (bool) {
        try IERC721(contractAddress).supportsInterface(type(IERC721).interfaceId) returns (bool isCompliant) {
            return isCompliant;
        } catch {
            return false;
        }
    }

    // internal, token own
    function _isTokenOwned (address _tokenAddress, uint _tokenId, address _owner) public view returns (bool) {
        return (IERC721(_tokenAddress).ownerOf(_tokenId) == _owner);
    }
    
    // internal, token approval checker
    function _isTokenApproved (address _tokenAddress, uint _tokenId) public view returns (bool) {
        return (IERC721(_tokenAddress).getApproved(_tokenId) == address(this));
    }
    
    // internal, select random summoner, refered to Murasaki_Mail
    function _select_random_summoner_to (uint _summoner_from) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        uint _count_summoners = mm.next_token() - 1;
        uint _summoner_to = 0;
        uint _count = 0;
        while (_count < 5) {
            uint _summoner_tmp = mfs.dn(_summoner_from + _count, _count_summoners) + 1;
            address _owner = mfs.get_owner(_summoner_tmp);
            if (
                _summoner_to == 0
                && ms.isActive(_summoner_tmp)
                && ms.level(_summoner_tmp) >= limit_level
                && mfs.calc_satiety(_summoner_tmp) >= limit_satiety
                && mfs.calc_happy(_summoner_tmp) >= limit_happy
                && _summoner_tmp != _summoner_from
                && balanceOf(_owner) == 0
            ) {
                _summoner_to = _summoner_tmp;
            }
            _count += 1;
        }
        return _summoner_to;
    }
}



