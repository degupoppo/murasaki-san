
/***

codex: 0x75988207eb57E54781e5E2CA1ec538d6653046AE
ToDo

    itemのrarity設定
        +1-2の範囲で補正を変える
        +2補正のアイテムはd20=20とかレアにする
        補正値をmm側で参照するシステムが一番の難点か
    
    バランス調整
        Lv1上がる日数
        1日に得られるcoin
        1日に得られるmaterial
        craftに費やす日数

    リファクタリング
        容量限界に付き、コードのスリム化 or 別コントラ化
        coin, materialをそれぞれ別にするか
        summonerパラメータのstruct化
        exp_next_requiredなどはライブラリ化して別コントラとするか

    item, pet NFTの譲渡の実装
        update関数の実装
            mm側に用意し, mcとmpのowner_summonerおよびwallet onwerをすべてチェックしてfalseを0に置換する
        1つのpet/itemが2つ以上のsummonerに紐付け可能なことを回避する実装を考える

    itemの補正方法の修正
        1つ所持するとステータス+1もしくは+2の補正で
        わかりやすくすべてステータス値に換算させる
        補正はあくまでステータス値の合計値で行う

    itemリストの再整備
        str, dex, int, luk, その他か
        12 + 12 + 12 + 12 + 12 = 60？

    ワールドダイスの実装
        mmに係数を追加
            ワールドダイスコントラからしか書き換えられないようにする
        クラフト品とする, 少し高めのコスト設定
        すべての補正+1～20%
        utc 0時以降, その日の分を振れる
        何かしらの判定時に, ダイス振ってあったら+補正
            utc 0時以前がlast_dice時間ならば補正なし
        Luck補正を利用する
        ダイス補正の期待値+10.5%を織り込んでバランス設計する
        乱数の実装

    ゆっくりと成長する木の実装
        item type = 50ぐらいの専用スロット
        成長するまで何が生えるかわからない
        summonerの行動によって結果がかわる
        1ヶ月で最大成長ぐらいか

ok  Luckの補正の実装
        feeding/grooming時に+αでexp得る確率
        stop mining/farming時に+αでcoin/material得る確率
        crafting時に割引で行える確率

ok  Vitステータスの削除

ok  URIの実装
        rarity方式にするか
        murasakiアイコン＋levelにするか
        base64等のURI関数の実装

ok  mining, farming, craftingの要求レベルの実装

***/



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;



//---------------------------------------------------------------------------------------------------------------------
//RC721

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



//---------------------------------------------------------------------------------------------------------------------
//Ownable, from rarity_skin

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



//---------------------------------------------------------------------------------------------------------------------
//Murasaki Main

