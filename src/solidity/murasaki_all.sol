
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


//=== Basic ==================================================================================================================


import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/Base64.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol";
import "github.com/AstarNetwork/astarbase/contract/example/IAstarBase.sol";


/* for solc
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@astarbase/contract/example/IAstarBase.sol";
*/


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
    mapping(address => uint) private _tokens;
    function tokenOf(address _owner) public view returns (uint) {
        require(_owner != address(0));
        return _tokens[_owner];
    }

    // next_token
    uint public next_token = 1;
    
    // non-transferable
    function _beforeTokenTransfer(address from, address to, uint256, uint256) internal pure override {
        require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
    }
    
    // only one per wallet, burnable
    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256) internal override {
        // when mint
        if ( from == address(0) ) {
            require(_tokens[to] == 0, "Owner already has a token");
            _tokens[to] = tokenId;
            next_token++;
        // when burn
        } else if ( to == address(0) ) {
            _tokens[from] = 0;
        }
    }
}


//=== SBT/NFT ==================================================================================================================


//---Murasaki_Main


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
    bool notPaused = true;
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
        require(notPaused);
        //update summoner info
        uint _now = block.timestamp;
        class[next_token] = _class;
        summoned_time[next_token] = _now;
        seed[next_token] = _seed;
        //mint
        _safeMint(_owner, next_token);
    }
    
    //summon from trial
    function summon_fromTrial(address _owner, uint _class, uint _seed) external {
        require(permitted_address[msg.sender] == true);
        require(notPaused);
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

    string[] private color = [
        "#E60012",
        "#F39800",
        "#FFF100",
        "#8FC31F",
        "#009944",
        "#009E96",
        "#00A0E9",
        "#0068B7",
        "#1D2088",
        "#920783",
        "#E4007F",
        "#E5004F"
    ];

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
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128"><style>.base { fill: #D81B60; font-family: arial; font-size: 12px; }</style><rect width="128" height="128" fill="';
        parts[1] = color[class[_summoner]];
        parts[2] = '" fill-opacity="0.5"/>';
        parts[3] = '<image width="128" height="128" x="0" y="0" href="data:image/png;base64,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"/><text x="24" y="88" class="base" font-weight="bold">';
        parts[4] = string(abi.encodePacked("#", toString(_summoner)));
        parts[5] = '</text><text x="22" y="102" class="base" font-weight="bold">';
        parts[6] = string(abi.encodePacked("&#x273f;", flower[class[_summoner]]));
        parts[7] = '</text></svg>';
        string memory output = 
            string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]));
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Murasaki-san #', toString(_summoner), '", "description": "House of Murasaki-san. Murasaki-san is a pet living in your wallet on Astar Network. https://murasaki-san.com/", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }
    
    //admin, for convert
    function set_summoned_time(uint _summoner, uint _value) external {
        require(permitted_address[msg.sender] == true);
        summoned_time[_summoner] = _value;
    }
}


//---Murasaki_Main_Trial


contract Murasaki_Main_Trial is SoulBoundBadge, Ownable{

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
    bool notPaused = true;
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
        require(notPaused);
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

    string[] private color = [
        "#E60012",
        "#F39800",
        "#FFF100",
        "#8FC31F",
        "#009944",
        "#009E96",
        "#00A0E9",
        "#0068B7",
        "#1D2088",
        "#920783",
        "#E4007F",
        "#E5004F"
    ];

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
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128"><style>.base { fill: #D81B60; font-family: arial; font-size: 12px; }</style><rect width="128" height="128" fill="';
        parts[1] = color[class[_summoner]];
        parts[2] = '" fill-opacity="0.5"/>';
        parts[3] = '<image width="128" height="128" x="0" y="0" href="data:image/png;base64,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"/><text x="24" y="88" class="base" font-weight="bold">';
        parts[4] = string(abi.encodePacked("#", toString(_summoner)));
        parts[5] = '</text><text x="22" y="102" class="base" font-weight="bold">';
        parts[6] = string(abi.encodePacked("&#x273f;", flower[class[_summoner]]));
        parts[7] = '</text></svg>';
        string memory output = 
            string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]));
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Murasaki-san #', toString(_summoner), '", "description": "House of Murasaki-san. Murasaki-san is a pet living in your wallet on Astar Network. https://murasaki-san.com/", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }
    
    //admin, for convert
    function set_summoned_time(uint _summoner, uint _value) external {
        require(permitted_address[msg.sender] == true);
        summoned_time[_summoner] = _value;
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


//---Murasaki_Craft


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
        uint item_subtype;
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
        string memory _memo,
        uint _item_subtype
    ) external {
        require(permitted_address[msg.sender] == true);
        uint _now = block.timestamp;
        uint _crafting_item = next_item;
        items[_crafting_item] = item(_item_type, _now, _summoner, _wallet, _memo, _item_subtype);
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
    function myListsAt_withItemTypeAndSubtype(
        address user,
        uint start,
        uint count
    ) external view returns (uint[] memory rIds) {
        rIds = new uint[](count*3);
        for (uint idx = 0; idx < count; idx++) {
            uint _id = mySet[user].at(start + idx);
            rIds[idx*3] = _id;
            item memory _item = items[_id];
            rIds[idx*3+1] = _item.item_type;
            rIds[idx*3+2] = _item.item_subtype;
        }
    }

    //URI
    string public baseURI = "https://murasaki-san.com/src/json/";
    string public tailURI = ".json";
    function set_baseURI(string memory _string) external onlyOwner {
        baseURI = _string;
    }
    function set_tailURI(string memory _string) external onlyOwner {
        tailURI = _string;
    }
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
    function tokenURI (uint _tokenId) public view returns (string memory) {
        require(_exists(_tokenId), "token must exist");
        uint _item_type = items[_tokenId].item_type;
        return string(
            abi.encodePacked(
                baseURI,
                toString(_item_type),
                tailURI
            )
        );
    }

    //call items as array, need to write in Craft contract
    function get_balance_of_type(address _wallet) public view returns (uint[256] memory) {
        return balance_of_type[_wallet];
    }
    function balanceOfType(address _wallet, uint _item_type) external view returns (uint) {
        return balance_of_type[_wallet][_item_type];
    }

    // Transfer fees
    
    //noFee address
    mapping(address => bool) private noFee_address;
    
    //set transfer fee
    uint public TRANSFER_FEE = 10 * 10**18;   //ether
    
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
            require(msg.value >= TRANSFER_FEE);
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
            require(msg.value >= TRANSFER_FEE);
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
            require(msg.value >= TRANSFER_FEE);
            payable(bufferTreasury_address).transfer(address(this).balance);
        }
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }
    
    //admin, using convertion, convert item info from old contract
    function _admin_craft_convert(
        uint _item_type, 
        uint _summoner, 
        address _wallet_crafted, 
        //uint _seed, 
        //string memory _memo,
        uint _item_id,
        uint _crafted_time,
        address _wallet_to
    ) external {
        require(permitted_address[msg.sender] == true);
        //uint32 _now = uint32(block.timestamp);
        //uint32 _crafting_item = next_item;
        //items[_crafting_item] = item(_item_type, _now, _summoner, _wallet, _memo);
        string memory _memo = "converted";
        items[_item_id] = item(_item_type, _crafted_time, _summoner, _wallet_crafted, _memo, 0);
        balance_of_type[_wallet_to][_item_type] += 1;  //balanceOf each item type
        count_of_mint[_item_type]++;
        //seed[_item_id] = _seed;
        seed[_item_id] = 8888;
        mySet[_wallet_to].add(_item_id);
        //next_item++;
        _safeMint(_wallet_to, _item_id);
    }
    
    //admin, using convertion, set next_item
    function _admin_set_next_item (uint _next_item) external {
        require(permitted_address[msg.sender] == true);
        next_item = _next_item;
    }
}


//===Storage==================================================================================================================


//---Murasaki_Address


