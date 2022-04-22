
/*

//---ToDo---------------------------------------------------------------------------------------------

ToDo

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
                gas代で判断できるので、何かしらはcraftさせる
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

    ポーチ絵の実装
        貯金箱に準ずる

    帽子案
        ぴこぴこ揺れるお花
            classごとにお花の種類を変える？

    NFTの絵の実装
        pngをifgなどに格納するか
        urlをコードするか
        いずれにしても、ToFuNFTでも正常に表示させたいところだが、果たして
        あるいは、独自マケプレでも良いかもしれないが。

  * わんころの顔塗る

    クラフトウィンドウの改善
        枠のデザイン再考
        アイテムアイコンを影絵にする？

    看板デザインの変更

    Happy, Satiety, Expアイコンの変更

    アイテム案
        食べ物
        お皿
        ランチョンマット
        絨毯
        ランタン
        ウォールアート
        王冠
        とんがり帽子
        ぴろー帽子

    pngファイルの軽量化
    
    サウンドの洗練
        有効サウンドの選別
        各アクションにできるだけサウンドを導入する
        mining/farming/craftingのduringサウンドの実装
        earn時のサウンドの実装
        サウンド案
            動作開始時
            動作終了時
            動作中
        効果音メーカーを使って作成する
            https://www.peko-step.com/tool/soundeffect/#pInTopMenu

    時間経過で成長する木の実装
        farming itemに割り振る
        双葉　→　低木　→　背の高い木
            植木鉢に収まるように？
        seedか、summonerのclassを参照して色や形を決める
        大体半年で最大成長するように。
        その他、お花とかも双葉→草→花と成長させるか

    経済の深慮
        マケプレ解説はRMTと同義
            RMTによるバランス崩壊の問題をよく調べる
            これを防ぐか、または利用する方法を考える
            Andreの意見では、効率的なプレイヤー＝Bot＝NPCなので
                うまくゲーム経済へ組み込むことを考えてみる
        今回のbotは多walletで回してマケプレを経ずにアイテムを集中させるプレイヤー
            itemがNFTであるので、個人的なtransferは禁止しにくい
            itemを大量に出品するのは別に構わない。
                Rarityを見ていても適正な価格に落ち着くだろう。

    summonerごとにユニークなシンボルの考案
        phaser3での色彩変化
        もしくは手動での色彩変化済み画像の用意
        あるいは、ユニークな色のアクセサリー
        
 ok 重なり調整
        depthを修正する
        基本的には、y座表示準じればよいか
        ボタン、帽子など、一部のものは再背面、最前面にdepthを設定する
        https://gpnotes.hatenablog.jp/entry/2019/01/16/170100

 ok 貯金箱に資源表示
        マウスオーバー時にお花+1000と表示する
        グループに入れて表示/非表示をスムーズに。

 ok 帽子周りの整備
        位置合わせ微調整で座標を決定する
          * なにかモデル絵を対象にして座標を決定する
        画像側をあわせる
        帽子絵がそろってからか

 ok ダイスシステムの深慮
        ダイスのリセット時間について
            1日か3日か、あるいは5日とか
            1日だと、良いダイスを引く→クラフト、と進んでも、
                クラフトが完了する3日目には別の目を振り直さないといけない
            しかし、クラフト開始時に補正をかけるのはちょっと困難
        補正方法について
            すべての行動は、stop時にステータス補正がかかる
            stopのtxを飛ばしたときのステータス、所持アイテムによって得られる結果が変わる
            このシステムにおいて、ダイス目をどうやって自然に組み込むか
                stopする前に運試しで振るのか
                良い補正値を見てからstartするのか
        4日間の平均値とする
            24時間開くごとに0を代入する
            24+24時間以内に次をロールすればペナルティ無し
            ただし、24時間経過後は、ダイス振るは直近が0として計算される
            24+24時間以内に次を降れば4つの平均値が補正値として採用される
            → とにかく、こまめに振ることが最も高効率の設計
            20時間経過後に次のダイスを触れる。
                20～48時間以内に振れば、0代入のペナルティ無し。
            ダイスには直近の値のみを表示させる
            平均すると、こまめに振っていれば平均10＝+1レベル程度の補正
      * ダイスコントラの更新

 ok マケプレのアイコン表示の実装

 ok IDを看板内に表示する

 ok ダイスの実装
     ok 24時間でリセットされる
            小さくカウントアップを表示するか
            24時間後は補正0になる
     ok クリックしてtx飛ばす
            tx通れば値更新
            d20の枠組み内に現在の数字を表示させるか
     ok アニメーションが可能ならしてみたいが
            ダイスらしく転がせられるだろうか
            24時間経過前は転がる→必ず設定した値がでる
            24時間経過後は、マウスオーバーで更新可能を示す絵に変わる
                →クリックで値更新

 ok 帽子枠の実装
      * summonerのすべてのアニメーションで、帽子の位置を決定する
            左右で絵を変える
     ok 帽子スプライトを1つだけ作成し、waringしているitemをそのスプライトに格納する
            帽子スプライトの存在をチェックし、summoner()内でその都度描写する        
            脱ぐときはdestroyする
     ok 帽子は棚や壁ラックにかけておき、クリックでwaringする
            visible=false, 帽子spriteをcreateでよいか
            帽子sprite側はdestroy、対応するspriteをvisible=trueで棚に戻す
     ok 帽子絵の規格を決定する
            370x320はクリック領域が広く扱いにくい
            80x80ぐらいか？

 ok 貯金箱システムの実装
     ok 消費時、クラフト時に即座に反映されるように修正
            1個以上持っていたらではなく、個数が変更されたら画面更新させる機構
            消す（destroy）メカニズムの実装
                個数が減ったら全削除→再描写
                予めgroupへ格納しておく
     ok Approveの実装
            Function_craftingにcraftをapprove通さないとunpackできない
            フロントエンド側でapproveを導入する
            現状、upgrade用のapproveボタンを押さないとunpackできない。
      * マウスオーバー時の絵の実装
            中身が解かれてcoin/kusaが少し見えている絵

 ok Petの行動の実装
        mining, farming時に一緒に働く
        feeding, grooming時にハートが出る

 ok Dr. Bitcoの実装
    
 ng Prof. Polkaの実装
    
 ng Master Solidの実装
    
picture

    背景
    ごきげん！（お腹いっぱい＆ハッピーなときなど）
    ありがとう！（ご飯たべたあとなど）
    クラフトアイテムたくさん（飼い主手伝う）
    成功したよー！（クラフト成功時, mining終了時など）
    れべるあっぷ！
    おんがくかんしょうちゅう～♪

*/


//---global variants-------------------------------------------------------------------------------------------------


let turn = 0;

//on chain static status
let summoner = -1;
let local_birth_time;

//on chain global status
let SPEED = 1;
let BASE_SEC = 86400;

//on chain dynamic status
let local_class = 0;
let local_strength = 0;
let local_dexterity = 0;
let local_intelligence = 0;
let local_luck = 0;
let local_level = 0;
let local_last_feeding_time = 0;
let local_last_grooming_time = 0;
let local_coin = 0;
let local_exp = 0;
let local_mining_status;
let local_mining_start_time = 0;
let local_next_exp_required = 0;
let local_material = 0;
let local_farming_status;
let local_farming_start_time = 0;
let local_crafting_status;
let local_crafting_start_time = 0;
let local_crafting_item_type = 0;
let local_items;
let local_heart = 0;
let local_wallet;
let local_owner = "0x0000000000000000000000000000000000000000";
let local_name_str = "(unnamed)";
let local_notPetrified = true;
let local_isActive;
let local_rolled_dice = 0;
let local_last_dice_roll_time;

//local using variants
let previous_local_last_feeding_time = 0;
let previous_local_last_grooming_time = 0;
let previous_local_level = 0;
let previous_local_mining_status;
let previous_local_farming_status;
let previous_local_crafting_status;
let previous_local_exp = 0.01;
let previous_local_coin = 0;
let previous_local_material = 0;
let previous_local_items;
let previous_local_name_str;
let local_coin_calc;
let local_material_calc;
let local_crafting_calc;
let flag_music = 0;
let bgm = 0;
let local_items_flag = new Array(256).fill(0);
let global_selected_crafting_item = 0;
let global_selected_crafting_item_dc;
let last_sync_time = 0;
let mode = "";
let text_wallet;
let screen_coin = 0;
let screen_coin_delta = 0;
let screen_material = 0;
let screen_material_delta = 0;
let screen_exp = 0;
let screen_exp_delta = 0;
let count_sync = 0;
let happy = 0;
let previous_happy = 0;
let satiety = 0;
let previous_satiety = 0;
let screen_happy = 0;
let screen_happy_delta = 0;
let screen_satiety = 0;
let screen_satiety_delta = 0;
let previous_local_item194 = 0;
let previous_local_item195 = 0;
let item_wearing_hat = 0;


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


