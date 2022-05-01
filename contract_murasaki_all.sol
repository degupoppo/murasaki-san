
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

//---RC721------------------------------------------------------------------------------------------------------------------

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



//---Badge------------------------------------------------------------------------------------------------------------------
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



//---Ownable------------------------------------------------------------------------------------------------------------------

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



//---Base64------------------------------------------------------------------------------------------------------------------

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



//---EnumerableSet------------------------------------------------------------------------------------------------------------------

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



//---Murasaki_Main------------------------------------------------------------------------------------------------------------------

contract Murasaki_Main is Badge, Ownable{

    //address
    address public murasaki_function_address;
    function _set_murasaki_function_address(address _address) public onlyOwner {
        murasaki_function_address = _address;
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

    //summon
    function summon(address _owner, uint32 _class, uint32 _seed) external {
        require(msg.sender == murasaki_function_address);
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
        require(msg.sender == murasaki_function_address);
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



//---Murasaki_Strage------------------------------------------------------------------------------------------------------------------

contract Murasaki_Strage is Ownable {

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
    uint32 public BASE_SEC = 86400;
    uint32 public SPEED = 1000; //100=100%
    uint32 public PRICE = 0;    //uin32, cannnot ether, need to recalc 10**18 in methods
    uint32 public DAY_PETRIFIED = 30;

    //dynamic, status
    mapping(uint32 => uint32) public level;
    mapping(uint32 => uint32) public exp;
    mapping(uint32 => uint32) public strength;
    mapping(uint32 => uint32) public dexterity;
    mapping(uint32 => uint32) public intelligence;
    mapping(uint32 => uint32) public luck;
    mapping(uint32 => uint32) public next_exp_required;
    mapping(uint32 => uint32) public last_level_up_time;

    //dymanic, resouse
    mapping(uint32 => uint32) public coin;
    mapping(uint32 => uint32) public material;

    //dynamic, treating
    mapping(uint32 => uint32) public last_feeding_time;
    mapping(uint32 => uint32) public last_grooming_time;

    //dynamic, working
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

    //update time, update when chain date was changed
    mapping(uint32 => uint32) public update_time;

    //dynamic, active or disable, initial default value = false, using burn
    mapping(uint32 => bool) public isActive;

    //admin, set global variants
    function _set_base_sec(uint32 _base_sec) external onlyOwner {
        BASE_SEC = _base_sec;
    }
    function _set_speed(uint32 _speed) external onlyOwner {
        SPEED = _speed;
    }
    function set_price(uint32 _price) external onlyOwner {
        PRICE = _price;
    }
    function set_day_petrified(uint32 _day_petrified) external onlyOwner {
        DAY_PETRIFIED = _day_petrified;
    }

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
    function set_update_time(uint32 _summoner, uint32 _value) external {
        require(permitted_address[msg.sender] == true);
        update_time[_summoner] = _value;
    }
}



//---Murasaki_Function------------------------------------------------------------------------------------------------------------------

contract Murasaki_Function_Share is Ownable {

    //address
    address public murasaki_main_address;
    address public murasaki_strage_address;
    address public murasaki_craft_address;
    address public world_dice_address;
    //address public tiny_heart_address;
    address public murasaki_name_address;

    //address set, admin
    function _set1_murasaki_main_address(address _address) external onlyOwner {
        murasaki_main_address = _address;
    }
    function _set2_murasaki_strage_address(address _address) external onlyOwner {
        murasaki_strage_address = _address;
    }
    function _set3_murasaki_craft_address(address _address) external onlyOwner {
        murasaki_craft_address = _address;
    }
    function _set4_world_dice_address(address _address) external onlyOwner {
        world_dice_address = _address;
    }
    //function _set5_tiny_heart_address(address _address) external onlyOwner {
    //    tiny_heart_address = _address;
    //}
    function _set6_murasaki_name_address(address _address) external onlyOwner {
        murasaki_name_address = _address;
    }

    //check owner of summoner
    function check_owner(uint32 _summoner, address _wallet) external view returns (bool) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        return (mm.ownerOf(_summoner) == _wallet);
    }

    //get owner of summoner
    function get_owner(uint32 _summoner) external view returns (address) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        return mm.ownerOf(_summoner);
    }

    //status

    //return status
    function get_dynamic_status_array(uint32 _summoner) external view returns (uint32[30] memory) {
        Murasaki_Strage ms = Murasaki_Strage(murasaki_strage_address);
        uint32[30] memory _res;
        _res[0] = ms.level(_summoner);
        _res[1] = ms.exp(_summoner);
        _res[2] = ms.strength(_summoner);
        _res[3] = ms.dexterity(_summoner);
        _res[4] = ms.intelligence(_summoner);
        _res[5] = ms.luck(_summoner);
        _res[6] = ms.next_exp_required(_summoner);
        _res[7] = ms.last_level_up_time(_summoner);
        _res[8] = ms.coin(_summoner);
        _res[9] = ms.material(_summoner);
        _res[10] = ms.last_feeding_time(_summoner);
        _res[11] = ms.last_grooming_time(_summoner);
        _res[12] = ms.mining_status(_summoner);
        _res[13] = ms.mining_start_time(_summoner);
        _res[14] = ms.farming_status(_summoner);
        _res[15] = ms.farming_start_time(_summoner);
        _res[16] = ms.crafting_status(_summoner);
        _res[17] = ms.crafting_start_time(_summoner);
        _res[18] = ms.crafting_item_type(_summoner);
        _res[19] = ms.total_mining_sec(_summoner);
        _res[20] = ms.total_farming_sec(_summoner);
        _res[21] = ms.total_crafting_sec(_summoner);
        _res[22] = ms.last_total_mining_sec(_summoner);
        _res[23] = ms.last_total_farming_sec(_summoner);
        _res[24] = ms.last_total_crafting_sec(_summoner);
        _res[25] = ms.last_grooming_time_plus_working_time(_summoner);
        _res[26] = ms.update_time(_summoner);
        return _res;
    }
    function get_static_status_array(uint32 _summoner) external view returns (uint32[5] memory) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        uint32[5] memory _res;
        _res[0] = mm.class(_summoner);
        _res[1] = mm.summoned_time(_summoner);
        return _res;
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
    function get_balance_of_type_array_from_summoner(uint32 _summoner) external view returns (uint32[256] memory) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        address _owner = mm.ownerOf(_summoner);
        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        return mc.get_balance_of_type(_owner);
    }

    /*
    //***TODO*** craftable coin/material bag NFT, mint to spend coin/material, burn to gein coin/material
    //transfer coin, material
    function transfer_coin(uint32 _summoner_from, uint32 _summoner_to, uint32 _coin) external {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        Murasaki_Strage ms = Murasaki_Strage(murasaki_strage_address);
        require(mm.ownerOf(_summoner_from) == msg.sender);
        require(ms.coin(_summoner_from) >= _coin);
        ms.set_coin(_summoner_from, ms.coin(_summoner_from) - _coin);
        ms.set_coin(_summoner_to, ms.coin(_summoner_to) + _coin);
    }
    function transfer_material(uint32 _summoner_from, uint32 _summoner_to, uint32 _material) external {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        Murasaki_Strage ms = Murasaki_Strage(murasaki_strage_address);
        require(mm.ownerOf(_summoner_from) == msg.sender);
        require(ms.material(_summoner_from) >= _material);
        ms.set_material(_summoner_from, ms.material(_summoner_from) - _material);
        ms.set_material(_summoner_to, ms.material(_summoner_to) + _material);
    }
    */

    //calc satiety
    function calc_satiety(uint32 _summoner) public view returns (uint32) {
        Murasaki_Strage ms = Murasaki_Strage(murasaki_strage_address);
        uint32 SPEED = ms.SPEED();
        uint32 BASE_SEC = ms.BASE_SEC();
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
        Murasaki_Strage ms = Murasaki_Strage(murasaki_strage_address);
        uint32 SPEED = ms.SPEED();
        uint32 BASE_SEC = ms.BASE_SEC();
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

    //calc heart
    function calc_heart(uint32 _summoner) public view returns (uint32) {
        //Tiny_Heart th = Tiny_Heart(tiny_heart_address);
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        address _owner = mm.ownerOf(_summoner);
        uint32 _heart = get_balance_of_type_specific(_owner, 193);
        //uint32 _heart = uint32(th.balanceOf(_owner));
        return _heart;
    }

    //call_name_from_summoner
    function call_name_from_summoner(uint32 _summoner) external view returns (string memory) {
        Murasaki_Name mn = Murasaki_Name(murasaki_name_address);
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        address _owner = mm.ownerOf(_summoner);
        uint32 _name_id = mn.tokenOf(_owner);
        string memory _name_str = mn.names(_name_id);
        return _name_str;
    }

    //random
    //for block chain
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
                    blockhash(block.number - 1),
                    _summoner,
                    msg.sender
                )
            )
        );
    }
}

