// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

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
    
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }
    
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }
    
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ERC721.ownerOf(tokenId);
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
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
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
    ) public virtual override {
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
        address owner = ERC721.ownerOf(tokenId);
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
        address owner = ERC721.ownerOf(tokenId);

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
        require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
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
        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
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
}







/**
 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
interface IERC721Enumerable is IERC721 {
    /**
     * @dev Returns the total amount of tokens stored by the contract.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns a token ID owned by `owner` at a given `index` of its token list.
     * Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);

    /**
     * @dev Returns a token ID at a given `index` of all the tokens stored by the contract.
     * Use along with {totalSupply} to enumerate all tokens.
     */
    function tokenByIndex(uint256 index) external view returns (uint256);
}


/**
 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds
 * enumerability of all the token ids in the contract as well as all token ids owned by each
 * account.
 */
abstract contract ERC721Enumerable is ERC721, IERC721Enumerable {
    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] private _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual override returns (uint256) {
        require(index < ERC721.balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _allTokens.length;
    }

    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view virtual override returns (uint256) {
        require(index < ERC721Enumerable.totalSupply(), "ERC721Enumerable: global index out of bounds");
        return _allTokens[index];
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
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = ERC721.balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = ERC721.balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete _allTokensIndex[tokenId];
        _allTokens.pop();
    }
}


//from rarity_skin
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

//from rarity_skin
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



