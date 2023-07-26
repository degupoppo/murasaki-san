

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


//===ToDo==================================================================================


/*

//### 1st


    キャラバン馬車の実装
        作製によってHoMを含めた拠点の移動が可能となる
        作成後、さらにアドオンやオプションをクラフトすることで能力がupする
        初期地点の当面の目標は、移住を可能にするキャラバンを作成することになる
        能力案：
            収納可能資源量
            移動速度


    建造物
        炭鉱
        畑
        花壇
        QuarryPlus
        農場
        花園
        テント


    UI設計概要
        hexタイルをにぎやかに
            1つのhexの重みを重くする
            いくつもhexを専有していくのではなく、
                1つのhexをちょっとずつ改良してにぎやかにしてゆくイメージ
            HoM周辺の6 hex, 12 hexぐらいでちょうどよいようなバランスで。
            とにかく要素をできるだけたくさん用意したほうが面白い。
            かつ、崩壊しないバランスで。
        


    基本設計概要
        コンセプト
            ワーカープレイスメントメカニクスおよび
                リソースマネジメントメカニクスに焦点を当てた
                ゆったりペースで進行するfull on-chainの拡大再生産ゲーム
                一日２～５回程度のtxで進行させたい。
            HoMのNFT資産を利用可能であり、
                またJoMの資産をHoMに持ち込むことも可能である拡張版の位置づけ
            目的：
                土地改善による拡大再生産で十分な余剰資源を確保し、
                移住のためのキャラバンを組んで、資源とともに新天地へ旅立つ。
                新天地への移住に楽しみとインセンティブを十二分に設計する。
        ワーカープレイスメント
            ワーカー：
                むらさきさん、ペット3匹、+aでfluffyたち
            選択肢：
                どのタイミングで、どのhexにワーカーを配置するか
                fluffyによるブーストをどのhexにつけるか
                また、ワーカーを取得するタイミングの選択
        リソースマネジメント
            リソースの種類：
                コイン（リソース）、葉っぱ（リソース）、お花（食料資源）
            マネジメント：
                お花の収支コントロール
                    ワーカーやfluffyを配置してリソースを拡大させるアクションは
                        食料支出を増加させる
                    一方で、gardeningなどの食料収入を増加するアクションは拡大行動ではない
                    つまり、リソース拡大への投資と貯金は二者択一となる
                コイン、葉っぱの拡大再生産の効率計算
                    リソースを消費して建造物を建てたほうが、
                        将来より多くのリソースを得られるようになる（＝拡大再生産）
                    どの順番でどの建造物を建てると効率が良いかを考える戦略設計が必要
        その他の要素
            リプレイ性：
                hexの資源はいずれ枯渇するため、新天地への移動にインセンティブが働く
                新天地ではより最適化された手順で立ち上げられる期待を持てる
                新天地をどこにするかプレイヤーが選ぶことができる
                また、レア度の高い土地を見出して移住する楽しみもある
            ランダム性：
                マップの配置と気候はランダムとなる
                それぞれ効果が異なり、互いに隣接しないレア度の高い土地を設定する
                    見出したレア度の高い土地に応じて、
                    最適な拡大戦略がある程度変化するように設計したい。
                    例）高密度のお花畑：ガーデニングがしばらく不要になる
                    例）金鉱脈：金のブースト系に寄せた立ち上げが効果的、など。
        アイデア
            天候：
                オンチェーンで24時間前のASTR/USDT価格を取得し、
                現在価格と24時間前価格の差で晴れ・雨・曇を決める。
                晴れだとすべての結果に+5%のブースト、
                雨だとすべての結果に-5%ブースト。
            NPC：
                プレイヤーの特定の行動に付随してhexを移動するNPCを設定する
                    claim時に付近のNPCが1マス移動する、など。
                    移動のクールダウンと移動の成否の乱数を実装し、
                        プレイヤーがNPCの行動を予測や操作しにくいように工夫する
                むらさきさんとhexが重なるか、HoMの文化圏に重なった際に特定の効果を受ける
                    ないないさん：flower取得+5%
                    もぐらさん：mining+5%
                    にゅいにゅいさん：farming+5%、など。



    マップ上の移動物体
        案：
            行商人
            にゅいにゅいさん
            ないないさん
        近くのプレイヤーの特定の行動でmove()して座標を移動し、
            プレイヤーと重なると特定のイベントやボーナスが発生する
        これらの機能を有する普遍的なコントラクトフレームワークを先に考えること。


    現在のリソース状況を表示する
        現在量　＝　直近リソース　＋　ワーキング中claim前　ー　前回からの消費分
        リソース量の判定は上記の現在量を参照する
        つまり、flower残量を参照する処理は、現在量が0になっていれば処理を変える。
        上記ルールが適応されるのはflowerだけでよいだろうか。
        coin/leafが継続的に支払われてゆく状況はあるだろうか。
        食料＝flowerはリアルタイムで現在量を算出し、
            基準値を下回ったら即座にペナルティを発生させる。
        他の資源は能動的に前払いで消費し、
            受け取るときも能動的にclaimで受け取る。
            リアルタイムで現在量を算出する必要はないか。


    行商人
        マップをランダムでゆっくり移動する行商人の実装を考えてみる
        ランダムウォークするx,y座標をトランザクション無しで実装可能だろうか。
        summonerを引数で渡すと、最も近い行商人がいるhexのx,y座標を返す関数。
            → 実装困難
            やはり現在の座標を保持させて、何かしらの行動に応じてmove()させるか。
            プレイヤーがなにかの行動をすると近くの行商人が移動する。
        役割
            行商人からしか買えないなにかがある。
            もしくは各行商人はプレイヤー間を移動していて、
                前のプレイヤーが売却したものを購入できる可能性がある。
            行商人はmove()で直近のプレイヤーを目指す？
    

    アクション
        むらさきさん
            gardening
            mining
            farming
            crafting
            upgrading
            moving
            migration
            flower plucking
                埋蔵量を減少させて収集する
            gardening
                花園から収集する
        ペット
            gardening
            mining
            farming
            ペットは移動しなくても良い。
                文化圏内を適当に歩き回って待機している
                stakingの命令を受けたら即座に移動してワークを始める
                演出としては移動を表示するが、実際は即座に適応される。
        hexタイル
            staking
        システム
            claim all


    文化圏
        HoMから四方に広がる属性
        いわゆる土地の所有に近い
        テントを建設することで飛び石地にも展開可能
            ただしテントは範囲が小さく効率が悪く、最大成長段階も小さい
            隣接して建設する利用方法か
        文化圏内のhexにのみfluffyをstaking可能
            petもworkingできるのは文化圏内のhexのみ
            ただしpetにmovingは必要ない
        むらさきさんは文化圏内は移動コストが低い
            文化圏外は時間がかかる
        文化圏内の建造物は所有者のみが使用可能
        HoMをupgradeすることで文化圏が広がる
        文化圏外にも建造物を建設可能だが所有権は生じない。


    on-chainの利用
        HoMの資産の利用
            wallet内のNFT資産がJoMにそのまま使える
        NFT/SBTの利用
            何をNFTとしてトレード可能とするか。
            建造物はhexに紐付けられているため、walletには入らない。
            特定の条件で取得する珍しいお花、はNFTとするか。
            また、継続してfluffyはNFTとして発見する。
                fluffyはhexにstakingするとboostされる。
                fluffyの取得場所がHoMだけだと面白くないだろう。
    

    食料ジレンマとマネジメント
        上位のHoMやペットの維持には単位時間あたりの食料消費が増加する
        また、ペットをワークさせていると食料消費量が増加する
        食料が０になるとワーク不可になる。
        食料（＝おはな）を収集するfloweringは誰でもいつでも実行可能
        flowerは生えているのを収集する以外にも、
            自分でガーデニングして安定供給させることが必要になる。
        品種改良によってより効率的なflowerを開発することも可能にしたい


    ゲーム進行概要
        序盤
            むらさきさん本体がHoMタイルもしくはその周辺でmining, farmingする
            マップに点在するflowerを消費しながら食料を確保する
            HoM周辺の山や森を地形改善して効率増加させる
            資源を支払ってHoMを改築する
            HoM改築により3匹のペットを解禁することが短期目標
        中盤
            ペットをワークさせてより効率的にmining, farmingする
            HoMをさらに改築
            パッシブインカム用の建造物の建設・改築
            ガーデニングにより食料を安定供給する
            むらさきさん本体はmining/famingせずに、craftingに専念できる状態が短期目標
        終盤
            余剰リソースが十分蓄積したら、準備を整えて旅に出発することができる。
            事前に、ペットやむらさきさんを帰還石を持たせてマップ開拓に送り出すことも可能。
            引っ越しの準備には時間とリソースが必要で、気軽に準備・展開を繰り返せない。
            また、地形改善はすべて引っ越し不可。
            移動には継続的にリソース消費が伴うため、十分な蓄えがなければ遠くには移動できない。
                テントを張って休息し、補給することは可能とする。
                flowerが不足してきたらお花畑でテントを張り、みんなでガーデニングすることになる。
                リソース切れのときのペナルティはどうするか。
            新天地では改築済みHoMを展開し、ある程度の強くてニューゲームが可能となる。
            プレイヤー同士が詰まってきたら、外周へ片道切符で転移する転移石も使用可能。


    目指す地点
        ワーカープレイスメント
            ワーカーをプレイス先に複数の選択肢があること。
            ワーカーをプレイスする場所とタイミングによって効果が異なること。
            プレイスしたい場所にすべてプレイスはできない、常にかつかつのバランスであること。
            発展を実感できること。
        リソースマネジメント
            リソースの消費先に複数の選択肢があること
            選択肢をすべて満たすことは常に不可能なバランスであること
                やりたいことは多いのに、常にカツカツ、というバランス。
            リソースの取得タイミングと優先度をプレイヤーが選択できること。
            リソースの種類が十分多いこと。
                また、リソースの目的が競合しないこと。
            限られたリソースを効果的に使わねばならない
            すべてのアクションを同時に実行することはできない
            その都度優先順位を決めてアクションを選択する必要があり、ここが面白い。
        共通点のエッセンス
            選択と制約：限られたリソースを多くの選択肢の中から選んで投資する。
            戦略と計画：将来の方向性に対して戦略を立て、進行を見据えて行動する必要がある。
            効率性：「効果的」に「適切」にリソースを消費する必要がある。また、それを実感できる。
        相違点：
            ワーカーの数に制約を設けるのか、
            リソースの習得量に制約を設けるのか。
            つまり、「カツカツ」感をワーカー数かリソース量のどちらで演出するのか。
                どちらもは可能だろうか。
                焦点をどちらか一方に絞ったほうが設計しやすいだろうか。
        エッセンス要約：
            ・限られたリソース
            ・取捨選別を迫る選択肢
                HoMのように段階的に高いものに手が届く、というよりは、取捨選別？
                結局はすべて選択できるが、どの順番で選択するか、に戦略性を持たせても良いか。
            ・拡大を実感できること
        リプレイ性
            なんらかの理由で新天地へ引っ越ししたくなる動機づけを考える
                資源の枯渇
                より良い立地の発見
            新天地では、前の土地よりもっとうまく拡張できるはず、と思わせる。

        
    資源の収集方法の深慮
        Claim制
            ほっといても自動で加算されるUIはコントラクトだと難しい。
            よって、現在の取得予想量を表示し、claimボタンで請求するUIにする
        受動的インカムの有無
            ワーカーをworkingさせる以外にも、
                例えばマップに設置しまくればワーカー無しでインカムを発生させる設備はどうか
                街コロの建造物のようなイメージ。
            設置の数や方法によってインカム量が増加する。
                果樹園：+10/day +果樹園総数*10, など。
                監視小屋：果樹園+10%, など？
            全設備のrewardsはestimated rewardsとして表示し、claimで一括取得する。
            最初はむらさきさん自らworkingが必要だが、
                どこかの分岐点で設備出力のほうが大きくなる。
            つまり、むらさきさんのworkingをブーストさせる設備より、
                受動的インカムをブーストさせる設備のほうが中長期的には伸びしろが大きい。
            序盤は能動的working, 中盤以降は受動的インカムが良いか。
            受動的インカムが十分に確保できたら、旅の準備が整う。
                もしくは、基本的な仕事以外の高度労働に従事する余裕が生まれる。
    

    実装の中心アイデア
        hexの設計が実装の肝
            本作においては、HoMのむらさきさんコントラのように、
                多数の動的・静的パラメータを有する中心単位はhexとなる。
                座標、タイプ、バイオームなどの静的パラメータと、
                埋蔵量、アクティブワーカー、所有者？などの動的パラメータを用意する。
            hexには様々なパラメータを設定する
                かつ、あとから拡張できるようにする
            hex情報をcallするコントラはreplacableか要素をaddableにしたい。
        意味論
            時間経過によって埋蔵量が回復する
                最大埋蔵量、採掘済みリソース量、直近のclaimからの経過時間
                claimからの経過時間に、回復量をかけた値を現在量とする？
        hexの情報
            パーリンノイズ
                タイプ決定用
                バイオーム決定用
                レアリティ決定用
            x, y座標
            id
            土地タイプ
                高山、山、森、平原、水、海
            土地バイオーム
                熱帯、温帯、冷帯
            coin, leaf, flowerの埋蔵量
                mining/farmingなどによって徐々に減ってゆく
            建造物の有無
                拠点、炭鉱、農場、工房、テント
                移動補助：街道・道路・鉄道？
            ステーカーの有無
                pet 3種
                fluffy
            特殊建造物の有無
                ダンジョン、森の洋館、など
                あとから新しい建造物を追加できるように
            所有者はどうするか。
                一度でも訪れたことがあるかどうかの訪問者、とするか？
                訪問の有無をmapping => boolでプレイヤーごとに書き込む
        レア土地の実装
            互いに隣接せず、一定の間隔でマップ中に点在させる
            1 chunk内の存在数が一定になるように配置する
        hexの実態
            訪問時に1 hexにつき1 contractがデプロイされる？
            → hex=contractとするメリットはなにか。
                NFTなどを所有することができる。
                ERC20トークンは使用しないので意味無し。
                ランダムなhex（mint済みhexからランダムに取得）にNFTをairdropして、
                そのhexにcurrent hexとしたむらさきさんのownerにtransfer権限を与える、など。
                fluffy rainでfluffy NFTをhexにairdropするなどに使えるか。
                別にこれは、hex=contractとしなくても可能ではあるのだが。
                あと、hex=contractとすると、upgradeがほぼ困難になってしまう。
                    NFTステーキングなどはcontractめがけて行うため、replacableではなくなる。
                メリットは、各コントラクトにアドレスが割り当てられててちょっとおもしろい。
                    まだmintされていないhexはアドレス未割当となる。
            

    初期スポーン地点の考察
        パーリンノイズで土地のレア度を割り当てて、
            特殊な建造物はレア度の高い土地にしか出現しないようにする。
            もしくは、土地レア度0.7-0.75ならば建造物フラグを返す、などとする。
            かつ、レアな建造物はまばらに散在するようにもしたい。
                周辺5x5=25マスのレア度ノイズ値を参照して、
                自マスが25マス中最も目標値に近ければフラグを返す実装でどうか。
                つまり、目標値0.70ならば、
                0.68-0.72以内で、かつ0.69, 0.68, 0.73などのうち0.69のみがフラグ1を返せる
                このアルゴリズムだと、周囲5x5マス中には絶対に自マス以外にはフラグが立たない。
                5x5の部分を7x7などにすれば、実質の最低距離を設定できる。
        初期スポーン地点は乱数で選択して、
            ノイズ値が十分に低い（＝レア度の高い土地まで十分に距離のある）
            土地を選択する。
        メインhex座標とは別に、高次元のスポーンhex座標を別に用意する。
            スポーンはスポーンhex座標を中心から埋めていき、
            スポーンhexに応じたメインhex座標からランダムで選択する。
            埋まったスポーンhex座標には別のプレイヤーはスポーンできない。
            1つのスポーンhex座標には、例えば64*64程度のメインhexを割り当てる。
            64x64 hex = 1 chunkとするイメージ。
        

    プレイのラフな段階
        拠点の周辺で資源収集
        拠点の周辺で建造物を建てて地形改善
        資源に余裕ができてきたら、遠方のより効率的なhexからも資源収集
        旅の準備を整えて、遠方へ出発、道の地形探索
        引っ越しの準備を整えて、遠方へ移住、
            余剰資源により効率的な立ち上げ
    
    
    旅のシステム
        旅のタイミング
            JoM開始直後はHoM近傍の地形改善を行い、経済基盤を整える
            どこかで余剰資源が生まれるので、道の地形探索のために旅に出れるようになる。
        旅の目的
            HoM周辺以外の外の地形の把握
            珍しい建設物の発見
            他のプレイヤーとの接触
            より肥沃な地形の発見
            プレイ目的にマッチした地形の発見
                コイン多め、リーフ多め、温帯・冷帯、など。
                みなが一つの最適解に収束するのではなく、
                いくつかの選択肢が成立するように設計したい。
        旅の条件
            最初はHoMからあまり遠くへ離れられないペナルティが存在する
                移動にコストがかかる、余剰食料がない、など。
            余剰資源により長距離移動に耐えれること
            長距離移動用の装備が整うこと
                移動コストの軽減装備のクラフト
                即時帰還アイテムの確保
                    使用には例えば24時間の事前準備が必要だが、
                    起動すればどこからでもHoMに帰還可能、など。
        旅のペナルティ
            移動中はむらさきさんが資源収集に従事できない
            食料が底を尽きるなど、資源がなくなったときのペナルティをどうするか。


    メインコンセプトはなにか
        リアルタイム多人数参加のmap開拓ゲーム
        1st seasonのNFTを使用してさらにゲームを続ける
        2nd seasonの資源を1st seasonに持っていくこともできる
        2ndは1stのNFTがあると有利になり、
            1stは2ndの資源を持ち込むことで有利になる。
        つまり、2ndは1stの拡張版で、相互にメリットが有る設計にする。
    
    
    Web3的体験はなにか
        1st NFTのユースケースを与える場
        共通mapを利用したserverlessのリアルタイムゲーム
        各hexとweb3要素をうまく融合させたいところだが、どうするか。
            look & feelも重視し、直感的に理解し納得できるUI/UXにしたい
            chain上の情報を可能な限りhexに対応させたい。
        JoMでは土地=各hexがメカニズムの中心となる
            1stではhouse=walletのコンセプトであった
           *hexはweb3上の何に相当するのだろうか。
           *何かしら意味のある、有限であるか、
                唯一無二である意味論を各hexにもたせてみたい。


    旅の目的はなにか
        資源を集める
            1stよりも高効率で収集可能になる
        地形改善
            mining, farming, craftingの効率上昇施設
                鉱山、農場、工房
            groomingの効率上昇施設
                テント
        珍しいお花を集める
            そのユースケースは？
            mining, farming, craftingに対応する3色にするか。
            持っていると恒常的に全体にブーストが掛かる。


    プレイヤー（＝むらさきさん）が選択可能な行動
        move
        mining
        farming
        building
        staking
            petをhexにstakingすることでmining/farmingを委託する
            fluffyをhexにstakingすることでhexの効率が上昇する
        migrating（引っ越し）
            HoMを別のhexに移動させる
            もしくはHoMをたたんで移動可能にして持ってゆく
            通常よりコストを高く設定する
            また、全petの集合が必要など、資源的に不利にする
            migration中は資源を全く得られず、
                事前準備が必要なようにバランス調整する

    食料資源について
        HoMではプレイヤーが無制限に用意できた
        JoMでは、マップからの回収が必要なルールとするか。
        HoMは最低限＋aの食料を生産する
            HoMがあれば、むらさきさんとpet 3匹が飢えることはない。
        より効率的にmining/farming/craftingしようとすると、追加で食料が必要になる。
            食料が0になるとworkingが中断される
        食料＝おはな、とする。


    土地の種類と属性
        種類
            森, farming
            山, mining
            平原, crafting
            水
        属性
            熱帯, +情熱, passion
            温帯, +温厚, kindness
            冷帯, +冷静, calmness
    
    
    建造物
        ルールなど
            HoMの影響範囲内しか建設できない
        鉱山
            mountainのhexに建設可能
            そのhexのminingの効率上昇
        農場
            forrestのhexに建設可能
            そのhexのfarming効率上昇
        テント
    
    
    HoMの成長
        HoM周辺のhexで活動するとHoMのレベルが上昇して文化圏が広がる。
            expの加算量、加算タイミング、必要expなどが明確に説明できるように。
        HoMの文化圏内の地形しか建造物を建てることができない。


    ゲームシステム案
        手持ちのNFTを資源として配置可能
            鉱山・農場にfluffyを配置する
            3匹のペットは本体の50%程度の出力でmining/farming可能
            crafting（開発）はむらさきさんしかできない？
        育成
            feeding：
                常に可能
                +100% exp
            grooming: 
                resting時に可能
                拠点で+100% exp, 準拠点（テント）で+50%など効率低下
        
    
    UIの実装
        移動
        システムボタン
            zoomIn
            zoomOut
            center
            home(HP)
            rotate


    コントラ実装
        hex structure
            id, x, y, material, 建造物, 所有者？などの情報
        2次元mapping
            hexを格納する
            もしくはhexIdを格納する
        caller
            hex_currentのxとyを引数に、周辺hexの情報を返す
            最低限、32*32=1024のhex情報を一度にcallできると良いのだが。
                次点で、24*24=576, 18*18=324, 12*12=144あたりだろうか。
        caller2
            所有しているhexの情報をすべて返す
                所有hexについては、距離に関わらずmapに常に表示したいため
        hex viewer
            hexのidかposを引数に、typeやmaterialなどの情報を返す
            バイオームをうまくアルゴリズム化する必要がある
                予めすべてのhexのtypeを定義しておくことは困難なため、
                要求があった際にその都度計算させて取得可能にしたい。
            パーリンノイズ：
                https://github.com/0x10f/solidity-perlin-noise
                x, y座標を渡せばパーリンノイズ乱数が返ってくるコントラを実装できる
                これでheightを取得し、閾値を決めて山・森・平原・水に変換する
                また、同様に別のパーリンノイズ乱数を用いて、
                    例えば熱帯・温帯・寒冷などのバイオームを設定する
                    熱帯の山、寒冷の平原、など、バイオーム x 高さ。
                jsのパーリンノイズライブラリ：
                    https://github.com/josephg/noisejs
                inkではないがrustのライブラリ
                    https://github.com/RyanMarcus/perlin
        初期値の割当
            誰かに会うためには少なくとも1ヶ月程度かかる間隔でバラけさせる
            近接する資源を固定化もしくは削除して優劣を軽減させる
            もしくは、追加料金を支払って再ロール可能とする。
    

*/


