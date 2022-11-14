
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


//===ToDo==================================================================================================================


/*

    buybackTreajuryの改善
        active userの増減によってはbuyback -> bufferへと移動させることも必要になる
        active user数を取得した上でインフレ率を計算するよう修正する
        手順としては：
            インフレ率を手動で設定
            脱落ユーザー数を手動で集計して設定
            インフレ率に基づいて、buybackTreajury <-> BufferTreajuryの資金移動を行う
                これはコントラクトコードで実装する
            続く処理でbufferTreajuryに残った資金はteamTreajuryへと移動する
*/


//===Basic==================================================================================================================


import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/Base64.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol";
import "github.com/AstarNetwork/astarbase/contract/example/IAstarBase.sol";


//---IERC2665

// @dev of HoM: ERC-2665
// @dev of HoM: https://github.com/ethereum/EIPs/issues/2665

/// @title ERC-2665 NFT Transfer Fee Extension
/// @dev See https://github.com/ethereum/EIPs/issues/2665
///  Note: the ERC-165 identifier for this interface is 0x509ffea4.
///  Note: you must also implement the ERC-165 identifier of ERC-721, which is 0x80ac58cd.
interface IERC2665 /* is ERC165, is ERC721 but overide it's Design by contract specifications */ {
    /// @dev This emits when ownership of any NFT changes by any mechanism.
    ///  This event emits when NFTs are created (`from` == 0) and destroyed
    ///  (`to` == 0). Exception: during contract creation, any number of NFTs
    ///  may be created and assigned without emitting Transfer. At the time of
    ///  any transfer, the approved address for that NFT (if any) is reset to none.
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    /// @dev This emits when the approved address for an NFT is changed or
    ///  reaffirmed. The zero address indicates there is no approved address.
    ///  When a Transfer event emits, this also indicates that the approved
    ///  address for that NFT (if any) is reset to none.
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    /// @dev This emits when an operator is enabled or disabled for an owner.
    ///  The operator can manage all NFTs of the owner.
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to the zero address are considered invalid, and this
    ///  function throws for queries about the zero address.
    /// @param _owner An address for whom to query the balance
    /// @return The number of NFTs owned by `_owner`, possibly zero
    function balanceOf(address _owner) external view returns (uint256);

    /// @notice Find the owner of an NFT
    /// @dev NFTs assigned to zero address are considered invalid, and queries
    ///  about them do throw.
    /// @param _tokenId The identifier for an NFT
    /// @return The address of the owner of the NFT
    function ownerOf(uint256 _tokenId) external view returns (address);

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `msg.value` < `getTransferFee(_tokenId)`.
    ///  If the fee is not to be paid in ETH, then token publishers SHOULD provide a way to pay the
    ///  fee when calling this function or it's overloads, and throwing if said fee is not paid.
    ///  Throws if `_to` is the zero address. Throws if `_tokenId` is not a valid NFT.
    ///  When transfer is complete, this function checks if `_to` is a smart
    ///  contract (code size > 0). If so, it calls `onERC2665Received` on `_to`
    ///  and throws if the return value is not
    ///  `bytes4(keccak256("onERC2665Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata data) external payable;

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to "".
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. Throws if `msg.value` < `getTransferFee(_tokenId)`.
    ///  If the fee is not to be paid in ETH, then token publishers SHOULD provide a way to pay the
    ///  fee when calling this function and throw if said fee is not paid.
    ///  Throws if `_to` is the zero address. Throws if `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner. After a successful call and if
    ///  `msg.value == getTransferFee(_tokenId)`, then a subsequent atomic call to
    ///  `getTransferFee(_tokenId)` would eval to 0. If the fee is not to be paid in ETH,
    ///  then token publishers MUST provide a way to pay the fee when calling this function,
    ///  and throw if the fee is not paid.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external payable;

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external;

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT.
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external view returns (address);

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);

    /// @notice Query what is the transfer fee for a specific token
    /// @dev If a call would returns 0, then any subsequent calls witht the same argument
    /// must also return 0 until the Transfer event has been emitted.
    /// @param _tokenId The NFT to find the Transfer Fee amount for
    /// @return The amount of Wei that need to be sent along a call to a transfer function
    function getTransferFee(uint256 _tokenId) external view returns (uint256);

    /// @notice Query what is the transfer fee for a specific token if the fee is to be paid
    /// @dev If a call would returns 0, then any subsequent calls with the same arguments
    /// must also return 0 until the Transfer event has been emitted. If _currencySymbol == 'ETH',
    /// then this function must return the same result as if `getTransferFee(uint256 _tokenId)` was called.
    /// @param _tokenId The NFT to find the Transfer Fee amount for
    /// @param _currencySymbol The currency in which the fee is to be paid
    /// @return The amount of Currency that need to be sent along a call to a transfer function
    function getTransferFee(uint256 _tokenId, string calldata _currencySymbol) external view returns (uint256);
}


//---ERC2665

// @dev of HoM: ERC2665 is ERC721 but added payable modifier at transfer functions
// @dev of HoM: Following ERC721 codes are based on https://github.com/andrecronje/rarity