//=========================================================================================================

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
    function summon(uint32 _class) external payable {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32 PRICE = ms.PRICE();
        uint32 BASE_SEC = ms.BASE_SEC();
        //uint32 SPEED = ms.SPEED();
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
        ms.set_last_feeding_time(_summoner, _now - BASE_SEC/4); //***TODO***
        ms.set_last_grooming_time(_summoner, _now - BASE_SEC/4);  //***TODO***
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
        ms.set_last_grooming_time_plus_working_time(_summoner, _now - BASE_SEC/4); //***TODO***
        ms.set_isActive(_summoner, true);
    }

    //burn
    function burn(uint32 _summoner) external {
        //check owner
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        require(mfs.check_owner(_summoner, msg.sender));
        //burn on mm
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        mm.burn(_summoner);
        //burn on ms, inactivate
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        ms.set_isActive(_summoner, false);
    }

    //petrified check
    //***TODO*** duplicated code
    function not_petrified(uint32 _summoner) internal view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32 SPEED = ms.SPEED();
        uint32 BASE_SEC = ms.BASE_SEC();
        uint32 DAY_PETRIFIED = ms.DAY_PETRIFIED();
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - ms.last_feeding_time(_summoner);
        if ( _delta_sec >= BASE_SEC * DAY_PETRIFIED *100/SPEED) {
            return false;
        }else {
            return true;
        }
    }

    //level-up
    function level_up(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(ms.exp(_summoner) >= ms.next_exp_required(_summoner));

        //petrified check ***TODO*** duplicated code
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
    }
}