//===Global==================================================================================


//global
let scene_main;
let scene_system;
let turn = 0;
let cameraTargetX = 0;
let cameraTargetY = 0;
let murasakisan;
let currentPos = [0,0];
//let targetPos = [0,0];
let summoner = 1;
let summonerMode;
let hexMatrix;
let hexInfoWindow;
let craftWindow;
let speed = 100 * 100;
let _fontArg12 = {fontSize: 12,fontFamily: "Arial"};
let _fontArg18 = {fontSize: 18,fontFamily: "Arial"};
let _fontArg24 = {fontSize: 24,fontFamily: "Arial"};
let _fontArg36 = {fontSize: 36,fontFamily: "Arial"};
let _colorBlack = "#000000";

//local variants
let local_currentPos;
let local_targetPos;
let local_summonerMode;
let local_moving_reminingTime;
let local_moving_reminingPercent;
let local_coin = 0;
let local_leaf = 0;
let local_flower = 0;
let local_flower_additionPerHour = 0;
let local_day;

//flag
let flag_drag = 0;
let flag_moving = 0;
let flag_isHouseExist = 0;

//group
let group_update;
let group_hex;

//hex
let hex_selected;
let hex_current;
let hex_current_indicator;
let hex_targetted;
let hex_targetted_indicator;

