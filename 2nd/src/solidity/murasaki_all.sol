
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


//===ToDo==================================================================================================================


/*

 ok Pauseフラグの実装
        summonやfeedingなどはisPause=falseの時しか行えない
        事前に全部準備しておき、開始時にisPause=true→falseにする
    
 ok 外出フラグの実装
        将来的にsummonerを外出させる時、isActiveフラグだけだと不都合だと思われる
        inHomeフラグを作り、外出時の演出を変える
        また、feedingやgroomingもisHome=trueの時しか行えないようにするか

 ok Dapps Staking Luck Boostの見直し
        上限をmax 100,000とする
        レベルキャップを実装する
        どのレベルでも100,000までluckが上昇するが、
        レベルが高いほうが効率が良くなるよう計算する
            Lv1では500以上は変わらない、ではない。
            どんなレベルでも100,000までは掛け金に応じて有利になる
        指数関数的に。

 ok 収集NFTの実装
        IDはnormal:201-212, uncommon:213-224, rare:225-236
        upgradeに対応させる, preciousは+12
        calc_heartの計算式を修正する

 ok 要求_item_idの整備
        _item_idテーブルが確定してから
        nameplateにrequire
        murasaki_mailにクッションをrequire

*/


//===Basic==================================================================================================================


//---IERC721


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


//---Badge
//https://github.com/ra-phael/badge-token/tree/main/contracts/withoutTimestamp


interface IBadge {
	// @dev Emitted when `tokenId` token is minted to `to`, an address.
	event Minted(
		address indexed to,
		uint32 indexed tokenId,
		uint256 timestamp
	);

	// @dev Emitted when `tokenId` token is burned.
	event Burned(
		address indexed owner,
		uint32 indexed tokenId,
		uint256 timestamp
	);

	// @dev Returns the badge's name
	function name() external view returns (string memory);

	// @dev Returns the badge's symbol.
	function symbol() external view returns (string memory);

	// @dev Returns the ID of the token owned by `owner`, if it owns one, and 0 otherwise
	//function tokenOf(address owner) external view returns (bytes32);

	// @dev Returns the owner of the `tokenId` token.
	//function ownerOf(bytes32 tokenId) external view returns (address);
}

contract Badge is IBadge {
	// Badge's name
	string private _name;

	// Badge's symbol
	string private _symbol;

	// Mapping from token ID to owner's address
	mapping(uint32 => address) private _owners;

	// Mapping from owner's address to token ID
	mapping(address => uint32) private _tokens;

	constructor(string memory name_, string memory symbol_) {
		_name = name_;
		_symbol = symbol_;
	}

	// Returns the badge's name
	function name() public view virtual override returns (string memory) {
		return _name;
	}

	// Returns the badge's symbol
	function symbol() public view virtual override returns (string memory) {
		return _symbol;
	}

	// Returns the token ID owned by `owner`, if it exists, and 0 otherwise
	function tokenOf(address owner)
		public
		view
		virtual
		//override
		returns (uint32)
	{
		require(owner != address(0), "Invalid owner at zero address");

		return _tokens[owner];
	}

	// Returns the owner of a given token ID, reverts if the token does not exist
	function ownerOf(uint32 tokenId)
		public
		view
		virtual
		//override
		returns (address)
	{
		require(tokenId != 0, "Invalid tokenId value");

		address owner = _owners[tokenId];

		require(owner != address(0), "Invalid owner at zero address");

		return owner;
	}

	// Checks if a token ID exists
	function _exists(uint32 tokenId) internal view virtual returns (bool) {
		return _owners[tokenId] != address(0);
	}

	// @dev Mints `tokenId` and transfers it to `to`.
	function _mint(address to, uint32 tokenId) internal virtual {
		require(to != address(0), "Invalid owner at zero address");
		//require(tokenId != 0, "Token ID cannot be zero");
		require(!_exists(tokenId), "Token already minted");
		require(tokenOf(to) == 0, "Owner already has a token");

		_tokens[to] = tokenId;
		_owners[tokenId] = to;

		emit Minted(to, tokenId, block.timestamp);
	}

	// @dev Burns `tokenId`.
	function _burn(uint32 tokenId) internal virtual {
		address owner = Badge.ownerOf(tokenId);

		delete _tokens[owner];
		delete _owners[tokenId];

		emit Burned(owner, tokenId, block.timestamp);
	}
}


//---Ownable


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


//---Base64


/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}


//---EnumerableSet


/**
 * @dev Library for managing
 * https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive
 * types.
 *
 * Sets have the following properties:
 *
 * - Elements are added, removed, and checked for existence in constant time
 * (O(1)).
 * - Elements are enumerated in O(n). No guarantees are made on the ordering.
 *
 * ```
 * contract Example {
 *     // Add the library methods
 *     using EnumerableSet for EnumerableSet.AddressSet;
 *
 *     // Declare a set state variable
 *     EnumerableSet.AddressSet private mySet;
 * }
 * ```
 *
 * As of v3.3.0, sets of type `bytes32` (`Bytes32Set`), `address` (`AddressSet`)
 * and `uint256` (`UintSet`) are supported.
 */