//=========================================================================================================

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
    //***TODO*** limit to feed other summoners, ex: 1hr
    //function feeding(uint32 _summoner) external returns (uint32){
    function feeding(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        //require(mfs.check_owner(_summoner, msg.sender));
        require(not_petrified(_summoner));
        uint32 _now = uint32(block.timestamp);
        uint32 _satiety = mfs.calc_satiety(_summoner);
        uint32 _exp_add = 500 * (100 - _satiety) / 100;
        //luck challenge
        uint32 _luck_mod = ms.luck(_summoner) + mfs.calc_heart(_summoner) * 5;
        if (mfs.d100(_summoner) <= _luck_mod/100) {
        //if (mfs.d100(_summoner) <= ms.luck(_summoner)/100) {
            _exp_add = _exp_add *2;
        }
        uint32 _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        ms.set_last_feeding_time(_summoner, _now);
        //owner check, gain some exp when not your summoner
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        uint32 _summoner_yours = mm.tokenOf(msg.sender);
        if (_summoner_yours != 0 && _summoner != _summoner_yours) {
            uint32 _exp_yours = ms.exp(_summoner_yours);
            ms.set_exp(_summoner_yours, _exp_yours + _exp_add / 50);
        }
        //return _exp_add;
    }

    //petrification, debends on only feeding
    function not_petrified(uint32 _summoner) public view returns (bool) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32 SPEED = ms.SPEED();
        uint32 BASE_SEC = ms.BASE_SEC();
        uint32 DAY_PETRIFIED = ms.DAY_PETRIFIED();
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - ms.last_feeding_time(_summoner);
        if ( _delta_sec >= BASE_SEC * DAY_PETRIFIED *100/SPEED) {
            return false;
        }else {
            return true;
        }
    }
    function cure_petrification(uint32 _summoner) external payable {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32 PRICE = ms.PRICE();
        require(mfs.check_owner(_summoner, msg.sender));
        require(!not_petrified(_summoner));
        uint _price = ms.level(_summoner) * PRICE * 10**18;
        require(msg.value >= _price);
        uint32 _now = uint32(block.timestamp);
        ms.set_last_feeding_time(_summoner, _now);
        ms.set_mining_status(_summoner, 0);
        ms.set_farming_status(_summoner, 0);
        ms.set_crafting_status(_summoner, 0);
    }

    //grooming
    function grooming(uint32 _summoner) external returns (uint32){
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(not_petrified(_summoner));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        uint32 _now = uint32(block.timestamp);
        uint32 _happy = calc_happy_real(_summoner);
        uint32 _exp_add = 3000 * (100 - _happy) / 100;
        //luck challenge
        uint32 _luck_mod = ms.luck(_summoner) + mfs.calc_heart(_summoner) * 5;
        if (mfs.d100(_summoner) <= _luck_mod/100) {
        //if (mfs.d100(_summoner) <= ms.luck(_summoner)/100) {
            _exp_add = _exp_add *2;
        }
        uint32 _exp = ms.exp(_summoner) + _exp_add;
        ms.set_exp(_summoner, _exp);
        ms.set_last_grooming_time(_summoner, _now);
        ms.set_last_grooming_time_plus_working_time(_summoner, _now);
        return _exp_add;
    }
    //calc happy, modified with working_time
    function calc_happy_real(uint32 _summoner) internal view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32 SPEED = ms.SPEED();
        uint32 BASE_SEC = ms.BASE_SEC();
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
}