// debug
let dic_hexStructure = {};
if (localStorage.getItem("dic_hexStructure") != null) {
    dic_hexStructure = JSON.parse(localStorage.getItem("dic_hexStructure"));
}



//===on-chain==================================================================================


//---call

async function onChain_call_mapType (x, y) {
    noise.seed(1);
    let _perlin = noise.perlin2(x/10, y/10);
    let _type = 0;
    if (_perlin <= -0.7) {
        _type = 5;  //sea
    } else if (_perlin <= -0.5) {
        _type = 4;  //water
    } else if (_perlin <= -0.1) {
        _type = 3;  //plain
    } else if (_perlin <= 0.2) {
        _type = 1;  //forest
    } else if (_perlin <= 1.00) {
        _type = 2;  //mountain
    }
    return _type;
}

async function onChain_call_mapClimate (x, y) {
    noise.seed(4);
    let _perlin = noise.perlin2(x/50, y/50);
    let _climate;
    if (_perlin <= -0.3) {
        _climate = 1;
    } else if (_perlin >= 0.3) {
        _climate = 3;
    } else {
        _climate = 2;
    }
    return _climate;
}

async function onChain_call_materials (x, y) {
    let _mapType = await onChain_call_mapType(x, y);
    noise.seed(3);
    let _rnd = noise.simplex2(x, y)*50+50;
    let _count = 0;
    if (_rnd <= 3) {
        _count = 3;
    } else if (_rnd <= 10) {
        _count = 2;
    } else if (_rnd <= 30) {
        _count = 1;
    }
    let _li_mat = [0,0,0,0]
    if (_mapType == 3) {
        //_li_mat[3] += _count;
    } else if (_mapType == 2) {
        _li_mat[2] += _count;
    } else if (_mapType == 1) {
        _li_mat[1] += _count;
    }
    //flower
    noise.seed(5);
    _rnd = noise.simplex2(x, y)*50+50;
    if (_rnd <= 3) {
        //_li_mat[3] += 2;
    } else if (_rnd <= 10) {
        _li_mat[3] += 1;
    }
    return _li_mat;
}

async function onChain_call_currentPos(_summoner) {
    let _currentPos = [1000, 1000];
    if (localStorage.getItem("currentPos") != null) {
        let _json = localStorage.getItem("currentPos");
        _currentPos = JSON.parse(_json);
    }
    if (JSON.parse(localStorage.getItem("summonerMode")) == "moving"){
        let _moving_reminingTime = _calc_movingReminintTime();
        if (_moving_reminingTime == 0) {
            _currentPos = JSON.parse(localStorage.getItem("targetPos"));
            onChain_send_currentPos(summoner, _currentPos);
            localStorage.setItem("summonerMode", JSON.stringify("resting"));
        }
    }
    // debug: insert home structure
    if (Object.keys(dic_hexStructure).length == 0) {
        dic_hexStructure[_currentPos[0]] = {};
        dic_hexStructure[_currentPos[0]][_currentPos[1]] = {};
        dic_hexStructure[_currentPos[0]][_currentPos[1]][0] = 111;
        localStorage.setItem("dic_hexStructure", JSON.stringify(dic_hexStructure));
    }
    return _currentPos;
}

async function onChain_call_summonerMode(_summoner) {
    let _summonerMode = "resting";
    if (localStorage.getItem("summonerMode") != null) {
        _summonerMode = JSON.parse(localStorage.getItem("summonerMode"));
    }
    if (_summonerMode == "moving"){
        let _moving_reminingTime = _calc_movingReminintTime();
        if (_moving_reminingTime == 0) {
            _summonerMode = "resting";
        }
    }
    return _summonerMode;
}

function _calc_movingReminintTime(){
    let _reminingTime = 0;
    if (JSON.parse(localStorage.getItem("summonerMode")) == "moving") {
        let _startTime = JSON.parse(localStorage.getItem("move_startTime"));
        let _now = Math.round(Date.now()/1000);
        let _deltaSec = _now - _startTime;
        _deltaSec *= speed/100;
        let _endTime = _startTime + 86400;
        _reminingTime = _endTime - _startTime - _deltaSec;
        if (_reminingTime < 0) {
            _reminingTime = 0;
        }
    }
    return _reminingTime;
}
function _calc_movingReminingPercent() {
    let _reminingTime = _calc_movingReminintTime();
    let _percent = _reminingTime/ (86400);
    _percent = Math.round(_percent*100)/100;
    return _percent;
}