//---web3-----------------------------------------------------------------------------------------------------


//connect to metamask
async function connect() {
    const web3 = await new Web3(window.ethereum);
    window.ethereum.enable();
    window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
            chainId: '0x51',  //4369
            chainName: 'Shibuya Testnet',
            nativeCurrency: {
                name: 'sby',
                symbol: 'SBY',
                decimals: 18
            },
            rpcUrls: ["https://rpc.shibuya.astar.network:8545"],
            blockExplorerUrls: ['https://blockscout.com/shibuya'],
        }]
    });
    return web3;
}

//get wallet
async function get_wallet() {
    let web3 = await connect();
    let wallet = await web3.eth.getAccounts();
    //text_wallet.setText("id: " + summoner + ", wallet: " + wallet[0]);
    return wallet[0];
}

//update summoner of wallet
async function contract_update_summoner_of_wallet() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mm = await new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
    summoner = await contract_mm.methods.tokenOf(wallet).call();  //have not summoned yet: 0
}

//update local status reading from contract
async function contract_update_status(_summoner) {

    let web3 = await connect();
    let wallet = await get_wallet(web3);

    //contract
    let contract_mm = await new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
    let contract_ms = await new web3.eth.Contract(abi_murasaki_strage, contract_murasaki_strage);
    let contract_mfs = await new web3.eth.Contract(abi_murasaki_function_share, contract_murasaki_function_share);
    let contract_mfc = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let contract_mfmf = await new web3.eth.Contract(abi_murasaki_function_mining_and_farming, contract_murasaki_function_mining_and_farming);
    let contract_mffg = await new web3.eth.Contract(abi_murasaki_function_feeding_and_grooming, contract_murasaki_function_feeding_and_grooming);
    let contract_mn = await new web3.eth.Contract(abi_murasaki_function_name, contract_murasaki_function_name);
    let contract_d = await new web3.eth.Contract(abi_world_dice, contract_world_dice);

    //check isActive
    local_isActive = await contract_ms.methods.isActive(_summoner).call();
    if (local_isActive == false) {
        console.log("summoner=", _summoner, "local_isActive=", local_isActive);
        count_sync += 1;
        return 0;
    }
    
    //=====update high frequency=====

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

    //mining, farming, crafting calculation
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
    
    //=====update low frequency=====
    
    if (count_sync % 3 == 0) {

        //call global variants ***TODO***
        SPEED = await contract_ms.methods.SPEED().call();   //220311: speed was modified as 100%=x1
        SPEED = Number(SPEED) / 100;
        
        //call static status from ms
        let _static_status = await contract_mfs.methods.get_static_status_array(_summoner).call();

        //update static status
        local_class = Number(_static_status[0]);
        local_birth_time = Number(_static_status[1]);

        //owner of summoner
        let _owner = await contract_mm.methods.ownerOf(_summoner).call();
        local_owner = _owner;

        //call item from contract
        local_items = await contract_mfs.methods.get_balance_of_type_array(_owner).call();

        //update local heart
        local_heart = Number(local_items[193]);

        //petrification
        local_notPetrified = await contract_mffg.methods.not_petrified(_summoner).call();
        
        //name
        local_name_str = await contract_mn.methods.call_name_from_summoner(_summoner).call();

        //dice
        if (local_items[36] > 0) {
            local_rolled_dice = await contract_d.methods.get_last_rolled_dice(_summoner).call();
            local_last_dice_roll_time = await contract_d.methods.last_dice_roll_time(_summoner).call();
        }
    }

    //=====msc=====

    //debug
    console.log("status:", _dynamic_status, "items:", local_items);

    //update last_sync_time
    last_sync_time = Date.now();
    count_sync += 1;
}

//update_all
async function contract_update_all() {
    await contract_update_summoner_of_wallet();
    await contract_update_status(summoner);
}

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
    contract.methods.feeding(_summoner).send({from:wallet});
}

//grooming
async function contract_grooming(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_feeding_and_grooming, contract_murasaki_function_feeding_and_grooming);
    let wallet = await get_wallet(web3);
    contract.methods.grooming(_summoner).send({from:wallet});
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
    //let _item_type = 1;
    let _item_type = global_selected_crafting_item;
    if (local_crafting_status == 0) {
        contract.methods.start_crafting(_summoner, _item_type).send({from:wallet});
    }else {
        contract.methods.stop_crafting(_summoner).send({from:wallet});
    }
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


//---summoner-----------------------------------------------------------------------------------------------------


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
    on_click() {
        if (this.mode == "resting" || this.mode == "moving") {
            this.count = 0;
            this.mode = "hugging";
        }
    }
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
            }else {
                this.mode = "moving";
                this.count = 0;
            }
        }
    }
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
        //return to resting
        }else if (this.count >= this.moving_count) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    //send: last_nutrition_time
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
    crying() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_crying", true);
        }else if (this.count >= 500) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    hungry() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_hungry", true);
        }else if (this.count >= 500) {
            this.mode = "resting";
            this.count = 0;
        }
    }
    petrified() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_stone", true);
        }
    }
    sleeping() {
        this.count += 1;
        if (this.count == 1){
            this.anims.play("murasaki_sleeping", true);
        }else if (this.count >= 1000) {
            this.mode = "resting";
            this.count = 0;
        }
    }
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
    update_item_wearing_hat() {

        if (
            this.mode == "resting"
            || this.mode == "moving"
            || this.mode == "hugging"
            || this.mode == "hungry"
            || this.mode == "crying"
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
        item_wearing_hat.depth = item_wearing_hat.y + 100;

        /*
        if (
            this.mode == "resting"
            || this.mode == "moving"
            || this.mode == "hugging"
            || this.mode == "hungry"
            || this.mode == "crying"
        ) {
            item_wearing_hat.x = this.x;
            item_wearing_hat.y = this.y;
        }else if (this.mode == "sleeping") {
            item_wearing_hat.x = this.x - 20;
            item_wearing_hat.y = this.y + 38;
        }else if (this.mode == "mining" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "mining" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 5;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "mining" && this.submode == 2) {
            item_wearing_hat.x = this.x + 32;
            item_wearing_hat.y = this.y - 10;
        }else if (this.mode == "farming" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "farming" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 5;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "farming" && this.submode == 2) {
            item_wearing_hat.x = this.x + 25;
            item_wearing_hat.y = this.y + 10;
        }else if (this.mode == "crafting" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 5;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "crafting" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 7;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "crafting" && this.submode == 2) {
            item_wearing_hat.x = this.x + 2;
            item_wearing_hat.y = this.y - 18;
        }else if (this.mode == "feeding" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 8;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "feeding" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 8;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "feeding" && this.submode == 3) {
            item_wearing_hat.x = this.x - 2;
            item_wearing_hat.y = this.y;
        }else if (this.mode == "grooming" && this.submode == 1 && this.dist == "right") {
            item_wearing_hat.x = this.x + 8;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "grooming" && this.submode == 1 && this.dist == "left") {
            item_wearing_hat.x = this.x - 8;
            item_wearing_hat.y = this.y + 15;
        }else if (this.mode == "grooming" && this.submode == 3) {
            item_wearing_hat.x = this.x - 25;
            item_wearing_hat.y = this.y + 110;
        }
        //***TODO*** Dirty Codes
        if (typeof item_hat_mugiwara != "undefined" && item_wearing_hat == item_hat_mugiwara) {
            item_wearing_hat.x -= 0;
            item_wearing_hat.y -= 65;
        } else if (typeof item_hat_knit != "undefined" && item_wearing_hat == item_hat_knit) {
            item_wearing_hat.x -= 0;
            item_wearing_hat.y -= 60;
        }
        */

    }
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
        //draw item_wearing_hat
        if (item_wearing_hat != 0) {
            this.update_item_wearing_hat();
        }
        //deps
        this.depth = this.y;
    }
}


//---pet-----------------------------------------------------------------------------------------------------


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
    on_click() {
        /***
        if (this.mode == "resting" || this.mode == "moving") {
            this.count = 0;
            this.mode = "hugging";
        }
        ***/
    }
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
    update(){
        //console.log(this.version, this.mode, this.count);
        if (this.mode == "resting") {this.resting();}
        else if (this.mode == "moving") {this.moving();}
        //else if (this.mode == "sleeping") {this.sleeping();}
        else if (this.mode == "working") {this.working();}
        //depth
        this.depth = this.y;
    }
}