library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;
        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping(bytes32 => uint256) _indexes;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._indexes[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We read and store the value's index to prevent multiple reads from the same storage slot
        uint256 valueIndex = set._indexes[value];

        if (valueIndex != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            if (lastIndex != toDeleteIndex) {
                bytes32 lastvalue = set._values[lastIndex];

                // Move the last value to the index where the value to delete is
                set._values[toDeleteIndex] = lastvalue;
                // Update the index for the moved value
                set._indexes[lastvalue] = valueIndex; // Replace lastvalue's index to valueIndex
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._indexes[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        return set._values[index];
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function _values(Set storage set) private view returns (bytes32[] memory) {
        return set._values;
    }

    // Bytes32Set

    struct Bytes32Set {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _add(set._inner, value);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _remove(set._inner, value);
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
        return _contains(set._inner, value);
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(Bytes32Set storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
        return _at(set._inner, index);
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(Bytes32Set storage set) internal view returns (bytes32[] memory) {
        return _values(set._inner);
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint160(uint256(_at(set._inner, index))));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(AddressSet storage set) internal view returns (address[] memory) {
        bytes32[] memory store = _values(set._inner);
        address[] memory result;

        assembly {
            result := store
        }

        return result;
    }

    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

    /**
     * @dev Returns the value stored at position `index` in the set. O(1).
     *
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }

    /**
     * @dev Return the entire set in an array
     *
     * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
     * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
     * this function has an unbounded cost, and using it as part of a state-changing function may render the function
     * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
     */
    function values(UintSet storage set) internal view returns (uint256[] memory) {
        bytes32[] memory store = _values(set._inner);
        uint256[] memory result;

        assembly {
            result := store
        }

        return result;
    }
}


//---AstarBase


//https://github.com/AstarNetwork/astarbase/tree/4675ffe44b02c2d78aa69dfafe341fc1ff84e433/contract/example
interface IAstarBase {
    /// @notice Check if given address was registered in Astarbase
    /// @param evmAddress, EVM address used for registration
    function isRegistered(address evmAddress) external view returns (bool);

    /// @notice Check if given address was registered and return staked amount
    /// @param evmAddress, EVM address used for registration
    /// @return amount, staked amount on the SS58 address (mapped with evmAddress)
    function checkStakerStatus(address evmAddress)
        external
        view
        returns (uint128);

    /// @notice Check if given address was registered and return staked amount
    /// @param evmAddress, EVM address used for registration
    /// @param contract_id, address of the contract in dapps-staking
    /// @return amount, staked amount on the SS58 address (mapped with evmAddress)
    function checkStakerStatusOnContract(address evmAddress, address contract_id)
        external
        view
        returns (uint128);
}


//===NTT/NFT==================================================================================================================


//---Murasaki_Main


contract Murasaki_Main is Badge, Ownable{

    //permitted address
    mapping(address => bool) public permitted_address;

    //admin, add or remove permitted_address
    function _add_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = true;
    }
    function _remove_permitted_address(address _address) external onlyOwner {
        permitted_address[_address] = false;
    }

    //names
    string constant internal _name = "House of Murasaki-san";
    string constant internal _symbol = "HMS";
    constructor(
    ) Badge(_name, _symbol) {}

    //static status
    mapping(uint32 => uint32) public class;
    mapping(uint32 => uint32) public summoned_time;
    mapping(uint32 => uint32) public seed;

    //variants     
    uint32 public next_summoner = 1;
    bool notPaused = false;
    
    //admin pause
    function _set_notPaused(bool _bool) external onlyOwner {
        notPaused = _bool;
    }

    //summon
    function summon(address _owner, uint32 _class, uint32 _seed) external {
        require(notPaused);
        require(permitted_address[msg.sender] == true);
        uint32 _now = uint32(block.timestamp);
        uint32 _summoning_summoner = next_summoner;
        class[_summoning_summoner] = _class;
        summoned_time[_summoning_summoner] = _now;
        seed[_summoning_summoner] = _seed;
        //mint
        next_summoner++;
        _mint(_owner, _summoning_summoner);
    }

    //burn
    function burn(uint32 _summoner) external {
        require(permitted_address[msg.sender] == true);
        Badge._burn(_summoner);
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
    function tokenURI (uint32 _summoner) public view returns (string memory) {
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


contract Murasaki_Name is Badge, Ownable{

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
    function update_name(uint32 _name_id, string memory _name_str) external onlyOwner {
        names[_name_id] = _name_str;
    }

    //names
    string constant internal _name = "Murasaki Names";
    string constant internal _symbol = "MN";
    constructor(
    ) Badge(_name, _symbol) {}

    //static status
    mapping(uint32 => string) public names;
    mapping(uint32 => uint32) public minted_time;
    mapping(uint32 => uint32) public seed;
    mapping(string => bool) public isMinted;

    //variants
    uint32 public next_name = 1;

    //mint
    function mint(address _owner, string memory _name_str, uint32 _seed) external {
        require(permitted_address[msg.sender] == true);
        uint32 _now = uint32(block.timestamp);
        uint32 _minting_name_id = next_name;
        names[_minting_name_id] = _name_str;
        minted_time[_minting_name_id] = _now;
        seed[_minting_name_id] = _seed;
        //mint
        next_name++;
        isMinted[_name_str] = true;
        _mint(_owner, _minting_name_id);
    }

    //burn
    function burn(uint32 _name_id) external {
        require(permitted_address[msg.sender] == true);
        string memory _name_str = names[_name_id];
        isMinted[_name_str] = false;
        Badge._burn(_name_id);
    }
}


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

    using EnumerableSet for EnumerableSet.UintSet;
    mapping(address => EnumerableSet.UintSet) private mySet;

    //name
    string constant public name = "Murasaki Craft";
    string constant public symbol = "MC";

    //global variants
    uint32 public next_item = 1;
    struct item {
        uint32 item_type;
        uint32 crafted_time;
        uint32 crafted_summoner;
        address crafted_wallet;
        string memo;
    }
    mapping(uint256 => item) public items;
    mapping(address => uint32[256]) public balance_of_type;
    mapping(uint32 => uint32) public seed;
    mapping(uint32 => uint32) public count_of_mint; //item_type => count_of_mint

    //override ERC721 transfer, 
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        ERC721._transfer(from, to, tokenId);
        uint32 _item_type = items[tokenId].item_type;
        balance_of_type[from][_item_type] -= 1;
        balance_of_type[to][_item_type] += 1;
        mySet[from].remove(tokenId);
        mySet[to].add(tokenId);
    }

    //override ERC721 burn
    function _burn(uint256 tokenId) internal virtual override {
        uint32 _item_type = items[tokenId].item_type;
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
        uint32 _item_type, 
        uint32 _summoner, 
        address _wallet, 
        uint32 _seed, 
        string memory _memo
    ) external {
        //require(msg.sender == murasaki_function_address);
        require(permitted_address[msg.sender] == true);
        uint32 _now = uint32(block.timestamp);
        uint32 _crafting_item = next_item;
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
    function tokenURI (uint32 _item) public view returns (string memory) {
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
    function get_balance_of_type(address _wallet) public view returns (uint32[256] memory) {
        return balance_of_type[_wallet];
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
    uint32 public BASE_SEC = 86400;
    uint32 public SPEED = 1000; //100=100%
    uint32 public PRICE = 0;    //uin32, ether, need to recalc 10**18 in methods
    uint32 public DAY_PETRIFIED = 30;
    uint32 public STAKING_REWARD_SEC = 2592000; //30 days
    uint32 public ELECTED_FLUFFY_TYPE = 0;
    string public DEVELOPER_SUMMONER_NAME = "*Fluffy Kingdom*";

    //admin, set global variants
    function _set_isPaused(bool _bool) external {
        require(permitted_address[msg.sender] == true);
        isPaused = _bool;
    }
    function _set_base_sec(uint32 _base_sec) external {
        require(permitted_address[msg.sender] == true);
        BASE_SEC = _base_sec;
    }
    function _set_speed(uint32 _speed) external {
        require(permitted_address[msg.sender] == true);
        SPEED = _speed;
    }
    function _set_price(uint32 _price) external {
        require(permitted_address[msg.sender] == true);
        PRICE = _price;
    }
    function _set_day_petrified(uint32 _day_petrified) external {
        require(permitted_address[msg.sender] == true);
        DAY_PETRIFIED = _day_petrified;
    }
    function _set_elected_fluffy_type(uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        ELECTED_FLUFFY_TYPE = _value;
    }
    function _set_developer_summoner_name(string memory _string) external {
        require(permitted_address[msg.sender] == true);
        DEVELOPER_SUMMONER_NAME = _string;
    }
}


//---Murasaki_Storage


contract Murasaki_Storage is Ownable {

    /*
        permission require:
            function_summon_and_levelup
            function_feeding_and_grooming
            function_mining_and_farming
            function_crafting
    */

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
    mapping(uint32 => uint32) public level;
    mapping(uint32 => uint32) public exp;
    mapping(uint32 => uint32) public strength;
    mapping(uint32 => uint32) public dexterity;
    mapping(uint32 => uint32) public intelligence;
    mapping(uint32 => uint32) public luck;
    mapping(uint32 => uint32) public next_exp_required;
    mapping(uint32 => uint32) public last_level_up_time;

    //resouse
    mapping(uint32 => uint32) public coin;
    mapping(uint32 => uint32) public material;

    //treating
    mapping(uint32 => uint32) public last_feeding_time;
    mapping(uint32 => uint32) public last_grooming_time;

    //working
    mapping(uint32 => uint32) public mining_status;
    mapping(uint32 => uint32) public mining_start_time;
    mapping(uint32 => uint32) public farming_status;
    mapping(uint32 => uint32) public farming_start_time;
    mapping(uint32 => uint32) public crafting_status;
    mapping(uint32 => uint32) public crafting_start_time;
    mapping(uint32 => uint32) public crafting_item_type;
    mapping(uint32 => uint32) public total_mining_sec;
    mapping(uint32 => uint32) public total_farming_sec;
    mapping(uint32 => uint32) public total_crafting_sec;
    mapping(uint32 => uint32) public last_total_mining_sec;
    mapping(uint32 => uint32) public last_total_farming_sec;
    mapping(uint32 => uint32) public last_total_crafting_sec;
    mapping(uint32 => uint32) public last_grooming_time_plus_working_time;

    //active or disable, initial default value = false, using burn
    mapping(uint32 => bool) public isActive;
    
    //inHouse
    mapping(uint32 => bool) public inHouse;
    
    //staking reward counter
    mapping(uint32 => uint32) public staking_reward_counter;

    //set status
    function set_level(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        level[_summoner] = _value;
    }
    function set_exp(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        exp[_summoner] = _value;
    }
    function set_strength(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        strength[_summoner] = _value;
    }
    function set_dexterity(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        dexterity[_summoner] = _value;
    }
    function set_intelligence(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        intelligence[_summoner] = _value;
    }
    function set_luck(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        luck[_summoner] = _value;
    }
    function set_next_exp_required(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        next_exp_required[_summoner] = _value;
    }
    function set_last_level_up_time(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        last_level_up_time[_summoner] = _value;
    }
    function set_coin(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        coin[_summoner] = _value;
    }
    function set_material(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        material[_summoner] = _value;
    }
    function set_last_feeding_time(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        last_feeding_time[_summoner] = _value;
    }
    function set_last_grooming_time(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        last_grooming_time[_summoner] = _value;
    }
    function set_mining_status(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        mining_status[_summoner] = _value;
    }
    function set_mining_start_time(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        mining_start_time[_summoner] = _value;
    }
    function set_farming_status(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        farming_status[_summoner] = _value;
    }
    function set_farming_start_time(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        farming_start_time[_summoner] = _value;
    }
    function set_crafting_status(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        crafting_status[_summoner] = _value;
    }
    function set_crafting_start_time(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        crafting_start_time[_summoner] = _value;
    }
    function set_crafting_item_type(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        crafting_item_type[_summoner] = _value;
    }
    function set_total_mining_sec(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_mining_sec[_summoner] = _value;
    }
    function set_total_farming_sec(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_farming_sec[_summoner] = _value;
    }
    function set_total_crafting_sec(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_crafting_sec[_summoner] = _value;
    }
    function set_last_total_mining_sec(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        last_total_mining_sec[_summoner] = _value;
    }
    function set_last_total_farming_sec(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        last_total_farming_sec[_summoner] = _value;
    }
    function set_last_total_crafting_sec(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        last_total_crafting_sec[_summoner] = _value;
    }
    function set_last_grooming_time_plus_working_time(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        last_grooming_time_plus_working_time[_summoner] = _value;
    }
    function set_isActive(uint32 _summoner, bool _bool) external {
        require(permitted_address[msg.sender] == true);
        isActive[_summoner] = _bool;
    }
    function set_inHouse(uint32 _summoner, bool _bool) external {
        require(permitted_address[msg.sender] == true);
        inHouse[_summoner] = _bool;
    }
    function set_staking_reward_counter(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        staking_reward_counter[_summoner] = _value;
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
    mapping(uint32 => uint32) public total_exp_gained;
    mapping(uint32 => uint32) public total_coin_mined;
    mapping(uint32 => uint32) public total_material_farmed;
    mapping(uint32 => uint32) public total_item_crafted;
    mapping(uint32 => uint32) public total_precious_received;

    //set status
    function set_total_exp_gained(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_exp_gained[_summoner] = _value;
    }
    function set_total_coin_mined(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_coin_mined[_summoner] = _value;
    }
    function set_total_material_farmed(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_material_farmed[_summoner] = _value;
    }
    function set_total_item_crafted(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_item_crafted[_summoner] = _value;
    }
    function set_total_precious_received(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_precious_received[_summoner] = _value;
    }
}


//---Murasaki_Storage_Nui


contract Murasaki_Storage_Nui is Ownable {

    //item_type_of_nui = 197
    //permittion required: function_crafting

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
    mapping(uint32 => uint32) public mint_time;
    mapping(uint32 => uint32) public summoner;
    mapping(uint32 => uint32) public class;
    mapping(uint32 => uint32) public level;
    mapping(uint32 => uint32) public strength;
    mapping(uint32 => uint32) public dexterity;
    mapping(uint32 => uint32) public intelligence;
    mapping(uint32 => uint32) public luck;
    mapping(uint32 => uint32) public total_exp_gained;
    mapping(uint32 => uint32) public total_coin_mined;
    mapping(uint32 => uint32) public total_material_farmed;
    mapping(uint32 => uint32) public total_item_crafted;
    mapping(uint32 => uint32) public total_precious_received;
    mapping(uint32 => uint32) public score;

    //set status
    function set_mint_time(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        mint_time[_item_nui] = _value;
    }
    function set_summoner(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        summoner[_item_nui] = _value;
    }
    function set_class(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        class[_item_nui] = _value;
    }
    function set_level(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        level[_item_nui] = _value;
    }
    function set_strength(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        strength[_item_nui] = _value;
    }
    function set_dexterity(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        dexterity[_item_nui] = _value;
    }
    function set_intelligence(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        intelligence[_item_nui] = _value;
    }
    function set_luck(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        luck[_item_nui] = _value;
    }
    function set_total_exp_gained(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_exp_gained[_item_nui] = _value;
    }
    function set_total_coin_mined(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_coin_mined[_item_nui] = _value;
    }
    function set_total_material_farmed(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_material_farmed[_item_nui] = _value;
    }
    function set_total_item_crafted(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_item_crafted[_item_nui] = _value;
    }
    function set_total_precious_received(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        total_precious_received[_item_nui] = _value;
    }
    function set_score(uint32 _item_nui, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
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
    uint32 private _salt = 0;
    function _update_salt(uint32 _summoner) external onlyOwner {
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
    function check_owner(uint32 _summoner, address _wallet) external view returns (bool) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        return (mm.ownerOf(_summoner) == _wallet);
    }

    //get owner of summoner
    function get_owner(uint32 _summoner) public view returns (address) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        return mm.ownerOf(_summoner);
    }

    //craft

    //get balance of type
    function get_balance_of_type_specific(address _wallet, uint32 _item_type) public view returns (uint32) {
        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        return mc.balance_of_type(_wallet, _item_type);
    }

    //call items as array
    function get_balance_of_type_array(address _wallet) external view returns (uint32[256] memory) {
        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        return mc.get_balance_of_type(_wallet);
    }

    //call items as array from summoner
    function get_balance_of_type_array_from_summoner(uint32 _summoner) public view returns (uint32[256] memory) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        address _owner = mm.ownerOf(_summoner);
        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        return mc.get_balance_of_type(_owner);
    }

    //calc satiety
    function calc_satiety(uint32 _summoner) public view returns (uint32) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
        uint32 SPEED = mp.SPEED();
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - ms.last_feeding_time(_summoner);
        uint32 _base = BASE_SEC /2 *100/SPEED;
        uint32 _satiety;
        if (_delta_sec >= _base) {
            _satiety = 0;
        }else {
            _satiety = 100 * (_base - _delta_sec) / _base;
        }
        return _satiety;
    }

    //calc happy
    function calc_happy(uint32 _summoner) public view returns (uint32) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
        uint32 SPEED = mp.SPEED();
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - ms.last_grooming_time(_summoner);
        uint32 _base = BASE_SEC *3 *100/SPEED;
        uint32 _happy;
        if (_delta_sec >= _base) {
            _happy = 0;
        }else {
            _happy = 100 * (_base - _delta_sec) / _base;
        }
        return _happy;
    }

    //calc precious
    function calc_precious(uint32 _summoner) public view returns (uint32) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
        uint32[256] memory _balance_of_type = get_balance_of_type_array_from_summoner(_summoner);
        uint32 _precious_score = 0;
        uint32 _elected_precious_type = mp.ELECTED_FLUFFY_TYPE();
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
        //level cap, 800/Lv20 = 40/Lv
        uint32 _lv = ms.level(_summoner);
        if (_precious_score > _lv*40) {
            _precious_score = _lv*40;
        }
        return _precious_score;
    }

    //call_name_from_summoner
    function call_name_from_summoner(uint32 _summoner) external view returns (string memory) {
        if (_summoner == 0) {
            Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
            return mp.DEVELOPER_SUMMONER_NAME();
        }
        Murasaki_Name mn = Murasaki_Name(murasaki_name_address);
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        address _owner = mm.ownerOf(_summoner);
        uint32 _name_id = mn.tokenOf(_owner);
        string memory _name_str = mn.names(_name_id);
        return _name_str;
    }

    //calc_score
    function calc_score(uint32 _summoner) public view returns (uint32) {
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(murasaki_storage_score_address);
        uint32 _total_exp_gained = mss.total_exp_gained(_summoner);
        uint32 _total_coin_mined = mss.total_coin_mined(_summoner);
        uint32 _total_material_farmed = mss.total_material_farmed(_summoner);
        uint32 _total_item_crafted = mss.total_item_crafted(_summoner);
        uint32 _total_precious_received = mss.total_precious_received(_summoner);
        uint32 _score = 0;
        _score += _total_exp_gained;
        _score += _total_coin_mined;
        _score += _total_material_farmed;
        _score += _total_item_crafted * 3000 + _total_item_crafted ** 2 * 300;
        _score += _total_precious_received * 500 + _total_precious_received ** 2 * 50;
        return _score;
    }
    
    //calc_exp_addition_rate_from_nui, item_nui required
    //return XXX% (100% - 200%, x1 - x2 ratio)
    function calc_exp_addition_rate(uint32 _summoner, uint32 _item_nui) external view returns (uint32) {
        //call summoner score
        uint32 _score_summoner = calc_score(_summoner);
        //call nui score
        Murasaki_Storage_Nui msn = Murasaki_Storage_Nui(murasaki_storage_nui_address);
        uint32 _score_nui = msn.score(_item_nui);
        //formula: _score_nui / _score_summoner * 100 (%)
        uint32 _percent = _score_nui * 100 / (_score_summoner + 1);
        if (_percent <= 103) {
            return 103;
        } else if (_percent >= 300) {
            return 300;
        } else {
            return _percent;
        }
    }

    //cehck petrification, debends on only feeding
    function not_petrified(uint32 _summoner) public view returns (bool) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        Murasaki_Parameter mp = Murasaki_Parameter(murasaki_parameter_address);
        uint32 SPEED = mp.SPEED();
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 DAY_PETRIFIED = mp.DAY_PETRIFIED();
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - ms.last_feeding_time(_summoner);
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
    function calc_dapps_staking_amount(address _wallet) public view returns (uint32) {
        IAstarBase ASTARBASE = IAstarBase(astarbase_address);
        uint _staker_raw = ASTARBASE.checkStakerStatusOnContract(_wallet, murasaki_main_address);
        uint32 _staker = uint32(_staker_raw / (10 ** 18));
        return _staker;
    }
    
    //get luck addition by dapps staking
    function get_luck_by_staking(uint32 _summoner) public view returns (uint32) {
        address _owner = get_owner(_summoner);
        uint32 _staker = calc_dapps_staking_amount(_owner);
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        uint32 _level = ms.level(_summoner);
        //luck_add = luck_addMin + (luck_addMax - luck_addMin) * (Lv-1)/(20-1)
        uint32 _luck_addMin;
        uint32 _luck_addMax;
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
        uint32 _luck_add = _luck_addMin + (_luck_addMax - _luck_addMin) * (_level - 1) / 19;
        return _luck_add;
    }
    
    //get speed_of_dappsStaking
    function get_speed_of_dappsStaking(uint32 _summoner) external view returns (uint32) {
        address _owner = get_owner(_summoner);
        uint32 _staker = calc_dapps_staking_amount(_owner);
        uint32 _speed;
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
    function get_luck_by_staking(uint32 _summoner) public view returns (uint32) {
        address _owner = get_owner(_summoner);
        uint32 _staker = calc_dapps_staking_amount(_owner);
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
    function luck_challenge(uint32 _summoner) external view returns (bool) {
        Murasaki_Storage ms = Murasaki_Storage(murasaki_storage_address);
        World_Dice wd = World_Dice(world_dice_address);
        uint32 _luck = ms.luck(_summoner);
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
    function d10000(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 10000);
    }
    function d1000(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 1000);
    }
    function d100(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 100);
    }
    function seed(uint32 _summoner) external view returns (uint32) {
        return uint32(_seed(_summoner));
    }
    function d20(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 20);
    }    
    function d12(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 12);
    }    
    function d10(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 10);
    }
    function d8(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 8);
    }
    function d6(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 6);
    }
    function d4(uint32 _summoner) external view returns (uint32) {
        return dn(_summoner, 4);
    }
    function dn(uint32 _summoner, uint32 _number) public view returns (uint32) {
        return uint32(_seed(_summoner) % _number);
    }
    function _random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
    function _seed(uint32 _summoner) internal view returns (uint rand) {
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


contract Murasaki_Function_Summon_and_LevelUp is Ownable {

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
    event Summon(uint32 indexed _summoner, address _wallet, uint32 _class);
    function summon(uint32 _class) external payable {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        uint PRICE = mp.PRICE();
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 SPEED = mp.SPEED();
        require(msg.value >= PRICE * 10**18);
        require(0 <= _class && _class <= 11);
        //summon on mm, mint NTT
        uint32 _summoner = mm.next_summoner();
        uint32 _seed = mfs.seed(_summoner);
        mm.summon(msg.sender, _class, _seed);
        //summon on ms, initialize sutatus
        uint32 _now = uint32(block.timestamp);
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
        payable(mfs.teamTreasury_address()).transfer(address(this).balance);
        //event
        emit Summon(_summoner, msg.sender, _class);
    }

    //burn
    event Burn(uint32 indexed _summoner);
    function burn(uint32 _summoner) external {
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
    function not_petrified(uint32 _summoner) internal view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.not_petrified(_summoner);
    }

    //level-up
    event Level_up(uint32 indexed _summoner, uint32 _level);
    function level_up(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(ms.exp(_summoner) >= ms.next_exp_required(_summoner));
        //petrified check
        require(not_petrified(_summoner));
        //calculate working percent
        uint32 _now = uint32(block.timestamp);
        uint32 _base_sec = _now - ms.last_level_up_time(_summoner);
        uint32 _resting_sec = _base_sec
             - ms.last_total_mining_sec(_summoner)
             - ms.last_total_farming_sec(_summoner)
             - ms.last_total_crafting_sec(_summoner);
        uint32 _percent_mining = 200 * (ms.last_total_mining_sec(_summoner) + _resting_sec/4) / _base_sec;
        uint32 _percent_farming = 200 * (ms.last_total_farming_sec(_summoner) + _resting_sec/4) / _base_sec;
        uint32 _percent_crafting = 200 * (ms.last_total_crafting_sec(_summoner) + _resting_sec/4) / _base_sec;
        uint32 _percent_resting = 200 * (_resting_sec/4) / _base_sec;
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
        uint32 _next_level = ms.level(_summoner) + 1;
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
    event Jewel_mint(uint32 indexed _summoner, uint32 _item_type);
    function _mint_jewel(uint32 _summoner) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint32 _seed = mfs.seed(_summoner);
        uint32 _item_type = 200 + mfs.d10(_summoner) + 1;   //201-212
        mc.craft(_item_type, _summoner, msg.sender, _seed);
        emit Jewel_mint(_summoner, _item_type);
    }
    */
}


//---Feeding_and_Grooming


contract Murasaki_Function_Feeding_and_Grooming is Ownable {

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
    event Feeding(uint32 indexed _summoner, uint32 _exp_gained, bool _critical);
    function feeding(uint32 _summoner, uint32 _item_nui) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        //require(mfs.check_owner(_summoner, msg.sender));
        require(not_petrified(_summoner));
        uint32 _now = uint32(block.timestamp);
        uint32 _satiety = mfs.calc_satiety(_summoner);
        uint32 _exp_add = 500 * (100 - _satiety) / 100;
        //for staking counter, sec before boost
        uint32 _delta_sec = ( _now - ms.last_feeding_time(_summoner) ) * mp.SPEED()/100;
        //nui boost
        if (_item_nui > 0) {
            address _owner = mfs.get_owner(_summoner);
            Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
            require(mc.ownerOf(_item_nui) == _owner);
            uint32 _percent = mfs.calc_exp_addition_rate(_summoner, _item_nui);
            _exp_add = _exp_add * _percent/100;
        }
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            //_exp_add = _exp_add * 3 / 2;
            _exp_add = _exp_add * 2;
            _critical = true;
        }
        uint32 _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        ms.set_last_feeding_time(_summoner, _now);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint32 _total_exp_gained = mss.total_exp_gained(_summoner);
        mss.set_total_exp_gained(_summoner, _total_exp_gained + _exp_add);
        //owner check, gain some exp when not your summoner
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint32 _summoner_yours = mm.tokenOf(msg.sender);
        if (_summoner_yours != 0 && _summoner != _summoner_yours) {
            uint32 _exp_yours = ms.exp(_summoner_yours);
            ms.set_exp(_summoner_yours, _exp_yours + _exp_add / 50);
        }
        //update staking reward counter
        _update_staking_reward_counter(_summoner, _delta_sec);
        //event
        emit Feeding(_summoner, _exp_add, _critical);
    }
    function calc_feeding(uint32 _summoner) external view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint32 _satiety = mfs.calc_satiety(_summoner);
        uint32 _exp_add = 500 * (100 - _satiety) / 100;
        return _exp_add;
    }
    function _update_staking_reward_counter(uint32 _summoner, uint32 _delta_sec) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint32 _speed = mfs.get_speed_of_dappsStaking(_summoner);
        if (_speed > 0) {
            uint32 _decrease = _speed * _delta_sec / 100;
            uint32 _counter = ms.staking_reward_counter(_summoner);
            //decrease counter sec
            if (_counter > _decrease) {
                _counter = _counter - _decrease;
                ms.set_staking_reward_counter(_summoner, _counter);
            //when counter <= 0, mint presentbox
            } else {
                _mint_presentbox(_summoner, msg.sender);
                ms.set_staking_reward_counter(_summoner, mp.STAKING_REWARD_SEC());   //reset counter
            }
        }
    }
    //mint presentbox
    function _mint_presentbox(uint32 _summoner_from, address _wallet_to) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint32 _seed = mfs.seed(_summoner_from);
        uint32 _item_type = 200;
        string memory _memo = "dapps staking";
        mc.craft(_item_type, uint32(0), _wallet_to, _seed, _memo);
    }

    //petrification, debends on only feeding
    function not_petrified(uint32 _summoner) internal view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.not_petrified(_summoner);
    }
    event Cure_Petrification(uint32 indexed _summoner, uint _price);
    function cure_petrification(uint32 _summoner) external payable {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint PRICE = mp.PRICE();
        require(mfs.check_owner(_summoner, msg.sender));
        require(!not_petrified(_summoner));
        uint _price = ms.level(_summoner) * PRICE * 10**18;
        require(msg.value >= _price);
        uint32 _now = uint32(block.timestamp);
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
    event Grooming(uint32 indexed _summoner, uint32 _exp_gained, bool _critical);
    function grooming(uint32 _summoner, uint32 _item_nui) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(not_petrified(_summoner));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        uint32 _now = uint32(block.timestamp);
        uint32 _happy = _calc_happy_real(_summoner);
        uint32 _exp_add = 3000 * (100 - _happy) / 100;
        //nui boost
        if (_item_nui > 0) {
            address _owner = mfs.get_owner(_summoner);
            Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
            require(mc.ownerOf(_item_nui) == _owner);
            uint32 _percent = mfs.calc_exp_addition_rate(_summoner, _item_nui);
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
        uint32 _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        ms.set_last_grooming_time(_summoner, _now);
        ms.set_last_grooming_time_plus_working_time(_summoner, _now);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint32 _total_exp_gained = mss.total_exp_gained(_summoner);
        mss.set_total_exp_gained(_summoner, _total_exp_gained + _exp_add);
        //event
        emit Grooming(_summoner, _exp_add, _critical);
    }
    //calc happy, modified with working_time
    function _calc_happy_real(uint32 _summoner) internal view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint32 SPEED = mp.SPEED();
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - ms.last_grooming_time_plus_working_time(_summoner);  //working_time
        uint32 _base = BASE_SEC *3 *100/SPEED;
        uint32 _happy;
        if (_delta_sec >= _base) {
            _happy = 0;
        }else {
            _happy = 100 * (_base - _delta_sec) / _base;
        }
        return _happy;
    }
    function calc_grooming(uint32 _summoner) external view returns (uint32) {
        uint32 _happy = _calc_happy_real(_summoner);
        uint32 _exp_add = 3000 * (100 - _happy) / 100;
        return _exp_add;
    }

    //luck challenge of mffg
    function luck_challenge(uint32 _summoner) public view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.luck_challenge(_summoner);
    }    
}