contract Murasaki_Address is Ownable {

    address public address_Murasaki_Main;
    address public address_Murasaki_Name;
    address public address_Murasaki_Craft;
    address public address_Murasaki_Parameter;
    address public address_Murasaki_Storage;
    address public address_Murasaki_Storage_Score;
    address public address_Murasaki_Storage_Nui;
    address public address_Murasaki_Function_Share;
    address public address_Murasaki_Function_Summon_and_LevelUp;
    address public address_Murasaki_Function_Feeding_and_Grooming;
    address public address_Murasaki_Function_Mining_and_Farming;
    address public address_Murasaki_Function_Crafting;
    address public address_Murasaki_Function_Crafting2;
    address public address_Murasaki_Function_Crafting_Codex;
    address public address_Murasaki_Function_Name;
    address public address_Murasaki_Function_Achievement;
    address public address_Murasaki_Function_Staking_Reward;
    address public address_Murasaki_Dice;
    address public address_Murasaki_Mail;
    address public address_Fluffy_Festival;
    address public address_Murasaki_Info;
    address public address_Murasaki_Info_fromWallet;
    address public address_Murasaki_Lootlike;
    address public address_Murasaki_tokenURI;
    address public address_BufferVault;
    address public address_BuybackTreasury;
    address public address_AstarBase;
    address public address_Staking_Wallet;
    address public address_Coder_Wallet;
    address public address_Illustrator_Wallet;
    address public address_Achievement_onChain;
    address public address_Murasaki_Function_Music_Practice;
    
    function set_Murasaki_Main(address _address) external onlyOwner {
        address_Murasaki_Main = _address;
    }
    function set_Murasaki_Name(address _address) external onlyOwner {
        address_Murasaki_Name = _address;
    }
    function set_Murasaki_Craft(address _address) external onlyOwner {
        address_Murasaki_Craft = _address;
    }
    function set_Murasaki_Parameter(address _address) external onlyOwner {
        address_Murasaki_Parameter = _address;
    }
    function set_Murasaki_Storage(address _address) external onlyOwner {
        address_Murasaki_Storage = _address;
    }
    function set_Murasaki_Storage_Score(address _address) external onlyOwner {
        address_Murasaki_Storage_Score = _address;
    }
    function set_Murasaki_Storage_Nui(address _address) external onlyOwner {
        address_Murasaki_Storage_Nui = _address;
    }
    function set_Murasaki_Function_Share(address _address) external onlyOwner {
        address_Murasaki_Function_Share = _address;
    }
    function set_Murasaki_Function_Summon_and_LevelUp(address _address) external onlyOwner {
        address_Murasaki_Function_Summon_and_LevelUp = _address;
    }
    function set_Murasaki_Function_Feeding_and_Grooming(address _address) external onlyOwner {
        address_Murasaki_Function_Feeding_and_Grooming = _address;
    }
    function set_Murasaki_Function_Mining_and_Farming(address _address) external onlyOwner {
        address_Murasaki_Function_Mining_and_Farming = _address;
    }
    function set_Murasaki_Function_Crafting(address _address) external onlyOwner {
        address_Murasaki_Function_Crafting = _address;
    }
    function set_Murasaki_Function_Crafting2(address _address) external onlyOwner {
        address_Murasaki_Function_Crafting2 = _address;
    }
    function set_Murasaki_Function_Crafting_Codex(address _address) external onlyOwner {
        address_Murasaki_Function_Crafting_Codex = _address;
    }
    function set_Murasaki_Function_Name(address _address) external onlyOwner {
        address_Murasaki_Function_Name = _address;
    }
    function set_Murasaki_Function_Achievement(address _address) external onlyOwner {
        address_Murasaki_Function_Achievement = _address;
    }
    function set_Murasaki_Function_Staking_Reward(address _address) external onlyOwner {
        address_Murasaki_Function_Staking_Reward = _address;
    }
    function set_Murasaki_Dice(address _address) external onlyOwner {
        address_Murasaki_Dice = _address;
    }
    function set_Murasaki_Mail(address _address) external onlyOwner {
        address_Murasaki_Mail = _address;
    }
    function set_Fluffy_Festival(address _address) external onlyOwner {
        address_Fluffy_Festival = _address;
    }
    function set_Murasaki_Info(address _address) external onlyOwner {
        address_Murasaki_Info = _address;
    }
    function set_Murasaki_Info_fromWallet(address _address) external onlyOwner {
        address_Murasaki_Info_fromWallet = _address;
    }
    function set_Murasaki_Lootlike(address _address) external onlyOwner {
        address_Murasaki_Lootlike = _address;
    }
    function set_Murasaki_tokenURI(address _address) external onlyOwner {
        address_Murasaki_tokenURI = _address;
    }
    function set_BufferVault(address _address) external onlyOwner {
        address_BufferVault = _address;
    }
    function set_BuybackTreasury(address _address) external onlyOwner {
        address_BuybackTreasury = _address;
    }
    function set_AstarBase(address _address) external onlyOwner {
        address_AstarBase = _address;
    }
    function set_Staking(address _address) external onlyOwner {
        address_Staking_Wallet = _address;
    }
    function set_Coder(address _address) external onlyOwner {
        address_Coder_Wallet = _address;
    }
    function set_Illustrator(address _address) external onlyOwner {
        address_Illustrator_Wallet = _address;
    }
    function set_Achievement_onChain(address _address) external onlyOwner {
        address_Achievement_onChain = _address;
    }
    function set_Murasaki_Function_Music_Practice(address _address) external onlyOwner {
        address_Murasaki_Function_Music_Practice = _address;
    }
}


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
    uint public PRICE = 500 * 10**18;    //ether, need to recalc 10**18 in methods
    uint public DAY_PETRIFIED = 30;
    uint public STAKING_REWARD_SEC = 2592000; //30 days
    uint public ELECTED_FLUFFY_TYPE = 0;
    string public DEVELOPER_SUMMONER_NAME = "*Fluffy Kingdom*";
    uint public EXP_FROM_PRESENTBOX = 50;
    uint public LIMIT_MINT = 9999999999;

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
    function _set_limit_mint(uint _value) external onlyPermitted {
        LIMIT_MINT = _value;
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
    mapping(uint => uint) public last_counter_update_time;
    
    //crafting resume
    mapping(uint => uint) public crafting_resume_flag;
    mapping(uint => uint) public crafting_resume_item_type;
    mapping(uint => uint) public crafting_resume_item_dc;
    
    //practice
    mapping(uint => uint) public exp_clarinet;
    mapping(uint => uint) public exp_piano;
    mapping(uint => uint) public exp_violin;
    mapping(uint => uint) public exp_horn;
    mapping(uint => uint) public exp_timpani;
    mapping(uint => uint) public exp_cello;
    mapping(uint => uint) public practice_status;
    mapping(uint => uint) public practice_item_id;
    mapping(uint => uint) public practice_start_time;

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
    function set_last_counter_update_time(uint _summoner, uint _value) external onlyPermitted {
        last_counter_update_time[_summoner] = _value;
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
    function set_exp_clarinet(uint _summoner, uint _value) external onlyPermitted {
        exp_clarinet[_summoner] = _value;
    }
    function set_exp_piano(uint _summoner, uint _value) external onlyPermitted {
        exp_piano[_summoner] = _value;
    }
    function set_exp_violin(uint _summoner, uint _value) external onlyPermitted {
        exp_violin[_summoner] = _value;
    }
    function set_exp_horn(uint _summoner, uint _value) external onlyPermitted {
        exp_horn[_summoner] = _value;
    }
    function set_exp_timpani(uint _summoner, uint _value) external onlyPermitted {
        exp_timpani[_summoner] = _value;
    }
    function set_exp_cello(uint _summoner, uint _value) external onlyPermitted {
        exp_cello[_summoner] = _value;
    }
    function set_practice_status(uint _summoner, uint _value) external onlyPermitted {
        practice_status[_summoner] = _value;
    }
    function set_practice_item_id(uint _summoner, uint _value) external onlyPermitted {
        practice_item_id[_summoner] = _value;
    }
    function set_practice_start_time(uint _summoner, uint _value) external onlyPermitted {
        practice_start_time[_summoner] = _value;
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
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    //salt
    uint private _salt = 0;
    function update_salt(uint _summoner) external onlyOwner {
        _salt = dn(_summoner, 10);
    }

    //check owner of summoner
    function check_owner(uint _summoner, address _wallet) external view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        // possess and isActive
        return (mm.ownerOf(_summoner) == _wallet && ms.isActive(_summoner));
    }

    //get owner of summoner
    function get_owner(uint _summoner) public view returns (address) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        return mm.ownerOf(_summoner);
    }
    
    //get summoner from wallet
    function get_summoner(address _address) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        return mm.tokenOf(_address);
    }

    //craft

    //check owner of item
    function check_owner_ofItem(uint _item, address _wallet) external view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        return (mc.ownerOf(_item) == _wallet);
    }

    //get balance of type
    function get_balance_of_type_specific(address _wallet, uint _item_type) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        return mc.balance_of_type(_wallet, _item_type);
    }

    //call items as array
    function get_balance_of_type_array(address _wallet) external view returns (uint[256] memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        return mc.get_balance_of_type(_wallet);
    }

    //call items as array from summoner
    function get_balance_of_type_array_from_summoner(uint _summoner) public view returns (uint[256] memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        address _owner = mm.ownerOf(_summoner);
        return mc.get_balance_of_type(_owner);
    }

    //calc satiety
    function calc_satiety(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        uint[256] memory _balance_of_type = get_balance_of_type_array_from_summoner(_summoner);
        uint _precious_score = 0;
        //fluffy
        uint _elected_precious_type = mp.ELECTED_FLUFFY_TYPE();
        for (uint i = 201; i <= 212; i++) {
            //doll, fluffy * 60
            if (_balance_of_type[i+36] > 0) {
                _precious_score += _balance_of_type[i+36] * 2*60 +30 +2;
                //fluffly festival modification, x2 score
                if (i == _elected_precious_type) {
                    _precious_score += _balance_of_type[i+36] * 2*60 +30 +2;
                }
            }
            //fluffiest, fluffy * 20
            if (_balance_of_type[i+24] > 0) {
                _precious_score += _balance_of_type[i+24] * 2*20 +8 +2;
                //fluffly festival modification, x2 score
                if (i == _elected_precious_type) {
                    _precious_score += _balance_of_type[i+24] * 2*20 +8 +2;
                }
            }
            //fluffier, fluffy * 5
            if (_balance_of_type[i+12] > 0) {
                _precious_score += _balance_of_type[i+12] * 2*5 +2;
                if (i == _elected_precious_type) {
                    _precious_score += _balance_of_type[i+12] * 2*5 +2;
                }
            }
            //fluffy
            if (_balance_of_type[i] > 0) {
                _precious_score += _balance_of_type[i] * 2;
                if (i == _elected_precious_type) {
                    _precious_score += _balance_of_type[i] * 2;
                }
            }
        }
        /*
        //nui, fluffy * 60
        if (_balance_of_type[197] > 0) {
            _precious_score += _balance_of_type[197] * 2*60 +30 +2;
        }
        */
        //level cap, 800/Lv20 = 40/Lv
        uint _lv = ms.level(_summoner);
        if (_precious_score > _lv*40) {
            _precious_score = _lv*40;
        }
        return _precious_score;
    }

    //call_name_from_summoner
    function call_name_from_summoner(uint _summoner) external view returns (string memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        Murasaki_Name mn = Murasaki_Name(ma.address_Murasaki_Name());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());    
        if (_summoner == 0) {
            return mp.DEVELOPER_SUMMONER_NAME();
        }
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
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
                /*
                //nui, x4 of fluffiest
                } else if (i == 197) {
                    _score += _array[i] * 6400;
                */
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
                //nui, x4 of fluffiest
                } else if (i <= 248) {
                    _score += _array[i] * 6400;
                }
            }
        }
        return _score;
    }
        
    //calc_exp_addition_rate_from_nui, item_nui required
    //return XXX% (100% - 200%, x1 - x2 ratio)
    function calc_exp_addition_rate(uint _summoner, uint _item_nui) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage_Nui msn = Murasaki_Storage_Nui(ma.address_Murasaki_Storage_Nui());
        //call summoner score
        uint _score_summoner = calc_score(_summoner);
        //call nui score
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        IAstarBase ASTARBASE = IAstarBase(ma.address_AstarBase());
        uint _staker_raw = ASTARBASE.checkStakerStatusOnContract(_wallet, ma.address_Murasaki_Main());
        uint _staker = _staker_raw / (10 ** 18);
        return _staker;
    }
    
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
    
    //luck challenge
    function luck_challenge(uint _summoner) external view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Dice md = Murasaki_Dice(ma.address_Murasaki_Dice());
        uint _luck = ms.luck(_summoner);
        //_luck += calc_precious(_summoner) * 1;
        _luck += calc_precious(_summoner);
        _luck += md.get_rolled_dice(_summoner);
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
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //summon
    event Summon(uint indexed _summoner, address _wallet, uint _class);
    function summon(uint _class) external payable nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(mp.isPaused() == false);
        require( mm.next_token() < mp.LIMIT_MINT() );
        uint PRICE = mp.PRICE();
        uint BASE_SEC = mp.BASE_SEC();
        uint SPEED = mp.SPEED();
        require(msg.value >= PRICE);
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
        ms.set_last_feeding_time(_summoner, _now - BASE_SEC * 100 / SPEED / 4);
        ms.set_last_grooming_time(_summoner, _now - BASE_SEC * 100 / SPEED / 4);
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
        ms.set_last_grooming_time_plus_working_time(_summoner, _now - BASE_SEC * 100 / SPEED / 4);
        ms.set_isActive(_summoner, true);
        ms.set_inHouse(_summoner, true);
        ms.set_staking_reward_counter(_summoner, mp.STAKING_REWARD_SEC());
        //fee transfer, 50% for buyback, rest for team
        /*
        payable(ma.address_buybackTreasury()).transfer(address(this).balance/2);
        payable(ma.address_bufferVault()).transfer(address(this).balance);
        */
        payable(ma.address_Coder_Wallet()).transfer(PRICE/20);          //5%
        payable(ma.address_Illustrator_Wallet()).transfer(PRICE/20);    //5%
        payable(ma.address_Staking_Wallet()).transfer(address(this).balance/2);  //45%
        payable(ma.address_BuybackTreasury()).transfer(address(this).balance);   //45%
        //event
        emit Summon(_summoner, msg.sender, _class);
    }

    //burn
    event Burn(uint indexed _summoner);
    function burn(uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        //burn on mm
        mm.burn(_summoner);
        //burn on ms, inactivate
        ms.set_isActive(_summoner, false);
        //event
        emit Burn(_summoner);
    }

    //petrified check
    function not_petrified(uint _summoner) internal view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.not_petrified(_summoner);
    }

    //level-up
    event Level_up(uint indexed _summoner, uint _level);
    function level_up(uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(ms.exp(_summoner) >= ms.next_exp_required(_summoner));
        //petrified check
        require(not_petrified(_summoner));
        //calculate working percent
        //uint _now = block.timestamp;
        uint _base_sec = block.timestamp - ms.last_level_up_time(_summoner);
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
        ms.set_last_feeding_time(_summoner, block.timestamp);
        ms.set_last_grooming_time(_summoner, block.timestamp);
        ms.set_exp(_summoner, 0);
        //level-up
        uint _next_level = ms.level(_summoner) + 1;
        ms.set_level(_summoner, _next_level);
        ms.set_last_level_up_time(_summoner, block.timestamp);
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
        }else if (_next_level == 20) {
            ms.set_next_exp_required(_summoner, 9999999);
        }
        //event
        emit Level_up(_summoner, _next_level);
    }
}


//---Feeding_and_Grooming


contract Murasaki_Function_Feeding_and_Grooming is Ownable, ReentrancyGuard {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //feeding
    event Feeding(uint indexed _summoner, uint _exp_gained, bool _critical);
    function feeding(uint _summoner, uint _item_nui) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        //require(mfs.check_owner(_summoner, msg.sender));
        require(not_petrified(_summoner));
        uint _now = block.timestamp;
        uint _satiety = mfs.calc_satiety(_summoner);
        uint _exp_add = 500 * (100 - _satiety) / 100;
        //for staking counter, sec before boost
        //uint _delta_sec = ( _now - ms.last_feeding_time(_summoner) ) * mp.SPEED()/100;
        //achv onChain boost
        _exp_add = _get_exp_add_from_achv_onChain(_summoner, _exp_add);
        //twinkle boost, multiplication
        _exp_add = _get_exp_add_from_twinkle(_summoner, _exp_add);
        //nui boost, multiplication with onChain boost
        if (_item_nui > 0) {
            _exp_add = _get_exp_add_from_nui(_summoner, _item_nui, _exp_add);
        }
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            _exp_add = _exp_add * 2;
            _critical = true;
        }
        uint _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        ms.set_last_feeding_time(_summoner, _now);
        //update score
        uint _total_exp_gained = mss.total_exp_gained(_summoner);
        mss.set_total_exp_gained(_summoner, _total_exp_gained + _exp_add);
        //owner check, gain some exp when not your summoner
        uint _summoner_yours = mfs.get_summoner(msg.sender);
        if (_summoner_yours != 0 && _summoner != _summoner_yours) {
            uint _exp_yours = ms.exp(_summoner_yours);
            ms.set_exp(_summoner_yours, _exp_yours + _exp_add / 50);
        }
        //update staking reward counter
        //_update_staking_reward_counter(_summoner, _delta_sec);
        _update_staking_reward_counter(_summoner);
        //event
        emit Feeding(_summoner, _exp_add, _critical);
    }
    function _get_exp_add_from_achv_onChain(uint _summoner, uint _exp_add) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Achievement_onChain ac = Achievement_onChain(ma.address_Achievement_onChain());
        uint _percentx100 = ac.get_score(_summoner);
        _exp_add += _exp_add * _percentx100 / 10000;
        return _exp_add;
    }
    function _get_exp_add_from_nui(uint _summoner, uint _item_nui, uint _exp_add) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        address _owner = mfs.get_owner(_summoner);
        require(mc.ownerOf(_item_nui) == _owner);
        uint _percent = mfs.calc_exp_addition_rate(_summoner, _item_nui);
        _exp_add = _exp_add * _percent/100;
        return _exp_add;
    }
    function _get_exp_add_from_twinkle(uint _summoner, uint _exp_add) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        address _owner = mfs.get_owner(_summoner);
        uint _twinkle_1 = mc.balanceOfType(_owner, 251);
        uint _twinkle_2 = mc.balanceOfType(_owner, 252);
        uint _twinkle_3 = mc.balanceOfType(_owner, 253);
        uint _twinkle_4 = mc.balanceOfType(_owner, 254);
        uint _twinkle_5 = mc.balanceOfType(_owner, 255);
        uint _res = _exp_add;
        _res += _exp_add * _twinkle_1*10/10000;
        _res += _exp_add * _twinkle_2*20/10000;
        _res += _exp_add * _twinkle_3*30/10000;
        _res += _exp_add * _twinkle_4*40/10000;
        _res += _exp_add * _twinkle_5*50/10000;
        return _res;
    }
    function calc_feeding(uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        uint _satiety = mfs.calc_satiety(_summoner);
        uint _exp_add = 500 * (100 - _satiety) / 100;
        return _exp_add;
    }
    //function _update_staking_reward_counter(uint _summoner, uint _delta_sec) internal {
    function _update_staking_reward_counter(uint _summoner) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Staking_Reward mfsl = Murasaki_Function_Staking_Reward(ma.address_Murasaki_Function_Staking_Reward());
        mfsl.update_staking_counter(_summoner);
    }

    //petrification, debends on only feeding
    function not_petrified(uint _summoner) internal view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.not_petrified(_summoner);
    }
    event Cure_Petrification(uint indexed _summoner, uint _price);
    function cure_petrification(uint _summoner) external payable nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(mfs.check_owner(_summoner, msg.sender));
        require(!not_petrified(_summoner));
        //uint _price = ms.level(_summoner) * PRICE * 10**18;
        uint PRICE = mp.PRICE();
        // cure cost = present mint price
        require(msg.value >= PRICE);
        uint _now = block.timestamp;
        ms.set_last_feeding_time(_summoner, _now);
        ms.set_mining_status(_summoner, 0);
        ms.set_farming_status(_summoner, 0);
        ms.set_crafting_status(_summoner, 0);
        //fee transfer, same as summon
        //payable(ma.address_bufferVault()).transfer(address(this).balance);
        payable(ma.address_Coder_Wallet()).transfer(PRICE/20);          //5%
        payable(ma.address_Illustrator_Wallet()).transfer(PRICE/20);    //5%
        payable(ma.address_Staking_Wallet()).transfer(address(this).balance/2);  //45%
        payable(ma.address_BuybackTreasury()).transfer(address(this).balance);   //45%
        //event
        emit Cure_Petrification(_summoner, PRICE);
    }

    //grooming
    event Grooming(uint indexed _summoner, uint _exp_gained, bool _critical);
    function grooming(uint _summoner, uint _item_nui) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(not_petrified(_summoner));
        require(
            ms.mining_status(_summoner) == 0 
            && ms.farming_status(_summoner) == 0 
            && ms.crafting_status(_summoner) == 0
            && ms.practice_status(_summoner) == 0
        );
        uint _now = block.timestamp;
        uint _happy = _calc_happy_real(_summoner);
        uint _exp_add = 3000 * (100 - _happy) / 100;
        //achv onChain boost
        _exp_add = _get_exp_add_from_achv_onChain(_summoner, _exp_add);
        //twinkle boost, multiplication
        _exp_add = _get_exp_add_from_twinkle(_summoner, _exp_add);
        //nui boost
        if (_item_nui > 0) {
            address _owner = mfs.get_owner(_summoner);
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
        uint _total_exp_gained = mss.total_exp_gained(_summoner);
        mss.set_total_exp_gained(_summoner, _total_exp_gained + _exp_add);
        //event
        emit Grooming(_summoner, _exp_add, _critical);
    }
    //calc happy, modified with working_time
    function _calc_happy_real(uint _summoner) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.luck_challenge(_summoner);
    }    
}


