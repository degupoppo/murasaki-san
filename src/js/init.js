
async function set_speed(_value) {
    contract_mp.methods._set_speed(_value).send({from:wallet});
}

async function set_day_petrified(_value) {
    contract_mp.methods.set_day_petrified(_value).send({from:wallet});
}

async function initialize_contract() {

    //set contracts

    //set nft,ntt
    contract_mm.methods._set_notPaused(true).send({from:wallet});
    contract_mm.methods._add_permitted_address(contract_murasaki_function_summon_and_levelup).send({from:wallet});
    contract_mn.methods._add_permitted_address(contract_murasaki_function_name).send({from:wallet});
    contract_mc.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mc.methods._add_permitted_address(contract_murasaki_mail).send({from:wallet});
    contract_mc.methods._add_permitted_address(contract_murasaki_function_feeding_and_grooming).send({from:wallet});
    contract_mc.methods._add_permitted_address(contract_fluffy_festival).send({from:wallet});

    //set function_share
    contract_mfs.methods._set1_murasaki_main_address(contract_murasaki_main).send({from:wallet});
    contract_mfs.methods._set2_murasaki_storage_address(contract_murasaki_storage).send({from:wallet});
    contract_mfs.methods._set3_murasaki_craft_address(contract_murasaki_craft).send({from:wallet});
    contract_mfs.methods._set4_world_dice_address(contract_world_dice).send({from:wallet});
    contract_mfs.methods._set5_murasaki_name_address(contract_murasaki_name).send({from:wallet});
    contract_mfs.methods._set6_murasaki_storage_score_address(contract_murasaki_storage_score).send({from:wallet});
    contract_mfs.methods._set7_murasaki_mail_address(contract_murasaki_mail).send({from:wallet});
    contract_mfs.methods._set8_murasaki_storage_nui_address(contract_murasaki_storage_nui).send({from:wallet});
    //contract_mfs.methods._set9_astarbase_address(contract_murasaki_storage_nui).send({from:wallet});
    contract_mfs.methods._setA_bufferTreqsury_address(contract_bufferTreasury).send({from:wallet});
    contract_mfs.methods._setB_buybackTreasury_address(contract_buybackTreasury).send({from:wallet});
    contract_mfs.methods._setC_teamTreasury_address(contract_teamTreasury).send({from:wallet});
    contract_mfs.methods._setD_murasaki_lootlike_address(contract_murasaki_lootlike).send({from:wallet});
    contract_mfs.methods._setE_murasaki_parameter_address(contract_murasaki_parameter).send({from:wallet});
    
    //astarbase, local
    //contract_mfs.methods._set9_astarbase_address("0x64582688EF82Bcce7F6260eE1384656e1D33b4bB").send({from:wallet});
    //astarbase, local, forDebug, 100000 staking, enable change amount
    //contract_mfs.methods._set9_astarbase_address("0xcFB4EF572b46B0972b0c316Fa27b58F03149DFa0").send({from:wallet});
    contract_mfs.methods._set9_astarbase_address("0x43b71d69f6021433f5a860ce1FDBa793429b60A3").send({from:wallet});
    
    //astarbase, shibuya
    //contract_mfs.methods._set9_astarbase_address("0xF183f51D3E8dfb2513c15B046F848D4a68bd3F5D").send({from:wallet});

    //set other functions
    contract_mfsl.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mffg.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfmf.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfc.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfc.methods._set2_murasaki_function_crafting_codex_address(contract_murasaki_function_crafting_codex).send({from:wallet});
    contract_mfcc.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mfn.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});

    //set others
    contract_wd.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mml.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_mml.methods._set2_murasaki_function_crafting_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mll.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_ff.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});

    //set storage
    contract_mp.methods._add_permitted_address(wallet).send({from:wallet});
    contract_mp.methods._add_permitted_address(contract_fluffy_festival).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_summon_and_levelup).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_feeding_and_grooming).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_mining_and_farming).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_function_name).send({from:wallet});
    contract_ms.methods._add_permitted_address(contract_murasaki_mail).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_summon_and_levelup).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_feeding_and_grooming).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_mining_and_farming).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_mss.methods._add_permitted_address(contract_murasaki_function_name).send({from:wallet});
    contract_msn.methods._add_permitted_address(contract_murasaki_function_crafting).send({from:wallet});
    //contract_msn.methods._add_permitted_address(contract_murasaki_admin).send({from:wallet});

    //market
    contract_mmt.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});

    //info
    contract_info.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_info.methods._set2_murasaki_function_mining_and_farming_address(contract_murasaki_function_mining_and_farming).send({from:wallet});
    contract_info.methods._set3_murasaki_function_crafting_address(contract_murasaki_function_crafting).send({from:wallet});
    contract_info.methods._set4_murasaki_function_feeding_and_grooming_address(contract_murasaki_function_feeding_and_grooming).send({from:wallet});
    contract_info.methods._set5_fluffy_festival_address(contract_fluffy_festival).send({from:wallet});
    //contract_info_fromWallet.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    //contract_info_fromWallet.methods._set2_murasaki_function_mining_and_farming_address(contract_murasaki_function_mining_and_farming).send({from:wallet});
    //contract_info_fromWallet.methods._set3_murasaki_function_crafting_address(contract_murasaki_function_crafting).send({from:wallet});
    
    //treasury
    contract_bbt.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    contract_bft.methods._set1_murasaki_function_share_address(contract_murasaki_function_share).send({from:wallet});
    
    //activate
    contract_mp.methods._set_isPaused(false).send({from:wallet});
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


//init_web3();
//initialize_contract();
//set_speed(100*365);
//set_speed(100*365);
//set_speed(100*1000);
//test();


async function main() {
    await init_web3();
    await initialize_contract();
    //set_speed(100*365);
    //set_day_petrified(365);
}

main();