//=========================================================================================================

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
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(mfs.calc_satiety(_summoner) >= 20 && mfs.calc_happy(_summoner) >= 20);
        require(ms.level(_summoner) >= 2);
        uint32 _now = uint32(block.timestamp);
        ms.set_mining_status(_summoner, 1);
        ms.set_mining_start_time(_summoner, _now);
    }
    function stop_mining(uint32 _summoner) external returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = calc_mining(_summoner);
        //luck modification
        uint32 _luck_mod = ms.luck(_summoner) + mfs.calc_heart(_summoner) * 5;
        if (mfs.d100(_summoner) <= _luck_mod/100) {
        //if (mfs.d100(_summoner) <= ms.luck(_summoner)/100) {
            _delta = _delta *2;
        }
        //add coin
        uint32 _coin = ms.coin(_summoner) + _delta;
        ms.set_coin(_summoner, _coin);
        //update timestamp
        uint32 _delta_sec = _now - ms.mining_start_time(_summoner);
        uint32 _total_mining_sec = ms.total_mining_sec(_summoner) + _delta_sec;
        ms.set_total_mining_sec(_summoner, _total_mining_sec);
        uint32 _last_total_mining_sec = ms.last_total_mining_sec(_summoner) + _delta_sec;
        ms.set_last_total_mining_sec(_summoner, _last_total_mining_sec);
        uint32 _last_grooming_time_plus_working_time = ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec;
        ms.set_last_grooming_time_plus_working_time(_summoner, _last_grooming_time_plus_working_time);
        ms.set_mining_status(_summoner, 0);
        return _delta;
    }
    function calc_mining(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32 SPEED = ms.SPEED();
        uint32 BASE_SEC = ms.BASE_SEC();
        require(ms.mining_status(_summoner) == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = (_now - ms.mining_start_time(_summoner)) * SPEED/100;   //sec
        _delta = _delta * 1000 / BASE_SEC; // 1 day = +1000
        //status, level, item boost
        uint32 _mod = ms.strength(_summoner) + ms.level(_summoner)*100 + count_mining_items(msg.sender);
        //world dice boost
        World_Dice wd = World_Dice(mfs.world_dice_address());
        uint32 _rolled_dice = wd.get_rolled_dice(_summoner);
        _mod += _rolled_dice;
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
                _mining_items += 300;
            }else if (_balance_of_type[i+64] > 0) {
                _mining_items += 200;
            }else if (_balance_of_type[i] > 0) {
                _mining_items += 100;
            }
            //+10% per one additional item
            if (_balance_of_type[i] >= 2) {
                _mining_items += (_balance_of_type[i] - 1) * 10;
            }
            if (_balance_of_type[i+64] >= 2) {
                _mining_items += (_balance_of_type[i+64] - 1) * 20;
            }
        }
        return _mining_items;
    }

    //farming
    function start_farming(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(mfs.calc_satiety(_summoner) >= 20 && mfs.calc_happy(_summoner) >= 20);
        require(ms.level(_summoner) >= 2);
        uint32 _now = uint32(block.timestamp);
        ms.set_farming_status(_summoner, 1);
        ms.set_farming_start_time(_summoner, _now);
    }
    function stop_farming(uint32 _summoner) external returns (uint32){
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.farming_status(_summoner) == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = calc_farming(_summoner);
        //luck modification
        uint32 _luck_mod = ms.luck(_summoner) + mfs.calc_heart(_summoner) * 5;
        if (mfs.d100(_summoner) <= _luck_mod/100) {
        //if (mfs.d100(_summoner) <= ms.luck(_summoner)/100) {
            _delta = _delta *2;
        }
        //add coin
        uint32 _material = ms.material(_summoner) + _delta;
        ms.set_material(_summoner, _material);
        //update timestamp
        uint32 _delta_sec = _now - ms.farming_start_time(_summoner);
        uint32 _total_farming_sec = ms.total_farming_sec(_summoner) + _delta_sec;
        ms.set_total_farming_sec(_summoner, _total_farming_sec);
        uint32 _last_total_farming_sec = ms.last_total_farming_sec(_summoner) + _delta_sec;
        ms.set_last_total_farming_sec(_summoner, _last_total_farming_sec);
        uint32 _last_grooming_time_plus_working_time = ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec;
        ms.set_last_grooming_time_plus_working_time(_summoner, _last_grooming_time_plus_working_time);
        ms.set_farming_status(_summoner, 0);
        return _delta;
    }
    function calc_farming(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32 SPEED = ms.SPEED();
        uint32 BASE_SEC = ms.BASE_SEC();
        require(ms.farming_status(_summoner) == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = (_now - ms.farming_start_time(_summoner)) * SPEED/100;  //sec
        _delta = _delta * 1000 / BASE_SEC; // 1 day = +1000
        //status and item boost
        uint32 _mod = ms.dexterity(_summoner) + ms.level(_summoner)*100 + count_farming_items(msg.sender);
        //world dice boost
        World_Dice wd = World_Dice(mfs.world_dice_address());
        uint32 _rolled_dice = wd.get_rolled_dice(_summoner);
        _mod += _rolled_dice;
        //5%/point, 100 -> 1.00
        _mod = _mod * 5 / 100;
        //boost
        _delta += _delta * _mod / 100;
        return _delta;
    }
    function count_farming_items(address _address) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        //Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32[256] memory _balance_of_type = mfs.get_balance_of_type_array(_address);
        uint32 _farming_items = 0;
        for (uint i = 17; i <= 32; i++) {
            if (_balance_of_type[i+128] > 0) {
                _farming_items += 300;
            }else if (_balance_of_type[i+64] > 0) {
                _farming_items += 200;
            }else if (_balance_of_type[i] > 0) {
                _farming_items += 100;
            }
            //+10% per one additional items
            if (_balance_of_type[i] >= 2) {
                _farming_items += (_balance_of_type[i] - 1) * 10;
            }
            if (_balance_of_type[i+64] >= 2) {
                _farming_items += (_balance_of_type[i+64] - 1) * 20;
            }
        }
        return _farming_items;
    }
}