//---Mining_and_Farming


contract Murasaki_Function_Mining_and_Farming is Ownable, ReentrancyGuard {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //mining
    function start_mining(uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(
            ms.mining_status(_summoner) == 0 
            && ms.farming_status(_summoner) == 0 
            && ms.crafting_status(_summoner) == 0
            && ms.practice_status(_summoner) == 0
        );
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.level(_summoner) >= 2);
        uint _now = block.timestamp;
        ms.set_mining_status(_summoner, 1);
        ms.set_mining_start_time(_summoner, _now);
    }
    event Mining(uint indexed _summoner, uint _coin_mined, bool _critical);
    function stop_mining(uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
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
        uint _total_coin_mined = mss.total_coin_mined(_summoner);
        mss.set_total_coin_mined(_summoner, _total_coin_mined + _delta);
        //event
        emit Mining(_summoner, _delta, _critical);
    }
    function calc_mining(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        //address _owner = mfs.get_owner(_summoner);
        //uint SPEED = mp.SPEED();
        //uint BASE_SEC = mp.BASE_SEC();
        //require(ms.mining_status(_summoner) == 1);
        if (ms.mining_status(_summoner) == 0) {
            return 0;
        }
        uint _now = block.timestamp;
        //uint _delta = (_now - ms.mining_start_time(_summoner)) * SPEED/100;   //sec
        uint _delta = _now - ms.mining_start_time(_summoner);   //sec
        //happy limit: if happy=0, no more earning
        uint _delta_grooming = _now - ms.last_grooming_time(_summoner);
        uint _base_grooming = mp.BASE_SEC() *3 *100/mp.SPEED();
        if (_delta_grooming >= _base_grooming) {
            //_delta = ms.last_grooming_time(_summoner) + BASE_SEC * 3;
            _delta = _base_grooming;
        }
        //speed boost
        _delta = _delta * mp.SPEED() / 100;
        //1day = +1000
        _delta = _delta * 1000 / mp.BASE_SEC();
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(
            ms.mining_status(_summoner) == 0 
            && ms.farming_status(_summoner) == 0 
            && ms.crafting_status(_summoner) == 0
            && ms.practice_status(_summoner) == 0
        );
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.level(_summoner) >= 2);
        uint _now = block.timestamp;
        ms.set_farming_status(_summoner, 1);
        ms.set_farming_start_time(_summoner, _now);
    }
    event Farming(uint indexed _summoner, uint _material_farmed, bool _critical);
    function stop_farming(uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
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
        uint _total_material_farmed = mss.total_material_farmed(_summoner);
        mss.set_total_material_farmed(_summoner, _total_material_farmed + _delta);
        //event
        emit Farming(_summoner, _delta, _critical);
    }
    function calc_farming(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        //address _owner = mfs.get_owner(_summoner);
        //uint SPEED = mp.SPEED();
        //uint BASE_SEC = mp.BASE_SEC();
        //require(ms.farming_status(_summoner) == 1);
        if (ms.farming_status(_summoner) == 0) {
            return uint(0);
        }
        uint _now = block.timestamp;
        uint _delta = _now - ms.farming_start_time(_summoner);   //sec
        //happy limit: if happy=0, no more earning
        uint _delta_grooming = _now - ms.last_grooming_time(_summoner);
        uint _base_grooming = mp.BASE_SEC() *3 *100/mp.SPEED();
        if (_delta_grooming >= _base_grooming) {
            //_delta = ms.last_grooming_time(_summoner) + BASE_SEC * 3;
            _delta = _base_grooming;
        }
        //speed boost
        _delta = _delta * mp.SPEED() / 100;
        //1day = +1000
        _delta = _delta * 1000 / mp.BASE_SEC();
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.luck_challenge(_summoner);
    }    
}


//---Crafting

//item NFT crafting, burn Mail
contract Murasaki_Function_Crafting is Ownable, ReentrancyGuard {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //get modified dc, using codex
    function get_modified_dc(uint _summoner, uint _item_type) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(ma.address_Murasaki_Function_Crafting_Codex());
        return mfcc.get_modified_dc(_summoner, _item_type);
    }
    //calc crafting, using codex
    function calc_crafting(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(ma.address_Murasaki_Function_Crafting_Codex());
        return mfcc.calc_crafting(_summoner);
    }
    //count crafting items, using codex
    function count_crafting_items(address _address) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(ma.address_Murasaki_Function_Crafting_Codex());
        return mfcc.count_crafting_items(_address);
    }
    //get item dc, using codex contract
    function get_item_dc(uint _item_type) public view returns (uint[4] memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(ma.address_Murasaki_Function_Crafting_Codex());
        return mfcc.get_item_dc(_item_type);
    }

    //burn, internal
    function _burn(uint _item) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        mc.burn(_item);
    }
    //burn mail, external, only from Murasaki_Mail
    function burn_mail(uint _item) external {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        //only from Murasaki_Mail
        require(msg.sender == ma.address_Murasaki_Mail());
        _burn(_item);
    }

    //luck challenge of mfc
    function luck_challenge(uint _summoner) public view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.luck_challenge(_summoner);
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.level(_summoner) >= 3);
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(
            ms.mining_status(_summoner) == 0 
            && ms.farming_status(_summoner) == 0 
            && ms.crafting_status(_summoner) == 0
            && ms.practice_status(_summoner) == 0
        );
        require(ms.crafting_resume_flag(_summoner) == 0);        
        //check item_type
        require(_item_type > 0);
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.crafting_status(_summoner) == 1);
        require(calc_crafting(_summoner) > 0);
        uint _now = block.timestamp;
        uint _delta_sec = (_now - ms.crafting_start_time(_summoner));
        uint _item_type = ms.crafting_item_type(_summoner);
        //get remining sec
        uint _remining_time = calc_crafting(_summoner);
        //calc remining dc
        //uint BASE_SEC = mp.BASE_SEC();
        uint _remining_dc = _remining_time * 1000 / mp.BASE_SEC();
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
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
        uint _seed = mfs.seed(_summoner);
        string memory _memo = "";
        mc.craft(_item_type, _summoner, msg.sender, _seed, _memo, 0);
        //when normal items, mint precious and update score
        if (_item_type <= 128) {
            //_mint_precious(_summoner);
            _send_randomPresentbox(_summoner);
            //update score
            uint _total_item_crafted = mss.total_item_crafted(_summoner);
            mss.set_total_item_crafted(_summoner, _total_item_crafted + 1);
        }
        //event
        emit Crafting(_summoner, _item_type, mc.next_item()-1, _critical);
    }
    
    //internal, send random presentbox, when complete crafting
    event SendPresentbox(uint indexed _summoner_from, uint _summoner_to);
    function _send_randomPresentbox(uint _summoner_from) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        //get random _to_summoner
        uint _count_summoners = mm.next_token() - 1;
        uint _summoner_to = _summoner_from;
        uint _count = 0;
        //get random, when failed, summoner_to = summoner_from
        while (_count < 5) {
            uint _summoner_tmp = mfs.dn(_summoner_from + _count, _count_summoners) + 1;
            if (
                _summoner_to == _summoner_from
                && ms.isActive(_summoner_tmp)
                && ms.level(_summoner_tmp) >= 3
                && mfs.calc_satiety(_summoner_tmp) >= 10
                && mfs.calc_happy(_summoner_tmp) >= 10
                && _summoner_tmp != _summoner_from
            ) {
                _summoner_to = _summoner_tmp;
            }
            _count += 1;
        }
        address _wallet_to = mm.ownerOf(_summoner_to);
        /*
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
        */
        //mint presentbox
        _mint_presentbox(_summoner_from, _wallet_to);
        //event
        emit SendPresentbox(_summoner_from, _summoner_to);
    
    }
    
    //internal, mint presentbox
    function _mint_presentbox(uint _summoner_from, address _wallet_to) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        uint _seed = mfs.seed(_summoner_from);
        uint _item_type = 200;
        string memory _memo = "item crafting";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo, 0);
    }
    
    //get item name
    function get_item_name(uint _item_type) public view returns (string memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(ma.address_Murasaki_Function_Crafting_Codex());
        return mfcc.get_item_name(_item_type);
    }
}


//---Crafting2

