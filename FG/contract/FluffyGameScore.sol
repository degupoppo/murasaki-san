
// 0xCa8D7BA7DBE2F58768BeaE677F65F1Afb6d15962
// [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"position","type":"uint256"},{"indexed":false,"internalType":"address","name":"removedWallet","type":"address"},{"indexed":false,"internalType":"uint256","name":"score","type":"uint256"}],"name":"RankingRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"wallet","type":"address"},{"indexed":false,"internalType":"uint256","name":"score","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"playtime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"position","type":"uint256"}],"name":"RankingUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"MIN_DONATION_AMMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_val","type":"uint256"}],"name":"_set_MIN_DONATION_AMMOUNT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_BufferVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_SignatureVerifier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllRankings","outputs":[{"components":[{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"uint256","name":"playtime","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"ballcount","type":"uint256"},{"internalType":"string","name":"version","type":"string"}],"internalType":"structFluffyGameRanking.RankingRecord[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getPlayerBestRecord","outputs":[{"components":[{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"uint256","name":"playtime","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"ballcount","type":"uint256"},{"internalType":"string","name":"version","type":"string"}],"internalType":"structFluffyGameRanking.RankingRecord","name":"","type":"tuple"},{"internalType":"uint256","name":"position","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRanking","outputs":[{"components":[{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"uint256","name":"playtime","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"ballcount","type":"uint256"},{"internalType":"string","name":"version","type":"string"}],"internalType":"structFluffyGameRanking.RankingRecord[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"position","type":"uint256"}],"name":"getRankingAt","outputs":[{"components":[{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"uint256","name":"playtime","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"ballcount","type":"uint256"},{"internalType":"string","name":"version","type":"string"}],"internalType":"structFluffyGameRanking.RankingRecord","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"position","type":"uint256"}],"name":"removeRankingAtPosition","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_score","type":"uint256"},{"internalType":"uint256","name":"_playtime","type":"uint256"},{"internalType":"uint256","name":"_ballcount","type":"uint256"},{"internalType":"string","name":"_version","type":"string"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"setRanking","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"sum_of_donation","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}]

// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol";

interface SignatureVerifier {
    function verifySignature(uint _score, address _wallet, bytes memory signature) external view returns (bool);
}

