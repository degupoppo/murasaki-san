
//===Header======================================================
/*

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

*/

//===ToDo========================================================


/*

//### 1st

   *アイテム順の吟味
        アイテムの種類分け
        STR/DEX/INT系で同種類アイテムをバラけさせる
    
   *スコアの整理
        戦略
            長くプレイしたことに対するリワード
                総合スコア
            使い込まれたwalletに対するリワード
                walletスコア
                よりwalletと接続している感の演出
            ステーキング量に対するリワード
                少しあざとい
                どかっと入れればいきなりmaxも可能になってしまう
                長くステーキングしないとmaxにならない機構を組み込む
                    feeding時に時間 x staking amountを加算させてゆくスコアを作る、など
        意味論
            スコアは一種類でわかりやすいほうが良い
                計算式は複雑でもよい
                何を表現しているのか伝わるほうが良い
                たくさん種類があるとよくわからない
            表現したいUXはなにか
                作品内での活動度の反映か
                walletとの接続感か
                より金銭的・単純にステーキング量か
            ハイブリッド型？
                ステーキングスコア（時間x量）と、
                総合スコア（total系＋NFT所有数）で、
                どちらか大きい方が採用されるスコア値
            総合型？
                ステーキングスコア + total系スコア + NFT所有スコア
                total系スコアは現在の計算式でOK
                NFT所有スコアは計算用コントラが必要
                    nft x 係数で算出する
                ステーキングスコアは別途実装が必要
                    feeding時にstaking amount + 係数を加算させる
                    あるいはtotal系スコアに加算でも良いか
                    ステーキングのスコアへの影響の割合が吟味必要
                        どんなにステーキングしても+20%増しぐらいが良いか
                    もしくはステーキング量に応じて+aの係数を書けるのでも良いか。
                        maxは+20%に収束する
                    スコアは加算するのではなく、total系からその都度算出するので、
                        加算時にxAするのは現実的ではなかった。
                        よって、別にtotal_staking_amountを用意し、
                        これをtotal系スコアの計算式に組み入れることとする。
                        スコア増加率は+20%程度の係数で。
        現状スコア的なもの
            ステータス（≒exp）
            スコア（exp, coin, leaf, item_crafted, fluffy_recievedの総合点）
            ステーキング量
            walletスコア（nonce, ageの総合点）
            item, fluffy数（購入したものも含めてwallet内すべて）
        すべてを加味したものをtotal_score = comfortabilityとするか？
        ステッカーや金魚鉢などは、基本的にこのスコアを参照するか
        これとは別に、dapps staking量を反映するものがあっても良いとは思う
        成長可能なアイテム
            ウォールステッカー
            フロアステッカー
            金魚鉢
            花瓶
            鳩時計？
            ねおんちゃん？
                ねおんふるっふぃーを増やすか
        これらのアイテムの成長はどのスコアを参照させるか
            すべてステーキング量に比例でも良いかもしれない

   *ステッカー修正
        floor stickerの修正
        蛍光塗料の実装
        
    UpgradウィンドウUIの改善
        mint先itemアイコンの実装
        fluffyが難しいが、どうするか。
        また、アイテムアイコンの一覧を作るのが大変。
            craft windowと共通化したいところだが。
            
    NFT絵の表示の実装
        walletからnftの取得
        nftからtokenURLの取得
        URLからpngを取得してloadする機構の実装
            ipfsからだと遅いか？
            tofuNFTなどから取得したいが、可能だろうか
        ローディング絵の実装
            NFTのダウンロードは時間がかかると思われるので
            Loading..の文字と何かしらの宛絵を用意する

    上位アイテムの演出の実装
        Uncommon, Rareの差別化をどうするか
        particleをうまく使うか。
        一覧での色も変える？

    コンセプトの整理：簡潔にわかりやすく
        これはなに？ What's This?
            Astar Networkを利用したgame dapps
            NTT（SBT）とNFTを利用した育成ゲーム
        コンセプトはなに？ What's the concept?
            あなたのwalletに住む電子ペットがコンセプト
            また、私達製作者自身が遊んでて楽しいと思えるものを作っています。
        どうやってあそぶの？ How to Play?
            ゲームはゆっくり進みます。最も価値のある資源は「時間」です。
            1日2回はご飯を上げる
            3日に1回はなでてあげる
            coin/leafを貯めさせて, item NFTをcraftさせる
            忘れず献身的にお世話してあげると、あなたのHoMはどんどんにぎやかになってゆきます。
        値段は What's the Cost?
            200 $ASTR
            priceはごく緩やかにインフレしていきます。
            （1ヶ月後予定：210 $ASTR, +5%）
        ステーキングをよろしく！ Dapps staking bonus!
            presentboxがもらえます
                より多くstakingすると短いスパンでもらえます
            一部のアイテムの表現が変化します
                よーく見てみてください。あるいは以下でスポイルされています。
        ご注意ください, Attention Please
            ・murasaki-san自体はNFTではなくNTT/SBTです。譲渡・売買は一切できません。
            ・クラフトしたitem NFTはマーケットで自由に移動できます。
            ・長く放置するとペナルティを受け、再開にコストが必要です。
            ・
        稼げる？ Easy to Earn ?
            Don't expect too much.
            ★かんたんに稼ぐ方法はありません★
            できるだけゆるく長く続けたいと思っています。
            独自トークンなし
            ゲームの中心のキャラクターはNFTではないため売買不可
            バイバックシステムの価格は絶対に下がらず、ゆっくりとインフレしてゆきます。
                つまり、gameをexitするときは、
                バイバックシステムですべて最低価格で売り切れることが確約されています。
            この作品が注目されればNFTの価格が一時的に上昇することもあるかもしれませんし、
                運良く儲かるかも知れませんが、一時的なものだと思われます。
        仕様について Game Specifications
            4つのステータスとNFT itemによる補正について
            アイテムのアップグレードについて
            presentboxとfluffyについて：概要
            fluffyについて：cat mailについて
            fluffyについて：festivalについて
            fluffyについて：craft bonusについて
            fluffyについて：ぬいちゃんについて
            fluffyについて：dapps stakingボーナスについて
            アイテムマーケットについて
            全アイテムの詳細について
            他のmurasaki-sanのお世話について
        より詳しい仕様について more detailed game specifications
            レベルとアイテムによるSTR, DEXの補正式
            LUKによるクリティカルの補正式
            INTによるクラフトレベルの補正式
            バイバックトレジャリーの計算式
                Mint priceとインフレ率について
                作品は一般的にその価格で評価されがちです。
                そのため、低いながらも緩やかに上昇し続ける価格メカニズムを導入しました。
            コントラクト構成について
            dapps stakingボーナスの計算式
                影響を受けるアイテムについて
            生誕秘話
            キャラクター紹介
                murasaki-san
                fluffy
                nainai-san
                nyuinyui-san
                    illustratorがアンニュイな気分で描いた子
                neon-san
                    コーダーが息抜きで描いた子
                nayon-san
                    illustratorが昔飼ってた猫がモデル
                Astar/Ether/Bitco
                    コーディングの合間に描いた生物たち
        今後は？, future plan?
            ゲームが最大成長するまでおよそ2年で設計しています
            その時間の間に、この作品を更に拡張させるか、
            あるいはmurasaki-san SBTの情報を使った次の作品を作りたいと思っています。
            （進捗度：1%）
            AstarはXCMが使える予定のため、次回作はWASMで作成予定です。
                WASM環境は構築済み、現在coderはrustを勉強中です
                フロントエンドエンジンは未定ですが、Bevyエンジンに興味を持っています
        あなたはだれ？ Who are you?
            ただのAstarファンの一般人2人です。
            個人の趣味プロジェクトのため、マンパワーには限りがあります。
            生暖かく見守ってください。
            どんなトークンの寄付も大歓迎です。
            Coder address:
            Illustrator address:

    fluffy修正
        色修正
        ・グレイ
        ・ベージュ
        ・ライムグリーン
        ・ライトブルー
        ・ブルー
        ・パープル
        ・あかむらさき
        ・レッド
        ・オレンジ
        ・ピンク
        ・イエロー
        ・ホワイト
        正面のアニメーション追加
        サイズ修正
        fluffierの瞬き頻度修正
    
    ニュースの修正
        ウェルカムボードへ変更する
    
   *バイバックコントラの洗練
       *アクティブユーザーのカウント方法の深慮
            mm.next_summoner() - 1ではなく、not petrified summonersを
                amount per summonerの分母に使用する
            しかし、petrifiedは受動的な状態変化なので、
                例えばpetrified時にカウントアップさせることはできない。
            別でlast feeding timeを集計するバッチコントラを用意して、
                adminコントラとして用意し、定期的に実行させるか。
            last feedingよりpetrified summonerを割り出し、
                msかmpのactive_summonersに有効summoner数を代入する関数。
            これをbufferTreajuryのtransfer関数に組み込めればベストだが。
            for関数のリミットはいくつだろうか。
        あるいは, feeding時にpetrified summonerをカウント可能な機構を組み入れる
            ある時間においてnow_time - last_feeding_time > 30dのsummonerをカウントしたい

    エコノミクス
        独自トークンは使用しない
            経済のメイントークンとしてASTRを使用する
        価格上昇メカニズム
            殆どのアイテムについて最低買取価格が設定されている
                coin/leafについては自由市場とする
                fluffyの価格設定が難しいところ
                    fluffyの2年間の理論数はいくつにバランス調整するか
                    800/20lv = 265 fluffy, 67 fluffier, 17 fluffiest
            最低買取価格は下落せず緩やかにインフレさせる
            mint費用の半分が即座に買取用のバイバック金庫に入れられる
            参加人数の増加は最低価格に影響を与えない
                その時のインフレ率を加味した値段がmint価格となるため
            参加人数の増加はインフレ率を抑制する
            アクティブユーザーの減少はインフレ率を上昇させる
            インフレ率の上昇要因：
                マーケットの取引量の増加
                アクティブユーザー数の減少
                dapps staking量の増加
            インフレ率の抑制要因：
                アクティブユーザー数の増加
                    1ユーザーあたりの割当金額が上昇しにくくなるため
                マーケットの取引量の減少
                dapps staking量の減少
        バイバック上限の設定
            amount per summonerの2倍をバイバック上限とする
                一部のbotterが売りまくるのを防ぐ
                あるいは、レベルキャップを設けるか
                    低レベルのbotterが売りまくるのを防ぐ
            バイバックが枯渇したらバイバック終了
                ある程度の早いものがち
                しかし理論上は可能だが実現するためには全summonerの半分が
                    すべてのアイテムを手放さないと枯渇しない程度のamountを用意しておく
                また、2年近く立たないと枯渇させられないバイバック価格に設定する
                    初期アイテムのみを作って売り続けても５～６年かかる値段設定に
                    現在の価格設定だとLv9のアイテムを売り続ければ、1年でもとが取れる
                        amount per summonerの2倍量までは2年で達する
                    また、Lv13だと半年でもとが取れ、1年で枯渇する
                恩株化するには、これらのアイテムが作れるようになるまで育てて、
                    その後アイテムを作り続けて売り続けると可能となる。
                アイテムを手放したく無いように、金庫が枯渇するまでに
                    アイテムに魅力的なユースケースを付加したい。
            amount per summonerの値はインフレとともに増加してゆく
        bank/pouchの価格考察
            バイバック価格から理論的な最低額が算出できそう
            最低価格から計算するならば1000coin/leaf = 0.03 $ASTR程度
            クラフトの手間を考えると更に下がる
        fluffyの価格設定の深慮
            coin/leafと並んで実質の通貨価値を持ちそうなので、
            バイバック価格は慎重に設定する
            800luck/20lv = 250fluffy/20lv
                100の25%=25をあてがった場合0.1$ASTR/fluffyぐらいか

    バイバックシステムのUI実装
        専用ページの用意
            現在のバイバック価格の表示
            バイバックボタンの実装
            マーケットlistページと統合する？
        意味論
            アクティブユーザーが増えればインフレしにくくなる
            ユーザー数に対してステーキング量が大きければインフレしやすくなる
            脱落ユーザーはアクティブユーザーにカウントせず、
                その分アクティブユーザー用のインフレに資金を回す
                ただし、いきなりアクティブユーザー数で割らずに、
                あくまで月ごとのインフレ率は小さく保つ
            月ごとは3%-6%程度。
                様子を見ながら調整する。
                理想はdapps stakingで利益をとった上での定常状態化
                アクティブユーザー数が多すぎるとインフレしにくいだろうか。

   *マーケットの改善
        情報取得のバッチ処理化
        バイバックシステムの組み込み
            市場で売りに出すかバイバックするかを選択できるように
            バイバックは気軽にはできないようにする

    ウォレットの用意と整理
        いくつ必要か
        EVMとSubstrateと2種類必要か
        summoner ownerとdeveloperは別か

    情報表示の洗練
        文字情報は極力控える
        アイコンや絵などでわかりやすく表示する

    コントラクトのuint32修正
        エラーのもとで煩わしいので、全てuintへ置換する
        コードとabiの全置換が必要
    
    Fluffy FestivalのUI改善
        ないないさんのアニメーションの実装
        ないないさんにとんがりボウシをかぶせる
        winner fluffyにとんがりボウシをかぶせる

    Crafting難易度の調整
        現在の難易度ではItemづまりを起こすだろうか。
        もう少しDCを下げるなど難易度調整する。
            あるいはコストを上げる？
            その場合はstr/dexのインフレ率も調整必要
            現状、str/dexを上げて効率が上がるという拡大再生産の実感が弱め
        初期の必須アイテム系はもっと値段と難易度を下げる
            大体1-2週間程度ですべて揃うぐらいに。
            特にnameplateは1日でmint可能なぐらいに。
        ただし、初期アイテムを大量に売って倍バックで稼ぐハックが可能とならないよう調整する。
    
//### Picture

    額縁絵の改善
        場所とデザインの吟味

    ぬいちゃん絵のバリエーション
        元になったfluffiestの組み合わせによってリボンの色を変えるか
        元fluffiestの情報の書き込みが必要

    フロアステッカーの実装
        お花にするか
        床の上に薄く色々な種類のお花が増えてゆく

    ステーキング反映案
        いくつかのアイテムはステーキング量に応じて豪華になる
            金魚鉢：金魚が増える
            ステッカー：にぎやかになる
            花瓶：花の種類が変わる、など
        ステッカーはwallet ageではなくstaking量に対応させてしまうか

    本のアニメーションの実装
        マウスオーバーラップ時の絵
        クリックで開いて表示させる？
        吹き出しの検討
            位置合わせがとても面倒だが

    プレゼント絵の実装
        マウスオーバーで半開きの絵
        出現アニメーション案
            ケムリでぼわぼわ
            誰かが持ってきて置く
            空からパラシュート

    猫の絵の実装
        家猫, 寝ている絵, 2枚, OK
        家猫, 立っている絵, 2枚
        家猫, メールをくわえて立っている絵, 1枚
        家猫, メールをくわえて右に歩いている絵, 2枚
        家猫, 何もくわえずに左に歩いている絵, 2枚
        家猫, メールをくわえて立っている絵, にゃーと鳴いている, 1枚
        訪問猫, 寝ている絵, 2枚
        訪問猫, メールをくわえて立っている絵, 2枚
        訪問猫, メールをくわえて立っている絵, にゃーと鳴いている, 1枚
        訪問猫, メールをくわえて右に歩いている絵, 2枚
        訪問猫, 何もくわえずに左に歩いている絵, 2枚
    
    Newspaperの絵の改善
        もう少し見やすく、新聞の絵をもうちょっとリッチに
    
    一人遊び用アクセサリー
        積み木
            つっつくむらさきさん絵
            積み木が３段階ぐらいで積み上がっている絵
        ティーセット
            条件が揃うとペットたちとお茶会をする
            午後2時～4時、happy80%以上、満腹度80%以下
        お昼寝用クッション
            条件が揃うとペットたちとくっついて寝る
            スイッチで夜もしくは20時以降20時前、満腹度80%以上、happy80%以上

//### 2nd

 ok Fluffy FestivalのUI実装
 
        開催直前
            画面の端に少しだけ見えて待機している
            開催までの残り時間を知らせてくれる
        開催中：投票前
            お部屋の中をにぎやかに動き回る
            立て看板で「開催中！」とでも表示させるか
            タップでvote用windowを表示する
        開催中：投票後
            投票済みを表す絵を考える
                看板の表示を変える？
            開催中はお部屋に居続ける
            自分の投票先を表示する
            残り時間を表示する
            現在の投票結果を表示する
            終了可能かを表示する
                終了可能時はタップでend_votingする
        開催終了
            画面外へ出てゆく
        絵の案
            とんがり帽子をかぶったfluffy達？
            ないないさん？
        
 ig Upgradeウィンドウの改善
        もっと直感的にわかりやすく

 ok 読み込み画面の改善
        オープニングのイメージをどうするか
    
 ok Fluffyの絵の実装
        3種類, 12色
    
 ok トークンボックス絵の実装
        宝箱
        開いた絵と閉じている絵の２種類

 ok ネオンちゃんの絵の実装
        裏の世界である程度動き回る

 ok ナイナイさんUIの改善
        アニメーションの実装
        出現・退場の改善
            出現するのはduringFestival_beforeVoteの時だけ
            afterVoteはチラシなどで現状報告させるか
            endingの演出をどうするか
        
 ok 猫ちゃん実装
        アニメーションの実装

 ok スイッチOFF時のUI改善
        ステッカーの蛍光塗料を実装

 ok バグ・微修正
        宝箱の音の吟味
        猫ちゃんに音を実装する

 ok 情報の表示/非表示
        tabletのON/OFFでinfo系すべてON/OFFとする
        info系spriteをgroup_infoに突っ込んどく。
    
 ok foodのUI改善
        食べ物は一つずつ順番に
        satietyによって演出を変える？
        むらさきさんの位置を少し手前に修正

 ng presentboxの演出を考える
        出現タイミング
            誰かのcrafting
            mail開封時（受け取り側）
            mail開封時（贈り側）
            festival voting
            dapps staking reward
        演出案
            空からパラシュート
            煙の中から出現
            ないないさんが画面外から持ってきて置いていく
            fluffyたちが画面外から持ってきて置いていく
            あるいは上記のランダム
    
 ok upgrade料金の調整
        現状、fluffierに3000, fluffiestに11000必要でちょっと高すぎる
        ぬいちゃんは36000, アイテム6-8個分ぐらいか
        コストは半分ぐらいでもよいだろうか
        もしくは一桁さげるか、1/5ぐらいにするか。

 ok Fluffy Festivalの構想
        次回投票日までのblock数の表示方法
        投票可能時の演出
        投票出発時の専用絵
        selection画面の実装
        専用キャラ？
            専用クラスを用意する
            Festival前から出現
            festival startまでのblock数をカウントダウン
            start_block後はクリックでvoting windowを開く
            votable(false)で退出する
                退出の演出を用意する
            退出後は張り紙やレポート用紙などで途中経過を報告する
            festival終了時は結果を表示する
            start_blockまでのカウントダウン関数の実装が必要か
            0/1のvotableと、start_blockまでのdelta_blockの2つを取得する
        必要な情報
            in session = true/false
            your status = voted/not yet
            next festival start block
            end block
        バグ対策：end_voting
            みなが早めにvoteし終えてしまうと、誰もend_votingしてくれなくなる
            end_votingだけを別途行えるようにしておく
            必要なら運営が手動で行うか
            もしくは、end_votingのみは、条件を満たせば誰でも行えるようにしておく
                まだvotingしていないsummonerはvoting & end_voting
                すでにvoting済みのsummonerもend_votingのみを行い、
                    ボーナスboxを得ることができる
                また、このような状況を逐次ユーザーに表示するUIを実装する
                    自分の投票内容
                    途中経過の報告
                    終了までの残block数と概算時間
        状況
            未開催：
                直近の結果を表示
                次回開催予定日時を表示
            開催中, 未投票：
                投票ボタンを表示
            開催中, 投票済：
                自分の投票結果を表示
                現在の投票状況を表示
                終了までのblock数と概算時間を表示
        固定化対策：重複禁止
            前回のtopは次回の投票対象から外すルールを実装する
            現在のmp.elected_typeはrequireでnotすればよいか

 ok mane mintのバグ修正
    
 ok staking_secのバグ修正
        satiey = secではないので不当に長くなっている
        satiety = 500/12hr
        delta_sec = satiety * (12*60*60) / 500

 ok クリティカル検出の改善
        現状、うまく検出できてない
        luck_challengeはmsg.senderを参照するので画一的に結果を取得できない
        案1
            msg.senderを考慮した乱数取得関数を用意する
        案2
            通常のernを計算しそれより多いか参照する
        案3
            Eventを参照する
        採用案
            feeding, grooming, mining, farmingのluck前の値を取得し、
            この値より1.8倍大きいdeltaが生じた時にcliticalと判定する。
            feedingとgroomingのぬいちゃん補正はlocalで行う。
            feedingとgroomingはまずsolidityの更新が必要。
                → calc値を取得してpreviousに代入
                → これに対してnuiちゃん補正をかけ、1.8倍判定を行う

 ok Staking RewardカウンターのUI実装
        次回のプレゼントを受け取るまでの進捗をバーなどで表示する
            さてどこに表示させるか
            feedingでのみカウンター減弱するので、feedingの近くか？
        表示内容
            feeding時にカウンターが進む
            かつ、係数はstaking量に比例するので単純な秒でもない
            単位なしの「%」とするか
        専用キャラクター？
            カウンターが0になった時にキャラクターを表示させるか
            もしくは、常に表示されるカウンターのようなものを作るか
        必要な情報
            dapps staking amount
            staking reward counter
            staking reward speed
            staking reward percent

 ok contract_mpからのパラメータ取得のバッチ処理化
        もしくはmurasaki_infoのstaticでmpステータスをバッチで取得する

 ok ステータスを表示する本の実装
        クリックやマウスオーバラップで細かなパラメータを表示する
        表示ステータス
            total_exp_gained
            total_coin_mined
            total_leaf_farmed
            total_fluffy_received
            total_item_crafting
            total_mail_sent
            total_mail_opened
        バッチ処理で受け取ってもよいが、
            アイテムクラフト時にかき集めてもそこまで負担にならないか
        随時更新させたいので、やはり専用のバッチ処理で定期的に情報を取得する
            もしくはmurasaki_info内に組み込めたら良いのだが。
    
 ok Fluffly ScoreのUI改善
        履歴ではなく、現在の個数を表示させる
            fluffy, flyffier, flyffiest, fluffy dollの個数と補正値
    
 ok presentboxのUI実装
        マウスオーバーラップで情報表示

 ok ガバナンスシステムの実装
        投票
            インフレ率の修正や、運営個人walletへの報酬支払など、
            方針決定時に投票できるメカニズムを作る。
            投票には例えばLv3以上のsummonerが紐付いたwalletのみ許可し、
            例えばスコアの大きさに応じて比率を変える（log関数、せいぜい2倍）。
            Lvによる足切りと、スコアによる増幅
        内容
            選択肢は予め運営側で決定する（インフレ率100%などの逸脱はさせない）
            過去の投票結果を見られるページを作る
            役員報酬の支払い
            インフレ率の設定？
        その他
            せっかくなので、定期的に行えるシステムがほしい
            fluffyのどの色を優遇するかの投票などを月イチで行うか
                効果+5%
            月イチボーナスの決定
                mining +3%
                farming +3%
                crafting time -3%
                feeding +3%
                grooming +3%
            頻度は月1回か、2週間に1回程度
            参加でfluffy 1匹もらえる？
        毛玉取りフェスティバル
            月に1回のイベント
            むらさきさんが飼い主のところに毛玉取りに出かける
            「あなたの服には今何色の毛玉がついてる？」
            → 選択した色のfluffyが手に入る
            → 同時に、選択した色に投票される
            一番投票数が多かった毛玉が選出され、その月luckにブーストがかかる
            選出された色の子はお花や音符など、何かしらの+αで表示させる
        オークション方法
            キャンドルオークション方式で行ってみる
            リアルタイムで投票結果を表示する
            投票した色のfluffyがもらえる
            投票に勝った場合は投票した色のfluffierがもらえる
            誰かがvoteするたびに、mapping noでその時点の1位を書き込む
            投票時間が過ぎたあと、end functionにseed値を渡して動かす
                seed値よりvote noを選出し、そのvote no時点の1位を勝利者とする。
            投票済みをrequireし、投票結果を参照して、fluffyをmintさせる。
            
    ステータスページの実装
        walletもしくはsummoner idから、ステータス一覧を取得するページ
        もしくはステータスを取得するコントラクトのマニュアルの整備
        ステータスは数値ですべて公開してしまうより、画面内から読み取るほうが良いか？
            total_mined_coinに対応したアイテムを用意する、など
        もしくは、内部計算をできるだけ公開し、ランキングなどもつくるか？
       *Murasaki_InfoのInterfaceとマニュアルの整備

 ok プレゼントシステムの実装
        fluffyを得るタイミングではまずプレゼントboxを得る
        クリックしてopenするとランダムでfluffyが手に入る
        コントラクトで管理する
        itemType = 200
        burnしてfluffyをmintする
        タイミング
            craft時に誰かに送られる
            mail open時にお互いに送られる
            fluffy festival時にもらえる
       *dapps stakingとの連携を考える
            直接luckがブーストされるのではなく、
            プレゼントを貰えるタイミングや頻度が増える
            stakingあり：30日～7日でプレゼント1つもらえる
            $500 ASTRでもstakingすれば30日に1個はもらえる
            claimのタイミングはどうするか。
                feedingやgroomingの時にチェックかけてmintさせるか。
        演出はどうするか
            空から降ってくるか
            ないないさんが持ってくるか
        実装
            専用クラスを用意する
        Dapps Staking連携の深慮
            500 ASTR以上で追加のpresentboxが得られる
            30日に1度, 500 ASTRあたり1日短くなる
            7日が最短7日までに11500 ASTR必要
                あるいはmax 100,000 ASTRで指数関数的にするか。
            feeding時にタイマーをすすめる
                0になったらpresentboxをmintさせる
            実装
                feeding時に現staking量 x 前回feeding時からの時間 = スコアを算出する
                スコアをnext_scoreから減じ、next_scoreが0になったらmintする
                feeding直前に毎回資金をスライドさせれば原理上ハック可能だが、
                面倒なのでやる人は少ないと期待する。
                30d x 24h x 60m x 60sec = 2,592,000 sec
                500 ASTRで経過時間x1 -> 30d
                100,000 ASTRで経過時間x4.2857倍 -> 7d (30 / 4.2857 = 7.00) 

 ok LootLike情報のUI実装
        看板にマウスオーバーラップで情報表示させるか

 ok Upgradeシステムの深慮
        コスト設定
            ノータイムで完了にしてしまうと、
            特にぬいちゃんなどsummonerのステータスを参照するものの製造機になってしまう
        ストーリー
            努力で高レベルのアイテムを入手するシステム
            fluffyのランクを上げるシステム
            
 ok ぬいちゃんシステムの深慮*
        コスト設定
            ハート経済を不採用としたためコストが不明
            ノーマルリソースのみでは希少性が低すぎる
            fluffyをコストに要求するか
            rare fluffyを1体要求、など
            fluffiestの選択はどうするか
            fluffyコスト導入の場合はコードの修正が必要
        自分でもぬいちゃんを所有するインセンティブを考える
            最低補正値を+3%にするか
                feedingとgroomingではluck+3に相当
                fluffiestがおよそ+0.5なので破格か
                fluffiest x 3 = 1.5なので、fluffiest x3を要求とかでも良いか？
            1体でも所有していれば経験値獲得にプラスとなる。
            fluffiest分のluck補正は持ち越し。
        意味論
            fluffyはぬいちゃんになることに憧れている設定
            fluffiestが3体集まるとぬいちゃんになれる
            ぬいちゃんのバリエーションが少しはほしいところだが
                リボンなどのアクセサリーでバリエーションを作るか
        コスト設定
            Upgradeがノーコスト・ノータイムで行えてしまうと、
            summonerがぬいちゃん製造機になってしまう。
            ぬいちゃんをcraftするとゲームプレイが不利になるメカニズムを考える
            → コストの要求, coin/leafコスト
            → 時間の要求, システム構築が結構面倒

 ok 読み込み順の整理
        最優先
            wallet
            summoner
            owner
        画面描写前
            全パラメータを1度
        描写後
            ぬいちゃん
            fluffy

 ok Pet用帽子の実装
        ニット帽はペット用の小さいものにする
        Petクラスにwearing hat関数を実装する
        ニット帽子のサイズと位置合わせ

 ok item upgradeのUIの改善
        HP上で自分でid選んでupgradeは面倒だし味気ない
        craft windowなどでupgrade可能なもの一覧などを表示できればよいが。

 ok クラフトウィンドウの軽量化
        毎回create, destroyではなく、
        最初にcreateしvisible/unvisibleで制御する

 ok 猫のUIの改善
        専用クラスを用意する
        メール送信中は部屋にいない
        メール開封後、インターバル中はクッションで寝ている
            この時タイマーを表示しておく
        インターバル経過後はクッションで座って待っている
            マウスオーバーで表情を少し変える
        メール送信時は、歩いて画面外へ消える
        訪問中は部屋を歩き回る
            メールを加えて歩く
            メールを加えて座る
        訪問中、かつ座っている時にクリックでメール開封
            マウスオーバーで表情を少し変える
        メール開封時は、歩いて画面外へ消える
        訪問猫には何かしらアクセサリーをつけて部屋猫と差別化する
            リボン？
            吹き出し？
            鈴？
            首輪？
        絵
            家猫, 寝ている絵, 2枚, OK
            家猫, 立っている絵, 2枚
            家猫, メールをくわえて立っている絵, 1枚
            家猫, メールをくわえて右に歩いている絵, 2枚
            家猫, 何もくわえずに左に歩いている絵, 2枚
            家猫, メールをくわえて立っている絵, にゃーと鳴いている, 1枚
            訪問猫, 寝ている絵, 2枚
            訪問猫, メールをくわえて立っている絵, 2枚
            訪問猫, メールをくわえて立っている絵, にゃーと鳴いている, 1枚
            訪問猫, メールをくわえて右に歩いている絵, 2枚
            訪問猫, 何もくわえずに左に歩いている絵, 2枚

 ok Fluffy NFTのUX実装
        カウンターの実装
            n,u,rを3つ表示する
        レーダーチャートへの反映
            計算式を修正する
        キャラクタの実装
            n,u,rの3種類を作成
            classはstarやtokenBallに準じる
            nは物質, uはまばたきつき目, rは＋口と自律的に動き回る
        preciousBoxの実装
            preciousたちの家
            クリックでみんなが帰る
        mint演出の実装
            どこからくる？誰が持ってくる？
        コード実装
            専用クラスを用意する
            items[201-212, 213-224, 225-236]の所持の有無とitem_idを取得する
            それぞれのitem_idから情報を取得する
                mint日時, mint元, rarity（idで判別）, class（idで判別）
            これらの情報を与えて専用のclassでspriteを作製する
        追加/消滅の実装
            新たに取得時の出現を実装
            消費やupgrade時の消滅を実装

 ok Newspaperの実装
        主だったイベントのみを表示させる
            craft
            Level-up
            mail open

 ok ゲーム読み込み・開始UIの深慮
        ゲーム画面はすべて読みこんでから表示させたい
        そのため、できるだけまとめて読み込み、読み込み完了をわかりやすくする
            ぬいちゃんと、walletスコアの取得がネック、さてどうするか。
    読み込み画面の修正
        static一括取得
        dynamic一括取得
        wallet age取得、計算
        nui取得、計算
        wallet token取得
    読み込み演出の深慮
        ロード画面→部屋画面の間の演出をなにか
    読み込みUIの改善
        すべて読み込みきってから描写する
        いない間も時間が進んでいたことを表すために、行動を引き継ぐ
        画面切り替えと読み込みの演出を考える
            ロード中は面白いメッセージを表示させる
            画面切り替えは扉を開けるなどストレスのないオープニングを考える

    効果音
        https://soundeffect-lab.info/sound/button/
        https://otologic.jp/free/se/motion-pop01.html
        https://dova-s.jp/

    bot対策:多キャラ抑制
        Item transfer costの設定
            やはり最も有効なのはitem transferにコストをかけることか
            transfer自体はプレゼントなど必要なこともあるので禁止はしない
            しかし多キャラ運用で経済を破壊されることを防ぐために、
                10 $ASTRなどのコストを設定しておく。
            オープンシーやTofuなどではやり取りしにくくなるが仕方ないか。
        実装
            market contractへのtransferはノーコストとする
            permitted addressで分岐させるか、別transfer関数を作るか

    ステーキング反映アイテムの実装
        花瓶＋ちょうちょ
            できるだけ愛着が湧くように作り込む
            ステーキングスコアに応じてちょうちょの数が増えてゆく
        金魚鉢
            ステーキング量に応じて金魚が増えてゆく
        システム
            ステーキングスコアに応じてluckがブーストされる
            多くの量を長くステーキングしてくれればスコアが溜まってゆく
            10k ASTRを30dステーキングでスコアmax（ちょうちょ最大）とする
            ステーキング解けばスコアはリセットされる
            → ステーキング期間を取得することが困難なので再考
        時間の深慮
            ステーキング時間は取得と計算が困難
            なので、アイテムクラフトからの時間でブーストキャップを設定する
            クラフト直後はステーキング多くしてもluckあまり増えない
            30dでmax開放となる
            ただ、これだとマーケットでの売り買い時に難しいか
            
    walletのageとnonceによって成長する何かの実装
        age(最初のtxからの時間）とnonceからwalletの使い込み度を算出する
            nonce/age * 5を最大値として、基本的にはnonce値に比例する
            ただし、age若いのにnonceだけ多いbot walletはnonce上限に引っかかる
        2年で最大成長
            理想は24段階
            多くて大変なので、12段階程度か
            理想的には、葉っぱ1枚単位で増やしたいが、難しいか。
        wallet ageの取得
            web3.eth.getTransactionCount(address, block)が使えそう。
                取得が少し遅い。
            最大値は1年。1年以上古いwalletはすべて同じnonce上限とする。
            1年前から順にさかのぼってゆき、1ヶ月ごとに刻む。
            2592000 block/month (1block = 12sec計算）
            初めてnonceが検出された月をageとする。
        age scoreの算出
            1日5 txを上限として、age scoreを算出する。
            age=5mならば、age scoreの上限は900、1mで150上限が増える。
            1年でscore=1800がmaxとする。
            txばっかり飛ばしていても、wallet ageが1年経ってないものは上限にぶつかる
            逆に、wallet ageが古くても、tx飛ばして使い込んでいなければscoreは小さい。

    レベルアップの演出の実装
     ok 花火の音の実装, emitter
        summonerの専用アニメーションの用意
        レベルアップの文字の表示

 ok 帽子の普遍的な位置合わせ
            
    NFTのURL取得方法の実装
    
    Tokenのコントラクトの書き換え

*/


//===global variants========================================================----


async function init_global_variants() {

    //---on_chain static
    summoner = -1;
    local_birth_time = Date.now();
    SPEED = 1;
    BASE_SEC = 86400;
    CORRECT_CHAINID = 4369;
    STAKING_REWARD_SEC = 2592000;
    ELECTED_FLUFFY_TYPE = 0;

    //---on_chain dynamic
    local_class = 0;
    local_strength = 0;
    local_dexterity = 0;
    local_intelligence = 0;
    local_luck = 0;
    local_level = 0;
    local_last_feeding_time = 0;
    local_last_grooming_time = 0;
    local_coin = 0;
    local_exp = 0;
    local_mining_status = 0;
    local_mining_start_time = 0;
    local_next_exp_required = 0;
    local_material = 0;
    local_farming_status = 0;
    local_farming_start_time = 0;
    local_crafting_status = 0;
    local_crafting_start_time = 0;
    local_crafting_item_type = 0;
    local_items = new Array(256).fill(0);
    local_precious = 0;
    local_wallet = "0x0000000000000000000000000000000000000001";
    local_owner = "0x0000000000000000000000000000000000000000";
    local_name_str = "(unnamed)";
    local_notPetrified = 1;
    local_isActive = 0;
    local_rolled_dice = 0;
    local_last_rolled_dice = 0;
    local_last_dice_roll_time = Date.now();
    local_mail_sending_interval = -1;
    local_score = 0;
    local_receiving_mail = 0;
    local_receiving_mail_from = "";
    local_satiety = 0;
    local_happy = 0;
    local_age = 0;
    local_myListsAt_withItemType = [];
    local_luck_challenge_of_mffg = 0;
    local_luck_challenge_of_mfmf = 0;
    local_luck_challenge_of_mfc = 0;
    local_newsText = ["Peaceful","Today !","","ฅ•ω•ฅ"];
    local_itemIds = [];
    local_wallet_score = 0;
    local_birthplace =  "";
    local_softness =    "";
    local_fluffiness =  "";
    local_elasticity =  "";
    local_personality = "";
    local_staking_reward_counter = 2592000;
    local_check_votable = 0;
    //local_total_mining_sec = 0;
    //local_total_farming_sec = 0;
    //local_total_crafting_sec = 0;
    local_total_exp_gained = 0;
    local_total_coin_mined = 0;
    local_total_material_farmed = 0;
    local_total_item_crafted = 0;
    local_total_precious_received = 0;
    local_dapps_staking_amount = 0;
    local_staking_reward_speed = 0;
    local_coin_calc = 0;
    local_material_calc = 0;
    local_calc_feeding = 0;
    local_calc_grooming = 0;
    local_blockNumber = 0;
    local_fluffy_count = 0;
    local_price = 0;
    
    //---local festival
    local_ff_each_voting_count = new Array(256).fill(0);
    local_ff_next_festival_block =   0;
    local_ff_inSession =             0;
    local_ff_isVotable =             0;
    local_ff_last_voting_block =     0;
    local_ff_last_voting_type =      0;
    local_ff_subject_now =           0;
    local_ff_subject_start_block =   0;
    local_ff_subject_end_block =     0;
    local_ff_isEndable =             0;
    local_ff_elected_type =          0;
    local_ff_previous_elected_type = 0;

    //---local previous
    previous_local_last_feeding_time = 0;
    previous_local_last_grooming_time = 0;
    previous_local_level = 0;
    previous_local_mining_status = -1;
    previous_local_farming_status = -1;
    previous_local_crafting_status = -1;
    previous_local_exp = 0.01;
    previous_local_coin = 0;
    previous_local_material = 0;
    previous_local_items = local_items;
    previous_local_name_str = "[0] * 256";
    previous_local_item194 = 0;
    previous_local_item195 = 0;
    previous_local_item196 = 0;
    previous_local_item197 = 0;
    previous_local_rolled_dice = 0;
    previous_local_score = 0;
    previous_satiety = 0;
    previous_happy = 0;
    previous_local_precious = 0;
    previous_local_precious2 = 0;
    previous_local_item200 = 0;
    last_local_coin_calc = 0;
    last_local_material_calc = 0;
    last_local_calc_feeding = 0;
    last_local_calc_grooming = 0;
    previous_local_fluffy_count = 0;
    
    //---local etc
    turn = 0;
    local_coin_calc = 0;
    local_material_calc = 0;
    local_crafting_calc = -1;
    bgm = 0;
    local_items_flag = new Array(256).fill(0);
    global_selected_crafting_item = 0;
    global_selected_crafting_item_dc = 0;
    global_selected_crafting_item_required_heart = 0;
    last_sync_time = 0;
    mode = "";
    screen_coin = 0;
    screen_coin_delta = 0;
    screen_material = 0;
    screen_material_delta = 0;
    screen_exp = 0;
    screen_exp_delta = 0;
    count_sync = 0;
    happy = 0.1;
    satiety = 0;
    screen_happy = 0;
    screen_happy_delta = 0;
    screen_satiety = 0;
    screen_satiety_delta = 0;
    item_wearing_hat = 0;
    active_nui_id = 0;
    //text_event_heart = "";
    text_event_random = "[Murasaki news]";
    text_event_random = text_event_random.padStart(116, " ");
    turn_forFPS = 0;
    time_forFPS = Date.now();
    summoned_fluffies = [];
    summoned_presentbox = [];
    item_wearing_hat_pet = 0;
    staking_reward_percent = 0;
    //item_hat_helmet = 0;
    //item_hat_mortarboard = 0;

    //---flag
    flag_music = 0;
    flag_radarchart = 0;
    flag_doneFp = 0;
    flag_dice_rolling = 0;
    flag_name_minting = 0;
    flag_mail = false;
    flag_tokenBall = 0;
    flag_loaded = 0;
    flag_item_update = 0;
    flag_summon_fluffy = 0;
    flag_onLight = true;
    flag_window_craft = 0;
    flag_sync = 1;
    flag_fadein = 0;
    flag_debug = 0;
    flag_info = 1;
    
    //---pointer
    pointer_x = 0;
    pointer_y = 0;
}

init_global_variants();


//===html========================================================--------


//---get summoner
//get summoner from url parameter
//https://www.tam-tam.co.jp/tipsnote/javascript/post9911.html
var urlParam = location.search.substring(1);
if(urlParam) {
    var param = urlParam.split('&');
    var paramArray = [];
    for (i = 0; i < param.length; i++) {
        var paramItem = param[i].split('=');
        paramArray[paramItem[0]] = paramItem[1];
    }
    summoner = paramArray.summoner
}


//---fingerprint

//https://github.com/fingerprintjs/fingerprintjs
//https://github.com/fingerprintjs/fingerprintjs/blob/master/docs/api.md
//with no module option
//preload require: umd.min.js
//NEED: in apache, virtualhost, ssl, mod_expires to ignore cache

/*
#220510, apache conf
#api.murasaki-san
<VirtualHost *:443>
        ServerName api.murasaki-san.com
        DocumentRoot /var/www/murasaki-san/
        DirectoryIndex index.html index.php .ht
        ErrorLog /var/log/apache2/murasaki-san.error.log
        CustomLog /var/log/apache2/murasaki-san.access.log combined
        SSLEngine on
        #ignore cache
        <ifModule mod_expires.c>
            ExpiresActive On
            ExpiresDefault "access plus 1 seconds"
        </ifModule>
        <Directory "/var/www/murasaki-san/">
            Require all granted
            AllowOverride All
            Options FollowSymLinks MultiViews
        </Directory>
        #arrow CROS
        <IfModule mod_headers.c>
            Header set Access-Control-Allow-Origin "*"
            Header set Cache-Control "no-cache"
        </IfModule>
        #SSLProtocol all +SSLv3
        #220430
        #apt install certbot
        #certbot certonly --webroot -w /var/www/murasaki-san/ -d api.murasaki-san.com -m keijo@kapipo.com
        Include /etc/letsencrypt/options-ssl-apache.conf
        SSLCertificateFile /etc/letsencrypt/live/api.murasaki-san.com/fullchain.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/api.murasaki-san.com/privkey.pem
</VirtualHost>
*/

//POST
async function send_fp_post(_wallet, _summoner) {

    // Initialize the agent at application startup.
    const fpPromise = FingerprintJS.load()

    // Get the visitor identifier
    let fpResult = 0;
    await fpPromise
          .then(fp => fp.get())
          .then(result => {
                //console.log(result.visitorId);
                fpResult = result.visitorId;
          })

    //post
    var send_data = new XMLHttpRequest();
    send_data.open('POST', 'https://www.kapipo.com', true);
    send_data.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    let _text = "";
    _text += "fp=";
    _text += fpResult;
    _text += "&";
    _text += "summoner=";
    _text += _summoner;
    _text += "&";
    _text += "wallet=";
    _text += _wallet;
    send_data.send(_text);
}

//GET
async function send_fp_get(_wallet, _summoner) {

    // Initialize the agent at application startup.
    const fpPromise = FingerprintJS.load()

    // Get the visitor identifier
    let fpResult = 0;
    await fpPromise
          .then(fp => fp.get())
          .then(result => {
                //console.log(result.visitorId);
                fpResult = result.visitorId;
          })
        
    //get
    var request = new XMLHttpRequest();
    let _text = "";
    _text += "fp=";
    _text += fpResult;
    _text += "&";
    _text += "summoner=";
    _text += _summoner;
    _text += "&";
    _text += "wallet=";
    _text += _wallet;
    let url = "https://api.murasaki-san.com/index.html?" + _text;
    request.open("GET", url, true);
    request.send();
}


//===web3========================================================--------


//---update

//call myListsAt_withItemType
async function get_myListsAt_withItemType(_wallet) {
    //let myListLength = await contract_mc.methods.myListLength(_wallet).call();
    //let myListsAt_withItemType = await contract_mc.methods.myListsAt_withItemType(_wallet, 0, myListLength).call();
    let myListLength = await contract_mc_wss.methods.myListLength(_wallet).call();
    let myListsAt_withItemType = await contract_mc_wss.methods.myListsAt_withItemType(_wallet, 0, myListLength).call();
    return myListsAt_withItemType;
}

//generate allItemBalance from myListsAt_withItemType
function get_allItemBalance_from_allItemId_withItemType(_allItemId_withItemType) {
    let allItemBalance = Array(256).fill(0);
    for (i = 0; i < _allItemId_withItemType.length; i += 2) {
        let _itemId = _allItemId_withItemType[i];
        let _itemType = _allItemId_withItemType[i+1];
        allItemBalance[_itemType] += 1;
    }
    return allItemBalance;
}

//generate itemIds from allItemBalance
function get_itemIds_from_itemType(_allItemId_withItemType, _target_itemType) {
    let itemIds = [];
    for (i = 0; i < _allItemId_withItemType.length; i += 2) {
        let _itemId = _allItemId_withItemType[i];
        let _itemType = _allItemId_withItemType[i+1];
        if (_itemType == _target_itemType) {
            itemIds.push(Number(_itemId));
        }
    }
    return itemIds;    
}

//generate all item ids list
function get_itemIds(_myListsAt_withItemType) {
    let _itemIds = [];
    for (i = 0; i < _myListsAt_withItemType.length; i += 2) {
        let _itemId = _myListsAt_withItemType[i];
        _itemIds.push(Number(_itemId));
    }
    return _itemIds;
}

//generate upgradable item ids list
//return: [ [fromItemType, toItemType, [itemId1, 2, 3]], []...]
function get_upgradable_itemIds(_myListsAt_withItemType) {
    //totalling itemType
    //{_itemType:[_itemId1, 2, 3], ...}
    let _dict = {};
    for (i = 0; i < _myListsAt_withItemType.length; i += 2) {
        let _itemId = Number(_myListsAt_withItemType[i]);
        let _itemType = Number(_myListsAt_withItemType[i+1]);
        try {
            _dict[_itemType].push(_itemId);
        } catch(error) {
            _dict[_itemType] = [_itemId];
        }
    }
    //extract itemType in ids >= 3
    let _res = {};
    Object.keys(_dict).forEach(__itemType => {
        if (
            _dict[__itemType].length >= 3 && (
                __itemType <= 128  || (__itemType >= 201 && __itemType <= 224)
            )
        ){
            _res[__itemType] = _dict[__itemType];
        }
    });
    return _res;
}

//### static
async function contract_update_static_status(_summoner) {

    //check summoner
    if (summoner == 0) {
        return 0;
    }
    
    //call info from chain
    //let _all_static_status = await contract_info.methods.allStaticStatus(_summoner).call();
    let _all_static_status = await contract_info_wss.methods.allStaticStatus(_summoner).call();

    //class, owner, name
    local_class =       Number(_all_static_status[0]);
    local_owner =       _all_static_status[1];
    local_name_str =    _all_static_status[2];
    local_price =       _all_static_status[5];

    //lootlike
    let _res = _all_static_status[3];
    local_birthplace =  _res[0];
    local_softness =    _res[1];
    local_fluffiness =  _res[2];
    local_elasticity =  _res[3];
    local_personality = _res[4];

    //call speed
    SPEED = Number(_all_static_status[4])/100;
    
    //STAKING_REWARD_SEC
    STAKING_REWARD_SEC = Number(_all_static_status[6]);
    
    //ELECTED_FLUFFY_TYPE
    ELECTED_FLUFFY_TYPE = Number(_all_static_status[7]);
    
    //calc wallet score
    update_local_wallet_score();
}


//### dynamic
async function contract_update_dynamic_status(_summoner) {

    let _start = Date.now();

    //check summoner
    if (_summoner == 0) {
        count_sync += 1;
        return 0;
    }

    let _res;

    //call item
    let _myListsAt_withItemType = await get_myListsAt_withItemType(local_owner);

    //generate and update local item info
    local_myListsAt_withItemType = _myListsAt_withItemType;
    let _allItemBalance = get_allItemBalance_from_allItemId_withItemType(_myListsAt_withItemType);
    local_items = _allItemBalance;
    local_itemIds = get_itemIds(_myListsAt_withItemType);

    //update fluffy count, not score
    let _count = 0;
    for (i=201; i<=236; i++) {
        _count += local_items[i];
    }
    local_fluffy_count = _count;

    //***TODO*** debug
    if (flag_debug == 1) {
        for (let i = 1; i <= 64; i++) {
            local_items[i] += 1;
        }
        local_wallet_score = 1000;
    } else if (flag_debug == 2) {
        for (let i = 65; i <= 128; i++) {
            local_items[i] += 1;
        }
        local_wallet_score = 2000;
    } else if (flag_debug == 3) {
        for (let i = 129; i <= 192; i++) {
            local_items[i] += 1;
        }
        local_wallet_score = 3300;
    }

    //call dynamic status from chain
    //let _all_dynamic_status = await contract_info.methods.allDynamicStatus(_summoner).call();
    let _all_dynamic_status = await contract_info_wss.methods.allDynamicStatus(_summoner).call();
    
    //update local status

    //wallet
    local_wallet = wallet;
    
    //blocknumber
    local_blockNumber = Number(_all_dynamic_status[0]);
    
    //isActive
    _res = Number(_all_dynamic_status[45]);
    if (_res == 1) {
        local_isActive = true;
    } else {
        local_isActive = false;
    }
    
    //inHouse
    _res = _all_dynamic_status[49];
    if (_res == 1) {
        local_inHouse = true;
    } else {
        local_inHouse = false;
    }

    //status
    local_level =               Number(_all_dynamic_status[2]);
    local_exp =                 Number(_all_dynamic_status[3]);
    local_strength =            Number(_all_dynamic_status[4])/100;
    local_dexterity =           Number(_all_dynamic_status[5])/100;
    local_intelligence =        Number(_all_dynamic_status[6])/100;
    local_luck =                Number(_all_dynamic_status[7])/100;
    local_next_exp_required =   Number(_all_dynamic_status[8]);
    local_age =                 Number(_all_dynamic_status[1]);
    local_strength_withItems =          Number(_all_dynamic_status[35])/100;
    local_dexterity_withItems =         Number(_all_dynamic_status[36])/100;
    local_intelligence_withItems =      Number(_all_dynamic_status[37])/100;
    local_luck_withItems =              Number(_all_dynamic_status[38])/100;
    local_luck_withItems_withDice =     Number(_all_dynamic_status[42])/100;
    
    //coin, material, precious
    local_coin =        Number(_all_dynamic_status[9]);
    local_material =    Number(_all_dynamic_status[10]);
    local_precious =    Number(_all_dynamic_status[30]);
    
    //feeding, grooming
    local_last_feeding_time =   Number(_all_dynamic_status[11]);
    local_last_grooming_time =  Number(_all_dynamic_status[12]);

    //working
    local_mining_status =       Number(_all_dynamic_status[13]);
    local_mining_start_time =   Number(_all_dynamic_status[14]);
    local_farming_status =      Number(_all_dynamic_status[15]);
    local_farming_start_time =  Number(_all_dynamic_status[16]);
    local_crafting_status =     Number(_all_dynamic_status[17]);
    local_crafting_start_time = Number(_all_dynamic_status[18]);
    local_crafting_item_type =  Number(_all_dynamic_status[19]);

    //dice
    local_last_rolled_dice =    Number(_all_dynamic_status[40]);
    local_last_dice_roll_time = Number(_all_dynamic_status[41]);

    //score
    local_score =   Number(_all_dynamic_status[34]);
    
    //satiety, happy
    local_satiety = Number(_all_dynamic_status[28]);
    local_happy =   Number(_all_dynamic_status[29]);

    //mail
    local_mail_sending_interval =   Number(_all_dynamic_status[44]);
    local_receiving_mail =          Number(_all_dynamic_status[43]);
    local_lastMailOpen   =          Number(_all_dynamic_status[50]);

    //update working status
    local_coin_calc =       Number(_all_dynamic_status[46]);
    local_material_calc =   Number(_all_dynamic_status[47]);
    local_crafting_calc =   Number(_all_dynamic_status[48]);
    
    //petrified
    local_notPetrified = Number(_all_dynamic_status[31]);
    
    //dapps staking
    local_dapps_staking_amount =    Number(_all_dynamic_status[32]);
    local_staking_reward_counter = Number(_all_dynamic_status[56]);
    local_staking_reward_speed = Number(_all_dynamic_status[58]);
    
    //festival
    local_ff_next_festival_block = Number(_all_dynamic_status[60]);

    //total status
    local_total_exp_gained = Number(_all_dynamic_status[23]);
    local_total_coin_mined = Number(_all_dynamic_status[24]);
    local_total_material_farmed = Number(_all_dynamic_status[25]);
    local_total_item_crafted = Number(_all_dynamic_status[26]);
    local_total_precious_received = Number(_all_dynamic_status[27]);
    
    //feeding/grooming calc
    local_calc_feeding = Number(_all_dynamic_status[54]);
    local_calc_grooming = Number(_all_dynamic_status[55]);
    
    //update last_sync_time
    last_sync_time = Date.now();
    count_sync += 1;
    
    //update log
    console.log(
        "[update_dynamic]", 
        "turn:", turn, 
        "count_sync:", count_sync, 
        "msec:", Date.now()-_start
    );
}


//update_all, at the first
async function contract_update_all() {
    await contract_update_summoner_of_wallet();
    await contract_update_static_status(summoner);
    await contract_update_dynamic_status(summoner);
}


//### event

/*
//update event_heart
async function contract_update_event_precious() {
    let _block_latest = await web3.eth.getBlockNumber();
    let _block_from = _block_latest - 7200; //1 day
    let _text = "";

    //event craft
    let _events_mc = await contract_mfc.getPastEvents("Precious", {
            fromBlock: _block_from,
            toBlock: _block_latest
    })
    if (_events_mc) {
        for (let event of _events_mc) {
            let _summoner_to = event.returnValues[1];
            if (_summoner_to == summoner) {
                //let _block = event.blockNumber;
                let _summoner_from = event.returnValues[0];
                let _name_from = await call_name_from_summoner(_summoner_from);
                //let _name_from = "";
                if (_name_from == "") {
                    _name_from = "#" + _summoner_from;
                }
                _text += " +1 from " + _name_from + " (item crafting) \n";
            }
        }
    }
    
    //event mail
    let _events_ml = await contract_mml.getPastEvents("Open_Mail", {
            fromBlock: _block_from,
            toBlock: _block_latest
    });
    //console.log(_block_from, _block_latest);
    //console.log(_events_ml);
    if (_events_ml) {
        for (let event of _events_ml) {
            let _summoner_to = event.returnValues[0];
            let _summoner_from = event.returnValues[1];
            if (_summoner_to == summoner) {
                //let _block = event.blockNumber;
                let _name_from = await call_name_from_summoner(_summoner_from);
                //let _name_from = "";
                if (_name_from == "") {
                    _name_from = "#" + _summoner_from;
                }
                _text += " +1 from " + _name_from + " (mail receiving) \n";
            }
            if (_summoner_from == summoner) {
                //let _block = event.blockNumber;
                let _name_to = await call_name_from_summoner(_summoner_to);
                //let _name_to = "";
                if (_name_to == "") {
                    _name_to = "#" + _summoner_to;
                }
                _text += " +1 from " + _name_to + " (mail sending) \n";
            }
        }
    }
    
    _text = _text.slice(0, -2);

    text_event_heart.setText(_text);
}
*/

//update event random
async function contract_update_event_random() {

    //search range
    let _block_latest = await web3.eth.getBlockNumber();
    let _block_from = _block_latest - 7200;  //24 h
    
    //Level-up
    let _events_levelup = await contract_mfsl_wss.getPastEvents("Level_up", {
            fromBlock: _block_from,
            toBlock: _block_latest
    })
    //Crafting
    let _events_crafting = await contract_mfc_wss.getPastEvents("Crafting", {
            fromBlock: _block_from,
            toBlock: _block_latest
    })
    //Mail
    let _events_mail = await contract_mml_wss.getPastEvents("Open_Mail", {
            fromBlock: _block_from,
            toBlock: _block_latest
    })
    
    //combine events
    let _array = [];
    _array = _array.concat(
        _events_levelup,
        _events_crafting,
        _events_mail,
    )
    
    //prepare event text
    let _resText = ["Peaceful","Today !","","ฅ•ω•ฅ"];
    if (_array.length > 0) {

        //select event randomly
        let _event = _array[Math.floor(Math.random() * _array.length)];

        //get block and timestamp
        let _blockNumber = _event.blockNumber;
        let _block = await web3.eth.getBlock(_blockNumber);
        let _timestamp = _block.timestamp;
        let _now = Date.now() /1000;
        let _delta_min = Math.round( (_now - _timestamp) / 60 );

        //prepare text

        //first line: block number
        let _text_time = "";
        if (_delta_min == 0) {
            _text_time = "just now: ";
        } else {
            _text_time = _delta_min + " min ago: ";
        }
        _resText[0] = _text_time;

        //second line: summoner
        let _name = _event.event;
        //let _summoner = _event.returnValues["_summoner"];
        let _summoner = _event.returnValues[0];
        let _summoner_name = await call_name_from_summoner(_summoner);
        if (_summoner_name == "") {
            _summoner_name = "#" + _summoner;
        }
        _resText[1] = _summoner_name;

        //3th-4th lines: type of event
        let _value = _event.returnValues[1];
        let _content1;
        let _content2;
        if (_name == "Level_up") {
            _content1 = "Leveled up to ";
            _content2 = _value;
            _content2 += " !!";
        } else if (_name == "Crafting") {
            let _item_name = array_item_name[_value];
            _content1 = "Crafted";
            _content2 = _item_name;
            _content2 += " !!";
        } else if (_name == "Open_Mail") {
            _summoner_from_name = await call_name_from_summoner(_value);
            if (_summoner_from_name == "") {
                _summoner_from_name = "#" + _value;
            }
            _content1 = "Opened Mail from";
            _content2 = _summoner_from_name;
            _content2 += " !!";
        }
        _resText[2] = _content1;
        _resText[3] = _content2;
    }
    local_newsText = _resText;
}

//### festival
async function contract_update_festival_info(_summoner) {
    //call
    //let _festival_info = await contract_ff.methods.get_info(_summoner).call();    
    let _festival_info = await contract_ff_wss.methods.get_info(_summoner).call();    
   //update local
   local_ff_each_voting_count[201] =  Number(_festival_info[1]);
   local_ff_each_voting_count[202] =  Number(_festival_info[2]);
   local_ff_each_voting_count[203] =  Number(_festival_info[3]);
   local_ff_each_voting_count[204] =  Number(_festival_info[4]);
   local_ff_each_voting_count[205] =  Number(_festival_info[5]);
   local_ff_each_voting_count[206] =  Number(_festival_info[6]);
   local_ff_each_voting_count[207] =  Number(_festival_info[7]);
   local_ff_each_voting_count[208] =  Number(_festival_info[8]);
   local_ff_each_voting_count[209] =  Number(_festival_info[9]);
   local_ff_each_voting_count[210] = Number(_festival_info[10]);
   local_ff_each_voting_count[211] = Number(_festival_info[11]);
   local_ff_each_voting_count[212] = Number(_festival_info[12]);
   local_ff_next_festival_block =   Number(_festival_info[13]);
   local_ff_inSession =             Number(_festival_info[14]);
   local_ff_isVotable =             Number(_festival_info[15]);
   local_ff_last_voting_block =     Number(_festival_info[16]);
   local_ff_last_voting_type =      Number(_festival_info[17]);
   local_ff_subject_now =           Number(_festival_info[18]);
   local_ff_subject_start_block =   Number(_festival_info[19]);
   local_ff_subject_end_block =     Number(_festival_info[20]);
   local_ff_isEndable =             Number(_festival_info[21]);
   local_ff_elected_type =          Number(_festival_info[22]);
   local_ff_previous_elected_type = Number(_festival_info[23]);
}

//---call

//call mail detail
async function contract_callMailDetail(_summoner){
    let _mail_id = await contract_mml_wss.methods.receiving(_summoner).call();
    let _mail = await contract_mml_wss.methods.mails(_mail_id).call();
    let _summoner_from_id = _mail[2];
    //let _summoner_from_name = await contract_mn.methods.call_name_from_summoner(_summoner_from_id).call();
    let _summoner_from_name = await contract_mfs_wss.methods.call_name_from_summoner(_summoner_from_id).call();
    return (_summoner_from_id, _summoner_from_name);
}

//get item_nui, summoner and score
async function contract_get_item_nui(_item) {
    let _summoner_of_nui = await contract_msn_wss.methods.summoner(_item).call();
    let _class = await contract_msn_wss.methods.class(_item).call();
    let _score = await contract_msn_wss.methods.score(_item).call();
    let _exp_rate = await contract_mfs_wss.methods.calc_exp_addition_rate(summoner, _item).call();
    return [_summoner_of_nui, _class, _score, _exp_rate];
}

//call name from summoner id
async function call_name_from_summoner(_summoner) {
    //let _name = await contract_mfn.methods.call_name_from_summoner(_summoner).call();
    let _name = await contract_mfs_wss.methods.call_name_from_summoner(_summoner).call();
    return _name;
}

//call amount of token
//https://qiita.com/ramo798/items/0cc2c556410c95b0b332
async function call_amount_of_token(_contract_address) {
    let wallet = local_owner;
    let minABI = [
        {
          constant: true,
          inputs: [{ name: "_owner", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "balance", type: "uint256" }],
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ name: "", type: "uint8" }],
          type: "function",
        },
    ];
    let contract = await new web3wss.eth.Contract(minABI, _contract_address);
    let balance = await contract.methods.balanceOf(wallet).call();
    let decimal = await contract.methods.decimals().call();
    return balance / (10 ** decimal);
}

//update summoner of wallet
async function contract_update_summoner_of_wallet() {
    if (summoner <= 0) {
        //summoner = await contract_mm.methods.tokenOf(wallet).call();  //have not summoned yet: 0
        summoner = await contract_mm_wss.methods.tokenOf(wallet).call();  //have not summoned yet: 0
        summoner = Number(summoner);
    }
}

//###wallet age

//get nonce
async function contract_get_nonce(_wallet_address) {
    //let _nonce = await web3.eth.getTransactionCount(_wallet_address);
    let _nonce = await web3wss.eth.getTransactionCount(_wallet_address);
    return _nonce;
}

//get wallet month age
async function contract_get_age(_wallet_address) {
    //let _lastBlock = await web3.eth.getBlockNumber();
    let _lastBlock = await web3wss.eth.getBlockNumber();
    let _age = 1;
    //2592000 block/mo, 1block/12sec
    for (let i = _lastBlock; i >= 216000; i -= 216000) {
        let _transactionCount;
        // for "state already discarded for BlockID:" error, try&catch
        try {
            _transactionCount = await web3.eth.getTransactionCount(_wallet_address, i);
        } catch(error) {
            _transactionCount = 0;
        }
        //let _transactionCount = await web3wss.eth.getTransactionCount(_wallet_address, i);
        if (_transactionCount > 0) {
            _age += 1;
        } else {
            return _age;
        }
    }
    return _age;        
}

//calc wallet_score
//score = nonce, max_score = 150 nonce/mo
//1mo = 150, 6mo = 900, 12mo = 1800, 24mo = 3600
//12step = <300, <600, <900, <1200, <1500, <1800, <2100, <2400, <2700, <3000, <3300, 3300<=
async function calc_wallet_score(wallet_address) {
    let _nonce = await contract_get_nonce(wallet_address);
    let _age = await contract_get_age(wallet_address); //mo
    let _scoreMax = _age * 150; // 5tx/day, 150tx/mo
    let _score = _nonce;
    if (_score > _scoreMax) {
        _score = _scoreMax;
    }
    return _score;    
}

//update local_wallet_score
//because calc is high cost, wrapping the updating
async function update_local_wallet_score() {
    local_wallet_score = await calc_wallet_score(local_owner);
}


//get item dc
async function contract_get_item_dc(item_type) {
    let item_dc = await contract_mfc_wss.methods.get_item_dc(item_type).call();
    return item_dc;
}
async function contract_get_modified_dc(_summoner, _item_type) {
    let _modified_dc = await contract_mfc_wss.methods.get_modified_dc(_summoner, _item_type).call();
    return _modified_dc;
}

//get_userItems_bag
async function get_userItems(_summoner, _target_item_type) {
    return get_itemIds_from_itemType(local_myListsAt_withItemType, _target_item_type);
}

//call presentbox info
/*
async function call_presentbox_info
*/

//call item info
async function call_item_info(_itemId) {
    //let _item = await contract_mc.methods.items(_itemId).call();
    let _item = await contract_mc_wss.methods.items(_itemId).call();
    return _item;   //object
}




//---send

//summon
async function contract_summon(_class) {
    let _price = await contract_mp.methods.PRICE().call();
    _price = Number(_price) * 10**18;
    contract_mfsl.methods.summon(_class).send({from:wallet, value:_price})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//cure petrification
async function contract_curePetrification(_summoner) {
    let _price = await contract_mp.methods.PRICE().call();
    _price = Number(_price) * 10**18 * local_level;
    contract_mffg.methods.cure_petrification(_summoner).send({from:wallet, value:_price})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//burn
async function contract_burn(_summoner) {
    contract_mfsl.methods.burn(_summoner).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//levelup
async function contract_level_up(_summoner) {
    contract_mfsl.methods.level_up(_summoner).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//feeding
async function contract_feeding(_summoner) {
    if (_summoner == 0) {
        return 0;
    }
    contract_mffg.methods.feeding(_summoner, active_nui_id).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//grooming
async function contract_grooming(_summoner) {
    contract_mffg.methods.grooming(_summoner, active_nui_id).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//mining
async function contract_mining(_summoner) {
    if (local_mining_status == 0) {
        contract_mfmf.methods.start_mining(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }else {
        contract_mfmf.methods.stop_mining(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//farming
async function contract_farming(_summoner) {
    if (local_farming_status == 0) {
        contract_mfmf.methods.start_farming(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }else {
        contract_mfmf.methods.stop_farming(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//crafting
async function contract_crafting(_summoner) {
    if (local_crafting_status == 0 && global_selected_crafting_item == 0) {
        return 0;
    }
    let _item_type = global_selected_crafting_item;
    if (local_crafting_status == 0) {
        contract_mfc.methods.start_crafting(_summoner, _item_type).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }else {
        contract_mfc.methods.stop_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
/*
async function _contract_crafting_with_heart(_summoner, _item_type_to_craft, _heart_required) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let wallet = await get_wallet(web3);
    let contract_mc = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let myListLength = await contract_mc.methods.myListLength(wallet).call();
    let myListsAt = await contract_mc.methods.myListsAt(wallet, 0, myListLength).call();
    let _array_heart = [0,0,0,0,0,0,0,0,0,0];
    let _heart_count = 0;
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[i];
        _items = await contract_mc.methods.items(_item).call();
        let _item_type = _items[0];
        if (_item_type == 193) {
            _array_heart[_heart_count] = _item;
            _heart_count += 1;
        }
        if (_heart_count >= _heart_required) {
            contract.methods.start_crafting_with_heart(_summoner, _item_type_to_craft, _array_heart).send({from:wallet});
            break
        }
    }
}
*/

//send mail
async function contract_send_mail(_summoner, _item_mail) {
    contract_mml.methods.send_mail(_summoner, _item_mail).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//open mail
async function contract_open_mail(_summoner) {
    contract_mml.methods.open_mail(_summoner).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//mint name
async function contract_mint_name(_summoner, _name_str) {
    contract_mfn.methods.mint(_summoner, _name_str).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//burn name
async function contract_burn_name(_summoner) {
    contract_mfn.methods.burn(_summoner).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//unpack_bag
async function unpack_bag(_summoner, _item) {
    contract_mfc.methods.unpack_bag(_summoner, _item).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//dice_roll
async function dice_roll(_summoner) {
    contract_wd.methods.dice_roll(_summoner).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//upgrade
async function upgrade_item(_summoner, _itemId1, _itemId2, _itemId3) {
    contract_mfc.methods.upgrade_item(_summoner, _itemId1, _itemId2, _itemId3).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//open presentbox
async function open_presentbox(_summoner, _itemId) {
    contract_mfc.methods.open_presentbox(_summoner, _itemId).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//voting
async function contract_voting(_summoner, _select) {
    contract_ff.methods.voting(_summoner, _select).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}

//end_voting
async function contract_end_voting(_summoner) {
    contract_ff.methods.end_voting(_summoner).send({from:wallet})
        .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
        .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
}


//===class========================================================


//---Murasakisan
class Murasakisan extends Phaser.GameObjects.Sprite{
    
    constructor(scene, x, y){
        super(scene, x, y, "murasaki_sleeping");
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);
        this.anims.play("murasaki_sleeping", true);
    	this.mode = "resting";
        this.submode = 0;
        this.count = 0;
        this.dist = "right";
        this.target_x = 0;
        this.target_y = 0;
        this.setInteractive();
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
    }
    
    set set_mode(mode){
        this.mode = mode;
        this.count = 0;
        if (item_bear.visible == false && this.mode != "grooming"){
            item_bear.visible = true;
        }
    }
    
    get get_mode(){
        return this.mode;
    }
    
    //### on_click
    on_click() {
        if (this.mode == "resting" || this.mode == "moving") {
            this.count = 0;
            this.mode = "hugging";
        }
    }
    
    //### resting
    resting(){
	    this.count += 1;
        if (this.count == 1) {
            if (this.dist == "right"){
                this.anims.play("murasaki_right", true);
            }else if (this.dist == "left") {
                this.anims.play("murasaki_left", true);
            }
            this.resting_count = 70 + Math.random() * 30;
	    }else if (this.count >= this.resting_count){
            let tmp = Math.random() * 100;
            if (tmp <= 5) {
                this.mode = "sleeping";
                this.count = 0;
            }else if (tmp <= 20 && satiety <= 10 && count_sync > 3) {
                this.mode = "hungry";
                this.count = 0;
            }else if (tmp <= 20 && happy <= 10 && count_sync > 3) {
                this.mode = "crying";
                this.count = 0;
            }else if (tmp <= 20 && flag_music == 1 && count_sync > 3) {
                this.mode = "listning";
                this.count = 0;
            }else {
                this.mode = "moving";
                this.count = 0;
            }
        }
    }
    
    //### moving
    moving() {
        this.count += 1;
        //determine direction
        if (this.count == 1){
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check, x
            if (this.x < 200 && this.moving_degree > 90 && this.moving_degree < 270) {
                this.moving_degree += 180;
            }else if (this.x > 1000 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree += 180;
            }
            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //out of area check, y
            if (this.y > 760 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 550 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //determine speed, count
            this.moving_speed = 0.6 + Math.random() * 0.4;  //0.5-0.8
            this.moving_count = 70 + Math.random() * 30;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.anims.play("murasaki_left", true);
            }else {
                this.dist = "right";
                this.anims.play("murasaki_right", true);
            }
        //moving
        }else if (this.count < this.moving_count) {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;

            //tokenBall
            if (
                flag_tokenBall == 1
                && this.count == 2 
                && Math.random()*100 >= 50
            ) {
                function checkOverlap(spriteA, spriteB) {
                    var boundsA = spriteA.getBounds();
                    boundsA.x += boundsA.width/4;
                    boundsA.y += boundsA.height/2;
                    boundsA.width /= 2;
                    boundsA.height /= 3;
                    var boundsB = spriteB.getBounds();
                    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
                }
                for (let i = 0; i < group_tokenBall.getLength(); i++) {
                    if (checkOverlap(this, group_tokenBall.getChildren()[i])){
                        group_tokenBall.getChildren()[i].on_click();
                        break;
                    }
                }
            }

            //star -> fluffy
            if (
                this.count == 3
                && Math.random()*100 >= 50
            ) {
                function checkOverlap(spriteA, spriteB) {
                    var boundsA = spriteA.getBounds();
                    boundsA.x += boundsA.width/4;
                    boundsA.y += boundsA.height/2;
                    boundsA.width /= 2;
                    boundsA.height /= 3;
                    var boundsB = spriteB.getBounds();
                    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
                }
                for (let i = 0; i < group_star.getLength(); i++) {
                    if (checkOverlap(this, group_star.getChildren()[i])){
                        group_star.getChildren()[i].on_kick();
                        break;
                    }
                }
            }

        //return to resting
        } else if (this.count >= this.moving_count) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    
    //### feeding
    feeding() {
        this.count += 1;
        if (this.submode == 0) {
            let delta_x = this.target_x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play("murasaki_feeding_happy_right", true);
            }else {
                this.dist = "left";
                this.anims.play("murasaki_feeding_happy_left", true);
            }
            this.submode = 1;
        }else if (this.submode == 1) {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            //let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.9;
            //let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.9;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 2.2;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 2.2;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-10 
              && this.x < this.target_x+10 
              && this.y > this.target_y-10 
              && this.y < this.target_y+10) {
                this.submode = 2;
            }
        }else if (this.submode == 2) {
            this.anims.play("murasaki_feeding", true);
            //group_food.destroy(true);
            sound_happy.play();
            //destroy group_food one by one
            if (group_food.getChildren().length > 0) {
                //group_food.getChildren()[group_food.getChildren().length - 1].destroy();
                group_food.getChildren()[Math.floor(Math.random() * group_food.getChildren().length)].destroy();
            } else {
                group_food.destroy(true);
            }
            this.count = 0;
            this.count_limit = this.count + 1150;
            this.submode = 3;
        }else if (this.submode == 3) {
            if (this.count % 200 == 0) {
                sound_happy.play();
                //destroy group_food one by one
                if (group_food.getChildren().length > 0) {
                    group_food.getChildren()[Math.floor(Math.random() * group_food.getChildren().length)].destroy();
                } else {
                    group_food.destroy(true);
                }
            }
            if (this.count >= this.count_limit) {
                this.mode = "resting";
                this.count = 0;
            }
        }
    }
    
    //### crying
    crying() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_crying", true);
        }else if (this.count >= 500) {
            this.mode = "resting";
            this.count = 0;
        }
        if (this.count % 200 == 10) {
            sound_unhappy.play();
        }
    }
    
    //### hungry
    hungry() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_hungry", true);
        }else if (this.count >= 500) {
            this.mode = "resting";
            this.count = 0;
        }
        if (this.count % 200 == 10) {
            sound_unhappy.play();
        }
    }
    
    //### petrified
    petrified() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_stone", true);
        }
    }
    
    //### sleeping
    sleeping() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_sleeping", true);
        }else if (this.count >= 1500) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    
    //### listning
    listning() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_listning", true);
        }else if (this.count >= 750) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    
    //### grooming
    grooming() {
        this.count += 1;
        if (this.submode == 0) {
            let delta_x = this.target_x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play("murasaki_feeding_happy_right", true);
            }else {
                this.dist = "left";
                this.anims.play("murasaki_feeding_happy_left", true);
            }
            this.submode = 1;
        }else if (this.submode == 1) {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 2.2;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 2.2;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-10 
              && this.x < this.target_x+10 
              && this.y > this.target_y-10 
              && this.y < this.target_y+10) {
                this.submode = 2;
            }
        }else if (this.submode == 2) {
            this.x = this.target_x;
            //this.y = this.target_y;
            this.y = this.target_y - 50;
            this.anims.play("murasaki_grooming", true);
            this.count_limit = this.count + 1500;
            this.submode = 3;
            item_bear.visible = false;
        }else if (this.submode == 3) {
            if (this.count % 200 == 10) {
                sound_happy.play();
            }
            if (this.count >= this.count_limit) {
                if (this.dist == "right"){
                    this.anims.play("murasaki_right", true);
                }else if (this.dist == "left") {
                    this.anims.play("murasaki_left", true);
                }
                this.x = 1000 - 50
                this.y = 400 + 80
                this.mode = "resting";
                this.count = 0;
                item_bear.visible = true;
            }
        }
    }
    
    //### mining
    mining() {
        this.count += 1;
        if (this.submode == 0) {
            let delta_x = this.target_x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play("murasaki_working_right", true);
            }else {
                this.dist = "left";
                this.anims.play("murasaki_working_left", true);
            }
            this.submode = 1;
        }else if (this.submode == 1) {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-10 
              && this.x < this.target_x+10 
              && this.y > this.target_y-10 
              && this.y < this.target_y+10) {
                this.submode = 2;
            }
        }else if (this.submode == 2) {
            this.anims.play("murasaki_mining", true);
            if (this.count % 400 == 10) {
                sound_mining_during.play();
            }
            if (happy <= 0) {
                this.anims.play("murasaki_sleeping", true);
                this.submode = 3;
            }
        }
    }
    
    //### hugging
    hugging() {
        this.count += 1;
        if (this.count % 200 == 50) {
            sound_happy.play();
        }
        if (this.count == 1){
            this.anims.play("murasaki_click", true);
        }else if (this.count >= 300) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    
    //### farming
    farming() {
        this.count += 1;
        if (this.submode == 0) {
            let delta_x = this.target_x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play("murasaki_working_right", true);
            }else {
                this.dist = "left";
                this.anims.play("murasaki_working_left", true);
            }
            this.submode = 1;
        }else if (this.submode == 1) {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-10 
              && this.x < this.target_x+10 
              && this.y > this.target_y-10 
              && this.y < this.target_y+10) {
                this.submode = 2;
            }
        }else if (this.submode == 2) {
            this.anims.play("murasaki_farming", true);
            if (this.count % 400 == 10) {
                sound_farming_during.play();
            }
            if (happy <= 0) {
                this.anims.play("murasaki_sleeping", true);
                this.submode = 3;
            }
        }
    }
    
    //### crafting
    crafting() {
        this.count += 1;
        if (this.submode == 0) {
            let delta_x = this.target_x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play("murasaki_working_right", true);
            }else {
                this.dist = "left";
                this.anims.play("murasaki_working_left", true);
            }
            this.submode = 1;
        }else if (this.submode == 1) {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-10 
              && this.x < this.target_x+10 
              && this.y > this.target_y-10 
              && this.y < this.target_y+10
            ) {
                this.submode = 2;
            }
        }else if (this.submode == 2) {
            this.anims.play("murasaki_crafting", true);
            if (this.count % 500 == 10) {
                sound_crafting_during.play();
            }
        }
    }
    
    //### attenting
    try_attenting(target_x, target_y) {
        if (this.mode == "resting"
            || this.mode == "moving"
        ) {
            this.mode = "attenting";
            this.submode = 0;
            this.target_x = target_x;
            this.target_y = target_y;
        }
    }
    attenting(){
        if (this.submode == 0) {
            //this.target_x = target_x;
            //this.target_y = target_y;
            let delta_x = this.target_x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play("murasaki_right", true);
            }else {
                this.dist = "left";
                this.anims.play("murasaki_left", true);
            }
            this.submode += 1;
        } else if (this.submode == 1) {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-75 
              && this.x < this.target_x+75 
              && this.y > this.target_y-25 
              && this.y < this.target_y+25) {
                this.submode = 2;
            }
        } else if (this.submode == 2) {
            this.mode = "hugging";
            this.submode = 0;
            this.count = 0;
        }
    }
    
    //### update wearing_hat
    update_item_wearing_hat() {

        if (
            this.mode == "resting"
            || this.mode == "moving"
            || this.mode == "hugging"
            || this.mode == "hungry"
            || this.mode == "crying"
            || this.mode == "listning"
            || this.mode == "attenting"
        ) {
            item_wearing_hat.x = this.x;
            item_wearing_hat.y = this.y - 65;
        }else if (this.mode == "sleeping") {
            item_wearing_hat.x = this.x - 26;
            item_wearing_hat.y = this.y - 22;
        }else if (this.mode == "mining" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "mining" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "mining" && this.submode == 2) {
            item_wearing_hat.x = this.x + 27;
            item_wearing_hat.y = this.y - 72;
        }else if (this.mode == "farming" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "farming" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "farming" && this.submode == 2) {
            item_wearing_hat.x = this.x + 25;
            item_wearing_hat.y = this.y - 55;
        }else if (this.mode == "crafting" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "crafting" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 7;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "crafting" && this.submode == 2) {
            item_wearing_hat.x = this.x + 0;
            item_wearing_hat.y = this.y - 80;
        }else if (this.mode == "feeding" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 8;
            item_wearing_hat.y = this.y - 55;
        }else if (this.mode == "feeding" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 8;
            item_wearing_hat.y = this.y - 55;
        }else if (this.mode == "feeding" && this.submode == 3) {
            item_wearing_hat.x = this.x - 2;
            item_wearing_hat.y = this.y - 65;
        }else if (this.mode == "grooming" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 8;
            item_wearing_hat.y = this.y - 55;
        }else if (this.mode == "grooming" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 8;
            item_wearing_hat.y = this.y - 55;
        }else if (this.mode == "grooming" && this.submode == 3) {
            item_wearing_hat.x = this.x - 25;
            item_wearing_hat.y = this.y + 45;
        }
        //ajustment
        if (typeof item_hat_helmet != "undefined" && item_wearing_hat == item_hat_helmet) {
            item_wearing_hat.x += 0;
            item_wearing_hat.y += 5;
        } else if (typeof item_hat_mortarboard != "undefined" && item_wearing_hat == item_hat_mortarboard) {
            item_wearing_hat.x += 4;
            item_wearing_hat.y += 8;
        }
        //depth
        item_wearing_hat.depth = this.y + 1;
    }
    
    //### update()
    update(){
        if (count_sync > 0 && local_level > 0) {
            if (this.mode == "resting") {this.resting();}
            else if (this.mode == "moving") {this.moving();}
            else if (this.mode == "feeding") {this.feeding();}
            else if (this.mode == "crying") {this.crying();}
            else if (this.mode == "sleeping") {this.sleeping();}
            else if (this.mode == "grooming") {this.grooming();}
            else if (this.mode == "mining") {this.mining();}
            else if (this.mode == "hugging") {this.hugging();}
            else if (this.mode == "farming") {this.farming();}
            else if (this.mode == "crafting") {this.crafting();}
            else if (this.mode == "hungry") {this.hungry();}
            else if (this.mode == "petrified") {this.petrified();}
            else if (this.mode == "listning") {this.listning();}
            else if (this.mode == "attenting") {this.attenting();}
            //draw item_wearing_hat
            if (item_wearing_hat != 0) {
                this.update_item_wearing_hat();
            }
            //depth
            this.depth = this.y;
        }
    }
}


//---Neon


class Neon extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, sprite_right, sprite_left){
        super(scene, x, y, sprite_right);
        this.scene.add.existing(this);
        this.sprite_right = sprite_right;
        this.sprite_left = sprite_left;
        this.anims.play(sprite_right, true);
    	this.mode = "resting";
        this.submode = 0;
        this.count = 0;
        this.dist = "right";
        this.target_x = 0;
        this.target_y = 0;
        this.depth = 9999+2;
        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
    }

    //### on_click
    on_click(){
        summon_star(this.scene);
    }

    //### resting
    resting(){
	    this.count += 1;
        if (this.count == 1) {
            if (this.dist == "right"){
                this.anims.play(this.sprite_right, true);
            }else if (this.dist == "left") {
                this.anims.play(this.sprite_left, true);
            }
            this.resting_count = 200 + Math.random() * 50;
	    }else if (this.count >= this.resting_count){
            this.mode = "moving";
            this.count = 0;
        }
    }

    //### moving
    moving() {
        this.count += 1;
        //determine direction
        if (this.count == 1){
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check
            if (this.x < 100 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1000 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }
            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //out of area check, y
            if (this.y > 450 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 50 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }
            //determine speed, count
            //this.moving_speed = 0.2 + Math.random() * 0.1;  //0.3-0.5
            this.moving_speed = 0.3 + Math.random() * 0.2;  //0.3-0.5
            this.moving_count = 70 + Math.random() * 30;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.anims.play(this.sprite_left, true);
            }else {
                this.dist = "right";
                this.anims.play(this.sprite_right, true);
            }
        //moving
        }else if (this.count < this.moving_count) {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
        //return to resting
        }else if (this.count >= this.moving_count) {
            this.mode = "resting";
            this.count = 0;
        }
    }

    //### update()
    update(){
        if (this.mode == "resting") {this.resting();}
        else if (this.mode == "moving") {this.moving();}
    }
}


//---Pet


class Pet extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, sprite_right, sprite_left, type){
        super(scene, x, y, sprite_right);
        this.scene.add.existing(this);
        this.sprite_right = sprite_right;
        this.sprite_left = sprite_left;
        this.type = type;
        this.anims.play(sprite_right, true);
    	this.mode = "resting";
        this.submode = 0;
        this.count = 0;
        this.dist = "right";
        this.target_x = 0;
        this.target_y = 0;
        this.setInteractive()
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
    }
    set set_mode(mode){
        this.mode = mode;
        this.count = 0;
    }
    get get_mode(){
        return this.mode;
    }

    //### on_click
    on_click() {
        /*
        if (this.mode == "resting" || this.mode == "moving") {
            this.count = 0;
            this.mode = "hugging";
        }
        */
    }

    //### resting
    resting(){
	    this.count += 1;
        if (this.count == 1) {
            if (this.dist == "right"){
                this.anims.play(this.sprite_right, true);
            }else if (this.dist == "left") {
                this.anims.play(this.sprite_left, true);
            }
            this.resting_count = 200 + Math.random() * 50;
	    }else if (this.count >= this.resting_count){
	        if (murasakisan.mode == this.type){
	            this.mode = "working";
	            if (this.type == "mining") {
    	            this.target_x = murasakisan.target_x + 50;
    	            this.target_y = murasakisan.target_y + 20;
    	        } else if (this.type == "farming") {
    	            this.target_x = murasakisan.target_x + 45;
    	            this.target_y = murasakisan.target_y + 45;
    	        } else if (this.type == "crafting") {
    	            this.target_x = murasakisan.target_x + 45;
    	            this.target_y = murasakisan.target_y + 20;
    	        }
	            this.count = 0;
	            this.submode = 0;
	        } else {
                let tmp = Math.random() * 100;
                this.mode = "moving";
                this.count = 0;
            }
        }
    }

    //### moving
    moving() {
        this.count += 1;
        //determine direction
        if (this.count == 1){
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check
            if (this.x < 100 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1100 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }
            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //out of area check, y
            if (this.y > 860 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 500 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }
            //determine speed, count
            //this.moving_speed = 0.2 + Math.random() * 0.1;  //0.3-0.5
            this.moving_speed = 0.3 + Math.random() * 0.2;  //0.3-0.5
            this.moving_count = 70 + Math.random() * 30;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.anims.play(this.sprite_left, true);
            }else {
                this.dist = "right";
                this.anims.play(this.sprite_right, true);
            }
        //moving
        }else if (this.count < this.moving_count) {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
        //return to resting
        }else if (this.count >= this.moving_count) {
            this.mode = "resting";
            this.count = 0;
        }
    }

    //### working
    working() {
        this.count += 1;
        if (this.submode == 0) {
            let delta_x = this.target_x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play(this.sprite_right, true);
            }else {
                this.dist = "left";
                this.anims.play(this.sprite_left, true);
            }
            this.submode = 1;
        }else if (this.submode == 1) {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 0.6;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 0.6;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-1 
              && this.x < this.target_x+1 
              && this.y > this.target_y-1 
              && this.y < this.target_y+1) {
                this.dist = "left";
                this.anims.play(this.sprite_left, true);
                this.submode = 2;
            }
        }else if (this.submode == 2) {
            if (murasakisan.mode != this.type) {
                this.mode = "resting";
                this.count = 0;
            }
        }
    }

    //### sleeping
    /*
    sleeping() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_sleeping", true);
        }else if (this.count >= 1000) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    */

    //### update wearing_hat
    update_item_wearing_hat() {
        if (this.type == "mining") {
            //right or left
            if (this.dist == "right") {
                item_wearing_hat_pet[1].x = this.x-9;
            } else {
                item_wearing_hat_pet[1].x = this.x+10;
            }
            //frame adjustment
            if (
                (this.frame.name == 0 && this.dist == "right")
                || (this.frame.name == 1 && this.dist == "left")
            ) {
                item_wearing_hat_pet[1].y = this.y-22;
            } else {
                item_wearing_hat_pet[1].y = this.y-24;
            }
            //depth
            item_wearing_hat_pet[1].depth = this.y + 1;
        } else if (this.type == "farming") {
            //right or left
            if (this.dist == "right") {
                item_wearing_hat_pet[1].x = this.x;
            } else {
                item_wearing_hat_pet[1].x = this.x+1;
            }
            //frame adjustment
            if (
                (this.frame.name == 1 && this.dist == "right")
                || (this.frame.name == 0 && this.dist == "left")
            ) {
                item_wearing_hat_pet[1].y = this.y-24;
            } else {
                item_wearing_hat_pet[1].y = this.y-27;
            }
            //depth
            item_wearing_hat_pet[1].depth = this.y + 1;
        } else if (this.type == "crafting") {
            //right or left
            if (this.dist == "right") {
                item_wearing_hat_pet[1].x = this.x;
            } else {
                item_wearing_hat_pet[1].x = this.x+2;
            }
            //frame adjustment
            if (
                (this.frame.name == 1 && this.dist == "right")
                || (this.frame.name == 0 && this.dist == "left")
            ) {
                item_wearing_hat_pet[1].y = this.y-29;
            } else {
                item_wearing_hat_pet[1].y = this.y-31;
            }
            //depth
            item_wearing_hat_pet[1].depth = this.y + 1;
        }
    }

    //### update()
    update(){
        if (this.mode == "resting") {this.resting();}
        else if (this.mode == "moving") {this.moving();}
        //else if (this.mode == "sleeping") {this.sleeping();}
        else if (this.mode == "working") {this.working();}
        //depth
        this.depth = this.y;
        //draw item_wearing_hat
        if (item_wearing_hat_pet != 0 && item_wearing_hat_pet[0] == this.type) {
            this.update_item_wearing_hat();
        }
    }
}


//---HomeCat


class HomeCat extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y){
        super(scene, x, y);
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);
        this.submode = 0;
        this.on("pointerdown", async () => {
            if (local_items[196] > 0) {
                sound_button_on.play();
                let _array_item_196 = await get_userItems(summoner, 196);
                contract_send_mail(summoner, _array_item_196[0]);
            }
        });
        this.on("pointerover", () => {
            if (local_items[196] > 0) {
                sound_button_select.play();
                this.anims.play("cat_standing_withMail", true);
            }
        });
        this.on("pointerout", () => {
            if (local_items[196] > 0) {
                this.anims.play("cat_standing", true);
            }
        });
        this.disableInteractive();
        this.firstDecideMode();
    }
    
    //### first
    firstDecideMode(){
        if (local_mail_sending_interval == 0) {
            this.mode = "standing";
        } else if (local_mail_sending_interval > 0 && local_lastMailOpen == 1){
            this.mode = "sleeping";
        } else {
            this.mode = "leaving";
        }
        this.submode = 0;
    }
    
    //### standing
    //: mailInterval = 0
    //check click, check interval, change to mode:mailSending
    standing(){
        if (this.submode == 0) {
            this.anims.play("cat_standing", true);
            this.setInteractive({ useHandCursor: true });
            this.submode += 1;
        } else {
            if (turn % 100 == 0) {
                if (local_mail_sending_interval > 0) {
                    this.mode = "mailSending";
                    this.submode = 0;
                }
            }
        }
    }
    
    //### mailSending
    //, mailInterval > 0
    //just after mailSending tx, change to mode:leaving
    mailSending(){
        if (this.submode == 0) {
            this.speed_x = 1;
            this.speed_y = 0.5 + Math.random() * 0.5;
            this.disableInteractive();
            this.anims.play("cat_walking_right_withMail_fast", true);
            sound_cat1.play();
            this.submode += 1;
        } else {
            this.x += this.speed_x;
            this.y += this.speed_y;
            if (this.x >= 1400 || this.y >= 1100) {
                this.mode = "leaving";
                this.submode = 0;
            }
        }
    }
    
    //### leaving
    //, mailIntervail > 0 and lastMailOpen = false
    //check lastMailOpen, change to mode:goingHome
    leaving(){
        if (this.submode == 0) {
            this.anims.isPlaying = false;
            this.disableInteractive();
            this.submode += 1;
        } else {
            if (turn % 100 == 0) {
                if (local_lastMailOpen == 1 || local_mail_sending_interval == 0) {
                    this.mode = "goingHome";
                    this.submode = 0;
                }
            }
        }
    }
    
    //### goingHome
    //, lastMailOpen = true
    //just after mailOpen, change to mode:sleeping
    goingHome(){
        if (this.submode == 0) {
            this.anims.play("cat_walking_left_fast", true);
            this.disableInteractive();
            this.x = 1300;
            this.y = 800 + Math.random() * 200; 
            this.target_x = 90;
            this.target_y = 610;
            sound_cat2.play();
            this.submode += 1;
        } else {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-10 
              && this.x < this.target_x+10 
              && this.y > this.target_y-10 
              && this.y < this.target_y+10) {
                this.mode = "sleeping";
                this.submode = 0;
            }
        }
    }

    //### sleeping
    //, mailInterval > 0 and lastMailOpen = true
    //check mailInterval, change to mode:standing
    sleeping(){
        if (this.submode == 0){
            this.x = 90;
            this.y = 610;
            this.disableInteractive();
            this.anims.play("cat_sleeping", true);
            this.submode += 1;
        } else {
            if (turn % 100 == 0) {
                if (local_mail_sending_interval == 0) {
                    this.mode = "standing";
                    this.submode = 0;
                }
            }
        }
    }
    
    //### update()
    update(){
        if (this.mode == "sleeping") {this.sleeping();}
        else if (this.mode == "standing") {this.standing();}
        else if (this.mode == "mailSending") {this.mailSending();}
        else if (this.mode == "leaving") {this.leaving();}
        else if (this.mode == "goingHome") {this.goingHome();}
        this.depth = this.y;
    }
}


//---VisitorCat


class VisitorCat extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y, summoner_from_id, summoner_from_name){
        super(scene, x, y);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.summoner_from_id = summoner_from_id;
        this.summoner_from_name = summoner_from_name;
        this.scene.add.existing(this);
        this.submode = 0;
        this.firstDecideMode();
        let _text = " Mail from " + summoner_from_name + " ";
        let _arg = {
            font: "20px Arial", 
            fill: "#000000", 
            backgroundColor: "#ffffff"
        };
        this.text = this.scene.add.text(this.x, this.y-60, _text, _arg )
            .setOrigin(0.5)
            .setVisible(false)
            .setDepth(9999);
        this.on("pointerdown", () => {
            sound_button_on.play();
            contract_open_mail(summoner);
        });
        this.on("pointerover", () => {
            sound_button_select.play();
            this.text.setVisible(true);
            setTimeout( () => {
                this.text.setVisible(false);
            }, 3000)
        });
    }
    
    //### first
    firstDecideMode(){
        this.mode = "visiting";
        this.submode = 0;
    }
    
    //### visiting
    visiting(){
        if (this.submode == 0){
            this.anims.play("cat_walking_left_withMail_fast", true);
            this.x = 1300;
            this.y = 600 + Math.random() * 200; 
            this.target_x = 400 + Math.random()*400;
            this.target_y = 500 + Math.random()*200;
            sound_cat1.play();
            this.submode += 1;
        } else {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-10 
              && this.x < this.target_x+10 
              && this.y > this.target_y-10 
              && this.y < this.target_y+10) {
                this.mode = "standing";
                this.submode = 0;
            }
        }
    }
    
    //### standing
    standing(){
        if (this.submode == 0){
            this.standing_count = 1000 + Math.random()*1000;
            this.anims.play("cat_standing_withMail", true);
            this.setInteractive({ useHandCursor: true });
            this.submode += 1;
        } else if (this.submode < this.standing_count)  {
            this.submode += 1;
        } else {
            let _rand = Math.random()*100;
            if (_rand <= 95) {
                this.mode = "moving";
            } else {
                this.mode = "sleeping";
            }
            this.submode = 0;
        }
    }
    
    //### moving
    moving(){
        if (this.submode == 0){
            this.disableInteractive();
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check
            if (this.x < 100 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1100 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }
            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //out of area check, y
            if (this.y > 860 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 500 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }
            //determine speed, count
            //this.moving_speed = 0.2 + Math.random() * 0.1;  //0.3-0.5
            this.moving_speed = 0.3 + Math.random() * 0.2;  //0.3-0.5
            this.moving_count = 200 + Math.random() * 200;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.anims.play("cat_walking_left_withMail", true);
            }else {
                this.dist = "right";
                this.anims.play("cat_walking_right_withMail", true);
            }
            this.submode += 1;
        } else {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.submode += 1;
            if (this.submode >= this.moving_count){
                this.mode = "standing";
                this.submode = 0;
            }
        }
    }
    
    //### sleeping
    sleeping(){
        if (this.submode == 0){
            this.anims.play("cat_sleeping_withMail", true);
            this.disableInteractive();
            this.submode += 1;
        } else {
            this.submode += 1;
            if (this.submode >= 4000) {
                this.mode = "standing";
                this.submode = 0;
            }
        }
    }
    
    //### goingHome
    goingHome(){
        if (this.submode == 0){
            this.speed_x = -1;
            this.speed_y = Math.random() * 1;
            this.disableInteractive();
            this.anims.play("cat_walking_left_fast", true);
            sound_cat2.play();
            this.submode += 1;
        } else {
            this.x += this.speed_x;
            this.y += this.speed_y;
            if (this.x < -100) {
                cat_visitor.destroy();
            }
        }
    }
        
    //### update()
    update(){
        if (this.mode == "visiting") {this.visiting();}
        else if (this.mode == "standing") {this.standing();}
        else if (this.mode == "moving") {this.moving();}
        else if (this.mode == "sleeping") {this.sleeping();}
        else if (this.mode == "goingHome") {this.goingHome();}
        this.depth = this.y;
        this.text.x = this.x;
        this.text.y = this.y - 60;
        if (turn % 100 == 0) {
            if (local_receiving_mail == 0 && this.mode != "goingHome") {
                this.mode = "goingHome";
                this.submode = 0;
            }
        }
    }
}


//---Dice

class Dice extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, "item_dice");
        this.scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.speed_x = 0;
        this.speed_y = 0;
        this.text_rolled_number = scene.add.text(x, y, "88", {font: "bold 20px Arial", fill: "#ffffff"}).setOrigin(0.5);
        this.text_next_time = scene.add.text(x, y+40, "---", {font: "14px Arial", fill: "#000000"}).setOrigin(0.5);
        group_info.add(this.text_next_time);
        this.flag_tx = 0;
        this.count = 0;
        this.line_y = y;      //initial value of line_y, the same as first position of y
        this.line_y_max = 500;  //max floor position
        this.line_y_min = 620;
        this.line_x_r = 1200;   //right side
        this.line_x_l = 50;     //left side
        //contract parameter
        //this.limit_per = 0.9;
        this.buffer_sec = 60 * 60 * 4;  // 4hr
        this.on("pointerover", () => {
            if (this.flag_tx == 1) {
                this.setTexture("item_dice_pointerover");
                sound_button_select.play();
            }
        });
        this.on("pointerout", () => {this.setTexture("item_dice");} );
    }
    
    //### on_click
    on_click() {
        this.speed_x = 8 + Math.random() * 5;
        
        /*
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        */
        
        //DOES NOT WORK in phone
        if (pointer_x > this.x) {
        //if (game.input.mousePointer.x > this.x) {
        //if (game.input.activePointer.position.x > this.x) {
        //if (game.input.pointer1.x > this.x) {
            this.speed_x *= -1;
        }

        this.speed_y = 8 + Math.random() * 5;
        this.count = 0;
        this.text_rolled_number.visible = false;
        this.text_next_time.visible = false;
        if (this.flag_tx == 1) {
            dice_roll(summoner);
            flag_dice_rolling = 1;
        }
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        sound_dice.play();
    }
    
    //### update()
    update(){
        this.count += 1;
        //dept
        this.depth = this.line_y;
        this.text_rolled_number.depth = this.line_y + 1;
        //update text
        if (this.count % 200 == 1) {
            //update rooled number
            this.text_rolled_number.setText(local_last_rolled_dice/10);
            //update next roll time
            let _now = Date.now() / 1000;
            let _delta_sec = _now - local_last_dice_roll_time;
            let _next_sec = BASE_SEC - _delta_sec * SPEED;
            if (_next_sec >= BASE_SEC) {
                _next_sec = BASE_SEC - 1;
            }
            if (_next_sec <= 0) {
                this.text_next_time.setText("Dice Roll").setFill("#ff0000");
                this.flag_tx = 1;
            } else if (_next_sec <= this.buffer_sec * 0.95 ) {
                let _hr = Math.floor(_next_sec % 86400 / 3600);
                let _min = Math.floor(_next_sec % 3600 / 60);
                let _text = _hr + "h:" + _min + "m";
                this.text_next_time.setText(_text).setFill("#ff0000");
                this.flag_tx = 1;
            } else {
                let _hr = Math.floor(_next_sec % 86400 / 3600);
                let _min = Math.floor(_next_sec % 3600 / 60);
                let _text = _hr + "h:" + _min + "m";
                this.text_next_time.setText(_text).setFill("#000000");
                this.flag_tx = 0;
                flag_dice_rolling = 0;
            }
        }
        //check speed
        if (
            Math.abs(this.speed_x) <= 0.5
            && Math.abs(this.speed_y) <= 0.5
            && this.line_y - this.y <= 1
        ) {
            //when stop
            this.text_rolled_number.visible = true;
            this.text_rolled_number.x = this.x;
            this.text_rolled_number.y = this.y;
            if (flag_info == 1) {
                this.text_next_time.visible = true;
            }
            this.text_next_time.x = this.x;
            this.text_next_time.y = this.y + 40;
        } else {
            //when moving
            //define line_y
            this.line_y = this.b - this.a * this.x;
            if (this.line_y < this.line_y_max) {
                this.line_y = this.line_y_max;
            }
            if (this.line_y > this.line_y_min) {
                this.line_y = this.line_y_min;
            }
            //reducing x speed, -/+
            if (this.speed_x > 0) {
                //friction, when speed_y = 0
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x -= 0.1 * 2.5;
                } else {
                    this.speed_x -= 0.1;
                }
            } else {
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x += 0.1 * 2.5;
                } else {
                    this.speed_x += 0.1;
                }
            }
            //reduction of y speed
            //this.speed_y -= 0.98;
            this.speed_y -= 0.75;
            //position moving
            this.x += this.speed_x;
            this.y -= this.speed_y;
            //increase angle
            this.angle += this.speed_x * 3;
            //refrection y
            if (this.y >= this.line_y) {
                this.y = this.line_y;
                this.speed_y *= -0.3;   //bounce coefficient
                if (Math.abs(this.speed_y) > 0.5) {
                    sound_dice_impact.play();
                }
            }
            //refrection x
            if (this.y > 500) {
                this.line_x_r = (this.y + 115746/205)/(208/205);
            } else {
                this.line_x_r = 1060;
            }
            if (this.x >= this.line_x_r) {
                this.x = this.line_x_r;
                this.speed_x *= -0.9;   //bounce coefficient
                sound_dice_impact.play();
            } else if (this.x <= this.line_x_l) {
                this.x = this.line_x_l;
                this.speed_x *= -0.9;
                sound_dice_impact.play();
            }
        }
        //dice rolling
        if (flag_dice_rolling == 1 && this.count % 4 == 0) {
            //this.text_rolled_number.setText(Math.round(Math.random()*20));
            this.text_rolled_number.setText(this.count / 2 % 20 + 1);
            this.text_next_time.setText("Rolling!").setFill("#ff0000");
        }
    }
}


//---TokenBall


class tokenBall extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img){
        super(scene, x, y, img);
        this.scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.speed_x = 0;
        this.speed_y = 0;
        this.count = 0;
        this.line_y = y;      //initial value of line_y, the same as first position of y
        this.line_y_max = 500;  //max floor position
        this.line_y_min = 800;
        this.line_x_r = 1200;   //right side
        this.line_x_l = 50;     //left side
    }
    
    //### on_click
    on_click() {
        this.speed_x = 6 + Math.random() * 4;
        //this.speed_x = 8 + Math.random() * 5;
        
        /*
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        */
        
        //DOES NOT WORK in phone
        if (pointer_x > this.x) {
        //if (game.input.mousePointer.x > this.x) {
        //if (game.input.activePointer.position.x > this.x) {
        //if (game.input.pointer1.x > this.x) {
            this.speed_x *= -1;
        }

        this.speed_y = 6 + Math.random() * 4;
        //this.speed_y = 8 + Math.random() * 5;
        this.count = 0;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        sound_dice.play();
    }
    
    //### on_summon
    on_summon() {
        this.speed_x = -1 * (5 + Math.random() * 10);
        this.speed_y = 8 + Math.random() * 8;
        //this.speed_y = 5 + Math.random() * 5;
        this.count = 0;
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        //sound_dice.play();
    }
    
    //### update()
    update(){
        this.count += 1;
        /*
        if (this.count % 2 == 0) {
            return 0;
        }
        */
        //dept
        //this.depth = this.line_y;
        //check speed
        if (
            Math.abs(this.speed_x) <= 0.5
            && Math.abs(this.speed_y) <= 0.5
            && this.line_y - this.y <= 1
        ) {
            ;
        } else {
            //when moving
            //define line_y
            this.line_y = this.b - this.a * this.x;
            if (this.line_y < this.line_y_max) {
                this.line_y = this.line_y_max;
            }
            if (this.line_y > this.line_y_min) {
                this.line_y = this.line_y_min;
            }
            //reducing x speed, -/+
            if (this.speed_x > 0) {
                //friction, when speed_y = 0
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x -= 0.1 * 2;
                } else {
                    this.speed_x -= 0.1;
                }
            } else {
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x += 0.1 * 2;
                } else {
                    this.speed_x += 0.1;
                }
            }
            //reduction of y speed
            //this.speed_y -= 0.98;
            this.speed_y -= 0.75;
            //position moving
            this.x += this.speed_x;
            this.y -= this.speed_y;
            //increase angle
            this.angle += this.speed_x * 5;
            //refrection y
            if (this.y >= this.line_y) {
                this.y = this.line_y;
                //this.speed_y *= -0.5;   //bounce coefficient
                this.speed_y *= -0.3;   //bounce coefficient
                if (Math.abs(this.speed_y) > 0.5) {
                    sound_dice_impact.play();
                }
            }
            //refrection x
            if (this.x >= this.line_x_r) {
                this.x = this.line_x_r;
                this.speed_x *= -0.9;   //bounce coefficient
                sound_dice_impact.play();
            } else if (this.x <= this.line_x_l) {
                this.x = this.line_x_l;
                this.speed_x *= -0.9;
                sound_dice_impact.play();
            }
        }
    }
}


//---Star
class Star extends Phaser.GameObjects.Sprite{
    //constructor(scene, x, y, sprite_right, sprite_left){
    constructor(scene, x, y, img){
        super(scene, x, y, img);
        this.scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.speed_x = 0;
        this.speed_y = 0;
        this.count = 0;
        this.line_y = y;      //initial value of line_y, the same as first position of y
        this.line_y_max = 500;  //max floor position
        this.line_y_min = 800;
        this.line_x_r = 1200;   //right side
        this.line_x_l = 50;     //left side
    }
    
    //### on_click
    on_click() {
        this.speed_x = 6 + Math.random() * 4;
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 6 + Math.random() * 4;
        this.count = 0;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        sound_dice.play();
    }
    
    //### on_summon
    on_summon() {
        this.x = 800 + Math.random() * 600;
        this.y = -50;
        this.speed_x = -10 - Math.random() * 5;
        this.speed_y = -10;
        this.count = 0;
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.line_y_max+100 + this.a * this.x;
        //sound
        sound_star.play();
    }
    
    //### update()
    update(){
        this.count += 1;
        
        //dept
        //this.depth = this.line_y;
        //check speed
        if (
            Math.abs(this.speed_x) <= 0.5
            && Math.abs(this.speed_y) <= 0.5
            && this.line_y - this.y <= 1
        ) {
            ;
        } else {
            //when moving
            //define line_y
            this.line_y = this.b - this.a * this.x;
            if (this.line_y < this.line_y_max) {
                this.line_y = this.line_y_max;
            }
            if (this.line_y > this.line_y_min) {
                this.line_y = this.line_y_min;
            }
            //reducing x speed, -/+
            if (this.speed_x > 0) {
                //friction, when speed_y = 0
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x -= 0.1 * 2.5;
                } else {
                    this.speed_x -= 0.1;
                }
            } else {
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x += 0.1 * 2.5;
                } else {
                    this.speed_x += 0.1;
                }
            }
            //reduction of y speed
            this.speed_y -= 0.75;
            //position moving
            this.x += this.speed_x;
            this.y -= this.speed_y;
            //increase angle
            this.angle += this.speed_x * 5;
            //refrection y
            if (this.y >= this.line_y) {
                this.y = this.line_y;
                this.speed_y *= -0.3;   //bounce coefficient
                if (Math.abs(this.speed_y) > 0.5) {
                    sound_dice_impact.play();
                }
            }
            //refrection x
            if (this.x >= this.line_x_r) {
                this.x = this.line_x_r;
                this.speed_x *= -0.9;   //bounce coefficient
                sound_dice_impact.play();
            } else if (this.x <= this.line_x_l) {
                this.x = this.line_x_l;
                this.speed_x *= -0.9;
                sound_dice_impact.play();
            }
        }

        //light control
        if (flag_onLight == true) {
            this.depth = 3;
        } else {
            this.depth = 9999+12;
        }

    }
}


//---Fluffy
//***TODO***
/*
class Fluffy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img, rarity, itemId, type){
        super(scene, x, y, img);
        this.scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.speed_x = 0;
        this.speed_y = 0;
        this.line_y = y;        //initial value of line_y, the same as first position of y
        this.line_y_max = 500;  //max floor position
        this.line_y_min = 800;
        this.line_x_r = 1200;   //right side
        this.line_x_l = 50;     //left side
        this.mode = "";
        this.submode = 0;
        this.resting_count = 200;
        this.rarity = rarity;
        this.itemId = itemId;
        this.type = type;
        if (this.rarity == "common") {
            ;
        } else if (this.rarity == "uncommon") {
            this.anims.play("fluffy_fluffier_01", true);
        } else if (this.rarity == "rare") {
            
        }
    }
    
    //### on_click
    on_click() {
        this.speed_x = 6 + Math.random() * 4;
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 6 + Math.random() * 4;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        sound_dice.play();
        this.mode = "rolling";
    }
    
    //### on_summon
    on_summon() {
        //pos
        this.x = 300 + Math.random() * 500;
        this.y = 600 + Math.random() * 100;
        //on click with modified speed
        this.speed_x = 6 + Math.random() * 4;
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 10 + Math.random() * 4;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        //sound_fluffy.play();
        this.mode = "rolling";
    }
    
    //### rolling
    rolling(){
        //define line_y
        this.line_y = this.b - this.a * this.x;
        if (this.line_y < this.line_y_max) {
            this.line_y = this.line_y_max;
        }
        if (this.line_y > this.line_y_min) {
            this.line_y = this.line_y_min;
        }

        //reducing x speed, -/+
        if (this.speed_x > 0) {
            //friction, when speed_y = 0
            if (Math.abs(this.speed_y) <= 0.5) {
                this.speed_x -= 0.1 * 2.5;
            } else {
                this.speed_x -= 0.1;
            }
        } else {
            if (Math.abs(this.speed_y) <= 0.5) {
                this.speed_x += 0.1 * 2.5;
            } else {
                this.speed_x += 0.1;
            }
        }

        //reduction of y speed
        this.speed_y -= 0.75;

        //position moving
        this.x += this.speed_x;
        this.y -= this.speed_y;

        //increase angle
        this.angle += this.speed_x * 5;

        //refrection y
        if (this.y >= this.line_y) {
            this.y = this.line_y;
            this.speed_y *= -0.3;   //bounce coefficient
            if (Math.abs(this.speed_y) > 0.5) {
                sound_dice_impact.play();
            }
        }

        //refrection x
        //limit_y_right: y = (208/205)x - (115746/205)
        if (this.y > 500) {
            this.line_x_r = (this.y + 115746/205)/(208/205);
        } else {
            this.line_x_r = 1060;
        }
        if (this.x >= this.line_x_r) {
            this.x = this.line_x_r;
            this.speed_x *= -0.9;   //bounce coefficient
            sound_dice_impact.play();
        } else if (this.x <= this.line_x_l) {
            this.x = this.line_x_l;
            this.speed_x *= -0.9;
            sound_dice_impact.play();
        }
        
        //check speed
        if (
            Math.abs(this.speed_x) <= 0.5
            && Math.abs(this.speed_y) <= 0.5
            && this.line_y - this.y <= 1
        ) {
            this.mode = "resting";
            this.submode = 0
        }
    }
    
    //### resting
    resting() {
        //low rarity, do nothing
        if (this.rarity == "common" || this.rarity == "uncommon") {
            ;
        } else if (this.submode == 0){
            this.resting_count = 200 + Math.random() * 50;
            //this.anims.play("cat_visitor_standing", true);
            this.submode += 1;
        } else if (this.submode < this.resting_count)  {
            this.submode += 1;
        } else {
            this.mode = "moving";
            this.submode = 0;
        }
    }
    
    //### moving
    moving() {
        if (this.submode == 0){
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check
            if (this.x < 100 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1100 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }
            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //out of area check, y
            if (this.y > 860 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 500 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }
            //determine speed, count
            this.moving_speed = 0.3 + Math.random() * 0.2;  //0.3-0.5
            this.moving_count = 70 + Math.random() * 30;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                //this.anims.play("cat_visitor_moving_left", true);
            }else {
                this.dist = "right";
                //this.anims.play("cat_visitor_moving_right", true);
            }
            this.angle = 0;
            this.submode += 1;
        } else {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.submode += 1;
            if (this.submode >= 100){
                this.mode = "resting";
                this.submode = 0;
            }
        }
    }
    
    //### update()
    update() {
        if (this.mode == "rolling"){this.rolling();}
        else if (this.mode == "resting"){this.resting();}
        else if (this.mode == "moving"){this.moving();}
        if (turn % 100 == 0) {
            if (!local_itemIds.includes(this.itemId)){
                summoned_fluffies = summoned_fluffies.filter(n => n !== this.itemId);
                this.destroy();
            }
        }
    }
}
*/


//---Fluffy2
//***TODO***

class Fluffy2 extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img, type, itemId){
        super(scene, x, y, img);
        this.x = 0;
        this.y = 0;
        //this.img = "fluffy_fluffys";
        this.type = type;
        this.itemId = itemId;
        this.scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.speed_x = 0;
        this.speed_y = 0;
        this.line_y = y;        //initial value of line_y, the same as first position of y
        this.line_y_max = 500;  //max floor position
        this.line_y_min = 800;
        this.line_x_r = 1200;   //right side
        this.line_x_l = 50;     //left side
        this.mode = "";
        this.submode = 0;
        this.resting_count = 200;
        //rarity
        if (this.type <= 212) {
            this.rarity = "common";
            this.setScale(0.07);
        } else if (this.type <= 224) {
            this.rarity = "uncommon";
            this.setScale(0.10);
        } else if (this.type <= 236) {
            this.rarity = "rare";
            this.setScale(0.15);
        }
        //console.log(this.rarity, this.type, this.itemId);
        //image
        if (this.rarity == "common") {
            if (this.type == 201) {
                this.setFrame(0 + 8*0);
            } else if (this.type == 202) {
                this.setFrame(0 + 8*1);
            } else if (this.type == 203) {
                this.setFrame(0 + 8*2);
            } else if (this.type == 204) {
                this.setFrame(0 + 8*3);
            } else if (this.type == 205) {
                this.setFrame(0 + 8*4);
            } else if (this.type == 206) {
                this.setFrame(0 + 8*5);
            } else if (this.type == 207) {
                this.setFrame(0 + 8*6);
            } else if (this.type == 208) {
                this.setFrame(0 + 8*7);
            } else if (this.type == 209) {
                this.setFrame(0 + 8*8);
            } else if (this.type == 210) {
                this.setFrame(0 + 8*9);
            } else if (this.type == 211) {
                this.setFrame(0 + 8*10);
            } else if (this.type == 212) {
                this.setFrame(0 + 8*11);
            }
        } else if (this.rarity == "uncommon") {
            if (this.type == 213) {
                this.anims.play("fluffy_fluffier_01", true);
            } else if (this.type == 214) {
                this.anims.play("fluffy_fluffier_02", true);
            } else if (this.type == 215) {
                this.anims.play("fluffy_fluffier_03", true);
            } else if (this.type == 216) {
                this.anims.play("fluffy_fluffier_04", true);
            } else if (this.type == 217) {
                this.anims.play("fluffy_fluffier_05", true);
            } else if (this.type == 218) {
                this.anims.play("fluffy_fluffier_06", true);
            } else if (this.type == 219) {
                this.anims.play("fluffy_fluffier_07", true);
            } else if (this.type == 220) {
                this.anims.play("fluffy_fluffier_08", true);
            } else if (this.type == 221) {
                this.anims.play("fluffy_fluffier_09", true);
            } else if (this.type == 222) {
                this.anims.play("fluffy_fluffier_10", true);
            } else if (this.type == 223) {
                this.anims.play("fluffy_fluffier_11", true);
            } else if (this.type == 224) {
                this.anims.play("fluffy_fluffier_12", true);
            }
        } else if (this.rarity == "rare") {
            if (this.type == 225) {
                this.frontFrame = 3 +8*0;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_01_right";
                this.anim_left = "fluffy_fluffiest_01_left";
            } else if (this.type == 226) {
                this.frontFrame = 3 +8*1;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_02_right";
                this.anim_left = "fluffy_fluffiest_02_left";
            } else if (this.type == 227) {
                this.frontFrame = 3 +8*2;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_03_right";
                this.anim_left = "fluffy_fluffiest_03_left";
            } else if (this.type == 228) {
                this.frontFrame = 3 +8*3;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_04_right";
                this.anim_left = "fluffy_fluffiest_04_left";
            } else if (this.type == 229) {
                this.frontFrame = 3 +8*4;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_05_right";
                this.anim_left = "fluffy_fluffiest_05_left";
            } else if (this.type == 230) {
                this.frontFrame = 3 +8*5;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_06_right";
                this.anim_left = "fluffy_fluffiest_06_left";
            } else if (this.type == 231) {
                this.frontFrame = 3 +8*6;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_07_right";
                this.anim_left = "fluffy_fluffiest_07_left";
            } else if (this.type == 232) {
                this.frontFrame = 3 +8*7;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_08_right";
                this.anim_left = "fluffy_fluffiest_08_left";
            } else if (this.type == 233) {
                this.frontFrame = 3 +8*8;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_09_right";
                this.anim_left = "fluffy_fluffiest_09_left";
            } else if (this.type == 234) {
                this.frontFrame = 3 +8*9;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_10_right";
                this.anim_left = "fluffy_fluffiest_10_left";
            } else if (this.type == 235) {
                this.frontFrame = 3 +8*10;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_11_right";
                this.anim_left = "fluffy_fluffiest_11_left";
            } else if (this.type == 236) {
                this.frontFrame = 3 +8*11;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_12_right";
                this.anim_left = "fluffy_fluffiest_12_left";
            }
        }
        this.on_summon();
    }
    
    //### on_click
    on_click() {
        this.speed_x = 6 + Math.random() * 4;
        if (pointer_x > this.x) {
            this.speed_x *= -1;
        }
        /*
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        */
        this.speed_y = 6 + Math.random() * 4;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        let _li = [
            sound_fluffy2,
            sound_fluffy3,
            sound_fluffy4,
            sound_fluffy5
        ]
        _li[Math.floor(Math.random()*_li.length)].play();
        this.mode = "rolling";
    }

    //### on_kick
    on_kick() {
        this.speed_x = 4 + Math.random() * 3;
        if (pointer_x > this.x) {
            this.speed_x *= -1;
        }
        /*
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        */
        this.speed_y = 4 + Math.random() * 3;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        let _li = [
            sound_fluffy2,
            sound_fluffy3,
            sound_fluffy4,
            sound_fluffy5,
        ]
        _li[Math.floor(Math.random()*_li.length)].play();
        this.mode = "rolling";
    }
    
    //### on_summon
    on_summon() {
        if (count_sync <= 5) {
            //when start, only pos set
            this.x = 200 + Math.random() * 800;
            this.y = 520 + Math.random() * 200;
            this.angle = Math.random() * 360;
            //define constant of y = b - a * x
            this.a = Math.random() * 0.8 - 0.4;
            this.b = this.y + this.a * this.x;
            this.mode = "rolling";
        } else {
            //pos
            this.x = 300 + Math.random() * 500;
            this.y = 600 + Math.random() * 100;
            //on click with modified speed
            this.speed_x = 6 + Math.random() * 4;
            if (Math.random() > 0.5) {
                this.speed_x *= -1;
            }
            this.speed_y = 10 + Math.random() * 4;
            //define constant of y = b - a * x
            this.a = Math.random() * 0.8 - 0.4;
            this.b = this.y + this.a * this.x;
            //sound
            //sound_fluffy.play();
            this.mode = "rolling";
        }
    }
    
    //### rolling
    rolling(){
        //define line_y
        this.line_y = this.b - this.a * this.x;
        if (this.line_y < this.line_y_max) {
            this.line_y = this.line_y_max;
        }
        if (this.line_y > this.line_y_min) {
            this.line_y = this.line_y_min;
        }

        //reducing x speed, -/+
        if (this.speed_x > 0) {
            //friction, when speed_y = 0
            if (Math.abs(this.speed_y) <= 0.5) {
                this.speed_x -= 0.1 * 2.5;
            } else {
                this.speed_x -= 0.1;
            }
        } else {
            if (Math.abs(this.speed_y) <= 0.5) {
                this.speed_x += 0.1 * 2.5;
            } else {
                this.speed_x += 0.1;
            }
        }

        //reduction of y speed
        this.speed_y -= 0.75;

        //position moving
        this.x += this.speed_x;
        this.y -= this.speed_y;

        //increase angle
        this.angle += this.speed_x * 5;

        //refrection y
        if (this.y >= this.line_y) {
            this.y = this.line_y;
            this.speed_y *= -0.3;   //bounce coefficient
            if (Math.abs(this.speed_y) > 0.5) {
                //sound_dice_impact.play();
            }
        }

        //refrection x
        //limit_y_right: y = (208/205)x - (115746/205)
        if (this.y > 500) {
            this.line_x_r = (this.y + 115746/205)/(208/205);
        } else {
            this.line_x_r = 1060;
        }
        if (this.x >= this.line_x_r) {
            this.x = this.line_x_r;
            this.speed_x *= -0.9;   //bounce coefficient
            //sound_dice_impact.play();
        } else if (this.x <= this.line_x_l) {
            this.x = this.line_x_l;
            this.speed_x *= -0.9;
            //sound_dice_impact.play();
        }
        
        //check speed
        if (
            Math.abs(this.speed_x) <= 0.5
            && Math.abs(this.speed_y) <= 0.5
            && this.line_y - this.y <= 1
        ) {
            this.mode = "resting";
            this.submode = 0
        }
    }
    
    //### resting
    resting() {
        //low rarity, do nothing
        if (this.rarity == "common" || this.rarity == "uncommon") {
            ;
        } else if (this.submode == 0){
            this.anims.stop();
            this.setFrame(this.frontFrame);
            this.resting_count = 200 + Math.random() * 50;
            //this.anims.play("cat_visitor_standing", true);
            this.submode += 1;
        } else if (this.submode < this.resting_count)  {
            this.submode += 1;
        } else {
            this.mode = "moving";
            this.submode = 0;
        }
    }
    
    //### moving
    moving() {
        if (this.submode == 0){
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check
            if (this.x < 100 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1100 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }
            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //out of area check, y
            if (this.y > 850 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 500 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }
            //determine speed, count
            this.moving_speed = 0.3 + Math.random() * 0.2;  //0.3-0.5
            this.moving_count = 70 + Math.random() * 30;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.anims.play(this.anim_left);
                //this.anims.play("cat_visitor_moving_left", true);
            }else {
                this.dist = "right";
                this.anims.play(this.anim_right);
                //this.anims.play("cat_visitor_moving_right", true);
            }
            this.angle = 0;
            this.submode += 1;
        } else {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.submode += 1;
            if (this.submode >= 100){
                this.mode = "resting";
                this.submode = 0;
            }
        }
    }
    
    //### update()
    update() {
        if (this.mode == "rolling"){this.rolling();}
        else if (this.mode == "resting"){this.resting();}
        else if (this.mode == "moving"){this.moving();}
        if (turn % 100 == 0) {
            if (!local_itemIds.includes(this.itemId)){
                summoned_fluffies = summoned_fluffies.filter(n => n !== this.itemId);
                this.destroy();
            }
        }
    }
}


//---PresentBox
//***TODO***

class PresentBox extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img, itemId, summoner_from, memo){
        super(scene, x, y, img);
        this.scene.add.existing(this);
        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.itemId = Number(itemId);
        this.summoner_from = summoner_from;
        this.memo = memo;
        this.on_summon();
        let _text = "";
        _text += " Gift of " + this.memo + " \n"; 
        _text += " from " + this.summoner_from + " ";
        this.text = scene.add.text(
            this.x, 
            this.y-40,
            _text, 
            {font: "20px Arial", fill: "#000000", backgroundColor: "#ffffff"}
        ).setOrigin(0.5).setDepth(9999).setVisible(false);
        this.on("pointerover", () => {
            this.text.visible = true;
            sound_window_select.play();
        })
        this.on("pointerout", () => {
            this.text.visible = false;
        });
    }
    
    //### on_click
    on_click() {
        //send transaction
        open_presentbox(summoner, this.itemId);
    }
    
    //### on_summon
    on_summon() {
        //animation?
    }
        
    //### update()
    update() {
        if (turn % 100 == 0) {
            if (!local_itemIds.includes(this.itemId)){
                summoned_presentbox = summoned_presentbox.filter(n => n !== this.itemId);
                draw_flower(this.scene, this.x, this.y);
                this.destroy();
            }
        }
    }
}


//---Festligheter


class Festligheter extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img){
        super(scene, x, y, img);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.img_right = "ff_preFestival_right";
        this.img_left = "ff_preFestival_left";
        this.setTexture(this.img_right);
        this.scene.add.existing(this);
        this.mode = "";
        this.submode = 0;
        this.resting_count = 200;
        this.movingMode = "";
        this.movingSubmode = "";
        this.setInteractive({useHandCursor: true});
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.text = scene.add.text(
            this.x, 
            this.y-40,
            "test", 
            {font: "20px Arial", fill: "#000000", backgroundColor: "#ffffff"}
        ).setOrigin(0.5).setDepth(9999).setVisible(false);
        /*
        this.on("pointerover", () => {
            this.text.visible = true;
        })
        this.on("pointerout", () => {
            setTimeout( () => {
                this.text.visible = false;
            }, 1000)
        });
        */
        this.checkFestival();
    }
    
    //### on_click
    on_click() {
        if (this.mode == "duringFestival") {
            open_window_voting(this.scene);
        } else if (this.mode == "duringFestival_isEndable") {
            contract_end_voting(summoner);
        } else {
            this.text.visible = true;
            setTimeout( () => {
                this.text.visible = false;
            }, 3000)
        }
    }
    
    //### checkFestival
    checkFestival() {
        let _preFestival_limitBlock = 7200;
        
        // before preFestival, destroy
        if (
            local_ff_inSession == 0
            && local_ff_next_festival_block - local_blockNumber > _preFestival_limitBlock
        ) {
            console.log("destroy festligheter");
            this.mode = "destroy";
            this.destroy();
            
        // preFestival
        } else if (
            local_ff_inSession == 0
            && local_ff_next_festival_block - local_blockNumber <= _preFestival_limitBlock 
            && local_ff_next_festival_block >= local_blockNumber
            && this.mode != "preFestival"
        ) {
            this.mode = "preFestival";
            this.submode = 0;
        
        // during festival, before voting
        } else if (
            (local_ff_inSession == 0 || local_ff_inSession == 1)
            && local_ff_isVotable == 1
            && this.mode != "duringFestival"
        ) {
            this.mode = "duringFestival";
            this.submode = 0;
        
        // during festival, after voting
        } else if (
            local_ff_inSession == 1
            && local_ff_isVotable == 0
            && local_ff_isEndable == 0
            && this.mode != "duringFestival_afterVoting"
        ) {
            this.mode = "duringFestival_afterVoting";
            this.submode = 0;
        
        // during festival, endable
        } else if (
            local_ff_inSession == 1
            && local_ff_isVotable == 0
            && local_ff_isEndable == 1
            && this.mode != "duringFestival_isEndable"
        ) {
            this.mode = "duringFestival_isEndable";
            this.submode = 0;
        }
    }
    
    //### preFestival
    preFestival() {
        if (this.submode == 0) {
            this.img_right = "ff_preFestival_right";
            this.img_left = "ff_preFestival_left";
            this.setTexture(this.img_right);
            this.x = 340;
            this.y = 960;
            //this.removeInteractive();
            //this.setInteractive({useHandCursor: false});
            this.text.setText("");
            this.text.x = this.x;
            this.text.y = this.y-40;
            this.movingMode = "";
        } else if (this.submode % 100 == 1) {
            let _text = "";
            _text += " Festival is comming... " + " \n";
            _text += " (" + (local_ff_next_festival_block - local_blockNumber) + " blocks later) ";
            this.text.setText(_text);
        }
        this.submode += 1;
    }
    
    //### duringFestival
    duringFestival() {
        if (this.submode == 0) {
            this.img_right = "ff_duringFestival_right";
            this.img_left = "ff_duringFestival_left";
            this.setTexture(this.img_right);
            this.x = 200 + Math.random()*700;
            this.y = 550 + Math.random()*200;
            //this.removeInteractive();
            //this.setInteractive({useHandCursor: true});
            this.text.setText("");
            this.text.x = this.x;
            this.text.y = this.y-40;
            this.movingMode = "resting";
        } else {
            ;
        }
        this.submode += 1;
    }

    //### duringFestival_afterVoting
    duringFestival_afterVoting() {
        if (this.submode == 0) {
            //this.removeInteractive();
            this.anims.stop();
            this.setTexture("ff_reports")
                .setOrigin(0.5)
                .setScale(0.1);
            this.anims.play("ff_report", true);
            this.text.setText("");
            this.text.x = this.x;
            this.text.y = this.y-60;
            this.movingMode = "";
            this.dist = "";
            draw_flower(this.scene, this.x, this.y);
            sound_nainai2.play();
        } else if (this.submode % 500 == 1) {
            let _array_sorted = this._get_ranking_sorted();
            let _text = "";
            _text += " Your vote: " + array_item_name[local_ff_last_voting_type] + " \n";
            _text += "   1st: " + array_item_name[_array_sorted[0][0]] + " (" + _array_sorted[0][1] + " votes) \n";
            _text += "   2nd: " + array_item_name[_array_sorted[1][0]] + " (" + _array_sorted[1][1] + " votes) \n";
            _text += "   3rd: " + array_item_name[_array_sorted[2][0]] + " (" + _array_sorted[2][1] + " votes) \n";
            _text += " (" + (local_ff_subject_end_block - local_blockNumber) + " blocks remaining) ";
            this.text.setText(_text);
        }
        this.submode += 1;
        /*
        if (this.submode == 0) {
            this.img_right = "ff_duringFestival_afterVoting_right";
            this.img_left = "ff_duringFestival_afterVoting_left";
            this.setTexture(this.img_right);
            //this.removeInteractive();
            //this.setInteractive({useHandCursor: false});
            this.text.setText("");
            this.text.x = this.x;
            this.text.y = this.y-40;
            this.movingMode = "resting";
        } else if (this.submode % 100 == 1) {
            //let [_winner_type, _winner_count] = this._get_winner_now();
            let _array_sorted = this._get_ranking_sorted();
            let _text = "";
            _text += " Your vote: " + local_ff_last_voting_type + " \n";
            _text += " top1:" + _array_sorted[0] + " top2:" + _array_sorted[1] + " top3:" + _array_sorted[2] + " \n";
            _text += " (" + (local_ff_subject_end_block - local_blockNumber) + " blocks remaining) ";
            this.text.setText(_text);
        }
        this.submode += 1;
        */
    }
    _get_winner_now() {
        let _count = 0;
        let _type = 0;
        for (i=201; i<=212; i++) {
            if (local_ff_each_voting_count[i] > _count) {
                _count = local_ff_each_voting_count[i];
                _type = i;
            }
        }
        return [_type, _count];
    }
    _get_ranking_sorted() {
        //prepare 2dim array
        let _array = [];
        for (i=201; i<=212; i++) {
            _array.push([i, local_ff_each_voting_count[i]]);
        }
        //sort, desent
        let _array_sorted = _array.sort(function(a,b) {
            return b[1] - a[1];
        });
        return _array_sorted;
    }

    //### duringFestival_endable
    duringFestival_isEndable() {

        if (this.submode == 0) {
            this.anims.play("ff_report_close", true)
                .setOrigin(0.5)
                .setScale(0.1);
            this.text.setText("");
            this.text.x = this.x;
            this.text.y = this.y-40;
            this.movingMode = "";
            this.dist = "";
        } else if (this.submode % 100 == 1) {
            let _text = "";
            _text += " Close the Festival ";
            this.text.setText(_text);
        }
        this.submode += 1;
        /*
        if (this.submode == 0) {
            this.img_right = "ff_duringFestival_isEndable_right";
            this.img_left = "ff_duringFestival_isEndable_left";
            this.setTexture(this.img_right);
            //this.removeInteractive();
            //this.setInteractive({useHandCursor: true});
            this.text.setText("");
            this.text.x = this.x;
            this.text.y = this.y-40;
            this.movingMode = "resting";
        } else if (this.submode % 100 == 1) {
            let [_winner_type, _winner_count] = this._get_winner_now();
            let _text = "";
            _text += "Fluffy Festival!" + " \n";
            _text += "Endable";
            this.text.setText(_text);
        }
        this.submode += 1;
        */
    }
    
    //### resting
    resting() {
        if (this.movingSubmode == 0){
            this.resting_count = 200 + Math.random() * 50;
            this.movingSubmode += 1;
        } else if (this.movingSubmode < this.resting_count)  {
            this.movingSubmode += 1;
        } else {
            this.movingMode = "moving";
            this.movingSubmode = 0;
        }
    }

    //### moving
    moving() {
        if (this.movingSubmode == 0){
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check
            if (this.x < 150 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1050 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }
            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //out of area check, y
            if (this.y > 750 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 500 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }
            //determine speed, count
            this.moving_speed = 0.3 + Math.random() * 0.2;  //0.3-0.5
            this.moving_count = 70 + Math.random() * 30;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.setTexture(this.img_left);
                //this.anims.play("cat_visitor_moving_left", true);
            }else {
                this.dist = "right";
                this.setTexture(this.img_right);
                //this.anims.play("cat_visitor_moving_right", true);
            }
            this.movingSubmode += 1;
        } else {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.depth = this.y;
            this.text.x = this.x;
            this.text.y = this.y-40;
            this.movingSubmode += 1;
            if (this.movingSubmode >= 100){
                this.movingMode = "resting";
                this.movingSubmode = 0;
            }
        }
    }
    
    //### update()
    update() {
        //main mode
        if (this.mode == "preFestival"){
            this.preFestival();
        } else if (this.mode == "duringFestival"){
            this.duringFestival();
        } else if (this.mode == "duringFestival_afterVoting"){
            this.duringFestival_afterVoting();
        } else if (this.mode == "duringFestival_isEndable"){
            this.duringFestival_isEndable();
        }
        //moving mode
        if (this.movingMode == "moving"){
            this.moving();
        } else if (this.movingMode == "resting"){
            this.resting();
        }
        //check festival
        if (turn % 100 == 0) {
            this.checkFestival();
        }
        //update festival status
        if (turn % 300 == 0 && flag_sync == 1) {
            contract_update_festival_info(summoner);
        }
        //flower
        if (
            turn % 250 == 0 && 
            (this.mode == "duringFestival" || this.mode == "duringFestival_isEndable")
        ){
            sound_nainai1.play();
            if (this.dist == "right") {
                draw_flower(this.scene, this.x+30, this.y);
            } else if (this.dist == "left") {
                draw_flower(this.scene, this.x-30, this.y);
            } else {
                draw_flower(this.scene, this.x, this.y);
            }
        }
    }
}


//---Nyuinyui


class Nyuinyui extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img){
        super(scene, x, y, img);
        this.img = "nyui_moving";
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.img_right = "nyui_moving_right";
        this.img_left = "nyui_moving_left";
        this.scene.add.existing(this);
        this.mode = "";
        this.submode = 0;
        this.resting_count = 200;
        this.movingMode = "resting";
        this.movingSubmode = "";
        this.setInteractive({useHandCursor: true});
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
    }
    
    //### on_click
    on_click() {
        let _ohana =this.scene.add.image(
            650+Math.random()*400,
            850+Math.random()*30,
            "par_flowers"
        )
            .setFrame(Math.floor(Math.random()*5))
            .setOrigin(0.5)
            .setScale(0.1)
            .setAngle(Math.random()*360)
            .setDepth(9999+101);
        group_nyuinyui_ohana.add(_ohana);
        sound_nyui.play();
    }
    
    //### resting
    resting() {
        if (this.movingSubmode == 0){
            this.resting_count = 200 + Math.random() * 50;
            this.movingSubmode += 1;
        } else if (this.movingSubmode < this.resting_count)  {
            this.movingSubmode += 1;
        } else {
            this.movingMode = "moving";
            this.movingSubmode = 0;
        }
    }

    //### moving
    moving() {
        if (this.movingSubmode == 0){
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check
            if (this.x < 650 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1000 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }
            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //out of area check, y
            if (this.y > 850 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 820 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }
            //determine speed, count
            this.moving_speed = 0.2 + Math.random() * 0.1;  //0.3-0.5
            this.moving_count = 70 + Math.random() * 30;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.anims.play(this.img_left);
                //this.anims.play("cat_visitor_moving_left", true);
            }else {
                this.dist = "right";
                this.anims.play(this.img_right);
                //this.anims.play("cat_visitor_moving_right", true);
            }
            this.movingSubmode += 1;
        } else {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            //this.depth = this.y;
            this.movingSubmode += 1;
            if (this.movingSubmode >= 100){
                this.movingMode = "resting";
                this.movingSubmode = 0;
            }
        }
    }
    
    //### update()
    update() {
        //moving mode
        if (this.movingMode == "moving"){
            this.moving();
        } else if (this.movingMode == "resting"){
            this.resting();
        }
    }
}


//===[ FUNCTION ]========================================================


//---bar
function makeBar(scene, x, y, color) {
    //draw the bar
    let bar = scene.add.graphics();
    //color the bar
    bar.fillStyle(color, 1);
    //fill the bar with a rectangle
    bar.fillRect(0, 0, 150, 20);
    //position the bar
    bar.x = x;
    bar.y = y;
    //return the bar
    return bar;
}

//---button
//TODO: send transaction
class Button {
    constructor(x, y, label, scene, callback) {
        let fontsize = 24;
        const button = scene.add.text(x, y, label)
            .setFontSize(fontsize)
            .setFontFamily("Arial")
            .setFill("#000000")
            //.setOrigin(0.5)
            //.setPadding(10)
            //.setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => callback())
            .on('pointerover', () => button.setStyle({ fontSize: fontsize, fontFamily: "Arial", fill: '#ffff00' }))
            .on('pointerout', () => button.setStyle({ fontSize: fontsize, fontFamily: "Arial", fill: '#000000' }));
    }
}

//---music
function music() {
    if (flag_music == 0) {
        if (bgm == bgm1) {
            bgm = bgm2;
        }else if (bgm == bgm2) {
            bgm = bgm3;
        }else {
            bgm = bgm1;
        }
        bgm.play();
        flag_music = 1;
        item_musicbox.anims.play("item_musicbox_on", true);
    }else {
        bgm.stop();
        flag_music = 0;
        item_musicbox.anims.play("item_musicbox_off", true);
    }
}

//---radar chart
function radarchart2(
    scene, 
    x0, 
    y0, 
    r, 
    str, 
    dex, 
    int, 
    luk, 
    str_withItems, 
    dex_withItems, 
    int_withItems, 
    luk_withItems,
    /*
    luk_withItems_withStaking,
    luk_withItems_withStaking_withDice
    */
    luk_withItems_withDice
) {
    //base
    let base = 30;
    //calc (x,y) from status
    //main
    let x1 = 0;
    let y1 = -r * str/base;
    let x2 = r * dex/base;
    let y2 = 0;
    let x3 = 0;
    //let y3 = r * luk/(base*0.7);
    //luk: boost draw x2 beyond initial value=3
    let y3 = r * ((luk-3)/(base/2) + 3/base);
    let x4 = -r * int/base;
    let y4 = 0;
    //item
    let y1i = -r * (str_withItems)/base;
    let x2i = r * (dex_withItems)/base;
    let y3i = r * ((luk_withItems-3)/(base/2) + 3/base);
    let x4i = -r * (int_withItems)/base;
    //dice
    let y1d = -r * (str_withItems)/base;
    let x2d = r * (dex_withItems)/base;
    //let y3d = r * ((luk_withItems_withStaking_withDice-3)/(base/2) + 3/base);
    let y3d = r * ((luk_withItems_withDice-3)/(base/2) + 3/base);
    let x4d = -r * (int_withItems)/base;
    //remove old chart
    try {
        group_chart.destroy(true);
    } catch(error) {
        ;
    }
    //draw
    group_chart = scene.add.group();
    //back
    group_chart.add(scene.add.polygon(x0+r, y0+r, [0,-r,r,0,0,r,-r,0], 0xDADADA, 0.4));
    group_chart.add(scene.add.polygon(x0+r*0.75, y0+r*0.75, [0,-r*0.75,r*0.75,0,0,r*0.75,-r*0.75,0], 0xDADADA, 0.4));
    group_chart.add(scene.add.polygon(x0+r/2, y0+r/2, [0,-r/2,r/2,0,0,r/2,-r/2,0], 0xDADADA, 0.4));
    //dice
    group_chart.add(scene.add.polygon(x0+(-x4d+x2d)/2, y0+(-y1d+y3d)/2, [x1,y1d,x2d,y2,x3,y3d,x4d,y4], 0xF29B76, 1));
    group_chart.add(scene.add.polygon(x0+(-x4i+x2i)/2, y0+(-y1i+y3i)/2, [x1,y1i,x2i,y2,x3,y3i,x4i,y4], 0xF9C270, 1));
    group_chart.add(scene.add.polygon(x0+(-x4+x2)/2, y0+(-y1+y3)/2, [x1,y1,x2,y2,x3,y3,x4,y4], 0xFFF67F, 1));
    let font_arg = {font: "17px Arial", fill: "#000000"};
    group_chart.add(scene.add.text(x0-15, y0-r-25, "STR"+"\n"+(Math.round( (str_withItems)*100 )/100).toFixed(2), font_arg));
    group_chart.add(scene.add.text(x0+r-5, y0-10, "DEX"+"\n"+(Math.round( (dex_withItems)*100 )/100).toFixed(2), font_arg));
    //group_chart.add(scene.add.text(x0-15, y0+r-7, "LUK"+"\n"+(Math.round( (luk_withItems_withStaking_withDice)*100 )/100).toFixed(2), font_arg));
    group_chart.add(scene.add.text(x0-15, y0+r-7, "LUK"+"\n"+(Math.round( (luk_withItems_withDice)*100 )/100).toFixed(2), font_arg));
    group_chart.add(scene.add.text(x0-r-20, y0-12, "INT"+"\n"+(Math.round( (int_withItems)*100 )/100).toFixed(2), font_arg));
    group_chart.add(scene.add.sprite(x0-15-10, y0-r-25+20, "icon_str").setOrigin(0.5).setScale(0.12));
    group_chart.add(scene.add.sprite(x0+r-5+10, y0-30, "icon_dex").setOrigin(0.5).setScale(0.12));
    group_chart.add(scene.add.sprite(x0-15-12, y0+r-5+14, "icon_luk").setOrigin(0.5).setScale(0.10));
    group_chart.add(scene.add.sprite(x0-r-20+16, y0-10-16, "icon_int").setOrigin(0.5).setScale(0.10));
}
async function draw_radarchart(scene) {
    let _x = 1160;
    let _y = 115;
    let _r = 75;
    radarchart2(
        scene, 
        _x, 
        _y, 
        _r, 
        local_strength, 
        local_dexterity, 
        local_intelligence, 
        local_luck, 
        local_strength_withItems, 
        local_dexterity_withItems, 
        local_intelligence_withItems, 
        local_luck_withItems,
        //local_luck_withItems_withStaking,
        //local_luck_withItems_withStaking_withDice
        local_luck_withItems_withDice
    );
}


//---window:summon
function open_window_summon(scene) {
    //close window and summon
    function close_window_summon(_class) {
        group_window_summon.destroy(true);
        if (_class >= 0) {
            contract_summon(_class);
        }
    }
    //create button with color and class
    function create_button(_x, _y, _text, _color, _class, scene) {
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(40).setFontFamily("Arial").setFill(_color)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => close_window_summon(_class) )
            .on("pointerover", () => obj.setStyle({ fontSize: 40, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerout", () => obj.setStyle({ fontSize: 40, fontFamily: "Arial", fill: _color }))
        return obj;
    }
    //create window
    window_summon = scene.add.sprite(640, 480, "window").setInteractive();
    //create message
    let _text = "Summoning your Murasaki-san.\nPlease choose your favorite color.\n(This does not affect any gameplays.)";
    msg1 = scene.add.text(150, 150, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#000000")
    //create button
    let _x = 200;
    let _y = 280;
    let _y_add = 70;
    button0 = create_button(_x, _y+_y_add*0, "Red", "#E60012", 0, scene);
    button1 = create_button(_x, _y+_y_add*1, "Orange", "#F39800", 1, scene);
    button2 = create_button(_x, _y+_y_add*2, "Yello", "#FFF100", 2, scene);
    button3 = create_button(_x, _y+_y_add*3, "Light Green", "#8FC31F", 3, scene);
    button4 = create_button(_x, _y+_y_add*4, "Green", "#009944", 4, scene);
    button5 = create_button(_x, _y+_y_add*5, "Deep Green", "#009E96", 5, scene);
    button6 = create_button(_x+500, _y+_y_add*0, "Light Blue", "#00A0E9", 6, scene);
    button7 = create_button(_x+500, _y+_y_add*1, "Blue", "#0068B7", 7, scene);
    button8 = create_button(_x+500, _y+_y_add*2, "Deep Blue", "#1D2088", 8, scene);
    button9 = create_button(_x+500, _y+_y_add*3, "Purple", "#920783", 9, scene);
    button10 = create_button(_x+500, _y+_y_add*4, "Pink", "#E4007F", 10, scene);
    button11 = create_button(_x+500, _y+_y_add*5, "Vivid Pink", "#E5004F", 11, scene);
    button_cancel = create_button(1000, 750, "Cancel", "#000000", -1, scene);
    //create group
    group_window_summon = scene.add.group();
    group_window_summon.add(window_summon);
    group_window_summon.add(msg1);
    group_window_summon.add(button0);
    group_window_summon.add(button1);
    group_window_summon.add(button2);
    group_window_summon.add(button3);
    group_window_summon.add(button4);
    group_window_summon.add(button5);
    group_window_summon.add(button6);
    group_window_summon.add(button7);
    group_window_summon.add(button8);
    group_window_summon.add(button9);
    group_window_summon.add(button10);
    group_window_summon.add(button11);
    group_window_summon.add(button_cancel);
    //depth
    group_window_summon.setDepth(999999);
}


//---window:craft
function open_window_craft (scene) {

    //nyuinyui
    nyuinyui.setVisible(true);

    //prevent loading error
    if (local_level == 0) {
        return 0;
    }
    
    //play sound, prevent sound in create()
    if (count_sync > 1) {
        sound_window_open.play();
    }

    //when already created, just setVisible and return
    if (typeof group_window_crafting != "undefined"){
        group_window_crafting.setVisible(true);
        //console.log(0);
        return 0;
    }

    //function, closing: destroy group and update selecte_item
    async function close_crafting_window(_item) {
        //nyuinyui
        nyuinyui.setVisible(false);
        group_nyuinyui_ohana.clear(true);
        flag_window_craft = 0;
        //destroy group
        //group_window_crafting.destroy(true);
        group_window_crafting.setVisible(false);
        //during crafting, return 0
        if (local_crafting_status == 1) {
            return 0;
        }
        //update selected item
        global_selected_crafting_item = _item;
        //update selected item dc
        global_selected_crafting_item_dc = await get_cost_of_item(_item);
        //console.log("selected_item:", global_selected_crafting_item, global_selected_crafting_item_dc);
        //update text_craft_item
        let _level = global_selected_crafting_item_dc[0]
        //text_craft_item.setText("time= " + _dc + ", ohana = " + _coin + ", kusa = " + _material);
        if (_level > 0) {
            let _dc = await get_modified_dc(summoner, _item);
            let _total_sec = _dc / 1000 * BASE_SEC;
            let _day = Math.floor(_total_sec / 86400);
            let _hr = Math.floor(_total_sec % 86400 / 3600);
            let _min = Math.floor(_total_sec % 3600 / 60);
            let _coin = global_selected_crafting_item_dc[2];
            let _material = global_selected_crafting_item_dc[3];
            text_crafting_selected_item_ohana.setText(_coin);
            text_crafting_selected_item_kusa.setText(_material);
            text_crafting_selected_item_time.setText(_day + "d:" + _hr + "h:" + _min + "m");
            icon_crafting_ohana.visible = true;
            icon_crafting_kusa.visible = true;
            icon_crafting_time.visible = true;
            text_select_item.setText('"'+array_item_name[_item]+'"');
            //get herat required
            //let _heart_required = await contract_get_heart_required(_item);
            //global_selected_crafting_item_required_heart = _heart_required;
            //text_crafting_selected_item_heart.setText(_heart_required);
            //icon_crafting_heart.visible = true;
        } else {
            text_crafting_selected_item_ohana.setText("");
            text_crafting_selected_item_kusa.setText("");
            text_crafting_selected_item_time.setText("");
            text_crafting_selected_item_heart.setText("");
            icon_crafting_ohana.visible = false;
            icon_crafting_kusa.visible = false;
            icon_crafting_time.visible = false;
            icon_crafting_heart.visible = false;
            text_select_item.setText(">> Select Item <<");
        }
    }

    //function, get cost of item
    async function get_cost_of_item(_item) {
        let _dc_table = await contract_get_item_dc(_item);
        return _dc_table;
    }

    //function, get modified dc
    async function get_modified_dc(_summoner, _item_type) {
        let _modified_dc = await contract_get_modified_dc(_summoner, _item_type);
        return _modified_dc;
    }

    //function, create button
    function create_button(_x, _y, _text, _item_type, scene, rarity) {
        /*
        let _color;
        if (rarity == "common") {
            _color = "green";
        }else if (rarity == "uncommon") {
            _color = "blue";
        }else if (rarity == "rare") {
            _color = "#FF8B00";
        }else{
            _color = "black";
        }
        */
        let _color = "black";
        if (rarity == "common") {
            _color = "black";
            //_color = "green";
        }else if (rarity == "uncommon") {
            _color = "blue";
        }else if (rarity == "rare") {
            //_color = "orange";
            //_color = "#d24e01";
            _color = "#be5504";
            //_color = "#cc5801";
        }else{
            _color = "gray";
        }
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(30).setFontFamily("Arial")
            .setInteractive({useHandCursor: true})
            .setFill(_color)
            .on("pointerdown", () => close_crafting_window(_item_type) )
            .on("pointerdown", () => sound_window_select.play() )
            .on("pointerover", () => obj.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerover", () => sound_window_pointerover.play())
            .on("pointerout", () => obj.setStyle({ fontSize: 30, fontFamily: "Arial", fill: _color }));
        return obj;
    }

    //when not created yet, create group

    //create group
    group_window_crafting = scene.add.group();

    //create window
    group_window_crafting.add(scene.add.sprite(640, 480, "window").setInteractive())

    //create item list text
    let _x = 170;
    let _y = 80;
    let _y_add = 40;
    let _item_count = 0;
    //mining_item
    for (var i = 1; i <= 16; i++) {
        let _rarity;
        if (local_items[i+128] > 0) {
            _rarity = "rare";
        }else if (local_items[i+64] > 0) {
            _rarity = "uncommon";
        }else if (local_items[i] > 0) {
            _rarity = "common";
        }else{
            _rarity = "empty";
        }
        //use eval to create dynamic variants
        eval(`_button  = create_button(_x, _y + _y_add *  ${i}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + array_item_name[${i}],  ${i},  scene, _rarity);`)
        group_window_crafting.add(_button);
    }
    item1_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  1, "item_kanban").setScale(0.125);
    item2_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  2, "mr_astar_right").setScale(0.08);
    item3_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  3, "item_dice").setScale(0.18);
    item4_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  4, "item_hat_helmet").setScale(0.1);
    item5_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  5, "item_onigiri").setScale(0.1);
    item6_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  6, "item_crown").setScale(0.15);
    item7_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  7, "item_ribbon").setScale(0.12);
    item8_icon = scene.add.sprite(_x-25, _y+12 + _y_add *  8, "item_window_day").setScale(0.15);
    item9_icon = scene.add.sprite(_x-25, _y+12 + _y_add *  9, "item_hat_knit").setScale(0.14);
    group_window_crafting.add(item1_icon);
    group_window_crafting.add(item2_icon);
    group_window_crafting.add(item3_icon);
    group_window_crafting.add(item4_icon);
    group_window_crafting.add(item5_icon);
    group_window_crafting.add(item6_icon);
    group_window_crafting.add(item7_icon);
    group_window_crafting.add(item8_icon);
    group_window_crafting.add(item9_icon);

    //farming_item
    _x = 520;
    for (var i = 17; i <= 32; i++) {
        let _rarity;
        if (local_items[i+128] > 0) {
            _rarity = "rare";
        }else if (local_items[i+64] > 0) {
            _rarity = "uncommon";
        }else if (local_items[i] > 0) {
            _rarity = "common";
        }else{
            _rarity = "empty";
        }
        eval(`_button  = create_button(_x, _y + _y_add *  ${i-16}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + array_item_name[${i}],  ${i},  scene, _rarity);`)
        group_window_crafting.add(_button);
    }
    item17_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  1, "item_musicbox").setScale(0.15);
    item18_icon = scene.add.sprite(_x-25, _y+10 + _y_add *  2, "item_hat_mugiwara").setScale(0.15);
    item19_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  3, "ms_ether_right").setScale(0.08);
    item20_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  4, "item_cushion").setScale(0.075);
    item21_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  5, "uni").setScale(0.1);
    item22_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  6, "item_fortune_statue").setScale(0.15);
    item23_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  7, "item_asnya").setScale(0.1);
    item24_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  8, "item_rugg").setScale(0.18);
    item25_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  9, "item_vase").setScale(0.08);
    group_window_crafting.add(item17_icon);
    group_window_crafting.add(item18_icon);
    group_window_crafting.add(item19_icon);
    group_window_crafting.add(item20_icon);
    group_window_crafting.add(item21_icon);
    group_window_crafting.add(item22_icon);
    group_window_crafting.add(item23_icon);
    group_window_crafting.add(item24_icon);
    group_window_crafting.add(item25_icon);

    //crafting_item
    _x = 870;
    for (var i = 33; i <= 48; i++) {
        let _rarity;
        if (local_items[i+128] > 0) {
            _rarity = "rare";
        }else if (local_items[i+64] > 0) {
            _rarity = "uncommon";
        }else if (local_items[i] > 0) {
            _rarity = "common";
        }else{
            _rarity = "empty";
        }
        eval(`_button  = create_button(_x, _y + _y_add *  ${i-32}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + array_item_name[${i}],  ${i},  scene, _rarity);`)
        group_window_crafting.add(_button);
    }
    item33_icon = scene.add.sprite(_x-25, _y+17 + _y_add *  1, "item_pad_on").setScale(0.12);
    item34_icon = scene.add.sprite(_x-25, _y+10 + _y_add *  2, "item_score_board").setScale(0.12);
    item35_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  3, "item_hat_mortarboard").setScale(0.14);
    item36_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  4, "dr_bitco_right").setScale(0.08);
    item37_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  5, "item_pancake").setScale(0.18);
    item38_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  6, "item_violin").setScale(0.08);
    item39_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  7, "item_piano").setScale(0.18);
    item40_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  8, "item_switch").setScale(0.1);
    item41_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  9, "item_lanthanum").setScale(0.08);
    //item42_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  9, "item_lanthanum").setScale(0.08);
    //item43_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  9, "item_lanthanum").setScale(0.08);
    item44_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  12, "item_clock").setScale(0.18);
    group_window_crafting.add(item33_icon);
    group_window_crafting.add(item34_icon);
    group_window_crafting.add(item35_icon);
    group_window_crafting.add(item36_icon);
    group_window_crafting.add(item37_icon);
    group_window_crafting.add(item38_icon);
    group_window_crafting.add(item39_icon);
    group_window_crafting.add(item40_icon);
    group_window_crafting.add(item41_icon);
    //group_window_crafting.add(item41_icon);
    //group_window_crafting.add(item41_icon);
    group_window_crafting.add(item44_icon);

    //special items
    let _rarity;

    //coin/material bag
    if (local_items[194] > 0) { _rarity = "common" } else { _rarity = null }
    button_crafting_item194  = create_button(170, 80 + 40*17, "[" +local_items[194]+ "] Coin Bank", 194,  scene, _rarity);
    if (local_items[195] > 0) { _rarity = "common" } else { _rarity = null }
    button_crafting_item195  = create_button(520, 80 + 40*17, "[" +local_items[195]+ "] Leaf Pouch", 195,  scene, _rarity);
    item194_icon = scene.add.sprite(170-25, 80+17 + 40*17, "item_bank").setScale(0.16);
    item195_icon = scene.add.sprite(520-25, 80+17 + 40*17, "item_pouch").setScale(0.14);
    group_window_crafting.add(button_crafting_item194);
    group_window_crafting.add(button_crafting_item195);
    group_window_crafting.add(item194_icon);
    group_window_crafting.add(item195_icon);
    
    //mail
    if (local_items[196] > 0) { _rarity = "common" } else { _rarity = null }
    button_crafting_item196  = create_button(870, 80 + 40*17, "[" +local_items[196]+ "] Cat Mail", 196,  scene, _rarity);
    item196_icon = scene.add.sprite(870-0, 80+30 + 40*17, "item_mail").setScale(0.6);
    group_window_crafting.add(button_crafting_item196);
    group_window_crafting.add(item196_icon);

    /*
    //nui
    if (local_items[197] > 0) { _rarity = "common" } else { _rarity = null }
    button_crafting_item197  = create_button(870, 80 + 40*18, "[" +local_items[197]+ "] Coddly Toy", 197,  scene, _rarity);
    item197_icon = scene.add.sprite(870-25, 80+20 + 40*18, "item_nui").setScale(0.15);
    group_window_crafting.add(button_crafting_item197);
    group_window_crafting.add(item197_icon);
    */

    //cancel
    _rarity = "common";
    button_crafting_close = create_button(1070, 840, "Cancel", 0, scene, _rarity);
    group_window_crafting.add(button_crafting_close);
    
    //upgrade button
    let obj_upgrade = scene.add.text(220, 810, ">> Upgrade Item <<")
        .setFontSize(30).setFontFamily("Arial")
        .setInteractive({useHandCursor: true})
        .setFill("black")
        .setBackgroundColor("#ecd9ff")
        .on("pointerdown", () => close_crafting_window(0) )
        .on("pointerdown", () => sound_window_open.play() )
        .on("pointerover", () => obj_upgrade.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#d19dff' }))
        .on("pointerover", () => sound_window_pointerover.play())
        .on("pointerout", () => obj_upgrade.setStyle({ fontSize: 30, fontFamily: "Arial", fill: "black" }))
        .on("pointerdown", () => open_window_upgrade(scene) );
    group_window_crafting.add(obj_upgrade);

    //depth
    group_window_crafting.setDepth(9999 + 100);
}


//---window:upgrade
function open_window_upgrade(scene) {

    //nyuinyui
    nyuinyui.setVisible(true);

    function close_window_upgrade() {
        group_window_upgrade.destroy(true);
        //nyuinyui
        nyuinyui.setVisible(false);
        group_nyuinyui_ohana.clear(true);
    }

    //create group
    group_window_upgrade = scene.add.group();
    
    //create window
    let window_upgrade = scene.add.sprite(640, 480, "window").setInteractive();

    let _text = "";
    _text += "Upgrade item!\n";
    _text += "Mint a higher rarity item by burning 3 items with the same type and rarity.\n";
    _text += "\n";
    let msg_upgrade = scene.add.text(140, 110, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#333333")

    group_window_upgrade.add(window_upgrade);
    group_window_upgrade.add(msg_upgrade);
    
    //get upgradable items
    let upgradable_itemIds = get_upgradable_itemIds(local_myListsAt_withItemType);
    
    //showing upgradable items
    let _num = 0;
    Object.keys(upgradable_itemIds).forEach(_itemId => {
        // mint uncommon Violin (burn 3 common items, ID: 1, 4, 5)
        let _item_name = array_item_name[_itemId];
        let _item_name_to;
        if (_itemId <= 128) {
            _item_name_to = array_item_name[Number(_itemId)+64];
        } else if (_itemId <= 224) {
            _item_name_to = array_item_name[Number(_itemId)+12];
        } else if (_itemId <= 236) {
            _item_name_to = "Fluffy Murasaki-san";
        }
        let _rarity = "";
        let _rarity_to = "";
        let _cost_coin = "";
        let _cost_leaf = "";
        let _fontColor = "#000000";
        if (_itemId <= 64){
            _rarity = "Common ";
            _rarity_to = "Uncommon ";
            _cost_coin = "200";
            _cost_leaf = "200";
            _fontColor = "#0000FF";
        } else if (_itemId <= 128) {
            _rarity = "Uncommon ";
            _rarity_to = "Rare ";
            _cost_coin = "400";
            _cost_leaf = "400";
            _fontColor = "#FFA500";
        } else if (_itemId <= 212) {
            _cost_coin = "200";
            _cost_leaf = "200";
            _fontColor = "#0000FF";
        } else if (_itemId <= 224) {
            _cost_coin = "400";
            _cost_leaf = "400";
            _fontColor = "#E05A00";
        } else if (_itemId <= 236) {
            _cost_coin = "600";
            _cost_leaf = "600";
            _fontColor = "#E85298";
        }
        //prepare text
        let _txt = "■ ";
        _txt += _rarity_to + _item_name_to;
        _txt += " (burning item_id: ";
        _txt += upgradable_itemIds[_itemId][0] + ", ";
        _txt += upgradable_itemIds[_itemId][1] + ", ";
        _txt += upgradable_itemIds[_itemId][2] + ")";
        _txt += "\n";
        let _msg = scene.add.text(160, 220 + 70*_num, _txt)
            .setFontSize(30)
            .setFontFamily("Arial")
            .setFill(_fontColor)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                upgrade_item(
                    summoner, 
                    upgradable_itemIds[_itemId][0], 
                    upgradable_itemIds[_itemId][1], 
                    upgradable_itemIds[_itemId][2]
                );
                close_window_upgrade(); 
            })
            .on("pointerdown", () => sound_window_select.play() )
            .on("pointerover", () => _msg.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerover", () => sound_window_pointerover.play())
            .on("pointerout", () => _msg.setStyle({ fontSize: 30, fontFamily: "Arial", fill: _fontColor }));
        //prepare cost text
        let _cost_coin_text = scene.add.text(210, 223 + 70*_num + 30, _cost_coin)
            .setFontSize(24).setFontFamily("Arial").setFill("#000000");
        let _cost_leaf_text = scene.add.text(300, 223 + 70*_num + 30, _cost_leaf)
            .setFontSize(24).setFontFamily("Arial").setFill("#000000");
        let icon_upgrading_coin = scene.add.sprite(190, 235 + 70*_num + 30, "icon_ohana")
            .setScale(0.07);
        let icon_upgrading_leaf = scene.add.sprite(290, 235 + 70*_num + 30, "icon_kusa")
            .setScale(0.07);
        group_window_upgrade.add(_msg);
        group_window_upgrade.add(_cost_coin_text);
        group_window_upgrade.add(_cost_leaf_text);
        group_window_upgrade.add(icon_upgrading_coin);
        group_window_upgrade.add(icon_upgrading_leaf);
        _num += 1;
    });
    
    //cancel button
    let _msg = scene.add.text(1070, 840, "Cancel")
        .setFontSize(30).setFontFamily("Arial").setFill("#000000")
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => close_window_upgrade() )
        .on("pointerdown", () => sound_window_select.play() )
        .on("pointerover", () => _msg.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#ffff00' }))
        .on("pointerover", () => sound_window_pointerover.play())
        .on("pointerout", () => _msg.setStyle({ fontSize: 30, fontFamily: "Arial", fill: "black" }));
    group_window_upgrade.add(_msg);
    
    //depth
    group_window_upgrade.setDepth(9999 + 100);
}


//---window:voting
function open_window_voting(scene) {

    //nyuinyui
    nyuinyui.setVisible(true);

    sound_window_open.play();
    //close window and summon
    function close_window(_summoner, _type) {
        //nyuinyui
        nyuinyui.setVisible(false);
        group_nyuinyui_ohana.clear(true);
        //main
        group_window_voting.destroy(true);
        if (_type >= 0) {
            contract_voting(_summoner, _type);
        }
    }
    //create button with color and class
    function create_button(_x, _y, _text, _color, _colorb, _type, scene, _size) {
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(_size)
            .setFontFamily("Arial")
            .setFill(_color)
            .setStyle({backgroundColor: _colorb})
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => close_window(summoner, _type) )
            .on("pointerover", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerout", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: _color }))
            .on("pointerdown", () => sound_window_select.play() )
            .on("pointerover", () => sound_window_pointerover.play());
        return obj;
    }
    //create window
    let window_voting = scene.add.sprite(640, 480, "window").setInteractive();
    //create message
    let _text = "";
    _text += "Fluffy Festival is Underway! Vote for your Favorite Fluffy!\n";
    _text += "\n";
    _text += "・The festival lasts 24 hours. You can vote only once and get Participation Award.\n";
    _text += "・The winner fluffy will get x2 luck boost until the next festival.\n";
    let msg1 = scene.add.text(140, 110, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#333333");
    _text = "";
    _text += "・Festival selection is held at candle auction method.\n";
    _text += "・The present and previsou winner fluffy are not selectable.\n";
    _text += "・The first voter and the final voter will get additional award.\n";
    let msg2 = scene.add.text(200, 730, _text)
            .setFontSize(18).setFontFamily("Arial").setFill("#333333");
    //create button
    let _x = 250;
    let _y = 270;
    let _y_add = 80;
    let _button201 = create_button(
        _x, _y+_y_add*0, " "+array_item_name[201]+" ", "#b3bfc7", "#e7f3fb", 201, scene, 36).setOrigin(0, 0.5);
    let _button202 = create_button(
        _x, _y+_y_add*1, " "+array_item_name[202]+" ", "#d8bfac", "#fff3e0", 202, scene, 36).setOrigin(0, 0.5);
    let _button203 = create_button(
        _x, _y+_y_add*2, " "+array_item_name[203]+" ", "#b7ffd0", "#9de5b6", 203, scene, 36).setOrigin(0, 0.5);
    let _button204 = create_button(
        _x, _y+_y_add*3, " "+array_item_name[204]+" ", "#a9e8ff", "#8fcee5", 204, scene, 36).setOrigin(0, 0.5);
    let _button205 = create_button(
        _x, _y+_y_add*4, " "+array_item_name[205]+" ", "#8dabff", "#c1dfff", 205, scene, 36).setOrigin(0, 0.5);
    let _button206 = create_button(
        _x, _y+_y_add*5, " "+array_item_name[206]+" ", "#dab3ff", "#ffe7ff", 206, scene, 36).setOrigin(0, 0.5);
    let _button207 = create_button(
        _x+500, _y+_y_add*0, " "+array_item_name[207]+" ", "#fdbeff", "#fff2ff", 207, scene, 36).setOrigin(0, 0.5);
    let _button208 = create_button(
        _x+500, _y+_y_add*1, " "+array_item_name[208]+" ", "#ff686b", "#ffb6b9", 208, scene, 36).setOrigin(0, 0.5);
    let _button209 = create_button(
        _x+500, _y+_y_add*2, " "+array_item_name[209]+" ", "#ffbda8", "#fff1dc", 209, scene, 36).setOrigin(0, 0.5);
    let _button210 = create_button(
        _x+500, _y+_y_add*3, " "+array_item_name[210]+" ", "#ffd5d5", "#ffffff", 210, scene, 36).setOrigin(0, 0.5);
    let _button211 = create_button(
        _x+500, _y+_y_add*4, " "+array_item_name[211]+" ", "#ffe381", "#e5c967", 211, scene, 36).setOrigin(0, 0.5);
    let _button212 = create_button(
        _x+500, _y+_y_add*5, " "+array_item_name[212]+" ", "#fbfff0", "#c7cbbc", 212, scene, 36).setOrigin(0, 0.5);
    let _button_cancel = create_button(1070, 840, "Cancel", "#000000", "", -1, scene, 30);
    //create icon
    let _icon201 = scene.add.image(_x-35, _y + _y_add*0, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*0);
    let _icon202 = scene.add.image(_x-35, _y + _y_add*1, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*1);
    let _icon203 = scene.add.image(_x-35, _y + _y_add*2, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*2);
    let _icon204 = scene.add.image(_x-35, _y + _y_add*3, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*3);
    let _icon205 = scene.add.image(_x-35, _y + _y_add*4, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*4);
    let _icon206 = scene.add.image(_x-35, _y + _y_add*5, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*5);
    let _icon207 = scene.add.image(_x+500-35, _y + _y_add*0, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*6);
    let _icon208 = scene.add.image(_x+500-35, _y + _y_add*1, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*7);
    let _icon209 = scene.add.image(_x+500-35, _y + _y_add*2, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*8);
    let _icon210 = scene.add.image(_x+500-35, _y + _y_add*3, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*9);
    let _icon211 = scene.add.image(_x+500-35, _y + _y_add*4, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*10);
    let _icon212 = scene.add.image(_x+500-35, _y + _y_add*5, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+8*11);
    //destroy, present and last winner
    /*
    eval("_button" + local_ff_previous_elected_type).setVisible(false);
    eval("_button" + local_ff_elected_type).setVisible(false);
    eval("_icon" + local_ff_previous_elected_type).setVisible(false);
    eval("_icon" + local_ff_elected_type).setVisible(false);
    */
    eval("_button" + local_ff_previous_elected_type)
        .setText(" (" + eval("_button" + local_ff_previous_elected_type).text + ") ")
        .disableInteractive();
    eval("_button" + local_ff_elected_type)
        .setText(" (" + eval("_button" + local_ff_elected_type).text + ") ")
        .disableInteractive();
    _text = "--- 👑 Previous Winner ---";
    _x = eval("_button" + local_ff_previous_elected_type).x;
    _y = eval("_button" + local_ff_previous_elected_type).y;    
    let msg3 = scene.add.text(_x, _y+22, _text)
        .setFontSize(20).setFontFamily("Arial").setFill("#0000ff")
    _text = "--- 👑 Present Winner ---";
    _x = eval("_button" + local_ff_elected_type).x;
    _y = eval("_button" + local_ff_elected_type).y;    
    let msg4 = scene.add.text(_x, _y+22, _text)
        .setFontSize(20).setFontFamily("Arial").setFill("#ff0000")
    /*
    let _bar1 = scene.add.graphics();
    _bar1.fillStyle(0x000000, 0.4);
    let _bar1_x = eval("_icon" + local_ff_previous_elected_type).x;
    let _bar1_y = eval("_icon" + local_ff_previous_elected_type).y;
    _bar1.fillRect(_bar1_x-30, _bar1_y, 350, 5);
    let _bar2 = scene.add.graphics();
    _bar2.fillStyle(0x000000, 0.4);
    let _bar2_x = eval("_icon" + local_ff_elected_type).x;
    let _bar2_y = eval("_icon" + local_ff_elected_type).y;
    _bar2.fillRect(_bar2_x-30, _bar2_y, 350, 5);
    */
    //create group
    group_window_voting = scene.add.group();
    group_window_voting.add(window_voting);
    group_window_voting.add(msg1);
    group_window_voting.add(msg2);
    group_window_voting.add(_button201);
    group_window_voting.add(_button202);
    group_window_voting.add(_button203);
    group_window_voting.add(_button204);
    group_window_voting.add(_button205);
    group_window_voting.add(_button206);
    group_window_voting.add(_button207);
    group_window_voting.add(_button208);
    group_window_voting.add(_button209);
    group_window_voting.add(_button210);
    group_window_voting.add(_button211);
    group_window_voting.add(_button212);
    group_window_voting.add(_button_cancel);
    group_window_voting.add(_icon201);
    group_window_voting.add(_icon202);
    group_window_voting.add(_icon203);
    group_window_voting.add(_icon204);
    group_window_voting.add(_icon205);
    group_window_voting.add(_icon206);
    group_window_voting.add(_icon207);
    group_window_voting.add(_icon208);
    group_window_voting.add(_icon209);
    group_window_voting.add(_icon210);
    group_window_voting.add(_icon211);
    group_window_voting.add(_icon212);
    //group_window_voting.add(_bar1);
    //group_window_voting.add(_bar2);
    group_window_voting.add(msg3);
    group_window_voting.add(msg4);
    //depth
    group_window_voting.setDepth(9999 + 100);
}


//---draw_firework
function draw_firework(scene) {
    sound_fireworks2.play();
    const { FloatBetween } = Phaser.Math;
    const emitterConfig = {
        alpha: { start: 1, end: 0, ease: 'Cubic.easeIn' },
        angle: { start: 0, end: 360, steps: 100 },
        blendMode: 'ADD',
        frame: { frames: ['red', 'yellow', 'green', 'blue'], cycle: true, quantity: 500 },
        //frequency: 2000,
        frequency: 500,
        gravityY: 300,
        lifespan: 1000,
        quantity: 500,
        reserve: 500,
        scale: { min: 0.05, max: 0.15 },
        speed: { min: 300, max: 600 },
        x: 512, y: 384,
    };
    const particles = scene.add.particles('par_flares');
    const emitter = particles.createEmitter(emitterConfig);
    emitter.onParticleEmit( () => {
        sound_fireworks.play();
    });
    const { width, height } = scene.scale;
    scene.time.addEvent({
        delay: 250,
        startAt: 0,
        repeat: 10,
        callback: () => {
            emitter.setPosition(width * FloatBetween(0.25, 0.75), height * FloatBetween(0, 0.5));
        },
    });
    scene.time.addEvent({
        delay: 2400,
        callback: () => {
            emitter.stop();
        }
    });
}


//---draw_flower
function draw_flower(scene, _x, _y) {
    let _lifespan = 900;
    const emitterConfig = {
        alpha: 0.8,
        angle: { min: 250, max: 290 },
        //blendMode: 'ADD',
        gravityY: 900,
        lifespan: { min:_lifespan*0.8, max:_lifespan},
        frequency: _lifespan+200,
        quantity: 20,
        timeScale: 0.9,
        reserve: 20,
        rotate: { min:0, max:360 },
        scale: { min: 0.05, max: 0.15 },
        speed: { min: 300, max: 600 },
        frame: [0,1,2,3,4,5],
        //x: 50+Math.random()*1100, 
        //y: 500+Math.random()*350,
        x: _x, 
        y: _y,
    };
    const particles = scene.add.particles('par_flowers')
        .setDepth(9999);
    const emitter = particles.createEmitter(emitterConfig);
    scene.time.addEvent({
        delay: _lifespan+100,
        callback: () => {
            emitter.stop();
        }
    });
}


//---draw_star
function draw_star(scene, _x, _y) {
    let _lifespan = 400;
    const emitterConfig = {
        alpha: 0.5,
        //angle: { min: 250, max: 290 },
        angle: { min: 0, max: 360 },
        //blendMode: 'ADD',
        gravityY: 400,
        lifespan: { min:_lifespan*0.7, max:_lifespan},
        frequency: _lifespan+200,
        quantity: 15,
        timeScale: 0.9,
        reserve: 15,
        rotate: { min:0, max:360 },
        scale: { min: 0.05, max: 0.08 },
        speed: { min: 50, max: 300 },
        frame: [0,1,2,3,4,5,6,7],
        //x: 50+Math.random()*1100, 
        //y: 500+Math.random()*350,
        x: _x, 
        y: _y,
    };
    const particles = scene.add.particles('par_stars')
        .setDepth(9999+200);
    const emitter = particles.createEmitter(emitterConfig);
    scene.time.addEvent({
        delay: _lifespan+100,
        callback: () => {
            emitter.stop();
        }
    });
}


//---draw_fluffyBit
function draw_fluffyBit(scene, _x, _y) {
    let _lifespan = 500;
    const emitterConfig = {
        alpha: 0.5,
        //angle: { min: 250, max: 290 },
        angle: { min: 0, max: 360 },
        //blendMode: 'ADD',
        gravityY: 400,
        lifespan: { min:_lifespan*0.7, max:_lifespan},
        frequency: _lifespan+200,
        quantity: 20,
        timeScale: 0.9,
        reserve: 20,
        rotate: { min:0, max:360 },
        scale: { min: 0.05, max: 0.10 },
        speed: { min: 50, max: 300 },
        frame: [0,1,2,3,4,5,6,7,8,9,10,11],
        //x: 50+Math.random()*1100, 
        //y: 500+Math.random()*350,
        x: _x, 
        y: _y,
    };
    const particles = scene.add.particles('par_fluffys')
        .setDepth(9999);
    const emitter = particles.createEmitter(emitterConfig);
    scene.time.addEvent({
        delay: _lifespan+100,
        callback: () => {
            emitter.stop();
        }
    });
}


//---summon_star
function summon_star(scene) {
    let _type = Math.floor(Math.random()*7);
    let _star = new Star(scene, 300, -100, "par_stars")
        .setOrigin(0.5)
        .setScale(0.15)
        .setAlpha(1)
        .setDepth(3)
        .setFrame(_type);
    _star.on_summon();
    group_neonStar.add(_star);
    group_update.add(_star);
}
/*
function summon_star(scene, _type) {
    let _dic = {
        201:"star_blue",
        202:"star_green",
        203:"star_orange",
        204:"star_pink",
        205:"star_purple",
        206:"star_red",
        207:"star_skyblue",
        208:"star_yellow",
        209:"star_yellow",
        210:"star_yellow",
        211:"star_yellow",
        212:"star_yellow",
    }
    //let _img = _array[Math.floor(Math.random() * _array.length)];
    let _img = _dic[_type];
    let _star = new Star(scene, 300, -100, _img)
        .setOrigin(0.5)
        .setScale(0.15)
        .setAlpha(1)
        .setDepth(3);
    _star.on_summon();
    group_star.add(_star);
    group_update.add(_star);
}
*/


//---summon_fluffy

function summon_fluffy2(scene, _type, _itemId) {
    let _fluffy = new Fluffy2(scene, 0, 0, "fluffy_fluffys", _type, _itemId)
        .setOrigin(0.5)
        //.setScale(0.07)
        .setAlpha(1)
        .setDepth(3);
    //_fluffy.on_summon();
    group_star.add(_fluffy);
    group_update.add(_fluffy);
    if (count_sync > 10) {
        murasakisan.on_click();
        sound_fluffy.play();
    }
}

function summon_fluffy(scene, _type, rarity, itemId) {

    let _dic = {
        //common
        201:"fluffy_fluffy_01",
        202:"fluffy_fluffy_01",
        203:"fluffy_fluffy_01",
        204:"fluffy_fluffy_01",
        205:"fluffy_fluffy_01",
        206:"fluffy_fluffy_01",
        207:"fluffy_fluffy_01",
        208:"fluffy_fluffy_01",
        209:"fluffy_fluffy_01",
        210:"fluffy_fluffy_01",
        211:"fluffy_fluffy_01",
        212:"fluffy_fluffy_01",
        //uncommon
        213:"fluffy_fluffier_01",
        214:"fluffy_fluffier_01",
        215:"fluffy_fluffier_01",
        216:"fluffy_fluffier_01",
        217:"fluffy_fluffier_01",
        218:"fluffy_fluffier_01",
        219:"fluffy_fluffier_01",
        220:"fluffy_fluffier_01",
        221:"fluffy_fluffier_01",
        222:"fluffy_fluffier_01",
        223:"fluffy_fluffier_01",
        224:"fluffy_fluffier_01",
        //rare
        225:"fluffy_fluffiest_01_front",
        226:"fluffy_fluffiest_01_front",
        227:"fluffy_fluffiest_01_front",
        228:"fluffy_fluffiest_01_front",
        229:"fluffy_fluffiest_01_front",
        230:"fluffy_fluffiest_01_front",
        231:"fluffy_fluffiest_01_front",
        232:"fluffy_fluffiest_01_front",
        233:"fluffy_fluffiest_01_front",
        234:"fluffy_fluffiest_01_front",
        235:"fluffy_fluffiest_01_front",
        236:"fluffy_fluffiest_01_front",
    }

    /*
    let _dic = {
        //common
        201:"star_blue",
        202:"star_green",
        203:"star_orange",
        204:"star_pink",
        205:"star_purple",
        206:"star_red",
        207:"star_skyblue",
        208:"star_yellow",
        209:"star_yellow",
        210:"star_yellow",
        211:"star_yellow",
        212:"star_yellow",
        //uncommon
        213:"star_blue",
        214:"star_green",
        215:"star_orange",
        216:"star_pink",
        217:"star_purple",
        218:"star_red",
        219:"star_skyblue",
        220:"star_yellow",
        221:"star_yellow",
        222:"star_yellow",
        223:"star_yellow",
        224:"star_yellow",
        //rare
        225:"star_blue",
        226:"star_green",
        227:"star_orange",
        228:"star_pink",
        229:"star_purple",
        230:"star_red",
        231:"star_skyblue",
        232:"star_yellow",
        233:"star_yellow",
        234:"star_yellow",
        235:"star_yellow",
        236:"star_yellow",
    }
    */
    let _img = _dic[_type];
    let _fluffy;
    if (rarity == "common"){
        _fluffy = new Fluffy(scene, 300, -100, _img, rarity, itemId, _type)
            .setOrigin(0.5)
            .setScale(0.07)
            .setAlpha(1)
            .setDepth(3);
    } else if (rarity == "uncommon") {
        _fluffy = new Fluffy(scene, 300, -100, _img, rarity, itemId, _type)
            .setOrigin(0.5)
            .setScale(0.10)
            .setAlpha(1)
            .setDepth(3);
    } else if (rarity == "rare") {
        _fluffy = new Fluffy(scene, 300, -100, _img, rarity, itemId, _type)
            .setOrigin(0.5)
            .setScale(0.15)
            .setAlpha(1)
            .setDepth(3);
    }
    _fluffy.on_summon();
    group_star.add(_fluffy);
    group_update.add(_fluffy);
    //murasaki hugging
    if (count_sync > 10) {
        murasakisan.on_click();
        sound_fluffy.play();
    }
}


//---update tx text
function update_tx_text(mode, hash) {
    if (typeof timeout_tx != "undefined") {
        clearTimeout(timeout_tx);
    }
    let _hash1 = hash.substring(0,10);
    let _hash2 = hash.slice(-10);
    let _txt = " (" + _hash1 + "..." + _hash2 + ")";
    group_tx.setVisible(true);
    if (mode == "sending") {
        text_tx.setText("Sending Transaction..." + _txt).setColor("#0000FF");
        timeout_tx = setTimeout(() => {group_tx.setVisible(false)}, 30000);
    } else if (mode == "done") {
        text_tx.setText("Transaction Confirmed!" + _txt).setColor("#FF0000");
        timeout_tx = setTimeout(() => {group_tx.setVisible(false)}, 10000);
    }
}    


//===<Phaser3>:preload========================================================--------


function preload(scene) {

    //---loading screen
    //https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13
    let progressBar = scene.add.graphics();
    let progressBox = scene.add.graphics();
    progressBox.fillStyle(0xFDEFF5, 0.4);
    progressBox.fillRect(480, 450, 320, 50);
    let progressText = scene.add.text(490,520,"", {font: "20px monospace", fill: "#3D3D3D"}); 
    let progressText_loading = scene.add.text(490,420, "Loading...", {font: "20px monospace", fill: "#3D3D3D"});
    let percentText = scene.add.text(510, 465, "", {font: "20px monospace", fill: "#3D3D3D"});
    let _arr = [
        "Making roasted sweet potatoes...",
        "Brushing a teddy bear...",
        "Looking for your shovel...",
        "Polishing the watering can...",
        "Assembling the sewing machine...",
        "Counting flowers and grass...",
        "Cleaning up the house...",
        "Replacing the sand in the sandbox...",
        "Adding fertilizer to the flowerpot...",
        "Treating a needle puncture wound...",
        "Washing the dishes...",
        "Putting a flower on the teddy bear...",
        "Painting your murasaki-san purple...",
        "Bathing the teddy bear...",
        "Polishing the floor...",
        "Counting the number of hairs on Fluffy...",
        "Charging the Murasaki-san battery...",
        "Shopping for cat food...",
        "Filling a fountain pen with ink...",
        "Baking pancakes...",
        "Writing Solidity code...",
        "Refactoring JavaScript code...",
        "Thinking about the peace of the world...",
        "Calling Mr. Sota Watanabe...",
        "Studying nuclear fusion...",
        "Chaingng a violin strings...",
        "Tuning the toy piano...",
        "Debugging Rust code...",
        "Drawing with ink! on the palette on the pallet...",
        "Smartly contracting to the smart contract...",
        "Assembling WebAssembly...",
    ];
    progressText.setText(_arr[Math.floor(Math.random() * _arr.length)]);
    let _threthold = 0.25;
    scene.load.on("progress", function(value) {
        if (flag_loaded == 0) {
            progressBar.clear();
            progressBar.fillStyle(0xE62E8B, 1);
            progressBar.fillRect(490, 460, 300 * value, 30);
            percentText.setText( Math.round(value * 100) + "%");
            if (value > _threthold) {
                progressText.setText(_arr[Math.floor(Math.random() * _arr.length)]);
                _threthold += 0.25;
            }
        }
    });
    scene.load.on("complete", function() {
        progressBar.destroy();
        progressBox.destroy();
        progressText.destroy();
        progressText_loading.destroy();
        percentText.destroy();
        flag_loaded = 1;
    });

    //---back
    scene.load.image("back", "src/png/background.png");
    scene.load.image("back_black", "src/png/background_black.png");
    scene.load.image("window", "src/png/background_window.png");
    //scene.load.image("back_neon", "src/png/background_neon.png");

    //---murasaki-san
    scene.load.spritesheet("murasaki_right", "src/png/murasaki_right.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_left", "src/png/murasaki_left.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_sleeping", "src/png/murasaki_sleeping2.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_feeding", "src/png/murasaki_feeding.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_feeding_happy_right", "src/png/murasaki_feeding_happy_right.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_feeding_happy_left", "src/png/murasaki_feeding_happy_left.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_crying", "src/png/murasaki_crying.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_mining", "src/png/murasaki_mining.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_hugging", "src/png/murasaki_hugging.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_farming", "src/png/murasaki_farming.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_grooming", "src/png/murasaki_grooming3.png", {frameWidth: 720, frameHeight: 622});
    scene.load.spritesheet("murasaki_crafting", "src/png/murasaki_crafting.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_working_left", "src/png/murasaki_working_left.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_working_right", "src/png/murasaki_working_right.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_click", "src/png/murasaki_click.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_stone", "src/png/murasaki_stone.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_hungry", "src/png/murasaki_hungry.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_listning", "src/png/murasaki_listning.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_neon_right", "src/png/murasaki_neon_right.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("murasaki_neon_left", "src/png/murasaki_neon_left.png", {frameWidth: 370, frameHeight: 320});

    //---button
    scene.load.image("button_feeding", "src/png/button_feeding.png");
    scene.load.image("button_feeding_pointerover", "src/png/button_feeding_pointerover.png");
    scene.load.image("button_mining_enable", "src/png/button_mining_enable.png");
    scene.load.image("button_mining_unable", "src/png/button_mining_unable.png");
    scene.load.image("button_mining_pointerover", "src/png/button_mining_pointerover.png");
    scene.load.image("button_mining_working", "src/png/button_mining_working.png");
    scene.load.image("button_mining_pointerover_stop", "src/png/button_mining_pointerover_stop.png");
    scene.load.image("button_farming_enable", "src/png/button_farming_enable.png");
    scene.load.image("button_farming_unable", "src/png/button_farming_unable.png");
    scene.load.image("button_farming_pointerover", "src/png/button_farming_pointerover.png");
    scene.load.image("button_farming_working", "src/png/button_farming_working.png");
    scene.load.image("button_farming_pointerover_stop", "src/png/button_farming_pointerover_stop.png");
    scene.load.image("button_crafting_enable", "src/png/button_crafting_enable.png");
    scene.load.image("button_crafting_unable", "src/png/button_crafting_unable.png");
    scene.load.image("button_crafting_pointerover", "src/png/button_crafting_pointerover.png");
    scene.load.image("button_crafting_working", "src/png/button_crafting_working.png");
    scene.load.image("button_crafting_pointerover_stop", "src/png/button_crafting_pointerover_stop.png");
    scene.load.image("button_crafting_pointerover_mint", "src/png/button_crafting_pointerover_mint.png");
    scene.load.image("button_grooming_enable", "src/png/button_grooming_enable.png");
    scene.load.image("button_grooming_unable", "src/png/button_grooming_unable.png");
    scene.load.image("button_grooming_pointerover", "src/png/button_grooming_pointerover.png");
    scene.load.image("button_levelup_enable", "src/png/button_levelup_enable.png");
    scene.load.image("button_levelup_unable", "src/png/button_levelup_unable.png");
    scene.load.image("button_levelup_pointerover", "src/png/button_levelup_pointerover.png");
    scene.load.image("back_level", "src/png/button_level.png");

    //---pet
    scene.load.spritesheet("mr_astar_right", "src/png/pet_mr_astar_right.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("mr_astar_left", "src/png/pet_mr_astar_left.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("ms_ether_right", "src/png/pet_ms_ether_right.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("ms_ether_left", "src/png/pet_ms_ether_left.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("dr_bitco_right", "src/png/pet_dr_bitco_right.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("dr_bitco_left", "src/png/pet_dr_bitco_left.png", {frameWidth: 600, frameHeight: 600});

    //---music
    scene.load.audio("bgm1", "src/music/Morning_2.mp3");
    scene.load.audio("bgm2", "src/music/Roll_Roll_Roll.mp3");
    scene.load.audio("bgm3", "src/music/amaoto.mp3");

    //---sound
    scene.load.audio("button_on", "src/sound/button_on.mp3");
    scene.load.audio("button_select", "src/sound/button_select.mp3");
    scene.load.audio("feeding", "src/sound/feeding.mp3");
    scene.load.audio("grooming", "src/sound/grooming.mp3");
    scene.load.audio("mining", "src/sound/mining.mp3");
    scene.load.audio("mining_during", "src/sound/mining_during.mp3");
    scene.load.audio("farming", "src/sound/farming.mp3");
    scene.load.audio("farming_during", "src/sound/farming_during.mp3");
    scene.load.audio("crafting", "src/sound/crafting.mp3");
    scene.load.audio("crafting_during", "src/sound/crafting_during.mp3");
    scene.load.audio("happy", "src/sound/happy.mp3");
    scene.load.audio("earn", "src/sound/earn.wav");
    scene.load.audio("dice", "src/sound/dice.mp3");
    scene.load.audio("dice_impact", "src/sound/dice_impact.mp3");
    scene.load.audio("hat", "src/sound/hat.mp3");
    scene.load.audio("unhappy", "src/sound/unhappy.mp3");
    scene.load.audio("switch", "src/sound/switch.mp3");
    scene.load.audio("window_open", "src/sound/window_open.mp3");
    scene.load.audio("window_pointerover", "src/sound/window_pointerover.mp3");
    scene.load.audio("window_select", "src/sound/window_select.mp3");
    scene.load.audio("window_cancel", "src/sound/window_cancel.mp3");
    scene.load.audio("system", "src/sound/system.mp3");
    scene.load.audio("nui", "src/sound/nui.mp3");
    scene.load.audio("pad", "src/sound/pad2.mp3");
    scene.load.audio("fireworks", "src/sound/fireworks.mp3");
    scene.load.audio("fireworks2", "src/sound/fireworks2.mp3");
    scene.load.audio("basket", "src/sound/basket.mp3");
    scene.load.audio("cat1", "src/sound/cat1.mp3");
    scene.load.audio("cat2", "src/sound/cat2.mp3");
    scene.load.audio("clock", "src/sound/clock.mp3");
    scene.load.audio("window", "src/sound/window.mp3");
    scene.load.audio("piano1", "src/sound/piano1.mp3");
    scene.load.audio("piano2", "src/sound/piano2.mp3");
    scene.load.audio("nainai1", "src/sound/nainai1.mp3");
    scene.load.audio("nainai2", "src/sound/nainai2.mp3");
    scene.load.audio("fluffy", "src/sound/fluffy.mp3");
    scene.load.audio("fluffy2", "src/sound/fluffy2.mp3");
    scene.load.audio("fluffy3", "src/sound/fluffy3.mp3");
    scene.load.audio("fluffy4", "src/sound/fluffy4.mp3");
    scene.load.audio("fluffy5", "src/sound/fluffy5.mp3");
    scene.load.audio("tokenChest", "src/sound/tokenChest.mp3");
    scene.load.audio("star", "src/sound/star.mp3");
    scene.load.audio("nyui", "src/sound/nyui.mp3");

    //---item_basic
    scene.load.image("item_table", "src/png/item_basic_table.png");
    scene.load.image("item_misin", "src/png/item_basic_misin.png");
    scene.load.image("item_tree0", "src/png/item_basic_tree0.png");
    scene.load.image("item_tree1", "src/png/item_basic_tree1.png");
    scene.load.image("item_tree2", "src/png/item_basic_tree2.png");
    scene.load.image("item_tree3", "src/png/item_basic_tree3.png");
    scene.load.image("item_bear", "src/png/item_basic_bear.png");
    //scene.load.image("item_sweet_potato", "src/png/item_basic_sweet_potato.png");
    scene.load.image("item_gold1", "src/png/item_basic_gold1.png");
    scene.load.image("item_gold2", "src/png/item_basic_gold2.png");
    scene.load.image("item_gold3", "src/png/item_basic_gold3.png");

    //---item_food
    scene.load.image("item_food_potato", "src/png/item_food_potato.png");
    scene.load.image("item_food_bread", "src/png/item_food_bread.png");
    scene.load.image("item_food_cake", "src/png/item_food_cake.png");
    scene.load.image("item_food_onigiri", "src/png/item_food_onigiri.png");
    scene.load.image("item_food_pancake", "src/png/item_food_pancake.png");
    
    //---item_craft
    scene.load.spritesheet("item_musicbox", "src/png/item_musicbox.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_violin", "src/png/item_violin.png");
    scene.load.image("item_vase", "src/png/item_vase.png");
    scene.load.image("item_kanban", "src/png/item_kanban4.png");
    scene.load.spritesheet("item_crown", "src/png/item_crown.png", {frameWidth: 370, frameHeight: 320});
    //scene.load.image("item_pudding", "src/png/item_pudding2.png");
    //scene.load.image("item_chocolate_bread", "src/png/item_chocolate_bread.png");
    scene.load.image("item_fortune_statue", "src/png/item_fortune_statue.png");
    scene.load.image("item_ribbon", "src/png/item_ribbon3.png");
    //scene.load.image("item_hat_tiny_crown", "src/png/item_hat_tiny_crown.png");
    //scene.load.image("item_kusa_pouch", "src/png/item_kusa_pouch.png");
    scene.load.image("item_dice", "src/png/item_dice.png");
    scene.load.image("item_dice_pointerover", "src/png/item_dice_pointerover.png");
    scene.load.image("item_hat_knit", "src/png/item_hat_knit.png");
    scene.load.image("item_hat_mugiwara", "src/png/item_hat_mugiwara.png");
    scene.load.image("item_bank", "src/png/item_bank.png");
    scene.load.image("item_bank_broken", "src/png/item_bank_broken.png");
    scene.load.image("item_hat_helmet", "src/png/item_hat_helmet.png");
    scene.load.image("item_asnya", "src/png/item_asnya.png");
    //scene.load.image("item_nui", "src/png/item_nui.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("item_nui", "src/png/item_nui2.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("item_nui_ribbon", "src/png/item_nui_ribbon.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("item_switch", "src/png/item_switch.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_pouch", "src/png/item_pouch.png");
    scene.load.image("item_pouch_broken", "src/png/item_pouch_broken.png");
    scene.load.image("item_hat_mortarboard", "src/png/item_hat_mortarboard.png");
    scene.load.image("item_pad_on", "src/png/item_pad_on.png");
    scene.load.image("item_pad_off", "src/png/item_pad_off.png");
    scene.load.spritesheet("item_tokenChest", "src/png/item_tokenChest.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_frame", "src/png/item_frame.png");
    //scene.load.image("item_wall_sticker", "src/png/item_wall_sticker.png");
    scene.load.image("item_wall_sticker_01", "src/png/item_wall_sticker_01.png");
    scene.load.image("item_wall_sticker_02", "src/png/item_wall_sticker_02.png");
    scene.load.image("item_wall_sticker_03", "src/png/item_wall_sticker_03.png");
    scene.load.image("item_wall_sticker_04", "src/png/item_wall_sticker_04.png");
    scene.load.image("item_wall_sticker_05", "src/png/item_wall_sticker_05.png");
    scene.load.image("item_wall_sticker_06", "src/png/item_wall_sticker_06.png");
    scene.load.image("item_wall_sticker_07", "src/png/item_wall_sticker_07.png");
    scene.load.image("item_wall_sticker_08", "src/png/item_wall_sticker_08.png");
    scene.load.image("item_wall_sticker_09", "src/png/item_wall_sticker_09.png");
    scene.load.image("item_wall_sticker_10", "src/png/item_wall_sticker_10.png");
    scene.load.image("item_wall_sticker_11", "src/png/item_wall_sticker_11.png");
    scene.load.image("item_wall_sticker_12", "src/png/item_wall_sticker_12.png");
    scene.load.spritesheet("item_wall_sticker_neon", "src/png/item_wall_sticker_neon.png", {frameWidth: 1280, frameHeight: 960});
    scene.load.image("item_floor_sticker_01", "src/png/item_floor_sticker_01.png");
    scene.load.image("item_floor_sticker_02", "src/png/item_floor_sticker_02.png");
    scene.load.image("item_floor_sticker_03", "src/png/item_floor_sticker_03.png");
    scene.load.image("item_floor_sticker_04", "src/png/item_floor_sticker_04.png");
    scene.load.image("item_floor_sticker_05", "src/png/item_floor_sticker_05.png");
    scene.load.image("item_floor_sticker_06", "src/png/item_floor_sticker_06.png");
    scene.load.image("item_floor_sticker_07", "src/png/item_floor_sticker_07.png");
    scene.load.image("item_floor_sticker_08", "src/png/item_floor_sticker_08.png");
    scene.load.image("item_floor_sticker_09", "src/png/item_floor_sticker_09.png");
    scene.load.image("item_floor_sticker_10", "src/png/item_floor_sticker_10.png");
    scene.load.image("item_floor_sticker_11", "src/png/item_floor_sticker_11.png");
    scene.load.image("item_floor_sticker_12", "src/png/item_floor_sticker_12.png");
    //scene.load.image("item_window", "src/png/item_window.png");
    scene.load.image("item_lantern", "src/png/item_lantern.png");
    scene.load.image("item_pancake", "src/png/item_pancake.png");
    //scene.load.image("item_sushi", "src/png/item_sushi.png");
    //scene.load.image("item_newsbunner", "src/png/item_newsbunner.png");
    scene.load.image("item_rugg", "src/png/item_rugg.png");
    scene.load.image("item_piano", "src/png/item_piano.png");
    scene.load.image("item_piano_opened", "src/png/item_piano_opened.png");
    scene.load.image("item_clock", "src/png/item_clock.png");
    scene.load.image("item_clock_opened", "src/png/item_clock_opened.png");
    scene.load.spritesheet("item_clock_anim", "src/png/item_clock_anim.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_window_day", "src/png/item_window_day.png");
    scene.load.image("item_window_day_closed", "src/png/item_window_day_closed.png");
    scene.load.image("item_window_night", "src/png/item_window_night.png");
    scene.load.image("item_window_night_closed", "src/png/item_window_night_closed.png");
    scene.load.image("item_newspaper", "src/png/item_newspaper.png");
    scene.load.image("item_book", "src/png/item_book.png");
    scene.load.image("item_hourglass", "src/png/item_hourglass.png");
    scene.load.image("item_presentbox_01", "src/png/item_presentbox_01.png");
    scene.load.image("item_presentbox_02", "src/png/item_presentbox_02.png");
    scene.load.image("item_presentbox_03", "src/png/item_presentbox_03.png");
    scene.load.image("item_presentbox_04", "src/png/item_presentbox_04.png");
    scene.load.image("item_presentbox_05", "src/png/item_presentbox_05.png");
    scene.load.image("item_presentbox_06", "src/png/item_presentbox_06.png");
    scene.load.image("item_presentbox_07", "src/png/item_presentbox_07.png");
    scene.load.image("item_presentbox_08", "src/png/item_presentbox_08.png");
    scene.load.image("item_fishbowl", "src/png/item_fishbowl.png");
    //scene.load.image("item_onigiri", "src/png/item_onigiri.png");
    
    //---ff
    scene.load.image("ff_preFestival_left", "src/png/ff_preFestival_left.png");
    scene.load.image("ff_duringFestival_left", "src/png/ff_duringFestival_left.png");
    scene.load.image("ff_duringFestival_pointerOver_left", "src/png/ff_duringFestival_pointerOver_left.png");
    scene.load.image("ff_duringFestival_afterVoting_left", "src/png/ff_duringFestival_afterVoting_left.png");
    scene.load.image("ff_duringFestival_isEndable_left", "src/png/ff_duringFestival_isEndable_left.png");
    scene.load.image("ff_preFestival_right", "src/png/ff_preFestival_right.png");
    scene.load.image("ff_duringFestival_right", "src/png/ff_duringFestival_right.png");
    scene.load.image("ff_duringFestival_pointerOver_right", "src/png/ff_duringFestival_pointerOver_right.png");
    scene.load.image("ff_duringFestival_afterVoting_right", "src/png/ff_duringFestival_afterVoting_right.png");
    scene.load.image("ff_duringFestival_isEndable_right", "src/png/ff_duringFestival_isEndable_right.png");
    //scene.load.image("ff_report", "src/png/ff_report.png");
    //scene.load.image("ff_report_final", "src/png/ff_report.png");
    scene.load.spritesheet("ff_reports", "src/png/ff_reports.png", {frameWidth: 615, frameHeight: 693});

    //---nyui
    scene.load.spritesheet("nyui_moving", "src/png/nyui_moving.png", {frameWidth: 370, frameHeight: 320});

    //---fluffy
    /*
    scene.load.image("fluffy_fluffy_01", "src/png/fluffy_fluffy_01.png");
    scene.load.image("fluffy_fluffier_01", "src/png/fluffy_fluffier_01.png");
    scene.load.image("fluffy_fluffiest_01", "src/png/fluffy_fluffiest_01.png");
    */
    scene.load.spritesheet("fluffy_fluffys", "src/png/fluffy_fluffys.png", {frameWidth: 370, frameHeight: 320});
    
    //---star
    /*
    scene.load.image("star_blue", "src/png/star_blue.png");
    scene.load.image("star_green", "src/png/star_green.png");
    scene.load.image("star_orange", "src/png/star_orange.png");
    scene.load.image("star_pink", "src/png/star_pink.png");
    scene.load.image("star_purple", "src/png/star_purple.png");
    scene.load.image("star_red", "src/png/star_red.png");
    scene.load.image("star_skyblue", "src/png/star_skyblue.png");
    scene.load.image("star_yellow", "src/png/star_yellow.png");
    */
        
    //---cat
    scene.load.image("item_mail", "src/png/item_mail.png");
    //scene.load.image("cat_sitting", "src/png/cat_sitting.png");
    //scene.load.spritesheet("cat_sleeping", "src/png/cat_sleeping.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("cats", "src/png/cats.png", {frameWidth: 370, frameHeight: 320});
    
    //---item_craft_todo
    scene.load.image("item_cushion", "src/png/item_cushion.png");

    //---icon_system
    scene.load.image("icon_kusa", "src/png/icon_system_kusa.png");
    scene.load.image("icon_ohana", "src/png/icon_system_ohana.png");
    scene.load.image("icon_clock", "src/png/icon_system_clock.png");
    scene.load.image("icon_heart", "src/png/icon_system_heart.png");
    scene.load.image("icon_rotate", "src/png/icon_system_rotate.png");
    scene.load.image("icon_home", "src/png/icon_system_home.png");
    scene.load.image("icon_satiety", "src/png/icon_system_satiety.png");
    scene.load.image("icon_happy", "src/png/icon_system_happy.png");

    //---icon_counter
    scene.load.image("icon_counter", "src/png/icon_clover.png");

    //---icon_status
    scene.load.image("icon_str", "src/png/icon_status_str.png");
    scene.load.image("icon_dex", "src/png/icon_status_dex.png");
    scene.load.image("icon_int", "src/png/icon_status_int.png");
    scene.load.image("icon_luk", "src/png/icon_status_luk.png");

    //---plugin: rexuiplugin
    //need for nameplate
    /*
    scene.load.scenePlugin({
        key: 'rexuiplugin',
        url: "lib/rexuiplugin.min.js",
        sceneKey: 'rexUI'
    });
    scene.load.plugin('rextexteditplugin', 'lib/rextexteditplugin.min.js', true);
    */
    
    //---particles
    //https://codepen.io/samme/pen/eYEearb
    scene.load.atlas('par_flares', 'src/particle/flares.png', 'src/particle/flares.json');
    scene.load.spritesheet("par_flowers", "src/particle/flowers.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("par_stars", "src/particle/stars.png", {frameWidth: 200, frameHeight: 191});
    scene.load.spritesheet("par_fluffys", "src/particle/fluffy.png", {frameWidth: 370, frameHeight: 320});
    
    //---tokenBall
    scene.load.image("coin_color_ACA", "src/png/coin_color_ACA.png");
    scene.load.image("coin_color_ASTR", "src/png/coin_color_ASTR.png");
    scene.load.image("coin_color_BNB", "src/png/coin_color_BNB.png");
    scene.load.image("coin_color_BTC", "src/png/coin_color_BTC.png");
    scene.load.image("coin_color_BUSD", "src/png/coin_color_BUSD.png");
    scene.load.image("coin_color_DAI", "src/png/coin_color_DAI.png");
    scene.load.image("coin_color_DOT", "src/png/coin_color_DOT.png");
    scene.load.image("coin_color_ETH", "src/png/coin_color_ETH.png");
    scene.load.image("coin_color_GLMR", "src/png/coin_color_GLMR.png");
    scene.load.image("coin_color_KSM", "src/png/coin_color_KSM.png");
    scene.load.image("coin_color_LAY", "src/png/coin_color_LAY.png");
    scene.load.image("coin_color_MATIC", "src/png/coin_color_MATIC.png");
    scene.load.image("coin_color_SDN", "src/png/coin_color_SDN.png");
    scene.load.image("coin_color_USDC", "src/png/coin_color_USDC.png");
    scene.load.image("coin_color_USDT", "src/png/coin_color_USDT.png");
    array_image_tokenBall = [
        "coin_color_ACA",
        "coin_color_ASTR",
        "coin_color_BNB",
        "coin_color_BTC",
        "coin_color_BUSD",
        "coin_color_DAI",
        "coin_color_DOT",
        "coin_color_ETH",
        "coin_color_GLMR",
        "coin_color_KSM",
        "coin_color_LAY",
        "coin_color_MATIC",
        "coin_color_SDN",
        "coin_color_USDC",
        "coin_color_USDT",
    ];
    dic_tokenBall_img = {
        ACA:"coin_color_ACA",
        ASTR:"coin_color_ASTR",
        BNB:"coin_color_BNB",
        BTC:"coin_color_BTC",
        BUSD:"coin_color_BUSD",
        DAI:"coin_color_DAI",
        DOT:"coin_color_DOT",
        ETH:"coin_color_ETH",
        GLMR:"coin_color_GLMR",
        KSM:"coin_color_KSM",
        LAY:"coin_color_LAY",
        MATIC:"coin_color_MATIC",
        SDN:"coin_color_SDN",
        USDC:"coin_color_USDC",
        USDT:"coin_color_USDT"
    }
    //***TODO*** contract
    //local
    dic_tokenBall_contract = {
        ACA:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        ASTR:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        BNB:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        BTC:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        BUSD:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        DAI:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        DOT:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        ETH:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        GLMR:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        KSM:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        LAY:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        MATIC:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        SDN:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        USDC:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF",
        USDT:"0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF"
    }
    //shibuya
    /*
    dic_tokenBall_contract = {
        ACA:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        ASTR:0,
        BNB:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        BTC:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        BUSD:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        DAI:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        DOT:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        ETH:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        GLMR:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        KSM:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        LAY:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        MATIC:"0xa4C17AD6bEC86e1233499A9B174D1E2D466c7198",
        SDN:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        USDC:"0x37B76d58FAFc3Bc32E12E2e720F7a57Fc94bE871",
        USDT:"0xa4C17AD6bEC86e1233499A9B174D1E2D466c7198"
    }
    */
}


//===<Phaser3>:create========================================================--------


function create(scene) {

    //---group
    group_star = scene.add.group();
    group_update = scene.add.group();
    group_update.runChildUpdate = true;
    group_info = scene.add.group();
    group_nyuinyui_ohana = scene.add.group();
    group_neonStar = scene.add.group();
    
    //---back image
    scene.add.image(640, 480, "back");
    //back_neon = scene.add.image(900, 180, "back_neon").setOrigin(0.5).setScale(0.3);
    //back_neon.angle += 10;
    //back_neon.visible = false;
    //back_neon.depth = 9999+11;
    
    //---animation wall sticker
    scene.anims.create({
        key: "wall_sticker_neon",
        frames: scene.anims.generateFrameNumbers("item_wall_sticker_neon", {frames:[0,0,1,1,2,2]}),
        frameRate: 1,
        repeat: -1
    });

    //---animation murasaki
    scene.anims.create({
        key: "murasaki_right",
        frames: scene.anims.generateFrameNumbers("murasaki_right", {start:0, end:3}),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_left",
        frames: scene.anims.generateFrameNumbers("murasaki_left", {start:0, end:3}),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_sleeping",
        frames: scene.anims.generateFrameNumbers("murasaki_sleeping", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_feeding",
        frames: scene.anims.generateFrameNumbers("murasaki_feeding", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_feeding_happy_right",
        frames: scene.anims.generateFrameNumbers("murasaki_feeding_happy_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_feeding_happy_left",
        frames: scene.anims.generateFrameNumbers("murasaki_feeding_happy_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_crying",
        frames: scene.anims.generateFrameNumbers("murasaki_crying", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_mining",
        frames: scene.anims.generateFrameNumbers("murasaki_mining", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_hugging",
        frames: scene.anims.generateFrameNumbers("murasaki_hugging", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_farming",
        frames: scene.anims.generateFrameNumbers("murasaki_farming", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_grooming",
        frames: scene.anims.generateFrameNumbers("murasaki_grooming", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_crafting",
        frames: scene.anims.generateFrameNumbers("murasaki_crafting", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_working_left",
        frames: scene.anims.generateFrameNumbers("murasaki_working_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_working_right",
        frames: scene.anims.generateFrameNumbers("murasaki_working_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_click",
        frames: scene.anims.generateFrameNumbers("murasaki_click", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_stone",
        frames: scene.anims.generateFrameNumbers("murasaki_stone", {start:0, end:0}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_listning",
        frames: scene.anims.generateFrameNumbers("murasaki_listning", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_neon_right",
        frames: scene.anims.generateFrameNumbers("murasaki_neon_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_neon_left",
        frames: scene.anims.generateFrameNumbers("murasaki_neon_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });

    //---animation pet
    scene.anims.create({
        key: "mr_astar_right",
        frames: scene.anims.generateFrameNumbers("mr_astar_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "mr_astar_left",
        frames: scene.anims.generateFrameNumbers("mr_astar_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "ms_ether_right",
        frames: scene.anims.generateFrameNumbers("ms_ether_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "ms_ether_left",
        frames: scene.anims.generateFrameNumbers("ms_ether_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "dr_bitco_right",
        frames: scene.anims.generateFrameNumbers("dr_bitco_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "dr_bitco_left",
        frames: scene.anims.generateFrameNumbers("dr_bitco_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    
    //---animation item
    scene.anims.create({
        key: "item_musicbox_on",
        frames: scene.anims.generateFrameNumbers("item_musicbox", {start:1, end:2}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_musicbox_off",
        frames: scene.anims.generateFrameNumbers("item_musicbox", {start:0, end:0}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_crown",
        frames: scene.anims.generateFrameNumbers("item_crown", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "murasaki_hungry",
        frames: scene.anims.generateFrameNumbers("murasaki_hungry", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_switch_on",
        frames: scene.anims.generateFrameNumbers("item_switch", {start:0, end:0}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_switch_off",
        frames: scene.anims.generateFrameNumbers("item_switch", {start:1, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_nui",
        frames: scene.anims.generateFrameNumbers("item_nui", {start:0, end:0}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_nui_alive",
        frames: scene.anims.generateFrameNumbers("item_nui", {start:1, end:3}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_clock_anim_1",
        frames: scene.anims.generateFrameNumbers("item_clock_anim", {start:1, end:0}),
        frameRate: 1,
        repeat: 0
    });
    scene.anims.create({
        key: "item_clock_anim_2",
        frames: scene.anims.generateFrameNumbers("item_clock_anim", {start:1, end:0}),
        frameRate: 1,
        repeat: 1
    });
    scene.anims.create({
        key: "item_clock_anim_3",
        frames: scene.anims.generateFrameNumbers("item_clock_anim", {start:1, end:0}),
        frameRate: 1,
        repeat: 2
    });
    
    //---animation cat
    //***TODO***cat
    scene.anims.create({
        key: "cat_sleeping",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_standing",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[2,3]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_standing_withMail",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[4,5]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_walking_right",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[6,7]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_walking_right_fast",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[6,7]}),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_walking_left",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[8,9]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_walking_left_fast",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[8,9]}),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_walking_right_withMail",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[10,11]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_walking_right_withMail_fast",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[10,11]}),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_walking_left_withMail",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[12,13]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_walking_left_withMail_fast",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[12,13]}),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: "cat_sleeping_withMail",
        frames: scene.anims.generateFrameNumbers("cats", {frames:[14,15]}),
        frameRate: 1,
        repeat: -1
    });
    
    //---animation fluffy
    //fluffier, blinking
    for (i=1; i<=12; i++) {
        let _key = "fluffy_fluffier_" + ("00" + i).slice(-2);
        let _frames = [1 +8*(i-1), 1 +8*(i-1), 2 +8*(i-1)];
        scene.anims.create({
            key: _key,
            frames: scene.anims.generateFrameNumbers("fluffy_fluffys", {frames: _frames}),
            frameRate: 1,
            repeat: -1
        });
    }

    //fluffiest, moving, left
    for (i=1; i<=12; i++) {
        let _key = "fluffy_fluffiest_" + ("00" + i).slice(-2) + "_left";
        let _frames = [4 +8*(i-1), 5 +8*(i-1)];
        scene.anims.create({
            key: _key,
            frames: scene.anims.generateFrameNumbers("fluffy_fluffys", {frames: _frames}),
            frameRate: 2,
            repeat: -1
        });
    }
    //fluffiest, moving, right
    for (i=1; i<=12; i++) {
        let _key = "fluffy_fluffiest_" + ("00" + i).slice(-2) + "_right";
        let _frames = [6 +8*(i-1), 7 +8*(i-1)];
        scene.anims.create({
            key: _key,
            frames: scene.anims.generateFrameNumbers("fluffy_fluffys", {frames: _frames}),
            frameRate: 2,
            repeat: -1
        });
    }
        
    //---animation nyui
    scene.anims.create({
        key: "nyui_moving_left",
        frames: scene.anims.generateFrameNumbers("nyui_moving", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "nyui_moving_right",
        frames: scene.anims.generateFrameNumbers("nyui_moving", {start:2, end:3}),
        frameRate: 1,
        repeat: -1
    });
    
    //---animation ff
    scene.anims.create({
        key: "ff_report",
        frames: scene.anims.generateFrameNumbers("ff_reports", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "ff_report_close",
        frames: scene.anims.generateFrameNumbers("ff_reports", {frames:[2,3]}),
        frameRate: 1,
        repeat: -1
    });
    
    //---item_basic
    item_bear = scene.add.sprite(1000,400, "item_bear")
        .setScale(0.45);
    item_table = scene.add.sprite(600,870, "item_table")
        .setOrigin(0.5)
        .setScale(0.6)
        //.setDepth(870-50);
        .setDepth(2);
    item_misin = scene.add.sprite(950,830, "item_misin")
        .setOrigin(0.5)
        .setScale(0.8)
        //.setDepth(830-100);
        .setDepth(2);
    item_tree0 = scene.add.sprite(100,400, "item_tree0")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(420);
    item_tree1 = scene.add.sprite(100,400, "item_tree1")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(420+2);
    item_tree2 = scene.add.sprite(100,400, "item_tree2")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(420+1);
    item_tree3 = scene.add.sprite(100,400, "item_tree3")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(420);
    item_tree1.visible = false;
    item_tree2.visible = false;
    item_tree3.visible = false;
    item_gold1 = scene.add.sprite(130,750, "item_gold1")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(750);
    item_gold2 = scene.add.sprite(130,750, "item_gold2")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(750+1);
    item_gold3 = scene.add.sprite(130,750, "item_gold3")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(750+2);
    item_gold1.visible = false;
    item_gold2.visible = false;
    item_gold3.visible = false;

    //---click button
    
    let _x;
    let _y;

    //feeding
    _x = 460;
    _y = 870;
    button_feeding = scene.add.sprite(_x, _y, "button_feeding")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_feeding(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_feeding.setTexture("button_feeding_pointerover"))
        .on('pointerout', () => button_feeding.setTexture("button_feeding"));
    group_info.add(button_feeding);

    //grooming
    _x = 1150;
    _y = 400;
    button_grooming = scene.add.sprite(_x, _y, "button_grooming_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_grooming(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_grooming.setTexture("button_grooming_pointerover"))
        .on('pointerout', () => button_grooming.setTexture("button_grooming"))
        .disableInteractive();
    group_info.add(button_grooming);

    //crafting
    _x = 820;
    _y = 870;
    button_crafting = scene.add.sprite(_x, _y, "button_crafting_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_crafting(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_crafting.setTexture("button_crafting_pointerover"))
        .on('pointerout', () => button_crafting.setTexture("button_crafting_enable"))
        .setDepth(3)
        .disableInteractive();
    group_info.add(button_crafting);


    //--crafting_selected_info
    //icon_ohana
    icon_crafting_ohana = scene.add.sprite(_x+58, _y+13, "icon_ohana")
        .setDepth(9999)
        .setScale(0.07)
        .setVisible(false);
    //icon_kusa
    icon_crafting_kusa = scene.add.sprite(_x+130, _y+15, "icon_kusa")
        .setDepth(9999)
        .setScale(0.09)
        .setVisible(false);
    //icon_clock
    icon_crafting_time = scene.add.sprite(_x+58, _y+42, "icon_clock")
        .setDepth(9999)
        .setScale(0.09)
        .setVisible(false);
    //icon_heart
    icon_crafting_heart = scene.add.sprite(_x+200, _y+13, "icon_heart")
        .setDepth(9999)
        .setScale(0.08)
        .setVisible(false);
    //text
    text_crafting_selected_item_ohana = scene.add.text(
        _x+72, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);
    text_crafting_selected_item_kusa = scene.add.text(
        _x+142, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);
    text_crafting_selected_item_heart = scene.add.text(
        _x+214, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);
    text_crafting_selected_item_time = scene.add.text(
        _x+72, 
        _y+32, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);

    //---craftimg_now_info
    //icon_clock
    icon_crafting_time_remining = scene.add.sprite(_x+60, _y+15, "icon_clock")
        .setDepth(9999)
        .setScale(0.09)
        .setVisible(false);
    //text
    text_crafting_calc = scene.add.text(
        _x+75, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);
    //select crafting_item_type
    text_select_item = scene.add.text(_x+50, _y-30, ">> Select Item <<", {font: "30px Arial", fill: "#000", backgroundColor: "#ecd9ff"})
                .setDepth(9999)
                .setFontSize(24).setFontFamily("Arial").setFill('#000000')
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => {
                    if (flag_window_craft == 0) {
                        flag_window_craft = 1;
                        open_window_craft(scene);
                    }
                })
                .on("pointerover", () => text_select_item.setStyle({ fontSize: 24, fontFamily: "Arial", fill: '#d19dff' }))
                .on("pointerout", () => text_select_item.setStyle({ fontSize: 24, fontFamily: "Arial", fill: '#000000' }));
    group_info.add(text_select_item);
    text_craft_item = scene.add.text(_x+50, _y, "", {font: "18px Arial", fill: "#000"})
                .setDepth(9999)
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => open_window_craft(scene) )
    group_info.add(text_craft_item);

    //mining
    _x = 60;
    _y = 760;
    button_mining = scene.add.sprite(_x, _y, "button_mining_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_mining(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_mining.setTexture("button_mining_pointerover"))
        .on('pointerout', () => button_mining.setTexture("button_mining_enable"))
        .disableInteractive();
    group_info.add(button_mining);
    //icon
    icon_mining = scene.add.sprite(_x+55, _y-22, "icon_ohana")
        .setScale(0.07)
        .setVisible(false);
    //text
    text_mining_calc = scene.add.text(_x+67, _y-30, "", {font: "18px Arial", fill: "#000"});

    //farming
    _x = 240;
    _y = 340;
    button_farming = scene.add.sprite(_x, _y, "button_farming_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_farming(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_farming.setTexture("button_farming_pointerover"))
        .on('pointerout', () => button_farming.setTexture("button_farming_enable"))
        .disableInteractive();
    group_info.add(button_farming);
    //icon
    icon_farming = scene.add.sprite(_x+55, _y-20, "icon_kusa")
        .setScale(0.09)
        .setVisible(false);
    //text
    text_farming_calc = scene.add.text(_x+65, _y-30, "", {font: "18px Arial", fill: "#000"});

    //level
    _x = 1240;
    _y = 35;
    button_levelup = scene.add.sprite(_x, _y, "back_level")
        .setScale(0.11)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_level_up(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_levelup.setTexture("button_levelup_pointerover"))
        .on('pointerover', () => text_level.setText(""))
        .on('pointerout', () => button_levelup.setTexture("button_levelup_enable"))
        .on('pointerout', () => text_level.setText(local_level))
        .disableInteractive();
    text_level = scene.add.text(_x, _y+7, "0", {font: "bold 26px Verdana", fill: "#E5004F"}).setOrigin(0.5);
    group_info.add(button_levelup);
    group_info.add(text_level);

    //---system click button
    //icon_rotate
    icon_rotate = scene.add.sprite(1235,915-15, "icon_rotate")
        .setOrigin(0.5)
        .setScale(0.075)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_system.play())
        .on("pointerdown", () => {
            if (scene.sys.game.scale.gameSize._width == 1280) {
                scene.scale.setGameSize(960,1280);
                scene.cameras.main.rotation = 90 * Math.PI / 180;
                scene.cameras.main.centerOn(640,480);
            } else {
                scene.scale.setGameSize(1280,960);
                scene.cameras.main.rotation = 0;
                scene.cameras.main.centerOn(640,480);
            }
        });
    group_info.add(icon_rotate);

    //icon_home
    icon_home = scene.add.sprite(1155,915-15, "icon_home")
        .setOrigin(0.5)
        .setScale(0.15)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_system.play())
        .on("pointerdown", () => {
                window.location.href = "./";
        });
    group_info.add(icon_home);

    //---music
    //sound out of focus
    scene.sound.pauseOnBlur = false
    bgm1 = scene.sound.add("bgm1", {volume:0.1, loop:true});
    bgm2 = scene.sound.add("bgm2", {volume:0.1, loop:true});
    bgm3 = scene.sound.add("bgm3", {volume:0.1, loop:true});

    //---sound
    sound_button_select = scene.sound.add("button_select", {volume:0.2});
    sound_button_on = scene.sound.add("button_on", {volume:0.2});
    sound_feeding = scene.sound.add("feeding", {volume:0.1});
    sound_grooming = scene.sound.add("grooming", {volume:0.1});
    sound_mining = scene.sound.add("mining", {volume:0.1});
    sound_mining_during = scene.sound.add("mining_during", {volume:0.1});
    sound_farming = scene.sound.add("farming", {volume:0.1});
    sound_farming_during = scene.sound.add("farming_during", {volume:0.2});
    sound_crafting = scene.sound.add("crafting", {volume:0.2});
    sound_crafting_during = scene.sound.add("crafting_during", {volume:0.1});
    sound_happy = scene.sound.add("happy", {volume:0.2});
    sound_earn = scene.sound.add("earn", {volume:0.2});
    sound_dice = scene.sound.add("dice", {volume:0.15});
    sound_dice_impact = scene.sound.add("dice_impact", {volume:0.1});
    sound_hat = scene.sound.add("hat", {volume:0.1});
    sound_unhappy = scene.sound.add("unhappy", {volume:0.2});
    sound_switch = scene.sound.add("switch", {volume:0.2});
    sound_window_open = scene.sound.add("window_open", {volume:0.2});
    sound_window_pointerover = scene.sound.add("window_pointerover", {volume:0.2});
    sound_window_select = scene.sound.add("window_select", {volume:0.2});
    sound_window_cancel = scene.sound.add("window_cancel", {volume:0.2});
    sound_system = scene.sound.add("system", {volume:0.2});
    sound_nui = scene.sound.add("nui", {volume:0.2});
    sound_pad = scene.sound.add("pad", {volume:0.2});
    sound_fireworks = scene.sound.add("fireworks", {volume:0.2});
    sound_fireworks2 = scene.sound.add("fireworks2", {volume:0.2});
    sound_basket = scene.sound.add("basket", {volume:0.2});
    sound_cat1 = scene.sound.add("cat1", {volume:0.2});
    sound_cat2 = scene.sound.add("cat2", {volume:0.2});
    sound_clock = scene.sound.add("clock", {volume:0.2});
    sound_window = scene.sound.add("window", {volume:0.2});
    sound_piano1 = scene.sound.add("piano1", {volume:0.3});
    sound_piano2 = scene.sound.add("piano2", {volume:0.25});
    sound_nainai1 = scene.sound.add("nainai1", {volume:0.2});
    sound_nainai2 = scene.sound.add("nainai2", {volume:0.2});
    sound_fluffy = scene.sound.add("fluffy", {volume:0.2});
    sound_fluffy2 = scene.sound.add("fluffy2", {volume:0.2});
    sound_fluffy3 = scene.sound.add("fluffy3", {volume:0.2});
    sound_fluffy4 = scene.sound.add("fluffy4", {volume:0.2});
    sound_fluffy5 = scene.sound.add("fluffy5", {volume:0.2});
    sound_tokenChest = scene.sound.add("tokenChest", {volume:0.2});
    sound_star = scene.sound.add("star", {volume:0.1});
    sound_nyui = scene.sound.add("nyui", {volume:0.1});

    //---system message
    //system message
    text_system_message = scene.add.text(640, 420, "", {
        font: "32px Arial", 
        fill: "#000000", 
        backgroundColor: "#ffffff",
        align: "center"
    }).setOrigin(0.5).setDepth(99999);

    //summon
    text_summon = scene.add.text(640, 480, ">> Summon your Murasaki-san <<", {font: "30px Arial", fill: "#E62E8B", backgroundColor: "#FDEFF5"})
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => open_window_summon(scene) )
        .on("pointerover", () => text_summon.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#0000ff' }))
        .on("pointerout", () => text_summon.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#E62E8B' }));
    text_summon.visible = false;

    //kill
    //new Button(10, 880, 'kill_summoner', scene, () => contract_burn(summoner));
    //burn name
    //new Button(10, 780, 'burn_name', scene, () => contract_burn_name(summoner));
    new Button(1170, 530, "[debug]", scene, () => {
        if (flag_debug == 0) {
            flag_debug = 1;
        } else {
            flag_debug = 0;
        }
    });

    //curePetrification
    text_curePetrification = scene.add.text(640, 480, " >> Cure Petrification (Cost: Lv x 10 $ASTR) << ", {font: "28px Arial", fill: "#E62E8B", backgroundColor: "#FDEFF5"})
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .setDepth(99999)
        .on("pointerdown", () => contract_curePetrification(summoner) )
        .on("pointerover", () => text_curePetrification.setStyle({ fontSize: 28, fontFamily: "Arial", fill: '#0000ff' }))
        .on("pointerout", () => text_curePetrification.setStyle({ fontSize: 28, fontFamily: "Arial", fill: '#E62E8B' }));
    text_curePetrification.visible = false;

    //---status
    let font_arg = {font: "18px Arial", fill: "#000"};

    //debug info
    //text_turn = scene.add.text(250, 920, "***", {font: "14px Arial", fill: "#727171"});
    text_fps = scene.add.text(5, 955, "***", {font: "14px Arial", fill: "#303030"})
        .setOrigin(0,1)
        .setDepth(2);
    //text_sync_time = scene.add.text(330, 940, "***", {font: "14px Arial", fill: "#727171"});
    text_sync_time = scene.add.text(1275, 955, "***", {font: "14px Arial", fill: "#727171"})
        .setOrigin(1)
        .setDepth(9999);
    //text_wallet = scene.add.text(430, 940, "***", {font: "14px Arial", fill: "#727171"});
    text_wallet = scene.add.text(1250, 955, "***", {font: "14px Arial", fill: "#727171"})
        .setOrigin(1)
        .setDepth(9999);
    group_info.add(text_fps);
    group_info.add(text_sync_time);
    group_info.add(text_wallet);

    //satiety
    icon_satiety = scene.add.sprite(30,25, "icon_satiety")
        .setScale(0.08)
        .setDepth(9999);
    bar_satiety_back = makeBar(scene, 55, 15, 0xF8C5AC)
        .setDepth(9999);
    bar_satiety_back.scaleX = 1;
    bar_satiety = makeBar(scene, 55, 15, 0xE60012)
        .setDepth(9999);
    bar_satiety.scaleX = 0;
    text_satiety = scene.add.text(60, 16, "0%", {font: "17px Arial", fill: "#ffffff"})
        .setDepth(9999);
    group_info.add(icon_satiety);
    group_info.add(bar_satiety_back);
    group_info.add(bar_satiety);
    group_info.add(text_satiety);

    //happy
    icon_happy = scene.add.sprite(245,25, "icon_happy")
        .setScale(0.08)
        .setDepth(9999);
    bar_happy_back = makeBar(scene, 270, 15, 0xFCE2BA)
        .setDepth(9999);
    bar_happy_back.scaleX = 1;
    bar_happy = makeBar(scene, 270, 15, 0xF39800)
        .setDepth(9999);
    bar_happy.scaleX = 0;
    text_happy = scene.add.text(275, 16, "0%", {font: "17px Arial", fill: "#ffffff"})
        .setDepth(9999);
    group_info.add(icon_happy);
    group_info.add(bar_happy_back);
    group_info.add(bar_happy);
    group_info.add(text_happy);

    //exp
    icon_exp = scene.add.text(440, 15, "Exp:", font_arg)
        .setDepth(9999);
    bar_exp_back = makeBar(scene, 480, 15, 0xBBCCE9)
        .setDepth(9999);
    bar_exp_back.scaleX = 1;
    bar_exp = makeBar(scene, 480, 15, 0x0068B7)
        .setDepth(9999);
    bar_exp.scaleX = 0;
    text_exp = scene.add.text(485, 16, "0 / 0", {font: "17px Arial", fill: "#ffffff"})
        .setDepth(9999);
    text_exp_earned = scene.add.text(480, 38, "", {font: "17px Arial", fill: "#000000"})
        .setDepth(9999);
    text_exp_earned_count = 0;
    group_info.add(icon_exp);
    group_info.add(bar_exp_back);
    group_info.add(bar_exp);
    group_info.add(text_exp);

    //coin
    icon_ohana = scene.add.sprite(668,23, "icon_ohana")
        .setScale(0.07)
        .setDepth(9999);
    text_coin = scene.add.text(685, 15, "Coin: 0", {font: "17px Arial", fill: "#000", backgroundColor: "#FFF200"})
        .setDepth(9999);
    text_coin_earned = scene.add.text(685, 38, "", {font: "17px Arial", fill: "#000000"})
        .setDepth(9999);
    text_coin_earned_count = 0;
    group_info.add(icon_ohana);
    group_info.add(text_coin);

    //material
    icon_kusa = scene.add.sprite(815, 25, "icon_kusa")
        .setScale(0.09)
        .setDepth(9999);
    text_material = scene.add.text(830, 15, "Leaf: 0", {font: "17px Arial", fill: "#000", backgroundColor: "#D7E7AF"})
        .setDepth(9999);
    text_material_earned = scene.add.text(830, 38, "", {font: "17px Arial", fill: "#000000"})
        .setDepth(9999);
    text_material_earned_count = 0;
    group_info.add(icon_kusa);
    group_info.add(text_material);

    //heart
    icon_heart = scene.add.sprite(960, 21, "icon_heart")
        .setScale(0.08)
        .setDepth(9999);
    text_fluffy = scene.add.text(1045, 40, "", {font: "17px Arial", fill: "#000", backgroundColor: "#FDEEED"})
        .setOrigin(1,0)
        .setVisible(false)
        .setDepth(9999);
    text_heart = scene.add.text(975, 15, "***", {font: "17px Arial", fill: "#000", backgroundColor: "#FDEEED"})
        .setDepth(9999)
        .setInteractive()
        .on("pointerover", () => text_fluffy.setVisible(true))
        .on("pointerout", () => {
            setTimeout( () => {
                text_fluffy.setVisible(false);
            }, 1000);
        });
    group_info.add(icon_heart);
    group_info.add(text_heart);

    //name
    _x = 85;
    _y = 100;
    item_kanban = scene.add.sprite(85, 100, "item_kanban")
        .setScale(0.4);
    text_kanban = scene.add.text(_x+2, _y+17, "", {font: "17px Arial", fill: "#000000"})
        .setOrigin(0.5)
	    .setInteractive({useHandCursor: true})
	    .on('pointerdown', () => {scene.rexUI.edit(text_kanban);}, scene)
        .setDepth(9999+2);
    text_mint_name = scene.add.text(_x+80, _y-5, "[MINT NAME]", {font: "17px Arial", fill: "#000000"})
        .setInteractive({useHandCursor: true})
        .on("pointerover", () => text_mint_name.setStyle({ fontSize: 17, fontFamily: "Arial", fill: '#ffff00' }))
        .on("pointerout", () => text_mint_name.setStyle({ fontSize: 17, fontFamily: "Arial", fill: '#000000' }))
        .on("pointerdown", () => {
            contract_mint_name(summoner, text_kanban.text);
            flag_name_minting = 1;
        });
    icon_name_ohana = scene.add.sprite(_x+88, _y+25, "icon_ohana")
        .setScale(0.05);
    text_name_ohana = scene.add.text(_x+100, _y+17, "100", {font: "17px Arial", fill: "#000000"});
    icon_name_kusa = scene.add.sprite(_x+140, _y+25, "icon_kusa")
        .setScale(0.07);
    text_name_kusa = scene.add.text(_x+150, _y+17, "100", {font: "17px Arial", fill: "#000000"});
    //id
    text_id = scene.add.text(_x-45, _y+32, "#100", {font: "14px Arial", fill: "#000000"});
    //age
    text_age_time = scene.add.text(_x+10, _y+32, "***", {font: "14px Arial", fill: "#000000"});
    group_info.add(text_id);
    group_info.add(text_age_time);

    //lootlike
    let _dic_color_birthplace = {
        "fluffy sweater":"#EB6100",
        "fluffy blanket":"#F39800",
        "fluffy carpet":"#FCC800",
        "fluffy cushion":"#FFF100",
        "fluffy scarf":"#CFDB00",
        "fluffy towel":"#8FC31F",
        "woolly sweater":"#22AC38",
        "woolly blanket":"#009944",
        "woolly carpet":"#009B6B",
        "woolly cushion":"#009E96",
        "woolly scarf":"#00A0C1",
        "woolly towel":"#00A0E9",
        "feathery sweater":"#0086D1",
        "feathery blanket":"#0068B7",
        "feathery carpet":"#00479D",
        "feathery cushion":"#1D2088",
        "feathery scarf":"#601986",
        "feathery towel":"#920783",
    };
    let _dic_color_personality = {
        "friendly":"#EB6100",
        "reliable":"#F39800",
        "optimistic":"#FCC800",
        "frisky":"#FFF100",
        "thoughtful":"#CFDB00",
        "honest":"#8FC31F",
        "easygoing":"#22AC38",
        "tolerant":"#009944",
        "mild":"#009B6B",
        "affectionate":"#009E96",
        "intelligent":"#00A0C1",
        "patient":"#00A0E9",
        "faithful":"#0086D1",
        "innocent":"#0068B7",
        "gentle":"#00479D",
    };
    let _dic_color_other = {
        "inredible":"#EB6100",
        "marvelous":"#F39800",
        "excellent":"#FCC800",
        "amazing":"#FFF100",
        "great":"#CFDB00",
        "fabulous":"#8FC31F",
        "wonderful":"#22AC38",
        "gorgeous":"#009944",
        "awesome":"#009B6B",
        "fantastic":"#009E96",
        "lovely":"#00A0C1",
        "brilliant":"#00A0E9",
        "impressive":"#0086D1",
        "superb":"#0068B7",
    };
    let _text_lootlike_base = "";
    _text_lootlike_base += " Birthplace:                        \n";
    _text_lootlike_base += " Softness:                          \n";
    _text_lootlike_base += " Fluffiness:                        \n";
    _text_lootlike_base += " Elasticity:                        \n";
    _text_lootlike_base += " Personality:                       ";
    let _text_lootlike_birthplace = "                       " + local_birthplace;
    let _text_lootlike_softness = "\n                       " + local_softness;
    let _text_lootlike_fluffiness = "\n\n                       " + local_fluffiness;
    let _text_lootlike_elasticity = "\n\n\n                       " + local_elasticity;
    let _text_lootlike_personality = "\n\n\n\n                       " + local_personality;
    let text_lootlike_base = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_base, 
        {font: "18px Arial", fill: "#000000", backgroundColor: "#ffffff"}
    );
    let text_lootlike_birthplace = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_birthplace, 
        {font: "18px Arial", fill: _dic_color_birthplace[local_birthplace]}
    );
    let text_lootlike_softness = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_softness, 
        {font: "18px Arial", fill: _dic_color_other[local_softness]}
    );
    let text_lootlike_fluffiness = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_fluffiness, 
        {font: "18px Arial", fill: _dic_color_other[local_fluffiness]}
    );
    let text_lootlike_elasticity = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_elasticity, 
        {font: "18px Arial", fill: _dic_color_other[local_elasticity]}
    );
    let text_lootlike_personality = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_personality, 
        {font: "18px Arial", fill: _dic_color_personality[local_personality]}
    );
    group_lootlike = scene.add.group();
    group_lootlike.add(text_lootlike_base);
    group_lootlike.add(text_lootlike_birthplace);
    group_lootlike.add(text_lootlike_softness);
    group_lootlike.add(text_lootlike_fluffiness);
    group_lootlike.add(text_lootlike_elasticity);
    group_lootlike.add(text_lootlike_personality);
    group_lootlike.setVisible(false);
    group_lootlike.setDepth(9999);
    item_kanban.setInteractive({useHandCursor: true})
        .on("pointerdown", () => {
            group_lootlike.setVisible(true);
            setTimeout( () => {
                group_lootlike.setVisible(false);
            }, 3000)
        });

    //group
    group_kanban = scene.add.group();
    group_kanban.add(item_kanban);
    group_kanban.add(text_kanban);
    group_kanban.add(text_id);
    group_kanban.add(text_age_time);
    group_kanban.setVisible(false);
    group_mint_name = scene.add.group();
    group_mint_name.add(text_mint_name);
    group_mint_name.add(icon_name_ohana);
    group_mint_name.add(text_name_ohana);
    group_mint_name.add(icon_name_kusa);
    group_mint_name.add(text_name_kusa);
    group_mint_name.setVisible(false);
        
    //---tx status
    _x = 250;
    _y = 955
    icon_tx = scene.add.sprite(_x, _y, "coin_color_ASTR")
        .setOrigin(0,1)
        .setScale(0.08);
    text_tx = scene.add.text(_x+20, _y, "", {font: "14px Arial", fill: "#303030"})
        .setOrigin(0,1)
        .setDepth(2);
    group_tx = scene.add.group();
    group_tx.add(icon_tx);
    group_tx.add(text_tx);
    group_tx.setVisible(false);

    //---summoner
    //set each mode
    if (local_mining_status == 1) {
        murasakisan = new Murasakisan(scene, 100, 880)
            .setOrigin(0.5)
            .setScale(0.45);
        murasakisan.set_mode = "mining";
        murasakisan.submode = 2;
        murasakisan.count = 0;
        murasakisan.target_x = 100;
        murasakisan.target_y = 880;
    } else if (local_farming_status == 1) {
        murasakisan = new Murasakisan(scene, 180, 450)
            .setOrigin(0.5)
            .setScale(0.45);
        murasakisan.set_mode = "farming";
        murasakisan.submode = 2;
        murasakisan.count = 0;
        murasakisan.target_x = 180;
        murasakisan.target_y = 450;
    } else if (local_crafting_status == 1) {
        murasakisan = new Murasakisan(scene, 950, 740)
            .setOrigin(0.5)
            .setScale(0.45);
        murasakisan.set_mode = "crafting";
        murasakisan.submode = 2;
        murasakisan.count = 0;
        murasakisan.target_x = 950;
        murasakisan.target_y = 740;
    } else {
        murasakisan = new Murasakisan(scene, 500 + Math.random()*200, 640 + Math.random()*100)
            .setOrigin(0.5)
            .setScale(0.45);
    }
    group_update.add(murasakisan);
    /*
    murasakisan = new Murasakisan(scene, 500 + Math.random()*200, 640 + Math.random()*100)
        .setOrigin(0.5)
        .setScale(0.45);
    group_update.add(murasakisan);
    */

    //---pointer
    //scene.input.on("pointerdown", (pointer, PointerEvent) => {
    scene.input.on("pointermove", (pointer, PointerEvent) => {
        if (scene.sys.game.scale.gameSize._width == 1280) {
            pointer_x = game.input.activePointer.x;
            pointer_y = game.input.activePointer.y;
        } else {
            pointer_x = game.input.activePointer.y;
            pointer_y = 960 - game.input.activePointer.x;
        }
    });
    scene.input.on("pointerdown", () => {
        if (scene.sys.game.scale.gameSize._width == 1280) {
            pointer_x = game.input.activePointer.x;
            pointer_y = game.input.activePointer.y;
        } else {
            pointer_x = game.input.activePointer.y;
            pointer_y = 960 - game.input.activePointer.x;
        }
        console.log(
            Math.round(pointer_x), 
            Math.round(pointer_y)
            //Math.round(game.input.activePointer.x), 
            //Math.round(game.input.activePointer.y)
        );
        //draw_flower(scene, game.input.mousePointer.x, game.input.mousePointer.y);
        //draw_star(scene, game.input.mousePointer.x, game.input.mousePointer.y);
        //draw_fluffyBit(scene, game.input.mousePointer.x, game.input.mousePointer.y);
        draw_star(scene, pointer_x, pointer_y);
        //draw_star(scene, game.input.activePointer.x, game.input.activePointer.y);
    });

    //---nyuinyui
    nyuinyui = new Nyuinyui(scene, 800, 850, "nyui_moving")
        .setOrigin(0.5)
        .setScale(0.25)
        .setAlpha(0.8)
        .setDepth(9999+102)
        .setVisible(false);
    group_update.add(nyuinyui);
}


//===phaser3:update========================================================--------


//---protection
function protection_code(this_scene) {
    if (location.hostname != "murasaki-san.com" && location.hostname != "www.murasaki-san.com") {
        while(true){
            const d1 = new Date();
            while (true) {
              const d2 = new Date();
              if (d2 - d1 > 2000) {
                break;
              }
            }
        }
    }
}

//---system message
function update_systemMessage(this_scene) {
    //if (summoner == -1) {
    if (count_sync == 0) {
        //text_system_message.setText(" --- Connecting to Astar Network --- ");
        text_system_message.setText("");
    } else if (summoner == 0) {
        text_system_message.setText(" --- You have not summoned Murasaki-san yet --- ");
        text_summon.visible = true;
    } else if (local_isActive == false) {
        text_system_message.setText(" --- This Murasaki-san is not Available --- ");
    } else if (local_notPetrified == 0) {
        text_system_message.setText(" --- This murasaki-san has been petrified --- ");
        text_curePetrification.visible = true;
    } else {
        text_system_message.setText("");
        text_summon.visible = false;
        text_curePetrification.visible = false;
    }
}


//---sync time
function update_syncTime(this_scene) {
    if (last_sync_time == 0) {
        //text_sync_time.setText("synced: ####");
        text_sync_time.setText("##");
        text_sync_time.setColor("#ff0000");
    } else {
        let _delta = Math.round( (Date.now() - last_sync_time) / 1000 );
        if (_delta > 99) {
            _delta = 99;
        }
        //text_sync_time.setText("synced: " + ("0000" + _delta).slice(-4));
        text_sync_time.setText(("00" + _delta).slice(-2));
        if (_delta >= 30) {
            text_sync_time.setColor("#ff0000");
        } else {
            text_sync_time.setColor("#727171");
        }
    }
}


//---numeric animation
function update_numericAnimation(this_scene) {

    //coin
    if (screen_coin_delta != 0) {
        let _p = (100 - screen_coin_easing)/100;
        if (_p < 1) {
            let _easing = 1 - Math.pow(1 - _p, 4);  //easeOutQuart: https://easings.net/ja#easeOutQuart
            let _screen_coin = screen_coin + screen_coin_delta * _easing;
            text_coin.setText("Coin: " + Math.round(_screen_coin) );
            screen_coin_easing -= 1;
        } else {
            text_coin.setText("Coin: " + local_coin);
            screen_coin_delta = 0;
        }
    }

    //material
    if (screen_material_delta != 0) {
        let _p = (100 - screen_material_easing)/100;
        if (_p < 1) {
            let _easing = 1 - Math.pow(1 - _p, 4);  //easeOutQuart: https://easings.net/ja#easeOutQuart
            let _screen_material = screen_material + screen_material_delta * _easing;
            text_material.setText("Leaf: " + Math.round(_screen_material) );
            screen_material_easing -= 1;
        } else {
            text_material.setText("Leaf: " + local_material);
            screen_material_delta = 0;
        }
    }

    //exp
    if (screen_exp_delta != 0) {
        let _p = (100 - screen_exp_easing)/100;
        if (_p < 1) {
            let _easing = 1 - Math.pow(1 - _p, 4); 
            let _screen_exp = screen_exp + screen_exp_delta * _easing;
            text_exp.setText(Math.round(_screen_exp) + " / " + local_next_exp_required);
            //bar
            let _bar_exp = _screen_exp / local_next_exp_required * 100;
            bar_exp.scaleX = _bar_exp / 100;
            screen_exp_easing -= 1;
        } else {
            if (local_exp > local_next_exp_required) {
                text_exp.setText(local_next_exp_required + " / " + local_next_exp_required);
                screen_exp = local_next_exp_required;   //***TODO*** not best
            } else {
                text_exp.setText(local_exp + " / " + local_next_exp_required);
                screen_exp = local_exp;   //***TODO*** not best
            }
            //bar
            let _bar_exp = local_exp / local_next_exp_required * 100;
            if (_bar_exp > 100) {_bar_exp = 100;}
            bar_exp.scaleX = _bar_exp / 100;
            screen_exp_delta = 0;
        }
    }
    
    //satiety
    if (screen_satiety_delta != 0) {
        let _p = (100 - screen_satiety_easing)/100;
        if (_p < 1) {
            let _easing = 1 - Math.pow(1 - _p, 4);
            let _screen_satiety = screen_satiety + screen_satiety_delta * _easing;
            text_satiety.setText(Math.round(_screen_satiety) + "%");
            screen_satiety_easing -= 1;
            //bar
            bar_satiety.scaleX = _screen_satiety / 100;
        } else {
            text_satiety.setText(Math.round(satiety) + "%");
            //bar
            bar_satiety.scaleX = satiety / 100;
            screen_satiety_delta = 0;
        }
    }

    //happy
    if (screen_happy_delta != 0) {
        let _p = (100 - screen_happy_easing)/100;
        if (_p < 1) {
            let _easing = 1 - Math.pow(1 - _p, 4);
            let _screen_happy = screen_happy + screen_happy_delta * _easing;
            text_happy.setText(Math.round(_screen_happy) + "%");
            screen_happy_easing -= 1;
            //bar
            bar_happy.scaleX = _screen_happy / 100;
        } else {
            text_happy.setText(Math.round(happy) + "%");
            //bar
            bar_happy.scaleX = happy / 100;
            screen_happy_delta = 0;
        }
    }

    //bbs
    if (
        typeof item_bbs_text != "undefined" 
        && item_bbs_text.text != "undefined" 
        && turn % 5 == 0
    ) {
        item_bbs_text.text = item_bbs_text.text.substr(1,) + item_bbs_text.text[0];
    }
}


//---param with animation
function update_parametersWithAnimation(this_scene) {

    //coin
    if (previous_local_coin != local_coin) {
        //count animation
        screen_coin = previous_local_coin;
        screen_coin_delta = local_coin - previous_local_coin;
        screen_coin_easing = 100;
        //earning text
        if (count_sync > 5) {
            let _delta = local_coin - previous_local_coin;
            let _sign = "";
            if (_delta > 0) {
                _sign = "+";
            }
            //if (_delta >= local_coin_calc * 1.5) {
            //if (local_luck_challenge_of_mfmf && _sign == "+") {
            if (_delta >= last_local_coin_calc * 1.8) {
                text_coin_earned.setText(_sign + _delta + " lucky♪");
                text_coin_earned.setColor("#0000ff");
            } else {
                text_coin_earned.setText(_sign + _delta);
                text_coin_earned.setColor("#000000");
            }
            text_coin_earned_count = 5;
        }
    }
    //earning text clean-up
    if (text_coin_earned_count > 0) {
        text_coin_earned_count -= 1;
        if (text_coin_earned_count == 0) {
            text_coin_earned.setText("");
        }
    }

    //material
    if (previous_local_material != local_material) {
        //count animation
        screen_material = previous_local_material;
        screen_material_delta = local_material - previous_local_material;
        screen_material_easing = 100;
        //earning text
        if (count_sync > 5) {
            let _delta = local_material - previous_local_material;
            let _sign = ""; //no need when minus
            if (_delta > 0) {
                _sign = "+";
            }
            //if (_delta >= local_material_calc * 1.5) {
            //if (local_luck_challenge_of_mfmf && _sign == "+") {
            if (_delta >= last_local_material_calc * 1.8) {
                text_material_earned.setText(_sign + _delta + " lucky♪");
                text_material_earned.setColor("#0000ff");
            } else {
                text_material_earned.setText(_sign + _delta);
                text_material_earned.setColor("#000000");
            }
            text_material_earned_count = 5;
        }
    }
    //earning text clean-up
    if (text_material_earned_count > 0) {
        text_material_earned_count -= 1;
        if (text_material_earned_count == 0) {
            text_material_earned.setText("");
        }
    }

    //exp   //***TODO*** not best
    if (
        previous_local_exp != local_exp 
        && screen_exp < local_next_exp_required
    ) {
        //count animation
        screen_exp = previous_local_exp;
        if (local_exp > local_next_exp_required) {
            screen_exp_delta = local_next_exp_required - previous_local_exp;
        } else {
            screen_exp_delta = local_exp - previous_local_exp;
        }
        screen_exp_easing = 100;
        //earning text
        if (count_sync > 5) {
            let _delta = local_exp - previous_local_exp;
            let _sign = ""; //no need when minus
            if (_delta > 0) {
                _sign = "+";
            }
            //***TODO*** detect critical
            //***ignore nui boost***
            let _logical_addition = 0;
            if (local_satiety > previous_satiety) {
                _logical_addition += last_local_calc_feeding;
            }
            if (local_happy > previous_happy) {
                _logical_addition += last_local_calc_grooming;
            }
            if (_logical_addition + 1 < _delta) {
                text_exp_earned.setText(_sign + _delta + " lucky♪");
                text_exp_earned.setColor("#0000ff");
            } else {
                text_exp_earned.setText(_sign + _delta);
                text_exp_earned.setColor("#000000");
            }
            /*
            if (local_luck_challenge_of_mffg && _sign == "+") {
                text_exp_earned.setText(_sign + _delta + " lucky♪");
            } else {
                text_exp_earned.setText(_sign + _delta);
            }
            */
            text_exp_earned_count = 5;
        }
    }
    //earning text clean-up
    if (text_exp_earned_count > 0) {
        text_exp_earned_count -= 1;
        if (text_exp_earned_count == 0) {
            text_exp_earned.setText("");
        }
    }

    //update time
    let now_time = Date.now() / 1000;

    //satiety
    //let base_satiety = 86400 / 2 / SPEED;
    //satiety = Math.round( (base_satiety - (now_time - local_last_feeding_time)) / base_satiety * 100 );
    satiety = local_satiety;
    if (satiety < 0) { satiety = 0; }
    if (satiety > 100) { satiety = 100; }
    if (satiety != previous_satiety) {
        screen_satiety = previous_satiety;
        screen_satiety_delta = satiety - previous_satiety;
        screen_satiety_easing = 100;
    }

    //happy
    //let base_happy = 86400 * 3 / SPEED;
    //happy = Math.round( (base_happy - (now_time - local_last_grooming_time)) / base_happy * 100 );
    happy = local_happy;
    if (happy < 0) { happy = 0; }
    if (happy > 100) { happy = 100; }
    if (happy != previous_happy) {
        screen_happy = previous_happy;
        screen_happy_delta = happy - previous_happy;
        screen_happy_easing = 100;
    }
    
    previous_happy = happy;
    previous_satiety = satiety;
    previous_local_coin = local_coin;
    previous_local_material = local_material;
    previous_local_exp = local_exp;
    last_local_coin_calc = local_coin_calc;
    last_local_material_calc = local_material_calc;
    last_local_calc_feeding = local_calc_feeding;
    last_local_calc_grooming = local_calc_grooming;
}


//---param without animation
function update_parametersWithoutAnimation(this_scene) {

    let now_time = Date.now() / 1000;

    //age
    //let age_time = Math.round(now_time - local_birth_time);
    //let age = Math.round( age_time * SPEED / 86400 );
    //let age = local_age;
    let age = Math.round( local_age * SPEED / 86400 );
    text_age_time.setText(("0000" + age).slice(-4) + "d");

    //level
    if (button_levelup.texture.key != "button_levelup_pointerover") {
        text_level.setText(local_level);
    }

    //degub info
    //text_speed.setText("speed: x" + SPEED);

    text_heart.setText("Fluffy: " + local_precious);
    /*
    if (local_precious != previous_local_precious) {
        contract_update_event_precious();
    }
    */

    //update progression status
    let _mode = murasakisan.get_mode;
    if (_mode == "mining") {
        icon_mining.visible = true;
        let _delta = (now_time - local_mining_start_time) * SPEED;
        let _daily_earn = local_coin_calc / _delta * 86400;
        text_mining_calc.setText(" +" + local_coin_calc + " Coin\n  (" + Math.round(_daily_earn/10)*10 + " /d)");
        //update gold
        if (local_coin_calc >= 500) {
            item_gold1.visible = true;
        }
        if (local_coin_calc >= 1000) {
            item_gold2.visible = true;
        }
        if (local_coin_calc >= 2000) {
            item_gold3.visible = true;
        }            
    }else if (_mode == "farming") {
        icon_farming.visible = true;
        let _delta = (now_time - local_farming_start_time) * SPEED;
        let _daily_earn = local_material_calc / _delta * 86400;
        text_farming_calc.setText(" +" + local_material_calc + " Leaf\n  (" + Math.round(_daily_earn/10)*10 + " /d)");
        //update tree
        if (local_material_calc >= 500) {
            item_tree0.visible = false;
            item_tree1.visible = true;
            item_tree2.visible = false;
            item_tree3.visible = false;
        }
        if (local_material_calc >= 1000) {
            item_tree0.visible = false;
            item_tree1.visible = false;
            item_tree2.visible = true;
            item_tree3.visible = false;
        }
        if (local_material_calc >= 2000 ) {
            item_tree0.visible = false;
            item_tree1.visible = false;
            item_tree2.visible = false;
            item_tree3.visible = true;
        }
    }else if (_mode == "crafting") {
        icon_crafting_time_remining.visible = true;
        text_crafting_selected_item_ohana.setText("");
        text_crafting_selected_item_kusa.setText("");
        text_crafting_selected_item_time.setText("");
        text_crafting_selected_item_heart.setText("");
        icon_crafting_ohana.visible = false;
        icon_crafting_kusa.visible = false;
        icon_crafting_time.visible = false;
        icon_crafting_heart.visible = false;
        if (local_crafting_calc == 0) {
            text_crafting_calc
                .setText("Completed!")
                .setFill("#FF0000");
        } else if (local_crafting_calc == -1) {
            text_crafting_calc
                .setText("Calculating...")
                .setFill("#0000FF");
            
        } else {
            //TOFIX: invisible selecte item info
            //calc remining time
            let _total_sec = local_crafting_calc;
            let _day = Math.floor(_total_sec / 86400);
            let _hr = Math.floor(_total_sec % 86400 / 3600);
            let _min = Math.floor(_total_sec % 3600 / 60);
            text_crafting_calc
                .setText(_day + "d:" + _hr + "h:" + _min + "m")
                .setFill("#0000FF");
        }
    }else {
        text_mining_calc.setText("");
        text_farming_calc.setText("");
        text_crafting_calc.setText("");
    }

    //reset progression status
    if (local_mining_status != 1) {
        icon_mining.visible = false;
        item_gold1.visible = false;
        item_gold2.visible = false;
        item_gold3.visible = false;
    }
    if (local_farming_status != 1) {
        icon_farming.visible = false;
        item_tree0.visible = true;
        item_tree1.visible = false;
        item_tree2.visible = false;
        item_tree3.visible = false;
    }
    if (local_crafting_status != 1) {
        icon_crafting_time_remining.visible = false;
    }
    
    //wallet text
    let _owner1 = local_owner.substring(0,5);
    let _owner2 = local_owner.slice(-4);
    let _text = "";
    if (local_owner == local_wallet || local_owner == "0x0000000000000000000000000000000000000000") {
        _text += "Lives at: ";
        _text += "house #" + summoner + ", ";
        //_text += local_owner + ", ";
        _text += _owner1 + "..." + _owner2 + ", ";
        _text += "Astar Network EVM, Polkadot, Web3.";
        text_wallet.setText(_text);
        text_wallet.setColor("#FF4264");
    } else {
        _text += "Lives at: ";
        _text += "house #" + summoner + ", ";
        //_text += local_owner + ", ";
        _text += _owner1 + "..." + _owner2 + ", ";
        _text += "Astar Network EVM, Polkadot, Web3.";
        _text += " (not your wallet)";
        text_wallet.setText(_text);
        text_wallet.setColor("blue");
    }
    
    //radarchart
    if (previous_local_rolled_dice != local_rolled_dice && flag_radarchart == 1) {
        draw_radarchart(this_scene);
    }
    
    //stakign reward counter, XX.X%
    staking_reward_percent = 
        Math.round( (100 - (local_staking_reward_counter / STAKING_REWARD_SEC * 100)) * 100) /100;

    previous_local_rolled_dice = local_rolled_dice;
    previous_local_precious = local_precious;
}


//---mode
function update_checkModeChange(this_scene) {
    //check petrified
    if (local_notPetrified == 0) {
        murasakisan.set_mode = "petrified";

    //level up
    } else if (local_level > previous_local_level) {
        //fireworks
        if (previous_local_level > 0) {
            draw_firework(this_scene);
            murasakisan.on_click();
            //summon_star(this_scene);
        }
        //update radarchart
        if (flag_radarchart == 1) {
            draw_radarchart(this_scene);
        }
        if (local_level == 2) {
            //enable mining button
            button_mining.setTexture("button_mining_enable");
            button_mining.on('pointerover', () => button_mining.setTexture("button_mining_pointerover"));
            button_mining.on('pointerout', () => button_mining.setTexture("button_mining_enable"));
            button_mining.setInteractive();
            //enable farming button
            button_farming.setTexture("button_farming_enable");
            button_farming.on('pointerover', () => button_farming.setTexture("button_farming_pointerover"));
            button_farming.on('pointerout', () => button_farming.setTexture("button_farming_enable"));
            button_farming.setInteractive();
        }
        if (local_level == 3) {
            //enable crafting button
            button_crafting.setTexture("button_crafting_enable");
            button_crafting.on('pointerover', () => button_crafting.setTexture("button_crafting_pointerover"));
            button_crafting.on('pointerout', () => button_crafting.setTexture("button_crafting_enable"));
            button_crafting.setInteractive();
        }

    //feeding check, continue
    } else if (local_last_feeding_time > previous_local_last_feeding_time){
        murasakisan.set_mode = "feeding";
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 600;
        murasakisan.target_y = 820;
        if (typeof group_food != "undefined") {
            group_food.destroy(true);
        }
        group_food = this_scene.add.group();
        item_potato = this_scene.add.sprite(600, 840+10, "item_food_potato").setScale(0.12).setOrigin(0.5);
        item_potato.depth = 9999;
        group_food.add(item_potato);
        
        /*
        if (local_items[37] > 0 || local_items[37+64] > 0 || local_items[37+128] > 0) {
            item_pancake = this_scene.add.sprite(600-45, 840+10, "item_pancake").setScale(0.2).setOrigin(0.5);
            item_pancake.depth = 9999;
            group_food.add(item_pancake);
        }

        if (local_items[5] > 0 || local_items[5+64] > 0 || local_items[5+128] > 0) {
            item_onigiri = this_scene.add.sprite(600+40, 840+10, "item_onigiri")
                .setScale(0.1)
                .setOrigin(0.5)
                .setDepth(9999);
            group_food.add(item_onigiri);
        }
        */
        //***TODO*** food id
        {
            let _item_type = 1;
            if (local_items[1] > 0 || local_items[1+64] > 0 || local_items[1+128] > 0) {
                item_pancake = this_scene.add.sprite(600-45, 840+10, "item_food_pancake").setScale(0.2).setOrigin(0.5);
                item_pancake.depth = 9999;
                group_food.add(item_pancake);
            }
        }
        {
            let _item_type = 1;
            if (local_items[1] > 0 || local_items[1+64] > 0 || local_items[1+128] > 0) {
                item_pancake = this_scene.add.sprite(600+40, 840+10, "item_food_cake").setScale(0.15).setOrigin(0.5);
                item_pancake.depth = 9999;
                group_food.add(item_pancake);
            }
        }
        {
            let _item_type = 1;
            if (local_items[1] > 0 || local_items[1+64] > 0 || local_items[1+128] > 0) {
                item_pancake = this_scene.add.sprite(600-20, 840-20, "item_food_onigiri").setScale(0.1).setOrigin(0.5);
                item_pancake.depth = 9999;
                group_food.add(item_pancake);
            }
        }
        {
            let _item_type = 1;
            if (local_items[1] > 0 || local_items[1+64] > 0 || local_items[1+128] > 0) {
                item_pancake = this_scene.add.sprite(600+20, 840-20, "item_food_bread").setScale(0.2).setOrigin(0.5);
                item_pancake.depth = 9999;
                group_food.add(item_pancake);
            }
        }
        setTimeout( () => {
            group_food.destroy(true);
        }, 30000);
        
        sound_feeding.play();

    //grooming check, continue
    } else if (local_last_grooming_time > previous_local_last_grooming_time){
        murasakisan.set_mode = "grooming";
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 1000;
        //murasakisan.target_y = 400;
        murasakisan.target_y = 450;
        sound_grooming.play();

    //mining check
    } else if (local_mining_status == 1 & murasakisan.mode != "mining" & murasakisan.mode != "feeding"){
        murasakisan.set_mode = "mining";
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 100;
        murasakisan.target_y = 880;
        sound_mining.play();
    }else if (local_mining_status == 0 & murasakisan.mode == "mining") {
        murasakisan.set_mode = "hugging";
        //icon invisible
        icon_mining.visible = false;
        sound_earn.play();
        local_coin_calc = 0;

    //farming check, continue
    } else if (local_farming_status == 1 & murasakisan.mode != "farming" & murasakisan.mode != "feeding"){
        murasakisan.set_mode = "farming";
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 180;
        murasakisan.target_y = 450;
        sound_farming.play();
    }else if (local_farming_status == 0 & murasakisan.mode == "farming") {
        murasakisan.set_mode = "hugging";
        //icon invisible
        icon_farming.visible = false;
        sound_earn.play();
        local_material_calc = 0;

    //crafting check, continue
    } else if (local_crafting_status == 1 & murasakisan.mode != "crafting" & murasakisan.mode != "feeding"){
        murasakisan.set_mode = "crafting";
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 950;
        murasakisan.target_y = 740;
        text_select_item.setText('"'+array_item_name[local_crafting_item_type]+'"')
        sound_crafting.play();
        local_crafting_calc = -1;
    }else if (local_crafting_status == 0 & murasakisan.mode == "crafting") {
        murasakisan.set_mode = "hugging";
        text_select_item.setText(">> Select Item <<")
        //icon invisible
        icon_crafting_time_remining.visible = false;
        sound_earn.play();
        flag_item_update = 1;
    }

    previous_local_last_feeding_time = local_last_feeding_time;
    previous_local_last_grooming_time = local_last_grooming_time;
    previous_local_level = local_level;
}


//---button
function update_checkButtonActivation(this_scene) {
    //grooming
    if (local_farming_status == 1 || local_crafting_status == 1 || local_mining_status == 1 || summoner == 0) {
        button_grooming.setTexture("button_grooming_unable");
        button_grooming.disableInteractive();
    }else {
        button_grooming.setTexture("button_grooming_enable");
        button_grooming.on('pointerover', () => button_grooming.setTexture("button_grooming_pointerover"));
        button_grooming.on('pointerout', () => button_grooming.setTexture("button_grooming_enable"));
        button_grooming.setInteractive();
    }

    //mining
    if (local_farming_status == 1 || local_crafting_status == 1 || local_level <= 1) {
        button_mining.setTexture("button_mining_unable");
        button_mining.disableInteractive();
    }else if (local_mining_status == 1) {
        button_mining.setTexture("button_mining_working");
        button_mining.on('pointerover', () => button_mining.setTexture("button_mining_pointerover_stop"));
        button_mining.on('pointerout', () => button_mining.setTexture("button_mining_working"));
        button_mining.setInteractive();
    }else {
        button_mining.setTexture("button_mining_enable");
        button_mining.on('pointerover', () => button_mining.setTexture("button_mining_pointerover"));
        button_mining.on('pointerout', () => button_mining.setTexture("button_mining_enable"));
        button_mining.setInteractive();
    }

    //farming
    if (local_mining_status == 1 || local_crafting_status == 1 || local_level <= 1) {
        button_farming.setTexture("button_farming_unable");
        button_farming.disableInteractive();
    }else if (local_farming_status == 1) {
        button_farming.setTexture("button_farming_working");
        button_farming.on('pointerover', () => button_farming.setTexture("button_farming_pointerover_stop"));
        button_farming.on('pointerout', () => button_farming.setTexture("button_farming_working"));
        button_farming.setInteractive();
    }else {
        button_farming.setTexture("button_farming_enable");
        button_farming.on('pointerover', () => button_farming.setTexture("button_farming_pointerover"));
        button_farming.on('pointerout', () => button_farming.setTexture("button_farming_enable"));
        button_farming.setInteractive();
    }

    //crafting
    if (local_mining_status == 1 || local_farming_status == 1 || local_level <= 2) {
        button_crafting.setTexture("button_crafting_unable");
        button_crafting.disableInteractive();
    }else if (local_crafting_status == 1 && local_crafting_calc == 0) {
        button_crafting.setTexture("button_crafting_working");
        button_crafting.on('pointerover', () => button_crafting.setTexture("button_crafting_pointerover_mint"));
        button_crafting.on('pointerout', () => button_crafting.setTexture("button_crafting_working"));
        button_crafting.setInteractive();
    }else if (local_crafting_status == 1 && local_crafting_calc > 0) {
        button_crafting.setTexture("button_crafting_working");
        button_crafting.on('pointerover', () => button_crafting.setTexture("button_crafting_pointerover_stop"));
        button_crafting.on('pointerout', () => button_crafting.setTexture("button_crafting_working"));
        button_crafting.setInteractive();
    }else {
        button_crafting.setTexture("button_crafting_enable");
        button_crafting.on('pointerover', () => button_crafting.setTexture("button_crafting_pointerover"));
        button_crafting.on('pointerout', () => button_crafting.setTexture("button_crafting_enable"));
        button_crafting.setInteractive();
    }

    //level-up button triggered by exp change
    if (
        local_exp / local_next_exp_required >= 1 
        && local_mining_status == 0 && local_farming_status == 0 && local_crafting_status == 0
        && button_levelup.texture.key == "back_level" 
        && button_levelup.texture.key != "button_levelup_pointerover"
    ) {
        button_levelup.setTexture("button_levelup_enable");
        button_levelup.setInteractive();
    } else if (
        button_levelup.texture.key != "back_level" 
        &&local_exp / local_next_exp_required < 1
        || local_mining_status == 1 || local_farming_status == 1 || local_crafting_status == 1
    ) {
        button_levelup.setTexture("back_level");
        button_levelup.disableInteractive();
    }

    //update previsou parameters
    previous_local_mining_status = local_mining_status;
    previous_local_farming_status = local_farming_status;
    previous_local_crafting_status = local_crafting_status;
}


//---items
function update_checkItem(this_scene) {

    //calc sum of local_items and compare previous one
    let res1 = local_items.reduce((sum, element) => sum + element, 0);
    let res2 = previous_local_items.reduce((sum, element) => sum + element, 0);
    if (res1 == res2) {
        //return 0;
        ;
    } else {
        //destroy crafting window group to update item info
        if (typeof group_window_crafting != "undefined") {
            group_window_crafting.destroy(true);
            delete group_window_crafting;
        }
    }

    let _item_id;

    //###1:Nameplate
    _item_id = 1;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        group_kanban.setVisible(true);

        //***TODO***//
        
        //book
        {
            let _x;
            let _y;
            let _pos_local = "pos_item_book";
            //recover position from localStorage
            if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
                let _json = localStorage.getItem(_pos_local);
                _pos = JSON.parse(_json);
                _x = _pos[0];
                _y = _pos[1];
            } else {
                _x = 230;
                _y = 720;
            }
            let _text = "";
            _text += " total exp gained: " + local_total_exp_gained + " \n";
            _text += " total coin mined: " + local_total_coin_mined + " \n";
            _text += " total leaf farmed: " + local_total_material_farmed + "\n";
            _text += " total item crafted: " + local_total_item_crafted + " \n";
            _text += " total fluffy gifted: " + local_total_precious_received;
            item_book_text = this_scene.add.text(
                _x,
                _y-90,
                _text,
                {font: "20px Arial", fill: "#000000", backgroundColor: "#ffffff"}
            ).setOrigin(0.5).setVisible(false).setDepth(9999);
            item_book = this_scene.add.sprite(
                _x, 
                _y, 
                "item_book"
            ).setScale(0.1).setOrigin(0.5)
                .setInteractive({ draggable: true, useHandCursor: true })
                .on("pointerdown", () => {
                    item_book_text.visible = true;
                    setTimeout( () => {
                        item_book_text.visible = false;
                    }, 3000)
                })
                .on("drag", () => {
                    if (this_scene.sys.game.scale.gameSize._width == 1280) {
                        item_book.x = game.input.activePointer.x;
                        item_book.y = game.input.activePointer.y;
                    } else {
                        item_book.x = game.input.activePointer.y;
                        item_book.y = 960 - game.input.activePointer.x;
                    }
                    item_book_text.x = item_book.x;
                    item_book_text.y = item_book.y-90;
                    item_book.depth = item_book.y;
                    //item_book_text.visible = false;
                })
                .on("dragend", () => {
                    item_book_text.x = item_book.x;
                    item_book_text.y = item_book.y-90;
                    let _pos = [item_book.x, item_book.y];
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                });
        }
            
        //hourglass
        {
            let _x;
            let _y;
            let _pos_local = "pos_item_hourglass";
            //recover position from localStorage
            if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
                let _json = localStorage.getItem(_pos_local);
                _pos = JSON.parse(_json);
                _x = _pos[0];
                _y = _pos[1];
            } else {
                _x = 350;
                _y = 850;
            }
            let _text = "";
            _text += " dapps staking: " + local_dapps_staking_amount + " $ASTR \n";
            _text += " rewarding speed: x" + local_staking_reward_speed/100 + " \n";
            _text += " next reward: " + staking_reward_percent + "%";
            item_hourglass_text = this_scene.add.text(
                _x,
                _y-80,
                _text,
                {font: "20px Arial", fill: "#000000", backgroundColor: "#ffffff"}
            ).setOrigin(0.5).setVisible(false).setDepth(9999);
            item_hourglass = this_scene.add.sprite(
                _x,
                _y,
                "item_hourglass",
            ).setOrigin(0.5).setScale(0.08).setDepth(850)
                .setInteractive({ draggable: true, useHandCursor: true })
                .on("pointerdown", () => {
                    item_hourglass_text.visible = true;
                    setTimeout( () => {
                        item_hourglass_text.visible = false;
                    }, 3000)
                })
                .on("drag", () => {
                    if (this_scene.sys.game.scale.gameSize._width == 1280) {
                        item_hourglass.x = game.input.activePointer.x;
                        item_hourglass.y = game.input.activePointer.y;
                    } else {
                        item_hourglass.x = game.input.activePointer.y;
                        item_hourglass.y = 960 - game.input.activePointer.x;
                    }
                    item_hourglass.depth = item_book.y;
                    item_hourglass_text.x = item_hourglass.x;
                    item_hourglass_text.y = item_hourglass.y-80;
                    //item_hourglass_text.visible = false;
                })
                .on("dragend", () => {
                    item_hourglass_text.x = item_hourglass.x;
                    item_hourglass_text.y = item_hourglass.y-80;
                    let _pos = [item_hourglass.x, item_hourglass.y];
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                })
        }
        
        //fishbowl
        {
            let _x;
            let _y;
            let _pos_local = "pos_item_fishbowl";
            //recover position from localStorage
            if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
                let _json = localStorage.getItem(_pos_local);
                _pos = JSON.parse(_json);
                _x = _pos[0];
                _y = _pos[1];
            } else {
                _x = 350;
                _y = 500;
            }
            item_fishbowl = this_scene.add.sprite(
                _x,
                _y,
                "item_fishbowl",
            ).setOrigin(0.5).setScale(0.3).setDepth(_y)
                .setInteractive({ draggable: true, useHandCursor: true })
                .on("drag", () => {
                    if (this_scene.sys.game.scale.gameSize._width == 1280) {
                        item_fishbowl.x = game.input.activePointer.x;
                        item_fishbowl.y = game.input.activePointer.y;
                    } else {
                        item_fishbowl.x = game.input.activePointer.y;
                        item_fishbowl.y = 960 - game.input.activePointer.x;
                    }
                    item_fishbowl.depth = item_fishbowl.y;
                })
                .on("dragend", () => {
                    let _pos = [item_fishbowl.x, item_fishbowl.y];
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                    if (
                        item_fishbowl.x >= 100
                        && item_fishbowl.x <= 1100
                        && item_fishbowl.y >= 500
                        && item_fishbowl.y <= 800
                    ){
                        sound_hat.play();
                        murasakisan.try_attenting(item_fishbowl.x, item_fishbowl.y);
                    }
                });
        }

    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
    ) {
        local_items_flag[_item_id] = false;
        group_kanban.setVisible(false);
    }
    //nameplate, after craft
    if (local_items_flag[_item_id] == true) {
        if (local_name_str == "") {
            if (text_kanban.text == "") {
                text_kanban.setText("(enter name)");
            }
            text_kanban.setInteractive();
            group_mint_name.setVisible(true);
            if (text_kanban.text != "(unnamed)") {
                contract_update_static_status(summoner)
            }
        } else {
            text_kanban.setText(local_name_str);
            text_kanban.disableInteractive();
            group_mint_name.setVisible(false);
        }
        text_id.setText("#"+summoner);
        
        //***TODO***//

        //book
        {
            let _text = "";
            _text += " total exp gained: " + local_total_exp_gained + "\n";
            _text += " total coin mined: " + local_total_coin_mined + "\n";
            _text += " total leaf farmed: " + local_total_material_farmed + "\n";
            _text += " total item crafted: " + local_total_item_crafted + "\n";
            _text += " total fluffy gifted: " + local_total_precious_received;
            item_book_text.setText(_text);
        }
            
        //hourglass
        {
            let _text = "";
            _text += " dapps staking: " + local_dapps_staking_amount + " $ASTR \n";
            _text += " rewarding speed: x" + local_staking_reward_speed/100 + " \n";
            _text += " next reward: " + staking_reward_percent + "%";
            item_hourglass_text.setText(_text);
        }
        
    }
    
    //###2:Mr.Astar
    _item_id = 2;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        mr_astar = new Pet(
            this_scene, 
            400 + Math.random()*300, 
            500 + Math.random()*200, 
            "mr_astar_right", 
            "mr_astar_left",
            "mining"
        ).setScale(0.12);
        group_update.add(mr_astar);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof mr_astar != "undefined"
    ) {
        mr_astar.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    //###3:Dice
    _item_id = 3;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        dice = new Dice(this_scene, 400, 600).setScale(0.3).setOrigin(0.5);
        group_update.add(dice);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof dice != "undefined"
    ) {
        dice.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###4:Helment
    _item_id = 4;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //let _x = 60;
        //let _y = 700;
        let _x = 530;
        let _y = 255;
        item_hat_helmet = this_scene.add.sprite(_x, _y, "item_hat_helmet")
            .setOrigin(0.5)
            .setScale(0.22)
            .setAngle(90);
        item_hat_helmet.setInteractive({useHandCursor: true});
        let _flag_local = "item_hat_helmet";  //for localStorage
        item_hat_helmet.on('pointerdown', () => {
            if (item_wearing_hat == 0) {
                item_wearing_hat = item_hat_helmet;
                murasakisan.on_click();
                sound_hat.play();
                item_hat_helmet.setAngle(0);
                localStorage.setItem(_flag_local, JSON.stringify(1));
            } else if (item_wearing_hat == item_hat_helmet) {
                item_wearing_hat = 0;
                item_hat_helmet.x = _x;
                item_hat_helmet.y = _y;
                item_hat_helmet.setAngle(90);
                localStorage.setItem(_flag_local, JSON.stringify(0));
            }
        });
        //for localStorage
        if (localStorage.getItem(_flag_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_flag_local);
            let _flag = JSON.parse(_json);
            if (_flag) {
                item_wearing_hat = item_hat_helmet;
                item_hat_helmet.setAngle(0);
            }
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_hat_helmet != "undefined"
    ) {
        item_hat_helmet.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###5:*Sushi
    
    //###6:Crown
    _item_id = 6;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        item_crown = this_scene.add.sprite(1050,290, "item_crown");
        item_crown.anims.play("item_crown", true);
        item_crown.anims.isPlaying = false;
        item_crown.setScale(0.3);
        item_crown.setInteractive({useHandCursor: true});
        item_crown.on('pointerdown', () => {
            if (item_crown.anims.isPlaying) {
                item_crown.anims.stop();
            } else {
                item_crown.anims.isPlaying = true;
                sound_hat.play();
            }
        });
        item_crown.depth = 9999;
        //console.log(item_crown.anims.is);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_crown != "undefined"
    ) {
        item_crown.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    //###7:Ribbon
    _item_id = 7;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        item_ribbon = this_scene.add.sprite(1037, 401, "item_ribbon").setScale(0.15).setOrigin(0.5);
        item_ribbon.depth = 9999;
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_ribbon != "undefined"
    ) {
        item_ribbon.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###8:Window
    _item_id = 8;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 110;
        let _y = 225;
        item_window = this_scene.add.image(_x, _y, "item_window_day")
            .setScale(0.58)
            .setOrigin(0.5)
            .setDepth(2)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                sound_window.play();
                if(item_window.texture == game.textures.get("item_window_day")){
                    item_window.setTexture("item_window_day_closed");
                } else if (item_window.texture == game.textures.get("item_window_day_closed")) {
                    item_window.setTexture("item_window_day");
                } else if (item_window.texture == game.textures.get("item_window_night")) {
                    item_window.setTexture("item_window_night_closed");
                } else if (item_window.texture == game.textures.get("item_window_night_closed")) {
                    item_window.setTexture("item_window_night");
                }
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_window != "undefined"
    ) {
        item_window.destroy(true);
        local_items_flag[_item_id] = false;
    }
       
    //###9:Knit Hat
    _item_id = 9;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 690;
        let _y = 255;
        item_hat_knit = this_scene.add.sprite(_x, _y, "item_hat_knit")
            .setOrigin(0.5)
            .setScale(0.20);
        item_hat_knit.setInteractive({useHandCursor: true});
        item_hat_knit.on('pointerdown', () => {
            if (item_wearing_hat_pet == 0) {
                let _array = [];
                if (typeof mr_astar != "undefined"){
                    _array.push("mining");
                }
                if (typeof ms_ether != "undefined"){
                    _array.push("farming");
                }
                if (typeof dr_bitco != "undefined"){
                    _array.push("crafting");
                }
                if (_array != []) {
                    let _target_pet = _array[Math.floor(Math.random() * _array.length)];
                    item_wearing_hat_pet = [_target_pet, item_hat_knit];
                    item_hat_knit.setScale(0.1);
                }
                sound_hat.play();
            } else {
                item_wearing_hat_pet = 0;
                item_hat_knit.setScale(0.20);
                item_hat_knit.x = _x;
                item_hat_knit.y = _y;
            }
        });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_hat_knit != "undefined"
    ) {
        item_hat_knit.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###10:Photo Frame
    _item_id = 10;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        function _get_nft_url() {
            let _array = [
                "ex_nft1.png",
                "ex_nft2.png",
                "ex_nft3.png",
                //"https://1.bp.blogspot.com/-7uiCs6dI4a0/YEGQA-8JOrI/AAAAAAABddA/qPFt2E8vDfQwPQsAYLvk4lowkwP-GN7VQCNcBGAsYHQ/s896/buranko_girl_smile.png",
                //"ipfs://QmQptLUg6Vakr2p3BCccmm2cs7M9hhEGvi4AoZMvMv3DJt/3945.png",
            ];
            let _url = _array[Math.floor(Math.random() * _array.length)];
            return _url;
        }
        let _x2 = 890;
        let _y2 = 300;
        let _url = _get_nft_url();
        this_scene.load.image("pic_nft", _url);
        this_scene.load.start()
        this_scene.load.on(
            "complete", 
            () => {
                item_frame = this_scene.add.image(_x2, _y2, "item_frame")
                    .setOrigin(0.5)
                    .setScale(0.25)
                    .setDepth(_y2);
                item_frame_inside = this_scene.add.sprite(_x2, _y2, "pic_nft")
                    .setOrigin(0.5)
                    .setScale(0.2)
                    .setDepth(_y2)
                    .setDisplaySize(67, 82)
                    .setInteractive({useHandCursor: true})
                    .on("pointerdown", () => {
                        sound_hat.play();
                        item_frame_inside.setTexture("ff_duringFestival_left");
                        this_scene.textures.remove("pic_nft");
                        let _url = _get_nft_url();
                        this_scene.load.image("pic_nft", _url);
                        //console.log(_url);
                        this_scene.load.start()
                        this_scene.load.on(
                            "complete", 
                            () => {
                                item_frame_inside.setTexture("pic_nft");
                            });
                    });
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_frame != "undefined"
    ) {
        item_frame.destroy(true);
        item_frame_inside.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###11:Wall Sticker
    _item_id = 11;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 640;
        let _y = 480;
        
        if (local_wallet_score == 0) {
            //wait for calculation
            local_items_flag[_item_id] = false;
        } else if (local_wallet_score < 300) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_01");
        } else if (local_wallet_score < 600) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_02");
        } else if (local_wallet_score < 900) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_03");
        } else if (local_wallet_score < 1200) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_04");
        } else if (local_wallet_score < 1500) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_05");
        } else if (local_wallet_score < 1800) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_06");
        } else if (local_wallet_score < 2100) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_07");
        } else if (local_wallet_score < 2400) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_08");
        } else if (local_wallet_score < 2700) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_09");
        } else if (local_wallet_score < 3000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_10");
        } else if (local_wallet_score < 3300) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_11");
        } else if (local_wallet_score >= 3300) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_12");
        }
        if (typeof item_wall_sticker != "undefined") {
            item_wall_sticker.setDepth(1).setAlpha(0.2);
        }
        /*
        item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker")
            .setDepth(1)
            .setAlpha(0.2);
        */
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_wall_sticker != "undefined"
    ) {
        item_wall_sticker.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###17:Musicbox
    _item_id = 17;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 505;
        let _y = 370;
        let _pos_local = "pos_item_musicbox";
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_musicbox = this_scene.add.sprite(_x, _y, "item_musicbox")
            .setOrigin(0.5)
            .setScale(0.30)
            .setInteractive({useHandCursor: true, draggable: true})
            .setDepth(_y)
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_musicbox.x = game.input.activePointer.x;
                    item_musicbox.y = game.input.activePointer.y;
                } else {
                    item_musicbox.x = game.input.activePointer.y;
                    item_musicbox.y = 960 - game.input.activePointer.x;
                }
                item_musicbox.depth = item_musicbox.y;
            })
            .on("dragend", () => {
                let _pos = [item_musicbox.x, item_musicbox.y];
                localStorage.setItem(_pos_local, JSON.stringify(_pos));
                if (
                    item_musicbox.x >= 100
                    && item_musicbox.x <= 1100
                    && item_musicbox.y >= 500
                    && item_musicbox.y <= 800
                ){
                    sound_hat.play();
                    murasakisan.try_attenting(item_musicbox.x, item_musicbox.y);
                }
            })
            .on('pointerdown', () => music() );
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_musicbox != "undefined"
    ) {
        item_musicbox.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###18:Straw Hat
    _item_id = 18;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 450;
        let _y = 255;
        item_hat_mugiwara = this_scene.add.sprite(_x, _y, "item_hat_mugiwara")
            .setOrigin(0.5)
            .setScale(0.25)
            .setAngle(90);
        item_hat_mugiwara.setInteractive({useHandCursor: true});
        let _flag_local = "item_hat_mugiwara";  //for localStorage
        item_hat_mugiwara.on('pointerdown', () => {
            if (item_wearing_hat == 0) {
                item_wearing_hat = item_hat_mugiwara;
                murasakisan.on_click();
                sound_hat.play();
                item_hat_mugiwara.setAngle(0);
                localStorage.setItem(_flag_local, JSON.stringify(1));
            } else if (item_wearing_hat == item_hat_mugiwara) {
                item_wearing_hat = 0;
                item_hat_mugiwara.x = _x;
                item_hat_mugiwara.y = _y;
                item_hat_mugiwara.setAngle(90);
                localStorage.setItem(_flag_local, JSON.stringify(0));
            }
        });
        //for localStorage
        if (localStorage.getItem(_flag_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_flag_local);
            let _flag = JSON.parse(_json);
            if (_flag) {
                item_wearing_hat = item_hat_mugiwara;
                item_hat_mugiwara.setAngle(0);
            }
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_hat_mugiwara != "undefined"
    ) {
        item_hat_mugiwara.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###19:Ms.Ether
    _item_id = 19;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        ms_ether = new Pet(
            this_scene, 
            400 + Math.random()*300, 
            500 + Math.random()*200, 
            "ms_ether_right", 
            "ms_ether_left",
            "farming"
        ).setScale(0.12);
        group_update.add(ms_ether);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof ms_ether != "undefined"
    ) {
        ms_ether.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###20:*Cat Cushion
    _item_id = 20;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;

        //cushion
        item_cushion = this_scene.add.sprite(90, 620, "item_cushion").setScale(0.25).setOrigin(0.5);
        item_cushion.depth = item_cushion.y - 50;
        
        //text_sending_interval
        text_sending_interval = this_scene.add.text(70, 640, "00h:00m", {font: "15px Arial", fill: "#ffffff"})
            .setDepth(item_cushion.depth + 1);

        //cat
        cat = new HomeCat(this_scene, 90, 610)
            .setOrigin(0.5)
            .setScale(0.4);
        group_update.add(cat);
        
        //mail
        mail = this_scene.add.sprite(75, 675, "item_mail")
            .setScale(0.6)
            .setOrigin(0.5)
            .setDepth(item_cushion.y -50 +2)
            .setVisible(false);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_cushion != "undefined"
    ) {
        item_cushion.destroy(true);
        text_sending_interval.destroy(true);
        cat.destroy(true);
        mail.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //when possess cushion
    if (local_items_flag[_item_id] == true) {
        
        //check sending interval
        if (
            local_mail_sending_interval != -1
            && typeof text_sending_interval != "undefined"
            && typeof cat != "undefined"
        ) {
            if (local_mail_sending_interval == 0) {
                text_sending_interval.setText("");
                //cat.visible = true;
            } else {
                let _d = Math.floor(local_mail_sending_interval / (60 * 60 * 24));
                let _hr = Math.floor(local_mail_sending_interval % 86400 / 3600);
                let _min = Math.floor(local_mail_sending_interval % 3600 / 60);
                let _text = _d + "d:" + _hr + "h:" + _min + "m";
                text_sending_interval.setText(_text).setFill("#ffffff");
                //cat.visible = false;
            }
        }

        //check item mail
        if (local_items[196] > 0) {
            mail.visible = true;
        } else {
            mail.visible = false;
        }
    }

    //###21:Uni
    
    //###22:Fortune Statue
    _item_id = 22;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 500;
        let _y = 150;
        let _pos_local = "pos_item_fortune_status"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_fortune_statue = this_scene.add.sprite(_x, _y, "item_fortune_statue")
            .setScale(0.35)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_fortune_statue.x = game.input.activePointer.x;
                    item_fortune_statue.y = game.input.activePointer.y;
                } else {
                    item_fortune_statue.x = game.input.activePointer.y;
                    item_fortune_statue.y = 960 - game.input.activePointer.x;
                }
                item_fortune_statue.depth = item_fortune_statue.y;
            })
            .on("dragend", () => {
                let _pos = [item_fortune_statue.x, item_fortune_statue.y];
                localStorage.setItem(_pos_local, JSON.stringify(_pos));
                if (
                    item_fortune_statue.x >= 100
                    && item_fortune_statue.x <= 1100
                    && item_fortune_statue.y >= 500
                    && item_fortune_statue.y <= 800
                ){
                    sound_hat.play();
                    murasakisan.try_attenting(item_fortune_statue.x, item_fortune_statue.y);
                }
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_fortune_statue != "undefined"
    ) {
        item_fortune_statue.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    //###23:Asnya
    _item_id = 23;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 590;
        let _y = 140;
        let _pos_local = "pos_item_asnya"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_asnya = this_scene.add.sprite(_x, _y, "item_asnya")
            .setScale(0.25)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_asnya.x = game.input.activePointer.x;
                    item_asnya.y = game.input.activePointer.y;
                } else {
                    item_asnya.x = game.input.activePointer.y;
                    item_asnya.y = 960 - game.input.activePointer.x;
                }
                item_asnya.depth = item_asnya.y;
            })
            .on("dragend", () => {
                let _pos = [item_asnya.x, item_asnya.y];
                localStorage.setItem(_pos_local, JSON.stringify(_pos));
                if (
                    item_asnya.x >= 100
                    && item_asnya.x <= 1100
                    && item_asnya.y >= 500
                    && item_asnya.y <= 800
                ){
                    sound_hat.play();
                    murasakisan.try_attenting(item_asnya.x, item_asnya.y);
                }
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_asnya != "undefined"
    ) {
        item_asnya.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###24:Rug-Pull
    _item_id = 24;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 600;
        let _y = 660;
        item_rugg = this_scene.add.image(_x, _y, "item_rugg")
            .setScale(1.7)
            .setOrigin(0.5)
            .setDepth(2);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_rugg != "undefined"
    ) {
        item_rugg.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###25:Flowerpot
    _item_id = 25;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 600;
        let _y = 380;
        let _pos_local = "pos_item_vase"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_vase = this_scene.add.sprite(_x, _y, "item_vase")
            .setScale(0.18)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_vase.x = game.input.activePointer.x;
                    item_vase.y = game.input.activePointer.y;
                } else {
                    item_vase.x = game.input.activePointer.y;
                    item_vase.y = 960 - game.input.activePointer.x;
                }
                item_vase.depth = item_vase.y;
            })
            .on("dragend", () => {
                let _pos = [item_vase.x, item_vase.y];
                localStorage.setItem(_pos_local, JSON.stringify(_pos));
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_vase != "undefined"
    ) {
        item_vase.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###27:Floor Sticker
    _item_id = 27;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 640;
        let _y = 480;

        if (local_wallet_score == 0) {
            local_items_flag[_item_id] = false;
        } else if (local_wallet_score < 300) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_01");
        } else if (local_wallet_score < 600) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_02");
        } else if (local_wallet_score < 900) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_03");
        } else if (local_wallet_score < 1200) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_04");
        } else if (local_wallet_score < 1500) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_05");
        } else if (local_wallet_score < 1800) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_06");
        } else if (local_wallet_score < 2100) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_07");
        } else if (local_wallet_score < 2400) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_08");
        } else if (local_wallet_score < 2700) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_09");
        } else if (local_wallet_score < 3000) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_10");
        } else if (local_wallet_score < 3300) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_11");
        } else if (local_wallet_score >= 3300) {
            item_floor_sticker = this_scene.add.image(_x, _y, "item_floor_sticker_12");
        }
        if (typeof item_floor_sticker != "undefined") {
            item_floor_sticker.setDepth(1).setAlpha(0.6);
        }

    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_floor_sticker != "undefined"
    ) {
        item_floor_sticker.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###33:Table
    _item_id = 33;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //status pad
        let _x = 700;
        let _y = 390;
        let _pos_local = "pos_item_tablet";
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_pad = this_scene.add.sprite(_x, _y, "item_pad_on")
            .setScale(0.25)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({useHandCursor: true, draggable: true})
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_pad.x = game.input.activePointer.x;
                    item_pad.y = game.input.activePointer.y;
                } else {
                    item_pad.x = game.input.activePointer.y;
                    item_pad.y = 960 - game.input.activePointer.x;
                }
                item_pad.depth = item_pad.y;
            })
            .on("dragend", () => {
                let _pos = [item_pad.x, item_pad.y];
                localStorage.setItem(_pos_local, JSON.stringify(_pos));
                if (
                    item_pad.x >= 100
                    && item_pad.x <= 1100
                    && item_pad.y >= 500
                    && item_pad.y <= 800
                ){
                    sound_hat.play();
                    murasakisan.try_attenting(item_pad.x, item_pad.y);
                }
            })
            .on('pointerdown', () => {
                if (flag_radarchart == 0) {
                    flag_radarchart = 1;
                    flag_info = 1;
                    group_info.setVisible(true);
                    draw_radarchart(this_scene);
                    item_pad.setTexture("item_pad_on");
                    sound_pad.play();
                } else {
                    flag_radarchart = 0;
                    flag_info = 0;
                    group_info.setVisible(false);
                    group_chart.destroy(true);
                    item_pad.setTexture("item_pad_off");
                    //init_global_variants();
                }
            });
        flag_radarchart = 1;
        draw_radarchart(this_scene);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_pad != "undefined"
    ) {
        item_pad.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###34:*Score Board
    _item_id = 34;
    if (
        (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) || (
        local_items_flag[_item_id] == true 
        && local_score != previous_local_score
        )
    ) {
        local_items_flag[_item_id] = true;
        //score counter
        try {
            group_score_counter.destroy(true);
        } catch (error) {
        }
        group_score_counter = this_scene.add.group();
        let _array_score = ("00000000" + local_score).slice(-7).split("");
        let _len_score = local_score.toString().length;
        let _font_arg = {font: "16px Arial", fill: "#0000ff"};
        for (let i = 0; i < 7; i++) {
            let _x = 1095 + i*25;
            let _y = 245;
            let _text = _array_score.shift()
            _img = this_scene.add.image(_x, _y, "icon_counter")
                .setOrigin(0.5)
                .setScale(0.06)
                .setDepth(1000);
            group_score_counter.add(_img);
            group_info.add(_img);
            if (_len_score + i + 1 > 7) {
                _txt = this_scene.add.text(_x-2, _y, _text, _font_arg)
                    .setOrigin(0.5)
                    .setDepth(1001);
                group_score_counter.add(_txt);
                group_info.add(_txt);
            }
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof group_score_counter != "undefined"
    ) {
        group_score_counter.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    //###35:Mortarboard
    _item_id = 35;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //_x = 700;
        //_y = 380;
        _x = 610;
        _y = 260;
        item_hat_mortarboard = this_scene.add.sprite(_x, _y, "item_hat_mortarboard")
            .setOrigin(0.5)
            .setScale(0.20)
            .setAngle(90);
        item_hat_mortarboard.setInteractive({useHandCursor: true});
        let _flag_local = "item_hat_mortarboard";  //for localStorage
        item_hat_mortarboard.on('pointerdown', () => {
            if (item_wearing_hat == 0) {
                item_wearing_hat = item_hat_mortarboard;
                murasakisan.on_click();
                sound_hat.play();
                item_hat_mortarboard.setAngle(0);
                localStorage.setItem(_flag_local, JSON.stringify(1));
            } else if (item_wearing_hat == item_hat_mortarboard) {
                item_wearing_hat = 0;
                item_hat_mortarboard.x = _x;
                item_hat_mortarboard.y = _y;
                item_hat_mortarboard.setAngle(90);
                localStorage.setItem(_flag_local, JSON.stringify(0));
            }
        });
        //for localStorage
        if (localStorage.getItem(_flag_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_flag_local);
            let _flag = JSON.parse(_json);
            if (_flag) {
                item_wearing_hat = item_hat_mortarboard;
                item_hat_mortarboard.setAngle(0);
            }
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_hat_mortarboard != "undefined"
    ) {
        item_hat_mortarboard.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###36:Dr.Bitco
    _item_id = 36;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        dr_bitco = new Pet(
            this_scene, 
            400 + Math.random()*300, 
            500 + Math.random()*200, 
            "dr_bitco_right", 
            "dr_bitco_left",
            "crafting"
        ).setScale(0.11);
        group_update.add(dr_bitco);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof dr_bitco != "undefined"
    ) {
        dr_bitco.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###37:(Pancake)

    //###38:Violin
    _item_id = 38;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 1200;
        let _y = 608;
        let _pos_local = "pos_item_violin"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_violin = this_scene.add.sprite(_x, _y, "item_violin")
            .setScale(0.2)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_violin.x = game.input.activePointer.x;
                    item_violin.y = game.input.activePointer.y;
                } else {
                    item_violin.x = game.input.activePointer.y;
                    item_violin.y = 960 - game.input.activePointer.x;
                }
                item_violin.depth = item_violin.y;
            })
            .on("dragend", () => {
                let _pos = [item_violin.x, item_violin.y];
                localStorage.setItem(_pos_local, JSON.stringify(_pos));
                if (
                    item_violin.x >= 100
                    && item_violin.x <= 1100
                    && item_violin.y >= 500
                    && item_violin.y <= 800
                ){
                    sound_hat.play();
                    murasakisan.try_attenting(item_violin.x, item_violin.y);
                }
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_violin != "undefined"
    ) {
        item_violin.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###39:Piano
    _item_id = 39;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 595;
        let _y = 375;
        let _pos_local = "pos_item_piano";
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_piano = this_scene.add.image(_x, _y, "item_piano")
            .setScale(0.4)
            .setOrigin(0.5)
            .setDepth(2)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_piano.x = game.input.activePointer.x;
                    item_piano.y = game.input.activePointer.y;
                } else {
                    item_piano.x = game.input.activePointer.y;
                    item_piano.y = 960 - game.input.activePointer.x;
                }
                item_piano.depth = item_piano.y;
            })
            .on("dragend", () => {
                let _pos = [item_piano.x, item_piano.y];
                localStorage.setItem(_pos_local, JSON.stringify(_pos));
                if (
                    item_piano.x >= 100
                    && item_piano.x <= 1100
                    && item_piano.y >= 500
                    && item_piano.y <= 800
                ){
                    sound_hat.play();
                    murasakisan.try_attenting(item_piano.x, item_piano.y);
                }
            })
            .on('pointerdown', () => {
                if(item_piano.texture == game.textures.get("item_piano")){
                    if(flag_onLight) {
                        sound_piano1.play();
                    } else {
                        sound_piano2.play();
                    }
                    item_piano.setTexture("item_piano_opened");
                } else {
                    item_piano.setTexture("item_piano");
                }
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_piano != "undefined"
    ) {
        item_piano.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###40:Light Switch
    _item_id = 40;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        back_black = this_scene.add.image(640, 480, "back_black")
            .setDepth(9999+1)
            .setVisible(false);
        murasaki_neon = new Neon(
            this_scene, 
            50 + Math.random()*900, 
            50 + Math.random()*350, 
            "murasaki_neon_right", 
            "murasaki_neon_left"
        ).setVisible(false)
            .setDepth(9999+2)
            .setOrigin(0.5)
            .setScale(0.35);
        group_update.add(murasaki_neon);
        item_wall_sticker_neon = this_scene.add.sprite(640, 480, "item_wall_sticker_neon")
            .anims.play("wall_sticker_neon", true)
            .setDepth(9999+2)
            .setAlpha(0.7)
            .setVisible(false);
        item_switch = this_scene.add.sprite(1230,320, "item_switch")
            .setOrigin(0.5)
            .setScale(0.25)
            .setInteractive({useHandCursor: true});
        item_switch.anims.play("item_switch_off", true);
        item_switch.on('pointerdown', () => {
            if (item_switch.anims.currentAnim.key == "item_switch_off") {
                item_switch.anims.play("item_switch_on", true);
                back_black.visible = true;
                sound_switch.play();
                murasaki_neon.visible = true;
                text_kanban.setColor("white");
                /*
                if (typeof item_nui != "undefined") {
                    item_nui.anims.play("item_nui_alive", true);
                }
                */
                if (typeof group_item197 != "undefined") {
                    group_item197.children.entries[0].anims.play("item_nui_alive", true);
                }
                if (typeof item_lantern != "undefined") {
                    item_lantern.setDepth(9999+10);
                }
                if (typeof item_window != "undefined") {
                    if(item_window.texture == game.textures.get("item_window_day")){
                        item_window.setTexture("item_window_night");
                    } else if (item_window.texture == game.textures.get("item_window_day_closed")) {
                        item_window.setTexture("item_window_night_closed");
                    }
                }
                if (typeof item_wall_sticker != "undefined" && local_wallet_score >= 2700) {
                    item_wall_sticker_neon.setVisible(true);
                }
                flag_onLight = false;
            } else {
                item_switch.anims.play("item_switch_off", true);
                back_black.visible = false;
                sound_switch.play();
                murasaki_neon.visible = false;
                group_neonStar.clear(true);
                text_kanban.setColor("black");
                /*
                if (typeof item_nui != "undefined") {
                    item_nui.anims.play("item_nui", true);
                }
                */
                if (typeof group_item197 != "undefined") {
                    group_item197.children.entries[0].anims.play("item_nui", true);
                }
                if (typeof item_lantern != "undefined") {
                    item_lantern.setDepth(2);
                }
                if (typeof item_window != "undefined") {
                    if (item_window.texture == game.textures.get("item_window_night")) {
                        item_window.setTexture("item_window_day");
                    } else if (item_window.texture == game.textures.get("item_window_night_closed")) {
                        item_window.setTexture("item_window_day_closed");
                    }
                }
                if (typeof item_wall_sticker != "undefined" && local_wallet_score >= 2700) {
                    item_wall_sticker_neon.setVisible(false);
                }
                flag_onLight = true;
            }
        });
        item_switch.depth = item_switch.y;
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_switch != "undefined"
    ) {
        item_switch.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###41:Lantern
    _item_id = 41;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 1200;
        let _y = 800;
        item_lantern = this_scene.add.image(_x, _y, "item_lantern")
            .setScale(0.4)
            .setOrigin(0.5)
            .setDepth(2);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_lantern != "undefined"
    ) {
        item_lantern.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###42:TokenChest
    _item_id = 42;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 1037;
        let _y = 600;
        item_tokenChest = this_scene.add.sprite(_x, _y, "item_tokenChest")
            .setFrame(0)
            .setScale(0.28)
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', async function() {
                if (flag_tokenBall == 0) {
                    flag_tokenBall = 1;
                    item_tokenChest.setFrame(1);
                    //sound_basket.play();
                    sound_tokenChest.play();
                    murasakisan.on_click();
                    group_tokenBall = this_scene.add.group();
                    //group_tokenBall.runChildUpdate = true;
                    for (let _token in dic_tokenBall_contract) {
                        let _amount = 0;
                        if (_token == "ASTR") {
                            _amount = 1;
                        } else {
                            let _contract = dic_tokenBall_contract[_token];
                            _amount = await call_amount_of_token(_contract);
                        }
                        if (_amount > 0) {
                            let _img = dic_tokenBall_img[_token];
                            _tokenBall = new tokenBall(this_scene, _x, _y, _img)
                                .setOrigin(0.5)
                                .setScale(0.15)
                                .setAlpha(1)
                                .setDepth(2);
                            group_tokenBall.add(_tokenBall);
                            group_update.add(_tokenBall);
                            _tokenBall.on_summon();
                        }
                    }
                    flag_tokenBall = 2;
                    /*
                    for (i = 0; i < array_image_tokenBall.length; i++) {
                        let _img = array_image_tokenBall[i];
                        _tokenBall = new tokenBall(this_scene, _x, _y, _img)
                            .setOrigin(0.5)
                            .setScale(0.15)
                            .setAlpha(0.7)
                            .setDepth(2);
                        group_tokenBall.add(_tokenBall);
                        _tokenBall.on_summon();
                    }
                    */
                } else if (flag_tokenBall == 2) {
                    item_tokenChest.setFrame(0);
                    flag_tokenBall = 0;
                    group_tokenBall.destroy(true);
                }
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_tokenChest != "undefined"
    ) {
        item_tokenChest.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //###43:*Newspaper
    _item_id = 43;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 110;
        let _y = 370;
        item_newspaper = this_scene.add.image(_x, _y, "item_newspaper")
            .setOrigin(0.5)
            .setScale(0.19)
            .setDepth(1);
        item_newspaper_text1 = this_scene.add.text(
            _x,
            _y-20,
            local_newsText[0],
            {font: "14px Arial", fill: "#000000"}
        ).setOrigin(0.5).setDepth(2);
        item_newspaper_text2 = this_scene.add.text(
            _x,
            _y+0,
            local_newsText[1],
            {font: "14px Arial", fill: "#000000"}
        ).setOrigin(0.5).setDepth(2);
        item_newspaper_text3 = this_scene.add.text(
            _x,
            _y+20,
            local_newsText[2],
            {font: "14px Arial", fill: "#000000"}
        ).setOrigin(0.5).setDepth(2);
        item_newspaper_text4 = this_scene.add.text(
            _x,
            _y+40,
            local_newsText[3],
            {font: "14px Arial", fill: "#000000"}
        ).setOrigin(0.5).setDepth(2);
        count_to_newsUpdate = 0;
        /*
        local_items_flag[_item_id] = true;
        let _x = 250;
        let _y = 940;
        item_bbs_text = this_scene.add.text(
            _x, 
            _y, 
            "", 
            {font: "14px Arial", fill: "#ffffff", backgroundColor: "#000000"}
            //{font: "14px Arial", fill: "#ffffff"}
        ).setOrigin(0).setDepth(9999);
        //item_newsbunner = this_scene.add.image(640, 485, "item_newsbunner")
        //    .setDepth(900).setAlpha(0.8);
        */
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_newspaper != "undefined"
    ) {
        item_newspaper.destroy(true);
        item_newspaper_text1.destroy(true);
        item_newspaper_text2.destroy(true);
        item_newspaper_text3.destroy(true);
        item_newspaper_text4.destroy(true);
        local_items_flag[_item_id] = false;
    }
    //after possession
    if (local_items_flag[_item_id] == true) {
        count_to_newsUpdate += 1;
        if (count_to_newsUpdate % 30 == 0) {
            contract_update_event_random();
            item_newspaper_text1.setText(local_newsText[0]);
            item_newspaper_text2.setText(local_newsText[1]);
            item_newspaper_text3.setText(local_newsText[2]);
            item_newspaper_text4.setText(local_newsText[3]);
        }
    }

    //###44:Cuckoo Clock
    _item_id = 44;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 990;
        let _y = 180;
        item_clock = this_scene.add.sprite(_x, _y, "item_clock")
            .setScale(0.45)
            .setOrigin(0.5)
            .setDepth(2)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                /*
                //1 times
                item_clock.anims.play("item_clock_anim_1");
                sound_clock.play();
                //2 times
                item_clock.anims.play("item_clock_anim_3");
                sound_clock.play();
                setTimeout( () => {
                    sound_clock.play();
                }, 2000);
                */
                //3 times
                item_clock.anims.play("item_clock_anim_3");
                sound_clock.play();
                setTimeout( () => {
                    sound_clock.play();
                }, 2000);
                setTimeout( () => {
                    sound_clock.play();
                }, 4000);
            });
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_clock != "undefined"
    ) {
        item_clock.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    //###194:Ohana Bank
    if (local_items[194] != previous_local_item194) {
        // define async function
        async function _do(scene) {
            // get item194 list, need to wait
            let _array_item194 = await get_userItems(summoner, 194);
            // recreate sprite group
            try {
                group_item194.destroy(true);
            } catch (error) {
            }
            group_item194 = scene.add.group();
            // create sprite, add group, using array for independency
            let _array_bank = [];
            let _array_text = [];
            let _array_icon = [];
            for (let i = 0; i < _array_item194.length; i++) {
                //bank sprite
                let _x = 650;
                let _y = 500;
                _array_bank[i] = scene.add.sprite(_x + i*50, _y, "item_bank")
                    .setScale(0.275)
                    .setOrigin(0.5)
                    .setInteractive({useHandCursor: true})
                    .on("pointerover", () => _array_bank[i].setTexture("item_bank_broken") )
                    .on('pointerover', () => sound_button_select.play() )
                    .on('pointerover', () => {_array_text[i].visible = true;} )
                    .on('pointerover', () => {_array_icon[i].visible = true;} )
                    .on("pointerout", () => _array_bank[i].setTexture("item_bank"))
                    .on('pointerout', () => {_array_text[i].visible = false;} )
                    .on('pointerout', () => {_array_icon[i].visible = false;} )
                    .on("pointerdown", () => unpack_bag(summoner, _array_item194[i]) )
                    .on('pointerdown', () => sound_button_on.play() );
                _array_bank[i].depth = _array_bank[i].y;
                //text, "+1000"
                _array_text[i] = scene.add.text(_x + 10 + i*50, _y - 50, "+1000", {font: "17px Arial", fill: "#000000"})
                    .setOrigin(0.5)
                    .setVisible(false);
                //icon, ohana
                _array_icon[i] = scene.add.sprite(_x - 30 + i*50, _y - 50, "icon_ohana")
                    .setOrigin(0.5)
                    .setScale(0.07)
                    .setVisible(false);
                group_item194.add(_array_bank[i]);
                group_item194.add(_array_text[i]);
                group_item194.add(_array_icon[i]);
            }
        }
        _do(this_scene);
    }

    //###195:Kusa Pouch
    if (local_items[195] != previous_local_item195) {
        // define async function
        async function _do(scene) {
            // get item194 list, need to wait
            let _array_item195 = await get_userItems(summoner, 195);
            // recreate sprite group
            try {
                group_item195.destroy(true);
            } catch (error) {
            }
            group_item195 = scene.add.group();
            // create sprite, add group, using array for independency
            let _array_bank = [];
            let _array_text = [];
            let _array_icon = [];
            for (let i = 0; i < _array_item195.length; i++) {
                //bank sprite
                let _x = 550;
                let _y = 490;
                _array_bank[i] = scene.add.sprite(_x - i*50, _y, "item_pouch")
                    .setScale(0.225)
                    .setOrigin(0.5)
                    .setInteractive({useHandCursor: true})
                    .on("pointerover", () => _array_bank[i].setTexture("item_pouch_broken") )
                    .on('pointerover', () => sound_button_select.play() )
                    .on('pointerover', () => {_array_text[i].visible = true;} )
                    .on('pointerover', () => {_array_icon[i].visible = true;} )
                    .on("pointerout", () => _array_bank[i].setTexture("item_pouch"))
                    .on('pointerout', () => {_array_text[i].visible = false;} )
                    .on('pointerout', () => {_array_icon[i].visible = false;} )
                    .on("pointerdown", () => unpack_bag(summoner, _array_item195[i]) )
                    .on('pointerdown', () => sound_button_on.play() );
                _array_bank[i].depth = _array_bank[i].y;
                //text, "+1000"
                _array_text[i] = scene.add.text(_x + 15 - i*50, _y - 50, "+1000", {font: "17px Arial", fill: "#000000"})
                    .setOrigin(0.5)
                    .setVisible(false);
                //icon, ohana
                _array_icon[i] = scene.add.sprite(_x - 22 - i*50, _y - 50, "icon_kusa")
                    .setOrigin(0.5)
                    .setScale(0.09)
                    .setVisible(false);
                group_item195.add(_array_bank[i]);
                group_item195.add(_array_text[i]);
                group_item195.add(_array_icon[i]);
            }
        }
        _do(this_scene);
    }

    //###197:Nuichan
    if (local_items[197] != previous_local_item197) {
        // define async function
        async function _do(scene) {
            // get item194 list, need to wait
            let _array_item197 = await get_userItems(summoner, 197);
            // recreate sprite group
            try {
                group_item197.destroy(true);
            } catch (error) {
            }
            group_item197 = scene.add.group();
            // create sprite, add group, using array for independency
            let _array_nui = [];
            let _array_nui_text = [];
            let _array_nui_ribbon = [];
            let _score_max = 0;
            for (let i = 0; i < _array_item197.length; i++) {
                let _x = 1070 + i*30;
                let _y = 520 + i*30;
                let _item_id = _array_item197[i];
                let _pos_local = "pos_item_asnya_" + _item_id;
                //recover position from localStorage
                if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
                    let _json = localStorage.getItem(_pos_local);
                    _pos = JSON.parse(_json);
                    _x = _pos[0];
                    _y = _pos[1];
                }
                let _item_nui = await contract_get_item_nui(_item_id);
                let _summoner = _item_nui[0];
                let _class = _item_nui[1];
                let _score = _item_nui[2];
                //update active nui_id
                if (_score >= _score_max) {
                    active_nui_id = _item_id;
                    _score_max = _score;
                }
                let _exp_rate = _item_nui[3] - 100;
                let _summoner_name = await call_name_from_summoner(_summoner);
                if (_summoner_name == "") {
                    _summoner_name = "#" + _summoner;
                }
                let _text = "";
                _text += " id: " + "#" + _array_item197[i] + " \n";
                _text +=" crafter: " + _summoner_name + " \n";
                _text += " score: " + _score + " \n";
                _text += " exp: +" + _exp_rate + "% ";
                _array_nui_text[i] = scene.add.text(
                    _x,
                    _y+68,
                    _text,
                    {font: "15px Arial", fill: "#000000", backgroundColor: "#ffffff"}
                ).setOrigin(0.5).setDepth(9999);
                _array_nui_text[i].visible = false;
                _array_nui[i] = scene.add.sprite(_x, _y, "item_nui")
                    .setOrigin(0.5)
                    .setScale(0.38)
                    .setInteractive({ draggable: true, useHandCursor: true })
                    .setDepth(_y)
                    .on("dragstart", () => {
                        //sound, depth
                    })
                    .on("drag", () => {
                        if (scene.sys.game.scale.gameSize._width == 1280) {
                            _array_nui[i].x = game.input.activePointer.x;
                            _array_nui[i].y = game.input.activePointer.y;
                        } else {
                            _array_nui[i].x = game.input.activePointer.y;
                            _array_nui[i].y = 960 - game.input.activePointer.x;
                        }
                        _array_nui[i].depth = _array_nui[i].y;
                        _array_nui_text[i].visible = false;
                        _array_nui_ribbon[i].x = _array_nui[i].x;
                        _array_nui_ribbon[i].y = _array_nui[i].y;
                        _array_nui_ribbon[i].depth = _array_nui[i].depth+1;
                    })
                    .on("dragend", () => {
                        //grand, sound, depth
                        _array_nui_text[i].x = _array_nui[i].x;
                        _array_nui_text[i].y = _array_nui[i].y+68;
                        _array_nui_text[i].visible = true;
                        sound_nui.play();
                        let _pos = [_array_nui[i].x, _array_nui[i].y];
                        localStorage.setItem(_pos_local, JSON.stringify(_pos));
                        //attenting
                        if (
                            _array_nui[i].x >= 100
                            && _array_nui[i].x <= 1100
                            && _array_nui[i].y >= 500
                            && _array_nui[i].y <= 800
                        ){
                            murasakisan.try_attenting(_array_nui[i].x, _array_nui[i].y);
                        }
                    })
                    .on("pointerover", () => {
                        _array_nui_text[i].visible = true;
                    })
                    .on("pointerout", () => {
                        _array_nui_text[i].visible = false;
                    });
                _array_nui_ribbon[i] = scene.add.sprite(_x,_y, "item_nui_ribbon").setOrigin(0.5).setScale(0.38);
                _array_nui_ribbon[i].depth = _array_nui[i].y + 1;
                //add group
                group_item197.add(_array_nui[i]);
                group_item197.add(_array_nui_text[i]);
                group_item197.add(_array_nui_ribbon[i]);
            }
        }
        _do(this_scene);
    }

    //###200:Presentbox
    //***TODO***
    if (local_items[200] > previous_local_item200) {
        let _itemIds = get_itemIds_from_itemType(local_myListsAt_withItemType, 200);
        _itemIds.forEach( async (_itemId) => {
            if (!summoned_presentbox.includes(_itemId)) {
                let _array = [
                    "item_presentbox_01",
                    "item_presentbox_02",
                    "item_presentbox_03",
                    "item_presentbox_04",
                    "item_presentbox_05",
                    "item_presentbox_06",
                    "item_presentbox_07",
                    "item_presentbox_08",
                ];
                let _img = _array[Math.floor(Math.random() * _array.length)];
                let _x = 170 + Math.random() * 830;
                let _y = 510 + Math.random() * 170;
                let _item = await call_item_info(_itemId);
                let _summoner_from = await call_name_from_summoner(_item.crafted_summoner);
                if (_summoner_from == "") {
                    _summoner_from = "#" + _item.crafted_summoner;
                }
                let _memo = _item.memo;
                let _present = new PresentBox(
                    this_scene,
                     _x, 
                     _y, 
                     _img, 
                     _itemId,
                     _summoner_from, 
                     _memo
                 )
                    .setOrigin(0.5)
                    .setScale(0.1)
                    .setAlpha(1)
                    .setDepth(3);
                summoned_presentbox.push(_itemId);
                group_update.add(_present);
                draw_flower(this_scene, _x, _y);
            }
        });
    }

    //###201-236:Fluffy
    if (local_fluffy_count > previous_local_fluffy_count) {
    //if (local_precious > previous_local_precious2) {
        let _timeout = 0;
        let _count_fluffy = 0;
        let _count_fluffier = 0;
        let _count_fluffiest = 0;
        //fluffy
        for (let i = 201; i <= 212; i++) {
            let _count = local_items[i];
            if (_count > 0) {
                let _itemIds = get_itemIds_from_itemType(local_myListsAt_withItemType, i)
                _itemIds.forEach(_itemId => {
                    if (!summoned_fluffies.includes(_itemId)){
                        setTimeout( () => {
                            //summon_fluffy(this_scene, i, "common", _itemId);
                            summon_fluffy2(this_scene, i, _itemId);
                        }, _timeout, _itemId);
                        //_timeout += 200;
                        _timeout += 0;
                        summoned_fluffies.push(_itemId);
                    }
                });
                _count_fluffy += _count;
            }
        }
        //fluffier
        for (let i = 213; i <= 224; i++) {
            let _count = local_items[i];
            if (_count > 0) {
                let _itemIds = get_itemIds_from_itemType(local_myListsAt_withItemType, i)
                _itemIds.forEach(_itemId => {
                    if (!summoned_fluffies.includes(_itemId)){
                        setTimeout( () => {
                            //summon_fluffy(this_scene, i, "uncommon", _itemId);
                            summon_fluffy2(this_scene, i, _itemId);
                        }, _timeout, _itemId);
                        //_timeout += 200;
                        _timeout += 0;
                        summoned_fluffies.push(_itemId);
                    }
                });
                _count_fluffier += _count;
            }
        }
        //fluffiest
        for (let i = 225; i <= 236; i++) {
            let _count = local_items[i];
            if (_count > 0) {
                let _itemIds = get_itemIds_from_itemType(local_myListsAt_withItemType, i)
                _itemIds.forEach(_itemId => {
                    if (!summoned_fluffies.includes(_itemId)){
                        setTimeout( () => {
                            //summon_fluffy(this_scene, i, "rare", _itemId);
                            summon_fluffy2(this_scene, i, _itemId);
                        }, _timeout, _itemId);
                        //_timeout += 200;
                        _timeout += 0;
                        summoned_fluffies.push(_itemId);
                    }
                });
                _count_fluffiest += _count;
            }
        }

        //update fluffy text
        let _count_nui = local_items[197];        
        let _text = "";
        _text += " fluffy x " + _count_fluffy + "\n";
        _text += " fluffier x " + _count_fluffier + "\n";
        _text += " fluffiest x " + _count_fluffiest + "\n";
        _text += " fluffy doll x " + _count_nui + " ";
        text_fluffy.setText(_text);
    }
    
    //###000:VisitorCat
    if (
        local_receiving_mail == 1 
        && (typeof cat_visitor == "undefined" || typeof cat_visitor.scene == "undefined")
    ){
        async function _run(scene) {
            /*
            let _res = await contract_callMailDetail();
            let _summoner_from_id = _res[0];
            let _summoner_from_name = res[1];
            cat_visitor = new VisitorCat(scene, 0, 0, summoner_from_id, summoner_from_name)
                .setOrigin(0.5)
                .setScale(0.4);
            */
            cat_visitor = new VisitorCat(scene, 0, 0, 99, "test")
                .setOrigin(0.5)
                .setScale(0.4);
            group_update.add(cat_visitor);
        }
        _run(this_scene);
    }

    //###000:Festivaler
    if (
        (
            typeof festligheter == "undefined" 
            || festligheter.mode == "destroy"
        ) && (
            local_ff_next_festival_block - local_blockNumber <= 7200
            || local_ff_inSession == 1
        )
    ){
        console.log("summon, festligheter");
        let _x = 200 + Math.random()*700;
        let _y = 550 + Math.random()*200;
        festligheter = new Festligheter(this_scene, _x, _y, "ff_preFestival")
            .setOrigin(0.5)
            .setScale(0.25)
            .setAlpha(1)
            .setDepth(3);
        group_update.add(festligheter);
    }
    
    previous_local_items = local_items;
    previous_local_item194 = local_items[194];
    previous_local_item195 = local_items[195];
    previous_local_item196 = local_items[196];
    previous_local_item197 = local_items[197];
    previous_local_item200 = local_items[200];
    previous_local_rolled_dice = local_rolled_dice;
    previous_local_name_str = local_name_str;
    previous_local_score = local_score;
    //previous_local_precious2 = local_precious;
    previous_local_fluffy_count = local_fluffy_count;
}


//---update()

function calc_fps() {
    let _now = Date.now();
    if (_now >= time_forFPS + 1000) {
        time_forFPS = _now;
        let _fps = (turn - turn_forFPS);
        turn_forFPS = turn; 
        text_fps.setText(_fps + " fps");
    }
}

async function updateFirst(scene) {
    await contract_update_all();
    if (flag_radarchart == 1) {
        draw_radarchart(scene);
    }
    update_syncTime(scene);
    update_numericAnimation(scene);
    update_parametersWithAnimation(scene);
    update_parametersWithoutAnimation(scene);
    update_checkModeChange(scene);
    update_checkButtonActivation(scene);
    update_checkItem(scene);
    //update_systemMessage();
}

async function checkChainId(scene, correctChainId) {
    let _hexCahinId = await window.ethereum.request({method:"eth_chainId"});
    let _chainId = parseInt(_hexCahinId);
    if (_chainId != correctChainId) {
        scene.scene.start("SomethingWrong");
    }
}

function update(scene) {

    //increment turn
    turn += 1;
        
    //calc FPS
    calc_fps();
    
    //protection code
    /*
    if (turn % 100 == 10) {
        protection_code();
    }
    */
    
    //send fingerprint
    if (turn % 100 == 0 && summoner > 0 && flag_doneFp == 0 && local_wallet == local_owner) {
        send_fp_get(local_wallet, summoner);
        flag_doneFp = 1;
        /*
        scene.input.on("pointerdown", () => {
            console.log(
                //Math.round(game.input.mousePointer.x), 
                //Math.round(game.input.mousePointer.y)
                Math.round(pointer_x), 
                Math.round(pointer_y)
            );
            //draw_flower(scene, game.input.mousePointer.x, game.input.mousePointer.y);
            //draw_star(scene, game.input.mousePointer.x, game.input.mousePointer.y);
            draw_fluffyBit(scene, game.input.mousePointer.x, game.input.mousePointer.y);
        });
        */
    }

    //radarchart
    if (turn % 1000 == 0 && summoner > 0 && flag_radarchart == 1) {
        draw_radarchart(scene);
    }
    
    //sync time
    if (turn % 20 == 0) {
        update_syncTime(scene);
    }

    //numeric animation
    if (turn == 1 || turn % 2 == 0) {
        update_numericAnimation(scene);
    }

    //parameters with animation
    if (turn == 1 || turn % 150 == 0) {
        update_parametersWithAnimation(scene);
    }

    //parameters without animation
    if (turn == 1 || turn % 150 == 10) {
        update_parametersWithoutAnimation(scene);
    }

    //check mode change
    if (turn == 1 || turn % 150 == 20) {
        update_checkModeChange(scene);
    }

    //check button activation
    if (turn == 1 || turn % 150 == 30) {
        update_checkButtonActivation(scene);
    }

    //check item
    if (turn == 1 || turn % 150 == 40) {
        update_checkItem(scene);
    }

    //system message
    //blink message
    if (turn % 300 == 50) {
        text_system_message.setText("");
    }
    //update message text
    if (turn % 150 == 60 || turn == 1 || count_sync == 1) {
        update_systemMessage();
    }
    
    //check chain id
    if (turn % 500 == 0) {
        checkChainId(scene, CORRECT_CHAINID);
    }

    //update onchain data
    if (turn % 250 == 70 && flag_sync == 1) {
        if (count_sync == 0 || local_notPetrified == 0 || summoner == 0) {
            contract_update_all();
        } else if (summoner > 0) {
            contract_update_dynamic_status(summoner);
        }
    }
}


//===phaser3:scene========================================================--------


//---FirstCheck

class FirstCheck extends Phaser.Scene {

    constructor() {
        super({ key:"FirstCheck", active:true });
        this.flag_start = 0;
        console.log("scene: FirstCheck");
    }
    
    preload() {
        this.load.image("icon_error", "src/png/icon_error.png");
        this.load.image("icon_wrong", "src/png/icon_wrong.png");
    }
    
    create(){

        //system messages
        let _msg1 = this.add.text(640, 480, 'Check Network')
            .setFontSize(80)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#ff1694");
        let _msg2 = this.add.text(640, 560, 'Connecting...')
            .setFontSize(40)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#ffebf7");
        let _errImg = this.add.image(640, 360, "icon_error")
            .setOrigin(0.5)
            .setScale(0.5)
            .setVisible(false);
            
        //function for loop
        async function runAll(scene) {
            let _chainId = 0;
            let _wallet = 0;
            //get metamask info
            try {
                let _wallets = await window.ethereum.request({method:"eth_requestAccounts"});
                _wallet = _wallets[0];
                let _hexCahinId = await window.ethereum.request({method:"eth_chainId"});
                _chainId = parseInt(_hexCahinId);
            //when error = no metamask or not yet connect
            } catch (err) {
                console.log("error");
                console.error(err);
                if (_wallet == 0) {
                    _msg1.setText("Connect Wallet");
                    _msg2.setText("Please install Metamask and allow wallet connection.");
                }
            }
            //check metamask info
            //when wallet and chainId are good, start Main scene
            if (_wallet != 0 && _chainId == CORRECT_CHAINID) {
                _msg1.setText("Check Network");
                _msg2.setText("Connecting...OK!");
                _errImg.setVisible(false);
                //prevent duplicated starting
                if (scene.flag_start == 0) {
                    setTimeout( () => {scene.scene.start("Loading")}, 500, scene);
                    setTimeout( () => {scene.scene.launch("Loading_overlap")}, 100, scene);
                    scene.flag_start = 1;
                }
                clearInterval(timerId);
            //when not connect yet
            } else if (_wallet == 0) {
                _msg1.setText("Connect Wallet");
                _msg2.setText("Please install Metamask and allow wallet connection.");
                _errImg.setVisible(true);
            //when wrong network
            } else if (_chainId != CORRECT_CHAINID) {
                _msg1.setText("Wrong Network");
                _msg2.setText("Please connect to the Astar Network RPC.");
                _errImg.setVisible(true);
            }
        }
        
        //loop checking wallet and chain id
        runAll(this);
        const timerId = setInterval(runAll, 5000, this);
    }
}


//---Loading

class Loading extends Phaser.Scene {

    constructor() {
        super({ key:"Loading", active:false });
        this.flag_start = 0;
    }
    
    //load wallet, contract, status here
    async update_web3() {
        let _start = Date.now();
        this.count_web3Loading = 0;
        console.log("load: web3");
        await init_web3();
        console.log("  OK", Date.now() - _start);
        this.count_web3Loading += 1;
        console.log("load: summoner");
        await contract_update_summoner_of_wallet();
        console.log("  OK", Date.now() - _start);
        this.count_web3Loading += 1;
        console.log("load: static");
        await contract_update_static_status(summoner);
        console.log("  OK", Date.now() - _start);
        this.count_web3Loading += 1;
        console.log("load: dynamic");
        await contract_update_dynamic_status(summoner);
        console.log("  OK", Date.now() - _start);
        this.count_web3Loading += 1;
        console.log("load: item");
        local_myListsAt_withItemType = await get_myListsAt_withItemType(local_owner);
        console.log("  OK", Date.now() - _start);
        this.count_web3Loading += 1;
        console.log("load: festival");
        await contract_update_festival_info(summoner);
        console.log("  OK", Date.now() - _start);
        this.count_web3Loading += 1;
        this.flag_start = 1;
    }

    preload() {
        console.log("scene: Loading");
        this.update_web3(); // start loading web3 without async
        preload(this);
    }
    
    create() {
        this._msg1 = this.add.text(640, 480, '')
            .setFontSize(30)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#ffebf7");
    }
    
    update() {
        //check web3 loading, wait for complete
        if (this.flag_start == 1) {
            this._msg1.setText("");
            this.scene.stop("Loading_overlap");
            this.scene.start("Opeaning");
        } else {
            let _text = "Loading On-Chain Data... (";
            _text += this.count_web3Loading + "/6)";
            this._msg1.setText(_text);
        }
    }
}


//---Loading_overlap

class Loading_overlap extends Phaser.Scene {

    constructor() {
        super({ key:"Loading_overlap", active:false });
        this.turn = 0;
        try {
            let _json = localStorage.getItem("flowerCount");
            this.flowerCount = JSON.parse(_json);
        } catch (err) {
            this.flowerCount = 0;
        }
    }
    
    preload() {
        this.load.spritesheet("nyui_loading", "src/png/nyui_moving.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("ohana_loading", "src/particle/flowers.png", {frameWidth: 370, frameHeight: 320});
    }
    
    create() {
        let _x = 400 + Math.random()*300;
        let _y = 800 + Math.random()*20;
        this.nyui_text = this.add.text(_x, _y-50, "")
            .setFontSize(20)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#ff1694")
            .setVisible(false);
        let _text = "";
        _text += "This count is stored locally\n";
        _text += "and does not affect play :)";
        this.nyui_text2 = this.add.text(_x, _y+60, _text)
            .setFontSize(16)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#888888")
            .setVisible(false);
        this.nyui = this.add.sprite(_x, _y, "nyui_loading")
            .setOrigin(0.5)
            .setScale(0.25)
            .setDepth(9999)
            .setInteractive({useHandCursor: true })
            .on("pointerdown", () => {
                this.flowerCount += 1;
                this.nyui_text.setText(this.flowerCount + " flowers");
                this.nyui_text.setVisible(true);
                this.nyui_text2.setVisible(true);
                let _ohana =this.add.image(
                    _x-150+Math.random()*300,
                    _y-20+Math.random()*40,
                    "ohana_loading"
                )
                    .setFrame(Math.floor(Math.random()*5))
                    .setOrigin(0.5)
                    .setScale(0.1)
                    .setAngle(Math.random()*360)
                    .setDepth(9999-1);
                //sound_nyui_loading.play();
                localStorage.setItem("flowerCount", JSON.stringify(this.flowerCount));
            });
    }
    
    update() {
        this.turn += 1;
        if (this.turn % 80 == 40) {
            this.nyui.setFrame(1);
        } else if (this.turn % 80 == 0) {
            this.nyui.setFrame(0);
        }
    }
}


//---Opeaning

class Opeaning extends Phaser.Scene {

    constructor() {
        super({ key:"Opeaning", active:false });
    }

    preload() {
        console.log("scene: Opeaning");
    }
    
    create(){
        /*
        let back_opeaning = this.add.image(640, 480, "back")
            .setInteractive()
            .on('pointerdown', () => {

                this.cameras.main.fadeOut(1200, 244, 108, 208);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start("Main");
                });

                //this.scene.start("Main");
            });
        */
        //let back_opeaning = this.add.image(640, 480, "back")
        //fade out
        contract_update_all();
        this.cameras.main.fadeOut(300, 255, 255, 255);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("Main");
        });
    }
}


//---Something Wrong

class SomethingWrong extends Phaser.Scene {

    constructor() {
        super({ key:"SomethingWrong", active:false });
    }

    create(){
        //system messages
        let _msg1 = this.add.text(640, 480, '')
            .setFontSize(80)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#ff1694");
        let _msg2 = this.add.text(640, 560, '')
            .setFontSize(40)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#ffebf7");
        let _errImg = this.add.image(640, 360, "icon_wrong")
            .setOrigin(0.5)
            .setScale(0.5)
            .setVisible(false);
        _msg1.setText("Something Wrong");
        _msg2.setText("Please reload the page.");
        _errImg.setVisible(true);
    }
}


//---Main

class Main extends Phaser.Scene {
    constructor() {
        super({ key:"Main", active:false });
    }
    preload(){
        //preload(this);
    }
    create(){
        let _start = Date.now();
        console.log("create...");
        create(this);
        console.log("  OK", Date.now() - _start);
        updateFirst(this);
    }
    update(){
        //fade in
        if (flag_fadein == 0) {
            this.cameras.main.fadeIn(600, 255, 255, 255, update(this));
            flag_fadein = 1;
            
            //plugin: rexuiplugin
            //need for nameplate
            //need to load in Main secene,
            //need to load after fadein because of camera flashing
            this.load.scenePlugin({
                key: 'rexuiplugin',
                url: "lib/rexuiplugin.min.js",
                sceneKey: 'rexUI'
            });
            this.load.plugin('rextexteditplugin', 'lib/rextexteditplugin.min.js', true);
        }
        update(this);
    }
}


//===phaser3:config========================================================--------


let config = {
    type: Phaser.CANVAS,
    parent: "canvas",
    backgroundColor: "F4B4D0",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 960,
    },
    scene: [FirstCheck, Loading, Loading_overlap, Opeaning, SomethingWrong, Main],
    fps: {
        target: 50,
        forceSetTimeOut: true
    },
    //nedd for rexUI plugin
    dom: {
        createContainer: true
    },
};

game = new Phaser.Game(config);


//===end=================================================================
/*

 ok メール送信成功のメッセージを実装
        相手がメールを開けたことがわかるように
    
 ng 電光掲示板の実装
        craftやfeedingなど、他キャラの行動の情報を流す電光掲示板
            craft
            level-up
            mining
            farming
        上記イベントを監視してランダムで表示させる
        前回表示時～今回までの間にlogをすべて取得し、ランダムで1つ表示させる
        何もlogがなければ表示させないか、なにか適当なテキストを表示させる。

 ok web3周りのコード整理
        infoコントラから一括でバッチ処理で取得する
        個別の情報は仕方ないのでその都度取得する
        一度だけ読む情報もinfoからバッチで取得する

 ok Mint表記の実装
        Craftボタンをstopとmintに表示仕分ける

 ok etc
        猫のアニメーション
            sleepingとsitting
        鳩時計のアニメーション
            クリックで一定時間
            サウンド
        ピアノのサウンド
            クリック時
            曲？音だけ？
        バッチ処理による軽量化
            チェーン情報の一括取得、頻度向上

 ok mfsのprecious_scoreのバグ修正
        allBalanceの積算になっているので、同じタイプが重なると加算されていない
        count of type * 3などで良いか。

 ok myListsAt_withItemTypeの使用
        item_nui取得時、bag取得時のコードの修正
        local_itemの修正
        myListsAt_withItemTypeでwalletが所持するitem_idとitem_typeをいっぺんに取得し、
            この情報からlocal_itemを作成する
        こうすると、チェーンへのcallはmyListsAt_withItemTypeのみで良くなる
            重くなければ毎回callする
        その後item_nuiの詳細取得は仕方ないか

 ok birth_time周りの修正
        ageを直接callして表示させる

 ok working周りの修正
        calc_workingは一括取得し、flagに応じてlocalを修正する
        
 ok radarchart周りの修正
        補正後ステータスは一括取得しradarchart描写時にはcallさせないようにする


luck challengeチェック用関数
async function test() {
    function sleep(waitMsec) {
        var startMsec = new Date();
        while (new Date() - startMsec < waitMsec);
    }
    while (true) {
        console.log(await contract_info.methods.luck_withItems_withStaking_withDice(1).call());
        console.log(await contract_mfs.methods.dn(1,10000).call());
        console.log(await contract_mfs.methods.luck_challenge(1).call());
        sleep(5000);
    }
}

    バイバックシテムの深慮
        意味論
            市場最低価格を運営側で設定することにより、暴落という概念をなくす。
            最低価格はdapps stakingに応じて少しずつ上昇してゆく。
            アイテムは売って手放せるが、売って利確するとその後の育成効率が下がる
                かつ、売値が高いアイテムはより後半で作れる
            時間が立つほど売値が上昇するので、後で売ったほうがお得となり、売りづらい
            常に最低価格で買い取ってもらえる安心感を設定する
            最低価格より高い値段で売りに出して、誰かが買ってくれると嬉しい
            最低価格での売りはburnとなり、残ったアイテムの希少性を上げる
        戦略
            最低価格はどれだけ売られても下がらない
                mintされた全アイテムを買いきれる価格に設定する
            係数をかけてLv1よりLv16のほうが高くなるようにする
                必要なコストに比例するようにする
            dapps stakingによりtrejuaryが増加して価格が上昇する
                しかし、これだと新規参入者が増えると価格が下落することになる
                trejury/summonerの値が小さくなるため
                trejuryはmint費用＋staking rewordが入る
                    summonerが増えるとそれだけ、summonerあたりのtrejuryが減るため、
                    アイテム買取価格も減らさなければいけなくなる
                summonerのmint費用をtrejuryに応じて上げればよいか
                    現在のtrejury/summonerがmint費用に等しい
                    アイテム買取価格が2倍に上がれば新規mint費用も2倍に上がる計算
        実装
            summonerのmint費用はtrejury/(summoner+1)で算出する
                trejury/summonerの比率はどれだけmintされても変化しない
                早めの参入が少しだけ有利な設計
            dapps stakingの50%がtrejuryに移動する
            全アイテムを売り切るとtrejury/summonerの値を使い切るコスト設計にする
                最低価格だけでは恩株化しにくい設計≒ポンジスキーム化しにくい設計

 ok infoコントラの実装と整理
        UXとのinteractionは基本的にinfoコントラを介す
        定期的に取得する情報はarrayとして一度に取得する関数を実装する
        個別に必要なものもすべてinfoコントラに格納し、
        可能な限りarray化してUXから読み込みやすくする

 ok トレジャリーコントラクトの整備と実装
        バイバック金庫
            amount / summoner number = mint fee とする
                あるいは、amount / active summoner number = mint fee
                petrified summonerの数は除く
            mint時は自動的にバイバックトレジャリーに50%, 運営金庫に50%入る
            以降は、あらかじめ予定したインフレ率に従い、一週間か一ヶ月ごとに手動で追加する
        運営金庫
            mint feeの50%が即座に入る
            donationの100%が即座に入る
            trading fee, dapps stakingのうち、バイバック金庫に入り切らなかったものが入る
            運営報酬として個人walletへ支払う
            残ったものはdapps stakingへ還元する
        バッファー金庫
            dapps staking, trading fee, その他feeはすべてここに一時的に格納される
            週毎か月毎に、決められたインフレ率になるようにバイバック金庫へ移す
            残りは運営金庫へ移して、その都度0にする。
        弱点
            mint過剰
                mintだけしてtradingもdapps stakingもしないライトユーザーが大量につくと、
                バイバック費用が全く釣り上がらずに物価が上がらない
                どこかで非アクティブユーザーをふるい落とす機構が必要か
                もうプレイしないユーザー（石化ユーザー）の分のバイバック料金は、
                インフレ率計算時にアクティブユーザーで分けるようにするか。
            インフレ資金不足
                みなが盛んにゲームプレイしてもインフレには寄与しない
                また、ユーザー数が短期間に増大するとむしろインフレしにくくなる。
                mint feeの50%をdapps stakingしたリワードがインフレ率の基本なので、
                何も追加がなければ年3.9%しかインフレしない。
                dapps stakingに入れてるほどのファンユーザーの「比率」を
                どれだけ増やせるかがインフレ率に寄与する。
                1年インフレ率42%で、月率3%
                これを実現するためには、dapps stakingに1120/summoner必要
                10,000 stakingしてくれる人が10%いれば実現可能なライン
            後半の経済破綻
                アイテムはだいたい1週間に1個程度作製できる
                序盤のアイテムはいくら売ってもバイバック金庫が枯渇しないが、
                後半のアイテムは売り続けられると金庫が枯渇する。
                育ちきったsummonerが一斉に集金に走ると、おそらく経済が終わるだろう
                この辺、計算しておくか、デフレルールを設けるか、対策が必要
                Lv10アイテムnormalを売り続けると103日で枯渇する（3.4ヶ月）
                つまり、1年後に作っては売りの集金に走ったとしても、
                バイバック金庫をシュリンクさせるには3-4ヶ月かかる
                2年後にLv16のアイテムを売るとすると、およそ1.5ヶ月

 ok lootライクなランダムテキストの実装
        summoner mint時にランダムでオリジナルのパラメータを設定する
        パラメータによって何かしらの差をつけたいが・・・
            ゲーム性には直接関係ない、愛着とストーリー性を持つものにする
            早さや大きさなど、行動に影響したり変化したりしそうなものは避ける
        項目案
            出身地：火星、お花畑、滝壺、アンドロメダ星雲、とか意味不明な場所にする
            好きな色：最初に設定する
            正確：おっとり、
            寿命：
            
        出身地(Birthplace)：
            fluffy
            woolly
            feathery
                x
            sweater
            blanket
            carpet
            cushion
            scarf
            towel
            
        softness:
        fluffiness:
        elasticity:
            inredible
            marvelous
            excellent
            amazing
            great
            fabulous
            wonderful
            gorgeous
            awesome
            fantastic
            lovely
            brilliant
            impressive
            superb
            
        main component:
            kindness
            braveness
            love
            pleasure
            cuteness
            cleverness
            
        personality:
            friendly
            reliable
            optimistic
            frisky
            thoughtful
            honest
            easygoing
            tolerant
            mild
            affectionate
            intelligent
            patient
            faithful
            innocent
            gentle
        

 ok 収集NFTの再考
        コンセプト
            むらさきさんが集めている宝物
                流れ星、金平糖、宝石の原石
            他のsummonerとの関わりでのみ手に入る
            マメなゲームプレイに応じて手に入る
            luckを増やす主な手段
                luckが増えるとすべての行動効率が増加する
            トレードするとより有利になる機構
            同型を集めてupgradeすることで効果を高められる
            集めるとお部屋がにぎやかになる
        今ハートを得るタイミングで代わりに手に入る多種類NFT
            所持することでluckが上昇する
            同じ種類を集めてupgradeすると上位NFT化できる
            上位NFTは3個→5個分の効果、など
            luckを効果的に上げる主な手段とする
        upgradeのUIの実装
            marketのupgradeでは味気ないか
            うまくsummonerの行動として組み込みたいところだが。
            ネックは、burnするアイテムの選択をどうするか。
        取得方法の再考
            craft時に受動的に
            mail時に能動的に
            もう1つぐらいなにか
                他のsummonerとのインタラクションが必須にしたい
                例えば、ダイスで20出たらとかではなくて。
            しかし、あまりにも機会を増やすと部屋がNFTだらけになる。
        宝石箱の実装
            集めたNFTを入れておく入れ物
        作品内での立ち位置と、獲得時の演出を深慮する
            星なら空から降ってくる
            宝石ならないないさんが持ってきてくれる、など。
        一方通行で溜め込むだけで、消費はさせない
            クラフトの消費アイテムとしては要求されない
            1キャラに集中させてluckをブーストできるので、レベルキャップをもうける？
        実装
            見かけ：未定
                流れ星、金平糖、宝石、きれいな石、あるいはそのいずれかに見える謎の個体
                → 毛玉：fluffyとする
                fluffy (normal), fluffier (uncommon), fluffiest (rare)
                red fluffy, blue fluffierなど、種類＋レア度で表現する
            種類：ひとまず１２
                トレードしないとランダム取得で効率悪いように
                4だと少ない、12だと多すぎ？10か8か。あるいは12でも良いか。
                    red
                    yellow
                    white
                    black
                    green
                    orange
                    brown
                    pink
                    blue
                    aqua
                    gray
                    violet
                    
            レアリティ：3段階
                itemと同じくnormal, uncommon, rare
                下位3個をburnして上位1個をmintする
                n*3 -> u = n*4, u*3 -> r = u*4 = n*16 (n*9 -> n*16)
            取得理論値：
                luckデザイン
                    初期値3 + ダイス平均1 + staking3 + Lv分4 = 11 (1年後)
                    1年後にNFTによって+4 = 15ぐらいを目安に設計する
                0.01ならばn:400個, u:100個, r:25
                0.05ならばn:80個, u:20個, r:5, この辺だろうか
                    n*80/y = 6/mo = 3/2w
                0.04ならばn:100個, u:25個, r:6.25
                    n*100/y = 8/mo = 2/w
                    クラフトは1/w, メールも1/wとすると, 合わせて2/w程度
                    もう一つ取得メカニズムを入れたい場合は、初期値3を下げるか、単価を下げるか。
                0.03ならば, n:133
            レベルキャップ：
                市場買い占め→luckブーストを防ぐメカニズム
                でないと、luck +100なども可能になってしまう
                キャップはLvとするか、Ageとするか
                    → やはりゲームプレイに応じて上がるLvが適切か
                単純に、Lv20でmax+4として、0.2/Lvとするか
                    これなら、相当課金しないとLvキャップを意識しなくて良いだろう


    トレジャリーシステムの深慮
        これまで
            特定の成長型NFTを用意し、そのスコアによってairdrop
            しかしこれではNFT成長へのインセンティブが強すぎて制御しづらい
        次案
            トレジャリーの資金でマーケット上のアイテムを最低価格で購入する
            予め決めた論理的最低価格を下回っているアイテムをトレールして自動で買う
            買ったアイテムは実質バーンされる
            あるいは、売るときに「運営に売る」ボタンを別に作る
            買い手は、summoner Lv3以上など、何かしらの制限をかける
            また、アビトラ対策として、black listメカニズムを実装する
                最低価格以下で売ったアイテムを即座に買い、運営に売りつけるアビトラが成り立つ
                これらのwalletは発見次第black listへ入れる
                walletのsummonerがLv3以上なので、multi walletは容易ではない。
            black listは、マーケットコントラにもあっても良いかもしれない。
                アビトラしたwalletはマーケットからも締め出す
            アイテムごとの係数（利率）はあとから決められるように実装する。
            トレジャリー内の総数に係数をかけ合わせた値が最低価格とするか。
            アイテムを買ってトレジャリー内の総数が減れば、最低価格も下がってゆく。
            どこかでinとoutが拮抗し、最低価格が定常状態になるはず。
            dapps stakingをトレジャリーに当てる。
                staking量が増えれば最低価格も上がる。
            mint料金をトレジャリーに入れてしまうと、
                最低価格が初期からどんどん下がってゆくので、心象的に良くない。
                やはり「価格」は、その作品の「人気度」の可視化とみなされがち。
                緩やかに上ってゆくのが理想
                → 価格上昇数式を考えられたら、mint, donation, feeすべてトレジャリーに格納する
                    流石に50%とするか。50%は運営の取り分。
            トレジャリー全額を均等に割るのではなく、
                トレジャリーの量が必ずin>outとなるように、一部のみを購入に充てる。
                1年ほどかけて徐々に最低価格が上がってゆく設計にする。
                つまり、今後全くinがなくなったとしても、
                    常に今から1年後がmax値になるよう数式を組む。
                inが増えればその分、1年後のmax値も増えるため、現在の価格も上がる。
            トレジャリーに売ったアイテムは実質バーンなので、トレジャリーから買うことはできない。
            mint fee, trading fee, donation, cure feeなどをtreajuryコントラへ転送する機構を実装する
                理想はfeeを得ると同時に転送し、価値をいろいろなところに分散させない。
                かつ、トレジャリーコントラは超気をつけて設計する。
            feeを一元管理するfee contractと、分配専用のtreajuryコントラクトを実装する。

    バイバックコントラの実装
        基本原則
            ・treasury内のastr量に応じて価格調整する
            ・ただし、最低買取価格は下がらない
                必ず上昇してゆく
                1年後をmaxとする
            ・すべてのアイテムが一度に売られたとしても買い取れる値段設定
        実装
            まず、各アイテムの種類ごとの総mint数を得る
            アイテムの種類ごとの割当トークン量を決める
            割当トークン量を総mint数で割る

    宝石NFT・宝石箱NTT機構
        トレードインセンティブ
            他の人と交換したほうが効率が良い
        リワードインセンティブ
            献身によってリターンを得られる
        レベルアップインセンティブ
            レベルを上げたほうが効率が良い
        クラフトインセンティブ
            クラフトしたほうが効率が良い
        メインスキームインセンティブ
            mining/farming　→　crafting + level-up
            メインストリームを勧めていくとついでに手に入る位置づけ
            メインストリームに必須の行動のおまけで手に入るようにするか
                レベルアップ時
                クラフト時
                アップグレード時
                スコア達成時
                実績達成時
                    10個クラフト
                    10個heart受け取り
                    coin 10,000 mine
                    kusa 10,000 farm
            実績管理で行う
                メインストリームに合致した実績を導入し
                その報酬として宝石NFTを得る
                トレードが頻発するよう、ある程度の数を得られるように調整する

    新NFT群の考案
        トレードインセンティブ
            トレードしたほうが有利になる機構
            一人で集めるのは効率が悪いように設計する
        ERC3664
            動的なパラメータを有するNFT規格
            他の静的NFTを所有する
            一方向に、ポジティブな方向にのみ動的に変化させたい
            → 有価証券とみなされる恐れがあるので、NFTではなくNTTにする
        dApps Staking
            所有するだけか、あるいはstakingすることでリワードを得られる機構
            リワード報酬の計算式を＊深慮＊する
            報酬効率を上げるためにはトレードしたほうが良いように設計する
        heart経済
            heartを消費する機構を組み込む
        以上を踏まえての構想
            宝石NFTを所有する宝石箱NFT
            宝石箱NFTはERC3664規格、宝石NFTはERC721規格
            宝石NFTをburnすることで宝石箱NFTの宝石所持attributeを加算する
            宝石箱の所持宝石数に応じてstakingのリワードが変わる
            他の人が集めていない宝石はリワード効率大
                トレードでなにか1種類を特化して集めたほうが有利な機構
            その他、全種類1個ずつなど、何かしらの「役」があってもよいだろうか
                チートイツ、四暗刻、など。
                これも、足りないものをトレードで手に入れたほうが有利
            取得はランダムで、ランダムが最も効率が悪くなるようにする
            また、特定の組合せの宝石をburnすることで、上位の宝石を入手できる
        宝石NFTの取得方法
            heart消費のメカニズムを組み込む
            積極的に取りに行くというよりは、
                何かのついでにもらえるかも、のほうがよいか
            heart消費を主軸に据えすぎると、
                coin/materialを稼ぐインセンティブが弱くなるので注意
            うまく、お世話→クラフト→coin/material拡大再生産、
                のメインストリームに噛ませていきたい
            stakingリワードは強力なインセンティブなため、
                リワードを最大化させる行動に最適化してゆく可能性が高い
            やはり、最もシンプルなのは、heart経済ではなく宝石経済にすることだろうか
                heartを貰えるタイミングで、ランダムな1種類の宝石をもらえる
                その宝石を宝石箱NFTに格納してゆくことで、
                    宝石箱NFTのレアリティ（相対的）が上がり、リワードが増える
                しかしこれだと、ひたすら猫メール送るだけになり、
                    Lv上げのインセンティブが弱くなるか
            NFTがもらえる行動案（heart経済時）
                レベルアップ時
                    総数20個程度/2y
                初めてのアイテムをクラフトした時
                    総数48個程度/2y
                    アイテムクラフトのインセンティブup
                    フラグ管理が別途必要
                    何でもクラフト時にすると、
                        低レベルアイテムをひたすらクラフトし続けるスカムが可能でNG
                アイテムをアップグレードした時
                    同一アイテムを買い集めるインセンティブが生まれるか
            NFTを格納する時
                格納総数に応じてheartを消費する
                あるいは、総格納数のアンロックにheart消費が必要、など
                    宝石箱NFTのレベル上げにheartが必要なイメージ
                    常に、少しだけ足りないバランスで。
                    いくらでも宝石を格納できるようにすると、買い占めが可能になるので、
                        heartにより格納スロットがアンロックするようにブレーキを掛ける
                    そして、やはりheartは簡単にはsummoner間を移動できないようにする
            NFTを取り出す時
                いつでも取り出せる
                取り出すときはheartは消費しない
        リワード報酬の計算式
            宝石の個数に比例
            宝石の種類が単一であるほどレアリティ（スコア）が大きくなる
                この係数設定が勘所か
                ランダムではなく、色を揃えたほうがどのくらい有利にするか
                また、似た色でも有利とするか、完全に単一ではないと駄目とするか
                大きい上位宝石NFTを実装するなら、その係数をどうするか
        bot対策
            summonerを12体運用し、互いに閉鎖的にやり取りすれば効率よいか
            自分だけで運用するより、世の中と相互作用したほうが有利になる機構はあるだろうか
            一つはdapps stakingで、astarbaseリンクしstaking済みwalletが有利になるようにする
                もう少し如実に有利になるように補正をかけてもよいだろうか
            しかし、dapps stakingで振るっても、2-3 wallet程度のmulti walletは防げない
                むしろ、dapps stakingまでしてくれるのならば、2-3ぐらいは良しとするか。

 ng 実績コントラクトの実装
        実績達成をtrue/falseで判定するfunction
            1つの実績につき1 function
        達成済み実績をtrue/falseで記憶するstorage
            achievement uint32[256]のようなarray
        新たに達成した実績の数をuint32でreturnするfunction
            もしくはarrayでreturnする
            達成時は項目を表示させたいため
        実績判定のタイミングをどうするか
            mining/farmin時などにいちいち行っていたらgas代かさむか
            level-up時にまとめて行うか
        実績案
            coin/material:max 500,000
                gain 1,000
                gain 10,000
                gain 100,000...
            craft:0-48
                4,8,12,16,20,24
                craft 10
                craft 30
                craft 100...
            heart
                received 10
                received 30
                received 100...
            level-up:1-20
                3,6,9,12,15,18



2nd                

    有価証券への抵触の回避
        https://www.pwc.com/jp/ja/knowledge/prmagazine/pwcs-view/202205/38-06.html
        有価証券：集団投資スキーム持分
            ①権利を有する者（以下「出資者」）が金銭等を出資または拠出すること
            ②出資または拠出された金銭等を充てて事業（以下「出資対象事業」）が行われること
            ③出資者が出資対象事業から生ずる収益の配当または当該出資対象事業に係る財産の分配を受けることができる権利であること
        dapps stakingのリワードを分配するnftは有価証券に抵触する可能性がある
        懸念点：
            1, ユーザーのdapp stakingへの登録が出資・拠出にあたるのかどうか
            2, ゲーム運営が1の出資を用いた事業に当たるのかどうか
            3, dapp stakingのリワードをcommunity poolへ入れてその一部を分配するのが「利益の配当」に当たるのかどうか
        ケースとしては、dapps stakingに何も入れていない人が、宝石箱NFTからリワードを得る場合もありうる
        この場合は、配当権利はあるが拠出を行っていないので該当なしだろうか
        また、運営が事業を行って事業利益を分配、というよりは、
            dapps stakingの報酬を手つかずで分配している
            しかし、dapps stakingのリワードが運営利益とみなされるのならば、
            利益の分配権とみなされるだろうか。
        大本のmurasaki-san NTTは、mint時に「寄付」を受けるとするか。
        あるいは, walletに紐付けられたNTTにしてしまい、自由に売買できなくすれば回避できるか？
        https://twitter.com/mori_kazutaka/status/1536003874397765632
            出資するだけで配当がもらえれば、基本的には集団投資スキームに該当
            出資ではなく、労務等の具体的な貢献に応じて、その対価を収益から支払うことは問題ない
        dApps Stakingへの登録が「出資」に当たるのか
            staking登録の結果NFTがもらえるわけではないので、出資証明の権利ではないか
            stakingリワードが運営利益といえなくはないが
            運営利益を、NFTを用いたゲーム内活動への「見返り」として分配するのはOKか。
            stakingへの出資はゲーム内の活動を有利にするため
            NFTを「用いた」ゲーム内活動によって、「walletの」分配率が決まる
            この場合、何が有価証券に該当するのか。walletか。walletに付与されるNTTか。
            しかし、NTTは出資によって獲得したわけではなく、
                ゲーム内活動によって出資を伴わずに獲得する
            ゲーム入場料に該当するNTTは出資を伴うが、これ自体には配当権利は付与していない。
                配当権利を持つNTTを獲得するためには、ゲーム内で「労務」する必要がある。
                配当権利を持つNTTの獲得には、運営主への「出資」は必要ない。
                ゲーム内の「労務」強度に応じて、運営利益から金銭が分配される。
            つまり：
                1, 配当権利を有するNTTは不特定多数に自由に譲渡売買できない
                2, 配当権利を有するNTTを獲得するためには運営への金銭の出資を伴わない
                3, 運営PJへのdapp stakingは、運営へ金銭を直接渡す「出資」ではない
                4, 運営からの利益分配は、出資への見返りではなく作品中の「労務」への見返りとして行う
                5, 作品への入場料となるNTTの購入費は、「寄付」であり「出資」ではない
            以上の点から、本PJ内には有価証券に該当しうる電子的価値は存在しないと思われる
        以上を踏まえた設計：
            ・NFTではなくNTTで設計し譲渡不可とする
            ・開始時点では所有しておらず、作品中の労務によって獲得できる
            ・獲得のために金銭の出資は伴わない
            ・配当率は作品中の労務のみに依存し、dapps staking量は一切参照しない
            ・「配当」や「出資者」というキーワードは用いない

 ok Updateコードのリファクタリング
        group_forUpdateを作製してchildUpdateをtrueにする。
        diceやsummoner, starなどupdateを持つclassはここに集約する
        update頻度は個別のclass.update()内でturn % == 2などで調整する
        本体のupdate()内には情報の更新などのみを記載する
        また、可能であれば、fps=30で軽量化を図る

    Nui手動メモ
        mcとmsnにwalletをpermit
        mc.craftで197をsummoner,wallet指定してcraft
        msnでnuiのitem_idにscore, summonerをセット
        
 ok walletが所持するNFTの利用
        ホワイトリスト方式
            AstarDegen
            AstarCats
            AstarWitch
            AstarPunks
            AstarBots
            Astarians
            Templa
        NFT絵を取得して額縁内に表示させる
        クリックする度に絵が変わる

 ok walletが所持するトークンの利用
        ホワイトリスト方式
            Astar系
                ASTR
                SDN
                BAI
                LAY
                ARSW
            ステーブル
                USDC
                USDT
                BUSD
                DAI
            他チェーン
                BTC
                ETH
                BNB
                MATIC
        walletに所持しているトークンが入っているtoken bascketアイテム
            アイテムクリエイト時に、各トークンのコントラクトから所持数を取得する
        クリックで床にトークンボールがばらまかれる
        再度クリックでお片付け

    宝石箱NFT
        宝石NFTを所有する宝石箱NFTの考案
        変化する状態を有し、NFTを所有するNFT、NFT2.0型
        tokenURLはsvgではなく絵にしてみたい
        シンプルに1コントラで完結させてみたい
        heart経済の主軸に据えられるか
        構想
            宝石NFTを所有する
            変化するパラメータを有する
                レベル
        ERC-3664で作製してみる
            本当はmmもERC-3664が良いのかもしれないが、
            NFTではなくNTTなので大変だろうか。
            また、変数が多すぎて3664でカバーできるのだろうか。

    dApps Staking報酬案
        最低金額でもstakeしてくれたらluck+固定値
        たくさんstakeしてくれたら最大でluck+固定値x2
        ただし指数関数増加でx2に無限大で近づくとする
        dapps staking済みwalletの取得方法を考える
            walletを引数で渡し、true, falseで返すコントラがベストか

    walletとの連携機能の実装
        せっかくのNTTなので、walletに紐付けられている感じをもたせる
        Astar walletに住むペットのイメージなので。
        NFT額縁
            walletにあるNFTをランダムで表示
            PJはある程度指定しておく
        Wallet Visualizer
            walletの活動度によって変化する何かを実装する。
                入っているトークンが表示される水槽？
                walletの古さによって水草の数が増える？
                その日のトランザクション数によって変化させる？
            デイリートランザクション：天気などすぐ移り変わるもの
            古さ：木の大きさなどゆっくりと一方向に増えてゆくもの
            トークン数：天気よりはゆっくりと増減するもの

    インフレ対策の深慮
        coin, material, heartはどんどんインフレしてゆく
        そのため、常にユースケースの要求値を少し多めに設定する
        coin, materialは掘らなければexp多くもらえるトレードオフなので、インフレしにくいか
        heartはきちんと計算しないと余ってしまいそう
            一方で、summoner間を移動できないので、デフレにしすぎると足りなくて詰む
            少し高コストで、heartを売ることも可能にしてもよいだろうか
                4つ消費して作製するNFT: big heart
                coin/materialを500ずつ要求？
                あるいは、ハート5個で作って解体時はハート4個だけ得る、など。

    育成型NFTの深慮
        ぬいちゃんシステム上でランダム性の高いNFTをつくる
        むらさきさんの行動によって結果が変わる
        独自ステータスを持つ
        何が生えるかわからない植木鉢
            うごうごする花を沢山用意する
                色を変えるなど
        何が生まれるかわからない卵
            小さな生物をたくさん用意する
                ちょうちょなど？
                
    マルチプレイの検討
        扉を出てフィールドへ出かける
        フィールド上では十字キーなどでキャラクターを操作する
        他のプレイヤーの位置を同期して表示する
            10人まで、など上限を決めるか
        外のフィールドへ出てゆくインセンティブ設計が必要
            土地の概念を導入する？
            このフィールドでしかできないことはなんだろうか

 ng ハート経済の深慮
        ハートを消費する行動の設定
            ぬいちゃんのクラフト
                何個消費するか
                5個で1週間分
                最大では10個までしか消費させられない
                ぬいちゃんはあまり多くは作ってほしくないので、高めに設定したいが。
            後半アイテムのクラフト？
        ハートの平均取得数の深慮
            猫が3日サイクルだとすると、1週間で4個
            クラフトを加えると1週間で5個
            これは多いか？
            少しさびしいが、猫は7日サイクルにするか
                これで1週間に平均3個程度
                ぬいちゃんの要求が8個だとすると、3週間分ていど。

 ng dapps stakingシステムの再考案
        メインコンセプト
            本作品の中心は、craft → 部屋がにぎやかになってゆくというUX
                craftをより効率的に行うためには、summonerがlv-upしたほうが有利。
            このコンセプトを阻害しないように機構を組み込む
        ベターコンセプト
            トレードインセンティブ
                マーケットを積極的に使ったほうが「有利」になる機構を組み込む
            アンチボット
                マルチウォレット型ボットに対して耐性のある機構を組み込む
            ステークインセンティブ
                より多くstakingしたプレイヤーが有利になる機構を組み込む
        以上を踏まえた設計
            houseのcomfortableをスコアとして数字化する
                異なる種類のアイテムがたくさんあるほどスコアが高くなる
                comfortableが一定値以上でstakingリワードを得られる
*/