//upgrading, unpack bag/pouch, 
contract Murasaki_Function_Crafting2 is Ownable, ReentrancyGuard {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //get item dc, using codex contract
    function get_item_dc(uint _item_type) public view returns (uint[4] memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(ma.address_Murasaki_Function_Crafting_Codex());
        return mfcc.get_item_dc(_item_type);
    }

    //burn, internal
    function _burn(uint _item) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        mc.burn(_item);
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

    //upgrade item
    event Upgrade(uint indexed _summoner, uint _item_type, uint _item);
    function upgrade_item(
        uint _summoner, 
        uint _item1, 
        uint _item2, 
        uint _item3
    ) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        //check summoner owner
        require(mfs.check_owner(_summoner, msg.sender));
        //check item owner
        require(
            mc.ownerOf(_item1) == msg.sender
            && mc.ownerOf(_item2) == msg.sender
            && mc.ownerOf(_item3) == msg.sender
        );
        //check item_type
        (uint _item_type1, , , , ,) = mc.items(_item1);
        (uint _item_type2, , , , ,) = mc.items(_item2);
        (uint _item_type3, , , , ,) = mc.items(_item3);
        require(_item_type1 <= 128);
        require(
            _item_type2 == _item_type1
            && _item_type3 == _item_type1
        );
        
        //determine target item_type
        uint _target_item_type = _item_type1 +64;
        
        //pay cost, avoid too deep stack error
        _pay_cost(_summoner, _target_item_type);
        
        //burn (transfer) lower rank items
        _burn(_item1);
        _burn(_item2);
        _burn(_item3);
        //mint upper rank item
        uint _seed = mfs.seed(_summoner);
        string memory _memo = "";
        mc.craft(_target_item_type, _summoner, msg.sender, _seed, _memo, 0);
        //event
        emit Upgrade(_summoner, _item_type1, mc.next_item()-1);
    }
    function _pay_cost(uint _summoner, uint _target_item_type) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
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

    //upgrade fluffy
    event Upgrade_Fluffy(uint indexed _summoner, uint _item_type, uint _item);
    function upgrade_fluffy(
        uint _summoner,
        uint _item1,
        uint _item2,
        uint _item3,
        uint _item4,
        uint _item5
    ) external nonReentrant {
        require(_check_summoner(_summoner, msg.sender));
        require(_check_items(_item1, _item2, _item3, _item4, _item5, msg.sender));
        uint _sourceItemType = _get_sourceItemType(_item1);
        uint _targetItemType = _get_targetItemType(_item1);
        _pay_cost(_summoner, _targetItemType);
        _burn_sourceItems(_item1, _item2, _item3, _item4, _item5);
        _mint_item(_summoner, _targetItemType, _sourceItemType, msg.sender);
        uint _present_itemNo = _get_present_itemNo();
        //if (_targetItemType == 197) {
        if (_targetItemType >= 237) {
            _update_storage_nui(_summoner, _present_itemNo);
        }
        emit Upgrade_Fluffy(_summoner, _targetItemType, _present_itemNo);        
    }
    function _check_summoner(uint _summoner, address _wallet) internal view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.check_owner(_summoner, _wallet);
    }
    function _check_items(
        uint _item1, 
        uint _item2, 
        uint _item3, 
        uint _item4, 
        uint _item5,
        address _wallet
    ) internal view returns (bool) {
        uint _sourceItemType = _get_sourceItemType(_item1);
        uint _targetItemType = _get_targetItemType(_item1);
        //check source item type
        require(201 <= _sourceItemType && _sourceItemType <= 236);
        //when fluffy x5 -> fluffier, require 5 items
        if (213 <= _targetItemType && _targetItemType <= 224) {
            require(_check_item(_item1, _sourceItemType, _wallet));
            require(_check_item(_item2, _sourceItemType, _wallet));
            require(_check_item(_item3, _sourceItemType, _wallet));
            require(_check_item(_item4, _sourceItemType, _wallet));
            require(_check_item(_item5, _sourceItemType, _wallet));
        //when fluffier x4 -> fluffiest, require 4 items
        } else if (224 <= _targetItemType && _targetItemType <= 236) {
            require(_check_item(_item1, _sourceItemType, _wallet));
            require(_check_item(_item2, _sourceItemType, _wallet));
            require(_check_item(_item3, _sourceItemType, _wallet));
            require(_check_item(_item4, _sourceItemType, _wallet));
            require(_item5 == 0);
        //when fluffiest x3 -> nuichan, require 3 items
        //} else if (_targetItemType == 197) {
        } else if (_targetItemType >= 237) {
            require(_check_item(_item1, _sourceItemType, _wallet));
            require(_check_item(_item2, _sourceItemType, _wallet));
            require(_check_item(_item3, _sourceItemType, _wallet));
            require(_item4 == 0);
            require(_item5 == 0);
        }
        return true;
    }
    function _check_item(uint _item, uint _sourceItemType, address _wallet) internal view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        (uint _itemType, , , , ,) = mc.items(_item);
        require(_itemType == _sourceItemType);
        require(mfs.check_owner_ofItem(_item, _wallet));
        return true;
    }
    function _get_sourceItemType(uint _sourceItem) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        (uint _sourceItemType, , , , ,) = mc.items(_sourceItem);
        return _sourceItemType;
    }
    function _get_targetItemType(uint _sourceItem) internal view returns (uint) {
        uint _sourceItemType = _get_sourceItemType(_sourceItem);
        uint _targetItemType;
        // when fluffy or fluffier, +12
        if (201 <= _sourceItemType && _sourceItemType <= 224) {
            _targetItemType = _sourceItemType +12;
        // when fluffiest, -> nui-chan
        } else if (225 <= _sourceItemType && _sourceItemType <= 236) {
            //_targetItemType = 197;
            _targetItemType = _sourceItemType +12;
        }
        return _targetItemType;
    }
    function _burn_sourceItems(
        uint _item1, 
        uint _item2, 
        uint _item3,
        uint _item4,
        uint _item5
    ) internal {
        _burn(_item1);
        _burn(_item2);
        _burn(_item3);
        if (_item4 != 0) {
            _burn(_item4);
        }
        if (_item5 != 0) {
            _burn(_item5);
        }
    }
    function _mint_item(
        uint _summoner,
        uint _targetItemType,
        uint _sourceItemType,
        address _wallet
    ) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        uint _seed = mfs.seed(_summoner);
        string memory _memo = toString(_sourceItemType);    //memo source fluffy type
        mc.craft(_targetItemType, _summoner, _wallet, _seed, _memo, 0);
    }
    function _get_present_itemNo() internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        return mc.next_item() - 1;
    }
    function _update_storage_nui(uint _summoner, uint _item_nui) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        Murasaki_Storage_Nui msn = Murasaki_Storage_Nui(ma.address_Murasaki_Storage_Nui());
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
    
    //unpack coin/material
    event Unpack(uint indexed _summoner, uint _item_type, uint _item);
    function unpack_bag(uint _summoner, uint _item) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        require(mc.ownerOf(_item) == msg.sender);
        //check item_type
        (uint _item_type, , , , ,) = mc.items(_item);
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
    
    //open present box and mint precious
    //presentbox = 200
    function open_presentbox(uint _summoner, uint _item) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        require(mc.ownerOf(_item) == msg.sender);
        //check item_type
        (uint _item_type, , uint crafted_summoner, , ,) = mc.items(_item);
        require(_item_type == 200);
        //burn _item
        _burn(_item);
        //mint precious
        //need: summoner_to, summoner_from, to_wallet
        _mint_precious(_summoner, crafted_summoner, msg.sender);
        //add some exp
        uint _exp_add = mp.EXP_FROM_PRESENTBOX();
        uint _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        //update score
        uint _total_exp_gained = mss.total_exp_gained(_summoner) + _exp_add;
        mss.set_total_exp_gained(_summoner, _total_exp_gained);
    }
    //mint precious
    event Fluffy(uint indexed _summoner_to, uint _summoner_from, uint _item_type);
    function _mint_precious(uint _summoner_to, uint _summoner_from, address _wallet_to) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        //mint precious
        uint _seed = mfs.seed(_summoner_from);
        uint _item_type = 200 + mfs.d12(_summoner_from) + 1;   //201-212
        string memory _memo = "";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo, 0);
        //update score
        uint _total_precious_received = mss.total_precious_received(_summoner_to);
        mss.set_total_precious_received(_summoner_to, _total_precious_received + 1);
        //event
        emit Fluffy(_summoner_to, _summoner_from, _item_type);
    }
}


//---Crafting_Codex


contract Murasaki_Function_Crafting_Codex is Ownable {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
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
            //dc limit check
            if (_dc < dc_limit_table[_item_type] + _delta) {
                _mod_dc = dc_limit_table[_item_type];
            } else {
                _mod_dc = _dc - _delta;
            }
            /*
            if (_dc < 3000 + _delta) {
                _mod_dc = 3000;
            } else {
                _mod_dc = _dc - _delta;
            }
            */
            return _mod_dc;
        }
    }

    //count crafting items
    function count_crafting_items(address _address) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
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
        /*
        //197: fluffiest -> nui
        } else if (_item_type == 197) {
            _coin = 600;
            _material = 600;
        }
        */
        //237-248: fluffiest -> nui
        } else if (_item_type >= 237 && _item_type <= 248) {
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
        9999999999,
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
        9999999999,
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
    
    //item dc limit
    uint[64] public dc_limit_table = [
        //0:dummy
        9999999999,
        //1-16: mining item
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        4000,
        4000,
        4000,
        4000,
        5000,
        5000,
        6000,
        7000,
        //17-32: farming item
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        4000,
        4000,
        4000,
        4000,
        5000,
        5000,
        6000,
        7000,
        //33-48: crafting item
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        3000,
        4000,
        4000,
        4000,
        4000,
        5000,
        5000,
        6000,
        7000,
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
        9999999999,
        //1-16: mining item
        3000,
        3600,
        4050,
        4500,
        4950,
        5400,
        5850,
        6300,
        6750 * 4/3,
        7200 * 4/3,
        7650 * 4/3,
        8100 * 4/3,
        8550 * 5/3,
        9000 * 5/3,
        9450 * 6/3,
        9900 * 7/3,
        //17-32: farming item
        300,
        360,
        405,
        450,
        495,
        540,
        585,
        630,
        675 * 4/3,
        720 * 4/3,
        765 * 4/3,
        810 * 4/3,
        855 * 5/3,
        900 * 5/3,
        945 * 6/3,
        990 * 7/3,
        //33-48: crafting item
        1500,
        1800,
        2025,
        2250,
        2475,
        2700,
        2925,
        3150,
        3375 * 4/3,
        3600 * 4/3,
        3825 * 4/3,
        4050 * 4/3,
        4275 * 5/3,
        4500 * 5/3,
        4725 * 6/3,
        4950 * 7/3,
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
        9999999999,
        //1-16: mining item
        300,
        360,
        405,
        450,
        495,
        540,
        585,
        630,
        675 * 4/3,
        720 * 4/3,
        765 * 4/3,
        810 * 4/3,
        855 * 5/3,
        900 * 5/3,
        945 * 6/3,
        990 * 7/3,
        //17-32: farming item
        3000,
        3600,
        4050,
        4500,
        4950,
        5400,
        5850,
        6300,
        6750 * 4/3,
        7200 * 4/3,
        7650 * 4/3,
        8100 * 4/3,
        8550 * 5/3,
        9000 * 5/3,
        9450 * 6/3,
        9900 * 7/3,
        //33-48: crafting item
        1500,
        1800,
        2025,
        2250,
        2475,
        2700,
        2925,
        3150,
        3375 * 4/3,
        3600 * 4/3,
        3825 * 4/3,
        4050 * 4/3,
        4275 * 5/3,
        4500 * 5/3,
        4725 * 6/3,
        4950 * 7/3,
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
    
        //***TODO*** need mod

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
        //"Fluffy Murasaki-San",
        "",
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

        //237-248
        "Gray Doll",
        "Beige Doll",
        "Limegreen Doll",
        "Lightblue Doll",
        "Blue Doll",
        "Purple Doll",
        "Redpurple Doll",
        "Red Doll",
        "Orange Doll",
        "Pink Doll",
        "Yellow Doll",
        "White Doll"
    ];
}


//---Name


contract Murasaki_Function_Name is Ownable, ReentrancyGuard {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Name mn = Murasaki_Name(ma.address_Murasaki_Name());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Name mn = Murasaki_Name(ma.address_Murasaki_Name());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Name mn = Murasaki_Name(ma.address_Murasaki_Name());
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


//---Achievement


contract Murasaki_Function_Achievement is Ownable {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    //get_achv
    function get_achievement (uint _summoner) external view returns (bool[32] memory) {
        bool[32] memory _achievements;
        for (uint _achv_id=1; _achv_id<32; _achv_id++) {
            _achievements[_achv_id] = _check_achievement(_summoner, _achv_id);
        }
        return _achievements;
    }
    
    //get count of achv
    function get_countOf_achievement (uint _summoner) external view returns (uint) {
        uint _count = 0;
        bool _res;
        for (uint _achv_id=1; _achv_id<32; _achv_id++) {
            _res = _check_achievement(_summoner, _achv_id);
            if (_res == true) {
                _count += 1;
            }
        }
        return _count;
    }

    //internal, check_achv
    function _check_achievement(uint _summoner, uint _achievement_id) internal view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        //1: total_coin > 10000
        if (_achievement_id == 1) {
            if (mss.total_coin_mined(_summoner) >= 10000) {
                return true;
            }
        //2: total_coin > 30000
        } else if (_achievement_id == 2) {
            if (mss.total_coin_mined(_summoner) >= 30000) {
                return true;
            }
        //3: total_coin > 100000
        } else if (_achievement_id == 3) {
            if (mss.total_coin_mined(_summoner) >= 100000) {
                return true;
            }
        //4: total_coin > 300000
        } else if (_achievement_id == 4) {
            if (mss.total_coin_mined(_summoner) >= 300000) {
                return true;
            }
        //5: total_coin > 1000000
        } else if (_achievement_id == 5) {
            if (mss.total_coin_mined(_summoner) >= 1000000) {
                return true;
            }
        //6: total_material > 10000
        } else if (_achievement_id == 6) {
            if (mss.total_material_farmed(_summoner) >= 10000) {
                return true;
            }
        //7: total_material > 30000
        } else if (_achievement_id == 7) {
            if (mss.total_material_farmed(_summoner) >= 30000) {
                return true;
            }
        //8: total_material > 100000
        } else if (_achievement_id == 8) {
            if (mss.total_material_farmed(_summoner) >= 100000) {
                return true;
            }
        //9: total_material > 300000
        } else if (_achievement_id == 9) {
            if (mss.total_material_farmed(_summoner) >= 300000) {
                return true;
            }
        //10: total_material > 1000000
        } else if (_achievement_id == 10) {
            if (mss.total_material_farmed(_summoner) >= 1000000) {
                return true;
            }
        //11: total_item > 5
        } else if (_achievement_id == 11) {
            if (mss.total_item_crafted(_summoner) >= 5) {
                return true;
            }
        //12: total_item > 10
        } else if (_achievement_id == 12) {
            if (mss.total_item_crafted(_summoner) >= 10) {
                return true;
            }
        //13: total_item > 20
        } else if (_achievement_id == 13) {
            if (mss.total_item_crafted(_summoner) >= 20) {
                return true;
            }
        //14: total_item > 40
        } else if (_achievement_id == 14) {
            if (mss.total_item_crafted(_summoner) >= 40) {
                return true;
            }
        //15: total_item > 80
        } else if (_achievement_id == 15) {
            if (mss.total_item_crafted(_summoner) >= 80) {
                return true;
            }
        //16: total_fluffy > 30
        } else if (_achievement_id == 16) {
            if (mss.total_precious_received(_summoner) >= 30) {
                return true;
            }
        //17: total_fluffy > 60
        } else if (_achievement_id == 17) {
            if (mss.total_precious_received(_summoner) >= 60) {
                return true;
            }
        //18: total_fluffy > 120
        } else if (_achievement_id == 18) {
            if (mss.total_precious_received(_summoner) >= 120) {
                return true;
            }
        //19: total_fluffy > 240
        } else if (_achievement_id == 19) {
            if (mss.total_precious_received(_summoner) >= 240) {
                return true;
            }
        //20: total_fluffy > 480
        } else if (_achievement_id == 20) {
            if (mss.total_precious_received(_summoner) >= 480) {
                return true;
            }
        }
        return false;
    }
}