async function onChain_call_hexStructure(_posX, _posY) {
    let _dic;
    let _res;
    try {
        _dic = dic_hexStructure[_posX][_posY];
        _res = [_dic[0], _dic[1], _dic[2], _dic[3], _dic[4]];
    } catch (error) {
        _res = [0,0,0,0];
    }
    return _res;
}

async function onChain_call_day(_summoner) {
    let _now = Math.round(Date.now()/1000);
    let _startTime = JSON.parse(localStorage.getItem("game_startTime"));
    if (_startTime == null) {
        _startTime = _now;
        localStorage.setItem("game_startTime", JSON.stringify(_startTime));    
    }
    let _deltaSec = _now - _startTime;
    _deltaSec *= speed/100;
    let _day = Math.round(_deltaSec/86400 * 100)/ 100;
    return _day;
}


//---send

async function onChain_send_currentPos(_summoner, _currentPos) {
    localStorage.setItem("currentPos", JSON.stringify(_currentPos));
}

async function onChain_send_startMoving(_summoner, _targetPos) {
    localStorage.setItem("summonerMode", JSON.stringify("moving"));    
    localStorage.setItem("targetPos", JSON.stringify(_targetPos)); 
    localStorage.setItem("move_startTime", JSON.stringify(Math.round(Date.now()/1000)));
}

async function onChain_send_structure(posX, posY, structureType, structureId) {
    if (dic_hexStructure[posX] == null) {
        dic_hexStructure[posX] = {};
    }
    if (dic_hexStructure[posX][posY] == null) {
        dic_hexStructure[posX][posY] = {};
    }
    dic_hexStructure[posX][posY][structureType] = structureId;
    localStorage.setItem("dic_hexStructure", JSON.stringify(dic_hexStructure));
}


//---dynamic status

async function onChain_update_dynamicStatus() {
    local_currentPos = await onChain_call_currentPos(summoner);
    local_targetPos = JSON.parse(localStorage.getItem("targetPos"));
    local_summonerMode = await onChain_call_summonerMode(summoner);
    local_moving_reminingTime = _calc_movingReminintTime();
    local_moving_reminingPercent = _calc_movingReminingPercent();
    local_coin = JSON.parse(localStorage.getItem("coin"));
    if (local_coin == null) {
        local_coin = 0;
    }
    local_calcMining = await onChain_call_calcMining(summoner);
    local_calcFarming = await onChain_call_calcFarming(summoner);
    local_leaf = JSON.parse(localStorage.getItem("leaf"));
    if (local_leaf == null) {
        local_leaf = 0;
    }
    local_flower = await onChain_call_currentFlower(summoner);
    local_flower_additionPerHour = await onChain_call_flowerAdditionPerHour(summoner);
    local_crafting_structureType = JSON.parse(localStorage.getItem("crafting_structureType"));
    local_calcCrafting = await onChain_call_calcCrafting(summoner);
    local_day = await onChain_call_day(summoner);
    console.log(
        "currentPos:", local_currentPos,
        "targetPos:", local_targetPos,
        "summonerMode:", local_summonerMode,
        "moving_reminingTime:", local_moving_reminingTime,
        "moving_reminingPercent", local_moving_reminingPercent,
        "coin:", local_coin,
        "leaf:", local_leaf,
    );
}
function _calc_summonerMode() {
    let _summonerMode = JSON.parse(localStorage.getItem("summonerMode"));
    if (_summonerMode == "moving") {
        let _moving_reminingTime = _calc_movingReminintTime();
        if (_moving_reminingTime == 0) {
            return "resting";
        }
    }
    return _summonerMode;
}


//---mining

async function onChain_send_startMining(_summoner) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "mining");
    let _now = Math.round(Date.now()/1000);
    localStorage.setItem("mining_startTime", JSON.stringify(_now));
    // update flower
    await onChain_send_updateCurrentFlower(_summoner);
}

async function onChain_call_calcMining(_summoner) {
    if (local_summonerMode != "mining"){
        return 0;
    }
    let _mining_startTime = JSON.parse(localStorage.getItem("mining_startTime"));
    let _now = Math.round(Date.now()/1000);
    let _delta = _now - _mining_startTime;
    _delta *= speed/100;
    let _calc = _delta/86400 * 3000;
    let _boostRate = 1.00;
    // structure boost
    let _currentPos = await onChain_call_currentPos(summoner);
    let _structure = onChain_call_hexStructure(_currentPos[0], _currentPos[1]);
    if (_structure[1] > 0) {
        _boostRate += 0.5;
    }
    // map type boost
    let _mapType = onChain_call_mapType(local_currentPos[0], local_currentPos[1]);
    if (_mapType == 2) {
        _boostRate += 0.5;
    }
    // map reserve boost
    let _li_mat = await onChain_call_materials(_currentPos[0], _currentPos[1]);
    let _matCount = _li_mat[2];
    _boostRate += 0.25*_matCount;
    // boost
    _calc *= _boostRate;
    _calc = Math.round(_calc);
    return _calc;
}

function _write_summonerMode(_summoner, mode){
    localStorage.setItem("summonerMode", JSON.stringify(mode));
}

async function onChain_send_stopMining(_summoner) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "resting");
    let _calcMining = await onChain_call_calcMining(_summoner);
    let _coin = 0;
    if (JSON.parse(localStorage.getItem("coin")) != null) {
        _coin = JSON.parse(localStorage.getItem("coin"));
    }
    localStorage.setItem("coin", JSON.stringify(_coin + _calcMining));
}


//---farming

async function onChain_send_startFarming(_summoner) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "farming");
    let _now = Math.round(Date.now()/1000);
    localStorage.setItem("farming_startTime", JSON.stringify(_now));
    // update flower
    await onChain_send_updateCurrentFlower(_summoner);
}

async function onChain_call_calcFarming(_summoner) {
    if (local_summonerMode != "farming"){
        return 0;
    }
    let _farming_startTime = JSON.parse(localStorage.getItem("farming_startTime"));
    let _now = Math.round(Date.now()/1000);
    let _delta = _now - _farming_startTime;
    _delta *= speed/100;
    let _calc = _delta/86400 * 3000;
    let _boostRate = 1.00;
    // structure boost
    let _currentPos = await onChain_call_currentPos(summoner);
    let _structure = onChain_call_hexStructure(_currentPos[0], _currentPos[1]);
    if (_structure[2] > 0) {
        _boostRate += 0.5;
    }
    // map type boost
    let _mapType = onChain_call_mapType(local_currentPos[0], local_currentPos[1]);
    if (_mapType == 1) {
        _boostRate += 0.5;
    }
    // map reserve boost
    let _li_mat = await onChain_call_materials(_currentPos[0], _currentPos[1]);
    let _matCount = _li_mat[2];
    _boostRate += 0.25*_matCount;
    // boost
    _calc *= _boostRate;
    _calc = Math.round(_calc);
    return _calc;
}

async function onChain_send_stopFarming(_summoner) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "resting");
    let _calcFarming = await onChain_call_calcFarming(_summoner);
    let _leaf = 0;
    if (JSON.parse(localStorage.getItem("leaf")) != null) {
        _leaf = JSON.parse(localStorage.getItem("leaf"));
    }
    localStorage.setItem("leaf", JSON.stringify(_leaf + _calcFarming));
}


//---crafting

async function onChain_send_startCrafting(_summoner, _structureType) {
    local_currentPos = await onChain_call_currentPos(summoner);
    _write_summonerMode(_summoner, "crafting");
    let _now = Math.round(Date.now()/1000);
    localStorage.setItem("crafting_startTime", JSON.stringify(_now));
    localStorage.setItem("crafting_structureType", JSON.stringify(_structureType));
    // spent resource
    let _cost = 100;
    let _coin = JSON.parse(localStorage.getItem("coin"));
    localStorage.setItem("coin", JSON.stringify(_coin - _cost));
    let _leaf = JSON.parse(localStorage.getItem("leaf"));
    localStorage.setItem("leaf", JSON.stringify(_leaf - _cost));
    // update flower
    await onChain_send_updateCurrentFlower(_summoner);
}

async function onChain_call_calcCrafting(_summoner) {
    if (local_summonerMode != "crafting"){
        return 0;
    }
    let _crafting_startTime = JSON.parse(localStorage.getItem("crafting_startTime"));
    let _crafting_structureType = JSON.parse(localStorage.getItem("crafting_structureType"));
    // def dc
    let _dc = 86400;
    // calc delta_sec
    let _now = Math.round(Date.now()/1000);
    let _deltaSec = _now - _crafting_startTime;
    _deltaSec *= speed/100;
    let _boostRate = 1.00;
    _deltaSec *= _boostRate;
    // calc reminingSec
    _reminingSec = _dc - _deltaSec;
    if (_reminingSec < 0) {
        _reminingSec = 0;
    }
    _reminingSec = Math.round(_reminingSec);
    return _reminingSec;
}

async function onChain_send_stopCrafting(_summoner) {
    let _calcCrafting = await onChain_call_calcCrafting(_summoner);
    if (_calcCrafting == 0) {
        let _crafting_structureType = JSON.parse(localStorage.getItem("crafting_structureType"));
        local_currentPos = await onChain_call_currentPos(summoner);
        _write_summonerMode(_summoner, "resting");
        onChain_send_structure(local_currentPos[0], local_currentPos[1], _crafting_structureType, 888);
    }
}


