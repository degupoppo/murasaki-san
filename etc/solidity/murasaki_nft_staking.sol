
/*

    システム深慮
        基本設計
            
        mcコントラを指定してステーキングコントラをデプロイ
            item_typeをrequireして、特定のitem_typeのみステーキング可能とする
        記録項目
            ステーキングした時間
            ステーキングアイテムのステータス
        リワード設計
            ステーキングアイテムのステータスに応じてリワードを増やす
            時間に応じて増やす？
            ASTRと、何かしらアイテム
        ステーキングアイテムの設計
            INT系アイテムとして実装
            大体1ヶ月程度でクラフト可能な位置に
            クラフト時のステータスで固定される？
                あるいは、3日かけてステータスを更新する（ぬいちゃんを修繕する）
                または、自動で本体ステータスを受け継ぐ
                    ステーキング開始時のステータスで旅に出発する
        ブースト機構
            Tiny Heartをburnして能力を底上げする
                バランスが難しい
                1-5個など、1回の上限を限定するか
                もしくは、指数関数で積めば積むほど効率を落とし、max値へ収束させるか
            Tiny Heartを能動的に得るメカニズムが必要か
                Luckが少し上がるのはあくまでオマケ機能

    NFT Stakingのメカニズムの深慮
        自分の分身であるmini murasaki-sanをぬいぐるみとしてクラフトする
            このmini murasaki-sanを旅に出す（NFT staking）
            mini murasaki-sanは旅に出したときの本体のステータスを引き継ぐ
                ではなくて、クラフト完了時点のステータスに固定される
                    いつクラフトするかが悩ましくなる
            ステータスによって効率が変わる
                STR, DEX, INTの差別化をどうするか
        報酬をどう設計するか
            簡単なのは、dapp stakingの報酬の50%を全体に配る
                購入価格の50%もジャックポットに入れてしまう
            独自トークンを配る
                独自トークンのユースケース設計が大変なのでNG
            ohana/kusaを発生させる
                自分の分身を出稼ぎに出してるイメージ
                これだけではインセンティブが弱いか
            ハートやその他のアイテムなどを見つけにゆかせる
                staking時間に応じて見つけるものが違う
                gas代で成功の可否を判断できてしまうので、失敗しても何かしらはcraftさせる
                    むしろ必ず何かは持ち帰るようにする、失敗はない。
                    100 ohanaのmini bankとかでもよいので。
                最低時間（3日程度）を決めておき、放置すれば放置するだけレアアイテムの確率が上がる
                旅支度に持たせるcoin/materialによっても確率を変えるか
                この方法でしか手に入らないアイテムを設計することで、ユースケースになるか
        mini murasaki-sanのコスト設計
            いつクラフト可能とするか
                あまりに後半だとモチベが持たない
                あまりに初期だとバランスが難しい
                １ヶ月程度か？
                jacpot内のお金を表示させてモチベをもたせる
        コントラの実装
            お金が絡むのでセキュリティは慎重に
            良いお手本コントラを探しておく
            NFTをtransferして手形（NFT）を発行する
            時間経過でコントラが保持しているお金をNFTに割り振る
            最低ステーキング時間を設定する
            withdraw時に手形NFTを要求する
            withdraw時に報酬をtransferする

*/


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//https://coinsbench.com/nft-staking-swith-solidity-d99f3281c5a8
//https://github.com/Drakenwolf/Nft_Staking_System/blob/main/contracts/StakeSystem.sol

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "hardhat/console.sol";

interface IRewardToken is IERC20 {
    function mint(address to, uint256 amount) external;
}