contract Murasaki_Main is ERC721, Ownable{

    string constant public name = "House of Murasaki-san";
    string constant public symbol = "HMS";

    struct summoners {
        uint8 class;
        uint32 strength;
        uint32 dexterity;
        uint32 intelligence;
        uint32 luck;
        uint32 birth_time;
        uint32 last_feeding_time;
        uint32 last_grooming_time;
        uint32 coin;
        uint32 material;
        uint8 mining_status;
        uint32 mining_start_time;
        uint8 farming_status;
        uint32 farming_start_time;
        uint8 crafting_item_type;
        uint32 exp;
        uint8 level;
        uint32 next_exp_required;
        uint32 total_mining_sec;
        uint32 total_farming_sec;
        uint32 total_crafting_sec;
        uint32 last_total_mining_sec;
        uint32 last_total_farming_sec;
        uint32 last_total_crafting_sec;
        uint32 last_level_up_time;
        uint32 last_grooming_time_plus_working_time;
        uint32[64] items;

    /*
    mapping(uint32 => uint8) public ctype;
    mapping(uint32 => uint32) public strength;
    mapping(uint32 => uint32) public dexterity;
    mapping(uint32 => uint32) public intelligence;
    //mapping(uint32 => uint32) public vitality;
    mapping(uint32 => uint32) public luck;
    mapping(uint32 => uint32) public birth_time;
    mapping(uint32 => uint32) public last_feeding_time;
    mapping(uint32 => uint32) public last_grooming_time;
    mapping(uint32 => uint32) public coin;
    mapping(uint32 => uint32) public material;
    mapping(uint32 => uint8) public mining_status;
    mapping(uint32 => uint32) public mining_start_time;
    mapping(uint32 => uint8) public farming_status;
    mapping(uint32 => uint32) public farming_start_time;
    mapping(uint32 => uint8) public crafting_status;
    mapping(uint32 => uint32) public crafting_start_time;
    mapping(uint32 => uint8) public crafting_item_type;
    mapping(uint32 => uint32) public exp;
    mapping(uint32 => uint8) public level;
    mapping(uint32 => uint32) public next_exp_required;
    mapping(uint32 => uint32) public total_mining_sec;
    mapping(uint32 => uint32) public total_farming_sec;
    mapping(uint32 => uint32) public total_crafting_sec;
    mapping(uint32 => uint32) public last_total_mining_sec;
    mapping(uint32 => uint32) public last_total_farming_sec;
    mapping(uint32 => uint32) public last_total_crafting_sec;
    mapping(uint32 => uint32) public last_level_up_time;
    mapping(uint32 => uint32) public last_grooming_time_plus_working_time;
    mapping(uint32 => uint32[64]) public items;
    */

    address public murasaki_craft_address;
    address public murasaki_pet_address;
    address public codex_address;

    uint32 public next_summoner = 0;
    uint32 public base_sec = 86400;
    uint8 public price = 0 ether;
    uint32 public speed = 1;

    //set variants, only owner
    function set_base_sec(uint32 _base_sec) public onlyOwner {
        base_sec = _base_sec;
    }
    function set_price(uint8 _price) public onlyOwner {
        price = _price;
    }
    function set_murasaki_craft_address(address _address) public onlyOwner {
        murasaki_craft_address = _address;
    }
    function set_murasaki_pet_address(address _address) public onlyOwner {
        murasaki_pet_address = _address;
    }
    function set_speed(uint32 _speed) public onlyOwner {
        speed = _speed;
    }
    function set_codex_address(address _address) public onlyOwner {
        codex_address = _address;
    }

    //withdraw, only owner
    function withdraw(address rec)public onlyOwner{
        payable(rec).transfer(address(this).balance);
    }

    //call status
    function get_status(uint32 _summoner) public view returns (uint32[20] memory) {
        uint32[20] memory li_status;
        li_status[0] = summoners[_summoner].class;
        li_status[1] = summoners[_summoner].strength;
        li_status[2] = summoners[_summoner].dexterity;
        li_status[3] = 0
        li_status[4] = summoners[_summoner].intelligence;
        li_status[5] = summoners[_summoner].luck;
        li_status[6] = summoners[_summoner].birth_time;
        li_status[7] = summoners[_summoner].last_feeding_time;
        li_status[8] = summoners[_summoner].last_grooming_time;
        li_status[9] = summoners[_summoner].coin;
        li_status[10] = summoners[_summoner].material;
        li_status[11] = summoners[_summoner].mining_status;
        li_status[12] = summoners[_summoner].mining_start_time;
        li_status[13] = summoners[_summoner].farming_status;
        li_status[14] = summoners[_summoner].farming_start_time;
        li_status[15] = summoners[_summoner].crafting_status;
        li_status[16] = summoners[_summoner].crafting_start_time;
        li_status[17] = summoners[_summoner].exp;
        li_status[18] = summoners[_summoner].level;
        li_status[19] = summoners[_summoner].next_exp_required;
        /*        
        li_status[0] = ctype[_summoner];
        li_status[1] = strength[_summoner];
        li_status[2] = dexterity[_summoner];
        //li_status[3] = vitality[_summoner];
        li_status[3] = 0;
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
        */
        return li_status;
    }

    //call items as array
    function get_items(uint32 _summoner) public view returns (uint32[64] memory) {
        return summoners[_summoner].items;
        //return items[_summoner];
    }

    //summon
    function summon(uint8 _ctype) external payable {
        require(msg.value >= price, "price error");
        require(0 <= _ctype && _ctype <= 10);
        uint32 _now = uint32(block.timestamp);
        uint32 _next_summoner = next_summoner;
        
        
        ctype[_next_summoner] = _ctype;
        //initial status values
        level[_next_summoner] = 1;
        strength[_next_summoner] = 500;
        dexterity[_next_summoner] = 500;
        //vitality[_next_summoner] = 500;
        intelligence[_next_summoner] = 500;
        luck[_next_summoner] = 500;
        coin[_next_summoner] = 0;
        material[_next_summoner] = 0;
        exp[_next_summoner] = 0;
        //next_exp_required[_next_summoner] = 1000;
        next_exp_required[_next_summoner] = 100;
        //initialize other parameters
        birth_time[_next_summoner] = _now;
        last_feeding_time[_next_summoner] = _now;
        last_grooming_time[_next_summoner] = _now;
        mining_status[_next_summoner] = 0;
        mining_start_time[_next_summoner] = 0;
        crafting_status[_next_summoner] = 0;
        crafting_start_time[_next_summoner] = 0;
        farming_status[_next_summoner] = 0;
        farming_start_time[_next_summoner] = 0;
        total_mining_sec[_next_summoner] = 0;
        total_farming_sec[_next_summoner] = 0;
        total_crafting_sec[_next_summoner] = 0;
        last_total_mining_sec[_next_summoner] = 0;
        last_total_farming_sec[_next_summoner] = 0;
        last_total_crafting_sec[_next_summoner] = 0;
        last_level_up_time[_next_summoner] = _now;
        last_grooming_time_plus_working_time[_next_summoner] = _now;
        //mint
        _safeMint(msg.sender, _next_summoner);
        next_summoner++;
    }

    //feeding
    function feeding(uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        //require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - last_feeding_time[_summoner];
        //if (_delta_sec >= (base_sec * 1)) {
        //    _delta_sec = base_sec * 1;
        if (_delta_sec >= (base_sec / 2 /speed)) {
            _delta_sec = base_sec / 2 /speed;
        }
        Codex rd = Codex(codex_address);
        if (rd.d100(_summoner) <= luck[_summoner]/100) {
            _delta_sec * 2;
        }
        exp[_summoner] += _delta_sec * speed / 100;
        last_feeding_time[_summoner] = _now;
    }
    function calc_satiety(uint32 _summoner) public view returns (uint32) {
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - last_feeding_time[_summoner];
        //if (_delta_sec >= (base_sec * 1)) {
        //    _delta_sec = base_sec * 1;
        if (_delta_sec >= (base_sec / 2 /speed)) {
            _delta_sec = base_sec / 2 /speed;
        }
        uint32 _satiety = 100 * ((base_sec/2 /speed) - _delta_sec) / (base_sec/2 /speed);
        return _satiety;
    }

    //grooming
    function grooming(uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - last_grooming_time_plus_working_time[_summoner];
        if (_delta_sec >= (base_sec * 3 /speed)) {
            _delta_sec = base_sec * 3 /speed;
        }
        Codex rd = Codex(codex_address);
        if (rd.d100(_summoner) <= luck[_summoner]/100) {
            _delta_sec * 2;
        }
        exp[_summoner] += _delta_sec * speed / 100 ;
        last_grooming_time_plus_working_time[_summoner] = _now;
        last_grooming_time[_summoner] = _now;
    }
    function calc_happy(uint32 _summoner) public view returns (uint32) {
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = _now - last_grooming_time[_summoner];
        if (_delta_sec >= (base_sec * 3 /speed)) {
            _delta_sec = base_sec * 3 /speed;
        }
        uint32 _happy = 100 * ((base_sec*3 /speed) - _delta_sec) / (base_sec*3 /speed);
        return _happy;
    }

    //mining
    function start_mining(uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        require(calc_satiety(_summoner) >= 20 && calc_happy(_summoner) >= 20);
        require(level[_summoner] >= 2);
        uint32 _now = uint32(block.timestamp);
        mining_status[_summoner] = 1;
        mining_start_time[_summoner] = _now;
    }
    function stop_mining(uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = calc_coin(_summoner);
        //luck modification
        Codex rd = Codex(codex_address);
        if (rd.d100(_summoner) <= luck[_summoner]/100) {
            _delta * 2;
        }
        //add coin
        coin[_summoner] += _delta;
        uint32 _delta_sec = _now - mining_start_time[_summoner];
        total_mining_sec[_summoner] += _delta_sec;
        last_total_mining_sec[_summoner] += _delta_sec;
        last_grooming_time_plus_working_time[_summoner] += _delta_sec;
        mining_status[_summoner] = 0;
    }
    function calc_coin(uint32 _summoner) public view returns (uint32) {
        require(mining_status[_summoner] == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = (_now - mining_start_time[_summoner]) * speed / 100;
        _delta += (_delta * strength[_summoner]/100) / 100;    //status modification
        _delta += (_delta * level[_summoner]) / 100;    //level modification
        uint8 _mining_items = count_mining_items(_summoner);
        _delta += (_delta * _mining_items) / 100;   //item modification
        return _delta;
    }
    function count_mining_items(uint32 _summoner) public view returns (uint8) {
        require(mining_status[_summoner] == 1);
        uint32[64] memory _items = items[_summoner];
        uint8 _mining_items = 0;
        for (uint i = 1; i <= 16; i++) {
            if (_items[i] > 1) {
                _mining_items++;
            }
        }
        return _mining_items;
    }

    //farming
    function start_farming(uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        require(calc_satiety(_summoner) >= 20 && calc_happy(_summoner) >= 20);
        require(level[_summoner] >= 2);
        uint32 _now = uint32(block.timestamp);
        farming_status[_summoner] = 1;
        farming_start_time[_summoner] = _now;
    }
    function stop_farming(uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(farming_status[_summoner] == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = calc_material(_summoner);
        Codex rd = Codex(codex_address);
        if (rd.d100(_summoner) <= luck[_summoner]/100) {
            _delta * 2;
        }
        material[_summoner] += _delta;
        uint32 _delta_sec = _now - farming_start_time[_summoner];
        total_farming_sec[_summoner] += _delta_sec;
        last_total_farming_sec[_summoner] += _delta_sec;
        last_grooming_time_plus_working_time[_summoner] += _delta_sec;
        farming_status[_summoner] = 0;
    }
    function calc_material(uint32 _summoner) public view returns (uint32) {
        require(farming_status[_summoner] == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = (_now - farming_start_time[_summoner]) * speed / 1000;
        _delta += (_delta * dexterity[_summoner]/100) / 100;   //status modification
        _delta += (_delta * level[_summoner]) / 100;   //level modification
        return _delta;
    }
    
    //spend coin, material
    function spend_coin(uint32 _summoner, uint32 _coin) external {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        coin[_summoner] -= _coin;
    }
    function spend_material(uint32 _summoner, uint32 _material) external {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        material[_summoner] -= _material;
    }

    //transfer coin, material
    function transfer_coin(uint32 _summoner_from, uint32 _summoner_to, uint32 _coin) external {
        require(_isApprovedOrOwner(msg.sender, _summoner_from));
        coin[_summoner_from] -= _coin;
        coin[_summoner_to] += (_coin - _coin/5); //transfer fee 20%
    }
    function transfer_material(uint32 _summoner_from, uint32 _summoner_to, uint32 _material) external {
        require(_isApprovedOrOwner(msg.sender, _summoner_from));
        material[_summoner_from] -= _material;
        material[_summoner_to] += (_material - _material/5); //transfer fee 20%
    }

    //receive_coin_from_pet, pet address only
    function receive_coin_from_pet(uint32 _summoner, uint32 _coin) external {
        require(msg.sender == murasaki_pet_address);
        coin[_summoner] += _coin;
    }
    function receive_material_from_pet(uint32 _summoner, uint32 _material) external {
        require(msg.sender == murasaki_pet_address);
        material[_summoner] += _material;
    }

    //crafting
    //function start_crafting(uint32 _summoner, uint8 _item_type, uint32 _coin, uint32 _material) public {
    function start_crafting(uint32 _summoner, uint8 _item_type) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        //require(coin[_summoner] >= _coin && material[_summoner] >= _material);
        require(calc_satiety(_summoner) >= 20 && calc_happy(_summoner) >= 20);
        require(level[_summoner] >= 3);
        uint32 _now = uint32(block.timestamp);

        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        uint32[3] memory _dc_table = mc.get_item_dc(_item_type);
        //uint32 _dc = _dc_table[0];
        uint32 _coin = _dc_table[1];
        uint32 _material = _dc_table[2];
        require(coin[_summoner] >= _coin && material[_summoner] >= _material);

        coin[_summoner] -= _coin;
        material[_summoner] -= _material;
        crafting_item_type[_summoner] = _item_type;
        crafting_status[_summoner] = 1;
        crafting_start_time[_summoner] = _now;
    }
    function stop_crafting(uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(crafting_status[_summoner] == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta_sec = (_now - crafting_start_time[_summoner]);
        uint8 _item_type = crafting_item_type[_summoner];
        total_crafting_sec[_summoner] += _delta_sec;
        last_total_crafting_sec[_summoner] += _delta_sec;
        last_grooming_time_plus_working_time[_summoner] += _delta_sec;
        bool _crafted = crafting_check(_summoner);
        if (_crafted) {
            if (_item_type == 49) {
                Murasaki_Pet mp = Murasaki_Pet(murasaki_pet_address);
                mp.craft(_summoner, msg.sender);
            } else{
                Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
                mc.craft(_item_type, _summoner, msg.sender);
            }
        }
        crafting_status[_summoner] = 0; //dont move
    }
    //function crafting_check(uint _item_base_id, _item_id, uint _delta_time) public pure returns (bool) {
    function crafting_check(uint32 _summoner) public view returns (bool) {
        if (calc_crafting(_summoner) <= 0) {
            return true;
        } else {
            return false;
        }
    }
    function calc_crafting(uint32 _summoner) public view returns (uint32) {
        require(crafting_status[_summoner] == 1);
        uint32 _now = uint32(block.timestamp);
        uint8 _item_type = crafting_item_type[_summoner];
        uint32 _delta_time = (_now - crafting_start_time[_summoner]) * speed;
        //dc
        Murasaki_Craft mc = Murasaki_Craft(murasaki_craft_address);
        uint32[3] memory _dc_table = mc.get_item_dc(_item_type);
        uint32 _dc = _dc_table[0];
        _dc -= (_dc * intelligence[_summoner]/100) / 100;   //status modification
        _dc -= (_dc * level[_summoner]) / 100;  //level modification
        uint32 _delta;
        if (_delta_time >= _dc) {
            _delta = 0;
        }else {
            _delta = _dc - _delta_time;
        }
        return _delta;
    }
    
    //interact with Murasaki_Craf
    //set item nft to summoner, insert item nft number into item array of summoner at position [item_id]
    //only from murasaki_craft contract
    function set_item_to_summoner(uint32 _item, uint32 _item_type, uint32 _summoner) public {
        require(msg.sender == murasaki_craft_address || msg.sender == murasaki_pet_address);
        items[_summoner][_item_type] = _item;
    }

    //level-up
    function level_up(uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _summoner));
        require(mining_status[_summoner] == 0 && farming_status[_summoner] == 0 && crafting_status[_summoner] == 0);
        require(exp[_summoner] >= next_exp_required[_summoner]);
        uint32 _now = uint32(block.timestamp);
        //status addition
        uint32 _base_sec = _now - last_level_up_time[_summoner];
        uint32 _resting_sec = _base_sec - last_total_mining_sec[_summoner] - last_total_farming_sec[_summoner] - last_total_crafting_sec[_summoner];
        uint32 _percent_mining = 200 * (last_total_mining_sec[_summoner] + _resting_sec/4) / _base_sec;
        uint32 _percent_farming = 200 * (last_total_farming_sec[_summoner] + _resting_sec/4) / _base_sec;
        uint32 _percent_crafting = 200 * (last_total_crafting_sec[_summoner] + _resting_sec/4) / _base_sec;
        uint32 _percent_luck = 200 * (_resting_sec/4) / _base_sec;
        strength[_summoner] += _percent_mining;
        dexterity[_summoner] += _percent_farming;
        intelligence[_summoner] += _percent_crafting;
        luck[_summoner] += _percent_luck;
        last_total_mining_sec[_summoner] = 0;
        last_total_farming_sec[_summoner] = 0;
        last_total_crafting_sec[_summoner] = 0;
        /*
        uint32 _base_sec = _now - last_level_up_time[_summoner];
        uint32 _percent_mining = 100 * last_total_mining_sec[_summoner] / _base_sec;
        uint32 _percent_farming = 100 * last_total_farming_sec[_summoner] / _base_sec;
        uint32 _percent_crafting = 100 * last_total_crafting_sec[_summoner] / _base_sec;
        uint32 _percent_resting = 100 - _percent_mining - _percent_farming - _percent_crafting;
        strength[_summoner] += _percent_mining;
        dexterity[_summoner] += _percent_farming;
        intelligence[_summoner] += _percent_crafting;
        vitality[_summoner] += _percent_resting;
        last_total_mining_sec[_summoner] = 0;
        last_total_farming_sec[_summoner] = 0;
        last_total_crafting_sec[_summoner] = 0;
        */
        //reset feeding, grooming, exp
        last_feeding_time[_summoner] = _now;
        last_grooming_time[_summoner] = _now;
        exp[_summoner] = 0;
        //level-up
        last_level_up_time[_summoner] = _now;
        level[_summoner] += 1;
        //update next_exp_required
        if (level[_summoner] == 2) {
            //next_exp_required[_summoner] = 3000;
            next_exp_required[_summoner] = 300;
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

    function toString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
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

    function tokenURI (uint32 _summoner) public view returns (string memory) {
        string[9] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = string(abi.encodePacked("type", " ", toString(ctype[_summoner])));
        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = string(abi.encodePacked("birth time", " ", toString(birth_time[_summoner])));
        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = string(abi.encodePacked("level", " ", toString(level[_summoner])));
        parts[6] = '</text><text x="10" y="80" class="base">';

        parts[7] = string(abi.encodePacked("status", " ", toString(strength[_summoner]), " ", toString(dexterity[_summoner]), " ", toString(intelligence[_summoner]), " ", toString(luck[_summoner])));
        parts[8] = '</text></svg>';

        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8]));
        
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "summoner #', toString(_summoner), '", "description": "Murasaki-san", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;        
    }

}



//---------------------------------------------------------------------------------------------------------------------
//Murasaki Craft

contract Murasaki_Craft is ERC721, Ownable{

    string constant public name = "Murasaki Craft";
    string constant public symbol = "MC";

    uint32 public next_item = 1;
    address public murasaki_main_address;

    struct item {
        uint8 item_type;
        uint32 crafted_time;
        uint32 crafted_summoner;
        uint32 owner_summoner;
        address crafted_wallet;
    }

    mapping(uint32 => item) public items;

    //item dc
    uint32[64] public dc_table = [
        //0:dummy
        0,
        //1-16: mining item
        100000,
        300000,
        600000,
        1000000,
        1500000,
        2100000,
        2800000,
        3600000,
        4500000,
        5500000,
        6600000,
        7800000,
        9100000,
        10500000,
        12000000,
        13600000,
        //17-32: farming item
        100000,
        300000,
        600000,
        1000000,
        1500000,
        2100000,
        2800000,
        3600000,
        4500000,
        5500000,
        6600000,
        7800000,
        9100000,
        10500000,
        12000000,
        13600000,
        //33-48: crafting item
        100000,
        300000,
        600000,
        1000000,
        1500000,
        2100000,
        2800000,
        3600000,
        4500000,
        5500000,
        6600000,
        7800000,
        9100000,
        10500000,
        12000000,
        13600000,
        //49: pet
        100000,
        //50: ,musicbox
        300000,
        //50-63: unreserved
        1000,
        1000,
        1000,
        1000,
        1000,
        1000,
        1000,
        1000,
        1000,
        1000,
        1000,
        1000,
        1000
    ];
    //item coin
    uint32[64] public coin_table = [
        //0:dummy
        0,
        //1-16: mining item
        1000,
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
        //17-32: farming item
        1000,
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
        //33-48: crafting item
        1000,
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
        //49: pet
        1000,
        //50: muscibox
        3000,
        //50-63: unreserved
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100,
        100
    ];
    //item material
    uint32[64] public material_table = [
        //0:dummy
        0,
        //1-16: mining item
        100,
        300,
        600,
        1000,
        1500,
        2100,
        2800,
        3600,
        4500,
        5500,
        6600,
        7800,
        9100,
        10500,
        12000,
        13600,
        //17-32: farming item
        100,
        300,
        600,
        1000,
        1500,
        2100,
        2800,
        3600,
        4500,
        5500,
        6600,
        7800,
        9100,
        10500,
        12000,
        13600,
        //33-48: crafting item
        100,
        300,
        600,
        1000,
        1500,
        2100,
        2800,
        3600,
        4500,
        5500,
        6600,
        7800,
        9100,
        10500,
        12000,
        13600,
        //49: pet
        100,
        //50: musicbox
        300,
        //50-63: unreserved
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10,
        10
    ];
    
    //admin
    function set_murasaki_main_address(address _address) public onlyOwner{
        murasaki_main_address = _address;
    }

    //get item dc
    function get_item_dc(uint8 _item_type) public view returns (uint32[3] memory) {
        //TODO: library of dc required
        //return _item_base_id * _item_id * 0 + 1000;
        //uint32 _dc = _item_base_id * 0 + dc_table[_item_id];
        //uint32 _dc = dc_table[(_item_type % 16)];
        //uint32[3] memory _dc = dc_table[_item_type];
        uint32 _dc = dc_table[_item_type];
        uint32 _coin = coin_table[_item_type];
        uint32 _material = material_table[_item_type];
        return [_dc, _coin, _material];
    }

    //craft, only from mm
    function craft(uint8 _item_type, uint32 _summoner, address _wallet) public {
        require(msg.sender == murasaki_main_address);
        uint32 _now = uint32(block.timestamp);
        items[next_item] = item(_item_type, _now, _summoner, _summoner, _wallet);
        _safeMint(_wallet, next_item);
        //set item to summoner
        set_item_to_summoner_from_mm(next_item, _summoner);
        next_item++;
    }

    //set_item_to_summoner, Murasaki_Main only
    function set_item_to_summoner_from_mm(uint32 _item, uint32 _summoner) public {
        require(msg.sender == murasaki_main_address);
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        items[_item].owner_summoner = _summoner;
        uint8 _item_type = items[_item].item_type;
        mm.set_item_to_summoner(_item, _item_type, _summoner);
    }

    //set_item_to_summoner, independent function
    function set_item_to_summoner(uint32 _item, uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _item));
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        require(msg.sender == mm.ownerOf(_summoner));
        items[_item].owner_summoner = _summoner;
        uint8 _item_type = items[_item].item_type;
        mm.set_item_to_summoner(_item, _item_type, _summoner);
    }
        
}



