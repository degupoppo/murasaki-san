

async function initialize_contract() {

    //SBT/NFT
    contract_mm.methods._set_notPaused(true).send({from:wallet});
    contract_mm.methods._add_permitted_address(address_Murasaki_Function_Summon_and_LevelUp).send({from:wallet});
    contract_mn.methods._add_permitted_address(address_Murasaki_Function_Name).send({from:wallet});
    contract_mc.methods._add_permitted_address(address_Murasaki_Function_Crafting).send({from:wallet});
    contract_mc.methods._add_permitted_address(address_Murasaki_Function_Crafting2).send({from:wallet});
    contract_mc.methods._add_permitted_address(address_Murasaki_Mail).send({from:wallet});
    contract_mc.methods._add_permitted_address(address_Murasaki_Function_Feeding_and_Grooming).send({from:wallet});
    contract_mc.methods._add_permitted_address(address_Fluffy_Festival).send({from:wallet});

    //Address
    contract_ma.methods.set_Murasaki_Main(address_Murasaki_Main).send({from:wallet});
    contract_ma.methods.set_Murasaki_Name(address_Murasaki_Name).send({from:wallet});
    contract_ma.methods.set_Murasaki_Craft(address_Murasaki_Craft).send({from:wallet});
    contract_ma.methods.set_Murasaki_Parameter(address_Murasaki_Parameter).send({from:wallet});
    contract_ma.methods.set_Murasaki_Storage(address_Murasaki_Storage).send({from:wallet});
    contract_ma.methods.set_Murasaki_Storage_Score(address_Murasaki_Storage_Score).send({from:wallet});
    contract_ma.methods.set_Murasaki_Storage_Nui(address_Murasaki_Storage_Nui).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Share(address_Murasaki_Function_Share).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Summon_and_LevelUp(address_Murasaki_Function_Summon_and_LevelUp).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Feeding_and_Grooming(address_Murasaki_Function_Feeding_and_Grooming).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Mining_and_Farming(address_Murasaki_Function_Mining_and_Farming).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Crafting(address_Murasaki_Function_Crafting).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Crafting2(address_Murasaki_Function_Crafting2).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Crafting_Codex(address_Murasaki_Function_Crafting_Codex).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Name(address_Murasaki_Function_Name).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Achievement(address_Murasaki_Function_Achievement).send({from:wallet});
    contract_ma.methods.set_Murasaki_Dice(address_Murasaki_Dice).send({from:wallet});
    contract_ma.methods.set_Murasaki_Mail(address_Murasaki_Mail).send({from:wallet});
    contract_ma.methods.set_Fluffy_Festival(address_Fluffy_Festival).send({from:wallet});
    contract_ma.methods.set_Murasaki_Info(address_Murasaki_Info).send({from:wallet});
    contract_ma.methods.set_Murasaki_Info_fromWallet(address_Murasaki_Info_fromWallet).send({from:wallet});
    contract_ma.methods.set_Murasaki_Lootlike(address_Murasaki_Lootlike).send({from:wallet});
    contract_ma.methods.set_Murasaki_tokenURI(address_Murasaki_tokenURI).send({from:wallet});
    contract_ma.methods.set_BufferVault(address_BufferVault).send({from:wallet});
    contract_ma.methods.set_BuybackTreasury(address_BuybackTreasury).send({from:wallet});
    contract_ma.methods.set_AstarBase(address_AstarBase).send({from:wallet});
    contract_ma.methods.set_Staking(address_Staking_Wallet).send({from:wallet});
    contract_ma.methods.set_Coder(address_Coder_Wallet).send({from:wallet});
    contract_ma.methods.set_Illustrator(address_Illustrator_Wallet).send({from:wallet});
    contract_ma.methods.set_Achievement_onChain(address_Achievement_onChain).send({from:wallet});
    contract_ma.methods.set_Murasaki_Function_Music_Practice(address_Murasaki_Function_Music_Practice).send({from:wallet});

    //Storage
    contract_mp.methods._add_permitted_address(wallet).send({from:wallet});
    contract_mp.methods._add_permitted_address(address_Fluffy_Festival).send({from:wallet});
    contract_mp.methods._add_permitted_address(address_BufferVault).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Murasaki_Function_Summon_and_LevelUp).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Murasaki_Function_Feeding_and_Grooming).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Murasaki_Function_Mining_and_Farming).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Murasaki_Function_Crafting).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Murasaki_Function_Crafting2).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Murasaki_Function_Name).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Murasaki_Mail).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Murasaki_Function_Music_Practice).send({from:wallet});
    contract_mss.methods._add_permitted_address(address_Murasaki_Function_Summon_and_LevelUp).send({from:wallet});
    contract_mss.methods._add_permitted_address(address_Murasaki_Function_Feeding_and_Grooming).send({from:wallet});
    contract_mss.methods._add_permitted_address(address_Murasaki_Function_Mining_and_Farming).send({from:wallet});
    contract_mss.methods._add_permitted_address(address_Murasaki_Function_Crafting).send({from:wallet});
    contract_mss.methods._add_permitted_address(address_Murasaki_Function_Crafting2).send({from:wallet});
    contract_mss.methods._add_permitted_address(address_Murasaki_Function_Name).send({from:wallet});
    contract_msn.methods._add_permitted_address(address_Murasaki_Function_Crafting).send({from:wallet});
    contract_msn.methods._add_permitted_address(address_Murasaki_Function_Crafting2).send({from:wallet});
    
    //Function
    contract_mfs.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfsl.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mffg.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfmf.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfc.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfc.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfc2.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfcc.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfn.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfa.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mfp.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});

    //Independent
    contract_md.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mml.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mml.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mll.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_ff.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_ac.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    
    //Info
    contract_info.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_info_fromWallet.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mu.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    
    //Treasury
    contract_bt.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_bv.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});

    //admin
    contract_mm.methods._add_permitted_address(address_Admin_Convert).send({from:wallet});
    contract_mn.methods._add_permitted_address(address_Admin_Convert).send({from:wallet});
    contract_ms.methods._add_permitted_address(address_Admin_Convert).send({from:wallet});
    contract_mss.methods._add_permitted_address(address_Admin_Convert).send({from:wallet});
    contract_msn.methods._add_permitted_address(address_Admin_Convert).send({from:wallet});
    contract_mc.methods._add_permitted_address(address_Admin_Convert).send({from:wallet});
    
    //market
    contract_mmt.methods._set_Murasaki_Address(address_Murasaki_Address).send({from:wallet});
    contract_mc.methods._add_noFee_address(address_Murasaki_Item_Market).send({from:wallet});
    contract_mc.methods._add_noFee_address(address_BuybackTreasury).send({from:wallet});
    
    //achievement_onChain, with dummy address
    contract_ac.methods._set_tokens(1, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(2, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(3, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(4, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(5, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(6, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(7, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(8, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(9, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_tokens(10, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_token_number(10).send({from:wallet});    
    contract_ac.methods._set_nfts(1, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(2, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(3, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(4, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(5, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(6, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(7, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(8, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(9, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nfts(10, "0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});
    contract_ac.methods._set_nft_number(10).send({from:wallet});    
    contract_ac.methods._set_Murasaki_NFT("0xF458Fd09b0ceFd288B98A43D987B8F1A1C3a7BBF").send({from:wallet});    

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


async function main() {
    await init_web3();
    await initialize_contract();
    //set_speed(100*365);
    //set_day_petrified(365);
}

main();