//---Music_Practice
contract Murasaki_Function_Music_Practice is Ownable, ReentrancyGuard {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }
    
    //item types
    //***TODO*** item_type
    uint item_type_clarinet = 14;
    uint item_type_piano = 27;
    uint item_type_violin = 44;
    uint item_type_horn = 15;
    uint item_type_timpani = 30;
    uint item_type_cello = 46;
    uint required_level = 5;
    
    //admin modify item types
    function _set_item_type_clarinet(uint _value) external onlyOwner {
        item_type_clarinet = _value;
    }
    function _set_item_type_piano(uint _value) external onlyOwner {
        item_type_piano = _value;
    }
    function _set_item_type_violin(uint _value) external onlyOwner {
        item_type_violin = _value;
    }
    function _set_item_type_horn(uint _value) external onlyOwner {
        item_type_horn = _value;
    }
    function _set_item_type_timpani(uint _value) external onlyOwner {
        item_type_timpani = _value;
    }
    function _set_item_type_cello(uint _value) external onlyOwner {
        item_type_cello = _value;
    }
    function _set_required_level(uint _value) external onlyOwner {
        required_level = _value;
    }

    //start practice
    function start_practice(uint _summoner, uint _item_id) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        require(_check_summoner(_summoner, msg.sender));
        require(_check_item(_item_id, msg.sender));
        require(
            ms.mining_status(_summoner) == 0 
            && ms.farming_status(_summoner) == 0 
            && ms.crafting_status(_summoner) == 0
            && ms.practice_status(_summoner) == 0
        );
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.level(_summoner) >= required_level);
        ms.set_practice_status(_summoner, 1);
        ms.set_practice_item_id(_summoner, _item_id);
        ms.set_practice_start_time(_summoner, block.timestamp);
    }
    
    //stop practice
    event Practice(uint indexed _summoner, uint _itemType, uint _exp);
    function stop_practice(uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        require(_check_summoner(_summoner, msg.sender));
        require(ms.practice_status(_summoner) == 1);
        ms.set_practice_status(_summoner, 0);
        //get item_type used in practice
        uint _item_id = ms.practice_item_id(_summoner);
        uint _item_type = _get_item_type(_item_id);
        //calc exp
        uint _exp = _calc_exp(_summoner);
        //boost exp by item rarity
        _exp = _get_exp_mod_byRarity(_exp, _item_type);
        //boost exp by status point and update exp
        if (_item_type == item_type_clarinet) {
            _exp = _get_exp_mod_ofClarinet(_summoner, _exp);
            ms.set_exp_clarinet(_summoner, ms.exp_clarinet(_summoner) + _exp);
        } else if (_item_type == item_type_piano) {
            _exp = _get_exp_mod_ofPiano(_summoner, _exp);
            ms.set_exp_piano(_summoner, ms.exp_piano(_summoner) + _exp);
        } else if (_item_type == item_type_violin) {
            _exp = _get_exp_mod_ofViolin(_summoner, _exp);
            ms.set_exp_violin(_summoner, ms.exp_violin(_summoner) + _exp);
        } else if (_item_type == item_type_horn) {
            _exp = _get_exp_mod_ofHorn(_summoner, _exp);
            ms.set_exp_horn(_summoner, ms.exp_horn(_summoner) + _exp);
        } else if (_item_type == item_type_timpani) {
            _exp = _get_exp_mod_ofTimpani(_summoner, _exp);
            ms.set_exp_timpani(_summoner, ms.exp_timpani(_summoner) + _exp);
        } else if (_item_type == item_type_cello) {
            _exp = _get_exp_mod_ofCello(_summoner, _exp);
            ms.set_exp_cello(_summoner, ms.exp_cello(_summoner) + _exp);
        }
        //event
        emit Practice(_summoner, _item_type, _exp);
        //update last_grooming_time_plus_working_time
        uint _delta_sec = block.timestamp - ms.practice_start_time(_summoner);
        uint _last_grooming_time_plus_working_time = 
            ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec;
        ms.set_last_grooming_time_plus_working_time(
            _summoner, 
            _last_grooming_time_plus_working_time
        );
        //reset parameters
        ms.set_practice_item_id(_summoner, 0);
        ms.set_practice_start_time(_summoner, 0);
    }
    
    //internal: calc delta_sec
    function _calc_delta_sec (uint _summoner) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        uint _now = block.timestamp;
        uint _delta = _now - ms.practice_start_time(_summoner);
        //check happy
        uint _delta_grooming = _now - ms.last_grooming_time(_summoner);
        uint _base_grooming = mp.BASE_SEC() *3 *100/mp.SPEED();
        if (_delta_grooming >= _base_grooming) {
            _delta = _base_grooming;
        }
        //speed boost
        _delta = _delta * mp.SPEED() / 100;
        return _delta;
    }

    //internal: calc exp
    function _calc_exp (uint _summoner) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        uint _now = block.timestamp;
        uint _delta = _now - ms.practice_start_time(_summoner);
        //check happy
        uint _delta_grooming = _now - ms.last_grooming_time(_summoner);
        uint _base_grooming = mp.BASE_SEC() *3 *100/mp.SPEED();
        if (_delta_grooming >= _base_grooming) {
            _delta = _base_grooming;
        }
        //speed boost
        _delta = _delta * mp.SPEED() / 100;
        //1000exp = 1day
        uint _exp = _delta * 1000 / mp.BASE_SEC();
        return _exp;
    }
    
    //internal: get item_type
    function _get_item_type(uint _item_id) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        (uint _item_type, , , , ,) = mc.items(_item_id);
        // uncommon, rare -> common
        if (_item_type >= 129) {
            _item_type -= 128;
        } else if (_item_type >= 65) {
            _item_type -= 64;
        }
        return _item_type;
    }
    
    //internal: check summoner
    function _check_summoner(uint _summoner, address _wallet) internal view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, _wallet));
        require(mfs.not_petrified(_summoner));
        return true;
    }
    
    //internal: check item
    function _check_item(uint _item_id, address _wallet) internal view returns (bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        require(mfs.check_owner_ofItem(_item_id, _wallet));
        (uint _item_type, , , , ,) = mc.items(_item_id);
        require(
            _item_type == item_type_clarinet
            || _item_type == item_type_piano
            || _item_type == item_type_violin
            || _item_type == item_type_horn
            || _item_type == item_type_timpani
            || _item_type == item_type_cello
        );
        return true;
    }
    
    //internal: get exp_mod by item_rarity
    //common: +0%, uncommon: +10%, rare: +20% exp
    function _get_exp_mod_byRarity(uint _exp, uint _item_type) internal pure returns (uint) {
        if (_item_type >= 129) {
            return _exp * 120 / 100;
        } else if (_item_type >= 65) {
            return _exp * 110 / 100;
        } else {
            return _exp;
        }
    }
    
    //internal: get exp_mod by status
    // +1% per 1 status point, STR, DEX, INT
    function _get_exp_mod_ofClarinet(uint _summoner, uint _exp) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Info mi = Murasaki_Info(ma.address_Murasaki_Info());
        _exp += _exp * mi.strength_withItems(_summoner) / 10000;
        return _exp;
    }
    function _get_exp_mod_ofPiano(uint _summoner, uint _exp) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Info mi = Murasaki_Info(ma.address_Murasaki_Info());
        _exp += _exp * mi.dexterity_withItems(_summoner) / 10000;
        return _exp;
    }
    function _get_exp_mod_ofViolin(uint _summoner, uint _exp) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Info mi = Murasaki_Info(ma.address_Murasaki_Info());
        _exp += _exp * mi.intelligence_withItems(_summoner) / 10000;
        return _exp;
    }
    function _get_exp_mod_ofHorn(uint _summoner, uint _exp) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Info mi = Murasaki_Info(ma.address_Murasaki_Info());
        _exp += _exp * mi.strength_withItems(_summoner) / 10000;
        return _exp;
    }
    function _get_exp_mod_ofTimpani(uint _summoner, uint _exp) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Info mi = Murasaki_Info(ma.address_Murasaki_Info());
        _exp += _exp * mi.dexterity_withItems(_summoner) / 10000;
        return _exp;
    }
    function _get_exp_mod_ofCello(uint _summoner, uint _exp) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Info mi = Murasaki_Info(ma.address_Murasaki_Info());
        _exp += _exp * mi.intelligence_withItems(_summoner) / 10000;
        return _exp;
    }
    
    //get practice level of each instrument
    function get_practiceLevel_clarinet (uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return _calc_level_from_exp(ms.exp_clarinet(_summoner));
    }
    function get_practiceLevel_piano (uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return _calc_level_from_exp(ms.exp_piano(_summoner));
    }
    function get_practiceLevel_violin (uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return _calc_level_from_exp(ms.exp_violin(_summoner));
    }
    function get_practiceLevel_horn (uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return _calc_level_from_exp(ms.exp_horn(_summoner));
    }
    function get_practiceLevel_timpani (uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return _calc_level_from_exp(ms.exp_timpani(_summoner));
    }
    function get_practiceLevel_cello (uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return _calc_level_from_exp(ms.exp_cello(_summoner));
    }
    
    //internal: calc level from exp
    function _calc_level_from_exp(uint _exp) internal pure returns (uint) {
        //Lv2=5000, Lv3=Lv2+5000, Lv4=Lv3+5000+delta_add(=2000)*1
        uint _level = 0;
        if (_exp == 0) {
            _level = 0;
        } else if (_exp < 5000) {
            _level = 1;
        } else if (_exp < 10000) {
            _level = 2;
        } else if (_exp < 17000) {
            _level = 3;
        } else if (_exp < 26000) {
            _level = 4;
        } else if (_exp < 37000) {
            _level = 5;
        } else if (_exp < 50000) {
            _level = 6;
        } else if (_exp < 65000) {
            _level = 7;
        } else if (_exp < 82000) {
            _level = 8;
        } else if (_exp < 101000) {
            _level = 9;
        } else if (_exp < 122000) {
            _level = 10;
        } else if (_exp < 145000) {
            _level = 11;
        } else if (_exp < 170000) {
            _level = 12;
        } else if (_exp < 197000) {
            _level = 13;
        } else if (_exp < 226000) {
            _level = 14;
        } else if (_exp < 257000) {
            _level = 15;
        } else if (_exp < 290000) {
            _level = 16;
        } else if (_exp < 325000) {
            _level = 17;
        } else if (_exp < 362000) {
            _level = 18;
        } else if (_exp < 401000) {
            _level = 19;
        } else if (_exp >= 401000) {
            _level = 20;
        }
        return _level;
    }
}


//---Staking_Reward
contract Murasaki_Function_Staking_Reward is Ownable, ReentrancyGuard {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }
    
    //get staking amount
    function get_staking_amount (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        address _owner = mfs.get_owner(_summoner);
        IAstarBase ASTARBASE = IAstarBase(ma.address_AstarBase());
        uint _staker_raw = ASTARBASE.checkStakerStatusOnContract(_owner, ma.address_Murasaki_Main());
        uint _staker = _staker_raw / (10 ** 18);
        return _staker;
    }
    
    //get staking counter speed
    function get_staking_counter_speed (uint _summoner) public view returns (uint) {
        uint _staker = get_staking_amount(_summoner);
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
    
    //get present staking counter
    function get_staking_counter (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.staking_reward_counter(_summoner);
    }
    
    //get staking reword percent
    function get_staking_percent (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        uint _counter = get_staking_counter(_summoner);
        uint _percent = 0;
        if (_counter == mp.STAKING_REWARD_SEC()){
            _percent = 0;
        } else if (_counter == 0) {
            _percent = 100;
        } else {
            _percent = (mp.STAKING_REWARD_SEC() - _counter) * 100 / mp.STAKING_REWARD_SEC();
            //_percent =  _counter * 100 / mp.STAKING_REWARD_SEC();
        }
        return _percent;
    }
    
    //update staking counter
    //can be exected by direct contract access
    function update_staking_counter (uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        //only from mffg
        //require(msg.sender == ma.address_Murasaki_Function_Feeding_and_Grooming());
        uint _delta_sec = block.timestamp - ms.last_counter_update_time(_summoner);
        //delta_sec limit, <= 1/2 day
        if (_delta_sec > 43200) {
            _delta_sec = 43200;
        }
        uint _speed = get_staking_counter_speed(_summoner);
        if (_speed > 0) {
            uint _decrease = _speed * _delta_sec / 100;
            uint _counter = ms.staking_reward_counter(_summoner);
            //decrease counter sec
            if (_counter > _decrease) {
                _counter = _counter - _decrease;
                ms.set_staking_reward_counter(_summoner, _counter);
            //when counter <= 0, set counter=0
            } else {
                ms.set_staking_reward_counter(_summoner, 0);
            }
            //update total_counter
            ms.set_total_staking_reward_counter(
                _summoner,
                ms.total_staking_reward_counter(_summoner) + _decrease
            );
        }
        //update last update time, both speed>0 & speed=0
        ms.set_last_counter_update_time(_summoner, block.timestamp);
    }
    
    //chekc open staking reword
    function check_open_staking_reward (uint _summoner) public view returns (bool) {
        bool _bool = false;
        if (get_staking_percent(_summoner) == 100) {
            _bool = true;
        }
        return _bool;
    }
    
    //***TODO*** mint random nft
    event Staking_Reward(uint indexed _summoner, string _reward);
    function open_staking_reward (uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        //check counter=0
        require(check_open_staking_reward(_summoner));
        //mint random nft
        uint _rnd = mfs.d100(_summoner);
        string memory _reward = "";
        if (_rnd < 10) {
            _mint_fluffier(_summoner);
            _reward = "fluffier";
        } else if (_rnd < 20) {
            _mint_bank(_summoner);
            _reward = "piggy bank";
        } else if (_rnd < 30) {
            _mint_pouch(_summoner);
            _reward = "leaf pouch";
        } else {
            _mint_fluffy(_summoner);
            _reward = "fluffy";
        }
        //reset counter
        ms.set_staking_reward_counter(_summoner, mp.STAKING_REWARD_SEC());
        //event
        emit Staking_Reward(_summoner, _reward);
    }
    //mint fluffy
    function _mint_fluffy(uint _summoner_to) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        //mint precious
        address _owner = mfs.get_owner(_summoner_to);
        uint _seed = mfs.seed(_summoner_to);
        uint _item_type = 200 + mfs.d12(_summoner_to) + 1;   //201-212
        string memory _memo = "";
        mc.craft(_item_type, 0, _owner, _seed, _memo, 0);
        //update score
        uint _total_precious_received = mss.total_precious_received(_summoner_to);
        mss.set_total_precious_received(_summoner_to, _total_precious_received + 1);
    }
    //mint fluffier
    function _mint_fluffier(uint _summoner_to) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        //mint precious
        address _owner = mfs.get_owner(_summoner_to);
        uint _seed = mfs.seed(_summoner_to);
        uint _item_type = 200 + mfs.d12(_summoner_to) + 1 +12;   //213-224
        string memory _memo = "";
        mc.craft(_item_type, 0, _owner, _seed, _memo, 0);
        //update score
        uint _total_precious_received = mss.total_precious_received(_summoner_to);
        mss.set_total_precious_received(_summoner_to, _total_precious_received + 1);
    }
    //mint bank
    function _mint_bank(uint _summoner_to) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        //mint precious
        address _owner = mfs.get_owner(_summoner_to);
        uint _seed = mfs.seed(_summoner_to);
        uint _item_type = 194;
        string memory _memo = "";
        mc.craft(_item_type, 0, _owner, _seed, _memo, 0);
    }
    //mint pouch
    function _mint_pouch(uint _summoner_to) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        //mint precious
        address _owner = mfs.get_owner(_summoner_to);
        uint _seed = mfs.seed(_summoner_to);
        uint _item_type = 195;
        string memory _memo = "";
        mc.craft(_item_type, 0, _owner, _seed, _memo, 0);
    }
    //mint twinkle
    //+0.1, 
    function _mint_twinkle(uint _summoner_to) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        //mint precious
        address _owner = mfs.get_owner(_summoner_to);
        uint _seed = mfs.seed(_summoner_to);
        uint _item_type = 250;
        uint _item_subtype = mfs.d12(_seed + _summoner_to);
        string memory _memo = "";
        mc.craft(_item_type, 0, _owner, _seed, _memo, _item_subtype);
    }
}