//---Mining_and_Farming


contract Murasaki_Function_Mining_and_Farming is Ownable {

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
    function start_mining(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.level(_summoner) >= 2);
        uint32 _now = uint32(block.timestamp);
        ms.set_mining_status(_summoner, 1);
        ms.set_mining_start_time(_summoner, _now);
    }
    event Mining(uint32 indexed _summoner, uint32 _coin_mined, bool _critical);
    function stop_mining(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = calc_mining(_summoner);
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            //_delta = _delta * 3 / 2;
            _delta = _delta * 2;
            _critical = true;
        }
        //add coin
        uint32 _coin = ms.coin(_summoner) + _delta;
        ms.set_coin(_summoner, _coin);
        //update timestamp
        uint32 _delta_sec = _now - ms.mining_start_time(_summoner);
        //uint32 _total_mining_sec = ms.total_mining_sec(_summoner) + _delta_sec;
        //ms.set_total_mining_sec(_summoner, _total_mining_sec);
        uint32 _last_total_mining_sec = ms.last_total_mining_sec(_summoner) + _delta_sec;
        ms.set_last_total_mining_sec(_summoner, _last_total_mining_sec);
        uint32 _last_grooming_time_plus_working_time = ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec;
        ms.set_last_grooming_time_plus_working_time(_summoner, _last_grooming_time_plus_working_time);
        ms.set_mining_status(_summoner, 0);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint32 _total_coin_mined = mss.total_coin_mined(_summoner);
        mss.set_total_coin_mined(_summoner, _total_coin_mined + _delta);
        //event
        emit Mining(_summoner, _delta, _critical);
    }
    function calc_mining(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint32 SPEED = mp.SPEED();
        uint32 BASE_SEC = mp.BASE_SEC();
        //require(ms.mining_status(_summoner) == 1);
        if (ms.mining_status(_summoner) == 0) {
            return uint32(0);
        }
        uint32 _now = uint32(block.timestamp);
        //uint32 _delta = (_now - ms.mining_start_time(_summoner)) * SPEED/100;   //sec
        uint32 _delta = _now - ms.mining_start_time(_summoner);   //sec
        //happy limit: if happy=0, no more earning
        uint32 _delta_grooming = _now - ms.last_grooming_time(_summoner);
        uint32 _base_grooming = BASE_SEC *3 *100/SPEED;
        if (_delta_grooming >= _base_grooming) {
            //_delta = ms.last_grooming_time(_summoner) + BASE_SEC * 3;
            _delta = _base_grooming;
        }
        //speed boost
        _delta = _delta * SPEED / 100;
        //1day = +1000
        _delta = _delta * 1000 / BASE_SEC;
        //status, level, item boost
        uint32 _mod = ms.strength(_summoner) + ms.level(_summoner)*100 + count_mining_items(msg.sender);
        //5%/point, 100 -> 1.00
        _mod = _mod * 5 / 100;
        //boost
        _delta += _delta * _mod / 100;
        return _delta;
    }
    function count_mining_items(address _address) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint32[256] memory _balance_of_type = mfs.get_balance_of_type_array(_address);
        uint32 _mining_items = 0;
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
    function start_farming(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.level(_summoner) >= 2);
        uint32 _now = uint32(block.timestamp);
        ms.set_farming_status(_summoner, 1);
        ms.set_farming_start_time(_summoner, _now);
    }
    event Farming(uint32 indexed _summoner, uint32 _material_farmed, bool _critical);
    function stop_farming(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.farming_status(_summoner) == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = calc_farming(_summoner);
        //luck challenge
        bool _critical;
        if (mfs.luck_challenge(_summoner)) {
            //_delta = _delta * 3 / 2;
            _delta = _delta * 2;
            _critical = true;
        }
        //add coin
        uint32 _material = ms.material(_summoner) + _delta;
        ms.set_material(_summoner, _material);
        //update timestamp
        uint32 _delta_sec = _now - ms.farming_start_time(_summoner);
        //uint32 _total_farming_sec = ms.total_farming_sec(_summoner) + _delta_sec;
        //ms.set_total_farming_sec(_summoner, _total_farming_sec);
        uint32 _last_total_farming_sec = ms.last_total_farming_sec(_summoner) + _delta_sec;
        ms.set_last_total_farming_sec(_summoner, _last_total_farming_sec);
        uint32 _last_grooming_time_plus_working_time = ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec;
        ms.set_last_grooming_time_plus_working_time(_summoner, _last_grooming_time_plus_working_time);
        ms.set_farming_status(_summoner, 0);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint32 _total_material_farmed = mss.total_material_farmed(_summoner);
        mss.set_total_material_farmed(_summoner, _total_material_farmed + _delta);
        //event
        emit Farming(_summoner, _delta, _critical);
    }
    function calc_farming(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint32 SPEED = mp.SPEED();
        uint32 BASE_SEC = mp.BASE_SEC();
        //require(ms.farming_status(_summoner) == 1);
        if (ms.farming_status(_summoner) == 0) {
            return uint32(0);
        }
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = _now - ms.farming_start_time(_summoner);   //sec
        //happy limit: if happy=0, no more earning
        uint32 _delta_grooming = _now - ms.last_grooming_time(_summoner);
        uint32 _base_grooming = BASE_SEC *3 *100/SPEED;
        if (_delta_grooming >= _base_grooming) {
            //_delta = ms.last_grooming_time(_summoner) + BASE_SEC * 3;
            _delta = _base_grooming;
        }
        //speed boost
        _delta = _delta * SPEED / 100;
        //1day = +1000
        _delta = _delta * 1000 / BASE_SEC;
        /*
        uint32 _delta = (_now - ms.farming_start_time(_summoner)) * SPEED/100;  //sec
        _delta = _delta * 1000 / BASE_SEC; // 1 day = +1000
        */
        //status and item boost
        uint32 _mod = ms.dexterity(_summoner) + ms.level(_summoner)*100 + count_farming_items(msg.sender);
        //5%/point, 100 -> 1.00
        _mod = _mod * 5 / 100;
        //boost
        _delta += _delta * _mod / 100;
        return _delta;
    }
    function count_farming_items(address _address) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint32[256] memory _balance_of_type = mfs.get_balance_of_type_array(_address);
        uint32 _farming_items = 0;
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
    function luck_challenge(uint32 _summoner) public view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.luck_challenge(_summoner);
    }    
}


