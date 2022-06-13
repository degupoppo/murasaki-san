

//---ToDo---------------------------------------------------------------------------------------------


/*

1st

    有価証券への抵触の回避
        https://www.pwc.com/jp/ja/knowledge/prmagazine/pwcs-view/202205/38-06.html
        有価証券：集団投資スキーム持分
            ①権利を有する者（以下「出資者」）が金銭等を出資または拠出すること
            ②出資または拠出された金銭等を充てて事業（以下「出資対象事業」）が行われること
            ③出資者が出資対象事業から生ずる収益の配当または当該出資対象事業に係る財産の分配を受けることができる権利であること
        dapps stakingのリワードを分配するnftは有価証券に抵触する可能性がある
        懸念点：
            1, ユーザーのdapp stakingへの登録が出資・拠出にあたるのかどうか
            2, ゲーム運営が事業に当たるのかどうか
            3, dapp stakingのリワードをcommunity poolへ入れてその一部を分配するのが「利益の配当」に当たるのかどうか
        ケースとしては、dapps stakingに何も入れていない人が、宝石箱NFTからリワードを得る場合もありうる
        この場合は、配当権利はあるが拠出を行っていないので該当なしだろうか
        また、運営が事業を行って事業利益を分配、というよりは、
            dapps stakingの報酬を手つかずで分配している
            しかし、dapps stakingのリワードが運営利益とみなされるのならば、
            利益の分配権とみなされるだろうか。
        大本のmurasaki-san NTTは、mint時に「寄付」を受けるとするか。

    Updateコードのリファクタリング
        group_forUpdateを作製してchildUpdateをtrueにする。
        diceやsummoner, starなどupdateを持つclassはここに集約する
        update頻度は個別のclass.update()内でturn % == 2などで調整する
        本体のupdate()内には情報の更新などのみを記載する
        また、可能であれば、fps=30で軽量化を図る

    新NFT群の考案
        トレードインセンティブ
            トレードしたほうが有利になる機構
            一人で集めるのは効率が悪いように設計する
        ERC3664
            動的なパラメータを有するNFT規格
            他の静的NFTを所有する
            一方向に、ポジティブな方向にのみ動的に変化させたい
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

    レベルアップの演出の実装
     ok 花火の音の実装, emitter
        summonerの専用アニメーションの用意
        レベルアップの文字の表示

    帽子の普遍的な位置合わせ
            
    メール送信成功のメッセージを実装
        相手がメールを開けたことがわかるように
    
    NFTのURL取得方法の実装
    
    Tokenのコントラクトの書き換え

2nd                

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

    ハート経済の深慮
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

*/


//---global variants-------------------------------------------------------------------------------------------------


function init_global_variants() {

    //===on_chain static
    summoner = -1;
    local_birth_time = Date.now();
    SPEED = 1;
    BASE_SEC = 86400;

    //===on_chain dynamic
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
    local_items = [0] * 256;
    local_heart = 0;
    local_wallet = "0x0000000000000000000000000000000000000001";
    local_owner = "0x0000000000000000000000000000000000000000";
    local_name_str = "(unnamed)";
    local_notPetrified = true;
    local_isActive = 0;
    local_rolled_dice = 0;
    local_last_rolled_dice = 0;
    local_last_dice_roll_time = Date.now();
    local_mail_sending_interval = -1;
    local_score = 0;

    //===local previous
    previous_local_last_feeding_time = 0;
    previous_local_last_grooming_time = 0;
    previous_local_level = 0;
    previous_local_mining_status = -1;
    previous_local_farming_status = -1;
    previous_local_crafting_status = -1;
    previous_local_exp = 0.01;
    previous_local_coin = 0;
    previous_local_material = 0;
    previous_local_items = [0] * 256;
    previous_local_name_str = "[0] * 256";
    previous_local_item194 = 0;
    previous_local_item195 = 0;
    previous_local_item196 = 0;
    previous_local_item197 = 0;
    previsou_local_rolled_dice = 0;
    previous_local_score = 0;
    previous_satiety = 0;
    previous_happy = 0;
    
    //===local etc
    turn = 0;
    local_coin_calc = 0;
    local_material_calc = 0;
    local_crafting_calc = 0;
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
    happy = 0;
    satiety = 0;
    screen_happy = 0;
    screen_happy_delta = 0;
    screen_satiety = 0;
    screen_satiety_delta = 0;
    item_wearing_hat = 0;
    active_nui_id = 0;

    //===flag
    flag_music = 0;
    flag_radarchart = 0;
    flag_doneFp = 0;
    flag_dice_rolling = 0;
    flag_name_minting = 0;
    flag_mail = false;
    flag_tokenBall = 0;
    flag_loaded = 0;
    flag_item_update = 0;
    flag_summon_star = 0;
}

init_global_variants();


//---html-----------------------------------------------------------------------------------------------------


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


//---fingerprint-------------------------------------------------------------------------------------------------


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


//---web3-----------------------------------------------------------------------------------------------------


//===call

//update summoner of wallet
async function contract_update_summoner_of_wallet() {
    if (summoner <= 0) {
        let web3 = await connect();
        let wallet = await get_wallet(web3);
        let contract_mm = await new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
        summoner = await contract_mm.methods.tokenOf(wallet).call();  //have not summoned yet: 0
    }
}

//update name
async function contract_update_name(_summoner) {
    if (local_isActive == false) {
        return 0;
    }
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mn = await new web3.eth.Contract(abi_murasaki_function_name, contract_murasaki_function_name);
    local_name_str = await contract_mn.methods.call_name_from_summoner(_summoner).call();
}

//update dice
async function contract_update_dice(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_d = await new web3.eth.Contract(abi_world_dice, contract_world_dice);
    local_rolled_dice = await contract_d.methods.get_rolled_dice(_summoner).call();
    local_last_rolled_dice = await contract_d.methods.get_last_rolled_dice(_summoner).call();
    local_last_dice_roll_time = await contract_d.methods.last_dice_roll_time(_summoner).call();
}

//update static_parameters
async function contract_update_statics(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_ms = await new web3.eth.Contract(abi_murasaki_strage, contract_murasaki_strage);
    local_isActive = await contract_ms.methods.isActive(_summoner).call();
    if (local_isActive == false) {
        return 0;
    }
    SPEED = await contract_ms.methods.SPEED().call();   //220311: speed was modified as 100%=x1
    SPEED = Number(SPEED) / 100;
    let contract_mfs = await new web3.eth.Contract(abi_murasaki_function_share, contract_murasaki_function_share);
    let _static_status = await contract_mfs.methods.get_static_status_array(_summoner).call();
    local_class = Number(_static_status[0]);
    local_birth_time = Number(_static_status[1]);
    let contract_mm = await new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
    let _owner = await contract_mm.methods.ownerOf(_summoner).call();
    local_owner = _owner;
    let contract_mffg = await new web3.eth.Contract(abi_murasaki_function_feeding_and_grooming, contract_murasaki_function_feeding_and_grooming);
    local_notPetrified = await contract_mfs.methods.not_petrified(_summoner).call();
}

//update mining/farming/crafting
async function contract_update_working(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mfc = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let contract_mfmf = await new web3.eth.Contract(abi_murasaki_function_mining_and_farming, contract_murasaki_function_mining_and_farming);
    if (local_mining_status == 1){
        local_coin_calc = await contract_mfmf.methods.calc_mining(_summoner).call();
        local_coin_calc = Number(local_coin_calc);
    }else if (local_farming_status == 1) {
        local_material_calc = await contract_mfmf.methods.calc_farming(_summoner).call();
        local_material_calc = Number(local_material_calc);
    }else if (local_crafting_status == 1) {
        local_crafting_calc = await contract_mfc.methods.calc_crafting(_summoner).call();
        local_crafting_calc = Number(local_crafting_calc);
    }
}

//update dynamic_parameters
async function contract_update_status(_summoner) {

    let web3 = await connect();
    let wallet = await get_wallet(web3);

    //contract
    let contract_mfs = await new web3.eth.Contract(abi_murasaki_function_share, contract_murasaki_function_share);

    //check isActive
    if (local_isActive == false) {
        count_sync += 1;
        return 0;
    }
    
    //wallet
    local_wallet = wallet;

    //call dynamic status from ms
    let _dynamic_status = await contract_mfs.methods.get_dynamic_status_array(_summoner).call();

    //update local variants
    local_level = Number(_dynamic_status[0]);
    local_exp = Number(_dynamic_status[1]);
    local_strength = Number(_dynamic_status[2])/100;
    local_dexterity = Number(_dynamic_status[3])/100;
    local_intelligence = Number(_dynamic_status[4])/100;
    local_luck = Number(_dynamic_status[5])/100;
    local_next_exp_required = Number(_dynamic_status[6]);
    //7: last_level_up_time
    local_coin = Number(_dynamic_status[8]);
    local_material = Number(_dynamic_status[9]);
    local_last_feeding_time = Number(_dynamic_status[10]);
    local_last_grooming_time = Number(_dynamic_status[11]);
    local_mining_status = Number(_dynamic_status[12]);
    local_mining_start_time = Number(_dynamic_status[13]);
    local_farming_status = Number(_dynamic_status[14]);
    local_farming_start_time = Number(_dynamic_status[15]);
    local_crafting_status = Number(_dynamic_status[16]);
    local_crafting_start_time = Number(_dynamic_status[17]);
    local_crafting_item_type = Number(_dynamic_status[18]);
    local_heart = Number(_dynamic_status[27]);

    //dice, when rolling, high frequency update
    if (flag_dice_rolling == 1 && local_items[36] > 0) {
        await contract_update_dice(_summoner);
    }
    
    //name minting
    if (flag_name_minting == 1) {
        contract_update_name(_summoner);
        if (local_name_str != "") {
            flag_name_minting = 0;
        }
    }
    
    if(flag_item_update == 1) {
        local_items = await contract_mfs.methods.get_balance_of_type_array(local_owner).call();
        flag_item_update = 0;
    }

    //low frequency updates
    if (count_sync % 5 == 0) {

        //call item
        local_items = await contract_mfs.methods.get_balance_of_type_array(local_owner).call();
        //local_heart = Number(local_items[193]);

        //update mining, farming, crafting calculation
        contract_update_working(_summoner);

        //update dice
        if (flag_dice_rolling == 0 && local_items[36] > 0) {
            await contract_update_dice(_summoner);
        }
        
        //check mail
        //***TODO*** item_id = 1
        contract_check_mail(summoner);
        //if (local_items[20] > 0) {
        if (local_items[1] > 0) {
            contract_calc_sending_interval(summoner);
        }
        
        //update score
        local_score = await contract_mfs.methods.calc_score(_summoner).call();
    }
    
    //debug
    //console.log("status:", _dynamic_status, "items:", local_items);

    //update last_sync_time
    last_sync_time = Date.now();
    count_sync += 1;
}

//update_all, at the first
async function contract_update_all() {
    await contract_update_summoner_of_wallet();
    await contract_update_statics(summoner);
    await contract_update_name(summoner);
    await contract_update_status(summoner);
}

//check mail
async function contract_check_mail(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mml = await new web3.eth.Contract(abi_murasaki_mail, contract_murasaki_mail);
    flag_mail = await contract_mml.methods.check_receiving_mail(_summoner).call();
    //console.log(flag_mail);
}

//calc mail sending interval
async function contract_calc_sending_interval(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mml = await new web3.eth.Contract(abi_murasaki_mail, contract_murasaki_mail);
    local_mail_sending_interval = await contract_mml.methods.calc_sending_interval(_summoner).call();
}