//===Independent==================================================================================================================


//---Murasaki_Dice


contract Murasaki_Dice is Ownable, ReentrancyGuard {

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
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        return _mod_dice;
    }
    
    //get last_rolled_dice
    function get_last_rolled_dice(uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
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
    uint public interval_sec = 60 * 60 * 24 * 7;    // 7 days
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        uint SPEED = mp.SPEED();
        uint _mail_id = receiving[_summoner_to];
        //no mail
        if (_mail_id == 0) {
            return false;
        } else {
            Mail memory _mail = mails[_mail_id];
            uint _now = block.timestamp;
            uint _delta = (_now - _mail.send_time) * SPEED/100;
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
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
        (uint _item_type, , , , ,) = mc.items(_item_mail);
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        uint _count_summoners = mm.next_token() - 1;
        uint _summoner_to = 0;
        uint _count = 0;
        while (_count < 5) {
            uint _summoner_tmp = mfs.dn(_summoner_from + _count, _count_summoners) + 1;
            if (
                _summoner_to == 0
                && ms.isActive(_summoner_tmp)
                //&& ms.level(_summoner_tmp) >= 3
                && mfs.calc_satiety(_summoner_tmp) >= 10
                && mfs.calc_happy(_summoner_tmp) >= 10
                && _summoner_tmp != _summoner_from
            ) {
                _summoner_to = _summoner_tmp;
            }
            _count += 1;
            /*
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
            */
        }
        return _summoner_to;
    }
    function _burn_mail(uint _item_mail) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(ma.address_Murasaki_Function_Crafting());
        mfc.burn_mail(_item_mail);
    }
    
    //open mail
    event Open_Mail(uint indexed _summoner_to, uint _summoner_from);
    function open_mail(uint _summoner_to) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        _mint_presentbox(_summoner_from, mm.ownerOf(_summoner_to));
        _mint_presentbox(_summoner_to, mm.ownerOf(_summoner_from));
    }
    function _mint_presentbox(uint _summoner_from, address _wallet_to) internal {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        uint _seed = mfs.seed(_summoner_from);
        uint _item_type = 200;
        string memory _memo = "mail opening";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo, 0);
    }    
}


//---Fluffy_Festival


contract Fluffy_Festival is Ownable, ReentrancyGuard {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        uint _seed = mfs.seed(_summoner);
        uint _item_type = 200;
        mc.craft(_item_type, _summoner, _wallet_to, _seed, _memo, 0);
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
    function end_voting(uint _summoner) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
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
}



//---Achievement_onChain


contract Achievement_onChain is Ownable {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }
    
    //token/nft address
    mapping(uint => address) public tokens;
    mapping(uint => address) public nfts;
    uint public token_number;
    uint public nft_number;
    
    //astarbase address
    //address public address_AstarBase;
    
    //murasaki nft address
    address public address_Murasaki_NFT;
    
    //admin, set address
    //function _set_AstarBase(address _address) external onlyOwner {
    //    address_AstarBase = _address;
   // }
    function _set_Murasaki_NFT(address _address) external onlyOwner {
        address_Murasaki_NFT = _address;
    }
    
    //admin, set token/nft address
    function _set_tokens(uint _number, address _address) external onlyOwner {
        tokens[_number] = _address;
    }
    function _set_nfts(uint _number, address _address) external onlyOwner {
        nfts[_number] = _address;
    }
    
    //admin, set toke/nft number
    function _set_token_number(uint _value) external onlyOwner {
        token_number = _value;
    }
    function _set_nft_number(uint _value) external onlyOwner {
        nft_number = _value;
    }
    
    //get_score
    function get_score (uint _summoner) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        address _owner = mfs.get_owner(_summoner);
        uint _score_token = get_score_token(_owner);
        uint _score_nft = get_score_nft(_owner);
        uint _score_staking = get_score_staking(_owner);
        uint _score_murasaki_nft = get_score_murasaki_nft(_owner);
        uint _score = _score_token + _score_nft + _score_staking + _score_murasaki_nft;
        return _score;
    }
    
    //get_scores as array
    function get_scores (uint _summoner) external view returns (uint[5] memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        address _owner = mfs.get_owner(_summoner);
        uint _score_token = get_score_token(_owner);
        uint _score_nft = get_score_nft(_owner);
        uint _score_staking = get_score_staking(_owner);
        uint _score_murasaki_nft = get_score_murasaki_nft(_owner);
        uint _score = _score_token + _score_nft + _score_staking + _score_murasaki_nft;
        uint[5] memory _scores = [
            _score, 
            _score_token, 
            _score_nft, 
            _score_staking, 
            _score_murasaki_nft
        ];
        return _scores;
    }
    
    //internal, calc each score, min:0, max:100, 100=1%
    function get_score_token(address _owner) public view returns (uint) {
        uint _score = 0;
        for (uint i = 1; i <= token_number; i++) {
            ERC20 _token = ERC20(tokens[i]);
            uint _balance = _token.balanceOf(_owner);
            if (_balance > 0) {
                _score += 10;
            }
        }
        if (_score > 100) {
            _score = 100;
        }
        return _score;
    }
    function get_score_nft(address _owner) public view returns (uint) {
        uint _score = 0;
        for (uint i = 1; i <= nft_number; i++) {
            ERC721 _nft = ERC721(nfts[i]);
            uint _balance = _nft.balanceOf(_owner);
            if (_balance > 0) {
                _score += 1;
            }
        }
        if (_score > 100) {
            _score = 100;
        }
        return _score;
    }
    function get_score_staking(address _owner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        uint _staker = mfs.calc_dapps_staking_amount(_owner);
        uint _score;
        if (_staker == 0) {
            _score = 0;
        } else if (_staker < 500) {
            _score = 10;
        } else if (_staker < 1000) {
            _score = 20;
        } else if (_staker < 2000) {
            _score = 30;
        } else if (_staker < 4000) {
            _score = 40;
        } else if (_staker < 8000) {
            _score = 50;
        } else if (_staker < 16000) {
            _score = 60;
        } else if (_staker < 32000) {
            _score = 70;
        } else if (_staker < 64000) {
            _score = 80;
        } else if (_staker < 128000) {
            _score = 90;
        } else if (_staker >= 128000) {
            _score = 100;
        }
        return _score;
    }
    function get_score_murasaki_nft(address _owner) public view returns (uint) {
        ERC721 _nft = ERC721(address_Murasaki_NFT);
        uint _score = _nft.balanceOf(_owner) * 10;
        if (_score > 100) {
            _score = 100;
        }
        return _score;
    }
}


//===Info==================================================================================================================



//---Murasaki_Info