//---dice-----------------------------------------------------------------------------------------------------

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
    }
    on_click() {
        this.speed_x = 8 + Math.random() * 5;
        
        
        if (Math.random() > 0.5) {
            this.speed_x *= -1;
        }
        
        /*        
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
        }
        //define constant of y = b - a * x
        this.a = Math.random() * 0.8 - 0.4;
        this.b = this.y + this.a * this.x;
        /*
        this.b = this.y - 50 + Math.random() * 100; //define b base on this.y
        this.a = (this.b - this.y) / this.x;    //calc a
        */
        //sound
        sound_dice.play();
    }
    update(){
        this.count += 1;
        //dept
        this.depth = this.line_y;
        this.text_rolled_number.depth = this.line_y + 1;
        //update text
        if (this.count% 200 == 1) {
            //update rooled number
            this.text_rolled_number.setText(local_rolled_dice/10);
            //update next roll time
            let _now = Date.now() / 1000;
            let _delta_sec = _now - local_last_dice_roll_time;
            let _next_sec = BASE_SEC - _delta_sec * SPEED;
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
                    sound_dice2.play();
                }
            }
            //refrection x
            if (this.x >= this.line_x_r) {
                this.x = this.line_x_r;
                this.speed_x *= -0.9;   //bounce coefficient
                sound_dice2.play();
            } else if (this.x <= this.line_x_l) {
                this.x = this.line_x_l;
                this.speed_x *= -0.9;
                sound_dice2.play();
            }
        }
    }
}


//---accessory-----------------------------------------------------------------------------------------------------


//bar
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

//button
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

//music
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

//rader chart
function radarchart(scene, x0, y0, r, str, dex, int, luk, str_item, dex_item, int_item, luk_item) {
    //base
    let base = 25;
    //calc (x,y) from status
    let x1 = 0;
    let y1 = -r * str/base;
    let x2 = r * dex/base;
    let y2 = 0;
    let x3 = 0;
    let y3 = r * luk/base;
    let x4 = -r * int/base;
    let y4 = 0;
    let y1i = -r * (str+str_item)/base;
    let x2i = r * (dex+dex_item)/base;
    let y3i = r * (luk+luk_item)/base;
    let x4i = -r * (int+int_item)/base;
    //remove old chart
    try {
        radar1.setVisible(false);
        radar2.setVisible(false);
        radar3.setVisible(false);
        radar4.setVisible(false);
        radar5.setVisible(false);
        radar6.setVisible(false);
        radar7.setVisible(false);
        radar8.setVisible(false);
        radar9.setVisible(false);
    } catch(error) {
    }
    //draw
    radar1 = scene.add.polygon(x0+r, y0+r, [0,-r,r,0,0,r,-r,0], 0xDADADA, 0.4);
    radar2 = scene.add.polygon(x0+r*0.75, y0+r*0.75, [0,-r*0.75,r*0.75,0,0,r*0.75,-r*0.75,0], 0xDADADA, 0.4);
    radar3 = scene.add.polygon(x0+r/2, y0+r/2, [0,-r/2,r/2,0,0,r/2,-r/2,0], 0xDADADA, 0.4);
    radar4 = scene.add.polygon(x0+(-x4i+x2i)/2, y0+(-y1i+y3i)/2, [x1,y1i,x2i,y2,x3,y3i,x4i,y4], 0xF9C270, 1);
    radar5 = scene.add.polygon(x0+(-x4+x2)/2, y0+(-y1+y3)/2, [x1,y1,x2,y2,x3,y3,x4,y4], 0xFFF67F, 1);
    let font_arg = {font: "17px Arial", fill: "#000000"};
    radar6 = scene.add.text(x0-15, y0-r-25, "STR"+"\n"+(Math.round( (str+str_item)*100 )/100).toFixed(2), font_arg);
    radar7 = scene.add.text(x0+r-5, y0-10, "DEX"+"\n"+(Math.round( (dex+dex_item)*100 )/100).toFixed(2), font_arg);
    radar8 = scene.add.text(x0-15, y0+r-5, "LUK"+"\n"+(Math.round( (luk+luk_item)*100 )/100).toFixed(2), font_arg);
    radar9 = scene.add.text(x0-r-20, y0-10, "INT"+"\n"+(Math.round( (int+int_item)*100 )/100).toFixed(2), font_arg);
}
async function draw_radarchart(scene) {
        let _x = 1136;
        let _y = 115;
        let _r = 80;
        let _res = await contract_get_item_count(summoner);
        radarchart(scene, _x, _y, _r, local_strength, local_dexterity, local_intelligence, local_luck, _res[0], _res[1], _res[2], local_heart*5/100);
}


//window craft
function open_window_craft (scene) {

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
        console.log("selected_item:", global_selected_crafting_item, global_selected_crafting_item_dc);
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
            console.log("modified_dc:", _dc);
        } else {
            text_crafting_selected_item_ohana.setText("");
            text_crafting_selected_item_kusa.setText("");
            text_crafting_selected_item_time.setText("");
            icon_crafting_ohana.visible = false;
            icon_crafting_kusa.visible = false;
            icon_crafting_time.visible = false;
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
    function create_button(_x, _y, _text, _item_type, scene) {
        let obj = scene.add.text(_x, _y, _text)
            .setFontSize(30).setFontFamily("Arial").setFill('#000000')
            .setInteractive({useHandCursor: true})
            .on("pointerdown", () => close_crafting_window(_item_type) )
            .on("pointerover", () => obj.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#ffff00' }))
            .on("pointerout", () => obj.setStyle({ fontSize: 30, fontFamily: "Arial", fill: '#000000' }))
        return obj;
    }

    //create window
    window_crafting = scene.add.sprite(640, 480, "window").setInteractive();

    //create item list text
    button_crafting_close = create_button(1070, 790, "Cancel", 0, scene);
    let _x = 170;
    let _y = 110;
    let _y_add = 40;
    let _item_count = 0;
    //mining_item
    for (var i = 1; i <= 16; i++) {
        //use eval to create dynamic variants
        eval(`button_crafting_item${i}  = create_button(_x, _y + _y_add *  ${i}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + '] ' + array_item_name[${i}],  ${i},  scene);`)
    }
    item1_icon = scene.add.sprite(_x-25, _y+10 + _y_add *  1, "mr_astar_right").setScale(0.08);
    item2_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  2, "item_crown").setScale(0.15);
    item3_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  3, "item_fortune_statue").setScale(0.15);
    item5_icon = scene.add.sprite(_x-20, _y+15 + _y_add *  5, "item_pudding").setScale(0.2);
    item6_icon = scene.add.sprite(_x-15, _y+45 + _y_add *  6, "item_ribbon").setScale(0.35);

    //farming_item
    _x = 520;
    for (var i = 17; i <= 32; i++) {
        eval(`button_crafting_item${i}  = create_button(_x, _y + _y_add *  ${i-16}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + '] ' + array_item_name[${i}],  ${i},  scene);`)
    }
    item17_icon = scene.add.sprite(_x-25, _y+10 + _y_add *  1, "item_vase").setScale(0.08);
    item18_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  2, "ms_ether_right").setScale(0.08);
    item19_icon = scene.add.sprite(_x-25, _y+15 + _y_add *  3, "item_hat_mugiwara").setScale(0.15);
    item22_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  6, "item_chocolate_bread").setScale(0.25);

    //crafting_item
    _x = 870;
    for (var i = 33; i <= 48; i++) {
        eval(`button_crafting_item${i}  = create_button(_x, _y + _y_add *  ${i-32}, '[' + local_items[${i}] + ',' + local_items[${i+64}] + '] ' + array_item_name[${i}],  ${i},  scene);`)
    }
    item33_icon = scene.add.sprite(_x-25, _y+10 + _y_add *  1, "item_violin").setScale(0.08);
    item34_icon = scene.add.sprite(_x-25, _y+10 + _y_add *  2, "item_musicbox").setScale(0.12);
    item35_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  3, "dr_bitco_right").setScale(0.08);
    item36_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  4, "item_dice").setScale(0.18);
    item37_icon = scene.add.sprite(_x-25, _y+20 + _y_add *  5, "item_hat_knit").setScale(0.14);

    //coin/material bag
    button_crafting_item194  = create_button(170, 110 + 40*17, "[" +local_items[194]+ "] Ohana Piggy Bank", 194,  scene);
    button_crafting_item195  = create_button(520, 110 + 40*17, "[" +local_items[195]+ "] Kusa Pouch", 195,  scene);

    //create group
    group_window_crafting = scene.add.group();
    group_window_crafting.add(window_crafting);
    group_window_crafting.add(button_crafting_close);
    group_window_crafting.add(button_crafting_item1);
    group_window_crafting.add(button_crafting_item2);
    group_window_crafting.add(button_crafting_item3);
    group_window_crafting.add(button_crafting_item4);
    group_window_crafting.add(button_crafting_item5);
    group_window_crafting.add(button_crafting_item6);
    group_window_crafting.add(button_crafting_item7);
    group_window_crafting.add(button_crafting_item8);
    group_window_crafting.add(button_crafting_item9);
    group_window_crafting.add(button_crafting_item10);
    group_window_crafting.add(button_crafting_item11);
    group_window_crafting.add(button_crafting_item12);
    group_window_crafting.add(button_crafting_item13);
    group_window_crafting.add(button_crafting_item14);
    group_window_crafting.add(button_crafting_item15);
    group_window_crafting.add(button_crafting_item16);
    group_window_crafting.add(button_crafting_item17);
    group_window_crafting.add(button_crafting_item18);
    group_window_crafting.add(button_crafting_item19);
    group_window_crafting.add(button_crafting_item20);
    group_window_crafting.add(button_crafting_item21);
    group_window_crafting.add(button_crafting_item22);
    group_window_crafting.add(button_crafting_item23);
    group_window_crafting.add(button_crafting_item24);
    group_window_crafting.add(button_crafting_item25);
    group_window_crafting.add(button_crafting_item26);
    group_window_crafting.add(button_crafting_item27);
    group_window_crafting.add(button_crafting_item28);
    group_window_crafting.add(button_crafting_item29);
    group_window_crafting.add(button_crafting_item30);
    group_window_crafting.add(button_crafting_item31);
    group_window_crafting.add(button_crafting_item32);
    group_window_crafting.add(button_crafting_item33);
    group_window_crafting.add(button_crafting_item34);
    group_window_crafting.add(button_crafting_item35);
    group_window_crafting.add(button_crafting_item36);
    group_window_crafting.add(button_crafting_item37);
    group_window_crafting.add(button_crafting_item38);
    group_window_crafting.add(button_crafting_item39);
    group_window_crafting.add(button_crafting_item40);
    group_window_crafting.add(button_crafting_item41);
    group_window_crafting.add(button_crafting_item42);
    group_window_crafting.add(button_crafting_item43);
    group_window_crafting.add(button_crafting_item44);
    group_window_crafting.add(button_crafting_item45);
    group_window_crafting.add(button_crafting_item46);
    group_window_crafting.add(button_crafting_item47);
    group_window_crafting.add(button_crafting_item48);
    group_window_crafting.add(button_crafting_item194);
    group_window_crafting.add(button_crafting_item195);
    group_window_crafting.add(item1_icon);
    group_window_crafting.add(item2_icon);
    group_window_crafting.add(item3_icon);
    group_window_crafting.add(item5_icon);
    group_window_crafting.add(item6_icon);
    group_window_crafting.add(item17_icon);
    group_window_crafting.add(item18_icon);
    group_window_crafting.add(item19_icon);
    group_window_crafting.add(item22_icon);
    group_window_crafting.add(item33_icon);
    group_window_crafting.add(item34_icon);
    group_window_crafting.add(item35_icon);
    group_window_crafting.add(item36_icon);
    group_window_crafting.add(item37_icon);
    group_window_crafting.setDepth(9999 + 1);
}