//get item_nui, summoner and score
async function contract_get_item_nui(_item) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_msn = await new web3.eth.Contract(abi_murasaki_strage_nui, contract_murasaki_strage_nui);
    /*
    let _nui = await contract_msn.methods.nuis(_item).call();
    return _nui;
    */
    let _summoner_of_nui = await contract_msn.methods.summoner(_item).call();
    let _class = await contract_msn.methods.class(_item).call();
    let _score = await contract_msn.methods.score(_item).call();
    let contract_mfs = await new web3.eth.Contract(abi_murasaki_function_share, contract_murasaki_function_share);
    let _exp_rate = await contract_mfs.methods.calc_exp_addition_rate(summoner, _item).call();
    return [_summoner_of_nui, _class, _score, _exp_rate];
}

//get heart required
async function contract_get_heart_required(_item_type) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let _heart_required = await contract.methods.get_heart_required(_item_type).call();
    return _heart_required;
}

//call name from summoner id
async function call_name_from_summoner(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_name, contract_murasaki_function_name);
    let _name = await contract.methods.call_name_from_summoner(_summoner).call();
    return _name;
}

//call amount of token
//https://qiita.com/ramo798/items/0cc2c556410c95b0b332
async function call_amount_of_token(_contract_address) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
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
    let contract = await new web3.eth.Contract(minABI, _contract_address);
    let balance = await contract.methods.balanceOf(wallet).call();
    let decimal = await contract.methods.decimals().call();
    return balance / (10 ** decimal);
}

//===send

//summon
async function contract_summon(_class) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_summon_and_levelup, contract_murasaki_function_summon_and_levelup);
    let contract_ms = await new web3.eth.Contract(abi_murasaki_strage, contract_murasaki_strage);
    let _price = await contract_ms.methods.PRICE().call();
    _price = Number(_price) * 10**18;
    let wallet = await get_wallet(web3);
    contract.methods.summon(_class).send({from:wallet, value:_price});
}

//cure petrification
async function contract_curePetrification(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_ms = await new web3.eth.Contract(abi_murasaki_strage, contract_murasaki_strage);
    let _price = await contract_ms.methods.PRICE().call();
    let contract = await new web3.eth.Contract(abi_murasaki_function_feeding_and_grooming, contract_murasaki_function_feeding_and_grooming);
    _price = Number(_price) * 10**18 * local_level;
    contract.methods.cure_petrification(_summoner).send({from:wallet, value:_price});
}

//burn
async function contract_burn(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_summon_and_levelup, contract_murasaki_function_summon_and_levelup);
    let wallet = await get_wallet(web3);
    contract.methods.burn(_summoner).send({from:wallet});
}

//levelup
async function contract_level_up(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_summon_and_levelup, contract_murasaki_function_summon_and_levelup);
    let wallet = await get_wallet(web3);
    contract.methods.level_up(_summoner).send({from:wallet});
}

//feeding
async function contract_feeding(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_feeding_and_grooming, contract_murasaki_function_feeding_and_grooming);
    let wallet = await get_wallet(web3);
    contract.methods.feeding(_summoner, active_nui_id).send({from:wallet});
}

//grooming
async function contract_grooming(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_feeding_and_grooming, contract_murasaki_function_feeding_and_grooming);
    let wallet = await get_wallet(web3);
    contract.methods.grooming(_summoner, active_nui_id).send({from:wallet});
}

//mining
async function contract_mining(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_mining_and_farming, contract_murasaki_function_mining_and_farming);
    let wallet = await get_wallet(web3);
    if (local_mining_status == 0) {
        contract.methods.start_mining(_summoner).send({from:wallet});
    }else {
        contract.methods.stop_mining(_summoner).send({from:wallet});
    }
}

//farming
async function contract_farming(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_mining_and_farming, contract_murasaki_function_mining_and_farming);
    let wallet = await get_wallet(web3);
    if (local_farming_status == 0) {
        contract.methods.start_farming(_summoner).send({from:wallet});
    }else {
        contract.methods.stop_farming(_summoner).send({from:wallet});
    }
}

//crafting
async function contract_crafting(_summoner) {
    if (local_crafting_status == 0 && global_selected_crafting_item == 0) {
        return 0;
    }
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let wallet = await get_wallet(web3);
    let _item_type = global_selected_crafting_item;
    if (local_crafting_status == 0) {
        contract.methods.start_crafting(_summoner, _item_type).send({from:wallet});
    }else {
        contract.methods.stop_crafting(_summoner).send({from:wallet});
    }
}
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

//send mail
async function contract_send_mail(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    //select mail
    let contract_mc = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let myListLength = await contract_mc.methods.myListLength(wallet).call();
    let myListsAt = await contract_mc.methods.myListsAt(wallet, 0, myListLength).call();
    let _item_mail = 0;
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[i];
        _items = await contract_mc.methods.items(_item).call();
        let _item_type = _items[0];
        if (_item_type == 196) {
            _item_mail = _item;
            break;
        }
    }
    console.log(_item_mail);
    if (_item_mail != 0) {
        let contract_mm = await new web3.eth.Contract(abi_murasaki_mail, contract_murasaki_mail);
        contract_mm.methods.send_mail(_summoner, _item_mail).send({from:wallet});
    }
}

//open mail
async function contract_open_mail(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mml = await new web3.eth.Contract(abi_murasaki_mail, contract_murasaki_mail);
    contract_mml.methods.open_mail(_summoner).send({from:wallet});
}

//get item dc
async function contract_get_item_dc(item_type) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    //let wallet = await get_wallet(web3);
    let item_dc = await contract.methods.get_item_dc(item_type).call();
    return item_dc;
}
async function contract_get_modified_dc(_summoner, _item_type) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let _modified_dc = await contract.methods.get_modified_dc(_summoner, _item_type).call();
    return _modified_dc;
}

//calc item
async function contract_get_item_count(_summoner) {
    let web3 = await connect();
    let contract_mm = await new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
    let contract_mfmf = await new web3.eth.Contract(abi_murasaki_function_mining_and_farming, contract_murasaki_function_mining_and_farming);
    let contract_mfc = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let _owner = await contract_mm.methods.ownerOf(_summoner).call();
    let _mining_item_count = await contract_mfmf.methods.count_mining_items(_owner).call();
    let _farming_item_count = await contract_mfmf.methods.count_farming_items(_owner).call();
    let _crafting_item_count = await contract_mfc.methods.count_crafting_items(_owner).call();
    let _luck_item_count = 0;
    return [Number(_mining_item_count)/100, Number(_farming_item_count)/100, Number(_crafting_item_count)/100, _luck_item_count];
}

//mint name
async function contract_mint_name(_summoner, _name_str) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_name, contract_murasaki_function_name);
    let wallet = await get_wallet(web3);
    contract.methods.mint(_summoner, _name_str).send({from:wallet});
}

//burn name
async function contract_burn_name(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_name, contract_murasaki_function_name);
    let wallet = await get_wallet(web3);
    contract.methods.burn(_summoner).send({from:wallet});
}

//get_userItems_bag
async function get_userItems(_summoner, _target_item_type) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mm = await new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
    let _owner = await contract_mm.methods.ownerOf(_summoner).call();
    //contract
    let contract = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let myListLength = await contract.methods.myListLength(_owner).call();
    let myListsAt = await contract.methods.myListsAt(_owner, 0, myListLength).call();
    let _array_items = [];
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[i];
        _items = await contract.methods.items(_item).call();
        let _item_type = _items[0];
        if (_item_type == _target_item_type) {
            _array_items.push(_item);
        }
    }
    return _array_items;
}

//unpack_bag
async function unpack_bag(_summoner, _item) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mc = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let contract_mfc = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let _res = await contract_mc.methods.isApprovedForAll(wallet, contract_murasaki_function_crafting).call();
    if (_res == false) {
        contract_mc.methods.setApprovalForAll(contract_murasaki_function_crafting, true).send({from:wallet});
    } else {
        contract_mfc.methods.unpack_bag(_summoner, _item).send({from:wallet});
    }
}

//dice_roll
async function dice_roll(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_world_dice, contract_world_dice);
    contract.methods.dice_roll(_summoner).send({from:wallet});
}


//---class:Murasakisan-----------------------------------------------------------------------------------------------------


class Murasakisan extends Phaser.GameObjects.Sprite{
    
    constructor(scene, x, y){
        super(scene, x, y, "murasaki_sleeping");
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
    
    //===on_click
    on_click() {
        if (this.mode == "resting" || this.mode == "moving") {
            this.count = 0;
            this.mode = "hugging";
        }
    }
    
    //===resting
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
    
    //===moving
    moving() {
        this.count += 1;
        //determine direction
        if (this.count == 1){
            //determine degree, 0-30, 150-210, 330-360
            var li = [0,10,20,30,150,160,170,180,190,200,210,330,340,350]
            this.moving_degree = li[Math.floor(Math.random() * li.length)];
            //out of area check
            if (this.x < 200 && this.moving_degree > 90 && this.moving_degree <270) {
                this.moving_degree -= 180;
            }else if (this.x > 1000 && (this.moving_degree < 90 || this.moving_degree > 270)) {
                this.moving_degree -= 180;
            }
            if (this.y > 760 && this.moving_degree > 180) {
                this.moving_degree = 360 - this.moving_degree;
            }else if (this.y < 500 && this.moving_degree < 180) {
                this.moving_degree = 360 - this.moving_degree;
            }
            //minus check
            if (this.moving_degree < 0) {
                this.moving_degree += 360;
            }
            //determine speed, count
            this.moving_speed = 0.5 + Math.random() * 0.3;  //0.5-0.8
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

            //***TODO*** tokenBall
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

            //***TODO*** star
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
                        group_star.getChildren()[i].on_click();
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
    
    //===feeding
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
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.9;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.9;
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
            group_food.destroy(true);
            this.count_limit = this.count + 1000;
            this.submode = 3;
        }else if (this.submode == 3) {
            if (this.count % 200 == 10) {
                sound_happy.play();
            }
            if (this.count >= this.count_limit) {
                this.mode = "resting";
                this.count = 0;
            }
        }
    }
    
    //===crying
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
    
    //===hungry
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
    
    //===petrified
    petrified() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_stone", true);
        }
    }
    
    //===sleeping
    sleeping() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_sleeping", true);
        }else if (this.count >= 1500) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    
    //===listning
    listning() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_listning", true);
        }else if (this.count >= 750) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    
    //===grooming
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
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.9;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.9;
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
                this.y = 400 + 50
                this.mode = "resting";
                this.count = 0;
                item_bear.visible = true;
            }
        }
    }
    
    //===mining
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
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.2;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.2;
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
        }
    }
    
    //===hugging
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
    
    //===farming
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
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.2;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.2;
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
        }
    }
    
    //===crafting
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
            let delta_x2 = delta_x / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.2;
            let delta_y2 = delta_y / (Math.abs(delta_x) + Math.abs(delta_y)) * 1.2;
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
    
    //===update wearing_hat
    update_item_wearing_hat() {

        if (
            this.mode == "resting"
            || this.mode == "moving"
            || this.mode == "hugging"
            || this.mode == "hungry"
            || this.mode == "crying"
            || this.mode == "listning"
        ) {
            item_wearing_hat.x = this.x;
            item_wearing_hat.y = this.y - 65;
        }else if (this.mode == "sleeping") {
            item_wearing_hat.x = this.x - 20;
            item_wearing_hat.y = this.y - 25;
        }else if (this.mode == "mining" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "mining" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 5;
            item_wearing_hat.y = this.y - 50;
        }else if (this.mode == "mining" && this.submode == 2) {
            item_wearing_hat.x = this.x + 32;
            item_wearing_hat.y = this.y - 75;
        }else if (this.mode == "farming" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y + 15;
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
            item_wearing_hat.x = this.x + 2;
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
        //depth
        //item_wearing_hat.depth = item_wearing_hat.y + 100;
        item_wearing_hat.depth = this.y + 1;
    }
    
    //===update()
    update(){
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
        //draw item_wearing_hat
        if (item_wearing_hat != 0) {
            this.update_item_wearing_hat();
        }
        //depth
        this.depth = this.y;
    }
}