//---------------------------------------------------------------------------------------------------------------------
//Murasaki Pet

contract Murasaki_Pet is ERC721, Ownable{

    string constant public name = "Murasaki Pet";
    string constant public symbol = "MP";

    uint32 public next_pet = 1;
    uint32 public speed = 1;
    address public murasaki_main_address;

    struct pet {
        uint32 crafted_time;
        uint32 crafted_summoner;
        uint32 owner_summoner;
        address crafted_wallet;
    }

    mapping(uint32 => pet) public pets;
    mapping(uint32 => uint8) public mining_status;
    mapping(uint32 => uint32) public mining_start_time;
    mapping(uint32 => uint32) public coin;
    mapping(uint32 => uint8) public farming_status;
    mapping(uint32 => uint32) public farming_start_time;
    mapping(uint32 => uint32) public material;

    //admin
    function set_murasaki_main_address (address _address) public onlyOwner{
        murasaki_main_address = _address;
    }
    function set_speed (uint32 _speed) public onlyOwner{
        speed = _speed;
    }

    //get_status
    function get_status(uint32 _pet) public view returns (uint32[4] memory){
        uint32[4] memory res;
        res[0] = mining_status[_pet];
        res[1] = mining_start_time[_pet];
        res[2] = farming_status[_pet];
        res[3] = farming_start_time[_pet];
        return res;
    }

    //craft pet
    function craft(uint32 _summoner, address _wallet) public {
        require(msg.sender == murasaki_main_address);
        pets[next_pet] = pet(uint32(block.timestamp), _summoner, _summoner, _wallet);
        _safeMint(_wallet, next_pet);
        set_pet_to_summoner_from_mm(next_pet, _summoner);
        next_pet++;
    }

    //set_pet_to_summoner, mm only
    function set_pet_to_summoner_from_mm(uint32 _pet, uint32 _summoner) public {
        require(msg.sender == murasaki_main_address);
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        pets[_pet].owner_summoner = _summoner;
        uint8 _item_type = 49;  //49-63: special item_type
        mm.set_item_to_summoner(_pet, _item_type, _summoner);
    }

    //set_pet_to_summoner
    function set_pet_to_summoner(uint32 _pet, uint32 _summoner) public {
        require(_isApprovedOrOwner(msg.sender, _pet));
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        require(msg.sender == mm.ownerOf(_summoner));
        pets[_pet].owner_summoner = _summoner;
        uint8 _item_type = 49;  //49-63: special item_type
        mm.set_item_to_summoner(_pet, _item_type, _summoner);
    }

    //send coin, material to owner_summoner
    function send_coin_to_owner_summoner(uint32 _pet) public {
        require(_isApprovedOrOwner(msg.sender, _pet));
        require(coin[_pet] > 0);
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        uint32 _owner_summoner = pets[_pet].owner_summoner;
        require(msg.sender == mm.ownerOf(_owner_summoner));
        mm.receive_coin_from_pet(_owner_summoner, coin[_pet]);
        coin[_pet] = 0;
    }
    function send_material_to_owner_summoner(uint32 _pet) public {
        require(_isApprovedOrOwner(msg.sender, _pet));
        require(material[_pet] > 0);
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        uint32 _owner_summoner = pets[_pet].owner_summoner;
        require(msg.sender == mm.ownerOf(_owner_summoner));
        mm.receive_material_from_pet(_owner_summoner, material[_pet]);
        material[_pet] = 0;
    }

    //get_owner_summoner_status
    function get_owner_summoner_status(uint32 _pet) public view returns (uint32[20] memory) {
        Murasaki_Main mm = Murasaki_Main(murasaki_main_address);
        uint32 _owner_summoner = pets[_pet].owner_summoner;
        uint32[20] memory _status = mm.get_status(_owner_summoner);
        return _status;
    }

    //mining
    function start_mining(uint32 _pet) public {
        require(_isApprovedOrOwner(msg.sender, _pet));
        require(mining_status[_pet] == 0 && farming_status[_pet] == 0);
        uint32 _now = uint32(block.timestamp);
        mining_start_time[_pet] = _now;
        mining_status[_pet] = 1;
    }
    function stop_mining(uint32 _pet) public {
        require(_isApprovedOrOwner(msg.sender, _pet));
        require(mining_status[_pet] == 1);
        uint32 _delta = calc_coin(_pet);
        coin[_pet] += _delta;
        send_coin_to_owner_summoner(_pet);
        mining_status[_pet] = 0;
    }
    function calc_coin(uint32 _pet) public view returns (uint32) {
        require(mining_status[_pet] == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = (_now - mining_start_time[_pet]) * speed / 100;
        uint32[20] memory _status = get_owner_summoner_status(_pet);
        uint32 _str = _status[1];
        uint32 _level = _status[18];
        _delta += (_delta * _str) / 100;    //status modification
        _delta += (_delta * _level) / 100;    //level modification
        _delta = _delta / 4;    //pet modification
        return _delta;
    }

    //farming
    function start_farming(uint32 _pet) public {
        require(_isApprovedOrOwner(msg.sender, _pet));
        require(mining_status[_pet] == 0 && farming_status[_pet] == 0);
        uint32 _now = uint32(block.timestamp);
        farming_start_time[_pet] = _now;
        farming_status[_pet] = 1;
    }
    function stop_farming(uint32 _pet) public {
        require(_isApprovedOrOwner(msg.sender, _pet));
        require(farming_status[_pet] == 1);
        uint32 _delta = calc_material(_pet);
        material[_pet] += _delta;
        send_material_to_owner_summoner(_pet);
        farming_status[_pet] = 0;
    }
    function calc_material(uint32 _pet) public view returns (uint32) {
        require(farming_status[_pet] == 1);
        uint32 _now = uint32(block.timestamp);
        uint32 _delta = (_now - farming_start_time[_pet]) * speed / 1000;
        uint32[20] memory _status = get_owner_summoner_status(_pet);
        uint32 _dex = _status[2];
        uint32 _level = _status[18];
        _delta += (_delta * _dex) / 100;    //status modification
        _delta += (_delta * _level) / 100;    //level modification
        _delta = _delta / 4;    //pet modification
        return _delta;
    }

}


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


contract Codex {
    string constant public index = "Base";
    string constant public class = "Random";
    
    function d100(uint _summoner) external view returns (uint) {
        return dn(_summoner, 100);
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
                    blockhash(block.number - 1),
                    _summoner,
                    msg.sender
                )
            )
        );
    }
}