//---flower

async function onChain_call_currentFlower(_summoner) {
    let _currentFlower = JSON.parse(localStorage.getItem("flower"));
    if (_currentFlower == null) {
        _currentFlower = 0;
    }
    let _lastUpdateTime = JSON.parse(localStorage.getItem("flower_lastUpdateTime"));
    if (_lastUpdateTime == null) {
        _lastUpdateTime = Math.round(Date.now()/1000);
        localStorage.setItem("flower_lastUpdateTime", JSON.stringify(_lastUpdateTime));
    }
    let _now = Math.round(Date.now()/1000);
    let _deltaSec = _now - _lastUpdateTime;
    _deltaSec *= speed/100;
    let _flowerAdditionPerHour = await onChain_call_flowerAdditionPerHour(_summoner);
    let _flowerAddition = _deltaSec / 3600 * _flowerAdditionPerHour;
    _currentFlower += _flowerAddition;
    _currentFlower = Math.round(_currentFlower);
    //console.log(_lastUpdateTime, _currentFlower, _flowerAddition);
    return _currentFlower;
}

async function onChain_call_flowerAdditionPerHour(_summoner) {
    let _flowerAdditionPerHour = 0;
    if (flag_isHouseExist == 1) {
        _flowerAdditionPerHour += 10;
    }
    if (murasakisan.mode == "mining" || murasakisan.mode == "farming") {
        _flowerAdditionPerHour -= 20;
    }
    if (murasakisan.mode == "crafting") {
        _flowerAdditionPerHour -= 40;
    }
    return _flowerAdditionPerHour;
}

async function onChain_send_updateCurrentFlower(_summoner) {
    let _now = Math.round(Date.now()/1000);
    localStorage.setItem("flower", JSON.stringify(local_flower));
    localStorage.setItem("flower_lastUpdateTime", JSON.stringify(_now));
}



//===Class==================================================================================


//---Murasakisan
class Murasakisan extends Phaser.GameObjects.Sprite{
    