//=========================================================================================================

contract Murasaki_Function_Crafting is Ownable {

    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }

    //admin. withdraw
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //crafting
    function start_crafting(uint32 _summoner, uint32 _item_type) public {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.mining_status(_summoner) == 0 && ms.farming_status(_summoner) == 0 && ms.crafting_status(_summoner) == 0);
        require(mfs.calc_satiety(_summoner) >= 20 && mfs.calc_happy(_summoner) >= 20);
        require(ms.level(_summoner) >= 3);
        require(_item_type <= 64 || _item_type == 194 || _item_type == 195);
        uint32 _now = uint32(block.timestamp);
        //check coin and material
        uint32 _coin;
        uint32 _material;
        //coin/material bag
        if (_item_type == 194){
            _coin = 1000;
            _material = 10;
        }else if (_item_type == 195){
            _coin = 10;
            _material = 1000;
        }else{
            uint32[4] memory _dc_table = get_item_dc(_item_type);
            _coin = _dc_table[2];
            _material = _dc_table[3];
            if (_item_type == 48){_coin = 10;} //***test craft***
            if (_item_type == 48){_material = 10;} //***test craft***
        }
        require(ms.coin(_summoner) >= _coin && ms.material(_summoner) >= _material);
        //start crafting
        ms.set_coin(_summoner, ms.coin(_summoner) - _coin);
        ms.set_material(_summoner, ms.material(_summoner) - _material);
        ms.set_crafting_item_type(_summoner, _item_type);
        ms.set_crafting_status(_summoner, 1);
        ms.set_crafting_start_time(_summoner, _now);
    }
    function stop_crafting(uint32 _summoner) public {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        require(ms.crafting_status(_summoner) == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = (_now - ms.crafting_start_time(_summoner));
        uint32 _item_type = ms.crafting_item_type(_summoner);
        //stop
        ms.set_total_crafting_sec(_summoner, ms.total_crafting_sec(_summoner) + _delta_sec);
        ms.set_last_total_crafting_sec(_summoner, ms.last_total_crafting_sec(_summoner) + _delta_sec);
        ms.set_last_grooming_time_plus_working_time(
            _summoner, ms.last_grooming_time_plus_working_time(_summoner) + _delta_sec);
        //craft
        uint32 _calc_crafting = calc_crafting(_summoner);
        ms.set_crafting_status(_summoner, 0);   //before tx, required status must be updated
        if (_calc_crafting == 0) {
            //rare challenge
            uint32 _luck_mod = ms.luck(_summoner) + mfs.calc_heart(_summoner) * 5;
            if (mfs.d100(_summoner) <= _luck_mod/100) {
                _item_type += 64;
            }
            //craft
            Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
            uint32 _seed = mfs.seed(_summoner);
            mc.craft(_item_type, _summoner, msg.sender, _seed);
            //generate tiny heart, ignore coin/material bag
            //create_tiny_heart(_next_item, _summoner);
            if (_item_type <= 128) {
                create_tiny_heart(_summoner);
            }
        }
    }
    function get_modified_dc(uint32 _summoner, uint32 _item_type) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        //coin/material bag
        if (_item_type == 194 || _item_type == 195){
            return 20;  //about 30 min
        }
        uint32[4] memory _dc_table = get_item_dc(_item_type);
        //get dc
        uint32 _level = _dc_table[0];
        uint32 _dc = _dc_table[1];
        //status boost
        uint32 _mod = ms.intelligence(_summoner) + ms.level(_summoner)*100 + count_crafting_items(msg.sender);
        //world dice boost
        World_Dice wd = World_Dice(mfs.world_dice_address());
        uint32 _rolled_dice = wd.get_rolled_dice(_summoner);
        _mod += _rolled_dice;
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
        if (_item_type == 48){_mod_dc = 10;} //***test craft***
        return _mod_dc;
    }
    function calc_crafting(uint32 _summoner) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(ms.crafting_status(_summoner) == 1);
        uint32 SPEED = ms.SPEED();
        uint32 _now = uint32(block.timestamp);
        uint32 _item_type = ms.crafting_item_type(_summoner);
        //get modified dc
        uint32 _dc = get_modified_dc(_summoner, _item_type);
        //calc remaining sec
        uint32 BASE_SEC = ms.BASE_SEC();
        uint32 _dc_sec = _dc * BASE_SEC / 1000;   //1000dc = 1day = 86400sec
        //calc remining sec
        uint32 _delta_time = ( _now - ms.crafting_start_time(_summoner) ) * SPEED/100;
        uint32 _remining_time;
        if (_delta_time >= _dc_sec) {
            _remining_time = 0;
        }else {
            _remining_time = _dc_sec - _delta_time;
        }
        return _remining_time;
    }
    function count_crafting_items(address _address) public view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        uint32[256] memory _balance_of_type = mfs.get_balance_of_type_array(_address);
        uint32 _crafting_items = 0;
        for (uint i = 33; i <= 48; i++) {
            if (_balance_of_type[i+128] > 0) {
                _crafting_items += 300;
            }else if (_balance_of_type[i+64] > 0) {
                _crafting_items += 200;
            }else if (_balance_of_type[i] > 0) {
                _crafting_items += 100;
            }
            //+10% per one additional items
            if (_balance_of_type[i] >= 2) {
                _crafting_items += (_balance_of_type[i] - 1) * 10;
            }
            if (_balance_of_type[i+64] >= 2) {
                _crafting_items += (_balance_of_type[i+64] - 1) * 20;
            }
        }
        return _crafting_items;
    }

    //get item dc
    function get_item_dc(uint32 _item_type) public view returns (uint32[4] memory) {
        //coin/material bag
        if (_item_type == 194){
            return [uint32(99), uint32(0), uint32(1000), uint32(10)];
        }else if (_item_type == 195) {
            return [uint32(99), uint32(0), uint32(10), uint32(1000)];
        }
        uint32 _level = level_table[_item_type];
        uint32 _dc = dc_table[_item_type];
        uint32 _coin = coin_table[_item_type];
        uint32 _material = material_table[_item_type];
        return [_level, _dc, _coin, _material];
    }

    //tiny heart
    //convert to main mc version, item_type 193 = tinyheart
    //choice random summoner and transfer tiny heart to it
    //when not active summoner was selected, msg.sender will get it instedlly.
    //function create_tiny_heart(uint32 _created_item, uint32 _created_summoner) internal {
    function create_tiny_heart(uint32 _created_summoner) internal {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Main mm = Murasaki_Main(mfs.murasaki_main_address());
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        //Tiny_Heart th = Tiny_Heart(mfs.tiny_heart_address());
        //get random _to_summoner
        uint32 _count_summoners = mm.next_summoner() - 1;
        uint32 _to_summoner = mfs.dn(_created_summoner, _count_summoners) + 1;
        //check _to_summoner: when not active summoner, transfer to msg.sender
        bool _isActive = ms.isActive(_to_summoner);
        address _to_wallet;
        if (
            _isActive == true
            && ms.level(_to_summoner) >= 3
            && mfs.calc_satiety(_to_summoner) >= 20
            && mfs.calc_happy(_to_summoner) >= 20
        ) {
            _to_wallet = mm.ownerOf(_to_summoner);
        } else {
            _to_wallet = msg.sender;
        }
        //create tiny heart
        uint32 _seed = mfs.seed(_created_summoner);
        //address _created_wallet = mm.ownerOf(_created_summoner);
        mc.craft(193, _created_summoner, _to_wallet, _seed);
        //th.create(_created_item, _created_summoner, _created_wallet, _seed, _to_wallet);
    }

    //upgrade item
    //***TODO***
    //cost? time? UI?
    function upgrade_item(uint32 _summoner, uint32 _item1, uint32 _item2, uint32 _item3) external {
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
        (uint32 _item_type1, , ,) = mc.items(_item1);
        (uint32 _item_type2, , ,) = mc.items(_item2);
        (uint32 _item_type3, , ,) = mc.items(_item3);
        require(_item_type1 <= 128);
    	require(
    	    _item_type2 == _item_type1
    	    && _item_type3 == _item_type1
    	);
        //burn (transfer) lower rank items
        mc.transferFrom(msg.sender, address(this), _item1);
        mc.transferFrom(msg.sender, address(this), _item2);
        mc.transferFrom(msg.sender, address(this), _item3);
        //mint upper rank item
        uint32 _seed = mfs.seed(_summoner);
        mc.craft(_item_type1 + 64, _summoner, msg.sender, _seed);
    }
    
    //unpack coin/material
    function unpack_bag(uint32 _summoner, uint32 _item) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Craft mc = Murasaki_Craft(mfs.murasaki_craft_address());
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        //check owner
        require(mfs.check_owner(_summoner, msg.sender));
        require(mc.ownerOf(_item) == msg.sender);
        //check item_type
        (uint32 _item_type, , ,) = mc.items(_item);
        require(_item_type == 194 || _item_type == 195);
        //burn _item
        mc.transferFrom(msg.sender, address(this), _item);
        //unpack coin/material
        if (_item_type == 194) {
            ms.set_coin(_summoner, ms.coin(_summoner) + 1000);
        } else if (_item_type == 195) {
            ms.set_material(_summoner, ms.material(_summoner) + 1000);
        }
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
}



