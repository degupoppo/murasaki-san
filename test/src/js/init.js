
async function set_speed(_value) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_ms = new web3.eth.Contract(abi_murasaki_strage, contract_murasaki_strage);
    contract_ms.methods._set_speed(_value).send({from:wallet});
}

async function initialize_contract() {

    let web3 = await connect();
    let wallet = await get_wallet(web3);
    
    //prepare contracts
    
    //set_speed(1*100);
    
    //nft, ntt
    let contract_mm = new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
    let contract_mc = new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let contract_mn = new web3.eth.Contract(abi_murasaki_name, contract_murasaki_name);
    //function
    let contract_mfs = new web3.eth.Contract(abi_murasaki_function_share, contract_murasaki_function_share);
    let contract_mfsl = new web3.eth.Contract(abi_murasaki_function_summon_and_levelup, contract_murasaki_function_summon_and_levelup);
    let contract_mffg = new web3.eth.Contract(abi_murasaki_function_feeding_and_grooming, contract_murasaki_function_feeding_and_grooming);
    let contract_mfmf = new web3.eth.Contract(abi_murasaki_function_mining_and_farming, contract_murasaki_function_mining_and_farming);
    let contract_mfc = new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    let contract_mfcc = new web3.eth.Contract(abi_murasaki_function_crafting_codex, contract_murasaki_function_crafting_codex);
    let contract_mfn = new web3.eth.Contract(abi_murasaki_function_name, contract_murasaki_function_name);
    //other
    let contract_wd = new web3.eth.Contract(abi_world_dice, contract_world_dice);
    let contract_mml = new web3.eth.Contract(abi_murasaki_mail, contract_murasaki_mail);
    //strage
    let contract_ms = new web3.eth.Contract(abi_murasaki_strage, contract_murasaki_strage);
    let contract_mss = new web3.eth.Contract(abi_murasaki_strage_score, contract_murasaki_strage_score);
    let contract_msn = new web3.eth.Contract(abi_murasaki_strage_nui, contract_murasaki_strage_nui);
    //market
    let contract_mmt = new web3.eth.Contract(abi_murasaki_item_market, contract_murasaki_item_market);
    //admin
    let contract_adm = new web3.eth.Contract(abi_murasaki_admin, contract_murasaki_admin);

    //set contracts

    
    //for mfc update only
    /*
    contract_mc.methods._set_murasaki_function_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mfc.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfc.methods._set2_murasaki_function_crafting_codex_address(contract_murasaki_function_crafting_codex).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_msn.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mml.methods._set2_murasaki_function_crafting_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mfcc.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    */
    
    //set nft,ntt    
    contract_mm.methods._add_permitted_address(contract_murasaki_function_summon_and_levelup).send({from:wallet});
    contract_mn.methods._add_permitted_address(contract_murasaki_function_name).send({from:wallet});
    contract_mc.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mc.methods._add_permitted_address(contract_murasaki_admin).send({from:wallet});
    contract_mn.methods._add_permitted_address(contract_murasaki_admin).send({from:wallet});
    //set function
    contract_mfs.methods._set1_murasaki_main_address(contract_murasaki_main).send({from:wallet});
    contract_mfs.methods._set2_murasaki_strage_address(contract_murasaki_strage).send({from:wallet});
    contract_mfs.methods._set3_murasaki_craft_address(contract_murasaki_craft).send({from:wallet});
    contract_mfs.methods._set4_world_dice_address(contract_world_dice).send({from:wallet});
    contract_mfs.methods._set5_murasaki_name_address(contract_murasaki_name).send({from:wallet});
    contract_mfs.methods._set6_murasaki_strage_score_address(contract_murasaki_strage_score).send({from:wallet});
    contract_mfs.methods._set7_murasaki_mail_address(contract_murasaki_mail).send({from:wallet});
    contract_mfs.methods._set8_murasaki_strage_nui_address(contract_murasaki_strage_nui).send({from:wallet});
    contract_mfsl.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mffg.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfmf.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfc.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfc.methods._set2_murasaki_function_crafting_codex_address(contract_murasaki_function_crafting_codex).send({from:wallet});
    contract_mfcc.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfn.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    //set other
    contract_wd.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mml.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mml.methods._set2_murasaki_function_crafting_address(contract_murasaki_function_crafting).send({from:wallet});
    //set strage
    contract_ms.methods._add_permitted_address(contract_murasaki_function_summon_and_levelup).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_feeding_and_grooming).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_mining_and_farming).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_name).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_summon_and_levelup).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_feeding_and_grooming).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_mining_and_farming).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_name).send({from:wallet});
    contract_msn.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_msn.methods._add_permitted_address(contract_murasaki_admin).send({from:wallet});
    //market
    contract_mmt.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    //admin
    contract_adm.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
}

async function test() {

    //let web3 = await connect();
    // HttpProviderでなくWebsocketProviderなので注意
    console.log(-1);
    //const web3 = await new Web3(new Web3.providers.WebsocketProvider("http://192.168.31.134:9944"));
    let web3 = await connect();
    console.log(0);

    (async () => {
        const contractAddress = "0x546a4b3806Db53384308b21e195Be5559891A55d";
        const abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"_summoner","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"_price","type":"uint256"}],"name":"Cure_Petrification","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"_summoner","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"_exp_gained","type":"uint32"}],"name":"Feeding","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint32","name":"_summoner","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"_exp_gained","type":"uint32"}],"name":"Grooming","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set1_murasaki_function_share_address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_summoner","type":"uint32"}],"name":"cure_petrification","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_summoner","type":"uint32"}],"name":"feeding","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_summoner","type":"uint32"}],"name":"grooming","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"murasaki_function_share_address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"_summoner","type":"uint32"}],"name":"not_petrified","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"pBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"rdg","type":"address"}],"name":"setRDG","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"rec","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

        const MappingStorage = await new web3.eth.Contract(abi, contractAddress);
        console.log(1);

        // {}内に色々入れることで購読するイベントをフィルタリングできます、詳しくは後述のドキュメント参照
        MappingStorage.events.Feeding({}, (err, event) => {
            console.log(`event called: ${event.event}`);
            console.log(JSON.stringify(event, null, "    "));
        });
    })();

}

//initialize_contract();
//set_speed(365*100);
set_speed(1);
//test();