//---------------------------------------------------------------------------------------------------------------------
//Idea

/***
    
    ok pet所持の有無の判定とpetとの相互作用
        *pet複数所持時のルール整備
            summoner側にuint32のpet変数をつくり, craft時に格納するか
                UI側でsummoner IDからpetを参照しやすいし、
                petがcoinやmaterial送るときは、pet関数に格納されていることをrequireさせられる
                owner_summoner移行時はmain側の変数も書き換えないと行けないのでgasがかかるかも
            1つのsummonerに1つまで紐付け可能にする
            summonerに紐付けられているpetしかcoin/materialをearnできない
        pet譲渡時の挙動
            
        別コントラ？同日コントラ内？
        mainへの書き込みはcoinとmaterial
            msg.senderにpetコントラを許可する, from petは無条件で許可する
            sendの許可はpetコントラ側で行う
        mainからの読み込みはsummonerのステータスとレベル
            summonerの状態によらず独立して行う？
            summonerかpetのどちらかしかmining, farmingできない？ 
                この場合は, summonerもpetのコントラを読みに行かないといけない
    ok 所持itemによるmining, farming, craftingの補正
        itemもフラグ性にするか
            boolが100個の配列を用意し, craftするたびに該当フラグを立ててゆく
            あるいはuint32で, craftしたitem_idを該当箇所に代入してゆく
            craft完了時にitem_idを取得して代入する
            item譲渡時がとても面倒そうだが。
            ＊案＊
                itemごとにnumを決める
                summonerはすべてのnumを予約したuint32配列を有する
                craftするとsummonerのitem配列の[num]にnftのidを格納する
                UI側はsummonerのitem配列を参照してitem所持の有無を把握出来るのでかなり楽
                item譲渡時はowner_summonerのitem配列[num]を消す
                owner walletは所持summonerのitem配列[num]へセット可能
                譲渡には送料としてcoinを要求する
                working時にitem配列を集計して個数を数え補正する
                mining, farming, crafting, その他（petなど）の4種類のitem配列に分けるか
        craftコントラから、summonerがownerのitemをどうやって検索,カウントするか
        craftコントラに, craft時にmappingでsummonerごとの所持数をカウントする
        transfer時は所持カウントも動かさないといけない
    ok item一覧とdifficultyの設定
    ok itemのdifficultyを加味したcraftingの実装
    ok Level-upによるstatus補正の実装
    ok grooming時, resting timeによる+exp補正の実装
    ok coin, materialの送金機能の実装, ペナルティをどうするか
    ok statusによるmining, farming, craftingの補正
    ok working開始時のsatiety, happy閾値を実装
    ok ワールドスピード係数の実装

***/