contract ERC2665 is IERC2665 {
    using Strings for uint256;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    
	// name
	string private _name;
	string private _symbol;
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }
	function name() public view virtual returns (string memory) {
		return _name;
	}
	function symbol() public view virtual returns (string memory) {
		return _symbol;
	}

    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _balances[owner];
    }
    
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
    
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }
    
    function approve(address to, uint256 tokenId) public virtual override payable {
        address owner = ERC2665.ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }
    
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }
    
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != msg.sender, "ERC721: approve to caller");

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    function _isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
    
    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }
    
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override payable {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override payable {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override payable {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `_data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC2665.ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    /**
     * @dev Safely mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        _mint(to, tokenId);
        require(
            _checkOnERC721Received(address(0), to, tokenId, _data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual {
        address owner = ERC2665.ownerOf(tokenId);

        _beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        _approve(address(0), tokenId);

        _balances[owner] -= 1;
        delete _owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(ERC2665.ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits a {Approval} event.
     */
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ERC2665.ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (_isContract(to)) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver(to).onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {}

    //added to match the interface
    //function getTransferFee(uint256 _tokenId) external view virtual returns (uint256) {
    function getTransferFee(uint256) external view virtual returns (uint256) {
        return 0;
    }

    //function getTransferFee(uint256 _tokenId, string calldata _currencySymbol) external view virtual returns (uint256) {
    function getTransferFee(uint256, string calldata) external view virtual returns (uint256) {
        return 0;
    }
}


//---SoulBoundBadge

// @dev of HoM: SBB is ERC721 but non-transferable, only one per wallet, burnable

abstract contract SoulBoundBadge is ERC721 {
    
    // tokens and tokenOf getter
    mapping(address => uint32) private _tokens;
    function tokenOf(address _owner) public view returns (uint32) {
        require(_owner != address(0));
        return _tokens[_owner];
    }

    // next_token
    uint32 public next_token = 1;
    
    // non-transferable
    function _beforeTokenTransfer(address from, address to, uint256, uint256) internal pure override {
        require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
    }
    
    // only one per wallet, burnable
    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256) internal override {
        // when mint
        if ( from == address(0) ) {
            require(_tokens[to] == 0, "Owner already has a token");
            _tokens[to] = uint32(tokenId);
            next_token++;
        // when burn
        } else if ( to == address(0) ) {
            _tokens[from] = 0;
        }
    }
}


//===NTT/NFT==================================================================================================================


//---Murasaki_Main


//ERC721, SBT
//https://docs.chainstack.com/tutorials/gnosis/simple-soulbound-token-with-remix-and-openzeppelin#create-and-compile-the-soulbound-contract
contract Murasaki_Main is SoulBoundBadge, Ownable{

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }

    //admin pause
    bool notPaused = false;
    function _set_notPaused(bool _bool) external onlyOwner {
        notPaused = _bool;
    }

    //names
    constructor() ERC721("House of Murasaki-san", "HoM") {}

    //summoner info
    mapping(uint => uint) public class;
    mapping(uint => uint) public summoned_time;
    mapping(uint => uint) public seed;

    //summon
    function summon(address _owner, uint _class, uint _seed) external {
        require(permitted_address[msg.sender] == true);
        //update summoner info
        uint _now = block.timestamp;
        class[next_token] = _class;
        summoned_time[next_token] = _now;
        seed[next_token] = _seed;
        //mint
        _safeMint(_owner, next_token);
    }

    //burn
    function burn(uint _summoner) external {
        require(permitted_address[msg.sender] == true);
        ERC721._burn(_summoner);
    }

    //URI
    //Inspired by OraclizeAPI's implementation - MIT license
    //https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
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
    function tokenURI (uint _summoner) public view override returns (string memory) {
        string[9] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';
        parts[1] = string(abi.encodePacked("id", " ", toString(_summoner)));
        parts[2] = '</text><text x="10" y="40" class="base">';
        parts[3] = string(abi.encodePacked("class", " ", toString(class[_summoner])));
        parts[4] = '</text><text x="10" y="60" class="base">';
        parts[5] = string(abi.encodePacked("summoned time", " ", toString(summoned_time[_summoner])));
        parts[6] = '</text></svg>';
        string memory output = 
            string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "summoner #', toString(_summoner), '", "description": "House of Murasaki-san. Murasaki-san is a pet living in your wallet. They grow with your dedication. https://murasaki-san.com/", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }
}


//---Murasaki_Name


contract Murasaki_Name is SoulBoundBadge, Ownable {

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }
    
    //admin, overwrite name
    function update_name(uint _name_id, string memory _name_str) external onlyOwner {
        names[_name_id] = _name_str;
    }

    //names
    constructor() ERC721("Murasaki Name", "MN") {}

    //token info
    mapping(uint => string) public names;
    mapping(uint => uint) public minted_time;
    mapping(uint => uint) public seed;
    
    //name info
    mapping(string => bool) public isMinted;

    //mint
    function mint(address _owner, string memory _name_str, uint _seed) external {
        require(permitted_address[msg.sender] == true);
        names[next_token] = _name_str;
        uint _now = block.timestamp;
        minted_time[next_token] = _now;
        seed[next_token] = _seed;
        //mint
        isMinted[_name_str] = true;
        _safeMint(_owner, next_token);
    }

    //burn
    function burn(uint _name_id) external {
        require(permitted_address[msg.sender] == true);
        string memory _name_str = names[_name_id];
        isMinted[_name_str] = false;
        ERC721._burn(_name_id);
    }
}


/*
//---Murasaki_Craft


contract Murasaki_Craft is ERC721, Ownable{

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    using EnumerableSet for EnumerableSet.UintSet;
    mapping(address => EnumerableSet.UintSet) private mySet;

    //name
    constructor() ERC721("Murasaki Craft", "MC") {}

    //global variants
    uint public next_item = 1;
    struct item {
        uint item_type;
        uint crafted_time;
        uint crafted_summoner;
        address crafted_wallet;
        string memo;
    }
    mapping(uint256 => item) public items;
    mapping(address => uint[256]) public balance_of_type;
    mapping(uint => uint) public seed;
    mapping(uint => uint) public count_of_mint; //item_type => count_of_mint

    //override ERC721 transfer, 
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        ERC721._transfer(from, to, tokenId);
        uint _item_type = items[tokenId].item_type;
        balance_of_type[from][_item_type] -= 1;
        balance_of_type[to][_item_type] += 1;
        mySet[from].remove(tokenId);
        mySet[to].add(tokenId);
    }

    //override ERC721 burn
    function _burn(uint256 tokenId) internal virtual override {
        uint _item_type = items[tokenId].item_type;
        address _owner = ERC721.ownerOf(tokenId);
        balance_of_type[_owner][_item_type] -= 1;
        mySet[_owner].remove(tokenId);
        //ERC721._burn(tokenId);
        ERC721._transfer(_owner, address(this), tokenId);
    }

    //burn
    function burn(uint256 tokenId) external {
        require(permitted_address[msg.sender] == true);
        _burn(tokenId);
    }

    //craft
    function craft(
        uint _item_type, 
        uint _summoner, 
        address _wallet, 
        uint _seed, 
        string memory _memo
    ) external {
        //require(msg.sender == murasaki_function_address);
        require(permitted_address[msg.sender] == true);
        uint _now = block.timestamp;
        uint _crafting_item = next_item;
        items[_crafting_item] = item(_item_type, _now, _summoner, _wallet, _memo);
        balance_of_type[_wallet][_item_type] += 1;  //balanceOf each item type
        count_of_mint[_item_type]++;
        seed[_crafting_item] = _seed;
        mySet[_wallet].add(_crafting_item);
        next_item++;
        _safeMint(_wallet, _crafting_item);
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
    ) external view returns (uint[] memory rIds) {
        rIds = new uint[](count);
        for (uint idx = 0; idx < count; idx++) {
            rIds[idx] = mySet[user].at(start + idx);
        }
    }

    /// @dev Returns the ids and the prices of the listed summoners of the given user.
    function myListsAt_withItemType(
        address user,
        uint start,
        uint count
    ) external view returns (uint[] memory rIds) {
        rIds = new uint[](count*2);
        for (uint idx = 0; idx < count; idx++) {
            uint _id = mySet[user].at(start + idx);
            rIds[idx*2] = _id;
            item memory _item = items[_id];
            rIds[idx*2+1] = _item.item_type;
        }
    }

    //URI
    //Inspired by OraclizeAPI's implementation - MIT license
    //https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
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
    function tokenURI (uint _item) public view override returns (string memory) {
        string[9] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';
        parts[1] = string(abi.encodePacked("id", " ", toString(_item)));
        parts[2] = '</text><text x="10" y="40" class="base">';
        parts[3] = string(abi.encodePacked("type", " ", toString(items[_item].item_type)));
        parts[4] = '</text><text x="10" y="60" class="base">';
        parts[5] = string(abi.encodePacked("crafted time", " ", toString(items[_item].crafted_time)));
        parts[6] = '</text><text x="10" y="80" class="base">';
        parts[7] = string(abi.encodePacked("crafted summoner", " ", toString(items[_item].crafted_summoner)));
        parts[8] = '</text></svg>';
        string memory output = 
            string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8]));
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "summoner #', toString(_item), '", "description": "House of Murasaki-san. Murasaki-san is a pet living in your wallet. They grow with your dedication. https://murasaki-san.com/", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }

    //call items as array, need to write in Craft contract
    function get_balance_of_type(address _wallet) public view returns (uint[256] memory) {
        return balance_of_type[_wallet];
    }
}
*/


//---Murasaki_Craft_ERC2665


contract Murasaki_Craft is ERC2665, Ownable{

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    using EnumerableSet for EnumerableSet.UintSet;
    mapping(address => EnumerableSet.UintSet) private mySet;

    //name
    constructor() ERC2665("Murasaki Craft", "MC") {}

    //global variants
    uint public next_item = 1;
    struct item {
        uint item_type;
        uint crafted_time;
        uint crafted_summoner;
        address crafted_wallet;
        string memo;
    }
    mapping(uint => item) public items;
    mapping(address => uint[256]) public balance_of_type;
    mapping(uint => uint) public seed;
    mapping(uint => uint) public count_of_mint; //item_type => count_of_mint

    //override ERC721 transfer, 
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        ERC2665._transfer(from, to, tokenId);
        uint _item_type = items[tokenId].item_type;
        balance_of_type[from][_item_type] -= 1;
        balance_of_type[to][_item_type] += 1;
        mySet[from].remove(tokenId);
        mySet[to].add(tokenId);
    }

    //override ERC721 burn
    function _burn(uint256 tokenId) internal virtual override {
        uint _item_type = items[tokenId].item_type;
        address _owner = ERC2665.ownerOf(tokenId);
        balance_of_type[_owner][_item_type] -= 1;
        mySet[_owner].remove(tokenId);
        //ERC721._burn(tokenId);
        ERC2665._transfer(_owner, address(this), tokenId);
    }

    //burn
    function burn(uint256 tokenId) external {
        require(permitted_address[msg.sender] == true);
        _burn(tokenId);
    }

    //craft
    function craft(
        uint _item_type, 
        uint _summoner, 
        address _wallet, 
        uint _seed, 
        string memory _memo
    ) external {
        require(permitted_address[msg.sender] == true);
        uint _now = block.timestamp;
        uint _crafting_item = next_item;
        items[_crafting_item] = item(_item_type, _now, _summoner, _wallet, _memo);
        balance_of_type[_wallet][_item_type] += 1;  //balanceOf each item type
        count_of_mint[_item_type]++;
        seed[_crafting_item] = _seed;
        mySet[_wallet].add(_crafting_item);
        next_item++;
        _safeMint(_wallet, _crafting_item);
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
    ) external view returns (uint[] memory rIds) {
        rIds = new uint[](count);
        for (uint idx = 0; idx < count; idx++) {
            rIds[idx] = mySet[user].at(start + idx);
        }
    }

    /// @dev Returns the ids and the prices of the listed summoners of the given user.
    function myListsAt_withItemType(
        address user,
        uint start,
        uint count
    ) external view returns (uint[] memory rIds) {
        rIds = new uint[](count*2);
        for (uint idx = 0; idx < count; idx++) {
            uint _id = mySet[user].at(start + idx);
            rIds[idx*2] = _id;
            item memory _item = items[_id];
            rIds[idx*2+1] = _item.item_type;
        }
    }

    //URI
    //Inspired by OraclizeAPI's implementation - MIT license
    //https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
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
    function tokenURI (uint _item) public view returns (string memory) {
        string[9] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';
        parts[1] = string(abi.encodePacked("id", " ", toString(_item)));
        parts[2] = '</text><text x="10" y="40" class="base">';
        parts[3] = string(abi.encodePacked("type", " ", toString(items[_item].item_type)));
        parts[4] = '</text><text x="10" y="60" class="base">';
        parts[5] = string(abi.encodePacked("crafted time", " ", toString(items[_item].crafted_time)));
        parts[6] = '</text><text x="10" y="80" class="base">';
        parts[7] = string(abi.encodePacked("crafted summoner", " ", toString(items[_item].crafted_summoner)));
        parts[8] = '</text></svg>';
        string memory output = 
            string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8]));
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "summoner #', toString(_item), '", "description": "House of Murasaki-san. Murasaki-san is a pet living in your wallet. They grow with your dedication. https://murasaki-san.com/", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }

    //call items as array, need to write in Craft contract
    function get_balance_of_type(address _wallet) public view returns (uint[256] memory) {
        return balance_of_type[_wallet];
    }

    // Transfer fees
    
    //noFee address
    mapping(address => bool) private noFee_address;
    
    //set transfer fee
    uint public TRANSFER_FEE = 10;   //ether
    
    //a wallet collecting fees
    address private bufferTreasury_address;
    
    //admin
    function _add_noFee_address(address _address) external onlyOwner {
        noFee_address[_address] = true;
    }
    function _remove_noFee_address(address _address) external onlyOwner {
        noFee_address[_address] = false;
    }
    function _set_transfer_fee(uint _value) external onlyOwner {
        TRANSFER_FEE = _value;
    }
    function _set_bufferTreasury_address(address _address) external onlyOwner {
        bufferTreasury_address = _address;
    }
    
    //override interface IERC2665
    //function getTransferFee(uint256 _tokenId) external view override returns (uint256) {
    function getTransferFee(uint256) external view override returns (uint256) {
        return TRANSFER_FEE;
    }
    //function getTransferFee(uint256 _tokenId, string calldata _currencySymbol) external view override returns (uint256) {
    function getTransferFee(uint256, string calldata) external view override returns (uint256) {
        return TRANSFER_FEE;
    }
    
    //override transfer functions
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override payable {
        //added code, when not noFee address, require transfer fee
        if (noFee_address[from] == false && noFee_address[to] == false) {
            require(msg.value >= TRANSFER_FEE * 10**18);
            payable(bufferTreasury_address).transfer(address(this).balance);
        }
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override payable {
        if (noFee_address[from] == false && noFee_address[to] == false) {
            require(msg.value >= TRANSFER_FEE * 10**18);
            payable(bufferTreasury_address).transfer(address(this).balance);
        }
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override payable {
        if (noFee_address[from] == false && noFee_address[to] == false) {
            require(msg.value >= TRANSFER_FEE * 10**18);
            payable(bufferTreasury_address).transfer(address(this).balance);
        }
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }
    
    //admin, using convertion, convert item info from old contract
    function _admin_craft_convert(
        uint _item_type, 
        uint _summoner, 
        address _wallet, 
        uint _seed, 
        string memory _memo,
        uint _item_id,
        uint _crafted_time
    ) external {
        require(permitted_address[msg.sender] == true);
        //uint32 _now = uint32(block.timestamp);
        //uint32 _crafting_item = next_item;
        //items[_crafting_item] = item(_item_type, _now, _summoner, _wallet, _memo);
        items[_item_id] = item(_item_type, _crafted_time, _summoner, _wallet, _memo);
        balance_of_type[_wallet][_item_type] += 1;  //balanceOf each item type
        count_of_mint[_item_type]++;
        seed[_item_id] = _seed;
        mySet[_wallet].add(_item_id);
        //next_item++;
        _safeMint(_wallet, _item_id);
    }
    
    //admin, using convertion, set next_item
    function _admin_set_next_item (uint _next_item) external {
        require(permitted_address[msg.sender] == true);
        next_item = _next_item;
    }
}


//===Storage==================================================================================================================


//---Murasaki_Parameter


contract Murasaki_Parameter is Ownable {

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }

    //global variants
    bool public isPaused = true;
    uint public BASE_SEC = 86400;
    uint public SPEED = 1000; //100=100%
    uint public PRICE = 200;    //uin32, ether, need to recalc 10**18 in methods
    uint public DAY_PETRIFIED = 30;
    uint public STAKING_REWARD_SEC = 2592000; //30 days
    uint public ELECTED_FLUFFY_TYPE = 0;
    string public DEVELOPER_SUMMONER_NAME = "*Fluffy Kingdom*";
    uint public EXP_FROM_PRESENTBOX = 50;

    //modifier
    modifier onlyPermitted {
        require(permitted_address[msg.sender]);
        _;
    }

    //admin, set global variants
    function _set_isPaused(bool _bool) external onlyPermitted {
        isPaused = _bool;
    }
    function _set_base_sec(uint _base_sec) external onlyPermitted {
        BASE_SEC = _base_sec;
    }
    function _set_speed(uint _speed) external onlyPermitted {
        SPEED = _speed;
    }
    function _set_price(uint _price) external onlyPermitted {
        PRICE = _price;
    }
    function _set_day_petrified(uint _day_petrified) external onlyPermitted {
        DAY_PETRIFIED = _day_petrified;
    }
    function _set_elected_fluffy_type(uint _value) external onlyPermitted {
        ELECTED_FLUFFY_TYPE = _value;
    }
    function _set_developer_summoner_name(string memory _string) external onlyPermitted {
        DEVELOPER_SUMMONER_NAME = _string;
    }
    function _set_exp_from_presentbox(uint _value) external onlyPermitted {
        EXP_FROM_PRESENTBOX = _value;
    }
}


//---Murasaki_Storage


contract Murasaki_Storage is Ownable {

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }

    //status
    mapping(uint => uint) public level;
    mapping(uint => uint) public exp;
    mapping(uint => uint) public strength;
    mapping(uint => uint) public dexterity;
    mapping(uint => uint) public intelligence;
    mapping(uint => uint) public luck;
    mapping(uint => uint) public next_exp_required;
    mapping(uint => uint) public last_level_up_time;

    //resouse
    mapping(uint => uint) public coin;
    mapping(uint => uint) public material;

    //treating
    mapping(uint => uint) public last_feeding_time;
    mapping(uint => uint) public last_grooming_time;

    //working
    mapping(uint => uint) public mining_status;
    mapping(uint => uint) public mining_start_time;
    mapping(uint => uint) public farming_status;
    mapping(uint => uint) public farming_start_time;
    mapping(uint => uint) public crafting_status;
    mapping(uint => uint) public crafting_start_time;
    mapping(uint => uint) public crafting_item_type;
    mapping(uint => uint) public total_mining_sec;
    mapping(uint => uint) public total_farming_sec;
    mapping(uint => uint) public total_crafting_sec;
    mapping(uint => uint) public last_total_mining_sec;
    mapping(uint => uint) public last_total_farming_sec;
    mapping(uint => uint) public last_total_crafting_sec;
    mapping(uint => uint) public last_grooming_time_plus_working_time;

    //active or disable, initial default value = false, using burn
    mapping(uint => bool) public isActive;
    
    //inHouse
    mapping(uint => bool) public inHouse;
    
    //staking reward counter
    mapping(uint => uint) public staking_reward_counter;
    mapping(uint => uint) public total_staking_reward_counter;
    
    //crafting resume
    mapping(uint => uint) public crafting_resume_flag;
    mapping(uint => uint) public crafting_resume_item_type;
    mapping(uint => uint) public crafting_resume_item_dc;

    //modifier
    modifier onlyPermitted {
        require(permitted_address[msg.sender]);
        _;
    }

    //set status
    function set_level(uint _summoner, uint _value) external onlyPermitted {
        level[_summoner] = _value;
    }
    function set_exp(uint _summoner, uint _value) external onlyPermitted {
        exp[_summoner] = _value;
    }
    function set_strength(uint _summoner, uint _value) external onlyPermitted {
        strength[_summoner] = _value;
    }
    function set_dexterity(uint _summoner, uint _value) external onlyPermitted {
        dexterity[_summoner] = _value;
    }
    function set_intelligence(uint _summoner, uint _value) external onlyPermitted {
        intelligence[_summoner] = _value;
    }
    function set_luck(uint _summoner, uint _value) external onlyPermitted {
        luck[_summoner] = _value;
    }
    function set_next_exp_required(uint _summoner, uint _value) external onlyPermitted {
        next_exp_required[_summoner] = _value;
    }
    function set_last_level_up_time(uint _summoner, uint _value) external onlyPermitted {
        last_level_up_time[_summoner] = _value;
    }
    function set_coin(uint _summoner, uint _value) external onlyPermitted {
        coin[_summoner] = _value;
    }
    function set_material(uint _summoner, uint _value) external onlyPermitted {
        material[_summoner] = _value;
    }
    function set_last_feeding_time(uint _summoner, uint _value) external onlyPermitted {
        last_feeding_time[_summoner] = _value;
    }
    function set_last_grooming_time(uint _summoner, uint _value) external onlyPermitted {
        last_grooming_time[_summoner] = _value;
    }
    function set_mining_status(uint _summoner, uint _value) external onlyPermitted {
        mining_status[_summoner] = _value;
    }
    function set_mining_start_time(uint _summoner, uint _value) external onlyPermitted {
        mining_start_time[_summoner] = _value;
    }
    function set_farming_status(uint _summoner, uint _value) external onlyPermitted {
        farming_status[_summoner] = _value;
    }
    function set_farming_start_time(uint _summoner, uint _value) external onlyPermitted {
        farming_start_time[_summoner] = _value;
    }
    function set_crafting_status(uint _summoner, uint _value) external onlyPermitted {
        crafting_status[_summoner] = _value;
    }
    function set_crafting_start_time(uint _summoner, uint _value) external onlyPermitted {
        crafting_start_time[_summoner] = _value;
    }
    function set_crafting_item_type(uint _summoner, uint _value) external onlyPermitted {
        crafting_item_type[_summoner] = _value;
    }
    function set_total_mining_sec(uint _summoner, uint _value) external onlyPermitted {
        total_mining_sec[_summoner] = _value;
    }
    function set_total_farming_sec(uint _summoner, uint _value) external onlyPermitted {
        total_farming_sec[_summoner] = _value;
    }
    function set_total_crafting_sec(uint _summoner, uint _value) external onlyPermitted {
        total_crafting_sec[_summoner] = _value;
    }
    function set_last_total_mining_sec(uint _summoner, uint _value) external onlyPermitted {
        last_total_mining_sec[_summoner] = _value;
    }
    function set_last_total_farming_sec(uint _summoner, uint _value) external onlyPermitted {
        last_total_farming_sec[_summoner] = _value;
    }
    function set_last_total_crafting_sec(uint _summoner, uint _value) external onlyPermitted {
        last_total_crafting_sec[_summoner] = _value;
    }
    function set_last_grooming_time_plus_working_time(uint _summoner, uint _value) external onlyPermitted {
        last_grooming_time_plus_working_time[_summoner] = _value;
    }
    function set_isActive(uint _summoner, bool _bool) external onlyPermitted {
        isActive[_summoner] = _bool;
    }
    function set_inHouse(uint _summoner, bool _bool) external onlyPermitted {
        inHouse[_summoner] = _bool;
    }
    function set_staking_reward_counter(uint _summoner, uint _value) external onlyPermitted {
        staking_reward_counter[_summoner] = _value;
    }
    function set_total_staking_reward_counter(uint _summoner, uint _value) external onlyPermitted {
        total_staking_reward_counter[_summoner] = _value;
    }
    function set_crafting_resume_flag(uint _summoner, uint _value) external onlyPermitted {
        crafting_resume_flag[_summoner] = _value;
    }
    function set_crafting_resume_item_type(uint _summoner, uint _value) external onlyPermitted {
        crafting_resume_item_type[_summoner] = _value;
    }
    function set_crafting_resume_item_dc(uint _summoner, uint _value) external onlyPermitted {
        crafting_resume_item_dc[_summoner] = _value;
    }
}


//---Murasaki_Storage_Score


contract Murasaki_Storage_Score is Ownable {

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }

    //status
    mapping(uint => uint) public total_exp_gained;
    mapping(uint => uint) public total_coin_mined;
    mapping(uint => uint) public total_material_farmed;
    mapping(uint => uint) public total_item_crafted;
    mapping(uint => uint) public total_precious_received;

    //modifier
    modifier onlyPermitted {
        require(permitted_address[msg.sender]);
        _;
    }

    //set status
    function set_total_exp_gained(uint _summoner, uint _value) external onlyPermitted {
        total_exp_gained[_summoner] = _value;
    }
    function set_total_coin_mined(uint _summoner, uint _value) external onlyPermitted {
        total_coin_mined[_summoner] = _value;
    }
    function set_total_material_farmed(uint _summoner, uint _value) external onlyPermitted {
        total_material_farmed[_summoner] = _value;
    }
    function set_total_item_crafted(uint _summoner, uint _value) external onlyPermitted {
        total_item_crafted[_summoner] = _value;
    }
    function set_total_precious_received(uint _summoner, uint _value) external onlyPermitted {
        total_precious_received[_summoner] = _value;
    }
}


//---Murasaki_Storage_Nui


contract Murasaki_Storage_Nui is Ownable {

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }
    
    //status of nui
    mapping(uint => uint) public mint_time;
    mapping(uint => uint) public summoner;
    mapping(uint => uint) public class;
    mapping(uint => uint) public level;
    mapping(uint => uint) public strength;
    mapping(uint => uint) public dexterity;
    mapping(uint => uint) public intelligence;
    mapping(uint => uint) public luck;
    mapping(uint => uint) public total_exp_gained;
    mapping(uint => uint) public total_coin_mined;
    mapping(uint => uint) public total_material_farmed;
    mapping(uint => uint) public total_item_crafted;
    mapping(uint => uint) public total_precious_received;
    mapping(uint => uint) public score;

    //modifier
    modifier onlyPermitted {
        require(permitted_address[msg.sender]);
        _;
    }

    //set status
    function set_mint_time(uint _item_nui, uint _value) external onlyPermitted {
        mint_time[_item_nui] = _value;
    }
    function set_summoner(uint _item_nui, uint _value) external onlyPermitted {
        summoner[_item_nui] = _value;
    }
    function set_class(uint _item_nui, uint _value) external onlyPermitted {
        class[_item_nui] = _value;
    }
    function set_level(uint _item_nui, uint _value) external onlyPermitted {
        level[_item_nui] = _value;
    }
    function set_strength(uint _item_nui, uint _value) external onlyPermitted {
        strength[_item_nui] = _value;
    }
    function set_dexterity(uint _item_nui, uint _value) external onlyPermitted {
        dexterity[_item_nui] = _value;
    }
    function set_intelligence(uint _item_nui, uint _value) external onlyPermitted {
        intelligence[_item_nui] = _value;
    }
    function set_luck(uint _item_nui, uint _value) external onlyPermitted {
        luck[_item_nui] = _value;
    }
    function set_total_exp_gained(uint _item_nui, uint _value) external onlyPermitted {
        total_exp_gained[_item_nui] = _value;
    }
    function set_total_coin_mined(uint _item_nui, uint _value) external onlyPermitted {
        total_coin_mined[_item_nui] = _value;
    }
    function set_total_material_farmed(uint _item_nui, uint _value) external onlyPermitted {
        total_material_farmed[_item_nui] = _value;
    }
    function set_total_item_crafted(uint _item_nui, uint _value) external onlyPermitted {
        total_item_crafted[_item_nui] = _value;
    }
    function set_total_precious_received(uint _item_nui, uint _value) external onlyPermitted {
        total_precious_received[_item_nui] = _value;
    }
    function set_score(uint _item_nui, uint _value) external onlyPermitted {
        score[_item_nui] = _value;
    }
}


//===Function==================================================================================================================


//---Share


contract Murasaki_Function_Share is Ownable {

    //address
    address public murasaki_main_address;
    address public murasaki_storage_address;
    address public murasaki_craft_address;
    address public world_dice_address;
    address public murasaki_name_address;
    address public murasaki_storage_score_address;
    address public murasaki_mail_address;
    address public murasaki_storage_nui_address;
    address public astarbase_address;
    address public bufferTreasury_address;
    address public buybackTreasury_address;
    address public teamTreasury_address;
    address public murasaki_lootlike_address;
    address public murasaki_parameter_address;
    
    //salt
    uint private _salt = 0;
    function _update_salt(uint _summoner) external onlyOwner {
        _salt = dn(_summoner, 10);
    }

    //address set, admin
    function _set1_murasaki_main_address(address _address) external onlyOwner {
        murasaki_main_address = _address;
    }
    function _set2_murasaki_storage_address(address _address) external onlyOwner {
        murasaki_storage_address = _address;
    }
    function _set3_murasaki_craft_address(address _address) external onlyOwner {
        murasaki_craft_address = _address;
    }
    function _set4_world_dice_address(address _address) external onlyOwner {
        world_dice_address = _address;
    }
    function _set5_murasaki_name_address(address _address) external onlyOwner {
        murasaki_name_address = _address;
    }
    function _set6_murasaki_storage_score_address(address _address) external onlyOwner {
        murasaki_storage_score_address = _address;
    }
    function _set7_murasaki_mail_address(address _address) external onlyOwner {
        murasaki_mail_address = _address;
    }
    function _set8_murasaki_storage_nui_address(address _address) external onlyOwner {
        murasaki_storage_nui_address = _address;
    }
    function _set9_astarbase_address(address _address) external onlyOwner {
        astarbase_address = _address;
    }
    function _setA_bufferTreqsury_address(address _address) external onlyOwner {
        bufferTreasury_address = _address;
    }
    function _setB_buybackTreasury_address(address _address) external onlyOwner {
        buybackTreasury_address = _address;
    }
    function _setC_teamTreasury_address(address _address) external onlyOwner {
        teamTreasury_address = _address;
    }
    function _setD_murasaki_lootlike_address(address _address) external onlyOwner {
        murasaki_lootlike_address = _address;
    }
    function _setE_murasaki_parameter_address(address _address) external onlyOwner {
        murasaki_parameter_address = _address;
    }

    //check owner of summoner
    function check_owner(uint _summoner, address _wallet) external view returns (bool) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        return (mm.ownerOf(_summoner) == _wallet);
    }

    //get owner of summoner
    function get_owner(uint _summoner) public view returns (address) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        return mm.ownerOf(_summoner);
    }

    //craft

    //get balance of type
    function get_balance_of_type_specific(address _wallet, uint _item_type) public view returns (uint) {
        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        return mc.balance_of_type(_wallet, _item_type);
    }

    //call items as array
    function get_balance_of_type_array(address _wallet) external view returns (uint[256] memory) {
        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        return mc.get_balance_of_type(_wallet);
    }

    //call items as array from summoner
    function get_balance_of_type_array_from_summoner(uint _summoner) public view returns (uint[256] memory) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        address _owner = mm.ownerOf(_summoner);
        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        return mc.get_balance_of_type(_owner);
    }

    //calc satiety
    function calc_satiety(uint _summoner) public view returns (uint) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
        uint SPEED = mp.SPEED();
        uint BASE_SEC = mp.BASE_SEC();
        uint _now = block.timestamp;
        uint _delta_sec = _now - ms.last_feeding_time(_summoner);
        uint _base = BASE_SEC /2 *100/SPEED;
        uint _satiety;
        if (_delta_sec >= _base) {
            _satiety = 0;
        }else {
            _satiety = 100 * (_base - _delta_sec) / _base;
        }
        return _satiety;
    }

    //calc happy
    function calc_happy(uint _summoner) public view returns (uint) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
        uint SPEED = mp.SPEED();
        uint BASE_SEC = mp.BASE_SEC();
        uint _now = block.timestamp;
        uint _delta_sec = _now - ms.last_grooming_time(_summoner);
        uint _base = BASE_SEC *3 *100/SPEED;
        uint _happy;
        if (_delta_sec >= _base) {
            _happy = 0;
        }else {
            _happy = 100 * (_base - _delta_sec) / _base;
        }
        return _happy;
    }

    //calc precious
    function calc_precious(uint _summoner) public view returns (uint) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
        uint[256] memory _balance_of_type = get_balance_of_type_array_from_summoner(_summoner);
        uint _precious_score = 0;
        //fluffy
        uint _elected_precious_type = mp.ELECTED_FLUFFY_TYPE();
        for (uint i = 201; i <= 212; i++) {
            if (_balance_of_type[i+24] > 0) {
                _precious_score += _balance_of_type[i+24] * 3*16;
                //fluffly festival modification, x2 score
                if (i == _elected_precious_type) {
                    _precious_score += _balance_of_type[i+24] * 3*16;
                }
            }
            if (_balance_of_type[i+12] > 0) {
                _precious_score += _balance_of_type[i+12] * 3*4;
                if (i == _elected_precious_type) {
                    _precious_score += _balance_of_type[i+12] * 3*4;
                }
            }
            if (_balance_of_type[i] > 0) {
                _precious_score += _balance_of_type[i] * 3;
                if (i == _elected_precious_type) {
                    _precious_score += _balance_of_type[i] * 3;
                }
            }
        }
        //nui
        if (_balance_of_type[197] > 0) {
            _precious_score += _balance_of_type[197] * 3*64;
        }
        //level cap, 800/Lv20 = 40/Lv
        uint _lv = ms.level(_summoner);
        if (_precious_score > _lv*40) {
            _precious_score = _lv*40;
        }
        return _precious_score;
    }

    //call_name_from_summoner
    function call_name_from_summoner(uint _summoner) external view returns (string memory) {
        if (_summoner == 0) {
            Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
            return mp.DEVELOPER_SUMMONER_NAME();
        }
        Murasaki_Name mn = Murasaki_Name(murasaki_name_address);
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        address _owner = mm.ownerOf(_summoner);
        uint _name_id = mn.tokenOf(_owner);
        string memory _name_str = mn.names(_name_id);
        return _name_str;
    }

    //calc_score
    function calc_score(uint _summoner) public view returns (uint) {
        uint _score = 0;
        _score += _calc_score_total(_summoner);
        _score += _calc_score_nft(_summoner);
        return _score;
    }
    function _calc_score_total(uint _summoner) internal view returns (uint) {
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(murasaki_storage_score_address);
        uint _total_exp_gained = mss.total_exp_gained(_summoner);
        uint _total_coin_mined = mss.total_coin_mined(_summoner);
        uint _total_material_farmed = mss.total_material_farmed(_summoner);
        uint _total_item_crafted = mss.total_item_crafted(_summoner);
        uint _total_precious_received = mss.total_precious_received(_summoner);
        uint _score = 0;
        _score += _total_exp_gained;
        _score += _total_coin_mined;
        _score += _total_material_farmed;
        _score += _total_item_crafted * 3000 + _total_item_crafted ** 2 * 300;
        _score += _total_precious_received * 500 + _total_precious_received ** 2 * 50;
        return _score;
    }
    function _calc_score_nft(uint _summoner) internal view returns (uint) {
        uint[256] memory _array = get_balance_of_type_array_from_summoner(_summoner);
        uint _score = 0;
        for (uint i=1; i<=255; i++) {
            if (_array[i] > 0) {
                //common item, 1/5 of item_crafted
                if (i <= 64) {
                    _score += _array[i] * 600;
                //uncommon item, x4 of common
                } else if (i <= 128) {
                    _score += _array[i] * 2400;
                //rare item, x4 of uncommon
                } else if (i <= 196) {
                    _score += _array[i] * 9600;
                //nui, x4 of fluffiest
                } else if (i == 197) {
                    _score += _array[i] * 6400;
                //bank, pouch, mail, ignored
                } else if (i <= 200) {
                    _score += 0;
                //fluffy, 1/5 of precious_received
                } else if (i <= 212) {
                    _score += _array[i] * 100;
                //fluffier, x4 of fluffy
                } else if (i <= 224) {
                    _score += _array[i] * 400;
                //fluffiest, x4 of fluffier
                } else if (i <= 236) {
                    _score += _array[i] * 1600;
                }
            }
        }
        return _score;
    }
        
    //calc_exp_addition_rate_from_nui, item_nui required
    //return XXX% (100% - 200%, x1 - x2 ratio)
    function calc_exp_addition_rate(uint _summoner, uint _item_nui) external view returns (uint) {
        //call summoner score
        uint _score_summoner = calc_score(_summoner);
        //call nui score
        Murasaki_Storage_Nui msn = Murasaki_Storage_Nui(murasaki_storage_nui_address);
        uint _score_nui = msn.score(_item_nui);
        //formula: _score_nui / _score_summoner * 100 (%)
        uint _percent = _score_nui * 100 / (_score_summoner + 1);
        if (_percent <= 103) {
            return 103;
        } else if (_percent >= 300) {
            return 300;
        } else {
            return _percent;
        }
    }

    //cehck petrification, debends on only feeding
    function not_petrified(uint _summoner) public view returns (bool) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
        uint SPEED = mp.SPEED();
        uint BASE_SEC = mp.BASE_SEC();
        uint DAY_PETRIFIED = mp.DAY_PETRIFIED();
        uint _now = block.timestamp;
        uint _delta_sec = _now - ms.last_feeding_time(_summoner);
        if ( _delta_sec >= BASE_SEC * DAY_PETRIFIED *100/SPEED) {
            return false;
        }else {
            return true;
        }
    }
    
    //calc dapps staking amount of mm contract
    //local: AstarBase: 0x64582688EF82Bcce7F6260eE1384656e1D33b4bB
    //Shibuya, AstarBase: 0xF183f51D3E8dfb2513c15B046F848D4a68bd3F5D
    //Astar, AstarBase: 0x8E2fa5A4D4e4f0581B69aF2f8F2Ef2CF205aE8F0
    //Astar, communy reward: 0x101B453a02f961b4E3f0526eCd4c533c3A80d795
    function calc_dapps_staking_amount(address _wallet) public view returns (uint) {
        IAstarBase ASTARBASE = IAstarBase(astarbase_address);
        uint _staker_raw = ASTARBASE.checkStakerStatusOnContract(_wallet, murasaki_main_address);
        uint _staker = _staker_raw / (10 ** 18);
        return _staker;
    }
    
    /*
    //get luck addition by dapps staking
    function get_luck_by_staking(uint _summoner) public view returns (uint) {
        address _owner = get_owner(_summoner);
        uint _staker = calc_dapps_staking_amount(_owner);
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        uint _level = ms.level(_summoner);
        //luck_add = luck_addMin + (luck_addMax - luck_addMin) * (Lv-1)/(20-1)
        uint _luck_addMin;
        uint _luck_addMax;
        if (_staker < 500) {
            return 0;
        } else if (_staker < 1000) {
            _luck_addMin = 25;
            _luck_addMax = 50;
        } else if (_staker < 2000) {
            _luck_addMin = 50;
            _luck_addMax = 100;
        } else if (_staker < 4000) {
            _luck_addMin = 75;
            _luck_addMax = 150;
        } else if (_staker < 8000) {
            _luck_addMin = 100;
            _luck_addMax = 200;
        } else if (_staker < 16000) {
            _luck_addMin = 125;
            _luck_addMax = 250;
        } else if (_staker < 32000) {
            _luck_addMin = 150;
            _luck_addMax = 300;
        } else if (_staker < 64000) {
            _luck_addMin = 175;
            _luck_addMax = 350;
        } else {
            _luck_addMin = 200;
            _luck_addMax = 400;
        }
        uint _luck_add = _luck_addMin + (_luck_addMax - _luck_addMin) * (_level - 1) / 19;
        return _luck_add;
    }
    */
    
    //get speed_of_dappsStaking
    function get_speed_of_dappsStaking(uint _summoner) external view returns (uint) {
        address _owner = get_owner(_summoner);
        uint _staker = calc_dapps_staking_amount(_owner);
        uint _speed;
        if (_staker < 500) {
            _speed = 0;
        } else if (_staker < 1000) {
            _speed = 100;
        } else if (_staker < 2000) {
            _speed = 125;
        } else if (_staker < 4000) {
            _speed = 150;
        } else if (_staker < 8000) {
            _speed = 200;
        } else if (_staker < 16000) {
            _speed = 250;
        } else if (_staker < 32000) {
            _speed = 300;
        } else if (_staker < 64000) {
            _speed = 350;
        } else if (_staker < 128000) {
            _speed = 400;
        } else if (_staker >= 128000) {
            _speed = 428;
        }
        return _speed;
    }
    
    /*
    function get_luck_by_staking(uint _summoner) public view returns (uint) {
        address _owner = get_owner(_summoner);
        uint _staker = calc_dapps_staking_amount(_owner);
        // y = [ 1 + { 5.7 / (x + 570) } ]^x
        if (_staker < 500) {
            return 0;
        } else if (_staker < 1250) {
            return 50;
        } else if (_staker < 2500) {
            return 100;
        } else if (_staker < 4000) {
            return 150;
        } else if (_staker < 6500) {
            return 200;
        } else if (_staker < 10000) {
            return 250;
        } else {
            return 300;
        }
    }
    */
    
    //luck challenge
    function luck_challenge(uint _summoner) external view returns (bool) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        World_Dice wd = World_Dice(world_dice_address);
        uint _luck = ms.luck(_summoner);
        //_luck += calc_precious(_summoner) * 1;
        _luck += calc_precious(_summoner);
        _luck += wd.get_rolled_dice(_summoner);
        //_luck += get_luck_by_staking(_summoner);
        if (dn(_summoner, 10000) <= _luck) {
            return true;
        } else {
            return false;
        }
    }

    //random
    //for block chain
    function d10000(uint _summoner) external view returns (uint) {
        return dn(_summoner, 10000);
    }
    function d1000(uint _summoner) external view returns (uint) {
        return dn(_summoner, 1000);
    }
    function d100(uint _summoner) external view returns (uint) {
        return dn(_summoner, 100);
    }
    function seed(uint _summoner) external view returns (uint) {
        return _seed(_summoner);
    }
    function d20(uint _summoner) external view returns (uint) {
        return dn(_summoner, 20);
    }    
    function d12(uint _summoner) external view returns (uint) {
        return dn(_summoner, 12);
    }    
    function d10(uint _summoner) external view returns (uint) {
        return dn(_summoner, 10);
    }
    function d8(uint _summoner) external view returns (uint) {
        return dn(_summoner, 8);
    }
    function d6(uint _summoner) external view returns (uint) {
        return dn(_summoner, 6);
    }
    function d4(uint _summoner) external view returns (uint) {
        return dn(_summoner, 4);
    }
    function dn(uint _summoner, uint _number) public view returns (uint) {
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
                    _summoner,
                    msg.sender
                )
            )
        );
    }
}


//---Summon_and_LevelUp


contract Murasaki_Function_Summon_and_LevelUp is Ownable, ReentrancyGuard {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //summon
    event Summon(uint indexed _summoner, address _wallet, uint _class);
    function summon(uint _class) external payable nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        uint PRICE = mp.PRICE();
        uint BASE_SEC = mp.BASE_SEC();
        uint SPEED = mp.SPEED();
        require(msg.value >= PRICE * 10**18);
        require(0 <= _class && _class <= 11);
        //summon on mm, mint NTT
        uint _summoner = mm.next_token();
        uint _seed = mfs.seed(_summoner);
        mm.summon(msg.sender, _class, _seed);
        //summon on ms, initialize sutatus
        uint _now = block.timestamp;
        ms.set_level(_summoner, 1);
        ms.set_exp(_summoner, 0);
        ms.set_strength(_summoner, 300);
        ms.set_dexterity(_summoner, 300);
        ms.set_intelligence(_summoner, 300);
        ms.set_luck(_summoner, 300);
        ms.set_next_exp_required(_summoner, 1000);
        ms.set_last_level_up_time(_summoner, _now);
        ms.set_coin(_summoner, 0);
        ms.set_material(_summoner, 0);
        ms.set_last_feeding_time(_summoner, _now - BASE_SEC * 100 / SPEED / 2);
        ms.set_last_grooming_time(_summoner, _now - BASE_SEC * 100 / SPEED / 2);
        ms.set_mining_status(_summoner, 0);
        ms.set_mining_start_time(_summoner, 0);
        ms.set_farming_status(_summoner, 0);
        ms.set_farming_start_time(_summoner, 0);
        ms.set_crafting_status(_summoner, 0);
        ms.set_crafting_start_time(_summoner, 0);
        ms.set_crafting_item_type(_summoner, 0);
        ms.set_total_mining_sec(_summoner, 0);
        ms.set_total_farming_sec(_summoner, 0);
        ms.set_total_crafting_sec(_summoner, 0);
        ms.set_last_total_mining_sec(_summoner, 0);
        ms.set_last_total_farming_sec(_summoner, 0);
        ms.set_last_total_crafting_sec(_summoner, 0);
        ms.set_last_grooming_time_plus_working_time(_summoner, _now - BASE_SEC * 100 / SPEED / 2);
        ms.set_isActive(_summoner, true);
        ms.set_inHouse(_summoner, true);
        ms.set_staking_reward_counter(_summoner, mp.STAKING_REWARD_SEC());
        //fee transfer, 50% for buyback, rest for team
        payable(mfs.buybackTreasury_address()).transfer(address(this).balance/2);
        payable(mfs.bufferTreasury_address()).transfer(address(this).balance);
        //event
        emit Summon(_summoner, msg.sender, _class);
    }

    //burn
    event Burn(uint indexed _summoner);
    function burn(uint _summoner) external nonReentrant {
        //check owner
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        require(mfs.check_owner(_summoner, msg.sender));
        //burn on mm
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        mm.burn(_summoner);
        //burn on ms, inactivate
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        ms.set_isActive(_summoner, false);
        //event
        emit Burn(_summoner);
    }

    //petrified check
    function not_petrified(uint _summoner) internal view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.not_petrified(_summoner);
    }

    //level-up
    event Level_up(uint indexed _summoner, uint _level);
    function level_up(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(ms.exp(_summoner) >= ms.next_exp_required(_summoner));
        //petrified check
        require(not_petrified(_summoner));
        //calculate working percent
        uint _now = block.timestamp;
        uint _base_sec = _now - ms.last_level_up_time(_summoner);
        uint _resting_sec = _base_sec
             - ms.last_total_mining_sec(_summoner)
             - ms.last_total_farming_sec(_summoner)
             - ms.last_total_crafting_sec(_summoner);
        uint _percent_mining = 200 * (ms.last_total_mining_sec(_summoner) + _resting_sec/4) / _base_sec;
        uint _percent_farming = 200 * (ms.last_total_farming_sec(_summoner) + _resting_sec/4) / _base_sec;
        uint _percent_crafting = 200 * (ms.last_total_crafting_sec(_summoner) + _resting_sec/4) / _base_sec;
        uint _percent_resting = 200 * (_resting_sec/4) / _base_sec;
        //status addition
        ms.set_strength(_summoner, ms.strength(_summoner) + _percent_mining);
        ms.set_dexterity(_summoner, ms.dexterity(_summoner) + _percent_farming);
        ms.set_intelligence(_summoner, ms.intelligence(_summoner) + _percent_crafting);
        ms.set_luck(_summoner, ms.luck(_summoner) + _percent_resting);
        //update timestamp
        ms.set_last_total_mining_sec(_summoner, 0);
        ms.set_last_total_farming_sec(_summoner, 0);
        ms.set_last_total_crafting_sec(_summoner, 0);
        //reset feeding, grooming, and exp
        ms.set_last_feeding_time(_summoner, _now);
        ms.set_last_grooming_time(_summoner, _now);
        ms.set_exp(_summoner, 0);
        //level-up
        uint _next_level = ms.level(_summoner) + 1;
        ms.set_level(_summoner, _next_level);
        ms.set_last_level_up_time(_summoner, _now);
        //update next_exp_required
        if (_next_level == 2) {
            ms.set_next_exp_required(_summoner, 3000);
        }else if (_next_level == 3) {
            ms.set_next_exp_required(_summoner, 6000);
        }else if (_next_level == 4) {
            ms.set_next_exp_required(_summoner, 10000);
        }else if (_next_level == 5) {
            ms.set_next_exp_required(_summoner, 15000);
        }else if (_next_level == 6) {
            ms.set_next_exp_required(_summoner, 21000);
        }else if (_next_level == 7) {
            ms.set_next_exp_required(_summoner, 28000);
        }else if (_next_level == 8) {
            ms.set_next_exp_required(_summoner, 36000);
        }else if (_next_level == 9) {
            ms.set_next_exp_required(_summoner, 45000);
        }else if (_next_level == 10) {
            ms.set_next_exp_required(_summoner, 55000);
        }else if (_next_level == 11) {
            ms.set_next_exp_required(_summoner, 66000);
        }else if (_next_level == 12) {
            ms.set_next_exp_required(_summoner, 78000);
        }else if (_next_level == 13) {
            ms.set_next_exp_required(_summoner, 91000);
        }else if (_next_level == 14) {
            ms.set_next_exp_required(_summoner, 105000);
        }else if (_next_level == 15) {
            ms.set_next_exp_required(_summoner, 120000);
        }else if (_next_level == 16) {
            ms.set_next_exp_required(_summoner, 136000);
        }else if (_next_level == 17) {
            ms.set_next_exp_required(_summoner, 153000);
        }else if (_next_level == 18) {
            ms.set_next_exp_required(_summoner, 171000);
        }else if (_next_level == 19) {
            ms.set_next_exp_required(_summoner, 190000);
        }
        //mint_jewel
        //_mint_jewel(_summoner);
        //event
        emit Level_up(_summoner, _next_level);
    }

    /*
    //mint jewel
    event Jewel_mint(uint indexed _summoner, uint _item_type);
    function _mint_jewel(uint _summoner) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint _seed = mfs.seed(_summoner);
        uint _item_type = 200 + mfs.d10(_summoner) + 1;   //201-212
        mc.craft(_item_type, _summoner, msg.sender, _seed);
        emit Jewel_mint(_summoner, _item_type);
    }
    */
}


//---Feeding_and_Grooming


contract Murasaki_Function_Feeding_and_Grooming is Ownable, ReentrancyGuard {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //feeding
    event Feeding(uint indexed _summoner, uint _exp_gained, bool _critical);
    function feeding(uint _summoner, uint _item_nui) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        //require(mfs.check_owner(_summoner, msg.sender));
        require(not_petrified(_summoner));
        uint _now = block.timestamp;
        uint _satiety = mfs.calc_satiety(_summoner);
        uint _exp_add = 500 * (100 - _satiety) / 100;
        //for staking counter, sec before boost
        uint _delta_sec = ( _now - ms.last_feeding_time(_summoner) ) * mp.SPEED()/100;
        //nui boost
        if (_item_nui > 0) {
            address _owner = mfs.get_owner(_summoner);
            Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
            require(mc.ownerOf(_item_nui) == _owner);
            uint _percent = mfs.calc_exp_addition_rate(_summoner, _item_nui);
            _exp_add = _exp_add * _percent/100;
        }
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            //_exp_add = _exp_add * 3 / 2;
            _exp_add = _exp_add * 2;
            _critical = true;
        }
        uint _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        ms.set_last_feeding_time(_summoner, _now);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint _total_exp_gained = mss.total_exp_gained(_summoner);
        mss.set_total_exp_gained(_summoner, _total_exp_gained + _exp_add);
        //owner check, gain some exp when not your summoner
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint _summoner_yours = mm.tokenOf(msg.sender);
        if (_summoner_yours != 0 && _summoner != _summoner_yours) {
            uint _exp_yours = ms.exp(_summoner_yours);
            ms.set_exp(_summoner_yours, _exp_yours + _exp_add / 50);
        }
        //update staking reward counter
        _update_staking_reward_counter(_summoner, _delta_sec);
        //event
        emit Feeding(_summoner, _exp_add, _critical);
    }
    function calc_feeding(uint _summoner) external view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint _satiety = mfs.calc_satiety(_summoner);
        uint _exp_add = 500 * (100 - _satiety) / 100;
        return _exp_add;
    }
    function _update_staking_reward_counter(uint _summoner, uint _delta_sec) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint _speed = mfs.get_speed_of_dappsStaking(_summoner);
        if (_speed > 0) {
            uint _decrease = _speed * _delta_sec / 100;
            uint _counter = ms.staking_reward_counter(_summoner);
            //decrease counter sec
            if (_counter > _decrease) {
                _counter = _counter - _decrease;
                ms.set_staking_reward_counter(_summoner, _counter);
            //when counter <= 0, mint presentbox
            } else {
                address _owner = mfs.get_owner(_summoner);
                _mint_presentbox(_summoner, _owner);
                ms.set_staking_reward_counter(_summoner, mp.STAKING_REWARD_SEC());   //reset counter
            }
            //update total_counter
            ms.set_total_staking_reward_counter(
                _summoner,
                ms.total_staking_reward_counter(_summoner) + _decrease
            );
        }
    }
    //mint presentbox
    function _mint_presentbox(uint _summoner_from, address _wallet_to) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint _seed = mfs.seed(_summoner_from);
        uint _item_type = 200;
        string memory _memo = "dapps staking";
        mc.craft(_item_type, uint(0), _wallet_to, _seed, _memo);
    }

    //petrification, debends on only feeding
    function not_petrified(uint _summoner) internal view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.not_petrified(_summoner);
    }
    event Cure_Petrification(uint indexed _summoner, uint _price);
    function cure_petrification(uint _summoner) external payable nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(!not_petrified(_summoner));
        //uint _price = ms.level(_summoner) * PRICE * 10**18;
        uint PRICE = mp.PRICE();
        // cure cost = present mint price
        uint _price = PRICE * 10**18;
        require(msg.value >= _price);
        uint _now = block.timestamp;
        ms.set_last_feeding_time(_summoner, _now);
        ms.set_mining_status(_summoner, 0);
        ms.set_farming_status(_summoner, 0);
        ms.set_crafting_status(_summoner, 0);
        //fee transfer
        payable(mfs.bufferTreasury_address()).transfer(address(this).balance);
        //event
        emit Cure_Petrification(_summoner, _price);
    }

    //grooming
    event Grooming(uint indexed _summoner, uint _exp_gained, bool _critical);
    function grooming(uint _summoner, uint _item_nui) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(not_petrified(_summoner));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        uint _now = block.timestamp;
        uint _happy = _calc_happy_real(_summoner);
        uint _exp_add = 3000 * (100 - _happy) / 100;
        //nui boost
        if (_item_nui > 0) {
            address _owner = mfs.get_owner(_summoner);
            Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
            require(mc.ownerOf(_item_nui) == _owner);
            uint _percent = mfs.calc_exp_addition_rate(_summoner, _item_nui);
            _exp_add = _exp_add * _percent/100;
        }
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            //_exp_add = _exp_add * 3 / 2;
            _exp_add = _exp_add * 2;
            _critical = true;
        }
        //add exp
        uint _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        ms.set_last_grooming_time(_summoner, _now);
        ms.set_last_grooming_time_plus_working_time(_summoner, _now);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint _total_exp_gained = mss.total_exp_gained(_summoner);
        mss.set_total_exp_gained(_summoner, _total_exp_gained + _exp_add);
        //event
        emit Grooming(_summoner, _exp_add, _critical);
    }
    //calc happy, modified with working_time
    function _calc_happy_real(uint _summoner) internal view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint SPEED = mp.SPEED();
        uint BASE_SEC = mp.BASE_SEC();
        uint _now = block.timestamp;
        uint _delta_sec = _now - ms.last_grooming_time_plus_working_time(_summoner);  //working_time
        uint _base = BASE_SEC *3 *100/SPEED;
        uint _happy;
        if (_delta_sec >= _base) {
            _happy = 0;
        }else {
            _happy = 100 * (_base - _delta_sec) / _base;
        }
        return _happy;
    }
    function calc_grooming(uint _summoner) external view returns (uint) {
        uint _happy = _calc_happy_real(_summoner);
        uint _exp_add = 3000 * (100 - _happy) / 100;
        return _exp_add;
    }

    //luck challenge of mffg
    function luck_challenge(uint _summoner) public view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.luck_challenge(_summoner);
    }    
}


//---Mining_and_Farming


contract Murasaki_Function_Mining_and_Farming is Ownable, ReentrancyGuard {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //mining
    function start_mining(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.level(_summoner) >= 2);
        uint _now = block.timestamp;
        ms.set_mining_status(_summoner, 1);
        ms.set_mining_start_time(_summoner, _now);
    }
    event Mining(uint indexed _summoner, uint _coin_mined, bool _critical);
    function stop_mining(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 1);
        uint _now = block.timestamp;
        uint _delta = calc_mining(_summoner);
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            //_delta = _delta * 3 / 2;
            _delta = _delta * 2;
            _critical = true;
        }
        //add coin
        uint _coin = ms.coin(_summoner) + _delta;
        ms.set_coin(_summoner, _coin);
        //update timestamp
        uint _delta_sec = _now - ms.mining_start_time(_summoner);
        //uint _total_mining_sec = ms.total_mining_sec(_summoner) + _delta_sec;
        //ms.set_total_mining_sec(_summoner, _total_mining_sec);
        uint _last_total_mining_sec = ms.last_total_mining_sec(_summoner) + _delta_sec;
        ms.set_last_total_mining_sec(_summoner, _last_total_mining_sec);
        uint _last_grooming_time_plus_working_time = ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec;
        ms.set_last_grooming_time_plus_working_time(_summoner, _last_grooming_time_plus_working_time);
        ms.set_mining_status(_summoner, 0);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint _total_coin_mined = mss.total_coin_mined(_summoner);
        mss.set_total_coin_mined(_summoner, _total_coin_mined + _delta);
        //event
        emit Mining(_summoner, _delta, _critical);
    }
    function calc_mining(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        //address _owner = mfs.get_owner(_summoner);
        uint SPEED = mp.SPEED();
        uint BASE_SEC = mp.BASE_SEC();
        //require(ms.mining_status(_summoner) == 1);
        if (ms.mining_status(_summoner) == 0) {
            return uint(0);
        }
        uint _now = block.timestamp;
        //uint _delta = (_now - ms.mining_start_time(_summoner)) * SPEED/100;   //sec
        uint _delta = _now - ms.mining_start_time(_summoner);   //sec
        //happy limit: if happy=0, no more earning
        uint _delta_grooming = _now - ms.last_grooming_time(_summoner);
        uint _base_grooming = BASE_SEC *3 *100/SPEED;
        if (_delta_grooming >= _base_grooming) {
            //_delta = ms.last_grooming_time(_summoner) + BASE_SEC * 3;
            _delta = _base_grooming;
        }
        //speed boost
        _delta = _delta * SPEED / 100;
        //1day = +1000
        _delta = _delta * 1000 / BASE_SEC;
        //status, level, item boost
        //uint _mod = ms.strength(_summoner) + ms.level(_summoner)*100 + count_mining_items(msg.sender);
        //uint _mod = ms.strength(_summoner) + ms.level(_summoner)*100 + count_mining_items(_owner);
        uint _mod = ms.strength(_summoner) + ms.level(_summoner)*100 + count_mining_items(mfs.get_owner(_summoner));
        //5%/point, 100 -> 1.00
        _mod = _mod * 5 / 100;
        //boost
        _delta += _delta * _mod / 100;
        return _delta;
    }
    function count_mining_items(address _address) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint[256] memory _balance_of_type = mfs.get_balance_of_type_array(_address);
        uint _mining_items = 0;
        for (uint i = 1; i <= 16; i++) {
            if (_balance_of_type[i+128] > 0) {
                _mining_items += 200;
            }else if (_balance_of_type[i+64] > 0) {
                _mining_items += 150;
            }else if (_balance_of_type[i] > 0) {
                _mining_items += 100;
            }
            //+10% per one additional item
            if (_balance_of_type[i] >= 2) {
                _mining_items += (_balance_of_type[i] - 1) * 10;
            }
            if (_balance_of_type[i+64] >= 2) {
                _mining_items += (_balance_of_type[i+64] - 1) * 15;
            }
            if (_balance_of_type[i+128] >= 2) {
                _mining_items += (_balance_of_type[i+128] - 1) * 20;
            }
        }
        return _mining_items;
    }

    //farming
    function start_farming(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.level(_summoner) >= 2);
        uint _now = block.timestamp;
        ms.set_farming_status(_summoner, 1);
        ms.set_farming_start_time(_summoner, _now);
    }
    event Farming(uint indexed _summoner, uint _material_farmed, bool _critical);
    function stop_farming(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.farming_status(_summoner) == 1);
        uint _now = block.timestamp;
        uint _delta = calc_farming(_summoner);
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            //_delta = _delta * 3 / 2;
            _delta = _delta * 2;
            _critical = true;
        }
        //add coin
        uint _material = ms.material(_summoner) + _delta;
        ms.set_material(_summoner, _material);
        //update timestamp
        uint _delta_sec = _now - ms.farming_start_time(_summoner);
        //uint _total_farming_sec = ms.total_farming_sec(_summoner) + _delta_sec;
        //ms.set_total_farming_sec(_summoner, _total_farming_sec);
        uint _last_total_farming_sec = ms.last_total_farming_sec(_summoner) + _delta_sec;
        ms.set_last_total_farming_sec(_summoner, _last_total_farming_sec);
        uint _last_grooming_time_plus_working_time = ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec;
        ms.set_last_grooming_time_plus_working_time(_summoner, _last_grooming_time_plus_working_time);
        ms.set_farming_status(_summoner, 0);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint _total_material_farmed = mss.total_material_farmed(_summoner);
        mss.set_total_material_farmed(_summoner, _total_material_farmed + _delta);
        //event
        emit Farming(_summoner, _delta, _critical);
    }
    function calc_farming(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        //address _owner = mfs.get_owner(_summoner);
        uint SPEED = mp.SPEED();
        uint BASE_SEC = mp.BASE_SEC();
        //require(ms.farming_status(_summoner) == 1);
        if (ms.farming_status(_summoner) == 0) {
            return uint(0);
        }
        uint _now = block.timestamp;
        uint _delta = _now - ms.farming_start_time(_summoner);   //sec
        //happy limit: if happy=0, no more earning
        uint _delta_grooming = _now - ms.last_grooming_time(_summoner);
        uint _base_grooming = BASE_SEC *3 *100/SPEED;
        if (_delta_grooming >= _base_grooming) {
            //_delta = ms.last_grooming_time(_summoner) + BASE_SEC * 3;
            _delta = _base_grooming;
        }
        //speed boost
        _delta = _delta * SPEED / 100;
        //1day = +1000
        _delta = _delta * 1000 / BASE_SEC;
        /*
        uint _delta = (_now - ms.farming_start_time(_summoner)) * SPEED/100;  //sec
        _delta = _delta * 1000 / BASE_SEC; // 1 day = +1000
        */
        //status and item boost
        //uint _mod = ms.dexterity(_summoner) + ms.level(_summoner)*100 + count_farming_items(msg.sender);
        //uint _mod = ms.dexterity(_summoner) + ms.level(_summoner)*100 + count_farming_items(_owner);
        uint _mod = ms.dexterity(_summoner) + ms.level(_summoner)*100 + count_farming_items(mfs.get_owner(_summoner));
        //5%/point, 100 -> 1.00
        _mod = _mod * 5 / 100;
        //boost
        _delta += _delta * _mod / 100;
        return _delta;
    }
    function count_farming_items(address _address) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint[256] memory _balance_of_type = mfs.get_balance_of_type_array(_address);
        uint _farming_items = 0;
        for (uint i = 17; i <= 32; i++) {
            if (_balance_of_type[i+128] > 0) {
                _farming_items += 200;
            }else if (_balance_of_type[i+64] > 0) {
                _farming_items += 150;
            }else if (_balance_of_type[i] > 0) {
                _farming_items += 100;
            }
            //+10% per one additional items
            if (_balance_of_type[i] >= 2) {
                _farming_items += (_balance_of_type[i] - 1) * 10;
            }
            if (_balance_of_type[i+64] >= 2) {
                _farming_items += (_balance_of_type[i+64] - 1) * 15;
            }
            if (_balance_of_type[i+128] >= 2) {
                _farming_items += (_balance_of_type[i+128] - 1) * 20;
            }
        }
        return _farming_items;
    }

    //luck challenge of mfmf
    function luck_challenge(uint _summoner) public view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.luck_challenge(_summoner);
    }    
}


//---Crafting


contract Murasaki_Function_Crafting is Ownable, ReentrancyGuard {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }
    address public murasaki_function_crafting_codex_address;
    function _set2_murasaki_function_crafting_codex_address(address _address) external onlyOwner {
        murasaki_function_crafting_codex_address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    /*  ### crafting comdition ###
                    crafting_status     resume_flag     calc_crafting
        Start               0               0               -
        Pause               1               -               >0
        Resume              0               1               -
        Cancel              0               1               -
        Complete            1               -               ==0
    */

    //start_crafting, resume_flag==0
    function start_crafting(uint _summoner, uint _item_type) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.level(_summoner) >= 3);
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0);
        require(ms.crafting_status(_summoner) == 0);
        require(ms.crafting_resume_flag(_summoner) == 0);        
        //check item_type
        require(
            _item_type <= 64        //normal items
            || _item_type == 194    //coin bag
            || _item_type == 195    //material bag
            || _item_type == 196    //mail
        );
        //get dc, cost, heart
        uint[4] memory _dc_table = get_item_dc(_item_type);
        uint _coin = _dc_table[2];
        uint _material = _dc_table[3];
        //check coin, material
        require(ms.coin(_summoner) >= _coin);
        require(ms.material(_summoner) >= _material);
        //pay coin, material
        ms.set_coin(_summoner, ms.coin(_summoner) - _coin);
        ms.set_material(_summoner, ms.material(_summoner) - _material);
        //start crafting
        ms.set_crafting_item_type(_summoner, _item_type);
        ms.set_crafting_status(_summoner, 1);
        ms.set_crafting_start_time(_summoner, block.timestamp);
    }

    //pause_crafting, remining_time > 0
    function pause_crafting(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.crafting_status(_summoner) == 1);
        require(calc_crafting(_summoner) > 0);
        uint _now = block.timestamp;
        uint _delta_sec = (_now - ms.crafting_start_time(_summoner));
        uint _item_type = ms.crafting_item_type(_summoner);
        //get remining sec
        uint _remining_time = calc_crafting(_summoner);
        //calc remining dc
        uint BASE_SEC = mp.BASE_SEC();
        uint _remining_dc = _remining_time * 1000 / BASE_SEC;
        //stop
        ms.set_last_total_crafting_sec(
            _summoner, 
            ms.last_total_crafting_sec(_summoner) + _delta_sec
        );
        ms.set_last_grooming_time_plus_working_time(
            _summoner, 
            ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec
        );
        ms.set_crafting_status(_summoner, 0);
        //pause crafting to resume
        ms.set_crafting_resume_flag(_summoner, 1);
        ms.set_crafting_resume_item_type(_summoner, _item_type);
        ms.set_crafting_resume_item_dc(_summoner, _remining_dc);
    }

    //cancel_crafting, crafting_status==0 & resume_flag==1
    function cancel_crafting(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.crafting_status(_summoner) == 0);
        require(ms.crafting_resume_flag(_summoner) == 1);
        uint _item_type = ms.crafting_item_type(_summoner);
        //calcel resume
        ms.set_crafting_resume_flag(_summoner, 0);
        //return coin/material
        uint[4] memory _dc_table = get_item_dc(_item_type);
        uint _coin = _dc_table[2];
        uint _material = _dc_table[3];
        ms.set_coin(_summoner, ms.coin(_summoner) + _coin);
        ms.set_material(_summoner, ms.material(_summoner) + _material);
    }

    //resume_crafting, crafting_status==0 & resume_flag==1
    function resume_crafting(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.level(_summoner) >= 3);
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0);
        require(ms.crafting_status(_summoner) == 0);
        require(ms.crafting_resume_flag(_summoner) == 1);
        //resume item_type
        uint _item_type = ms.crafting_resume_item_type(_summoner);
        //check item_type
        require(
            _item_type <= 64        //normal items
            || _item_type == 194    //coin bag
            || _item_type == 195    //material bag
            || _item_type == 196    //mail
        );
        /*  no cost is needed to resume...?
        //get dc, cost, heart
        uint[4] memory _dc_table = get_item_dc(_item_type);
        uint _coin = _dc_table[2];
        uint _material = _dc_table[3];
        //check coin, material, heart
        require(ms.coin(_summoner) >= _coin);
        require(ms.material(_summoner) >= _material);
        //pay coin, material, heart
        ms.set_coin(_summoner, ms.coin(_summoner) - _coin);
        ms.set_material(_summoner, ms.material(_summoner) - _material);
        */
        //start crafting
        ms.set_crafting_item_type(_summoner, _item_type);
        ms.set_crafting_status(_summoner, 1);
        ms.set_crafting_start_time(_summoner, block.timestamp);
        //**when resume_flag==1, _resume_dc is used for calc_crafting
    }

    //complete_crafting, crafting_status==1 & remining_time == 0
    event Crafting(uint indexed _summoner, uint _item_type, uint _item, bool _critical);
    function complete_crafting(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.crafting_status(_summoner) == 1);
        require(calc_crafting(_summoner) == 0);
        uint _now = block.timestamp;
        uint _delta_sec = (_now - ms.crafting_start_time(_summoner));
        uint _item_type = ms.crafting_item_type(_summoner);
        //stop
        ms.set_last_total_crafting_sec(_summoner, ms.last_total_crafting_sec(_summoner) + _delta_sec);
        ms.set_last_grooming_time_plus_working_time(
            _summoner, ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec);
        ms.set_crafting_status(_summoner, 0);
        //reset resume
        ms.set_crafting_resume_flag(_summoner, 0);
        //craft
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            _item_type += 64;
            _critical = true;
        }
        //mint
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint _seed = mfs.seed(_summoner);
        string memory _memo = "";
        mc.craft(_item_type, _summoner, msg.sender, _seed, _memo);
        //when normal items, mint precious and update score
        if (_item_type <= 128) {
            //_mint_precious(_summoner);
            _send_randomPresentbox(_summoner);
            //update score
            Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
            uint _total_item_crafted = mss.total_item_crafted(_summoner);
            mss.set_total_item_crafted(_summoner, _total_item_crafted + 1);
        }
        //event
        emit Crafting(_summoner, _item_type, mc.next_item()-1, _critical);
    }

    function _update_storage_nui(uint _summoner, uint _item_nui) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Nui msn = Murasaki_Storage_Nui(mfs.murasaki_storage_nui_address());
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint _now = block.timestamp;
        //set status
        msn.set_mint_time(_item_nui, _now);
        msn.set_summoner(_item_nui, _summoner);
        msn.set_class(_item_nui, mm.class(_summoner));
        msn.set_level(_item_nui, ms.level(_summoner));
        msn.set_strength(_item_nui, ms.strength(_summoner));
        msn.set_dexterity(_item_nui, ms.dexterity(_summoner));
        msn.set_intelligence(_item_nui, ms.intelligence(_summoner));
        msn.set_luck(_item_nui, ms.luck(_summoner));
        msn.set_total_exp_gained(_item_nui, mss.total_exp_gained(_summoner));
        msn.set_total_coin_mined(_item_nui, mss.total_coin_mined(_summoner));
        msn.set_total_material_farmed(_item_nui, mss.total_material_farmed(_summoner));
        msn.set_total_item_crafted(_item_nui, mss.total_item_crafted(_summoner));
        msn.set_total_precious_received(_item_nui, mss.total_precious_received(_summoner));
        msn.set_score(_item_nui, mfs.calc_score(_summoner));
    }
    //get modified dc, using codex
    function get_modified_dc(uint _summoner, uint _item_type) public view returns (uint) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.get_modified_dc(_summoner, _item_type);
    }
    //calc crafting, using codex
    function calc_crafting(uint _summoner) public view returns (uint) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.calc_crafting(_summoner);
    }
    //count crafting items, using codex
    function count_crafting_items(address _address) public view returns (uint) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.count_crafting_items(_address);
    }
    //get item dc, using codex contract
    function get_item_dc(uint _item_type) public view returns (uint[4] memory) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.get_item_dc(_item_type);
    }

    //upgrade item
    event Upgrade(uint indexed _summoner, uint _item_type, uint _item);
    function upgrade_item(
        uint _summoner, 
        uint _item1, 
        uint _item2, 
        uint _item3
    ) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //check summoner owner
        require(mfs.check_owner(_summoner, msg.sender));
        //check item owner
        require(
            mc.ownerOf(_item1) == msg.sender
            && mc.ownerOf(_item2) == msg.sender
            && mc.ownerOf(_item3) == msg.sender
        );
        //check item_type
        (uint _item_type1, , , ,) = mc.items(_item1);
        (uint _item_type2, , , ,) = mc.items(_item2);
        (uint _item_type3, , , ,) = mc.items(_item3);
        //require(_item_type1 <= 128 || (_item_type1 >= 201 && _item_type1 <= 224) );
        require(_item_type1 <= 128 || (_item_type1 >= 201 && _item_type1 <= 236) );
        require(
            _item_type2 == _item_type1
            && _item_type3 == _item_type1
        );
        
        //determine target item_type
        uint _target_item_type;
        if (_item_type1 <= 128) {
            _target_item_type = _item_type1 +64;
        // when fluffy or fluffier, +12
        } else if (_item_type1 >= 201 && _item_type1 <= 224) {
            _target_item_type = _item_type1 +12;
        // when fluffiest, -> nui-chan
        } else if (_item_type1 >=225 && _item_type1 <= 236) {
            _target_item_type = 197;
        }
        
        //pay cost, avoid too deep stack error
        _pay_cost(_summoner, _target_item_type);
        
        //burn (transfer) lower rank items
        _burn(_item1);
        _burn(_item2);
        _burn(_item3);
        //mint upper rank item
        uint _seed = mfs.seed(_summoner);
        string memory _memo = "";
        mc.craft(_target_item_type, _summoner, msg.sender, _seed, _memo);
        //when nui-chan, update nuichna score
        if (_target_item_type == 197) {
            _update_storage_nui(_summoner, mc.next_item()-1);
        }
        //event
        emit Upgrade(_summoner, _item_type1, mc.next_item());
    }
    function _pay_cost(uint _summoner, uint _target_item_type) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        //get dc, cost
        uint[4] memory _dc_table = get_item_dc(_target_item_type);
        uint _coin = _dc_table[2];
        uint _material = _dc_table[3];
        //check coin, material
        require(ms.coin(_summoner) >= _coin);
        require(ms.material(_summoner) >= _material);
        //pay coin, material
        ms.set_coin(_summoner, ms.coin(_summoner) - _coin);
        ms.set_material(_summoner, ms.material(_summoner) - _material);
    }
    
    //unpack coin/material
    event Unpack(uint indexed _summoner, uint _item_type, uint _item);
    function unpack_bag(uint _summoner, uint _item) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        require(mc.ownerOf(_item) == msg.sender);
        //check item_type
        (uint _item_type, , , ,) = mc.items(_item);
        require(_item_type == 194 || _item_type == 195);
        //burn _item
        //mc.transferFrom(msg.sender, address(this), _item);
        //_burn(msg.sender, _item);
        _burn(_item);
        //unpack coin/material
        if (_item_type == 194) {
            ms.set_coin(_summoner, ms.coin(_summoner) + 1000);
        } else if (_item_type == 195) {
            ms.set_material(_summoner, ms.material(_summoner) + 1000);
        }
        //event
        emit Unpack(_summoner, _item_type, _item);
    }
    
    //burn, internal
    //function _burn(address _owner, uint _item) internal {
    function _burn(uint _item) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //mc.transferFrom(_owner, address(this), _item);
        mc.burn(_item);
    }
    //burn mail, external, only from Murasaki_Mail
    //function burn_mail(address _owner, uint _item) external {
    function burn_mail(uint _item) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //only from Murasaki_Mail
        require(msg.sender == mfs.murasaki_mail_address());
        //_burn(_owner, _item);
        _burn(_item);
    }

    //luck challenge of mfc
    function luck_challenge(uint _summoner) public view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.luck_challenge(_summoner);
    }

    //send random presentbox
    event SendPresentbox(uint indexed _summoner_from, uint _summoner_to);
    function _send_randomPresentbox(uint _summoner_from) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        //get random _to_summoner
        uint _count_summoners = mm.next_token() - 1;
        uint _summoner_to = mfs.dn(_summoner_from, _count_summoners) + 1;
        //check _to_summoner
        bool _isActive = ms.isActive(_summoner_to);
        address _wallet_to;
        //when _summoner_to is active
        if (
            _isActive == true
            && ms.level(_summoner_to) >= 3
            && mfs.calc_satiety(_summoner_to) >= 10
            && mfs.calc_happy(_summoner_to) >= 10
        ) {
            _wallet_to = mm.ownerOf(_summoner_to);
        //when _summoner_to is not active, wallet = msg.sender
        } else {
            //_wallet_to = msg.sender;
            _wallet_to = mm.ownerOf(_summoner_from);
            _summoner_to = _summoner_from;
        }
        //mint presentbox
        _mint_presentbox(_summoner_from, _wallet_to);
        //event
        emit SendPresentbox(_summoner_from, _summoner_to);
    
    }
    //mint presentbox
    function _mint_presentbox(uint _summoner_from, address _wallet_to) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint _seed = mfs.seed(_summoner_from);
        uint _item_type = 200;
        string memory _memo = "item crafting";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo);
    }
    
    //open present box and mint precious
    //presentbox = 200
    function open_presentbox(uint _summoner, uint _item) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        require(mc.ownerOf(_item) == msg.sender);
        //check item_type
        (uint _item_type, , uint crafted_summoner, ,) = mc.items(_item);
        require(_item_type == 200);
        //burn _item
        _burn(_item);
        //mint precious
        //need: summoner_to, summoner_from, to_wallet
        _mint_precious(_summoner, crafted_summoner, msg.sender);
        //add some exp
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint _exp_add = mp.EXP_FROM_PRESENTBOX();
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        uint _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint _total_exp_gained = mss.total_exp_gained(_summoner) + _exp_add;
        mss.set_total_exp_gained(_summoner, _total_exp_gained);
    }
    //mint precious
    event Precious(uint indexed _summoner_to, uint _summoner_from, uint _item_type);
    function _mint_precious(uint _summoner_to, uint _summoner_from, address _wallet_to) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //mint precious
        uint _seed = mfs.seed(_summoner_from);
        uint _item_type = 200 + mfs.d12(_summoner_from) + 1;   //201-212
        string memory _memo = "";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint _total_precious_received = mss.total_precious_received(_summoner_to);
        mss.set_total_precious_received(_summoner_to, _total_precious_received + 1);
        //event
        emit Precious(_summoner_to, _summoner_from, _item_type);
    }
    
    //get item name
    function get_item_name(uint _item_type) public view returns (string memory) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.get_item_name(_item_type);
    }
    
}


//---Crafting_Codex


contract Murasaki_Function_Crafting_Codex is Ownable {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }

    //calc crafting
    /*  ### pattern ###
        crafting_status     resume_flag     _remining_time
               0                 0                0
               0                 1         dc * BASE_SEC/1000
               1                 0            calc from item_dc
               1                 1            calc from resume_dc
    */
    function calc_crafting(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        //when crafting=0 & resume_flag=0, return 0
        if (
            ms.crafting_status(_summoner) == 0 
            && ms.crafting_resume_flag(_summoner) == 0
        ) {
            return 0;
        //when crafting=0 & resume_flag=1, remining sec
        } else if (
            ms.crafting_status(_summoner) == 0 
            && ms.crafting_resume_flag(_summoner) == 1
        ) {
            uint BASE_SEC = mp.BASE_SEC();
            uint _dc = ms.crafting_resume_item_dc(_summoner);
            return _dc * BASE_SEC/1000;
        //when crafting=1 & resume_flag=0, calc from item_dc
        } else if (
            ms.crafting_status(_summoner) == 1
            && ms.crafting_resume_flag(_summoner) == 0
        ) {
            return _calc_crafting_noResume(_summoner);
        //when crafting=1 & resume_flag=1, calc from resume_dc
        } else if (
            ms.crafting_status(_summoner) == 1 
            && ms.crafting_resume_flag(_summoner) == 1
        ) {
            return _calc_crafting_resume(_summoner);
        }
        return 0;
    }
    function _calc_crafting_noResume(uint _summoner) internal view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        //uint SPEED = mp.SPEED();
        //uint _now = block.timestamp;
        uint _item_type = ms.crafting_item_type(_summoner);
        //## get modified dc ##
        uint _dc = get_modified_dc(_summoner, _item_type);
        //calc remaining sec
        //uint BASE_SEC = mp.BASE_SEC();
        uint _dc_sec = _dc * mp.BASE_SEC() / 1000;   //1000dc = 1day = 86400sec
        //calc remining sec
        uint _remining_time;
        uint _delta_time = ( block.timestamp - ms.crafting_start_time(_summoner) ) * mp.SPEED()/100;
        if (_delta_time >= _dc_sec) {
            _remining_time = 0;
        }else {
            _remining_time = _dc_sec - _delta_time;
        }
        return _remining_time;        
    }
    function _calc_crafting_resume(uint _summoner) internal view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        //uint SPEED = mp.SPEED();
        //uint _now = block.timestamp;
        //uint _item_type = ms.crafting_item_type(_summoner);
        //## get resume_dc ##
        uint _dc = ms.crafting_resume_item_dc(_summoner);
        //calc remaining sec
        //uint BASE_SEC = mp.BASE_SEC();
        uint _dc_sec = _dc * mp.BASE_SEC() / 1000;   //1000dc = 1day = 86400sec
        //calc remining sec
        uint _remining_time;
        uint _delta_time = ( block.timestamp - ms.crafting_start_time(_summoner) ) * mp.SPEED()/100;
        if (_delta_time >= _dc_sec) {
            _remining_time = 0;
        }else {
            _remining_time = _dc_sec - _delta_time;
        }
        return _remining_time;
    }

    //get modified_dc
    function get_modified_dc(uint _summoner, uint _item_type) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        address _owner = mfs.get_owner(_summoner);
        uint[4] memory _dc_table = get_item_dc(_item_type);
        //get dc
        uint _level = _dc_table[0];
        uint _dc = _dc_table[1];
        // when not normal items: return exact dc
        if (_item_type >= 192) {
            return _dc;
        // when normal crafting items: modified by status
        } else {
            //status boost
            //uint _mod = ms.intelligence(_summoner) + ms.level(_summoner)*100 + count_crafting_items(msg.sender);
            uint _mod = ms.intelligence(_summoner) + ms.level(_summoner)*100 + count_crafting_items(_owner);
            //initial point = 400 (1Lv*100, 3INT*100)
            //point per level = 150 (1Lv*100 + 0.5INT*100)
            //minimum dc = 3000 (3 days)
            // _mod_dc = _dc - ( _dc / (_level * 150) ) * (_mod - 400) >= 3000
            // _delta = (_mod - 400) / (_level * 150) * _dc
            // _mod_dc = _dc - _delta >= 3000
            //uint _delta = (_mod - 400) / (_level * 150) * _dc;  //original concept law, but not good
            //uint _delta = _dc * (_mod - 400) / (_level * 150);    //division should be done last
            uint _delta = _dc * (_mod - 400) / (_level * 300);    //150 -> 300, 220401
            uint _mod_dc;
            if (_dc < 3000 + _delta) {
                _mod_dc = 3000;
            } else {
                _mod_dc = _dc - _delta;
            }
            return _mod_dc;
        }
    }

    //count crafting items
    function count_crafting_items(address _address) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint[256] memory _balance_of_type = mfs.get_balance_of_type_array(_address);
        uint _crafting_items = 0;
        for (uint i = 33; i <= 48; i++) {
            if (_balance_of_type[i+128] > 0) {
                _crafting_items += 200;
            }else if (_balance_of_type[i+64] > 0) {
                _crafting_items += 150;
            }else if (_balance_of_type[i] > 0) {
                _crafting_items += 100;
            }
            //+10% per one additional items
            if (_balance_of_type[i] >= 2) {
                _crafting_items += (_balance_of_type[i] - 1) * 10;
            }
            if (_balance_of_type[i+64] >= 2) {
                _crafting_items += (_balance_of_type[i+64] - 1) * 15;
            }
            if (_balance_of_type[i+128] >= 2) {
                _crafting_items += (_balance_of_type[i+128] - 1) * 20;
            }
        }
        return _crafting_items;
    }

    //get item dc
    function get_item_dc(uint _item_type) public view returns (uint[4] memory) {
        //return: level, dc, coin, material
        uint _level = 999999;
        uint _dc = 999999;
        uint _coin = 999999;
        uint _material = 999999;

        // for crafting
        //194: coin bag
        if (_item_type == 194){
            _level = 99;
            _dc = 40;    //30min
            _coin = 1200;
            _material = 100;
        //195: material bag
        } else if (_item_type == 195) {
            _level = 99;
            _dc = 40;
            _coin = 100;
            _material = 1200;
        //196: mail
        } else if (_item_type == 196) {
            _level = 99;
            _dc = 20;
            _coin = 100;
            _material = 100;
        //1-64: normal items
        } else if (_item_type <= 64) {
            _level = level_table[_item_type];
            _dc = dc_table[_item_type];
            _coin = coin_table[_item_type];
            _material = material_table[_item_type];
            
        // for upgrading
        //65-127: common -> uncommon
        } else if (_item_type >= 65 && _item_type <= 128) {
            _coin = 200;
            _material = 200;
        //129-192: uncommon -> rare
        } else if (_item_type >= 129 && _item_type <= 192) {
            _coin = 400;
            _material = 400;
        //213-224: fluffy -> fluffier
        } else if (_item_type >= 213 && _item_type <= 224) {
            _coin = 200;
            _material = 200;
        //225-236: fluffier -> fluffiest
        } else if (_item_type >= 225 && _item_type <= 236) {
            _coin = 400;
            _material = 400;
        //197: fluffiest -> nui
        } else if (_item_type == 197) {
            _coin = 600;
            _material = 600;
        }
        return [_level, _dc, _coin, _material];
    }
    
    //get item name
    function get_item_name(uint _item_type) public view returns (string memory) {
        return item_name_table[_item_type];
    }

    //item level
    uint[64] public level_table = [
        //0:dummy
        0,
        //1-16: mining item
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        //17-32: farming item
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        //33-48: crafting item
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        //49-63: unreserved
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99,
        99
    ];

    //item dc
    uint[64] public dc_table = [
        //0:dummy
        0,
        //1-16: mining item
        3000,
        6000,
        10000,
        15000,
        21000,
        28000,
        36000,
        45000,
        55000,
        66000,
        78000,
        91000,
        105000,
        120000,
        136000,
        153000,
        //17-32: farming item
        3000,
        6000,
        10000,
        15000,
        21000,
        28000,
        36000,
        45000,
        55000,
        66000,
        78000,
        91000,
        105000,
        120000,
        136000,
        153000,
        //33-48: crafting item
        3000,
        6000,
        10000,
        15000,
        21000,
        28000,
        36000,
        45000,
        55000,
        66000,
        78000,
        91000,
        105000,
        120000,
        136000,
        153000,
        //49-63: unreserved
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999,
        9999999
    ];

    //item coin
    uint[64] public coin_table = [
        //0:dummy
        0,
        //1-16: mining item
        3000,
        3600,
        4050,
        4500,
        4950,
        5400,
        5850,
        6300,
        6750,
        7200,
        7650,
        8100,
        8550,
        9000,
        9450,
        9900,
        //17-32: farming item
        300,
        360,
        405,
        450,
        495,
        540,
        585,
        630,
        675,
        720,
        765,
        810,
        855,
        900,
        945,
        990,
        //33-48: crafting item
        1500,
        1800,
        2025,
        2250,
        2475,
        2700,
        2925,
        3150,
        3375,
        3600,
        3825,
        4050,
        4275,
        4500,
        4725,
        4950,
        //49-63: unreserved
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999
    ];

    //item material
    uint[64] public material_table = [
        //0:dummy
        0,
        //1-16: mining item
        300,
        360,
        405,
        450,
        495,
        540,
        585,
        630,
        675,
        720,
        765,
        810,
        855,
        900,
        945,
        990,
        //17-32: farming item
        3000,
        3600,
        4050,
        4500,
        4950,
        5400,
        5850,
        6300,
        6750,
        7200,
        7650,
        8100,
        8550,
        9000,
        9450,
        9900,
        //33-48: crafting item
        1500,
        1800,
        2025,
        2250,
        2475,
        2700,
        2925,
        3150,
        3375,
        3600,
        3825,
        4050,
        4275,
        4500,
        4725,
        4950,
        //49-63: unreserved
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999,
        99999
    ];
    

    //item name
    string[256] public item_name_table = [

        //1-16
        "Nameplate",
        "Mr. Astar",
        "Onigiri",
        "Helmet",
        "Dice",
        "Wall Sticker",
        "Token Chest",
        "Diary Book",
        "Fishbowl",
        "Sleeping Bed",
        "Crown",
        "Fortune Statue",
        "Cake",
        "(Item14)",
        "(Item15)",
        "Door of Travel",

        //17-32
        "Music Box",
        "Straw Hat",
        "Ms. Ether",
        "Window",
        "Cat Cushion",
        "Knit Hat",
        "Pancake",
        "Fluffy House",
        "Picture Frame",
        "Flowerpot",
        "Piano",
        "Asnya",
        "Tea Party Set",
        "(Item30)",
        "(Item31)",
        "Key to Travel",

        //33-48
        "Tablet",
        "Choco Bread",
        "Ribbon",
        "Dr. Bitco",
        "Score Meter",
        "Mortarboard",
        "News Board",
        "Light Switch",
        "Rug-Pull",
        "Cuckoo Clock",
        "Lantern",
        "Violin",
        "(Item45)",
        "(Item46)",
        "(Item47)",
        "Travel Bag",

        //49-64
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",

        //65-80
        "Uncommon Nameplate",
        "Uncommon Mr. Astar",
        "Uncommon Onigiri",
        "Uncommon Helmet",
        "Uncommon Dice",
        "Uncommon Wall Sticker",
        "Uncommon Token Chest",
        "Uncommon Diary Book",
        "Uncommon Fishbowl",
        "Uncommon Sleeping Bed",
        "Uncommon Crown",
        "Uncommon Fortune Statue",
        "Uncommon Cake",
        "Uncommon (Item14)",
        "Uncommon (Item15)",
        "Uncommon Door of Travel",

        //81-96
        "Uncommon Music Box",
        "Uncommon Straw Hat",
        "Uncommon Ms. Ether",
        "Uncommon Window",
        "Uncommon Cat Cushion",
        "Uncommon Knit Hat",
        "Uncommon Pancake",
        "Uncommon Fluffy House",
        "Uncommon Picture Frame",
        "Uncommon Flowerpot",
        "Uncommon Piano",
        "Uncommon Asnya",
        "Uncommon Tea Party Set",
        "Uncommon (Item30)",
        "Uncommon (Item31)",
        "Uncommon Key to Travel",

        //97-112
        "Uncommon Tablet",
        "Uncommon Choco Bread",
        "Uncommon Ribbon",
        "Uncommon Dr. Bitco",
        "Uncommon Score Meter",
        "Uncommon Mortarboard",
        "Uncommon News Board",
        "Uncommon Light Switch",
        "Uncommon Rug-Pull",
        "Uncommon Cuckoo Clock",
        "Uncommon Lantern",
        "Uncommon Violin",
        "Uncommon (Item45)",
        "Uncommon (Item46)",
        "Uncommon (Item47)",
        "Uncommon Travel Bag",

        //113-128
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",

        //129-144
        "Rare Nameplate",
        "Rare Mr. Astar",
        "Rare Onigiri",
        "Rare Helmet",
        "Rare Dice",
        "Rare Wall Sticker",
        "Rare Token Chest",
        "Rare Diary Book",
        "Rare Fishbowl",
        "Rare Sleeping Bed",
        "Rare Crown",
        "Rare Fortune Statue",
        "Rare Cake",
        "Rare (Item14)",
        "Rare (Item15)",
        "Rare Door of Travel",

        //145-160
        "Rare Music Box",
        "Rare Straw Hat",
        "Rare Ms. Ether",
        "Rare Window",
        "Rare Cat Cushion",
        "Rare Knit Hat",
        "Rare Pancake",
        "Rare Fluffy House",
        "Rare Picture Frame",
        "Rare Flowerpot",
        "Rare Piano",
        "Rare Asnya",
        "Rare Tea Party Set",
        "Rare (Item30)",
        "Rare (Item31)",
        "Rare Key to Travel",

        //161-176
        "Rare Tablet",
        "Rare Choco Bread",
        "Rare Ribbon",
        "Rare Dr. Bitco",
        "Rare Score Meter",
        "Rare Mortarboard",
        "Rare News Board",
        "Rare Light Switch",
        "Rare Rug-Pull",
        "Rare Cuckoo Clock",
        "Rare Lantern",
        "Rare Violin",
        "Rare (Item45)",
        "Rare (Item46)",
        "Rare (Item47)",
        "Rare Travel Bag",

        //177-192
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",

        //193
        "",
        //194
        "Coin Bank",
        //195
        "Leaf Pouch",
        //196
        "Cat Mail",
        //197
        "Fluffy Doll",
        //198
        "",
        //199
        "",
        //200
        "Present Box",
        
        //201-212
        "Gray Fluffy",
        "Beige Fluffy",
        "Limegreen Fluffy",
        "Lightblue Fluffy",
        "Blue Fluffy",
        "Purple Fluffy",
        "Redpurple Fluffy",
        "Red Fluffy",
        "Orange Fluffy",
        "Pink Fluffy",
        "Yellow Fluffy",
        "White Fluffy",
        
        //213-224
        "Gray Fluffier",
        "Beige Fluffier",
        "Limegreen Fluffier",
        "Lightblue Fluffier",
        "Blue Fluffier",
        "Purple Fluffier",
        "Redpurple Fluffier",
        "Red Fluffier",
        "Orange Fluffier",
        "Pink Fluffier",
        "Yellow Fluffier",
        "White Fluffier",

        //225-236
        "Gray Fluffiest",
        "Beige Fluffiest",
        "Limegreen Fluffiest",
        "Lightblue Fluffiest",
        "Blue Fluffiest",
        "Purple Fluffiest",
        "Redpurple Fluffiest",
        "Red Fluffiest",
        "Orange Fluffiest",
        "Pink Fluffiest",
        "Yellow Fluffiest",
        "White Fluffiest"
    ];
}


//---Name


contract Murasaki_Function_Name is Ownable, ReentrancyGuard {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }

    //admin, withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }
    
    //nameplate item_type
    uint public nameplate_item_type = 1;
    //set dice item_type
    function _set2_nameplate_item_type(uint _item_type) external onlyOwner {
        nameplate_item_type = _item_type;
    }

    //mint
    event Name(uint indexed _summoner, string _name_str, uint _name_id);
    function mint(uint _summoner, string memory _name_str) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        //owner check
        require(mfs.check_owner(_summoner, msg.sender));
        //check nameplate possession
        address _owner = mfs.get_owner(_summoner);
        require(
            mfs.get_balance_of_type_specific(_owner, nameplate_item_type) > 0
            || mfs.get_balance_of_type_specific(_owner, nameplate_item_type +64) > 0
            || mfs.get_balance_of_type_specific(_owner, nameplate_item_type +128) > 0
        );
        //name check
        require(validate_name(_name_str));
        require(mn.isMinted(_name_str) == false);
        //level check
        require(ms.level(_summoner) >= 3);
        //cost check
        uint _coin = 100;
        uint _material = 100;
        require(ms.coin(_summoner) >= _coin && ms.material(_summoner) >= _material);
        //pay cost
        ms.set_coin(_summoner, ms.coin(_summoner) - _coin);
        ms.set_material(_summoner, ms.material(_summoner) - _material);
        //mint
        uint _seed = mfs.seed(_summoner);
        mn.mint(msg.sender, _name_str, _seed);
        //event
        //emit Name(_summoner, _name_str, mn.next_name());
        emit Name(_summoner, _name_str, mn.next_token()-1);
    }

    //burn
    event Burn(uint indexed _summoner, uint _name_id);
    function burn(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        require(mfs.check_owner(_summoner, msg.sender));
        address _owner = mfs.get_owner(_summoner);
        uint _name_id = mn.tokenOf(_owner);
        require(_name_id > 0);
        mn.burn(_name_id);
        //event
        emit Burn(_summoner, _name_id);
    }

    //call_name_from_summoner
    function call_name_from_summoner(uint _summoner) external view returns (string memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        address _owner = mfs.get_owner(_summoner);
        uint _name_id = mn.tokenOf(_owner);
        string memory _name_str = mn.names(_name_id);
        return _name_str;
    }

    // from rarity_names
    // indentifying large and small capital
    // @dev Check if the name string is valid (Alphanumeric and spaces without leading or trailing space)
    function validate_name(string memory str) public pure returns (bool){
        bytes memory b = bytes(str);
        if(b.length < 1) return false;
        //if(b.length > 25) return false; // Cannot be longer than 25 characters
        if(b.length > 12) return false; // Cannot be longer than 12 characters
        if(b[0] == 0x20) return false; // Leading space
        if (b[b.length - 1] == 0x20) return false; // Trailing space
        bytes1 last_char = b[0];
        for(uint i; i<b.length; i++){
            bytes1 char = b[i];
            //if (char == 0x20 && last_char == 0x20) return false; // Cannot contain continous spaces
            if (char == 0x20) return false; // Cannot contain any spaces
            if(
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char == 0x20) //space
            )
                return false;
            last_char = char;
        }
        return true;
    }
}


//===Treasury======================================================================================================


//---bufferTreasury


//trading fee, cure fee, dapps staking reward, other fees
contract bufferTreasury is Ownable, ReentrancyGuard {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }
    
    //receivable
    receive() external payable {
    }
    fallback() external payable {
    }
    
    uint public inflationRate = 300;    //300 = 3%

    //admin, set rate
    function set_inflationRate(uint _value) external onlyOwner {
        inflationRate = _value;
    }

    //admin. withdraw all, for emergency
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }
    
    function calc_amount_by_inflationRate() public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //buybackTreasury bt = buybackTreasury(mfs.buybackTreasury_address());
        uint _balanceOfBuybackTreajury = address(mfs.buybackTreasury_address()).balance;
        uint _amountForTransfer = _balanceOfBuybackTreajury * inflationRate / 10000;
        return _amountForTransfer;
    }
    
    //transfer for buybackTreasury and teamTreasury
    //***TODO*** more complicated
    function transfer_for_buybackTreasury() external nonReentrant onlyOwner{
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint _amount_for_buybackTreasury = calc_amount_by_inflationRate();
        payable(mfs.buybackTreasury_address()).transfer(_amount_for_buybackTreasury);
        payable(mfs.teamTreasury_address()).transfer(address(this).balance);
        //payable(rec).transfer(address(this).balance);   // transfer the rest to dev wallet
        //withdraw(rec);
    }
}


//---buybackTreasury


//for buyback items
contract buybackTreasury is Ownable, ReentrancyGuard {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }

    //admin. withdraw all, for emergency
    function withdraw(address rec) public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }
    
    //receivable
    receive() external payable {
    }
    fallback() external payable {
    }

    uint public amountPaied_total = 0;
    mapping(uint => uint) public amountPaied;
    uint public total_notActivated_summoner = 0;

    //update notActivated summoner number by manually
    function _set2_total_notActivated_summoner(uint _value) external onlyOwner {
        total_notActivated_summoner = _value;
    }
    
    //***TODO*** more complicated
    // not total user but active user count is needed to be caluculated 
    // and to be used for calculation of amount per summoner value
    // need: counting petrified summoners
    function calc_amount_per_summoner() public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint _total_summoner = mm.next_token() - 1;
        uint _total_active_summoner = _total_summoner - total_notActivated_summoner;
        uint _amount_per_summoner = (amountPaied_total + address(this).balance) / _total_active_summoner;
        return _amount_per_summoner;
    }
    
    function calc_itemPrice_fromLevel(uint _item_level) public view returns (uint) {
        uint _coefficient;
        if (_item_level == 1) {
            _coefficient = 10;
        } else if (_item_level == 2) {
            _coefficient = 20;
        } else if (_item_level == 3) {
            _coefficient = 33;
        } else if (_item_level == 4) {
            _coefficient = 50;
        } else if (_item_level == 5) {
            _coefficient = 70;
        } else if (_item_level == 6) {
            _coefficient = 93;
        } else if (_item_level == 7) {
            _coefficient = 120;
        } else if (_item_level == 8) {
            _coefficient = 150;
        } else if (_item_level == 9) {
            _coefficient = 183;
        } else if (_item_level == 10) {
            _coefficient = 220;
        } else if (_item_level == 11) {
            _coefficient = 260;
        } else if (_item_level == 12) {
            _coefficient = 303;
        } else if (_item_level == 13) {
            _coefficient = 350;
        } else if (_item_level == 14) {
            _coefficient = 400;
        } else if (_item_level == 15) {
            _coefficient = 453;
        } else if (_item_level == 16) {
            _coefficient = 510;
        }
        uint _price = calc_amount_per_summoner() * _coefficient / 3227;
        return _price;
    }
    
    function calc_buybackPrice(uint _item) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        (uint _item_type, , , ,) = mc.items(_item);
        uint _item_level = _item_type % 16;
        if (_item_level == 0) {
            _item_level = 16;
        }
        uint _item_rarity;
        if (_item_type >= 129) {    //rare, x9
            _item_rarity = 9;
        } else if (_item_type >= 65) {  //uncommon, x3
            _item_rarity = 3;
        } else {    //common, x1
            _item_rarity = 1;
        }
        uint _price = calc_itemPrice_fromLevel(_item_level) * _item_rarity;
        return _price;
    }
    
    function calc_buybackPrice_asArray() public view returns (uint[17] memory) {
        uint[17] memory _res;
        _res[1] = calc_itemPrice_fromLevel(1);
        _res[2] = calc_itemPrice_fromLevel(2);
        _res[3] = calc_itemPrice_fromLevel(3);
        _res[4] = calc_itemPrice_fromLevel(4);
        _res[5] = calc_itemPrice_fromLevel(5);
        _res[6] = calc_itemPrice_fromLevel(6);
        _res[7] = calc_itemPrice_fromLevel(7);
        _res[8] = calc_itemPrice_fromLevel(8);
        _res[9] = calc_itemPrice_fromLevel(9);
        _res[10] = calc_itemPrice_fromLevel(10);
        _res[11] = calc_itemPrice_fromLevel(11);
        _res[12] = calc_itemPrice_fromLevel(12);
        _res[13] = calc_itemPrice_fromLevel(13);
        _res[14] = calc_itemPrice_fromLevel(14);
        _res[15] = calc_itemPrice_fromLevel(15);
        _res[16] = calc_itemPrice_fromLevel(16);
        return _res;
    }

    event Buyback(uint indexed _summoner, uint _item, uint _price);    
    function buyback(uint _summoner, uint _item) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        require(mm.ownerOf(_summoner) == msg.sender);
        require(mc.ownerOf(_item) == msg.sender);
        mc.safeTransferFrom(msg.sender, address(this), _item);
        uint _price = calc_buybackPrice(_item);
        //update amount paied
        amountPaied[_summoner] += _price;
        amountPaied_total += _price;
        //pay
        payable(msg.sender).transfer(_price);
        //do not exceed x2 amount per summoner after paying
        uint _amount_per_summoner = calc_amount_per_summoner();
        require(amountPaied[_summoner] <= _amount_per_summoner * 2);
        //event
        emit Buyback(_summoner, _item, _price);
    }
}


//---teamTreasury


contract teamTreasury is Ownable {
    //admin. withdraw all
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }
    //receivable
    receive() external payable {
    }
    fallback() external payable {
    }
}


//===etc==================================================================================================================


//---World_Dice


contract World_Dice is Ownable, ReentrancyGuard {

    /*

    <calculation: moving average>

    rolled_dices = [a, b, c, d]

    roll:
        req(>=20)
        now_dice = d20
        >24*4: [0,0,0,now]
        >24*3: [d,0,0,now]
        >24*2: [c,d,0,now]
        <=24*2: [b,c,d,now]

    get:
        >24*4: 0
        >24*3: d/4
        >24*2: c+d/4
        >24*1: b+c+d/4
        <=24: a+b+c+d/4

    get_now:
        rolled_dices[3]

    */

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }

    //variants
    mapping(uint => uint[4]) public rolled_dice;
    mapping(uint => uint) public last_dice_roll_time;
    uint public dice_item_type = 5;
    uint public buffer_sec = 14400;  //4 hr

    //set dice item_type
    function _set2_dice_item_type(uint _item_type) external onlyOwner {
        dice_item_type = _item_type;
    }

    //set buffer_sec
    function _set3_buffer_sec(uint _sec) external onlyOwner {
        buffer_sec = _sec;
    }

    //calc elasped_time
    function calc_elasped_time(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        if (last_dice_roll_time[_summoner] == 0) {
            return 86400 * 10;  //if not rolled yet, return 10 days
        } else {
            uint _now = block.timestamp;
            uint SPEED = mp.SPEED();
            uint _elasped_time = (_now - last_dice_roll_time[_summoner]) * SPEED/100;
            return _elasped_time;
        }
    }

    //dice roll
    event Dice_Roll(uint indexed _summoner, uint _rolled_dice);
    function dice_roll(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(mfs.check_owner(_summoner, msg.sender));
        //check dice possession
        address _owner = mfs.get_owner(_summoner);
        require(
            mfs.get_balance_of_type_specific(_owner, dice_item_type) > 0
            || mfs.get_balance_of_type_specific(_owner, dice_item_type +64) > 0
            || mfs.get_balance_of_type_specific(_owner, dice_item_type +128) > 0
        );
        //check elasped_time
        uint BASE_SEC = mp.BASE_SEC();
        uint _elasped_time = calc_elasped_time(_summoner);
        require(_elasped_time >= BASE_SEC - buffer_sec);
        //dice roll
        uint _dice_roll = (mfs.d20(_summoner) + 1) * 10;
        //update rolled_dice, after 48hr, input 0 in each 24hr
        if (_elasped_time > BASE_SEC * 4) {
            rolled_dice[_summoner] = [
                0, 
                0, 
                0, 
                _dice_roll
            ];
        } else if (_elasped_time > BASE_SEC * 3) {
            rolled_dice[_summoner] = [
                rolled_dice[_summoner][3], 
                0, 
                0, 
                _dice_roll
            ];
        } else if (_elasped_time > BASE_SEC * 2) {
            rolled_dice[_summoner] = [
                rolled_dice[_summoner][2], 
                rolled_dice[_summoner][3], 
                0, 
                _dice_roll
            ];
        } else {
            rolled_dice[_summoner] = [
                rolled_dice[_summoner][1], 
                rolled_dice[_summoner][2], 
                rolled_dice[_summoner][3], 
                _dice_roll
            ];
        }
        //update last time
        uint _now = block.timestamp;
        last_dice_roll_time[_summoner] = _now;
        //event
        emit Dice_Roll(_summoner, _dice_roll);
    }
    
    //get rolled dice, average of 4 dices
    function get_rolled_dice(uint _summoner) external view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        //get elasped_time
        uint BASE_SEC = mp.BASE_SEC();
        uint _elasped_time = calc_elasped_time(_summoner);
        //get owner of summoner
        address _owner = mfs.get_owner(_summoner);
        //calc mod_dice
        uint _mod_dice;
        //ignore when not possessed item_dice
        if (
            mfs.get_balance_of_type_specific(_owner, dice_item_type) == 0
            && mfs.get_balance_of_type_specific(_owner, dice_item_type +64) == 0
            && mfs.get_balance_of_type_specific(_owner, dice_item_type +128) == 0
        ) {
            _mod_dice = 0;
        //calc mod_dice depends on delta_sec
        // average of 3
        } else if (_elasped_time > BASE_SEC * 3) {
            _mod_dice = 0;
        } else if (_elasped_time > BASE_SEC * 2) {
            _mod_dice = (
                0 +
                0 +
                rolled_dice[_summoner][3]
                ) / 3;
        } else if (_elasped_time > BASE_SEC * 1) {
            _mod_dice = (
                0 +
                rolled_dice[_summoner][2] +
                rolled_dice[_summoner][3]
                ) / 3;
        } else {
            _mod_dice = (
                rolled_dice[_summoner][1] +
                rolled_dice[_summoner][2] +
                rolled_dice[_summoner][3]
                ) / 3;
        }
        /*
        //average of 4
        } else if (_elasped_time > BASE_SEC * 4) {
            _mod_dice = 0;
        } else if (_elasped_time > BASE_SEC * 3) {
            _mod_dice = (
                0 +
                0 +
                0 +
                rolled_dice[_summoner][3]
                ) / 4;
        } else if (_elasped_time > BASE_SEC * 2) {
            _mod_dice = (
                0 +
                0 +
                rolled_dice[_summoner][2] +
                rolled_dice[_summoner][3]
                ) / 4;
        } else if (_elasped_time > BASE_SEC * 1) {
            _mod_dice = (
                0 +
                rolled_dice[_summoner][1] +
                rolled_dice[_summoner][2] +
                rolled_dice[_summoner][3]
                ) / 4;
        } else {
            _mod_dice = (
                rolled_dice[_summoner][0] +
                rolled_dice[_summoner][1] +
                rolled_dice[_summoner][2] +
                rolled_dice[_summoner][3]
                ) / 4;
        }
        */
        return _mod_dice;
    }
    
    //get last_rolled_dice
    function get_last_rolled_dice(uint _summoner) external view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        address _owner = mfs.get_owner(_summoner);
        uint BASE_SEC = mp.BASE_SEC();
        uint _elasped_time = calc_elasped_time(_summoner);
        if (
            mfs.get_balance_of_type_specific(_owner, dice_item_type) == 0
            && mfs.get_balance_of_type_specific(_owner, dice_item_type +64) == 0
            && mfs.get_balance_of_type_specific(_owner, dice_item_type +128) == 0
        ) {
            return 0;
        } else if (_elasped_time > BASE_SEC * 1) {
            return 0;
        } else {
            return rolled_dice[_summoner][3];
        }
    }
}


//---Murasaki_Mail


contract Murasaki_Mail is Ownable, ReentrancyGuard {

    //approval required: murasaki_craft

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }
    address public murasaki_function_crafting_address;
    function _set2_murasaki_function_crafting_address(address _address) external onlyOwner {
        murasaki_function_crafting_address = _address;
    }
    
    //mail
    struct Mail {
        uint send_time;
        uint open_time;
        uint summoner_from;
        uint summoner_to;
    }
    mapping(uint => Mail) public mails;

    //mapping
    mapping(uint => uint) public sending;   //[_summoner_from] = mails;
    mapping(uint => uint) public receiving; //[_summoner_to] = mails;
    mapping(uint => uint) public total_sent;
    mapping(uint => uint) public total_opened;
    
    //variants
    //interval, both of sending interval & receving limit
    uint public interval_sec = 60 * 60 * 24 * 5;    // 5 days
    uint public item_type_of_mail = 196;
    uint public item_type_of_cushion = 21;

    //admin, set variants
    function set_interval_sec(uint _value) external onlyOwner {
        interval_sec = _value;
    }
    function set_item_type_of_mail(uint _value) external onlyOwner {
        item_type_of_mail = _value;
    }
    function set_item_type_of_cushion(uint _value) external onlyOwner {
        item_type_of_cushion = _value;
    }
        
    //check mail
    function check_receiving_mail(uint _summoner_to) public view returns (bool) {
        uint _mail_id = receiving[_summoner_to];
        //no mail
        if (_mail_id == 0) {
            return false;
        } else {
            Mail memory _mail = mails[_mail_id];
            uint _now = block.timestamp;
            uint _delta = _now - _mail.send_time;
            //expired
            if (_delta >= interval_sec) {
                return false;
            // already opend
            } else if (_mail.open_time != 0) {
                return false;
            } else {
                return true;
            }
        }
    }
    
    //calc sending interval
    function calc_sending_interval(uint _summoner_from) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint SPEED = mp.SPEED();
        uint _mail_id = sending[_summoner_from];
        //not send yet
        if (_mail_id == 0) {
            return 0;
        }
        //mail sending
        Mail memory _mail = mails[_mail_id];
        uint _now = block.timestamp;
        uint _delta = (_now - _mail.send_time) * SPEED/100;
        if (_delta >= interval_sec) {
            return 0;
        } else {
            return interval_sec - _delta;
        }
    }
    
    //check last mail open
    function check_lastMailOpen(uint _summoner_from) public view returns (bool) {
        uint _mail_id = sending[_summoner_from];
        if (_mail_id == 0) {
            return false;
        }
        Mail memory _mail = mails[_mail_id];
        if (_mail.open_time > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    //send mail, need to burn item_mail nft
    event Send_Mail(uint indexed _summoner_from, uint _summoner_to, uint _item_mail);
    function send_mail(uint _summoner_from, uint _item_mail) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        //check owner
        require(mfs.check_owner(_summoner_from, msg.sender));
        //check cushion in wallet
        address _owner = mfs.get_owner(_summoner_from);
        require(
            mfs.get_balance_of_type_specific(_owner, item_type_of_cushion) > 0
            || mfs.get_balance_of_type_specific(_owner, item_type_of_cushion+64) > 0
            || mfs.get_balance_of_type_specific(_owner, item_type_of_cushion+128) > 0
            );
        //check sending interval
        require(calc_sending_interval(_summoner_from) == 0);
        //check _item_mail nft
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        (uint _item_type, , , ,) = mc.items(_item_mail);
        require(_item_type == item_type_of_mail);
        require(mc.ownerOf(_item_mail) == msg.sender);
        //burn mail nft
        _burn_mail(_item_mail);
        //select _summoner_to
        uint _summoner_to = _select_random_summoner_to(_summoner_from);
        //prepare Mail, id = _item_mail
        uint _now = block.timestamp;
        Mail memory _mail = Mail(_now, 0, _summoner_from, _summoner_to);
        mails[_item_mail] = _mail;
        //send mail
        sending[_summoner_from] = _item_mail;
        receiving[_summoner_to] = _item_mail;
        total_sent[_summoner_from] += 1;
        //event
        emit Send_Mail(_summoner_from, _summoner_to, _item_mail);
    }
    function _select_random_summoner_to(uint _summoner_from) internal view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        uint _count_summoners = mm.next_token() - 1;
        uint _summoner_to = 0;
        uint _count = 0;
        while (_count < 5) {
            uint _summoner_tmp = mfs.dn(_summoner_from + _count, _count_summoners) + 1;
            bool _isActive = ms.isActive(_summoner_tmp);
            uint _happy = mfs.calc_happy(_summoner_tmp);
            if (
                _summoner_to == 0
                && _isActive == true
                && _happy >= 10
                && check_receiving_mail(_summoner_tmp) == false
                && _summoner_tmp != _summoner_from
            ) {
                _summoner_to = _summoner_tmp;
            }
            _count += 1;
        }
        return _summoner_to;
    }
    function _burn_mail(uint _item_mail) internal {
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(murasaki_function_crafting_address);
        //mfc.burn_mail(msg.sender, _item_mail);
        mfc.burn_mail(_item_mail);
    }
    
    //open mail
    event Open_Mail(uint indexed _summoner_to, uint _summoner_from);
    function open_mail(uint _summoner_to) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        //check owner
        require(mfs.check_owner(_summoner_to, msg.sender));
        //check receving mail
        require(check_receiving_mail(_summoner_to));
        //get mail
        uint _mail_id = receiving[_summoner_to];
        Mail storage _mail = mails[_mail_id];
        receiving[_summoner_to] = 0;
        //open mail
        uint _now = block.timestamp;
        _mail.open_time = _now;
        //mint precious
        //_mint_precious(_summoner_to, _mail.summoner_from);
        _mint_presentboxBoth(_summoner_to, _mail.summoner_from);
        total_opened[_summoner_to] += 1;
        //event
        emit Open_Mail(_summoner_to, _mail.summoner_from);
    }
    function _mint_presentboxBoth(uint _summoner_to, uint _summoner_from) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        _mint_presentbox(_summoner_from, mm.ownerOf(_summoner_to));
        _mint_presentbox(_summoner_to, mm.ownerOf(_summoner_from));
    }
    function _mint_presentbox(uint _summoner_from, address _wallet_to) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint _seed = mfs.seed(_summoner_from);
        uint _item_type = 200;
        string memory _memo = "mail opening";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo);
    }    
    /*
    event Precious(uint indexed _summoner_to, uint _summoner_from, uint _item_type);
    function _mint_precious(uint _summoner_to, uint _summoner_from) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint _seed = mfs.seed(_summoner_to);
        uint _item_type = 200 + mfs.d10(_summoner_to) + 1;   //201-212
        mc.craft(_item_type, _summoner_from, mm.ownerOf(_summoner_to), _seed);
        mc.craft(_item_type, _summoner_to, mm.ownerOf(_summoner_from), _seed);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint _total_precious_received = mss.total_precious_received(_summoner_to);
        mss.set_total_precious_received(_summoner_to, _total_precious_received + 1);
        _total_precious_received = mss.total_precious_received(_summoner_from);
        mss.set_total_precious_received(_summoner_from, _total_precious_received + 1);
        emit Precious(_summoner_to, _summoner_from, _item_type);
        //ms.set_heart(_summoner_to, ms.heart(_summoner_to) + 1);
        //ms.set_heart(_summoner_from, ms.heart(_summoner_from) + 1);
    }
    */
    /*
    function _create_tiny_heart(uint _summoner_to, uint _summoner_from) internal {
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(murasaki_function_crafting_address);
        mfc.create_tiny_heart(_summoner_to, _summoner_from);
    }
    */
}


//---Murasaki_Lootlike


contract Murasaki_Lootlike is Ownable {

    //address
    address public murasaki_function_share_address;

    //admin, set address
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }
    
    function get_birthplace(uint _summoner) public view returns (string memory) {
        return pluckName(_summoner, "birthplace", birthplace);
    }
    function get_softness(uint _summoner) public view returns (string memory) {
        return pluckName(_summoner, "softness", softness);
    }
    function get_fluffiness(uint _summoner) public view returns (string memory) {
        return pluckName(_summoner, "fluffiness", fluffiness);
    }
    function get_elasticity(uint _summoner) public view returns (string memory) {
        return pluckName(_summoner, "elasticity", elasticity);
    }
    function get_personality(uint _summoner) public view returns (string memory) {
        return pluckName(_summoner, "personality", personality);
    }
    function get_flower(uint _summoner) public view returns (string memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint _class = mm.class(_summoner);
        return flower[_class];
    }
    function get_street(uint _summoner) public view returns (string memory) {
        return pluckName(_summoner, "street", street);
    }
    function get_city(uint _summoner) public view returns (string memory) {
        return pluckName(_summoner, "city", city);
    }
    function get_allStatus(uint _summoner) public view returns (string[8] memory) {
        string[8] memory _status;
        _status[0] = get_birthplace(_summoner);
        _status[1] = get_softness(_summoner);
        _status[2] = get_fluffiness(_summoner);
        _status[3] = get_elasticity(_summoner);
        _status[4] = get_personality(_summoner);
        _status[5] = get_flower(_summoner);        
        _status[6] = get_street(_summoner);        
        _status[7] = get_city(_summoner);        
        return _status;
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
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
    
    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function pluckName(uint _summoner, string memory keyPrefix, string[] memory sourceArray) internal view returns (string memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        address _owner = mfs.get_owner(_summoner);
        //address _owner = address(this);
        uint256 rand = random(string(abi.encodePacked(keyPrefix, abi.encodePacked(_owner, toString(_summoner)))));
        string memory output = sourceArray[rand % sourceArray.length];
        return output;
    }

    string[] private birthplace = [
        "Fluffy Sweater",
        "Fluffy Blanket",
        "Fluffy Carpet",
        "Fluffy Cushion",
        "Fluffy Scarf",
        "Fluffy Towel",
        "Woolly Sweater",
        "Woolly Blanket",
        "Woolly Carpet",
        "Woolly Cushion",
        "Woolly Scarf",
        "Wwoolly Towel",
        "Feathery Sweater",
        "Feathery Blanket",
        "Feathery Carpet",
        "Feathery Cushion",
        "Ffeathery Scarf",
        "Ffeathery Towel"
    ];
    
    string[] private softness = [
        "Inredible",
        "Marvelous",
        "Excellent",
        "Amazing",
        "Great",
        "Fabulous",
        "Wonderful",
        "Gorgeous",
        "Awesome",
        "Fantastic",
        "Lovely",
        "Brilliant",
        "Impressive",
        "Superb"
    ];
    
    string[] private fluffiness = [
        "Inredible",
        "Marvelous",
        "Excellent",
        "Amazing",
        "Great",
        "Fabulous",
        "Wonderful",
        "Gorgeous",
        "Awesome",
        "Fantastic",
        "Lovely",
        "Brilliant",
        "Impressive",
        "Superb"
    ];

    string[] private elasticity = [
        "Inredible",
        "Marvelous",
        "Excellent",
        "Amazing",
        "Great",
        "Fabulous",
        "Wonderful",
        "Gorgeous",
        "Awesome",
        "Fantastic",
        "Lovely",
        "Brilliant",
        "Impressive",
        "Superb"
    ];
    
    string[] private personality = [
        "Friendly",
        "Reliable",
        "Optimistic",
        "Frisky",
        "Thoughtful",
        "Honest",
        "Easygoing",
        "Tolerant",
        "Mild",
        "Affectionate",
        "Intelligent",
        "Patient",
        "Faithful",
        "Innocent",
        "Gentle"
    ];
    
    string[] private flower = [
        "Rose",
        "Marigold",
        "Dandelion",
        "Rosemary",
        "Olive",
        "Holly",
        "Nemophila",
        "Hydrangea",
        "Forget-me-not",
        "Sumire",
        "Gerbera",
        "Anemone"
    ];
    
    string[] private city = [
        "Garnet City",
        "Amethyst City",
        "Aquamarine City",
        "Diamond City",
        "Emerald City",
        "Pearl City",
        "Ruby Town",
        "Peridot Town",
        "Sapphire Town",
        "Opal Town",
        "Topaz Town",
        "Turquoise Town"
    ];

    string[] private street = [
        "Apple Ave",
        "Strawberry Ave",
        "Avocado Ave",
        "Orange Ave",
        "Raspberry Ave",
        "Kiwi Ave",
        "Grapefrit Ave",
        "Coconut Ave",
        "Cherry Ave",
        "Pineapple Ave",
        "Banana Ave",
        "Grape Ave",
        "Blueberry Ave",
        "Muskmelon Ave",
        "Mango Ave",
        "Peach Ave",
        "Yuzu Ave",
        "Lemon Ave",
        "Lime Ave",
        "Pumpkin St",
        "Cabbage St",
        "Cucumber St",
        "Sesami St",
        "Potato St",
        "Ginger St",
        "Leek St",
        "Soybean St",
        "Onion St",
        "Tomato St",
        "Carrot St",
        "Garlic St",
        "Basil St",
        "Paprika St",
        "Broccoli St",
        "Lotus St",
        "Califlower St",
        "Bamboo St",
        "Eggplant St"
    ];
}


//---Murasaki_Info

contract Murasaki_Info is Ownable {

    //address
    address public murasaki_function_share_address;
    address public murasaki_function_mining_and_farming_address;
    address public murasaki_function_crafting_address;
    address public murasaki_function_feeding_and_grooming_address;
    address public fluffy_festival_address;
    
    //admin, set address
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }
    function _set2_murasaki_function_mining_and_farming_address(address _address) external onlyOwner {
        murasaki_function_mining_and_farming_address = _address;
    }
    function _set3_murasaki_function_crafting_address(address _address) external onlyOwner {
        murasaki_function_crafting_address = _address;
    }
    function _set4_murasaki_function_feeding_and_grooming_address(address _address) external onlyOwner {
        murasaki_function_feeding_and_grooming_address = _address;
    }
    function _set5_fluffy_festival_address(address _address) external onlyOwner {
        fluffy_festival_address = _address;
    }
    
    //Murasaki_Main
    function owner(uint _summoner) public view returns (address) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.get_owner(_summoner);
    }
    function class(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        return mm.class(_summoner);
    }
    function age(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint _now = block.timestamp;
        uint _age = _now - mm.summoned_time(_summoner);
        return _age;
    }
    
    //Murasaki_Name
    function name(uint _summoner) public view returns (string memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        return mn.names(_summoner);
    }
    
    /*
    //Murasaki_Craft
    function balance_of_item(uint _summoner) public view returns (uint[256] memory) {
        address _owner = owner(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        return mc.get_balance_of_type(_owner);
    }
    */
    
    //Murasaki_Storage
    function level(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.level(_summoner);
    }
    function exp(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.exp(_summoner);
    }
    function strength(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.strength(_summoner);
    }
    function dexterity(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.dexterity(_summoner);
    }
    function intelligence(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.intelligence(_summoner);
    }
    function luck(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.luck(_summoner);
    }
    function next_exp_required(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.next_exp_required(_summoner);
    }
    /*
    function last_level_up_time(uint _summoner) external view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_level_up_time(_summoner);
    }
    */
    function coin(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.coin(_summoner);
    }
    function material(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.material(_summoner);
    }
    function last_feeding_time(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_feeding_time(_summoner);
    }
    function last_grooming_time(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_grooming_time(_summoner);
    }
    function mining_status(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.mining_status(_summoner);
    }
    function mining_start_time(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.mining_start_time(_summoner);
    }
    function farming_status(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.farming_status(_summoner);
    }
    function farming_start_time(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.farming_start_time(_summoner);
    }
    function crafting_status(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.crafting_status(_summoner);
    }
    function crafting_start_time(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.crafting_start_time(_summoner);
    }
    function crafting_item_type(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.crafting_item_type(_summoner);
    }
    /*
    function total_mining_sec(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.total_mining_sec(_summoner);
    }
    function total_farming_sec(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.total_farming_sec(_summoner);
    }
    function total_crafting_sec(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.total_crafting_sec(_summoner);
    }
    */
    function staking_reward_counter(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.staking_reward_counter(_summoner);
    }
    /*
    function last_grooming_time_plus_working_time(uint _summoner) external view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_grooming_time_plus_working_time(_summoner);
    }
    */

    //Murasaki_Storage_Score
    function total_exp_gained(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_exp_gained(_summoner);
    }
    function total_coin_mined(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_coin_mined(_summoner);
    }
    function total_material_farmed(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_material_farmed(_summoner);
    }
    function total_item_crafted(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_item_crafted(_summoner);
    }
    function total_precious_received(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_precious_received(_summoner);
    }
    
    //Function_Share
    function satiety(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_satiety(_summoner);
    }
    function happy(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_happy(_summoner);
    }
    function precious(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_precious(_summoner);
    }
    function not_petrified(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        bool _res = mfs.not_petrified(_summoner);
        if (_res == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    function dapps_staking_amount(uint _summoner) public view returns (uint) {
        address _owner = owner(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_dapps_staking_amount(_owner);
    }
    function score(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_score(_summoner);
    }
    function get_speed_of_dappsStaking(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.get_speed_of_dappsStaking(_summoner);
    }
    
    //Function_Working
    function calc_mining(uint _summoner) public view returns (uint) {
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(murasaki_function_mining_and_farming_address);
        return mfmf.calc_mining(_summoner);
    }
    function calc_farming(uint _summoner) public view returns (uint) {
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(murasaki_function_mining_and_farming_address);
        return mfmf.calc_farming(_summoner);
    }
    function calc_crafting(uint _summoner) public view returns (uint) {
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(murasaki_function_crafting_address);
        return mfc.calc_crafting(_summoner);
    }
    function strength_withItems(uint _summoner) public view returns (uint) {
        address _owner = owner(_summoner);
        uint _str = strength(_summoner);
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(murasaki_function_mining_and_farming_address);
        _str += mfmf.count_mining_items(_owner);
        return _str;
    }
    function dexterity_withItems(uint _summoner) public view returns (uint) {
        address _owner = owner(_summoner);
        uint _dex = dexterity(_summoner);
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(murasaki_function_mining_and_farming_address);
        _dex += mfmf.count_farming_items(_owner);
        return _dex;
    }
    function intelligence_withItems(uint _summoner) public view returns (uint) {
        address _owner = owner(_summoner);
        uint _int = intelligence(_summoner);
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(murasaki_function_crafting_address);
        _int += mfc.count_crafting_items(_owner);
        return _int;
    }
    function luck_withItems(uint _summoner) public view returns (uint) {
        uint _luk = luck(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        _luk += mfs.calc_precious(_summoner);
        return _luk;
    }
    /*
    function luck_withItems_withStaking(uint _summoner) public view returns (uint) {
        uint _luk = luck_withItems(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        _luk += mfs.get_luck_by_staking(_summoner);
        return _luk;
    }
    */
    function calc_feeding(uint _summoner) public view returns (uint) {
        Murasaki_Function_Feeding_and_Grooming mffg = Murasaki_Function_Feeding_and_Grooming(murasaki_function_feeding_and_grooming_address);
        return mffg.calc_feeding(_summoner);
    }
    function calc_grooming(uint _summoner) public view returns (uint) {
        Murasaki_Function_Feeding_and_Grooming mffg = Murasaki_Function_Feeding_and_Grooming(murasaki_function_feeding_and_grooming_address);
        return mffg.calc_grooming(_summoner);
    }
    
    //Dice
    function last_rolled_dice(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        World_Dice wd = World_Dice(mfs.world_dice_address());
        return wd.get_last_rolled_dice(_summoner);
    }
    function last_dice_roll_time(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        World_Dice wd = World_Dice(mfs.world_dice_address());
        return wd.last_dice_roll_time(_summoner);
    }
    function luck_withItems_withDice(uint _summoner) public view returns (uint) {
        uint _luk = luck_withItems(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        World_Dice wd = World_Dice(mfs.world_dice_address());
        _luk += wd.get_rolled_dice(_summoner);
        return _luk;
    }
    
    //Mail
    function receiving_mail(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Mail mml = Murasaki_Mail(mfs.murasaki_mail_address());
        bool _res = mml.check_receiving_mail(_summoner);
        if (_res == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    function sending_interval(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Mail mml = Murasaki_Mail(mfs.murasaki_mail_address());
        return mml.calc_sending_interval(_summoner);
    }
    function check_lastMailOpen(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Mail mml = Murasaki_Mail(mfs.murasaki_mail_address());
        bool _res = mml.check_lastMailOpen(_summoner);
        if (_res == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    
    //Lootlike
    function allStatus(uint _summoner) public view returns (string[8] memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Lootlike mll = Murasaki_Lootlike(mfs.murasaki_lootlike_address());
        return mll.get_allStatus(_summoner);
    }
    
    //isActive
    function isActive(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        bool _isActive = ms.isActive(_summoner);
        if (_isActive == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    
    //inHouse
    function inHouse(uint _summoner) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        bool _inHouse = ms.inHouse(_summoner);
        if (_inHouse == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    
    //fluffy festival
    /*
    function check_votable(uint _summoner) public view returns (uint) {
        Fluffy_Festival ff = Fluffy_Festival(fluffy_festival_address);
        bool _isVotable = ff.check_votable(_summoner);
        if (_isVotable == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    function inSession() public view returns (uint) {
        Fluffy_Festival ff = Fluffy_Festival(fluffy_festival_address);
        bool _inSession = ff.inSession();
        if (_inSession == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    */
    function next_festival_block() public view returns (uint) {
        Fluffy_Festival ff = Fluffy_Festival(fluffy_festival_address);
        return ff.next_festival_block();
    }
    
    //parameter
    function speed() public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        return mp.SPEED();
    }
    function price() public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        return mp.PRICE();
    }
    function staking_reward_sec() public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        return mp.STAKING_REWARD_SEC();
    }
    function elected_fluffy_type() public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        return mp.ELECTED_FLUFFY_TYPE();
    }
    
    //###dynamic
    function allDynamicStatus(uint _summoner) external view returns (uint[64] memory) {
        uint[64] memory _res;
        _res[0] = block.number;
        _res[1] = age(_summoner);
        _res[2] = level(_summoner);
        _res[3] = exp(_summoner);
        _res[4] = strength(_summoner);
        _res[5] = dexterity(_summoner);
        _res[6] = intelligence(_summoner);
        _res[7] = luck(_summoner);
        _res[8] = next_exp_required(_summoner);
        _res[9] = coin(_summoner);
        _res[10] = material(_summoner);
        _res[11] = last_feeding_time(_summoner);
        _res[12] = last_grooming_time(_summoner);
        _res[13] = mining_status(_summoner);
        _res[14] = mining_start_time(_summoner);
        _res[15] = farming_status(_summoner);
        _res[16] = farming_start_time(_summoner);
        _res[17] = crafting_status(_summoner);
        _res[18] = crafting_start_time(_summoner);
        _res[19] = crafting_item_type(_summoner);
        //_res[20] = total_mining_sec(_summoner);
        //_res[21] = total_farming_sec(_summoner);
        //_res[22] = total_crafting_sec(_summoner);
        _res[23] = total_exp_gained(_summoner);
        _res[24] = total_coin_mined(_summoner);
        _res[25] = total_material_farmed(_summoner);
        _res[26] = total_item_crafted(_summoner);
        _res[27] = total_precious_received(_summoner);
        _res[28] = satiety(_summoner);
        _res[29] = happy(_summoner);
        _res[30] = precious(_summoner);
        _res[31] = not_petrified(_summoner);
        _res[32] = dapps_staking_amount(_summoner);
        //_res[33] = luck_by_staking(_summoner);
        _res[34] = score(_summoner);
        _res[35] = strength_withItems(_summoner);
        _res[36] = dexterity_withItems(_summoner);
        _res[37] = intelligence_withItems(_summoner);
        _res[38] = luck_withItems(_summoner);
        //_res[39] = luck_withItems_withStaking(_summoner);
        _res[40] = last_rolled_dice(_summoner);
        _res[41] = last_dice_roll_time(_summoner);
        //_res[42] = luck_withItems_withStaking_withDice(_summoner);
        _res[42] = luck_withItems_withDice(_summoner);
        _res[43] = receiving_mail(_summoner);
        _res[44] = sending_interval(_summoner);
        _res[45] = isActive(_summoner);
        _res[46] = calc_mining(_summoner);
        _res[47] = calc_farming(_summoner);
        _res[48] = calc_crafting(_summoner);
        _res[49] = inHouse(_summoner);
        _res[50] = check_lastMailOpen(_summoner);
        //_res[51] = luck_challenge_of_mffg(_summoner);
        //_res[52] = luck_challenge_of_mfmf(_summoner);
        //_res[53] = luck_challenge_of_mfc(_summoner);
        _res[54] = calc_feeding(_summoner);
        _res[55] = calc_grooming(_summoner);
        _res[56] = staking_reward_counter(_summoner);
        //_res[57] = check_votable(_summoner);
        _res[58] = get_speed_of_dappsStaking(_summoner);
        //_res[59] = inSession();
        _res[60] = next_festival_block();
        return _res;
    }
    
    //###static
    function allStaticStatus(uint _summoner) external view returns (
        uint,
        address,
        string memory,
        string[8] memory,
        uint,
        uint,
        uint,
        uint
    ) {
        uint _class = class(_summoner);
        address _owner = owner(_summoner);
        string memory _name = name(_summoner);
        string[8] memory lootStatus = allStatus(_summoner);
        return (
            _class, 
            _owner, 
            _name, 
            lootStatus,
            speed(),
            price(),
            staking_reward_sec(),
            elected_fluffy_type()
        );
    }

    //item
    function allItemBalance(uint _summoner) public view returns (uint[256] memory) {
        address _owner = owner(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        return mc.get_balance_of_type(_owner);
    }
    
    function allItemId_withItemType(uint _summoner) public view returns (uint[] memory) {
        address _owner = owner(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint _myListLength = mc.myListLength(_owner);
        return mc.myListsAt_withItemType(_owner, 0, _myListLength);
    }
}


//---Murasaki_Info_fromWallet


interface IMurasaki_Info_fromWallet {

    // Murasaki-san ID of wallet
    function summoner   (address _wallet) external view returns (uint);

    // Basic informations
    function class  (address _wallet) external view returns (uint);
    function age    (address _wallet) external view returns (uint);
    function name   (address _wallet) external view returns (string memory);
    function level  (address _wallet) external view returns (uint);

    // Character
    function birthplace  (address _wallet) external view returns (string memory);
    function softness    (address _wallet) external view returns (string memory);
    function fluffiness  (address _wallet) external view returns (string memory);
    function elasticity  (address _wallet) external view returns (string memory);
    function personality (address _wallet) external view returns (string memory);
    function flower      (address _wallet) external view returns (string memory);

    // Address
    function street      (address _wallet) external view returns (string memory);
    function city        (address _wallet) external view returns (string memory);

    // Parameters
    function strength       (address _wallet) external view returns (uint);
    function dexterity      (address _wallet) external view returns (uint);
    function intelligence   (address _wallet) external view returns (uint);
    function luck           (address _wallet) external view returns (uint);

    // Parameters with item modification
    function strength_withItems      (address _wallet) external view returns (uint);
    function dexterity_withItems     (address _wallet) external view returns (uint);
    function intelligence_withItems  (address _wallet) external view returns (uint);
    function luck_withItems          (address _wallet) external view returns (uint);
    function luck_withItems_withDice (address _wallet) external view returns (uint);
    
    // Present status, material means leaf, precious means fluffy_score
    function satiety    (address _wallet) external view returns (uint);
    function happy      (address _wallet) external view returns (uint);
    function exp        (address _wallet) external view returns (uint);
    function coin       (address _wallet) external view returns (uint);
    function material   (address _wallet) external view returns (uint);
    function precious   (address _wallet) external view returns (uint);

    // Scores
    function score                      (address _wallet) external view returns (uint);
    function total_exp_gained           (address _wallet) external view returns (uint);
    function total_coin_mined           (address _wallet) external view returns (uint);
    function total_material_farmed      (address _wallet) external view returns (uint);
    function total_item_crafted         (address _wallet) external view returns (uint);
    function total_precious_received    (address _wallet) external view returns (uint);

    // etc
    function not_petrified  (address _wallet) external view returns (uint);
    function isActive       (address _wallet) external view returns (uint);
    function inHouse        (address _wallet) external view returns (uint);
}


contract Murasaki_Info_fromWallet is Ownable, IMurasaki_Info_fromWallet {

    //address
    address public murasaki_function_share_address;
    address public murasaki_info_address;
    
    //admin, set address
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }
    function _set2_murasaki_info_address(address _address) external onlyOwner {
        murasaki_info_address = _address;
    }

    //summoner
    function summoner(address _wallet) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint _summoner = mm.tokenOf(_wallet);
        if (_summoner == 0) {
            return 0;
        }
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        bool _isActive = ms.isActive(_summoner);
        if (_isActive) {
            return _summoner;
        } else {
            return 0;
        }
    }
    
    //class
    function class(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.class(summoner(_wallet));
    }
    //age
    function age(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.age(summoner(_wallet));
    }
    //name
    function name(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.name(summoner(_wallet));
    }
    //level
    function level(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.level(summoner(_wallet));
    }
    //exp
    function exp(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.exp(summoner(_wallet));
    }
    //strength
    function strength(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.strength(summoner(_wallet));
    }
    //dexterity
    function dexterity(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.dexterity(summoner(_wallet));
    }
    //intelligence
    function intelligence(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.intelligence(summoner(_wallet));
    }
    //luck
    function luck(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.luck(summoner(_wallet));
    }
    //coin
    function coin(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.coin(summoner(_wallet));
    }
    //material
    function material(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.material(summoner(_wallet));
    }
    //total_exp_gained
    function total_exp_gained(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.total_exp_gained(summoner(_wallet));
    }
    //total_coin_mined
    function total_coin_mined(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.total_coin_mined(summoner(_wallet));
    }
    //total_material_farmed
    function total_material_farmed(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.total_material_farmed(summoner(_wallet));
    }
    //total_item_crafted
    function total_item_crafted(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.total_item_crafted(summoner(_wallet));
    }
    //total_precious_received
    function total_precious_received(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.total_precious_received(summoner(_wallet));
    }
    //satiety
    function satiety(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.satiety(summoner(_wallet));
    }
    //happy
    function happy(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.happy(summoner(_wallet));
    }
    //precious
    function precious(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.precious(summoner(_wallet));
    }
    //not_petrified
    function not_petrified(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.not_petrified(summoner(_wallet));
    }
    //score
    function score(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.score(summoner(_wallet));
    }
    //strength_withItems
    function strength_withItems(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.strength_withItems(summoner(_wallet));
    }
    //dexterity_withItems
    function dexterity_withItems(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.dexterity_withItems(summoner(_wallet));
    }
    //intelligence_withItems
    function intelligence_withItems(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.intelligence_withItems(summoner(_wallet));
    }
    //luck_withItems
    function luck_withItems(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.luck_withItems(summoner(_wallet));
    }
    //luck_withItems_withDice
    function luck_withItems_withDice(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.luck_withItems_withDice(summoner(_wallet));
    }
    //isActive
    function isActive(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.isActive(summoner(_wallet));
    }
    //inHouse
    function inHouse(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.inHouse(summoner(_wallet));
    }
    //birthplace
    function birthplace(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.allStatus(summoner(_wallet))[0];
    }
    //softness
    function softness(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.allStatus(summoner(_wallet))[1];
    }
    //fluffiness
    function fluffiness(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.allStatus(summoner(_wallet))[2];
    }
    //elasticity
    function elasticity(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.allStatus(summoner(_wallet))[3];
    }
    //personality
    function personality(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.allStatus(summoner(_wallet))[4];
    }
    //flower
    function flower(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.allStatus(summoner(_wallet))[5];
    }
    //street
    function street(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.allStatus(summoner(_wallet))[6];
    }
    //city
    function city(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        return mi.allStatus(summoner(_wallet))[7];
    }
}


//---Fluffy_Festival


contract Fluffy_Festival is Ownable, ReentrancyGuard {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }
    //admin withdraw all
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }
    
    //global variants
    uint public ELECTION_PERIOD_BLOCK = 7200; //1 days, 12sec/block
    uint public LEVEL_REQUIRED = 1;
    uint public SATIETY_REQUIRED = 10;
    uint public HAPPY_REQUIRED = 10;
    uint public ELECTION_INTERVAL_BLOCK = 216000; //30 days, 12sec/block
    bool public inSession;
    bool public isActive = true;
    uint public elected_type = 0;
    uint public previous_elected_type = 0;
    
    //admin, change global variants
    function _setA_election_period_block(uint  _value) external onlyOwner {
        ELECTION_PERIOD_BLOCK = _value;
    }
    function _setB_level_required(uint  _value) external onlyOwner {
        LEVEL_REQUIRED = _value;
    }
    function _setC_satiety_required(uint  _value) external onlyOwner {
        SATIETY_REQUIRED = _value;
    }
    function _setD_happy_required(uint  _value) external onlyOwner {
        HAPPY_REQUIRED = _value;
    }
    function _setE_election_interval_block(uint  _value) external onlyOwner {
        ELECTION_INTERVAL_BLOCK = _value;
    }
    function _setF_inSession(bool _bool) external onlyOwner {
        inSession = _bool;
    }
    function _setG_isActive(bool _bool) external onlyOwner {
        isActive = _bool;
    }
    
    //admin, modify subject parameters for maintenance
    function _modify_subject(
        uint _subject_no,
        uint _start_block,
        uint _end_block,
        uint _start_step,
        uint _end_step,
        uint _elected_type
    ) external onlyOwner {
        subjects[_subject_no] = Subject(
            _start_block, 
            _end_block, 
            _start_step, 
            _end_step,
            _elected_type
        );
    }

    //subject
    uint subject_now = 0;
    struct Subject {
        uint start_block;
        uint end_block;
        uint start_step;
        uint end_step;
        uint elected_type;
    }
    mapping(uint => Subject) public subjects;
    
    //vote
    uint next_vote = 1;
    struct vote {
        uint blocknumber;
        uint summoner;
        uint value;
    }
    mapping(uint => vote) public votes;
    uint[256] each_voting_count;
    mapping(uint => uint) public last_voting_block; //summoner => blocknumber
    mapping(uint => uint) public last_voting_type;  //summoner => fluffy_type
    
    //step
    uint next_step = 1;
    mapping(uint => uint) public winner_inStep;

    //Voting
    event Start_Voting(uint indexed _summoner);
    event Voting(uint indexed _summoner, uint _select);
    function voting(uint _summoner, uint _select) external nonReentrant {
        //check ff active
        require(isActive);
        //check owner
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        require(mfs.check_owner(_summoner, msg.sender));
        //check summoner
        require(_check_summoner(_summoner));
        //reject present and previous elected type
        require(_select != elected_type);
        require(_select != previous_elected_type);
        require(_select >= 201 && _select <= 212);
        //check fist voting
        if ( check_start_voting() ){
            emit Start_Voting(_summoner);
            _start_voting(msg.sender);
        }
        //check votable of summoner
        require(check_votable(_summoner));
        //vote
        uint _block = block.number;
        votes[next_vote] = vote(_block, _summoner, _select);
        last_voting_block[_summoner] = _block;
        last_voting_type[_summoner] = _select;
        each_voting_count[_select] += 1;
        next_vote += 1;
        //update winner in step
        winner_inStep[next_step] = _get_winner_inStep_now();
        next_step += 1;
        //mint presentbox
        string memory _memo = "participation award";
        _mint_presentbox(uint(0), msg.sender, _memo);
        //check final voting
        if ( check_end_voting() ) {
            _end_voting(_summoner, msg.sender);
        }
        emit Voting(_summoner, _select);
    }
    function check_votable(uint _summoner) public view returns (bool) {
        //get subject_now
        Subject memory _subject = subjects[subject_now];
        if (
            //can star voting
            check_start_voting()
            //or after start, meet the all condition
            || (
                //check in session
                inSession
                //check not have already voted
                && _subject.start_block > last_voting_block[_summoner]
            )
        ){
            return true;
        } else {
            return false;
        }
    }
    function _check_summoner (uint _summoner) internal view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        if (
            //check pause
            mp.isPaused() == false
            //check owner
            //&& mfs.check_owner(_summoner, _wallet)
            //check summoner status
            && ms.inHouse(_summoner)
            && mfs.calc_satiety(_summoner) >= SATIETY_REQUIRED
            && mfs.calc_happy(_summoner) >= HAPPY_REQUIRED
            && ms.level(_summoner) >= LEVEL_REQUIRED
        ){
            return true;
        } else {
            return false;
        }
    }
    function _get_winner_inStep_now() internal view returns (uint) {
        //return fluffy type with the biggest voting count
        //when equal, smaller type number win
        uint _winner = 0;
        uint _voted = 0;
        for (uint i=201; i<=212; i++) {
            if (each_voting_count[i] > _voted) {
                _winner = i;
                _voted = each_voting_count[i];
            }
        }
        return _winner;
    }
    function _mint_presentbox(uint _summoner, address _wallet_to, string memory _memo) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint _seed = mfs.seed(_summoner);
        uint _item_type = 200;
        mc.craft(_item_type, _summoner, _wallet_to, _seed, _memo);
    }
    
    //start voting
    function check_start_voting() public view returns (bool) {
        //check blocknumber
        Subject memory _subject = subjects[subject_now];
        if (block.number >= _subject.start_block + ELECTION_INTERVAL_BLOCK) {
            return true;
        } else {
            return false;
        }
    }
    function _start_voting(address _starter) internal {
        //create and initialize subject
        uint _block = block.number;
        subject_now += 1;
        subjects[subject_now] = Subject(
            _block, 
            _block + ELECTION_PERIOD_BLOCK, 
            next_step, 
            0,
            0
        );
        //reset voting count
        for (uint i=201; i<=212; i++) {
            each_voting_count[i] = 0;
        }
        //voting in session
        inSession = true;
        //bonus mint
        string memory _memo = "first vote bonus";
        _mint_presentbox(uint(0), _starter, _memo);
        //emit Start_Voting(_summoner);
    }
    
    //end voting
    function check_end_voting() public view returns (bool) {
        //check blocknumber
        if (block.number >= subjects[subject_now].end_block && inSession) {
            return true;
        } else {
            return false;
        }
    }
    //public, executable without voting
    event End_Voting(uint indexed _summoner, uint _winner);
    /*
    function end_voting(uint _summoner) public nonReentrant {
        require(
            _check_summoner(_summoner)
            && check_end_voting()
        );
        //update session status
        inSession = false;
        //select winner
        uint _winner = _select_winner(_summoner);
        //update mp parameter
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        mp._set_elected_fluffy_type(_winner);
        //insert end step into last subject
        subjects[subject_now].end_step = next_step - 1;
        //update elected type
        subjects[subject_now].elected_type = _winner;
        previous_elected_type = elected_type;
        elected_type = _winner;
        //vonus mint
        string memory _memo = "final vote bonus";
        _mint_presentbox(uint(0), msg.sender, _memo);
        emit End_Voting(_summoner, _winner);
    }
    */
    function end_voting(uint _summoner) external nonReentrant {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        require(mfs.check_owner(_summoner, msg.sender));
        require(_check_summoner(_summoner));
        _end_voting(_summoner, msg.sender);
    }
    function _end_voting(uint _summoner, address _ender) internal {
        //update session status
        inSession = false;
        //select winner
        uint _winner = _select_winner(_summoner);
        //update mp parameter
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        mp._set_elected_fluffy_type(_winner);
        //insert end step into last subject
        subjects[subject_now].end_step = next_step - 1;
        //update elected type
        subjects[subject_now].elected_type = _winner;
        previous_elected_type = elected_type;
        elected_type = _winner;
        //vonus mint
        string memory _memo = "final vote bonus";
        //_mint_presentbox(uint(0), msg.sender, _memo);
        _mint_presentbox(uint(0), _ender, _memo);
        emit End_Voting(_summoner, _winner);
    }
    function _select_winner(uint _summoner) internal view returns (uint) {
        //candle auction
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //select random step in the range between from start_step to latest step
        Subject memory _subject = subjects[subject_now];
        uint _delta_step = (next_step) - _subject.start_step;
        uint _rand = mfs.dn(_summoner, _delta_step);
        uint _elected_step = _subject.start_step + _rand;
        //return winner as winner_inStep of the elected_step
        return winner_inStep[_elected_step];
    }
    
    //info
    function get_info(uint _summoner) external view returns (uint[24] memory) {
        uint[24] memory _res;
        //_res[0] = each_voting_count[0];
        _res[1] = each_voting_count[201];
        _res[2] = each_voting_count[202];
        _res[3] = each_voting_count[203];
        _res[4] = each_voting_count[204];
        _res[5] = each_voting_count[205];
        _res[6] = each_voting_count[206];
        _res[7] = each_voting_count[207];
        _res[8] = each_voting_count[208];
        _res[9] = each_voting_count[209];
        _res[10] = each_voting_count[210];
        _res[11] = each_voting_count[211];
        _res[12] = each_voting_count[212];
        _res[13] = next_festival_block();
        _res[14] = _inSession();
        _res[15] = _isVotable(_summoner);
        _res[16] = last_voting_block[_summoner];
        _res[17] = last_voting_type[_summoner];
        _res[18] = subject_now;
        _res[19] = subjects[subject_now].start_block;
        _res[20] = subjects[subject_now].end_block;
        _res[21] = _isEndable();
        _res[22] = elected_type;
        _res[23] = previous_elected_type;
        return _res;
    }
    function _inSession() internal view returns (uint) {
        bool _bool = inSession;
        if (_bool == true) {
            return uint(1);
        } else {
            return uint(0);
        }    
    }
    function _isVotable(uint _summoner) internal view returns (uint) {
        bool _bool = check_votable(_summoner);
        if (_bool == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    function _isEndable() internal view returns (uint) {
        bool _bool = check_end_voting();
        if (_bool == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    function next_festival_block() public view returns (uint) {
        //in first festival, return past block number (0+INTERVAL)
        //for murasaki_info
        return subjects[subject_now].start_block + ELECTION_INTERVAL_BLOCK;
    }

    /*
    //***TODO*** forDebug
    function mint_presentbox(uint _summoner, address _wallet_to, string memory _memo) external onlyOwner {
        _mint_presentbox(_summoner, _wallet_to, _memo);
    }
    */
}


//===admin==================================================================================================================


//---Admin_Convert

contract Admin_Convert is Ownable {
    
    function mc_convert (
        address _old_address, 
        address _new_address, 
        uint _item_id
    ) external onlyOwner {
        Murasaki_Craft mcOld = Murasaki_Craft(_old_address);
        //Murasaki_Craft_withFee mcNew = Murasaki_Craft_withFee(_new_address);
        Murasaki_Craft mcNew = Murasaki_Craft(_new_address);
        //correct old item infromation
        (
            uint _item_type, 
            uint _crafted_time, 
            uint _crafted_summoner, 
            address _crafted_wallet, 
            string memory _memo
        ) = mcOld.items(_item_id);
        uint _seed = mcOld.seed(_item_id);
        //craft_convert in new contract
        mcNew._admin_craft_convert(
            _item_type,
            _crafted_summoner,
            _crafted_wallet,
            _seed,
            _memo,
            _item_id,
            _crafted_time
        );
    }
    
    function mc_set_next_item (address _address, uint _value) external onlyOwner {
        //Murasaki_Craft_withFee mcNew = Murasaki_Craft_withFee(_address);
        Murasaki_Craft mcNew = Murasaki_Craft(_address);
        mcNew._admin_set_next_item(_value);
    }
    
    function ms_convert (
        address _old_address,
        address _new_address,
        uint _summoner
    ) external onlyOwner {
        Murasaki_Storage msOld = Murasaki_Storage(_old_address);
        Murasaki_Storage msNew = Murasaki_Storage(_new_address);
        msNew.set_level(_summoner, msOld.level(_summoner));
        msNew.set_exp(_summoner, msOld.exp(_summoner));
        msNew.set_strength(_summoner, msOld.strength(_summoner));
        msNew.set_dexterity(_summoner, msOld.dexterity(_summoner));
        msNew.set_intelligence(_summoner, msOld.intelligence(_summoner));
        msNew.set_luck(_summoner, msOld.luck(_summoner));
        msNew.set_next_exp_required(_summoner, msOld.next_exp_required(_summoner));
        msNew.set_last_level_up_time(_summoner, msOld.last_level_up_time(_summoner));
        msNew.set_coin(_summoner, msOld.coin(_summoner));
        msNew.set_material(_summoner, msOld.material(_summoner));
        msNew.set_last_feeding_time(_summoner, msOld.last_feeding_time(_summoner));
        msNew.set_last_grooming_time(_summoner, msOld.last_grooming_time(_summoner));
        msNew.set_mining_status(_summoner, msOld.mining_status(_summoner));
        msNew.set_mining_start_time(_summoner, msOld.mining_start_time(_summoner));
        msNew.set_farming_status(_summoner, msOld.farming_status(_summoner));
        msNew.set_farming_start_time(_summoner, msOld.farming_start_time(_summoner));
        msNew.set_crafting_status(_summoner, msOld.crafting_status(_summoner));
        msNew.set_crafting_start_time(_summoner, msOld.crafting_start_time(_summoner));
        msNew.set_crafting_item_type(_summoner, msOld.crafting_item_type(_summoner));
        msNew.set_total_mining_sec(_summoner, msOld.total_mining_sec(_summoner));
        msNew.set_total_farming_sec(_summoner, msOld.total_farming_sec(_summoner));
        msNew.set_total_crafting_sec(_summoner, msOld.total_crafting_sec(_summoner));
        msNew.set_last_total_mining_sec(_summoner, msOld.last_total_mining_sec(_summoner));
        msNew.set_last_total_farming_sec(_summoner, msOld.last_total_farming_sec(_summoner));
        msNew.set_last_total_crafting_sec(_summoner, msOld.last_total_crafting_sec(_summoner));
        msNew.set_last_grooming_time_plus_working_time(_summoner, msOld.last_grooming_time_plus_working_time(_summoner));
        msNew.set_isActive(_summoner, msOld.isActive(_summoner));
        msNew.set_inHouse(_summoner, msOld.inHouse(_summoner));
        msNew.set_staking_reward_counter(_summoner, msOld.staking_reward_counter(_summoner));
    }
}


//===old==================================================================================================================


/*



*/