//---class:Pet-----------------------------------------------------------------------------------------------------


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

    //===on_click
    on_click() {
        /*
        if (this.mode == "resting" || this.mode == "moving") {
            this.count = 0;
            this.mode = "hugging";
        }
        */
    }

    //===resting
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
    	            this.target_y = murasakisan.target_y + 30;
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

    //===moving
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
            this.moving_speed = 0.2 + Math.random() * 0.1;  //0.3-0.5
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

    //===working
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

    //===sleeping
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

    //===update()
    update(){
        if (this.mode == "resting") {this.resting();}
        else if (this.mode == "moving") {this.moving();}
        //else if (this.mode == "sleeping") {this.sleeping();}
        else if (this.mode == "working") {this.working();}
        //depth
        this.depth = this.y;
    }
}


//---class:Dice-----------------------------------------------------------------------------------------------------

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
    
    //===on_click
    on_click() {
        this.speed_x = 8 + Math.random() * 5;
        
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        
        /*
        //DOES NOT WORK in phone
        //if (game.input.mousePointer.x > this.x) {
        if (game.input.activePointer.position.x > this.x) {
        //if (game.input.pointer1.x > this.x) {
            this.speed_x *= -1;
        }
        */

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
    
    //===update()
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
            } else if (_next_sec <= this.buffer_sec ) {
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
            this.text_next_time.visible = true;
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
                    this.speed_x -= 0.1 * 3;
                } else {
                    this.speed_x -= 0.1;
                }
            } else {
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x += 0.1 * 3;
                } else {
                    this.speed_x += 0.1;
                }
            }
            //reduction of y speed
            this.speed_y -= 0.98;
            //position moving
            this.x += this.speed_x;
            this.y -= this.speed_y;
            //increase angle
            this.angle += this.speed_x * 3;
            //refrection y
            if (this.y >= this.line_y) {
                this.y = this.line_y;
                this.speed_y *= -0.5;   //bounce coefficient
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
        //dice rolling
        if (flag_dice_rolling == 1 && this.count % 2 == 0) {
            //this.text_rolled_number.setText(Math.round(Math.random()*20));
            this.text_rolled_number.setText(this.count / 2 % 20 + 1);
            this.text_next_time.setText("Rolling!").setFill("#ff0000");
        }
    }
}


//---class:tokenBall-----------------------------------------------------------------------------------------------------


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
    
    //===on_click
    on_click() {
        this.speed_x = 8 + Math.random() * 4;
        //this.speed_x = 8 + Math.random() * 5;
        
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        
        /*
        //DOES NOT WORK in phone
        //if (game.input.mousePointer.x > this.x) {
        if (game.input.activePointer.position.x > this.x) {
        //if (game.input.pointer1.x > this.x) {
            this.speed_x *= -1;
        }
        */

        this.speed_y = 6 + Math.random() * 4;
        //this.speed_y = 8 + Math.random() * 5;
        this.count = 0;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        sound_dice.play();
    }
    
    //===on_summon
    on_summon() {
        this.speed_x = -1 * (5 + Math.random() * 10);
        this.speed_y = 10 + Math.random() * 10;
        this.count = 0;
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        //sound_dice.play();
    }
    
    //===update()
    update(){
        this.count += 1;
        if (this.count % 2 == 0) {
            return 0;
        }
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
                    this.speed_x -= 0.1 * 3;
                } else {
                    this.speed_x -= 0.1;
                }
            } else {
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x += 0.1 * 3;
                } else {
                    this.speed_x += 0.1;
                }
            }
            //reduction of y speed
            this.speed_y -= 0.98;
            //position moving
            this.x += this.speed_x;
            this.y -= this.speed_y;
            //increase angle
            this.angle += this.speed_x * 5;
            //refrection y
            if (this.y >= this.line_y) {
                this.y = this.line_y;
                this.speed_y *= -0.5;   //bounce coefficient
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


//---class:Star-----------------------------------------------------------------------------------------------------


class Star extends Phaser.GameObjects.Sprite{
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
    
    //===on_click
    on_click() {
        this.speed_x = 8 + Math.random() * 6;
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        this.speed_y = 6 + Math.random() * 6;
        this.count = 0;
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        //sound
        sound_dice.play();
    }
    
    //===on_summon
    on_summon() {
        this.x = 800 + Math.random() * 400;
        this.y = -50;
        this.speed_x = -10 - Math.random() * 5;
        this.speed_y = -20;
        this.count = 0;
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.line_y_max+100 + this.a * this.x;
        //sound
        //sound_dice.play();
    }
    
    //===update()
    update(){
        this.count += 1;
        if (this.count % 2 == 0) {
            return;
        }
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
                    this.speed_x -= 0.1 * 3;
                } else {
                    this.speed_x -= 0.1;
                }
            } else {
                if (Math.abs(this.speed_y) <= 0.5) {
                    this.speed_x += 0.1 * 3;
                } else {
                    this.speed_x += 0.1;
                }
            }
            //reduction of y speed
            this.speed_y -= 0.98;
            //position moving
            this.x += this.speed_x;
            this.y -= this.speed_y;
            //increase angle
            this.angle += this.speed_x * 5;
            //refrection y
            if (this.y >= this.line_y) {
                this.y = this.line_y;
                this.speed_y *= -0.2;   //bounce coefficient
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


//---functions-----------------------------------------------------------------------------------------------------


//===bar
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

//===button
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

//===music
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

//===radar chart
function radarchart(scene, x0, y0, r, str, dex, int, luk, str_item, dex_item, int_item, luk_item) {
    //base
    let base = 25;
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
    let y1i = -r * (str+str_item)/base;
    let x2i = r * (dex+dex_item)/base;
    let y3i = r * ((luk+luk_item-3)/(base/2) + 3/base);
    let x4i = -r * (int+int_item)/base;
    //dice
    let y1d = -r * (str+str_item)/base;
    let x2d = r * (dex+dex_item)/base;
    let y3d = r * ((luk+luk_item+local_rolled_dice/100-3)/(base/2) + 3/base);
    let x4d = -r * (int+int_item)/base;
    //remove old chart
    try {
        group_chart.destroy(true);
    } catch(error) {
        ;
    }
    //draw
    group_chart = scene.add.group();
    group_chart.add(scene.add.polygon(x0+r, y0+r, [0,-r,r,0,0,r,-r,0], 0xDADADA, 0.4));
    group_chart.add(scene.add.polygon(x0+r*0.75, y0+r*0.75, [0,-r*0.75,r*0.75,0,0,r*0.75,-r*0.75,0], 0xDADADA, 0.4));
    group_chart.add(scene.add.polygon(x0+r/2, y0+r/2, [0,-r/2,r/2,0,0,r/2,-r/2,0], 0xDADADA, 0.4));
    group_chart.add(scene.add.polygon(x0+(-x4d+x2d)/2, y0+(-y1d+y3d)/2, [x1,y1d,x2d,y2,x3,y3d,x4d,y4], 0xF29B76, 1));
    group_chart.add(scene.add.polygon(x0+(-x4i+x2i)/2, y0+(-y1i+y3i)/2, [x1,y1i,x2i,y2,x3,y3i,x4i,y4], 0xF9C270, 1));
    group_chart.add(scene.add.polygon(x0+(-x4+x2)/2, y0+(-y1+y3)/2, [x1,y1,x2,y2,x3,y3,x4,y4], 0xFFF67F, 1));
    let font_arg = {font: "17px Arial", fill: "#000000"};
    group_chart.add(scene.add.text(x0-15, y0-r-25, "STR"+"\n"+(Math.round( (str+str_item)*100 )/100).toFixed(2), font_arg));
    group_chart.add(scene.add.text(x0+r-5, y0-10, "DEX"+"\n"+(Math.round( (dex+dex_item)*100 )/100).toFixed(2), font_arg));
    group_chart.add(scene.add.text(x0-15, y0+r-7, "LUK"+"\n"+(Math.round( (luk+luk_item+local_rolled_dice/100)*100 )/100).toFixed(2), font_arg));
    group_chart.add(scene.add.text(x0-r-20, y0-12, "INT"+"\n"+(Math.round( (int+int_item)*100 )/100).toFixed(2), font_arg));
    group_chart.add(scene.add.sprite(x0-15-10, y0-r-25+20, "icon_str").setOrigin(0.5).setScale(0.12));
    group_chart.add(scene.add.sprite(x0+r-5+10, y0-30, "icon_dex").setOrigin(0.5).setScale(0.12));
    group_chart.add(scene.add.sprite(x0-15-12, y0+r-5+14, "icon_luk").setOrigin(0.5).setScale(0.10));
    group_chart.add(scene.add.sprite(x0-r-20+16, y0-10-16, "icon_int").setOrigin(0.5).setScale(0.10));
}
async function draw_radarchart(scene) {
        let _x = 1160;
        let _y = 115;
        let _r = 75;
        let _res = await contract_get_item_count(summoner);
        radarchart(scene, _x, _y, _r, local_strength, local_dexterity, local_intelligence, local_luck, _res[0], _res[1], _res[2], local_heart*5/100);
}


//===window:craft
function open_window_craft (scene) {

    sound_window_open.play();

    //TOFIX: prevent loading error
    if (local_level == 0) {
        return 0;
    }

    //function, closing: destroy group and update selecte_item
    async function close_crafting_window(_item) {
        //destroy group
        group_window_crafting.destroy(true);
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
            let _heart_required = await contract_get_heart_required(_item);
            global_selected_crafting_item_required_heart = _heart_required;
            text_crafting_selected_item_heart.setText(_heart_required);
            icon_crafting_heart.visible = true;
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
        }else if (rarity == "uncommon") {
            _color = "black";
        }else if (rarity == "rare") {
            _color = "black";
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
    item5_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  5, "item_sushi").setScale(0.1);
    item6_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  6, "item_crown").setScale(0.15);
    item7_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  7, "item_ribbon").setScale(0.12);
    item8_icon = scene.add.sprite(_x-25, _y+12 + _y_add *  8, "item_window").setScale(0.12);
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
    item24_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  8, "rug-pull").setScale(0.15);
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
    item37_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  5, "item_pancake").setScale(0.14);
    item38_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  6, "item_violin").setScale(0.08);
    item39_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  7, "item_piano").setScale(0.08);
    item40_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  8, "item_switch").setScale(0.1);
    item41_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  9, "item_lanthanum").setScale(0.08);
    group_window_crafting.add(item33_icon);
    group_window_crafting.add(item34_icon);
    group_window_crafting.add(item35_icon);
    group_window_crafting.add(item36_icon);
    group_window_crafting.add(item37_icon);
    group_window_crafting.add(item38_icon);
    group_window_crafting.add(item39_icon);
    group_window_crafting.add(item40_icon);
    group_window_crafting.add(item41_icon);

    //special items
    let _rarity;

    //coin/material bag
    if (local_items[194] > 0) { _rarity = "common" } else { _rarity = null }
    button_crafting_item194  = create_button(170, 80 + 40*17, "[" +local_items[194]+ "] Ohana Bank", 194,  scene, _rarity);
    if (local_items[195] > 0) { _rarity = "common" } else { _rarity = null }
    button_crafting_item195  = create_button(520, 80 + 40*17, "[" +local_items[195]+ "] Kusa Pouch", 195,  scene, _rarity);
    item194_icon = scene.add.sprite(170-25, 80+17 + 40*17, "item_bank").setScale(0.16);
    item195_icon = scene.add.sprite(520-25, 80+17 + 40*17, "item_kusa_pouch").setScale(0.05);
    group_window_crafting.add(button_crafting_item194);
    group_window_crafting.add(button_crafting_item195);
    group_window_crafting.add(item194_icon);
    group_window_crafting.add(item195_icon);
    
    //mail
    if (local_items[196] > 0) { _rarity = "common" } else { _rarity = null }
    button_crafting_item196  = create_button(870, 80 + 40*17, "[" +local_items[196]+ "] Cat Mail", 196,  scene, _rarity);
    item196_icon = scene.add.sprite(870-25, 80+15 + 40*17, "item_mail").setScale(0.05);
    group_window_crafting.add(button_crafting_item196);
    group_window_crafting.add(item196_icon);

    //nui
    if (local_items[197] > 0) { _rarity = "common" } else { _rarity = null }
    button_crafting_item197  = create_button(870, 80 + 40*18, "[" +local_items[197]+ "] Coddly Toy", 197,  scene, _rarity);
    item197_icon = scene.add.sprite(870-25, 80+20 + 40*18, "item_nui").setScale(0.15);
    group_window_crafting.add(button_crafting_item197);
    group_window_crafting.add(item197_icon);

    //calcel
    _rarity = "common";
    button_crafting_close = create_button(1070, 840, "Cancel", 0, scene, _rarity);
    group_window_crafting.add(button_crafting_close);
    
    //depth
    group_window_crafting.setDepth(9999 + 100);
}