contract murasaki is ERC721, Ownable{

    uint public next_summoner;

    string constant public name = "House of Murasaki san";
    string constant public symbol = "HMS";

    mapping(uint => uint) public ctype;
    mapping(uint => uint) public strength;
    mapping(uint => uint) public dexterity;
    mapping(uint => uint) public vitality;
    mapping(uint => uint) public intelligence;
    mapping(uint => uint) public luck;
    mapping(uint => uint) public birth_time;
    mapping(uint => uint) public last_feeding_time;
    mapping(uint => uint) public last_grooming_time;
    mapping(uint => uint) public coin;
    mapping(uint => uint) public material;
    mapping(uint => uint) public mining_status;
    mapping(uint => uint) public mining_start_time;
    mapping(uint => uint) public farming_status;
    mapping(uint => uint) public farming_start_time;
    mapping(uint => uint) public crafting_status;
    mapping(uint => uint) public crafting_start_time;
    mapping(uint => uint) public exp;
    mapping(uint => uint) public level;
    mapping(uint => uint) public next_exp_required;

    uint tmp;
    uint public base = 86400;
    uint public price = 0 ether;

    function set_base(uint _base) public onlyOwner {
        base = _base;
    }

    function set_price(uint _price) public onlyOwner {
        price = _price;
    }

    function get_status(uint _summoner) public view returns (uint[20] memory) {
        uint[20] memory li_status;
        li_status[0] = ctype[_summoner];
        li_status[1] = strength[_summoner];
        li_status[2] = dexterity[_summoner];
        li_status[3] = vitality[_summoner];
        li_status[4] = intelligence[_summoner];
        li_status[5] = luck[_summoner];
        li_status[6] = birth_time[_summoner];
        li_status[7] = last_feeding_time[_summoner];
        li_status[8] = last_grooming_time[_summoner];
        li_status[9] = coin[_summoner];
        li_status[10] = material[_summoner];
        li_status[11] = mining_status[_summoner];
        li_status[12] = mining_start_time[_summoner];
        li_status[13] = farming_status[_summoner];
        li_status[14] = farming_start_time[_summoner];
        li_status[15] = crafting_status[_summoner];
        li_status[16] = crafting_start_time[_summoner];
        li_status[17] = exp[_summoner];
        li_status[18] = level[_summoner];
        li_status[19] = next_exp_required[_summoner];
        return li_status;
    }

    function summon(uint _ctype) external payable {
        require(msg.value >= price, "price error");
        require(0 <= _ctype && _ctype <= 1);
        uint _next_summoner = next_summoner;
        ctype[_next_summoner] = _ctype;
        level[_next_summoner] = 1;
        strength[_next_summoner] = 5;
        dexterity[_next_summoner] = 5;
        vitality[_next_summoner] = 5;
        intelligence[_next_summoner] = 5;
        luck[_next_summoner] = 5;
        birth_time[_next_summoner] = block.timestamp;
        last_feeding_time[_next_summoner] = block.timestamp;
        last_grooming_time[_next_summoner] = block.timestamp;
        coin[_next_summoner] = 0;
        material[_next_summoner] = 0;
        mining_status[_next_summoner] = 0;
        mining_start_time[_next_summoner] = 0;
        crafting_status[_next_summoner] = 0;
        crafting_start_time[_next_summoner] = 0;
        farming_status[_next_summoner] = 0;
        farming_start_time[_next_summoner] = 0;
        exp[_next_summoner] = 0;
        level[_next_summoner] = 1;
        next_exp_required[_next_summoner] = 1000;        
        _safeMint(msg.sender, _next_summoner);
        next_summoner++;
    }

    function feeding(uint _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        tmp = (block.timestamp - last_feeding_time[_summoner]) / 10;
        exp[_summoner] += tmp;
        last_feeding_time[_summoner] = block.timestamp;
    }

    function grooming(uint _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        tmp = (block.timestamp - last_grooming_time[_summoner]) / 10;
        exp[_summoner] += tmp;
        last_grooming_time[_summoner] = block.timestamp;
    }

    function start_mining(uint _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        mining_status[_summoner] = 1;
        mining_start_time[_summoner] = block.timestamp;
    }
    function stop_mining(uint _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 1);
        tmp = (block.timestamp - mining_start_time[_summoner]) / 100;
        coin[_summoner] += tmp;
        mining_status[_summoner] = 0;
    }

    function start_farming(uint _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        farming_status[_summoner] = 1;
        farming_start_time[_summoner] = block.timestamp;
    }
    function stop_farming(uint _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(farming_status[_summoner] == 1);
        tmp = (block.timestamp - farming_start_time[_summoner]) / 1000;
        material[_summoner] += tmp;
        farming_status[_summoner] = 0;
    }
    
    function spend_coin(uint _summoner, uint _coin) external {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        coin[_summoner] -= _coin;
    }
    function spend_material(uint _summoner, uint _material) external {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        material[_summoner] -= _material;
    }

    //crafting

    uint public next_item = 10;

    struct item {
        uint item_id;
        uint crafting_summoner;
        uint crafted_time;
    }

    mapping(uint => item) public items;

    function start_craftingg(uint _summoner, uint _item_id, uint _coin, uint _material) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        require(coin[_summoner] == _coin && material[_summoner] == _material);
        uint x = _item_id;
        x++;
        coin[_summoner] -= _coin;
        material[_summoner] -= _material;
        crafting_status[_summoner] = 1;
        crafting_start_time[_summoner] = block.timestamp;
    }

    function stop_crafting(uint _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner), "owner error");
        require(crafting_status[_summoner] == 1, "status error");
        uint _delta_time = (block.timestamp - crafting_start_time[_summoner]);
        crafting_status[_summoner] = 0;
        uint _item_id = 1;
        craft(_summoner, _item_id, _delta_time);
    }
    
    function crafting_check(uint _summoner, uint _item_id, uint _delta_time) public pure returns (bool) {
        uint x = _summoner;
        x++;
        uint y = _item_id;
        y++;
        uint z = _delta_time;
        z++;
        return true;
    }

    function craft(uint _summoner, uint _item_id, uint _delta_time) public {
        bool crafted = crafting_check(_summoner, _item_id, _delta_time);
        crafted = true;
        if (crafted) {
            items[next_item] = item(_item_id, _summoner, uint32(block.timestamp));
            _safeMint(msg.sender, next_item);
            next_item++;
        }
    }

    function level_up(uint _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(exp[_summoner] >= next_exp_required[_summoner]);
        exp[_summoner] -= next_exp_required[_summoner];
        level[_summoner] += 1;
        //update next_exp_required
        if (level[_summoner] == 2) {
            next_exp_required[_summoner] = 3000;
        }else if (level[_summoner] == 3) {
            next_exp_required[_summoner] = 6000;
        }else if (level[_summoner] == 4) {
            next_exp_required[_summoner] = 10000;
        }else if (level[_summoner] == 5) {
            next_exp_required[_summoner] = 15000;
        }else if (level[_summoner] == 6) {
            next_exp_required[_summoner] = 21000;
        }else if (level[_summoner] == 7) {
            next_exp_required[_summoner] = 28000;
        }else if (level[_summoner] == 8) {
            next_exp_required[_summoner] = 36000;
        }else if (level[_summoner] == 9) {
            next_exp_required[_summoner] = 45000;
        }else if (level[_summoner] == 10) {
            next_exp_required[_summoner] = 55000;
        }else if (level[_summoner] == 11) {
            next_exp_required[_summoner] = 66000;
        }else if (level[_summoner] == 12) {
            next_exp_required[_summoner] = 78000;
        }else if (level[_summoner] == 13) {
            next_exp_required[_summoner] = 91000;
        }else if (level[_summoner] == 14) {
            next_exp_required[_summoner] = 105000;
        }else if (level[_summoner] == 15) {
            next_exp_required[_summoner] = 120000;
        }else if (level[_summoner] == 16) {
            next_exp_required[_summoner] = 136000;
        }else if (level[_summoner] == 17) {
            next_exp_required[_summoner] = 153000;
        }else if (level[_summoner] == 18) {
            next_exp_required[_summoner] = 171000;
        }else if (level[_summoner] == 19) {
            next_exp_required[_summoner] = 190000;
        }
    }
}


contract murasaki_craft is ERC721{

    uint public next_item = 0;

    struct item {
        uint item_id;
        uint crafted_time;
        uint crafted_summoner;
        unit owner_summoner;
        uint owner_wallet;
    }

    mapping(uint => item) public items;

    function craft(uint _item_id, uint _summoner, uint _wallet) public {
        items[next_item] = item(_item_id, uint32(block.timestamp), _summoner, _summoner, _wallet);
        _safeMint(_wallet, next_item);
        next_item++;
    }
}

}