//window summon
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


//---config-----------------------------------------------------------------------------------------------------


let config = {
    type: Phaser.CANVAS,
    parent: "game",
    backgroundColor: "F4B4D0",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 960,
        fps: 30,
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
};

let game = new Phaser.Game(config);


//---preload-----------------------------------------------------------------------------------------------------


function preload() {

    //back
    this.load.image("back", "png/back4.png");

    //murasaki-san
    this.load.spritesheet("murasaki_right", "png/murasaki_right.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_left", "png/murasaki_left.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_sleeping", "png/murasaki_sleeping.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_feeding", "png/murasaki_feeding.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_feeding_happy_right", 
        "png/murasaki_feeding_happy_right.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_feeding_happy_left", 
        "png/murasaki_feeding_happy_left.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_crying", "png/murasaki_crying.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_mining", "png/murasaki_mining.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_hugging", "png/murasaki_hugging.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_farming", "png/murasaki_farming.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_grooming", "png/murasaki_grooming3.png", {frameWidth: 720, frameHeight: 622});
    this.load.spritesheet("murasaki_crafting", "png/murasaki_crafting.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_working_left", "png/murasaki_working_left.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_working_right", "png/murasaki_working_right.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_click", "png/murasaki_click.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_stone", "png/murasaki_stone.png", {frameWidth: 370, frameHeight: 320});
    this.load.spritesheet("murasaki_hungry", "png/murasaki_hungry.png", {frameWidth: 370, frameHeight: 320});

    //icon button
    this.load.image("button_feeding", "png/button_feeding.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_feeding_pointerover", "png/button_feeding_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("food_sweet_potato", "png/food_sweet_potato.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("item_bear", "png/item_bear.png", {frameWidth: 720, frameHeight: 622});
    this.load.image("button_mining_enable", "png/button_mining_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_unable", "png/button_mining_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_pointerover", "png/button_mining_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_working", "png/button_mining_working.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_mining_pointerover_stop", "png/button_mining_pointerover_stop.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_enable", "png/button_farming_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_unable", "png/button_farming_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_pointerover", "png/button_farming_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_working", "png/button_farming_working.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_farming_pointerover_stop", "png/button_farming_pointerover_stop.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_enable", "png/button_crafting_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_unable", "png/button_crafting_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_pointerover", "png/button_crafting_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_working", "png/button_crafting_working.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_crafting_pointerover_stop", "png/button_crafting_pointerover_stop.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_grooming_enable", "png/button_grooming_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_grooming_unable", "png/button_grooming_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_grooming_pointerover", "png/button_grooming_pointerover.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_levelup_enable", "png/button_levelup_enable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_levelup_unable", "png/button_levelup_unable.png", {frameWidth: 500, frameHeight: 500});
    this.load.image("button_levelup_pointerover", "png/button_levelup_pointerover.png", {frameWidth: 500, frameHeight: 500});

    //pet
    this.load.spritesheet("mr_astar_right", "png/mr_astar_right.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("mr_astar_left", "png/mr_astar_left.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("ms_ether_right", "png/ms_ether_right.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("ms_ether_left", "png/ms_ether_left.png", {frameWidth: 600, frameHeight: 600});
    //this.load.spritesheet("master_solid_right", "png/master_solid_right.png", {frameWidth: 600, frameHeight: 600});
    //this.load.spritesheet("master_solid_left", "png/master_solid_left.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("dr_bitco_right", "png/dr_bitco_right.png", {frameWidth: 600, frameHeight: 600});
    this.load.spritesheet("dr_bitco_left", "png/dr_bitco_left.png", {frameWidth: 600, frameHeight: 600});

    //music
    this.load.audio("bgm1", "mp3/Morning_2.mp3");
    this.load.audio("bgm2", "mp3/Roll_Roll_Roll.mp3");
    this.load.audio("bgm3", "mp3/amaoto.mp3");

    //sound
    this.load.audio("button_on", "sound/button_on.mp3");
    this.load.audio("button_select", "sound/button_select.mp3");
    this.load.audio("feeding", "sound/feeding.mp3");
    this.load.audio("grooming", "sound/grooming.mp3");
    this.load.audio("mining", "sound/mining.mp3");
    this.load.audio("mining_during", "sound/mining_during.mp3");
    this.load.audio("farming", "sound/farming.mp3");
    this.load.audio("farming_during", "sound/farming_during.mp3");
    this.load.audio("crafting", "sound/crafting.mp3");
    this.load.audio("crafting_during", "sound/crafting_during.mp3");
    this.load.audio("happy", "sound/happy.mp3");
    this.load.audio("earn", "sound/earn.wav");
    this.load.audio("dice", "sound/dice.mp3");
    this.load.audio("dice2", "sound/dice2.mp3");
    this.load.audio("hat", "sound/hat.mp3");

    //items
    this.load.spritesheet("item_musicbox", "png/item_musicbox.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_violin", "png/item_violin.png", {frameWidth: 600, frameHeight: 600});
    this.load.image("item_vase", "png/item_vase.png", {frameWidth: 300, frameHeight: 300});
    this.load.image("item_kanban", "png/item_kanban2.png", {frameWidth: 1000, frameHeight: 475});
    this.load.spritesheet("item_crown", "png/item_crown.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_pudding", "png/item_pudding2.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_chocolate_bread", "png/item_chocolate_bread.png", {frameWidth: 643, frameHeight: 477});
    this.load.image("item_fortune_statue", "png/item_fortune_statue.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_ribbon", "png/item_ribbon2.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_tiny_crown", "png/item_tiny_crown.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_ohana_piggy_bank", "png/item_ohana_piggy_bank.png", {frameWidth: 619, frameHeight: 659});
    this.load.image("item_kusa_pouch", "png/item_kusa_pouch.png", {frameWidth: 636, frameHeight: 895});
    this.load.image("item_dice", "png/item_dice.png", {frameWidth: 200, frameHeight: 200});
    this.load.image("item_hat_knit", "png/item_hat_knit.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_hat_mugiwara", "png/item_hat_mugiwara.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_bank", "png/item_bank.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("item_bank_broken", "png/item_bank_broken.png", {frameWidth: 370, frameHeight: 320});
    
    //items_todo
    this.load.image("item_mushroom", "png/item_mushroom.png", {frameWidth: 300, frameHeight: 300});
    this.load.image("item_the_rock", "png/item_the_rock.png", {frameWidth: 300, frameHeight: 300});
    this.load.image("item_cactus", "png/item_cactus.png", {frameWidth: 300, frameHeight: 300});
    this.load.image("item_needle_cushion", "png/item_needle_cushion.png", {frameWidth: 300, frameHeight: 300});
    this.load.image("item_horsetail", "png/item_horsetail.png", {frameWidth: 300, frameHeight: 300});
    this.load.image("item_aquarium", "png/item_aquarium.png", {frameWidth: 300, frameHeight: 300});
    this.load.image("item_the_earth", "png/item_the_earth.png", {frameWidth: 300, frameHeight: 300});    

    //window
    this.load.image("window", "png/window.png");

    //icon
    this.load.image("icon_kusa", "png/icon_kusa.png", {frameWidth: 350, frameHeight: 350});
    this.load.image("icon_ohana", "png/icon_ohana.png", {frameWidth: 350, frameHeight: 350});
    this.load.image("icon_age", "png/icon_age.png", {frameWidth: 300, frameHeight: 325});
    this.load.image("icon_clock", "png/icon_clock.png", {frameWidth: 225, frameHeight: 225});
    this.load.image("icon_heart", "png/icon_heart.png", {frameWidth: 370, frameHeight: 320});
    this.load.image("icon_rotate", "png/icon_rotate.png", {frameWidth: 980, frameHeight: 818});
    this.load.image("icon_home", "png/icon_home.png", {frameWidth: 512, frameHeight: 512});

    //level_back
    this.load.image("back_level", "png/back_level.png", {frameWidth: 500, frameHeight: 500});

    //loading screen
    //https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0xFDEFF5, 0.4);
    progressBox.fillRect(480, 450, 320, 50);
    let progressText = this.add.text(490,520,"", {font: "20px monospace", fill: "#3D3D3D"}); 
    let progressText_loading = this.add.text(490,420, "Loading...", {font: "20px monospace", fill: "#3D3D3D"});
    let percentText = this.add.text(510, 465, "", {font: "20px monospace", fill: "#3D3D3D"});
    this.load.on("progress", function(value) {
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
    });
    this.load.on("fileprogress", function(file) {
        progressText.setText("Loading asset: " + file.src);
    });
    this.load.on("complete", function() {
        progressBar.destroy();
        progressBox.destroy();
        progressText.destroy();
        progressText_loading.destroy();
        percentText.destroy();
    });

    //input text
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: "js_v2/rexuiplugin.min.js",
        sceneKey: 'rexUI'
    });
	this.load.plugin('rextexteditplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js', true)
}


//---create-----------------------------------------------------------------------------------------------------


function create() {

    //===back image===

    this.add.image(640, 480, "back");

    //===animation murasaki===

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

    //===animation pet===

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
    
    //===animation item===
    
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
    
    //===item_bear===

    item_bear = this.add.sprite(1000,400, "item_bear");
    item_bear.scaleX = item_bear.scaleX * 0.45;
    item_bear.scaleY = item_bear.scaleY * 0.45;

    //===click button===

    //feeding
    button_feeding = this.add.sprite(610,850, "button_feeding");
    button_feeding.scaleX = button_feeding.scaleX * 0.16;
    button_feeding.scaleY = button_feeding.scaleY * 0.16;
    button_feeding.setInteractive({useHandCursor: true});
    button_feeding.on('pointerdown', () => sound_button_on.play() );
    button_feeding.on('pointerdown', () => contract_feeding(summoner) );
    button_feeding.on('pointerover', () => sound_button_select.play());
    button_feeding.on('pointerover', () => button_feeding.setTexture("button_feeding_pointerover"));
    button_feeding.on('pointerout', () => button_feeding.setTexture("button_feeding"));

    //grooming
    button_grooming = this.add.sprite(1150,400, "button_grooming_unable");
    button_grooming.scaleX = button_grooming.scaleX * 0.16;
    button_grooming.scaleY = button_grooming.scaleY * 0.16;
    button_grooming.setInteractive({useHandCursor: true});
    button_grooming.on('pointerdown', () => sound_button_on.play() );
    button_grooming.on('pointerdown', () => contract_grooming(summoner) );
    button_grooming.on('pointerover', () => sound_button_select.play());
    button_grooming.on('pointerover', () => button_grooming.setTexture("button_grooming_pointerover"));
    button_grooming.on('pointerout', () => button_grooming.setTexture("button_grooming"));
    button_grooming.disableInteractive();

    //crafting
    button_crafting = this.add.sprite(700,150, "button_crafting_unable");
    button_crafting.scaleX = button_crafting.scaleX * 0.16;
    button_crafting.scaleY = button_crafting.scaleY * 0.16;
    button_crafting.setInteractive({useHandCursor: true});
    button_crafting.on('pointerdown', () => sound_button_on.play() );
    button_crafting.on('pointerdown', () => contract_crafting(summoner) );
    button_crafting.on('pointerover', () => sound_button_select.play());
    button_crafting.on('pointerover', () => button_crafting.setTexture("button_crafting_pointerover"));
    button_crafting.on('pointerout', () => button_crafting.setTexture("button_crafting_enable"));
    button_crafting.disableInteractive();
    //--select item
    //icon_ohana
    icon_crafting_ohana = this.add.sprite(758, 163, "icon_ohana");
    icon_crafting_ohana.setScale(0.07);
    icon_crafting_ohana.visible = false;
    //icon_kusa
    icon_crafting_kusa = this.add.sprite(830, 165, "icon_kusa");
    icon_crafting_kusa.setScale(0.09);
    icon_crafting_kusa.visible = false;
    //icon_clock
    icon_crafting_time = this.add.sprite(900, 165, "icon_clock");
    icon_crafting_time.setScale(0.09);
    icon_crafting_time.visible = false;
    //text
    text_crafting_selected_item_ohana = this.add.text(772, 155, "", {font: "18px Arial", fill: "#000"});
    text_crafting_selected_item_kusa = this.add.text(842, 155, "", {font: "18px Arial", fill: "#000"});
    text_crafting_selected_item_time = this.add.text(914, 155, "", {font: "18px Arial", fill: "#000"});
    //--craftimg info
    //icon_clock
    icon_crafting_time_remining = this.add.sprite(760,165, "icon_clock");
    icon_crafting_time_remining.setScale(0.09);
    icon_crafting_time_remining.visible = false;
    //text
    text_crafting_calc = this.add.text(775, 155, "", {font: "18px Arial", fill: "#000"});

    //mining
    button_mining = this.add.sprite(50,700, "button_mining_unable");
    button_mining.scaleX = button_mining.scaleX * 0.16;
    button_mining.scaleY = button_mining.scaleY * 0.16;
    button_mining.setInteractive({useHandCursor: true});
    button_mining.on('pointerdown', () => sound_button_on.play() );
    button_mining.on('pointerdown', () => contract_mining(summoner) );
    button_mining.on('pointerover', () => sound_button_select.play());
    button_mining.on('pointerover', () => button_mining.setTexture("button_mining_pointerover"));
    button_mining.on('pointerout', () => button_mining.setTexture("button_mining_enable"));
    button_mining.disableInteractive();
    //icon
    icon_mining = this.add.sprite(103,678, "icon_ohana");
    icon_mining.setScale(0.07);
    icon_mining.visible = false;
    //text
    text_mining_calc = this.add.text(115, 670, "", {font: "18px Arial", fill: "#000"});

    //farming
    button_farming = this.add.sprite(300,150, "button_farming_unable");
    button_farming.scaleX = button_farming.scaleX * 0.16;
    button_farming.scaleY = button_farming.scaleY * 0.16;
    button_farming.setInteractive({useHandCursor: true});
    button_farming.on('pointerdown', () => sound_button_on.play() );
    button_farming.on('pointerdown', () => contract_farming(summoner) );
    button_farming.on('pointerover', () => sound_button_select.play());
    button_farming.on('pointerover', () => button_farming.setTexture("button_farming_pointerover"));
    button_farming.on('pointerout', () => button_farming.setTexture("button_farming_enable"));
    button_farming.disableInteractive();
    //icon
    icon_farming = this.add.sprite(355,130, "icon_kusa");
    icon_farming.setScale(0.09);
    icon_farming.visible = false;
    //text
    text_farming_calc = this.add.text(370, 120, "", {font: "18px Arial", fill: "#000"});

    //levelup
    button_levelup = this.add.sprite(1220, 35, "back_level");
    button_levelup.scaleX = button_levelup.scaleX * 0.11;
    button_levelup.scaleY = button_levelup.scaleY * 0.11;
    button_levelup.setInteractive({useHandCursor: true});
    button_levelup.on('pointerdown', () => sound_button_on.play() );
    button_levelup.on('pointerdown', () => contract_level_up(summoner) );
    button_levelup.on('pointerover', () => sound_button_select.play());
    button_levelup.on('pointerover', () => button_levelup.setTexture("button_levelup_pointerover"));
    button_levelup.on('pointerover', () => text_level.setText(""));
    button_levelup.on('pointerout', () => button_levelup.setTexture("button_levelup_enable"));
    button_levelup.on('pointerout', () => text_level.setText(local_level));
    button_levelup.disableInteractive();

    //===system click button===

    //icon_rotate
    icon_rotate = this.add.sprite(50,900, "icon_rotate")
        .setOrigin(0.5)
        .setScale(0.075)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play())
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
    icon_home = this.add.sprite(130,900, "icon_home")
        .setOrigin(0.5)
        .setScale(0.15)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => sound_button_on.play())
        .on("pointerdown", () => {
                window.location.href = "./";
        });

    //===music===

    //sound out of focus
    this.sound.pauseOnBlur = false
    bgm1 = this.sound.add("bgm1", {volume:0.1, loop:true});
    bgm2 = this.sound.add("bgm2", {volume:0.1, loop:true});
    bgm3 = this.sound.add("bgm3", {volume:0.1, loop:true});

    //sound
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
    sound_dice2 = this.sound.add("dice2", {volume:0.1});
    sound_hat = this.sound.add("hat", {volume:0.1});

    //===create summoner===

    murasakisan = new Murasakisan(this, 500 + Math.random()*200, 640 + Math.random()*100);
    murasakisan.setScale(0.45);

    //===system message===

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
    //new Button(10, 880, 'Kill', this, () => contract_burn(summoner));

    //curePetrification
    text_curePetrification = this.add.text(640, 480, " >> Cure Petrification (Cost: Lv x 10 $ASTR) << ", {font: "28px Arial", fill: "#E62E8B", backgroundColor: "#FDEFF5"})
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on("pointerdown", () => contract_curePetrification(summoner) )
        .on("pointerover", () => text_curePetrification.setStyle({ fontSize: 28, fontFamily: "Arial", fill: '#0000ff' }))
        .on("pointerout", () => text_curePetrification.setStyle({ fontSize: 28, fontFamily: "Arial", fill: '#E62E8B' }));
    text_curePetrification.visible = false;

    //===status===

    let font_arg = {font: "18px Arial", fill: "#000"};

    //age
    text_age_time =     this.add.text(1213, 67, "***", font_arg);
    icon_age = this.add.sprite(1200,77, "icon_age");
    icon_age.setScale(0.06);

    //debug info
    //text_speed =        this.add.text(10, 910, "***", font_arg);
    text_mode = this.add.text(1150, 916, "***", {font: "14px Arial", fill: "#727171"});
    text_turn = this.add.text(1150, 928, "***", {font: "14px Arial", fill: "#727171"});
    text_sync_time = this.add.text(1150, 940, "***", {font: "14px Arial", fill: "#727171"});
    text_wallet = this.add.text(10, 940, "***", {font: "14px Arial", fill: "#727171"});

    //satiety
    icon_satiety = this.add.sprite(30,25, "button_feeding");
    icon_satiety.setScale(0.07);
    bar_satiety_back = makeBar(this, 55, 15, 0xF8C5AC);
    bar_satiety_back.scaleX = 1;
    bar_satiety = makeBar(this, 55, 15, 0xE60012);
    bar_satiety.scaleX = 0;
    text_satiety = this.add.text(60, 16, "0%", {font: "17px Arial", fill: "#ffffff"});

    //happy
    icon_happy = this.add.sprite(245,25, "button_grooming_enable");
    icon_happy.setScale(0.07);
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
    icon_ohana = this.add.sprite(668,23, "icon_ohana");
    icon_ohana.setScale(0.07);
    text_coin = this.add.text(685, 15, "Ohana: 0", {font: "17px Arial", fill: "#000", backgroundColor: "#FFF200"});
    text_coin_earned = this.add.text(685, 38, "", {font: "17px Arial", fill: "#000000"});
    text_coin_earned_count = 0;

    //material
    icon_kusa = this.add.sprite(815, 25, "icon_kusa");
    icon_kusa.setScale(0.09);
    text_material = this.add.text(830, 15, "Kusa: 0", {font: "17px Arial", fill: "#000", backgroundColor: "#D7E7AF"});
    text_material_earned = this.add.text(830, 38, "", {font: "17px Arial", fill: "#000000"});
    text_material_earned_count = 0;

    //level
    text_level = this.add.text(1220, 42, "0", {font: "bold 26px Verdana", fill: "#E5004F"}).setOrigin(0.5);

    //heart
    icon_heart = this.add.sprite(960, 21, "icon_heart");
    icon_heart.setScale(0.08);
    text_heart = this.add.text(975, 15, "***", {font: "17px Arial", fill: "#000", backgroundColor: "#FDEEED"});

    //name
    item_kanban = this.add.sprite(85, 75, "item_kanban");
    item_kanban.setScale(0.14);
    text_kanban = this.add.text(85, 77, "", {font: "17px Arial", fill: "#ffffff"}).setOrigin(0.5);
	text_kanban.setInteractive().on('pointerdown', () => {this.rexUI.edit(text_kanban)})
    text_mint_name = this.add.text(165, 60, "[MINT NAME]", {font: "17px Arial", fill: "#000000"})
        .setInteractive({useHandCursor: true})
        .on("pointerover", () => text_mint_name.setStyle({ fontSize: 17, fontFamily: "Arial", fill: '#ffff00' }))
        .on("pointerout", () => text_mint_name.setStyle({ fontSize: 17, fontFamily: "Arial", fill: '#000000' }));
    text_mint_name.setInteractive().on("pointerdown", () => {contract_mint_name(summoner, text_kanban.text)});
    //text_mint_name.visible = false;
    icon_name_ohana = this.add.sprite(173, 90, "icon_ohana");
    icon_name_ohana.setScale(0.05);
    text_name_ohana = this.add.text(185, 82, "100", {font: "17px Arial", fill: "#000000"});
    icon_name_kusa = this.add.sprite(225, 90, "icon_kusa");
    icon_name_kusa.setScale(0.07);
    text_name_kusa = this.add.text(235, 82, "100", {font: "17px Arial", fill: "#000000"});
    //group
    group_mint_name = this.add.group();
    group_mint_name.add(text_mint_name);
    group_mint_name.add(icon_name_ohana);
    group_mint_name.add(text_name_ohana);
    group_mint_name.add(icon_name_kusa);
    group_mint_name.add(text_name_kusa);
    group_mint_name.setVisible(false);
    
    //id
    text_id = this.add.text(17,86, "#100", {font: "14px Arial", fill: "#ffffff"});

    //===etc===

    //crafting_window ***TODO***
    //select crafting_item_type
    text_select_item = this.add.text(750, 120, ">> Select Item <<", {font: "30px Arial", fill: "#000", backgroundColor: "#ecd9ff"})
                .setFontSize(24).setFontFamily("Arial").setFill('#000000')
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => open_window_craft(this) )
                .on("pointerover", () => text_select_item.setStyle({ fontSize: 24, fontFamily: "Arial", fill: '#d19dff' }))
                .on("pointerout", () => text_select_item.setStyle({ fontSize: 24, fontFamily: "Arial", fill: '#000000' }));
    text_craft_item = this.add.text(750, 150, "", font_arg)
                .setInteractive({useHandCursor: true})
                .on("pointerdown", () => open_window_craft(this) )
}