//---Murasaki_Craft------------------------------------------------------------------------------------------------------------------

contract Murasaki_Craft is ERC721, Ownable{

    //address
    address public murasaki_function_address;
    function _set_murasaki_function_address(address _address) public onlyOwner{
        murasaki_function_address = _address;
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
    }
    mapping(uint256 => item) public items;
    mapping(address => uint32[256]) public balance_of_type;
    mapping(uint32 => uint32) public seed;

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

    /*  not used 220406
    //override ERC721 burn
    function _burn(uint256 tokenId) internal virtual override {
        uint32 _item_type = items[tokenId].item_type;
        address _owner = ERC721.ownerOf(tokenId);
        balance_of_type[_owner][_item_type] -= 1;
        mySet[msg.sender].remove(tokenId);
        ERC721._burn(tokenId);
    }
    function burn(uint256 tokenId) external {
        require(msg.sender == murasaki_function_address);
        _burn(tokenId);
    }
    */

    //craft
    function craft(uint32 _item_type, uint32 _summoner, address _wallet, uint32 _seed) external {
        require(msg.sender == murasaki_function_address);
        uint32 _now = uint32(block.timestamp);
        uint32 _crafting_item = next_item;
        items[_crafting_item] = item(_item_type, _now, _summoner, _wallet);
        balance_of_type[_wallet][_item_type] += 1;  //balanceOf each item type
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



//---World_Dice------------------------------------------------------------------------------------------------------------------

contract World_Dice is Ownable {

    /*
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
    uint32 dice_item_type = 36;
    uint32 buffer_sec = 14400;  //4 hr

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
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        if (last_dice_roll_time[_summoner] == 0) {
            return 86400 * 10;  //if not rolled yet, return 10 days
        } else {
            uint32 _now = uint32(block.timestamp);
            uint32 SPEED = ms.SPEED();
            uint32 _elasped_time = uint32( (_now - last_dice_roll_time[_summoner]) * SPEED/100 );
            return _elasped_time;
        }
    }

    //dice roll
    function dice_roll(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        //check dice possession
        address _owner = mfs.get_owner(_summoner);
        require(mfs.get_balance_of_type_specific(_owner, dice_item_type) > 0);
        //check elasped_time
        uint32 BASE_SEC = ms.BASE_SEC();
        uint32 _elasped_time = calc_elasped_time(_summoner);
        require(_elasped_time >= BASE_SEC - buffer_sec);
        //dice roll
        uint32 _dice_roll = (mfs.d20(_summoner) + 1) * 10;
        //luck challenge
        uint32 _luck_mod = ms.luck(_summoner) + mfs.calc_heart(_summoner) * 5;
        if (mfs.d100(_summoner) <= _luck_mod/100) {
            _dice_roll = 20 * 10;  //critical
        }
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
    }
    
    //get rolled dice, average of 4 dices
    function get_rolled_dice(uint32 _summoner) external view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        //get elasped_time
        uint32 BASE_SEC = ms.BASE_SEC();
        uint32 _elasped_time = calc_elasped_time(_summoner);
        //get owner of summoner
        address _owner = mfs.get_owner(_summoner);
        //calc mod_dice
        uint32 _mod_dice;
        //ignore when not possessed item_dice
        if (mfs.get_balance_of_type_specific(_owner, dice_item_type) == 0) {
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
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        address _owner = mfs.get_owner(_summoner);
        uint32 BASE_SEC = ms.BASE_SEC();
        uint32 _elasped_time = calc_elasped_time(_summoner);
        if (mfs.get_balance_of_type_specific(_owner, dice_item_type) == 0) {
            return 0;
        } else if (_elasped_time > BASE_SEC * 1) {
            return 0;
        } else {
            return rolled_dice[_summoner][3];
        }
    }

    /*
    //variants
    mapping(uint32 => uint32) public rolled_dice;
    mapping(uint32 => uint32) public last_dice_roll_time;
    uint32 dice_item_type = 36;
    
    //set dice item_type    
    function _set2_dice_item_type(uint32 _item_type) external onlyOwner {
        dice_item_type = _item_type;
    }

    //dice roll
    function dice_roll(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        require(mfs.check_owner(_summoner, msg.sender));
        //dice possession check
        address _owner = mfs.get_owner(_summoner);
        require(mfs.get_balance_of_type_specific(_owner, dice_item_type) > 0);
        uint32 _now = uint32(block.timestamp);
        require(_now - last_dice_roll_time[_summoner] >= (ms.BASE_SEC() *9/10) *100/ms.SPEED());
        //dice roll
        uint32 _dice_roll = mfs.d20(_summoner) * 10;
        //luck challenge
        uint32 _luck_mod = ms.luck(_summoner) + mfs.calc_heart(_summoner) * 5;
        if (mfs.d100(_summoner) <= _luck_mod/100) {
            _dice_roll = 20 * 10;  //critical
        }
        rolled_dice[_summoner] = _dice_roll;
        last_dice_roll_time[_summoner] = _now;
    }

    //get rolled dice
    function get_rolled_dice(uint32 _summoner) external view returns (uint32) {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        uint32 _now = uint32(block.timestamp);
        address _owner = mfs.get_owner(_summoner);
        //ignore past rolled dice before BASE_SEC, and when not possessed _item_type
        if(
            _now - last_dice_roll_time[_summoner] >= ms.BASE_SEC() *100/ms.SPEED()
            || mfs.get_balance_of_type_specific(_owner, dice_item_type) == 0
        ) {
            return 0;
        } else{
            return rolled_dice[_summoner];
        }
    }
    */

}



//---BBS------------------------------------------------------------------------------------------------------------------

contract Bulletin_Board is Ownable {

    /*
    //address
    address public murasaki_function_share_address;
    function _set1_murasaki_function_share_address(address _address) external onlyOwner {
        murasaki_function_share_address = _address;
    }
    */

    //variants
    mapping(uint32 => address) public writer;
    mapping(uint32 => string) public message;
    mapping(uint32 => uint32) public date_writed;
    uint32 public next_message = 1;

    function write_message(string memory _message) external {
        writer[next_message] = msg.sender;
        message[next_message] = _message;
        date_writed[next_message] = uint32(block.timestamp);
        next_message++;
    }

    function read_latest_messages() external view returns (uint32, address, string memory) {
        return (date_writed[next_message-1], writer[next_message-1], message[next_message-1]);
    }

    function read_messages(uint32 _number) external view returns (uint32, address, string memory) {
        return (date_writed[_number], writer[_number], message[_number]);
    }

    function read_recent_messages(uint32 _count) external view returns (uint32, uint32, address, string memory) {
        return (
            next_message - _count, 
            date_writed[next_message - _count], 
            writer[next_message - _count], 
            message[next_message - _count]
        );
    }

    function delete_message(uint32 _number) external onlyOwner {
        writer[_number] = 0x0000000000000000000000000000000000000000;
        message[_number] = "[DELETED]";
        date_writed[_number] = 0;
    }
}




//---Murasaki_Name------------------------------------------------------------------------------------------------------------------

contract Murasaki_Name is Badge, Ownable{

    //address
    address public murasaki_function_address;
    function _set_murasaki_function_address(address _address) public onlyOwner {
        murasaki_function_address = _address;
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
        require(msg.sender == murasaki_function_address);
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
        require(msg.sender == murasaki_function_address);
        string memory _name_str = names[_name_id];
        isMinted[_name_str] = false;
        Badge._burn(_name_id);
    }
}



//---Murasaki_Function_Name------------------------------------------------------------------------------------------------------------------

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

    //mint
    function mint(uint32 _summoner, string memory _name_str) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        Murasaki_Strage ms = Murasaki_Strage(mfs.murasaki_strage_address());
        //owner check
        require(mfs.check_owner(_summoner, msg.sender));
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
    }

    //burn
    function burn(uint32 _summoner) external {
        Murasaki_Function_Share mfs = Murasaki_Function_Share(murasaki_function_share_address);
        Murasaki_Name mn = Murasaki_Name(mfs.murasaki_name_address());
        require(mfs.check_owner(_summoner, msg.sender));
        address _owner = mfs.get_owner(_summoner);
        uint32 _name_id = mn.tokenOf(_owner);
        require(_name_id > 0);
        mn.burn(_name_id);
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

