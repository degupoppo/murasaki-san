
//===Header==================================================================================

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
    
*/


//===ToDo====================================================================================


/*


//### 1st


 ok ピッペルの出現時間を、流石に3時間程度に伸ばす。
        また、_setであとから変えれるように修正する。

    
    ツイートボタンの設置
        ハッシュタグと、進捗を端的に表す一枚絵をツイートするボタン。
        一枚絵の案
            匿名性を担保しつつ、自己顕示欲を満たせる情報を入れる
                summonerId      ng
                summonerName    ng
            svgかcanvasを用いて賑やかさを演出する
                mint済みのNFTは基本的に盛り込みたい
                家の基本背景にどんどん上から追加描写してゆく感じで
                fluffy, pippelもポコポコ追加する
            → 画像をツイートする敷居が高いので保留とする
        現時点では、ツイッターカードでホームページのサムネイルを表示させるに留めるか
        自動ツイートはできなくとも、
            「◯◯のhashtag付けてツイートに使ってね」
            のメッセージとともに、ツイートに使いたくなる絵を表示し、
            クリップボードへコピーするボタンを設置しておくのもよいだろうか。
            


 ok pippelがtrialに対応していないので修正する
        特にmurasaki_infoが値を返せない。
        また、pippelコントラ群のtrial版をデプロイしていない。


    pippel UIの実装
        決まった時間にpippelが出現する
        出現時間でも起動直後は出現させず、1-2サイクル後に出現させる
        何かしらの目立つ演出を実装する
        flower mint時に何を入手したか分かりやすく表示する
        ただクリックするのではなく、珍しさを演出したい
            タイマーを表示する？
        クリックで開く、集めたお花を入れておくふくろを実装する


    frameの縦横比を1:1に修正する
    frame_loading絵を別途用意する
    ダンボールの絵を用意する


    UFOの音
    月の猫の音
    ゲームボーイの音
    ルンバの音
    風車の音


    NFT売買に対するゲーム性の付与について考える
        NFTのマーケットは、リタイアプレイヤーの資産整理や、
            効率プレイヤーの課金の場にしかならないだろうか。
        NFTの売買自体に、何かしらのゲーム性や動機づけがあるとよいだろうか。
        fluffyのトレードはその一例か。
        craft itemのトレード自体は余り動機がつかず、リタイア時の売却が主だろうか。
        craft itemに何かしらの差別化ができれば、良いだろうか。
            属性が異なるなど？
            属性によって効率が異なるなど。
            seedから計算できる何かしらの、4～12種程度の属性。


    Braveでチェーンデータが取得できないことへの対策を検討
        turnは進む
        walletを認証すればtxも飛ばせる
        しかしなぜかチェーンデータの取得だけ停止している
        能動的な取得なら可能なのか？
        awaitが遅延しているのか？
        あとから復旧させる方法は？
        開きっぱなしで、wallet再認証のみでプレイを継続できれば、
            かなりUIは改善するのだが。
        現状、walletロックは関係なく、一度ブラウザが非アクティブになれば、
            その後sync countが99のまま更新されなくなってしまう。
        例えばfirefoxではフォーカスを戻せばsyncされるのだが、何が違うのだろうか。
        braveでエラーメッセージを見る方法は？
    

 ok fluffy scoreの表記にpippelを追加する


    デプロイ方法の改善
        murasaki_addressコントラの更新時の動きを確認
        全コントラのmurasaki_addressアドレスを書き換える方法とタイミングを整理する


    HPの更新
        NFTの最低価格に対して"trustless"なシステムを目指す
            dapps stakingとbuyback systemでコントラクトでtrustされている


    walletの整理
        coder_wallet        summoner=1, 普段遣いのwallet
        illustator_wallet   summoner=2, 普段遣いのwallet
        staking_wallet      EVMへのdApps Staking専用wallet
        admin_wallet        全コントラをdeployし管理するowner wallet
        

    投機活動の想定
        破壊的活動、アービトラージ、利益をかすめ取る活動の想定は？
            性悪説に則って考えてみる。
            すべての悪意を想定することはできないので、
                金銭的動機を中心に考える。
        早乗り・早抜け
            mmがSBTであるため、初期の値上がりを期待して購入品を直接売ることはできない
            発行上限が小さく初期参加者しか入手できないNFTが殆どない
            早乗りのメリットは人より長くプレイできることが大きい
        原資回収と恩株化
            mm購入額に対して、初期段階で入手できるNFTの価値がかなり低い
            原資回収には普通のプレイでは１年以上必要と思われる
        マルチアカウント運用
            NFTや資産をアカウント間で移動するコストが高い
            タイミングを図って市場を介してNFTを移動することも難しい
            mmを大量にmintするには購入額が少し高い
            総じて、マルチアカウント運用する旨味がそれほど大きくない
                効率プレイ目的の2-3アカウント運用なら許容範囲かもしれない
                効率プレイすればするほど金銭的には不利になるバランスで。
                効率性と金銭的インセンティブを二律背反させる
        コントラクトからの窃盗
            
        


    TBAについて詰めるII
        Registryのaccount()に情報を入力すれば該当のTBAアドレスが参照できる
        Registryでcreate()することでTBAを対象にnonce()やexecuteCall()が可能になる
        TBAの操作は、account()で入手したアドレスを、AccountのABIで読み込む。
        Accountはcreate()の前にデプロイしてアドレスを入手しておく。
        このAccountのアドレスを用いてRegistryでcreate()することになる。
        create()で生成された、あるいはaccount()で取得できるアドレスは、
            AccountのABIで読み込むことができる。
        Registryのcreate()はいつ行うか。
            TBA内のNFTを動かさなければ行わなくても良いのだが。
            create()の許可はどうするか。
            permitted_addressのみ許可すると、別にfunctionコントラを作成可能
            ある一定の進捗でTBAをmint可能で操作できるようになる、なども可能。


    新mm
        address_Murasaki_Address = '0xDde958185fe000D41132eA084187b91be0e43484'
        address_trial_Murasaki_Address = '0xc8cB8de3631C768b41Bf8ECaA350Ec941Bc8f280'


    dApps Stakingの改善
        staking walletをコントラクト化できる？
            staking2.0に対応して84d毎に自動でセルフステーキングできるか。
        もしくは、EOAでスクリプトにより定期的にEVM側に預ける。


    TBAについて詰める
        TBAはregistryでcreateAccountしないと使えない？
        TBAのアドレス自体はaccountに必要情報を入れればcreate前でも参照できる
        ERC6551AccountでexecuteCallするためにはRegistryでcreateが必要？
        とすると、createはいつのタイミングで行わせるか。
        また、create済みかどうかはどうやって判定するか。
        create自体は何回でもエラーなくtx飛ばせるようだ。


    ERC6551
        ERC6551Registry
            0x1f00990eFfd45A496f7c7ECD7EF29622b225Dda0
        ERC6551Account
            0xEAF42da7683896F5DC625ad09BA0950b33e2FF18
        mmのTBA
            summoner=1
                0x738ADfBA566d3D2Ac511f9E5959e80Bc0a151309
            summoner=2
                0x7721B7871Fd35d076cdA7C25306980b509f3101c
        Registryのaccount情報
            implementation: 0xEAF42da7683896F5DC625ad09BA0950b33e2FF18 //ERC6551Account
            chainId:        4369
            tokenContract:  0x4925561b0a524B98F950F07A40F6DFc70B64CaD5  //mm
            tokenId:        (summoner id)
            salt:           6539


    init更新
        ERC6551の用意
            maを対象にデプロイ
            saltは6539
        maに以下を追加
            address public address_Pippel_NFT;
            address public address_Pippel_Function;
            address public address_Pippel_Codex;
            address public address_Murasaki_TBARegistry;
            address public address_Murasaki_TBAAccount;
        maに制御関数を用意
            一括登録、一括callのつじつま合わせを行う。
            どこで使ってたっけ？
        python iniの更新
            上記5コントラの更新コードの整備
            pn
                pfをpermit
                pcを登録

    コントラクトからEVMステーキングが可能か調べる。
    

    zkEVMコントラクトからwalletのdApps Staking量を参照可能か調べる。


    mcへのbufferTreasuryへの登録をinitで登録したことのテスト。


    Pippel実装
        NFT
            construct
                mint_time
                mint_summoner
                mint_type
                flower_type
                rarity_type
                flower_name
            function
                tokenURI(_tokenId)
            afterTransfer()
                count_of_type更新
                count_of_rarity更新
        Function
            call_luckBoost(_summoner)
            calc_pippelScore(_summoner)
                rarity scoreに係数をかけて算出する
                面倒なので、重複OKとする
                獲得itemに応じたrarity scoreを加減させる
        Codex
        UIUX
            ぴっぺる出現とmint
                何が得られたかわかるように
            所持pippel NFTの一覧ウィンドウ
                取得した順に並べる
            pippel scoreの表示
                ウィンドウ内に表記
            pippel bagクリック時の演出
                花びらが飛び出して一覧ウィンドウが開く、など。
    

    ピッペルNFTの実装
        block.timestampをUTFの日付（1-365）に変換する
        日付ごとの誕生花を取得する
            ランダム？
        接頭語決定
        部位決定
        変数
            mint_time
            mint_summonerId
            mint_summonerName
            mint_type
            flower_type
            rarity_type
                bud, opening, blossoming, blooming, bloomed
            flower_name
                rarity + flowerのstring
            seed
        集計方法
            コントラ側
                wallet内のNFTの総数
                    balanceOfでOK
                wallet内のrarityごとの総数
                    balanceOfRarityを実装
                wallet内のNFTの種類数（1以上のflower_type数）
                    balanceOfTypeを実装
                最終的なpippel score (= +luk)
                    Pippel_Functionにスコアを計算する関数を実装
                    rarityごとの所持数を集計したcount値を参照する
            web側
                wallet内の全NFT情報の一覧
                    id, month, day, flowerName, rarity
                    もしくはuint[367]として取得して、
                        js側で文字列に変換するか。
                    個数とrarityを判別する必要があるため、
                        例えばcommon=1, uncoomon=10などを利用するか
                        例：1 -> common x1
                            11 -> comon x1, uncoomon x1
                            12410 -> uncommon x1, rare x4, epic x2, leg x1
                        これをuint[367]に格納して一度のcallで返す関数を実装する
                        その都度計算するよりは、
                            afterTransfer()内でwalletごとのスコアを随時更新するほうが良いだろうか。
                    必要な表記は
                        例：003 blossoming Tulip
                        id, rarity, flowerTypeの3つがあればひとまずOKか
                        idも表記しないほうが面白いだろうか。
        関数
            tokenURI
                文字だけ情報で良いか
                背景にpippelのsvg絵を透かしで入れる
                前面に、mint日時、mint summoner名、rarity + flowerNameを表示する
                可能であれば、rarityや月に対応して背景pippel絵を変化させる
                    背景色でrarity、pippel絵で月、あるいは季節（春夏秋冬）を表せればよいか
                    背景色は、薄めで
                        common: 白
                        uncommon: 緑
                        rare:   青
                        epic:   紫
                        legend: オレンジ
                    季節は、以下の色が多めのpippel花
                        春：    ピンク、淡い赤
                        夏：    青、濃い黄色
                        秋：    オレンジ、茶
                        冬：    白
        web側UIの実装
            お花バッグの実装
            所持お花一覧ウィンドウの実装
                366
            rarity x seasonの全pippel絵の用意
                背景色5 x 絵4種類 = 20 種類
                アイコンに使用する、文字は入れない
        ユースケース
            バッグの達成度に応じてLukにブーストが掛かる
            平均して1年で+3.00程度のブーストに。
        rarity出現率
            closedばかりでは面白くないので、中間のblossomingを基本とする
            closed:     10% 補正-40%    6
            opening:    20% 補正-20%    8
            blossoming: 40% 基準100%    10
            blooming:   20% 補正+20     12
            bloomed:    10% 補正+40%    14
            期待値: 100
            Lukブースト:    分かりやすく, blooming x1 = 10point = 0.001 luck
                blossoming pippel 1個がfluffy score 1点に相当する。
                rarityを加味するためfluffy scoreより10倍単位に設定する
                    10 pippel point = 1 fluffy score = 0.01 LUK
                全種類blossoming集めると366 pippel point = +3.66 LUK


    ランダム出現キャラの実装
        クリックでtx飛ばしてTBAにお花を得る
        直近5ブロックの判定が1なら実行可能とする
        12sec/blockとすると、7200block/day
        1日に1回出現とすると、7200d1
        過去150block=30min以内に7200d1が1となるblockがあればmint関数の実行可とする
            150blockのチェックが不可だろう。
            せいぜいが30block=6minぐらいだろうか。
            → solidityで過去のblock.timestampなどを取得することはできないようだ
        乱数戦略
            mfsのdnは過去のblock情報を取得できずに使えない
            となると、7200block/dayのうち、例えば特定の100blockを返す乱数を考えるか
            この方法だと解析していつpippelが出現するか逆算できてしまうが、まあ良いか。
            d72で*100することで出現blockを決められる
            d72の引数はsummonerIdのみにする。
                つまり、summoner毎にその日のどこで出現するかが異なる。


    TBA用アイテム構想
        お花
            ピッペル
        その日の誕生花からランダムで取得される
        取得タイミング：
            クラフト完了
            メール開封
            トータルcoin
            トータルleaf
            レベルアップ
            トータル経験値
        NFT情報
            お花の名前（string）
            取得理由（string）
            取得日時
            取得者（summoner）
            seed
            接頭語などの修飾語
                rarityを演出する？
                きれいな、かわいい、良い匂いのする、など？
            部位？
                つぼみ
                お花
                種
        用途
            何からのメカニズムで要求し消費させる？
            トレードや売買の可否は？
            所持NFT全体をスコア化する？
                レア度計算は？
            単純にLUKにプラスにするか


    用置換絵
        クラリネット
        かざぐるま
        日記帳
        クレヨン
        ゲームボーイ
        フラワーリース
        額縁


    限定アイテムの構想
        発行数、もしくは発行期間が制限された限定NFTのmint構想
        コストはcoin/leafにするか、特殊なリソースにするか。
        金銭的価値というよりは、継続プレイの実感を目的としたい。
            プレイ期間の歴史をひと目に感じられるように。
            「これはあの時こうやって手に入れたNFTだー」と実感できるように。
        効果としては、全てLuck+0.1とかにするか。
        もしくは、TBAに入るお花が期間や季節によって異なるようにするか。
            夏の花が多い、秋はレアなお花がもらえた、など。
        

    SNS戦略
        情報発信用のキャラクター（ないないさん？）がtwitterで発信している風で行う
        ディスコースを試す
        

    要修正
        runpaのON/OFFに音をつける
        retrogameの絵を用意する
        retrogameの設置時に音をつける
        strollでastar以外の実装
        strollで麦わら帽子以外がずれるバグの修正


    PoM
        Pocket of Murasaki-san
        むらさきさんの特定のactionに付随して、ランダムにアイテムが格納されるTBA
            PoMをまだクラフトしていなくても該当アドレスに送ってしまう
            ERC20は制御が難しいので、ERC721のみで考える
            得られるERC721には金銭的価値を付与せず、また意識させない
        得られるアイテム案
            （接頭語）＋（素材）＋（アイテム名）＋（補正値）
            例：Western Iron Amulet +1　など　+1はmasterpriceとかでもよいか
            接頭語ごとか、最終的か、アイテムのrarityを設定する
        アイテム案２
            お花
            tierでrarityを分けて、レアなお花などを表現する
            接頭語、補正値などはつけるか？
            １００種類など、とにかく数を多く
            いくつか併せて「花束」をクラフト可能に？
                素材にしたお花の数と種類で花束の性質やレアリティが決まる
        実装
            ERC721でseed値を割り振る
                name()でcodexを参照してお花やレアリティを返す？
                codex化することでreplacableにできるが。
            あるいはmint時にstringとしてERC721に書き込んでしまう


    野良猫の実装
        意味論
            色んな人の家（＝wallet）を渡り歩くERC721トークン
            自分の宝物入れを持っていてそこに色々入れている
            宝物を1つ受け取ると自分の宝物１つをランダムでくれる
            運営のみが新たにmintできる
                アクティブプレイヤー数に応じて総mint数を調節する
        NFT実装
            年齢、交換回数、をカウント
            mmのownerをランダムで抽出して自身をtransferする関数を実装する
            mmを有するwalletにしかtransferされない
            通常の方法でtransferもできるがmm所有walletのみ
                つまりマケプレで売ることもできない
        TBA実装
            現在のownerからNFTを1つ受け取って1つ返す関数を実装する
                この方法で受け取ったNFTを記録させる
                他の方法で送りつけられたNFTと差別化する
            初期値としてfluffyをいくつか入れておく
            TBA内のNFTは通常の方法では取り出せない
                NFT側のexchange()関数でしか触れない
        要対策
            一人の人がずっと野良猫を放さない
                放置されたHoMに行ってしまうとtransferされずに居座ってしまう
                    猫の居場所一覧ページを作る。
                    滞在時間が一定日数以上で誰でもretransfer()関数を叩けるようにする
            ゴミNFTで溢れかえってしまう
                ERC721ならばなんでも宝物として認識されてしまうか
                性善説、つまり価値のあるNFTをくれる人が多いかどうか
                mcのbalanceOfが0になったら消滅させるか
        野良猫トークンのownerはTBA内のfluffyを取り出せる
            TBAは野良猫トークンownerからのtransferしか受け付けない
        雑記
            TBAに渡したいNFTを猫トークンに個別にapproveする
            NFTをTBAにtransferして保持リストに登録、猫トークンに関数を実装
                所持NFTから1つ選択してmsg.senderへtransferする
                自分（猫トークン）をランダムにmmのownerへtransferする
                    safetransferではなくapprove不要でtransferできるか。
            TBAのexecuteCall()は猫トークンからしか受け付けない
                猫トークンのownerからは実行できない
                猫トークン内の関数でのみ実行できる
            admin機能
                猫トークンをadmin walletへ返す（transfer）関数
                admin walletから無条件でTBAのexecuteCallを叩く関数（executeCall_admin()）
                burn機能？
            intervalの設定
                猫トークンが新しい家にtransfer()されてから、しばらくは関数を叩けない
                連続してNFT交換が行われて、一瞬で初期fluffyがなくなることを防ぐため。
            NFT制限
                total supplyが100以上のNFTのみTBAにtransferできる
                即席発行のゴミNFTを防ぐため。
            UI:
                TBA内のNFTの一覧
                    猫トークンに保持されている保持NFTリストを利用する
                接続wallet内のNFTの一覧
                    tofuNFTのapiなどが使えないだろうか
                select -> approve -> exchange!
                attensiionでexchangeすると該当NFTを失うことを明記する


    Strollのテストプレイ
        itemエアドロしてテストプレイを繰り返す。
        絵の置換
        お散歩時間の吟味
            4時間で固定にするか
            出発時に1, 2, 4時間を選択し、長いほうが効率よくするか
            1時間以上経過でいつでも帰宅可能で、4時間経つと寝てしまうとするか。
     ok 片方ではmetとなっているのに、相手ではmetにならないバグの修正
        ms.etherでエラーとなるバグの修正
    

    Practiceのテストプレイ
        itemエアドロとテストプレイ
        楽器絵の実装
        紹介記事の用意


    修正案
        AccountAbstractに対応するためmsg.senderを考察する。
            EOAではなくCAがmsg.senderになる？
            NFTやSBTの所有者がCAになりうるため、msg.senderをCAとみなさなければならない？
            _senderへの書き換えが必要かもしれない。
        rugのインジケーター表示させるとボタンが押せないバグの修正
        夜の演出改善
            UFOや土星などを画面上部に表示させる
            上からゆっくり降りてくる？
        お菓子の家が完成した時の演出の改善
            glitter表示
            メーターの色を変えるなどして100%をわかりやすく
            click to mintなどを表示させる？
        お菓子の家の建設途中の修正
            建設しているジンジャーマン
            10～30%ではもう少しパーツを少なめに
            staking=0の時の演出
        market.jsのbuyback関数で最新のfluffy dollのitemTypeに対応するよう修正する
        アイテム案
            アロマキャンドル
            ルンバ
            あと１つなにか
        Alchemy WAGBIへアプライ
        infoの取得にmurasakiのbatch getterを使って処理を軽減する
        tokenURIをsatietyとhappyによって変化させる
            tokenURI_codexを作製し参照する
        おサボり中はミシンやスコップを残す
        rugg-pullの実装
            ひとまず、右端をクリックでrugをスライドさせる
            接触しているfluffyとむらさきさん, diceがon_clickされる
        bgmの追加
            カノン、むらさきさん
        デモ用キャラの演出を考える
            #1を晒してしまって大丈夫だろうか。ネタバレや楽しみの先取りになるだろうか。
            お腹が減りやすく、経験値が得られにくい、demo用キャラを別途用意するか？
            trial終了直後ぐらいの進行度が良いだろうか。
            パラメータを弄った別コントラとするか？
        フェスティバル前の演出の改善
            お祭り帽子の実装
        変数書き換え対策の実装, さてどうするか
     ok Candleの実装
     ok footerの修正
     ok infoページのiconを吟味・修正する
     ok タイトルロゴの微修正
     ok ローディング画面でロゴの家が徐々に完成してゆくように実装
     ok fluffy festivalのend_votingにcheck_endを組み込むバグ修正。
     ok マーケットのlist price初期値にbuyback priceを記載する
     ok     1.00未満は1.00として最低価格を表示する
     ok コントラクトマップのupgradable -> replacableへ編集
     ok     ついでにstorage_extraなども追加
     ok     合計コントラ数を記載する
     ok upgradeウィンドウの説明編集
     ok 楽器を3種類に減らす
     ok     かわりにキャンドルを追加
     ok     あとアイテム２つ。
     ok     かざぐるまと王冠を交換する
     ok     その他アイテム順の微調整
     ng 散歩から帰ってきたら吹き出しを表示する？
     ok wrong chainのエラーの実装
     ok コントラクトの一括upgradeをmainで行う
     ok     replacableコントラの全入れ替え
     ok     contracts.pyのつじつま合わせ -> init.py実行
     ok 全summoner合算のtotal countの実装
     ok     全d20カウント数
     ok     全mail open数
     ok     全make friend数
     ok     storage_extraに保存して、on-chain dataに表示させる
     ok trial_converterにmssの追加分を修正
     ok     ガス代許容可能かチェック
     ok murasakisanコントラに一括call関数を実装する
     ok stroll中のfeedingをどうするか
     ok     可能にするか
     ok     その場合、ボタンの位置と演出はどうするか。
     ok infoとmurasakisanコントラを最新のmssに対応させる
     ok コントラクトの総入れ替えが可能か施行する
     ng コントラクトモニターの初期化時にdeployから参照させる
     ok コントラクト書き換え環境を整備する
     ok コントラクトモニターを見直す
     ok コントラクト全てにpausableを導入する
     ok     実際にはpauseするfunctionはなくとも、生きか死にかをpauseで判断できるため
     ok mmとmnのburnを実装
     ok マーケットコントラに統計情報を実装する
     ok     総取引量
     ok コストの引き上げ
     ok     mint: 500, transfer fee: 50
     ok お菓子の家の絵更新
     ok     stakingなしの時の土台を用意する
     ok     → グレースケールで


    必要な絵
        猫の立ち絵のアニメーション
            しっぽがピコピコ
        家猫と訪問猫の差別化
            鈴つける？
        むらさきさんびっくり
        ないないさんアニメーション
            移動時にピコピコ動く
        おかしの家
            0%～30%をもう少しパーツ少なく
        exp小物
            松ぼっくり
            もみじ
            どんぐり
            イチョウの葉
            クリ
            くるみ
            きのこ
            かぼちゃ
            ヒイラギの葉
            桜の枝
            野いちご
            いい感じの木の棒
            フウセンカズラ
            セミの抜け殻
            カタツムリのから
            貝殻
            ヤドカリの貝殻
            クローバー
            たけのこ
            梅の枝
            なにかの化石
        額縁
            もっと可愛く
        喜んでいるfluffy
            fluffier目を大きく
            fluffiest目を><に, on_clickで使用
        fortune statue
            目を光らせる
        neon fluffy
            dapps staking量によって豪華さを変える？
            土星や月のネオンなど、Astarの宇宙っぽさをもう少し演出する
        プレゼントボックス
            色違いある程度
        残りのアイテム
            ニュースボード
            クレヨン
            チェロ
            旅の扉
            旅の鍵
            旅行かばん
            フラワーリース
                豪華さが4段階程度
         ok アロマキャンドル
            ルンバ
            あと１つなにか
         ok つみきのスコアメーター
     ok window
            summon用色違い
            upgrade用色違い
            voting用色違い
            convert用色違い


    構想：むらさきさんシリーズの構成案
        HoM: House of Murasaki-san
            生家でむらさきさんを育てる
            安全で、すべての選択にはほぼリスクがなく、リターンは基本的にプラスになる。
        JoM: Journey of Murasaki-san
            むらさきさんと旅に出て外の世界を知る
            HoMより高効率で資源を収集可能となる。
            DoMに必要なダンジョンなどの建造物を探索する。
            HoMでは時間が中心資源だったが、
                JoMではcoin/leafなどの物質資源のウェイトが大きくなる
                つまり、まめにケアしてリターンを得るHoMに比べて、
                JoMは効率を計算する必要が出てくる。
            他の人と出会う。
                他の人との出会いは競争ではなくメリットとなるように。
                かつ、メリットが強すぎると談合するので、一期一会程度のメリットに。
                基本的には「一人旅」にインセンティブを向かせる。
                一方で、知人同士で協力プレイもある程度可能にしたほうが面白いか。
                特定の誰かと狙って出会えるシステムも必要になる。
        DoM: Dungeon of Murasaki-san
            生涯の大仕事としてむらさきさんが何かを成し遂げる物語
            育成とは異なり、ある程度の困難と痛みが伴う。
                育成では極力排除してきたが、選択によって結果がマイナスや後退にもなり得る。
                そのリスクの見返りとして、「達成感」に重きを置く設計にしたい。
            ハクスラ、自動生成、ボスなどのメリハリ、かつ十分な深度、を達成する。
            一方で、例えば1階層の突破に3-5日必要などの進行速度にする。
                仮に、2年間（730日）で100Fに到達するとすると、1階層は7日間。
                実際は帰還や敗北などのtry & errorが必要なので、
                    単純な計算とはならないだろう。
        LoM: Legacy of Murasaki-san
            輪廻転生。子孫へと経験と遺産が継承される。
            名称は要検討。ポジティブな名詞にしたい。
                Legacy（遺産・継承）はあくまで結果であるとすると、
                過程を表す単語としてはTale of Murasaki-sanなども良いか。
                本を書く？
            子孫は親の遺産をすべて引き継ぎ、パラメータもある程度引き継ぎ、
                最初から全シリーズを制限なくアクセス可能となる。
            つまり、最初から旅に出て一発逆転を狙っても良いし、安全な家にこもっても良いし、
                旅先のダンジョンにいきなり潜っても良い。
                また、条件を満たせば好きなタイミングで子孫にバトンタッチも可能。
            「別れ」をポジティブに表現したい
                寿命が来て死んでお墓をつくる、よりは
                例えば至福の地アマンなど、いつでも会える天国より近い天国、
                    のような場所に旅立つUXにしたいところ。
            形見の設定
                特別なアクセサリーを付けたぬいちゃんで良いか。
                expブーストは旅立ったときのスコアを受け継ぐ。
            ゲーム性の設計
                終末への準備に対して、どのようにゲーム性をもたせるか。
                終末準備に2年も必要だと間延びするので、もう少し短いスパンで良いか。
                もしくは、終末の到来はあくまで最終的な結果であり、
                    その過程を2年間「楽しく（重要！）」見守れる設計を考える。
                寂しさよりは、楽しんで進められるストーリー性を考える。


    構想：SNSへの親和性を上げる
        ワンクリックでtwitterへ投稿できるボタンを設置する。
        投稿したくなるような小さな絵を実装する
            canvasを使えば良さそう
            tokenURIでもいいのだが。
            ステータスウィンドウはちょっと情報多すぎるだろうか
        ハッシュタグ案
            #Astar #BCG #HoM #Murasaki-san
        匿名性を担保する
            リテラシーの高い層ほど、nameやidなど、
                walletを特定可能な情報は安易にSNSに載せたくないだろう。
            一方で、SNSへの投稿はゲームの進行を誇示することで自己顕示欲を満たしやすい。
            よって、極めて特定しにくいが、進捗を端的に表す絵を用意して、
                tweetボタンを設置しておく。
            marimoNFTの水換え依頼などはwalletを追えるのではやりにくいだろう。
                リテラシーの低い層か、捨てwalletの利用者か
                捨てwalletからもメインwalletを追えるのでやはり投稿には勇気がいる。
            気軽に投稿可能なアイコンや絵を用意する。
        乗せる情報
            Lv
            Fluffyスコア
            Comfortスコア（丸めた数字）
            NFT数
            happy, satietyに応じたアイコン


    構想：散歩中のミニゲーム
        ちょっとしたもので良いので、気軽に楽しいものを。
            一種のクリックゲームで良いだろうか。
            クリックしてカラスを捕まえるゲームなど？
            猟奇的ではなく、可愛くてほっこりするものが良いか。
        頑張るとどんどん効率が上がってゆく拡大再生産要素があるとより楽しいだろうか
            クリック時の得点が増える？
            特典に応じて何かしらの絵が増える？
        お散歩中に集めるものは何が良いか
            お花はにゅいにゅいさんと競合する
            葉っぱはleafと競合してわかりにくい
            星で良いか。look and feelがちょっと弱いだろうか。
        念のため、暗号化してローカルに保存する
            暗号・復号化関数例：
                パッと見てbase64だとバレにくいよう、頭に任意の1文字を加えて
                    base64化を複数回行っている
                soltText = "murasaki"
                function toX (_input) {
                    for (let i=0; i<soltText.length; i++){
                        _input = soltText[i] + btoa(_input);
                    }
                    return _input;
                }
                function fromX (_input) {
                    for (let i=0; i<soltText.length; i++){
                        _input = atob(_input.substr(1));
                    }
                    return _input;
                }


    構想：長期的な意味論の深慮
        お金に換算できない価値（宗教・称号・勲章など）が
            PJの中心に厚い層で存在するほうが周りが安定する
        DAOの一つの完成形は創設者・リーダーが不在でも存続し続ける状態
            文化、都市、言語、宗教、など。
        消費コンテンツ型だと、中央集権組織がbuildをやめてしまったら金銭的価値が霧散する
        対して、組織が自己完結的に価値を創造・もしくは十分に長期間維持できるなら、
            中央集権チームが不在でも「文化」として存続し続けられる。
        価値が目減りしにくいNFTとはなんであろうか。
            この価値とは、根っこの本質はお金ではない方が良い。
            つまり、根本的価値を創造するスタンスとしては、お金に換算できないベクトルが良い。
            コミュニティの育成と居場所の提供、は非常に良い例だろう。
                ただし、これはマネジメントにカリスマとセンスが必要だろう。
        Buyback Treasuryによっていつでも売れるが持ってるほど価値が上昇するNFTはどうか
            売ってしまえばコミュニティから脱落する
            保持し続ける限りコミュニティに属しつつ将来の価値上昇が保証されている
            また、ステーキングで自らも価値上昇に貢献することもできる。
            価値については、PJへの信頼や人気に依存しない「トラストレスなNFT」とも言える
                システムとして、多かれ少なかれ必ず価値が上昇し、いつでも交換可能なため。
        担保金が確保できるまでインフレさせない
            担保金の拡大力は生産性（PJへの期待度？）に比例する
            

    構想：限定アイテム
        メインのアイテムとは別系統で、mint上限が決まった限定アイテムを考える
            mintを制限するためクラフトではなく瞬時にmint可能とする。
            coin/leafに加えて、チケットなどの特殊な代替リソースを要求する
            クラフティングの代わりに、代替リソースの収集に時間とコストが必要なイメージ
            一度に２－３種類公開し、全ては手に入らないバランスに調整する
        代替リソースは何にするか
            ハート値を復活させるか
            シーズンごとに異なるリソースとするか
            異なる色のハートなど
            使いきれなかったリソースの活用はどうするか
                次シーズン時に1/10量で変換持ち越し、など。
                シーズン終了時にexpに変換、など。
                exp変換効率は高くなく、おまけ程度のバランスで。
        代替リソースの取得条件はどうするか
            作業ではなく、集めるのが楽しい条件にしたい
            このアイテムはあの時苦労して手に入れたやつだ、と自然と愛着が湧くのが理想
            また、大体のプレイヤーが必ず何かしらを手に入れられるよう配慮する。
        アイテムの効果
            強力でなくても良いので、必ず機能性を持たせる
            mining +1%, など。
        アイテムの方向性
            大物家具：クラフトする
            小物自然物：散歩の報酬
            小物人工物でどうだろうか。
            ペンダント、懐中時計、オルゴール、などのアクセサリー系になるだろうか。
        代替アイテム収集のゲーム性
            作業ではなく、集めるのが楽しいゲーム性をどうするか。
            ゲーム性の本質は、選択と報酬、それとランダム性だろうか。
        ID割り振り
            NFTを別コントラにしてしまうとmarketplaceなどで不都合が起こるため、
                既存のIDを割り当てる。
            内部的には254か255の上記twinkleを用いる
            subtypeのidを新しいアイテム毎に割り振る
            subtype:補正値のdictを用意しておき、exp計算時に参照する
            専用のcodexを用意したほうがわかりやすいだろうか。
            

    構想：選択と連続性
        現状ではみなが同じアイテムをクラフトすることになる。
            自分だけのアイテムが少なく、自分だけのお部屋を表現しづらい。
        どの色のfluffyを集めるかという選択はあるが、
            これだけだと自己表現として少し弱い。
        ひとつは、どれを取得するかを選択させる期間限定NFTが相当するだろう。
            全員が入手可能ではないNFTを考案する。
        もしくは汎用NFTにランダムなパラメータを設定し、
            このパラメータの合算値によってお部屋の何かしらのステータスが変化する、など。
            こちらのほうがイメージにマッチしやすいか。
           *各アイテムに割り振られる要素として何が適当だろうか。
                食べ物や楽器など、種類によらず普遍的なパラメータ
                3種類ぐらいの同格で共存しにくいパラメータを考えたい
                    かっこよさ・かわいさ・など
                    1つの要素が高いと他の要素が低くなるイメージのパラメータを考えたい
                そして、その合算値として「お部屋の可愛さ」「お部屋のかっこよさ」を算出する
                お部屋のこれらの要素が高いとなにが変化すると楽しいだろうか。
                    +expだと味気ないだろうか。
        連続性の要素の補強としては、これらの自分で選択した家具によって、
            その後の選択の重みが変化するとベターだが。
            「+DEXの家具をクラフト完了したのでfarming効率がupした」
                だけで報酬体験として十分だろうか。


    UI構想：アイテム位置のonChain保存
        他の人にアイテムレイアウトを見せるため、
        現在のレイアウトをonChainに保存する機構を実装する
        0.1 $ASTRなど少額で良いので手数料を取る
        読み込み時にまずonChainを参照し、その後ローカルの配置を上書きする
        → かなりガス代がかさむ
            uint256でも、json化したstringでも、結構かさむ
            feedingの5倍程度
            feeding時に自動で保存、とはできなさそう
            能動的に高いガス代を払って保存するなら、システムボタンの実装が必要だろう
            付随して、歯車ボタン→システムメニューのUIを作製する必要がある
        文字列-dic変換
            _re = JSON.stringfy(dict)
            JSON.parse(_res)


    exp増加アイテムのUI実装
        木の実を中心とした小物
        お散歩で見つけられそうなもの
        小さなオブジェで移動はD&Dで自由に配置可能にする
        人工物ではないもの
            松ぼっくり
            もみじ
            どんぐり
            イチョウの葉
            クリ
            くるみ
            きのこ
            かぼちゃ
            ヒイラギの葉
            桜の枝
            野いちご
            いい感じの木の棒
            フウセンカズラ
            セミの抜け殻
            カタツムリのから
            貝殻
            ヤドカリの貝殻
            クローバー
            たけのこ
            梅の枝
            なにかの化石
        取得のタイミング
            現状はstaking rewardでのみLv1が出現する
            なにか特別なアクションの報酬としたい
                散歩の報酬
                    何も得られなかったら悲しいのでこれ以外の報酬も考える
                発表会の報酬
                    飾って楽しいトロフィー, シーズンごとに異なる
        合計+exp%の表示方法のUI実装
            どこに表示させるか
            ぬいちゃんboostをどうするか


   *楽器練習UIの改善
       *楽器絵の完成
            ティンパニー, チェロ, ホルンアイテムの実装
     ok 練習中のSEの用意
        練習終了時の演出の実装
            +expを表示させるか
            Lv up時はどうするか
       *各楽器のマスコット化アニメーションの用意
       *練習ボタンの改装
     ok 楽器の種類の決定
            ホルン、ティンパニでよいだろうか
     ok 練習中の演出の追加
            fluffyやpetがよってくる
            みんなで聴く or 音符を出して歌う
     ok 練習中は音符が飛び出す
            専用クラスの用意
            跳ねるときに音がなる？


    ネオンちゃんの段階実装
        ステーキング量に応じてにぎやかにする


//### 2nd


    長所と短所の整理（レポート対策）
        良い点：
            育成ゲームというわかりやすいカテゴリのため、
                理解しやすく直感で気軽に楽しめる
            独自トークンではなくASTRトークンをゲーム内通貨として利用するため、
                $ASTRのユースケースに貢献できる点
            dapps stakingへインセンティブを組み込んだ初めての例であり、
                NFTやtokenを購入するのではなく、stakingだけで作品内のリターンを得られる設計
            Astar上の他のPJのtokenやNFTの所持にインセンティブを与えたり、
                astarトークンの値段を反映したギミックや、
                astarチェーン上のトランザクション数を反映したギミックなど、
                full on-chainの特性を活かし、
                Astar networkとのギミックを可能な限り実装している点。
            dapps stakingで受け取るrewardのほとんど（90%）がプレイヤー資産へと還流するため、
                $ASTRトークンの売り圧が生じにくい点
            プロジェクトの実装と開発がほぼ完了しており、
                また本プロジェクトはserverlessで動作するため、
                今後の開発と継続に追加の資金がほとんど必要ない点
        懸念点：
            フルタイムワーカーではないためアグレッシブなマーケティングが困難な点
            資金調達などは一切行っていないため、フルタイムワーカーを新たに雇うことが困難な点
            開発チーム（2人）に英語のネイティブスピーカーがいないため、
                英語のリアルタイムのコミュニケーションが困難な点
                一方で、文章ベースコミュニケーションは、リアルタイムでなければ問題ない
            solidityコードが膨大なためコードレビューを依頼することが困難であり、
                将来のセキュリティリスクを完全には排除できていない点
                ただし、ユーザーの資金を預かる2つのtreasuryコントラクトは独立しており、
                可能な限り単純なコーディングがされている。
        疑問点：
            ローンチ前にdapps stakingへの審査が可能か、先に実績が必要か
                ローンチ前に採択されると、token currency戦略を確定できるのでとても助かる
            self stakingは認められているか
                本プロジェクトでは、ユーザーから受け取った開始費用の45%を
                セルフステーキングに回すことで、プロジェクトの継続的な価値上昇を狙っている。
                このメカニズムは、dapps stakingの趣旨
                    （各ユーザーの自由意志に基づいたプロジェクトの応援、と理解しているが）
                に反しないか。
                ただし、dapps stakinのrewardは直接devへ行くのではなく、
                そのほとんど（90%）がプロジェクト全体の資産へと再還流する。
                また、本メカニズムのため、dapps stakin rewardの振込先を
                    直接コントラクトとすることは可能か


 ok かざぐるまの物理演算の改善
        txCountを風と見立てて
        それぞれのかざぐるまごとに別々の動的摩擦係数、静的摩擦係数を設定する
        風は時間経過とともに減ってゆく
        ブロックが更新されると新しい風力に書き換えられる

 ok Strollコントラをstorageとfunctionに分割する
        functioni部分はまだまだ粗削りで調整が必要だろう
        Stroll本体とは別に、ロジック部分をCodexとして別コントラを用意する
        → working_statusを別途用意
        → コントラ移植時はaccumulated parametersのみをconvertすることとする
        terminate_workingでworking_status=0とすれば、実質restingしていたと同等の扱いになる。

 ig 散歩システムの実装検討
        ストーリー性の重視230405
            ゲーム理論が成り立つほどガチガチのゲーム性ではなく、
                「知らない人に会えるかな？」というゆるい感じのUXを中心に考えてみる。
            会ったことがあるフラグを用意し、
                初めて合うsummoner: +1%
                これまでに会ったことがあるsummoner: +0.5%
                などとする。
            一度に会える上限は5人まで
            条件は行き先4種類 x お供3種類 = 12区分
            水筒の中身が一緒のときは x1.2倍（新規:+1.2%, 2回目:+0.6%）
            時間は一律で2時間、などとするか。
            実装概要：
                2重mappingでmet/notMet判定を用意する。
                uint[5] li_metSummoner を用意する。
                12区分のli_walkingSummonerバッファを用意する
                    マケプレと同じ機構が使えるだろうか。
                散歩終了時に区分内からランダムで5人選出する。
                自分と相手のli_metSummonerに空きがあるかチェックする。
                両方に空きがあればli_metSummonerに互いを代入してmeet成功。
                相手がすでに5人埋まっているなど空きがなければ失敗。リトライなし。
                metSummoner一人一人の新規/既知と水筒の中身をチェックし補正値を算出する。
                歩行距離に補正値を適応させる。
        ボードゲーム性の深慮230404
            この部分のゲーム性だけ、単純でも良いのでボードゲーム性を持たせることを考える
            ボードゲームのゲームデザイン：第3の柱「選択」
                https://note.com/dbs_curry/n/nb175f0cfbd1a
            「選択」「実行」「運」「政治」の4要素がエッセンス。
            「実行」は散歩システムでは無視する。
            「選択」は散歩に出るときの条件に該当する。ゲーム性の中心。
            「運」はどうするか。ランダム性を少しは導入したい。何が妥当か。
            「政治」は他の人の選択との相互作用。他の人がどのような条件で散歩に出ているか。
            この中で、「選択」と「政治」を中心にボードゲーム性を考えてみる。
            プラスアルファで「運」も少し入れてみたい。
            目的１：より効率よく総散歩距離を増加させる
            目的２：アイテムNFTを入手する
            選択：散歩出発時の条件設定（方向、水筒の中身、お供、時間、など）
            さて、「選択」と「政治＝他のプレイヤーの選択との相互作用」をどうするか。
                最適解の無い/予測しにくいバランスを考える
                考えて「選択」し、その結果をわかりやすく納得しやすい方法で得られるシステム
                他の人の出方を考えてしまう「ジレンマ」システムをうまく組み入れたい
            散歩に出発する時点で他プレイヤーの選択を見れてしまうので、
                選択後のランダム性にゲーム性を付与する方法が良いだろう。
                現在の他プレイヤーの選択を見た上で、どの区分を選択するかについて、
                    効率的な報酬を得るためにはジレンマが発生する設計を考える。
            ジレンマの設計：
                情報：その時点の他プレイヤーの選択
                選択：行き先・持参品・お供・時間
                報酬：その散歩で得られる歩行距離の大きさ
                単純に多くのプレイヤーに会うと報酬が増えるのならば、
                    他プレイヤーと同じ選択をし続けることが支配的選択になってしまう
                他プレイヤーの選択分布を見た上で、どこを選択するかにジレンマを設定する
            秘匿性の欠如について
                スマコンの特性上、たとえprivateに指定したとしても、
                    変数内容を比較的簡単に参照できてしまう。
                そのため、ボードゲームでよくある相手の選択を見れない、という実装ができない。
                よって、「選択」と「運」の2要素を中心に考える。
                相手の選択が見えた上で、自分の選択に最適解が存在しにくい機構を考える。
        検討230320
            要検討：
                帰宅処理
                    散歩終了後にtxを飛ばす必要がある
                    このときの演出はどうするか
                    まだ帰宅していないことにするか
                    帰宅して部屋にいるが、水筒を片付けていない、など。
                    tx飛ばさずに放置している間はworkingとみなすのか。
                        grooming時のexpはどうするか。
                    この状態では他のworkingができないが演出はどうするか。
                        疲れて寝てしまっていることにするか。
                        working中とみなされgroomingのexpはペナルティを受け続ける。
            解禁：
                水筒クラフトで選択可能となる
                その他に扉も必要とするか？
                すぐ帰ってくるのでお弁当はいらないだろう
                最大で2時間程度
                happy, satiety >= 50を要求
                1日1回などインターバルを決める
            水筒クリック時に持っていく飲み物を決める
                飲み物は散歩時間を決定する？
                それとも報酬を決める要素の一つとするか
            要素：
                方向：東西南北、もしくは山・海・川・草原
                水筒：紅茶、コーヒー、緑茶、甘酸っぱいジュース
                お供：astar, ether, bitco, fluffiest
                帽子：麦わら帽子, モルタルボード, ヘルメット
                合計4x4x3x4=256通り
                1000-4000 + 100-400 + 10-40 + 1-4で256通りの数字を出力可能
            報酬：
                +歩行距離
                歩行距離が一定数になったら専用報酬
                    +exp NFTをランダムで取得
                歩行距離と要素の条件がマッチしたら報酬、にするか？
            相互作用：
                同じ時間に散歩に出ているsummonerとランダムで出会う
                要素数字が一致したもの同士で出会う？
                要素数字の差で出会い判定を行う
                    方向：1000台
                    お供：100台
                    帽子：10台
                    水筒：1台
                    100以下で判定true、など
                出会ったsummoner数に応じて歩行距離に+aの補正をかける
                同じsummonerに連続してあっても補正がかからないようにする
                    summoner_historyを5-10ほど保持しておいて
                    重複したら補正をキャンセルする
                最大で3人まで会える
                    1人につき+3%歩行距離が増加する
                    最大で+9%
                uint[5] met_summoners;
                for (i=0; i<5, i++) {
                    if (met_summoners[i] == 0) {
                        met_summoners[i] = _summoner;
                    }
                }
                判定は散歩終了時に行う
                    散歩開始時に該当リストにsummoner idを代入する
                    終了summonerが要素が違いsummonerをチェックする
                    該当summonerを先着順に3名まで算出する
                    自分のmet_summonerに入力する
                    すでに入っているmet_summonerの次に代入していく
                    代入時に相手側のmet_summonerにも代入を試みる
                    この時、met_summoner_historyに存在しないことをチェックする
                    自分と相手、どちらも代入可能ならば代入成功
                    お互いのmet_summonerとmet_summoner_historyに代入処理する
                    met_summonerは3名、met_summoner_historyは10名とする
                
        feedingは基本的な+exp手段だが、
            +aの時間を消費する選択肢のひとつ
        時間というコストの別の消費方法
            resting: +追加exp
            mining/farming: +coin/leaf
            crafting: +item
            practice: +楽器exp
            旅: +歩いた距離
        意味論
            お弁当を持って、お供を連れて外に遊びにゆく
            外出中は全く操作ができず、expも得られない
            お腹が減ったり、happyが少なくなったら帰ってくる
                外出中のhappy減少分はworkingと同様にexpには変換されない
            他のプレイヤーとの相互作用システムを持たせたい
                同じタイミングで外出中のsummonerと相互作用できる
            旅ではなく、「散歩」ぐらいの気軽さで設定するか
                窓かドアなど、何かしらの条件が必要とする
        ゲーム要素
            ゆけ勇者のように、試行錯誤が必要なメカニズムを考えたい
            お花、石、あとなにかが手に入る
                お花はfarming, 石はmining, なにかはcraftingが補正される
            手に入ったアイテムを持ってお散歩に出れば、次のアイテムが手に入る
            変数はprivateにして見えなくする
            計算式のコードはcodexとして別コントラにする
                未公開のルールに従い定数を返すコントラで十分か
                soltの更新をonlyOwnerで可能にしておく
                もしくは、何かしらの行動に応じてsoltが自動で書き換わる、など
        目的・報酬
            この行動でしか手に入らない報酬を深慮する
            お花NFTなど？用途はどうするか
            シーズンを決めて、シーズン限定のお花NFTを発行するか
        意味論II
            ある種のエンドコンテンツのいち付けとする
            後半のアイテムをクラフトすることで解禁される
            working中とみなされgroomingのexpが入らない
            特定の条件を満たすことでNFTをmintできる
            報酬のNFTを取得するためにはtry&errorが必要なシステムにする
                solt値+summonerIDで乱数を発生させ
                この乱数に基づいて解答が変化するシステムはどうか
            つまり、設計者自身にも正解がわからず、
                正解の根拠となる乱数はtry&errorでしか絞り込めないようなシステムを考える
            ex) 東西南北8方向のどこかが正解
                正解の方向に近いほど強い手がかりが得られる
                方角と距離の要素にする、など
                方角は山・川・海など意味のある項目でも良いかも
            方角と、あと１，２このplayerが設定できる要素を考える
                誰と行くか
                あと１つなにか要素
            手がかりは、3つの要素の合算値がreturnされる
                つまり、どの要素が正解だったのかがわかりにくい
            また、returnは一定時間が経っていないとcall()できない
            これには乱数生成コードの秘匿化が必要だろう
                privateにsoltを保存するだけでは読み込めてしまうらしい

 ig migrationメカニズムの実装
        今後のAstar walletのupdateに対応するためmigrationを可能にしておく
        mmには最低限の機構のみを組み込んでおき、permitted functionでコントロールする
        function側で以下をチェック：
            owner_newがtokenOf==0
            msg.sender==ownerOf(_summoner) (=owner_old)
        また、Astar walletの移行などの理由でない限り、migrationにはコストを要求する
            walletの移行にはNFTの移動も必要なため、簡単ではないが。
        → ERC721を使用している限り, 継承先でprivateなmappingに触れないため
           migrationは極めて困難だった。
           仕方がないので、外部functionとして「転生」を必要になったら実装することとする。
           場面としては、ハッキングなどでwalletをどうしても変えたい、などの申し出時
           新しいsummoner idを割り振り、ステータスを引き継ぐ
           summonerのburn, nameのburn, NFTの移動などかなり煩雑になるが。
           ガス代が足りるだろうか。
       → _burn & _mintで行けるっぽい
          internalの_mintはnext_token無視してtransfer可能な模様
       *あとは、NFTのmigrationを実装する
            freeFeeに指定したtransferableなコントラクトを用意し、
            これを経由してoldからnewへ全NFTを移動させるか。
            
    ぬいちゃん貸し出しシステムの実装検討
        ぬいちゃんは他の人が所持した際の効果が大きい
            しかし、売りに出すのは愛着が湧くため、なかなかにハードルが高い
            そのため、売りに出す以外に他のむらさきさんに期間限定で貸与する機構を考える
            ぬいちゃんのお泊り会なイメージ
        構想
            ステータス・期間・料金を提示してlistする
                コストを一括で支払ってrentする
            あるいは、コスト/日と、最大日数を提示してlistする
                rent側はいつでも返却できる
                    使用時（feeding/grooming時）に料金を支払う
                    もしくは返却時に返金される
                最大日数が残っている間はlistに表示される
            rentされていたぬいちゃんには、経過時間に応じて専用のパラメータが積算する
            また、ぬいちゃんの作成コストは、累積クラフト数か、
                その時のスコアに応じて引き上げる

    演奏会の実装
        楽器習熟レベルを発揮する場
            習熟レベルの蓄積にステータス補正をかけるのか、
            演奏会での評価点にステータス補正をかけるのか、どちらが良いだろうか。
        評価方法の計算
            楽器Lv + LUCK + その時の地合的ランダム要素
                地合値は持参した楽器NFTのシード値を参照する、など。
                意味論をつけるため、シード値を変換した楽器NFTの属性を定義するか
                    軽やかさ, 味わい深さ, 深みのある音, 表現力, などなにか
                        音の柔らかさ
                        音の深み
                        音の華やかさ
                    シード値を参照し、lootlikeみたいにNFTごとの固有値とする
                    パラメータの合計値は100と一定とする
                        NFTごとに内訳が異なる
                        レア度が上がるとすべてのパラメータが上昇する
                    固有値によって地合の有利/不利が決まる
                        今回は深みのある音パラメータが最も強い地合の会だった、など。
                楽器Lvにのみ依存する
                    本体Lvは依存しない
                実力7割, 運3割程度の寄与率で調整したい。
            演奏会の計算式にはfluffyを加味させる
                練習にはfluffy=運は絡まない
        参加インセンティブ
            ASTRか、fluffyか、特別のトロフィーNFT/SBTか、どれが良いだろうか
            追加のpractice expも得られる

    演奏会の実装検討
        他プレイヤーとの協力or勝負メカニズム
            1vs1の勝ち抜き戦？
            3vs3のチーム戦？
            参加者全員のforAll？
            参加者全員でスコアを合算し、寄与率？に応じてリターンを計算する、など
        ピアノ, バイオリン, ウクレレ？のうちどれかを選んで出演する
            楽器ごとにSTR, DEX, INTに対応させるか
            該当する楽器を所持してないと出演できない
            該当ステータスに、レベルやその他の補正値を加えて演奏力を算出する
            各アイテムのシードを参照するなど、その時々で有利な条件を変化させる
            かつ、運の要素も何割か入れて結果を不確定にする
        「れんしゅう」という行動の導入を検討する
            workingの別バージョン
            3つの楽器ごとに練習時間に応じてレベルが上がってゆく
            習熟に王道なし。単純にれんしゅう秒のみに依存させる
            時間効率はかなり厳しく設定する。
            簡単にはレベルが上がらないバランスで調整する。
        意味論
            月に1回のお出かけ日
            あまり勝負やガチャ/ギャンブルな印象にはしたくない
                参加費を掛け金とした勝者総取り、は法律的にも好ましくないだろう
                一方で、参加に何かしらのインセンティブは必要だろう
                    ゲーム内資産：fluffyを報酬とするか
                    あるいは、この行動でしか手に入らないトロフィーなど
                        トロフィーはNFTではなくSBTで実装する
    
    寄り道機構の拡充
        プレイヤーの選択肢として、他のsink手段をもっと用意する
        mining/farming以外に行う行動
        メイン資産である「時間」を費やす他の方法
        別のworking状態とも言える
        案：
            散歩（謎解き、報酬NFT）
            楽器練習（エンドコンテンツ、演奏会準備）

    SFLからの教訓
        ・Pay to Winは避ける。課金なしでも根源的に楽しい。
            楽しいので資金を投入してしまう、というのが理想。
        ・ゲームをわざわざ不便にして便利さを販売することは、
            UXを悪化させるので避ける。
        ・先に進んでいるプレイヤーが新しいプレイヤーを助けることに
            インセンティブを与える設計を検討する。

    マーケティングの熟考
        目的：
            本PJの魅力をわかりやすく理解できる機会を提供する
            本PJに興味を持ってくれる人に情報を届ける
        伝えるべき魅力とは：
            Play to Own
        方法：
            Twitter
            Discord

 ig 砂時計アイテムの再実装
        条件
            staking=0でも表示されるが、寂しい感じ
            何かが溜まってゆくor成長してゆくのが楽しい要素
            かつ、1週間～1ヶ月程度の時間が必要そうなもの
            100%になったときになにかhappyな演出が可能
            毎回、たまるものが違うとより楽しいだろうか
        案
            小さな盆栽、最大成長で実を収穫する、なんの実が成るかは毎回違う
            小さな植木鉢、最大成長で花が咲く、何が咲くか毎回違う
            ペットボトルロケット、最大成長で発射、星が降ってくる演出
        絵の深慮
            砂時計で良いか？
        ステーキング量>0でのみ表示させる
        あるいはステーキング量=0では非アクティブを表す絵とする
            ステーキングしてアクティブ化したくなるような楽しい絵にしたい。
        ステーキング量が多いほど豪華になり、
            カウンターが進むと何かが溜まってゆく・成長してゆく絵を考える。

    NFTの希少性の深慮
        NFTの希少性について考える
            BCGのインフレし続けるNFTは価値が希釈され続けていく
            何かしらの希少価値はメカニズムとして組み込みたい
        バイバックシステムにより最小の金額は担保されている
            無限希釈による無価値化は防がれている

 ig 補正の種類の深慮
        Luck
            Fluffyで上昇
        +exp
            ぬいちゃんで加算
            Astarスコアで加算
            お散歩の宝物で加算
                item_typeは一定で、seed値で内容を変化させるか
                もしくは、itemsを512まで拡張させるか
            発表会のトロフィーで加算
        farming/mining/crafting効率
            それぞれのステータス値で上昇
            それぞれのアイテム所持で上昇
        staking
            なにか特別な加算を考えるか
            いろいろなものが出現する専用のプレゼント箱など
            進捗に応じて少しずつ作られるようにするか
                むらさきさん型の貯金箱など？
                おもちゃのカンヅメのような位置づけ

 ig NFT絵の表示の実装
        walletからnftの取得
            PJごとにコントラから取得する
            balanceOfでNFT数を取得し、
            tokenOfOwnerByIndexでNFT IDのリストを取得する
            AstarCats, AstarDegensはこのmethodで取得できそう
        nftからtokenURLの取得
            json取得→image URL取得
        URLからpngを取得してloadする機構の実装
            ipfsからだと遅いか？
            tofuNFTなどから取得したいが、可能だろうか
        ローディング絵の実装
            NFTのダウンロードは時間がかかると思われるので
            Loading..の文字と何かしらの宛絵を用意する
        ローディング中が重いので対策可能なら考える

    バグ・仕様修正
        happyが0になったらcraftingのdcが減らないようにしたい
        festivalのvoteにLvやscoreの重み付けをする
            基本＝100とし、Lvやscoreで+aする
            結構なコード修正が必要
     ok festival中にvote前に残り時間を表示させる
     ok fluffy, tokenBallの壁跳ね返り位置の修正, diceと同じ挙動に
     ok fluffy houseのサウンド設定, inとout時
     ng coin/material per dayの正確な計算
            拡大再生産を実感できるように
        投票がhappy<10でできなくしてmsgを表示する
        crafting中に音符を表示させる
        crafting絵の修正、少しずれている
     ok crafting pause中にminingすると表示が変になるバグ
     ok fluffyが空を飛ぶバグ
     ok tabletをoffにするとresume, cancelボタンが表示されるバグ
     ok catが2匹になるバグ
     ok feeding/grooming時はアニメーションが終わってからworkingを開始させる
     ok fluffyの移動ラインとon_click時のラインが異なるので修正する
     ok 位置保存時、他人のsummonerと混線するバグ
            他人のsummoner時は位置保存させない
            初期位置の吟味
     ok fluffierのまばたきが全員同期しているのでずらす
            アニメーション開始時間をずらすのだが、さてどうするか。
     ok 訪問時のUI修正
            他のsummonerを表示した時にfeedingボタンしか表示させないように修正する
     ok working textがiPad OFFで表示されることの修正
     ok crafting windowのflower 位置、nyuinyuiのy軸、説明文位置の修正
     ok crafting windowの情報説明msgを表示する
     ok mining, farmingがhappy<10, satiety<10でできないことを表示する
     ok crafting window開いている時にitem更新されるとバグる点の修正
     ok crafting中にリロードするとアイテム名が表示されないバグの修正
            summoner modeを先にcraftingに設定しているのでsetTextが読み込まれていない
            構造修正が多少必要
    
    Travel of Murasaki-Sanの構想案
        旅の目的は？
            宝物SBTもしくはNFTの取得
            どこに行ったかのスタンプのようなものなので、SBTのほうが良いだろうか
        旅報酬を受け取る条件は？
            特定の座標？
            移動距離に応じて確率が上がるランダム取得？
        旅報酬のユースケースは？
            移動効率アップ

    privacy policyの整備
        alchemyのpp：
            https://www.alchemy.com/policies/privacy-policy

    Web3文化の改善
        せっかくブロックチェーン上で作るので、web3の哲学を組み込みたい
            現在はいささか中央集権的、Web2的な作品になってしまっている
        NFTの所持はユーザー
            ゲーム世界でのみしか使えない、というイメージをできるだけ小さくする
        他作品での使用の許可とハードルを下げる
            コントラクトと使い方のマニュアル化と公開
        Walletとのリンクを強く
            token, nftの情報を反映
        経済圏の構築
            marketplaceに消費税を導入してインフレ率でコントロールする
        金融資産
            この作品において、価値のあるNFTとはなんであろうか
            summoner自体はSBTなので直接の価値は付与しにくい
                mint上限の決まっている限定NFT
                作成に労力のかかるNFT：ぬいちゃん

    給食botの実装
        1日1 $ASTRなどの手数料を支払ってfeedingを一括で行うbot
            onlyOwnerでオフチェーンから11時間ごとなどに叩く。
            掛け金と期日を管理するコントラを実装する。
            また、掛け金はonlyOwnerで回収できるようにする。
        コントラからガス代を支払う方法を調べる。
            rarityが参考になるだろう。
        Web上にUIを実装する
            Marketページにでも追加してみるか
            掛け金と、残り日数を表示する
            キャンセルも可能とする
            キャンセルすると、残り日数に応じたASTRが返金される

    Offeringオーダーの実装
        予めほしいアイテムに値段を決めてofferingを出しておき、
            それ以下の値段でlistされたときは即座に売買を成立させる
        UIの改善、bot対策、マーケットを利用したtransferの抑制に有用だろう

    アイテムNFTのユニーク性の深慮
        画一的ではなく、作ったitemに何かしらの記号をもたせたい
            もちろん、crafterは刻まれているのだが。
        seedを使ったlootlike変換器でも良いだろうか。
            プレイには直接影響しない接頭語など。
            無価値な言葉遊びだが、だからこそ作り込みたい。
        しかし、表示させるタイミングがない。

    複アカ対策の意味論と深慮
        インフレを低く抑え、時間をリソースの中心に据えているため、
            複アカによる時間リソースの倍増は単純に有利になる。
        植民地キャラを使い潰してメインキャラの効率を上げるプレイは、
            誰でも思いつくし、なんとかしてやりたい気持ちもよく分かる。
        費用対効果がプラスならば、100キャラ並行などのbottingも可能となる。
            これは基準を決めて手動でpetrifyし続けることとする。
        規制を強くすると隔絶された個人プレイとなってしまい、相互作用が阻害される。
            規制をあまり設けないと、複アカの有効性が高くなる。
        Web2のgameは規制でプレイヤーを保護することが一般的だった
            一方で、Web3のgameは規制は少なくし、
            プロトコルレベルでプレイヤーの活動が自由であることが望ましいだろう。
            本プロジェクトでもmurasaki_infoは公開するのであるし。
            これで、キャラ間のNFT移動は一切できません、では面白みがないだろう。
        複アカ無規制の場合は：
            原資回収が硬ければ大量アカウントを運用するbotが出現する
                coin/leafは格安で市場から買うのが効率的になる
            2～3アカウントを手動で運用した効率プレイが有利になる
                メインキャラはcrafting専門か、ひたすらrestingが最適解となる
        効率化を突き詰める行動が、プロジェクトへ貢献したり、
            あるいはプロジェクトへの資金流入をもたらすような設計にすれば、
            複アカ, 効率botへの耐性の代わりとなるだろうか。
        効率化の目標：
            より短時間で多くのアイテムを得て売る
            fluffy育成の段階をより早くすすめる

   *Bot対策の深慮
        多キャラプレイをどのように許可・制限するか
            3キャラでminer, farmer, crafterの分業
            coin, leafを1つのsummonerに送り続ける、など。
            transfer feeを設けることである程度抑制できそう
            3キャラを独立して育てる分には問題ない
            earnできるようになった場合は3倍だが、
                プレイヤーが3人なのか1人なのか判別できない
        ひたすらmining/farmingしてcoin/leafを売り続けるプレイを良しとするかどうするか
            いずれ適正価格に落ち着くだろうか
            coin/leafを売れる機構を残す限り、こういうプレイヤーは必ず出現する
            無料でminingできるので必ず出現するだろうか
            mint価格に対してcoin/leafの値段が下がり過ぎたら抑制される
            しかし、ここまで下がると市場で格安でcoin/leafを買う→craftingが効率的となりそう。
                おそらく0.1 $ASTRとかになってしまうだろう。
            buyback priceから算出する適正価格は0.03 $ASTR / 1000 coin/leaf
            一種のNPCとして許容するか
                稼げなくなったり、mint価格に比べてearnが低くなりすぎたら消えるだろう
        transferにfeeを設けるかどうか
            transfer自体には難しいので、activateの有無を実装するか
            marketやcraftなどで得たものは即座にactivateされる
            transferで受け取ったものはactivateが必要で、その際にコストを要求する
            UIの整備が大変。
            補正計算時のアイテム数カウントが大変
                別にcount_of_type_activatedが必要になるか
        避けねばならないこと
            のんびり遊んでくれている人のUXの阻害
                低すぎるNFT価格
                coin/leafの暴落
                    → プラスに働くこともあるか？
                mining/farmingする意義の消失
                    暴落したmaterialを格安で買ってcraftingのみを行う方が効率が良い
        mining/farmingを自力で行うことのインセンティブをもう少し付与する
        総じて複アカプレイに対する耐性が低すぎるだろうか
            fluffyも2～3キャラで都合つければ効率が良い
            farming/miningも2-3キャラで分散すれば有利となる
            この複アカプレイをどこまで許可するか、どの様に制限するか。
            やりすぎるとまともなユーザー間の相互作用まで阻害される。
            放置するとbotの温床となる。

   *必要な絵
        猫の立ち絵のアニメーション
            しっぽがピコピコ
        家猫と訪問猫の差別化
            鈴つける？
        びっくりしているむらさきさん
            鳩時計、カーテン、NFT額縁更新、流れ星時などで表示
        額縁
            もっと可愛く
        ふるっふぃー修正
            fluffier目を大きく
            fluffiest目を><に, on_clickで使用
        金魚鉢
            サイズ違い
            アニメーション
        fortune statue
            目を光らせる
        neon fluffy
            dapps staking量によって豪華さを変える？
        スコア演出の深慮
            つみき？
            ふるっふぃー風カウンター？
        window
            summon用色違いwindow
            upgrade用色違いwindow
            voting用色違いwindow
        プレゼントボックス
            色違いある程度

    Fluffy関数のリファクタリング
        条件分岐が複雑になりすぎている
        特に移動とアニメーション周りの可読性が悪い
        改善する

    ニュースボードの修正
        ウェルカムボードへ変更する
    
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

    ウォレットの用意と整理
        いくつ必要か
        EVMとSubstrateと2種類必要か
        summoner ownerとdeveloperは別か

    情報表示の洗練
        文字情報は極力控える
        アイコンや絵などでわかりやすく表示する

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
    
    ぬいちゃん絵のバリエーション
        元になったfluffiestの組み合わせによってリボンの色を変えるか
        元fluffiestの情報の書き込みが必要

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


//### 3rd

 ok EVM経由のdapps stakingに対応する
        https://astar.subscan.io/address/0x0000000000000000000000000000000000005001?tab=contract
        これの
        read_staked_amount_on_contract
        に、
            contract_id = コントラのEVMアドレス
            staker = ユーザーのEVMアドレス
        で、対象コントラへのステーク量を参照できる
        また、EVMからステーキング可能となったため、
            self staking vaultから自動でセルフステーキングも可能となると思われる
            コントラクトからステーキング可能か試す
        ローカルで0x0000000000000000000000000000000000005001が有効になる条件を試す
            コードが見当たらない
            astar collatorプログラムを更新すればよいのか？
        → stakingReword関数を修正し、EVM+WASMの合計値をreturnするよう修正した
           5001にbyte変換したownerアドレスを渡せばおそらくOKだと思われる。
           230911, 動作確認OK。EVMステーキング量の反映はshibuyaデプロイ後にでも。
        EVM stakeについてHPに追記する。

 ok スマホ画面での最適化
        少なくともiphoneSE2である程度快適に見えるようにHPを修正する
        JQueryテーブルのレスポンシブ設定
            https://beginners-hp.com/create_smartphone_table.html

 ok runpappaの実装
        クリックで移動ON/OFF
        アイテムを上にD&Dで乗せられる
        fluffyと接触するとkickする
        クリックしなくてもたまに移動OFF（寝る）になる

 ok item_retrogameの実装
        クリックでレトロゲーム系のキャラクターが飛び出すギミックを実装する
            angband, @, J, P, g, DDD, j
            cataclysm, @, ZZZ（みどり：ゾンビ、ピンク：boomer, &：ピンク, Mi-go
            df, ☻, c, d, ドワーフが兵士に追いかけられているなど。Nに~:ネクロマンサー
                tileをsheetとして読み込んでしまったら楽だと思われる
            nethack, @, "
        必要アスキー
            D: 赤、白、灰色、水色、ピンク、黄色、緑、
            j
            J
            Z: 緑、ピンク、
            &: ピンク
            N~: 緑

 ok infoページの充実化
     ok 売買回数、平均購入価格などを集計したマーケット情報ページを作成する？
            総取引回数、総取引額、アイテムごとの取引回数・平均価格
            info内にボタンで実装するか
     ok コントラアップグレードしてtotal mail sentなどの表示を実装する
     ig twitter投稿ボタンを設置する？
            nameとstaking amountを非表示にするラジオボタンを実装する
     ok 改善点
         ok ageを表示する
         ok ボタン押したあとのloading...を実装する
         ok     ボタンは何回も押せないように一度押したらdisableにする
         ok web3Init前にボタン押したときのエラー対策を実装する
         ok 他のパラメータの検討
                total_feeding
                total_grooming
                neglect_count
                total critical
     ok むらさきさんのパラメータ詳細をinfoに追加する
            取得可能なパラメータをすべて表示する
            所有するNFTをアイコンでばらばらと表示する

 ok /test/から以下をmainへ移動すること
        info.html
        info.js

 ok on-chainに保存するステータスの追加
     ok summonerごと
            total_feeding
            total_grooming
            total_neglect_count
                happy <= 0でgroomingした回数
            total critical count
                feeding, grooming, craftingでcriticalを出した回数
     ok global
            total_feeding_count
            total_grooming_count
            total_coin_mined
            total_coin_spent
            total_leaf_farmed
            total_leaf_spent
            total_item_crafted
            total_fluffy_discovered
            total_mail_sent
            total_mail_opened
            total_dice_rolled
            total_dice_critical
            total_dice_fumble
            total_stroll_distance
            total_stroll_friend
            total_practiceTime_Clarinet
            total_practiceTime_Piano
            total_practiceTime_Violin
            
 ok 散歩システムを詰める
     ok 草原の実装
     ok 山海草原の実装
     ok     絵の置換
     ok     川の廃止
     ok htmlの記事を完成させる
     ok 帰宅の演出を完成させる
     ok     met summonerを表示させる
            報告しているふうの吹き出しを実装する
     ok stroll開始のUIを深慮し実装する
     ok     ボタンにするか、D&Dにするか。
     ok コントラから経過時間、終了までの時間、現在の歩行距離、の取得を実装する
     ok strolling windowに情報を表示させる
     ok waterbottleアイテムを実装する
     ok strolling windowに現在までのmet summonerを表示させる
     ok     人数にするか、名前にするか
     ok     → stroll中は人数のみにする
     ok Strollテスト
     ok     flag_sync=0; local_farming_status = 0; local_crafting_status = 0
     ok     local_strolling_status=1; local_crafting_status=0; local_direction=1; local_companion=1
     ok     local_stroll_endable = 1;
     ok     local_strolling_status=0


ウォレットに住み着いてそこで生活しているバーチャルペットトークン

ウォレットはweb3の世界で個人を表す重要な識別子である。このウォレットを「家」と見なして、この家に住み着いてそこで生活しているペットトークンを所有することで、web3における活動がより楽しいものになるのではないかと我々は考えた。

「ウォレットに住み着く」ということを表現するため、むらさきさんトークンはSBT（untransfable ERC-721）で実装した。むらさきさんトークンには、mint時に、生まれた場所や性格、家の住所などが決定されるが、これらのパラメータはDom HofmannのLootの様にウォレットのアドレスに応じて決定される。これらの組み合わせパターンは約9,000通り存在し、ウォレットごとに異なる性質のむらさきさんトークンが住み着くわけである（これらのパラメータはゲームプレイへは今のところ直接の影響はないが）。

「ウォレット内で生活している」ということを表現するため、むらさきさんの「満腹度」と「幸福度」は、時間経過とともに徐々に減少し、ウォレットのオーナーがお世話することで回復する。むらさきさんトークンはウォレットオーナーの継続的なお世話によって徐々に成長し、レベルやstrengthなどのステータスが増加してゆく。これらの処理は完全にon-chainでserverlessで処理されunstoppableであり、トークンのステータス値はブロックチェーン上にのみ保存される。

家具やインテリアはNFTとして提供され、ウォレット内に所有することでむらさきさんの家に設置される。ウォレットのnonce値に応じて針が進む時計や、walletの年齢に応じて成長する金魚鉢の中の金魚、ウォレット内に所持している種類のトークンが飛び出すchest、ウォレット内に所持しているアート系NFTをランダムで表示する額縁など、ウォレットの状態を反映したアイテムがいくつか実装されている。使い込まれたウォレットほど、にぎやかな家とみなされるだろう。

以上の様に、本プロジェクトの目的は、「ウォレットという「家」に一意に紐付けられ、時間経過と継続的なお世話によって成長するペットトークンを提供する」ことである。これは私達自身が所有してみたかったものそのものであり、それが開発の最大の動機と目的である。


 ok BCGとして最も重きを置いているアピールポイントを明記する
        より明確に、より丁寧に、より伝わりやすく明記する。
        一言でいうと：
            「人工生命」を表現したい
        「電子生命」「人工生命」に興味があった。
        ブロックチェーンの特性を利用
            持続性、改竄耐性
            人工生命を表現する上で、簡単にメモリ上のパラメタを書き換えられてしまうと良くない
            また、単一のサーバー上に保存されて、そのサーバー上でしか生きられないのも違う
            決して書き換えられず、かつ今後も半永久的に持続するブロックチェーンは、
                私達が実現したい人工生命の特性に有用であると思った。
        価値が劣化しないトークン
            buyback treasuryによって常に裏付け資産があるtoken
            人気の減少によって実質的に「死」んでしまうのは悲しいため
            年齢の増加とともに、確実に価値が上昇するよう。
        プロジェクトの目的と哲学
            「人工生命」を表現する
        「生命」のどの部分を表現したいのか
            寿命と死：
                生みの親である友人のたっての願いで、むらさきさんには寿命は設定していない
                しかし、一定時間お世話されなかったトークンは石化してしまう
            自己増殖：
                増殖や世代などは考えていない。
            成長と変化：
            生きて住んでいる、生活している、を表現したい。
                お世話した時間に応じて、確実に成長するトークン
                課金によるブーストでは成長速度は変化せず、お世話した時間に応じて成長する。
    
        
What we want to achieve in a blockchain game.

ウォレットに住み着いてそこで生活しているバーチャルペットトークン

ウォレットはweb3の世界で個人を表す重要な識別子である。このウォレットを「家」と見なして、この家に住み着いてそこで生活しているペットトークンを所有することで、web3における活動がより楽しいものになるのではないかと我々は考えた。
        
「ウォレットに住み着く」ということを表現するため、むらさきさんトークンはSBT（untransfable ERC-721）で実装した。むらさきさんトークンには、mint時に、生まれた場所や性格、家の住所などが決定されるが（これらのパラメータはゲームプレイへは今のところ直接の影響はないが）、これらのパラメータはDom HofmannのLootの様にウォレットのアドレスに応じて決定される。
        
「ウォレット内で生活している」ということを表現するため、むらさきさんの「満腹度」と「幸福度」は、時間経過とともに徐々に減少し、ウォレットのオーナーがお世話することで回復させることができる。むらさきさんトークンはウォレットオーナーの継続的なお世話によって徐々に成長し、レベルやstrengthなどのパラメーターが増加してゆく。これらの処理は完全にon-chainでserverlessで処理され、トークンの状態値はブロックチェーン上にのみ保存される。
        
家具やインテリアはNFTとして提供され、ウォレット内に所有することでむらさきさんの家に設置される。ウォレットのnonce値に応じて針が進む時計や、walletの年齢に応じて成長する金魚鉢の中の金魚、ウォレット内に所持している種類のトークンが飛び出すchest、ウォレット内に所持しているアート系NFTをランダムで表示する額縁など、ウォレットの状態を反映したUXを思いつく限り実装してみた。使い込まれたウォレットほど、にぎやかな家になるだろう。

また、本プロジェクトの情報を統括したERC-721互換のコントラクトを用意した。このコントラクトにより、むらさきさんトークンは多数のパラメータを持つERC-721規格のトークンとして振る舞う。このコントラクトを利用することで、他のPJ（これは我々の次回作も含まれる）がむらさきさんのステータスやパラメータを容易に参照可能となった。
        
以上の様に、本プロジェクトの目的は、「ウォレットという「家」に一意に紐付けられ、時間経過と継続的なお世話によって成長するペットトークンを提供する」ことである。これは私達自身が欲しかったものであり、それが開発の最大の動機と目的である。

 ok コントラクトのupgrade手順を整備する
        upgradableをreplacableに修正
        手動でaddressをセットするのか、スクリプトでinitializeするのか、
            今後のためにupgradeスキームを確立しておく。
        ABIの取得と更新が結構面倒か
            コピペが可能な形式でabiを取得可能なスクリプトを用意しておく。
        手順：
            新しいコントラをデプロイ
            share.jsのabiを部分修正
            新しいコントラにmaをセット
            mc, ms, mp, mss, msn, mseの必要なものへ新しいコントラのpermissionを追加
                この時点で新しいコントラが動作可能になる
            maのコントラを新しいコントラのアドレスへ書き換える
            古いコントラのpauseフラグを立てて非活性化する
        つまり、ソースファイルとコントラ名から、
            コントラデプロイと、アドレスとABIの取得を行い、
            mc, ms, mp, mss, msn, mseを指定してpermissionを書き込むスクリプトがあれば良い。
                ["Stroll", ["ms", "mse"]]   など。
            その後、古いアドレスと新しいアドレスを引数に、ma書き換えを行う。
                ["Stroll", {old_address}, {new_address}]
                    ma.Strollがold_addressであることをチェック
                    ma.Strollをnew_addressへ書き換え
                    old_addressのpauseをtrueへ書き込み
        実装：
            デプロイヤー:
                デプロイするコントラクト名を指定する
                ソースコードを読み込んでコントラクトをチェーン上へデプロイする
                コントラクトのアドレスとabiを書き出す
            イニシャライザー：
                イニシャライズするコントラクト名を指定する
                コントラクトのアドレスとabiを別ファイルから読み込む
                コントラクト単位でトランザクション予約リストにappendする
                トランザクション予約リストの重複を削除する
                トランザクションを順に飛ばす

 ng プレイヤーの「消費」行動を考える
        楽しくて思わず「消費」してしまうメカニズムを組み入れたい。
        「手数料」は望ましくない。
            継続のための固定支出費、などはストレスだろう
        「消費」すると、ワクワクするようなリターンが必ず得られ、
            かつ少しばかりのランダム性（今回は何が起こるか楽しみ）要素がある行動
        → coin/leafの消費がこれに該当するだろう。
            
 ok お菓子の家の実装
     ok Solidity:
            counterを返す関数
            counter=0でmintする関数
                NFTをランダムで送る
            counterはfeeding時に減少する
                0以下には減少しない
       *実装案：
            staking=0では土台だけ表示
            staking>0で、量に応じたクッキー人形と進捗を表示
            100%で、バンザイしているクッキー人形と完成した家を表示
            クリックで家が消費されてNFTをランダムに取得する
            完成した家を消費しないと次の進捗％は貯まり始めない
        演出の深慮
            お菓子の家が少しずつ完成してゆく
                not stakingでは土台だけ
                stakingすると作り始める
                staking量と、進捗％を表示させる
                staking量に応じて小人さんの人数が変わるとなお良いか
            完成後はどうするか
                別のお菓子の家がすぐ作られ始めるのか
                    つまり、完成品2つは成り立つのか、または売れるのか
                それとも、完成品を開けないと次の％がたまらないのか
                NFTとして発行するのか、NFTを取得するコントラとして実装するのか
        専用アニメーションの用意
            棒の飴をふりふりしているクッキー人形
            完成後は人形たちがバンザイしている
        専用コントラクトの用意
            presentboxと似ているが、取得できるアイテムと確率が異なる
        中身案：
            fluffy
            fluffier
            貯金箱
            がま口お財布
            散歩の宝物
            発表会のトロフィー

 ok コントラクトの修正
        add-onコントラクトのtotal系スコアなど、代替が効かないデータは
            一元的に拡張可能なstorageコントラに格納することとする。
        storageコントラはmapping mappingで重ねて将来的に拡張可能とする。
            こうすることで、貯めたスコアを消滅させずにlogicをupgradeできる
        対象：
            #101-
                dice, critical_count
                dice, fumble_count
            #201-
                mail, total_sent
                mail, total_opened
            #301-
                stroll, total_strolledDistance
                stroll, total_strolledDistance_ofCompanion1,2,3
                stroll, stroll_level
                stroll, met_level
            #401-
                ff, voteCount
    
 ok 構想：散歩システムII
     ok バランス調整：
            報酬期間: 3d, 7d, 14d, 28d, 
            補正値: 最大で+50% (新規meetで+10% x 5)
            ハズレ補正値: 稀に+100%などのクリティカル（期待値110%程度）
     ok ToDo:
         ok 散歩時間の調整
         ok 散歩インターバルの調整
         ok total_metに応じたmintの実装
         ok petごとの歩行距離の実装
         ok 報酬がNFTだけではインセンティブが弱く調和が薄い、要検討
         ok     mining, farming, expそれぞれでboostを分ける
         ok twinkleSparkleGlitterへlevelcapの導入
         ok もう少し報酬の補正を強くする
                ベストマッチの条件を引いても精々+3%程度のboostだと頑張りがいがない
                未補正値を少なめに設定して、+50%など報酬を多めにする。
         ok 誰にも合わなかったときに、一定確率でfluffyをmintできるように
         ok     gas代が変わるから難しいだろうか
         ok     → 強めの補正をかけることにする
        UX：
            好きな行き先に、好きなお供と好きな飲物を持って散歩しに出かける。
            散歩先で新しいsummonerに出会うと楽しくて散歩距離がちょっと伸びる。
            会ったsummonerと飲み物が一緒だと嬉しくて散歩距離がさらにちょっと伸びる。
            総散歩距離が一定値に達するとtwinkle NFTが入手できる。
            新しいsummonerに会った回数が一定値に達してもtwinkle NFTが入手できる。
        意味論：
            時間資源の若干のsink
            選択と報酬に重点を置いたゲーム性の提供
            他のプレイヤーの動向が気になる相互作用要素を提供
            手に入る報酬がランダムであるガチャ要素の提供
     ok 実装：
            独立した専用コントラを用意
                StorageとFunctionの2つ用意したほうが良いだろうか。
            mapping で start_time を記録
            mapping で end_time を記録
            mapping で total_stroll_distance を記録
            mapping mapping で 各summoner-summoner 間の meet 時間を記録
            mapping uint[5] で 現在の metSummoner を記録
            start_stroll関数
                end_timeチェック
                (_summoner, _direction, _companion, _drink)
                li_dist_and_companionに_summonerを加える
                start_timeにnowを代入
            end_stroll関数
                start_timeチェック
                該当するli_dist_and_companionからランダムでsummonerを選出
                自分のli_metSummonerと相手のli_metSummonerをチェック
                両方とも代入可能ならmet成功
                自分と相手のli_metSummonerに互いを代入
                歩行距離を算出
                補正値を算出して歩行距離を補正
                総歩行距離に今回の歩行距離を足して保存
                総歩行距離をチェックし条件を満たせばtwinkle NFTをmintする
                li_metSummonerをクリア
                grooming time更新
            _calc_boost関数
                (_summoner)
                li_metSummonerを順にチェック
                summoner-summoner 間の meet 時間をチェック
                一定期間以上（7日？30日？）空いていたら補正値+1.00
                    それ以下なら補正値+0.50
                _drinkが一致すれば補正値x1.2（+1.20か+0.60）
                互いの総歩行距離の乖離度によって+補正値
                    乖離しているほど有利
            _try_mintNFT関数
                総歩行距離をチェック
                条件を満たせばNFTをmint
                mcにpermittedしておく
            _mint_twinkle
                mcでtwinkle level 1をcraftする
                crafterは自分とする
        問題点：
            ただの脇道ミニゲームと化してしまっている
            本来は時間資源を別に費やすためのsinkのハズだったのだが。
                かといって散歩時間を6-8時間とするのもfeelingと乖離するだろう。
                時間資源のsinkであるならば、拘束時間を長くするしか無いのだが。
                長めの4時間でも4/24=17%程度のsinkにしかならない。
                時間資源のsinkならば8時間は拘束する設計にしなければならないだろう。
                2時間の散歩を1日3回まで可能とするか（maxで6時間=25%のsink）。
            イマイチ目的が分かりにくく、一日一回の作業と化しやすいだろうか。
                他の行動と選択のジレンマが発生せず、
                また報酬もほぼ予測可能で驚きが薄く、
                かつ実行しないより実行したほうが有利なため、作業化してしまいがち。
                UXとして満足たりうるだろうか。
            「運」要素をもう少し強めに、ギャンブル性、結果の不確実性、
                もしくは能動的な選択と納得しうる報酬、
                の部分にもう少し強めのゲーム性を考えてみる。
            総met数、drink一致回数をNFTの条件にする、など。
                総散歩距離, 総drink一致回数, 総metSummoner数, 
                それぞれで一定数に達したときにNFTを発見、などとするか。
                基本は総歩行距離だが、それ以外のベクトル軸でも報酬が発生する。
                できるだけ談合しにくように設計したい。
         ok 買い占め対策
                twinkleによるexp boostはlevel capか総歩行距離capを設ける

 ok 散歩システムUI実装：
     ig 水筒を持って、お供を連れてお散歩に向かうむらさきさん絵
            音符やハートを出しながら楽しそうに出発する
            水筒を持って、喜びながらcompanionが来るのを待つ
                一緒に連れ立って画面外に移動する
                この時ハートや音符を出しながら移動する
     ok 散歩条件を選択するウィンドウ
            行き先、お供、水筒の中身を選択する
            総歩行距離、総met数、現在のお散歩分布などを表示する
            帰宅予定時間、インターバル残り時間、なども表示する？
                → インターバル残り時間は水筒に表示
                → 帰宅までの残り時間は散歩中ウィンドウに表示
        散歩中のむらさきさんを眺める横長のウィンドウ
            背景4パターン（山道、河川敷、海岸、草原）
                ループ背景を用意する
            お供を一緒に歩かせる
            残り時間を数字と進行バーで表示させる
            誰に会ったかのログを表示させる
            何を拾ったかのNFTも表示させる（可能か？）
        帰宅時の演出を考える
            時間がすぎると、まだ帰ってないのか、もう帰ってるのか。
            txを飛ばさなければならない事の必然性をうまく表現したい。
                散歩から帰宅後は、ユーザーからの何かしらのアクションが必要な演出を考える
                寝てる→お風呂はいる
                水筒洗う、など
            散歩を思い出しながら寝ている
                → クリックしてtx飛ばすと、吹き出しを出して散歩内容を飼い主に報告して
                　 総歩行距離と友達人数が更新される。

    修正案
     ok strollコントラより情報抜き出し
     ok     終了時間、現在の歩行距離を取得する
     ok feedingやgroomingを短い間隔で連打すると効率が上がるバグの修正
     ok     98%以上では+0とするなど対策が必要だろうか。
     ok     mining/farmingは大丈夫だろうか。
     ng depthをspriteのy下段に設定する？
     ng     マウスドラッグ時は前面に設定する？
     ok connectボタンの設置
     ok diceコントラに20を出した回数を記録させる
     ok festivalのvote回数を記録させる
     ok info_fromWalletにcat-mailを追加する
     ok infoにtokenURIとERC721も統合する
     ok フェスティバルのvoteのevent確認
     ig tokenURI用jsonの用意
     ok イベントの再考、集計しやすいように修正
     ok twinkleのbuyback priceを設定する
     ok uncommonのbuyback priceがcommonと一緒な点を修正
     ok glitterが表示されないバグの修正
     ok クラフト完了時にサウンド鳴らす
     ok フェスティバルのサウンド修正
     ok 可能ならmetamaskにNFT画像を表示させたい
     ok     → ERC721規格でないとmetamaskには表示できない模様
     ok     諦めるか、ERC721規格で考えるか、要検討。
     ok     → ERC165のsupportsInterfaceでERC721識別子を返すよう実装すれば認識された
     ok     この際なので、openzeppelinのERC721をもとにERC2665を再実装する
     ok crafting中以外でcompleteするとインジケーターが残るバグの修正
     ok musicbox off時にむらさきさんのlistingもoffに
     ok スイッチon/off時はmusic boxもoffに
     ok jsのworking_status部分を更新する
     ok 夜用BGMの実装
     ok 積み木を置く時のサウンドを実装
     ok tokenChestのバグ修正
     os mcに90万個の発行上限を設定
     os strollでpetやdirectionの制限を導入する, require
     ok ビットコ、イーサ猫の接触絵を用意する
     ok trial時に作成可能ではないアイテムはnot availableにでもする
     ok すべてのアイテムはクラフト完了時にお花まきで知らせるよう修正
     ok 晴れ以外の天気でwindowの朝/夜変換ができないバグの修正
     ok item_windowのカーテン閉じた時の絵を天気ごとに用意する
     ng ボタンオーバーラップ時にFeedingやStart Miningなどのメッセージを表示させる
     ok inactive buttonにrequired levelを表示する
     ok Buybackでfluffyが有効になっていることを確認する
     ok 他色ウィンドウの透明度を下げる
     ok デプロイコントラでERC20など設定項目を先頭にもってくる
     ok stakingコントラにSPEED補正をかける
     ok craft完了時に寝る条件が変
     ok     帽子の位置も
     ok stakingのNFT補正が1/10なので修整
     ok resume cancel時luckyとなるのを修正

 ok html修正
     ok buyback systemの弱点をきちんと述べる
     ok     このシステムだけでは原資抜きに1-2年かかる
     ok     つまり、結局ユーザーはfeeを支払って2年かかって回収するだけになる。
     ok この点をどう説明し、どう納得してもらうか
     ok     話が違う、となってしまうのは避けたい。
     ok     実際はdapps stakingの量がわからないのでなんとも言えないのだが。
     ok     一度、月3%を実現するために必要なtoken/userの値をきちんと計算してみる。
     ok Buyback Treasuryが目立たないので、どこにどの程度アピールするのかはっきりする
     ok     あまり目立たせすぎると混乱するので、マーケットとの棲み分けをどうするか。
     ok 脱ポンジのパラグラフを洗練させる

 ok SBTのNFT化を実装する
        mmにトリガー管理可能なtransfer許可機構を実装する
        permitted_address onlyにしておき、function側で
            トリガーOn → transfer → トリガーOFFと一度に行う
        よって、ユーザーの自由なtransferは抑制しつつ、
            function側で条件を決めてtransferを許可できる。
        → migrationとして実装済みだった

 ok Murasaki_Addressの修正
        Trial_Converterを追加で実装
        addressはjs側には極力保存せず、maを参照させる
        また、abiは別ファイルとする。

 ok 経済雑記
        持続可能な経済、穏やかだが確実に価値が上昇してゆくモデル
            価値の裏付けに独自トークンの購入を促したり、NFTを継続的に購入させたりはしない
            dApps StakingのRewardをプロジェクトの価値拡大へと当てる
        継続的なゲームプレイとNFTのホールディングがインセンティブとなるモデル
            NFTの最低限の価値はbuyback systemによって担保される
            このbuyback priceは緩やかにインフレしてゆく
            よって、継続的にプレイし、多くのNFTを所持し、
            保持し続けるほど、プレイヤーの資産価値は上昇してゆく
        ポンジスキームの否定
            ここでのポンジスキームの定義：
                「後のりのプレイヤーが支払った価値が先乗りのプレイヤーへと支払われる強力な先行者利益」
            新規プレイヤーの参入は、プレイヤー１人当りに割り当てられた資産を増やしも減らしもしない
            先行者利益は継続的なゲームプレイによってもたらされる
            ただし、starting feeはbuyback priceのインフレと同率で緩やかに上昇してゆき、
                マイルドな先行者利益を生じさせる。
        以上のメカニズムを通して、中長期的にストレスの少ない経済システムを目指す。
            つまり、短期間で大きな利益を取ることよりも、
            中長期的に損をするストレスが少なく、ゲームプレイをのんびり楽しめるシステムを目指す。
        Starting Fee：
            45%はbuyback treasuryの初期資産と送られる
            45%はstaking treasuryへ送られ、dApps Stakingへself stakeされることで、
                将来のbuyback treasuryのインフレのための金利を得る
            残りの10%はdeveloperへ送られる
        Buyback Price Inflation：
            dApps Staking Rewardとゲーム内のfeeはすべてBuffer Vaultへと集められる
            Buyback TreasuryをX%上昇させる分の資金を送る
            残った資金はstaking treasuryへと送られ、self staking量を増やす。
            10%がdeveloperへと送られる
        Inflation Rate:
            Inflationをどのくらいの速度でおこせるかは、新しいinflowの量に依存する。
            playerが多額の資金をdApps Stakinへと預けてくれればinflation圧力となる。
            一方で、新規プレイヤーの参入は、アクティブプレイヤー当りの資金量を低下させるため、
                インフレ抑制圧力となる。
            アクティブユーザー数の減少、つまりドロップアウトプレイヤーの増加は、
                残ったアクティブプレイヤー全員でドロッププレイヤーに
                割り当てられたトークンを山分けするため、インフレ圧力となる。
        総じて、本プロジェクトの資産価値の増加はdApps Staking量によって決定される。
            Starting FeeはあくまでNFTの初期の値段を決定するに過ぎず、
            またStarting Feeの45%を集めたself stakingだけでは、
            僅かな将来のインフレ率しか担保できない。
            developerは、アクティブプレイヤーあたりのdapps staking量ができるだけ多くなるよう、
            プレイヤーのストレスを減らし、より良いUXをもたらせられるよう務める。    

 ok html修正
        NFTのtransfer feeについてどこかに記載
            規制か規約かanti-botかに記載。
            専用の区分を設けてもよいか？
            item NFTがERC721拡張のERC2665であることも明記する。
                「時間が資源の中心であるため、初期では特にマルチキャラ運用が有利である
                そのため、マーケットを介さないNFTの直接のtransferにはfeeを設定する
                feeはユーザー行動を監視して調節される
                エコシステムの成熟を待って、
                将来的にはtransfer feeを0にして制限なく移動できるようにする
                また、feeはすべてbuffer vaultへ即座に送金され、
                エコシステムの保持に使われる」
        全アイテムリストの別ページを用意
        経済について記載
            feeはNFTの最低限の価値の担保とanti-botのために導入
            合うか合わないかのtrialを用意
            feeはエコシステムの拡大には直接使用されない
                殆どはユーザー資産に回される
            エコシステムの拡大（買取価格の上昇）は
                主にはdapps stakinの金利収入によって賄われる
        githubの整備
        未執筆記事の整備
        メールアドレスの用意
        NFT transferのUIを修正する
        イベント監視を修正
        なぜAstarなのかを記載
            課金メカニズムを入れたくない
                dapps stakingを利用
            dapps stakingを利用することで：
                ・playerは自分の資産をハッキングリスクなどに晒すことない
                ・課金せずにゲーム内インセンティブを得られる
        for developer更新
            greetingボタンのソース公開
            NFTアイコンを表示するソース公開
     ok anti-bod policyの整備
     ok jsのminity化
     ok privacy policyの整備
     ok trialモードについて記載
     ok 利用規約に法律対策の規約を明記
     ok     「各NFTの発行上限はitem_type毎に90万個」
     ok     「SBTの価格は1500円以上」
     ok     「SBTの所持による金融資産の配当は一切無い（ASTRエアドロなど）」
     ok     「NFTをいかなる決算手段としても使用してはならない（流動性の提供など）」
     ok     「ERC20規格の独自トークンは一切発行しない」
     ok 利用規約にプライバシーポリシーを明記
     ok 注意事項の整理
     ok     むらさきさんはSBTで売れない
     ok     放置ペナルティがある
     ok     マルチウォレットは禁止
            
 ok 経済について公開情報を整理する
        実現したいこと
            pump & dumpの抑制
            持続可能な経済モデル
            確実に価値が上昇してゆくモデル
            継続プレイが有利になるモデル
        ポンジスキームの否定
            starting feeは直接の選考者利益には回されない
        NFT価格の担保方法
            バイバックシステムの位置づけと
            担保資金の確保方法
        価値の分配方法のポンチ絵
        dapps stakingの位置づけ
            なぜdapps stakingなのか
                ハッキングリスクが小さい
                資金を目減りさせるリスクがない
                一方でin gameリターンを得られる楽しみがある
                得られたstaking金利はすべてvaultへ格納される
        継続プレイの有利性と価値上昇のメカニズム
            脱落者が出るとその分の金融価値は残りのプレイヤーに分配される
            新規プレイヤーの参入は現在の金融価値を増やしも減らしもしない
            1ユーザーあたりのstaking量が減ると、エコシステムの拡大が遅くなる
            ユーザー数が減り、1ユーザーあたりのstaking量が増えると、拡大が早くなる

 ok むらさきさんをアイコンで一覧閲覧できるページを作成する
        ランダムで10-20体のアイコンを表示する
            クリックでその家に飛べる
        ランキングも表示する
            total_coin, total_leaf, total_exp, score, total_craft, critical
            数値と順位と一緒にアイコンを表示する
            ランキングはオフチェーンで行うか、オンチェーンで行うか
                例えば、feeding時にupdate_ranking()を動かす、など
                ランキング用コントラが別途必要だろう
            また、murasakisanコントラにsummoner id -> address変換の関数を実装する
                もしくは普通にinfoコントラを使えばよいか。
            ランキングはちょっとストレスなのでNGとするか。
        リアルタイムログもここに表示する
            直近のログを予め表示する
            新たなeventを監視してリアルタイムで更新していく
        in-game infoもここに表示する
            trial summoner数
            main summoner数
            total nft mint数
            インフレ率
                starting feeの初期値からの増加率を表示（currentry +3%など）
            vault内のtoken量は生々しいので非表示とするか

 ok Fluffyシステムについて情報を整理する
        アップグレードの概念図のポンチ絵
        fluffyがもらえる行動の一覧と詳細
            crafting bonus, cat-mail, fluffy festival, staking bonus
        festivalの詳細
        dollのexp boostシステムの詳細

 ok item detailsの完成
        STR系アイテム
        DEX系アイテム
        INT系アイテム
        Fluffy系（概要）
        bank/pouch
        cat-mail
        presentbox
        twinkle系(comming soom)

 ig 覚書：コントラ更新手順
        remixでコントラを手動でデプロイ
        murasaki/deploy/3_init.pyのaddressを修正
        murasaki/deploy/3_init.pyのabiを必要に応じて修正
        murasaki/deploy/3_init.pyのabiから該当行を抜き出して実行
        share.jsのaddressを修正
        share.jsのabiを必要に応じて修正
        permitted_addressを設定していたコントラは、旧アドレスにfalseを代入

 ok なぜアスターなのか
        dapps stakingの利用
            ユーザーの資金を目減りさせずに安全に保管できる
            購入やトークン発行以外のみんなが得をする開発インセンティブ
        XCM?XVM?の利用
            EVMは成約が多いがライブラリと知見が充実している
            一方で、数年後の近い将来はWASMが主流になると予想されている
            EVM資産をシームレスにWASMへリンクできるのはAstarが唯一
            我々の第一目標はweb3の技術をリアルタイムでキャッチアップすることであり、
                次のPJはWASMで開発したいため。
        ガス代が安いため
            ガス代などでトークン価格を維持しようとする他のチェーンとは異なり、
                ゲームをストレスなく行えるほどガス代が安いため。
        Polkadotチェーンにおいて最も有望なため
            我々はpolkadotのビジョンに共感している。
            Astarはpolkadotのパラチェーンにおいて、
            上記３つの理由から最もbuildに向いていると考えるため。

 ok functionコントラ群にサーキットブレイカーを実装する
        旧コントラはpermittedを削除するより、
        サーキットブレイカーをONにして凍結するほうが良いだろう
        onlyOwnerのmodifierをつけているものはstoppableにしなくても良い


 ok いらすとやの規約クリア
        20点までの使用
        アルファベットだけで20点を越えてしまっている。
            アルファベット  まとめて1点
            きらきら    3点
            星  まとめて1点
            本  置換予定
            楽器　置換予定
            ダンボール　1点
            プレゼントボックス　1点
            額縁
            フラワーリース

 ok info_walletの公開情報の整備
        PJ外で有用なパラメータにできるだけ網羅的にアクセス可能とする
            外部で使用するときに有用と思われる値を吟味する
            各パラメータの簡単な説明を掲載する
        interfaceとabiを公開する
            コントラインポートへのリンクも明記する
        jsを用いた使用例を公開する
            greeting例、icon表示例のjsを公開する
            lootlineな楽しみ方を紹介する

 ok 新コントラのテストプレイ
        other summoner feeding
        market

 ok マーケットプレイスの改善
       *UIの実装
            平均priceを表示する
            ダッチオークションのルールを明記する
            listPriceに達するまでの残り時間を表示する
            マーケットコントラのget_itemInfoを使って情報取得を軽量化する
        ダッチオークション形式にする
        最低価格を決めてリストし、100 $Astarか最低価格x3の価格の
            どちらか大きい値段を始値としてオークションを開始する
        24時間かけて価格は下落し最低価格となる
            その後は最低価格でリスティングされ続ける
        また、売買成立時に平均落札価格を記録する
            item typeごとに回数と平均値を記録しておき、
            新しい落札価格を得るたびに回数と平均値を更新する

 ok イベント監視システムの実装
        pythonを用いて全eventを記録し続けるスクリプトを実装する
        snapshotとは別に運用する
        → node.jsで実装した
        share.jsやindex.jsから読み込むスキームを確立したいところ。

 ok bot対策の深慮
        スタンス
            手動でいちいち排除するよりは、
            そもそもbotが有利になりにくいメカニズムをonChainに組み込んでおきたい。
        考えられる有害行動：
         ok マーケットプレイスのスナイピング
                ダッチオークションの導入で耐性を持たせる
                生身のプレイヤーに対する監視botの優位性を下げる
         ok マーケットプレイスを利用したアイテム移動
                listing→即buyによる実質の無料transfer
                これもダッチオークションを導入することでほぼ不可能とする
         ig フロントエンドを用いない直コン
                スクリプトを用いたfeeding, groomingの定期実行化
                必ずしも有害とはいえないか
                saltをコントラ内に保持し、正しいsaltを渡したときのみfeed可能とする、
                    などの対策は取れるが、過剰防衛だろう。
                また、保母さんbotなどを公式で提供しても良いだろうか。
                event監視により手動で監視し、他のユーザーに迷惑がかかっていれば対策を考える。
         ok 直コンによる広範囲feeding
                event監視により手動で監視する
                あまりにも目に余るようなら手動でペナルティを課す
                もしくは、他のsummonerに対するfeedingにインターバルを設けるか
                対策済：追加expに24時間ごとの上限を設けて防ぐ。
         ok マルチウォレットによる多キャラプレイ
                1 summoner $20程度なので100体運用などは現実的ではないだろう。
                1人が2-3体運用は許容範囲とするか。
                キャラ間のアイテムの融通（fluffyの色合わせなど）は多少有利に働く。
                また、植民地summonerとメインsummonerの分担プレイも有利だろう。
                NFT transferに料金を設定することで抑制する
        以上を踏まえた規約
            単一ノードにつき4を超えるようなマルチsummonerの運用
                1人がマルチウォレットで複数のsummonerを所有することは
                推奨されないが禁止ではない
                ただし、エコノミーを破壊しうるほど過剰なマルチウォレット運用は
                ペナルティを受ける
                現在の制限として、4体以上の基準を設定するが、
                この基準とルールは今後変更になる可能性がある。
            フロントエンドを介さない過剰な直コン（基準は明記しない）
                このゲームはfull on-chainであるため、
                直コンがゲームプレイに特に有利になる設計ではない。
                そのため禁止はされないが、しかしエコシステムに有害な行動と
                dev teamが判断した場合はペナルティを受ける可能性がある。
            その他有害であると判断されたすべての行動
                スクリプトや自動化が通常プレイより明らかに有利となり、
                またはエコシステムに有害であるとdev teamが判断した行動は、
                summonerの停止や石化と言ったペナルティを受ける可能性がある。
    
 ok working系ステータスをuint isWorkingへ統合する
        0: notWorking, 1:Mining, 2:Farming, 3:Crafting, 4:Practice, 5:Strolling
        各workingは開始時にisWorking==0を要求し, end時にisWorking==[該当No]を要求する
        また、start時に各動的パラメータをリセットする
        さらに、強制終了functionを用意しておく
            forcedTermination(uint _summoner)
            summonerのownerとadminのみが実行可能
            isWorkingに0を入力する
            つまり、その時点で行っているworkingを強制終了する
            craftingでは払ったコストは帰ってこない
            mining/farmingは溜まっていたcalc_coin/materialは得られない
            次回start時は動的パラメータは0にリセットされる。

 ok UI実装：Twinkle, Sparkle, Glitter
     ok 当て絵を仮実装する
            小さめの自然物
            D&Dで自由に移動可能
     ok むらさきさんとの何かしらのギミックを考える？
            松ぼっくりを持って歩ける、など
            むらさきさんに重ねるとくっつく、など。
        所持twinkleリストの取得関数の実装
        summon_twinkleの完成
        
 ok 開始後のUI/UXチェック
        等速でのテストプレイ
        最初の1日、3日、7日のUXは十分か
        trial終了のタイミングは適切か

 ok ウッドキューブの再実装
        ユーザーがD&Dで並べて遊べる
        むらさきさんが蹴って遊べる
        1個に1桁スコアを表示する
        1桁スコアはあとから更新可能にする

 ok ゲーム開始時のバランス再調整
        やはりまだ開始時のUXが悪い
            Lv1ではまず何ができるのかさっぱりわからない
            なにもできないつまらない画面に見えてしまう。
        Lv2まですることがない
            最初のlevel-upに数時間かかると大体のプレイヤーはやめてしまうだろう。
            せめて30分程度でLv2が可能となり、mining/farming解禁としたい。
            また、アイテムリストは最初から公開しておいたほうが良いだろうか。
        Lv2までは、アイテムを眺めたり、feeding/groomingを試したりする時間とする。
            その間にLv2に挙げられるタイミングが来るバランスで。
            Lv2になるとminingとfarmingが解禁される。
        Lv3は24hr程度かかっても良いか。
            mining/farmingしてresourceをためつつ、作るアイテムを考える時間。
            mining/farmingの出力が正確であるほうが望ましい。
        メインのユーザー体験は何か：
            継続したプレイによって、お部屋が少しずつ賑やかになっていくこと。
            つまり、アイテムNFTの獲得がUXの中心だろうか。
            ステータスアップはあくまでcraftの前提条件という位置づけ。
            お世話によってレベルアップし、
                レベルアップすると新しいアイテムNFTがクラフト可能となり、
                NFTをクラフトするとお部屋がより賑やかになる。
            お世話→レベルアップ→解禁→クラフト→賑やかに
                これがプレイの中心となるUXだろう。
                少なくともはじめの2-3日以内に上記サイクルを1回は体験できるように。

 ok 最初の演出をもう少し頑張る
        何もない部屋に全部作って足してゆく、感じを初めから演出する
        くま、作業台、ちゃぶ台、砂場、植木鉢、は最初は無いようにしたい。
        UXのみで良いので、大きな宝箱をクリックしたら展開されて配置される
            お部屋のものは全部これから作ってゆく、というのを演出する。
        プレゼントボックスから出現して、規定位置に収まる動作を定義する
            もしくはシンプルにvisible=trueかつsummon_flowerでも良いか。
        砂場のsprite化が必要
                    
 ok workingのUI改良
        たまに勝手に休憩するように修正する
        プレイヤーが「命令を出す」と言うよりは、
            ふわっと「これやってほしいなー」程度の印象にする。
        気が向いたらcoinほってほしいなー程度で。
        むらさきさんは適度に休んで、適度に寝ちゃう感じに修正する。
        よって、+XXXのテキスト表示は常に表示させておく。

 ok lootlike要素の再考
        わかりやすく、ロールプレイたりうるパラメータに改善する
        引きあたった要素がもっとイメージしやすく、かつ要素間で大きな優劣が無いように。
        十人十色な要素を3つほど考えたい。
            性格（長所）
            出身場所
            weakpoint
                寂しがり屋
        もしくはpersonalityを3つとかにするか
        https://mysuki.jp/english-personality-5486
            birthplace:
            personality: 外見・行動、客観性
                "Friendly"：友好的
                "Reliable"：信頼できる
                "Frisky"：元気な、活発な
                "Thoughtful"：思いやりがある
                "Easygoing"：のんびりとした、気楽な
                "Tolerant"：寛容な
                "Affectionate"：愛情深い
                "Intelligent"：知的な
                "Faithful"：忠実な
                "Innocent"：無邪気な、純真な
                "Gentle"：穏やかな、優しい              
                cheerful, 陽気な
            character: 深層心理・価値観、主観的な信念
                diligent, 努力家
                optimist, 楽天家
                realist, 現実主義者
                ethical, 理論屋
                sensitive, 多感
                adventurous, 冒険家
                compassionate, 同情的
                empathetic, 共感的
                patient, 我慢強い
                courageous, 勇気のある
                "Honest"：正直な

            weakpoint: a bitをつけて愛嬌程度の弱点
                気分屋,
                寂しがり屋,
                お寝坊,
                神経質,
                負けず嫌い,
                頑固,
                忘れっぽい,
                完璧主義,
                内気
                おてんば
            Scent:
                華やかな香り (floral scent)
                爽やかな香り (refreshing scent)
                優しい香り (gentle scent)
                穏やかな香り (mild scent)
                フルーティーな香り (fruity scent)
                お日様の香り（sunshine scent）
                甘い香り（sweet scent）
                ふんわりした香り (soft scent)
                エキゾチックな香り (exotic scent)

 ok demo→regularのテストプレイ

 ok アイテム順の決定
        クラフト、ダイス、猫メール、散歩、楽器練習、の順で解禁する

 ok マーケットの改善
        最低価格の導入
            バイバックコントラを参照する
            pouch/bankなど最低価格が存在しないものは決め打ちで設定できるようにしておく
            スクリプトによるマーケットを利用したアイテム移動への対策
     ng 可能なら、オークションの導入

 ok フラワーリースの実装
        クラフト後にのみ表示する
        クラフト後にのにスコアによる補正を有効にする
    
    
 ok 天気を実装する
       *UI側だけの演出
            ASTR価格が前日比プラスなら晴れ
            前日比マイナスなら雨
            基準はUTC0で（日本時間朝9時）
            これぐらいのさりげない演出で良いだろう
            あるいは、+10%>, 1-10%, -1~-10%, -10%<の5段階とかでも良いか。
                大雨(<-10%)、小雨(-10%~-3%)、曇(-3%~+3%)、晴れ(+3%~+10%)、快晴(>+10%)、など
        dexscreener API:
            https://api.dexscreener.com/latest/dex/pairs/astar/0x806f746a7c4293092ac7aa604347be123322df1e
     ok ASTR/USDT価格取得コード：
            let request = new XMLHttpRequest();
            astar_price_data = "";
            request.open("GET", "https://api.dexscreener.com/latest/dex/pairs/astar/0x806f746a7c4293092ac7aa604347be123322df1e", URL, true);
            request.onload = function () {
                astar_price_data = this.response;
                console.log(astar_price_data);
            };
            request.send();
            let _json = JSON.parse(astar_price_data);
            let _astar_priceChange_h24 = _json.pair.priceChange.h24


 ok exp補正のUI実装
        expをクリックで補正一覧を表示
        現状：
            ぬいちゃん
            +exp小物
            walletステータス
        足し算ではなく掛け算になっているが、どうするか。


 ok レベルアップの演出の改善
        もう少し豪華に
        新レベル値を大きく表示、など
        付随して、文字表示の機構を実装する
            happy new yearなどにも使えそう
            文字が一つずつ可愛く出現する演出を考える
        文字クラス
            演出
                真下に自由落下
                真上に加速度上昇
                小さくなって消える
       *音の実装


 ok Trialモードの修正
     ok convert直後の挙動確認
            適切なタイミングでcontract_update_summoner_of_wallet()を走らせて
                gamemodeをtrialからregularへと変更させる
            トリガーを何にするか。
            切り替わり時の演出も考える
            リロードを促す専用ウィンドウとリロードボタンを表示させる
                初回起動時の演出とトリガーをどうするか
                トリガーはローカル変数でよいか
                flag_convertCelebration = 1など
                flag=1のときだけ演出を行い、すぐflagを寝かせる
                if (gamemode=="regular" && flag_convertCelebration==1) {
                    //演出
                    flag_convertCelebration=0;
                }
     ** trial表記の深慮
            ひと目でtrialモードだとわかる表現を実装する
            「TRIAL」の壁看板を表示させるか
     ok level capの修正
            クラフト可能なLv3以降にexpが全く入らないのはちょっとおもしろくない
            expは貯まるがLevel-upができないように修正する
     ok first craft bonusの導入
            最初にクラフト完了したときにpresentboxを得る
     ok trialではstaking bonusを表示させない

 ok index.htmlのweb3周りのjs修正
        walletを多重で読みに行っているのでエラーになっている
        まずwallet接続を要求して待機し、
            接続され次第onChainデータを読んで反映させるよう修正する

 ok Depth整理
        1-100:      background
        200-1000:   sprites
        2000:       system icon, text
        3000:       staging1, 
            3100:   draw_flower
            3200:   fireworks
            3300:   night
        5000:       window
        6000:       stating2
            6100:   fallingFlower
        9000:       pointer

 ok Trial ConverterのUI実装
        js実装
            scene内でsummoner取得しに行くときにregularとtrialを両方取得しモード分岐させる
            他のコントラは、
            1:
                share内ですべてtrialもコントラを作っておく
                web3絡みはすべてflag_trialで通常コントラかtrialコントラか
                    どちらを読みに行くか分岐させる
            2:
                メインコード内ではコントラは変化させない
                shareなりどこかで、trialとregularで全コントラを入れ替える分岐を行う
            また、trial→regularへとコンバートした直後の挙動も実装する必要あり
                やはり、flag_trialと、各コントラ2重用意で分岐、が受けが広いだろうか。
        運用
            いつでもコンバート可能にするか
            特定の条件を満たした後コンバート可能とするか
            コンバート無しで正規mint可能とするか
            → Trialで開始し, Lv3以上でいつでもregularへconvert可能、とする
        UI実装
            Lv3以上でconverting_summonボタンを表示する
                ないないさんを使うか
                もぐもぐさんを使うか
     ok 開始画面のUI分岐を実装する
            trialあり/正規なし　→　trial summonerで開始
            trialあり正規あり　→　(ありえない)
            trialなし/正規あり　→　正規summonerで開始
            trialなし/正規なし　→　summon画面
            つまり：
                trial summoner own → trialコントラで開始
                trial summoner not own → regular summoner own → regularコントラで開始
                trial, regular summoner いずれもnot own → trial summon画面
            また、visitはregular summonerのみとする
                trial summonerはvisitできない
                コントラとしてはfeeding可能だが、UIは実装せず想定しない
     ok init
            maは独立したコントラ
            ただしmnだけは正規コントラと共通
            mcのtransfer feeは巨大な数字
            mp.PRICE=0
            mp.isTrial=true
            trialのma.address_Murasaki_Address_Regularに正規版のmaを格納する
            regularのma.addressにはTrialのmaアドレスを格納する
            mc_regにはtrialのconverterをpermitしておく
            trialのffにはintervalを多めに設定しておく

 ok クリック時の挙動統一
        cat, festivalor, presentboxの仕様も統一する
        現状これらはマウスオーバーとマウスクリックで挙動が異なるが、さてどうするか
        クリックでtx飛ばしてしまうため、情報表示のUI設定がちょっと難しい
        item_indicatorはどうするか
            同時に、ステータス補正値の表示方法も考える

 ig 体験summonerの設計II
     ok コントラ群を別にすべて用意する
            token, functionなどすべて
            if(isTrial)トリガーを実装しコード自体はtrialと正式で共通とする
     ok 制限をかける
            mcのtransfer_feeを10000000など大きな数字に設定して事実上禁止
            mfslのlevelup関数でrequire(level<=2): Lv3までしかあげれないよう制限
            mfcでrequire(mss.total_item_crafted <=2): itemは3つまでしかcraftできないよう制限
            mfcで、trialではfluffyが発生しないよう修正
            そのかわり、mfslでLv2, Lv3などでpresentboxをもらえるよう修正
            mpにisTrial変数を用意しtrueを代入する
                他のmfも自前のisTrial()を持ち、中身はmp.isTrialを参照する
                mf内ではif(isTrial){require()}で制限を実装する
     ok 制限II
         ok Lv>=3でfeeding, groomingのexp=0
                Lv4にあげられないのではなく、expを得られなくする
         ok start_crafting時にrequire(total_item_craft<3)
                3個以上はクラフト開始できなくする
         ok coin bank, leaf pouch, cat mailはtrialではクラフト不可とする
                もしくは、クラフト可能品を絞る
                require(_item_type==1 || _item_type==17 || _item_type==33)など
         ok mc_trialはtransfer_fee=10000000000
         ok 1ヶ月間放置されると再summonが必要なように設計する
                isActive()を用意するか？
                isPetrified & isTrialでresummon()とするか？
                シンプルな設計を考える
                → 石化し、cure cost=0とする（mint cost=0なのでそのままで良い）
         ok coin, leafの取得上限も検討する
                延々とcoin/leafを取得し続けるbotが成り立ってしまうため
         ok onChain_Scoreによるexp boostは無効
                item_wreathも表示させない
         ok staking bonusも無効
                メーターを貯めない
                item_stakingも表示させない
         ok uriで"Trial"と表示させる
         ok presentboxはランダム送信しない
                自分で作ったら自分でもらえる
                → trialでは送らないこととする
         ok summon時の条件の整備
                trial, regularのsummonerのpossess条件に応じて、
                trial, regularのsummonを許可・不許可する条件を整備する
                いきなりregular summonerのsummonは許可するか？
                trial所持 → convert許可
                trial未所持・regular所持 → trial summon不許可・trial convert不許可
     ** init
            maは独立したコントラ
            ただしmnだけは正規コントラと共通
            mcのtransfer feeは巨大な数字
            mp.PRICE=0
            mp.isTrial=true
            trialのma.address_Murasaki_Address_Regularに正規版のmaを格納する
            regularのma.addressにはTrialのmaアドレスを格納する
            mc_regにはtrialのconverterをpermitしておく
            trialのffにはintervalを多めに設定しておく
     ok コンバーターを用意する
            mfslにconverting_summon()関数を実装する
            まずsummonし新IDを割り振る
            その後trialから正式へmm, ms, mssをコンバートする
            所有trial_mcをすべて取得し、正式mcをmint、コンバートする
        共通の情報
            mnはtrial上で正式版をmintさせる
                つまり、ma_trialには正規mnのアドレスを登録する
            弊害としては、大量mintでnameが枯渇することだが、まあ大丈夫だろうか
     ok 要修正
            lootlike系はwalletアドレスとclassのみを参照するよう修正
        要対策・要検討
         ok coin/leafをひたすら掘り続けるtrial summoner
         ok coin bank/leaf pouchを溜め込むtrial summoner
            → 時間の制限か、total_coin/leafの制限を検討する
         ok 長期間放置されたtrial summoner
                石化する？
                そのwalletで再開したいときはどうするか
                trial summonerは石化しないようにするか
                もしくは石化のタイミングで再mint必要にするか
                正規summonerは石化し、trial summonerはリセットされる
                普通に石化でも良いかもしれない
                    trialではcureコストが0である、とする
            trialを示すUI演出を考える
                鬱陶しくなく、しかし変化がわかりやすく、かつ嬉しいUIが必要
                → mogumoguさんを使う
         ** 開始画面のUI分岐を実装する
                trialあり/正規なし　→　trial summonerで開始
                trialあり正規あり　→　(ありえない)
                trialなし/正規あり　→　正規summonerで開始
                trialなし/正規なし　→　summon画面
            summonは必ずtrialからか、直接正規mint可とするか
                条件を満たさないと正規へconvertできないのか、
                feeを払えば初期から、もしくは度のタイミングでも正規summonerへconvert可能とするか
                → Lv3でmogumoguさん出現とする

 ig 体験SBTの設計
        別のmmを用意する
            summoner IDに紐付いたms, mss, mnも別コントラが必要
            admin converterのようなコントラでパラメータをコンバートする必要がある
            かなり複雑になるが、エラーなく実装できるだろうか
        mint関数と、convert関数を別に用意する
            convert関数は引数はsummoner IDのみとする
                でないと引数上限に引っかかるだろうか
            require(flag_convert=0)
            require(owner check)
        mint関数
            正式mmでmintする
            正式summoner idが割り振られる
        convert関数
            mint関数に続いて同一tx内でconvertする
            convert_mm(summoner_trial, summoner)
            convert_ms(summoner_trial, summoner)
            convert_mss(summoner_trial, summoner)

 ig free2play機構の検討、体験版機能の検討
        いきなり$10-20払ってくれというのは参入障壁が高すぎる
            加えて、NFTではなく移動できないSBTなので気軽に購入しにくいだろう
            ape inした層から売れない移動できない、といった苦情やトラブルが多いと思われる
        そのため、例えばLv3程度、最初の1週間程度は機能制限ありの体験summonerとする
            気に入れば、正式SBTを購入して継続してプレイできる
            このほうが、将来的な利益が大きいだろう
        体験SBTの時は機能制限を付ける：
            マーケットの使用不可
                バイバックも使用不可
            Lv4以上へあげられない
            アイテムクラフトやfluffy NFTはどうするか
                体験NFTとし、正式summoner mint時に正式NFTに変換される
                正式NFTをmint可能とする
            名前SBTはどうするか
                特に弊害はないので正式SBTでよいだろうか
            クラフト回数に制限をかける
                3回、など。
            fluffyはどうするか
                3匹までしか得られない、など。
        bot対策
            体験summonerがfree mintの場合、大量にmintし運用することで
                正式summoner側の経済が破壊されることは避けなければならない
            例えば、正式NFTをmint可としておくと、
                大量の体験summonerから低レベルとはいえ大量の正式NFTが放出されうる
                bankやpouchなどが大量に出回るとまずい
                これは公式マーケットを使用不可としていても、裏マーケットなどで起こりうること
            また、体験summonerでひたすらcoinを掘り続けるというプレイも可能になる
                どこかで蓄積coin<mint feeとなったところで正式summonerをmintし
                profitを得るという力技が可能になってしまう。
            かといって制限をかけすぎると面白くない体験playとなってしまうだろう
                例えばNFTは一切mint/craftできない、などはつまらなさそう

 ig 開始直後の調整の本質
        初日中にゲーム性を体験できるイベントを発生させる
            盛りすぎない、期待させすぎない
            低頻度・長期間ほのぼのプレイであることを理解してもらう
        3日目までは毎日新しい体験を提供する
            1日目：
                数回のお世話でレベルアップ
                    Lv1 → Lv2
                mining, farming解禁
            2日目
                Lv3へレベルアップ
                crafting解禁
                fluffyと出会う
                    Lv3の特別報酬とするか
            3日目
                最初のクラフト品完成
                    最初は低コスト、24 hrなどで完了とする
            7日目までに
                最低限のアイテムのクラフト完了
                    iPad, Nameplate, MusicBoxの3つぐらい
                    すべて資源1d, クラフト1d程度の難易度調整にする
                    craft, 1d, coin or material: 1000程度
        7日目までに一通りゲーム性が理解できるよう設計する
            この7日目ぐらいで正式SBTのmintを促す
        体験SBTの制限
            マーケット不可
            バイバック不可
            Lv3上限
        体験SBTの許可
            名前SBTのmint
            正式NFTのmint
        問題点
            体験SBTと正式SBTのIDが異なるため、lootlikeの属性が変わってしまう
                lootlikeはwalletのみに依存させるよう修正が必要
            無料なため、大量の体験SBTで大量のアイテムNFTをmintできてしまう
            最初のクラフト時は低コストにする必要があるが、簡単にupgrade可能になってしまう
                first ticketなどの別の機構が必要
            体験SBT→正式SBTへのパラメータ引き継ぎが可能だろうか
                msやmssなどもsummoner IDが変わるのですべてtransferする必要がある

 ig mint直後の立ち上がりのバランス調整
        流石にゲーム開始時の楽しみが弱すぎるだろう
        初日中に何かしらのイベントを発生させる
        1週間以内に必須のアイテムぐらいはクラフト可能にする
        どこかのタイミングで正式SBTへの移行を促す
        最も大事な、ゲーム開始から1-2週間のバランスを試行錯誤する
        その後はmint feeがある意味人質になる
            mint後は脱落者が増えるほど継続者の利益が増えるシステム
        スタート直後：
            presentboxを1つ同時にmintさせる
            ないないさんを使って各種ボタンの説明を表示させる
            24時間以内にLv2へレベルアップ可能にする
        スタート3日後：
            Lv3へレベルアップ可能にする
        スタート7日後：
            初期の1-2個のアイテムNFTをcraft完了可能にする
            name plate, iPad, Musicbox
        ゲーム性の中心はなにか
            できるだけ早いタイミングで推しのゲーム性を体験してもらう
            毎日継続してお世話することで少しずつ成長するNFT（SBT）
                「成長」と「蓄積」を実感できる体験はなにか
                    レベル？
                    ステータス？
                    資源の増加？
            得た資源を支払って新しいNFTをmintする拡大再生産
                拡大再生産を実感できる体験はなにか
            目減りしない資産価値
                バイバックで担保されたNFTの価値
                「時価総額」としてUI内に表示させる

 ig バランス調整の再考
        優先ルール
            2年程度で最大成長に達する
            平均的なプレイで1週間に1個程度のitemがクラフト可能となる
            1年で効率が2倍（+100%）程度のステータス上昇率に調整する
        開始直後のバランス補正
            7日間程度で一通りのゲーム性体験ができるように補正する
            最初の3アイテムは24時間以内の難易度に設定する
            資源あつめ1日 + クラフト1日 x 3 = 6日間、程度のバランスに補正する
            1-2個のfluffyもボーナスでもらえる
        バイバック調整
            fluffy, fluffier, fluffiest, dollにも値段をつける
            初期アイテムのコストを下げる
                これに伴って、バイバック値段も引き下げる

 ok インフォメーションの表示形式を統一する
        クリックで表示させるのか、オーバーラップで表示させるのか
        時間経過で消えるのか、オーバーラップ時のみ表示させるのか
        マウスとタップで利便性が異なる
            さて、どうするか
        クリックで一定秒表示、が無難だろうか
            マウスでもタップでも操作性が悪くはない

 ok Buybackシステムの修正
        fluffy NFTのbuyback価格の設定
            fluffyは不可で、estやdollあたりからpriceを付けるか
            どのitem levelが妥当だろうか。Lv10あたり？
            ちゃんと計算して設定する。
        fluffyやflyffierにも採算取れない程度に小さくて良いので価格を設定するか
        fluffy系列分の割当も計算する
        現在の時価総額を表示する
            今すべてを売り切ったらいくらになるか
            自分のHoMの金銭的価値の位置づけ
            そしてこの最低時価総額は決して下がらず、未来に向けて必ず上昇してゆく
        むらさきさんをburnしたらいくらか返金されるシステムはどうだろうか
            決して目減りしないオンチェーン資産、を表現したい
            そしてこの資産価格は継続的なゲームプレイで価値が上がってゆく

 ok 初期アイテムのコスト減弱とバイバック値の減弱
        同時にfluffyのバイバックコストの設定

  ok Philandライクな戦略の検討
        やはり何かしらのオブジェクトとしたい
            移動可能なオブジェクト
            おかしの家とは異なり、普遍的に発展/成長してゆく小物
            小さな植木鉢？
            お花のリーフはどうか
       *独立したオブジェクトのitem_wrethとして実装させる
            trialでは無いならば初期から所持する
    	オンチェーンアクティビティに応じたオブジェクトを得る
    		onChainAchievementコントラクト
    	NFTではなくとも、落書きなど何かしらの表現を行いたい
    	    落書きはin-gameアクティビティの表現で実装済みなので、バッティングするだろうか
    		各PJのトレースデフォルメアイコンを用意するか
    		    どこに表示するか
    	また、インセンティブとしてはExp Boostボーナスを導入する
        *よつば案：
            1つ, 2つ, 3つ, 4つ葉の4段階
            葉っぱが薄いor透明で現在の段階を表すか
            もしくは、4つの別のイラストとするか
                0-1%: 1つ葉
                1-2%: 2つ葉
                2-3%: 3つ葉
                3-4%: 4つ葉
                4%max: 4つ葉＋てんとう虫
            マウスオーバーラップでスコア内訳を表示させる
        スタンプ案
            壁の空いているところにNFTをデフォルメしたスタンプを貼る

 ok スナップショットスクリプトを実装する
        pythonなどで、mm, mn, ms, mss, mns, mcの状態をローカルに記録するスクリプト
            可能ならば、スナップショットからの回復コードの実装も検討する
        また、ローカルに保存したデータの解析方法にも慣れておく

 ok Petとのふれあい機能の実装
        Petと当たり判定したときに専用の演出を実装する
        ハマらないようクールタイムを用意する

 ok working時にemitterを表示させる
        mining: コインが飛び出す
        farming: 葉っぱが降ってくる
        crafing: ?

 ok crafting UIの改善
        item indicatorの下に進捗バーを表示させる
        → 残り時間を％に変換するのが困難
        → また、3日とかなので、％表記は不適切だろうか
        → 解決した。導入OK
    
 ok random presentのコード修正
        mailと同様に5回ループで候補を探すよう修正する
        5回施行ならば：
            active user 80%で失敗率0.032%
            active user 50%で失敗率3.125%
            active user 20%で失敗率32.76%
        これならば、体験SBTと正式SBTをms内のフラグ管理しても大丈夫だろうか
            体験SBTの20%が正式SBTに移行したとすると、成功率70%程度
        しかし、やはり正式IDが汚染されるのは何かとコントロールが面倒そうなので、
            正式IDを割り振るのはmint fee払ったwallet数にすべきか

 ng free mintの可能性を考えてみる
        → 体験play機構を実装することとする
        現在の流行はfee 2 playのフリーミアムモデルが主流
            mint feeをかけさせて2-3ヶ月で原資回収するモデルは主流ではない
            課金しないライトユーザーは無視して、
                ハマってくれたヘビーユーザーに青空天井の課金を促すモデル
            また、本作品は原資回収を計算すると1年以上必要で魅力が少ない
        よって、資金集めはdapps staking rewardを主軸とし、
            mint feeを小さく抑えることで参入障壁を限りなく低くするモデルを考えてみる。
            廃課金機構はつくらずに、有利に進めたい人はstaking量を多くしてもらう
                Astarエコシステムにも良いだろう
        デメリット：
            dapps stakingインセンティブが現状では不十分
                自発的にdapps stakingしてくれないと資金が入らない
                現状、ステーキングによる恩恵が弱く、また分かりにくい
            bot対策が弱くなる
                mint feeを下げると大量のmulti-walletを利用したbotに脆弱になる
                分散してstakingするのは手間ではあるのだが。
                    しかし、stakingによるreward効率は量が増えると鈍化する設計なので、
                    multi-walletによって分散させたstakingが最大効率になってしまうか。
            バイバック資金の消失
                staking rewardが貯まるには時間を要するので、
                バイバックシステムでPJの価値を下支えすることが難しくなる。
                参入人数が多くなればstaking報酬のみでバイバック資金を賄うのが難しくなる
                多額のstakingをする人だけ集められればよいが、そうもいかないだろう
                staking/wallet値はどのくらいになるのだろうか。
                    500ぐらい行けば御の字だろうか。
                単純な人気によってNFTの価値が決まるが、その分逃げ足も早くなるだろう
            金銭的インセンティブの低下
                無から有を生み出す必要があるため難易度が高くなる
                最初の人質金が無いため、参入しやすく離れやすい
            課金要素が貧弱
                ヘビーユーザーからの集金機構が今のままでは弱いと思われる
                完全なフリーミアムは課金機構とセットで考えるべきだろう。
        メリット：
            金たかり層を排除できる可能性
                無料であるため、mint feeとリターンのバランスに対する不満などが出にくい
                    原資抜きに時間がかかって怒られる、といったことが少ない
                気楽にプレイしてもらえる
            セキュリティ周り
                コントラクト上にお金をプールしないので狙われにくい
            金融性の低下
                ユーザー側の金融要素はdapps stakingにステーキングするだけ
                    持金を直接預けず、目減りもしないのでほぼノーリスク
                ユーザーが原資抜きを考えなくて良い
                開発側はdapps stakingに入れて欲しくなるシステムを作り続けるだけ
                    staking rewardをゲーム性の中心に持ってくる改革が必要
                トーケノミクスなどにあまり頭を悩ませなくても良いと予想される
                総じて、のんびりプレイ可能なバランスに設計できる
        設計：
            mint fee
                10 $ASTRなど少額に設定する
                すべてdev報酬とする
                    もしくは全てバイバックトレジャリーに入れる
            stakingインセンティブ
                dapps stakingをゲーム性の中心に据える必要がある
                staking=0だと如実に不利にする
                staking量に応じてrewardと演出が良くなる
                ただし、継続的なgameplayが最もreward効率が高くする
                    stakingはあくまで継続的なplayの「効率」を上昇させる
            bot対策
                少額でも良いのでmint feeを設定する
                NFTのtransferにはfeeをかける
                明らかなmulti-walletは監視して手動でbanする
            ユーザーのearn設計
                主な手段はcraftしたNFTの売却益となる
                100%市場任せだと買い手がつかずにすぐに無価値化するだろうか
                mint回数にlimitを設定し希少価値を付けるのも手だが、設計上不適切だろう
                やはり、treasury資金によるバイバックが安定するだろうか
                mint feeを少し多めに設定し、全額treasuryに入れるか
            Staking Treasuryの使用方法
                従来設計ではバイバックtreasuryに入れていた
                ユーザーに還元したいが、適切な方法はなんだろうか
                ユーザーとdevが同時にearnできるシステム設計にしたい

 ig クラフトUIの改善
        未クラフトアイテムをセレクトした時に、グレースケールのアイテムを表示させる
            → 半透明とする
        アイテム初期位置の調整

 ok exp増加アイテムのsolidity実装
        発表会、お散歩報酬、おもちゃのカンヅメ報酬などに使用する
        一つ一つは+0.1%exp程度と小さな上昇率に留める
        solidity実装案
            種類ごとに別のitem_typeを用意するか？
                countが大変なので、exp上昇率ごとに1種類にしたいところであるが
            mcにsubtypeを実装してしまうか
                exp補正率ごとに別typeで、その中での種類はsubtypeを参照する
            例：
                小さなきれいな石: すべてexp+0.03%, 色が12色ある
                中くらいのきれいな石: すべてexp+0.05%, 色が6色ある、など
            石シリーズ以外でも、exp+0.03%のアイテムはすべてこのitem_typeで処理する
            amountOf * 0.03で補正率が算出しやすい
        取得のタイミング
            なにか特別なアクションの報酬としたい
                散歩の報酬
                    何も得られなかったら悲しいのでこれ以外の報酬も考える
                発表会の報酬
                    飾って楽しいトロフィー, シーズンごとに異なる

 ok practice中のfeeding中にpracticeを抜けるとinstrumentが残っちゃうバグの修正

 ok マーケットページの改善
        → 実際の実装はdapps stakingの目処が立った後、かつローンチ後1ヶ月程度
            よって、現時点で公開はできない。
        情報取得のバッチ処理化
       *バイバックシステムの組み込み
            市場で売りに出すかバイバックするかを選択できるように
            バイバックは気軽にはできないようにする
        upgradeボタンの廃止
        transfer機能はどうしようか。
            present機能として残す。
        transferに警告文を表示しておく。
            「友人とのアイテムのやり取りに使用できます」
            「present eventは監視されています」
            「明らかにbotと思われるmulti-walletを用いたtransferは即座にbanされます」

 ok バイバックシステムのUI実装
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

 ok バイバックシステムのUIの実装
        専用ページとするか、マーケットページに統合するか
        マーケット売値はバイバック価格を下回れないよう修正する

 ok バイバックコントラクトのテスト
        バイバックのテスト
        bufferVaultの挙動テスト
        バイバックボタンの実装
        マーケットでバイバック価格以下で売れないよう設定
        バイバックコントラへのapproveボタンの実装
       *必要なアマウント量で、ばいばっく済み量を考慮するよう修正する
        コントラ内の必要量に関する考察：
            btコントラには、active_summoner * amountPerSummoner - total_paied_amountがあれば良い
            しかし、deactiveされたsummonerのpaied_amountを合算することが困難なため、
            total_paied_amountを計算することができない
            そのため、厳密には多いが、active_summoner * 現在のamountPerSummoner分だけ
                常に入っているように計算してbufferからtransferさせる
            active_summonerがbuyback済みであるほど、過剰量がbtに格納されることになる
            また、各summonerはamountPerSummoner x2までbuybackすることができる
                x2にする意味もあまりないので、ハッキング対策としてx1とする
            bt内の量としては、active_summoner全員がamountPerSummoner x1売れるだけの量に相当する
            もう少し減らしてstakingへ回しても良いかもしれないが、
                蓄積金が多いのもそれはそれで良いだろうか
            50%程度の量でも良いかもしれない。要検討。
                しかし、ユーザーからの預り金という位置づけなので、十分量を公開する意味はあるか。

 ok Practiceバグ修正
        practice中にfeedingするとinstrumentが増殖するバグの修正

 ok 楽器rarityを加味する
        uncommon +10%
        rare +20%

 ok summonerクラスにpracticeモードを実装する
        ルールは他のworkingと同様
        ターゲットは部屋の中心あたり
        practice中のアニメーションの用意
            楽器を擬人化して一緒に遊んでいるイメージの絵
            ランダムで歌いながら寝てしまう、など
       *practice中のサウンドエフェクトの用意
            楽器毎に変えずに、共通の明るいSEをあてがう
       *終わったときの演出の検討
            +expを表示させるか
        
 ok 楽器練習のUI実装
        専用ボタンの実装
        楽器選択のUIをどうするか。
        習熟レベル：
            beginner
            talented
            skilled
            intermediate
            skillful
            seasoned
            proficient
            advanced
            expert
            master

 ok 楽器練習の実装
        意味論
            むらさきさんの一人遊び用趣味
            3種類の楽器ごとに異なる習熟レベルを設定する
            楽器を指定した「れんしゅう」で習熟レベルを上げられる
                習熟レベルの増加は遅くするか、MAXレベルをかなり大きくする
            「れんしゅう」中の経験値はすべて楽器経験値へ転換される
                れんしゅうした分は本体のExpが全く増えない仕様とする
                Feedingはどうするか
                → Feeding時はExpは増えず、れんしゅうが終わったら楽器経験値に加算する
            Happy, Satietyが10以上でないと寝るようにする
                寝てる間の練習時間は何も生じない
                楽器expも本体expも加算されない
            STR, DEX, INTの値ごとに楽器exp取得量に係数をかける
                ステータスが小さいときはあまり楽器expが入らない
                比例ではなくlogXグラフ
                    ステータスが大きいほど寄与率が小さくなるモデル
                しかし、「時間」が最も大きい資源となるバランスに設定する
        練習実装
            練習中のFeedingのexpは楽器expへ加算する
            luck補正はなし
            fluffyスコアとSTR/DEX/INT値でわずかに補正する？
        実装未
            ステータス補正をどこにどのくらいかけるか
            EXPからLvを計算する計算式の決定
                シグモイド？
        init実装
            init.htmlの修正
        練習曲線
            シグモイド曲線とする
                Bottom	1.762
                Hillslope	3.491
                Top	20.46
                EC50	15597275
                Y=Bottom + (X^Hillslope)*(Top-Bottom)/(X^HillSlope + EC50^HillSlope)
        パラメータ補正
            単純に、対応するパラメータ分だけ+%ととする
                例：STR 15 = Clarinetのdelta_sec +15%
        楽器候補
            ピアノ
            バイオリン
            クラリネット
            トランペット/トロンボーン/チューバ/ホルン/サックス
            チェロ/ウクレレ
            小太鼓
            
 ok Practice expの加算修正
        practice sec分はfeeding, groomingのsecとして加算しない
        コードの実装が大変か
        → 他のworkingと同様に、groomingのみ加算させない
            Feedingは影響を与えない

 ok バグ修正
        ぬいちゃんクラフトのアイコン修正

 ok fluffy festivalのUI改善
        問題点：
            festival後に結果がわからない
            現在のfluffy所持数がわかりにくい
        さて、どうするか。
            もぐらさんを使うか？            

 ok Astar Walletを所有する意味論の付加
        Walletのパラメータによってin-gameインセンティブを付与する
            保有tokenの種類, 上限1%, 0.1%/PJ
                SDN, DOT, LAY, BAI, ARSW, ACA, MATIC, GLMR, JPYC, WETH, WBTC, aUSD, 
            保有NFTの種類, 上限1%, 0.2%/PJ
                CANDYGIRL, DGENE, ANAUT, ASTRJP, CAT, WITCH, Punks
            dapps staking量, 上限1%, 0.1%/step
                1, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 
            オリジナルNFT, 上限1%, 0.1%/個
                1-10個
        すべてmaxとして+5%程度のEXP補正をかける
            1項目100点で、4項目400点、+4%程度か
            最後の1項目は、オリジナルな運営が発行するNFTとするか。
                1日1枚発行されるAoAのむらさきさんやAstarなど。
        現在のExp補正値を表示させる
            クリックで補正値内訳を表示させる
        また、Exp補正値を反映するアイテムか、落書きを表示させる        

 ok クレヨンの実装
        クレヨンクラフト後に実績落書きが表示されるように実装する
        アイテム順を再考する

 ok Murasaki_info_fromWalletの更新
        achievementの実装
            必要ない？

 ok 集計情報
        ユーザー数
        石化ユーザー数
        await web3.eth.getBalance(contract_bt.options.address) 
        await web3.eth.getBalance(contract_bv.options.address) 
        await web3.eth.getBalance(address_Staking_Wallet) 

 ok イベント監視システムを構築する
        眺めるようと、bot監視ように。
        event垂れ流しを一般公開するかどうかは難しいところ。
            テキストのストリーミング公開が難しそう
            アクティビティが如実にわかるので冷めそうであるし
        監視対象のコントラクト
            mfsl
            mffg
            mfmf
            mfc
            mfn
            mml
            wd
            (ff)

 ok nuichanのitemIdの再実装検討
        12種類の種類が設けられる場合、237-248を使用して別々のitemIdを当てたほうが良いか
        あるいは, msnにtypeOfSourceパラメータを実装するか
 ok nuiちゃんにclassパラメータを実装する？
        mcのmemoを使うか、storage_nuiに追加するか。
        class値は合成元のfluffyのtypeを継承する
        → memoを実装
        classパラメータに応じてリボンの色を変える
    
 ok ぬいちゃんの再実装
        item id 197から240番台への修正

 ok fluffy upgradeバグの修正

 ok nyuinyuiさんのカウンターの統合
        ロード画面とクラフト画面でカウンターを同じにする

 ok bed中に行動させるとでっかくなるバグの修正
        bedも消えてしまう
        
 ok ステーキング量反映アイテムの修正
        以下のアイテムは現在のステーキング量を反映するものとする
            鳩時計
            金魚鉢
            ネオンちゃん
                ねおんふるっふぃーが必要
            花瓶
        それぞれ３～５段階とする
        → *ネオンちゃんの画面を充実させる

 ok wallet反映アイテムの実装
        age反映アイテム：
            なに？
            → 金魚鉢
        nonce反映アイテム：
            時計の針を進める？
            → 時計

 ok 時計の実装
        nonceの数に応じて長針と短針を動かす
        長針・短針をプログラムで動かす機構を実装する
        
 ok fluffy houseの実装
        fluffyとの接触処理
        クリックでfluffyが飛び出してくる演出
        くっついているfluffyの数に応じた段階絵

 ok fishbowlの実装
        wallet ageに応じて成長させる

 ok fluffyのupgradeの実装
        5アイテムのupgradeの実装

 ok バイバックコントラの洗練
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

 ok 記念撮影用小物
        むらさきさん本体
        おにぎり
       *さつまいも
        ダイス
        バイオリンバッグチャーム
        小さなお花たくさん
        くまさん
        フローリングの床
        ピンクのラグ
        ビットコイン、イーサリアムのレプリカ
        折り紙の本
        アスタートークン
        wallet
        fluffys
        ないないさん
        プレゼントボックス

 ok walletの状態を反映するギミックをもう少し実装する
        所持NFT：photo frame内に表示される
        所持token：tokenChestから出てくる
        nonce：nonceが多いほど変化する何かを考える
            wall stickerはやはりnonceを参照させるか。

 ok fluffyシステムの個数調整
        upgradeの個数調整
            x3 -> x1は安すぎるか？
            fluffy dollがあまりに量産されすぎるのも良くない
            x3 , x4, x5と段階的に上げていっても良いか。
        いずれにしても、要調整だろうか

 ok tokenURIの実装
        svg型tokenURIの解説：
            https://qiita.com/hakumai-iida/items/c96d7c053379f42ba9b8
        svg形式で絵を表示する方法を調べる
        パラメータなどを表示したいが、クラスなどがせいぜいだろうか。
        pngからsvgへの変換、カラー可能
            https://onlineconvertfree.com/ja/convert/png/
        むらさきさんの背景に、Lvやflowerなどを表示させる
            アイコン絵をtokenURIで実装してみたい。
            フルオンチェーンのSBT絵となる。
        jsでwebでそのまま使用可能なコードも併せて用意する。
        2パターン用意する
         ok 1: mmのみで完結するtokenURI
                むらさきさんのsvgにオーバーラップさせて最低限の情報を表示する
                summoner ID, classのみを表示させる
                classはflower名に置換するか
                背景をflower colorにしても良いかもしれない
            2: infoを反映した専用コントラのtokenURI
                成長度を反映させたtokenURI
                パット見てむらさきさんの成長度を視認できる情報はなんであろうか
                    Name, Lv, age, scoreあたりだろうか。
        svg化の手順を把握する：
            https://qiita.com/hakumai-iida/items/c96d7c053379f42ba9b8
            too deep stackをどうやって回避するか。

 ok 実績システムのUI検討
        一旦ボツにしたが、称号や勲章の様にあっても良いだろうか。
        実績によって増える小さななにかを考える。
            ちょうちょ？
            お花？
            小さな宝石？
            壁にくっつくなにか？
        これを見ることでゲームの進捗がすぐわかるように。
            
 ok 実績コントラクトの設計
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

 ok 動作軽量化対策
        fpsを120などに上昇させ、何が重いのか調査する
            全画面画像は重い？
            透過処理画像が重い？
        → 全画面画像が重かった
            phaser3をupdateし、
            かつachvをアイコン化した

 ok バランス調整
     ok item_dcテーブルの調整
            後半のアイテムほど最低dcを大きくする
     ok catインターバルの調整
            5日 → 7日
     ok fluffy必要量の調整
            3個, 4個, 5個？
     ok coin/materialの必要量の調整
            後半のアイテムは3日分→5日分程度へ計算して調整
     ng ffの補正修正
            x2ではなくx1.5程度にする
            → 割り算が困難なため保留
     ok fluffy供給量の調整
            現在のバランスだと0.5日に1個で多すぎるか
            → cat-mailを7dに変更、stakingはmaxは出ないので大丈夫だろうか
            また、fluffy合成コストを上昇、estができにくくなった。

 ok marketコントラクトの修正
        新maに対応させる

 ok priceの係数計算
        10**18で取得されるので整数化する

 ok tokenURIの再実装
        mcのuriにpngへのURLを返すように設定する

 ok Treasuryシステムの刷新
        mint feeの取り扱いと脱ポンジ
            old userのbuybackTreajury分をnew userのmint feeで賄う構図は避ける
            mint feeはbufferVaultへは入れない
            即座にdev wallet, staking wallet, buybackTreasuryへ分割送金する
        資金場所
            BufferVault：コントラクト
                全ての資金は一旦ここに集められる
                Mint feeもここに入れることとする
            BuybackTreajury：コントラクト
                月に1回、資金量を増減させて調整する
                常にactive user数 * amount per user量を確保する
            StakingWallet：EOA
                残りの資金はここに格納される
                dApps stakingへ全額ステークする
                余計なtxは飛ばさないように注意する
            Administrator Wallet：EOA
                全コントラクトの所有権を有する
                必要な時だけ、コントラクトのメンテナンスを行う
                余計なtxは飛ばさないように注意する
            Developer wallet：EOA
                BufferVaultから5% * 2を2つのプライベートwalletへ移動する            
        BufferVaultからの資金移動を関数化する
            Staking wallet -> BufferVaultは事前に手動で行う
            BufferVault <-> BuybackTreajury, 相互移動
            BufferVault -> Developer wallets, 5% x 2
            BufferVault -> Staking Wallet, 残った資金全部, bufferをカラにする
        手順：
            手動でbuybackTreajuryにnot active user数を設定する
                all user - not active user = active user数を算出する
            手動でbufferTreajuryにインフレ率を設定する
                関数でそのインフレ率を達成するために必要なamountを算出する
            手動で不足amount分をstaking walletからbufferTreajuryへ送金する
                不足しないようにインフレ率を設定したいところ
                あるいはインフレ率を達成するamountがbufferに貯まるまで待つ
            コントラで、buffer -> buyback, dev wallets, staking walletへの送金を一度に行う。
                dev wallet: 5%
                buyback: インフレ率を達成する分
                staking: 残り全て
            buybackに余剰資金がある場合は資金を逆流させる
                not active userを設定した直後はbuyback価格が上昇してしまうので、
                このタイミングでbuybackされない機構を考える。

 ok buybackTreajuryの改善
        active userの増減によってはbuyback -> bufferへと移動させることも必要になる
        active user数を取得した上でインフレ率を計算するよう修正する
        手順としては：
            インフレ率を手動で設定
            脱落ユーザー数を手動で集計して設定
            インフレ率に基づいて、buybackTreajury <-> BufferTreajuryの資金移動を行う
                これはコントラクトコードで実装する
            続く処理でbufferTreajuryに残った資金はteamTreajuryへと移動する

 ok コントラクトのuint32修正
        エラーのもとで煩わしいので、全てuintへ置換する
        コードとabiの全置換が必要
    
 ok wallet infoコントラの実装
        web3精神を表すため
        summoner infoとは異なり、情報はある程度吟味してもよいか
        システムがほぼ完成してからで良いだろうか

 ok winner fluffyの演出の実装
        お花つける？
        パーティー帽子？
        パーティクルを使用する？

 ok マーケットルールの改善
        transfer fee導入後はsell即buyのitem移動が発生しうる
        最低listing価格を決めておくか？
            この場合、最低価格よりbuyback価格が低ければ印象が悪いだろう
        0.1 $ASTRぐらいか？
            しかし、0.1 * 0.05 $ASTRでアイテムの移動ができてしまうので、
            list&buyを利用したmulti-walletは防げないだろうか。
        offeringシステムを実装できれば、市場に最低価格を決めてもらうことができる。
        summonerを有するwalletしかマーケットコントラを使えないので、
            コントラをつかったlist&buyボットは使用することはできない。
            手動でも十分だろうが。
        つまり、event監視型の防衛botは運用可能
            最低価格でlistされたものを監視して即座に買い取る防衛型bot
            伝統金融では市場操作になって違法なのだろうが。

 ok crafting windowのUI整理
        crafting中itemの表示周りが弱い
            ウィンドウを閉じるときしか更新しないので、
            なにかの表紙にselect itemになるとずっとそのまま。
            今何を作っているか不明なこともママある。
        crafting中は定期的にselect itemをチェックして書き換える機構を実装する
        また、resumeがあるときは残り時間とアイテム名を表示し続ける
            itemをセレクトしても反映させない
        cancelボタンの配置場所が難しい。

 ok Fluffiestの動作バグ修正
        画面外へ逃げていってしまう。

 ok 発行上限を実装する
        事故防止と、何かしらの希少価値をつけるため。
        初期にadminのみmintする時など。

 ok transfer feeの導入
        https://github.com/ethereum/EIPs/issues/2665
        やはりtransfer feeで複アカの効率をコントロールする戦略が、
            UI的にもわかりやすいだろう
        activationはUIの作り込みが少し面倒。
            あとitem calculationが大変。
            別にactivated count_of_typeの実装が必要
            また、着払いはなんか嫌であるし。
        複アカ使ってでもプレイしたい人は手数料を落としてもらう。
            普通のプレイでは障害にならないfeeであるし。
            もちろん、過剰な複アカのbottingは処罰する
        将来的にopean seaやtofu NFT等を使えるよう、noFee addressの機構を組み込む
        noFee address:
            buybackTreasury
            Market

 ok murasaki_craftのitem移行関数の実装
        next_itemの書き換えの実装
        旧コントラからidを指定して新コントラにmintさせる関数の実装
            制限をゆるくしたcraftを用意する
            この際、item_idは異なっても仕方ないとする
            item_idを指定してこのrecraft関数を叩く関数も用意する
        すべてrecraftし終えたら、最後にnext_itemを修正して完了

 ok msg.sender周りのコードの修正
        もしかしたら、msg.senderはpublic, internal, externalで挙動が変わるのかも
        同じコントラ内でも関数から呼び出される場合は、internalとpublicで中身が違う？
        mining/farmingの数がtx前後で一致しないのはこれが原因だったのか？
            msg.senderをつかってitem_countingしているため。
        実験して把握すること。
        どうやら、viewはmsg.senderが0になってしまうようだ！
            https://medium.com/nayuta-inc/ethereum-solidity%E3%81%AEmsg-sender-f8c34c5653a4
        これを回避するために、ownerはsummonerから逆引きを徹底する
        むしろ、mining/farmingでmsg.senderを使ってしまうと、
            他人のsummonerに自分のwalletのitem補正がかかってしまう。
        一度msg.sender周りのコードを丁寧に洗い出すこと。
            msg.senderの使用はcheck_summoner時以外は極力避ける。
            また、check_summoner時もweb3js側でfrom:walletしていないとmsg.senderが0になる。
            Remixのcallは自動的にfrom:walletが付くためわかりにくかった。
        無用なエラーを避けるため、summoner主体のコードに修正する。
            owner walletから直接叩くfunctionでのみmsg.senderを使う
            むしろ、msg.senderはcheckOwner以外には使わない。

 ok fluffy festivalのバグ修正
        2人目が投票できないバグあり
        isVotableがtrueにならない模様
        msg.senderが原因か？要究明

 ok SBTの規格合わせ
        あまり有名ではないBadgeコードを使っている
        これを所持上限1, non-transferableなERC721とする。
        ERC721を利用したSBT例：
            https://docs.chainstack.com/tutorials/gnosis/simple-soulbound-token-with-remix-and-openzeppelin#create-and-compile-the-soulbound-contract
            _beforeTokenTransferを利用してnon-transferableを実装している
            あとはこれにpossession limit = 1を組み込めば行けるか
        ERC721に実装されていなtokenOfも実装する
            現状、他で使用しているbadge由来のインターフェイスはtokenOfのみ。
            tokenOfさえ実装しておけば、ERC721由来だろうがBadgeだろうが問題なし。

 ok 移行戦略
        mm, ms, mc, mss
        一度新コントラで完全に動作を確認してから、
        旧mm -> 新mmなどとパラメータをコピーする
        mnは再ミントしてもらうこととする。
        手順：
            mcは1つもmintしてはいけない。
            mcはaddress(0)もコンバート可能。何も考えずに1からコンバートする。
            contract_adminを用意
            contract_adminをmcとmsへadd_permitted
            msとmcをコンバート

 ok 新craftボタンの実装
        start, pause, resume, cancel, completeの5つのtxを飛ばす
        start/resume button
            このときcancel buttonを少し離して表示
        pause/complete button

 ok craftingのレジューム機能の実装
        craftカウンターはstart時にのみ決定される
            statusによってカウンターの多さが異なる
        中断時にレベルアップしたとしても、カウンターには影響しない
        カウンターの進みは単純に秒数で減らす
        start時に大量にアイテムを抱えてブーストすることもできるが、
            transfer feeがあるのであまり問題にはならないだろうか。
        calc_craftingは_dcからdelta_secを引いて残り時間を計算している
            つまり、_toResume_dcをmsに記録しておき、
            _toResume_dc>0ならばクラフト途中ということになる。
            あとはstart_craft時に元の_dcの代わりに、
            目減りした_toResume_dcを代入すれば良い。
        上記の機構を実装する。
            また、start -> 中断 -> cancel or resumeを選択させるUIとする。
            つまり、中断中はcancelとresumeの2つのボタンを表示させる。

 ok 存在しないsummoner指定時のバグ修正
        isActive = falseのパターンと
        まだsummonされていないパターンとある
        また、petrifiedの動作もうまくいくか確認する

 ok presentboxを開いた時に少しExpを得られるようにするか
        ちょっとだけ嬉しいように。+50ぐらい。
        1日のEXP量が+1000～2000, 平均+1500ぐらい。
        +50で3%, +100で6%程度。
        +50程度が妥当か。
        presentboxは...
            staking: 1/7d
            mail: 2/5d
            craft: 1/7d
            festival: 1/30d
            = 4/7d, 0.5/dぐらい
        こまめに受け取れば、平均して+1-2% EXP効率がupする程度。
        +100にすると、+3% up程度。
        mpに記録して可変とする。
            ひとまず+50で運用する

 ok summon時の演出の改善
        花火
        on_click()

 ok Level<3でvotingできないことの表示
        →むしろできるようにするか
        Level制限撤廃
    
 ok select itemはlevel 3から表示とする

 ok Fluffy DollのLUK補正の実装
        +0%だった。
        LUK補正　＋　Exp補正　にするか。
        EXP補正+3%はLUK+3.00相当で強力だが、
            クラフトによってLUKが下がるのはあまりよろしくないだろう。
        fluffy dollはfluffy x27個分
        1ヶ月で10-15個とすると、2ヶ月で作成可能
        また、市場で買えばもっと早めに作成可能
            流石に安すぎるだろうか。
            Lvキャップがあるのでバランス崩壊とはならないだろうが。
                +0.4/Lv, +8/20Lvが上限
        x3でup-gradeではなく、x4でup-gradeとするか？
        x3で+33%は破格か？

 ok Fluffy FestivalコントラのEvent実装
        全く作っていなかった
        start_voting
        voting
        end_voting

 ok マーケットルールの改善
        coin/leaf bagは70%しかearnできないようにする
            移動手数料30%
            miner/farmerキャラの抑制
            自分でmining/farmingするインセンティブを大きくする
     ng crafter royaltyの導入を検討する
            platform feeとcrafter royaltyを別に設定する
            しかし、upgrade素材に使われるとcrafter royaltyは消滅するのだが。
            upgradeで生じたitemのcrafterはupgradeしたキャラとなるため。
            fluffy dollについてはcrafter royaltyはある程度有効に働くだろうか。

 ok ランダム住所の導入
        lootlikeの拡張
            320 Martin Ave/St, Tucson, AZ, USA
            house #1, 0x2F7...8805, (Xxx) Ave/St, (Yyy), Astar Network EVM, United Chains of Polkadot, Web3.
        通りの名前と、町の名前の2箇所を考える。

 ig burn周りのコード改善
        burnはpermitted addressなら自由に行えてしまう
            NFTとSBTはユーザーの資産で、運営が全くタッチできない機構にするべき。
            故に設計はシンプルかつ慎重に。
        NFTとSBTについては、ユーザーの資産なので
            ユーザーの許可がないとtransfer, burnできない設計にすることが望ましい。
            運営側がいつでもburn可能な機構を残しておくのは印象が良くない。
            仮に、将来高額の値段がついた際にネックになるし、
            そもそもこういったユーザーがコントロールできない機構のNFTは
            信用が低く価値が上がりにくいだろう。
        ユーザーの許可を必要とするapprove & transferへと改善したいところだが。
            しかしそうすると、upgradeにapproveが必要になってしまう。
            approveのUIをどうするか。
        改善が必要な機構：
            ★ upgrade時のapprove不要のburn
            しかしapproveが必要なfunctionが複数ありUIが阻害される
        ひとまず、add permissionが可能なownerの権限を将来破棄する、という宣言で許してもらうか。
        しかし、やはりNFTが勝手にburnされるのは良くないだろうか。
            一応funcionコントラクトではowner checkはしているのだが。
        別に一点物の絵画のような価値を付与したいのではなく、
            あくまで運営の箱庭内の価値を担保できれば良いと考えるか。

 ok change logの書き方
        https://blog.yux3.net/entry/2017/05/04/035811

 ok SummonページのUIの改善
        最初は寝ている？表示させない？
        summon直後の演出
        Summonウィンドウでの選択はcolorのままで良いか？

 ok Concepts
        What's This?
            Game Dapp on the Astar Network using NTT (SBT, Soul Bound Token) and NFT. 
        What's the Concept?
            Murasaki-san is the digital pet living in your wallet.
            Murasaki-san and the house 
        What is Murasaki-san?
            One day, when I asked a friend to "create an original character that doesn't exist anywhere else", murasaki-san was born on the edge of our sketchbook.
            Well, we all know that the name, Murasaki-san, is a bit strange: murasaki-san means "Mr. Purple" in Japanese.
            My friend first painted this little character purple so we could only call it murasaki-san and we finally ended up naming it "Murasaki-san", even though it's actually a little pink.
            That's why I started creating on a game to move, take care of, and grow murasaki-san. It was just two weeks after Astar Network launched.
            After about a year of development, we are happy to launch House of Murasaki-san on Astar Network :). Cheers to ASTAR!
        How to Play?
            ・Mint your murasaki-san. Attention, it's NOT NFT but or SBT(NTT).
            ・Feeding and Grooming your murasaki-san to ean EXP.
            ・You can Level up your murasaki-san by accumulating EXP.
            ・Work your murasaki-san for Mining to earn Coin or Farming to earn Leaf.
            ・Murasaki-san can Crafting to mint item NFT.
            ・House of murasaki-san will become more and more lively as you continue to take care of your murasaki-san diligently.
        What's the Cost to Start?
            200 $ASTR to mint your murasaki-san.
            The mint price will inflate little by little as the game economy expands.
            (Example: 3% inflation after a month, 206 $ASTR)
        Dapps Staking Bonus!
            There are in-game bonuses depending on the dapps staking amount!
            ・You will get an extra presentbox. The higher the staking amount, the shorter the interval until the gift.
            ・Some items change the picture or animation according to your staking amount.
              Observe carefully, or spoiled below.
        Attention Please!
            Murasaki-san is not NFT but SBT. Cannot be transferred or sold.
            If you leave your character alone for too long, you will receive a penalty.It will cost you to restart.
        Item Market
            Items can be freely bought and sold on the market with 5% commision.
            We have not own token and $ASTR is used as trading currency.
        Easy to Earn?
            
        Game Specifications
            Status Details
            Item Upgrading
            All Item Details
            Lucky Dice System
            Buyback System
            Taking care of other murasaki-san
            About Fluffy: Overview
            About Fluffy: Cat-mail Communication
            About Fluffy: Crafting Bonus
            About Fluffy: Fluffy Festival
            About Fluffy: Dapps Staking Bonus
        More Detailed Specifications
            calculation methods
        Economy Design
            
        Future Plan
            Our top priority is to fix bags and control inflation rate.
            It takes about two years for House of Murasaki-san to reach maximum growth.
            Before that, we planed to create the next product using information of your murasaki-san SBT.
            Since Astar Network supports both EVM and WASM, we are planning to create the next game on WASM with Rust, and interacting this House of Murasaki-san through XCM.
            (Well, the coder is studying rust right now :) )
        Who Are You?
            Ordinary people who like Astar Network and Web3.
            This is our fan project to support Astar blockchain.
            Coder: degupoppo (wallet, twitter)
            Illustrator: fumamo (wallet, twitter)
            Any donation is greatly appreciated :)
        Terms of Service
            botting
            multi-wallet
        Special Thanks
            Kokaon Lab      https://soundeffect-lab.info/
            OtoLogic        https://otologic.jp/
            Simple.css      https://simplecss.org/
            DOVA-SYNDROME   https://dova-s.jp/
        要検討
            ２～３の複数アカウントは制限するか
            直コンは制限するか

 ok コンセプトの整理：簡潔にわかりやすく
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
    local_items = new Array(320).fill(0);
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
    local_myListsAt_withItemTypeAndSubtype = [];
    local_luck_challenge_of_mffg = 0;
    local_luck_challenge_of_mfmf = 0;
    local_luck_challenge_of_mfc = 0;
    local_newsText = ["Peaceful","Today !","","ฅ•ω•ฅ"];
    local_itemIds = [];
    local_wallet_score = 0;
    local_birthplace =  "";
    local_personality =    "";
    local_character =  "";
    local_weakpoint =  "";
    local_scent = "";
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
    //local_class_name = "";
    local_flower = "";
    local_street = "";
    local_city = "";
    local_crafting_resume_flag = 0;
    local_crafting_resume_item_type = 0;
    local_crafting_resume_item_dc = 0;   
    local_total_staking_reward_counter = 0;
    local_achv = new Array(32).fill(false);
    local_nonce = 0;
    local_wallet_age = 0;
    local_achv_onChain_score = 0;
    local_achv_onChain_score_token = 0;
    local_achv_onChain_score_nft = 0;
    local_achv_onChain_score_staking = 0;
    local_achv_onChain_score_murasaki_nft = 0;
    local_exp_rate_twinkle = 0;
    local_mining_perDay = 0;
    local_farming_perDay = 0;

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
    previous_local_blockNumber = 0;
    li_achv = [0];
    
    //---local practice
    local_practice_exp_clarinet = 0;
    local_practice_exp_piano = 0;
    local_practice_exp_violin = 0;
    local_practice_exp_horn = 0;
    local_practice_exp_timpani = 0;
    local_practice_exp_cello = 0;
    local_practice_status = 0;
    local_practice_item_id = 0;
    local_practice_start_time = 0;
    local_practice_level_clarinet = 0;
    local_practice_level_piano = 0;
    local_practice_level_violin = 0;
    local_practice_level_horn = 0;
    local_practice_level_timpani = 0;
    local_practice_level_cello = 0;
    previous_local_practice_item_id = 0;
    
    //---local strolling
    local_strolling_status = 0;
    local_stroll_endable = 0;
    local_total_strolledDistance = 0;
    local_total_strolledDistance_ofCompanion_01 = 0;
    local_total_strolledDistance_ofCompanion_02 = 0;
    local_total_strolledDistance_ofCompanion_03 = 0;
    local_total_metSummoners = 0;
    local_metSummoners_01 = 0;
    local_metSummoners_02 = 0;
    local_metSummoners_03 = 0;
    local_metSummoners_04 = 0;
    local_metSummoners_05 = 0;
    local_total_strolling_direction_01 = 0;
    local_total_strolling_direction_02 = 0;
    local_total_strolling_direction_03 = 0;
    local_total_strolling_direction_04 = 0;
    local_total_strolling_companion_01 = 0;
    local_total_strolling_companion_02 = 0;
    local_total_strolling_companion_03 = 0;
    local_stroll_level = 0;
    local_met_level = 0;
    local_direction = 0;
    local_companion = 0;
    local_strollingDistance = 0;
    local_reminingSec = 0;
    local_coolingSec = 0;
    local_strollEndable = 0;
    
    //---local etc
    turn = 0;
    local_coin_calc = 0;
    local_material_calc = 0;
    local_crafting_calc = -1;
    bgm = 0;
    local_items_flag = new Array(320).fill(0);
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
    active_nui_score = 0;
    active_nui_exp_rate = 0;
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
    local_astar_priceChange_h24 = 0;
    local_staking_percent = 0;
    local_house_price = 0;
    local_isTrial = -1; //-1 -> not defined, 0 -> regular, 1 -> trial
    gamemode = "";
    tx_counts = [0,0,0];
    tx_counts_forPinwheel = 0;
    local_check_pippel = 0;
    local_pippel_score = 0;
    previous_local_pippel_score = 0;

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
    flag_syncNow = 0;
    flag_fluffy_house_click = 0;
    flag_mogumogu = 0;
    flag_firstCelebration = localStorage.getItem("flag_firstCelebration");
    flag_summoner_specified = 0;
    
    //---pointer
    pointer_x = 0;
    pointer_y = 0;
    
    //---localStorage
    try {
        let _json = localStorage.getItem("flowerCount_inGame");
        localStorage_flowerCount = JSON.parse(_json);
    } catch (err) {
        localStorage_flowerCount = 0;
    }
}

init_global_variants();


//===html===========================================================================================


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
    summoner = Number(paramArray.summoner);
    flag_summoner_specified = 1;
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

/*
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
*/

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


//===web3====================================================================================


//---update

//call myListsAt_withItemType
async function get_myListsAt_withItemType(_wallet) {
    if (gamemode == "regular") {
        let myListLength = await contract_mc_wss.methods.myListLength(_wallet).call();
        let myListsAt_withItemType = await contract_mc_wss.methods.myListsAt_withItemType(_wallet, 0, myListLength).call();
        return myListsAt_withItemType;
    } else if (gamemode == "trial" || gamemode == "not_summoned") {
        let myListLength = await contract_trial_mc_wss.methods.myListLength(_wallet).call();
        let myListsAt_withItemType = await contract_trial_mc_wss.methods.myListsAt_withItemType(_wallet, 0, myListLength).call();
        return myListsAt_withItemType;
    }
}

//call myListsAt_withItemTypeAndSubtype
async function get_myListsAt_withItemTypeAndSubtype(_wallet) {
    if (gamemode == "regular") {
        let myListLength = await contract_mc_wss.methods.myListLength(_wallet).call();
        let myListsAt_withItemType = await contract_mc_wss.methods.myListsAt_withItemTypeAndSubtype(_wallet, 0, myListLength).call();
        return myListsAt_withItemType;
    } else if (gamemode == "trial" || gamemode == "not_summoned") {
        let myListLength = await contract_trial_mc_wss.methods.myListLength(_wallet).call();
        let myListsAt_withItemType = await contract_trial_mc_wss.methods.myListsAt_withItemTypeAndSubtype(_wallet, 0, myListLength).call();
        return myListsAt_withItemType;
    }
}

//generate allItemBalance from myListsAt_withItemType
function get_allItemBalance_from_allItemId_withItemType(_allItemId_withItemType) {
    let allItemBalance = Array(320).fill(0);
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

//get item_type from item_id
function get_itemType(_myListsAt_withItemType, _itemId_target) {
    for (i = 0; i < _myListsAt_withItemType.length; i += 2) {
        let _itemId = _myListsAt_withItemType[i];
        let _itemType = _myListsAt_withItemType[i+1];
        if (_itemId == _itemId_target) {
            return _itemType;
        }
    }
    return 0;
}

//generate upgradable item ids list
//return: [ [fromItemType, toItemType, [itemId1, 2, 3]], []...]
function get_upgradable_itemIds2(_myListsAt_withItemType) {
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
    //or when fluffy, ids >= 5, when fluffier, >=4, when fluffiest, >=3
    let _res = {};
    Object.keys(_dict).forEach(__itemType => {
        if (
            (__itemType <= 128 && _dict[__itemType].length >= 3)
            || (201 <= __itemType && __itemType <= 212 && _dict[__itemType].length >= 5)
            || (213 <= __itemType && __itemType <= 224 && _dict[__itemType].length >= 4)
            || (225 <= __itemType && __itemType <= 236 && _dict[__itemType].length >= 3)
        ) {
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
    
    //call info from chain, try&catch
    let _all_static_status = 0;
    try {

        if (gamemode == "regular") {
            _all_static_status = await contract_info_wss.methods.allStaticStatus(_summoner).call({from:wallet});
        } else if (gamemode == "trial") {
            _all_static_status = await contract_trial_info_wss.methods.allStaticStatus(_summoner).call({from:wallet});
        }

    } catch(error) {
        console.log("***ERROR***: update_static_status");
    }
    if (_all_static_status == 0) {
        local_isActive = false;
        return 0;
    }

    //class, owner, name
    local_class =       Number(_all_static_status[0]);
    local_owner =       _all_static_status[1];
    local_name_str =    _all_static_status[2];
    local_price =       _all_static_status[5];
    
    //when trial, local_price = regular price, override
    if (gamemode == "trial") {
        local_price = await contract_info.methods.price().call();
    }

    //lootlike
    let _res = _all_static_status[3];
    local_birthplace =  _res[0];
    local_personality =    _res[1];
    local_character =  _res[2];
    local_weakpoint =  _res[3];
    local_scent = _res[4];
    local_flower =      _res[5];
    local_street =      _res[6];
    local_city =        _res[7];

    //call speed
    SPEED = Number(_all_static_status[4])/100;
    
    //STAKING_REWARD_SEC
    STAKING_REWARD_SEC = Number(_all_static_status[6]);
    
    //ELECTED_FLUFFY_TYPE
    ELECTED_FLUFFY_TYPE = Number(_all_static_status[7]);
    
    //isTrial   -> defined depends on summoner type
    //local_isTrial = Number(_all_static_status[8]);
    
    //calc wallet score
    //update_local_wallet_score();
    
    //call wallet age
    update_wallet_age(local_owner);
}


//### dynamic
function get_myListstAt_withItemType_from_withItemTypeAndSubtype(_myListstAt_withItemTypeAndSubtype) {
    let _myListstAt_withItemType = [];
    for (let i=0; i<_myListstAt_withItemTypeAndSubtype.length; i+=3){
        _myListstAt_withItemType.push(Number(_myListstAt_withItemTypeAndSubtype[i]));
        _myListstAt_withItemType.push(Number(_myListstAt_withItemTypeAndSubtype[i+1]));
    }
    return _myListstAt_withItemType;
}
async function contract_update_dynamic_status(_summoner) {

    let _start = Date.now();

    //check summoner
    if (_summoner == 0) {
        count_sync += 1;
        return 0;
    }
    
    // check wallet unlock
    /*
    let _walletNow = await web3.eth.getAccounts();
    if (_walletNow.length == 0) {
        return 0;
    }
    */

    let _res;

    //call item
    /*
    let _myListsAt_withItemType = 0;
    try {
        _myListsAt_withItemType = await get_myListsAt_withItemType(local_owner);
    } catch(error) {
        console.log("***ERROR***: update_dynamic_status, call item");
    }
    if (_myListsAt_withItemType === 0) {
        console.log("***ERROR***: _myListsAt_withItemType == 0")
        return 0;
    }
    */
    let _myListsAt_withItemType = 0;
    let _myListsAt_withItemTypeAndSubtype = 0;
    try {
        _myListsAt_withItemTypeAndSubtype = await get_myListsAt_withItemTypeAndSubtype(local_owner);
        _myListsAt_withItemType = get_myListstAt_withItemType_from_withItemTypeAndSubtype(_myListsAt_withItemTypeAndSubtype);
    } catch(error) {
        console.log("***ERROR***: update_dynamic_status, call item");
    }
    if (_myListsAt_withItemType === 0) {
        console.log("***ERROR***: _myListsAt_withItemType == 0")
        return 0;
    }

    //generate and update local item info
    local_myListsAt_withItemType = _myListsAt_withItemType;
    local_myListsAt_withItemTypeAndSubtype = _myListsAt_withItemTypeAndSubtype;
    let _allItemBalance = get_allItemBalance_from_allItemId_withItemType(_myListsAt_withItemType);
    local_items = _allItemBalance;
    local_itemIds = get_itemIds(_myListsAt_withItemType);

    //update fluffy count, not score
    let _count = 0;
    for (i=201; i<=248; i++) {
        _count += local_items[i];
    }
    local_fluffy_count = _count;

    //***TODO*** debug flag
    if (flag_debug == 1) {
        for (let i = 1; i <= 64; i++) {
            local_items[i] += 1;
        }
        local_wallet_age = 5;
        local_score = 500000;
    } else if (flag_debug == 2) {
        for (let i = 65; i <= 128; i++) {
            local_items[i] += 1;
        }
        local_wallet_age = 10;
        local_score = 1000000;
    } else if (flag_debug == 3) {
        for (let i = 129; i <= 192; i++) {
            local_items[i] += 1;
        }
        local_wallet_age = 20;
        local_score = 2200000;
    } else if (flag_debug == 4) {
        local_items[41] += 1;
    }
    
    //***todo*** debug item
    local_items[28] += 1;
    local_items[44] += 1;
    local_items[11] += 1;
    local_items[42] += 1;

    //call dynamic status from chain
    let _all_dynamic_status = 0;
    try {
        if (gamemode == "regular") {
            _all_dynamic_status = await contract_info_wss.methods.allDynamicStatus(_summoner).call({from:wallet});
        } else if (gamemode == "trial") {
            _all_dynamic_status = await contract_trial_info_wss.methods.allDynamicStatus(_summoner).call({from:wallet});
        }
    } catch(error) {
        console.log("***ERROR***: update_dynamic_status, call status");
    }
    if (_all_dynamic_status === 0) {
        console.log("***ERROR***: _all_dynamic_status == 0")
        return 0;
    }
    
    //call achievement
    local_achv = await call_achv(_summoner);
    
    //update local status

    //wallet
    local_wallet = wallet;

    //call and update nonce
    update_nonce(local_wallet);
        
    //blocknumber
    local_blockNumber = Number(_all_dynamic_status[0]);
    //update txCount
    if (previous_local_blockNumber != local_blockNumber) {
        update_txCount();
        previous_local_blockNumber = local_blockNumber;
    }
    
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
    //local_mining_status =       Number(_all_dynamic_status[13]);
    local_mining_start_time =   Number(_all_dynamic_status[14]);
    //local_farming_status =      Number(_all_dynamic_status[15]);
    local_farming_start_time =  Number(_all_dynamic_status[16]);
    //local_crafting_status =     Number(_all_dynamic_status[17]);
    local_crafting_start_time = Number(_all_dynamic_status[18]);
    local_crafting_item_type =  Number(_all_dynamic_status[19]);
    local_working_status = Number(_all_dynamic_status[86]);
    if (local_working_status == 0) {
        local_mining_status = 0;
        local_farming_status = 0;
        local_crafting_status = 0;
        local_practice_status = 0;
        local_strolling_status = 0;
    } else if (local_working_status == 1) {
        local_mining_status = 1;
        local_farming_status = 0;
        local_crafting_status = 0;
        local_practice_status = 0;
        local_strolling_status = 0;
    } else if (local_working_status == 2) {
        local_mining_status = 0;
        local_farming_status = 1;
        local_crafting_status = 0;
        local_practice_status = 0;
        local_strolling_status = 0;
    } else if (local_working_status == 3) {
        local_mining_status = 0;
        local_farming_status = 0;
        local_crafting_status = 1;
        local_practice_status = 0;
        local_strolling_status = 0;
    } else if (local_working_status == 4) {
        local_mining_status = 0;
        local_farming_status = 0;
        local_crafting_status = 0;
        local_practice_status = 1;
        local_strolling_status = 0;
    } else if (local_working_status == 5) {
        local_mining_status = 0;
        local_farming_status = 0;
        local_crafting_status = 0;
        local_practice_status = 0;
        local_strolling_status = 1;
        contract_update_stroll_info(_summoner);
    }

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
    local_total_staking_reward_counter = Number(_all_dynamic_status[59]);
    
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
    
    //crafting resume
    local_crafting_resume_flag = Number(_all_dynamic_status[61]);
    local_crafting_resume_item_type = Number(_all_dynamic_status[62]);
    local_crafting_resume_item_dc = Number(_all_dynamic_status[63]);
    
    //achievement_onChain
    local_achv_onChain_score = Number(_all_dynamic_status[64]);
    local_achv_onChain_score_token = Number(_all_dynamic_status[65]);
    local_achv_onChain_score_nft = Number(_all_dynamic_status[66]);
    local_achv_onChain_score_staking = Number(_all_dynamic_status[67]);
    local_achv_onChain_score_murasaki_nft = Number(_all_dynamic_status[68]);
    
    //practice
    local_practice_exp_clarinet = Number(_all_dynamic_status[69]);
    local_practice_exp_piano = Number(_all_dynamic_status[70]);
    local_practice_exp_violin = Number(_all_dynamic_status[71]);
    local_practice_exp_horn = Number(_all_dynamic_status[72]);
    local_practice_exp_timpani = Number(_all_dynamic_status[73]);
    local_practice_exp_cello = Number(_all_dynamic_status[74]);
    //local_practice_status = Number(_all_dynamic_status[75]);
    local_practice_item_id = Number(_all_dynamic_status[76]);
    local_practice_start_time = Number(_all_dynamic_status[77]);
    local_practice_level_clarinet = Number(_all_dynamic_status[78]);
    local_practice_level_piano = Number(_all_dynamic_status[79]);
    local_practice_level_violin = Number(_all_dynamic_status[80]);
    local_practice_level_horn = Number(_all_dynamic_status[81]);
    local_practice_level_timpani = Number(_all_dynamic_status[82]);
    local_practice_level_cello = Number(_all_dynamic_status[83]);
    
    //staking
    local_staking_reward_percent = Number(_all_dynamic_status[84]);
    
    //twinkle exp boost
    local_exp_rate_twinkle = Number(_all_dynamic_status[85]);
    
    //stroll
    local_stroll_total_strolledDistance = Number(_all_dynamic_status[87]);
    local_stroll_total_metSummoners = Number(_all_dynamic_status[88]);
    //local_stroll_endable = Number(_all_dynamic_status[89]);
    
    //pippel
    local_check_pippel = Number(_all_dynamic_status[94]);
    local_pippel_score = Number(_all_dynamic_status[95]);
    
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
            //let _item_name = array_item_name[_value];
            let _item_name = dic_items_reverse[_value];
            _content1 = "Crafted";
            _content2 = _item_name;
            _content2 += " !!";
        } else if (_name == "Open_Mail") {
            _summoner_from_name = await call_name_from_summoner(_value);
            if (_summoner_from_name == "") {
                _summoner_from_name = "#" + _value;
            }
            _content1 = "Got Mail from";
            _content2 = _summoner_from_name;
            _content2 += " !";
        }
        _resText[2] = _content1;
        _resText[3] = _content2;
    }
    local_newsText = _resText;
}

//### festival
async function contract_update_festival_info(_summoner) {
    if (summoner == 0) {
        return 0;
    }
    //call
    let _festival_info = 0;
    try {
        if (gamemode == "regular") {
            _festival_info = await contract_ff_wss.methods.get_info(_summoner).call({from:wallet});    
        } else if (gamemode == "trial") {
            _festival_info = await contract_trial_ff_wss.methods.get_info(_summoner).call({from:wallet});    
        }
    } catch(error) {
        console.log("***ERROR***: update_festival_info");
    }
    if (_festival_info == 0) {
        return 0;
    }
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

//### stroll
async function contract_update_stroll_info(_summoner) {
    if (summoner == 0) {
        return 0;
    }
    //call
    let _stroll_info = 0;
    try {
        if (gamemode == "regular") {
            _stroll_info = await contract_st_wss.methods.get_strollInfo(_summoner).call({from:wallet});
        }
    } catch(error) {
        console.log("***ERROR***: update_stroll_info");
    }
    //update local
    local_total_strolledDistance = Number(_stroll_info[1]);
    local_total_strolledDistance_ofCompanion_01 = Number(_stroll_info[2]);
    local_total_strolledDistance_ofCompanion_02 = Number(_stroll_info[3]);
    local_total_strolledDistance_ofCompanion_03 = Number(_stroll_info[4]);
    local_total_metSummoners = Number(_stroll_info[5]);
    local_metSummoners_01 = Number(_stroll_info[6]);
    local_metSummoners_02 = Number(_stroll_info[7]);
    local_metSummoners_03 = Number(_stroll_info[8]);
    local_metSummoners_04 = Number(_stroll_info[9]);
    local_metSummoners_05 = Number(_stroll_info[10]);
    local_total_strolling_direction_01 = Number(_stroll_info[11]);
    local_total_strolling_direction_02 = Number(_stroll_info[12]);
    local_total_strolling_direction_03 = Number(_stroll_info[13]);
    local_total_strolling_direction_04 = Number(_stroll_info[14]);
    local_total_strolling_companion_01 = Number(_stroll_info[15]);
    local_total_strolling_companion_02 = Number(_stroll_info[16]);
    local_total_strolling_companion_03 = Number(_stroll_info[17]);
    local_stroll_level = Number(_stroll_info[18]);
    local_met_level = Number(_stroll_info[19]);
    local_direction = Number(_stroll_info[20]);
    local_companion = Number(_stroll_info[21]);
    local_reminingSec = Number(_stroll_info[22]);
    local_strollingDistance = Number(_stroll_info[23]);
    local_strollEndable = Number(_stroll_info[24]);
    local_coolingSec = Number(_stroll_info[25]);
}

//---call

//call mail detail
async function contract_callMailDetail(_summoner){
    if (gamemode == "trial") {return 0};
    let _mail_id = await contract_mml_wss.methods.receiving(_summoner).call();
    let _mail = await contract_mml_wss.methods.mails(_mail_id).call();
    let _summoner_from_id = _mail[2];
    let _summoner_from_name = await contract_mfs_wss.methods.call_name_from_summoner(_summoner_from_id).call();
    return [_summoner_from_id, _summoner_from_name];
}

//get item_nui, summoner and score
async function contract_get_item_nui(_item) {
    if (gamemode == "trial") {return 0};
    let _summoner_of_nui = await contract_msn_wss.methods.summoner(_item).call();
    let _class = await contract_msn_wss.methods.class(_item).call();
    let _score = await contract_msn_wss.methods.score(_item).call();
    let _exp_rate = await contract_mfs_wss.methods.calc_exp_addition_rate_from_nui(summoner, _item).call();
    let __item = await contract_mc_wss.methods.items(_item).call();
    let _memo = __item.memo;
    return [_summoner_of_nui, _class, _score, _exp_rate, _memo];
}

//call name from summoner id
async function call_name_from_summoner(_summoner) {
    if (gamemode == "regular") {
        let _name = await contract_mfs_wss.methods.call_name_from_summoner(_summoner).call();
        return _name;
    } else if (gamemode == "trial") {
        let _name = await contract_trial_mfs_wss.methods.call_name_from_summoner(_summoner).call();
        return _name;
    }
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
    //when summoner is specified by url, do not update
    if (flag_summoner_specified == 1){
        gamemode = "regular";
    //only when summoner is not specified by url
    } else if (flag_summoner_specified == 0) {
        let _summoner = await contract_mm_wss.methods.tokenOf(wallet).call();
        _summoner = Number(_summoner);
        let _trial_summoner = await contract_trial_mm_wss.methods.tokenOf(wallet).call();
        _trial_summoner = Number(_trial_summoner);
        if (_trial_summoner > 0) {
            gamemode = "trial";
            summoner = _trial_summoner;
        } else if (_summoner > 0) {
            gamemode = "regular";
            summoner = _summoner;
        } else {
            gamemode = "trial";
            summoner = 0;
        }
    }
    /*
    if (summoner <= 0) {
        summoner = await contract_mm_wss.methods.tokenOf(wallet).call();  //have not summoned yet: 0
        summoner = Number(summoner);
    }
    */
}

//###wallet age

//get nonce
async function contract_get_nonce(_wallet_address) {
    let _nonce = await web3wss.eth.getTransactionCount(_wallet_address);
    return Number(_nonce);
}

//update nonce
async function update_nonce(wallet_address) {
    local_nonce = await contract_get_nonce(wallet_address);
}

//get wallet month age
async function contract_get_age(_wallet_address) {
    let _lastBlock = await web3wss.eth.getBlockNumber();
    let _age = 1;
    //2592000 block/mo, 1block/12sec
    //for (let i = _lastBlock; i >= 216000; i -= 216000) {
    for (let i = _lastBlock; i >= 2592000; i -= 2592000) {
        let _transactionCount;
        // for "state already discarded for BlockID:" error, try&catch
        try {
            _transactionCount = await web3.eth.getTransactionCount(_wallet_address, i);
        } catch(error) {
            _transactionCount = 0;
        }
        if (_transactionCount > 0) {
            _age += 1;
        } else {
            return _age;
        }
    }
    return _age;        
}

//update wallet age
async function update_wallet_age(_wallet_address) {
    local_wallet_age = await contract_get_age(_wallet_address);
}

//calc wallet_score
//score = nonce, max_score = 150 nonce/mo
//1mo = 150, 6mo = 900, 12mo = 1800, 24mo = 3600
//12step = <300, <600, <900, <1200, <1500, <1800, <2100, <2400, <2700, <3000, <3300, 3300<=
async function calc_wallet_score(wallet_address) {
    let _nonce = await contract_get_nonce(wallet_address);
    local_nonce = _nonce;
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
    if (gamemode == "regular") {
        let item_dc = await contract_mfc_wss.methods.get_item_dc(item_type).call();
        return item_dc;
    } else if (gamemode == "trial") {
        let item_dc = await contract_trial_mfc_wss.methods.get_item_dc(item_type).call();
        return item_dc;
    }
}
async function contract_get_modified_dc(_summoner, _item_type) {
    if (gamemode == "regular") {
        let _modified_dc = await contract_mfc_wss.methods.get_modified_dc(_summoner, _item_type).call();
        return _modified_dc;
    } else if (gamemode == "trial") {
        let _modified_dc = await contract_trial_mfc_wss.methods.get_modified_dc(_summoner, _item_type).call();
        return _modified_dc;
    }
}

//get_userItems
function get_userItems(_target_item_type) {
    return get_itemIds_from_itemType(local_myListsAt_withItemType, _target_item_type);
}

//call presentbox info

//call item info
async function call_item_info(_itemId) {
    if (gamemode == "regular") {
        let _item = await contract_mc_wss.methods.items(_itemId).call();
        return _item;   //object
    } else if (gamemode == "trial") {
        let _item = await contract_trial_mc_wss.methods.items(_itemId).call();
        return _item;   //object
    }
}

//call achievement
async function call_achv(_summoner) {
    if (gamemode == "regular") {
        let _achv = await contract_mfa_wss.methods.get_achievement(_summoner).call();
        return _achv;
    } else if (gamemode == "trial") {
        let _achv = await contract_trial_mfa_wss.methods.get_achievement(_summoner).call();
        return _achv;
    }
}

//update achievement
async function update_achv() {
    for (i=1; i<=20; i++) {
        if(local_achv[i] == true) {
            li_achv[i].visible = true;
        }
    }
};

//call AstarCats
async function call_AstarCats() {
    let _tokenID = 1000 + Math.floor(Math.random() * 6777);
    let _tokenURI = await contract_AstarCats.methods.tokenURI(_tokenID).call();
    let _json;
    await fetch(_tokenURI)
        .then(response => {
           return response.json();
        })
        .then(jsondata => {_json = jsondata});
    let _imageURI = _json.image;
    return _imageURI;
}

/*
//call AstarDegens
async function call_AstarDegens() {
    let _tokenID = 1000 + Math.floor(Math.random() * 10000);
    let _tokenURI = await contract_AstarDegens.methods.tokenURI(_tokenID).call();
    console.log(_tokenURI);
    let _json;
    await fetch(_tokenURI)
        .then(response => {
           return response.json();
        })
        .then(jsondata => {_json = jsondata});
    let _imageURI = _json.image;
    return _imageURI;
}

//call AstarSignWitch
async function call_AstarSignWitch() {
    let _tokenID = 1000 + Math.floor(Math.random() * 10000);
    let _tokenURI = await contract_AstarSignWitch.methods.tokenURI(_tokenID).call();
    console.log(_tokenURI);
    let _json;
    await fetch(_tokenURI)
        .then(response => {
           return response.json();
        })
        .then(jsondata => {_json = jsondata});
    let _imageURI = _json.image;
    return _imageURI;
}
*/

//get nft url
async function get_nft_url() {
    /*
    let _rd = Math.floor(Math.random() * 3);
    let _url;
    if (_rd == 0) {
        _url = await call_AstarCats();
    } else if (_rd == 1) {
        _url = await call_AstarDegens();
    } else {
        _url = await call_AstarSignWitch();
    }
    console.log(_rd, _url);
    return _url;
    */
    let _url = await call_AstarCats();
    return _url;
}

//calc house price
async function update_house_price() {
    if (gamemode == "trial") {return 0};
    let _buybackPrice_asArray = await contract_bt.methods.calc_buybackPrice_asArray().call();
    let _house_price = 0;
    //basic item
    for (i=1; i<=16; i++) {
        _house_price += local_items[i] * _buybackPrice_asArray[i];
        _house_price += local_items[i+64] * _buybackPrice_asArray[i] *3;
        _house_price += local_items[i+64+64] * _buybackPrice_asArray[i] *3 *3;
        _house_price += local_items[i+16] * _buybackPrice_asArray[i];
        _house_price += local_items[i+16+64] * _buybackPrice_asArray[i] *3;
        _house_price += local_items[i+16+64+64] * _buybackPrice_asArray[i] *3 *3;
        _house_price += local_items[i+16+16] * _buybackPrice_asArray[i];
        _house_price += local_items[i+16+16+64] * _buybackPrice_asArray[i] *3;
        _house_price += local_items[i+16+16+64+64] * _buybackPrice_asArray[i] *3 *3;
    }
    //fluffy
    for (i=1; i<=12; i++) {
        _house_price += local_items[200+i] * _buybackPrice_asArray[21];
        _house_price += local_items[212+i] * _buybackPrice_asArray[22];
        _house_price += local_items[224+i] * _buybackPrice_asArray[23];
        _house_price += local_items[236+i] * _buybackPrice_asArray[24];
    }
    _house_price /= 10**18; //wei -> eth
    _house_price = Math.floor(_house_price*100)/100;    //2 decimal places
    local_house_price = _house_price;
}

//get_earn_perDay
async function update_mining_perDay(_summoner) {
    let _res;
    if (gamemode == "regular") {
        _res = await contract_mfmf_wss.methods.calc_mining_perDay(_summoner).call();
    } else if (gamemode == "trial") {
        _res = await contract_trial_mfmf_wss.methods.calc_mining_perDay(_summoner).call();
    }
    local_mining_perDay = _res;
}
async function update_farming_perDay(_summoner) {
    let _res;
    if (gamemode == "regular") {
        _res = await contract_mfmf_wss.methods.calc_farming_perDay(_summoner).call();
    } else if (gamemode == "trial") {
        _res = await contract_trial_mfmf_wss.methods.calc_farming_perDay(_summoner).call();
    }
    local_farming_perDay = _res;
}


//---send

//summon
async function contract_summon(_class) {
    if (gamemode == "regular") {
        let _price = await contract_mp.methods.PRICE().call();
        _price = Number(_price);
        contract_mfsl.methods.summon(_class).send({from:wallet, value:_price})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        let _price = await contract_trial_mp.methods.PRICE().call();
        _price = Number(_price);
        contract_trial_mfsl.methods.summon(_class).send({from:wallet, value:_price})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//convert
async function contract_convert() {
    if (gamemode == "regular") {
        return 0;
    } else if (gamemode == "trial") {
        let _price = await contract_mp.methods.PRICE().call();
        _price = Number(_price);
        contract_trial_tc.methods.converting_summon().send({from:wallet, value: _price})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//cure petrification
async function contract_curePetrification(_summoner) {
    if (gamemode == "regular") {
        let _price = await contract_mp.methods.PRICE().call();
        _price = Number(_price);
        contract_mffg.methods.cure_petrification(_summoner).send({from:wallet, value:_price})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        let _price = await contract_trial_mp.methods.PRICE().call();
        _price = Number(_price);
        contract_trial_mffg.methods.cure_petrification(_summoner).send({from:wallet, value:_price})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//burn
async function contract_burn(_summoner) {
    if (gamemode == "regular") {
        contract_mfsl.methods.burn(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfsl.methods.burn(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//levelup
async function contract_level_up(_summoner) {
    if (gamemode == "regular") {
        contract_mfsl.methods.level_up(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfsl.methods.level_up(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//feeding
async function contract_feeding(_summoner) {
    if (_summoner == 0) {
        return 0;
    }
    if (gamemode == "regular") {
        contract_mffg.methods.feeding(_summoner, active_nui_id).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => {
                update_tx_text("done", receipt.transactionHash);
                flag_syncNow=1;
            });
    } else if (gamemode == "trial") {
        contract_trial_mffg.methods.feeding(_summoner, active_nui_id).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => {
                update_tx_text("done", receipt.transactionHash);
                flag_syncNow=1;
            });
    }
}

//grooming
async function contract_grooming(_summoner) {
    if (gamemode == "regular") {
        contract_mffg.methods.grooming(_summoner, active_nui_id).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => {
                update_tx_text("done", receipt.transactionHash);
                flag_syncNow=1;
            });
    } else if (gamemode == "trial") {
        contract_trial_mffg.methods.grooming(_summoner, active_nui_id).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => {
                update_tx_text("done", receipt.transactionHash);
                flag_syncNow=1;
            });
    }
}

//mining
async function contract_mining(_summoner) {
    if (gamemode == "regular") {
        if (local_mining_status == 0) {
            contract_mfmf.methods.start_mining(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }else {
            contract_mfmf.methods.stop_mining(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if (local_mining_status == 0) {
            contract_trial_mfmf.methods.start_mining(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }else {
            contract_trial_mfmf.methods.stop_mining(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//farming
async function contract_farming(_summoner) {
    if (gamemode == "regular") {
        if (local_farming_status == 0) {
            contract_mfmf.methods.start_farming(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        } else {
            contract_mfmf.methods.stop_farming(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if (local_farming_status == 0) {
            contract_trial_mfmf.methods.start_farming(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        } else {
            contract_trial_mfmf.methods.stop_farming(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//crafting, New
async function contract_start_crafting(_summoner, _item_type) {
    if (gamemode == "regular") {
        contract_mfc.methods.start_crafting(_summoner, _item_type).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc.methods.start_crafting(_summoner, _item_type).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
async function contract_pause_crafting(_summoner) {
    if (gamemode == "regular") {
        contract_mfc.methods.pause_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc.methods.pause_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
async function contract_resume_crafting(_summoner) {
    if (gamemode == "regular") {
        contract_mfc.methods.resume_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc.methods.resume_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
async function contract_cancel_crafting(_summoner) {
    if (gamemode == "regular") {
        contract_mfc.methods.cancel_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc.methods.cancel_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
async function contract_complete_crafting(_summoner) {
    if (gamemode == "regular") {
        contract_mfc.methods.complete_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc.methods.complete_crafting(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//send mail
async function contract_send_mail(_summoner, _item_mail) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_mml.methods.send_mail(_summoner, _item_mail).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_mml.methods.send_mail(_summoner, _item_mail).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//open mail
async function contract_open_mail(_summoner) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_mml.methods.open_mail(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_mml.methods.open_mail(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//mint name
async function contract_mint_name(_summoner, _name_str) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_mfn.methods.mint(_summoner, _name_str).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_mfn.methods.mint(_summoner, _name_str).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//burn name
async function contract_burn_name(_summoner) {
    if (gamemode == "regular") {
        contract_mfn.methods.burn(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfn.methods.burn(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//unpack_bag
async function unpack_bag(_summoner, _item) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_mfc2.methods.unpack_bag(_summoner, _item).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_mfc2.methods.unpack_bag(_summoner, _item).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//dice_roll
async function dice_roll(_summoner) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_md.methods.dice_roll(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_md.methods.dice_roll(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//upgrade
async function upgrade_item(_summoner, _itemId1, _itemId2, _itemId3) {
    if (gamemode == "regular") {
        contract_mfc2.methods.upgrade_item(_summoner, _itemId1, _itemId2, _itemId3).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc2.methods.upgrade_item(_summoner, _itemId1, _itemId2, _itemId3).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//upgrade_to_fluffier
async function upgrade_fluffy2fluffier(_summoner, _itemId1, _itemId2, _itemId3, _itemId4, _itemId5) {
    if (gamemode == "regular") {
        contract_mfc2.methods.upgrade_fluffy(_summoner, _itemId1, _itemId2, _itemId3, _itemId4, _itemId5).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc2.methods.upgrade_fluffy(_summoner, _itemId1, _itemId2, _itemId3, _itemId4, _itemId5).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
async function upgrade_fluffier2fluffiest(_summoner, _itemId1, _itemId2, _itemId3, _itemId4) {
    if (gamemode == "regular") {
        contract_mfc2.methods.upgrade_fluffy(_summoner, _itemId1, _itemId2, _itemId3, _itemId4, 0).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc2.methods.upgrade_fluffy(_summoner, _itemId1, _itemId2, _itemId3, _itemId4, 0).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
async function upgrade_fluffiest2doll(_summoner, _itemId1, _itemId2, _itemId3) {
    if (gamemode == "regular") {
        contract_mfc2.methods.upgrade_fluffy(_summoner, _itemId1, _itemId2, _itemId3, 0, 0).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfc2.methods.upgrade_fluffy(_summoner, _itemId1, _itemId2, _itemId3, 0, 0).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//open presentbox
async function open_presentbox(_summoner, _itemId) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_mfc2.methods.open_presentbox(_summoner, _itemId).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_mfc2.methods.open_presentbox(_summoner, _itemId).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//voting
async function contract_voting(_summoner, _select) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_ff.methods.voting(_summoner, _select).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_ff.methods.voting(_summoner, _select).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//end_voting
async function contract_end_voting(_summoner) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_ff.methods.end_voting(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_ff.methods.end_voting(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//practice
async function contract_start_practice(_summoner, _item_id) {
    if (gamemode == "regular") {
        contract_mfp.methods.start_practice(_summoner, _item_id).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfp.methods.start_practice(_summoner, _item_id).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
async function contract_stop_practice(_summoner) {
    if (gamemode == "regular") {
        contract_mfp.methods.stop_practice(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    } else if (gamemode == "trial") {
        contract_trial_mfp.methods.stop_practice(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}

//open open_staking_reward
async function open_staking_reward(_summoner) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_mfst.methods.open_staking_reward(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    } else if (gamemode == "trial") {
        if(wallet == local_owner) {
            contract_trial_mfst.methods.open_staking_reward(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}

//stroll
async function contract_start_stroll(_summoner, _direction, _companion, _drink) {
    if (gamemode == "regular") {
        contract_st.methods.startStroll(_summoner, _direction, _companion, _drink).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}
async function contract_end_stroll(_summoner) {
    if (gamemode == "regular") {
        contract_st.methods.endStroll(_summoner).send({from:wallet})
            .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
            .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
    }
}



//---eventMonitor

async function eventMonitor(_contract, li_eventLog) {
    (async () => {
        _contract.events.allEvents({}, (err, event) => {
            let _json_string = JSON.stringify(event, null, "    ");
            let _json = JSON.parse(_json_string);
            let _event = _json.event;
            let _hash = _json.transactionHash;
            let _res = [_event, _hash];
            for (let i=0; i<=5; i++) {
                let _eventRaw = _json.returnValues[i]
                if (typeof(_eventRaw) != "undefined") {
                    _res.push(_eventRaw);
                }
            }
            console.log(_res);
            li_eventLog.push(_res);
        });
    })();
}

function start_eventMonitor() {
    //global variant
    li_eventLog = [];
    eventMonitor(contract_mfsl_wss, li_eventLog);
    eventMonitor(contract_mffg_wss, li_eventLog);
    eventMonitor(contract_mfmf_wss, li_eventLog);
    eventMonitor(contract_mfc_wss, li_eventLog);
    eventMonitor(contract_mfc2_wss, li_eventLog);
    eventMonitor(contract_mfn_wss, li_eventLog);
    eventMonitor(contract_md_wss, li_eventLog);
    eventMonitor(contract_mml_wss, li_eventLog);
    eventMonitor(contract_ff_wss, li_eventLog);
    eventMonitor(contract_bt_wss, li_eventLog);
}

//---get ASTR price

function update_astarPrice() {
    let _request = new XMLHttpRequest();
    _request.open("GET", "https://api.dexscreener.com/latest/dex/pairs/astar/0x806f746a7c4293092ac7aa604347be123322df1e", URL, true);
    _request.onload = function () {
        let _res = this.response;
        let _json = JSON.parse(_res);
        let _astar_priceChange_h24 = _json.pair.priceChange.h24;
        local_astar_priceChange_h24 = _astar_priceChange_h24;
    };
    _request.send();
}

//---tx count

async function update_txCount() {
    tx_counts.shift();
    let _last_txCount = await web3.eth.getBlockTransactionCount(local_blockNumber);
    //_last_txCount = Math.random()*10;
    tx_counts.push(_last_txCount);
    if (tx_counts_forPinwheel <= 0) {
        tx_counts_forPinwheel = tx_counts.reduce((a,b)=>Math.max(a,b));
    }
}

//---stroll
async function get_strollInfo(_summoner) {
    let _res = await contract_st.methods.get_strollInfo(_summoner).call();
    return _res;
}

//---pippel
async function contract_mint_pippel(_summoner) {
    if (gamemode == "regular") {
        if(wallet == local_owner) {
            contract_pf.methods.mint_pippel(_summoner).send({from:wallet})
                .on("transactionHash", (transactionHash) => update_tx_text("sending", transactionHash))
                .on("receipt", (receipt) => update_tx_text("done", receipt.transactionHash));
        }
    }
}


//===class====================================================================================


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
        this.subcount = 0;
        this.count = 0;
        this.dist = "right";
        this.target_x = 0;
        this.target_y = 0;
        this.setInteractive();
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.exemption_resting_count = 0;
        this.followingTwinkle = 0;
    }

    checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        boundsA.x += boundsA.width/4;
        boundsA.y += boundsA.height/2;
        boundsA.width /= 2;
        boundsA.height /= 3;
        var boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
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
            //try to destry instrument
            if (local_practice_status != 0) {
                try {
                    this.item_practice.destroy();
                } catch (error) {
                    ;
                }
            }
	    } else if (this.count >= this.resting_count){
            let tmp = Math.random() * 100;
            if (tmp <= 5) {
    	        //check sleeping with hammock
    	        if (this.check_hammock()){
    	            this.mode = "hammock";
    	            this.count = 0;
    	            this.submode = 0;
    	        } else {
                    this.mode = "sleeping";
                    this.count = 0;
                }
            } else if (tmp <= 15 && local_happy >= 80) {
                for (let i = 0; i < group_pet.getLength(); i++) {
                    if (this.checkOverlap(this, group_pet.getChildren()[i])){
                        this.mode = "meet_a_pet";
                        this.count = 0;
                        break;
                    }
                }
            } else if (tmp <= 30 && satiety <= 20 && count_sync > 3) {
                this.mode = "hungry";
                this.count = 0;
            } else if (tmp <= 30 && happy <= 20 && count_sync > 3) {
                this.mode = "crying";
                this.count = 0;
            } else if (tmp <= 30 && flag_music == 1 && count_sync > 3) {
                this.mode = "listning";
                this.count = 0;
            } else {
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
            this.moving_speed = 0.5 + Math.random() * 0.4;  //0.5-0.8
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

            //collision

            //tokenBall
            if (
                flag_tokenBall == 2
                && this.count == 2 
                && Math.random()*100 >= 50
            ) {
                for (let i = 0; i < group_tokenBall.getLength(); i++) {
                    if (this.checkOverlap(this, group_tokenBall.getChildren()[i])){
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
                for (let i = 0; i < group_star.getLength(); i++) {
                    if (this.checkOverlap(this, group_star.getChildren()[i])){
                        group_star.getChildren()[i].on_kick();
                        break;
                    }
                }
            }
            
            //woodcube
            if (
                this.count == 4
                && Math.random()*100 >= 50
            ) {
                for (let i = 0; i < group_scoreMeter.getLength(); i++) {
                    if (this.checkOverlap(this, group_scoreMeter.getChildren()[i])){
                        group_scoreMeter.getChildren()[i].on_kick();
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
    
    //### drop_followingTwinkle
    drop_followingTwinkle() {
        if (this.followingTwinkle != 0) {
            this.followingTwinkle.on_kick();
            this.followingTwinkle.flag_follow = 0;
            this.followingTwinkle = 0;
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
            this.drop_followingTwinkle();
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
            //try catche to prevent err when not focus to the tab for a long time
            try {
                if (group_food.getChildren().length > 0) {
                    //group_food.getChildren()[group_food.getChildren().length - 1].destroy();
                    group_food.getChildren()[Math.floor(Math.random() * group_food.getChildren().length)].destroy();
                } else {
                    group_food.destroy(true);
                }
            } catch (err) {
                ;
            }
            this.count = 0;
            this.count_limit = this.count + 1150;
            this.submode = 3;
        }else if (this.submode == 3) {
            if (this.count % 200 == 0) {
                sound_happy.play();
                //destroy group_food one by one
                try {
                    group_food.getChildren()[Math.floor(Math.random() * group_food.getChildren().length)].destroy();
                } catch (err) {
                    ;
                }
                /*
                if (group_food.getChildren().length > 0) {
                    group_food.getChildren()[Math.floor(Math.random() * group_food.getChildren().length)].destroy();
                } else {
                    ;
                    //group_food.destroy(true);
                }
                */
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
    sleeping_continue() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_sleeping", true);
        }else if (this.count >= 9999999999) {
            this.mode = "resting";
            this.count = 0;
        }
    }


    //### sleeping with Hammock
    try_hammock() {
        if (
            (this.mode == "resting" || this.mode == "moving")
            && this.check_hammock()
        ) {
            this.mode = "hammock";
            this.count = 0;
            this.submode = 0;
        }
    }
    check_hammock() {
        if (
            typeof(item_bed) != "undefined"
            && item_bed.x >= 100
            && item_bed.x <= 1180
            && item_bed.y >= 420
            && item_bed.y <= 800
            && flag_onLight == false
        ){
            return true;
        }
        return false;
    }
    sleeping_withHammock() {
        this.count += 1;
        if (this.submode == 0) {
            //set target pos
            this.target_x = item_bed.x;
            this.target_y = item_bed.y;
            //disable bed click
            item_bed.disableInteractive();
            let delta_x = this.target_x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play("murasaki_right", true);
            }else {
                this.dist = "left";
                this.anims.play("murasaki_left", true);
            }
            this.drop_followingTwinkle();
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
            this.x = this.target_x;
            this.y = this.target_y;
            this.setScale(0.8);
            this.anims.play("item_hammock", true);
            //this.count_limit = this.count + 1500;
            this.submode = 3;
            item_bed.visible = false;
        }else if (this.submode == 3) {
            if (flag_onLight == true && turn % 100 == 0) {
                let tmp = Math.random() * 100;
                if (tmp <= 10) {
                    this.setScale(0.45);
                    this.y += 50;
                    item_bed.visible = true;
                    item_bed.setInteractive();
                    if (this.dist == "right"){
                        this.anims.play("murasaki_right", true);
                    }else if (this.dist == "left") {
                        this.anims.play("murasaki_left", true);
                    }
                    this.mode = "resting";
                    this.count = 0;
                }
            }
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
            this.drop_followingTwinkle();
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
            this.drop_followingTwinkle();
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
                this.subcount = 0;
            }
        }else if (this.submode == 2) {
            this.anims.play("murasaki_mining", true);
            if (this.count % 600 == 10) {
                sound_mining_during.play();
                summon_coin(this.scene);
                this.subcount += 1;
                if (this.subcount >= 30 && Math.random()*100 <= 10) {    //5min
                    this.count = 0;
                    this.subcount = 0;                    
                    this.submode = 0;
                    this.mode = "resting";
                    this.exemption_resting_count = 18000;   //frame
                }
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
    
    //### meet a pet
    meet_a_pet() {
        this.count += 1;
        if (this.count % 200 == 50) {
            sound_happy.play();
        }
        if (this.count == 1){
            this.anims.play("murasaki_click", true);
            for (let i = 0; i < group_pet.getLength(); i++) {
                if (this.checkOverlap(this, group_pet.getChildren()[i])){
                    group_pet.getChildren()[i].count = 0;
                    group_pet.getChildren()[i].mode = "meet";
                }
            }
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
            this.drop_followingTwinkle();
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
                this.subcount = 0;
            }
        }else if (this.submode == 2) {
            this.anims.play("murasaki_farming", true);
            if (this.count % 400 == 10) {
                sound_farming_during.play();
                summon_leaf(this.scene);
                if (this.subcount >= 30 && Math.random()*100 <= 10) {    //5min
                    this.count = 0;
                    this.subcount = 0;                    
                    this.submode = 0;
                    this.mode = "resting";
                    this.exemption_resting_count = 18000;   //frame
                }
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
            this.drop_followingTwinkle();
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
                this.subcount = 0;
            }
        } else if (this.submode == 2) {
            this.anims.play("murasaki_crafting", true);
            if (this.count % 600 == 10) {   //every 10 sec
                sound_crafting_during.play();
                summon_flower(this.scene);
                this.subcount += 1;
                if (this.subcount >= 30 && Math.random()*100 <= 10) {    //5min
                    this.count = 0;
                    this.subcount = 0;                    
                    this.submode = 0;
                    this.mode = "resting";
                    this.exemption_resting_count = 18000;   //frame, 5min
                }
                // when complete, sleeping
                if (local_crafting_calc == 0) {
                    this.count = 0;
                    this.mode = "sleeping_continue";
                }
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
    
    //### practice
    practice() {
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
            this.drop_followingTwinkle();
            this.submode = 1;
        } else if (this.submode == 1) {
            let delta_x = this.target_x - this.x;
            let delta_y = this.target_y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.5;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > this.target_x-5 
              && this.x < this.target_x+5 
              && this.y > this.target_y-5 
              && this.y < this.target_y+5
            ) {
                this.submode = 2;
            }
        } else if (this.submode == 2) {
            //determine itemType used in practice
            let _item_type = get_itemType(local_myListsAt_withItemType, local_practice_item_id);
            //invisible corresponding room item and visible practice item
            let _practice_name = "";
            if (_item_type == dic_items["Clarinet"]["item_id"]) {
                item_clarinet.visible = false;
                _practice_name = "practice_clarinet";
            } else if (_item_type == dic_items["Piano"]["item_id"]) {
                item_piano.visible = false;
                _practice_name = "practice_piano";
            } else if (_item_type == dic_items["Violin"]["item_id"]) {
                item_violin.visible = false;
                _practice_name = "practice_violin";
            }
            try {
                this.item_practice.destroy();
            } catch (error) {
            }
            this.item_practice = this.scene.add.sprite(
                this.target_x - 100,
                this.target_y,
                _practice_name,
            ).setOrigin(0.5).setScale(0.4).setDepth(this.target_y).anims.play(_practice_name, true);
            this.submode = 3;
        } else if (this.submode == 3) {
            this.anims.play("murasaki_listning", true);
            if (this.count % 200 == 10) {
                sound_practice.play();
                summon_note(this.scene);
            }
            if (happy <= 0) {
                this.anims.play("murasaki_sleeping", true);
                this.submode = 4;
            }
        }
    }
    
    //### strolling_start
    strolling_start() {
        this.count += 1;
        if (this.submode == 0) {    //setup
            this.waterbottle = this.scene.add.sprite(this.x, this.y, "stroll_waterbottle")
                .setScale(0.45)
                .setOrigin(0.5)
                .setDepth(this.depth+1);
            if (this.x >= strolling_companion.x) {
                this.dist = "left";
            } else {
                this.dist = "right";
                this.waterbottle.flipX = true;
            }
            if (this.dist == "right"){
                this.anims.play("murasaki_right", true);
            }else if (this.dist == "left") {
                this.anims.play("murasaki_left", true);
            }
            strolling_companion.mode = "strolling_start";
            strolling_companion.submode = 0;
            this.submode += 1;
        } else if (this.submode == 1) { //movint to companion
            //moving to companion
            let delta_x = strolling_companion.x - this.x;
            let delta_y = strolling_companion.y - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.2;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.2;
            this.x += delta_x2;
            this.y += delta_y2;
            this.waterbottle.x = this.x;
            this.waterbottle.y = this.y;
            this.waterbottle.depth = this.depth + 1;
            
            if (this.count % 200 == 0) {
                sound_mining_during.play();
                summon_heart(this.scene);
            }

            //check distance
            if (
                Math.abs(delta_x) <= 50 && Math.abs(delta_y) <= 50
            ) {
                this.submode += 1;
            }

        } else if (this.submode == 2) { //waiting for companion
            if (this.count % 200 == 0) {
                sound_mining_during.play();
                summon_heart(this.scene);
            }
        } else if (this.submode == 3) { //interacting with pet
            if (this.count == 1){
                this.anims.play("murasaki_click", true);
            }
            if (this.count % 200 == 50) {
                sound_happy.play();
            }
            if (this.count >= 300) {
                this.count = 0;
                this.submode += 1;
                strolling_companion.submode += 1;
            }
        } else if (this.submode == 4) { //going out
            if (this.count == 1){
                this.speed_x = -0.8;
                this.speed_y = Math.random() * 0.8;
                this.anims.play("murasaki_left", true);
                sound_mining.play();
            }
            this.x += this.speed_x;
            this.y += this.speed_y;
            this.waterbottle.x = this.x;
            this.waterbottle.y = this.y;
            this.waterbottle.depth = this.depth + 1;
            if (this.count % 100 == 0) {
                sound_mining_during.play();
                summon_heart(this.scene);
            }
            if (this.count > 200) {
                this.count = 0;
                this.submode = 5;
            }
            if (this.x < -200 || this.y > 1100) {
                this.count = 0;
                this.submode = 6;
            }
        } else if (this.submode == 5) { //waiting
            this.anims.play("murasaki_click", true);
            this.flipX = true;
            this.waterbottle.flipX = true;
            if (this.count % 200 == 50) {
                sound_happy.play();
            }
            if (this.count > 300) {
                this.submode = 4;
                this.count = 1;
                this.anims.play("murasaki_left", true);
                this.flipX = false;
                this.waterbottle.flipX = false;
            }
        } else if (this.submode == 6) { //open window
            open_window_strollingDuring(this.scene, local_direction);
            this.submode += 1;
        } else if (this.submode == 7) { //end
            ;
        }
    }

    //### strolling_end
    strolling_end() {
        if (this.submode == 0) {
            this.target_x = 400 + Math.random()*400;
            this.target_y = 550 + Math.random()*200;
            this.anims.play("murasaki_right", true);
            this.flipX = false;
            this.submode = 1;
        } else if (this.submode == 1) {
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
                this.subcount = 0;
            }
        } else if (this.submode == 2) {
            this.subcount = 0;                    
            this.submode = 0;
            this.mode = "resting";
            let _text = "Friends +" + this.delta_total_metSummoners + "\nDistance +" + this.delta_total_strolledDistance + " m";
            let _msg = this.scene.add.text(this.x, this.y-80, _text)
                .setOrigin(0.5)
                .setDepth(2000)
                .setFontSize(20)
                .setFontFamily("Arial")
                .setFill("#FF4264");
            setTimeout( () => {_msg.destroy()}, 10000);
            this.on_click();
            item_waterBottle.visible = true;
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
            || this.mode == "meet_a_pet"
            || this.mode == "strolling_start"
            || this.mode == "strolling_end"
        ) {
            item_wearing_hat.x = this.x;
            item_wearing_hat.y = this.y - 65;
        }else if (this.mode == "sleeping" || this.mode == "sleeping_continue") {
            item_wearing_hat.x = this.x - 26;
            item_wearing_hat.y = this.y - 22;
        }else if (this.mode == "hammock") {
            if (this.submode < 2) {
                item_wearing_hat.x = this.x;
                item_wearing_hat.y = this.y - 65;
            } else {
                item_wearing_hat.x = this.x;
                item_wearing_hat.y = this.y - 135;
            }
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
        }else if (this.mode == "practice" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "practice" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "practice" && this.submode >= 2) {
            item_wearing_hat.x = this.x;
            item_wearing_hat.y = this.y - 65;
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
            else if (this.mode == "sleeping_continue") {this.sleeping_continue();}
            else if (this.mode == "grooming") {this.grooming();}
            else if (this.mode == "mining") {this.mining();}
            else if (this.mode == "hugging") {this.hugging();}
            else if (this.mode == "farming") {this.farming();}
            else if (this.mode == "crafting") {this.crafting();}
            else if (this.mode == "hungry") {this.hungry();}
            else if (this.mode == "petrified") {this.petrified();}
            else if (this.mode == "listning") {this.listning();}
            else if (this.mode == "attenting") {this.attenting();}
            else if (this.mode == "hammock") {this.sleeping_withHammock();}
            else if (this.mode == "practice") {this.practice();}
            else if (this.mode == "meet_a_pet") {this.meet_a_pet();}
            else if (this.mode == "strolling_start") {this.strolling_start();}
            else if (this.mode == "strolling_end") {this.strolling_end();}
            //draw item_wearing_hat
            if (item_wearing_hat != 0) {
                this.update_item_wearing_hat();
            }
            //depth
            this.depth = this.y;
        }
        //exemption_resting_count
        if (this.exemption_resting_count > 0) {
            this.exemption_resting_count -= 1;
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
        this.depth = 3101;
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
            }else if (this.y < 200 && this.moving_degree < 180) {
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
        //this.setInteractive()
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);

        //check strolling
        if (local_strolling_status == 1) {
            if (
                (local_companion == 1 && this.type == "mining")
                ||(local_companion == 2 && this.type == "farming")
                ||(local_companion == 3 && this.type == "crafting")
            ) {
                this.mode = "strolling_start";
                this.x = -150;
                this.y = 900;
                this.submode = 4;
            }
        }

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
    
    //### meet
    meet() {
        this.count += 1;
        if (this.count == 1){
            if (this.type == "mining"){
                this.anims.play("mr_astar_meet", true);
            } else if (this.type == "farming") {
                this.anims.play("ms_ether_meet", true);
            } else if (this.type == "crafting") {
                this.anims.play("dr_bitco_meet", true);
            }
        }else if (this.count >= 300) {
            this.mode = "resting";
            this.count = 0;
        }
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
	        } else if (murasakisan.mode == "practice") {
	            this.mode = "practice";
	            if (this.type == "mining") {
    	            this.target_x = murasakisan.target_x - 65;
    	            this.target_y = murasakisan.target_y + 55;
    	        } else if (this.type == "farming") {
    	            this.target_x = murasakisan.target_x + 0;
    	            this.target_y = murasakisan.target_y + 70;
    	        } else if (this.type == "crafting") {
    	            this.target_x = murasakisan.target_x + 65;
    	            this.target_y = murasakisan.target_y + 55;
    	        }
	            this.count = 0;
	            this.submode = 0;
	        } else {
                //let tmp = Math.random() * 100;
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
            //out of area check
            if (this.y < 500) { this.y = 500; }
            if (this.x < 50) { this.x = 50; }
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
              && this.y < this.target_y+1
            ) {
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
    
    //### practice
    practice() {
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
              && this.y < this.target_y+1
            ) {
                this.dist = "left";
                this.anims.play(this.sprite_left, true);
                this.submode = 2;
            }
        }else if (this.submode == 2) {
            if (murasakisan.mode != "practice") {
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
    
    //### strolling_start
    strolling_start() {
        if (this.submode == 0) {
            let delta_x = murasakisan.x - this.x;
            if (delta_x >0) {
                this.dist = "right";
                this.anims.play(this.sprite_right, true);
            }else {
                this.dist = "left";
                this.anims.play(this.sprite_left, true);
            }
            this.submode = 1;
        } else if (this.submode == 1) {
            let delta_x = murasakisan.x +25 - this.x;
            let delta_y = murasakisan.y +25 - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 0.6;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 0.6;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > murasakisan.x +25 -10 
              && this.x < murasakisan.x +25 +10 
              && this.y > murasakisan.y +25 -10 
              && this.y < murasakisan.y +25 +10) {
                this.submode = 2;
                murasakisan.submode += 1;
                murasakisan.count = 0;
            }
        } else if (this.submode == 2) {
            if (this.type == "mining"){
                this.anims.play("mr_astar_meet", true);
            } else if (this.type == "farming") {
                this.anims.play("ms_ether_meet", true);
            } else if (this.type == "crafting") {
                this.anims.play("dr_bitco_meet", true);
            }
        } else if (this.submode == 3) {
            let delta = murasakisan.x - this.x;
            if (delta >0) {
                this.dist = "right";
                this.anims.play(this.sprite_right, true);
            }else {
                this.dist = "left";
                this.anims.play(this.sprite_left, true);
            }
            let delta_x = murasakisan.x +30 - this.x;
            let delta_y = murasakisan.y +30 - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 0.6;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 0.6;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x < -100) {
                this.submode = 4;
            }
        } else if (this.submode == 4) {
        }
    }
    
    //### strolling_end
    strolling_end() {
        if (this.submode == 0) {
            this.dist = "right";
            this.anims.play(this.sprite_right, true);
            this.submode = 1;
        } else if (this.submode == 1) {
            let delta = murasakisan.x - this.x;
            if (delta >0) {
                this.dist = "right";
                this.anims.play(this.sprite_right, true);
            }else {
                this.dist = "left";
                this.anims.play(this.sprite_left, true);
            }
            let delta_x = murasakisan.x +30 - this.x;
            let delta_y = murasakisan.y +30 - this.y;
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 0.6;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 0.6;
            this.x += delta_x2;
            this.y += delta_y2;
            if (this.x > 300 && this.y < 800) {
                this.submode = 2;
            }
        } else if (this.submode == 2) {
            this.subcount = 0;
            this.submode = 0;
            this.mode = "resting";
        }
    }
    
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
        else if (this.mode == "practice") {this.practice();}
        else if (this.mode == "meet") {this.meet();}
        else if (this.mode == "strolling_start") {this.strolling_start();}
        else if (this.mode == "strolling_end") {this.strolling_end();}
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
                let _array_item_196 = get_userItems(196);
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
            this.x = 90;
            this.y = 575;
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
            this.target_x = 100;
            this.target_y = 590;
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
            this.x = 100;
            this.y = 590;
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
            .setDepth(2000);
        this.on("pointerdown", () => {
            sound_button_on.play();
            contract_open_mail(summoner);
        });
        this.on("pointerover", () => {
            sound_button_select.play();
            if (flag_info == 1) {
                this.text.setVisible(true);
                setTimeout( () => {
                    this.text.setVisible(false);
                }, 3000)
            }
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
            if (this.y > 800 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 550 && this.moving_degree < 180) {
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
            //out of area check
            if (this.y < 500) { this.y = 500; }
            if (this.x < 50) { this.x = 50; }
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
        this.text_rolled_number = 
            scene.add.text(x, y, "88", {font: "bold 20px Arial", fill: "#ffffff"})
                .setOrigin(0.5);
        this.text_next_time = 
            scene.add.text(x, y+40, "---", {font: "14px Arial", fill: "#000000"})
                .setOrigin(0.5)
                .setDepth(3);
        group_info.add(this.text_next_time);
        this.flag_tx = 0;
        this.count = 0;
        this.line_y = y;      //initial value of line_y, the same as first position of y
        this.line_y_max = 500;  //max floor position
        this.line_y_min = 700;
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
        if (this.flag_tx == 1 && local_owner == wallet) {
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
        this.depth = this.line_y;
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
            /*
            if (this.x >= this.line_x_r) {
                this.x = this.line_x_r;
                this.speed_x *= -0.9;   //bounce coefficient
                sound_dice_impact.play();
            } else if (this.x <= this.line_x_l) {
                this.x = this.line_x_l;
                this.speed_x *= -0.9;
                sound_dice_impact.play();
            }
            */
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
            this.depth = 3300+1;
        }

    }
}


//---Note
class Note extends Phaser.GameObjects.Sprite{
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
        this.line_y_min = 1200;
        this.line_x_r = 1200;   //right side
        this.line_x_l = 50;     //left side
        this.on_summon();
    }
    
    //### on_click
    on_click() {
        this.speed_x = 2 + Math.random() * 1;
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 5 + Math.random() * 2;
        this.count = 0;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        sound_dice.play();
    }
    
    //### on_summon
    on_summon() {
        this.x = murasakisan.x -50 + Math.random() * 100;
        this.y = murasakisan.y -50 + Math.random() * 100;
        this.speed_x = 2 + Math.random() * 1;
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 5 + Math.random() * 2;
        this.count = 0;
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.line_y_max+100 + this.a * this.x;
        //sound
        //sound_star.play();
        let _li = [
            sound_piano_a,
            sound_piano_b,
            sound_piano_c,
            sound_piano_d,
            sound_piano_e,
            sound_piano_f,
            sound_piano_g
        ];
        this.sound = _li[Math.floor(Math.random()*_li.length)]
        this.count_bounch = 0;
    }
    
    //### update()
    update(){
        this.count += 1;
        
        //dept
        //this.depth = this.y;
        //check position
        if (
            this.x > 1400
            || this.x < -100
            || this.y > 1000
        ) {
            this.destroy();
        } else {
            //when moving
            //define line_y
            this.line_y = this.b - this.a * this.x;
            this.setDepth(this.line_y);
            if (this.line_y < this.line_y_max) {
                this.line_y = this.line_y_max;
            }
            if (this.line_y > this.line_y_min) {
                this.line_y = this.line_y_min;
            }
            //reduction of y speed
            //this.speed_y -= 0.75;
            this.speed_y -= 0.2;
            //position moving
            this.x += this.speed_x;
            this.y -= this.speed_y;
            //increase angle
            //this.angle += this.speed_x * 2;
            //refrection y
            if (this.y >= this.line_y) {
                this.y = this.line_y;
                this.speed_y *= -1 * (0.7 + Math.random() * 0.6) ;   //bounce coefficient
                if (this.speed_y > 0 && this.speed_y < 5) {
                    this.speed_y = 5;
                } else if (this.speed_y < 0 && this.speed_y > -5) {
                    this.speed_y = -5;
                }
                if (this.count_bounch > 1) {
                    //this.sound.play();
                }
                this.count_bounch += 1;
                //sound_dice_impact.play();
            }
        }
    }
}


//---Coin
class Coin extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y, img){
        super(scene, x, y, img);
        this.scene.add.existing(this);
        this.speed_x = 0;
        this.speed_y = 0;
        this.line_y = 0;
        this.count = 0;
        this.on_summon();
    }
    
    //### on_summon
    on_summon() {
        this.x = murasakisan.x + Math.random() * 5;
        this.y = murasakisan.y + Math.random() * 10;
        this.line_y = this.y;
        if (this.line_y < 510) {
            this.line_y = 510;
        }
        this.speed_x = 3 + Math.random() * 1;
        if (murasakisan.mode != "mining" && Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 9 + Math.random() * 3;
        this.count = 0;
    }
    
    //### update()
    update(){
        this.count += 1;
        //check alive time
        if (this.count >= 100) {
            this.destroy();
        }
        this.setDepth(this.line_y);
        //reduction of y speed
        this.speed_y -= 0.6;
        //position moving
        this.x += this.speed_x;
        this.y -= this.speed_y;
        //increase angle
        this.angle += this.speed_x * 5;
        //refrection y
        if (this.y >= this.line_y) {
            this.y = this.line_y;
            this.speed_y *= -0.3;   //y bounce
            this.speed_x *= 0.9;    //x friction
        }
    }
}



//---Fluffy2

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
        this.line_y_min = 900;
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
        //elected symbol
        /*
        this.electedSymbol = this.scene.add.image(this.x, this.y, "par_flowers")
            .setOrigin(0.5)
            .setScale(0.08)
            .setAngle(30)
            //.setVisible(false)
            .setFrame(Math.floor(Math.random()*5));
        */
        //image
        if (this.rarity == "common") {
            if (this.type == 201) {
                this.setFrame(0 + 10*0);
            } else if (this.type == 202) {
                this.setFrame(0 + 10*1);
            } else if (this.type == 203) {
                this.setFrame(0 + 10*2);
            } else if (this.type == 204) {
                this.setFrame(0 + 10*3);
            } else if (this.type == 205) {
                this.setFrame(0 + 10*4);
            } else if (this.type == 206) {
                this.setFrame(0 + 10*5);
            } else if (this.type == 207) {
                this.setFrame(0 + 10*6);
            } else if (this.type == 208) {
                this.setFrame(0 + 10*7);
            } else if (this.type == 209) {
                this.setFrame(0 + 10*8);
            } else if (this.type == 210) {
                this.setFrame(0 + 10*9);
            } else if (this.type == 211) {
                this.setFrame(0 + 10*10);
            } else if (this.type == 212) {
                this.setFrame(0 + 10*11);
            }
        } else if (this.rarity == "uncommon") {
            //prevent same timing
            setTimeout( () => {
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
            }, Math.random() * 1000)
        } else if (this.rarity == "rare") {
            if (this.type == 225) {
                this.frontFrame = 3 +10*0;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_01_right";
                this.anim_left = "fluffy_fluffiest_01_left";
                this.anim_front = "fluffy_fluffiest_01_front";
            } else if (this.type == 226) {
                this.frontFrame = 3 +10*1;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_02_right";
                this.anim_left = "fluffy_fluffiest_02_left";
                this.anim_front = "fluffy_fluffiest_02_front";
            } else if (this.type == 227) {
                this.frontFrame = 3 +10*2;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_03_right";
                this.anim_left = "fluffy_fluffiest_03_left";
                this.anim_front = "fluffy_fluffiest_03_front";
            } else if (this.type == 228) {
                this.frontFrame = 3 +10*3;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_04_right";
                this.anim_left = "fluffy_fluffiest_04_left";
                this.anim_front = "fluffy_fluffiest_04_front";
            } else if (this.type == 229) {
                this.frontFrame = 3 +10*4;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_05_right";
                this.anim_left = "fluffy_fluffiest_05_left";
                this.anim_front = "fluffy_fluffiest_05_front";
            } else if (this.type == 230) {
                this.frontFrame = 3 +10*5;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_06_right";
                this.anim_left = "fluffy_fluffiest_06_left";
                this.anim_front = "fluffy_fluffiest_06_front";
            } else if (this.type == 231) {
                this.frontFrame = 3 +10*6;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_07_right";
                this.anim_left = "fluffy_fluffiest_07_left";
                this.anim_front = "fluffy_fluffiest_07_front";
            } else if (this.type == 232) {
                this.frontFrame = 3 +10*7;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_08_right";
                this.anim_left = "fluffy_fluffiest_08_left";
                this.anim_front = "fluffy_fluffiest_08_front";
            } else if (this.type == 233) {
                this.frontFrame = 3 +10*8;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_09_right";
                this.anim_left = "fluffy_fluffiest_09_left";
                this.anim_front = "fluffy_fluffiest_09_front";
            } else if (this.type == 234) {
                this.frontFrame = 3 +10*9;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_10_right";
                this.anim_left = "fluffy_fluffiest_10_left";
                this.anim_front = "fluffy_fluffiest_10_front";
            } else if (this.type == 235) {
                this.frontFrame = 3 +10*10;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_11_right";
                this.anim_left = "fluffy_fluffiest_11_left";
                this.anim_front = "fluffy_fluffiest_11_front";
            } else if (this.type == 236) {
                this.frontFrame = 3 +10*11;
                this.setFrame(this.frontFrame);
                this.anim_right = "fluffy_fluffiest_12_right";
                this.anim_left = "fluffy_fluffiest_12_left";
                this.anim_front = "fluffy_fluffiest_12_front";
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
        if (this.rarity == "rare") {
            this.anims.stop();
        }
    }

    //### on_click_fromHouse
    on_click_fromHouse() {
        this.x = item_fluffy_house.x;
        this.y = item_fluffy_house.y;
        this.speed_x = 4 + Math.random() * 10;
        /*
        if (pointer_x > this.x) {
            this.speed_x *= -1;
        }
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        */
        this.speed_y = 4 + Math.random() * 10;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        /*
        let _li = [
            sound_fluffy2,
            sound_fluffy3,
            sound_fluffy4,
            sound_fluffy5
        ]
        _li[Math.floor(Math.random()*_li.length)].play();
        */
        this.mode = "rolling";
        if (this.rarity == "rare") {
            this.anims.stop();
        }
        this.visible = true;
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
        if (this.rarity == "rare") {
            this.anims.stop();
        }
    }
    
    //### on_summon
    on_summon() {
        if (this.rarity == "rare") {
            this.anims.stop();
        }
        if (count_sync <= 5) {
            //when start, only pos set
            this.x = 200 + Math.random() * 800;
            this.y = 520 + Math.random() * 200;
            this.angle = Math.random() * 360;
            //define constant of y = b - a * x
            this.a = Math.random() * 0.8 - 0.4;
            this.b = this.y + this.a * this.x;
            this.mode = "resting";
            this.submode = -50 - Math.round(Math.random()*50);
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
        // fluffy festical check
        if (
            this.type == local_ff_elected_type
            || this.type - 12 == local_ff_elected_type
            || this.type - 24 == local_ff_elected_type
        ) {
            draw_glitter(this.scene, this);
        }
    }
    
    //### rolling
    _checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        boundsA.x += boundsA.width/4;
        boundsA.y += boundsA.height/4;
        boundsA.width /= 2;
        boundsA.height /= 2;
        var boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
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
            //this.submode = 0;
            this.submode = -100;
        }
        
        //check fluffy house
        if (
            typeof(item_fluffy_house) != "undefined" 
            && this._checkOverlap(item_fluffy_house, this)
            && flag_fluffy_house_click != 1
        ) {
            this.x = item_fluffy_house.x;
            this.y = item_fluffy_house.y;
            this.speed_x = 0;
            this.speed_y = 0;
            this.mode = "resting";
            this.submode = -10000;
            //local_fluffy_house_count += 1;
            group_fluffy_house_in.add(this);
            this.visible = false;
            sound_fluiffy_house.play();
        }
    }
    
    //### resting
    resting() {
        //low rarity, do nothing
        if (this.rarity == "common" || this.rarity == "uncommon") {
            ;
        } else if (this.submode < 0){
            this.submode += 1;
            if (this.rarity == "rare") {
                this.anims.stop();
            }
        } else if (this.submode == 0){
            this.angle = 0;
            //this.anims.stop();
            //this.setFrame(this.frontFrame);
            this.anims.play(this.anim_front, true);
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
            let _distance = this.calc_distance(murasakisan.x, murasakisan.y);
            let _distance_limit = 400;
            if (murasakisan.mode == "practice") {
                _distance_limit = 200;
            }
            if (_distance > _distance_limit) {
                this.moving_degree = this.get_degree(murasakisan.x, murasakisan.y);
            } else {
                //determine degree, 0-30, 150-210, 330-360
                var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
                this.moving_degree = li[Math.floor(Math.random() * li.length)];
            }

            //out of area check
            if (this.x < 100 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1100 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }

            //out of area check, y
            if (this.y > 900 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 500 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }

            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }

            //360 over check
            this.moving_degree = this.moving_degree % 360;

            //determine speed, count
            this.moving_speed = 0.3 + Math.random() * 0.2;  //0.3-0.5
            this.moving_count = 70 + Math.random() * 30;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.anims.play(this.anim_left, true);
            }else {
                this.dist = "right";
                this.anims.play(this.anim_right, true);
            }
            this.angle = 0;
            this.submode += 1;
        } else {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            //out of area check
            if (this.y < 500) { this.y = 500; }
            if (this.x < 50) { this.x = 50; }
            this.submode += 1;
            if (this.submode >= 100){
                this.mode = "resting";
                this.submode = 0;
            }
        }
    }
    calc_distance(target_x, target_y){
        let _delta_x = target_x - this.x;
        let _delta_y = target_y - this.y;
        let _delta = Math.sqrt(_delta_y**2 + _delta_x**2);
        return _delta;
    }
    get_degree(target_x, target_y){
        let _delta_x = target_x - this.x;
        let _delta_y = -1 * (target_y - this.y);
        let _degree = Math.atan2(_delta_y, _delta_x) / (Math.PI/180); //arctan
        return _degree;
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
        /*
        this.electedSymbol.x = this.x;
        this.electedSymbol.y = this.y-13;
        this.electedSymbol.depth = this.depth+1;
        */
    }
}


//---Nuichan

class Nuichan extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img, _type, _itemId, _summoner_name, _score, _exp_rate){
        super(scene, x, y, img);
        let _pos_local = "pos_item_nui_" + _itemId;
        this._pos_local = _pos_local;
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            let _pos = JSON.parse(_json);
            this.x = _pos[0];
            this.y = _pos[1];
        }
        this.type = _type;
        this.itemId = _itemId;
        this.scene.add.existing(this);
        this.setInteractive({ draggable: true, useHandCursor: true });
        let _exp_rate_percent = (_exp_rate - 10000)/100;
        let _text = "";
        _text += " id: " + "#" + _itemId + " \n";
        _text +=" crafter: " + _summoner_name + " \n";
        _text += " score: " + _score + " \n";
        _text += " exp: +" + _exp_rate_percent + "% ";
        this.msg = this.scene.add.text(
            this.x,
            this.y+68,
            _text,
            {font: "15px Arial", fill: "#000000", backgroundColor: "#ffffff"}
        ).setOrigin(0.5).setDepth(2000).setVisible(false);
        this.on("drag", () => {
            if (this.scene.sys.game.scale.gameSize._width == 1280) {
                this.x = game.input.activePointer.x;
                this.y = game.input.activePointer.y;
            } else {
                this.x = game.input.activePointer.y;
                this.y = 960 - game.input.activePointer.x;
            }
            this.depth = this.y;
            this.msg.visible = false;
        })
        this.on("dragend", () => {
            //grand, sound, depth
            this.msg.x = this.x;
            this.msg.y = this.y+68;
            //if (flag_info == 1) {
            //    this.msg.visible = true;
            //}
            sound_nui.play();
            if (local_owner == local_wallet) {
                let _pos = [this.x, this.y];
                localStorage.setItem(this._pos_local, JSON.stringify(_pos));
            }
            //attenting
            if (
                this.x >= 100
                && this.x <= 1100
                && this.y >= 500
                && this.y <= 800
            ){
                murasakisan.try_attenting(this.x, this.y);
            }
        })
        this.click = 0;
        this.on("pointerdown", () => {
            if (flag_info == 1) {
                this.click += 1;
                let click_now = this.click;
                this.msg.visible = true;
                setTimeout( () => {
                    if (click_now == this.click) {
                        this.msg.visible = false;
                    }
                }, 2000);
            }
        })
        /*
        this.on("pointerout", () => {
            setTimeout( () => {
                this.msg.visible = false;
            }, 500);
        });
        */
        //image
        if (this.type == 237) {
            this.setFrame(0);
        } else if (this.type == 238) {
            this.setFrame(1);
        } else if (this.type == 239) {
            this.setFrame(2);
        } else if (this.type == 240) {
            this.setFrame(3);
        } else if (this.type == 241) {
            this.setFrame(4);
        } else if (this.type == 242) {
            this.setFrame(5);
        } else if (this.type == 243) {
            this.setFrame(6);
        } else if (this.type == 244) {
            this.setFrame(7);
        } else if (this.type == 245) {
            this.setFrame(8);
        } else if (this.type == 246) {
            this.setFrame(9);
        } else if (this.type == 247) {
            this.setFrame(10);
        } else if (this.type == 248) {
            this.setFrame(11);
        }
        this.setOrigin(0.5).setScale(0.38);
    }
        
    //### update()
    update() {
    }
}


//---PresentBox

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
            this.y-55,
            _text, 
            {font: "20px Arial", fill: "#000000", backgroundColor: "#ffffff"}
        ).setOrigin(0.5).setDepth(2000).setVisible(false);
        this.on("pointerover", () => {
            if (flag_info == 1) {
                this.text.visible = true;
            }
            sound_button_select.play();
            this.setFrame(1);
        })
        this.on("pointerout", () => {
            this.text.visible = false;
            this.setFrame(0);
        });
    }
    
    //### on_click
    on_click() {
        //send transaction
        open_presentbox(summoner, this.itemId);
        sound_button_on.play();
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
        ).setOrigin(0.5).setDepth(2000).setVisible(false);
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
            _text += " Your vote: " + dic_items_reverse[local_ff_last_voting_type] + " \n";
            _text += "   1st: " + dic_items_reverse[_array_sorted[0][0]] + " (" + _array_sorted[0][1] + " votes) \n";
            _text += "   2nd: " + dic_items_reverse[_array_sorted[1][0]] + " (" + _array_sorted[1][1] + " votes) \n";
            _text += "   3rd: " + dic_items_reverse[_array_sorted[2][0]] + " (" + _array_sorted[2][1] + " votes) \n";
            /*
            _text += " Your vote: " + array_item_name[local_ff_last_voting_type] + " \n";
            _text += "   1st: " + array_item_name[_array_sorted[0][0]] + " (" + _array_sorted[0][1] + " votes) \n";
            _text += "   2nd: " + array_item_name[_array_sorted[1][0]] + " (" + _array_sorted[1][1] + " votes) \n";
            _text += "   3rd: " + array_item_name[_array_sorted[2][0]] + " (" + _array_sorted[2][1] + " votes) \n";
            */
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
        this.movingSubmode = 0;
        this.setInteractive({useHandCursor: true});
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.flowerCount = 0;
        this.nyui_text = scene.add.text(590, 870, "")
            .setFontSize(20)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#0000ff")
            .setVisible(false)
            .setDepth(5000+2);
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
            .setDepth(5000+1);
        group_nyuinyui_ohana.add(_ohana);
        sound_nyui.play();
        this.flowerCount += 1;
        localStorage_flowerCount += 1;
        if (this.flowerCount == 10) {
            this.anims.play("nyui_happy");
            this.movingMode = "resting";
            this.movingSubmode = 1;
            this.resting_count = 99999;
            sound_nyui2.play();
        }
        this.nyui_text.setVisible(true);
        //this.nyui_text.setText(this.flowerCount + " flowers");
        this.nyui_text.setText(localStorage_flowerCount + " flowers");
        localStorage.setItem("flowerCount_inGame", JSON.stringify(localStorage_flowerCount));
        //count bonux
        //if (this.array_bonusCount.includes(localStorage_flowerCount)){
        if (localStorage_flowerCount % 100 == 0){
            let _flower_number = 50;
            if (local_dapps_staking_amount < 500) {
                _flower_number += 0;
            } else if (local_dapps_staking_amount < 1000) {
                _flower_number += 10;
            } else if (local_dapps_staking_amount < 2000) {
                _flower_number += 20;                
            } else if (local_dapps_staking_amount < 4000) {
                _flower_number += 30;                
            } else if (local_dapps_staking_amount < 8000) {
                _flower_number += 40;                
            } else if (local_dapps_staking_amount < 16000) {
                _flower_number += 50;                
            } else if (local_dapps_staking_amount < 32000) {
                _flower_number += 60;                
            } else if (local_dapps_staking_amount < 64000) {
                _flower_number += 70;                
            } else if (local_dapps_staking_amount >= 64000) {
                _flower_number += 80;                
            }
            for (let i=1; i<=_flower_number; i++) {
                summon_fallingFlower(this.scene);
            }
            sound_hat.play();
        }
    }
    
    //### reset
    reset() {
        group_nyuinyui_ohana.clear(true);
        this.flowerCount = 0;
        this.movingMode = "resting";
        this.anims.play("nyui_moving_left");
        this.movingSubmode = 0;
        this.nyui_text.setVisible(false);
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
        //this.nyui_text.x = this.x;
        //this.nyui_text.y = this.y - 50;
    }
}


//---FallingFlower
class FallingFlower extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img){
        super(scene, x, y, img);
        this.scene.add.existing(this);
        this.speed_x = 0;
        this.speed_y = 0;
        this.count = 0;
        this.line_y_limit = 1000;
        this.depth = 6100;
        this.setOrigin(0.5);
        this.setAlpha(0.9);
        this.count = 0;
        this.on_summon();
    }
    
    //### on_summon
    on_summon() {
        this.x = Math.random() * (1280+200);
        this.y = -50 - Math.random()*500;
        this.speed_x = -0.1 -Math.random()*1.5;
        this.speed_y = 2 + Math.random()*4;
        this.setScale(0.1 + Math.random()*0.1);
        this.setAngle(Math.random()*360);
        this.setFrame(Math.floor(Math.random()*5));
        this.count_update = Math.floor(Math.random()*40);
    }
    
    //### update()
    update(){
        this.count += 1;
        this.x += this.speed_x;
        this.y += this.speed_y;
        if (this.count % 50 == this.count_update) {
            //this.setAngle(Math.random()*360);
            this.angle += 30;
        }
        if (this.y >= this.line_y_limit) {
            this.destroy(true);
        }
    }
}


//---Alphabet
class Alphabet extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, img, flag_keep=0, _scale=0.1){
        super(scene, x, y, img);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scale = _scale;
        this.flag_keep = flag_keep;
        this.img = img;
        this.scene.add.existing(this);
        this.depth = 2000;
        this.setOrigin(0.5);
        this.on_summon();
    }
    
    //### on_summon
    on_summon() {
        this.mode = "waiting";
        this.submode = 0;
        this.count = Math.round(Math.random() * 100);
        this.count_limit = this.count + 500;
        this.speed_x = 0;
        this.speed_y = 0;
        this.setAlpha(0.8);
		this.setScale(this.scale);
		this.flag_fall = 0;
		if (this.flag_keep == 0) {
            this.setInteractive({useHandCursor: true});
            this.on("pointerdown", () => {
                this.on_click();
            });
        }
        draw_flower2(this.scene, this.x, this.y);
        //sound_nyui.play();
    }
    
    //### on_click
    on_click() {
        if (this.mode == "waiting") {
            let _array = [
                "stretching",
                "rising",
                "shrinking",
                "dissolving",
                "falling",
                "flipping",
            ]
            let _dic = {
                "stretching": sound_stretching,
                "rising": sound_rising,
                "shrinking": sound_shrinking,
                "dissolving": sound_dissolving,
                "falling": sound_falling,
                "flipping": sound_flipping,
            }
            this.mode = _array[Math.floor(Math.random() * _array.length)];
            _dic[this.mode].play();
            this.submode = 0;
            this.on_click_otherAlp();
            //sound
            //sound_dice.play();
        }
    }
    on_click_otherAlp() {
        //set other alp mode
        let _count = 0;
        let _count_otherClick = 3;
        group_alp.shuffle();
        let _alps = group_alp.getChildren();
        //prepare count_waiting
        let _count_waiting = 0;
        for (i=0; i<_alps.length; i++) {
            let _alp = _alps[i];
            if (_alp.mode == "waiting") {
                _count_waiting += 1;
            }
        }
        //clicking
        for (i=0; i<_alps.length; i++) {
            let _alp = _alps[i];
            if (_alp.mode == "waiting") {
                _alp.mode = this.mode;
                _count += 1;
                _count_waiting -= 1;
                if (
                    _count >= _count_otherClick 
                    //does not rest only one alphabet
                    && _count_waiting > 1
                ) {
                    break;
                }
            }
        }
    }
    
    //### shrinking
    shrinking() {
        this.scale *= 0.98;
        this.angle += 10;
        if (this.scale <= 0.03) {
            draw_miniAlphabet2(this.scene, this.x, this.y, this.img);
            this.destroy(true);
        }
    }
    
    //### falling
    falling() {
        if (this.submode == 0) {
            this.line_y = 550;
            this.speed_x = -2 + Math.random()*4;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.rolling();
            if (
                this.x >= 1500
                || this.x <= -300
            ) {
                this.destroy(true);
            }
        }
    }

    //### rolling
    rolling(){
        //reduction of y speed
        this.speed_y -= 0.5;
        //position moving
        this.x += this.speed_x;
        this.y -= this.speed_y;
        //increase angle
        this.angle += this.speed_x * 3;
        //refrection y
        if (this.y >= this.line_y) {
            this.y = this.line_y;
            if (this.speed_x > 0) {
                this.speed_x = 5 + Math.random() * 2;
            } else {
                this.speed_x = (5 + Math.random() * 2) * -1;
            }
            this.speed_y = 10 + Math.random() * 5;
        }
    }
    
    //### rising
    rising() {
        if (this.submode == 0) {
            this.speed_y = -0.05;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.speed_y *= 1.05;
            this.y += this.speed_y;
            //shivering
            if (this.count % 4 == 0) {
                this.x += 1;
            } else if (this.count % 4 == 2) {
                this.x -= 1;
            }
            if (this.y <= -100) {
                this.destroy(true);
            }
        }
    }
    
    //### dissolving
    dissolving() {
        if (this.submode == 0) {
            draw_miniAlphabet(this.scene, this.x, this.y, this.img);
            this.submode += 1;
        } else if (this.submode == 1) {
            this.alpha -= 0.01;
            this.y += 0.1;
            this.scale *= 0.995
            if (this.alpha <= 0) {
                this.destroy(true);
            }
        }
        
    }
    
    //### stretching
    stretching() {
        this.scaleX += 0.006;
        this.scaleY -= 0.003;
        this.angle -= 0.5;
        if (this.scaleY <= 0) {
            this.destroy(true);
        }        
    }
    
    //### flipping
    flipping() {
        if (this.submode == 0) {
            this.scaleX_org = this.scaleX;
            this.submode = 1;
        } else if (this.submode == 1) {
            this.scaleX -= 0.01;
            if (this.scaleX < 0) {
                this.submode = 2;
                this.flipX = !this.flipX;
            }
        } else if (this.submode == 2) {
            this.scaleX += 0.01;
            if (this.scaleX >= this.scaleX_org) {
                this.submode = 1;
            }
        }
        this.y -= 1;
        this.alpha -= 0.01;
        if (this.alpha <= 0) {
            this.destroy(true);
        }
    }
    
    //### waiting
    waiting(){
        if (this.count % 240 == 0) {
            this.y += 5;
        } else if (this.count % 240 == 120) {
            this.y -= 5;
        }
        if (this.count >= this.count_limit & this.flag_keep == 0) {
            draw_flower2(this.scene, this.x, this.y);
            this.destroy(true);
        }
    }
    
    //### update()
    update(){
        this.count += 1;
        if (this.mode == "falling"){
            this.falling();
        } else if (this.mode == "rising"){
            this.rising();
        } else if (this.mode == "shrinking"){
            this.shrinking();
        } else if (this.mode == "dissolving"){
            this.dissolving();
        } else if (this.mode == "stretching"){
            this.stretching();
        } else if (this.mode == "flipping"){
            this.flipping();
        } else if (this.mode == "waiting") {
            this.waiting();
        }
    }
}


//---WoodCube

class WoodCube extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, score_position){
        super(scene, x, y, "item_woodcube");
        this.scene.add.existing(this);
        this.setInteractive({ draggable: true, useHandCursor: true });
        this.on("drag", () => {
            if (this.scene.sys.game.scale.gameSize._width == 1280) {
                this.x = game.input.activePointer.x;
                this.y = game.input.activePointer.y;
            } else {
                this.x = game.input.activePointer.y;
                this.y = 960 - game.input.activePointer.x;
            }
            this.depth = this.y;
            this.text_score.depth = this.depth + 1;
            this.angle = 0;
            this.text_score.x = this.x;
            this.text_score.y = this.y;
            //this.text_score.depth = this.depth + 1;
            this.text_score.angle = 0;
            this.flag_drag = 1;
        });
        this.on("dragend", () => {
            this.text_score.visible = true;
            this.flag_drag = 0;
            sound_woodcube.play();
            //check other cube depth
            for (let i = 0; i < group_scoreMeter.getLength(); i++) {
                let _otherCube = group_scoreMeter.getChildren()[i];
                if (
                    this.checkOverlap(this, _otherCube)
                    && this.y < _otherCube.y
                    && this.depth < _otherCube.depth
                ) {
                    this.depth = group_scoreMeter.getChildren()[i].depth + 1;
                    this.text_score.depth = this.depth + 1;
                }
            }
        });
        this.speed_x = 0;
        this.speed_y = 0;
        this.score_position = score_position;
        let _score_array = ("00000000" + local_score).slice(-8).split("");
        let _score_txt = _score_array[this.score_position];
        this.text_score = scene.add.text(
            x, 
            y, 
            _score_txt, 
            {font: "bold 16px Arial", fill: "#864A2B"}
        ).setOrigin(0.5);
        this.count = 0;
        this.line_y = y;      //initial value of line_y, the same as first position of y
        this.line_y_max = 500;  //max floor position
        this.line_y_min = 900;
        this.line_x_r = 1200;   //right side
        this.line_x_l = 50;     //left side
        this.scale = 0.13;
        this.flag_drag = 0;
        this.flag_kick = 0;
        group_update.add(this);
        this.depth = this.y;
        this.text_score.depth = this.depth + 1;
    }

    checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        //boundsA.x += boundsA.width/4;
        //boundsA.y += boundsA.height/2;
        //boundsA.width /= 2;
        //boundsA.height /= 3;
        var boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
    
    //### on_kick
    on_kick() {
        this.speed_x = 4 + Math.random() * 3;
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 4 + Math.random() * 3;
        this.count = 0;
        //this.text_score.visible = false;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        sound_dice.play();
        this.flag_kick = 1;
    }
    
    //### update()
    update(){
        this.count += 1;
        //update score
        if (this.count % 500 == 1) {
            let _score_array = ("00000000" + local_score).slice(-8).split("");
            let _score_txt = _score_array[this.score_position];
            this.text_score.setText(_score_txt);
        }
        //check speed
        if (
            Math.abs(this.speed_x) <= 0.5
            && Math.abs(this.speed_y) <= 0.5
            && this.line_y - this.y <= 1
            && this.flag_drag == 0
        ) {
            //when stop
            //this.text_score.visible = true;
            this.text_score.x = this.x;
            this.text_score.y = this.y;
            this.text_score.angle = this.angle;
            this.flag_kick = 0;
        } else if (this.flag_kick == 1 && this.flag_drag == 0) {
            //dept
            this.depth = this.line_y;
            this.text_score.depth = this.depth + 1;
            //this.text_score.depth = this.line_y + 1;
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
            this.text_score.x = this.x;
            this.text_score.y = this.y;
            //increase angle
            this.angle += this.speed_x * 3;
            this.text_score.angle = this.angle;
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
    }
}


//---Twinkles
function summon_twinkles(scene, _mode, _num, _x=500, _y=600){
    //***TODO*** img
    let _img;
    // 0-11
    let _li_twinkle = [
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
        "twinkle_01",
    ];
    let _li_sparkle = [
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
        "sparkle_01",
    ];
    let _li_glitter = [
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
        "glitter_01",
    ];
    //debug
    //_num = 1;
    if (_mode == "twinkle"){
        _img = _li_twinkle[_num];
    } else if (_mode == "sparkle") {
        _img = _li_sparkle[_num];
    } else if (_mode == "glitter") {
        _img = _li_glitter[_num];
    }
    new Twinkles(scene, _x, _y, _img);
}
class Twinkles extends Phaser.GameObjects.Sprite{
    constructor(scene, _x, _y, _img, _pos_x=23, _pos_y=20){
        super(scene, _x, _y, _img);
        this.x = _x;
        this.y = _y;
        this.pos_x = _pos_x;
        this.pos_y = _pos_y;
        this.scene.add.existing(this);
        this.setInteractive({ draggable: true, useHandCursor: true });
        this.on("drag", () => {
            if (this.scene.sys.game.scale.gameSize._width == 1280) {
                this.x = game.input.activePointer.x;
                this.y = game.input.activePointer.y;
            } else {
                this.x = game.input.activePointer.y;
                this.y = 960 - game.input.activePointer.x;
            }
            this.depth = this.y;
            this.angle = 0;
            this.flag_drag = 1;
        });
        this.on("dragend", () => {
            //check follow
            if ( 
                this.checkOverlap(this, murasakisan) 
                && murasakisan.followingTwinkle == 0
                && (
                    murasakisan.mode == "moving" 
                    || murasakisan.mode == "resting"
                    || murasakisan.mode == "sleeping"
                )
            ) {
                this.flag_follow = 1;
                murasakisan.on_click();
                sound_hat.play();
                murasakisan.followingTwinkle = this;
            } else {
                this.flag_follow = 0;
                if (murasakisan.followingTwinkle == this) {
                    murasakisan.followingTwinkle = 0;
                }
            }
            this.flag_drag = 0;
        });
        this.speed_x = 0;
        this.speed_y = 0;
        this.count = 0;
        this.line_y = this.y;      //initial value of line_y, the same as first position of y
        this.line_y_max = 500;  //max floor position
        this.line_y_min = 900;
        this.line_x_r = 1200;   //right side
        this.line_x_l = 50;     //left side
        this.scale = 0.1;
        this.flag_drag = 0;
        this.flag_kick = 0;
        this.flag_follow = 0;
        group_update.add(this);
        this.depth = this.y;
    }

    checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
    
    //### on_follow
    on_follow() {
        this.x = murasakisan.x + this.pos_x;
        this.y = murasakisan.y + this.pos_y;
        this.depth = murasakisan.depth+1;
    }
    
    //### on_kick
    on_kick() {
        this.speed_x = 4 + Math.random() * 3;
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 4 + Math.random() * 3;
        this.count = 0;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        //sound_dice.play();
        this.flag_kick = 1;
    }
    _during_kick() {
        //dept
        this.depth = this.line_y;
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
                //sound_dice_impact.play();
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
            //sound_dice_impact.play();
        } else if (this.x <= this.line_x_l) {
            this.x = this.line_x_l;
            this.speed_x *= -0.9;
            //sound_dice_impact.play();
        }
        //when stop
        if (
            Math.abs(this.speed_x) <= 0.5
            && Math.abs(this.speed_y) <= 0.5
            && this.line_y - this.y <= 1
            && this.flag_drag == 0
        ) {
            this.flag_kick = 0;
        }
    }
    
    //### update()
    update(){
        this.count += 1;
        //on kick
        if (this.flag_drag == 1) {
            ;
        } else  if (this.flag_kick == 1) {
            this._during_kick();
        } else if (this.flag_follow == 1) {
            this.on_follow();
        }
    }
}


//---Pinwheel
function summon_pinwheel (scene, _x=350, _y=750) {
    group_pinwheel = scene.add.group();
    group_pinwheel.x = _x;
    group_pinwheel.y = _y;
    let _pin1 = new Pinwheel(
        scene, _x, _y, "item_pinwheel", 
        15, 0, 
        0.7+Math.random()*0.25, 
        0.05+Math.random()*0.2, 
        3+Math.random()*3,
        1,
        0
    );
    let _pin2 = new Pinwheel(
        scene, _x, _y, "item_pinwheel", 
        -10, 
        -10, 
        0.7+Math.random()*0.25, 
        0.05+Math.random()*0.2, 
        3+Math.random()*3,
        0,
        1
    );
    let _pin3 = new Pinwheel(
        scene, _x, _y, "item_pinwheel", 
        -10, 
        +10, 
        0.7+Math.random()*0.25, 
        0.05+Math.random()*0.2, 
        3+Math.random()*3,
        0,
        2
    );
    group_pinwheel.add(_pin1);
    group_pinwheel.add(_pin2);
    group_pinwheel.add(_pin3);
    group_pinwheel.flag_spin = 1;
}

class Pinwheel extends Phaser.GameObjects.Sprite{
    constructor(
        scene, 
        _x, 
        _y, 
        _img="item_pinwheel", 
        _delta_x, 
        _delta_y, 
        _dynamic_friction, 
        _static_friction,
        _coff,
        _flag_primary,
        _frameNo
    ){
        super(scene, _x, _y, _img);
        this.x = _x + _delta_x;
        this.y = _y + _delta_y;
        this.delta_x = _delta_x;
        this.delta_y = _delta_y;
        this.scene.add.existing(this);
        this.setInteractive({ draggable: true, useHandCursor: true });
        this.on("drag", () => {
            if (this.scene.sys.game.scale.gameSize._width == 1280) {
                group_pinwheel.x = game.input.activePointer.x;
                group_pinwheel.y = game.input.activePointer.y;
                //this.x = group_pinwheel.x + this.delta_x;
                //this.y = group_pinwheel.y + this.delta_y;
            } else {
                group_pinwheel.x = game.input.activePointer.y;
                group_pinwheel.y = 960 - game.input.activePointer.x;
                //this.x = group_pinwheel.x + this.delta_x;
                //this.y = group_pinwheel.y + this.delta_y;
            }
            this.depth = this.y;
            group_pinwheel.flag_drag = 1;
        });
        this.on("dragend", () => {
            group_pinwheel.flag_drag = 0;
            if (local_owner == local_wallet) {
                let _pos = [group_pinwheel.x, group_pinwheel.y];
                localStorage.setItem("pos_item_pinwheel", JSON.stringify(_pos));
            }
            // when dragend, spin all wheels
            group_pinwheel.children.iterate(function(child){
                child.tx_counts_forPinwheel = 1 + Math.random()*3;
            });
            //this.tx_counts_forPinwheel = 3+Math.random()*7;
        });
        this.on("pointerdown", () => {
            /*
            if (group_pinwheel.flag_spin == 0) {
                group_pinwheel.flag_spin = 1;
            } else {
                group_pinwheel.flag_spin = 0;
            }
            */
        });
        this.flag_spin = 1;
        this.count = 0;
        this.scale = 0.2;
        this.flag_drag = 0;
        group_update.add(this);
        this.depth = this.y;
        this.dynamic_friction = _dynamic_friction;
        this.static_friction = _static_friction;
        this.coff = _coff;
        this.tx_counts_forPinwheel = -1;
        this.previous_tx_counts_forPinwheel = -1;
        this.flag_primary = _flag_primary;
        this.setFrame(_frameNo);
    }    
    //### update()
    update(){
        this.count += 1;
        //adjust position based on group x/y
        this.x = group_pinwheel.x + this.delta_x;
        this.y = group_pinwheel.y + this.delta_y;
        //spin check
        if (group_pinwheel.flag_spin == 1) {
            //spin
            if (this.tx_counts_forPinwheel > 0){
                this.angle -= this.tx_counts_forPinwheel * this.coff;
            }
            //update wind (=this.tx_counts_forPinwheel)
            if (this.count % 30 == 0) {
                //when global wind > previous global wind, update self wind
                if (
                    tx_counts_forPinwheel > this.previous_tx_counts_forPinwheel
                    && tx_counts_forPinwheel > 0
                ){
                    this.tx_counts_forPinwheel = tx_counts_forPinwheel;
                    this.dynamic_friction = 0.7+Math.random()*0.25;
                    this.static_friction = 0.05+Math.random()*0.05;
                    this.coff = 3+Math.random()*3;
                }
                //store previous global wind
                this.previous_tx_counts_forPinwheel = tx_counts_forPinwheel
                //decrease self wind
                this.tx_counts_forPinwheel *= this.dynamic_friction;   //dynamic friction
                this.tx_counts_forPinwheel -= this.static_friction;   //static friction
                if (this.tx_counts_forPinwheel < 0){
                    this.tx_counts_forPinwheel = 0;
                }
            }
            //decrease global wind, primary_flag
            if (this.flag_primary == 1 && tx_counts_forPinwheel > 0) {
                tx_counts_forPinwheel -= 0.1;
            }
        }
    }
}


//---RetroAlphabet
class RetroAlphabet extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y, direction, scale, frame, delay, speedMod_y, img){
        super(scene, x, y, img);
        this.scene.add.existing(this);
        this.speed_x = 0;
        this.speed_y = 0;
        this.line_y = 0;
        this.count = 0;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.scale = scale;
        this.setFrame(frame);
        this.delay = delay;
        this.speedMod_y = speedMod_y;
        this.depth = this.y;
        group_update.add(this);
        this.on_summon();
    }
    
    //### on_summon
    on_summon() {
        this.line_y = this.y;
        if (this.line_y < 510) {
            this.line_y = 510;
        }
        this.speed_x = 1.5 * this.direction;
        this.speed_y = 2 + Math.random() * 4;
        this.count = 0;
    }
    
    //### update()
    update(){
        this.count += 1;
        if (this.delay > 0) {
            this.delay -= 1;
            this.depth = -1;
            return 0;
        }
        //check alive time
        if (this.count >= 500) {
            this.destroy();
        }
        this.setDepth(this.line_y);
        //reduction of y speed
        this.speed_y -= 0.6;
        //position moving
        this.x += this.speed_x;
        this.y -= this.speed_y;
        //increase angle
        //this.angle += this.speed_x * 5;
        //refrection y
        if (this.y >= this.line_y) {
            this.y = this.line_y;
            this.speed_y = 0;
            //this.speed_y *= -0.3;   //y bounce
            //this.speed_x *= 0.9;    //x friction
        }
        //mod y pos
        if (this.count % this.speedMod_y == 0){
            this.line_y += 1;
        }
    }
}


// shuffle array as random
// https://zenn.dev/k_kazukiiiiii/articles/cf3256ef6cbd84
const shuffleArray = (array) => {
    const cloneArray = [...array]
    for (let i = cloneArray.length - 1; i >= 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1))
      // 配列の要素の順番を入れ替える
      let tmpStorage = cloneArray[i]
      cloneArray[i] = cloneArray[rand]
      cloneArray[rand] = tmpStorage
    }
    return cloneArray
}


// summon retro ascii characters
function summon_retroAlphabet (scene, x, y){

    // determine direction
    let _direction = 1;
    if (Math.random()*100 <= 50) {
        _direction = -1;
    }
    
    // determine y pos speed
    let _ys = [0,0,0,0,0,0,8,9,10,11,12,13,14,15];
    let _speedMod_y = _ys[Math.floor(Math.random()*_ys.length)];
    
    // set scale
    let _scale = 0.2;
    
    // determine mode
    let _modes = [
        "band1",
        "band2",
        "band3",
        "band4",
        "df1",
        "df2",
        "df3",
        "dda1",
        "dda2",
        "dda3",
    ];
    let _mode = _modes[Math.floor(Math.random()*_modes.length)];
    
    // execute each mode
    if (_mode == "band1"){  // DDD @
        let _enes = [0,1,2,3,4,5,6,7,8];
        let _num = 4 + Math.floor(Math.random()*6);
        let _count = 0;
        new RetroAlphabet(scene, x, y, _direction, _scale, 30, 0, _speedMod_y,  "retro_ascii");
        for (i=0; i<=_num; i++) {
            _count += 1;
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 20+10*_count, _speedMod_y,"retro_ascii");
        }
    } else if (_mode == "band2") {  // jjjjj @
        let _enes = [9];
        let _num = 6 + Math.floor(Math.random()*4);
        let _count = 0;
        new RetroAlphabet(scene, x, y, _direction, _scale, 30, 0, _speedMod_y, "retro_ascii");
        for (i=0; i<=_num; i++) {
            _count += 1;
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 30+5*_count, _speedMod_y,"retro_ascii");
        }
    } else if (_mode == "band3") {  // @ h
        //let _enes = [39, 47, 48, 49];
        let _enes = [39, 47, 48, 49];
        _enes = shuffleArray(_enes);
        let _num = 1 + Math.floor(Math.random()*2);
        let _count = 0;
        for (i=0; i<_num; i++) {
            let _ene = _enes.pop();
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 10*_count, _speedMod_y,"retro_ascii");
            _count += 1;
        }
        new RetroAlphabet(scene, x, y, _direction, _scale, 30, 20+10*_count, _speedMod_y,"retro_ascii");
    } else if (_mode == "band4") {  // gG @
        let _enes = [40,41,42,43,44,45,46];
        let _num = 2 + Math.floor(Math.random()*2);
        let _count = 0;
        new RetroAlphabet(scene, x, y, _direction, _scale, 30, 0, _speedMod_y, "retro_ascii");
        for (i=0; i<_num; i++) {
            _count += 1;
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 30+10*_count, _speedMod_y,"retro_ascii");
        }
    } else if (_mode == "df1") {    // NNNN @@@
        let _count = 0;
        let _charas = [32,32,32,32,32,33,34,35,36];
        let _num = 1 + Math.floor(Math.random()*2);
        for (i=0; i<=_num; i++) {
            let _chara = _charas[Math.floor(Math.random()*_charas.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _chara, 10*_count, _speedMod_y,"retro_ascii");
            _count += 1;
        }
        let _enes = [20,21,21,21,21,21,21,21,22];
        _num = 4 + Math.floor(Math.random()*4);
        for (i=0; i<=_num; i++) {
            _count += 1;
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 10+10*_count, _speedMod_y,"retro_ascii");
        }
    } else if (_mode == "df2") {    // @@@@ NNN
        let _count = 0;
        let _enes = [20,21,21,21,21,21,21,21,22];
        let _num = 2 + Math.floor(Math.random()*2);
        for (i=0; i<=_num; i++) {
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 10*_count, _speedMod_y,"retro_ascii");
            _count += 1;
        }
        let _charas = [37, 38];
        _num = 2 + Math.floor(Math.random()*2);
        for (i=0; i<=_num; i++) {
            _count += 1;
            let _chara = _charas[Math.floor(Math.random()*_charas.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _chara, 15*_count, _speedMod_y,"retro_ascii");
        }
    } else if (_mode == "df3") {    // H @@@@
        let _count = 0;
        let _charas = [32,32,32,32,32,33,34,35,36];
        let _num = 3 + Math.floor(Math.random()*3);
        for (i=0; i<=_num; i++) {
            let _chara = _charas[Math.floor(Math.random()*_charas.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _chara, 10*_count, _speedMod_y,"retro_ascii");
            _count += 1;
        }
        let _enes = [25,26,27,28,29];
        _num = 1;
        for (i=0; i<_num; i++) {
            _count += 1;
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 10+10*_count, _speedMod_y,"retro_ascii");
        }
    } else if (_mode == "dda1") {   // ZZZZZZ @
        let _enes = [10,10,10,10,10,10,10,11,12,13,14,15,15,15];
        let _num = 4 + Math.floor(Math.random()*6);
        let _count = 0;
        new RetroAlphabet(scene, x, y, _direction, _scale, 30, 0, _speedMod_y,"retro_ascii");
        for (i=0; i<=_num; i++) {
            _count += 1;
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 10+10*_count, _speedMod_y,"retro_ascii");
        }
    } else if (_mode == "dda2") {   // && @
        let _enes = [16,17];
        let _num = 1 + Math.floor(Math.random()*2);
        let _count = 0;
        new RetroAlphabet(scene, x, y, _direction, _scale, 30, 0, _speedMod_y,"retro_ascii");
        for (i=0; i<=_num; i++) {
            _count += 1;
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 20+10*_count, _speedMod_y,"retro_ascii");
        }
    } else if (_mode == "dda3") {   // FFF @
        let _enes = [18,19];
        let _num = 2 + Math.floor(Math.random()*2);
        let _count = 0;
        new RetroAlphabet(scene, x, y, _direction, _scale, 30, 0, _speedMod_y,"retro_ascii");
        for (i=0; i<=_num; i++) {
            _count += 1;
            let _ene = _enes[Math.floor(Math.random()*_enes.length)];
            new RetroAlphabet(scene, x, y, _direction, _scale, _ene, 20+10*_count, _speedMod_y,"retro_ascii");
        }
    }
}



//---Runpa

class Runpa extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, scale, img){
        super(scene, x, y, img);
        this.scene.add.existing(this);
        this.anims.play("item_runpa", true);
    	this.mode = "resting";
        this.submode = 0;
        this.count = 0;
        this.dist = "right";
        this.target_x = 0;
        this.target_y = 0;
        this.scale = scale;
        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        group_update.add(this);
    }

    checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        boundsA.x += boundsA.width/2;
        boundsA.y += boundsA.height*(3/4);
        boundsA.width /= 2;
        boundsA.height /= 6;
        var boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    //### on_click
    on_click() {
        if (this.mode == "moving" | this.mode == "resting") {
            this.mode = "sleeping";
            this.count = 0;
            this.submode = 0;
            this.anims.play("item_runpa_sleeping", true);
        } else if (this.mode == "sleeping") {
            this.mode = "resting";
            this.count = 0;
            this.submode = 0;
            this.anims.play("item_runpa", true);
        }
    }

    //### resting
    resting(){
	    this.count += 1;
        if (this.submode == 0) {
            this.resting_count = 150 + Math.random() * 50;
            this.submode = 1;
	    } else if (this.submode == 1){
	        if (this.count >= this.resting_count){
                this.mode = "moving";
                this.count = 0;
                this.submode = 0;
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
            //this.moving_speed = 0.3 + Math.random() * 0.2;  //0.3-0.5
            this.moving_speed = 0.5;
            this.moving_count = 150 + Math.random() * 50;    //70-100
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
            }else {
                this.dist = "right";
            }
        //moving
        }else if (this.count < this.moving_count) {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            //out of area check
            if (this.y < 500) { this.y = 500; }
            if (this.x < 50) { this.x = 50; }


            //collision

            //tokenBall
            if (
                flag_tokenBall == 2
                && this.count == 2 
                && Math.random()*100 >= 0
            ) {
                for (let i = 0; i < group_tokenBall.getLength(); i++) {
                    if (this.checkOverlap(this, group_tokenBall.getChildren()[i])){
                        group_tokenBall.getChildren()[i].on_click();
                        break;
                    }
                }
            }

            //fluffy
            if (
                this.count == 3
                && Math.random()*100 >= 0
            ) {
                for (let i = 0; i < group_star.getLength(); i++) {
                    if (this.checkOverlap(this, group_star.getChildren()[i])){
                        group_star.getChildren()[i].on_kick();
                        break;
                    }
                }
            }
            
            //woodcube
            if (
                this.count == 4
                && Math.random()*100 >= 0
            ) {
                for (let i = 0; i < group_scoreMeter.getLength(); i++) {
                    if (this.checkOverlap(this, group_scoreMeter.getChildren()[i])){
                        group_scoreMeter.getChildren()[i].on_kick();
                        break;
                    }
                }
            }

        //return to resting
        }else if (this.count >= this.moving_count) {
            this.mode = "resting";
            this.count = 0;
        }
    }

    //### sleeping
    sleeping() {
        ;
    }
    
    //### update()
    update(){
        if (this.mode == "resting") {this.resting();}
        else if (this.mode == "moving") {this.moving();}
        else if (this.mode == "sleeping") {this.sleeping();}
        //depth
        this.depth = this.y;
    }
}

function summon_runpa (scene, x, y) {
    let _runpa = new Runpa(scene, x, y, 0.4, "item_runpa");
    return _runpa;
}




//===[ FUNCTION ]=============================================================================


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
function makeMiniProgressBar(scene, x, y, length, width, color) {
    let bar = scene.add.graphics();
    bar.fillStyle(color, 1);
    bar.fillRect(0, 0, length, width);
    bar.x = x;
    bar.y = y;
    bar.depth = y+10;
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
        if (flag_onLight == 1) {
            if (bgm == bgm1) {
                bgm = bgm2;
            }else if (bgm == bgm2) {
                bgm = bgm3;
            }else {
                bgm = bgm1;
            }
        } else {
            bgm = bgm_n1;
        }
        bgm.play();
        flag_music = 1;
        item_musicbox.anims.play("item_musicbox_on", true);
    } else {
        bgm.stop();
        flag_music = 0;
        item_musicbox.anims.play("item_musicbox_off", true);
        if (murasakisan.mode == "listning"){
            murasakisan.mode = "resting";
            murasakisan.count = 0;
        }
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
    let _r = 70;
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

//---window

//### summon
function open_window_summon(scene) {

    //init
    let _x = 0;
    let _y = 0;
    let _text = "";

    //create group
    group_window_summon = scene.add.group();

    //sound
    sound_window_open.play();

    //close window and summon
    function close_window_summon(_class) {
        group_window_summon.destroy(true);
        window_summon_murasaki_back.destroy(true);
        if (_class >= 0) {
            contract_summon(_class);
            sound_button_on.play();
        } else {
            sound_window_select.play();
        }
    }

    //create button with color and class
    function create_button(_x, _y, _text, _color, _class, scene, _size) {
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(_size).setFontFamily("Arial").setFill(_color)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => close_window_summon(_class) )
            .on("pointerover", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerout", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: _color }))
            .on("pointerover", () => sound_window_pointerover.play())
        //change color of murasaki back
        obj.on("pointerover", () => {
            window_summon_murasaki_back.destroy();
            window_summon_murasaki_back = scene.add.graphics()
                .setDepth(5000+1)
                .fillStyle(_color.replace("#","0x"), 0.5)
                .fillRoundedRect(_x_back -_back_size/2, _y_back -_back_size/2, _back_size, _back_size, 32/2)
        });
        return obj;
    }

    //create window
    let window_summon = scene.add.sprite(640, 480, "window").setInteractive();

    //create message
    _text = "";
    _text += "Start Free Trial!\n";
    _text += "Some gas fee is all you need to try the game.\n";
    _text += "\n";
    _text += "Choose your favorite flower to summon trial Murasaki-san.\n";
    _text += "(This does not affect any gameplays at the moment :)\n";
    let msg1 = scene.add.text(180, 120, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#333333")

    //icon
    _x = 950;
    _y = 180;
    let _x_back = _x;
    let _y_back = _y;
    let _back_size = 48*2
    window_summon_murasaki_back = scene.add.graphics()
        .setDepth(5000+1)
        .fillStyle(0xE60012, 0.5)
        .fillRoundedRect(_x_back -_back_size/2, _y_back -_back_size/2, _back_size, _back_size, 32/2)
    let _murasaki = scene.add.sprite(_x, _y, "murasaki_left")
        .setDepth(5000+2)
        .setOrigin(0.5)
        .setScale(0.45/1.5)
        .anims.play("murasaki_left", true);

    //create button
    _x = 240;
    _y = 280;
    let _y_add = 70;
    let button0 = create_button(_x, _y+_y_add*0, "✿ Rose", "#E60012", 0, scene, 40)
    let button1 = create_button(_x, _y+_y_add*1, "✿ Marigold", "#F39800", 1, scene, 40)
    let button2 = create_button(_x, _y+_y_add*2, "✿ Dandelion", "#FFF100", 2, scene, 40)
    let button3 = create_button(_x, _y+_y_add*3, "✿ Rosemary", "#8FC31F", 3, scene, 40);
    let button4 = create_button(_x, _y+_y_add*4, "✿ Olive", "#009944", 4, scene, 40);
    let button5 = create_button(_x, _y+_y_add*5, "✿ Holly", "#009E96", 5, scene, 40);
    let button6 = create_button(_x+460, _y+_y_add*0, "✿ Nemophila", "#00A0E9", 6, scene, 40);
    let button7 = create_button(_x+460, _y+_y_add*1, "✿ Hydrangea", "#0068B7", 7, scene, 40);
    let button8 = create_button(_x+460, _y+_y_add*2, "✿ Forget-me-not", "#1D2088", 8, scene, 40);
    let button9 = create_button(_x+460, _y+_y_add*3, "✿ Sumire", "#920783", 9, scene, 40);
    let button10 = create_button(_x+460, _y+_y_add*4, "✿ Gerbera", "#E4007F", 10, scene, 40);
    let button11 = create_button(_x+460, _y+_y_add*5, "✿ Anemone", "#E5004F", 11, scene, 40);
    let button_cancel = create_button(1080, 840, "Cancel", "#000000", -1, scene, 30);

    //create message2
    _text = "";
    _text += "Trial limitations:\n";
    _text += "  ♣ Level cap is 4.\n";
    _text += "  ♣ Item crafting cap is 3.\n";
    _text += "  ♣ Resouse correcting cap is 3000.\n";
    _text += "  ♣ Marketplace is unavailable.\n";
    let msg2 = scene.add.text(700, 720, _text)
            .setFontSize(20).setFontFamily("Arial").setFill("#0000ff")

    //create message3
    _text = "";
    _text += "All status and NFTs owned in the trial\n";
    _text += "will be taken on to the main gameplay.\n";
    let msg3 = scene.add.text(200, 720, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#E62E8B")

    //nainai
    let _nainai = scene.add.sprite(1100, 680, "ff_duringFestival_isEndable_left")
        .setOrigin(0.5)
        .setScale(0.25);
    
    //flower
    function _increase_angle (_image) {
        _image.setAngle(_image.angle + 30);
        setTimeout( () => {
            _increase_angle(_image);
        }, 1000);
    }
    for (i=0; i<3; i++) {
        setTimeout( () => {
            if (typeof(group_window_summon.scene) != "undefined"){
                let _ohana = scene.add.image(
                    1050 -10 +Math.random()*20,
                    650 -20 +Math.random()*40,
                    "par_flowers"
                )
                    .setFrame(Math.floor(Math.random()*5))
                    .setOrigin(0.5)
                    .setScale(0.1 + Math.random()*0.05)
                    .setAngle(Math.random()*360)
                    .setDepth(5000+1);
                _increase_angle(_ohana);
                group_window_summon.add(_ohana);
                sound_nyui.play();
            }
        }, 500 + i*500);
    }
    
    //add group
    group_window_summon.add(window_summon);
    group_window_summon.add(msg1);
    group_window_summon.add(msg2);
    group_window_summon.add(msg3);
    group_window_summon.add(_nainai);
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
    group_window_summon.add(window_summon_murasaki_back);
    group_window_summon.add(_murasaki);
    //depth
    group_window_summon.setDepth(5000);
    _murasaki.setDepth(5000+2);
}


//### convert
function open_window_convert(scene) {

    sound_window_open.play();

    //create group
    group_window_convert = scene.add.group();

    //close window and summon
    function close_window_summon(_class) {
        group_window_convert.destroy(true);
        if (_class >= 0) {
            sound_button_on.play();
            contract_convert();
            open_window_reload(scene)
        } else {
            sound_window_select.play();
        }
    }

    //create button with color and class
    function create_button(_x, _y, _text, _color, _class, scene, _size) {
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(_size).setFontFamily("Arial").setFill(_color)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => close_window_summon(_class) )
            .on("pointerover", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerout", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: _color }))
            .on("pointerover", () => sound_window_pointerover.play())
        return obj;
    }

    //create window
    let window_summon = scene.add.sprite(640, 480, "window").setInteractive();

    //create message
    let _text = "";
    _text += "End trial and continue game!\n";
    _text += "All status and NFTs that you own in the trial will be taken on.\n";
    let msg1 = scene.add.text(210, 120, _text)
            .setFontSize(28).setFontFamily("Arial").setFill("#333333")

    //msg2
    _text = "";
    _text += "After trial finished:\n";
    _text += "   ✿ can grow beyond Lv4.\n";
    _text += "   ✿ all items will be craftable.\n";
    _text += "   ✿ presentbox as crafting bonus will be activated.\n";
    _text += "   ✿ dApps staking bonus will be activated.\n";
    _text += "   ✿ a cat from other player can visit your house.\n";
    _text += "   ✿ Marketplace will be available.\n";
    let msg2 = scene.add.text(230, 210, _text)
        .setFontSize(24)
        .setFontFamily("Arial")
        .setFill("#E62E8B");

    //create button
    _text = ">> Start House of Murasaki-san <<";
    let _button = create_button(640, 480, _text, "#E60012", 0, scene, 40)
        .setOrigin(0.5);

    //msg3
    _text = "";
    _text += "Current Fee: " + local_price/10**18 + " $ASTR\n";
    let msg3 = scene.add.text(640, 480+65, _text)
        .setOrigin(0.5)
        .setFontSize(30)
        .setFontFamily("Arial")
        .setFill("#0000ff");

    //msg4
    _text = "";
    _text += "90% of fees are kept to grow the ecosystem.\n";
    _text += "    ♦ 45% will be stored in the staking vault to control inflation.\n";
    _text += "    ♦ 45% will be stored in the buyback treasury as player assets.\n";
    _text += "    ♦ the remaining 10% will be sent to the developer wallets.\n";
    _text += "    ♦ fee will increase as the ecosystem grows.\n";
    let msg4 = scene.add.text(230, 630, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#0000ff")

    //cancel button
    let button_cancel = create_button(1070, 840, "Cancel", "#000000", -1, scene, 30);
    
    //nainai
    let _nainai = scene.add.sprite(1060, 510, "ff_duringFestival_isEndable_left")
        .setOrigin(0.5)
        .setScale(0.25);
    
    //flower
    function _increase_angle (_image) {
        _image.setAngle(_image.angle + 30);
        setTimeout( () => {
            _increase_angle(_image);
        }, 1000);
    }
    for (i=0; i<3; i++) {
        setTimeout( () => {
            if (typeof(group_window_convert.scene) != "undefined"){
                let _ohana = scene.add.image(
                    1060 -50 -10 +Math.random()*20,
                    480 -20 +Math.random()*40,
                    "par_flowers"
                )
                    .setFrame(Math.floor(Math.random()*5))
                    .setOrigin(0.5)
                    .setScale(0.1 + Math.random()*0.05)
                    .setAngle(Math.random()*360)
                    .setDepth(5000+1);
                _increase_angle(_ohana);
                group_window_convert.add(_ohana);
                sound_nyui.play();
            }
        }, 500 + i*500);
    }
    
    //cat
    let _cat = scene.add.sprite(260, 490, "cats")
        .setOrigin(0.5)
        .setScale(0.4)
        .setFrame(4);

    //create group
    group_window_convert.add(window_summon);
    group_window_convert.add(msg1);
    group_window_convert.add(msg2);
    group_window_convert.add(msg3);
    group_window_convert.add(msg4);
    group_window_convert.add(_button);
    group_window_convert.add(button_cancel);
    group_window_convert.add(_nainai);
    group_window_convert.add(_cat);

    //set depth
    group_window_convert.setDepth(5000);
}


//### reload
function open_window_reload(scene) {

    //create group
    group_window_reload = scene.add.group();

    //create window
    let _window = scene.add.sprite(640, 480, "window").setInteractive();

    //create button with color and class
    function create_button(_x, _y, _text, _color, _class, scene, _size) {
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(_size).setFontFamily("Arial").setFill(_color)
            .setInteractive({useHandCursor: true})
            .on("pointerover", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerout", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: _color }))
            .on("pointerover", () => sound_window_pointerover.play())
            .on("pointerdown", () => {
                localStorage.setItem("flag_firstCelebration", 1);
                location.reload();
            });
        return obj;
    }

    //create message
    let _text = "";
    _text += "After transaction confirmed,\n"
    _text += "please reload the game.\n";
    let msg1 = scene.add.text(640, 350, _text)
            .setFontSize(32)
            .setFontFamily("Arial")
            .setFill("#333333")
            .setOrigin(0.5);

    //set depth of transaction text
    text_tx.setOrigin(0.5);
    text_tx.x = 640;
    text_tx.y = 460;
    text_tx.setFontSize(24);
    text_tx.depth = 5000+1;

    //create button
    _text = ">> Reload Game <<";
    let _button = create_button(640, 550, _text, "#E60012", 0, scene, 40)
        .setOrigin(0.5);

    //flower
    function _increase_angle (_image) {
        _image.setAngle(_image.angle + 30);
        setTimeout( () => {
            _increase_angle(_image);
        }, 1000);
    }
    let _ohana1 = scene.add.image(
        640-250,
        550,
        "par_flowers"
    )
        .setFrame(Math.floor(Math.random()*5))
        .setOrigin(0.5)
        .setScale(0.3)
        .setAngle(Math.random()*360)
        .setDepth(5000+1);
    _increase_angle(_ohana1);
    let _ohana2 = scene.add.image(
        640+250,
        550,
        "par_flowers"
    )
        .setFrame(Math.floor(Math.random()*5))
        .setOrigin(0.5)
        .setScale(0.3)
        .setAngle(Math.random()*360)
        .setDepth(5000+1);
    _increase_angle(_ohana2);
    group_window_reload.add(_ohana1);
    group_window_reload.add(_ohana2);
    
    //create group
    group_window_reload.add(_window);
    group_window_reload.add(msg1);
    group_window_reload.add(_button);

    //set depth
    group_window_reload.setDepth(5000);
}


//### craft

//function, create temporary item indicator
function create_item_indicator(scene, _item_type) {
    try {
        group_item_indicator.destroy(true);
    } catch (error) {
        ;
    }
    if (_item_type <= 128) {
        if (
            local_items[_item_type] > 0
            || local_items[_item_type+64] > 0
            || local_items[_item_type+128] > 0
        ){
            return 0;
        }
    } else if (local_items[_item_type] > 0) {
            return 0;
    }
    let _item_name = dic_items_reverse[_item_type];
    let _img_name = dic_items[_item_name]["img_name"];
    let _x = dic_items[_item_name]["pos_x"];
    let _y = dic_items[_item_name]["pos_y"];
    let _scale = dic_items[_item_name]["scale"];
    let _description = dic_items[_item_name]["description"];
    group_item_indicator = scene.add.group();
    item_indicator_text = scene.add.text(
        _x, 
        _y, 
        _description,
        {font: "18px Arial", fill: "#0000ff", backgroundColor: "#ffffff"}
    ).setOrigin(0.5).setDepth(_y+1).setVisible(false);
    group_item_indicator.add(item_indicator_text);
    item_indicator_click = 0;
    item_indicator = scene.add.sprite(_x, _y, _img_name)
        .setScale(_scale)
        .setOrigin(0.5)
        .setAlpha(0.3)
        .setDepth(2)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => {
            item_indicator_text.setVisible(true);
            item_indicator_click += 1;
            let _item_indicator_click_now = item_indicator_click;
            setTimeout( () => {
                if (_item_indicator_click_now == item_indicator_click) {
                    item_indicator_text.setVisible(false);
                }
            }, 2000)
        });
    item_indicator.item_type = _item_type;
    //individual adjustment
    if (["Helmet", "Straw Hat", "Mortarboard"].includes(_item_name)) {
        item_indicator.setAngle(90);
    }
    group_item_indicator.add(item_indicator);
}

async function update_item_indicator_bar(){
    let _modified_dc = await contract_get_modified_dc(summoner, local_crafting_item_type);
    let _resting_dc = local_crafting_calc / 86400 * 1000;
    let _percent = 1 - _resting_dc / _modified_dc;
    try {
        item_indicator_bar.scaleX = _percent;
    } catch(error) {
        ;
    }
}

function open_window_craft (scene) {

    //nyuinyui
    if (typeof nyuinyui != "undefined") {
        nyuinyui.setVisible(true);
        nyuinyui.reset();
    }

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
        if (_item >= 0) {
            if (typeof nyuinyui != "undefined") {
                nyuinyui.setVisible(false);
                nyuinyui.reset();
            }
        }
        //reset minus _item
        if (_item < 0) {
            _item = 0;
        }
        flag_window_craft = 0;
        //destroy group
        //group_window_crafting.destroy(true);
        group_window_crafting.setVisible(false);
        //during crafting, return 0
        if (
            local_crafting_status == 1 
            || button_crafting_resume.visible == true 
            || local_crafting_resume_flag == 1
        ) {
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
        if (_level > 0 && _item > 0 && wallet == local_owner) {

            //when regular, limited item_type
            if (
                gamemode == "trial"
                && (
                    global_selected_crafting_item != 1
                    && global_selected_crafting_item != 17
                    && global_selected_crafting_item != 33
                )
            ){
                text_crafting_selected_item_ohana.setText("");
                text_crafting_selected_item_kusa.setText("");
                text_crafting_selected_item_time.setText("");
                text_crafting_selected_item_heart.setText("");
                icon_crafting_ohana.visible = false;
                icon_crafting_kusa.visible = false;
                icon_crafting_time.visible = false;
                text_select_item.setText('"'+dic_items_reverse[_item]+'"');
                text_crafting_selected_item_ohana.setText("Not available in trial.");
                text_crafting_selected_item_ohana.setColor("#0000ff");
                create_item_indicator(murasakisan.scene, _item);
            } else {
                let _dc = await get_modified_dc(summoner, _item);
                let _total_sec = _dc / 1000 * BASE_SEC;
                let _day = Math.floor(_total_sec / 86400);
                let _hr = Math.floor(_total_sec % 86400 / 3600);
                let _min = Math.floor(_total_sec % 3600 / 60);
                let _coin = global_selected_crafting_item_dc[2];
                let _material = global_selected_crafting_item_dc[3];
                text_crafting_selected_item_ohana.setText(_coin);
                text_crafting_selected_item_ohana.setColor("#000000");
                text_crafting_selected_item_kusa.setText(_material);
                text_crafting_selected_item_time.setText(_day + "d:" + _hr + "h:" + _min + "m");
                text_crafting_selected_item_ohana.visible = true;
                text_crafting_selected_item_kusa.visible = true;
                text_crafting_selected_item_time.visible = true;
                icon_crafting_ohana.visible = true;
                icon_crafting_kusa.visible = true;
                icon_crafting_time.visible = true;
                //text_select_item.setText('"'+array_item_name[_item]+'"');
                text_select_item.setText('"'+dic_items_reverse[_item]+'"');
                //get herat required
                //let _heart_required = await contract_get_heart_required(_item);
                //global_selected_crafting_item_required_heart = _heart_required;
                //text_crafting_selected_item_heart.setText(_heart_required);
                //icon_crafting_heart.visible = true;
                //item indicator
                create_item_indicator(murasakisan.scene, _item);
            }
        } else {    //when cancel
            text_crafting_selected_item_ohana.setText("");
            text_crafting_selected_item_kusa.setText("");
            text_crafting_selected_item_time.setText("");
            text_crafting_selected_item_heart.setText("");
            icon_crafting_ohana.visible = false;
            icon_crafting_kusa.visible = false;
            icon_crafting_time.visible = false;
            //icon_crafting_heart.visible = false;
            text_select_item.setText(">> Select Item <<");
            //destroy item indicator
            try {
                group_item_indicator.destroy(true);
            } catch (error) {
                ;
            }
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
        let _color = "black";
        if (rarity == "common") {
            _color = "black";
        }else if (rarity == "uncommon") {
            _color = "blue";
        }else if (rarity == "rare") {
            _color = "#be5504";
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

    //create msg
    let _text1 = "[A,B,C]:                                                              (item count)";
    let _text2 = "              A=Common,";
    let _text3 = "                                   B=Uncommon,";
    let _text4 = "                                                            C=Rare";
    let _text5 = "Higher INT reduces the time required for crafting.";
    group_window_crafting.add(
        scene.add.text(140, 90, _text1)
            .setFontFamily("Arial")
            .setFontSize(16)
            .setFill("black")
    );
    group_window_crafting.add(
        scene.add.text(140, 90, _text2)
            .setFontFamily("Arial")
            .setFontSize(16)
            .setFill("black")
    );
    group_window_crafting.add(
        scene.add.text(140, 90, _text3)
            .setFontFamily("Arial")
            .setFontSize(16)
            .setFill("blue")
    );
    group_window_crafting.add(
        scene.add.text(140, 90, _text4)
            .setFontFamily("Arial")
            .setFontSize(16)
            .setFill("#be5504")
    );
    group_window_crafting.add(
        scene.add.text(820, 90, _text5)
            .setFontFamily("Arial")
            .setFontSize(16)
            .setFill("blue")
    );
    /*
    let _text = "Item count: [ (common), (uncommon), (rare) ]";
    group_window_crafting.add(
        scene.add.text(840, 90, _text)
            .setFontFamily("Arial")
            .setFontSize(16)
            .setFill("#444444")
    );
    */

    //create item list text
    let _x = 170;
    let _y = 80;
    let _y_add = 40;
    let _item_count = 0;
    //mining_item: button
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
        //eval(`_button  = create_button(_x, _y + _y_add *  ${i}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + array_item_name[${i}],  ${i},  scene, _rarity);`)
        eval(`_button  = create_button(_x, _y + _y_add *  ${i}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + dic_items_reverse[${i}],  ${i},  scene, _rarity);`)
        group_window_crafting.add(_button);
    }
    //mining_item: icon
    for (var i = 1; i <= 16; i++) {
        let _item_name = dic_items_reverse[i];
        let _item_img = dic_items[_item_name]["img_name"];
        let _height = game.textures.get(_item_img).source[0].height;
        let _scale = 44 / _height;
        let _icon = scene.add.image(
            _x-25,
            _y+15 + _y_add * i,
            _item_img
        )
            .setOrigin(0.5)
            .setScale(_scale);
        group_window_crafting.add(_icon);
    }

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
        //eval(`_button  = create_button(_x, _y + _y_add *  ${i-16}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + array_item_name[${i}],  ${i},  scene, _rarity);`)
        eval(`_button  = create_button(_x, _y + _y_add *  ${i-16}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + dic_items_reverse[${i}],  ${i},  scene, _rarity);`)
        group_window_crafting.add(_button);
    }
    //farming_item: icon
    for (var i = 17; i <= 32; i++) {
        let _item_name = dic_items_reverse[i];
        let _item_img = dic_items[_item_name]["img_name"];
        let _height = game.textures.get(_item_img).source[0].height;
        let _scale = 44 / _height;
        let _icon = scene.add.image(
            _x-25,
            _y+15 + _y_add * (i-16),
            _item_img
        )
            .setOrigin(0.5)
            .setScale(_scale);
        //individual adjustment
        if (_item_name == "Score Meter") {
            _icon.x -= 8;
            _icon.scale *= 0.9;
        }
        group_window_crafting.add(_icon);
    }

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
        //eval(`_button  = create_button(_x, _y + _y_add *  ${i-32}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + array_item_name[${i}],  ${i},  scene, _rarity);`)
        eval(`_button  = create_button(_x, _y + _y_add *  ${i-32}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + ',' + local_items[${i+128}] + '] ' + dic_items_reverse[${i}],  ${i},  scene, _rarity);`)
        group_window_crafting.add(_button);
    }
    //crafting_item: icon
    for (var i = 33; i <= 48; i++) {
        let _item_name = dic_items_reverse[i];
        let _item_img = dic_items[_item_name]["img_name"];
        let _height = game.textures.get(_item_img).source[0].height;
        let _scale = 44 / _height;
        let _icon = scene.add.image(
            _x-25,
            _y+15 + _y_add * (i-32),
            _item_img
        )
            .setOrigin(0.5)
            .setScale(_scale);
        group_window_crafting.add(_icon);
    }

    //special items
    let _rarity;

    //coin/material bag
    if (local_items[194] > 0) { _rarity = "common" } else { _rarity = null }
    let button_crafting_item194  = create_button(170, 80 + 40*17, "[" +local_items[194]+ "] Coin Bank", 194,  scene, _rarity);
    if (local_items[195] > 0) { _rarity = "common" } else { _rarity = null }
    let button_crafting_item195  = create_button(520, 80 + 40*17, "[" +local_items[195]+ "] Leaf Pouch", 195,  scene, _rarity);
    let item194_icon = scene.add.sprite(170-25, 80+17 + 40*17, "item_bank").setScale(0.16);
    let item195_icon = scene.add.sprite(520-25, 80+17 + 40*17, "item_pouch").setScale(0.14);
    group_window_crafting.add(button_crafting_item194);
    group_window_crafting.add(button_crafting_item195);
    group_window_crafting.add(item194_icon);
    group_window_crafting.add(item195_icon);
    
    //mail
    if (local_items[196] > 0) { _rarity = "common" } else { _rarity = null }
    let button_crafting_item196  = create_button(870, 80 + 40*17, "[" +local_items[196]+ "] Cat Mail", 196,  scene, _rarity);
    let item196_icon = scene.add.sprite(870-0, 80+30 + 40*17, "item_mail").setScale(0.6);
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
    let button_crafting_close = create_button(1070, 840, "Cancel", 0, scene, _rarity);
    group_window_crafting.add(button_crafting_close);
    
    //upgrade button
    if (wallet == local_owner) {
        let obj_upgrade = scene.add.text(220, 810, ">> Upgrade Item <<")
            .setFontSize(30).setFontFamily("Arial")
            .setInteractive({useHandCursor: true})
            .setFill("black")
            .setBackgroundColor("#ecd9ff")
            .on("pointerdown", () => close_crafting_window(-1) )
            .on("pointerdown", () => sound_window_open.play() )
            .on("pointerover", () => obj_upgrade.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#d19dff' }))
            .on("pointerover", () => sound_window_pointerover.play())
            .on("pointerout", () => obj_upgrade.setStyle({ fontSize: 30, fontFamily: "Arial", fill: "black" }))
            .on("pointerdown", () => open_window_upgrade(scene) );
        group_window_crafting.add(obj_upgrade);
    }

    //depth
    group_window_crafting.setDepth(5000);
}


//### upgrade
function open_window_upgrade(scene) {

    function close_window_upgrade() {
        group_window_upgrade.destroy(true);
        //nyuinyui
        if (typeof nyuinyui != "undefined") {
            nyuinyui.setVisible(false);
            nyuinyui.reset();
        }
    }

    //create group
    group_window_upgrade = scene.add.group();
    
    //create window
    let window_upgrade = scene.add.sprite(640, 480, "window3").setInteractive();
    //let window_upgrade = scene.add.sprite(640, 480, "window2").setInteractive();

    let _text = "";
    _text += "[ Upgrade item ]\n";
    _text += "  Craft Item: Mint an item of one higher rarity by burning three items of the same rarity.\n";
    _text += "  Fluffy: Mint a fluffy of one higher grade by burning 3-5 fluffies (Fluffy:5, Fluffier:4, Fluffiest:3).\n";
    _text += "\n";
    let msg_upgrade = scene.add.text(140, 110, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#333333")

    group_window_upgrade.add(window_upgrade);
    group_window_upgrade.add(msg_upgrade);
    
    //get upgradable items
    let upgradable_itemIds = get_upgradable_itemIds2(local_myListsAt_withItemType);
    
    //showing upgradable items
    let _num = 0;
    Object.keys(upgradable_itemIds).forEach(_itemId => {
        // mint uncommon Violin (burn 3 common items, ID: 1, 4, 5)
        let _item_name = dic_items_reverse[_itemId];
        let _item_name_to;
        if (_itemId <= 128) {
            //_item_name_to = array_item_name[Number(_itemId)+64];
            _item_name_to = dic_items_reverse[Number(_itemId)+64];
        //} else if (_itemId <= 224) {
        } else if (_itemId <= 236) {
            _item_name_to = dic_items_reverse[Number(_itemId)+12];
            //_item_name_to = array_item_name[Number(_itemId)+12];
        //} else if (_itemId <= 236) {
        //    _item_name_to = dic_items_reverse[197];
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
        //let _txt = "■ ";
        let _txt = "";
        _txt += _rarity_to + _item_name_to;
        _txt += " (burn itemId: ";
        for (i=0; i<upgradable_itemIds[_itemId].length; i++) {
            _txt += upgradable_itemIds[_itemId][i] + ", ";
        }
        _txt = _txt.slice(0,-2);
        _txt += ")";
        _txt += "\n";
        let _msg = scene.add.text(200 +20, 220 + 70*_num +20, _txt)
            .setFontSize(30)
            .setFontFamily("Arial")
            .setFill(_fontColor)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                if (_itemId <= 128){
                    upgrade_item(
                        summoner, 
                        upgradable_itemIds[_itemId][0], 
                        upgradable_itemIds[_itemId][1], 
                        upgradable_itemIds[_itemId][2]
                    );
                } else if (_itemId <= 212) {
                    upgrade_fluffy2fluffier(
                        summoner, 
                        upgradable_itemIds[_itemId][0], 
                        upgradable_itemIds[_itemId][1], 
                        upgradable_itemIds[_itemId][2],
                        upgradable_itemIds[_itemId][3],
                        upgradable_itemIds[_itemId][4]
                    );
                } else if (_itemId <= 224) {
                    upgrade_fluffier2fluffiest(
                        summoner, 
                        upgradable_itemIds[_itemId][0], 
                        upgradable_itemIds[_itemId][1], 
                        upgradable_itemIds[_itemId][2],
                        upgradable_itemIds[_itemId][3],
                        //upgradable_itemIds[_itemId][4]
                    );
                } else if (_itemId <= 236) {
                    upgrade_fluffiest2doll(
                        summoner, 
                        upgradable_itemIds[_itemId][0], 
                        upgradable_itemIds[_itemId][1], 
                        upgradable_itemIds[_itemId][2],
                        //upgradable_itemIds[_itemId][3],
                        //upgradable_itemIds[_itemId][4]
                    );
                }
                close_window_upgrade(); 
            })
            .on("pointerdown", () => sound_window_select.play() )
            .on("pointerover", () => _msg.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerover", () => sound_window_pointerover.play())
            .on("pointerout", () => _msg.setStyle({ fontSize: 30, fontFamily: "Arial", fill: _fontColor }));
        //prepare cost text
        let _cost_coin_text = scene.add.text(250 +20, 223 + 70*_num + 30 +20, _cost_coin)
            .setFontSize(24).setFontFamily("Arial").setFill("#000000");
        let _cost_leaf_text = scene.add.text(340 +20, 223 + 70*_num + 30 +20, _cost_leaf)
            .setFontSize(24).setFontFamily("Arial").setFill("#000000");
        let icon_upgrading_coin = scene.add.sprite(230 +20, 235 + 70*_num + 30 +20, "icon_ohana")
            .setScale(0.07);
        let icon_upgrading_leaf = scene.add.sprite(330 +20, 235 + 70*_num + 30 +20, "icon_kusa")
            .setScale(0.07);
        group_window_upgrade.add(_msg);
        group_window_upgrade.add(_cost_coin_text);
        group_window_upgrade.add(_cost_leaf_text);
        group_window_upgrade.add(icon_upgrading_coin);
        group_window_upgrade.add(icon_upgrading_leaf);
        //prepare icon
        if (_itemId <= 200) {
            let _item_img = dic_items[_item_name_to]["img_name"];
            let _height = game.textures.get(_item_img).source[0].height;
            let _scale = 44 / _height;
            let _icon = scene.add.image(170 +20, 220+15 + 70*_num +20, _item_img)
                .setOrigin(0.5)
                .setScale(_scale);
            group_window_upgrade.add(_icon);
        //fluffy
        } else if (_itemId >= 201) {
            let _item_img = dic_items[_item_name_to]["img_name"];
            let _frame = dic_items[_item_name_to]["frame_no"];
            let _icon = scene.add.image(170 +20, 220+15 + 70*_num +20, _item_img)
                .setOrigin(0.5)
                .setScale(0.15)
                .setFrame(_frame);
            group_window_upgrade.add(_icon);
        }
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
    group_window_upgrade.setDepth(5000);
}


//### practice
function open_window_practice(scene) {

    sound_window_open.play();
    if (local_owner != local_wallet) {
        return 0;
    }

    //create group
    group_window_practice = scene.add.group();

    //close window and summon
    function close_window(_summoner, _item_id) {
        group_window_practice.destroy(true);
        if (_item_id > 0) {
            sound_button_on.play();
            //console.log(_item_id);
            contract_start_practice(_summoner, _item_id);
        } else {
            sound_window_select.play();
        }
    }

    //create button with color and class
    function create_button(_x, _y, _text, _color, _colorb, _item_id, scene, _size) {
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(_size)
            .setFontFamily("Arial")
            .setFill(_color)
            //.setStyle({backgroundColor: _colorb})
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => close_window(summoner, _item_id) )
            .on("pointerover", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerout", () => obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: _color }))
            //.on("pointerdown", () => sound_window_select.play() )
            .on("pointerover", () => sound_window_pointerover.play());
        return obj;
    }
    
    //convert level to expertise
    function level2expertise (_level) {
        // green -> blue -> orange -> red -> violet
        if (_level == 0) {
            return "«Inexperienced»";
        } else if (_level <= 2) {
            return "✿ Beginner ✿";
        } else if (_level <= 4) {
            return "★ Talented ★";
        } else if (_level <= 6) {
            return "♩ Skilled ♩";
        } else if (_level <= 8) {
            return "♪ Intermediate ♪";
        } else if (_level <= 10) {
            return "♫ Skillful ♫";
        } else if (_level <= 12) {
            return "♦ Seasoned ♦";
        } else if (_level <= 14) {
            return "♣ Proficient ♣";
        } else if (_level <= 16) {
            return "♠ Advanced ♠";
        } else if (_level <= 18) {
            return "♥ Expert ♥";
        } else if (_level <= 20) {
            return "＊Master＊";
        }
    }
    
    //convert level to color
    function level2color (_level) {
        // green -> blue -> orange -> red -> violet
        if (_level == 0) {
            return "#999999";
        } else if (_level <= 2) {
            return "#228b22";
        } else if (_level <= 4) {
            return "#006400";
        } else if (_level <= 6) {
            return "#0000ff";
        } else if (_level <= 8) {
            return "#000080";
        } else if (_level <= 10) {
            return "#ff8c00";
        } else if (_level <= 12) {
            return "#d2691e";
        } else if (_level <= 14) {
            return "#ff0000";
        } else if (_level <= 16) {
            return "#ff00ff";
        } else if (_level <= 18) {
            return "#8a2be2";
        } else if (_level <= 20) {
            return "#800080";
        }
    }
    
    //get quote word randomly
    function get_quote() {
        let _text = "";
        let _texts = [
            "Harmony is next to Godliness. - Johann Sebastian Bach -",
            "It is the special province of music to move the heart. - Johann Sebastian Bach -",
            "One does not play the piano with one's fingers, one plays the piano with one's mind.\n- Glenn Gould -",
            "Art is the most beautiful of all lies. - Claude Debussy -",
            "The shorter way to do many things is to do only one thing at a time.\n- Wolfgang Amadeus Mozart -",
            "When words can no longer be expressed, music begins.\n- Claude Debussy -",
            "To Regret the Past, To Hope in the Future, And never to be satisfied with the Present.\n- Peter Ilyich Tchaikovsky -",
            "There is no top. There are always further heights to reach.\n- Jascha Heifetz -",
            "Only the sound the ear permits is music.\n- Fryderyk Franciszek Chopin -",
            "Because I have a dream, a life is brilliant.\n- Wolfgang Amadeus Mozart -",
            "The music is not in the notes, but in the silence between.\n- Wolfgang Amadeus Mozart -",
            "The violin sings, but the fiddle dances. - Unknown -",
            "Music is enough for a lifetime, but a lifetime is not enough for music.\n- Sergei Vasil'evich Rachmaninov -",
            "Ars longa, vita brevis.\n- Hippocrates -",
        ];
        return _texts[Math.floor(Math.random() * _texts.length)];
    }
    
    //get best instrument
    function get_best_instrument(_item_name) {
        let _item_type = dic_items[_item_name]["item_id"];
        let _items_common = get_userItems(_item_type);
        let _items_uncommon = get_userItems(_item_type+64);
        let _items_rare = get_userItems(_item_type+127);
        if (_items_rare.length > 0) {
            return _items_rare[0];
        } else if (_items_uncommon.length > 0) {
            return _items_uncommon[0];
        } else if (_items_common.length > 0) {
            return _items_common[0];
        } else {
            return 0;
        }
    }

    //create window
    let _window = scene.add.sprite(640, 480, "window").setInteractive();

    //create message
    let _text = "";
    _text += "Choose an instrument to start practice.\n";
    _text += "Mastery speed is slightly increased by the corresponding status value.\n";
    _text += "(Clarinet & Horn: STR, Piano &Timpani: DEX, Violin & Harp: INT)";
    let msg1 = scene.add.text(140, 110, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#333333");
    _text = get_quote();
    let msg2 = scene.add.text(250, 750, _text)
            .setFontSize(18).setFontFamily("Arial").setFill("#666666");

    //create button, text, icon
    function create_instrument (_x, _y, _item_name, _level, _exp, _group, _scale) {
        let _item_type = dic_items[_item_name]["item_id"];
        let _item_id = get_best_instrument(_item_name);
        //when possess item_type
        if (
            local_items[_item_type] > 0
            || local_items[_item_type+64] > 0
            || local_items[_item_type+128] > 0
        ) {
            let _color = level2color(_level);
            let _button = create_button(
                _x, _y, _item_name, _color, "#000000", _item_id, scene, 36
                ).setOrigin(0, 0.5);
            let _text = "expertise: " + level2expertise(_level) + "\n";
            _text += "(Lv: " + _level + ", exp: " + _exp + ")";
            let _msg = scene.add.text(_x+0, _y+20, _text)
                .setFontSize(24)
                .setFontFamily("Arial")
                .setFill(_color);
            let _icon = scene.add.image(_x-45, _y+10, dic_items[_item_name]["img_name"])
                .setOrigin(0.5).setScale(_scale);
            _group.add(_button);
            _group.add(_msg);
            _group.add(_icon);
        } else {
            let _color = level2color(0);
            let _button = create_button(
                _x, _y, _item_name, _color, "#000000", _item_type, scene, 36
                ).setOrigin(0, 0.5).disableInteractive();
            let _text = "[not possessed]";
            let _msg = scene.add.text(_x+0, _y+20, _text)
                .setFontSize(24)
                .setFontFamily("Arial")
                .setFill(_color);
            let _icon = scene.add.image(_x-45, _y+10, dic_items[_item_name]["img_name_inactive"])
                .setOrigin(0.5).setScale(_scale);
            _group.add(_button);
            _group.add(_msg);
            _group.add(_icon);
        }
    }
    
    let _x = 280;
    let _y = 300;
    let _y_add = 150;
    let _x_raw_add = 475;
    
    //clarinet
    create_instrument(
        _x, 
        _y+_y_add*0, 
        "Clarinet", 
        local_practice_level_clarinet,
        local_practice_exp_clarinet,
        group_window_practice,
        0.25
    );

    //piano
    create_instrument(
        _x, 
        _y+_y_add*1, 
        "Piano", 
        local_practice_level_piano,
        local_practice_exp_piano,
        group_window_practice,
        0.25
    );

    //violin
    create_instrument(
        _x, 
        _y+_y_add*2, 
        "Violin", 
        local_practice_level_violin,
        local_practice_exp_violin,
        group_window_practice,
        0.125
    );

    //Hornm
    create_instrument(
        _x+_x_raw_add, 
        _y+_y_add*0, 
        "Horn", 
        local_practice_level_horn,
        local_practice_exp_horn,
        group_window_practice,
        0.25
    );

    //Timpani
    create_instrument(
        _x+_x_raw_add, 
        _y+_y_add*1, 
        "Timpani", 
        local_practice_level_timpani,
        local_practice_exp_timpani,
        group_window_practice,
        0.25
    );

    //Harp
    create_instrument(
        _x+_x_raw_add, 
        _y+_y_add*2, 
        "Harp", 
        local_practice_level_cello,
        local_practice_exp_cello,
        group_window_practice,
        0.25
    );

    //cancel
    let _button_cancel = create_button(1070, 840, "Cancel", "#000000", "", -1, scene, 30);
    
    group_window_practice.add(_window);
    group_window_practice.add(msg1);
    group_window_practice.add(msg2);
    group_window_practice.add(_button_cancel);

    //depth
    group_window_practice.setDepth(5000);
}


//### voting
function open_window_voting(scene) {

    sound_window_open.play();
    if (local_owner != local_wallet) {
        return 0;
    }

    //create group
    group_window_voting = scene.add.group();

    //close window and summon
    function close_window(_summoner, _type) {
        group_window_voting.destroy(true);
        if (_type >= 0) {
            contract_voting(_summoner, _type);
            sound_button_on.play();
        } else {
            sound_window_select.play();
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
            .on("pointerover", () => sound_window_pointerover.play());
        return obj;
    }
    //create window
    let window_voting = scene.add.sprite(640, 480, "window2").setInteractive();
    //let window_voting = scene.add.sprite(640, 480, "window3").setInteractive();
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
        _x, _y+_y_add*0, " "+dic_items_reverse[201]+" ", "#b3bfc7", "#e7f3fb", 201, scene, 36).setOrigin(0, 0.5);
    let _button202 = create_button(
        _x, _y+_y_add*1, " "+dic_items_reverse[202]+" ", "#d8bfac", "#fff3e0", 202, scene, 36).setOrigin(0, 0.5);
    let _button203 = create_button(
        _x, _y+_y_add*2, " "+dic_items_reverse[203]+" ", "#b7ffd0", "#9de5b6", 203, scene, 36).setOrigin(0, 0.5);
    let _button204 = create_button(
        _x, _y+_y_add*3, " "+dic_items_reverse[204]+" ", "#a9e8ff", "#8fcee5", 204, scene, 36).setOrigin(0, 0.5);
    let _button205 = create_button(
        _x, _y+_y_add*4, " "+dic_items_reverse[205]+" ", "#8dabff", "#c1dfff", 205, scene, 36).setOrigin(0, 0.5);
    let _button206 = create_button(
        _x, _y+_y_add*5, " "+dic_items_reverse[206]+" ", "#dab3ff", "#ffe7ff", 206, scene, 36).setOrigin(0, 0.5);
    let _button207 = create_button(
        _x+500, _y+_y_add*0, " "+dic_items_reverse[207]+" ", "#fdbeff", "#fff2ff", 207, scene, 36).setOrigin(0, 0.5);
    let _button208 = create_button(
        _x+500, _y+_y_add*1, " "+dic_items_reverse[208]+" ", "#ff686b", "#ffb6b9", 208, scene, 36).setOrigin(0, 0.5);
    let _button209 = create_button(
        _x+500, _y+_y_add*2, " "+dic_items_reverse[209]+" ", "#ffbda8", "#fff1dc", 209, scene, 36).setOrigin(0, 0.5);
    let _button210 = create_button(
        _x+500, _y+_y_add*3, " "+dic_items_reverse[210]+" ", "#ffd5d5", "#ffffff", 210, scene, 36).setOrigin(0, 0.5);
    let _button211 = create_button(
        _x+500, _y+_y_add*4, " "+dic_items_reverse[211]+" ", "#ffe381", "#e5c967", 211, scene, 36).setOrigin(0, 0.5);
    let _button212 = create_button(
        _x+500, _y+_y_add*5, " "+dic_items_reverse[212]+" ", "#fbfff0", "#c7cbbc", 212, scene, 36).setOrigin(0, 0.5);
    let _button_cancel = create_button(1070, 840, "Cancel", "#000000", "", -1, scene, 30);
    //create icon
    let _icon201 = scene.add.image(_x-35, _y + _y_add*0, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*0);
    let _icon202 = scene.add.image(_x-35, _y + _y_add*1, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*1);
    let _icon203 = scene.add.image(_x-35, _y + _y_add*2, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*2);
    let _icon204 = scene.add.image(_x-35, _y + _y_add*3, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*3);
    let _icon205 = scene.add.image(_x-35, _y + _y_add*4, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*4);
    let _icon206 = scene.add.image(_x-35, _y + _y_add*5, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*5);
    let _icon207 = scene.add.image(_x+500-35, _y + _y_add*0, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*6);
    let _icon208 = scene.add.image(_x+500-35, _y + _y_add*1, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*7);
    let _icon209 = scene.add.image(_x+500-35, _y + _y_add*2, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*8);
    let _icon210 = scene.add.image(_x+500-35, _y + _y_add*3, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*9);
    let _icon211 = scene.add.image(_x+500-35, _y + _y_add*4, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*10);
    let _icon212 = scene.add.image(_x+500-35, _y + _y_add*5, "fluffy_fluffys").setOrigin(0.5).setScale(0.16).setFrame(3+10*11);
    //destroy, present and last winner
    /*
    eval("_button" + local_ff_previous_elected_type).setVisible(false);
    eval("_button" + local_ff_elected_type).setVisible(false);
    eval("_icon" + local_ff_previous_elected_type).setVisible(false);
    eval("_icon" + local_ff_elected_type).setVisible(false);
    */
    if (local_ff_previous_elected_type > 0) {
        eval("_button" + local_ff_previous_elected_type)
            .setText(" (" + eval("_button" + local_ff_previous_elected_type).text + ") ")
            .disableInteractive();
        _text = "--- 👑 Previous Winner ---";
        _x = eval("_button" + local_ff_previous_elected_type).x;
        _y = eval("_button" + local_ff_previous_elected_type).y;    
        let msg3 = scene.add.text(_x, _y+22, _text)
            .setFontSize(20).setFontFamily("Arial").setFill("#0000ff")
        group_window_voting.add(msg3);
    }
    if (local_ff_elected_type > 0) {
        eval("_button" + local_ff_elected_type)
            .setText(" (" + eval("_button" + local_ff_elected_type).text + ") ")
            .disableInteractive();
        _text = "--- 👑 Present Winner ---";
        _x = eval("_button" + local_ff_elected_type).x;
        _y = eval("_button" + local_ff_elected_type).y;    
        let msg4 = scene.add.text(_x, _y+22, _text)
            .setFontSize(20).setFontFamily("Arial").setFill("#ff0000")
        group_window_voting.add(msg4);
    }
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
    //present info
    let _text_msg3;
    if (local_ff_next_festival_block - local_blockNumber < 0) {
        _text_msg3 = "The festival is about to start.\nYou can get the First Voting Bonus now!";
    } else if (local_ff_isEndable) {
        _text_msg3 = "The festival is almost over.\nYou can get the Final Voting Bonus now!";
    } else {
        let _counter = local_ff_subject_end_block - local_blockNumber;
        _text_msg3 = "The festival is underway!\n" + _counter + " blocks remaining.";
    }
    let msg3 = scene.add.text(750, 730, _text_msg3)
            .setFontSize(24).setFontFamily("Arial").setFill("blue");
    group_window_voting.add(window_voting);
    group_window_voting.add(msg1);
    group_window_voting.add(msg2);
    group_window_voting.add(msg3);
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
    //depth
    group_window_voting.setDepth(5000);
}


//### strolling
async function open_window_strolling(scene) {

    //functions
    
    //create selection
    function create_selection(
        scene, 
        _x, _y, 
        _img, _scale, _anim,
        _text, _fontSize, _fontColor,
        _type, _select,
        _summonerCount=0
     ) {
        
        //create icon
        let _icon = scene.add.sprite(_x, _y, _img,)
            .setOrigin(0.5)
            .setScale(_scale)
            .setInteractive({useHandCursor: true});
        if (_anim != 0) {
            _icon.anims.play(_anim);
        }
        group_window_strolling.add(_icon);

        //create text
        if (_summonerCount != 0) {
            _text = _text + " (" + _summonerCount + ")";
        }
        let _title = scene.add.text(_x, _y+50, _text)
            .setFontSize(_fontSize)
            .setOrigin(0.5)
            .setFontFamily("Arial")
            .setFill(_fontColor);
        group_window_strolling.add(_title);
        
        //define clicking
        _icon.on("pointerover", () => {
            sound_window_pointerover.play();
            _title.setFill("#ffff00");
        });
        _icon.on("pointerout", () => {
            _title.setFill(_fontColor);
        });
        _icon.on("pointerdown", () => {
            sound_window_select.play();
            if (_type == 1) {
                _selected_direction.x = _x-90;
                _selected_direction.y = _y-70;
                _selected_direction.visible = true;
                group_window_strolling.selected_direction = _select;
            } else if (_type == 2) {
                _selected_companion.x = _x-90;
                _selected_companion.y = _y-70;
                _selected_companion.visible = true;
                group_window_strolling.selected_companion = _select;
            } else if (_type == 3) {
                _selected_drink.x = _x-90;
                _selected_drink.y = _y-70;
                _selected_drink.visible = true;
                group_window_strolling.selected_drink = _select;
            }
        });
    }
    

    //create button
    function create_button(_x, _y, _text, _color, _colorb, _type, _select, scene, _size, _isActive=true) {
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(_size)
            .setFontFamily("Arial")
            .setFill(_color);
        if (_isActive) {
            obj.setInteractive({useHandCursor: true});
            obj.on("pointerover", () => {
                    obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: '#ffff00' });
                    sound_window_pointerover.play();
            });
            obj.on("pointerout", () => {
                    obj.setStyle({ fontSize: _size, fontFamily: "Arial", fill: _color });
            });
            obj.on("pointerdown", () => {
                //cancel button
                if (_type == -1) {
                    group_window_strolling.destroy(true);
                    sound_window_select.play();
                //start button
                } else if (_type == 0) {
                    sound_button_on.play();
                    if (
                        group_window_strolling.selected_direction > 0
                        && group_window_strolling.selected_companion > 0
                        && group_window_strolling.selected_drink > 0
                    ) {
                        contract_start_stroll(
                            summoner,
                            group_window_strolling.selected_direction,
                            group_window_strolling.selected_companion,
                            group_window_strolling.selected_drink
                        )
                        group_window_strolling.destroy(true);
                    }
                }
            });
        }
        group_window_strolling.add(obj);
    }


    //begin

    sound_window_open.play();
    if (local_owner != local_wallet) {
        return 0;
    }

    //create group
    group_window_strolling = scene.add.group();
    group_window_strolling.selected_direction = 0;
    group_window_strolling.selected_companion = 0;
    group_window_strolling.selected_drink = 0;

    //create window
    let _window = scene.add.sprite(640, 480, "window2").setInteractive();
    group_window_strolling.add(_window).setDepth(5000);

    //create message

    let _text = "";
    _text += "Loading...";
    let msg1 = scene.add.text(140, 110, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("#333333").setDepth(5001);
    group_window_strolling.add(msg1);

    //get strollInfo
    contract_update_stroll_info(summoner);
    let _strollInfo = await get_strollInfo(summoner);
    let _isStrolling = Number(_strollInfo[0]);
    let _total_strolledDistance = Number(_strollInfo[1]);
    let _total_strolledDistance_ofCompanion_01 = Number(_strollInfo[2]);
    let _total_strolledDistance_ofCompanion_02 = Number(_strollInfo[3]);
    let _total_strolledDistance_ofCompanion_03 = Number(_strollInfo[4]);
    let _total_metSummoners = Number(_strollInfo[5]);
    let _metSummoners_01 = Number(_strollInfo[6]);
    let _metSummoners_02 = Number(_strollInfo[7]);
    let _metSummoners_03 = Number(_strollInfo[8]);
    let _metSummoners_04 = Number(_strollInfo[9]);
    let _metSummoners_05 = Number(_strollInfo[10]);
    let _total_strolling_direction_01 = Number(_strollInfo[11]);
    let _total_strolling_direction_02 = Number(_strollInfo[12]);
    let _total_strolling_direction_03 = Number(_strollInfo[13]);
    let _total_strolling_direction_04 = Number(_strollInfo[14]);
    let _total_strolling_companion_01 = Number(_strollInfo[15]);
    let _total_strolling_companion_02 = Number(_strollInfo[16]);
    let _total_strolling_companion_03 = Number(_strollInfo[17]);
    let _stroll_level = Number(_strollInfo[18]);
    let _met_level = Number(_strollInfo[19]);
    let _coolingSec = Number(_strollInfo[25]);

    //create selected square
    let _selected_direction = scene.add.graphics()
        .fillStyle(0x4169e1, 0.4)
        .fillRoundedRect(0, 0, 180, 150, 32/2)
        .setVisible(false);
    let _selected_companion = scene.add.graphics()
        .fillStyle(0xffff00, 0.5)
        .fillRoundedRect(0, 0, 180, 150, 32/2)
        .setVisible(false);
    let _selected_drink = scene.add.graphics()
        .fillStyle(0xff1493, 0.3)
        .fillRoundedRect(0, 0, 180, 150, 32/2)
        .setVisible(false);
    group_window_strolling.add(_selected_direction);
    group_window_strolling.add(_selected_companion);
    group_window_strolling.add(_selected_drink);

    //close window and summon
    function close_window(_summoner, _type) {
        group_window_strolling.destroy(true);
        if (_type >= 0) {
            //contract_voting(_summoner, _type);
            sound_button_on.play();
        } else {
            sound_window_select.play();
        }
    }
    
    //create message

    //update msg1
    _text = "";
    _text += "Choose the direction, companion, and drink to begin the stroll!\n";
    _text += "Your Murasaki-san has strolled a total of ";
    _text +=_total_strolledDistance;
    _text += "m and met ";
    _text += _total_metSummoners;
    _text += " friends to date.\n";
    msg1.setText(_text);

    //msg2
    _text = "";
    _text += "・Strolling takes 4 hours with a 16 hour cooll time. Murasaki-san walks 500m per hour.\n";
    _text += "・During the stroll, Murasaki-san has a chance to meet friends who have chosen the same direction and companion.\n";
    _text += "・Meeting friends makes Murasaki-san happy and slightly increases the distance of the stroll.\n";
    _text += "・Matching drinks with the friends met also makes Murasaki-san even happier.\n";
    _text += "・Murasaki-san will discover twinkling NFTs depending on the total distance strolled or the number of friends met.\n";
    let msg2 = scene.add.text(200, 670, _text)
            .setFontSize(18).setFontFamily("Arial").setFill("blue");
    group_window_strolling.add(msg2);

    /*
    _text = "";
    _text += "・Test3.\n";
    let msg3 = scene.add.text(750, 730, _text)
            .setFontSize(24).setFontFamily("Arial").setFill("blue");
    group_window_strolling.add(msg3);
    */


    //create selection

    let _x = 350;
    let _y = 260;
    let _x_add = 250;
    let _y_add = 150;
    
    //direction
    create_selection(
        scene, 
        _x+_x_add*0, _y+_y_add*0, 
        "stroll_direction_01", 0.3, 0,
        "Mountain", 36, "#000000",
        1, 1,
        _total_strolling_direction_01
    );
    /*
    create_selection(
        scene, 
        _x+_x_add*1, _y+_y_add*0, 
        "stroll_direction_02", 0.3, 0,
        "Riverside", 36, "#000000",
        1, 2,
        _total_strolling_direction_02
    );
    */
    create_selection(
        scene, 
        _x+_x_add*1, _y+_y_add*0, 
        "stroll_direction_03", 0.3, 0,
        "Seaside", 36, "#000000",
        1, 2,
        _total_strolling_direction_02
    );
    create_selection(
        scene, 
        _x+_x_add*2, _y+_y_add*0, 
        "stroll_direction_04", 0.3, 0,
        "Grassland", 36, "#000000",
        1, 3,
        _total_strolling_direction_03
    );

    //companion
    
    let _item_name;
    let _item_id;

    //Mr. Astar
    _item_name = "Mr. Astar";
    _item_id = dic_items[_item_name]["item_id"];
    if (local_items_flag[_item_id] == true) {
        create_selection(
            scene, 
            _x+_x_add*0, _y+_y_add*1, 
            "mr_astar_left", 0.12, "mr_astar_left",
            "Mr. Astar", 36, "#000000",
            2, 1,
            _total_strolling_companion_01
        );
    }

    //Ms. Ether    
    _item_name = "Ms. Ether";
    _item_id = dic_items[_item_name]["item_id"];
    if (local_items_flag[_item_id] == true) {
        create_selection(
            scene, 
            _x+_x_add*1, _y+_y_add*1, 
            "ms_ether_left", 0.12, "ms_ether_left",
            "Ms. Ether", 36, "#000000",
            2, 2,
            _total_strolling_companion_02
        );
    }

    //Ms. Ether    
    _item_name = "Dr. Bitco";
    _item_id = dic_items[_item_name]["item_id"];
    if (local_items_flag[_item_id] == true) {
        create_selection(
            scene, 
            _x+_x_add*2, _y+_y_add*1, 
            "dr_bitco_left", 0.12, "dr_bitco_left",
            "Dr. Bitco", 36, "#000000",
            2, 3,
            _total_strolling_companion_03
        );
    }

    //drink
    create_selection(
        scene, 
        _x+_x_add*0, _y+_y_add*2, 
        "stroll_drink_01", 0.2, 0,
        "Water", 36, "#000000",
        3, 1
    );
    /*
    create_selection(
        scene, 
        _x+_x_add*1, _y+_y_add*2, 
        "stroll_drink_02", 0.2, 0,
        "Coffee", 36, "#000000",
        3, 2
    );
    */
    create_selection(
        scene, 
        _x+_x_add*1, _y+_y_add*2, 
        "stroll_drink_03", 0.2, 0,
        "Tea", 36, "#000000",
        3, 2
    );
    create_selection(
        scene, 
        _x+_x_add*2, _y+_y_add*2, 
        "stroll_drink_04", 0.2, 0,
        "Juice", 36, "#000000",
        3, 3
    );
    
    //create button
    create_button(1030, 820, "Cancel", "#000000", "", -1, 0, scene, 36);
    if (
        local_mining_status == 1
        || local_farming_status == 1
        || local_crafting_status == 1
        || local_practice_status == 1
    ){
        let msg3 = scene.add.text(830, 812, "- Murasaki-san is working now -")
                .setFontSize(18).setFontFamily("Arial").setFill("red").setOrigin(0.5);
        group_window_strolling.add(msg3);
        create_button(650, 820, ">> Go for a Stroll <<", "#888888", "", 0, 0, scene, 36, false);
    } else if (_coolingSec > 0 ) {
        let msg3 = scene.add.text(830, 812, "- Cooling Time: " + local_coolingSec + " sec -")
                .setFontSize(18).setFontFamily("Arial").setFill("red").setOrigin(0.5);
        group_window_strolling.add(msg3);
        create_button(650, 820, ">> Go for a Stroll <<", "#888888", "", 0, 0, scene, 36, false);
    } else {
        create_button(650, 820, ">> Go for a Stroll <<", "#000000", "", 0, 0, scene, 36);
    }

    //set depth
    group_window_strolling.setDepth(5000);
}


//### strolling_during
function open_window_strollingDuring(scene, mode) {

    //create object
    function _create_obj(
        scene, _x, _y, _img, _scale, _speed, _depth, 
        flag_backgroundMoving=0, frame=0, flag_spin=0
    ) {
        let _obj = scene.add.sprite(_x, _y, _img)
            .setScale(_scale)
            .setDepth(_depth)
            .setOrigin(0.5);
        _obj.flag_backgroundMoving = flag_backgroundMoving;
        _obj.update = function() {
            if (
                group_window_strollingDuring.flag_walk == 1 ||
                this.flag_backgroundMoving == 1
            ) {
                this.x += _speed;
            }
            if (this.x >= 1600) {
                this.x = -200;
            }
            //if (flag_spin == 1 && turn % 120 == this.spinSalt){
            if (flag_spin == 1 && turn % 120 == 0){
                this.angle += 30;
            }
        }
        if (frame > 0) {
            _obj.setFrame(frame);
        }
        if (flag_spin == 1) {
            _obj.angle = Math.random()*360;
            _obj.spinSalt = Math.round(Math.random()*120);
        }
        group_update.add(_obj);
        group_window_strollingDuring.add(_obj);
    }

    //start
    sound_nyui.play();
    /*
    if (local_owner != local_wallet) {
        return 0;
    }
    */
    let _text = "";

    //create group
    group_window_strollingDuring = scene.add.group();
    group_window_strollingDuring.flag_walk = 1;

    //define mode
    if (mode == 1) {    //mountain
        //create background
        let _img_back = scene.add.sprite(640, 480, "stroll_during_01_back")
            .setDepth(4001)
            .setScale(1.0)
            .setInteractive();
        group_window_strollingDuring.add(_img_back);
        
        //create cloud
        _create_obj(scene, -300, 360, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 200, 360, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 400, 320, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 600, 300, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 1000, 350, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);

        //create mountain
        _create_obj(scene, -300, 570, "stroll_during_01_mountain", 1.2, 0.1, 4001);
        _create_obj(scene, 100, 570, "stroll_during_01_mountain", 1.2, 0.1, 4001);
        _create_obj(scene, 500, 570, "stroll_during_01_mountain", 1.2, 0.1, 4001);
        _create_obj(scene, 800, 570, "stroll_during_01_mountain", 1.2, 0.1, 4001);
        _create_obj(scene, 1200, 570, "stroll_during_01_mountain", 1.2, 0.1, 4001);

        //create grass
        _create_obj(scene, -500, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, -400, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, -300, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, -200, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, -100, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 100, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 200, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 300, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 400, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 500, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 600, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 800, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 900, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 1000, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);
        _create_obj(scene, 1100, 625, "stroll_during_01_grass", 0.4, 0.4, 4002);

    } else if (mode == 2) { //seaside

        //create background
        let _img_back = scene.add.sprite(640, 480, "stroll_during_02_back")
            .setDepth(4001)
            .setScale(1)
            .setInteractive();
        group_window_strollingDuring.add(_img_back);

        //wave
        let _img_wave1 = scene.add.sprite(320, 625, "stroll_during_02_wave")
            .setDepth(4002).setScale(0.8);
        _img_wave1.update = function() {
            if (
                group_window_strollingDuring.flag_walk == 1 ||
                this.flag_backgroundMoving == 1
            ) {
                this.x += 0.4;
            }
            if (this.x >= 690) {
                this.x = 320;
            }
        }
        group_update.add(_img_wave1);
        group_window_strollingDuring.add(_img_wave1);

        //create cloud
        _create_obj(scene, -300, 360, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 200, 360, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 400, 320, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 600, 300, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 1000, 350, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
                
        //starfish
        _create_obj(scene, -400, 675, "stroll_during_02_starfish", 0.08, 0.4, 4002);
        _create_obj(scene, -200, 660, "stroll_during_02_shell", 0.08, 0.4, 4002);
        _create_obj(scene, 200, 696, "stroll_during_02_starfish", 0.08, 0.4, 4002);
        _create_obj(scene, 510, 661, "stroll_during_02_shell", 0.08, 0.4, 4002);
        _create_obj(scene, 912, 691, "stroll_during_02_starfish", 0.08, 0.4, 4002);
        _create_obj(scene, 1110, 651, "stroll_during_02_shell", 0.08, 0.4, 4002);
        
        //yacht
        _create_obj(scene, 108, 550, "stroll_during_02_yacht", 0.15, 0.1, 4002, 1);
        _create_obj(scene, 982, 540, "stroll_during_02_fune", 0.15, 0.1, 4002, 1);

    } else if (mode == 3) { //grassland

        //create background
        let _img_back = scene.add.sprite(640, 480, "stroll_during_03_back")
            .setDepth(4001)
            .setScale(1)
            .setInteractive();
        group_window_strollingDuring.add(_img_back);

        //create cloud
        _create_obj(scene, -300, 360, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 200, 360, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 400, 320, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 600, 300, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);
        _create_obj(scene, 1000, 350, "stroll_during_01_cloud", 0.1+Math.random()*0.3, 0.1+Math.random()*0.3, 4001, 1);

        //create mountain
        _create_obj(scene, -200, 580, "stroll_during_03_mountain", 1.2, 0.025, 4001);
        _create_obj(scene, 300, 580, "stroll_during_03_mountain", 1.2, 0.025, 4001);
        _create_obj(scene, 600, 580, "stroll_during_03_mountain", 1.0, 0.025, 4001);
        _create_obj(scene, 1100, 575, "stroll_during_03_mountain", 1.5, 0.025, 4001);

        //create flower
        let _li_x = [-400, -200, 0, 200, 400, 600, 800, 1000, 1200];
        for (let i=0; i<_li_x.length; i++) {
            let _x = _li_x[i];
            let _y = 650 + Math.random()*40;
            let _frame = Math.round(Math.random()*6);
            _create_obj(scene, _x, _y+Math.random()*10, "par_flowers", 0.13, 0.4, 4002, 0, _frame, 1);
            _create_obj(scene, _x+20, _y+Math.random()*10, "par_flowers", 0.13, 0.4, 4002, 0, _frame, 1);
            _create_obj(scene, _x+40, _y+Math.random()*10, "par_flowers", 0.13, 0.4, 4002, 0, _frame, 1);
        }
        
        //tree
        _create_obj(scene, 50, 570, "stroll_during_03_tree1", 0.2, 0.1, 4002);
        _create_obj(scene, 982, 570, "stroll_during_03_tree2", 0.2, 0.1, 4002);
        
        //baloon
        _create_obj(scene, 200, 450, "stroll_during_03_baloon", 0.2, 0.2, 4002, 1);
        
    }
    
    //create summoner
    let _walking_summoner = scene.add.sprite(640, 640, "murasaki_left")
        .setDepth(4003)
        .setScale(0.4)
        .setOrigin(0.5)
        .anims.play("murasaki_left", true);
    _walking_summoner.count = 0;
    _walking_summoner.countBuffer = 0;
    _walking_summoner.flag_endable = 0;
    _walking_summoner.update = function() {
        if (local_strollEndable == 1) {
            if (this.flag_endable == 0) {
                group_window_strollingDuring.flag_walk = 0;
                this.anims.play("murasaki_sleeping", true);
                _bottle.setTexture("item_waterbottle");
                _bottle.x = 570;
                let _msg9 = scene.add.text(640, 600, ">> Click to End Stroll <<")
                    .setDepth(4004)
                    .setOrigin(0.5)
                    .setFontSize(24)
                    .setFontFamily("Arial")
                    .setFill("#ffff00");
                group_window_strollingDuring.add(_msg9);
                this.setInteractive({useHandCursor: true});
                this.on("pointerover", () => { sound_window_pointerover.play(); });
                this.on("pointerdown", () => { 
                    sound_window_select.play();
                    contract_end_stroll(summoner);
                });
                this.flag_endable = 1;
            }
        } else if (group_window_strollingDuring.flag_walk == 0 && this.countBuffer <= 0) {
            this.anims.play("murasaki_click", true);
            this.count += 1;
            if (this.count % 200 == 50) {
                sound_happy.play();
            }
            if (this.count >= 300) {
                group_window_strollingDuring.flag_walk = 1;
                this.anims.play("murasaki_left", true);
                this.count = 0;
                this.countBuffer = 100;
            }
        } else {
            group_window_strollingDuring.flag_walk = 1;
        }
        if (this.countBuffer > 0) {
            this.countBuffer -= 1;
        }
        //hat check for gamestart, after first item check
        if (turn == 60) {
            if (item_wearing_hat != 0) {
                let _hat = scene.add.sprite(640-3, 640-55, item_wearing_hat.texture)
                    .setDepth(4004)
                    .setOrigin(0.5)
                    .setScale(0.22);
                group_window_strollingDuring.add(_hat);
                group_update.add(_hat);
            }
        }
    }
    group_window_strollingDuring.add(_walking_summoner);
    group_update.add(_walking_summoner);
    
    //hat for  window creation
    if (item_wearing_hat != 0) {
        let _hat = scene.add.sprite(640-3, 640-55, item_wearing_hat.texture)
            .setDepth(4004)
            .setOrigin(0.5)
            .setScale(0.22);
        group_window_strollingDuring.add(_hat);
        group_update.add(_hat);
    }
    
    //waterbottle
    let _bottle = scene.add.sprite(640, 640, "stroll_waterbottle")
        .setScale(0.4)
        .setOrigin(0.5)
        .setDepth(4004);
    group_window_strollingDuring.add(_bottle);
    
    //create companion
    let _walking_companion = scene.add.sprite(670, 660, "mr_astar_left")
        .setDepth(4005)
        .setScale(0.1)
        .setOrigin(0.5)
        .anims.play("mr_astar_left", true);
    group_window_strollingDuring.add(_walking_companion);
    
    //create msg1
    _text = "";
    let _hr = Math.floor(local_reminingSec % 86400 / 3600);
    let _min = Math.floor(local_reminingSec % 3600 / 60);
    _text += "⌛ " + _hr + "h:" + _min + "m" + "\n";
    _text += "🥾 " + local_strollingDistance + "m\n";
    let _msg1 = scene.add.text(1150, 260, _text)
        .setDepth(4009)
        .setFontSize(24)
        .setFontFamily("Arial")
        .setFill("#1D2088");
    group_window_strollingDuring.add(_msg1);
    
    //keep updating msg1
    function _update_msg1(scene, _msg1) {
        let _text = "";
        let _hr = Math.floor(local_reminingSec % 86400 / 3600);
        let _min = Math.floor(local_reminingSec % 3600 / 60);
        _text += "⌛ " + _hr + "h:" + _min + "m" + "\n";
        _text += "🥾 " + local_strollingDistance + "m\n";
        _msg1.setText(_text);
        setTimeout(_update_msg1, 10000, scene, _msg1);
    }
    _update_msg1(scene, _msg1);

    //create msg2
    _text = "";
    _text = local_name_str + " is enjoying stroll.";
    let _msg2 = scene.add.text(10, 260, _text)
        .setDepth(4009)
        .setFontSize(24)
        .setFontFamily("Arial")
        .setFill("#1D2088");
    group_window_strollingDuring.add(_msg2);
    
    //keep updating msg2
    function _update_msg2(scene, _msg2) {
        let _metCount = 0;
        let _text = "";
        if (local_metSummoners_01 > 0){
            _metCount += 1;
        }
        if (local_metSummoners_02 > 0){
            _metCount += 1;
        }
        if (local_metSummoners_03 > 0){
            _metCount += 1;
        }
        if (local_metSummoners_04 > 0){
            _metCount += 1;
        }
        if (local_metSummoners_05 > 0){
            _metCount += 1;
        }
        if (_metCount == 0) {
            _text = local_name_str + " is enjoying stroll.";
        } else {
            _text = local_name_str + " already met " + _metCount + " friends!";
        }
        _msg2.setText(_text);
        setTimeout(_update_msg2, 10000, scene, _msg2);
    }
    _update_msg2(scene, _msg2);
    
    //create msg3
    _text = "";
    _text += local_name_str + " has met "; 
    _text += local_stroll_total_metSummoners + " friends and strolled a total of ";
    _text += local_stroll_total_strolledDistance + " meters.";
    let _msg3 = scene.add.text(950, 700, _text)
        .setDepth(4009)
        .setFontSize(12)
        .setFontFamily("Arial")
        .setFill("#FF4264");
    group_window_strollingDuring.add(_msg3);

    //mogumogu
    let _mogumogu = scene.add.sprite(-200, 680, "mogumogu")
        .setDepth(4005)
        .setScale(0.2)
        .setOrigin(0.5)
        .anims.play("mogumogu", true);
    _mogumogu.count = Math.round( Math.random() * 18000 );
    _mogumogu.update = function() {
        this.count -= 1;
        if (this.count < 0) {
            if (group_window_strollingDuring.flag_walk == 1) {
                this.x += 0.4;
            } else {
                this.x += 0;
            }
        }
        if (this.x >= 1600) {
            this.x = -200;
            this.count = Math.random() * 18000;
        }
        if (this.x >= 580 && this.x <= 581) {
            group_window_strollingDuring.flag_walk = 0;
        }
    }
    group_update.add(_mogumogu);
    group_window_strollingDuring.add(_mogumogu);

    //create cat
    let _cat = scene.add.sprite(-200, 660, "cat_walking_right_withMail_fast")
        .setDepth(4006)
        .setScale(0.3)
        .setOrigin(0.5)
        .anims.play("cat_walking_right_withMail_fast", true);
    _cat.count = Math.round( Math.random() * 18000 );
    _cat.update = function() {
        this.count -= 1;
        if (this.count < 0) {
            if (group_window_strollingDuring.flag_walk == 1) {
                this.x += 0.8;
            } else {
                this.x += 0.4;
            }
        }
        if (this.x >= 1600) {
            this.x = -200;
            this.count = Math.random() * 18000;
        }
        if (this.x >= 580 && this.x <= 581) {
            group_window_strollingDuring.flag_walk = 0;
        }
    }
    group_update.add(_cat);
    group_window_strollingDuring.add(_cat);

    //create nainai
    /*
    let _nainai = scene.add.sprite(-200, 640, "ff_duringFestival_right")
        .setDepth(5001)
        .setScale(0.12)
        .setOrigin(0.5)
        //.anims.play("cat_walking_right_withMail_fast", true);
    _nainai.count = Math.random() * 3600;
    _nainai.update = function() {
        this.count -= 1;
        if (this.count < 0) {
            this.x += 0.2;
        }
        if (this.x >= 1600) {
            this.x = -200;
            this.count = Math.random() * 3600;
        }
    }
    group_update.add(_nainai);
    group_window_strollingDuring.add(_nainai);
    */
}


//---draw


//### draw_firework
function draw_firework(scene) {
    sound_fireworks2.play();
    const emitterConfig = {
        alpha: { start: 1, end: 0, ease: 'Cubic.easeIn' },
        angle: { start: 0, end: 360, steps: 100 },
        blendMode: 'ADD',
        frame: { frames: ['red', 'yellow', 'green', 'blue'], cycle: true, quantity: 500 },
        //frequency: 500,
        gravityY: 300,
        lifespan: 1000,
        quantity: 500,
        stopAfter: 500,
        reserve: 500,
        scale: { min: 0.05, max: 0.15 },
        speed: { min: 300, max: 600 },
    };
    const { width, height } = scene.scale;
    const { FloatBetween } = Phaser.Math;
    for (let i=0; i<=2000; i+=500) {
        scene.time.addEvent({
            delay: i,
            callback: () => {
                let _x = width * FloatBetween(0.25, 0.75);
                let _y = height * FloatBetween(0, 0.5);
                const emitter = scene.add.particles(_x, _y, "par_flares", emitterConfig)
                    .onParticleEmit( () => {
                    sound_fireworks.play();
                });
            }
        });
    }
}


//### draw_flower
function draw_flower(scene, _x, _y) {
    let _lifespan = 900;
    const emitterConfig = {
        alpha: 0.8,
        angle: { min: 250, max: 290 },
        //blendMode: 'ADD',
        gravityY: 900,
        lifespan: { min:_lifespan*0.8, max:_lifespan},
        quantity: 20,
        stopAfter: 20,
        timeScale: 0.9,
        reserve: 20,
        rotate: { min:0, max:360 },
        scale: { min: 0.05, max: 0.15 },
        speed: { min: 300, max: 600 },
        frame: [0,1,2,3,4,5],
    };
    const emitter = scene.add.particles(_x, _y, "par_flowers", emitterConfig).setDepth(3100);
}


//### draw_flower2
function draw_flower2(scene, _x, _y) {
    let _lifespan = 400;
    const emitterConfig = {
        alpha: 0.5,
        angle: { min: 0, max: 360 },
        //blendMode: 'ADD',
        gravityY: 400,
        lifespan: { min:_lifespan*0.7, max:_lifespan},
        quantity: 15,
        stopAfter: 15,
        timeScale: 0.9,
        rotate: { min:0, max:360 },
        scale: { min: 0.05, max: 0.08 },
        speed: { min: 50, max: 300 },
        frame: [0,1,2,3,4,5],
    };
    const emitter = scene.add.particles(_x, _y, "par_flowers", emitterConfig).setDepth(1000);
}


//### draw_flower3
function draw_flower3(scene, _x, _y) {
    let _lifespan = 600;
    const emitterConfig = {
        alpha: 0.8,
        angle: { min: 0, max: 360 },
        //blendMode: 'ADD',
        gravityY: 400,
        lifespan: { min:_lifespan*0.7, max:_lifespan},
        quantity: 20,
        stopAfter: 20,
        timeScale: 0.9,
        rotate: { min:0, max:360 },
        scale: { min: 0.05, max: 0.15 },
        speed: { min: 100, max: 300 },
        frame: [0,1,2,3,4,5],
    };
    const emitter = scene.add.particles(_x, _y, "par_flowers", emitterConfig).setDepth(1000);
}


//### draw_miniAlphabet
function draw_miniAlphabet(scene, _x, _y, _img) {
    let _lifespan = 200;
    const emitterConfig = {
        alpha: 0.25,
        angle: { min: 0, max: 360 },
        gravityY: 400,
        lifespan: { min:_lifespan*0.7, max:_lifespan},
        quantity: 1,
        stopAfter: 50,
        timeScale: 0.9 * 0.5,
        rotate: { min:0, max:360 },
        scale: { min: 0.01, max: 0.03 },
        speed: { min: 50, max: 300 },
        x: { min: -10, max: 10 },
        y: { min: -10, max: 10 },
        frequency: 10,
    };
    const emitter = scene.add.particles(_x, _y, _img, emitterConfig).setDepth(1000);
}

//### draw_miniAlphabet2
function draw_miniAlphabet2(scene, _x, _y, _img) {
    let _lifespan = 300;
    const emitterConfig = {
        alpha: 0.5,
        angle: { min: 0, max: 360 },
        //blendMode: 'ADD',
        gravityY: 400,
        lifespan: { min:_lifespan*0.7, max:_lifespan},
        quantity: 10,
        stopAfter: 10,
        timeScale: 0.9,
        rotate: { min:0, max:360 },
        scale: { min: 0.01, max: 0.03 },
        speed: { min: 50, max: 200 },
    };
    const emitter = scene.add.particles(_x, _y, _img, emitterConfig).setDepth(1000);
}


//### draw_glitter
function draw_glitter(scene, _item) {
    let _geom = new Phaser.Geom.Rectangle(
        -_item.width * _item.scale/2, 
        -_item.height * _item.scale/2, 
        _item.width * _item.scale, 
        _item.height * _item.scale,
    );
    const emitterConfig = {
        alpha:      { start:1, end:0 },
        lifespan:   2000,
        frequency:  2000,
        quantity:   1,
        scale:      0.08,
        frame:      [0,1,2],
        emitZone:   { type: "random", source: _geom},
        follow:     _item,
        origin:     0.5,
    };
    //const emitter = scene.add.particles(_item.x, _item.y, "par_glitter", emitterConfig);
    const emitter = scene.add.particles(0, 0, "par_glitter", emitterConfig);
    emitter.depth = 3900;
}


//### draw_star
function draw_star(scene, _x, _y) {
    let _lifespan = 400;
    const emitterConfig = {
        alpha: 0.5,
        angle: { min: 0, max: 360 },
        //blendMode: 'ADD',
        gravityY: 400,
        lifespan: { min:_lifespan*0.7, max:_lifespan},
        quantity: 15,
        stopAfter: 15,
        timeScale: 0.9,
        rotate: { min:0, max:360 },
        scale: { min: 0.05, max: 0.08 },
        speed: { min: 50, max: 300 },
        frame: [0,1,2,3,4,5,6,7],
    };
    const emitter = scene.add.particles(_x, _y, "par_stars", emitterConfig);
    emitter.setDepth(9000);
}


//### draw_fluffyBit
function draw_fluffyBit(scene, _x, _y) {
    let _lifespan = 900;
    const emitterConfig = {
        alpha: 0.5,
        angle: { min: 250, max: 290 },
        gravityY: 400,
        lifespan: { min:_lifespan*0.7, max:_lifespan},
        quantity: 20,
        stopAfter: 20,
        timeScale: 0.9,
        reserve: 20,
        rotate: { min:0, max:360 },
        scale: { min: 0.03, max: 0.06 },
        speed: { min: 50, max: 300 },
        frame: [0,1,2,3,4,5,6,7,8,9,10,11],
    };
    const emitter = scene.add.particles(_x, _y, "par_fluffys", emitterConfig);
}


//---summon

//### summon_star
function summon_star(scene) {
    let _type = Math.floor(Math.random()*7);
    let _star = new Star(scene, 300, -100, "par_stars")
        .setOrigin(0.5)
        .setScale(0.08 + Math.random()*0.08)
        .setAlpha(0.7)
        .setDepth(3)
        .setFrame(_type);
    _star.on_summon();
    group_neonStar.add(_star);
    group_update.add(_star);
}

//### summon_note
function summon_note(scene) {
    let _type = Math.floor(Math.random()*6);
    let _note = new Note(scene, 100, 100, "practice_notes")
        .setOrigin(0.5)
        .setScale(0.12)
        .setAlpha(1)
        .setDepth(3)
        .setFrame(_type);
    group_update.add(_note);
}


//### summon_coin
function summon_coin(scene) {
    let _coin = new Coin(scene, 100, 100, "icon_ohana")
        .setOrigin(0.5)
        .setScale(0.07)
        .setAlpha(1)
        .setDepth(3)
    group_update.add(_coin);
}


//### summon_leaf
function summon_leaf(scene) {
    let _coin = new Coin(scene, 100, 100, "icon_kusa")
        .setOrigin(0.5)
        .setScale(0.09)
        .setAlpha(1)
        .setDepth(3)
    group_update.add(_coin);
}


//### summon_flower
function summon_flower(scene) {
    let _coin = new Coin(scene, 100, 100, "par_flowers")
        .setFrame(Math.floor(Math.random()*5))
        .setOrigin(0.5)
        .setScale(0.1)
        .setAlpha(1)
        .setDepth(3)
    group_update.add(_coin);
}


//### summon_heart
function summon_heart(scene) {
    let _coin = new Coin(scene, 100, 100, "icon_heart")
        .setOrigin(0.5)
        .setScale(0.07)
        .setAlpha(1)
        .setDepth(3)
    group_update.add(_coin);
}


//### summon_fluffy

function summon_fluffy2(scene, _type, _itemId) {
    let _fluffy = new Fluffy2(scene, 0, 0, "fluffy_fluffys", _type, _itemId)
        .setOrigin(0.5)
        //.setScale(0.07)
        .setAlpha(1)
        .setDepth(3);
    //_fluffy.on_summon();
    group_star.add(_fluffy);
    group_update.add(_fluffy);
    if (count_sync > 3) {
        murasakisan.on_click();
        sound_fluffy.play();
    }
}

//### summon_nuichan
async function summon_nuichan(scene, _item_id, _type, _count_nui) {
    let _x = 1070 + _count_nui*30;
    let _y = 520 + _count_nui*30;
    let _item_nui = await contract_get_item_nui(_item_id);
    let _summoner = _item_nui[0];
    let _class = _item_nui[1];
    let _score = _item_nui[2];
    let _exp_rate = _item_nui[3];
    //update active nui_id
    if (_score >= active_nui_score) {
        active_nui_id = _item_id;
        active_nui_score = _score;
        active_nui_exp_rate = _ext_rate;
    }
    let _summoner_name = await call_name_from_summoner(_summoner);
    if (_summoner_name == "") {
        _summoner_name = "#" + _summoner;
    }
    new Nuichan(
        scene, 
        _x, 
        _y, 
        "item_nui_list", 
        _type, 
        _item_id, 
        _summoner_name, 
        _score, 
        _exp_rate
    ).setDepth(_y);
    //draw flower3
    if (count_sync > 3) {
        draw_flower3(this_scene, _x, _y);
    }
}


//### summon_fallingFlower
function summon_fallingFlower(scene) {
    let _flower = new FallingFlower(scene, 0, 0, "par_flowers");
    group_update.add(_flower);
}


//### summon_mogumogu
function summon_mogumogu(scene) {
    let _x = 350;
    let _y = 600;
    mogumogu = scene.add.sprite(_x, _y, "mogumogu")
        .anims.play("mogumogu", true)
        .setOrigin(0.5)
        .setScale(0.3)
        .setDepth(_y)
        .setInteractive({draggable: true, useHandCursor: true})
        .on("pointerover", () => {
            sound_button_select.play();
        })
        .on("pointerdown", () => {
            open_window_convert(scene);
        });
    let _text = "";
    _text += "✿ End Trial ✿";
    mogumogu_text = scene.add.text(_x, _y+35, _text)
        .setFontSize(20)
        .setFontFamily("Arial")
        .setFill("#E62E8B")
        .setOrigin(0.5);
    group_mogumogu = scene.add.group();
    group_mogumogu.add(mogumogu);
    group_mogumogu.add(mogumogu_text);
}


//### summon_alphabed
function summon_alphabet(scene, _alp, _x, _y, flag_keep=0, _scale=0.1) {
    let _dic = {
        "a":"alp_a",
        "b":"alp_b",
        "c":"alp_c",
        "d":"alp_d",
        "e":"alp_e",
        "f":"alp_f",
        "g":"alp_g",
        "h":"alp_h",
        "i":"alp_i",
        "j":"alp_j",
        "k":"alp_k",
        "l":"alp_l",
        "m":"alp_m",
        "n":"alp_n",
        "o":"alp_o",
        "p":"alp_p",
        "q":"alp_q",
        "r":"alp_r",
        "s":"alp_s",
        "t":"alp_t",
        "u":"alp_u",
        "v":"alp_v",
        "w":"alp_w",
        "x":"alp_x",
        "y":"alp_y",
        "z":"alp_z",
        "!":"alp_ext",
    }
    let _alphabet = new Alphabet(scene, _x, _y, _dic[_alp], flag_keep, _scale);
    group_update.add(_alphabet);
    if (flag_keep == 0){
        group_alp.add(_alphabet);
    }
}
function summon_sentence(scene, _txt, _x=250, _y=100) {
    for (i=0; i<_txt.length; i++) {
        let _char = _txt.charAt(i);
        if (_char != " ") {
            let _num = i;
            setTimeout( () => {
                summon_alphabet(scene, _char, _x+_num*40, _y);
            }, 50*_num, scene, _char, _num);
        }
    }
}


//### summon_trial
function summon_trial(scene, _txt="trial", _x=860, _y=210) {
    for (i=0; i<_txt.length; i++) {
        let _char = _txt.charAt(i);
        if (_char != " ") {
            let _num = i;
            setTimeout( () => {
                summon_alphabet(scene, _char, _x+_num*30, _y, 1, 0.075);
            }, 50*_num, scene, _char, _num);
        }
    }
}


//### summon_scoreMeter
function summon_scoreMeter(scene, _x=510, _y=510) {
    for (i=0; i<8; i++) {
        let _cube = new WoodCube(scene, _x+i*32, _y, i);
        group_scoreMeter.add(_cube);
        group_scoreMeter.add(_cube.text_score);
    }
}


//---update tx text
function update_tx_text(mode, hash) {
    if (typeof timeout_tx != "undefined") {
        clearTimeout(timeout_tx);
    }
    //let _hash1 = hash.substring(0,10);
    //let _hash2 = hash.slice(-10);
    let _hash1 = hash.substring(0,8);
    let _hash2 = hash.slice(-8);
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

//---firstCelebration
function firstCelebration(scene) {
    draw_firework(scene);
    murasakisan.on_click();
    summon_sentence(scene, "hello murasaki san!");
}


//===<Phaser3>:preload=============================================================================


function preload(scene) {

    //---loading screen
    //https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13

    //logo
    //scene.load.spritesheet("logolist", "src/icon/logolist.png", {frameWidth: 370, frameHeight: 320});
    let _rnd = Math.random() * 100;
    let logo;
    if (_rnd <= 50) {
        logo = scene.add.image(640, 350, "logolist").setScale(0.3);
    } else if (_rnd <= 67) {
        logo = scene.add.image(640, 350, "logolist2").setScale(0.3);
    } else if (_rnd <= 84) {
        logo = scene.add.image(640, 350, "logolist3").setScale(0.3);
    } else {
        logo = scene.add.image(640, 350, "logolist4").setScale(0.3);
    }

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
    let _logoFrameNum = 0;
    scene.load.on("progress", function(value) {
        if (flag_loaded == 0) {
            progressBar.clear();
            progressBar.fillStyle(0xE62E8B, 1);
            progressBar.fillRect(490, 460, 300 * value, 30);
            percentText.setText( Math.round(value * 100) + "%");
            if (value > _threthold) {
                progressText.setText(_arr[Math.floor(Math.random() * _arr.length)]);
                _threthold += 0.25;
                //increment logo frame number
                _logoFrameNum += 1;
                logo.setFrame(_logoFrameNum);
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


    //---images


    //### back
    scene.load.image("back", "src/png/background.png");
    scene.load.image("back_sandbox", "src/png/background_sandbox.png");
    scene.load.image("back_black", "src/png/background_black.png");
    scene.load.image("window", "src/png/background_window.png");
    scene.load.image("window2", "src/png/background_window2.png");
    scene.load.image("window3", "src/png/background_window3.png");
    
    //### achievement
    scene.load.image("achv_01", "src/png/achv_01.png");
    scene.load.image("achv_02", "src/png/achv_02.png");
    scene.load.image("achv_03", "src/png/achv_03.png");
    scene.load.image("achv_04", "src/png/achv_04.png");
    scene.load.image("achv_05", "src/png/achv_05.png");
    scene.load.image("achv_06", "src/png/achv_06.png");
    scene.load.image("achv_07", "src/png/achv_07.png");
    scene.load.image("achv_08", "src/png/achv_08.png");
    scene.load.image("achv_09", "src/png/achv_09.png");
    scene.load.image("achv_10", "src/png/achv_10.png");
    scene.load.image("achv_11", "src/png/achv_11.png");
    scene.load.image("achv_12", "src/png/achv_12.png");
    scene.load.image("achv_13", "src/png/achv_13.png");
    scene.load.image("achv_14", "src/png/achv_14.png");
    scene.load.image("achv_15", "src/png/achv_15.png");
    scene.load.image("achv_16", "src/png/achv_16.png");
    scene.load.image("achv_17", "src/png/achv_17.png");
    scene.load.image("achv_18", "src/png/achv_18.png");
    scene.load.image("achv_19", "src/png/achv_19.png");
    scene.load.image("achv_20", "src/png/achv_20.png");

    //### murasaki-san
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

    //### button
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
    scene.load.image("button_grooming_enable", "src/png/button_grooming_enable.png");
    scene.load.image("button_grooming_unable", "src/png/button_grooming_unable.png");
    scene.load.image("button_grooming_pointerover", "src/png/button_grooming_pointerover.png");
    scene.load.image("button_levelup_enable", "src/png/button_levelup_enable.png");
    scene.load.image("button_levelup_unable", "src/png/button_levelup_unable.png");
    scene.load.image("button_levelup_pointerover", "src/png/button_levelup_pointerover.png");
    scene.load.image("back_level", "src/png/button_level.png");
    //crafting new
    scene.load.image("button_crafting_unable", "src/png/button_crafting_unable.png");
    scene.load.image("button_crafting_start_on", "src/png/button_crafting_start_on.png");
    scene.load.image("button_crafting_start_off", "src/png/button_crafting_start_off.png");
    scene.load.image("button_crafting_pause_on", "src/png/button_crafting_pause_on.png");
    scene.load.image("button_crafting_pause_off", "src/png/button_crafting_pause_off.png");
    scene.load.image("button_crafting_complete_on", "src/png/button_crafting_complete_on.png");
    scene.load.image("button_crafting_complete_off", "src/png/button_crafting_complete_off.png");
    scene.load.image("button_crafting_resume_on", "src/png/button_crafting_resume_on.png");
    scene.load.image("button_crafting_resume_off", "src/png/button_crafting_resume_off.png");
    scene.load.image("button_crafting_cancel_on", "src/png/button_crafting_cancel_on.png");
    scene.load.image("button_crafting_cancel_off", "src/png/button_crafting_cancel_off.png");
    //practice
    scene.load.image("button_practice_enable", "src/png/button_practice_enable.png");
    scene.load.image("button_practice_unable", "src/png/button_practice_unable.png");
    scene.load.image("button_practice_pointerover", "src/png/button_practice_pointerover.png");
    scene.load.image("button_practice_working", "src/png/button_practice_working.png");
    scene.load.image("button_practice_pointerover_stop", "src/png/button_practice_pointerover_stop.png");

    //### pet
    scene.load.spritesheet("mr_astar_right", "src/png/pet_mr_astar_right.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("mr_astar_left", "src/png/pet_mr_astar_left.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("mr_astar_meet", "src/png/pet_mr_astar_meet.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("ms_ether_right", "src/png/pet_ms_ether_right.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("ms_ether_left", "src/png/pet_ms_ether_left.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("ms_ether_meet", "src/png/pet_ms_ether_meet.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("dr_bitco_right", "src/png/pet_dr_bitco_right.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("dr_bitco_left", "src/png/pet_dr_bitco_left.png", {frameWidth: 600, frameHeight: 600});
    scene.load.spritesheet("dr_bitco_meet", "src/png/pet_dr_bitco_meet.png", {frameWidth: 600, frameHeight: 600});

    
    //### item_basic
    scene.load.image("item_table", "src/png/item_basic_table.png");
    scene.load.image("item_misin", "src/png/item_basic_misin.png");
    scene.load.image("item_tree0", "src/png/item_basic_tree0.png");
    scene.load.image("item_tree1", "src/png/item_basic_tree1.png");
    scene.load.image("item_tree2", "src/png/item_basic_tree2.png");
    scene.load.image("item_tree3", "src/png/item_basic_tree3.png");
    scene.load.image("item_bear", "src/png/item_basic_bear.png");
    scene.load.image("item_gold1", "src/png/item_basic_gold1.png");
    scene.load.image("item_gold2", "src/png/item_basic_gold2.png");
    scene.load.image("item_gold3", "src/png/item_basic_gold3.png");

    //### item_food
    scene.load.image("item_food_potato", "src/png/item_food_potato.png");
    scene.load.image("item_food_bread", "src/png/item_food_bread.png");
    scene.load.image("item_food_cake", "src/png/item_food_cake.png");
    scene.load.image("item_food_onigiri", "src/png/item_food_onigiri.png");
    scene.load.image("item_food_pancake", "src/png/item_food_pancake.png");
    
    //### item_craft
    scene.load.spritesheet("item_musicbox", "src/png/item_musicbox.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_violin", "src/png/item_violin.png");
    scene.load.image("item_violin_inactive", "src/png/item_violin_inactive.png");
    scene.load.image("item_vase", "src/png/item_vase.png");
    scene.load.image("item_kanban", "src/png/item_kanban4.png");
    scene.load.spritesheet("item_crown", "src/png/item_crown.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_fortune_statue", "src/png/item_fortune_statue.png");
    scene.load.image("item_ribbon", "src/png/item_ribbon3.png");
    scene.load.image("item_dice", "src/png/item_dice.png");
    scene.load.image("item_dice_pointerover", "src/png/item_dice_pointerover.png");
    scene.load.image("item_hat_knit", "src/png/item_hat_knit.png");
    scene.load.image("item_hat_mugiwara", "src/png/item_hat_mugiwara.png");
    scene.load.image("item_bank", "src/png/item_bank.png");
    scene.load.image("item_bank_broken", "src/png/item_bank_broken.png");
    scene.load.image("item_hat_helmet", "src/png/item_hat_helmet.png");
    scene.load.image("item_asnya", "src/png/item_asnya.png");
    scene.load.spritesheet("item_nui", "src/png/item_nui2.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("item_switch", "src/png/item_switch.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_pouch", "src/png/item_pouch.png");
    scene.load.image("item_pouch_broken", "src/png/item_pouch_broken.png");
    scene.load.image("item_hat_mortarboard", "src/png/item_hat_mortarboard.png");
    scene.load.image("item_pad_on", "src/png/item_pad_on.png");
    scene.load.image("item_pad_off", "src/png/item_pad_off.png");
    scene.load.spritesheet("item_tokenChest", "src/png/item_tokenChest.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_frame", "src/png/item_frame.png");
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
    scene.load.image("item_wall_sticker_icon", "src/icon/wall_sticker.png");
    scene.load.spritesheet("item_wall_sticker_neon", "src/png/item_wall_sticker_neon.png", {frameWidth: 1280, frameHeight: 960});
    scene.load.image("item_fluffy_house_1", "src/png/item_fluffy_house_1.png");
    scene.load.image("item_fluffy_house_2", "src/png/item_fluffy_house_2.png");
    scene.load.image("item_fluffy_house_3", "src/png/item_fluffy_house_3.png");
    scene.load.image("item_fluffy_house_4", "src/png/item_fluffy_house_4.png");
    scene.load.image("item_fluffy_house_5", "src/png/item_fluffy_house_5.png");
    scene.load.image("item_pancake", "src/png/item_pancake.png");
    scene.load.image("item_rugg", "src/png/item_rugg.png");
    scene.load.image("item_piano", "src/png/item_piano.png");
    scene.load.image("item_piano_inactive", "src/png/item_piano_inactive.png");
    scene.load.image("item_piano_opened", "src/png/item_piano_opened.png");
    scene.load.image("item_window_sunny", "src/png/item_window_sunny.png");
    scene.load.image("item_window_sunny_closed", "src/png/item_window_sunny_closed.png");
    scene.load.image("item_window_cloudy", "src/png/item_window_cloudy.png");
    scene.load.image("item_window_cloudy_closed", "src/png/item_window_cloudy_closed.png");
    scene.load.image("item_window_rain", "src/png/item_window_rain.png");
    scene.load.image("item_window_rain_closed", "src/png/item_window_rain_closed.png");
    scene.load.image("item_window_night", "src/png/item_window_night.png");
    scene.load.image("item_window_night_closed", "src/png/item_window_night_closed.png");
    scene.load.image("item_newspaper", "src/png/item_newspaper.png");
    scene.load.image("item_book", "src/png/item_book.png");
    scene.load.spritesheet("item_presentboxes", "src/png/item_presentboxes.png", {frameWidth: 370, frameHeight: 320});
    /*
    scene.load.image("item_presentbox_01", "src/png/item_presentbox_01.png");
    scene.load.image("item_presentbox_02", "src/png/item_presentbox_02.png");
    scene.load.image("item_presentbox_03", "src/png/item_presentbox_03.png");
    scene.load.image("item_presentbox_04", "src/png/item_presentbox_04.png");
    scene.load.image("item_presentbox_05", "src/png/item_presentbox_05.png");
    scene.load.image("item_presentbox_06", "src/png/item_presentbox_06.png");
    scene.load.image("item_presentbox_07", "src/png/item_presentbox_07.png");
    scene.load.image("item_presentbox_08", "src/png/item_presentbox_08.png");
    */
    scene.load.image("item_box", "src/png/item_box.png");
    scene.load.image("item_crayon", "src/png/item_crayon.png");
    scene.load.spritesheet("item_fishbowl_list", "src/png/item_fishbowl_list.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_bed", "src/png/item_bed.png");
    scene.load.image("item_frame_inside_loading", "src/png/item_frame_inside_loading.png");
    scene.load.spritesheet("item_hammock_list", "src/png/item_hammock_list.png", {frameWidth: 230, frameHeight: 320});
    scene.load.spritesheet("item_lantern_list", "src/png/item_lantern_list.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_staking", "src/png/item_staking.png");
    scene.load.image("item_waterbottle", "src/png/item_waterbottle.png");
    scene.load.image("item_wreath", "src/png/item_wreath.png");    
    scene.load.image("item_cushion", "src/png/item_cushion.png");
    scene.load.image("item_woodcube", "src/png/item_woodcube.png");
    scene.load.spritesheet("item_pinwheel", "src/png/item_pinwheel.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("item_candle", "src/png/item_candle.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("item_retrogame", "src/png/item_retrogame.png");
    scene.load.spritesheet("retro_ascii", "src/png/retro_ascii.png", {frameWidth: 100, frameHeight: 100});
    scene.load.spritesheet("item_runpa", "src/png/item_runpa.png", {frameWidth: 370, frameHeight: 320});
    
    //### item_staking
    scene.load.image("item_staking_01", "src/png/item_staking_01.png");
    scene.load.image("item_staking_02", "src/png/item_staking_02.png");
    scene.load.image("item_staking_03", "src/png/item_staking_03.png");
    scene.load.image("item_staking_04", "src/png/item_staking_04.png");
    scene.load.image("item_staking_05", "src/png/item_staking_05.png");
    scene.load.image("item_staking_06", "src/png/item_staking_06.png");
    scene.load.image("item_staking_07", "src/png/item_staking_07.png");
    scene.load.image("item_staking_08", "src/png/item_staking_08.png");
    
    //### item_practice
    scene.load.image("item_clarinet", "src/png/item_clarinet.png");
    scene.load.image("item_timpani", "src/png/item_timpani.png");
    //scene.load.image("item_cello", "src/png/item_cello.png");
    scene.load.image("item_harp", "src/png/item_harp.png");
    scene.load.image("item_horn", "src/png/item_horn.png");
    scene.load.image("item_clarinet_inactive", "src/png/item_clarinet_inactive.png");
    scene.load.image("item_timpani_inactive", "src/png/item_timpani_inactive.png");
    //scene.load.image("item_cello_inactive", "src/png/item_cello_inactive.png");
    scene.load.image("item_harp_inactive", "src/png/item_harp_inactive.png");
    scene.load.image("item_horn_inactive", "src/png/item_horn_inactive.png");
    scene.load.spritesheet("practice_clarinet", "src/png/practice_piano.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("practice_piano", "src/png/practice_piano.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("practice_violin", "src/png/practice_piano.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("practice_horn", "src/png/practice_piano.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("practice_timpani", "src/png/practice_piano.png", {frameWidth: 370, frameHeight: 320});
    //scene.load.spritesheet("practice_cello", "src/png/practice_piano.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("practice_harp", "src/png/practice_piano.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("practice_notes", "src/png/practice_notes.png", {frameWidth: 370, frameHeight: 320});

    //### alphabed
    scene.load.image("alp_a", "src/png/alp_a.png");
    scene.load.image("alp_b", "src/png/alp_b.png");
    scene.load.image("alp_c", "src/png/alp_c.png");
    scene.load.image("alp_d", "src/png/alp_d.png");
    scene.load.image("alp_e", "src/png/alp_e.png");
    scene.load.image("alp_f", "src/png/alp_f.png");
    scene.load.image("alp_g", "src/png/alp_g.png");
    scene.load.image("alp_h", "src/png/alp_h.png");
    scene.load.image("alp_i", "src/png/alp_i.png");
    scene.load.image("alp_j", "src/png/alp_j.png");
    scene.load.image("alp_k", "src/png/alp_k.png");
    scene.load.image("alp_l", "src/png/alp_l.png");
    scene.load.image("alp_m", "src/png/alp_m.png");
    scene.load.image("alp_n", "src/png/alp_n.png");
    scene.load.image("alp_o", "src/png/alp_o.png");
    scene.load.image("alp_p", "src/png/alp_p.png");
    scene.load.image("alp_q", "src/png/alp_q.png");
    scene.load.image("alp_r", "src/png/alp_r.png");
    scene.load.image("alp_s", "src/png/alp_s.png");
    scene.load.image("alp_t", "src/png/alp_t.png");
    scene.load.image("alp_u", "src/png/alp_u.png");
    scene.load.image("alp_v", "src/png/alp_v.png");
    scene.load.image("alp_w", "src/png/alp_w.png");
    scene.load.image("alp_x", "src/png/alp_x.png");
    scene.load.image("alp_y", "src/png/alp_y.png");
    scene.load.image("alp_z", "src/png/alp_z.png");
    scene.load.image("alp_ext", "src/png/alp_ext.png");
    
    //### festival
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
    scene.load.spritesheet("ff_reports", "src/png/ff_reports.png", {frameWidth: 615, frameHeight: 693});
    scene.load.spritesheet("item_clock", "src/png/item_clock_list.png", {frameWidth: 370, frameHeight: 320});

    //### nui
    scene.load.spritesheet("item_nui_list", "src/png/item_nui_list.png", {frameWidth: 370, frameHeight: 320});

    //### nyui
    scene.load.spritesheet("nyui_moving", "src/png/nyui_moving.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("nyui_happy", "src/png/nyui_happy.png", {frameWidth: 370, frameHeight: 320});

    //### mogumogu
    scene.load.spritesheet("mogumogu", "src/png/mogumogu.png", {frameWidth: 370, frameHeight: 320});

    //### fluffy
    scene.load.spritesheet("fluffy_fluffys", "src/png/fluffy_fluffys3.png", {frameWidth: 370, frameHeight: 320});
    
    //### cat
    scene.load.image("item_mail", "src/png/item_mail.png");
    scene.load.spritesheet("cats", "src/png/cats.png", {frameWidth: 370, frameHeight: 320});
    
    //### icon_system
    scene.load.image("icon_kusa", "src/png/icon_system_kusa.png");
    scene.load.image("icon_ohana", "src/png/icon_system_ohana.png");
    scene.load.image("icon_clock", "src/png/icon_system_clock.png");
    scene.load.image("icon_heart", "src/png/icon_system_heart.png");
    scene.load.image("icon_rotate", "src/png/icon_system_rotate.png");
    scene.load.image("icon_home", "src/png/icon_system_home.png");
    scene.load.image("icon_satiety", "src/png/icon_system_satiety.png");
    scene.load.image("icon_happy", "src/png/icon_system_happy.png");
    scene.load.image("icon_reload", "src/png/icon_reload.png");

    //### icon_status
    scene.load.image("icon_str", "src/png/icon_status_str.png");
    scene.load.image("icon_dex", "src/png/icon_status_dex.png");
    scene.load.image("icon_int", "src/png/icon_status_int.png");
    scene.load.image("icon_luk", "src/png/icon_status_luk.png");
    
    //### twinkles
    scene.load.image("twinkle_01", "src/png/twinkle_01.png");
    scene.load.image("sparkle_01", "src/png/sparkle_01.png");
    scene.load.image("glitter_01", "src/png/glitter_01.png");

    //### stroll
    scene.load.image("stroll_drink_01", "src/png/stroll_drink_01.png");
    scene.load.image("stroll_drink_02", "src/png/stroll_drink_02.png");
    scene.load.image("stroll_drink_03", "src/png/stroll_drink_03.png");
    scene.load.image("stroll_drink_04", "src/png/stroll_drink_04.png");
    scene.load.image("stroll_direction_01", "src/png/stroll_direction_01.png");
    scene.load.image("stroll_direction_02", "src/png/stroll_direction_02.png");
    scene.load.image("stroll_direction_03", "src/png/stroll_direction_03.png");
    scene.load.image("stroll_direction_04", "src/png/stroll_direction_04.png");
    scene.load.image("stroll_direction_during_01", "src/png/stroll_direction_during_01.png");
    scene.load.image("stroll_during_01a", "src/png/stroll_during_01a.png");
    scene.load.image("stroll_during_01b", "src/png/stroll_during_01b.png");
    scene.load.image("stroll_during_01c", "src/png/stroll_during_01c.png");
    scene.load.image("stroll_during_01_back", "src/png/stroll_during_01_back.png");
    scene.load.image("stroll_during_01_cloud", "src/png/stroll_during_01_cloud.png");
    scene.load.image("stroll_during_01_mountain", "src/png/stroll_during_01_mountain.png");
    scene.load.image("stroll_during_01_grass", "src/png/stroll_during_01_grass.png");
    scene.load.image("stroll_waterbottle", "src/png/stroll_waterbottle.png");
    scene.load.image("stroll_during_02_back", "src/png/stroll_during_02_back.png");
    scene.load.image("stroll_during_02_wave", "src/png/stroll_during_02_wave.png");
    scene.load.image("stroll_during_02_starfish", "src/png/stroll_during_02_starfish.png");
    scene.load.image("stroll_during_02_shell", "src/png/stroll_during_02_shell.png");
    scene.load.image("stroll_during_02_yacht", "src/png/stroll_during_02_yacht.png");
    scene.load.image("stroll_during_02_fune", "src/png/stroll_during_02_fune.png");
    scene.load.image("stroll_during_03_back", "src/png/stroll_during_03_back.png");
    scene.load.image("stroll_during_03_tree1", "src/png/stroll_during_03_tree1.png");
    scene.load.image("stroll_during_03_tree2", "src/png/stroll_during_03_tree2.png");
    scene.load.image("stroll_during_03_baloon", "src/png/stroll_during_03_baloon.png");
    scene.load.image("stroll_during_03_mountain", "src/png/stroll_during_03_mountain.png");

    //### neon
    scene.load.spritesheet("neon_ufo", "src/png/neon_ufo.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("neon_moon", "src/png/neon_moon.png", {frameWidth: 370, frameHeight: 320});
    scene.load.image("neon_saturn", "src/png/neon_saturn.png");
    
    //### pippel
    scene.load.image("pippel_basic", "src/png/pippel_basic.png");


    //---sounds


    //### music
    scene.load.audio("bgm1", "src/music/Morning_2.mp3");
    scene.load.audio("bgm2", "src/music/Roll_Roll_Roll.mp3");
    scene.load.audio("bgm3", "src/music/amaoto.mp3");
    scene.load.audio("bgm_n1", "src/music/kiyoshi.mp3");

    //### sound
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
    scene.load.audio("nyui2", "src/sound/nyui2.mp3");
    scene.load.audio("fluffy_house", "src/sound/fluffy_house.mp3");
    scene.load.audio("practice", "src/sound/practice.mp3");
    scene.load.audio("piano_a", "src/sound/piano_a.mp3");
    scene.load.audio("piano_b", "src/sound/piano_b.mp3");
    scene.load.audio("piano_c", "src/sound/piano_c.mp3");
    scene.load.audio("piano_d", "src/sound/piano_d.mp3");
    scene.load.audio("piano_e", "src/sound/piano_e.mp3");
    scene.load.audio("piano_f", "src/sound/piano_f.mp3");
    scene.load.audio("piano_g", "src/sound/piano_g.mp3");
    scene.load.audio("alp_dissolving", "src/sound/alp_dissolving.mp3");
    scene.load.audio("alp_rising", "src/sound/alp_rising.mp3");
    scene.load.audio("alp_stretching", "src/sound/alp_stretching.mp3");
    scene.load.audio("alp_falling", "src/sound/alp_falling.mp3");
    scene.load.audio("alp_flipping", "src/sound/alp_flipping.mp3");
    scene.load.audio("alp_shrinking", "src/sound/alp_shrinking.mp3");
    scene.load.audio("woodcube", "src/sound/woodcube.mp3");

    //---particles
    //https://codepen.io/samme/pen/eYEearb
    scene.load.atlas('par_flares', 'src/particle/flares.png', 'src/particle/flares.json');
    scene.load.spritesheet("par_flowers", "src/particle/flowers.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("par_stars", "src/particle/stars.png", {frameWidth: 200, frameHeight: 191});
    scene.load.spritesheet("par_fluffys", "src/particle/fluffy.png", {frameWidth: 370, frameHeight: 320});
    scene.load.spritesheet("par_glitter", "src/particle/glitter.png", {frameWidth: 370, frameHeight: 320});
    
    //---tokenBall
    //### image
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
    //### contracts
    //***TODO*** contract
    //local
    dic_tokenBall_contract = {
        ACA:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        ASTR:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        BNB:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        BTC:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        BUSD:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        DAI:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        DOT:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        ETH:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        GLMR:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        KSM:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        LAY:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        MATIC:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        SDN:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        USDC:"0x6d315468D2457F541FA15c1275A5cDAF5f950622",
        USDT:"0x6d315468D2457F541FA15c1275A5cDAF5f950622"
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


//===<Phaser3>:create=============================================================================


function create(scene) {

    //---group
    group_star = scene.add.group();
    group_update = scene.add.group();
    group_update.runChildUpdate = true;
    group_info = scene.add.group();
    group_info2 = scene.add.group();
    group_nyuinyui_ohana = scene.add.group();
    group_neonStar = scene.add.group();
    group_pet = scene.add.group();
    group_alp = scene.add.group();
    group_scoreMeter = scene.add.group();
    
    
    //---images & sprites

    //### back image
    scene.add.image(640, 480, "back");
    
    //### achievement
    let _achv_alpha = 0.7;
    achv_01 = scene.add.image(1155, 568, "achv_01").setAlpha(_achv_alpha).setVisible(false);
    achv_02 = scene.add.image(1190, 595, "achv_02").setAlpha(_achv_alpha).setVisible(false);
    achv_03 = scene.add.image(1248, 660, "achv_03").setAlpha(_achv_alpha).setVisible(false);
    achv_04 = scene.add.image(600, 480, "achv_04").setAlpha(_achv_alpha).setVisible(false);
    achv_05 = scene.add.image(632, 489, "achv_05").setAlpha(_achv_alpha).setVisible(false);
    achv_06 = scene.add.image(330, 472, "achv_06").setAlpha(_achv_alpha).setVisible(false);
    achv_07 = scene.add.image(285, 472, "achv_07").setAlpha(_achv_alpha).setVisible(false);
    achv_08 = scene.add.image(240, 474, "achv_08").setAlpha(_achv_alpha).setVisible(false);
    achv_09 = scene.add.image(310, 420, "achv_09").setAlpha(_achv_alpha).setVisible(false);
    achv_10 = scene.add.image(255, 420, "achv_10").setAlpha(_achv_alpha).setVisible(false);
    achv_11 = scene.add.image(1255, 619, "achv_11").setAlpha(_achv_alpha).setVisible(false);
    achv_12 = scene.add.image(1263, 683, "achv_12").setAlpha(_achv_alpha).setVisible(false);
    achv_13 = scene.add.image(1140, 533, "achv_13").setAlpha(_achv_alpha).setVisible(false);
    achv_14 = scene.add.image(1190, 540, "achv_14").setAlpha(_achv_alpha).setVisible(false);
    achv_15 = scene.add.image(365, 408, "achv_15").setAlpha(_achv_alpha).setVisible(false);
    achv_16 = scene.add.image(825, 480, "achv_16").setAlpha(_achv_alpha).setVisible(false);
    achv_17 = scene.add.image(1215, 633, "achv_17").setAlpha(_achv_alpha).setVisible(false);
    achv_18 = scene.add.image(836, 448, "achv_18").setAlpha(_achv_alpha).setVisible(false);
    achv_19 = scene.add.image(1232, 580, "achv_19").setAlpha(_achv_alpha).setVisible(false);
    achv_20 = scene.add.image(365, 470, "achv_20").setAlpha(_achv_alpha).setVisible(false);
    li_achv = [
        0,
        achv_01,
        achv_02,
        achv_03,
        achv_04,
        achv_05,
        achv_06,
        achv_07,
        achv_08,
        achv_09,
        achv_10,
        achv_11,
        achv_12,
        achv_13,
        achv_14,
        achv_15,
        achv_16,
        achv_17,
        achv_18,
        achv_19,
        achv_20,
    ];


    //### item_basic
    item_back_sandbox = scene.add.image(640, 480, "back_sandbox").setDepth(2);
    item_bear = scene.add.sprite(1000,400, "item_bear")
        .setScale(0.45).setDepth(2);
    item_table = scene.add.sprite(600,870, "item_table")
        .setOrigin(0.5)
        .setScale(0.6)
        .setDepth(2);
    item_misin = scene.add.sprite(950,830, "item_misin")
        .setOrigin(0.5)
        .setScale(0.8)
        .setDepth(2);
    item_tree0 = scene.add.sprite(100,400, "item_tree0")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(450);
    item_tree1 = scene.add.sprite(100,400, "item_tree1")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(450+2);
    item_tree2 = scene.add.sprite(100,400, "item_tree2")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(450+1);
    item_tree3 = scene.add.sprite(100,400, "item_tree3")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(450);
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


    //--- animations
    

    //### wall sticker
    scene.anims.create({
        key: "wall_sticker_neon",
        frames: scene.anims.generateFrameNumbers("item_wall_sticker_neon", {frames:[0,0,1,1,2,2]}),
        frameRate: 1,
        repeat: -1
    });

    //### murasaki
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

    //### pet
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
        key: "mr_astar_meet",
        frames: scene.anims.generateFrameNumbers("mr_astar_meet", {start:0, end:1}),
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
        key: "ms_ether_meet",
        frames: scene.anims.generateFrameNumbers("ms_ether_meet", {start:0, end:1}),
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
    scene.anims.create({
        key: "dr_bitco_meet",
        frames: scene.anims.generateFrameNumbers("dr_bitco_meet", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    
    //### item
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
        frames: scene.anims.generateFrameNumbers("item_clock", {frames:[4, 3, 4, 3, 0]}),
        frameRate: 1,
        repeat: 0
    });
    scene.anims.create({
        key: "item_fishbowl_1",
        frames: scene.anims.generateFrameNumbers("item_fishbowl_list", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_fishbowl_2",
        frames: scene.anims.generateFrameNumbers("item_fishbowl_list", {start:2, end:3}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_fishbowl_3",
        frames: scene.anims.generateFrameNumbers("item_fishbowl_list", {start:4, end:5}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_fishbowl_4",
        frames: scene.anims.generateFrameNumbers("item_fishbowl_list", {start:6, end:7}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_fishbowl_5",
        frames: scene.anims.generateFrameNumbers("item_fishbowl_list", {start:8, end:9}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_hammock",
        frames: scene.anims.generateFrameNumbers("item_hammock_list", {start:1, end:2}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_lantern",
        frames: scene.anims.generateFrameNumbers("item_lantern_list", {start:2, end:4}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_candle",
        frames: scene.anims.generateFrameNumbers("item_candle", {frames:[0, 1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_runpa",
        frames: scene.anims.generateFrameNumbers("item_runpa", {frames:[0,0,1,1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "item_runpa_sleeping",
        frames: scene.anims.generateFrameNumbers("item_runpa", {frames:[2,2,3,3]}),
        frameRate: 1,
        repeat: -1
    });
        
    //### cat
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
    
    //### fluffy
    //fluffier, blinking
    for (i=1; i<=12; i++) {
        let _key = "fluffy_fluffier_" + ("00" + i).slice(-2);
        let _frames = [1 +10*(i-1), 1 +10*(i-1), 2 +10*(i-1)];
        scene.anims.create({
            key: _key,
            frames: scene.anims.generateFrameNumbers("fluffy_fluffys", {frames: _frames}),
            frameRate: 1,
            repeat: -1
        });
    }

    //fluffiest, front
    for (i=1; i<=12; i++) {
        let _key = "fluffy_fluffiest_" + ("00" + i).slice(-2) + "_front";
        let _frames = [3 +10*(i-1), 3+1 +10*(i-1)];
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
        let _frames = [5 +10*(i-1), 5+1 +10*(i-1)];
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
        let _frames = [7 +10*(i-1), 7+1 +10*(i-1)];
        scene.anims.create({
            key: _key,
            frames: scene.anims.generateFrameNumbers("fluffy_fluffys", {frames: _frames}),
            frameRate: 2,
            repeat: -1
        });
    }
        
    //### nyui
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
    scene.anims.create({
        key: "nyui_happy",
        frames: scene.anims.generateFrameNumbers("nyui_happy", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });    

    //### mogumogu
    scene.anims.create({
        key: "mogumogu",
        frames: scene.anims.generateFrameNumbers("mogumogu", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });

    //### festival
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
    
    //### practice
    scene.anims.create({
        key: "practice_clarinet",
        frames: scene.anims.generateFrameNumbers("practice_piano", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "practice_piano",
        frames: scene.anims.generateFrameNumbers("practice_piano", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "practice_violin",
        frames: scene.anims.generateFrameNumbers("practice_piano", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "practice_horn",
        frames: scene.anims.generateFrameNumbers("practice_piano", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "practice_timpani",
        frames: scene.anims.generateFrameNumbers("practice_piano", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    scene.anims.create({
        key: "practice_cello",
        frames: scene.anims.generateFrameNumbers("practice_piano", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    
    //### neon
    scene.anims.create({
        key: "neon_ufo",
        frames: scene.anims.generateFrameNumbers("neon_ufo", {frames:[0,1]}),
        frameRate: 1,
        repeat: -1
    });
    
    
    //---buttons
    
    
    let _x;
    let _y;

    //### feeding
    _x = 460;
    _y = 870;
    button_feeding = scene.add.sprite(_x, _y, "button_feeding")
        .setScale(0.16)
        .setDepth(11)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_feeding(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_feeding.setTexture("button_feeding_pointerover"))
        .on('pointerout', () => button_feeding.setTexture("button_feeding"));
    group_info.add(button_feeding);

    //### grooming
    _x = 1150;
    _y = 400;
    button_grooming = scene.add.sprite(_x, _y, "button_grooming_unable")
        .setScale(0.16)
        .setDepth(11)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_grooming(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_grooming.setTexture("button_grooming_pointerover"))
        .on('pointerout', () => button_grooming.setTexture("button_grooming"))
        .disableInteractive();
    group_info.add(button_grooming);

    //### mining
    _x = 60;
    _y = 760;
    button_mining = scene.add.sprite(_x, _y, "button_mining_unable")
        .setScale(0.16)
        .setDepth(11)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            sound_button_on.play();
            if ((happy > 10 && satiety > 10) || murasakisan.mode == "mining") {
                contract_mining(summoner);
            } else {
                let _text = "Too low Satiety or Happy...";
                let _msg = scene.add.text(25, 808, _text)
                    .setFontSize(20)
                    .setFontFamily("Arial")
                    .setFill("#ff1694");
                setTimeout( () => {
                    _msg.destroy();
                }, 3000, scene);
            }
        })
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_mining.setTexture("button_mining_pointerover"))
        .on('pointerout', () => button_mining.setTexture("button_mining_enable"))
        .disableInteractive();
    group_info.add(button_mining);
    //unable text
    /*
    button_mining_unable_text = scene.add.text(
        _x-50, _y+20,
        "Required Lv:2",
        {font: "20px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
    ).setDepth(2001).setVisible(false);
    */
    //icon
    icon_mining = scene.add.sprite(_x+55, _y-22, "icon_ohana")
        .setScale(0.07)
        .setVisible(false);
    //text
    text_mining_calc = scene.add.text(_x+67, _y-30, "", {font: "18px Arial", fill: "#000"});
    group_info2.add(icon_mining);
    group_info.add(text_mining_calc);

    //### farming
    _x = 240;
    _y = 340;
    button_farming = scene.add.sprite(_x, _y, "button_farming_unable")
        .setScale(0.16)
        .setDepth(11)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            sound_button_on.play();
            if ((happy > 10 && satiety > 10) || murasakisan.mode == "farming") {
                contract_farming(summoner);
            } else {
                let _text = "Too low Satiety or Happy...";
                let _msg = scene.add.text(130, 390, _text)
                    .setFontSize(20)
                    .setFontFamily("Arial")
                    .setFill("#ff1694");
                setTimeout( () => {
                    _msg.destroy();
                }, 3000, scene);
            }
        })
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_farming.setTexture("button_farming_pointerover"))
        .on('pointerout', () => button_farming.setTexture("button_farming_enable"))
        .disableInteractive();
    group_info.add(button_farming);
    //unable text
    /*
    button_farming_unable_text = scene.add.text(
        _x-65, _y+20,
        "Required Lv:2",
        {font: "20px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
    ).setDepth(2001).setVisible(false);
    */
    //icon
    icon_farming = scene.add.sprite(_x+55, _y-20, "icon_kusa")
        .setScale(0.09)
        .setVisible(false);
    //text
    text_farming_calc = scene.add.text(_x+65, _y-30, "", {font: "18px Arial", fill: "#000"});
    group_info2.add(icon_farming);
    group_info.add(text_farming_calc);

    //### level
    _x = 1240;
    _y = 35;
    button_levelup_unable_text = scene.add.text(
        1080, 70,
        " Level cap in trial: Lv4 ",
        {font: "20px Arial", fill: "#ff0000", backgroundColor: "#ffeeee"}
    ).setDepth(2001).setVisible(false);
    button_levelup = scene.add.sprite(_x, _y, "back_level")
        .setScale(0.11)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            sound_button_on.play();
            if (gamemode == "trial" && local_level >= 4) {
                button_levelup_unable_text.visible=true;
                setTimeout( () => {
                    button_levelup_unable_text.visible=false;
                }, 3000, scene);
            } else {
                contract_level_up(summoner);
            }
        })
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_levelup.setTexture("button_levelup_pointerover"))
        .on('pointerover', () => text_level.setText(""))
        .on('pointerout', () => button_levelup.setTexture("button_levelup_enable"))
        .on('pointerout', () => text_level.setText(local_level))
        .disableInteractive();
    text_level = scene.add.text(_x, _y+7, "0", {font: "bold 26px Verdana", fill: "#E5004F"}).setOrigin(0.5);
    group_info.add(button_levelup);
    group_info.add(text_level);

    //### practice
    _x = 380;
    _y = 580;
    button_practice = scene.add.sprite(_x, _y, "button_practice_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_practice.setTexture("button_practice_pointerover"))
        .on('pointerout', () => button_practice.setTexture("button_practice_enable"))
        .disableInteractive()
        .on("pointerdown", () => {
            if (local_practice_status == 0) {
                open_window_practice(scene);
            } else {
                sound_button_on.play();
                contract_stop_practice(summoner);
            }
        })
        .setVisible(false);
    group_info.add(button_practice);

    //### crafting
    _x = 820;
    _y = 870;
    
    //unable button
    button_crafting_unable = scene.add.sprite(_x, _y, "button_crafting_unable")
        .setScale(0.16).setDepth(3);
    group_info.add(button_crafting_unable);
    //unable text
    /*
    button_crafting_unable_text = scene.add.text(
        _x-85, _y+20,
        "Required Lv:3",
        {font: "20px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
    ).setDepth(2001).setVisible(false);
    */

    //start button
    button_crafting_start = scene.add.sprite(_x, _y, "button_crafting_start_off")
        .on("pointerover", () => {
            sound_button_select.play();
            button_crafting_start.setTexture("button_crafting_start_on");
        })
        .on("pointerout", () => {
            button_crafting_start.setTexture("button_crafting_start_off")
        })
        .on("pointerdown", () => {
            sound_button_on.play();
            if (global_selected_crafting_item > 0) {
                contract_start_crafting(summoner, global_selected_crafting_item);
            }
        })
        .setScale(0.16)
        .setDepth(11)
        .setInteractive({useHandCursor: true})
        .setVisible(false);
    group_info2.add(button_crafting_start);

    //pause button
    button_crafting_pause = scene.add.sprite(_x, _y, "button_crafting_pause_off")
        .on("pointerover", () => {
            sound_button_select.play();
            button_crafting_pause.setTexture("button_crafting_pause_on");
        })
        .on("pointerout", () => {
            button_crafting_pause.setTexture("button_crafting_pause_off")
        })
        .on("pointerdown", () => {
            sound_button_on.play();
            contract_pause_crafting(summoner);
        })
        .setScale(0.16)
        .setDepth(12)
        .setInteractive({useHandCursor: true})
        .setVisible(false);
    group_info2.add(button_crafting_pause);

    //complete button
    button_crafting_complete = scene.add.sprite(_x, _y, "button_crafting_complete_off")
        .on("pointerover", () => {
            sound_button_select.play();
            button_crafting_complete.setTexture("button_crafting_complete_on");
        })
        .on("pointerout", () => {
            button_crafting_complete.setTexture("button_crafting_complete_off")
        })
        .on("pointerdown", () => {
            sound_button_on.play();
            contract_complete_crafting(summoner);
        })
        .setScale(0.16)
        .setDepth(13)
        .setInteractive({useHandCursor: true})
        .setVisible(false);
    group_info2.add(button_crafting_complete);

    //resume button
    button_crafting_resume = scene.add.sprite(_x, _y, "button_crafting_resume_off")
        .on("pointerover", () => {
            sound_button_select.play();
            button_crafting_resume.setTexture("button_crafting_resume_on");
        })
        .on("pointerout", () => {
            button_crafting_resume.setTexture("button_crafting_resume_off")
        })
        .on("pointerdown", () => {
            sound_button_on.play();
            contract_resume_crafting(summoner);
        })
        .setScale(0.16)
        .setDepth(14)
        .setInteractive({useHandCursor: true})
        .setVisible(false);
    group_info2.add(button_crafting_resume);

    //cancel button
    button_crafting_cancel = scene.add.sprite(_x+250, _y, "button_crafting_cancel_off")
        .on("pointerover", () => {
            sound_button_select.play();
            button_crafting_cancel.setTexture("button_crafting_cancel_on");
        })
        .on("pointerout", () => {
            button_crafting_cancel.setTexture("button_crafting_cancel_off")
        })
        .on("pointerdown", () => {
            sound_button_on.play();
            contract_cancel_crafting(summoner);
        })
        .setScale(0.16)
        .setDepth(15)
        .setInteractive({useHandCursor: true})
        .setVisible(false);
    group_info2.add(button_crafting_cancel);

    //### crafting_selected_info
    //icon_ohana
    icon_crafting_ohana = scene.add.sprite(_x+58, _y+13, "icon_ohana")
        .setDepth(2000)
        .setScale(0.07)
        .setVisible(false);
    group_info2.add(icon_crafting_ohana);
    //icon_kusa
    icon_crafting_kusa = scene.add.sprite(_x+130, _y+15, "icon_kusa")
        .setDepth(2000)
        .setScale(0.09)
        .setVisible(false);
    group_info2.add(icon_crafting_kusa);
    //icon_clock
    icon_crafting_time = scene.add.sprite(_x+58, _y+42, "icon_clock")
        .setDepth(2000)
        .setScale(0.12)
        .setVisible(false);
    group_info2.add(icon_crafting_time);
    //text
    text_crafting_selected_item_ohana = scene.add.text(
        _x+72, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(2000);
    group_info2.add(text_crafting_selected_item_ohana);
    text_crafting_selected_item_kusa = scene.add.text(
        _x+142, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(2000);
    group_info2.add(text_crafting_selected_item_kusa);
    text_crafting_selected_item_heart = scene.add.text(
        _x+214, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(2000);
    group_info2.add(text_crafting_selected_item_heart);
    text_crafting_selected_item_time = scene.add.text(
        _x+72, 
        _y+32, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(2000);
    group_info2.add(text_crafting_selected_item_time);

    //### craftimg_now_info
    //icon_clock
    icon_crafting_time_remining = scene.add.image(_x+60, _y+15, "icon_clock")
        .setDepth(2000)
        .setScale(0.12)
        .setVisible(false);
    //text
    group_info2.add(icon_crafting_time_remining);
    text_crafting_calc = scene.add.text(
        _x+75, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(2000);
    group_info2.add(text_crafting_calc);
    //select crafting_item_type
    text_select_item = scene.add.text(_x+50, _y-30, ">> Select Item <<", {font: "30px Arial", fill: "#000", backgroundColor: "#ecd9ff"})
        .setDepth(2000)
        .setFontSize(24).setFontFamily("Arial").setFill('#000000')
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => {
            if (flag_window_craft == 0 && summoner != 0) {
                flag_window_craft = 1;
                open_window_craft(scene);
            }
        })
        .on("pointerover", () => text_select_item.setStyle({ fontSize: 24, fontFamily: "Arial", fill: '#d19dff' }))
        .on("pointerout", () => text_select_item.setStyle({ fontSize: 24, fontFamily: "Arial", fill: '#000000' }));
    group_info2.add(text_select_item);
    text_craft_item = scene.add.text(_x+50, _y, "", {font: "18px Arial", fill: "#000"})
                .setDepth(2000)
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => open_window_craft(scene) )
    group_info2.add(text_craft_item);


    //---system button

    //### icon_rotate
    icon_rotate = scene.add.sprite(1235,915-15, "icon_rotate")
        .setOrigin(0.5)
        .setScale(0.12)
        .setDepth(4100)
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

    //### icon_home
    icon_home = scene.add.sprite(1160,915-15, "icon_home")
        .setOrigin(0.5)
        .setScale(0.15)
        .setDepth(4100)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_system.play())
        .on("pointerdown", () => {
                window.location.href = "./";
        });
    group_info.add(icon_home);


    //---sounds


    //### music
    //sound out of focus
    scene.sound.pauseOnBlur = false
    bgm1 = scene.sound.add("bgm1", {volume:0.1, loop:true});
    bgm2 = scene.sound.add("bgm2", {volume:0.1, loop:true});
    bgm3 = scene.sound.add("bgm3", {volume:0.1, loop:true});
    bgm_n1 = scene.sound.add("bgm_n1", {volume:0.075, loop:true});

    //### sound
    sound_button_select = scene.sound.add("button_select", {volume:0.2});
    sound_button_on = scene.sound.add("button_on", {volume:0.2});
    sound_feeding = scene.sound.add("feeding", {volume:0.1});
    sound_grooming = scene.sound.add("grooming", {volume:0.1});
    sound_mining = scene.sound.add("mining", {volume:0.1});
    sound_mining_during = scene.sound.add("mining_during", {volume:0.1});
    sound_farming = scene.sound.add("farming", {volume:0.1});
    sound_farming_during = scene.sound.add("farming_during", {volume:0.2});
    sound_crafting = scene.sound.add("crafting", {volume:0.1});
    sound_crafting_during = scene.sound.add("crafting_during", {volume:0.05});
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
    sound_fireworks = scene.sound.add("fireworks", {volume:0.1});
    sound_fireworks2 = scene.sound.add("fireworks2", {volume:0.1});
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
    sound_nyui2 = scene.sound.add("nyui2", {volume:0.1});
    sound_fluiffy_house = scene.sound.add("fluffy_house", {volume:0.1});
    sound_practice = scene.sound.add("practice", {volume:0.1});
    sound_piano_a = scene.sound.add("piano_a", {volume:0.02});
    sound_piano_b = scene.sound.add("piano_b", {volume:0.02});
    sound_piano_c = scene.sound.add("piano_c", {volume:0.02});
    sound_piano_d = scene.sound.add("piano_d", {volume:0.02});
    sound_piano_e = scene.sound.add("piano_e", {volume:0.02});
    sound_piano_f = scene.sound.add("piano_f", {volume:0.02});
    sound_piano_g = scene.sound.add("piano_g", {volume:0.02});
    sound_dissolving = scene.sound.add("alp_dissolving", {volume:0.1});
    sound_stretching = scene.sound.add("alp_stretching", {volume:0.1});
    sound_rising = scene.sound.add("alp_rising", {volume:0.1});
    sound_falling = scene.sound.add("alp_falling", {volume:0.1});
    sound_flipping = scene.sound.add("alp_flipping", {volume:0.1});
    sound_shrinking = scene.sound.add("alp_shrinking", {volume:0.1});
    sound_woodcube = scene.sound.add("woodcube", {volume:0.4});


    //---system message


    //system message
    text_system_message = scene.add.text(640, 420, "", {
        font: "32px Arial", 
        fill: "#000000", 
        backgroundColor: "#ffffff",
        align: "center"
    }).setOrigin(0.5).setDepth(2000);

    //### summon
    text_summon = scene.add.text(640, 500, ">> Summon Trial Murasaki-san <<", {font: "38px Arial", fill: "#E62E8B", backgroundColor: "#FDEFF5"})
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => open_window_summon(scene) )
        .on("pointerover", () => text_summon.setStyle({ fontSize: 38, fontFamily: "Arial", fill: '#0000ff' }))
        .on("pointerout", () => text_summon.setStyle({ fontSize: 38, fontFamily: "Arial", fill: '#E62E8B' }));
    text_summon.visible = false;

    //### curePetrification
    let _text_fee = "";
    if (gamemode == "trial") {
        _text_fee = " >> Cure Petrification (Cost: free during trial) << ";
    } else {
        _text_fee = " >> Cure Petrification (Cost: " + (local_price/10**18).toFixed(2) + " $ASTR) << ";
    }
    text_curePetrification = scene.add.text(640, 480, _text_fee, {font: "28px Arial", fill: "#E62E8B", backgroundColor: "#FDEFF5"})
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .setDepth(2000)
        .on("pointerdown", () => contract_curePetrification(summoner) )
        .on("pointerover", () => text_curePetrification.setStyle({ fontSize: 28, fontFamily: "Arial", fill: '#0000ff' }))
        .on("pointerout", () => text_curePetrification.setStyle({ fontSize: 28, fontFamily: "Arial", fill: '#E62E8B' }));
    text_curePetrification.visible = false;


    //---status


    let font_arg = {font: "18px Arial", fill: "#000"};

    //### system info
    text_fps = scene.add.text(5, 955, "***", {font: "14px Arial", fill: "#303030"})
        .setOrigin(0,1)
        .setDepth(200);
    text_sync_time = scene.add.text(1275, 955, "***", {font: "14px Arial", fill: "#727171"})
        .setOrigin(1)
        .setDepth(2000);
    text_wallet = scene.add.text(1250, 955, "***", {font: "14px Arial", fill: "#727171"})
        .setOrigin(1)
        .setDepth(2000);
    group_info.add(text_fps);
    group_info.add(text_sync_time);
    group_info.add(text_wallet);

    //### satiety
    icon_satiety = scene.add.sprite(30,25, "icon_satiety")
        .setScale(0.08)
        .setDepth(2000);
    bar_satiety_back = makeBar(scene, 55, 15, 0xF8C5AC)
        .setDepth(2000);
    bar_satiety_back.scaleX = 1;
    bar_satiety = makeBar(scene, 55, 15, 0xE60012)
        .setDepth(2000);
    bar_satiety.scaleX = 0;
    text_satiety = scene.add.text(60, 16, "0%", {font: "17px Arial", fill: "#ffffff"})
        .setDepth(2000);
    group_info.add(icon_satiety);
    group_info.add(bar_satiety_back);
    group_info.add(bar_satiety);
    group_info.add(text_satiety);

    //### happy
    icon_happy = scene.add.sprite(245,25, "icon_happy")
        .setScale(0.08)
        .setDepth(2000);
    bar_happy_back = makeBar(scene, 270, 15, 0xFCE2BA)
        .setDepth(2000);
    bar_happy_back.scaleX = 1;
    bar_happy = makeBar(scene, 270, 15, 0xF39800)
        .setDepth(2000);
    bar_happy.scaleX = 0;
    text_happy = scene.add.text(275, 16, "0%", {font: "17px Arial", fill: "#ffffff"})
        .setDepth(2000);
    group_info.add(icon_happy);
    group_info.add(bar_happy_back);
    group_info.add(bar_happy);
    group_info.add(text_happy);

    //### exp
    icon_exp = scene.add.text(440, 15, "Exp:", font_arg)
        .setDepth(2000);
    bar_exp_back = makeBar(scene, 480, 15, 0xBBCCE9)
        .setDepth(2000);
    bar_exp_back.scaleX = 1;
    bar_exp = makeBar(scene, 480, 15, 0x0068B7)
        .setDepth(2000);
    bar_exp.scaleX = 0;
    let _text_exp_boost = "";
    //flower rewath check
    if (typeof item_wreath != "undefined") {
        _text_exp_boost += " wreath boost: +" + (local_achv_onChain_score/100).toFixed(2) + "% \n";
    } else {
        _text_exp_boost += " wreath boost: +" + (0).toFixed(2) + "% \n";
    }
    _text_exp_boost += " twinkle boost: +" + (local_exp_rate_twinkle/100).toFixed(2) + "% \n";
    _text_exp_boost += " doll boost: +" + ((active_nui_exp_rate/100)).toFixed(2) + "% ";
    text_exp_boost = scene.add.text(480, 40, _text_exp_boost, {font: "17px Arial", fill: "#000", backgroundColor: "#C6D8F4"})
        //.setOrigin(1,0)
        .setVisible(false)
        .setDepth(2000);
    text_exp_boost_click = 0;
    text_exp = scene.add.text(485, 16, "0 / 0", {font: "17px Arial", fill: "#ffffff"})
        .setDepth(2000)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => {
            //rebuild text
            let _text_exp_boost = "";
            //flower rewath check
            if (typeof item_wreath != "undefined") {
                _text_exp_boost += " wreath boost: +" + (local_achv_onChain_score/100).toFixed(2) + "% \n";
            } else {
                _text_exp_boost += " wreath boost: +" + (0).toFixed(2) + "% \n";
            }
            _text_exp_boost += " item boost: +" + (local_exp_rate_twinkle/100).toFixed(2) + "% \n";
            _text_exp_boost += " doll boost: +" + ((active_nui_exp_rate/100)).toFixed(2) + "% ";
            text_exp_boost.setText(_text_exp_boost);
            text_exp_boost.setVisible(true)
            text_exp_boost_click += 1;
            let _text_exp_boost_click_now = text_exp_boost_click;
            setTimeout( () => {
                if (_text_exp_boost_click_now == text_exp_boost_click) {
                    text_exp_boost.setVisible(false);
                }
            }, 2000);
        });
    text_exp_earned = scene.add.text(480, 38, "", {font: "17px Arial", fill: "#000000"})
        .setDepth(2000);
    text_exp_earned_count = 0;
    group_info.add(icon_exp);
    group_info.add(bar_exp_back);
    group_info.add(bar_exp);
    group_info.add(text_exp);

    //### coin
    icon_ohana = scene.add.sprite(668,23, "icon_ohana")
        .setScale(0.07)
        .setDepth(2000);
    text_coin = scene.add.text(685, 15, "Coin: 0", {font: "17px Arial", fill: "#000", backgroundColor: "#FFF200"})
        .setDepth(2000);
    text_coin_earned = scene.add.text(685, 38, "", {font: "17px Arial", fill: "#000000"})
        .setDepth(2000);
    text_coin_earned_count = 0;
    group_info.add(icon_ohana);
    group_info.add(text_coin);

    //### material
    icon_kusa = scene.add.sprite(815, 25, "icon_kusa")
        .setScale(0.09)
        .setDepth(2000);
    text_material = scene.add.text(830, 15, "Leaf: 0", {font: "17px Arial", fill: "#000", backgroundColor: "#D7E7AF"})
        .setDepth(2000);
    text_material_earned = scene.add.text(830, 38, "", {font: "17px Arial", fill: "#000000"})
        .setDepth(2000);
    text_material_earned_count = 0;
    group_info.add(icon_kusa);
    group_info.add(text_material);

    //### heart
    icon_heart = scene.add.sprite(960, 21, "icon_heart")
        .setScale(0.08)
        .setDepth(2000);
    text_fluffy = scene.add.text(1045, 40, "", {font: "17px Arial", fill: "#000", backgroundColor: "#FDEEED"})
        .setOrigin(1,0)
        .setVisible(false)
        .setDepth(2000);
    text_heart_click = 0;
    text_heart = scene.add.text(975, 15, "***", {font: "17px Arial", fill: "#000", backgroundColor: "#FDEEED"})
        .setDepth(2000)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => {
            text_fluffy.setVisible(true)
            text_heart_click += 1;
            let _text_heart_click_now = text_heart_click;
            setTimeout( () => {
                if (_text_heart_click_now == text_heart_click) {
                    text_fluffy.setVisible(false);
                }
            }, 2000);
        });
    group_info.add(icon_heart);
    group_info.add(text_heart);

    //### tx status
    _x = 240;
    _y = 955
    icon_tx = scene.add.sprite(_x, _y, "coin_color_ASTR")
        .setOrigin(0,1)
        .setScale(0.08)
        .setDepth(2000);
    text_tx = scene.add.text(_x+20, _y, "", {font: "14px Arial", fill: "#303030"})
        .setOrigin(0,1)
        .setDepth(2000);
    group_tx = scene.add.group();
    group_tx.add(icon_tx);
    group_tx.add(text_tx);
    group_tx.setVisible(false);


    //---group_kanban


    _x = 85;
    _y = 100;
    item_kanban = scene.add.sprite(85, 100, "item_kanban")
        .setScale(0.4);
    text_kanban = scene.add.text(_x+2, _y+17, "", {font: "17px Arial", fill: "#000000"})
        .setOrigin(0.5)
	    .setInteractive({useHandCursor: true})
	    //.on('pointerdown', () => {scene.rexUI.edit(text_kanban);}, scene)
	    .on('pointerdown', () => {game.scene.scenes[1].rexUI.edit(text_kanban);}, scene)
        .setDepth(3301);
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
    //group_info.add(text_id);
    //group_info.add(text_age_time);

    //lootlike
    let _dic_color_class = {
        "Rose":"#E60012",
        "Marigold":"#F39800",
        "Dandelion":"#FFF100",
        "Rosemary":"#8FC31F",
        "Olive":"#009944",
        "Holly":"#009E96",
        "Nemophila":"#00A0E9",
        "Hydrangea":"#0068B7",
        "Forget-me-not":"#1D2088",
        "Sumire":"#920783",
        "Gerbera":"#E4007F",
        "Anemone":"#E5004F",
    };
    let _dic_color_birthplace = {
        "Fluffy Wweater":"#EB6100",
        "Fluffy Blanket":"#F39800",
        "Fluffy Carpet":"#FCC800",
        "Fluffy Cushion":"#FFF100",
        "Fluffy Scarf":"#CFDB00",
        "Fluffy Sofa":"#22AC38",
    };
    let _dic_color_personality = {
        "Friendly":"#EB6100",
        "Reliable":"#F39800",
        "Frisky":"#FCC800",
        "Thoughtful":"#FFF100",
        "Easygoing":"#CFDB00",
        "Tolerant":"#8FC31F",
        "Affectionate":"#22AC38",
        "Intelligent":"#009944",
        "Faithful":"#009B6B",
        "Innocent":"#009E96",
        "Gentle":"#00A0C1",
        "Cheerful":"#00A0E9",
    };
    let _dic_color_character = {
        "Diligent":"#EB6100",
        "Optimist":"#F39800",
        "Realist":"#FCC800",
        "Ethical":"#FFF100",
        "Sensitive":"#CFDB00",
        "Adventurous":"#8FC31F",
        "Compassionate":"#22AC38",
        "Empathetic":"#009944",
        "Patient":"#009B6B",
        "Courageous":"#009E96",
        "Honest":"#00A0C1",
    };
    let _dic_color_weakpoint = {
        "a bit Moody":"#EB6100",
        "a bit Lonely":"#F39800",
        "a bit Sleeper":"#FCC800",
        "a bit Nervous":"#FFF100",
        "a bit Competitive":"#CFDB00",
        "a bit Obstinate":"#8FC31F",
        "a bit Forgetful":"#22AC38",
        "a bit Perfectionist":"#009944",
        "a bit Shy":"#009B6B",
        "a bit Tomboy":"#009E96",
    };
    let _dic_color_scent = {
        "Floral":"#EB6100",
        "Refreshing":"#F39800",
        "Gentle":"#FCC800",
        "Mild":"#FFF100",
        "Fruity":"#CFDB00",
        "Sunshine":"#8FC31F",
        "Sweet":"#22AC38",
        "Soft":"#009944",
        "Exotic":"#009B6B",
    };
    let _text_lootlike_base = "";
    _text_lootlike_base += " Flower:                                 \n";
    _text_lootlike_base += " Birthplace:                             \n";
    _text_lootlike_base += " Personality:                            \n";
    _text_lootlike_base += " Character:                              \n";
    _text_lootlike_base += " Weakpoint:                              ";
    //_text_lootlike_base += " Scent:                                  ";
    let _text_lootlike_class =          "                       " + local_flower;
    let _text_lootlike_birthplace =     "\n                       " + local_birthplace;
    let _text_lootlike_personality =       "\n\n                       " + local_personality;
    let _text_lootlike_character =     "\n\n\n                       " + local_character;
    let _text_lootlike_weakpoint =     "\n\n\n\n                       " + local_weakpoint;
    //let _text_lootlike_scent =    "\n\n\n\n\n                       " + local_scent;
    let text_lootlike_base = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_base, 
        {font: "18px Arial", fill: "#000000", backgroundColor: "#ffffff"}
    );
    let text_lootlike_class = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_class, 
        {font: "18px Arial", fill: _dic_color_class[local_flower]}
    );
    let text_lootlike_birthplace = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_birthplace, 
        {font: "18px Arial", fill: _dic_color_birthplace[local_birthplace]}
    );
    let text_lootlike_personality = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_personality, 
        {font: "18px Arial", fill: _dic_color_personality[local_personality]}
    );
    let text_lootlike_character = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_character, 
        {font: "18px Arial", fill: _dic_color_character[local_character]}
    );
    let text_lootlike_weakpoint = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_weakpoint, 
        {font: "18px Arial", fill: _dic_color_weakpoint[local_weakpoint]}
    );
    /*
    let text_lootlike_scent = scene.add.text(
        _x-70, 
        _y+60, 
        _text_lootlike_scent, 
        {font: "18px Arial", fill: _dic_color_scent[local_scent]}
    );
    */
    group_lootlike = scene.add.group();
    group_lootlike.add(text_lootlike_base);
    group_lootlike.add(text_lootlike_class);
    group_lootlike.add(text_lootlike_birthplace);
    group_lootlike.add(text_lootlike_personality);
    group_lootlike.add(text_lootlike_character);
    group_lootlike.add(text_lootlike_weakpoint);
    //group_lootlike.add(text_lootlike_scent);
    group_lootlike.setVisible(false);
    group_lootlike.setDepth(2000);
    item_kanban_click = 0;
    item_kanban.setInteractive({useHandCursor: true})
        .on("pointerdown", () => {
            item_kanban_click += 1;
            let item_kanban_click_now = item_kanban_click;
            group_lootlike.setVisible(true);
            setTimeout( () => {
                if (item_kanban_click == item_kanban_click_now) {
                    group_lootlike.setVisible(false);
                }
            }, 5000)
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
        update_mining_perDay(summoner);
    } else if (local_farming_status == 1) {
        murasakisan = new Murasakisan(scene, 180, 450)
            .setOrigin(0.5)
            .setScale(0.45);
        murasakisan.set_mode = "farming";
        murasakisan.submode = 2;
        murasakisan.count = 0;
        murasakisan.target_x = 180;
        murasakisan.target_y = 455;
        update_farming_perDay(summoner);
    } else if (local_crafting_status == 1) {
        murasakisan = new Murasakisan(scene, 950, 740)
            .setOrigin(0.5)
            .setScale(0.45);
        murasakisan.set_mode = "crafting";
        murasakisan.submode = 2;
        murasakisan.count = 0;
        murasakisan.target_x = 950;
        murasakisan.target_y = 740;
        //item indicator
        create_item_indicator(scene, local_crafting_item_type);
    } else if (local_practice_status == 1) {
        murasakisan = new Murasakisan(scene, 640, 640)
            .setOrigin(0.5)
            .setScale(0.45);
        murasakisan.set_mode = "practice";
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 650;
        murasakisan.target_y = 650;
    } else if (local_strolling_status == 1) {
        murasakisan = new Murasakisan(scene, -150, 900)
            .setOrigin(0.5)
            .setScale(0.45);
        murasakisan.set_mode = "strolling_start";
        murasakisan.submode = 7;
        murasakisan.count = 0;
        open_window_strollingDuring(scene, local_direction);
    } else {
        murasakisan = new Murasakisan(scene, 500 + Math.random()*200, 640 + Math.random()*100)
            .setOrigin(0.5)
            .setScale(0.45);
    }
    group_update.add(murasakisan);
    scene_main = murasakisan.scene; //forDebug


    //---pointer


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
        );
        draw_star(scene, pointer_x, pointer_y);
    });


    //---nyuinyui


    if (local_level >= 3 && wallet == local_owner) {
        nyuinyui = new Nyuinyui(scene, 800, 850, "nyui_moving")
            .setOrigin(0.5)
            .setScale(0.25)
            .setAlpha(0.8)
            .setDepth(5000+2)
            .setVisible(false);
        group_update.add(nyuinyui);
    }
    
        
    //---firstCelebration


    if (flag_firstCelebration==1 & gamemode=="regular"){
        firstCelebration(scene);
        localStorage.setItem("flag_firstCelebration", 0);
    }
    

    //---trial


    if (gamemode == "trial") {
        summon_trial(scene);

    
        //### beginingBox


        function put_beginingBox(_mode) {
            let _localStorage_name;
            let _x;
            let _y;
            let _button;
            let _beginingBox;
            let _beginingBox_text;
            let _item;
            let _click_text;

            if (_mode == "feeding") {
                _x = 600;
                _y = 870;
                _localStorage_name = "flag_beginingBox_feeding_";
                _button = button_feeding;
                _item = item_table;
                _click_text = ">> Click to Open <<\n   Start Feeding!";
            } else if (_mode == "grooming") {
                _x = 1000;
                _y = 520;
                _localStorage_name = "flag_beginingBox_grooming_";
                _button = button_grooming;
                _item = item_bear;
                _click_text = ">> Click to Open <<\n   Start Grooming!";
            } else if (_mode == "mining") {
                _x = 100;
                _y = 850;
                _localStorage_name = "flag_beginingBox_mining_";
                _button = button_mining;
                _item = item_back_sandbox;
                _click_text = "Required Lv:2";
            } else if (_mode == "farming") {
                _x = 110;
                _y = 500;
                _localStorage_name = "flag_beginingBox_farming_";
                _button = button_farming;
                _item = item_tree0;
                _click_text = "Required Lv:2";
            } else if (_mode == "crafting") {
                _x = 930;
                _y = 850;
                _localStorage_name = "flag_beginingBox_crafting_";
                _button = button_crafting_unable;
                _item = item_misin;
                _click_text = "Required Lv:3";
            }

            if (
                localStorage.getItem(_localStorage_name + summoner) == null
                && murasakisan.mode != _mode
            ) {
                _item.visible = false;
                _button.visible = false;
                if (_mode == "crafting"){
                    text_select_item.visible = false;
                }
                _beginingBox = scene.add.sprite(_x, _y, "item_box")
                    .setOrigin(0.5)
                    .setDepth(2)
                    .setScale(0.12)
                    .on("pointerdown", () => {
                        if (summoner==0) {
                            return 0;
                        }
                        _beginingBox_text.destroy();
                        _beginingBox.disableInteractive();
                        let _bar_back = makeMiniProgressBar(
                            scene,_x-20-2, _y-2, 40+4, 10+4, 0xecd9ff);
                        let _bar = makeMiniProgressBar(
                            scene, _x-20, _y, 40, 10, 0xb872f4);
                        _bar.scaleX = 0;
                        function _do() {
                            _bar.scaleX += 0.005;
                            if (_bar.scaleX <1) {
                                setTimeout( () => {
                                    _do();
                                }, 10);
                            } else {
                                sound_hat.play();
                                draw_flower3(scene, _x, _y-20);
                                _item.visible = true;
                                _beginingBox.destroy();
                                murasakisan.on_click();
                                _button.visible = true;
                                _bar_back.destroy();
                                _bar.destroy();
                                if (_mode == "crafting"){
                                    text_select_item.visible = true;
                                }
                                localStorage.setItem(_localStorage_name + summoner, "1");
                            }
                        }
                        _do();
                    });
                _beginingBox_text = scene.add.text(
                    _x, _y+30,
                    _click_text,
                    {font: "Bold 17px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
                ).setDepth(3).setOrigin(0.5);

                if (_mode == "feeding") {
                    _beginingBox.setInteractive({useHandCursor: true})
                    beginingBox_feeding = _beginingBox;
                    beginingBox_feeding_text = _beginingBox_text;
                } else if (_mode == "grooming") {
                    _beginingBox.setInteractive({useHandCursor: true})
                    beginingBox_grooming = _beginingBox;
                    beginingBox_grooming_text = _beginingBox_text;
                } else if (_mode == "mining") {
                    beginingBox_mining = _beginingBox;
                    beginingBox_mining_text = _beginingBox_text;
                } else if (_mode == "farming") {
                    beginingBox_farming = _beginingBox;
                    beginingBox_farming_text = _beginingBox_text;
                } else if (_mode == "crafting") {
                    beginingBox_crafting = _beginingBox;
                    beginingBox_crafting_text = _beginingBox_text;
                }
            }
        }
        
        put_beginingBox("feeding");
        put_beginingBox("grooming");
        put_beginingBox("mining");
        put_beginingBox("farming");
        put_beginingBox("crafting");

        /*
        //beginingBox: feeding
        if (localStorage.getItem("flag_beginingBox_feeding_"+summoner) == null) {
            item_table.visible = false;
            button_feeding.visible = false;
            beginingBox_feeding = scene.add.sprite(600, 870, "item_box")
                .setOrigin(0.5)
                .setDepth(2)
                .setScale(0.12)
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => {
                    if (summoner==0) {
                        return 0;
                    }
                    beginingBox_feeding_text.destroy();
                    beginingBox_feeding.disableInteractive();
                    let _bar_back = makeMiniProgressBar(scene, 600-20-2, 870-2, 40+4, 10+4, 0xecd9ff);
                    let _bar = makeMiniProgressBar(scene, 600-20, 870, 40, 10, 0xb872f4);
                    _bar.scaleX = 0;
                    function _do() {
                        _bar.scaleX += 0.01;
                        if (_bar.scaleX <1) {
                            setTimeout( () => {
                                _do();
                            }, 20);
                        } else {
                            sound_hat.play();
                            draw_flower3(scene, 600, 850);
                            item_table.visible = true;
                            beginingBox_feeding.destroy();
                            murasakisan.on_click();
                            button_feeding.visible = true;
                            _bar_back.destroy();
                            _bar.destroy();
                            //localStorage.setItem("flag_beginingBox_feeding_"+summoner, "1");
                        }
                    }
                    _do();
                });
            beginingBox_feeding_text = scene.add.text(
                600, 870+30,
                ">> Click to Open <<\n   Start Feeding!",
                {font: "Bold 17px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
            ).setDepth(3).setOrigin(0.5);
        }
        */

        /*
        if (localStorage.getItem("flag_beginingBox_feeding_"+summoner) == null) {
            item_table.visible = false;
            button_feeding.visible = false;
            beginingBox_feeding = scene.add.sprite(600, 870, "item_box")
                .setOrigin(0.5)
                .setDepth(2)
                .setScale(0.12)
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => {
                    if (summoner==0) {
                        return 0;
                    }
                    sound_hat.play();
                    draw_flower3(scene, 600, 850);
                    item_table.visible = true;
                    beginingBox_feeding.destroy();
                    murasakisan.on_click();
                    beginingBox_feeding_text.destroy();
                    button_feeding.visible = true;
                    localStorage.setItem("flag_beginingBox_feeding_"+summoner, "1");
                });
            beginingBox_feeding_text = scene.add.text(
                600, 870+30,
                ">> Click to Open <<\n   Start Feeding!",
                {font: "Bold 17px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
            ).setDepth(3).setOrigin(0.5);
        }
        */

        /*
        //beginingBox: grooming
        if (localStorage.getItem("flag_beginingBox_grooming_"+summoner) == null) {
            item_bear.visible = false;
            button_grooming.visible = false;
            beginingBox_grooming = scene.add.sprite(1000, 520, "item_box")
                .setOrigin(0.5)
                .setDepth(2)
                .setScale(0.12)
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => {
                    if (summoner==0) {
                        return 0;
                    }
                    sound_hat.play();
                    draw_flower3(scene, 1020, 400);
                    item_bear.visible = true;
                    beginingBox_grooming.destroy();
                    murasakisan.on_click();
                    beginingBox_grooming_text.destroy();
                    button_grooming.visible = true;
                    localStorage.setItem("flag_beginingBox_grooming_"+summoner, "1");
                });
            beginingBox_grooming_text = scene.add.text(
                1000, 520+30,
                ">> Click to Open <<\n   Start Grooming!",
                {font: "Bold 17px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
            ).setDepth(3).setOrigin(0.5);
        }

        //beginingBox: mining
        if (localStorage.getItem("flag_beginingBox_mining_"+summoner) == null) {
            item_back_sandbox.visible = false;
            button_mining.visible = false;
            beginingBox_mining = scene.add.sprite(100, 850, "item_box")
                .setOrigin(0.5)
                .setDepth(2)
                .setScale(0.12)
                //.setInteractive({useHandCursor: true})
                .on("pointerdown", () => {
                    sound_hat.play();
                    draw_flower3(scene, 90, 900);
                    item_back_sandbox.visible = true;
                    beginingBox_mining.destroy();
                    murasakisan.on_click();
                    beginingBox_mining_text.destroy();
                    button_mining.visible = true;
                    localStorage.setItem("flag_beginingBox_mining_"+summoner, "1");
                })
                //.on("pointerover", () => {beginingBox_mining_text.visible=true})
                //.on("pointerout", () => {beginingBox_mining_text.visible=false});
            beginingBox_mining_text = scene.add.text(
                100, 850+30,
                "Required Lv:2",
                {font: "Bold 17px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
            ).setDepth(3).setOrigin(0.5);//.setVisible(false);
        }

        //beginingBox: farming
        if (localStorage.getItem("flag_beginingBox_farming_"+summoner) == null) {
            item_tree0.visible = false;
            button_farming.visible = false;
            beginingBox_farming = scene.add.sprite(110, 550, "item_box")
                .setOrigin(0.5)
                .setDepth(2)
                .setScale(0.12)
                //.setInteractive({useHandCursor: true})
                .on("pointerdown", () => {
                    sound_hat.play();
                    draw_flower3(scene, 110, 500);
                    item_tree0.visible = true;
                    beginingBox_farming.destroy();
                    murasakisan.on_click();
                    beginingBox_farming_text.destroy();
                    button_farming.visible = true;
                    localStorage.setItem("flag_beginingBox_farming_"+summoner, "1");
                });
            beginingBox_farming_text = scene.add.text(
                110, 550+30,
                "Required Lv:2",
                {font: "Bold 17px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
            ).setDepth(3).setOrigin(0.5);
        }
        */

        /*
        //beginingBox: crafting
        if (localStorage.getItem("flag_beginingBox_crafting_"+summoner) == null) {
            item_misin.visible = false;
            button_crafting_unable.visible = false;
            text_select_item.visible = false;
            beginingBox_crafting = scene.add.sprite(930, 850, "item_box")
                .setOrigin(0.5)
                .setDepth(2)
                .setScale(0.12)
                //.setInteractive({useHandCursor: true})
                .on("pointerdown", () => {
                    sound_hat.play();
                    draw_flower3(scene, 930, 800);
                    item_misin.visible = true;
                    beginingBox_crafting.destroy();
                    murasakisan.on_click();
                    beginingBox_crafting_text.destroy();
                    button_crafting_unable.visible = true;
                    text_select_item.visible = true;
                    localStorage.setItem("flag_beginingBox_crafting_"+summoner, "1");
                });
            beginingBox_crafting_text = scene.add.text(
                930, 850+30,
                "Required Lv:3",
                {font: "Bold 17px Arial", fill: "#0000ff", backgroundColor: "#E3E3E3"}
            ).setDepth(3).setOrigin(0.5);
        }
        */
        
        //before summon, invisible
        if (summoner==0){
            beginingBox_feeding.visible = false;
            beginingBox_grooming.visible = false;
            beginingBox_mining.visible = false;
            beginingBox_farming.visible = false;
            beginingBox_crafting.visible = false;
            beginingBox_feeding_text.visible = false;
            beginingBox_grooming_text.visible = false;
            beginingBox_mining_text.visible = false;
            beginingBox_farming_text.visible = false;
            beginingBox_crafting_text.visible = false;
        }
    }
    
    //---twinkles
    function get_subtypeList_from_local_myListsAt_withItemTypeAndSubtype(_item_type_target){
        let _res = [];
        for (let i=0; i<local_myListsAt_withItemTypeAndSubtype.length; i+=3){
            let _item_type = local_myListsAt_withItemTypeAndSubtype[i+1];
            let _item_subtype = local_myListsAt_withItemTypeAndSubtype[i+2];
            if (_item_type == _item_type_target){
                _res.push(_item_subtype);
            }
        }
        return _res;
    }
    if (gamemode != "trial") {
        let _count_twinkle = 0;
        for (let i=251; i<=255; i++) {
            if (local_items[i] > 0) {
                let _subtypes = get_subtypeList_from_local_myListsAt_withItemTypeAndSubtype(i);
                for (let j=0; j<_subtypes.length; j++){
                    let _subtype = _subtypes[j];
                    summon_twinkles(scene, "twinkle", _subtype, 150+_count_twinkle*20, 560);
                    _count_twinkle += 1;
                }
            }
        }
        for (let i=256; i<=260; i++) {
            if (local_items[i] > 0) {
                let _subtypes = get_subtypeList_from_local_myListsAt_withItemTypeAndSubtype(i);
                for (let j=0; j<_subtypes.length; j++){
                    let _subtype = _subtypes[j];
                    summon_twinkles(scene, "sparkle", _subtype, 150+_count_twinkle*20, 560);
                    _count_twinkle += 1;
                }
            }
        }
        for (let i=261; i<=265; i++) {
            if (local_items[i] > 0) {
                let _subtypes = get_subtypeList_from_local_myListsAt_withItemTypeAndSubtype(i);
                for (let j=0; j<_subtypes.length; j++){
                    let _subtype = _subtypes[j];
                    summon_twinkles(scene, "glitter", _subtype, 150+_count_twinkle*20, 560);
                    _count_twinkle += 1;
                }
            }
        }
        //***TODO*** test
        //summon_twinkles(scene, "twinkle", 1, 200 + Math.random() * 800, 520 + Math.random() * 200);
        //summon_twinkles(scene, "glitter", 1, 200 + Math.random() * 800, 520 + Math.random() * 200);
        //summon_twinkles(scene, "glitter", 1, 150+2*20, 560);
    }
    
    //---pippel
    pippel_basic = scene.add.sprite(200, 600, "pippel_basic")
        .setOrigin(0.5)
        .setScale(0.25)
        .setDepth(3000)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => {
            sound_button_select.play();
            contract_mint_pippel(summoner);
        });
    
    //---twitter
    /*
    // 画像をBase64形式に変換    
    function imageToBase64(imageData) {
        const canvas = document.createElement('canvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    }
    twitterButton = scene.add.text(640, 100, "Post", {
        fontSize: "36px",
        fill: "#000"
    }).setDepth(9999).setInteractive({useHandCursor: true});
    twitterButton.on("pointerdown", () => {
        game.renderer.snapshot( function(camera) {
            const base64Image = imageToBase64(camera);
            const tweetText = 'https://murasaki-san.com/';
            const hashtags = 'Astar,HoM';
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=${encodeURIComponent(hashtags)}&url=${encodeURIComponent(base64Image)}`, '_blank');
        });
    });
    */
}


//===phaser3:update=============================================================================


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
    if (summoner == 0) {
        text_system_message.setText(" --- You have not summoned Murasaki-san yet --- ");
        text_summon.visible = true;
        murasakisan.visible = false;
    } else if (local_isActive == false) {
        text_system_message.setText(" --- This Murasaki-san is not Available --- ");
    } else if (local_notPetrified == 0) {
        text_system_message.setText(" --- This Murasaki-san has been Petrified --- ");
        text_curePetrification.visible = true;
    } else {
        text_system_message.setText("");
        text_summon.visible = false;
        text_curePetrification.visible = false;
        murasakisan.visible = true;
    }
}


//---sync time


function update_syncTime(this_scene) {
    if (last_sync_time == 0) {
        text_sync_time.setText("##");
        text_sync_time.setColor("#ff0000");
    } else {
        let _delta = Math.round( (Date.now() - last_sync_time) / 1000 );
        if (_delta > 99) {
            _delta = 99;
        }
        text_sync_time.setText(("00" + _delta).slice(-2));
        if (_delta >= 30) {
            text_sync_time.setColor("#ff0000");
        } else {
            text_sync_time.setColor("#727171");
        }
        if (_delta > 300) {
            scene.scene.start("SomethingWrong");
        }
    }
}



//---numeric animation


function update_numericAnimation(this_scene) {

    //### coin
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

    //### material
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

    //### exp
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
                screen_exp = local_next_exp_required;
            } else {
                text_exp.setText(local_exp + " / " + local_next_exp_required);
                screen_exp = local_exp;
            }
            //bar
            let _bar_exp = local_exp / local_next_exp_required * 100;
            if (_bar_exp > 100) {_bar_exp = 100;}
            bar_exp.scaleX = _bar_exp / 100;
            screen_exp_delta = 0;
        }
    }
    
    //### satiety
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

    //### happy
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
}


//---param with animation
function update_parametersWithAnimation(this_scene) {

    //### coin
    if (previous_local_coin != local_coin) {
        //count animation
        screen_coin = previous_local_coin;
        screen_coin_delta = local_coin - previous_local_coin;
        screen_coin_easing = 100;
        //earning text
        if (count_sync > 3) {
            let _delta = local_coin - previous_local_coin;
            let _sign = "";
            if (_delta > 0) {
                _sign = "+";
            }
            //if (_delta >= local_coin_calc * 1.5) {
            //if (local_luck_challenge_of_mfmf && _sign == "+") {
            if (_delta >= last_local_coin_calc * 1.8 && last_local_coin_calc > 0) {
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

    //### material
    if (previous_local_material != local_material) {
        //count animation
        screen_material = previous_local_material;
        screen_material_delta = local_material - previous_local_material;
        screen_material_easing = 100;
        //earning text
        if (count_sync > 3) {
            let _delta = local_material - previous_local_material;
            let _sign = ""; //no need when minus
            if (_delta > 0) {
                _sign = "+";
            }
            //if (_delta >= local_material_calc * 1.5) {
            //if (local_luck_challenge_of_mfmf && _sign == "+") {
            if (_delta >= last_local_material_calc * 1.8 && last_local_material_calc > 0) {
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

    //### exp
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
        if (count_sync > 3) {
            let _delta = local_exp - previous_local_exp;
            let _sign = ""; //no need when minus
            if (_delta > 0) {
                _sign = "+";
            }
            //calc logical exp_add
            let _logical_addition = 0;
            if (local_satiety > previous_satiety) {
                _logical_addition += last_local_calc_feeding;
            }
            if (local_happy > previous_happy) {
                _logical_addition += last_local_calc_grooming;
            }
            //calc boost (wallet, twinkle, nui)
            _logical_addition += _logical_addition * local_achv_onChain_score / 100; //wallet
            _logical_addition += _logical_addition * local_exp_rate_twinkle / 100; //twinkle
            _logical_addition += _logical_addition * active_nui_exp_rate / 100; //nui
            //judge critical
            if (_logical_addition + 100 < _delta) {
                text_exp_earned.setText(_sign + _delta + " lucky♪");
                text_exp_earned.setColor("#0000ff");
            } else {
                text_exp_earned.setText(_sign + _delta);
                text_exp_earned.setColor("#000000");
            }
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

    //### satiety
    satiety = local_satiety;
    if (satiety < 0) { satiety = 0; }
    if (satiety > 100) { satiety = 100; }
    if (satiety != previous_satiety) {
        screen_satiety = previous_satiety;
        screen_satiety_delta = satiety - previous_satiety;
        screen_satiety_easing = 100;
    }

    //### happy
    happy = local_happy;
    if (happy < 0) { happy = 0; }
    if (happy > 100) { happy = 100; }
    if (happy != previous_happy) {
        screen_happy = previous_happy;
        screen_happy_delta = happy - previous_happy;
        screen_happy_easing = 100;
    }
    
    //### end
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

    //### age
    let age = Math.round( local_age * SPEED / 86400 );
    text_age_time.setText(("0000" + age).slice(-4) + "d");

    //### level
    if (button_levelup.texture.key != "button_levelup_pointerover") {
        text_level.setText(local_level);
    }

    //### heart
    text_heart.setText("Fluffy: " + local_precious);

    //### progression status
    //update progression status
    //let _mode = murasakisan.mode;
    let _mode;
    if (local_mining_status == 1) {
        _mode = "mining";
    } else if (local_farming_status == 1) {
        _mode = "farming";
    } else if (local_crafting_status == 1) {
        _mode = "crafting";
    }
    
    //### mining
    if (_mode == "mining") {
        if (flag_info == 1) {
            icon_mining.visible = true;
        }
        /*
        let _delta = (now_time - local_mining_start_time) * SPEED;
        let _daily_earn = local_coin_calc / _delta * 86400;
        text_mining_calc.setText(" +" + local_coin_calc + " Coin\n  (" + Math.round(_daily_earn/10)*10 + " /d)");
        */
        text_mining_calc.setText(" +" + local_coin_calc + " Coin\n  (" + local_mining_perDay + " /day)");
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
    
    //### farming
    } else if (_mode == "farming") {
        if (flag_info == 1) {
            icon_farming.visible = true;
        }
        /*
        let _delta = (now_time - local_farming_start_time) * SPEED;
        let _daily_earn = local_material_calc / _delta * 86400;
        text_farming_calc.setText(" +" + local_material_calc + " Leaf\n  (" + Math.round(_daily_earn/10)*10 + " /d)");
        */
        text_farming_calc.setText(" +" + local_material_calc + " Leaf\n  (" + local_farming_perDay + " /day)");
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
    
    //### crafting
    } else if (_mode == "crafting") {
        if (flag_info == 1) {
            icon_crafting_time_remining.visible = true;
            text_crafting_calc.visible = true;
        }
        text_crafting_selected_item_ohana.setText("");
        text_crafting_selected_item_kusa.setText("");
        text_crafting_selected_item_time.setText("");
        text_crafting_selected_item_heart.setText("");
        icon_crafting_ohana.visible = false;
        icon_crafting_kusa.visible = false;
        icon_crafting_time.visible = false;
        text_select_item.setText('"'+dic_items_reverse[local_crafting_item_type]+'"');
        //icon_crafting_heart.visible = false;
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
            //text_select_item.setText('"'+dic_items_reverse[local_crafting_item_type]+'"');
        }
    //when having resume
    }else if (button_crafting_resume.visible == true && flag_info == 1) {
        text_select_item.setText('"'+dic_items_reverse[local_crafting_resume_item_type]+'"');
        icon_crafting_time_remining.visible = true;
        let _total_sec = local_crafting_calc;
        let _day = Math.floor(_total_sec / 86400);
        let _hr = Math.floor(_total_sec % 86400 / 3600);
        let _min = Math.floor(_total_sec % 3600 / 60);
        text_crafting_calc.visible = true;
        text_crafting_calc
            .setText(_day + "d:" + _hr + "h:" + _min + "m")
            .setFill("#0000FF");
    }else {
        text_mining_calc.setText("");
        text_farming_calc.setText("");
        text_crafting_calc.setText("");
    }

    //### reset progression status
    if (local_mining_status != 1) {
        icon_mining.visible = false;
        item_gold1.visible = false;
        item_gold2.visible = false;
        item_gold3.visible = false;
    }
    if (
        local_farming_status != 1 
        && (typeof beginingBox_farming == "undefined" || typeof beginingBox_farming.scene == "undefined")
    ) {
        icon_farming.visible = false;
        item_tree0.visible = true;
        item_tree1.visible = false;
        item_tree2.visible = false;
        item_tree3.visible = false;
    }
    if (local_crafting_status != 1 && local_crafting_resume_flag != 1) {
        icon_crafting_time_remining.visible = false;
    }
    
    //### wallet text
    let _owner1 = local_owner.substring(0,5);
    let _owner2 = local_owner.slice(-4);
    let _text = "";
    if (local_owner == local_wallet || local_owner == "0x0000000000000000000000000000000000000000") {
        if (gamemode == "regular") {
            _text += "House #" + summoner + ", ";
        } else if (gamemode == "trial") {
            _text += "House #" + summoner + " (Trial), ";
        }
        _text += _owner1 + "..." + _owner2 + ", ";
        _text += local_street + ", " + local_city + ", ";
        //_text += "Astar EVM, United Parachains of Polkadot, WEB3.";
        _text += "Astar Substrate EVM, Polkadot, Web3." + " (" + local_house_price + " $ASTR)";
        text_wallet.setText(_text);
        if (gamemode == "regular") {
            text_wallet.setColor("#FF4264");
        } else if (gamemode == "trial") {
            text_wallet.setColor("green");
        }
    } else {
        _text += "House #" + summoner + ", ";
        _text += _owner1 + "..." + _owner2 + ", ";
        _text += local_street + ", " + local_city + ", ";
        //_text += "Astar EVM, United Parachains of Polkadot, WEB3.";
        _text += "Astar Substrate EVM, Polkadot, Web3." + " (" + local_house_price + " $ASTR)";
        _text += " (not owner)";
        text_wallet.setText(_text);
        text_wallet.setColor("blue");
    }
    
    //### radarchart
    if (previous_local_rolled_dice != local_rolled_dice && flag_radarchart == 1) {
        draw_radarchart(this_scene);
    }

    //### end    
    previous_local_rolled_dice = local_rolled_dice;
    previous_local_precious = local_precious;
}


//---mode
function update_checkModeChange(this_scene) {
    //check petrified
    if (local_notPetrified == 0) {
        murasakisan.set_mode = "petrified";

    //### level up
    } else if (local_level > previous_local_level) {
        //fireworks
        /*
        if (previous_local_level > 0) {
            draw_firework(this_scene);
            murasakisan.on_click();
            //summon_star(this_scene);
        }
        */
        if (count_sync >= 3 && local_level == 1) {
            draw_firework(this_scene);
            murasakisan.on_click();
            summon_sentence(this_scene, "welcome aboard!");
            draw_flower3(this_scene, murasakisan.x, murasakisan.y);
        } else if (count_sync >= 3 && local_level >= 2) {
            draw_firework(this_scene);
            murasakisan.on_click();
            summon_sentence(this_scene, "level up! congrats!");
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
        /*
        if (local_level == 3) {
            //enable crafting button
            //button_crafting.setTexture("button_crafting_enable");
            button_crafting.setTexture("button_crafting_start_off");
            button_crafting.on('pointerover', () => button_crafting.setTexture("button_crafting_start_on"));
            button_crafting.on('pointerout', () => button_crafting.setTexture("button_crafting_start_off"));
            button_crafting.setInteractive();
        }
        */

    //### feeding check
    } else if (local_last_feeding_time > previous_local_last_feeding_time){
        murasakisan.set_mode = "feeding";
        murasakisan.setScale(0.45);
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 600;
        murasakisan.target_y = 820;
        if (typeof group_food != "undefined") {
            group_food.destroy(true);
        }
        group_food = this_scene.add.group();
        item_potato = this_scene.add.sprite(600, 840+10, "item_food_potato").setScale(0.12).setOrigin(0.5);
        item_potato.depth = 840+10;
        group_food.add(item_potato);
        
        {
            //Choco Bread
            let _item_type = dic_items["Choco Bread"]["item_id"];
            if (local_items[_item_type] > 0 || local_items[_item_type+64] > 0 || local_items[_item_type+128] > 0) {
                item_pancake = this_scene.add.sprite(600+35, 840+10, "item_food_bread").setScale(0.2).setOrigin(0.5);
                item_pancake.depth = 840+10;
                group_food.add(item_pancake);
            }
        }
        {
            //Onigiri
            let _item_type = dic_items["Onigiri"]["item_id"];
            if (local_items[_item_type] > 0 || local_items[_item_type+64] > 0 || local_items[_item_type+128] > 0) {
                item_pancake = this_scene.add.sprite(600-35, 840+10, "item_food_onigiri").setScale(0.1).setOrigin(0.5);
                item_pancake.depth = 840+10;
                group_food.add(item_pancake);
            }
        }
        {
            //Pancake
            let _item_type = dic_items["Pancake"]["item_id"];
            if (local_items[_item_type] > 0 || local_items[_item_type+64] > 0 || local_items[_item_type+128] > 0) {
                item_pancake = this_scene.add.sprite(600-25, 840-18, "item_food_pancake").setScale(0.2).setOrigin(0.5);
                item_pancake.depth = 840-18;
                group_food.add(item_pancake);
            }
        }
        {
            //Cake
            let _item_type = dic_items["Cake"]["item_id"];
            if (local_items[_item_type] > 0 || local_items[_item_type+64] > 0 || local_items[_item_type+128] > 0) {
                item_pancake = this_scene.add.sprite(600+25, 840-18, "item_food_cake").setScale(0.15).setOrigin(0.5);
                item_pancake.depth = 840-18;
                group_food.add(item_pancake);
            }
        }
        setTimeout( () => {
            group_food.destroy(true);
        }, 30000);
        
        sound_feeding.play();

    //### grooming check
    } else if (local_last_grooming_time > previous_local_last_grooming_time){
        murasakisan.set_mode = "grooming";
        murasakisan.setScale(0.45);
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 1000;
        //murasakisan.target_y = 400;
        murasakisan.target_y = 450;
        sound_grooming.play();

    //### mining check
    } else if (
        local_mining_status == 1 
        && murasakisan.mode != "mining" 
        && murasakisan.mode != "feeding"
        && murasakisan.mode != "grooming"
        && murasakisan.mode != "sleeping"
        && murasakisan.mode != "hammock"
        && murasakisan.exemption_resting_count <= 0
        && local_happy > 0
    ){
        murasakisan.set_mode = "mining";
        murasakisan.setScale(0.45);
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 100;
        murasakisan.target_y = 880;
        sound_mining.play();
        update_mining_perDay(summoner);
    }else if (
        local_mining_status == 0 
        && murasakisan.mode == "mining"
    ) {
        murasakisan.set_mode = "hugging";
        //icon invisible
        icon_mining.visible = false;
        sound_earn.play();
        local_coin_calc = 0;

    //### farming check
    } else if (
        local_farming_status == 1 
        && murasakisan.mode != "farming" 
        && murasakisan.mode != "feeding"
        && murasakisan.mode != "grooming"
        && murasakisan.mode != "sleeping"
        && murasakisan.mode != "hammock"
        && murasakisan.exemption_resting_count <= 0
        && local_happy > 0
    ){
        murasakisan.set_mode = "farming";
        murasakisan.setScale(0.45);
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 180;
        murasakisan.target_y = 455;
        sound_farming.play();
        update_farming_perDay(summoner);
    } else if (
        local_farming_status == 0 
        && murasakisan.mode == "farming"
    ) {
        murasakisan.set_mode = "hugging";
        //icon invisible
        icon_farming.visible = false;
        sound_earn.play();
        local_material_calc = 0;

    //### crafting check
    } else if (
        local_crafting_status == 1 
        && murasakisan.mode != "crafting" 
        && murasakisan.mode != "feeding"
        && murasakisan.mode != "grooming"
        && murasakisan.mode != "sleeping"
        && murasakisan.mode != "hammock"
        && murasakisan.exemption_resting_count <= 0
        && local_happy > 0
        && local_crafting_calc >0
    ){
        murasakisan.set_mode = "crafting";
        murasakisan.setScale(0.45);
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 950;
        murasakisan.target_y = 740;
        //text_select_item.setText('"'+array_item_name[local_crafting_item_type]+'"')
        text_select_item.setText('"'+dic_items_reverse[local_crafting_item_type]+'"')
        sound_crafting.play();
        local_crafting_calc = -1;
        //create item indicator
        if (
            typeof group_item_indicator == "undefined" 
            || typeof group_item_indicator.scene == "undefined"
        ){
            create_item_indicator(this_scene, local_crafting_item_type);
        }
    } else if (  //when complete crafting
        local_crafting_status == 0 
        && murasakisan.mode == "crafting"
    ) {
        if (local_crafting_resume_flag == 0) {
            murasakisan.set_mode = "hugging";
            text_select_item.setText(">> Select Item <<")
            icon_crafting_time_remining.visible = false;
            sound_earn.play();
            flag_item_update = 1;
        } else {
            murasakisan.set_mode = "resting";
        }
        //destroy item indicator
        try {
            group_item_indicator.destroy(true);
        } catch (error) {
            ;
        }
    } else if ( //during crafting
        murasakisan.mode == "crafting"
    ){
        //progress bar
        if (
            typeof item_indicator != "undefined"
            && (
                typeof item_indicator_bar == "undefined" 
                || typeof item_indicator_bar.scene == "undefined"
            )
        ){
            let _x = item_indicator.x-20;
            let _y = item_indicator.y+item_indicator.height*item_indicator.scaleY*0.8/2;
            let _bar_back = makeMiniProgressBar(this_scene, _x-2, _y-2, 40+4, 10+4, 0xecd9ff);
            //_bar_back.depth = 11;
            item_indicator_bar = makeMiniProgressBar(this_scene, _x, _y, 40, 10, 0xb872f4);
            item_indicator_bar.scaleX = 0.01;
            //item_item_indicator.depth = 12;
            group_item_indicator.add(_bar_back);
            group_item_indicator.add(item_indicator_bar);
        }
        //update prograss bar
        update_item_indicator_bar();
    
    //### practice check
    } else if (
        local_practice_status == 1 
        && murasakisan.mode != "practice" 
        && murasakisan.mode != "feeding"
        && murasakisan.mode != "grooming"
        && murasakisan.mode != "sleeping"
        && murasakisan.mode != "hammock"
    ){
        murasakisan.set_mode = "practice";
        murasakisan.setScale(0.45);
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 640;
        murasakisan.target_y = 650;
        sound_crafting.play();
    } else if (
        local_practice_status == 0 
        && murasakisan.mode == "practice"
    ) {
        let _item_type = get_itemType(local_myListsAt_withItemType, previous_local_practice_item_id);
        if (_item_type == dic_items["Clarinet"]["item_id"]) {
            item_clarinet.visible = true;
        } else if (_item_type == dic_items["Piano"]["item_id"]) {
            item_piano.visible = true;
        } else if (_item_type == dic_items["Violin"]["item_id"]) {
            item_violin.visible = true;
        }
        murasakisan.item_practice.destroy();
        murasakisan.set_mode = "hugging";
    
    //### strolling
    } else if (
        local_strolling_status == 1 
        && murasakisan.mode != "practice" 
        && murasakisan.mode != "feeding"
        && murasakisan.mode != "grooming"
        && murasakisan.mode != "sleeping"
        && murasakisan.mode != "hammock"
        && murasakisan.mode != "strolling_start"
    ){
        murasakisan.set_mode = "strolling_start";
        //item_waterBottle.visible = false;
        murasakisan.setScale(0.45);
        murasakisan.submode = 0;
        murasakisan.count = 0;
        sound_mining.play();
        if (local_companion == 1) {
            strolling_companion = mr_astar;
        } else if (local_companion == 2) {
            strolling_companion = ms_ether;
        } else if (local_companion == 3) {
            strolling_companion = dr_bitco;
        }
        strolling_companion.mode = "strolling_start";
        strolling_companion.submode = 0;
    } else if (
        local_strolling_status == 0
        && murasakisan.mode == "strolling_start"
    ){
        group_window_strollingDuring.destroy(true);
        murasakisan.set_mode = "strolling_end";
        murasakisan.setScale(0.45);
        murasakisan.submode = 0;
        murasakisan.count = 0;
        if (local_companion == 1) {
            strolling_companion = mr_astar;
        } else if (local_companion == 2) {
            strolling_companion = ms_ether;
        } else if (local_companion == 3) {
            strolling_companion = dr_bitco;
        }
        //get latest stroll info and calc delta
        async function _do() {
            await contract_update_stroll_info(summoner);
            murasakisan.delta_total_strolledDistance = 
                local_total_strolledDistance - previous_local_total_strolledDistance;
            murasakisan.delta_total_metSummoners = 
                local_total_metSummoners - previous_local_total_metSummoners;
        }
        _do();
        //pet
        strolling_companion.mode = "strolling_end";
        strolling_companion.submode = 0;
    }

    //### end
    previous_local_last_feeding_time = local_last_feeding_time;
    previous_local_last_grooming_time = local_last_grooming_time;
    previous_local_level = local_level;
    previous_local_practice_item_id = local_practice_item_id;
    previous_local_total_strolledDistance = local_total_strolledDistance;
    previous_local_total_metSummoners = local_total_metSummoners;
}


//---button


function update_checkButtonActivation(this_scene) {
    //### grooming
    if (
        local_farming_status == 1 
        || local_crafting_status == 1 
        || local_mining_status == 1 
        || local_practice_status == 1
        || summoner == 0
        || wallet != local_owner
     ) {
        button_grooming.setTexture("button_grooming_unable");
        button_grooming.disableInteractive();
    }else {
        button_grooming.setTexture("button_grooming_enable");
        button_grooming.on('pointerover', () => button_grooming.setTexture("button_grooming_pointerover"));
        button_grooming.on('pointerout', () => button_grooming.setTexture("button_grooming_enable"));
        button_grooming.setInteractive();
    }

    //### mining
    if (
        local_farming_status == 1 
        || local_crafting_status == 1 
        || local_practice_status == 1
        || local_level <= 1
        || wallet != local_owner
    ) {
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

    //### farming
    if (
        local_mining_status == 1 
        || local_crafting_status == 1 
        || local_practice_status == 1
        || local_level <= 1
        || wallet != local_owner
    ) {
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
    
    //check level
    /*
    if (local_level > 0 && local_level < 2) {
        button_mining_unable_text.visible = true;
        button_farming_unable_text.visible = true;
    } else {
        button_mining_unable_text.visible = false;
        button_farming_unable_text.visible = false;
    }
    */

    //### crafting
    
    // check level
    if (
        local_level < 3
        || local_mining_status == 1
        || local_farming_status == 1
        || local_practice_status == 1
        || wallet != local_owner
    ) {
        button_crafting_start.visible = false;
        button_crafting_pause.visible = false;
        button_crafting_resume.visible = false;
        button_crafting_cancel.visible = false;
        button_crafting_complete.visible = false;
        /*
        if (local_level > 0 && local_level < 3) {
            button_crafting_unable_text.visible = true;
        }
        */

    } else if (
        flag_info == 1
        && (typeof beginingBox_crafting == "undefined" || typeof beginingBox_crafting.scene == "undefined")
    ) {

        /*
        if (local_level >= 3) {
            button_crafting_unable_text.visible = false;
        }
        */
    
        // prepare variants
        let _crafting_status = local_crafting_status;
        let _resume_flag = local_crafting_resume_flag;
        let _calc_crafting = local_crafting_calc;

        //start
        if (_crafting_status == 0 && _resume_flag == 0) {
            button_crafting_start.visible = true;
            button_crafting_pause.visible = false;
            button_crafting_resume.visible = false;
            button_crafting_cancel.visible = false;
            button_crafting_complete.visible = false;
        //pause
        } else if (_crafting_status == 1 && _calc_crafting > 0) {
            button_crafting_start.visible = false;
            button_crafting_pause.visible = true;
            button_crafting_resume.visible = false;
            button_crafting_cancel.visible = false;
            button_crafting_complete.visible = false;            
        //resume or cancel
        } else if (_crafting_status == 0 && _resume_flag == 1) {
            button_crafting_start.visible = false;
            button_crafting_pause.visible = false;
            button_crafting_resume.visible = true;
            button_crafting_cancel.visible = true;
            button_crafting_complete.visible = false;            
        //complete
        } else if (_crafting_status == 1 && _calc_crafting == 0) {
            button_crafting_start.visible = false;
            button_crafting_pause.visible = false;
            button_crafting_resume.visible = false;
            button_crafting_cancel.visible = false;
            button_crafting_complete.visible = true;           
        }
    }
    
    //### practice
    //check level and item possess
    if (
        local_level >= 5
        && wallet == local_owner
        && (
            typeof item_clarinet != "undefined"
            || typeof item_piano != "undefined"
            || typeof item_violin != "undefined"
            || typeof item_horn != "undefined"
            || typeof item_timpani != "undefined"
            || typeof item_harp != "undefined"
        )
    ) {
        button_practice.visible = true;
    } else {
        button_practice.visible = false;
    }
    if (
        local_mining_status == 1 
        || local_farming_status == 1 
        || local_crafting_status == 1 
        || local_level <= 5
        //|| wallet != local_owner
    ) {
        button_practice.setTexture("button_practice_unable");
        button_practice.disableInteractive();
    }else if (local_practice_status == 1) {
        button_practice.setTexture("button_practice_working");
        button_practice.on('pointerover', () => button_practice.setTexture("button_practice_pointerover_stop"));
        button_practice.on('pointerout', () => button_practice.setTexture("button_practice_working"));
        button_practice.setInteractive();
    }else {
        button_practice.setTexture("button_practice_enable");
        button_practice.on('pointerover', () => button_practice.setTexture("button_practice_pointerover"));
        button_practice.on('pointerout', () => button_practice.setTexture("button_practice_enable"));
        button_practice.setInteractive();
    }
    
    //### level

    // check level: text
    /*
    if (local_level < 3) {
        text_select_item.setVisible(false);
    } else if (flag_info == 1) {
        text_select_item.setVisible(true);
    }
    */
    if (
        flag_info == 1 
        && (typeof beginingBox_crafting == "undefined" || typeof beginingBox_crafting.scene == "undefined")
    ) {
        text_select_item.setVisible(true);
    }

    //level-up button triggered by exp change
    if (
        local_exp / local_next_exp_required >= 1 
        && local_mining_status == 0 && local_farming_status == 0 && local_crafting_status == 0
        && button_levelup.texture.key == "back_level" 
        && button_levelup.texture.key != "button_levelup_pointerover"
        && wallet == local_owner
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

    //### beginingBox

    //beginingBox
    if (gamemode == "trial") {
        if (typeof beginingBox_feeding != "undefined" && typeof beginingBox_feeding.scene != "undefined"){
            if (summoner != 0){
                beginingBox_feeding.visible = true;
                beginingBox_feeding_text.visible = true;
            }
        }
        if (typeof beginingBox_grooming != "undefined" && typeof beginingBox_grooming.scene != "undefined"){
            if (summoner != 0){
                beginingBox_grooming.visible = true;
                beginingBox_grooming_text.visible = true;
            }
        }
        if (typeof beginingBox_mining != "undefined" && typeof beginingBox_mining.scene != "undefined"){
            if (summoner != 0){
                beginingBox_mining.visible = true;
                beginingBox_mining_text.visible = true;
            }
            if (local_level >= 2) {
                beginingBox_mining_text.setText(">> Click to Open <<\n     Start Mining!");
                beginingBox_mining.setInteractive({useHandCursor: true});
            }
        }
        if (typeof beginingBox_farming != "undefined" && typeof beginingBox_farming.scene != "undefined"){
            if (summoner != 0){
                beginingBox_farming.visible = true;
                beginingBox_farming_text.visible = true;
            }
            if (local_level >= 2) {
                beginingBox_farming_text.setText(">> Click to Open <<\n     Start Farming!");
                beginingBox_farming.setInteractive({useHandCursor: true});
            }
        }
        if (typeof beginingBox_crafting != "undefined" && typeof beginingBox_crafting.scene != "undefined"){
            if (summoner != 0){
                beginingBox_crafting.visible = true;
                beginingBox_crafting_text.visible = true;
            }
            if (local_level >= 3) {
                beginingBox_crafting_text.setText(">> Click to Open <<\n     Start Crafting!");
                beginingBox_crafting.setInteractive({useHandCursor: true});
            }
        }
    }
    
    
    //### item_indicator check
    //when posessed the indicated item, destroy indicator
    if (
        typeof item_indicator != "undefined" 
        && typeof item_indicator.scene != "undefined"
        && local_items[item_indicator.item_type] > 0
    ) {
        try {
            group_item_indicator.destroy(true);
        } catch (error) {
            ;
        }
    }


    //### start

    //calc sum of local_items and compare previous one
    let res1 = local_items.reduce((sum, element) => sum + element, 0);
    let res2 = previous_local_items.reduce((sum, element) => sum + element, 0);
    //when item updated, destroy crafting window group to update item info
    if (res1 != res2 && flag_window_craft == 0) {
        if (typeof group_window_crafting != "undefined") {
            group_window_crafting.destroy(true);
            delete group_window_crafting;
        }
    }

    let _item_id;
    let _item_name;


    //### 01:Nameplate
    _item_name = "Nameplate";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        group_kanban.setVisible(true);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_kanban);
        }
        //draw_flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, 85, 100);
            sound_hat.play();
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
    }
    
    
    //### 02:Mr.Astar
    _item_name = "Mr. Astar";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        mr_astar = new Pet(
            this_scene, 
            dic_items[_item_name]["pos_x"] - 25 + Math.random()*50, 
            dic_items[_item_name]["pos_y"] - 25 + Math.random()*50, 
            "mr_astar_right", 
            "mr_astar_left",
            "mining"
        ).setScale(0.12);
        group_update.add(mr_astar);
        group_pet.add(mr_astar);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, mr_astar);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, mr_astar.x, mr_astar.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof mr_astar != "undefined"
    ) {
        mr_astar.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    
    //### 03:Onigiri
    
    
    //### 04:Helment
    _item_name = "Helmet";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //let _x = 60;
        //let _y = 700;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_flag_local, JSON.stringify(1));
                }
            } else if (item_wearing_hat == item_hat_helmet) {
                item_wearing_hat = 0;
                item_hat_helmet.x = _x;
                item_hat_helmet.y = _y;
                item_hat_helmet.setAngle(90);
                if (local_owner == local_wallet) {
                    localStorage.setItem(_flag_local, JSON.stringify(0));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_hat_helmet);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_hat_helmet.x, item_hat_helmet.y);
            sound_hat.play();
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


    //### 05:LuckyDice
    _item_name = "Lucky Dice";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        dice = new Dice(
            this_scene,
            dic_items[_item_name]["pos_x"],
            dic_items[_item_name]["pos_y"],
            600).setScale(0.3).setOrigin(0.5);
        group_update.add(dice);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, dice);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, dice.x, dice.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof dice != "undefined"
    ) {
        dice.destroy(true);
        dice.text_rolled_number.destroy(true);
        dice.text_next_time.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //### 06:WallSticker
    _item_name = "Wall Sticker";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 640;
        let _y = 480;
        
        if (local_score == 0) {
            //wait for calculation
            local_items_flag[_item_id] = false;
        } else if (local_score < 200000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_01");
        } else if (local_score < 400000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_02");
        } else if (local_score < 600000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_03");
        } else if (local_score < 800000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_04");
        } else if (local_score < 1000000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_05");
        } else if (local_score < 1200000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_06");
        } else if (local_score < 1400000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_07");
        } else if (local_score < 1600000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_08");
        } else if (local_score < 1800000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_09");
        } else if (local_score < 2000000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_10");
        } else if (local_score < 2200000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_11");
        } else if (local_score >= 2200000) {
            item_wall_sticker = this_scene.add.image(_x, _y, "item_wall_sticker_12");
        }
        if (typeof item_wall_sticker != "undefined") {
            item_wall_sticker.setDepth(2).setAlpha(0.2);
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_wall_sticker != "undefined"
    ) {
        item_wall_sticker.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //### 07:Hammock
    _item_name = "Hammock";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_bed"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_bed = this_scene.add.sprite(_x, _y, "item_hammock_list")
            .setScale(0.8)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_bed.x = game.input.activePointer.x;
                    item_bed.y = game.input.activePointer.y;
                } else {
                    item_bed.x = game.input.activePointer.y;
                    item_bed.y = 960 - game.input.activePointer.x;
                }
                item_bed.depth = item_bed.y;
            })
            .on("dragend", () => {
                let _pos = [item_bed.x, item_bed.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
                if (
                    murasakisan.check_hammock()
                ){
                    sound_hat.play();
                    murasakisan.try_hammock();
                }
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_bed);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_bed.x, item_bed.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_bed != "undefined"
    ) {
        item_bed.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //### 08:TokenChest
    _item_name = "Token Chest";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_tokenChest);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_tokenChest.x, item_tokenChest.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_tokenChest != "undefined"
    ) {
        item_tokenChest.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //### 09:KnitHat
    _item_name = "Knit Hat";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_hat_knit);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_hat_knit.x, item_hat_knit.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_hat_knit != "undefined"
    ) {
        item_hat_knit.destroy(true);
        local_items_flag[_item_id] = false;
    }

    //### 10:HouseOfFluffy
    _item_name = "House of Fluffy";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //local_fluffy_house_count = 0;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        group_fluffy_house_in = this_scene.add.group();
        item_fluffy_house = this_scene.add.sprite(_x, _y, "item_fluffy_house_1")
            .setScale(0.4)
            .setOrigin(0.5)
            .setDepth(2)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                if (flag_fluffy_house_click == 0 && group_fluffy_house_in.getChildren().length > 0) {
                    flag_fluffy_house_click = 1;
                    let _timeout = 0;
                    for (i=0; i<group_fluffy_house_in.getLength(); i++) {
                        let _sprite = group_fluffy_house_in.getChildren()[i];
                        setTimeout( () => {
                            _sprite.on_click_fromHouse();
                        }, _timeout);
                        _timeout += 100;
                    }
                    group_fluffy_house_in.clear();
                    //local_fluffy_house_count = 0;
                    setTimeout( () => {
                        flag_fluffy_house_click = 0;
                    }, 3000);
                    murasakisan.on_click();
                    item_fluffy_house.setTexture("item_fluffy_house_1");
                    sound_fluffy.play();
                }
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_fluffy_house);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_fluffy_house.x, item_fluffy_house.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_fluffy_house != "undefined"
    ) {
        local_items_flag[_item_id] = false;
        item_fluffy_house.destroy(true);
    }
    //after craft
    if (local_items_flag[_item_id] == true) {
        if (group_fluffy_house_in.getChildren().length >= 10) {
            item_fluffy_house.setTexture("item_fluffy_house_5");
        } else if (group_fluffy_house_in.getChildren().length >= 7) {
            item_fluffy_house.setTexture("item_fluffy_house_4");
        } else if (group_fluffy_house_in.getChildren().length >= 4) {
            item_fluffy_house.setTexture("item_fluffy_house_3");
        } else if (group_fluffy_house_in.getChildren().length >= 1) {
            item_fluffy_house.setTexture("item_fluffy_house_2");
        } else {
            item_fluffy_house.setTexture("item_fluffy_house_1");
        }
    }

    //### 11:Crown
    _item_name = "Crown";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        item_crown = this_scene.add.sprite(
            dic_items[_item_name]["pos_x"],
            dic_items[_item_name]["pos_y"], 
            "item_crown"
        );
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
        item_crown.depth = item_bear.depth +1;
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_crown);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_crown.x, item_crown.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_crown != "undefined"
    ) {
        item_crown.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    //### 12:Clarinet
    //***TODO***
    /*
    _item_name = "Clarinet";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = 950;
        let _y = 750;
        let _pos_local = "pos_item_ukrere"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_ukrere = this_scene.add.sprite(_x, _y, "item_ukrere")
            .setScale(0.3)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_ukrere.x = game.input.activePointer.x;
                    item_ukrere.y = game.input.activePointer.y;
                } else {
                    item_ukrere.x = game.input.activePointer.y;
                    item_ukrere.y = 960 - game.input.activePointer.x;
                }
                item_ukrere.depth = item_ukrere.y;
            })
            .on("dragend", () => {
                let _pos = [item_ukrere.x, item_ukrere.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
                if (
                    item_ukrere.x >= 100
                    && item_ukrere.x <= 1100
                    && item_ukrere.y >= 500
                    && item_ukrere.y <= 800
                ){
                    sound_hat.play();
                    murasakisan.try_attenting(item_ukrere.x, item_ukrere.y);
                }
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_ukrere);
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_ukrere != "undefined"
    ) {
        item_ukrere.destroy(true);
        local_items_flag[_item_id] = false;
    }
    */
    
    
    //### 13:Horn
    //***TODO***
    
    
    //### 14:Cake
    

    //### 15:FortuneStatue
    _item_name = "Fortune Statue";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_fortune_statue);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_fortune_statue.x, item_fortune_statue.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_fortune_statue != "undefined"
    ) {
        item_fortune_statue.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 16:DoorOfTravel
    //***TODO***


    //### 17:Musicbox
    _item_name = "Music Box";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_musicbox);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_musicbox.x, item_musicbox.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_musicbox != "undefined"
    ) {
        item_musicbox.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 18:Straw Hat
    _item_name = "Straw Hat";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_flag_local, JSON.stringify(1));
                }
            } else if (item_wearing_hat == item_hat_mugiwara) {
                item_wearing_hat = 0;
                item_hat_mugiwara.x = _x;
                item_hat_mugiwara.y = _y;
                item_hat_mugiwara.setAngle(90);
                if (local_owner == local_wallet) {
                    localStorage.setItem(_flag_local, JSON.stringify(0));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_hat_mugiwara);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_hat_mugiwara.x, item_hat_mugiwara.y);
            sound_hat.play();
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


    //### 19:ScoreMeter
    _item_name = "Score Meter";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        summon_scoreMeter(this_scene);
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, 510, 510);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && group_scoreMeter.getLength() > 0
    ) {
        group_scoreMeter.clear(true);
        local_items_flag[_item_id] = false;
    }
    
    
    //### 20:Ms.Ether
    _item_name = "Ms. Ether";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        ms_ether = new Pet(
            this_scene, 
            dic_items[_item_name]["pos_x"] - 25 + Math.random()*50, 
            dic_items[_item_name]["pos_y"] - 25 + Math.random()*50, 
            "ms_ether_right", 
            "ms_ether_left",
            "farming"
        ).setScale(0.12);
        group_update.add(ms_ether);
        group_pet.add(ms_ether);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, ms_ether);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, ms_ether.x, ms_ether.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof ms_ether != "undefined"
    ) {
        ms_ether.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 21:Rug-Pull
    _item_name = "Rug-Pull";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        item_rugg = this_scene.add.image(_x, _y, "item_rugg")
            .setScale(1.7)
            .setOrigin(0.5)
            .setDepth(2);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_rugg);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_rugg.x, item_rugg.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_rugg != "undefined"
    ) {
        item_rugg.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 22:Window
    _item_name = "Window";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        item_window = this_scene.add.image(_x, _y, "item_window_sunny")
            .setScale(0.58)
            .setOrigin(0.5)
            .setDepth(2)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                sound_window.play();
                if (item_window.texture == game.textures.get(item_window.texture_opened)){
                    item_window.setTexture(item_window.texture_closed);
                } else if (item_window.texture == game.textures.get(item_window.texture_closed)) {
                    item_window.setTexture(item_window.texture_opened);
                } else if (item_window.texture == game.textures.get("item_window_night")) {
                    item_window.setTexture("item_window_night_closed");
                } else if (item_window.texture == game.textures.get("item_window_night_closed")) {
                    item_window.setTexture("item_window_night");
                }
            });
        //check astar price and define textures
        if (local_astar_priceChange_h24 > 1) {
            item_window.texture_opened = "item_window_sunny";
            item_window.texture_closed = "item_window_sunny_closed";
            item_window.setTexture(item_window.texture_opened);
        } else if (local_astar_priceChange_h24 < -1) {
            item_window.texture_opened = "item_window_rain";
            item_window.texture_closed = "item_window_rain_closed";
            item_window.setTexture(item_window.texture_opened);
        } else {
            item_window.texture_opened = "item_window_cloudy";
            item_window.texture_closed = "item_window_cloudy_closed";
            item_window.setTexture(item_window.texture_opened);
        }
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_window);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_window.x, item_window.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_window != "undefined"
    ) {
        item_window.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    //when possess 
    if (local_items_flag[_item_id] == true && flag_onLight == true) {
        //check astar price and define textures
        if (local_astar_priceChange_h24 > 1) {
            item_window.texture_opened = "item_window_sunny";
            item_window.texture_closed = "item_window_sunny_closed";
            item_window.setTexture(item_window.texture_opened);
        } else if (local_astar_priceChange_h24 < -1) {
            item_window.texture_opened = "item_window_rain";
            item_window.texture_closed = "item_window_rain_closed";
            item_window.setTexture(item_window.texture_opened);
        } else {
            item_window.texture_opened = "item_window_cloudy";
            item_window.texture_closed = "item_window_cloudy_closed";
            item_window.setTexture(item_window.texture_opened);
        }
    }


    //### 23:Cat Cushion
    _item_name = "Cat Cushion";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;

        //cushion
        //item_cushion = this_scene.add.sprite(90, 620, "item_cushion").setScale(0.25).setOrigin(0.5);
        item_cushion = this_scene.add.sprite(
            dic_items[_item_name]["pos_x"], 
            dic_items[_item_name]["pos_y"], 
            "item_cushion").setScale(0.5).setOrigin(0.5);
        item_cushion.depth = item_cushion.y - 50;
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_cushion);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_cushion.x, item_cushion.y);
            sound_hat.play();
        }
        
        //text_sending_interval
        //text_sending_interval = this_scene.add.text(70, 640, "00h:00m", {font: "15px Arial", fill: "#ffffff"})
        text_sending_interval = this_scene.add.text(52, 660, "00h:00m", {font: "15px Arial", fill: "#222222"})
            .setDepth(item_cushion.depth + 1);
        group_info.add(text_sending_interval);

        //cat
        cat = new HomeCat(this_scene, 90, 610)
            .setOrigin(0.5)
            .setScale(0.4);
        group_update.add(cat);
        
        //mail
        mail = this_scene.add.sprite(75, 655, "item_mail")
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
                //text_sending_interval.setText(_text).setFill("#ffffff");
                text_sending_interval.setText(_text).setFill("#222222");
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


    //### 24:PictureFrame
    //***TODO*** URI loading
    _item_name = "Picture Frame";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x2 = dic_items[_item_name]["pos_x"];
        let _y2 = dic_items[_item_name]["pos_y"];
        item_frame = this_scene.add.image(_x2, _y2, "item_frame")
            .setOrigin(0.5)
            .setScale(0.35)
            .setDepth(10);
        item_frame_inside = this_scene.add.sprite(_x2, _y2)
            .setOrigin(0.5)
            //.setScale(0.35)
            .setDepth(11)
            //.setDisplaySize(60, 93)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", async () => {
                sound_hat.play();
                //item_frame_inside.setTexture("item_frame_inside_loading");
                item_frame_inside.setTexture("");
                //item_frame_inside.setDisplaySize(60, 93);
                //item_frame_inside.setScale(0.35);
                let _url = await get_nft_url();
                this_scene.textures.remove("pic_nft");
                this_scene.load.image("pic_nft", _url);
                this_scene.load.start()
                this_scene.load.on(
                    "complete", 
                    () => {
                        item_frame_inside.setTexture("pic_nft");
                        item_frame_inside.setDisplaySize(60, 93);
                    });
            });
        async function _do() {
            let _url = await get_nft_url();
            this_scene.load.image("pic_nft", _url);
            this_scene.load.start()
            this_scene.load.on(
                "complete", 
                () => {
                    item_frame_inside.setTexture("pic_nft");
                        item_frame_inside.setDisplaySize(60, 93);
                });
        }
        _do();
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_frame);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_frame.x, item_frame.y);
            sound_hat.play();
        }
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


    //### 25:Crayon
    _item_name = "Crayon";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_crayon"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_crayon = this_scene.add.sprite(_x, _y, "item_crayon")
            .setScale(0.2)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_crayon.x = game.input.activePointer.x;
                    item_crayon.y = game.input.activePointer.y;
                } else {
                    item_crayon.x = game.input.activePointer.y;
                    item_crayon.y = 960 - game.input.activePointer.x;
                }
                item_crayon.depth = item_crayon.y;
            })
            .on("dragend", () => {
                let _pos = [item_crayon.x, item_crayon.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
                /*
                if (
                    item_crayon.x >= 100
                    && item_crayon.x <= 1100
                    && item_crayon.y >= 500
                    && item_crayon.y <= 800
                ){
                    sound_hat.play();
                    murasakisan.try_attenting(item_crayon.x, item_crayon.y);
                }
                */
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_crayon);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_crayon.x, item_crayon.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_crayon != "undefined"
    ) {
        item_crayon.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    //when possess crayon, update achevement
    if (local_items_flag[_item_id] == true) {
        update_achv();
    }
    
    
    //### 26:Pancake
    

    //### 27:Fishbowl
    _item_name = "Fishbowl";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
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
            _x = dic_items[_item_name]["pos_x"];
            _y = dic_items[_item_name]["pos_y"];
        }
        item_fishbowl = this_scene.add.sprite(
            _x,
            _y,
            "item_fishbowl",
        ).setOrigin(0.5).setScale(0.3).setDepth(_y)
            .anims.play("item_fishbowl_1", true)
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_fishbowl);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_fishbowl.x, item_fishbowl.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_clock != "undefined"
    ) {
        item_fishbowl.destroy(true);
        local_items_flag[_item_id] = false;
    }
    //when possess cushion
    if (local_items_flag[_item_id] == true) {
        if (local_wallet_age >= 20) {
            item_fishbowl.anims.play("item_fishbowl_5", true);
        } else if (local_wallet_age >= 15) {
            item_fishbowl.anims.play("item_fishbowl_4", true);
        } else if (local_wallet_age >= 10) {
            item_fishbowl.anims.play("item_fishbowl_3", true);
        } else if (local_wallet_age >= 5) {
            item_fishbowl.anims.play("item_fishbowl_2", true);
        } else {
            item_fishbowl.anims.play("item_fishbowl_1", true);
        }
    }


    //### 28:Piano
    _item_name = "Piano";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_piano);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_piano.x, item_piano.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_piano != "undefined"
    ) {
        item_piano.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    
    //### 29:Timpani
    //***TODO***


    //### 30:Pinwheel
    _item_name = "Pinwheel";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_pinwheel"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        
        summon_pinwheel(this_scene, _x, _y);
        
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, group_pinwheel.getChildren()[0]);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, _x, _y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof group_pinwheel != "undefined"
    ) {
        group_pinwheel.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 31:Asnya
    _item_name = "Asnya";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_asnya);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_asnya.x, item_asnya.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_asnya != "undefined"
    ) {
        item_asnya.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 32:KeyToTravel
    

    //### 33:Table
    _item_name = "Tablet";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //status pad
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
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

                    //check button_practice: duplicated codes
                    if (
                        local_level >= 5
                        && wallet == local_owner
                        && (
                            typeof item_clarinet != "undefined"
                            || typeof item_piano != "undefined"
                            || typeof item_violin != "undefined"
                            || typeof item_horn != "undefined"
                            || typeof item_timpani != "undefined"
                            || typeof item_harp != "undefined"
                        )
                    ) {
                        button_practice.visible = true;
                    } else {
                        button_practice.visible = false;
                    }
                    
                    draw_radarchart(this_scene);
                    item_pad.setTexture("item_pad_on");
                    sound_pad.play();
                    text_select_item.setText(">> Select Item <<");
                } else {
                    flag_radarchart = 0;
                    flag_info = 0;
                    group_info.setVisible(false);
                    group_info2.setVisible(false);   //set unvisible only
                    group_chart.destroy(true);
                    /*
                    try {
                        group_item_indicator.destroy(true);
                    } catch (error) {
                    }
                    */
                    item_pad.setTexture("item_pad_off");
                    //init_global_variants();
                }
            });
        flag_radarchart = 1;
        draw_radarchart(this_scene);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_pad);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_pad.x, item_pad.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_pad != "undefined"
    ) {
        item_pad.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 34:ChocoBread


    //### 35:FlowerWreath
    _item_name = "Flower Wreath";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_wreath";
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }

        let _text = "";
        _text += " Wallet score:         \n";
        _text += "   (token             ) \n";
        _text += "   (nft                  ) \n";
        _text += "   (staking           ) \n";
        _text += "   (special           ) ";
        item_wreath_text1 = this_scene.add.text(
            _x-15, 
            _y+75, 
            _text, 
            {font: "17px Arial", fill: "#000000", backgroundColor: "#ffffff"}
        ).setOrigin(0.4).setVisible(false).setDepth(2000);
        _text = "";
        _text += "                       " + (local_achv_onChain_score/100).toFixed(2) + " \n";
        _text += "                 " + (local_achv_onChain_score_token/100).toFixed(2) + " \n";
        _text += "                 " + (local_achv_onChain_score_nft/100).toFixed(2) + " \n";
        _text += "                 " + (local_achv_onChain_score_staking/100).toFixed(2) + " \n";
        _text += "                 " + (local_achv_onChain_score_murasaki_nft/100).toFixed(2) + " ";
        item_wreath_text2 = this_scene.add.text(
            _x-15, 
            _y+75, 
            _text, 
            {font: "17px Arial", fill: "#E5004F"}
        ).setOrigin(0.4).setVisible(false).setDepth(2000+1);
        item_wreath_click = 0;
        item_wreath = this_scene.add.sprite(_x, _y, "item_wreath")
            .setOrigin(0.5)
            .setScale(0.275)
            .setInteractive({ useHandCursor: true, draggable: true })
            .on("pointerdown", () => {
                item_wreath_text1.setVisible(true);
                item_wreath_text2.setVisible(true);
                item_wreath_click += 1;
                let item_wreath_click_now = item_wreath_click;
                setTimeout( () => {
                    if (item_wreath_click == item_wreath_click_now) { 
                        item_wreath_text1.setVisible(false);
                        item_wreath_text2.setVisible(false);
                    }
                }, 2000);
            })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_wreath.x = game.input.activePointer.x;
                    item_wreath.y = game.input.activePointer.y;
                } else {
                    item_wreath.x = game.input.activePointer.y;
                    item_wreath.y = 960 - game.input.activePointer.x;
                }
                item_wreath.depth = item_wreath.y;
                item_wreath_text1.visible = false;
                item_wreath_text2.visible = false;
            })
            .on("dragend", () => {
                let _pos = [item_wreath.x, item_wreath.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
                item_wreath_text1.x = item_wreath.x-15;
                item_wreath_text1.y = item_wreath.y+75;
                item_wreath_text2.x = item_wreath.x-15;
                item_wreath_text2.y = item_wreath.y+75;
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_wreath);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_wreath.x, item_wreath.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_wreath != "undefined"
    ) {
        item_wreath.destroy(true);
        local_items_flag[_item_id] = false;
    }

    
    //### 36:Ribbon
    _item_name = "Ribbon";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        item_ribbon = this_scene.add.sprite(
            dic_items[_item_name]["pos_x"], 
            dic_items[_item_name]["pos_y"], 
            "item_ribbon"
        ).setScale(0.15).setOrigin(0.5);
        item_ribbon.depth = item_bear.depth +1;
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_ribbon);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_ribbon.x, item_ribbon.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_ribbon != "undefined"
    ) {
        item_ribbon.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 37:Dr.Bitco
    _item_name = "Dr. Bitco";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        dr_bitco = new Pet(
            this_scene, 
            dic_items[_item_name]["pos_x"] - 25 + Math.random()*50, 
            dic_items[_item_name]["pos_y"] - 25 + Math.random()*50, 
            "dr_bitco_right", 
            "dr_bitco_left",
            "crafting"
        ).setScale(0.11);
        group_update.add(dr_bitco);
        group_pet.add(dr_bitco);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, dr_bitco);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, dr_bitco.x, dr_bitco.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof dr_bitco != "undefined"
    ) {
        dr_bitco.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 38:LightSwitch
    _item_name = "Light Switch";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        back_black = this_scene.add.image(640, 480, "back_black")
            .setDepth(3300)
            .setVisible(false);
        murasaki_neon = new Neon(
            this_scene, 
            50 + Math.random()*900, 
            200 + Math.random()*200, 
            "murasaki_neon_right", 
            "murasaki_neon_left"
        ).setVisible(false)
            .setDepth(3300+2)
            .setOrigin(0.5)
            .setScale(0.35);
        group_update.add(murasaki_neon);
        item_wall_sticker_neon = this_scene.add.sprite(640, 480, "item_wall_sticker_neon")
            .anims.play("wall_sticker_neon", true)
            .setDepth(3300+1)
            .setAlpha(0.7)
            .setVisible(false);
        item_switch = this_scene.add.sprite(
            dic_items[_item_name]["pos_x"],
            dic_items[_item_name]["pos_y"],
            "item_switch"
        ).setOrigin(0.5).setScale(0.25).setInteractive({useHandCursor: true});
        item_switch.anims.play("item_switch_off", true);
        item_switch.on('pointerdown', () => {
            //stop bgm
            try {
                bgm.stop();
            } catch(error) {
                ;
            }
            if (murasakisan.mode == "listning"){
                murasakisan.mode = "resting";
                murasakisan.count = 0;
            }
            //when light on -> light off
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
                /*
                if (typeof group_item197 != "undefined") {
                    group_item197.children.entries[0].anims.play("item_nui_alive", true);
                }
                */
                if (typeof item_lantern != "undefined") {
                    item_lantern.anims.play("item_lantern");
                    item_lantern.setDepth(3300+1);
                }
                if (typeof item_window != "undefined") {
                    if (item_window.texture == game.textures.get(item_window.texture_opened)){
                        item_window.setTexture("item_window_night");
                    } else {
                        item_window.setTexture("item_window_night_closed");
                    }
                }

                //if (typeof item_wall_sticker != "undefined" && local_wallet_score >= 2700) {
                if (typeof item_wall_sticker != "undefined" && local_score >= 1800000) {
                    item_wall_sticker_neon.setVisible(true);
                }
                if (local_dapps_staking_amount >0) {
                    neon_moon.setVisible(true);
                }
                if (local_dapps_staking_amount >1000) {
                    neon_saturn.setVisible(true);
                }
                if (local_dapps_staking_amount >3000) {
                    let _tmp = Math.random()*100;
                    if (_tmp >= 70) {
                        neon_moon.setFrame(1);
                    } else {
                        neon_moon.setFrame(0);
                    }
                }
                if (local_dapps_staking_amount >5000) {
                    neon_ufo.setVisible(true);
                }
                flag_onLight = false;
            //when light off -> light on
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
                /*
                if (typeof group_item197 != "undefined") {
                    group_item197.children.entries[0].anims.play("item_nui", true);
                }
                */
                if (typeof item_lantern != "undefined") {
                    item_lantern.anims.stop();
                    item_lantern.setFrame(0);
                    item_lantern.setDepth(item_lantern.y);
                }
                if (typeof item_window != "undefined") {
                    if (item_window.texture == game.textures.get("item_window_night")){
                        item_window.setTexture(item_window.texture_opened);
                    } else {
                        item_window.setTexture(item_window.texture_closed);
                    }
                }
                //if (typeof item_wall_sticker != "undefined" && local_wallet_score >= 2700) {
                if (typeof item_wall_sticker != "undefined" && local_score >= 1800000) {
                    item_wall_sticker_neon.setVisible(false);
                }
                neon_ufo.setVisible(false);
                neon_moon.setVisible(false);
                neon_saturn.setVisible(false);
                flag_onLight = true;
            }
        });
        item_switch.depth = item_switch.y;
        //ufo
        neon_ufo = this_scene.add.sprite(2000, 100, "neon_ufo")
            .anims.play("neon_ufo", true)
            .setDepth(3300+2)
            .setAlpha(1)
            .setScale(0.3)
            .setAngle(0)
            .setVisible(false);
        neon_ufo.angleAdd = 1;
        neon_ufo.update = () => {
            neon_ufo.x -= 0.5;
            if (neon_ufo.x < -500) {
                neon_ufo.x = 2000;
            }
            neon_ufo.angle += neon_ufo.angleAdd;
            if (neon_ufo.angle >= 10) {
                neon_ufo.angleAdd = -0.25;
            } else if (neon_ufo.angle <= -20) {
                neon_ufo.angleAdd = 0.25;
            }
        };
        group_update.add(neon_ufo);
            
        //moon
        neon_moon = this_scene.add.sprite(1200, 80, "neon_moon")
            .setDepth(3300+1)
            .setAlpha(1)
            .setScale(0.4)
            .setVisible(false);
        //saturn
        neon_saturn = this_scene.add.sprite(180, 60, "neon_saturn")
            .setDepth(3300+1)
            .setAlpha(1)
            .setScale(0.2)
            .setVisible(false);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_switch);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_switch.x, item_switch.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_switch != "undefined"
    ) {
        item_switch.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 39:Mortarboard
    _item_name = "Mortarboard";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_flag_local, JSON.stringify(1));
                }
            } else if (item_wearing_hat == item_hat_mortarboard) {
                item_wearing_hat = 0;
                item_hat_mortarboard.x = _x;
                item_hat_mortarboard.y = _y;
                item_hat_mortarboard.setAngle(90);
                if (local_owner == local_wallet) {
                    localStorage.setItem(_flag_local, JSON.stringify(0));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_hat_mortarboard);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_hat_mortarboard.x, item_hat_mortarboard.y);
            sound_hat.play();
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


    //### 40:NewsBoard
    _item_name = "News Board";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        item_newspaper = this_scene.add.image(_x, _y, "item_newspaper")
            .setOrigin(0.5)
            .setScale(0.19)
            .setDepth(2);
        item_newspaper_text1 = this_scene.add.text(
            _x,
            _y-20,
            local_newsText[0],
            {font: "14px Arial", fill: "#000000"}
        ).setOrigin(0.5).setDepth(3);
        item_newspaper_text2 = this_scene.add.text(
            _x,
            _y+0,
            local_newsText[1],
            {font: "14px Arial", fill: "#000000"}
        ).setOrigin(0.5).setDepth(3);
        item_newspaper_text3 = this_scene.add.text(
            _x,
            _y+20,
            local_newsText[2],
            {font: "14px Arial", fill: "#000000"}
        ).setOrigin(0.5).setDepth(3);
        item_newspaper_text4 = this_scene.add.text(
            _x,
            _y+40,
            local_newsText[3],
            {font: "14px Arial", fill: "#000000"}
        ).setOrigin(0.5).setDepth(3);
        count_to_newsUpdate = 0;
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_newspaper);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_newspaper.x, item_newspaper.y);
            sound_hat.play();
        }
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


    //### 41:WaterBottle
    //***TODO***
    _item_name = "Water Bottle";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_waterBottle"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_waterBottle = this_scene.add.sprite(_x, _y, "item_waterbottle")
            .setScale(0.45)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("pointerdown", () => {open_window_strolling(this_scene)});
            /*
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_waterBottle.x = game.input.activePointer.x;
                    item_waterBottle.y = game.input.activePointer.y;
                } else {
                    item_waterBottle.x = game.input.activePointer.y;
                    item_waterBottle.y = 960 - game.input.activePointer.x;
                }
                item_waterBottle.depth = item_waterBottle.y;
            })
            .on("dragend", () => {
                let _pos = [item_waterBottle.x, item_waterBottle.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
            });
            */
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_waterBottle);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_waterBottle.x, item_waterBottle.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_waterBottle != "undefined"
    ) {
        item_waterBottle.destroy(true);
        local_items_flag[_item_id] = false;
    }
    //after possession
    if (local_items_flag[_item_id] == true) {
        if (murasakisan.mode == "strolling_start" || murasakisan.mode == "strolling_end") {
            item_waterBottle.visible = false;
        }
    }
    

    //### 42:DairyBook
    _item_name = "Diary Book";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
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
            _x = dic_items[_item_name]["pos_x"];
            _y = dic_items[_item_name]["pos_y"];
        }
        let _text = "";
        _text += " total exp: " + local_total_exp_gained + " \n";
        _text += " total coin: " + local_total_coin_mined + " \n";
        _text += " total leaf: " + local_total_material_farmed + "\n";
        _text += " total craft: " + local_total_item_crafted + " \n";
        _text += " total fluffy: " + local_total_precious_received + " ";
        item_book_text = this_scene.add.text(
            _x,
            _y-90,
            _text,
            {font: "20px Arial", fill: "#000000", backgroundColor: "#ffffff"}
        ).setOrigin(0.5).setVisible(false).setDepth(2000);
        item_book_click = 0;
        item_book = this_scene.add.sprite(
            _x, 
            _y, 
            "item_book"
        ).setScale(0.22).setOrigin(0.5)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("pointerdown", () => {
                if (flag_info == 1) {
                    item_book_click += 1;
                    let item_book_click_now = item_book_click;
                    item_book_text.visible = true;
                    setTimeout( () => {
                        if (item_book_click == item_book_click_now) {
                            item_book_text.visible = false;
                        }
                    }, 2000)
                }
            })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_book.x = game.input.activePointer.x;
                    item_book.y = game.input.activePointer.y;
                } else {
                    item_book.x = game.input.activePointer.y;
                    item_book.y = 960 - game.input.activePointer.x;
                }
                //item_book_text.x = item_book.x;
                //item_book_text.y = item_book.y-90;
                item_book.depth = item_book.y;
                item_book_text.visible = false;
            })
            .on("dragend", () => {
                item_book_text.x = item_book.x;
                item_book_text.y = item_book.y-90;
                item_book.depth = item_book.y;
                let _pos = [item_book.x, item_book.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_book);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_book.x, item_book.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_clock != "undefined"
    ) {
        item_book.destroy(true);
        item_book_text.destroy(true);
        local_items_flag[_item_id] = false;
    } else if (local_items_flag[_item_id] == true) {
        let _text = "";
        _text += " total exp: " + local_total_exp_gained + " \n";
        _text += " total coin: " + local_total_coin_mined + " \n";
        _text += " total leaf: " + local_total_material_farmed + "\n";
        _text += " total craft: " + local_total_item_crafted + " \n";
        _text += " total fluffy: " + local_total_precious_received + " ";
        item_book_text.setText(_text);
    }


    //### 43:Cuckoo Clock
    _item_name = "Cuckoo Clock";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        item_clock = this_scene.add.sprite(_x, _y, "item_clock")
            .setFrame(0)
            .setScale(0.45)
            .setOrigin(0.5)
            .setDepth(2)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                /*
                //1 times
                item_clock.anims.play("item_clock_anim_1");
                sound_clock.play();
                */
                //2 times
                item_clock.anims.play("item_clock_anim_1");
                sound_clock.play();
                setTimeout( () => {
                    sound_clock.play();
                }, 2000);
                /*
                //3 times
                item_clock.anims.play("item_clock_anim_3");
                sound_clock.play();
                setTimeout( () => {
                    sound_clock.play();
                }, 2000);
                setTimeout( () => {
                    sound_clock.play();
                }, 4000);
                */
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_clock);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_clock.x, item_clock.y);
            sound_hat.play();
        }
        item_clock_short = this_scene.add.sprite(_x, _y, "item_clock")
            .setFrame(2)
            .setScale(0.45)
            .setOrigin(0.5)
            .setDepth(3);
        item_clock_long = this_scene.add.sprite(_x, _y, "item_clock")
            .setFrame(1)
            .setScale(0.45)
            .setOrigin(0.5)
            .setDepth(3);
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_clock != "undefined"
    ) {
        item_clock.destroy(true);
        item_clock_long.destroy(true);
        item_clock_short.destroy(true);
        local_items_flag[_item_id] = false;
    }
    //after craft
    if (local_items_flag[_item_id] == true) {
        let _min = local_nonce % 1440;
        item_clock_short.setAngle(_min *0.5);
        item_clock_long.setAngle(_min *6);
    }
    
    
    //### 44:Violin
    _item_name = "Violin";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
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
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_violin);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_violin.x, item_violin.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_violin != "undefined"
    ) {
        item_violin.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 45?:RetroGame
    //***TODO***
    _item_name = "Retro Game";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_retrogame"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_retrogame = this_scene.add.sprite(_x, _y, "item_retrogame")
            .setScale(0.2)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_retrogame.x = game.input.activePointer.x;
                    item_retrogame.y = game.input.activePointer.y;
                } else {
                    item_retrogame.x = game.input.activePointer.y;
                    item_retrogame.y = 960 - game.input.activePointer.x;
                }
                item_retrogame.depth = item_retrogame.y;
            })
            .on("dragend", () => {
                let _pos = [item_retrogame.x, item_retrogame.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
                summon_retroAlphabet(this_scene, item_retrogame.x, item_retrogame.y);
                item_retrogame.disableInteractive();
                setTimeout( () => {
                    item_retrogame.setInteractive({ draggable: true, useHandCursor: true });
                }, 5000);
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_retrogame);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_retrogame.x, item_retrogame.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_retrogame != "undefined"
    ) {
        item_retrogame.destroy(true);
        local_items_flag[_item_id] = false;
    }
        

    //### 46:Flowerpot
    _item_name = "Flowerpot";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_vase"
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_vase = this_scene.add.sprite(_x, _y, "item_vase")
            .setScale(0.4)
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
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
            });
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_vase);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_vase.x, item_vase.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_vase != "undefined"
    ) {
        item_vase.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 47:Lantern
    _item_name = "Lantern";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_lantern";
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_lantern = this_scene.add.sprite(_x, _y, "item_lantern_list")
            .setFrame(0)
            .setScale(0.275)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_lantern.x = game.input.activePointer.x;
                    item_lantern.y = game.input.activePointer.y;
                } else {
                    item_lantern.x = game.input.activePointer.y;
                    item_lantern.y = 960 - game.input.activePointer.x;
                }
                item_lantern.depth = item_lantern.y;
            })
            .on("dragend", () => {
                let _pos = [item_lantern.x, item_lantern.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
            })
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_lantern);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_lantern.x, item_lantern.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_lantern != "undefined"
    ) {
        item_lantern.destroy(true);
        local_items_flag[_item_id] = false;
    }
    
    
    //### 48:TravelBag


    //### 98:Cleaner Robot
    _item_name = "Cleaner Robot";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_runpa";
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        let item_runpa = summon_runpa(this_scene, _x, _y);
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_runpa);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_runpa.x, item_runpa.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_runpa != "undefined"
    ) {
        item_runpa.destroy(true);
        local_items_flag[_item_id] = false;
    } 
    
       
    //### 99:Candle
    _item_name = "Candle";
    _item_id = dic_items[_item_name]["item_id"];
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        let _x = dic_items[_item_name]["pos_x"];
        let _y = dic_items[_item_name]["pos_y"];
        let _pos_local = "pos_item_candle";
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        }
        item_candle = this_scene.add.sprite(_x, _y, "item_candle")
            .anims.play("item_candle")
            .setScale(0.25)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_candle.x = game.input.activePointer.x;
                    item_candle.y = game.input.activePointer.y;
                } else {
                    item_candle.x = game.input.activePointer.y;
                    item_candle.y = 960 - game.input.activePointer.x;
                }
                item_candle.depth = item_candle.y;
            })
            .on("dragend", () => {
                let _pos = [item_candle.x, item_candle.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
            })
        //uncommon
        if (local_items[_item_id+64] != 0) {
            draw_glitter(this_scene, item_candle);
        }
        //draw flower3
        if (count_sync > 3) {
            draw_flower3(this_scene, item_candle.x, item_candle.y);
            sound_hat.play();
        }
    } else if (
        local_items[_item_id] == 0 
        && local_items[_item_id+64] == 0 
        && local_items[_item_id+128] == 0
        && typeof item_lantern != "undefined"
    ) {
        item_candle.destroy(true);
        local_items_flag[_item_id] = false;
    }


    //### 194:Ohana Bank
    if (local_items[194] != previous_local_item194) {
        // define async function
        async function _do(scene) {
            // get item194 list, need to wait
            let _array_item194 = get_userItems(194);
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
                //draw flower3
                if (count_sync > 3) {
                    draw_flower3(this_scene, _array_bank[i].x, _array_bank[i].y);
                    sound_hat.play();
                }
            }
        }
        _do(this_scene);
    }


    //### 195:Kusa Pouch
    if (local_items[195] != previous_local_item195) {
        // define async function
        async function _do(scene) {
            // get item194 list, need to wait
            let _array_item195 = get_userItems(195);
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
                //draw flower3
                if (count_sync > 3) {
                    draw_flower3(this_scene, _array_bank[i].x, _array_bank[i].y);
                    sound_hat.play();
                }
            }
        }
        _do(this_scene);
    }


    //### 200:Presentbox
    if (local_items[200] > previous_local_item200) {
        let _itemIds = get_itemIds_from_itemType(local_myListsAt_withItemType, 200);
        _itemIds.forEach( async (_itemId) => {
            if (!summoned_presentbox.includes(_itemId)) {
                let _array = [
                    "item_presentboxes",
                    /*
                    "item_presentbox_01",
                    "item_presentbox_02",
                    "item_presentbox_03",
                    "item_presentbox_04",
                    "item_presentbox_05",
                    "item_presentbox_06",
                    "item_presentbox_07",
                    "item_presentbox_08",
                    */
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
                    .setScale(0.3)
                    .setAlpha(1)
                    .setDepth(_y);
                summoned_presentbox.push(_itemId);
                group_update.add(_present);
                draw_flower3(this_scene, _x, _y);
                sound_hat.play();
            }
        });
    }


    //### 201-236:Fluffy
    if (
        local_fluffy_count != previous_local_fluffy_count
        || local_pippel_score != previous_local_pippel_score
    ) {
    //if (local_precious > previous_local_precious2) {
        let _timeout = 0;
        let _count_fluffy = 0;
        let _count_fluffier = 0;
        let _count_fluffiest = 0;
        let _count_nui = 0;
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
                let _itemIds = get_itemIds_from_itemType(local_myListsAt_withItemType, i);
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
        //nuichan
        for (let i = 237; i <= 248; i++) {
            let _count = local_items[i];
            if (_count > 0) {
                let _itemIds = get_itemIds_from_itemType(local_myListsAt_withItemType, i);
                _itemIds.forEach(_itemId => {
                    _count_nui += 1;
                    if (!summoned_fluffies.includes(_itemId)){
                        summon_nuichan(this_scene, _itemId, i, _count_nui);
                        summoned_fluffies.push(_itemId);
                    }
                });
            }
        }

        //update fluffy text
        //let _count_nui = local_items[197];        
        let _text = "";
        _text += " fluffy x " + _count_fluffy + "\n";
        _text += " fluffier x " + _count_fluffier + "\n";
        _text += " fluffiest x " + _count_fluffiest + "\n";
        _text += " fluffy doll x " + _count_nui + "\n";
        _text += " pippel x " + local_pippel_score/10 + " ";
        text_fluffy.setText(_text);
    }

    
    //### 000:Staking
    if (
        /*
        local_dapps_staking_amount > 0
        && (typeof item_staking == "undefined" || typeof item_staking.scene == "undefined")
        && gamemode == "regular"
        */
        (typeof item_staking == "undefined" || typeof item_staking.scene == "undefined")
        && gamemode == "regular"
    ){
        let _x;
        let _y;
        let _pos_local = "pos_item_staking";
        //recover position from localStorage
        if (localStorage.getItem(_pos_local) != null && local_owner == local_wallet) {
            let _json = localStorage.getItem(_pos_local);
            _pos = JSON.parse(_json);
            _x = _pos[0];
            _y = _pos[1];
        } else {
            _x = 330;
            _y = 850;
        }
        let _text = "";
        _text += " Staking: " + local_dapps_staking_amount + " $ASTR \n";
        //_text += " rewarding speed: x" + local_staking_reward_speed/100 + " \n";
        _text += " Complete: " + local_staking_reward_percent + "%";
        item_staking_text = this_scene.add.text(
            _x,
            _y-60,
            _text,
            {font: "20px Arial", fill: "#000000", backgroundColor: "#ffffff"}
        ).setOrigin(0.5).setVisible(false).setDepth(2000);
        item_staking_bar_back = makeMiniProgressBar(this_scene, _x-20-2, _y+30+18-2, 40+4, 10+4, 0xFFD5D5)
            .setDepth(_y+1);
        item_staking_bar = makeMiniProgressBar(this_scene, _x-20, _y+30+18, 40, 10, 0xE5004F)
            .setDepth(_y+2);
        item_staking_bar.scaleX = 0.01;
        item_staking_click = 0;
        item_staking = this_scene.add.sprite(
            _x,
            _y,
            "item_staking_00",
        ).setOrigin(0.5).setScale(0.18).setDepth(_y)
            .setInteractive({ draggable: true, useHandCursor: true })
            .on("pointerdown", () => {
                item_staking_text.visible = true;
                item_staking_click += 1;
                let item_staking_click_now = item_staking_click;
                setTimeout( () => {
                    if (item_staking_click == item_staking_click_now) {
                        item_staking_text.visible = false;
                    }
                }, 2000);
                if (local_staking_reward_percent == 100) {
                    open_staking_reward(summoner);
                    sound_button_on.play();
                }
            })
            .on("drag", () => {
                if (this_scene.sys.game.scale.gameSize._width == 1280) {
                    item_staking.x = game.input.activePointer.x;
                    item_staking.y = game.input.activePointer.y;
                } else {
                    item_staking.x = game.input.activePointer.y;
                    item_staking.y = 960 - game.input.activePointer.x;
                }
                item_staking.depth = item_staking.y;
                //item_staking_text.x = item_staking.x;
                //item_staking_text.y = item_staking.y-60;
                item_staking_bar_back.x = item_staking.x-20-2;
                item_staking_bar_back.y = item_staking.y+30+18-2;
                item_staking_bar_back.depth = item_staking.y+1;
                item_staking_bar.x = item_staking.x-20;
                item_staking_bar.y = item_staking.y+30+18;
                item_staking_bar.depth = item_staking.y+2;
                item_staking_text.visible = false;
            })
            .on("dragend", () => {
                item_staking_text.x = item_staking.x;
                item_staking_text.y = item_staking.y-60;
                item_staking_text.depth = item_staking.y+1;
                let _pos = [item_staking.x, item_staking.y];
                if (local_owner == local_wallet) {
                    localStorage.setItem(_pos_local, JSON.stringify(_pos));
                }
            });
    } else if (
        typeof item_staking != "undefined" && typeof item_staking.scene != "undefined"
        && local_dapps_staking_amount == 0 
    ){
        item_staking.setTexture("item_staking_00");
        /*
        try { 
            item_staking.destroy(true);
            item_staking_text.destroy(true);
        } catch {};
        */
    } else if (
        typeof item_staking != "undefined" && typeof item_staking.scene != "undefined"
    ){
        let _text = "";
        _text += " Staking: " + local_dapps_staking_amount + " $ASTR \n";
        //_text += " rewarding speed: x" + local_staking_reward_speed/100 + " \n";
        _text += " Complete: " + local_staking_reward_percent + "%";
        item_staking_text.setText(_text);
        item_staking_bar.scaleX = local_staking_reward_percent/100;
        if (local_staking_reward_percent <= 15) {
            item_staking.setTexture("item_staking_01");
        } else if (local_staking_reward_percent <= 30) {
            item_staking.setTexture("item_staking_02");
        } else if (local_staking_reward_percent <= 45) {
            item_staking.setTexture("item_staking_03");
        } else if (local_staking_reward_percent <= 60) {
            item_staking.setTexture("item_staking_04");
        } else if (local_staking_reward_percent <= 75) {
            item_staking.setTexture("item_staking_05");
        } else if (local_staking_reward_percent <= 90) {
            item_staking.setTexture("item_staking_06");
        } else if (local_staking_reward_percent < 100) {
            item_staking.setTexture("item_staking_07");
        } else if (local_staking_reward_percent == 100) {
            item_staking.setTexture("item_staking_08");
        }
    }
        
    //### 000:VisitorCat
    if (
        count_sync >= 3
        && local_receiving_mail == 1 
        && (typeof cat_visitor == "undefined" || typeof cat_visitor.scene == "undefined")
    ){
        async function _run(scene) {
            let _res = await contract_callMailDetail(summoner);
            let _summoner_from_id = _res[0];
            let _summoner_from_name = _res[1];
            cat_visitor = new VisitorCat(scene, 0, 0, _summoner_from_id, _summoner_from_name)
                .setOrigin(0.5)
                .setScale(0.4);
            /*
            cat_visitor = new VisitorCat(scene, 0, 0, 99, "test")
                .setOrigin(0.5)
                .setScale(0.4);
            */
            group_update.add(cat_visitor);
            murasakisan.on_click();
        }
        _run(this_scene);
    }


    //### 000:Festivaler
    if (
        summoner != 0 &&
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
    

    //### 000:Mogumogu-san
    if (
        gamemode == "trial" 
        && local_level >= 3 
        && local_total_item_crafted >= 2
        && flag_mogumogu == 0
    ) {
        summon_mogumogu(this_scene);
        flag_mogumogu = 1;
    } else if (flag_mogumogu == 1 && gamemode != "trial") {
        group_mogumogu.destroy(true);
        flag_mogumogu = 0;
    }
    
    //###pippel
    if (local_check_pippel == 1 && count_sync >= 2) {
        if (pippel_basic.visible == false) {
            pippel_basic.visible = true;
            draw_flower3(this_scene, pippel_basic.x, pippel_basic.y);
        }
    } else {
        pippel_basic.visible = false;
    }
    
    //### end
    previous_local_items = local_items;
    previous_local_item194 = local_items[194];
    previous_local_item195 = local_items[195];
    previous_local_item196 = local_items[196];
    //previous_local_item197 = local_items[197];
    previous_local_item200 = local_items[200];
    previous_local_rolled_dice = local_rolled_dice;
    previous_local_name_str = local_name_str;
    previous_local_score = local_score;
    //previous_local_precious2 = local_precious;
    previous_local_fluffy_count = local_fluffy_count;
    previous_local_pippel_score = local_pippel_score;
}


//---update()

function calc_fps() {
    let _now = Date.now();
    if (_now >= time_forFPS + 1000) {
        time_forFPS = _now;
        let _fps = (turn - turn_forFPS);
        turn_forFPS = turn; 
        text_fps.setText(_fps + " fps");
        //text_fps.setText(_fps + " fps" + ", " + turn);
    }
}

async function updateFirst(scene) {
    //await contract_update_all();
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
    update_astarPrice();
    update_house_price();
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
    if (flag_sync == 1 && (turn % 250 == 70 || flag_syncNow == 1)) {
        flag_syncNow = 0;
        if (count_sync == 0 || local_notPetrified == 0 || summoner == 0) {
            contract_update_all();
        } else if (summoner > 0) {
            contract_update_dynamic_status(summoner);
        }
    }
}


//===phaser3:scene=============================================================================


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
        //this.load.image("logo", "src/png/logo.png");
        this.load.spritesheet("logolist", "src/icon/logolist.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("logolist2", "src/icon/logolist2.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("logolist3", "src/icon/logolist3.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("logolist4", "src/icon/logolist4.png", {frameWidth: 370, frameHeight: 320});
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

        //this.logo = this.add.image(640, 350, "logo").setScale(0.15);
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
        //loading web3 and preload parallely
        console.log("scene: Loading");
        this.update_web3(); // start loading web3 without async
        preload(this);

        //load plugin here
        //this plugin can acces as game.scene.scenes[1].rexUI
        //in other scenes
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: "lib/rexuiplugin.min.js",
            sceneKey: 'rexUI'
        });
    }
    
    create() {
        //web3 loading msg
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
            
            //this.scene.start("Opeaning");

            this.cameras.main.fadeOut(250, 255, 255, 255);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start("Opeaning");
            });
            this.flag_start = 2;


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
        this.flowerCount_present = 0;
    }
    
    preload() {
        this.load.spritesheet("nyui_loading", "src/png/nyui_moving.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("nyui_loading2", "src/png/nyui_happy.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("ohana_loading", "src/particle/flowers.png", {frameWidth: 370, frameHeight: 320});
        this.load.image("opening_logo", "src/png/opening_logo.jpg");
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
        //_text += "This count is not affect gameplay :)";
        _text += "This count is stored locally\n";
        _text += "and does not affect gameplay :)";
        this.nyui_text2 = this.add.text(_x, _y+60, _text)
            .setFontSize(16)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#888888")
            .setVisible(false);
        this.nyui = this.add.sprite(_x, _y, "nyui_loading")
            .setOrigin(0.5)
            .setScale(0.25)
            .setDepth(1000)
            .setInteractive({useHandCursor: true })
            .on("pointerdown", () => {
                //this.flowerCount += 1;
                this.flowerCount_present += 1;
                localStorage_flowerCount += 1;
                this.nyui_text.setText(localStorage_flowerCount + " flowers");
                this.nyui_text.setVisible(true);
                this.nyui_text2.setVisible(true);
                let _ohana = this.add.image(
                    _x-150+Math.random()*300,
                    _y-20+Math.random()*40,
                    "ohana_loading"
                )
                    .setFrame(Math.floor(Math.random()*5))
                    .setOrigin(0.5)
                    .setScale(0.1)
                    .setAngle(Math.random()*360)
                    .setDepth(1000-1);
                localStorage.setItem("flowerCount_inGame", JSON.stringify(localStorage_flowerCount));
            });
    }
    
    update() {
        this.turn += 1;
        if (this.flowerCount_present >= 10) {
            this.nyui.setTexture("nyui_loading2");
        } else if (this.turn % 80 == 40) {
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

        //fade in
        this.cameras.main.fadeIn(500, 255, 255, 255);

        //opening logo
        this.add.image(640, 480, "opening_logo").setScale(0.8);

        //wait and fade out
        setTimeout( () => {
            this.cameras.main.fadeOut(250, 255, 255, 255);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start("Main");
            });
        }, 1000);

        /*
        this.cameras.main.fadeOut(300, 255, 255, 255);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("Main");
        });
        */
    }
}


//---Something Wrong


class SomethingWrong extends Phaser.Scene {

    constructor() {
        super({ key:"SomethingWrong", active:false });
    }

    create(){
        //system messages
        let _errImg = this.add.image(640, 360, "icon_wrong")
            .setOrigin(0.5)
            .setScale(0.5)
            .setVisible(false);
        let _msg1 = this.add.text(640, 480, 'Something Wrong')
            .setFontSize(80)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#ff1694");
        let _msg2 = this.add.text(640, 560, 'Please reload the page.')
            .setFontSize(40)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#ffebf7");
        let _msg3 = this.add.text(640, 660, '>> Click Here <<')
            .setFontSize(40)
            .setFontFamily("Arial")
            .setOrigin(0.5)
            .setFill("#0000FF")
            .setInteractive({useHandCursor: true })
            .on("pointerdown", () => {
                window.location.reload();
            });
        _errImg.setVisible(true);
    }
}


//---Main


class Main extends Phaser.Scene {

    constructor() {
        super({ key:"Main", active:false });
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
            this.cameras.main.fadeIn(500, 255, 255, 255);
            flag_fadein = 1;
        }
        update(this);
    }
}


//===phaser3:config=============================================================================

//---config
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
    scene: [
        FirstCheck, 
        Loading, 
        Loading_overlap, 
        Opeaning, 
        SomethingWrong, 
        Main
    ],
    fps: {
        target: 60,
        //forceSetTimeOut: true
    },
    //nedd for rexUI plugin
    dom: {
        createContainer: true
    },
};

game = new Phaser.Game(config);


//===end=================================================================
/*

//### Picture

    額縁絵の改善
        場所とデザインの吟味

 ng フロアステッカーの実装
        お花にするか
        床の上に薄く色々な種類のお花が増えてゆく

 ng ステーキング反映案
        いくつかのアイテムはステーキング量に応じて豪華になる
            金魚鉢：金魚が増える
            ステッカー：にぎやかになる
            花瓶：花の種類が変わる、など
        ステッカーはwallet ageではなくstaking量に対応させてしまうか

 ng プレゼント絵の実装
        マウスオーバーで半開きの絵
        出現アニメーション案
            ケムリでぼわぼわ
            誰かが持ってきて置く
            空からパラシュート

 ok 猫の絵の実装
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
    
    本のアニメーションの実装
        マウスオーバーラップ時の絵
        クリックで開いて表示させる？
        吹き出しの検討
            位置合わせがとても面倒だが

 ig Newspaperの絵の改善
        もう少し見やすく、新聞の絵をもうちょっとリッチに
    
 ok 上位アイテムの演出の実装
        Uncommon, Rareの差別化をどうするか
        particleをうまく使うか。
        一覧での色も変える？

 ok にゅいにゅいさんのカウンター演出の実装
        100や777など節目でなにか演出を考える
            おはなシャワー？
            特別絵のwindow？
        dapps staking量によってお花の数を増やすか

 ok アイテム実装の完了
        食べ物の実装
            表示位置の順番を考える
        bookの実装
        金魚鉢の実装
    
 ok ステッカー計算の再実装
        トータルスコアで段階表示させる
        ウォレットスコアはイメージしにくいだろう
        スコアのステップ調整が必要
        2年で最大成長とする
        
 ok fluffy修正
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
    
 ok ステッカー修正
        floor stickerの修正
        蛍光塗料の実装
        
 ok UpgradウィンドウUIの改善
        mint先itemアイコンの実装
        fluffyが難しいが、どうするか。
        また、アイテムアイコンの一覧を作るのが大変。
            craft windowと共通化したいところだが。
            
 ok Web3精神の深慮
        コントラクトへ可読性の高い情報が少ない
        item_typeなどはフロントエンド側にしか名前がない、など
        コントラクトだけでも世界観が完結できるよう、もう少し気を使うことを検討
            murasaki_craft_codexでitem_nameを返す
            しかしitem_nameをいちいちweb3に照会しているとフロントが重くなるジレンマ
        フロントを作り込みすぎると、特定のフロント内で完結する従来と変わらないUXとなってしまう
        NFTの強みは、NFT規格で横に世界が広がる可能性があること。
            そのためには、フロントに依存せずコントラクトだけでも世界観を表現できることが必要。
            summonerはNTTなので、HoMの中心NFTはitemしか無い。
            あるいはsummoner=Astar walletと居直ってしまっても良いだろうか。
       *summonerステータス=walletステータスとして、
            walletステータスは一括でinfoコントラから読み出し可能とする。
           *やはりsummoner_infoとは別に、wallet_infoコントラは用意する必要があるだろう。
            情報はある程度厳選しても良いだろうか。

 ok スコアの整理
        結論
            シンプルに、
            ステッカーはトータルスコアで成長させ、
            金魚鉢などは現在のステーキング量で段階表示させる
            砂時計だけ要検討か
        深慮
            成長系アイテムは結構後半にならないとクラフトできない
                そのためイマイチ成長を実感しにくい
            金魚鉢、ネオンちゃん、鳩時計などは単純にステーキング量に比例し
                ウォールステッカーはスコアに比例する、で良いだろうか。
            スコアにウォレット内NFTの加算を実装する
                totalスコア系　＋　現在の所持NFTを反映したスコア
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

 ok アイテム順の吟味
        アイテムの種類分け
        STR/DEX/INT系で同種類アイテムをバラけさせる
    
 ng ステーキングスコアの導入
        feeding時の加算をtotalで行うms項目の用意
        あまり必要性を感じなかった。
        トータルステーキングスコアはたしかに重要そうだが、
            単位や影響の係数計算が面倒そう。
        単純に現在のステーキング量を参照で良い気がする。

 ok fluffierのバグ修正
 ok diceコントラクトの3dへの修正
 ok dice, mailなどのitem_type修正
 ng feedingの3dリミット無視の実装
        実装が難しく断念
 ok スコアに所持NFTを反映させる
 ok アイテムID→アイテム名へ変換するコントラクトの実装
 ng ぬいちゃんの補正値計算の修正
        スコアではなくtotal_expを参照させるか？
        スコアはNFTを加味するため。
        NFT補正は20%程度なのでこのままで良しとする。
        そもそも救済処置、ボーナスなので。
    
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