//---update-----------------------------------------------------------------------------------------------------


//update system message
function update_systemMessage() {
    if (summoner == -1) {
        text_system_message.setText(" --- Connecting to Astar Network... --- ");
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

//main function
function update() {

    //increment turn
    turn += 1;
    text_turn.setText("turn: " + turn);

    //update summoner
    if (local_level > 0) {
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

    //===== sync time =====

    if (turn % 20 == 0) {

        //debug
        //console.log(Math.round(game.input.mousePointer.x), Math.round(game.input.mousePointer.y));

        /*
        //protection code
        if (location.hostname != "murasaki-san.com") {
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
        */

        text_mode.setText(murasakisan.get_mode);
        if (last_sync_time == 0) {
            text_sync_time.setText("syncing...");
        } else {
            let _delta = Math.round( (Date.now() - last_sync_time) / 1000 );
            text_sync_time.setText("synced: " + _delta + "s ago");
        }
    }

    //===== numeric animation =====

    if (turn % 2 == 0) {

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

    //===== update parameters with animation =====

    if (turn % 150 == 0) {

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

    //===== update parameters without animation =====

    if (turn % 150 == 10) {

        //age
        let now_time = Date.now() / 1000;
        let age_time = Math.round(now_time - local_birth_time);
        let age = Math.round( age_time * SPEED / 86400 );
        text_age_time.setText(age + "d");

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
            let _delta = (now_time - local_mining_start_time);
            let _daily_earn = local_coin_calc / _delta * 8640;
            text_mining_calc.setText(" +" + local_coin_calc + " Ohana\n  (" + Math.round(_daily_earn/10)*10 + " /d)");
        }else if (_mode == "farming") {
            icon_farming.visible = true;
            let _delta = (now_time - local_farming_start_time);
            let _daily_earn = local_material_calc / _delta * 8640;
            text_farming_calc.setText(" +" + local_material_calc + " Kusa\n  (" + Math.round(_daily_earn/10)*10 + " /d)");
        }else if (_mode == "crafting") {
            icon_crafting_time_remining.visible = true;
            if (local_crafting_calc > 0) {
                //TOFIX: invisible selecte item info
                text_crafting_selected_item_ohana.setText("");
                text_crafting_selected_item_kusa.setText("");
                text_crafting_selected_item_time.setText("");
                icon_crafting_ohana.visible = false;
                icon_crafting_kusa.visible = false;
                icon_crafting_time.visible = false;
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
        
        //name
        if (previous_local_name_str != local_name_str || previous_local_level != local_level) {
            let _name_str;
            if (local_name_str == "" && local_level >= 3) {
                _name_str = "(enter name)";
                text_kanban.setInteractive();
                group_mint_name.setVisible(true);
            } else {
                if (local_name_str != "") {
                    _name_str = local_name_str;
                }
                text_kanban.disableInteractive();
                group_mint_name.setVisible(false);
            }
            text_kanban.setText(_name_str);
            text_id.setText("# "+summoner);
        }
        
        //wallet text
        let _owner1 = local_owner.substring(0,5);
        let _owner2 = local_owner.slice(-4);
        let _text = "";
        _text += "owner: " + _owner1 + "..." + _owner2 + ", ";
        if (local_owner != local_wallet && local_owner != "0x0000000000000000000000000000000000000000") {
            _text += "not owned by you.";
        }
        text_wallet.setText(_text);

        previous_local_name_str = local_name_str;
    }

    //===== check mode change =====

    if (turn % 150 == 20) {

        //check petrified
        if (local_notPetrified == false) {
            murasakisan.set_mode = "petrified";

        //level up
        } else if (local_level > previous_local_level) {
            //update radarchart
            draw_radarchart(this);
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
            murasakisan.target_y = 730;
            if (typeof group_food != "undefined") {
                group_food.destroy();
            }
            
            /*
            item_potato = this.add.sprite(620, 740, "food_sweet_potato").setScale(0.12).setOrigin(0.5);
            item_pudding = this.add.sprite(590, 750, "item_pudding").setScale(0.35).setOrigin(0.5);
            item_chocolate_bread = this.add.sprite(670, 750, "item_chocolate_bread").setScale(0.4).setOrigin(0.5);
            */

            group_food = this.add.group();
            item_potato = this.add.sprite(620, 740, "food_sweet_potato").setScale(0.12).setOrigin(0.5);
            item_potato.depth = 9999;
            group_food.add(item_potato);
            if (local_items[5] > 0) {
                item_pudding = this.add.sprite(590, 750, "item_pudding").setScale(0.30).setOrigin(0.5);
                item_pudding.depth = 9999;
                group_food.add(item_pudding);
            }
            if (local_items[22] > 0) {
                item_chocolate_bread = this.add.sprite(670, 750, "item_chocolate_bread").setScale(0.4).setOrigin(0.5);
                item_chocolate_bread.depth = 9999;
                group_food.add(item_chocolate_bread);
            }
            //food = this.add.sprite(600,730, "food_sweet_potato").setScale(0.12);
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
            murasakisan.target_y = 800;
            sound_mining.play();
        }else if (local_mining_status == 0 & murasakisan.mode == "mining") {
            murasakisan.set_mode = "resting";
            //icon invisible
            icon_mining.visible = false;
            sound_earn.play();

        //farming check, continue
        } else if (local_farming_status == 1 & murasakisan.mode != "farming" & murasakisan.mode != "feeding"){
            murasakisan.set_mode = "farming";
            murasakisan.submode = 0;
            murasakisan.count = 0;
            murasakisan.target_x = 450;
            murasakisan.target_y = 300;
            sound_farming.play();
        }else if (local_farming_status == 0 & murasakisan.mode == "farming") {
            murasakisan.set_mode = "resting";
            //icon invisible
            icon_farming.visible = false;
            sound_earn.play();

        //crafting check, continue
        } else if (local_crafting_status == 1 & murasakisan.mode != "crafting" & murasakisan.mode != "feeding"){
            murasakisan.set_mode = "crafting";
            murasakisan.submode = 0;
            murasakisan.count = 0;
            murasakisan.target_x = 730;
            murasakisan.target_y = 300;
            text_select_item.setText('"'+array_item_name[local_crafting_item_type]+'"')
            sound_crafting.play();
        }else if (local_crafting_status == 0 & murasakisan.mode == "crafting") {
            murasakisan.set_mode = "resting";
            text_select_item.setText(">> Select Item <<")
            draw_radarchart(this);  //update radarchart
            //icon invisible
            icon_crafting_time_remining.visible = false;
            sound_earn.play();
        }

        previous_local_last_feeding_time = local_last_feeding_time;
        previous_local_last_grooming_time = local_last_grooming_time;
        previous_local_level = local_level;
    }

    //===== check button activation =====

    if (turn % 150 == 30) {

        if (
            previous_local_mining_status != local_mining_status ||
            previous_local_farming_status != local_farming_status ||
            previous_local_crafting_status != local_crafting_status
            ) {

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

    //===== check item =====

    if (turn % 150 == 40 && local_items != previous_local_items) {
        let _item_id;
        //1:Ms. Astar
        _item_id = 1;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            mr_astar = new Pet(
                this, 
                400 + Math.random()*300, 
                500 + Math.random()*200, 
                "mr_astar_right", 
                "mr_astar_left",
                "mining"
            ).setScale(0.12);
            
            //hat1
            //hat2

            
        }
        //2:Crown
        _item_id = 2;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_crown = this.add.sprite(1050,290, "item_crown");
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
        //3:Fortune Statue
        _item_id = 3;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_fortune_statue = this.add.sprite(70, 550, "item_fortune_statue").setScale(0.35).setOrigin(0.5);
            item_fortune_statue.depth = item_fortune_statue.y;
        }
        //5:Pudding -> Feeding()
        //6:Ribbon
        _item_id = 6;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_ribbon = this.add.sprite(1057, 443, "item_ribbon").setScale(0.5).setOrigin(0.5);
            item_ribbon.depth = 9999;
        }
        //17:vase
        _item_id = 17;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_17 = this.add.sprite(850,270, "item_vase");
            item_17.setScale(0.2);
            item_17.depth = item_17.y;
        }
        //18:ms_ether
        _item_id = 18;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            ms_ether = new Pet(
                this, 
                400 + Math.random()*300, 
                500 + Math.random()*200, 
                "ms_ether_right", 
                "ms_ether_left",
                "farming"
            ).setScale(0.12);
        }
        //19:straw_hat
        _item_id = 19;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            let _x = 300;
            let _y = 85;
            item_hat_mugiwara = this.add.sprite(_x, _y, "item_hat_mugiwara").setOrigin(0.5).setScale(0.25);
            item_hat_mugiwara.setInteractive({useHandCursor: true});
            item_hat_mugiwara.on('pointerdown', () => {
                if (item_wearing_hat == 0) {
                    item_wearing_hat = item_hat_mugiwara;
                    murasakisan.on_click();
                    sound_hat.play();
                } else if (item_wearing_hat == item_hat_mugiwara) {
                    item_wearing_hat = 0;
                    item_hat_mugiwara.x = _x;
                    item_hat_mugiwara.y = _y;
                }
            });
        }
        //21: Choco. Bread -> Feeding()
        //33:violin
        _item_id = 33;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_violin = this.add.sprite(1200,608, "item_violin");
            item_violin.setScale(0.24);
            item_violin.depth = item_violin.y;
        }
        //34:musicbox
        _item_id = 34;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_musicbox = this.add.sprite(1200,840, "item_musicbox");
            item_musicbox.setScale(0.4);
            item_musicbox.setInteractive({useHandCursor: true});
            item_musicbox.on('pointerdown', () => music() );
            item_musicbox.depth = item_musicbox.y;
        }
        //35:dr_bitco
        _item_id = 35;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            dr_bitco = new Pet(
                this, 
                400 + Math.random()*300, 
                500 + Math.random()*200, 
                "dr_bitco_right", 
                "dr_bitco_left",
                "crafting"
            ).setScale(0.11);
        }
        //36:dice ***TODO***
        _item_id = 36;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            dice = new Dice(this, 400, 600).setScale(0.3);
        }

            /*
            local_items_flag[_item_id] = true;
            item_dice = this.add.sprite(1000, 700, "item_dice").setOrigin(0.5).setScale(0.3);
            item_dice.setInteractive({useHandCursor: true});
            item_dice.on("pointerdown", () => {dice_roll(summoner);});    //***
            item_dice_text_rolled_number = this.add.text(999,698, "", {font: "14px Arial Bold", fill: "#ffffff"}).setOrigin(0.5);
            item_dice_text_next_time = this.add.text(999,740, "", {font: "14px Arial Bold", fill: "#000000"}).setOrigin(0.5);

            item_dice.on("pointerdown", () => {_animation_dice_roll(this);});
            function _animation_dice_roll(scene) {
                for (let i = 0; i <= 10; i++) {
                    item_dice.x -= 10;
                }
            }
        }
        if (local_items_flag[_item_id] == true) {
            //update rolled_dice
            item_dice_text_rolled_number.setText(local_rolled_dice/10);
            //update next roll time
            let _now = Date.now() / 1000;
            let _delta_sec = _now - local_last_dice_roll_time;
            let _next_sec = BASE_SEC * 0.9 - _delta_sec * SPEED;
            if (_next_sec <= 0) {
                item_dice_text_next_time.setText("Roll the Dice");
                item_dice.setInteractive({useHandCursor: true});
            } else {
                let _hr = Math.floor(_next_sec % 86400 / 3600);
                let _min = Math.floor(_next_sec % 3600 / 60);
                let _text = _hr + "h:" + _min + "m";
                item_dice_text_next_time.setText(_text);
                item_dice.disableInteractive();
                //item_dice.setInteractive({useHandCursor: true}); //***
            }
        }
        */
        //37:Knit Hat
        _item_id = 37;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            let _x = 700;
            let _y = 90;
            item_hat_knit = this.add.sprite(_x, _y, "item_hat_knit").setOrigin(0.5).setScale(0.20);
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
        //194:ohana_piggy_pouch
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
                    _array_bank[i] = scene.add.sprite(850 + i*50, 900, "item_bank")
                        .setScale(0.3)
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
                    _array_text[i] = scene.add.text(860 + i*50, 850, "+1000", {font: "17px Arial", fill: "#000000"})
                        .setOrigin(0.5)
                        .setVisible(false);
                    //icon, ohana
                    _array_icon[i] = scene.add.sprite(820 + i*50, 850, "icon_ohana")
                        .setOrigin(0.5)
                        .setScale(0.07)
                        .setVisible(false);
                    group_item194.add(_array_bank[i]);
                    group_item194.add(_array_text[i]);
                    group_item194.add(_array_icon[i]);
                }
            }
            _do(this);
        }
        //195:kusa_pouch
        if (local_items[195] != previous_local_item195) {
            // define async function
            async function _do(scene) {
                // get item195 list, need to wait
                let _array_item195 = await get_userItems(summoner, 195);
                // recreate sprite group
                try {
                    group_item195.destroy(true);
                } catch (error) {
                }
                group_item195 = scene.add.group();
                // create sprite, add group
                for (let i = 0; i < _array_item195.length; i++) {
                    item_pouch = scene.add.sprite(350 + i*50, 900, "item_kusa_pouch");
                    item_pouch.setScale(0.06);
                    item_pouch.setInteractive({useHandCursor: true});
                    item_pouch.on("pointerdown", () => unpack_bag(summoner, _array_item195[i]));
                    group_item195.add(item_pouch);
                }
            }
            _do(this);
        }
        
        //***TODO items***

        //4
        _item_id = 4;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_earth = this.add.sprite(1000,850, "item_the_earth").setOrigin(0.5).setScale(0.4);        
        }
        //20
        _item_id = 20;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_horsetail = this.add.sprite(150,500, "item_horsetail").setOrigin(0.5).setScale(0.3);        
        }
        //21
        _item_id = 21;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_mushroom = this.add.sprite(250,500, "item_mushroom").setOrigin(0.5).setScale(0.3);        
        }
        previous_local_items = local_items;
        previous_local_item194 = local_items[194];
        previous_local_item195 = local_items[195];
        previous_local_rolled_dice = local_rolled_dice;
    }

    //===== update system message =====
    
    //blink message
    if (turn % 300 == 50) {
        text_system_message.setText("");
    }
    //update message text
    if (turn % 150 == 60 || turn == 1 || count_sync == 1) {
        update_systemMessage();
    }

    //===== update onchain data =====

    if (turn % 300 == 80 || turn == 50) {
        //when no summoner argument, load summoner id from wallet
        if (summoner == -1) {
            //can not get summoner id directry, update summoner id is better.
            contract_update_all();
        //when summoner is loaded, update summoner status
        } else if (summoner > 0) {
            contract_update_status(summoner);
        }
    }
}