//===window:summon
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
    group_window_summon.setDepth(9999 + 1);
}


//===draw_firework
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
    const particles = scene.add.particles('flares');
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


//===summon_star
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
        .setDepth(2);
    _star.on_summon();
    group_star.add(_star);
}


//---phaser3:config-----------------------------------------------------------------------------------------------------


let config = {
    type: Phaser.CANVAS,
    parent: "game",
    backgroundColor: "F4B4D0",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 960,
        //fps: 10,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    render: {
        //pixelArt: true,
        //antialias: false
    },
    parent: 'phaser-container',
    dom: {
        createContainer: true
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
};

game = new Phaser.Game(config);


//---phaser3:preload-----------------------------------------------------------------------------------------------------


function preload() {

    //===loading screen
    //https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0xFDEFF5, 0.4);
    progressBox.fillRect(480, 450, 320, 50);
    let progressText = this.add.text(490,520,"", {font: "20px monospace", fill: "#3D3D3D"}); 
    let progressText_loading = this.add.text(490,420, "Loading...", {font: "20px monospace", fill: "#3D3D3D"});
    let percentText = this.add.text(510, 465, "", {font: "20px monospace", fill: "#3D3D3D"});
    this.load.on("progress", function(value) {
        if (flag_loaded == 0) {
            progressBar.clear();
            progressBar.fillStyle(0xE62E8B, 1);
            progressBar.fillRect(490, 460, 300 * value, 30);
            percentText.setText( Math.round(value * 100) + "%");
            if (value == 1) {
                progressText_loading.setText("Completed!");
                let _arr = [
                    "Making roasted sweet potatoes...",
                    "Brushing a teddy bear...",
                    "Looking for my shovel...",
                    "Polishing the watering can...",
                    "Assembling the sewing machine...",
                    "Counting flowers and grass...",
                    "Cleaning up the house...",
                    "Replacing the sand in the sandbox...",
                    "Adding fertilizer to the flowerpot...",
                    "treating a needle puncture wound...",
                    "Washing the dishes...",
                    "Putting a flower on the teddy bear...",
                ];
                let _index = Math.floor(Math.random() * _arr.length);
                let _text = _arr[_index];            
                progressText.setText(_text);
            }
        }
    });
    this.load.on("fileprogress", function(file) {
        if (flag_loaded == 0) {
            progressText.setText("Loading asset: " + file.src);
        }
    });
    this.load.on("complete", function() {
        progressBar.destroy();
        progressBox.destroy();
        progressText.destroy();
        progressText_loading.destroy();
        percentText.destroy();
        flag_loaded = 1;
    });

    //===back
    this.load.image("back", "src/png/background.png");
    this.load.image("back_black", "src/png/background_black.png");
    this.load.image("window", "src/png/background_window.png");
    this.load.image("back_neon", "src/png/background_neon.png", {frameWidth: 500, frameHeight: 500});

    //===murasaki-san
    this.load.spritesheet("murasaki_right", "src/png/murasaki_right.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_left", "src/png/murasaki_left.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_sleeping", "src/png/murasaki_sleeping2.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_feeding", "src/png/murasaki_feeding.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_feeding_happy_right", "src/png/murasaki_feeding_happy_right.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_feeding_happy_left", "src/png/murasaki_feeding_happy_left.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_crying", "src/png/murasaki_crying.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_mining", "src/png/murasaki_mining.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_hugging", "src/png/murasaki_hugging.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_farming", "src/png/murasaki_farming.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_grooming", "src/png/murasaki_grooming3.png", {frameWidth: 720, frameHeight: 622});
    this.load.spritesheet("murasaki_crafting", "src/png/murasaki_crafting.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_working_left", "src/png/murasaki_working_left.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_working_right", "src/png/murasaki_working_right.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_click", "src/png/murasaki_click.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_stone", "src/png/murasaki_stone.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_hungry", "src/png/murasaki_hungry.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_listning", "src/png/murasaki_listning.png", {frameWidth: 370, frameHeight: 320});

    //===button
    this.load.image("button_feeding", "src/png/button_feeding.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_feeding_pointerover", "src/png/button_feeding_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_enable", "src/png/button_mining_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_unable", "src/png/button_mining_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_pointerover", "src/png/button_mining_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_working", "src/png/button_mining_working.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_pointerover_stop", "src/png/button_mining_pointerover_stop.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_enable", "src/png/button_farming_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_unable", "src/png/button_farming_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_pointerover", "src/png/button_farming_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_working", "src/png/button_farming_working.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_pointerover_stop", "src/png/button_farming_pointerover_stop.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_enable", "src/png/button_crafting_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_unable", "src/png/button_crafting_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_pointerover", "src/png/button_crafting_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_working", "src/png/button_crafting_working.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_pointerover_stop", "src/png/button_crafting_pointerover_stop.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_grooming_enable", "src/png/button_grooming_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_grooming_unable", "src/png/button_grooming_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_grooming_pointerover", "src/png/button_grooming_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_levelup_enable", "src/png/button_levelup_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_levelup_unable", "src/png/button_levelup_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_levelup_pointerover", "src/png/button_levelup_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("back_level", "src/png/button_level.png", {frameWidth: 500, frameHeight: 500});

    //===pet
    this.load.spritesheet("mr_astar_right", "src/png/pet_mr_astar_right.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("mr_astar_left", "src/png/pet_mr_astar_left.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("ms_ether_right", "src/png/pet_ms_ether_right.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("ms_ether_left", "src/png/pet_ms_ether_left.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("dr_bitco_right", "src/png/pet_dr_bitco_right.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("dr_bitco_left", "src/png/pet_dr_bitco_left.png", {frameWidth: 600, frameHeight: 600});

    //===music
    this.load.audio("bgm1", "src/music/Morning_2.mp3");
    this.load.audio("bgm2", "src/music/Roll_Roll_Roll.mp3");
    this.load.audio("bgm3", "src/music/amaoto.mp3");

    //===sound
    this.load.audio("button_on", "src/sound/button_on.mp3");
    this.load.audio("button_select", "src/sound/button_select.mp3");
    this.load.audio("feeding", "src/sound/feeding.mp3");
    this.load.audio("grooming", "src/sound/grooming.mp3");
    this.load.audio("mining", "src/sound/mining.mp3");
    this.load.audio("mining_during", "src/sound/mining_during.mp3");
    this.load.audio("farming", "src/sound/farming.mp3");
    this.load.audio("farming_during", "src/sound/farming_during.mp3");
    this.load.audio("crafting", "src/sound/crafting.mp3");
    this.load.audio("crafting_during", "src/sound/crafting_during.mp3");
    this.load.audio("happy", "src/sound/happy.mp3");
    this.load.audio("earn", "src/sound/earn.wav");
    this.load.audio("dice", "src/sound/dice.mp3");
    this.load.audio("dice_impact", "src/sound/dice_impact.mp3");
    this.load.audio("hat", "src/sound/hat.mp3");
    this.load.audio("unhappy", "src/sound/unhappy.mp3");
    this.load.audio("switch", "src/sound/switch.mp3");
    this.load.audio("window_open", "src/sound/window_open.mp3");
    this.load.audio("window_pointerover", "src/sound/window_pointerover.mp3");
    this.load.audio("window_select", "src/sound/window_select.mp3");
    this.load.audio("window_cancel", "src/sound/window_cancel.mp3");
    this.load.audio("system", "src/sound/system.mp3");
    this.load.audio("nui", "src/sound/nui.mp3");
    this.load.audio("pad", "src/sound/pad2.mp3");
    this.load.audio("fireworks", "src/sound/fireworks.mp3");
    this.load.audio("fireworks2", "src/sound/fireworks2.mp3");
    this.load.audio("basket", "src/sound/basket.mp3");

    //===item_basic
    this.load.image("item_table", "src/png/item_basic_table.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_misin", "src/png/item_basic_misin.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_tree1", "src/png/item_basic_tree1.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_tree2", "src/png/item_basic_tree2.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_tree3", "src/png/item_basic_tree3.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_bear", "src/png/item_basic_bear.png", {frameWidth: 720, frameHeight: 622});
    this.load.image("item_sweet_potato", "src/png/item_basic_sweet_potato.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("item_gold1", "src/png/item_basic_gold1.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_gold2", "src/png/item_basic_gold2.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_gold3", "src/png/item_basic_gold3.png", {frameWidth: 370, frameHeight: 320});

    //===item_craft
    this.load.spritesheet("item_musicbox", "src/png/item_musicbox.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_violin", "src/png/item_violin.png", {frameWidth: 600, frameHeight: 600});
    this.load.image("item_vase", "src/png/item_vase.png", {frameWidth: 300, frameHeight: 300});
    this.load.image("item_kanban", "src/png/item_kanban4.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("item_crown", "src/png/item_crown.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_pudding", "src/png/item_pudding2.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_chocolate_bread", "src/png/item_chocolate_bread.png", {frameWidth: 643, frameHeight: 477});
    this.load.image("item_fortune_statue", "src/png/item_fortune_statue.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_ribbon", "src/png/item_ribbon3.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_hat_tiny_crown", "src/png/item_hat_tiny_crown.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_kusa_pouch", "src/png/item_kusa_pouch.png", {frameWidth: 636, frameHeight: 895});
    this.load.image("item_dice", "src/png/item_dice.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("item_dice_pointerover", "src/png/item_dice_pointerover.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("item_hat_knit", "src/png/item_hat_knit.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_hat_mugiwara", "src/png/item_hat_mugiwara.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_bank", "src/png/item_bank.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_bank_broken", "src/png/item_bank_broken.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_hat_helmet", "src/png/item_hat_helmet.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_asnya", "src/png/item_asnya.png", {frameWidth: 500, frameHeight: 500});
    //this.load.image("item_nui", "src/png/item_nui.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("item_nui", "src/png/item_nui2.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("item_nui_ribbon", "src/png/item_nui_ribbon.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("item_switch", "src/png/item_switch.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_pouch", "src/png/item_pouch.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_pouch_broken", "src/png/item_pouch_broken.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_hat_mortarboard", "src/png/item_hat_mortarboard.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_pad_on", "src/png/item_pad_on.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_pad_off", "src/png/item_pad_off.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_gauge", "src/png/item_gauge.png", {frameWidth: 370, frameHeight: 306});
    this.load.image("item_frame", "src/png/item_frame.png", {frameWidth: 370, frameHeight: 428});
    
    //===star
    this.load.image("star_blue", "src/png/star_blue.png", {frameWidth: 200, frameHeight: 191});
    this.load.image("star_green", "src/png/star_green.png", {frameWidth: 200, frameHeight: 191});
    this.load.image("star_orange", "src/png/star_orange.png", {frameWidth: 200, frameHeight: 191});
    this.load.image("star_pink", "src/png/star_pink.png", {frameWidth: 200, frameHeight: 191});
    this.load.image("star_purple", "src/png/star_purple.png", {frameWidth: 200, frameHeight: 191});
    this.load.image("star_red", "src/png/star_red.png", {frameWidth: 200, frameHeight: 191});
    this.load.image("star_skyblue", "src/png/star_skyblue.png", {frameWidth: 200, frameHeight: 191});
    this.load.image("star_yellow", "src/png/star_yellow.png", {frameWidth: 200, frameHeight: 191});
        
    //===cat
    this.load.image("item_mail", "src/png/item_mail.png", {frameWidth: 757, frameHeight: 757});
    this.load.image("cat_sitting", "src/png/cat_sitting.png", {frameWidth: 772, frameHeight: 769});
    this.load.image("cat_sleeping", "src/png/cat_sleeping.png", {frameWidth: 759, frameHeight: 759});
    
    //===item_craft_todo
    this.load.image("item_cushion", "src/png/item_cushion.png", {frameWidth: 663, frameHeight: 447});

    //===icon_system
    this.load.image("icon_kusa", "src/png/icon_system_kusa.png", {frameWidth: 350, frameHeight: 350});
    this.load.image("icon_ohana", "src/png/icon_system_ohana.png", {frameWidth: 350, frameHeight: 350});
    this.load.image("icon_clock", "src/png/icon_system_clock.png", {frameWidth: 225, frameHeight: 225});
    this.load.image("icon_heart", "src/png/icon_system_heart.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("icon_rotate", "src/png/icon_system_rotate.png", {frameWidth: 980, frameHeight: 818});
    this.load.image("icon_home", "src/png/icon_system_home.png", {frameWidth: 512, frameHeight: 512});
    this.load.image("icon_satiety", "src/png/icon_system_satiety.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("icon_happy", "src/png/icon_system_happy.png", {frameWidth: 500, frameHeight: 500});

    //===icon_counter
    this.load.image("icon_counter", "src/png/icon_clover.png", {frameWidth: 507, frameHeight: 507});

    //===icon_status
    this.load.image("icon_str", "src/png/icon_status_str.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("icon_dex", "src/png/icon_status_dex.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("icon_int", "src/png/icon_status_int.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("icon_luk", "src/png/icon_status_luk.png", {frameWidth: 370, frameHeight: 320});

    //===plugin: rexuiplugin
    //need for nameplate
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: "lib/rexuiplugin.min.js",
        sceneKey: 'rexUI'
    });
    this.load.plugin('rextexteditplugin', 'lib/rextexteditplugin.min.js', true);
    
    //===fireworks
    //https://codepen.io/samme/pen/eYEearb
    this.load.atlas('flares', 'src/fireworks/flares.png', 'src/fireworks/flares.json');
    
    //===tokenBall
    this.load.image("coin_color_ACA", "src/png/coin_color_ACA.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_ASTR", "src/png/coin_color_ASTR.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_BNB", "src/png/coin_color_BNB.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_BTC", "src/png/coin_color_BTC.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_BUSD", "src/png/coin_color_BUSD.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_DAI", "src/png/coin_color_DAI.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_DOT", "src/png/coin_color_DOT.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_ETH", "src/png/coin_color_ETH.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_GLMR", "src/png/coin_color_GLMR.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_KSM", "src/png/coin_color_KSM.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_LAY", "src/png/coin_color_LAY.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_MATIC", "src/png/coin_color_MATIC.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_SDN", "src/png/coin_color_SDN.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_USDC", "src/png/coin_color_USDC.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("coin_color_USDT", "src/png/coin_color_USDT.png", {frameWidth: 200, frameHeight: 200});
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
    /*
    dic_tokenBall_contract = {
        ACA:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        ASTR:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        BNB:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        BTC:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        BUSD:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        DAI:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        DOT:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        ETH:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        GLMR:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        KSM:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        LAY:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        MATIC:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        SDN:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        USDC:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d",
        USDT:"0x2F2eB7682bE7AC2ADaa2E2389ddBC6C76D66671d"
    }
    */
    //shibuya
    dic_tokenBall_contract = {
        ACA:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        ASTR:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        BNB:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        BTC:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        BUSD:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        DAI:"0xC4195CE9383eA77aED21bd662ecad10a935Ed459",
        DOT:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        ETH:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        GLMR:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        KSM:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        LAY:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        MATIC:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        SDN:"0x3099daC30217E92b26a9e53aaA5Ef975D530138f",
        USDC:"0x37B76d58FAFc3Bc32E12E2e720F7a57Fc94bE871",
        USDT:"0xa4C17AD6bEC86e1233499A9B174D1E2D466c7198"
    }
}


//---phaser3:create-----------------------------------------------------------------------------------------------------


function create() {

    //===back image
    this.add.image(640, 480, "back");
    back_neon = this.add.image(900, 180, "back_neon").setOrigin(0.5).setScale(0.3);
    back_neon.angle += 10;
    back_neon.visible = false;
    back_neon.depth = 9999+11;

    //===animation murasaki
    this.anims.create({
        key: "murasaki_right",
        frames: this.anims.generateFrameNumbers("murasaki_right", {start:0, end:3}),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_left",
        frames: this.anims.generateFrameNumbers("murasaki_left", {start:0, end:3}),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_sleeping",
        frames: this.anims.generateFrameNumbers("murasaki_sleeping", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_feeding",
        frames: this.anims.generateFrameNumbers("murasaki_feeding", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_feeding_happy_right",
        frames: this.anims.generateFrameNumbers("murasaki_feeding_happy_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_feeding_happy_left",
        frames: this.anims.generateFrameNumbers("murasaki_feeding_happy_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_crying",
        frames: this.anims.generateFrameNumbers("murasaki_crying", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_mining",
        frames: this.anims.generateFrameNumbers("murasaki_mining", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_hugging",
        frames: this.anims.generateFrameNumbers("murasaki_hugging", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_farming",
        frames: this.anims.generateFrameNumbers("murasaki_farming", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_grooming",
        frames: this.anims.generateFrameNumbers("murasaki_grooming", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_crafting",
        frames: this.anims.generateFrameNumbers("murasaki_crafting", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_working_left",
        frames: this.anims.generateFrameNumbers("murasaki_working_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_working_right",
        frames: this.anims.generateFrameNumbers("murasaki_working_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_click",
        frames: this.anims.generateFrameNumbers("murasaki_click", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_stone",
        frames: this.anims.generateFrameNumbers("murasaki_stone", {start:0, end:0}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_listning",
        frames: this.anims.generateFrameNumbers("murasaki_listning", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });

    //===animation pet
    this.anims.create({
        key: "mr_astar_right",
        frames: this.anims.generateFrameNumbers("mr_astar_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "mr_astar_left",
        frames: this.anims.generateFrameNumbers("mr_astar_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "ms_ether_right",
        frames: this.anims.generateFrameNumbers("ms_ether_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "ms_ether_left",
        frames: this.anims.generateFrameNumbers("ms_ether_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "dr_bitco_right",
        frames: this.anims.generateFrameNumbers("dr_bitco_right", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "dr_bitco_left",
        frames: this.anims.generateFrameNumbers("dr_bitco_left", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    
    //===animation item
    this.anims.create({
        key: "item_musicbox_on",
        frames: this.anims.generateFrameNumbers("item_musicbox", {start:1, end:2}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "item_musicbox_off",
        frames: this.anims.generateFrameNumbers("item_musicbox", {start:0, end:0}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "item_crown",
        frames: this.anims.generateFrameNumbers("item_crown", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "murasaki_hungry",
        frames: this.anims.generateFrameNumbers("murasaki_hungry", {start:0, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "item_switch_on",
        frames: this.anims.generateFrameNumbers("item_switch", {start:0, end:0}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "item_switch_off",
        frames: this.anims.generateFrameNumbers("item_switch", {start:1, end:1}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "item_nui",
        frames: this.anims.generateFrameNumbers("item_nui", {start:0, end:0}),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: "item_nui_alive",
        frames: this.anims.generateFrameNumbers("item_nui", {start:1, end:3}),
        frameRate: 1,
        repeat: -1
    });
    
    //===item_basic
    item_bear = this.add.sprite(1000,400, "item_bear")
        .setScale(0.45);
    item_table = this.add.sprite(600,870, "item_table")
        .setOrigin(0.5)
        .setScale(0.6)
        .setDepth(870-50);
    item_misin = this.add.sprite(1000,830, "item_misin")
        .setOrigin(0.5)
        .setScale(0.8)
        .setDepth(830-100);
    item_tree1 = this.add.sprite(100,420, "item_tree1")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(420);
    item_tree2 = this.add.sprite(100,420, "item_tree2")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(420+1);
    item_tree3 = this.add.sprite(100,420, "item_tree3")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(420+2);
    item_tree2.visible = false;
    item_tree3.visible = false;
    item_gold1 = this.add.sprite(130,750, "item_gold1")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(750);
    item_gold2 = this.add.sprite(130,750, "item_gold2")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(750+1);
    item_gold3 = this.add.sprite(130,750, "item_gold3")
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(750+2);
    item_gold1.visible = false;
    item_gold2.visible = false;
    item_gold3.visible = false;

    //===click button
    let _x;
    let _y;

    //feeding
    _x = 460;
    _y = 870;
    button_feeding = this.add.sprite(_x, _y, "button_feeding")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_feeding(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_feeding.setTexture("button_feeding_pointerover"))
        .on('pointerout', () => button_feeding.setTexture("button_feeding"));

    //grooming
    _x = 1150;
    _y = 400;
    button_grooming = this.add.sprite(_x, _y, "button_grooming_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_grooming(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_grooming.setTexture("button_grooming_pointerover"))
        .on('pointerout', () => button_grooming.setTexture("button_grooming"))
        .disableInteractive();

    //crafting
    _x = 800;
    _y = 870;
    button_crafting = this.add.sprite(_x, _y, "button_crafting_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_crafting(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_crafting.setTexture("button_crafting_pointerover"))
        .on('pointerout', () => button_crafting.setTexture("button_crafting_enable"))
        .disableInteractive();

    //--crafting_selected_info
    //icon_ohana
    icon_crafting_ohana = this.add.sprite(_x+58, _y+13, "icon_ohana")
        .setDepth(9999)
        .setScale(0.07)
        .setVisible(false);
    //icon_kusa
    icon_crafting_kusa = this.add.sprite(_x+130, _y+15, "icon_kusa")
        .setDepth(9999)
        .setScale(0.09)
        .setVisible(false);
    //icon_clock
    icon_crafting_time = this.add.sprite(_x+58, _y+42, "icon_clock")
        .setDepth(9999)
        .setScale(0.09)
        .setVisible(false);
    //icon_heart
    icon_crafting_heart = this.add.sprite(_x+200, _y+13, "icon_heart")
        .setDepth(9999)
        .setScale(0.08)
        .setVisible(false);
    //text
    text_crafting_selected_item_ohana = this.add.text(
        _x+72, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);
    text_crafting_selected_item_kusa = this.add.text(
        _x+142, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);
    text_crafting_selected_item_heart = this.add.text(
        _x+214, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);
    text_crafting_selected_item_time = this.add.text(
        _x+72, 
        _y+32, 
        "", 
        {font: "18px Arial", fill: "#000", backgroundColor: "#ecd9ff"}
    ).setDepth(9999);

    //--craftimg_now_info
    //icon_clock
    icon_crafting_time_remining = this.add.sprite(_x+60, _y+15, "icon_clock")
        .setDepth(9999)
        .setScale(0.09)
        .setVisible(false);
    //text
    text_crafting_calc = this.add.text(
        _x+75, 
        _y+5, 
        "", 
        {font: "18px Arial", fill: "#000"}
    ).setDepth(9999);
    //select crafting_item_type
    text_select_item = this.add.text(_x+50, _y-30, ">> Select Item <<", {font: "30px Arial", fill: "#000", backgroundColor: "#ecd9ff"})
                .setDepth(9999)
                .setFontSize(24).setFontFamily("Arial").setFill('#000000')
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => open_window_craft(this) )
                .on("pointerover", () => text_select_item.setStyle({ fontSize: 24, fontFamily: "Arial", fill: '#d19dff' }))
                .on("pointerout", () => text_select_item.setStyle({ fontSize: 24, fontFamily: "Arial", fill: '#000000' }));
    text_craft_item = this.add.text(_x+50, _y, "", {font: "18px Arial", fill: "#000"})
                .setDepth(9999)
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => open_window_craft(this) )

    //mining
    _x = 60;
    _y = 760;
    button_mining = this.add.sprite(_x, _y, "button_mining_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_mining(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_mining.setTexture("button_mining_pointerover"))
        .on('pointerout', () => button_mining.setTexture("button_mining_enable"))
        .disableInteractive();
    //icon
    icon_mining = this.add.sprite(_x+55, _y-22, "icon_ohana")
        .setScale(0.07)
        .setVisible(false);
    //text
    text_mining_calc = this.add.text(_x+67, _y-30, "", {font: "18px Arial", fill: "#000"});

    //farming
    _x = 240;
    _y = 340;
    button_farming = this.add.sprite(_x, _y, "button_farming_unable")
        .setScale(0.16)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play() )
        .on('pointerdown', () => contract_farming(summoner) )
        .on('pointerover', () => sound_button_select.play())
        .on('pointerover', () => button_farming.setTexture("button_farming_pointerover"))
        .on('pointerout', () => button_farming.setTexture("button_farming_enable"))
        .disableInteractive();
    //icon
    icon_farming = this.add.sprite(_x+55, _y-20, "icon_kusa")
        .setScale(0.09)
        .setVisible(false);
    //text
    text_farming_calc = this.add.text(_x+65, _y-30, "", {font: "18px Arial", fill: "#000"});

    //level
    _x = 1240;
    _y = 35;
    button_levelup = this.add.sprite(_x, _y, "back_level")
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
    text_level = this.add.text(_x, _y+7, "0", {font: "bold 26px Verdana", fill: "#E5004F"}).setOrigin(0.5);

    //===system click button
    //icon_rotate
    icon_rotate = this.add.sprite(1235,915, "icon_rotate")
        .setOrigin(0.5)
        .setScale(0.075)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_system.play())
        .on("pointerdown", () => {
            if (this.sys.game.scale.gameSize._width == 1280) {
                this.scale.setGameSize(960,1280);
                this.cameras.main.rotation = 90 * Math.PI / 180;
                this.cameras.main.centerOn(640,480);
            } else {
                this.scale.setGameSize(1280,960);
                this.cameras.main.rotation = 0;
                this.cameras.main.centerOn(640,480);
            }
        });

    //icon_home
    icon_home = this.add.sprite(1155,915, "icon_home")
        .setOrigin(0.5)
        .setScale(0.15)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_system.play())
        .on("pointerdown", () => {
                window.location.href = "./";
        });

    //===music
    //sound out of focus
    this.sound.pauseOnBlur = false
    bgm1 = this.sound.add("bgm1", {volume:0.1, loop:true});
    bgm2 = this.sound.add("bgm2", {volume:0.1, loop:true});
    bgm3 = this.sound.add("bgm3", {volume:0.1, loop:true});

    //===sound
    sound_button_select = this.sound.add("button_select", {volume:0.2});
    sound_button_on = this.sound.add("button_on", {volume:0.2});
    sound_feeding = this.sound.add("feeding", {volume:0.1});
    sound_grooming = this.sound.add("grooming", {volume:0.1});
    sound_mining = this.sound.add("mining", {volume:0.1});
    sound_mining_during = this.sound.add("mining_during", {volume:0.1});
    sound_farming = this.sound.add("farming", {volume:0.1});
    sound_farming_during = this.sound.add("farming_during", {volume:0.2});
    sound_crafting = this.sound.add("crafting", {volume:0.2});
    sound_crafting_during = this.sound.add("crafting_during", {volume:0.1});
    sound_happy = this.sound.add("happy", {volume:0.2});
    sound_earn = this.sound.add("earn", {volume:0.2});
    sound_dice = this.sound.add("dice", {volume:0.15});
    sound_dice_impact = this.sound.add("dice_impact", {volume:0.1});
    sound_hat = this.sound.add("hat", {volume:0.1});
    sound_unhappy = this.sound.add("unhappy", {volume:0.2});
    sound_switch = this.sound.add("switch", {volume:0.2});
    sound_window_open = this.sound.add("window_open", {volume:0.2});
    sound_window_pointerover = this.sound.add("window_pointerover", {volume:0.2});
    sound_window_select = this.sound.add("window_select", {volume:0.2});
    sound_window_cancel = this.sound.add("window_cancel", {volume:0.2});
    sound_system = this.sound.add("system", {volume:0.2});
    sound_nui = this.sound.add("nui", {volume:0.2});
    sound_pad = this.sound.add("pad", {volume:0.2});
    sound_fireworks = this.sound.add("fireworks", {volume:0.2});
    sound_fireworks2 = this.sound.add("fireworks2", {volume:0.2});
    sound_basket = this.sound.add("basket", {volume:0.2});

    //===summoner
    murasakisan = new Murasakisan(this, 500 + Math.random()*200, 640 + Math.random()*100)
        .setOrigin(0.5)
        .setScale(0.45);

    //===system message
    //system message
    text_system_message = this.add.text(640, 420, "", {
        font: "32px Arial", 
        fill: "#000000", 
        backgroundColor: "#ffffff",
        align: "center"
    }).setOrigin(0.5);

    //summon
    text_summon = this.add.text(640, 480, ">> Summon your Murasaki-san <<", {font: "30px Arial", fill: "#E62E8B", backgroundColor: "#FDEFF5"})
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => open_window_summon(this) )
        .on("pointerover", () => text_summon.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#0000ff' }))
        .on("pointerout", () => text_summon.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#E62E8B' }));
    text_summon.visible = false;

    //kill
    //new Button(10, 880, 'kill_summoner', this, () => contract_burn(summoner));
    //burn name
    //new Button(10, 780, 'burn_name', this, () => contract_burn_name(summoner));

    //curePetrification
    text_curePetrification = this.add.text(640, 480, " >> Cure Petrification (Cost: Lv x 10 $ASTR) << ", {font: "28px Arial", fill: "#E62E8B", backgroundColor: "#FDEFF5"})
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => contract_curePetrification(summoner) )
        .on("pointerover", () => text_curePetrification.setStyle({ fontSize: 28, fontFamily: "Arial", fill: '#0000ff' }))
        .on("pointerout", () => text_curePetrification.setStyle({ fontSize: 28, fontFamily: "Arial", fill: '#E62E8B' }));
    text_curePetrification.visible = false;

    //===status
    let font_arg = {font: "18px Arial", fill: "#000"};

    //debug info
    text_turn = this.add.text(230, 940, "***", {font: "14px Arial", fill: "#727171"});
    text_sync_time = this.add.text(330, 940, "***", {font: "14px Arial", fill: "#727171"});
    text_wallet = this.add.text(430, 940, "***", {font: "14px Arial", fill: "#727171"});

    //satiety
    icon_satiety = this.add.sprite(30,25, "icon_satiety")
        .setScale(0.08);
    bar_satiety_back = makeBar(this, 55, 15, 0xF8C5AC);
    bar_satiety_back.scaleX = 1;
    bar_satiety = makeBar(this, 55, 15, 0xE60012);
    bar_satiety.scaleX = 0;
    text_satiety = this.add.text(60, 16, "0%", {font: "17px Arial", fill: "#ffffff"});

    //happy
    icon_happy = this.add.sprite(245,25, "icon_happy");
    icon_happy.setScale(0.08);
    bar_happy_back = makeBar(this, 270, 15, 0xFCE2BA);
    bar_happy_back.scaleX = 1;
    bar_happy = makeBar(this, 270, 15, 0xF39800);
    bar_happy.scaleX = 0;
    text_happy = this.add.text(275, 16, "0%", {font: "17px Arial", fill: "#ffffff"});

    //exp
    this.add.text(440, 15, "Exp:", font_arg);
    bar_exp_back = makeBar(this, 480, 15, 0xBBCCE9);
    bar_exp_back.scaleX = 1;
    bar_exp = makeBar(this, 480, 15, 0x0068B7);
    bar_exp.scaleX = 0;
    text_exp = this.add.text(485, 16, "0 / 0", {font: "17px Arial", fill: "#ffffff"});
    text_exp_earned = this.add.text(480, 38, "", {font: "17px Arial", fill: "#000000"});
    text_exp_earned_count = 0;

    //coin
    icon_ohana = this.add.sprite(668,23, "icon_ohana")
        .setScale(0.07);
    text_coin = this.add.text(685, 15, "Ohana: 0", {font: "17px Arial", fill: "#000", backgroundColor: "#FFF200"});
    text_coin_earned = this.add.text(685, 38, "", {font: "17px Arial", fill: "#000000"});
    text_coin_earned_count = 0;

    //material
    icon_kusa = this.add.sprite(815, 25, "icon_kusa")
        .setScale(0.09);
    text_material = this.add.text(830, 15, "Kusa: 0", {font: "17px Arial", fill: "#000", backgroundColor: "#D7E7AF"});
    text_material_earned = this.add.text(830, 38, "", {font: "17px Arial", fill: "#000000"});
    text_material_earned_count = 0;

    //heart
    icon_heart = this.add.sprite(960, 21, "icon_heart")
        .setScale(0.08);
    text_heart = this.add.text(975, 15, "***", {font: "17px Arial", fill: "#000", backgroundColor: "#FDEEED"});

    //name
    _x = 85;
    _y = 100;
    item_kanban = this.add.sprite(85, 100, "item_kanban")
        .setScale(0.4);
    text_kanban = this.add.text(_x+2, _y+17, "", {font: "17px Arial", fill: "#000000"})
        .setOrigin(0.5)
	    .setInteractive().on('pointerdown', () => {this.rexUI.edit(text_kanban)})
        .setDepth(9999+2);
    text_mint_name = this.add.text(_x+80, _y-5, "[MINT NAME]", {font: "17px Arial", fill: "#000000"})
        .setInteractive({useHandCursor: true})
        .on("pointerover", () => text_mint_name.setStyle({ fontSize: 17, fontFamily: "Arial", fill: '#ffff00' }))
        .on("pointerout", () => text_mint_name.setStyle({ fontSize: 17, fontFamily: "Arial", fill: '#000000' }));
    text_mint_name.setInteractive()
        .on("pointerdown", () => {
            contract_mint_name(summoner, text_kanban.text);
            flag_name_minting = 1;
        });
    icon_name_ohana = this.add.sprite(_x+88, _y+25, "icon_ohana")
        .setScale(0.05);
    text_name_ohana = this.add.text(_x+100, _y+17, "100", {font: "17px Arial", fill: "#000000"});
    icon_name_kusa = this.add.sprite(_x+140, _y+25, "icon_kusa")
        .setScale(0.07);
    text_name_kusa = this.add.text(_x+150, _y+17, "100", {font: "17px Arial", fill: "#000000"});
    //id
    text_id = this.add.text(_x-45, _y+32, "#100", {font: "14px Arial", fill: "#000000"});
    //age
    text_age_time = this.add.text(_x+20, _y+32, "***", {font: "14px Arial", fill: "#000000"});
    //group
    group_kanban = this.add.group();
    group_kanban.add(item_kanban);
    group_kanban.add(text_kanban);
    group_kanban.add(text_id);
    group_kanban.add(text_age_time);
    group_kanban.setVisible(false);
    group_mint_name = this.add.group();
    group_mint_name.add(text_mint_name);
    group_mint_name.add(icon_name_ohana);
    group_mint_name.add(text_name_ohana);
    group_mint_name.add(icon_name_kusa);
    group_mint_name.add(text_name_kusa);
    group_mint_name.setVisible(false);
    
    //===star
    group_star = this.add.group();
    group_star.runChildUpdate = true;
    
    //===pet
    /*
    group_pet = this.add.group();
    group_pet.runChildUpdate = true;
    */
    
    //===group
    group_update = this.add.group();
        .runChildUpdate = true;
}


//---phaser3:update-----------------------------------------------------------------------------------------------------


//===protection
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

//===system message
function update_systemMessage(this_scene) {
    //if (summoner == -1) {
    if (count_sync == 0) {
        text_system_message.setText(" --- Connecting to Astar Network --- ");
    } else if (summoner == 0) {
        text_system_message.setText(" --- You have not summoned Murasaki-san yet --- ");
        text_summon.visible = true;
    } else if (local_isActive == false) {
        text_system_message.setText(" --- This Murasaki-san is not Available --- ");
    } else if (local_notPetrified == false) {
        text_system_message.setText(" --- This murasaki-san has been petrified --- ");
        text_curePetrification.visible = true;
    } else {
        text_system_message.setText("");
        text_summon.visible = false;
        text_curePetrification.visible = false;
    }
}


//===sync time
function update_syncTime(this_scene) {
    if (last_sync_time == 0) {
        text_sync_time.setText("synced: ####");
        text_sync_time.setColor("#ff0000");
    } else {
        let _delta = Math.round( (Date.now() - last_sync_time) / 1000 );
        text_sync_time.setText("synced: " + ("0000" + _delta).slice(-4));
        if (_delta >= 30) {
            text_sync_time.setColor("#ff0000");
        } else {
            text_sync_time.setColor("#727171");
        }
    }
}


//===numeric animation
function update_numericAnimation(this_scene) {

    //coin
    if (screen_coin_delta != 0) {
        let _p = (100 - screen_coin_easing)/100;
        if (_p < 1) {
            let _easing = 1 - Math.pow(1 - _p, 4);  //easeOutQuart: https://easings.net/ja#easeOutQuart
            let _screen_coin = screen_coin + screen_coin_delta * _easing;
            text_coin.setText("Ohana: " + Math.round(_screen_coin) );
            screen_coin_easing -= 1;
        } else {
            text_coin.setText("Ohana: " + local_coin);
            screen_coin_delta = 0;
        }
    }

    //material
    if (screen_material_delta != 0) {
        let _p = (100 - screen_material_easing)/100;
        if (_p < 1) {
            let _easing = 1 - Math.pow(1 - _p, 4);  //easeOutQuart: https://easings.net/ja#easeOutQuart
            let _screen_material = screen_material + screen_material_delta * _easing;
            text_material.setText("Kusa: " + Math.round(_screen_material) );
            screen_material_easing -= 1;
        } else {
            text_material.setText("Kusa: " + local_material);
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
}


//===param with animation
function update_parametersWithAnimation(this_scene) {

    //coin
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
            if (_delta >= local_coin_calc * 1.5) {
                text_coin_earned.setText(_sign + _delta + " lucky♪");
            } else {
                text_coin_earned.setText(_sign + _delta);
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
        if (count_sync > 3) {
            let _delta = local_material - previous_local_material;
            let _sign = ""; //no need when minus
            if (_delta > 0) {
                _sign = "+";
            }
            if (_delta >= local_material_calc * 1.5) {
                text_material_earned.setText(_sign + _delta + " lucky♪");
            } else {
                text_material_earned.setText(_sign + _delta);
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
        if (count_sync > 3) {
            let _delta = local_exp - previous_local_exp;
            let _sign = ""; //no need when minus
            if (_delta > 0) {
                _sign = "+";
            }
            text_exp_earned.setText(_sign + _delta);
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
    let base_satiety = 86400 / 2 / SPEED;
    satiety = Math.round( (base_satiety - (now_time - local_last_feeding_time)) / base_satiety * 100 );
    if (satiety < 0) { satiety = 0; }
    if (satiety > 100) { satiety = 100; }
    if (satiety != previous_satiety) {
        screen_satiety = previous_satiety;
        screen_satiety_delta = satiety - previous_satiety;
        screen_satiety_easing = 100;
    }

    //happy
    let base_happy = 86400 * 3 / SPEED;
    happy = Math.round( (base_happy - (now_time - local_last_grooming_time)) / base_happy * 100 );
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
}


//===param without animation
function update_parametersWithoutAnimation(this_scene) {

    //age
    let now_time = Date.now() / 1000;
    let age_time = Math.round(now_time - local_birth_time);
    let age = Math.round( age_time * SPEED / 86400 );
    text_age_time.setText(("000" + age).slice(-3) + "d");

    //level
    if (button_levelup.texture.key != "button_levelup_pointerover") {
        text_level.setText(local_level);
    }

    //degub info
    //text_speed.setText("speed: x" + SPEED);

    //heart
    text_heart.setText("Heart: " + local_heart);

    //update progression status
    let _mode = murasakisan.get_mode;
    if (_mode == "mining") {
        icon_mining.visible = true;
        let _delta = (now_time - local_mining_start_time) * SPEED;
        let _daily_earn = local_coin_calc / _delta * 86400;
        text_mining_calc.setText(" +" + local_coin_calc + " Ohana\n  (" + Math.round(_daily_earn/10)*10 + " /d)");
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
        text_farming_calc.setText(" +" + local_material_calc + " Kusa\n  (" + Math.round(_daily_earn/10)*10 + " /d)");
        //update tree
        if (local_material_calc >= 1000) {
            item_tree2.visible = true;
        }
        if (local_material_calc >= 2000 ) {
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
        if (local_crafting_calc > 0) {
            //TOFIX: invisible selecte item info
            //calc remining time
            let _total_sec = local_crafting_calc;
            let _day = Math.floor(_total_sec / 86400);
            let _hr = Math.floor(_total_sec % 86400 / 3600);
            let _min = Math.floor(_total_sec % 3600 / 60);
            text_crafting_calc.setText(_day + "d:" + _hr + "h:" + _min + "m");
        } else{
            text_crafting_calc.setText("Completed!");
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
        _text += "living in: " + _owner1 + "..." + _owner2 + ", ";
        text_wallet.setText(_text);
        text_wallet.setColor("#727171");
    } else {
        _text += "living in: " + _owner1 + "..." + _owner2 + ", ";
        _text += "not your wallet.";
        text_wallet.setText(_text);
        text_wallet.setColor("blue");
    }
    
    //radarchart
    if (previsou_local_rolled_dice != local_rolled_dice && flag_radarchart == 1) {
        draw_radarchart(this_scene);
    }

    previsou_local_rolled_dice = local_rolled_dice;
}


//===mode
function update_checkModeChange(this_scene) {
    //check petrified
    if (local_notPetrified == false) {
        murasakisan.set_mode = "petrified";

    //level up
    } else if (local_level > previous_local_level) {
        //fireworks
        if (previous_local_level > 0) {
            draw_firework(this_scene);
            summon_star(this_scene);
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
        murasakisan.target_y = 840;
        if (typeof group_food != "undefined") {
            group_food.destroy();
        }
        group_food = this_scene.add.group();
        item_potato = this_scene.add.sprite(600, 840+10, "item_sweet_potato").setScale(0.12).setOrigin(0.5);
        item_potato.depth = 9999;
        group_food.add(item_potato);
        /*
        if (local_items[5] > 0) {
            item_pudding = this.add.sprite(570, 840+20, "item_pudding").setScale(0.30).setOrigin(0.5);
            item_pudding.depth = 9999;
            group_food.add(item_pudding);
        }
        */
        /*
        if (local_items[22] > 0) {
            item_chocolate_bread = this_scene.add.sprite(650, 840+20, "item_chocolate_bread").setScale(0.4).setOrigin(0.5);
            item_chocolate_bread.depth = 9999;
            group_food.add(item_chocolate_bread);
        }
        */
        sound_feeding.play();

    //grooming check, continue
    } else if (local_last_grooming_time > previous_local_last_grooming_time){
        murasakisan.set_mode = "grooming";
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 1000;
        murasakisan.target_y = 400;
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
        //murasakisan.set_mode = "resting";
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
        //murasakisan.set_mode = "resting";
        //icon invisible
        icon_farming.visible = false;
        sound_earn.play();
        local_material_calc = 0;

    //crafting check, continue
    } else if (local_crafting_status == 1 & murasakisan.mode != "crafting" & murasakisan.mode != "feeding"){
        murasakisan.set_mode = "crafting";
        murasakisan.submode = 0;
        murasakisan.count = 0;
        murasakisan.target_x = 1000;
        murasakisan.target_y = 740;
        text_select_item.setText('"'+array_item_name[local_crafting_item_type]+'"')
        sound_crafting.play();
    }else if (local_crafting_status == 0 & murasakisan.mode == "crafting") {
        murasakisan.set_mode = "hugging";
        //murasakisan.set_mode = "resting";
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


//===button
function update_checkButtonActivation(this_scene) {
    //grooming
    if (local_farming_status == 1 || local_crafting_status == 1 || local_mining_status == 1) {
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
    }else if (local_crafting_status == 1) {
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


//===items
function update_checkItem(this_scene) {

    //debug
    //local_items = [1] * 256;

    let _item_id;

    //###1:Nameplate
    _item_id = 1;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        group_kanban.setVisible(true);
        
        //***TODO*** gauge
        let _x = 1037;
        let _y = 600;
        item_gauge = this_scene.add.sprite(1037, 600, "item_gauge")
            .setScale(0.2)
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', async function() {
                if (flag_tokenBall == 0) {
                    flag_tokenBall = 1;
                    sound_basket.play();
                    murasakisan.on_click();
                    group_tokenBall = this_scene.add.group();
                    group_tokenBall.runChildUpdate = true;
                    for (let _token in dic_tokenBall_contract) {
                        let _contract = dic_tokenBall_contract[_token];
                        let _amount = await call_amount_of_token(_contract);
                        if (_amount > 0) {
                            let _img = dic_tokenBall_img[_token];
                            _tokenBall = new tokenBall(this_scene, _x, _y, _img)
                                .setOrigin(0.5)
                                .setScale(0.15)
                                .setAlpha(0.7)
                                .setDepth(2);
                            group_tokenBall.add(_tokenBall);
                            _tokenBall.on_summon();
                        }
                    }
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
                } else {
                    flag_tokenBall = 0;
                    group_tokenBall.destroy(true);
                }
            });
        
        //***TODO*** frame
        function _get_nft_url() {
            let _array = [
                "ex_nft1.png",
                "ex_nft2.png",
                "ex_nft3.png",
            ];
            let _url = _array[Math.floor(Math.random() * _array.length)];
            return _url;
        }
        let _x2 = 890;
        let _y2 = 250;
        let _url = _get_nft_url();
        this_scene.load.image("pic_nft", _url);
        this_scene.load.start()
        this_scene.load.on(
            "complete", 
            () => {
                item_frame = this_scene.add.image(_x2, _y2, "item_frame")
                    .setOrigin(0.5)
                    .setScale(0.25);
                item_frame_inside = this_scene.add.sprite(_x2, _y2, "pic_nft")
                    .setOrigin(0.5)
                    .setScale(0.2)
                    .setDisplaySize(67, 82)
                    .setInteractive({useHandCursor: true})
                    .on("pointerdown", () => {
                        sound_hat.play();
                        item_frame_inside.setTexture();
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
        
        
        //***TODO*** cat cushion
        //cushion
        item_cushion = this_scene.add.sprite(90, 620, "item_cushion").setScale(0.25).setOrigin(0.5);
        item_cushion.depth = item_cushion.y - 50;
        
        //text_sending_interval
        text_sending_interval = this_scene.add.text(70, 640, "00h:00m", {font: "15px Arial", fill: "#ffffff"})
            .setDepth(item_cushion.depth + 1);

        //cat
        cat = this_scene.add.sprite(90, 610, "cat_sleeping")
            .setScale(0.12)
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {contract_send_mail(summoner)})
            .setVisible(false);
        cat.depth = item_cushion.y + 1;
        
        //mail
        mail = this_scene.add.sprite(40, 645, "item_mail")
            .setScale(0.06)
            .setOrigin(0.5)
            .setDepth(item_cushion.y + 2)
            .setVisible(false);

    }
    //nameplate, after craft
    if (local_items_flag[_item_id] == true) {
        if (local_name_str == "") {
            if (text_kanban.text == "") {
                text_kanban.setText("(enter name)");
            }
            text_kanban.setInteractive();
            group_mint_name.setVisible(true);
        } else {
            text_kanban.setText(local_name_str);
            text_kanban.disableInteractive();
            group_mint_name.setVisible(false);
        }
        text_id.setText("#"+summoner);
    }
    
    //***TODO*** cat cushion
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
                cat.visible = true;
            } else {
                let _d = Math.floor(local_mail_sending_interval / (60 * 60 * 24));
                let _hr = Math.floor(local_mail_sending_interval % 86400 / 3600);
                let _min = Math.floor(local_mail_sending_interval % 3600 / 60);
                let _text = _d + "d:" + _hr + "h:" + _min + "m";
                text_sending_interval.setText(_text).setFill("#ffffff");
                cat.visible = false;
            }
        }

        //check item mail
        if (local_items[196] > 0) {
            mail.visible = true;
        } else {
            mail.visible = false;
        }
    }
    
    //###2:Ms.Astar
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
    }
    
    //###3:Dice
    _item_id = 3;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        dice = new Dice(this_scene, 400, 600).setScale(0.3);
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
            .setScale(0.20)
            .setAngle(90);
        item_hat_helmet.setInteractive({useHandCursor: true});
        item_hat_helmet.on('pointerdown', () => {
            if (item_wearing_hat == 0) {
                item_wearing_hat = item_hat_helmet;
                murasakisan.on_click();
                sound_hat.play();
                item_hat_helmet.setAngle(0);
            } else if (item_wearing_hat == item_hat_helmet) {
                item_wearing_hat = 0;
                item_hat_helmet.x = _x;
                item_hat_helmet.y = _y;
                item_hat_helmet.setAngle(90);
            }
        });
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
    }
    
    //###7:Ribbon
    _item_id = 7;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //item_ribbon = this.add.sprite(1057, 443, "item_ribbon").setScale(0.5).setOrigin(0.5);
        item_ribbon = this_scene.add.sprite(1037, 401, "item_ribbon").setScale(0.15).setOrigin(0.5);
        item_ribbon.depth = 9999;
    }

    //###8:*Window
    
    //###9:Knit Hat
    _item_id = 9;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //let _x = 800;
        //let _y = 810;
        let _x = 690;
        let _y = 255;
        item_hat_knit = this_scene.add.sprite(_x, _y, "item_hat_knit").setOrigin(0.5).setScale(0.20);
        item_hat_knit.setInteractive({useHandCursor: true});
        item_hat_knit.on('pointerdown', () => {
            if (item_wearing_hat == 0) {
                item_wearing_hat = item_hat_knit;
                murasakisan.on_click();
                sound_hat.play();
            } else if (item_wearing_hat == item_hat_knit) {
                item_wearing_hat = 0;
                item_hat_knit.x = _x;
                item_hat_knit.y = _y;
            }
        });
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
        item_musicbox = this_scene.add.sprite(_x, _y, "item_musicbox")
            .setOrigin(0.5)
            .setScale(0.30)
            .setInteractive({useHandCursor: true})
            .setDepth(_y);
        item_musicbox.on('pointerdown', () => music() );
    }

    //###18:Straw Hat
    _item_id = 18;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //let _x = 240;
        //let _y = 275;
        let _x = 450;
        let _y = 255;
        item_hat_mugiwara = this_scene.add.sprite(_x, _y, "item_hat_mugiwara")
            .setOrigin(0.5)
            .setScale(0.25)
            .setAngle(90);
        item_hat_mugiwara.setInteractive({useHandCursor: true});
        item_hat_mugiwara.on('pointerdown', () => {
            if (item_wearing_hat == 0) {
                item_wearing_hat = item_hat_mugiwara;
                murasakisan.on_click();
                sound_hat.play();
                item_hat_mugiwara.setAngle(0);
            } else if (item_wearing_hat == item_hat_mugiwara) {
                item_wearing_hat = 0;
                item_hat_mugiwara.x = _x;
                item_hat_mugiwara.y = _y;
                item_hat_mugiwara.setAngle(90);
            }
        });
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
    }

    //###20:*Cat Cushion
    /*
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
        cat = this_scene.add.sprite(90, 610, "cat_sleeping")
            .setScale(0.12)
            .setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {contract_send_mail(summoner)})
            .setVisible(false);
        cat.depth = item_cushion.y + 1;
        
        //mail
        mail = this_scene.add.sprite(40, 645, "item_mail")
            .setScale(0.06)
            .setOrigin(0.5)
            .setDepth(item_cushion.y + 2)
            .setVisible(false);
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
                cat.visible = true;
            } else {
                let _d = Math.floor(local_mail_sending_interval / (60 * 60 * 24));
                let _hr = Math.floor(local_mail_sending_interval % 86400 / 3600);
                let _min = Math.floor(local_mail_sending_interval % 3600 / 60);
                let _text = _d + "d:" + _hr + "h:" + _min + "m";
                text_sending_interval.setText(_text).setFill("#ffffff");
                cat.visible = false;
            }
        }

        //check item mail
        if (local_items[196] > 0) {
            mail.visible = true;
        } else {
            mail.visible = false;
        }
    }
    */
    
    //check mail receiving, independent from cushion possession
    if (flag_mail) {
        cat_others = this_scene.add.sprite(800, 700, "cat_sitting").setScale(0.12).setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => {contract_open_mail(summoner)});            
        cat_others.depth = cat_others.y;
    } else {
        try {
            cat_others.destroy(true);
        } catch (error) {
            ;
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
            });
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
            });
    }

    //###24:*Rug-Pull

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
    }

    //###33:*Table
    _item_id = 33;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        //status pad
        let _x = 700;
        let _y = 390;
        item_pad = this_scene.add.sprite(_x, _y, "item_pad_on")
            .setScale(0.25)
            .setOrigin(0.5)
            .setDepth(_y)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                if (flag_radarchart == 0) {
                    flag_radarchart = 1;
                    draw_radarchart(this_scene);
                    item_pad.setTexture("item_pad_on");
                    sound_pad.play();
                } else {
                    flag_radarchart = 0;
                    group_chart.destroy(true);
                    item_pad.setTexture("item_pad_off");
                    //init_global_variants();
                }
            });
        flag_radarchart = 1;
        draw_radarchart(this_scene);
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
            if (_len_score + i + 1 > 7) {
                _txt = this_scene.add.text(_x-2, _y, _text, _font_arg)
                    .setOrigin(0.5)
                    .setDepth(1001);
                group_score_counter.add(_txt);
            }
        }
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
        item_hat_mortarboard.on('pointerdown', () => {
            if (item_wearing_hat == 0) {
                item_wearing_hat = item_hat_mortarboard;
                murasakisan.on_click();
                sound_hat.play();
                item_hat_mortarboard.setAngle(0);
            } else if (item_wearing_hat == item_hat_mortarboard) {
                item_wearing_hat = 0;
                item_hat_mortarboard.x = _x;
                item_hat_mortarboard.y = _y;
                item_hat_mortarboard.setAngle(90);
            }
        });
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
    }

    //###37:Pancake

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
            });
    }

    //###39:Piano

    //###40:Light Switch
    _item_id = 40;
    if (
        (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
        && local_items_flag[_item_id] != true
    ) {
        local_items_flag[_item_id] = true;
        item_switch = this_scene.add.sprite(1230,300, "item_switch").setOrigin(0.5);
        item_switch.setScale(0.25);
        item_switch.anims.play("item_switch_off", true);
        item_switch.setInteractive({useHandCursor: true});
        back_black = this_scene.add.image(640, 480, "back_black");
        back_black.depth = 9999+1;
        back_black.visible = false;
        item_switch.on('pointerdown', () => {
            if (item_switch.anims.currentAnim.key == "item_switch_off") {
                item_switch.anims.play("item_switch_on", true);
                back_black.visible = true;
                sound_switch.play();
                back_neon.visible = true;
                text_kanban.setColor("white");
                if (typeof item_nui != "undefined") {
                    item_nui.anims.play("item_nui_alive", true);
                }
            } else {
                item_switch.anims.play("item_switch_off", true);
                back_black.visible = false;
                sound_switch.play();
                back_neon.visible = false;
                text_kanban.setColor("black");
                if (typeof item_nui != "undefined") {
                    item_nui.anims.play("item_nui", true);
                }
            }
        });
        item_switch.depth = item_switch.y;
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
        
        //###201-212:Star
        if (flag_summon_star == 0) {
            let _timeout = 0;
            for (let i = 201; i <= 212; i++) {
                let _count = local_items[i];
                for (let j = 1; j <= _count; j++) {
                    setTimeout(function(){
                        summon_star(this_scene, i);
                    }, _timeout);
                    _timeout += 500;
                }
            }
            flag_summon_star = 1;
        }
    }
    
    previous_local_items = local_items;
    previous_local_item194 = local_items[194];
    previous_local_item195 = local_items[195];
    previous_local_item196 = local_items[196];
    previous_local_item197 = local_items[197];
    previous_local_rolled_dice = local_rolled_dice;
    previous_local_name_str = local_name_str;
    previous_local_score = local_score;
}


//===update()
function update(time, delta) {

    //increment turn
    turn += 1;
    text_turn.setText("turn: " + ("0000000" + turn).slice(-7) );
    

    //debug
    /*
    if (turn % 20 == 0) {
        console.log(Math.round(game.input.mousePointer.x), Math.round(game.input.mousePointer.y));
    }
    */
    
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
    
    //update summoner
    if (count_sync > 0 && local_level > 0) {
        murasakisan.update();
    }
    
    //update pet
    if (typeof mr_astar != "undefined") {
        mr_astar.update();
    }
    if (typeof ms_ether != "undefined") {
        ms_ether.update();
    }
    if (typeof dr_bitco != "undefined") {
        dr_bitco.update();
    }

    //update dice
    if (typeof dice != "undefined" && turn % 2 == 0) {
        dice.update();
    }

    //radarchart
    if (turn % 1000 == 0 && summoner > 0 && radarchart == 1) {
        draw_radarchart(this);
    }
    
    //sync time
    if (turn % 20 == 0) {
        update_syncTime(this);
    }

    //numeric animation
    if (turn % 2 == 0) {
        update_numericAnimation(this);
    }

    //parameters with animation
    if (turn % 150 == 0) {
        update_parametersWithAnimation(this);
    }

    //parameters without animation
    if (turn % 150 == 10) {
        update_parametersWithoutAnimation(this);
    }

    //check mode change
    if (turn % 150 == 20) {
        update_checkModeChange(this);
    }

    //check button activation
    if (turn % 150 == 30) {
        update_checkButtonActivation(this);
    }

    //check item
    if (turn % 150 == 40 && local_items != previous_local_items) {
        update_checkItem(this);
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

    //update onchain data
    if (turn % 500 == 70 || turn == 50) {
        if (count_sync == 0 || local_notPetrified == false || summoner == 0) {
            contract_update_all();
        } else if (summoner > 0) {
            contract_update_status(summoner);
        }
    }
}

//---end------------------------------------------------------------------------------------------------------
/*



*/