//---Crafting


contract Murasaki_Function_Crafting is Ownable {

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

    //crafting
    function start_crafting(uint32 _summoner, uint32 _item_type) public {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        require(ms.inHouse(_summoner));
        //Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(mfs.calc_satiety(_summoner) >= 10 && mfs.calc_happy(_summoner) >= 10);
        require(ms.level(_summoner) >= 3);
        //check item_type
        require(
            _item_type <= 64        //normal items
            || _item_type == 194    //coin bag
            || _item_type == 195    //material bag
            || _item_type == 196    //mail
            //|| _item_type == 197    //nui
        );
        //get dc, cost, heart
        uint32[4] memory _dc_table = get_item_dc(_item_type);
        uint32 _coin = _dc_table[2];
        uint32 _material = _dc_table[3];
        //uint32 _heart = get_heart_required(_item_type);
        //check coin, material, heart
        require(ms.coin(_summoner) >= _coin);
        require(ms.material(_summoner) >= _material);
        //require(ms.heart(_summoner) >= _heart);
        //pay coin, material, heart
        ms.set_coin(_summoner, ms.coin(_summoner) - _coin);
        ms.set_material(_summoner, ms.material(_summoner) - _material);
        //ms.set_heart(_summoner, ms.heart(_summoner) - _heart);
        //start crafting
        ms.set_crafting_item_type(_summoner, _item_type);
        ms.set_crafting_status(_summoner, 1);
        ms.set_crafting_start_time(_summoner, uint32(block.timestamp));
    }
    event Crafting(uint32 indexed _summoner, uint32 _item_type, uint32 _item, bool _critical);
    function stop_crafting(uint32 _summoner) public {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.crafting_status(_summoner) == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = (_now - ms.crafting_start_time(_summoner));
        uint32 _item_type = ms.crafting_item_type(_summoner);
        //stop
        //ms.set_total_crafting_sec(_summoner, ms.total_crafting_sec(_summoner) + _delta_sec);
        ms.set_last_total_crafting_sec(_summoner, ms.last_total_crafting_sec(_summoner) + _delta_sec);
        ms.set_last_grooming_time_plus_working_time(
            _summoner, ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec);
        //craft
        uint32 _calc_crafting = calc_crafting(_summoner);
        ms.set_crafting_status(_summoner, 0);   //before tx, required status must be updated
        if (_calc_crafting == 0) {
            //luck challenge
            bool _critical;
            if (mfs.luck_challenge(_summoner)) {
                _item_type += 64;
                _critical = true;
            }
            //craft
            Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
            //uint32 _crafting_item = mc.next_item();
            uint32 _seed = mfs.seed(_summoner);
            string memory _memo = "";
            mc.craft(_item_type, _summoner, msg.sender, _seed, _memo);
            //when normal items, mint precious and update score
            if (_item_type <= 128) {
                //_mint_precious(_summoner);
                _send_randomPresentbox(_summoner);
                //update score
                Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
                uint32 _total_item_crafted = mss.total_item_crafted(_summoner);
                mss.set_total_item_crafted(_summoner, _total_item_crafted + 1);
            }
            /*
            //when nui-chan, update Storage_Nui
            if (_item_type == 197) {
                _update_storage_nui(_summoner, mc.next_item()-1);
            }
            */
            //event
            emit Crafting(_summoner, _item_type, mc.next_item()-1, _critical);
        //not completed, return coin/material
        } else {
            uint32[4] memory _dc_table = get_item_dc(_item_type);
            uint32 _coin = _dc_table[2];
            uint32 _material = _dc_table[3];
            ms.set_coin(_summoner, ms.coin(_summoner) + _coin * 8/10);
            ms.set_material(_summoner, ms.material(_summoner) + _material * 8/10);
        }
    }
    function _update_storage_nui(uint32 _summoner, uint32 _item_nui) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Nui msn = Murasaki_Storage_Nui(mfs.murasaki_storage_nui_address());
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint32 _now = uint32(block.timestamp);
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
    function get_modified_dc(uint32 _summoner, uint32 _item_type) public view returns (uint32) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.get_modified_dc(_summoner, _item_type);
    }
    //calc crafting, using codex
    function calc_crafting(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.calc_crafting(_summoner);
    }
    //count crafting items, using codex
    function count_crafting_items(address _address) public view returns (uint32) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.count_crafting_items(_address);
    }
    //get item dc, using codex contract
    function get_item_dc(uint32 _item_type) public view returns (uint32[4] memory) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.get_item_dc(_item_type);
    }
    /*
    //get heart required
    function get_heart_required(uint32 _item_type) public view returns (uint32) {
        Murasaki_Function_Crafting_Codex mfcc = Murasaki_Function_Crafting_Codex(murasaki_function_crafting_codex_address);
        return mfcc.get_heart_required(_item_type);
    }
    */

    /*
    //mint_precious
    event Precious(uint32 indexed _summoner_to, uint32 _summoner_from, uint32 _item_type);
    function _mint_precious(uint32 _summoner_from) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //get random _to_summoner
        uint32 _count_summoners = mm.next_summoner() - 1;
        uint32 _summoner_to = mfs.dn(_summoner_from, _count_summoners) + 1;
        //check _to_summoner
        bool _isActive = ms.isActive(_summoner_to);
        address _walleto_to;
        if (
            _isActive == true
            && ms.level(_summoner_to) >= 3
            && mfs.calc_satiety(_summoner_to) >= 10
            && mfs.calc_happy(_summoner_to) >= 10
        ) {
            //when _summoner_to is active
            _walleto_to = mm.ownerOf(_summoner_to);
        } else {
            //when _summoner_to is not active, wallet = msg.sender
            _walleto_to = msg.sender;
            _summoner_to = _summoner_from;
        }
        //mint precious
        uint32 _seed = mfs.seed(_summoner_from);
        uint32 _item_type = 200 + mfs.d10(_summoner_from) + 1;   //201-212
        mc.craft(_item_type, _summoner_from, _walleto_to, _seed);
        //mc.craft(193, _created_summoner, _to_wallet, _seed);
        //ms.set_heart(_summoner_from, ms.heart(_summoner_from) + 1);
        //ms.set_heart(_summoner_to, ms.heart(_summoner_to) + 1);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint32 _total_precious_received = mss.total_precious_received(_summoner_to);
        mss.set_total_precious_received(_summoner_to, _total_precious_received + 1);
        //event
        emit Precious(_summoner_to, _summoner_from, _item_type);        
    }
    */

    //upgrade item
    event Upgrade(uint32 indexed _summoner, uint32 _item_type, uint32 _item);
    function upgrade_item(
        uint32 _summoner, 
        uint32 _item1, 
        uint32 _item2, 
        uint32 _item3
    ) external {
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
        (uint32 _item_type1, , , ,) = mc.items(_item1);
        (uint32 _item_type2, , , ,) = mc.items(_item2);
        (uint32 _item_type3, , , ,) = mc.items(_item3);
        //require(_item_type1 <= 128 || (_item_type1 >= 201 && _item_type1 <= 224) );
        require(_item_type1 <= 128 || (_item_type1 >= 201 && _item_type1 <= 236) );
    	require(
    	    _item_type2 == _item_type1
    	    && _item_type3 == _item_type1
    	);
    	
    	//determine target item_type
    	uint32 _target_item_type;
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
        uint32 _seed = mfs.seed(_summoner);
        string memory _memo = "";
        mc.craft(_target_item_type, _summoner, msg.sender, _seed, _memo);
        //when nui-chan, update nuichna score
        if (_target_item_type == 197) {
            _update_storage_nui(_summoner, mc.next_item()-1);
        }
        //event
        emit Upgrade(_summoner, _item_type1, mc.next_item());
    }
    function _pay_cost(uint32 _summoner, uint32 _target_item_type) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        //get dc, cost
        uint32[4] memory _dc_table = get_item_dc(_target_item_type);
        uint32 _coin = _dc_table[2];
        uint32 _material = _dc_table[3];
        //check coin, material
        require(ms.coin(_summoner) >= _coin);
        require(ms.material(_summoner) >= _material);
        //pay coin, material
        ms.set_coin(_summoner, ms.coin(_summoner) - _coin);
        ms.set_material(_summoner, ms.material(_summoner) - _material);
    }
    
    //unpack coin/material
    event Unpack(uint32 indexed _summoner, uint32 _item_type, uint32 _item);
    function unpack_bag(uint32 _summoner, uint32 _item) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        require(mc.ownerOf(_item) == msg.sender);
        //check item_type
        (uint32 _item_type, , , ,) = mc.items(_item);
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
    //function _burn(address _owner, uint32 _item) internal {
    function _burn(uint32 _item) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //mc.transferFrom(_owner, address(this), _item);
        mc.burn(_item);
    }
    //burn mail, external, only from Murasaki_Mail
    //function burn_mail(address _owner, uint32 _item) external {
    function burn_mail(uint32 _item) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //only from Murasaki_Mail
        require(msg.sender == mfs.murasaki_mail_address());
        //_burn(_owner, _item);
        _burn(_item);
    }

    //luck challenge of mfc
    function luck_challenge(uint32 _summoner) public view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.luck_challenge(_summoner);
    }

    //send random presentbox
    event SendPresentbox(uint32 indexed _summoner_from, uint32 _summoner_to);
    function _send_randomPresentbox(uint32 _summoner_from) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        //get random _to_summoner
        uint32 _count_summoners = mm.next_summoner() - 1;
        uint32 _summoner_to = mfs.dn(_summoner_from, _count_summoners) + 1;
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
            _wallet_to = msg.sender;
            _summoner_to = _summoner_from;
        }
        //mint presentbox
        _mint_presentbox(_summoner_from, _wallet_to);
        //event
        emit SendPresentbox(_summoner_from, _summoner_to);
    
    }
    //mint presentbox
    function _mint_presentbox(uint32 _summoner_from, address _wallet_to) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint32 _seed = mfs.seed(_summoner_from);
        uint32 _item_type = 200;
        string memory _memo = "item crafting";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo);
    }
    
    //open present box and mint precious
    //presentbox = 200
    function open_presentbox(uint32 _summoner, uint32 _item) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        require(mc.ownerOf(_item) == msg.sender);
        //check item_type
        (uint32 _item_type, , uint32 crafted_summoner, ,) = mc.items(_item);
        require(_item_type == 200);
        //burn _item
        _burn(_item);
        //mint precious
        //need: summoner_to, summoner_from, to_wallet
        _mint_precious(_summoner, crafted_summoner, msg.sender);
    }
    //mint precious
    event Precious(uint32 indexed _summoner_to, uint32 _summoner_from, uint32 _item_type);
    function _mint_precious(uint32 _summoner_to, uint32 _summoner_from, address _wallet_to) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //mint precious
        uint32 _seed = mfs.seed(_summoner_from);
        uint32 _item_type = 200 + mfs.d12(_summoner_from) + 1;   //201-212
        string memory _memo = "";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint32 _total_precious_received = mss.total_precious_received(_summoner_to);
        mss.set_total_precious_received(_summoner_to, _total_precious_received + 1);
        //event
        emit Precious(_summoner_to, _summoner_from, _item_type);
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
    function calc_crafting(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        //require(ms.crafting_status(_summoner) == 1);
        if (ms.crafting_status(_summoner) == 0) {
            return uint32(0);
        }
        uint32 SPEED = mp.SPEED();
        uint32 _now = uint32(block.timestamp);
        uint32 _item_type = ms.crafting_item_type(_summoner);
        //get modified dc
        uint32 _dc = get_modified_dc(_summoner, _item_type);
        //calc remaining sec
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 _dc_sec = _dc * BASE_SEC / 1000;   //1000dc = 1day = 86400sec
        //calc remining sec
        uint32 _delta_time = uint32( ( _now - ms.crafting_start_time(_summoner) ) * SPEED/100);
        uint32 _remining_time;
        if (_delta_time >= _dc_sec) {
            _remining_time = 0;
        }else {
            _remining_time = uint32(_dc_sec - _delta_time);
        }
        return _remining_time;
    }

    //get modified_dc
    function get_modified_dc(uint32 _summoner, uint32 _item_type) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        uint32[4] memory _dc_table = get_item_dc(_item_type);
        //get dc
        uint32 _level = _dc_table[0];
        uint32 _dc = _dc_table[1];
        // when not normal items: return exact dc
        if (_item_type >= 192) {
            return _dc;
        // when normal crafting items: modified by status
        } else {
            //status boost
            uint32 _mod = ms.intelligence(_summoner) + ms.level(_summoner)*100 + count_crafting_items(msg.sender);
            //initial point = 400 (1Lv*100, 3INT*100)
            //point per level = 150 (1Lv*100 + 0.5INT*100)
            //minimum dc = 3000 (3 days)
            // _mod_dc = _dc - ( _dc / (_level * 150) ) * (_mod - 400) >= 3000
            // _delta = (_mod - 400) / (_level * 150) * _dc
            // _mod_dc = _dc - _delta >= 3000
            //uint32 _delta = (_mod - 400) / (_level * 150) * _dc;  //original concept law, but not good
            //uint32 _delta = _dc * (_mod - 400) / (_level * 150);    //division should be done last
            uint32 _delta = _dc * (_mod - 400) / (_level * 300);    //150 -> 300, 220401
            uint32 _mod_dc;
            if (_dc < 3000 + _delta) {
                _mod_dc = 3000;
            } else {
                _mod_dc = _dc - _delta;
            }
            return _mod_dc;
        }
    }

    //count crafting items
    function count_crafting_items(address _address) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint32[256] memory _balance_of_type = mfs.get_balance_of_type_array(_address);
        uint32 _crafting_items = 0;
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
    function get_item_dc(uint32 _item_type) public view returns (uint32[4] memory) {
        //return: level, dc, coin, material
        uint32 _level = 999999;
        uint32 _dc = 999999;
        uint32 _coin = 999999;
        uint32 _material = 999999;

        // for crafting
        //194: coin bag
        if (_item_type == 194){
            _level = 99;
            _dc = 20;    //30min
            _coin = 1000;
            _material = 10;
        //195: material bag
        } else if (_item_type == 195) {
            _level = 99;
            _dc = 20;
            _coin = 10;
            _material = 1000;
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

    //item level
    uint32[64] public level_table = [
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
    uint32[64] public dc_table = [
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
    uint32[64] public coin_table = [
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
    uint32[64] public material_table = [
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

    /*
    //item heart
    uint32[64] public heart_table = [
        //0:dummy
        0,
        //1-16: mining item
        0,
        0,
        0,
        0,
        0,
        0,
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
        //17-32: farming item
        0,
        0,
        0,
        0,
        0,
        0,
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
        //33-48: crafting item
        0,
        0,
        0,
        0,
        0,
        0,
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
    */
}


//---Name


contract Murasaki_Function_Name is Ownable {

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
    uint32 public nameplate_item_type = 1;
    //set dice item_type
    function _set2_nameplate_item_type(uint32 _item_type) external onlyOwner {
        nameplate_item_type = _item_type;
    }

    //mint
    event Name(uint32 indexed _summoner, string _name_str, uint32 _name_id);
    function mint(uint32 _summoner, string memory _name_str) external {
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
        uint32 _coin = 100;
        uint32 _material = 100;
        require(ms.coin(_summoner) >= _coin && ms.material(_summoner) >= _material);
        //pay cost
        ms.set_coin(_summoner, ms.coin(_summoner) - _coin);
        ms.set_material(_summoner, ms.material(_summoner) - _material);
        //mint
        uint32 _seed = mfs.seed(_summoner);
        mn.mint(msg.sender, _name_str, _seed);
        //event
        emit Name(_summoner, _name_str, mn.next_name());
    }

    //burn
    event Burn(uint32 indexed _summoner, uint32 _name_id);
    function burn(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        require(mfs.check_owner(_summoner, msg.sender));
        address _owner = mfs.get_owner(_summoner);
        uint32 _name_id = mn.tokenOf(_owner);
        require(_name_id > 0);
        mn.burn(_name_id);
        //event
        emit Burn(_summoner, _name_id);
    }

    //call_name_from_summoner
    function call_name_from_summoner(uint32 _summoner) external view returns (string memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        address _owner = mfs.get_owner(_summoner);
        uint32 _name_id = mn.tokenOf(_owner);
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
contract bufferTreasury is Ownable {

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
    
    uint32 public inflationRate = 300;    //300 = 3%

    //admin, set rate
    function set_inflationRate(uint32 _value) external onlyOwner {
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
    function transfer_for_buybackTreasury() external onlyOwner{
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
contract buybackTreasury is Ownable {

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

    uint public amount_paied = 0;
    
    function calc_amount_per_summoner() public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint32 _total_summoner = mm.next_summoner() - 1;
        uint _amount_per_summoner = (amount_paied + address(this).balance) / _total_summoner;
        return _amount_per_summoner;
    }
    
    function calc_itemPrice_fromLevel(uint32 _item_level) public view returns (uint) {
        uint32 _coefficient;
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
    
    function calc_buybackPrice(uint32 _item) public view returns (uint) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        (uint32 _item_type, , , ,) = mc.items(_item);
        uint32 _item_level = _item_type % 16;
        if (_item_level == 0) {
            _item_level = 16;
        }
        uint32 _item_rarity;
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

    event Buyback(uint32 indexed _summoner, uint32 _item, uint _price);    
    function buyback(uint32 _summoner, uint32 _item) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        require(mm.ownerOf(_summoner) == msg.sender);
        require(mc.ownerOf(_item) == msg.sender);
        mc.safeTransferFrom(msg.sender, address(this), _item);
        uint _price = calc_buybackPrice(_item);
        amount_paied += _price;
        payable(msg.sender).transfer(_price);
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


contract World_Dice is Ownable {

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
    mapping(uint32 => uint32[4]) public rolled_dice;
    mapping(uint32 => uint32) public last_dice_roll_time;
    uint32 public dice_item_type = 3;
    uint32 public buffer_sec = 14400;  //4 hr

    //set dice item_type
    function _set2_dice_item_type(uint32 _item_type) external onlyOwner {
        dice_item_type = _item_type;
    }

    //set buffer_sec
    function _set3_buffer_sec(uint32 _sec) external onlyOwner {
        buffer_sec = _sec;
    }

    //calc elasped_time
    function calc_elasped_time(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        if (last_dice_roll_time[_summoner] == 0) {
            return 86400 * 10;  //if not rolled yet, return 10 days
        } else {
            uint32 _now = uint32(block.timestamp);
            uint32 SPEED = mp.SPEED();
            uint32 _elasped_time = uint32( (_now - last_dice_roll_time[_summoner]) * SPEED/100 );
            return _elasped_time;
        }
    }

    //dice roll
    event Dice_Roll(uint32 indexed _summoner, uint32 _rolled_dice);
    function dice_roll(uint32 _summoner) external {
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
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 _elasped_time = calc_elasped_time(_summoner);
        require(_elasped_time >= BASE_SEC - buffer_sec);
        //dice roll
        uint32 _dice_roll = (mfs.d20(_summoner) + 1) * 10;
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
        uint32 _now = uint32(block.timestamp);
        last_dice_roll_time[_summoner] = _now;
        //event
        emit Dice_Roll(_summoner, _dice_roll);
    }
    
    //get rolled dice, average of 4 dices
    function get_rolled_dice(uint32 _summoner) external view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        //get elasped_time
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 _elasped_time = calc_elasped_time(_summoner);
        //get owner of summoner
        address _owner = mfs.get_owner(_summoner);
        //calc mod_dice
        uint32 _mod_dice;
        //ignore when not possessed item_dice
        if (
            mfs.get_balance_of_type_specific(_owner, dice_item_type) == 0
            && mfs.get_balance_of_type_specific(_owner, dice_item_type +64) == 0
            && mfs.get_balance_of_type_specific(_owner, dice_item_type +128) == 0
        ) {
            _mod_dice = 0;
        //calc mod_dice depends on delta_sec
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
        return _mod_dice;
    }
    
    //get last_rolled_dice
    function get_last_rolled_dice(uint32 _summoner) external view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        address _owner = mfs.get_owner(_summoner);
        uint32 BASE_SEC = mp.BASE_SEC();
        uint32 _elasped_time = calc_elasped_time(_summoner);
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


contract Murasaki_Mail is Ownable {

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
        uint32 send_time;
        uint32 open_time;
        uint32 summoner_from;
        uint32 summoner_to;
    }
    mapping(uint32 => Mail) public mails;

    //mapping
    mapping(uint32 => uint32) public sending;   //[_summoner_from] = mails;
    mapping(uint32 => uint32) public receiving; //[_summoner_to] = mails;
    mapping(uint32 => uint32) public total_sent;
    mapping(uint32 => uint32) public total_opened;
    
    //variants
    //interval, both of sending interval & receving limit
    uint32 public interval_sec = 60 * 60 * 24 * 3;    // 3 days
    uint32 public item_type_of_mail = 196;
    uint32 public item_type_of_cushion = 20;

    //admin, set variants
    function set_interval_sec(uint32 _value) external onlyOwner {
        interval_sec = _value;
    }
    function set_item_type_of_mail(uint32 _value) external onlyOwner {
        item_type_of_mail = _value;
    }
    
    //check mail
    function check_receiving_mail(uint32 _summoner_to) public view returns (bool) {
        uint32 _mail_id = receiving[_summoner_to];
        //no mail
        if (_mail_id == 0) {
            return false;
        } else {
            Mail memory _mail = mails[_mail_id];
            uint32 _now = uint32(block.timestamp);
            uint32 _delta = _now - _mail.send_time;
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
    function calc_sending_interval(uint32 _summoner_from) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        uint32 SPEED = mp.SPEED();
        uint32 _mail_id = sending[_summoner_from];
        //not send yet
        if (_mail_id == 0) {
            return 0;
        }
        //mail sending
        Mail memory _mail = mails[_mail_id];
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = uint32( (_now - _mail.send_time) * SPEED/100 );
        if (_delta >= interval_sec) {
            return 0;
        } else {
            return interval_sec - _delta;
        }
    }
    
    //check last mail open
    function check_lastMailOpen(uint32 _summoner_from) public view returns (bool) {
        uint32 _mail_id = sending[_summoner_from];
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
    event Send_Mail(uint32 indexed _summoner_from, uint32 _summoner_to, uint32 _item_mail);
    function send_mail(uint32 _summoner_from, uint32 _item_mail) external {
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
        (uint32 _item_type, , , ,) = mc.items(_item_mail);
        require(_item_type == item_type_of_mail);
        require(mc.ownerOf(_item_mail) == msg.sender);
        //burn mail nft
        _burn_mail(_item_mail);
        //select _summoner_to
        uint32 _summoner_to = _select_random_summoner_to(_summoner_from);
        //prepare Mail, id = _item_mail
        uint32 _now = uint32(block.timestamp);
        Mail memory _mail = Mail(_now, 0, _summoner_from, _summoner_to);
        mails[_item_mail] = _mail;
        //send mail
        sending[_summoner_from] = _item_mail;
        receiving[_summoner_to] = _item_mail;
        total_sent[_summoner_from] += 1;
        //event
        emit Send_Mail(_summoner_from, _summoner_to, _item_mail);
    }
    function _select_random_summoner_to(uint32 _summoner_from) internal view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        uint32 _count_summoners = mm.next_summoner() - 1;
        uint32 _summoner_to = 0;
        uint32 _count = 0;
        while (_count < 5) {
            uint32 _summoner_tmp = mfs.dn(_summoner_from + _count, _count_summoners) + 1;
            bool _isActive = ms.isActive(_summoner_tmp);
            uint32 _happy = mfs.calc_happy(_summoner_tmp);
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
    function _burn_mail(uint32 _item_mail) internal {
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(murasaki_function_crafting_address);
        //mfc.burn_mail(msg.sender, _item_mail);
        mfc.burn_mail(_item_mail);
    }
    
    //open mail
    event Open_Mail(uint32 indexed _summoner_to, uint32 _summoner_from);
    function open_mail(uint32 _summoner_to) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        require(mp.isPaused() == false);
        //check owner
        require(mfs.check_owner(_summoner_to, msg.sender));
        //check receving mail
        require(check_receiving_mail(_summoner_to));
        //get mail
        uint32 _mail_id = receiving[_summoner_to];
        Mail storage _mail = mails[_mail_id];
        receiving[_summoner_to] = 0;
        //open mail
        uint32 _now = uint32(block.timestamp);
        _mail.open_time = _now;
        //mint precious
        //_mint_precious(_summoner_to, _mail.summoner_from);
        _mint_presentboxBoth(_summoner_to, _mail.summoner_from);
        total_opened[_summoner_to] += 1;
        //event
        emit Open_Mail(_summoner_to, _mail.summoner_from);
    }
    function _mint_presentboxBoth(uint32 _summoner_to, uint32 _summoner_from) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        _mint_presentbox(_summoner_from, mm.ownerOf(_summoner_to));
        _mint_presentbox(_summoner_to, mm.ownerOf(_summoner_from));
    }
    function _mint_presentbox(uint32 _summoner_from, address _wallet_to) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint32 _seed = mfs.seed(_summoner_from);
        uint32 _item_type = 200;
        string memory _memo = "mail opening";
        mc.craft(_item_type, _summoner_from, _wallet_to, _seed, _memo);
    }    
    /*
    event Precious(uint32 indexed _summoner_to, uint32 _summoner_from, uint32 _item_type);
    function _mint_precious(uint32 _summoner_to, uint32 _summoner_from) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint32 _seed = mfs.seed(_summoner_to);
        uint32 _item_type = 200 + mfs.d10(_summoner_to) + 1;   //201-212
        mc.craft(_item_type, _summoner_from, mm.ownerOf(_summoner_to), _seed);
        mc.craft(_item_type, _summoner_to, mm.ownerOf(_summoner_from), _seed);
        //update score
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        uint32 _total_precious_received = mss.total_precious_received(_summoner_to);
        mss.set_total_precious_received(_summoner_to, _total_precious_received + 1);
        _total_precious_received = mss.total_precious_received(_summoner_from);
        mss.set_total_precious_received(_summoner_from, _total_precious_received + 1);
        emit Precious(_summoner_to, _summoner_from, _item_type);
        //ms.set_heart(_summoner_to, ms.heart(_summoner_to) + 1);
        //ms.set_heart(_summoner_from, ms.heart(_summoner_from) + 1);
    }
    */
    /*
    function _create_tiny_heart(uint32 _summoner_to, uint32 _summoner_from) internal {
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
    
    function get_birthplace(uint32 _summoner) public view returns (string memory) {
        return pluckName(_summoner, "birthplace", birthplace);
    }
    function get_softness(uint32 _summoner) public view returns (string memory) {
        return pluckName(_summoner, "softness", softness);
    }
    function get_fluffiness(uint32 _summoner) public view returns (string memory) {
        return pluckName(_summoner, "fluffiness", fluffiness);
    }
    function get_elasticity(uint32 _summoner) public view returns (string memory) {
        return pluckName(_summoner, "elasticity", elasticity);
    }
    function get_personality(uint32 _summoner) public view returns (string memory) {
        return pluckName(_summoner, "personality", personality);
    }
    function get_allStatus(uint32 _summoner) public view returns (string[5] memory) {
        string[5] memory _status;
        _status[0] = get_birthplace(_summoner);
        _status[1] = get_softness(_summoner);
        _status[2] = get_fluffiness(_summoner);
        _status[3] = get_elasticity(_summoner);
        _status[4] = get_personality(_summoner);
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

    function pluckName(uint32 _summoner, string memory keyPrefix, string[] memory sourceArray) internal view returns (string memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        address _owner = mfs.get_owner(_summoner);
        //address _owner = address(this);
        uint256 rand = random(string(abi.encodePacked(keyPrefix, abi.encodePacked(_owner, toString(_summoner)))));
        string memory output = sourceArray[rand % sourceArray.length];
        return output;
    }

    string[] private birthplace = [
        "fluffy sweater",
        "fluffy blanket",
        "fluffy carpet",
        "fluffy cushion",
        "fluffy scarf",
        "fluffy towel",
        "woolly sweater",
        "woolly blanket",
        "woolly carpet",
        "woolly cushion",
        "woolly scarf",
        "woolly towel",
        "feathery sweater",
        "feathery blanket",
        "feathery carpet",
        "feathery cushion",
        "feathery scarf",
        "feathery towel"
    ];
    
    string[] private softness = [
        "inredible",
        "marvelous",
        "excellent",
        "amazing",
        "great",
        "fabulous",
        "wonderful",
        "gorgeous",
        "awesome",
        "fantastic",
        "lovely",
        "brilliant",
        "impressive",
        "superb"
    ];
    
    string[] private fluffiness = [
        "inredible",
        "marvelous",
        "excellent",
        "amazing",
        "great",
        "fabulous",
        "wonderful",
        "gorgeous",
        "awesome",
        "fantastic",
        "lovely",
        "brilliant",
        "impressive",
        "superb"
    ];

    string[] private elasticity = [
        "inredible",
        "marvelous",
        "excellent",
        "amazing",
        "great",
        "fabulous",
        "wonderful",
        "gorgeous",
        "awesome",
        "fantastic",
        "lovely",
        "brilliant",
        "impressive",
        "superb"
    ];
    
    string[] private personality = [
        "friendly",
        "reliable",
        "optimistic",
        "frisky",
        "thoughtful",
        "honest",
        "easygoing",
        "tolerant",
        "mild",
        "affectionate",
        "intelligent",
        "patient",
        "faithful",
        "innocent",
        "gentle"
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
    function owner(uint32 _summoner) public view returns (address) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.get_owner(_summoner);
    }
    function class(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        return mm.class(_summoner);
    }
    function age(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint32 _now = uint32(block.timestamp);
        uint32 _age = _now - mm.summoned_time(_summoner);
        return _age;
    }
    
    //Murasaki_Name
    function name(uint32 _summoner) public view returns (string memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        return mn.names(_summoner);
    }
    
    /*
    //Murasaki_Craft
    function balance_of_item(uint32 _summoner) public view returns (uint32[256] memory) {
        address _owner = owner(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        return mc.get_balance_of_type(_owner);
    }
    */
    
    //Murasaki_Storage
    function level(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.level(_summoner);
    }
    function exp(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.exp(_summoner);
    }
    function strength(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.strength(_summoner);
    }
    function dexterity(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.dexterity(_summoner);
    }
    function intelligence(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.intelligence(_summoner);
    }
    function luck(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.luck(_summoner);
    }
    function next_exp_required(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.next_exp_required(_summoner);
    }
    /*
    function last_level_up_time(uint32 _summoner) external view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_level_up_time(_summoner);
    }
    */
    function coin(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.coin(_summoner);
    }
    function material(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.material(_summoner);
    }
    function last_feeding_time(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_feeding_time(_summoner);
    }
    function last_grooming_time(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_grooming_time(_summoner);
    }
    function mining_status(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.mining_status(_summoner);
    }
    function mining_start_time(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.mining_start_time(_summoner);
    }
    function farming_status(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.farming_status(_summoner);
    }
    function farming_start_time(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.farming_start_time(_summoner);
    }
    function crafting_status(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.crafting_status(_summoner);
    }
    function crafting_start_time(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.crafting_start_time(_summoner);
    }
    function crafting_item_type(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.crafting_item_type(_summoner);
    }
    /*
    function total_mining_sec(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.total_mining_sec(_summoner);
    }
    function total_farming_sec(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.total_farming_sec(_summoner);
    }
    function total_crafting_sec(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.total_crafting_sec(_summoner);
    }
    */
    function staking_reward_counter(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.staking_reward_counter(_summoner);
    }
    /*
    function last_grooming_time_plus_working_time(uint32 _summoner) external view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        return ms.last_grooming_time_plus_working_time(_summoner);
    }
    */

    //Murasaki_Storage_Score
    function total_exp_gained(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_exp_gained(_summoner);
    }
    function total_coin_mined(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_coin_mined(_summoner);
    }
    function total_material_farmed(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_material_farmed(_summoner);
    }
    function total_item_crafted(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_item_crafted(_summoner);
    }
    function total_precious_received(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage_Score mss = Murasaki_Storage_Score(mfs.murasaki_storage_score_address());
        return mss.total_precious_received(_summoner);
    }
    
    //Function_Share
    function satiety(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_satiety(_summoner);
    }
    function happy(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_happy(_summoner);
    }
    function precious(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_precious(_summoner);
    }
    function not_petrified(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        bool _res = mfs.not_petrified(_summoner);
        if (_res == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    function dapps_staking_amount(uint32 _summoner) public view returns (uint32) {
        address _owner = owner(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_dapps_staking_amount(_owner);
    }
    function score(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.calc_score(_summoner);
    }
    function get_speed_of_dappsStaking(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        return mfs.get_speed_of_dappsStaking(_summoner);
    }
    
    //Function_Working
    function calc_mining(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(murasaki_function_mining_and_farming_address);
        return mfmf.calc_mining(_summoner);
    }
    function calc_farming(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(murasaki_function_mining_and_farming_address);
        return mfmf.calc_farming(_summoner);
    }
    function calc_crafting(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(murasaki_function_crafting_address);
        return mfc.calc_crafting(_summoner);
    }
    function strength_withItems(uint32 _summoner) public view returns (uint32) {
        address _owner = owner(_summoner);
        uint32 _str = strength(_summoner);
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(murasaki_function_mining_and_farming_address);
        _str += mfmf.count_mining_items(_owner);
        return _str;
    }
    function dexterity_withItems(uint32 _summoner) public view returns (uint32) {
        address _owner = owner(_summoner);
        uint32 _dex = dexterity(_summoner);
        Murasaki_Function_Mining_and_Farming mfmf = Murasaki_Function_Mining_and_Farming(murasaki_function_mining_and_farming_address);
        _dex += mfmf.count_farming_items(_owner);
        return _dex;
    }
    function intelligence_withItems(uint32 _summoner) public view returns (uint32) {
        address _owner = owner(_summoner);
        uint32 _int = intelligence(_summoner);
        Murasaki_Function_Crafting mfc = Murasaki_Function_Crafting(murasaki_function_crafting_address);
        _int += mfc.count_crafting_items(_owner);
        return _int;
    }
    function luck_withItems(uint32 _summoner) public view returns (uint32) {
        uint32 _luk = luck(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        _luk += mfs.calc_precious(_summoner);
        return _luk;
    }
    /*
    function luck_withItems_withStaking(uint32 _summoner) public view returns (uint32) {
        uint32 _luk = luck_withItems(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        _luk += mfs.get_luck_by_staking(_summoner);
        return _luk;
    }
    */
    function calc_feeding(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Feeding_and_Grooming mffg = Murasaki_Function_Feeding_and_Grooming(murasaki_function_feeding_and_grooming_address);
        return mffg.calc_feeding(_summoner);
    }
    function calc_grooming(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Feeding_and_Grooming mffg = Murasaki_Function_Feeding_and_Grooming(murasaki_function_feeding_and_grooming_address);
        return mffg.calc_grooming(_summoner);
    }
    
    //Dice
    function last_rolled_dice(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        World_Dice wd = World_Dice(mfs.world_dice_address());
        return wd.get_last_rolled_dice(_summoner);
    }
    function last_dice_roll_time(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        World_Dice wd = World_Dice(mfs.world_dice_address());
        return wd.last_dice_roll_time(_summoner);
    }
    function luck_withItems_withDice(uint32 _summoner) public view returns (uint32) {
        uint32 _luk = luck_withItems(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        World_Dice wd = World_Dice(mfs.world_dice_address());
        _luk += wd.get_rolled_dice(_summoner);
        return _luk;
    }
    
    //Mail
    function receiving_mail(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Mail mml = Murasaki_Mail(mfs.murasaki_mail_address());
        bool _res = mml.check_receiving_mail(_summoner);
        if (_res == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    function sending_interval(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Mail mml = Murasaki_Mail(mfs.murasaki_mail_address());
        return mml.calc_sending_interval(_summoner);
    }
    function check_lastMailOpen(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Mail mml = Murasaki_Mail(mfs.murasaki_mail_address());
        bool _res = mml.check_lastMailOpen(_summoner);
        if (_res == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    
    //Lootlike
    function allStatus(uint32 _summoner) public view returns (string[5] memory) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Lootlike mll = Murasaki_Lootlike(mfs.murasaki_lootlike_address());
        return mll.get_allStatus(_summoner);
    }
    
    //isActive
    function isActive(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        bool _isActive = ms.isActive(_summoner);
        if (_isActive == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    
    //inHouse
    function inHouse(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        bool _inHouse = ms.inHouse(_summoner);
        if (_inHouse == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    
    //fluffy festival
    /*
    function check_votable(uint32 _summoner) public view returns (uint32) {
        Fluffy_Festival ff = Fluffy_Festival(fluffy_festival_address);
        bool _isVotable = ff.check_votable(_summoner);
        if (_isVotable == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    function inSession() public view returns (uint32) {
        Fluffy_Festival ff = Fluffy_Festival(fluffy_festival_address);
        bool _inSession = ff.inSession();
        if (_inSession == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    */
    function next_festival_block() public view returns (uint32) {
        Fluffy_Festival ff = Fluffy_Festival(fluffy_festival_address);
        return ff.next_festival_block();
    }
    
    //parameter
    function speed() public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        return mp.SPEED();
    }
    function price() public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        return mp.PRICE();
    }
    function staking_reward_sec() public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        return mp.STAKING_REWARD_SEC();
    }
    function elected_fluffy_type() public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        return mp.ELECTED_FLUFFY_TYPE();
    }
    
    //###dynamic
    function allDynamicStatus(uint32 _summoner) external view returns (uint32[64] memory) {
        uint32[64] memory _res;
        _res[0] = uint32(block.number);
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
    function allStaticStatus(uint32 _summoner) external view returns (
        uint32,
        address,
        string memory,
        string[5] memory,
        uint32,
        uint32,
        uint32,
        uint32
    ) {
        uint32 _class = class(_summoner);
        address _owner = owner(_summoner);
        string memory _name = name(_summoner);
        string[5] memory lootStatus = allStatus(_summoner);
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
    function allItemBalance(uint32 _summoner) public view returns (uint32[256] memory) {
        address _owner = owner(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        return mc.get_balance_of_type(_owner);
    }
    
    function allItemId_withItemType(uint32 _summoner) public view returns (uint[] memory) {
        address _owner = owner(_summoner);
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint _myListLength = mc.myListLength(_owner);
        return mc.myListsAt_withItemType(_owner, 0, _myListLength);
    }
}


//---Murasaki_Info_fromWallet


contract Murasaki_Info_fromWallet is Ownable {
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
    function summoner(address _wallet) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint32 _summoner = mm.tokenOf(_wallet);
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
    function class(address _wallet) public view returns (uint32) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        uint32 _summoner = summoner(_wallet);
        return mi.class(_summoner);
    }
    
    //age
    function age(address _wallet) public view returns (uint32) {
        Murasaki_Info mi = Murasaki_Info(murasaki_info_address);
        uint32 _summoner = summoner(_wallet);
        return mi.age(_summoner);
    }    
}


//---*Fluffy_Festival


contract Fluffy_Festival is Ownable {

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
    uint32 public ELECTION_PERIOD_BLOCK = 7200; //1 days, 12sec/block
    uint32 public LEVEL_REQUIRED = 3;
    uint32 public SATIETY_REQUIRED = 10;
    uint32 public HAPPY_REQUIRED = 10;
    uint32 public ELECTION_INTERVAL_BLOCK = 216000; //30 days, 12sec/block
    bool public inSession;
    bool public isActive = true;
    uint32 public elected_type = 0;
    uint32 public previous_elected_type = 0;
    
    //admin, change global variants
    function _setA_election_period_block(uint32  _value) external onlyOwner {
        ELECTION_PERIOD_BLOCK = _value;
    }
    function _setB_level_required(uint32  _value) external onlyOwner {
        LEVEL_REQUIRED = _value;
    }
    function _setC_satiety_required(uint32  _value) external onlyOwner {
        SATIETY_REQUIRED = _value;
    }
    function _setD_happy_required(uint32  _value) external onlyOwner {
        HAPPY_REQUIRED = _value;
    }
    function _setE_election_interval_block(uint32  _value) external onlyOwner {
        ELECTION_INTERVAL_BLOCK = _value;
    }
    function _setF_inSession(bool _bool) external onlyOwner {
        inSession = _bool;
    }
    function _setG_isActive(bool _bool) external onlyOwner {
        isActive = _bool;
    }
    
    //admin, modify subject parameters
    function _modify_subject(
        uint32 _subject_no,
        uint32 _start_block,
        uint32 _end_block,
        uint32 _start_step,
        uint32 _end_step,
        uint32 _elected_type
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
    uint32 subject_now = 0;
    struct Subject {
        uint32 start_block;
        uint32 end_block;
        uint32 start_step;
        uint32 end_step;
        uint32 elected_type;
    }
    mapping(uint32 => Subject) public subjects;
    
    //vote
    uint32 next_vote = 1;
    struct vote {
        uint32 blocknumber;
        uint32 summoner;
        uint32 value;
    }
    mapping(uint32 => vote) public votes;
    uint32[256] each_voting_count;
    mapping(uint32 => uint32) public last_voting_block; //summoner => blocknumber
    mapping(uint32 => uint32) public last_voting_type;  //summoner => fluffy_type
    
    //step
    uint32 next_step = 1;
    mapping(uint32 => uint32) public winner_inStep;

    //voting
    function voting(uint32 _summoner, uint32 _select) external {
        require(isActive);
        //reject present and previous elected type
        require(_select != elected_type);
        require(_select != previous_elected_type);
        require(_select >= 201 && _select <= 212);
        //check fist voting
        if ( check_start_voting() ){
            _start_voting();
        }
        //chekc votable of summoner
        require(check_votable(_summoner));
        //vote
        uint32 _block = uint32(block.number);
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
        _mint_presentbox(uint32(0), msg.sender, _memo);
        //check final voting
        if ( check_end_voting() ) {
            end_voting(_summoner);
        }
    }
    function check_votable(uint32 _summoner) public view returns (bool) {
        //get subject_now
        Subject memory _subject = subjects[subject_now];
        if (
            //can star voting
            check_start_voting()
            //or after start, meet the all condition
            || (
                //check summoner
                _check_summoner(_summoner)
                //check not have already voted
                && _subject.start_block > last_voting_block[_summoner]
                //check not ended
                && inSession
            )
        ){
            return true;
        } else {
            return false;
        }
    }
    function _check_summoner (uint32 _summoner) public view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Parameter mp = Murasaki_Parameter(mfs.murasaki_parameter_address());
        Murasaki_Storage ms = Murasaki_Storage(mfs.murasaki_storage_address());
        if (
            //check pause
            mp.isPaused() == false
            //check owner
            && mfs.check_owner(_summoner, msg.sender)
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
    function _get_winner_inStep_now() internal view returns (uint32) {
        //return fluffy type with the biggest voting count
        //when equal, smaller type number win
        uint32 _winner = 0;
        uint32 _voted = 0;
        for (uint32 i=201; i<=212; i++) {
            if (each_voting_count[i] > _voted) {
                _winner = i;
                _voted = each_voting_count[i];
            }
        }
        return _winner;
    }
    function _mint_presentbox(uint32 _summoner, address _wallet_to, string memory _memo) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        uint32 _seed = mfs.seed(_summoner);
        uint32 _item_type = 200;
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
    function _start_voting() internal {
        //create and initialize subject
        uint32 _block = uint32(block.number);
        subject_now += 1;
        subjects[subject_now] = Subject(
            _block, 
            _block + ELECTION_PERIOD_BLOCK, 
            next_step, 
            0,
            0
        );
        //reset voting count
        for (uint32 i=201; i<=212; i++) {
            each_voting_count[i] = 0;
        }
        //voting in session
        inSession = true;
        //vonus mint
        string memory _memo = "first vote bonus";
        _mint_presentbox(uint32(0), msg.sender, _memo);
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
    function end_voting(uint32 _summoner) public {
        require(
            _check_summoner(_summoner)
            && check_end_voting()
        );
        //update session status
        inSession = false;
        //select winner
        uint32 _winner = _select_winner(_summoner);
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
        _mint_presentbox(uint32(0), msg.sender, _memo);
    }
    function _select_winner(uint32 _summoner) internal view returns (uint32) {
        //candle auction
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //select random step in the range between from start_step to latest step
        Subject memory _subject = subjects[subject_now];
        uint32 _delta_step = (next_step) - _subject.start_step;
        uint32 _rand = mfs.dn(_summoner, _delta_step);
        uint32 _elected_step = _subject.start_step + _rand;
        //return winner as winner_inStep of the elected_step
        return winner_inStep[_elected_step];
    }
    
    //info
    function get_info(uint32 _summoner) external view returns (uint32[24] memory) {
        uint32[24] memory _res;
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
    function _inSession() internal view returns (uint32) {
        bool _bool = inSession;
        if (_bool == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }    
    }
    function _isVotable(uint32 _summoner) internal view returns (uint32) {
        bool _bool = check_votable(_summoner);
        if (_bool == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    function _isEndable() internal view returns (uint32) {
        bool _bool = check_end_voting();
        if (_bool == true) {
            return uint32(1);
        } else {
            return uint32(0);
        }
    }
    function next_festival_block() public view returns (uint32) {
        //in first festival, return past block number (0+INTERVAL)
        return subjects[subject_now].start_block + ELECTION_INTERVAL_BLOCK;
    }

    //***TODO*** forDebug
    function mint_presentbox(uint32 _summoner, address _wallet_to, string memory _memo) external onlyOwner {
        _mint_presentbox(_summoner, _wallet_to, _memo);
    }
}


//===old==================================================================================================================


/*



*/