    //### constructor
    constructor(scene, x, y, hex_current) {
        super(scene, x, y, "murasaki_right");
        this.scene.add.existing(this);
        this.x = x;
        this.y = y;
        this.hex_current = hex_current;
        this.anims.play("murasaki_right", true);
        this.dist = "right";
        this.setInteractive({useHandCursor: true});
        this.on("pointerdown", function (pointer) {
            this.on_click();
        }, this);
        this.mode = "resting";
        this.submode = 0;
        this.count = 0;
        this.clickCount = 0;
        this.setOrigin(0.5);
        group_update.add(this);
        this.hex_targetted = 0;
        this.name = scene.add.text(this.x, this.y-37, "Kapico", _fontArg18)
            .setOrigin(0.5)
            .setDepth(201)
            .setColor(_colorBlack)
            .setVisible(false);
        //$$$ info window
        this.window = scene.add.graphics();
        this.window.fillStyle(0xFFF100, 0.9).fillRect(0, 0, 162, 100);
        this.window.depth = 300;
        this.window.visible = false;
        let _text = "";
        _text += "Select action:";
        this.windowText = scene.add.text(0, 0, _text, _fontArg18)
            .setDepth(301).setColor(_colorBlack).setVisible(false);
        this.buttonMining = scene.add.sprite(0, 0, "button_mining")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_startMining(summoner);
                this.hide_window();
            });
        this.buttonMining_stop = scene.add.sprite(0, 0, "button_mining_stop")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_stopMining(summoner);
                this.hide_window();
            });
        this.buttonFarming = scene.add.sprite(0, 0, "button_farming")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_startFarming(summoner);
                this.hide_window();
            });
        this.buttonFarming_stop = scene.add.sprite(0, 0, "button_farming_stop")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                onChain_send_stopFarming(summoner);
                this.hide_window();
            });
        this.buttonCrafting = scene.add.sprite(0, 0, "button_crafting")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                this.hide_window();
                this.adjust_window();
                this.craftWindow.visible = true;
                this.craftWindow.text.visible = true;
                this.craftWindow.button_mining.visible = true;
                this.craftWindow.button_farming.visible = true;
                //onChain_send_startCrafting(summoner);
            });
        this.buttonCrafting_mint = scene.add.sprite(0, 0, "button_crafting_mint")
            .setScale(0.08).setOrigin(0.5).setDepth(301).setVisible(false)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                this.hide_window();
                onChain_send_stopCrafting(summoner);
            });
        
        //$$$ craft window
        this.craftWindow = scene.add.graphics()
            .fillStyle(0x89BDDE, 0.9)
            .fillRect(0, 0, 162, 100)
            .setDepth(300)
            .setVisible(false);
        _text = "";
        _text += "Mine, 100 10\n";
        _text += "Farm, 10 100\n";
        _text += "Workshop, 50, 50\n";
        this.craftWindow.text = scene.add.text(0, 0, _text, _fontArg18)
            .setDepth(301)
            .setVisible(false)
            .setColor(_colorBlack);
        this.craftWindow.button_mining = scene.add.sprite(0, 0, "craft_mining")
            .setInteractive({useHandCursor: true})
            .setScale(0.015)
            .setDepth(this.craftWindow.depth+1)
            .setVisible(false);
        this.craftWindow.button_mining.on("pointerdown", () => {
            onChain_send_startCrafting(summoner, 1);
            this.hide_window();
        });
        this.craftWindow.button_farming = scene.add.sprite(0, 0, "craft_farming")
            .setInteractive({useHandCursor: true})
            .setScale(0.015)
            .setDepth(this.craftWindow.depth+1)
            .setVisible(false);
        this.craftWindow.button_farming.on("pointerdown", () => {
            onChain_send_startCrafting(summoner, 2);
            this.hide_window();
        });
        
        //$$$ currentMeter
        this.text_calc = scene.add.text(0, 0, "", _fontArg18)
            .setColor(_colorBlack)
            .setDepth(this.depth+1)
            .setVisible(false)
            .setOrigin(0.5);
    }
    
    //### adjust_window
    adjust_window() {
        this.name.x = this.x;
        this.name.y = this.y - 28;
        this.window.x = this.x +30;
        this.window.y = this.y -100;
        this.windowText.x = this.window.x +5;
        this.windowText.y = this.window.y +5;
        this.buttonMining.x = this.window.x +25;
        this.buttonMining.y = this.window.y +75;
        this.buttonMining_stop.x = this.window.x +25;
        this.buttonMining_stop.y = this.window.y +75;
        this.buttonFarming.x = this.window.x +25+50;
        this.buttonFarming.y = this.window.y +75;
        this.buttonFarming_stop.x = this.window.x +25+50;
        this.buttonFarming_stop.y = this.window.y +75;
        this.buttonCrafting.x = this.window.x +25+50+50;
        this.buttonCrafting.y = this.window.y +75;
        this.buttonCrafting_mint.x = this.window.x +25+50+50;
        this.buttonCrafting_mint.y = this.window.y +75;
        this.craftWindow.x = this.x +30;
        this.craftWindow.y = this.y -100;
        this.craftWindow.text.x = this.craftWindow.x +5;
        this.craftWindow.text.y = this.craftWindow.y +5;
        this.craftWindow.button_mining.x = this.craftWindow.x+30;
        this.craftWindow.button_mining.y = this.craftWindow.y+50;
        this.craftWindow.button_farming.x = this.craftWindow.x+30+50;
        this.craftWindow.button_farming.y = this.craftWindow.y+50;
    }
    
    //### show_window
    show_window() {
        this.name.visible = true;
        this.window.visible = true;
        this.windowText.visible = true;
        if (this.mode == "mining") {
            this.buttonMining_stop.visible = true;
        } else if (this.mode == "farming") {
            this.buttonFarming_stop.visible = true;
        } else if (this.mode == "crafting") {
            if (local_calcCrafting == 0) {
                this.buttonCrafting_mint.visible = true;
            }
        } else {
            this.buttonMining.visible = true;
            this.buttonFarming.visible = true;
            this.buttonCrafting.visible = true;
        }
    }
    
    
    //### hide_window
    hide_window() {
        this.name.visible = false;
        this.window.visible = false;
        this.windowText.visible = false;
        this.buttonMining.visible = false;
        this.buttonMining_stop.visible = false;
        this.buttonFarming.visible = false;
        this.buttonFarming_stop.visible = false;
        this.buttonCrafting.visible = false;
        this.buttonCrafting_mint.visible = false;
        this.craftWindow.visible = false;
        this.craftWindow.text.visible = false;
        this.craftWindow.button_mining.visible = false;
        this.craftWindow.button_farming.visible = false;
    }

    //### on_click
    on_click() {
        this.clickCount += 1;
        this.clickCountNow = this.clickCount;
        this.adjust_window();
        this.show_window();
        setTimeout( () => {
            this.hide_window();
        }, 5000 );
    }
    
    //### happy
    happy() {
        if (this.submode == 0) {
            this.anims.play("murasaki_happy", true);
            this.happy_count = 300;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.happy_count -= 1;
            if (this.happy_count <= 0) {
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            this.mode = "resting";
            this.submode = 0;
        }
    }
    
    //### resting
    resting() {
        if (this.submode == 0) {
            this.anims.play("murasaki_right", true);
            if (this.dist == "right") {
                this.flipX = false;
            } else if (this.dist == "left") {
                this.flipX = true;
            }
            this.restingCount = 100 + Math.random() * 100;
            //this.restingCount = 10;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.restingCount -= 1;
            if (this.restingCount <= 0){
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            let _tmp = Math.random() * 100;
            if (_tmp <= 10) {
                this.mode = "sleeping";
                this.submode = 0;
            } else {
                this.mode = "moving";
                this.submode = 0;
                /*
                if (this.hex_targetted != 0) {
                    this.mode = "moving_toHex";
                    this.submode = 0;
                }
                */
            }
        }
    }
    
    //### sleeping
    sleeping() {
        if (this.submode == 0) {
            this.anims.play("murasaki_sleeping", true);
            this.sleeping_count = 1000 + Math.random()* 500;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.sleeping_count -= 1;
            if (this.sleeping_count <= 0) {
                this.mode = "resting";
                this.submode = 0;
            }
        }
    }
    
    //### moving
    moving() {
        if (this.submode == 0) {
            //let li = [0,10,20,30,40,50,130,140,150,160,170,180,190,200,210,220,230,310,320,330,340,350];
            //this.moving_degree = li[Math.floor(Math.random() * li.length)];
            this.moving_degree = Math.random()*360;
            //out of area check, x
            //let _hexX = hexMatrix[this.posX][this.posY].x;
            let _hexX = this.hex_current.x;
            if (this.x < _hexX-25 && this.moving_degree > 90 && this.moving_degree < 270) {
                this.moving_degree += 180;
                //console.log("limitX1")
            }else if (this.x > _hexX+25 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree += 180;
                //console.log("limitX2")
            }
            //out of area check, y
            //let _hexY = hexMatrix[this.posX][this.posY].y;
            let _hexY = this.hex_current.y;
            if (this.y > _hexY+25 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
                //console.log("limitY1")
            }else if (this.y < _hexY-25 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
                //console.log("limitY2")
            }

            //console.log("_hexX:", _hexX, "_hexY:", _hexY, "x:", this.x, "y:", this.y);

            //360 over check
            this.moving_degree = this.moving_degree % 360;
            //determine left or right
            if (this.moving_degree > 90 && this.moving_degree <= 270) {
                this.dist = "left";
                this.flipX = true;
            }else {
                this.dist = "right";
                this.flipX = false;
            }
            //determine speed, count
            this.moving_speed = 0.1 + Math.random() * 0.05;  //0.5-0.8
            this.moving_count = 70 + Math.random() * 30;    //70-100
            this.submode += 1;
        } else if (this.submode == 1) {
            this.x += Math.cos(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.y -= Math.sin(this.moving_degree * (Math.PI/180)) * this.moving_speed;
            this.moving_count -= 1;
            if (this.moving_count <= 0) {
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            this.mode = "resting";
            this.submode = 0;
        }
    }
    
    //### moving_toHex
    moving_toHex() {
        if (this.submode == 0) {
            this.anims.play("murasaki_working_right", true);
            let _delta_x = this.hex_targetted.x - this.x;
            if (_delta_x > 0){
                this.dist = "right";
                this.flipX = false;
            } else {
                this.dist = "left";
                this.flipX = true;
            }
            this.submode += 1;
        } else if (this.submode == 1) {
            let _deltaX = this.hex_targetted.x - this.hex_current.x;
            let _deltaY = this.hex_targetted.y - this.hex_current.y;
            let _deltaX2 = _deltaX * (1-local_moving_reminingPercent);
            let _deltaY2 = _deltaY * (1-local_moving_reminingPercent);
            this.x = this.hex_current.x + _deltaX2;
            this.y = this.hex_current.y + _deltaY2;
            /*
            let _deltaX = this.hex_targetted.x - this.x;
            let _deltaY = this.hex_targetted.y - this.y;
            let _deltaX2 = _deltaX / (Math.abs(_deltaX) + Math.abs(_deltaY)) * 0.2;
            let _deltaY2 = _deltaY / (Math.abs(_deltaX) + Math.abs(_deltaY)) * 0.2;
            this.x += _deltaX2;
            this.y += _deltaY2;
            */
            this.name.x = this.x;
            this.name.y = this.y -37;
            if (
                local_moving_reminingTime == 0
                /*
                this.x >= this.hex_targetted.x-10 
                && this.x <= this.hex_targetted.x+10 
                && this.y >= this.hex_targetted.y-10 
                && this.y <= this.hex_targetted.y+10
                */
            ) {
                this.submode += 1;
            }
        } else if (this.submode == 2) {
            hex_current = this.hex_targetted
            hex_current_indicator.x = hex_current.x;
            hex_current_indicator.y = hex_current.y;
            this.hex_current = hex_current;
            this.hex_targetted = 0;
            hex_targetted_indicator.visible = false;
            this.mode = "happy";
            this.submode = 0;
            flag_moving = 0;
        }
    }
    
    //### mining
    mining() {
        if (this.submode == 0) {
            this.anims.play("murasaki_mining", true);
            this.dist = "left"
            this.flipX = false;
            this.text_calc.x = this.x;
            this.text_calc.y = this.y-30;
            this.submode += 1;
        } else if (this.submode == 1) {
            this.text_calc.setTexture(local_calcMining);
        }
    }

    //### farming
    farming() {
        if (this.submode == 0) {
            this.anims.play("murasaki_farming", true);
            this.dist = "left"
            this.flipX = false;
            this.submode += 1;
        } else if (this.submode == 1) {
        }
    }

    //### crafting
    crafting() {
        if (this.submode == 0) {
            this.anims.play("murasaki_crafting", true);
            this.dist = "left"
            this.flipX = false;
            this.submode += 1;
        } else if (this.submode == 1) {
        }
    }
    
    //### update
    update() {
        this.count += 1;
        if (this.mode == "resting") {this.resting();}
        else if (this.mode == "moving") {this.moving();}
        else if (this.mode == "moving_toHex") {this.moving_toHex();}
        else if (this.mode == "sleeping") {this.sleeping();}
        else if (this.mode == "happy") {this.happy();}
        else if (this.mode == "mining") {this.mining();}
        else if (this.mode == "farming") {this.farming();}
        else if (this.mode == "crafting") {this.crafting();}
    }
}



//===Scene==================================================================================


//---Main
class Main extends Phaser.Scene {


    //### constructor
    constructor() {
        super({
            key: 'examples'
        })
    }


    //### preload
    preload() {

        // hex
        this.load.image("hex_00", "png/hex_00.png");
        this.load.image("hex_01", "png/hex_01.png");
        this.load.image("hex_02", "png/hex_02.png");
        this.load.image("hex_03", "png/hex_03.png");
        this.load.image("hex_04", "png/hex_04.png");
        this.load.image("hex_05", "png/hex_05.png");
        this.load.image("hex_10", "png/hex_10.png");
        this.load.image("hex_11", "png/hex_11.png");
        this.load.image("hex_98", "png/hex_98.png");
        this.load.image("hex_99", "png/hex_99.png");

        // material
        this.load.image("coin", "png/mat_coin.png");
        this.load.image("leaf", "png/mat_leaf.png");
        this.load.spritesheet("flowers", "png/mat_flowers.png", {frameWidth: 370, frameHeight: 320});

        // etc
        this.load.image("logo_icon", "png/logo_icon.png");
        this.load.image("icon_zoomIn", "png/icon_zoomIn.png");
        this.load.image("icon_zoomOut", "png/icon_zoomOut.png");
        this.load.image("icon_zoomReset", "png/icon_zoomReset.png");

        // murasakisan
        this.load.spritesheet("murasaki_right", "png/murasaki_right.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_working_right", "png/murasaki_working_right.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_sleeping", "png/murasaki_sleeping2.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_happy", "png/murasaki_happy.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_mining", "png/murasaki_mining.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_farming", "png/murasaki_farming.png", {frameWidth: 370, frameHeight: 320});
        this.load.spritesheet("murasaki_crafting", "png/murasaki_crafting.png", {frameWidth: 370, frameHeight: 320});

        //craft
        this.load.image("craft_mining", "png/craft_mining.png");
        this.load.image("craft_farming", "png/craft_farming.png");
        this.load.image("craft_crafting", "png/craft_crafting.png");
        
        //button
        this.load.image("button_mining", "png/button_mining_enable.png");
        this.load.image("button_mining_stop", "png/button_mining_pointerover_stop.png");
        this.load.image("button_farming", "png/button_farming_enable.png");
        this.load.image("button_farming_stop", "png/button_farming_pointerover_stop.png");
        this.load.image("button_crafting", "png/button_crafting_enable.png");
        this.load.image("button_crafting_mint", "png/button_crafting_complete_off.png");
    }


    //### create
    async create() {
    
        // group
        group_update = this.add.group();
        group_update.runChildUpdate = true;
        
        // init
        this.cameras.main.zoom = 2;
        scene_main = this;
        
        // call current pos
        local_currentPos = await onChain_call_currentPos(summoner);
        
        // generate hex map
        await this.load_hex(this);

        // def key
        // detect mouse wheel
        this.input.on("wheel", (pointer) => {
            flag_drag = 0;  // reset dragging
            // increase/decrease camera zoom
            if (pointer.deltaY > 0) {
                this.cameras.main.zoom *= 0.9;
                if (this.cameras.main.zoom <= 0.3) {
                    this.cameras.main.zoom = 0.3;   // zoomOut limit
                }
            } else {
                this.cameras.main.zoom *= 1.1;
                if (this.cameras.main.zoom >= 4) {
                    this.cameras.main.zoom = 4; // zoomIn limit
                }
            }
        });
        // detect keyboard
        this.keys = {};
        this.keys.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // prepare animation
        await this.load_anims(this);

        // create summoner
        murasakisan = new Murasakisan(this, hex_current.x, hex_current.y, hex_current)
            .setOrigin(0.5)
            .setScale(0.125)
            .setDepth(200);
        
        // focus camera to summoner
        this.cameras.main.centerOn(murasakisan.x, murasakisan.y);
        
        // load scene
        this.scene.launch("System");
    }
    

    //$$$ fc: anims
    async load_anims(scene) {
        scene.anims.create({
            key: "murasaki_right",
            frames: scene.anims.generateFrameNumbers("murasaki_right", {start:0, end:3}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_working_right",
            frames: scene.anims.generateFrameNumbers("murasaki_working_right", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_sleeping",
            frames: scene.anims.generateFrameNumbers("murasaki_sleeping", {frames:[0,0,0,1,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_happy",
            frames: scene.anims.generateFrameNumbers("murasaki_happy", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_mining",
            frames: scene.anims.generateFrameNumbers("murasaki_mining", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_farming",
            frames: scene.anims.generateFrameNumbers("murasaki_farming", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({
            key: "murasaki_crafting",
            frames: scene.anims.generateFrameNumbers("murasaki_crafting", {frames:[0,0,1,1]}),
            frameRate: 2,
            repeat: -1
        });
    }
    

    //$$$ fc: hex
    async load_hex(scene) {

        // set hexagon position parameters
        
        let _numberX = 28;  // must be even number to calc _starHex
        let _numberY = 28;
        let _startHex = [local_currentPos[0]-_numberX/2, local_currentPos[1]-_numberY/2];
        let _hexagonWidth = game.textures.list["hex_00"].source[0].width;
        let _hexagonHeight = game.textures.list["hex_00"].source[0].height;
        let _startPosX = scene.sys.game.config.width/2 - _hexagonWidth*_numberX/2;
        let _startPosY = scene.sys.game.config.height/2 - _hexagonHeight*_numberY/2;

        let _adjustWidth = -4;
        let _adjustHeight = -10;
        _hexagonWidth += _adjustWidth;
        
        // prepare name dic
        let _dicHex = {
            0: "Unknown",
            1: "Forest",
            2: "Mountain",
            3: "Plain",
            4: "Water",
            5: "Sea",
        }
        let _dicClimate = {
            0: "Unknown",
            1: "Frigid",
            2: "Temperate",
            3: "tropical",
        }

        // prepare hex matrix
        hexMatrix = new Array();
        
        // prepare hex info window
        hexInfoWindow = scene.add.graphics()
            .fillStyle(0xFFF100, 0.9)
            .fillRect(0, 0, 162, 100)
            .setDepth(300)
            .setVisible(false);
        hexInfoWindow.text = scene.add.text(0, 0, "", _fontArg18)
            .setDepth(301)
            .setColor(_colorBlack);
        
        // prepare hex info button
        hexInfoWindow.button_move = scene.add.text(0, 0, "[Move]", _fontArg18)
            .setDepth(301)
            .setColor(_colorBlack)
            .setInteractive({useHandCursor: true})
            .setVisible(false);
        hexInfoWindow.button_move.on("pointerdown", () => {
            if (this.cameras.main.zoom >= 0.8) { // only when zoomOut
                onChain_send_startMoving(summoner, [hex_selected.posX, hex_selected.posY]);
                hexInfoWindow.button_move.visible = false;
            }
        });
        
        // generate hexagons
        group_hex = scene.add.group();
        let _countX;
        let _countY;
        let _num;
        
        // for each y row
        // to adjust mergin, +1 in _numberX and _numberY
        _num = -1;
        _countY = -1;
        for (let iy=0; iy<_numberY+1; iy++) {
            _countY += 1;
            _countX = -1;
            
            // for each x column
            for (let ix=0; ix<_numberX+1; ix++) {
                _countX += 1;
                _num += 1;

                // def pixel x, y
                let _x = _startPosX + ix * _hexagonWidth + (iy % 2) * _hexagonWidth/2;
                let _y = _startPosY + iy * _hexagonWidth - iy * (_hexagonHeight/8 +_adjustHeight);
                
                // recalc hex pos
                let _posX = _startHex[0] + _countX;
                let _posY = _startHex[1] + _countY;

                // call hex type
                let _type = await onChain_call_mapType(_posX, _posY);
                
                // call hex climate
                let _climate = await onChain_call_mapClimate(_posX, _posY);

                // override, out of range
                let _dist = Math.sqrt( Math.pow(_countX-_numberX/2,2) + Math.pow(_countY-_numberY/2,2));
                if (_dist >= 14) {
                    continue;
                } else if (_dist >= 12) {
                    _type = 0;
                    _climate = 0;
                }

                // generate hexagon sprite

                let hex;

                // set texture depends on map type
                if (_type == 0) {
                    hex = scene.add.sprite(_x, _y, "hex_00")
                } else if (_type == 1) {
                    hex = scene.add.sprite(_x, _y, "hex_01")
                } else if (_type == 2) {
                    hex = scene.add.sprite(_x, _y, "hex_02")
                } else if (_type == 3) {
                    hex = scene.add.sprite(_x, _y, "hex_03")
                } else if (_type == 4) {
                    hex = scene.add.sprite(_x, _y, "hex_04")
                } else if (_type == 5) {
                    hex = scene.add.sprite(_x, _y, "hex_05")
                }
                
                // overshow biome hex
                if (_climate == 1) {
                    scene.add.sprite(_x, _y, "hex_10").setAlpha(0.2).setDepth(101);
                } else if (_climate == 3) {
                    scene.add.sprite(_x, _y, "hex_11").setAlpha(0.1).setDepth(101);
                }
                
                // set hex variants
                hex.climate = _climate
                hex.num = _num;
                hex.type = _type;
                hex.posX = _posX;
                hex.posY = _posY;
                hex.depth = 100;
                hex.leaf = 0;
                hex.coin = 0;
                hex.flower = 0;

                // init hex
                group_hex.add(hex);
                hex.setAlpha(0.4);
                hex.setOrigin(0.5);
                hex.setInteractive({useHandCursor: true});

                // show materials
                if (hex.type != 0) {
                    // call mat
                    let _li_mats = await onChain_call_materials(_posX, _posY);
                    // put mat
                    for (let _matType=1; _matType<=3; _matType++) {
                        let _count = _li_mats[_matType];
                        if (_count > 0) {
                            for (let i=0; i<_count; i++) {
                                let _x = hex.x-40+Math.random()*80;
                                let _y = hex.y-40+Math.random()*30;
                                let _material;
                                // put each materials
                                if (_matType == 1) {
                                    _material = scene.add.sprite(_x, _y, "leaf");
                                    _material.setOrigin(0.5);
                                    _material.setScale(0.1);
                                    _material.setDepth(101);
                                    hex.leaf += 1;
                                } else if (_matType == 2) {
                                    _material = scene.add.sprite(_x, _y, "coin");
                                    _material.setOrigin(0.5);
                                    _material.setScale(0.07);
                                    _material.setDepth(101);
                                    hex.coin += 1;
                                } else if (_matType == 3) {
                                    _material = scene.add.sprite(_x, _y, "flowers");
                                    _material.setFrame(Math.round(Math.random()*5));
                                    _material.setAngle(360*Math.random());
                                    _material.setOrigin(0.5);
                                    _material.setScale(0.12);
                                    _material.setDepth(101);
                                    hex.flower += 1;
                                }
                            }
                        }
                    }
                }
                
                // show structure
                if (hex.type != 0) {
                    let _hexStructure = await onChain_call_hexStructure(_posX, _posY);
                    for (let _structureType=0; _structureType<=3; _structureType++) {
                        let _id = _hexStructure[_structureType];
                        if (_id > 0) {
                            let _x = hex.x-35;
                            let _y = hex.y+35;
                            let _structure;
                            if (_structureType == 1) {
                                _structure = scene.add.sprite(_x, _y, "craft_mining")
                                    .setOrigin(0.5)
                                    .setScale(0.01)
                                    .setDepth(102);
                            }
                            if (_structureType == 2) {
                                _structure = scene.add.sprite(_x+35, _y, "craft_farming")
                                    .setOrigin(0.5)
                                    .setScale(0.01)
                                    .setDepth(102);
                            }
                            if (_structureType == 0) {
                                _structure = scene.add.sprite(hex.x, hex.y, "logo_icon")
                                    .setOrigin(0.5)
                                    .setScale(0.05)
                                    .setDepth(102);
                                flag_isHouseExist = 1;
                            }
                        }
                    }
                }
                
                // insert into hex matrix
                //hexMatrix[_posX][_posY] = hex;
                if (hexMatrix[_posX] == null) {
                    hexMatrix[_posX] = new Array();
                }
                hexMatrix[_posX][_posY] = hex;
                
                // prepare pointerdown fc
                hex.on("pointerdown", () => {
                    if (flag_drag == 0) {   // ignore in mouse dragging

                        // reset map alpha
                        group_hex.setAlpha(0.4);

                        // select hex
                        hex.setAlpha(1);
                        hex_selected = hex;

                        // try dragging
                        if (flag_drag == 0) {
                            flag_drag = 1;
                            cameraTargetX = hex.x;
                            cameraTargetY = hex.y;
                            //console.log("start dragging:", cameraTargetX, cameraTargetY);
                        }

                        // move hexInfo window
                        hexInfoWindow.visible = true;
                        hexInfoWindow.x = hex.x + 40;
                        hexInfoWindow.y = hex.y + 75;

                        // prepare text
                        hexInfoWindow.text.x = hexInfoWindow.x+5;
                        hexInfoWindow.text.y = hexInfoWindow.y+5;
                        let _text = "";
                        _text += hex.posX + ", " + hex.posY + "\n";
                        _text += _dicClimate[hex.climate] + "\n";
                        _text += _dicHex[hex.type] + "\n";
                        if (hex.coin > 0) {
                            _text += "Coin: " + hex.coin + "\n";
                        }
                        if (hex.leaf > 0) {
                            _text += "Leaf: " + hex.leaf + "\n";
                        }
                        if (hex.flower > 0) {
                            _text += "Flower: " + hex.flower + "\n";
                        }
                        
                        // update text
                        hexInfoWindow.text.visible = true;
                        hexInfoWindow.text.setText(_text);
                        
                        // calc distance
                        let _dist = 
                            Math.sqrt( Math.pow(hex_current.x-hex.x,2) 
                            + Math.pow(hex_current.y-hex.y,2));
                        
                        // move button
                        if (
                            flag_moving == 0 
                            && hex != hex_current 
                            && hex.type != 5 
                            && hex.type != 4 
                            && _dist <= _hexagonWidth*2.1
                        ) {
                            hexInfoWindow.button_move.x = hexInfoWindow.x+50;
                            hexInfoWindow.button_move.y = hexInfoWindow.y+68;
                            hexInfoWindow.button_move.visible = true;
                        } else {
                            hexInfoWindow.button_move.visible = false;
                        }
                    }
                });
                
                // prepare poiterover and pointerout fc
                hex.on("pointerover", () => {
                    hex.setAlpha(1);
                });
                hex.on("pointerout", () => {
                    // when not selected, reset alpha
                    if (hex != hex_selected) {
                        hex.setAlpha(0.4);
                    }
                });
                
                // check current hex
                if (hex.posX == local_currentPos[0] && hex.posY == local_currentPos[1]) {
                    hex_current = hex;
                }
            }
        }
        
        //prepare hex_current
        //hex_current = hexMatrix[currentPos[0]][currentPos[1]];
        hex_current_indicator = scene.add.sprite(hex_current.x, hex_current.y, "hex_99")
            .setAlpha(0.5)
            .setOrigin(0.5)
            .setDepth(102)
            .setScale(0.95);
                
        //prepare hex_targetted
        hex_targetted_indicator = scene.add.sprite(0, 0, "hex_98")
            .setAlpha(0.5)
            .setOrigin(0.5)
            .setDepth(102)
            .setVisible(false)
            .setScale(0.95);
    }


    //### update
    update() {
    
        turn += 1;
        
        //$$$ drag
        if (flag_drag == 1) {
            // get current camera position
            let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
            let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
            // calc delta between target pos and current camera pos
            let _deltaX = cameraTargetX - _cameraX;
            let _deltaY = cameraTargetY - _cameraY;
            // def camera moving degree
            if ( Math.abs(_deltaX) > 5 ) {
                _cameraX = _cameraX + _deltaX/10;
            }
            if ( Math.abs(_deltaY) > 5 ) {
                _cameraY = _cameraY + _deltaY/10;
            }
            // camera moving
            this.cameras.main.centerOn(_cameraX, _cameraY);
            // detect dragging end
            if (Math.abs(_deltaX) <= 5 && Math.abs(_deltaY) <= 5) {
                flag_drag = 0;
                //console.log("end dragging", _cameraX, _cameraY);
            }
        }
        
        //$$$ key
        if (flag_drag == 0) {
            if (this.keys.keyW.isDown) {
                let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
                let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
                this.cameras.main.centerOn(_cameraX, _cameraY-10);
            }
            if (this.keys.keyA.isDown) {
                let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
                let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
                this.cameras.main.centerOn(_cameraX-10, _cameraY);
            }
            if (this.keys.keyD.isDown) {
                let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
                let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
                this.cameras.main.centerOn(_cameraX+10, _cameraY);
            }
            if (this.keys.keyS.isDown) {
                let _cameraX = this.cameras.main.worldView.x + 640 / this.cameras.main.zoom;
                let _cameraY = this.cameras.main.worldView.y + 480 / this.cameras.main.zoom;
                this.cameras.main.centerOn(_cameraX, _cameraY+10);
            }
            if (this.keys.keySPACE.isDown) {
                this.cameras.main.centerOn(murasakisan.x, murasakisan.y);
            }
        }
        
        //$$$ onChain
        if (turn % 200 == 0) {
            onChain_update_dynamicStatus();
        }
        
        //$$$ mode
        if (turn % 200 == 10) {
        
            // moving
            if (murasakisan.mode != "moving" && local_summonerMode == "moving"){
                hex_targetted = hexMatrix[local_targetPos[0]][local_targetPos[1]];
                murasakisan.hex_targetted = hex_targetted;
                murasakisan.mode = "moving_toHex";
                murasakisan.submode = 0;
                hexInfoWindow.button_move.visible = false;
                hex_targetted_indicator.visible = true;
                hex_targetted_indicator.x = hex_targetted.x;
                hex_targetted_indicator.y = hex_targetted.y;
                flag_moving = 1;
            }

            // mining
            if (murasakisan.mode != "mining" && local_summonerMode == "mining"){
                murasakisan.mode = "mining";
                murasakisan.submode = 0;
            }

            // farming
            if (murasakisan.mode != "farming" && local_summonerMode == "farming"){
                murasakisan.mode = "farming";
                murasakisan.submode = 0;
            }

            // crafting
            if (murasakisan.mode != "crafting" && local_summonerMode == "crafting"){
                murasakisan.mode = "crafting";
                murasakisan.submode = 0;
            }
            
            // resting
            if (
                (murasakisan.mode != "resting" && murasakisan.mode != "sleeping")
                 && local_summonerMode == "resting"
             ){
                murasakisan.mode = "resting";
                murasakisan.submode = 0;
            }
        }
    }
}


//---System

class System extends Phaser.Scene {

    //### constructor
    constructor() {
        super({ key:"System", active:false });
    }

    //### create
    create() {
        
        //info
        this.icon_coin = this.add.sprite(668, 25, "coin")
            .setScale(0.07)
            .setDepth(500);
        this.text_coin = this.add.text(685, 15, "0", _fontArg18)
            .setColor(_colorBlack);
        this.icon_leaf = this.add.sprite(815, 25, "leaf")
            .setScale(0.07)
            .setDepth(500);
        this.text_leaf = this.add.text(830, 15, "0", _fontArg18)
            .setColor(_colorBlack);
        this.icon_flower = this.add.sprite(962, 25, "flowers")
            .setScale(0.07)
            .setDepth(500);
        this.text_flower = this.add.text(977, 15, "0", _fontArg18)
            .setColor(_colorBlack);
        
        // system icon
        this.icon_zoomIn = this.add.sprite(1080, 930-15, "icon_zoomIn")
            .setOrigin(0.5)
            .setScale(1.2)
            .setDepth(500)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                scene_main.cameras.main.zoom *= 1.2;
                if (scene_main.cameras.main.zoom >= 4) {
                    scene_main.cameras.main.zoom = 4; // zoomIn limit
                }
            });
        this.icon_zoomOut = this.add.sprite(1080+75, 930-15, "icon_zoomOut")
            .setOrigin(0.5)
            .setScale(1.2)
            .setDepth(500)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                scene_main.cameras.main.zoom *= 0.8;
                if (scene_main.cameras.main.zoom <= 0.3) {
                    scene_main.cameras.main.zoom = 0.3; // zoomIn limit
                }
            });
        this.icon_zoomReset = this.add.sprite(1080+75+75, 930-15, "icon_zoomReset")
            .setOrigin(0.5)
            .setScale(1.2)
            .setDepth(500)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {
                scene_main.cameras.main.zoom = 2;
                scene_main.cameras.main.centerOn(murasakisan.x, murasakisan.y);
            });
        
        // debug info
        let _text = "";
        this.text_info = this.add.text(5, 900, "", _fontArg18)
            .setColor(_colorBlack);
        
        scene_system = this;
        this.time_forFPS = Date.now();
        this.turn_forFPS = 0;
    }
    
    //### update
    update() {
        if (turn % 200 == 100) {
            this.text_coin.setText(local_coin);
            this.text_leaf.setText(local_leaf);
            // prepare flower count
            let _sign = "+";
            if ( local_flower_additionPerHour < 0) {
                _sign = "-";
            }
            let _text = local_flower + " (" + _sign + Math.abs(local_flower_additionPerHour) + " /hr)";
            this.text_flower.setText(_text);
        }
        if (turn % 200 == 110) {
            let _text = "";
            _text += "turn: " + turn + "\n";
            _text += "day: " + local_day + "\n";
            _text += "fps: " + this.fps + "\n";
            this.text_info.setText(_text);
        }
        this.calc_fps();
    }
    
    calc_fps() {
        let _now = Date.now();
        if (_now >= this.time_forFPS + 1000) {
            this.time_forFPS = _now;
            let _fps = (turn - this.turn_forFPS);
            this.turn_forFPS = turn; 
            this.fps = _fps;
        }
    }
}


//===Phaser3==================================================================================


let config = {
    type: Phaser.CANVAS,
    parent: 'canvas',
    backgroundColor: "E3E3E3",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 960,
    },
    scene: [
        Main,
        System,
    ],
    fps: {
        target: 60,
        //forceSetTimeOut: true
    },
};


var game = new Phaser.Game(config);