contract Murasaki_Info is Ownable {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }
    
    //Murasaki_Main
    function owner(uint _summoner) public view returns (address) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.get_owner(_summoner);
    }
    function class(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        return mm.class(_summoner);
    }
    function age(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        uint _now = block.timestamp;
        uint _age = _now - mm.summoned_time(_summoner);
        return _age;
    }
    
    //Murasaki_Name
    function name(uint _summoner) public view returns (string memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Name mn = Murasaki_Name(ma.address_Murasaki_Name());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.level(_summoner);
    }
    function exp(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.exp(_summoner);
    }
    function strength(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.strength(_summoner);
    }
    function dexterity(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.dexterity(_summoner);
    }
    function intelligence(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.intelligence(_summoner);
    }
    function luck(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.luck(_summoner);
    }
    function next_exp_required(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.coin(_summoner);
    }
    function material(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.material(_summoner);
    }
    function last_feeding_time(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.last_feeding_time(_summoner);
    }
    function last_grooming_time(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.last_grooming_time(_summoner);
    }
    function mining_status(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.mining_status(_summoner);
    }
    function mining_start_time(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.mining_start_time(_summoner);
    }
    function farming_status(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.farming_status(_summoner);
    }
    function farming_start_time(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.farming_start_time(_summoner);
    }
    function crafting_status(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.crafting_status(_summoner);
    }
    function crafting_start_time(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.crafting_start_time(_summoner);
    }
    function crafting_item_type(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.staking_reward_counter(_summoner);
    }
    /*
    function last_grooming_time_plus_working_time(uint _summoner) external view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_grooming_time_plus_working_time(_summoner);
    }
    */
    function total_staking_reward_counter(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.total_staking_reward_counter(_summoner);
    }
    function crafting_resume_flag(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.crafting_resume_flag(_summoner);
    }
    function crafting_resume_item_type(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.crafting_resume_item_type(_summoner);
    }
    function crafting_resume_item_dc(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.crafting_resume_item_dc(_summoner);
    }

    //Murasaki_Storage_Score
    function total_exp_gained(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        return mss.total_exp_gained(_summoner);
    }
    function total_coin_mined(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        return mss.total_coin_mined(_summoner);
    }
    function total_material_farmed(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        return mss.total_material_farmed(_summoner);
    }
    function total_item_crafted(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        return mss.total_item_crafted(_summoner);
    }
    function total_precious_received(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(ma.address_Murasaki_Storage_Score());
        return mss.total_precious_received(_summoner);
    }
    
    //Function_Share
    function satiety(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.calc_satiety(_summoner);
    }
    function happy(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.calc_happy(_summoner);
    }
    function precious(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.calc_precious(_summoner);
    }
    function not_petrified(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        bool _res = mfs.not_petrified(_summoner);
        if (_res == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    function dapps_staking_amount(uint _summoner) public view returns (uint) {
        address _owner = owner(_summoner);
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.calc_dapps_staking_amount(_owner);
    }
    function score(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.calc_score(_summoner);
    }
    function get_speed_of_dappsStaking(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.get_speed_of_dappsStaking(_summoner);
    }
    
    //Function_Working
    function calc_mining(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(ma.address_Murasaki_Function_Mining_and_Farming());
        return mfmf.calc_mining(_summoner);
    }
    function calc_farming(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(ma.address_Murasaki_Function_Mining_and_Farming());
        return mfmf.calc_farming(_summoner);
    }
    function calc_crafting(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(ma.address_Murasaki_Function_Crafting());
        return mfc.calc_crafting(_summoner);
    }
    function strength_withItems(uint _summoner) public view returns (uint) {
        address _owner = owner(_summoner);
        uint _str = strength(_summoner);
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(ma.address_Murasaki_Function_Mining_and_Farming());
        _str += mfmf.count_mining_items(_owner);
        return _str;
    }
    function dexterity_withItems(uint _summoner) public view returns (uint) {
        address _owner = owner(_summoner);
        uint _dex = dexterity(_summoner);
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(ma.address_Murasaki_Function_Mining_and_Farming());
        _dex += mfmf.count_farming_items(_owner);
        return _dex;
    }
    function intelligence_withItems(uint _summoner) public view returns (uint) {
        address _owner = owner(_summoner);
        uint _int = intelligence(_summoner);
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(ma.address_Murasaki_Function_Crafting());
        _int += mfc.count_crafting_items(_owner);
        return _int;
    }
    function luck_withItems(uint _summoner) public view returns (uint) {
        uint _luk = luck(_summoner);
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Feeding_and_Grooming mffg = Murasaki_Function_Feeding_and_Grooming(ma.address_Murasaki_Function_Feeding_and_Grooming());
        return mffg.calc_feeding(_summoner);
    }
    function calc_grooming(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Feeding_and_Grooming mffg = Murasaki_Function_Feeding_and_Grooming(ma.address_Murasaki_Function_Feeding_and_Grooming());
        return mffg.calc_grooming(_summoner);
    }
    
    //Dice
    function last_rolled_dice(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Dice md = Murasaki_Dice(ma.address_Murasaki_Dice());
        return md.get_last_rolled_dice(_summoner);
    }
    function last_dice_roll_time(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Dice md = Murasaki_Dice(ma.address_Murasaki_Dice());
        return md.last_dice_roll_time(_summoner);
    }
    function luck_withItems_withDice(uint _summoner) public view returns (uint) {
        uint _luk = luck_withItems(_summoner);
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Dice md = Murasaki_Dice(ma.address_Murasaki_Dice());
        _luk += md.get_rolled_dice(_summoner);
        return _luk;
    }
    
    //Mail
    function receiving_mail(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Mail mml = Murasaki_Mail(ma.address_Murasaki_Mail());
        bool _res = mml.check_receiving_mail(_summoner);
        if (_res == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    function sending_interval(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Mail mml = Murasaki_Mail(ma.address_Murasaki_Mail());
        return mml.calc_sending_interval(_summoner);
    }
    function check_lastMailOpen(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Mail mml = Murasaki_Mail(ma.address_Murasaki_Mail());
        bool _res = mml.check_lastMailOpen(_summoner);
        if (_res == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    
    //Lootlike
    function allStatus(uint _summoner) public view returns (string[8] memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Lootlike mll = Murasaki_Lootlike(ma.address_Murasaki_Lootlike());
        return mll.get_allStatus(_summoner);
    }
    
    //isActive
    function isActive(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        bool _isActive = ms.isActive(_summoner);
        if (_isActive == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    
    //inHouse
    function inHouse(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        bool _inHouse = ms.inHouse(_summoner);
        if (_inHouse == true) {
            return uint(1);
        } else {
            return uint(0);
        }
    }
    
    function next_festival_block() public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Fluffy_Festival ff = Fluffy_Festival(ma.address_Fluffy_Festival());
        return ff.next_festival_block();
    }
    
    //parameter
    function speed() public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        return mp.SPEED();
    }
    function price() public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        return mp.PRICE();
    }
    function staking_reward_sec() public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        return mp.STAKING_REWARD_SEC();
    }
    function elected_fluffy_type() public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        return mp.ELECTED_FLUFFY_TYPE();
    }
    
    //Achievement_onChain
    function get_score(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Achievement_onChain ac = Achievement_onChain(ma.address_Achievement_onChain());
        return ac.get_score(_summoner);
    }
    function get_score_token(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Achievement_onChain ac = Achievement_onChain(ma.address_Achievement_onChain());
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        address _owner = mfs.get_owner(_summoner);
        return ac.get_score_token(_owner);
    }
    function get_score_nft(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Achievement_onChain ac = Achievement_onChain(ma.address_Achievement_onChain());
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        address _owner = mfs.get_owner(_summoner);
        return ac.get_score_nft(_owner);
    }
    function get_score_staking(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Achievement_onChain ac = Achievement_onChain(ma.address_Achievement_onChain());
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        address _owner = mfs.get_owner(_summoner);
        return ac.get_score_staking(_owner);
    }
    function get_score_murasaki_nft(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Achievement_onChain ac = Achievement_onChain(ma.address_Achievement_onChain());
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        address _owner = mfs.get_owner(_summoner);
        return ac.get_score_murasaki_nft(_owner);
    }
    
    //Practice
    function exp_clarinet (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.exp_clarinet(_summoner);
    }
    function exp_piano (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.exp_piano(_summoner);
    }
    function exp_violin (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.exp_violin(_summoner);
    }
    function exp_horn (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.exp_horn(_summoner);
    }
    function exp_timpani (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.exp_timpani(_summoner);
    }
    function exp_cello (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.exp_cello(_summoner);
    }
    function practice_status (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.practice_status(_summoner);
    }
    function practice_item_id (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.practice_item_id(_summoner);
    }
    function practice_start_time (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        return ms.practice_start_time(_summoner);
    }
    function get_practiceLevel_clarinet (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Music_Practice mfp = Murasaki_Function_Music_Practice(ma.address_Murasaki_Function_Music_Practice());
        return mfp.get_practiceLevel_clarinet(_summoner);
    }
    function get_practiceLevel_piano (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Music_Practice mfp = Murasaki_Function_Music_Practice(ma.address_Murasaki_Function_Music_Practice());
        return mfp.get_practiceLevel_piano(_summoner);
    }
    function get_practiceLevel_violin (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Music_Practice mfp = Murasaki_Function_Music_Practice(ma.address_Murasaki_Function_Music_Practice());
        return mfp.get_practiceLevel_violin(_summoner);
    }
    function get_practiceLevel_horn (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Music_Practice mfp = Murasaki_Function_Music_Practice(ma.address_Murasaki_Function_Music_Practice());
        return mfp.get_practiceLevel_horn(_summoner);
    }
    function get_practiceLevel_timpani (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Music_Practice mfp = Murasaki_Function_Music_Practice(ma.address_Murasaki_Function_Music_Practice());
        return mfp.get_practiceLevel_timpani(_summoner);
    }
    function get_practiceLevel_cello (uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Music_Practice mfp = Murasaki_Function_Music_Practice(ma.address_Murasaki_Function_Music_Practice());
        return mfp.get_practiceLevel_cello(_summoner);
    }
    
    //staking
    function get_staking_percent(uint _summoner) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Staking_Reward mfsl = Murasaki_Function_Staking_Reward(ma.address_Murasaki_Function_Staking_Reward());
        return mfsl.get_staking_percent(_summoner);
    }
    
    //###dynamic
    function allDynamicStatus(uint _summoner) external view returns (uint[96] memory) {
        uint[96] memory _res;
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
        _res[59] = total_staking_reward_counter(_summoner);
        _res[60] = next_festival_block();
        _res[61] = crafting_resume_flag(_summoner);
        _res[62] = crafting_resume_item_type(_summoner);
        _res[63] = crafting_resume_item_dc(_summoner);
        _res[64] = get_score(_summoner);
        _res[65] = get_score_token(_summoner);
        _res[66] = get_score_nft(_summoner);
        _res[67] = get_score_staking(_summoner);
        _res[68] = get_score_murasaki_nft(_summoner);
        _res[69] = exp_clarinet(_summoner);
        _res[70] = exp_piano(_summoner);
        _res[71] = exp_violin(_summoner);
        _res[72] = exp_horn(_summoner);
        _res[73] = exp_timpani(_summoner);
        _res[74] = exp_cello(_summoner);
        _res[75] = practice_status(_summoner);
        _res[76] = practice_item_id(_summoner);
        _res[77] = practice_start_time(_summoner);
        _res[78] = get_practiceLevel_clarinet(_summoner);
        _res[79] = get_practiceLevel_piano(_summoner);
        _res[80] = get_practiceLevel_violin(_summoner);
        _res[81] = get_practiceLevel_horn(_summoner);
        _res[82] = get_practiceLevel_timpani(_summoner);
        _res[83] = get_practiceLevel_cello(_summoner);
        _res[84] = get_staking_percent(_summoner);
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        return mc.get_balance_of_type(_owner);
    }
    
    function allItemId_withItemType(uint _summoner) public view returns (uint[] memory) {
        address _owner = owner(_summoner);
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
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
    
    // Achievement
    function countOf_achievement (address _wallet) external view returns (uint);
    // Achievement_onChain
    function scoreOf_achievement_onChain (address _wallet) external view returns (uint);
}


contract Murasaki_Info_fromWallet is Ownable, IMurasaki_Info_fromWallet {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }
    
    //address, get Murasaki_Info address
    function _get_info_address() internal view returns (address) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        return ma.address_Murasaki_Info();
    }

    //summoner
    function summoner(address _wallet) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Storage ms = Murasaki_Storage(ma.address_Murasaki_Storage());
        uint _summoner = mm.tokenOf(_wallet);
        if (_summoner == 0) {
            return 0;
        }
        bool _isActive = ms.isActive(_summoner);
        if (_isActive) {
            return _summoner;
        } else {
            return 0;
        }
    }
    
    //class
    function class(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.class(summoner(_wallet));
    }
    //age
    function age(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.age(summoner(_wallet));
    }
    //name
    function name(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.name(summoner(_wallet));
    }
    //level
    function level(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.level(summoner(_wallet));
    }
    //exp
    function exp(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.exp(summoner(_wallet));
    }
    //strength
    function strength(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.strength(summoner(_wallet));
    }
    //dexterity
    function dexterity(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.dexterity(summoner(_wallet));
    }
    //intelligence
    function intelligence(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.intelligence(summoner(_wallet));
    }
    //luck
    function luck(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.luck(summoner(_wallet));
    }
    //coin
    function coin(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.coin(summoner(_wallet));
    }
    //material
    function material(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.material(summoner(_wallet));
    }
    //total_exp_gained
    function total_exp_gained(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.total_exp_gained(summoner(_wallet));
    }
    //total_coin_mined
    function total_coin_mined(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.total_coin_mined(summoner(_wallet));
    }
    //total_material_farmed
    function total_material_farmed(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.total_material_farmed(summoner(_wallet));
    }
    //total_item_crafted
    function total_item_crafted(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.total_item_crafted(summoner(_wallet));
    }
    //total_precious_received
    function total_precious_received(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.total_precious_received(summoner(_wallet));
    }
    //satiety
    function satiety(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.satiety(summoner(_wallet));
    }
    //happy
    function happy(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.happy(summoner(_wallet));
    }
    //precious
    function precious(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.precious(summoner(_wallet));
    }
    //not_petrified
    function not_petrified(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.not_petrified(summoner(_wallet));
    }
    //score
    function score(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.score(summoner(_wallet));
    }
    //strength_withItems
    function strength_withItems(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.strength_withItems(summoner(_wallet));
    }
    //dexterity_withItems
    function dexterity_withItems(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.dexterity_withItems(summoner(_wallet));
    }
    //intelligence_withItems
    function intelligence_withItems(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.intelligence_withItems(summoner(_wallet));
    }
    //luck_withItems
    function luck_withItems(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.luck_withItems(summoner(_wallet));
    }
    //luck_withItems_withDice
    function luck_withItems_withDice(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.luck_withItems_withDice(summoner(_wallet));
    }
    //isActive
    function isActive(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.isActive(summoner(_wallet));
    }
    //inHouse
    function inHouse(address _wallet) external view returns (uint) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.inHouse(summoner(_wallet));
    }
    //birthplace
    function birthplace(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.allStatus(summoner(_wallet))[0];
    }
    //softness
    function softness(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.allStatus(summoner(_wallet))[1];
    }
    //fluffiness
    function fluffiness(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.allStatus(summoner(_wallet))[2];
    }
    //elasticity
    function elasticity(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.allStatus(summoner(_wallet))[3];
    }
    //personality
    function personality(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.allStatus(summoner(_wallet))[4];
    }
    //flower
    function flower(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.allStatus(summoner(_wallet))[5];
    }
    //street
    function street(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.allStatus(summoner(_wallet))[6];
    }
    //city
    function city(address _wallet) external view returns (string memory) {
        Murasaki_Info mi = Murasaki_Info(_get_info_address());
        return mi.allStatus(summoner(_wallet))[7];
    }
    
    //achievement
    function countOf_achievement (address _wallet) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Murasaki_Function_Achievement mfa = Murasaki_Function_Achievement(ma.address_Murasaki_Function_Achievement());
        uint _summoner = mm.tokenOf(_wallet);
        return mfa.get_countOf_achievement(_summoner);
    }
    function scoreOf_achievement_onChain (address _wallet) external view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        Achievement_onChain ac = Achievement_onChain(ma.address_Achievement_onChain());
        uint _summoner = mm.tokenOf(_wallet);
        return ac.get_score(_summoner);
    }
}


//---Murasaki_Lootlike


contract Murasaki_Lootlike is Ownable {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
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
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
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


//---Murasaki_tokenURI


contract Murasaki_tokenURI is Ownable {

    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    string[] private color = [
        "#E60012",
        "#F39800",
        "#FFF100",
        "#8FC31F",
        "#009944",
        "#009E96",
        "#00A0E9",
        "#0068B7",
        "#1D2088",
        "#920783",
        "#E4007F",
        "#E5004F"
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
    
    function _balanceOfItems(uint _summoner) internal view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        if (_summoner == 0) {
            return 0;
        }
        return mc.balanceOf(mfs.get_owner(_summoner));
    }
    
    function _get_endSVG(uint _summoner) internal pure returns (string memory) {
        if (_summoner == 0) {
            //token not found
            return '</text><rect width="128" height="128" fill="#ffffff" rx="5" ry="5" fill-opacity="0.8"/><text x="64"  y="60" class="base" text-anchor="middle">Token</text><text x="64"  y="80" class="base" text-anchor="middle">Not Found</text></svg>';
        } else {
            return '</text></svg>';
        }
    }
    
    function ownerOf(uint _token) public view returns (address) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        return mfs.get_owner(_token);
    }
        
    function _get_SVG(uint _summoner) internal view returns (string memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Info mi = Murasaki_Info(ma.address_Murasaki_Info());
        //string memory output = string(abi.encodePacked(
        return string(
            bytes.concat(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128"><style>.base { fill: #000000; font-family: arial; font-size: 18px; font-weight: bold}</style><rect width="128" height="128" fill="',
                    string(abi.encodePacked(color[mi.class(_summoner)])),
                    '" rx="10" ry="10" fill-opacity="0.4"/><image width="128" height="128" x="0" y="0" href="data:image/png;base64,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"/><text x="3"  y="18"  class="base" text-anchor="start">#',
                    string(abi.encodePacked(toString(_summoner))),
                    '</text><text x="124" y="22"  class="base" text-anchor="end">Lv<tspan font-size="24px">',
                    string(abi.encodePacked(toString(mi.level(_summoner))))
                ),
                abi.encodePacked(
                    '</tspan></text><text x="64"  y="92" class="base" text-anchor="middle"><tspan font-size="20px">',
                    string(abi.encodePacked(mi.name(_summoner))),
                    '</tspan></text><text x="124" y="122" class="base" text-anchor="end">&#x1f4bc;',
                    string(abi.encodePacked(toString(_balanceOfItems(_summoner)))),
                    _get_endSVG(_summoner)
                )
            )
        );
    }
    
    function tokenURI(uint _summoner) public view returns (string memory) {
        string memory output = _get_SVG(_summoner);
        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name": "Murasaki-san #', 
            toString(_summoner), 
            '", "description": "House of Murasaki-san. Murasaki-san is a pet living in your wallet on Astar Network. https://murasaki-san.com/", "image": "data:image/svg+xml;base64,', 
            Base64.encode(bytes(output)), '"}'
        ))));
        return string(abi.encodePacked('data:application/json;base64,', json));
    }
    
    function tokenURI_fromWallet(address _wallet) public view returns (string memory) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        uint _summoner = mm.tokenOf(_wallet);
        return tokenURI(_summoner);
    }
}



//===Treasury======================================================================================================


//---BufferVault