contract StakingSystem is Ownable, ERC721Holder {
    IRewardToken public rewardsToken;
    IERC721 public nft;

    uint256 public stakedTotal;
    uint256 public stakingStartTime;
    uint256 constant stakingTime = 180 seconds;
    uint256 constant token = 10e18;
    
    struct Staker {
        uint256[] tokenIds;
        mapping(uint256 => uint256) tokenStakingCoolDown;
        uint256 balance;
        uint256 rewardsReleased;
    }

    constructor(IERC721 _nft, IRewardToken _rewardsToken) {
        nft = _nft;
        rewardsToken = _rewardsToken;
    }

    /// @notice mapping of a staker to its wallet
    mapping(address => Staker) public stakers;

    /// @notice Mapping from token ID to owner address

    mapping(uint256 => address) public tokenOwner;
    bool public tokensClaimable;
    bool initialised;

    /// @notice event emitted when a user has staked a nft

    event Staked(address owner, uint256 amount);

    /// @notice event emitted when a user has unstaked a nft
    event Unstaked(address owner, uint256 amount);

    /// @notice event emitted when a user claims reward
    event RewardPaid(address indexed user, uint256 reward);

    /// @notice Allows reward tokens to be claimed
    event ClaimableStatusUpdated(bool status);

    /// @notice Emergency unstake tokens without rewards
    event EmergencyUnstake(address indexed user, uint256 tokenId);

    function initStaking() public onlyOwner {
        //needs access control
        require(!initialised, "Already initialised");
        stakingStartTime = block.timestamp;
        initialised = true;
    }

    function setTokensClaimable(bool _enabled) public onlyOwner {
        //needs access control
        tokensClaimable = _enabled;
        emit ClaimableStatusUpdated(_enabled);
    }

    function getStakedTokens(address _user)
        public
        view
        returns (uint256[] memory tokenIds)
    {
        return stakers[_user].tokenIds;
    }

    function stake(uint256 tokenId) public {
        _stake(msg.sender, tokenId);
    }

    function stakeBatch(uint256[] memory tokenIds) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _stake(msg.sender, tokenIds[i]);
        }
    }

    function _stake(address _user, uint256 _tokenId) internal {
        require(initialised, "Staking System: the staking has not started");
        require(
            nft.ownerOf(_tokenId) == _user,
            "user must be the owner of the token"
        );
        Staker storage staker = stakers[_user];

        staker.tokenIds.push(_tokenId);
        staker.tokenStakingCoolDown[_tokenId] = block.timestamp;
        tokenOwner[_tokenId] = _user;
        nft.approve(address(this), _tokenId);
        nft.safeTransferFrom(_user, address(this), _tokenId);

        emit Staked(_user, _tokenId);
        stakedTotal++;
    }

    function unstake(uint256 _tokenId) public {
        claimReward(msg.sender);
        _unstake(msg.sender, _tokenId);
    }

    function unstakeBatch(uint256[] memory tokenIds) public {
        claimReward(msg.sender);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenOwner[tokenIds[i]] == msg.sender) {
                _unstake(msg.sender, tokenIds[i]);
            }
        }
    }

    // Unstake without caring about rewards. EMERGENCY ONLY.
    function emergencyUnstake(uint256 _tokenId) public {
        require(
            tokenOwner[_tokenId] == msg.sender,
            "nft._unstake: Sender must have staked tokenID"
        );
        _unstake(msg.sender, _tokenId);
        emit EmergencyUnstake(msg.sender, _tokenId);
    }

    function _unstake(address _user, uint256 _tokenId) internal {
        require(
            tokenOwner[_tokenId] == _user,
            "Nft Staking System: user must be the owner of the staked nft"
        );
        Staker storage staker = stakers[_user];

        uint256 lastIndex = staker.tokenIds.length - 1;
        uint256 lastIndexKey = staker.tokenIds[lastIndex];
        if (staker.tokenIds.length > 0) {
            staker.tokenIds.pop();
        }
        staker.tokenStakingCoolDown[_tokenId] = 0;
        if (staker.balance == 0) {
            delete stakers[_user];
        }
        delete tokenOwner[_tokenId];

        nft.safeTransferFrom(address(this), _user, _tokenId);

        emit Unstaked(_user, _tokenId);
        stakedTotal--;
    }

    function updateReward(address _user) public {
        
        Staker storage staker = stakers[_user];
        uint256[] storage ids = staker.tokenIds;
        for (uint256 i = 0; i < ids.length; i++) {
            if (
                staker.tokenStakingCoolDown[ids[i]] <
                block.timestamp + stakingTime &&
                staker.tokenStakingCoolDown[ids[i]] > 0
            ) {
            
                uint256 stakedDays = ((block.timestamp - uint(staker.tokenStakingCoolDown[ids[i]]))) / stakingTime;
                uint256 partialTime = ((block.timestamp - uint(staker.tokenStakingCoolDown[ids[i]]))) % stakingTime;
                
                staker.balance +=  token * stakedDays;

                staker.tokenStakingCoolDown[ids[i]] = block.timestamp + partialTime;

                console.logUint(staker.tokenStakingCoolDown[ids[i]]);
                console.logUint(staker.balance);
            }
        }
    }

    function claimReward(address _user) public {
        require(tokensClaimable == true, "Tokens cannnot be claimed yet");
        require(stakers[_user].balance > 0 , "0 rewards yet");


        stakers[_user].rewardsReleased += stakers[_user].balance;
        stakers[_user].balance = 0;
        rewardsToken.mint(_user, stakers[_user].balance);

        emit RewardPaid(_user, stakers[_user].balance);
    }
}