// setup:
//  set address_SignatureVerifier
//  set address_BufferVault
contract FluffyGameRanking is Ownable, Pausable, ReentrancyGuard {

    // pausable
    function pause() external onlyOwner {_pause();}
    function unpause() external onlyOwner {_unpause();}

    // address
    address private address_SignatureVerifier;
    address private address_BufferVault;
    function _set_address_SignatureVerifier(address _address) external onlyOwner {address_SignatureVerifier = _address;}
    function _set_address_BufferVault(address _address) external onlyOwner {address_BufferVault = _address;}
    
    // donation
    uint256 public MIN_DONATION_AMMOUNT = 1 * 10**18;   // 1 $ASTR
    function _set_MIN_DONATION_AMMOUNT (uint _val) external onlyOwner { MIN_DONATION_AMMOUNT = _val;}
    uint public sum_of_donation = 0;

    // record struct
    struct RankingRecord {
        uint256 score;
        uint256 playtime;
        uint256 timestamp;
        address wallet;
        uint256 ballcount;
        string version;
    }

    RankingRecord[] private rankings;
    uint256 private constant MAX_RANKING_SIZE = 15;
    uint256 public nonce = 0;

    event RankingUpdated(
        address indexed wallet,
        uint256 score,
        uint256 playtime,
        uint256 position
    );

    event RankingRemoved(
        uint256 position,
        address removedWallet,
        uint256 score
    );

    // init ranking with 0 records
    constructor() {
        for (uint i = 0; i < MAX_RANKING_SIZE; i++) {
            rankings.push(RankingRecord(0, 0, 0, address(0), 0, ""));
        }
    }

    // set record
    // requre signature verification
    // requre small donation to prevent spam tx
    function setRanking (
        uint _score, 
        uint _playtime, 
        uint _ballcount,
        string memory _version,
        bytes memory _signature
    ) external payable nonReentrant whenNotPaused  {
    
        // check signature
        SignatureVerifier sv = SignatureVerifier(address_SignatureVerifier);
        require(sv.verifySignature(_score, msg.sender, _signature));
        
        // requre donations
        require(msg.value >= MIN_DONATION_AMMOUNT);
        
        // try to update ranking
        _updateRanking(_score, _playtime, msg.sender, _ballcount, _version);
        
        // transfer donation
        sum_of_donation += address(this).balance;
        payable(address_BufferVault).transfer(address(this).balance);
    }

    // internal, update ranking
    function _updateRanking(
        uint256 _score, 
        uint256 _playtime, 
        address _wallet,
        uint256 _ballcount,
        string memory _version
    ) internal {
        
        uint256 position = findPosition(_score, _playtime);
        
        if (position >= MAX_RANKING_SIZE) {
            return;
        }

        // slide the existing records
        for (uint256 i = MAX_RANKING_SIZE - 1; i > position; i--) {
            rankings[i] = rankings[i - 1];
        }

        // insert new record
        rankings[position] = RankingRecord({
            score: _score,
            playtime: _playtime,
            timestamp: block.timestamp,
            wallet: _wallet,
            ballcount: _ballcount,
            version: _version
        });
        
        // increment nonce
        nonce ++;
        
        // event
        emit RankingUpdated(_wallet, _score, _playtime, position);
    }

    // get top 10 ranking records
    function getRanking() external view whenNotPaused returns (RankingRecord[] memory) {
        RankingRecord[] memory top10 = new RankingRecord[](10);
        for (uint256 i = 0; i < 10; i++) {
            top10[i] = rankings[i];
        }
        return top10;
    }

    // find insert position
    function findPosition(uint256 _score, uint256 _playtime) private view returns (uint256) {
        for (uint256 i = 0; i < MAX_RANKING_SIZE; i++) {
            if (_score > rankings[i].score) {
                return i;
            }
            if (_score == rankings[i].score) {
                if (_playtime < rankings[i].playtime) {
                    return i;
                }
                if (_playtime == rankings[i].playtime) {
                    continue;
                }
            }
        }
        return MAX_RANKING_SIZE;
    }

    // optional functions 

    function getAllRankings() external view whenNotPaused returns (RankingRecord[] memory) {
        return rankings;
    }

    function getRankingAt(uint256 position) external view whenNotPaused returns (RankingRecord memory) {
        require(position < MAX_RANKING_SIZE, "Position out of range");
        return rankings[position];
    }

    function getPlayerBestRecord(address player) external view whenNotPaused returns (RankingRecord memory, uint256 position) {
        uint256 bestPosition = MAX_RANKING_SIZE;
        RankingRecord memory bestRecord = RankingRecord(0, 0, 0, address(0), 0, "");
        for (uint256 i = 0; i < MAX_RANKING_SIZE; i++) {
            if (rankings[i].wallet == player) {
                bestPosition = i;
                bestRecord = rankings[i];
                break;
            }
        }        
        return (bestRecord, bestPosition);
    }
    
    // admin

    // remove a specific ranking entry
    function removeRankingAtPosition(uint256 position) external onlyOwner {
        // Validate position
        require(position < MAX_RANKING_SIZE, "Position out of range");

        // Emit event before removal to log the details
        emit RankingRemoved(
            position, 
            rankings[position].wallet, 
            rankings[position].score
        );

        // Shift records up
        for (uint256 i = position; i < MAX_RANKING_SIZE - 1; i++) {
            rankings[i] = rankings[i + 1];
        }

        // Reset the last entry to 0 values
        rankings[MAX_RANKING_SIZE - 1] = RankingRecord(
            0, 0, 0, address(0), 0, ""
        );

        // Increment nonce to indicate a change in ranking
        nonce++;
    }
}