//trading fee, dapps staking reward, other fees
contract BufferVault is Ownable, ReentrancyGuard {

    //receivable
    receive() external payable {
    }
    fallback() external payable {
    }
    
    //variable
    uint public last_transfer_time;
    
    //address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }
    
    //admin, set inflation rate
    uint public inflationRate = 300;    //300 = 3%
    function set_inflationRate(uint _value) external onlyOwner {
        inflationRate = _value;
    }

    //admin, set developer reword rate
    uint public developerRewardRate = 1000;    //1000 = 10%
    function set_developerRewardRate(uint _value) external onlyOwner {
        developerRewardRate = _value;
    }

    //admin, set transfer interval
    uint public transferInterval = 86400 * 30;    //sec, 30 days
    function set_transferInterval(uint _value) external onlyOwner {
        transferInterval = _value;
    }

    //admin. withdraw all, for emergency
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }
    
    //calc amount needed and reflex flag
    function calc_amountNeeded_forTransfer() public view returns (uint, bool) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        BuybackTreasury bbt = BuybackTreasury(payable(ma.address_BuybackTreasury()));
        uint _allSummoners = mm.next_token() - 1;
        uint _disabledSummoners = bbt.disabledSummoners();
        uint _activeSummoners = _allSummoners - _disabledSummoners;
        uint _amountPerSummoner = bbt.amountPerSummoner();
        uint _amount_inTreasury = ma.address_BuybackTreasury().balance;
        //uint _amountPaied_total = bbt.amountPaied_total();
        uint _amountNeeded_inTreasury = 
            _activeSummoners * _amountPerSummoner * (10000 + inflationRate)/10000;
        bool _reflex;
        uint _amountNeeded_forTransfer;
        if (_amountNeeded_inTreasury >= _amount_inTreasury) {
            _amountNeeded_forTransfer = _amountNeeded_inTreasury - _amount_inTreasury;
        } else {
            _reflex = true;
            _amountNeeded_forTransfer = _amount_inTreasury - _amountNeeded_inTreasury;            
        }
        return (_amountNeeded_forTransfer, _reflex);
    }
    
    //check transferable
    //amount in vault >= IR3% + dev reward, or flag_reflex = true
    function check_transferable() public view returns (bool) {
        //check last transfer >30 days
        if (block.timestamp - last_transfer_time <= transferInterval) {
            return false;
        }
        //check reflex > 0
        (uint _amountNeeded_forTransfer, bool _reflex) = calc_amountNeeded_forTransfer();
        if (_reflex) {
            return true;
        }
        //chekc: amount_inVault >= amountNeeded + 20%(10%:devReward, 10%:Staking)
        uint _amount_inVault = address(this).balance;
        if (_amount_inVault >= _amountNeeded_forTransfer * 120/100) {
            return true;
        }
        return false;
    }
    
    //admin, transfer
    function transfer_for_buybackTreasury() external nonReentrant onlyOwner{
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        BuybackTreasury bbt = BuybackTreasury(payable(ma.address_BuybackTreasury()));
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(check_transferable());
        //10%: transfer to developer reward
        uint _devReward = address(this).balance * developerRewardRate/10000 /2;
        payable(ma.address_Coder_Wallet()).transfer(_devReward);
        payable(ma.address_Illustrator_Wallet()).transfer(_devReward);
        //amountNeeded: transfer to/from buybackTreasury
        (uint _amountNeeded_forTransfer, bool _reflex) = calc_amountNeeded_forTransfer();
        if (_reflex) {
            bbt.reflex_to_bufferVault(_amountNeeded_forTransfer);
        } else {
            payable(ma.address_BuybackTreasury()).transfer(_amountNeeded_forTransfer);
        }
        //all the rest: transfer to staking wallet
        payable(ma.address_Staking_Wallet()).transfer(address(this).balance);
        //set inflation rate
        uint _amountPerSummoner = bbt.amountPerSummoner();
        bbt.set_amountPerSummoner(_amountPerSummoner * (10000 + inflationRate) / 10000);
        //set mint price
        uint _price = mp.PRICE();
        mp._set_price(_price * (10000 + inflationRate) / 10000);
        //update timestamp
        last_transfer_time = block.timestamp;
    }
}


//---BuybackTreasury


//for buyback items
contract BuybackTreasury is Ownable, ReentrancyGuard {

    //*approve of mc is needed

    //token receivable
    receive() external payable {
    }
    fallback() external payable {
    }

    //ERC721Holder
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    //variants
    bool public isPaused;
    uint public amountPaied_total = 0;
    uint public disabledSummoners = 0;
    uint public amountPerSummoner = 225 * 10**18;
    mapping(uint => uint) public amountPaied;

    //admin, withdraw all, for emergency
    function withdraw(address rec) public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }
    
    //admin, address
    address public address_Murasaki_Address;
    function _set_Murasaki_Address(address _address) external onlyOwner {
        address_Murasaki_Address = _address;
    }

    //admin, set isPaused
    function set_isPaused(bool _bool) external onlyOwner{
        isPaused = _bool;
    }

    //admin, update notActivated summoner number by manually
    function set_disabledSummoners(uint _value) external onlyOwner {
        disabledSummoners = _value;
    }

    //admin, set amount_per_summoner
    function set_amountPerSummoner_byAdmin(uint _value) external onlyOwner {
        amountPerSummoner = _value;
    }

    //admin, reflex, transfer to bufferVault
    function reflex_to_bufferVault_byAdmin(uint _value) external onlyOwner {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        //require(msg.sender == ma.address_BufferVault());
        payable(ma.address_BufferVault()).transfer(_value);
    }

    //onlyPermitted, set amount_per_summoner
    function set_amountPerSummoner(uint _value) external {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        require(msg.sender == ma.address_BufferVault());
        amountPerSummoner = _value;
    }
    
    //onlyPermitted, reflex, transfer to bufferVault, only from bufferVault
    function reflex_to_bufferVault(uint _value) external {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        require(msg.sender == ma.address_BufferVault());
        payable(ma.address_BufferVault()).transfer(_value);
    }
    
    /*
    //calc amountPerSummoner
    function calc_amount_per_summoner() public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Main mm = Murasaki_Main(ma.address_Murasaki_Main());
        uint _total_summoner = mm.next_token() - 1;
        uint _total_active_summoner = _total_summoner - disabledSummoners;
        uint _amount_per_summoner = (amountPaied_total + address(this).balance) / _total_active_summoner;
        return _amount_per_summoner;
    }
    */
    
    function _calc_itemPrice_fromLevel(uint _item_level) internal view returns (uint) {
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
        //uint _price = calc_amount_per_summoner() * _coefficient / 3227;
        uint _price = amountPerSummoner * _coefficient / 3227;
        return _price;
    }
    
    function calc_buybackPrice(uint _item) public view returns (uint) {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        (uint _item_type, , , , ,) = mc.items(_item);
        //when not normal item, return price 0
        if (_item_type >= 193) {
            return 0;
        }
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
        uint _price = _calc_itemPrice_fromLevel(_item_level) * _item_rarity;
        return _price;
    }
    
    function calc_buybackPrice_asArray() public view returns (uint[17] memory) {
        uint[17] memory _res;
        _res[1] = _calc_itemPrice_fromLevel(1);
        _res[2] = _calc_itemPrice_fromLevel(2);
        _res[3] = _calc_itemPrice_fromLevel(3);
        _res[4] = _calc_itemPrice_fromLevel(4);
        _res[5] = _calc_itemPrice_fromLevel(5);
        _res[6] = _calc_itemPrice_fromLevel(6);
        _res[7] = _calc_itemPrice_fromLevel(7);
        _res[8] = _calc_itemPrice_fromLevel(8);
        _res[9] = _calc_itemPrice_fromLevel(9);
        _res[10] = _calc_itemPrice_fromLevel(10);
        _res[11] = _calc_itemPrice_fromLevel(11);
        _res[12] = _calc_itemPrice_fromLevel(12);
        _res[13] = _calc_itemPrice_fromLevel(13);
        _res[14] = _calc_itemPrice_fromLevel(14);
        _res[15] = _calc_itemPrice_fromLevel(15);
        _res[16] = _calc_itemPrice_fromLevel(16);
        return _res;
    }

    event Buyback(uint indexed _summoner, uint _item, uint _price);    
    function buyback(uint _summoner, uint _item) external nonReentrant {
        Murasaki_Address ma = Murasaki_Address(address_Murasaki_Address);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(ma.address_Murasaki_Function_Share());
        Murasaki_Craft mc = Murasaki_Craft(ma.address_Murasaki_Craft());
        Murasaki_Parameter mp = Murasaki_Parameter(ma.address_Murasaki_Parameter());
        require(mp.isPaused() == false);
        require(isPaused == false);
        require(mfs.check_owner(_summoner, msg.sender));
        require(mc.ownerOf(_item) == msg.sender);
        mc.safeTransferFrom(msg.sender, address(this), _item);
        uint _price = calc_buybackPrice(_item);
        require(_price > 0);
        //update amount paied
        amountPaied[_summoner] += _price;
        amountPaied_total += _price;
        //pay
        payable(msg.sender).transfer(_price);
        //do not exceed amount per summoner after paying
        //require(amountPaied[_summoner] <= amountPerSummoner * 2);
        require(amountPaied[_summoner] <= amountPerSummoner);
        //event
        emit Buyback(_summoner, _item, _price);
    }
}



//===Admin==================================================================================================================


//---Convertion


contract Murasaki_Craft_Old {
    struct item {
        uint item_type;
        uint crafted_time;
        uint crafted_summoner;
        address crafted_wallet;
        string memo;
    }
    mapping(uint => item) public items;
    //function items (uint) external returns (item memory);
    function ownerOf (uint) external pure returns (address) {
        return address(0);
    }
}

contract Admin_Convert is Ownable {
    
    function mm_convert (
        address _old_address, 
        address _new_address, 
        uint _summoner_256
    ) external onlyOwner {
        uint _summoner = _summoner_256;
        Murasaki_Main mmOld = Murasaki_Main(_old_address);
        Murasaki_Main mmNew = Murasaki_Main(_new_address);
        uint _class = mmOld.class(_summoner);
        uint _summoned_time = mmOld.summoned_time(_summoner);
        uint _seed = mmOld.seed(_summoner);
        address _owner = mmOld.ownerOf(_summoner);
        mmNew.summon(_owner, _class, _seed);
        mmNew.set_summoned_time(_summoner, _summoned_time);
    }

    function mn_convert (
        address _old_address, 
        address _new_address, 
        uint _tokenId_256
    ) external onlyOwner {
        uint _tokenId = _tokenId_256;
        Murasaki_Name mnOld = Murasaki_Name(_old_address);
        Murasaki_Name mnNew = Murasaki_Name(_new_address);
        string memory _name = mnOld.names(_tokenId);
        uint _seed = mnOld.seed(_tokenId);
        address _owner = mnOld.ownerOf(_tokenId);
        mnNew.mint(_owner, _name, _seed);
    }
    
    function ms_convert (
        address _old_address,
        address _new_address,
        uint _summoner_uint256
    ) external onlyOwner {
        uint _summoner = _summoner_uint256;
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
    
    function mss_convert (
        address _old_address,
        address _new_address,
        uint _summoner_uint256
    ) external onlyOwner {
        uint _summoner = _summoner_uint256;
        Murasaki_Storage_Score mssOld = Murasaki_Storage_Score(_old_address);
        Murasaki_Storage_Score mssNew = Murasaki_Storage_Score(_new_address);
        mssNew.set_total_exp_gained(_summoner, mssOld.total_exp_gained(_summoner));
        mssNew.set_total_coin_mined(_summoner, mssOld.total_coin_mined(_summoner));
        mssNew.set_total_material_farmed(_summoner, mssOld.total_material_farmed(_summoner));
        mssNew.set_total_item_crafted(_summoner, mssOld.total_item_crafted(_summoner));
        mssNew.set_total_precious_received(_summoner, mssOld.total_precious_received(_summoner));
    }

    function msn_convert (
        address _old_address,
        address _new_address,
        uint _nuiId
    ) external onlyOwner {
        Murasaki_Storage_Nui msnOld = Murasaki_Storage_Nui(_old_address);
        Murasaki_Storage_Nui msnNew = Murasaki_Storage_Nui(_new_address);
        msnNew.set_mint_time(_nuiId, msnOld.mint_time(_nuiId));
        msnNew.set_summoner(_nuiId, msnOld.summoner(_nuiId));
        msnNew.set_class(_nuiId, msnOld.class(_nuiId));
        msnNew.set_level(_nuiId, msnOld.level(_nuiId));
        msnNew.set_strength(_nuiId, msnOld.strength(_nuiId));
        msnNew.set_dexterity(_nuiId, msnOld.dexterity(_nuiId));
        msnNew.set_intelligence(_nuiId, msnOld.intelligence(_nuiId));
        msnNew.set_luck(_nuiId, msnOld.luck(_nuiId));
        msnNew.set_total_exp_gained(_nuiId, msnOld.total_exp_gained(_nuiId));
        msnNew.set_total_coin_mined(_nuiId, msnOld.total_coin_mined(_nuiId));
        msnNew.set_total_material_farmed(_nuiId, msnOld.total_material_farmed(_nuiId));
        msnNew.set_total_item_crafted(_nuiId, msnOld.total_item_crafted(_nuiId));
        msnNew.set_total_precious_received(_nuiId, msnOld.total_precious_received(_nuiId));
        msnNew.set_score(_nuiId, msnOld.score(_nuiId));
    }

    function mc_convert (
        address _old_address, 
        address _new_address, 
        uint _item_id
    ) external onlyOwner {
        Murasaki_Craft_Old mcOld = Murasaki_Craft_Old(_old_address);
        Murasaki_Craft mcNew = Murasaki_Craft(_new_address);
        {
            //correct old item infromation
            (
                uint _item_type, 
                uint _crafted_time, 
                uint _crafted_summoner, 
                address _crafted_wallet, 
                //string memory _memo
            ) = mcOld.items(_item_id);
            //conver nuichan id, random type
            if (_item_type == 197) {
                _item_type = _crafted_time % 12 + 237;
            }
            //uint32 _seed = mcOld.seed(_item_id);
            address _wallet_to = mcOld.ownerOf(_item_id);
            //craft_convert in new contract
            mcNew._admin_craft_convert(
                _item_type,
                _crafted_summoner,
                _crafted_wallet,
                //mcOld.seed(uint32(_item_id_256)),
                //888,
                //_memo,
                _item_id,
                _crafted_time,
                //mcOld.ownerOf(_item_id)
                _wallet_to
            );
        }
    }
    
    function mc_set_next_item (address _address, uint _value) external onlyOwner {
        Murasaki_Craft mcNew = Murasaki_Craft(_address);
        mcNew._admin_set_next_item(_value);
    }
}

//===End==================================================================================================================


/*



*/

