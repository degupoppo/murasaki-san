
/*

// js
// secretでmessageを署名しsignatureを生成する, ここまでがローカルで行う処理
// secretから公開鍵（account）を生成する, これはコントラクト側に保持しておく
// signatureとmessageから公開鍵を生成し, 正しい公開鍵と突き合わせる

// 渡すメッセージ
// msg.senderをsolidity内で参照すると全て小文字として取得される
// よって、js側でmessageを用意するときも、walletアドレスはすべて小文字としてmessageを用意する。
// 当然、大文字と小文字の文字列では生成されるハッシュ値が異なる
//message = "1000x2F7448B62134e52C2f46454d0089Ae21B5248805"
//message = "100" + "0x2F7448B62134e52C2f46454d0089Ae21B5248805";
//message = "100" + "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"; // アドレス形式
//message = "100" + "0x5b38da6a701c568545dcfcb03fcb875f56beddc4"; // 小文字の文字列形式
//message = "1000x2f7448b62134e52c2f46454d0089ae21b5248805";
_solt = "0";
message = "100" + wallet.toLowerCase() + _solt; // 接続ウォレットアドレスの小文字の文字列形式

// メッセージをハッシュ化
//messageHash = "0xc7101bd4400d3a2b9848000035cdce0d73a247f567c10a17a5b2268538c4880d"
messageHash = web3.utils.soliditySha3(message)

// 秘密鍵, 難読化してローカルに保持
secret = "3599735523670934983049587378925789357896096874568973464783857473";

// 公開鍵, コントラ内に保持
//address = "0x87b4574eF24903b6fa42E108Ce362DD92Eeb56c6";
address = web3.eth.accounts.privateKeyToAccount(secret).address;

// メッセージハッシュと秘密鍵から署名を生成
//signature = "0x63b5a034a0c5f486ed897a7f16a6478bb8d5944d0cc076cb30f93e56d8cb7bda74ed8a84f713f4dacbf0aad46d600221386ebb76b3efc42820b9d228582278e71b";
signature = web3.eth.accounts.sign(messageHash, secret).signature;

// 以下、コントラクトの処理をjsで確認。

// メッセージハッシュと署名から公開鍵を復元
signer = web3.eth.accounts.recover(messageHash, signature);

// 公開鍵の一致を確認
console.log(address == signer, address, signer);



// signatureを得る関数
function getSignature(_score, _wallet, _solt) {
    let message = _score + wallet + _solt;
    let messageHash = web3.utils.soliditySha3(message);
    return web3.eth.accounts.sign(messageHash, "3599735523670934983049587378925789357896096874568973464783857473").signature;
}

*/


// 0x28f8460e8621dc2a5E8943D0DebA416cC7b10449
// [{"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/Base64.sol";

// refer nonce from ranking system
interface FluffyGameRanking {
    function nonce () external view returns (uint);
}

// setup:
//  set address_FluffyGameRanking

contract SignatureVerifier is Ownable, Pausable {

    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}

    // permittable
    mapping(address => bool) private permitted_address;
    function _add_permitted_address(address _address) external onlyOwner {permitted_address[_address] = true;}
    function _remove_permitted_address(address _address) external onlyOwner {permitted_address[_address] = false;}

    // publicKey
    address private constant PUBLIC_KEY = 0x87b4574eF24903b6fa42E108Ce362DD92Eeb56c6;

    // set address
    address private address_FluffyGameRanking;
    function _set_address_FluffyGameRanking(address _address) external onlyOwner {address_FluffyGameRanking = _address;}

    // ***TEST***
    /*
    function test (
        uint _score,
        address _wallet,
        uint _solt,
        bytes memory signature
    ) external view returns (
        string memory message,
        bytes32 messageHash,
        bytes32 ethSignedMessageHash,
        address recoverAddress,
        address public_key
    ) {
        string memory message = string(
            abi.encodePacked(
                _uint2str(_score),
                _addressToString(_wallet),
                _uint2str(_solt)
            )
        );
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        address recoveredAddress = _recoverSigner(ethSignedMessageHash, signature);
        address public_key = PUBLIC_KEY;
        return (message, messageHash, ethSignedMessageHash, recoveredAddress, public_key);
    }
    */

    // verify signature
    // generate message hash from score, msg.sender, nonce of ranking contract
    function verifySignature(
        uint _score,
        address _wallet,
        bytes memory signature
    ) external view whenNotPaused returns (bool) {
        
        // check sender
        require(msg.sender == address_FluffyGameRanking || permitted_address[msg.sender]);
        
        // prepare message from score, msg.sender, and solt, as in local
        string memory message = string(
            abi.encodePacked(
                _uint2str(_score),
                _addressToString(_wallet),
                _uint2str(_getSolt())
            )
        );
        
        // generate message hash
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        
        // convert to ETH hash
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        
        // recover public key from hash and signature
        address recoveredAddress = _recoverSigner(ethSignedMessageHash, signature);
        
        // verify public key
        return recoveredAddress == PUBLIC_KEY;
    }

    function _getSolt () internal view returns (uint) {
        return FluffyGameRanking(address_FluffyGameRanking).nonce();
    }

    function _recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) internal pure returns (address) {
        require(_signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        if (v < 27) {
            v += 27;
        }
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function _uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes memory data = abi.encodePacked(_addr);
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[2+i*2+1] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }
}