//---end---
/*
        _item_id = 36;
        if (
            (local_items[_item_id] != 0 || local_items[_item_id+64] != 0 || local_items[_item_id+128] != 0)
            && local_items_flag[_item_id] != true
        ) {
            local_items_flag[_item_id] = true;
            item_dice = this.add.sprite(1000, 700, "item_dice").setOrigin(0.5).setScale(0.3);
            item_dice.setInteractive({useHandCursor: true});
            item_dice.on("pointerdown", () => {dice_roll(summoner);});
            async function _get_rolled_dice(scene) {
                let _rolled_dice = await get_rolled_dice(summoner);
                _rolled_dice = _rolled_dice /10;
                item_dice_text = scene.add.text(999,698, _rolled_dice, {font: "14px Arial Bold", fill: "#ffffff"}).setOrigin(0.5);
                let _last_dice_roll_time = await get_last_dice_roll_time(summoner); 
                let _now = Date.now() / 1000;
                let _delta_sec = _now - _last_dice_roll_time;
                
                let _day = Math.floor(_delta_sec / 86400);
                let _hr = Math.floor(_delta_sec % 86400 / 3600);
                let _min = Math.floor(_delta_sec % 3600 / 60);
                let _text = _day + "d:" + _hr + "h:" + _min + "m";
                
                item_dice_text = scene.add.text(999,748, _text, {font: "14px Arial Bold", fill: "#000000"}).setOrigin(0.5);
            }
            _get_rolled_dice(this);
            //item_needle_cushion = this.add.sprite(790,350, "item_needle_cushion").setOrigin(0.5).setScale(0.3);        
        //check rolled_dice_text
        } else if (
            local_items_flag[_item_id] == true
            && previous_local_dice != local_dice
        ) {
            async function _get_rolled_dice(scene) {
                let _res = await get_rolled_dice(summoner);
                _res = _res /10;
                item_dice_text.setText(_res);
            }
            _get_rolled_dice(this);
        }
        
//get_rolled_dice
async function get_rolled_dice(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_world_dice, contract_world_dice);
    let _res = await contract.methods.get_last_rolled_dice(_summoner).call();
    return _res;    
}

//last_dice_roll_time
async function get_last_dice_roll_time(_summoner) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_world_dice, contract_world_dice);
    let _res = await contract.methods.last_dice_roll_time(_summoner).call();
    return _res;
}

*/
