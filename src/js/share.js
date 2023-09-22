

flag_web3Loaded = false;
flag_wrongChainId = false;


//erc20 dummy toke
async function get_ohana() {
    let _abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
    let _address = "0x6d315468D2457F541FA15c1275A5cDAF5f950622";
    let contract_ohana = new web3.eth.Contract(_abi, _address);
    return contract_ohana;
}

//connected button
async function check_connected() {
    let chainId = await ethereum.request({ method: "eth_chainId"});
    chainId = parseInt(chainId, 16);
    let accounts = await ethereum.request({ method: 'eth_accounts' });
    let _text = "";
    let target = document.getElementById("button_connect");
    if (chainId != 4369) {
        _text = '<button disabled style="width:120px;">Wrong Chain</button>';
        target.innerHTML = _text;
        setTimeout(check_connected, 1000);
    } else if (accounts.length > 0) {
        _text = '<button disabled style="width:100px;">Connected</button>';
        target.innerHTML = _text;
        init_web3();
    } else {
        _text = '<button onclick="init_web3();" style="width:100px;">Connect</button>';
        target.innerHTML = _text;
        setTimeout(check_connected, 1000);
    }
}


//connect to metamask
async function connect() {
    const web3 = await new Web3(window.ethereum);
    window.ethereum.request({
        method: 'eth_requestAccounts'
    });
    return web3;
}

//connect to wss
async function connect_wss() {
    const web3wss = await new Web3("wss://testnetwss.murasaki-san.com");
    return web3wss
}

//get wallet
async function get_wallet(web3) {
    let wallet = await web3.eth.getAccounts();
    return wallet[0];
}

//donate
async function donate(_value) {
    let _web3 = await new Web3(window.ethereum);
    await window.ethereum.request({method: 'eth_requestAccounts'});
    let _hexCahinId = await window.ethereum.request({method:"eth_chainId"});
    let _chainId = parseInt(_hexCahinId);
    //if (_chainId == 592) {
        let _wallets = await _web3.eth.getAccounts();
        let _wallet = _wallets[0];
        let elements = document.getElementsByName("donationWallet");
        let len = elements.length;
        let _to_wallet = "";
        for (let i=0; i<len; i++){
            if (elements.item(i).checked){
                _to_wallet = elements.item(i).value;
            }
        }
        //let _to_wallet = "0x2F7448B62134e52C2f46454d0089Ae21B5248805";
        let _value_wei = _web3.utils.toWei(String(_value));
        _web3.eth.sendTransaction({from: _wallet, to: _to_wallet, value: _value_wei});
    //}
}


//write donation icon
function write_icon(_value) {
    let _icon;
    let _rand = Math.floor(Math.random()*3);
    //1 astar
    if (_value == 1) {
        if (_rand == 0) {_icon = "&#x1f36c;"}   //candy
        if (_rand == 1) {_icon = "&#x1f968;"}   //pretzel
        if (_rand == 2) {_icon = "&#x1f36a;"}   //cookie
    //10 astar
    }else if (_value == 10) {
        if (_rand == 0) {_icon = "&#x2615;"}    //coffee
        if (_rand == 1) {_icon = "&#x1f375;"}   //tea
        if (_rand == 2) {_icon = "&#x1f9cb;"}   //juce
    //100 astar
    }else if (_value == 100) {
        if (_rand == 0) {_icon = "&#x1f355;"}   //pizza
        if (_rand == 1) {_icon = "&#x1f363;"}   //sushi
        if (_rand == 2) {_icon = "&#x1f370;"}   //cake
    }
    document.write(_icon);
}


//initialize web3

async function init_web3(){

    //get from python script
    web3 = await connect();
    web3wss = await connect_wss();
    wallet = await get_wallet(web3);

    //check chainId
    let _chainId = await web3.eth.getChainId();
    if (_chainId != 4369) {
        flag_wrongChainId = true;
        return 0;
    }

    //prepare ma
    //address_Murasaki_Address = '0xCf5731f51347beFE1D590ba9E037fEb015B04734';
    //address_trial_Murasaki_Address = '0x30308B451A77BFfC9E81bD8cEa56b350d877f7A6';
    //let abi_Murasaki_Address = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"address_Achievement_onChain","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_AstarBase","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_BufferVault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_BuybackTreasury","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Coder_Wallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Fluffy_Festival","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Illustrator_Wallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Address_Regular","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Address_Trial","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Craft","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Dice","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Achievement","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Crafting","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Crafting2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Crafting_Codex","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Feeding_and_Grooming","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Mining_and_Farming","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Music_Practice","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Name","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Share","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Staking_Reward","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Function_Summon_and_LevelUp","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Info","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Lootlike","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Mail","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Main","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Market_Item","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Name","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Parameter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Storage","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Storage_Extra","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Storage_Nui","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Storage_Score","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_tokenURI","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasakisan","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Staking_Wallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Stroll","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Trial_Converter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"get_addresses","outputs":[{"internalType":"address[40]","name":"","type":"address[40]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Achievement_onChain","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_AstarBase","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_BufferVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_BuybackTreasury","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Coder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Fluffy_Festival","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Illustrator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Address_Regular","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Address_Trial","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Craft","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Dice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Achievement","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Crafting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Crafting2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Crafting_Codex","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Feeding_and_Grooming","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Mining_and_Farming","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Music_Practice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Name","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Share","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Staking_Reward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Function_Summon_and_LevelUp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Info","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Lootlike","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Mail","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Main","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Market_Item","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Name","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Parameter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Storage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Storage_Extra","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Storage_Nui","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_Storage_Score","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasaki_tokenURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Murasakisan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Staking","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Stroll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"set_Trial_Converter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    contract_ma = await new web3.eth.Contract(abi_Murasaki_Address, address_Murasaki_Address);
    contract_trial_ma = await new web3.eth.Contract(abi_Murasaki_Address, address_trial_Murasaki_Address);

    //get addresses
    let _addresses = await contract_ma.methods.get_addresses().call();
    let _addresses_trial = await contract_trial_ma.methods.get_addresses().call();

    //set addresses
    address_Murasaki_Main = _addresses[1];
    address_Murasaki_Name = _addresses[2];
    address_Murasaki_Craft = _addresses[3];
    address_Murasaki_Parameter = _addresses[4];
    address_Murasaki_Storage = _addresses[5];
    address_Murasaki_Storage_Score = _addresses[6];
    address_Murasaki_Storage_Nui = _addresses[7];
    address_Murasaki_Function_Share = _addresses[8];
    address_Murasaki_Function_Summon_and_LevelUp = _addresses[9];
    address_Murasaki_Function_Feeding_and_Grooming = _addresses[10];
    address_Murasaki_Function_Mining_and_Farming = _addresses[11];
    address_Murasaki_Function_Crafting = _addresses[12];
    address_Murasaki_Function_Crafting2 = _addresses[13];
    address_Murasaki_Function_Crafting_Codex = _addresses[14];
    address_Murasaki_Function_Name = _addresses[15];
    address_Murasaki_Function_Achievement = _addresses[16];
    address_Murasaki_Function_Staking_Reward = _addresses[17];
    address_Murasaki_Dice = _addresses[18];
    address_Murasaki_Mail = _addresses[19];
    address_Fluffy_Festival = _addresses[20];
    address_Murasaki_Info = _addresses[21];
    address_Murasaki_Lootlike = _addresses[23];
    address_Murasaki_tokenURI = _addresses[24];
    address_BufferVault = _addresses[25];
    address_BuybackTreasury = _addresses[26];
    address_AstarBase = _addresses[27];
    address_Staking_Wallet = _addresses[28];
    address_Coder_Wallet = _addresses[29];
    address_Illustrator_Wallet = _addresses[30];
    address_Achievement_onChain = _addresses[31];
    address_Murasaki_Function_Music_Practice = _addresses[32];
    address_Stroll = _addresses[35];
    address_Murasaki_Market_Item = _addresses[36];
    address_Murasakisan = _addresses[37];
    
    address_Murasaki_Storage_Extra = _addresses[39];
    
    address_Pippel_NFT = _addresses[40];
    address_Pippel_Function = _addresses[41];
    address_Pippel_Codex = _addresses[42];
    address_Murasaki_TBARegistry = _addresses[43];
    address_Murasaki_TBAAccount = _addresses[44];
    

    address_trial_Murasaki_Main = _addresses_trial[1];
    address_trial_Murasaki_Name = _addresses_trial[2];
    address_trial_Murasaki_Craft = _addresses_trial[3];
    address_trial_Murasaki_Parameter = _addresses_trial[4];
    address_trial_Murasaki_Storage = _addresses_trial[5];
    address_trial_Murasaki_Storage_Score = _addresses_trial[6];
    address_trial_Murasaki_Storage_Nui = _addresses_trial[7];
    address_trial_Murasaki_Function_Share = _addresses_trial[8];
    address_trial_Murasaki_Function_Summon_and_LevelUp = _addresses_trial[9];
    address_trial_Murasaki_Function_Feeding_and_Grooming = _addresses_trial[10];
    address_trial_Murasaki_Function_Mining_and_Farming = _addresses_trial[11];
    address_trial_Murasaki_Function_Crafting = _addresses_trial[12];
    address_trial_Murasaki_Function_Crafting2 = _addresses_trial[13];
    address_trial_Murasaki_Function_Crafting_Codex = _addresses_trial[14];
    address_trial_Murasaki_Function_Name = _addresses_trial[15];
    address_trial_Murasaki_Function_Achievement = _addresses_trial[16];
    address_trial_Murasaki_Function_Staking_Reward = _addresses_trial[17];
    address_trial_Murasaki_Dice = _addresses_trial[18];
    address_trial_Murasaki_Mail = _addresses_trial[19];
    address_trial_Fluffy_Festival = _addresses_trial[20];
    address_trial_Murasaki_Info = _addresses_trial[21];
    address_trial_Murasaki_Lootlike = _addresses_trial[23];
    address_trial_Murasaki_tokenURI = _addresses_trial[24];
    address_trial_BufferVault = _addresses_trial[25];
    address_trial_BuybackTreasury = _addresses_trial[26];
    address_trial_AstarBase = _addresses_trial[27];
    address_trial_Staking_Wallet = _addresses_trial[28];
    address_trial_Coder_Wallet = _addresses_trial[29];
    address_trial_Illustrator_Wallet = _addresses_trial[30];
    address_trial_Achievement_onChain = _addresses_trial[31];
    address_trial_Murasaki_Function_Music_Practice = _addresses_trial[32];
    address_trial_Stroll = _addresses_trial[35];
    address_trial_Murasaki_Market_Item = _addresses_trial[36];
    address_trial_Murasakisan = _addresses_trial[37];

    address_trial_Trial_Converter = '0x2a372b36197085d9899AE1C7Ed253bEA4EE7bAf8';

    
    //astar NFTs
    address_AstarCats = "0xF73a9e5F0289D26373eB4DeA6a4e4762f186ad44";
    address_AstarDegens = "0xF73a9e5F0289D26373eB4DeA6a4e4762f186ad44";
    address_AstarSignWitch = "0xF73a9e5F0289D26373eB4DeA6a4e4762f186ad44";
    let abi_AstarCats = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"deleteWL","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"name":"ownerMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"preMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"publicMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address[]","name":"list","type":"address[]"}],"name":"pushMultiWL","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseExtension","type":"string"}],"name":"setBaseExtension","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_notRevealedURI","type":"string"}],"name":"setNotRevealedURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"setPresale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint256","name":"maxMint","type":"uint256"}],"name":"updateWL","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_initNotRevealedUri","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWhiteListCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"is_paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"is_presaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"is_revealed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"notRevealedUri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"presale","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicMaxPerTx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"revealed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"whiteListCountOfOwner","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
    

    //create contract

    //contract, web3, for sending

    //nft, ntt
    contract_mm = await new web3.eth.Contract(abi_Murasaki_Main, address_Murasaki_Main);
    contract_mc = await new web3.eth.Contract(abi_Murasaki_Craft, address_Murasaki_Craft);
    contract_mn = await new web3.eth.Contract(abi_Murasaki_Name, address_Murasaki_Name);

    //storage
    //contract_ma = await new web3.eth.Contract(abi_Murasaki_Address, address_Murasaki_Address);
    contract_mp = await new web3.eth.Contract(abi_Murasaki_Parameter, address_Murasaki_Parameter);
    contract_ms = await new web3.eth.Contract(abi_Murasaki_Storage, address_Murasaki_Storage);
    contract_mss = await new web3.eth.Contract(abi_Murasaki_Storage_Score, address_Murasaki_Storage_Score);
    contract_msn = await new web3.eth.Contract(abi_Murasaki_Storage_Nui, address_Murasaki_Storage_Nui);

    //Function
    contract_mfs = await new web3.eth.Contract(abi_Murasaki_Function_Share, address_Murasaki_Function_Share);
    contract_mfsl = await new web3.eth.Contract(abi_Murasaki_Function_Summon_and_LevelUp, address_Murasaki_Function_Summon_and_LevelUp);
    contract_mffg = await new web3.eth.Contract(abi_Murasaki_Function_Feeding_and_Grooming, address_Murasaki_Function_Feeding_and_Grooming);
    contract_mfmf = await new web3.eth.Contract(abi_Murasaki_Function_Mining_and_Farming, address_Murasaki_Function_Mining_and_Farming);
    contract_mfc = await new web3.eth.Contract(abi_Murasaki_Function_Crafting, address_Murasaki_Function_Crafting);
    contract_mfc2 = await new web3.eth.Contract(abi_Murasaki_Function_Crafting2, address_Murasaki_Function_Crafting2);
    contract_mfcc = await new web3.eth.Contract(abi_Murasaki_Function_Crafting_Codex, address_Murasaki_Function_Crafting_Codex);
    contract_mfn = await new web3.eth.Contract(abi_Murasaki_Function_Name, address_Murasaki_Function_Name);
    contract_mfa = await new web3.eth.Contract(abi_Murasaki_Function_Achievement, address_Murasaki_Function_Achievement);
    contract_mfp = await new web3.eth.Contract(abi_Murasaki_Function_Music_Practice, address_Murasaki_Function_Music_Practice);
    contract_mfst = await new web3.eth.Contract(abi_Murasaki_Function_Staking_Reward, address_Murasaki_Function_Staking_Reward);

    //treasury
    contract_bv = await new web3.eth.Contract(abi_BufferVault, address_BufferVault);
    contract_bt = await new web3.eth.Contract(abi_BuybackTreasury, address_BuybackTreasury);

    //etc
    contract_md = await new web3.eth.Contract(abi_Murasaki_Dice, address_Murasaki_Dice);
    contract_mml = await new web3.eth.Contract(abi_Murasaki_Mail, address_Murasaki_Mail);
    contract_mll = await new web3.eth.Contract(abi_Murasaki_Lootlike, address_Murasaki_Lootlike);
    contract_info = await new web3.eth.Contract(abi_Murasaki_Info, address_Murasaki_Info);
    //contract_info_fromWallet = await new web3.eth.Contract(abi_Murasaki_Info_fromWallet, address_Murasaki_Info_fromWallet);
    contract_ff = await new web3.eth.Contract(abi_Fluffy_Festival, address_Fluffy_Festival);
    contract_mu = await new web3.eth.Contract(abi_Murasaki_tokenURI, address_Murasaki_tokenURI);
    contract_ac = await new web3.eth.Contract(abi_Achievement_onChain, address_Achievement_onChain);
    contract_st = await new web3.eth.Contract(abi_Stroll, address_Stroll);
    
    //murasakisan
    contract_murasakisan = await new web3.eth.Contract(abi_Murasakisan, address_Murasakisan);

    //market
    contract_mmt = await new web3.eth.Contract(abi_Murasaki_Market_Item, address_Murasaki_Market_Item);
    
    //230922, TBA, pippel
    contract_pn = await new web3.eth.Contract(abi_Pippel_NFT, address_Pippel_NFT);
    contract_pf = await new web3.eth.Contract(abi_Pippel_Function, address_Pippel_Function);
    contract_pc = await new web3.eth.Contract(abi_Pippel_Codex, address_Pippel_Codex);
    contract_tbar = await new web3.eth.Contract(abi_Murasaki_TBARegistry, address_Murasaki_TBARegistry);
    contract_tbaa = await new web3.eth.Contract(abi_Murasaki_TBAAccount, address_Murasaki_TBAAccount);
    

    //contract, web3wss, for calling

    //nft, ntt
    contract_mm_wss = await new web3wss.eth.Contract(abi_Murasaki_Main, address_Murasaki_Main);
    contract_mc_wss = await new web3wss.eth.Contract(abi_Murasaki_Craft, address_Murasaki_Craft);
    contract_mn_wss = await new web3wss.eth.Contract(abi_Murasaki_Name, address_Murasaki_Name);

    //storage
    contract_ma_wss = await new web3wss.eth.Contract(abi_Murasaki_Address, address_Murasaki_Address);
    contract_mp_wss = await new web3wss.eth.Contract(abi_Murasaki_Parameter, address_Murasaki_Parameter);
    contract_ms_wss = await new web3wss.eth.Contract(abi_Murasaki_Storage, address_Murasaki_Storage);
    contract_mss_wss = await new web3wss.eth.Contract(abi_Murasaki_Storage_Score, address_Murasaki_Storage_Score);
    contract_msn_wss = await new web3wss.eth.Contract(abi_Murasaki_Storage_Nui, address_Murasaki_Storage_Nui);

    //Function
    contract_mfs_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Share, address_Murasaki_Function_Share);
    contract_mfsl_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Summon_and_LevelUp, address_Murasaki_Function_Summon_and_LevelUp);
    contract_mffg_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Feeding_and_Grooming, address_Murasaki_Function_Feeding_and_Grooming);
    contract_mfmf_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Mining_and_Farming, address_Murasaki_Function_Mining_and_Farming);
    contract_mfc_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Crafting, address_Murasaki_Function_Crafting);
    contract_mfc2_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Crafting2, address_Murasaki_Function_Crafting2);
    contract_mfcc_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Crafting_Codex, address_Murasaki_Function_Crafting_Codex);
    contract_mfn_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Name, address_Murasaki_Function_Name);
    contract_mfa_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Achievement, address_Murasaki_Function_Achievement);
    contract_mfp_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Music_Practice, address_Murasaki_Function_Music_Practice);
    contract_mfst_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Staking_Reward, address_Murasaki_Function_Staking_Reward);

    //treasury
    contract_bv_wss = await new web3wss.eth.Contract(abi_BufferVault, address_BufferVault);
    contract_bt_wss = await new web3wss.eth.Contract(abi_BuybackTreasury, address_BuybackTreasury);

    //etc
    contract_md_wss = await new web3wss.eth.Contract(abi_Murasaki_Dice, address_Murasaki_Dice);
    contract_mml_wss = await new web3wss.eth.Contract(abi_Murasaki_Mail, address_Murasaki_Mail);
    contract_mll_wss = await new web3wss.eth.Contract(abi_Murasaki_Lootlike, address_Murasaki_Lootlike);
    contract_info_wss = await new web3wss.eth.Contract(abi_Murasaki_Info, address_Murasaki_Info);
    //contract_info_fromWallet_wss = await new web3wss.eth.Contract(abi_Murasaki_Info_fromWallet, address_Murasaki_Info_fromWallet);
    contract_ff_wss = await new web3wss.eth.Contract(abi_Fluffy_Festival, address_Fluffy_Festival);
    contract_mu_wss = await new web3wss.eth.Contract(abi_Murasaki_tokenURI, address_Murasaki_tokenURI);
    contract_ac_wss = await new web3wss.eth.Contract(abi_Achievement_onChain, address_Achievement_onChain);
    contract_st_wss = await new web3wss.eth.Contract(abi_Stroll, address_Stroll);

    //murasakisan
    contract_trial_murasakisan = await new web3.eth.Contract(abi_Murasakisan, address_trial_Murasakisan);

    //market
    contract_mmt_wss = await new web3wss.eth.Contract(abi_Murasaki_Market_Item, address_Murasaki_Market_Item);
    

    //## admin ##
    //contract_admin = await new web3.eth.Contract(abi_Admin_Convert, address_Admin_Convert);
    
    //Astar NFTs
    contract_AstarCats = await new web3.eth.Contract(abi_AstarCats, address_AstarCats);
    //contract_AstarDegens = await new web3.eth.Contract(abi_AstarCats, address_AstarDegens);
    //contract_AstarSignWitch = await new web3.eth.Contract(abi_AstarCats, address_AstarSignWitch);
    

    //### trial

    //nft, ntt
    contract_trial_mm = await new web3.eth.Contract(abi_Murasaki_Main, address_trial_Murasaki_Main);
    contract_trial_mc = await new web3.eth.Contract(abi_Murasaki_Craft, address_trial_Murasaki_Craft);
    contract_trial_mn = await new web3.eth.Contract(abi_Murasaki_Name, address_trial_Murasaki_Name);
    //storage
    contract_trial_ma = await new web3.eth.Contract(abi_Murasaki_Address, address_trial_Murasaki_Address);
    contract_trial_mp = await new web3.eth.Contract(abi_Murasaki_Parameter, address_trial_Murasaki_Parameter);
    contract_trial_ms = await new web3.eth.Contract(abi_Murasaki_Storage, address_trial_Murasaki_Storage);
    contract_trial_mss = await new web3.eth.Contract(abi_Murasaki_Storage_Score, address_trial_Murasaki_Storage_Score);
    contract_trial_msn = await new web3.eth.Contract(abi_Murasaki_Storage_Nui, address_trial_Murasaki_Storage_Nui);
    //Function
    contract_trial_mfs = await new web3.eth.Contract(abi_Murasaki_Function_Share, address_trial_Murasaki_Function_Share);
    contract_trial_mfsl = await new web3.eth.Contract(abi_Murasaki_Function_Summon_and_LevelUp, address_trial_Murasaki_Function_Summon_and_LevelUp);
    contract_trial_mffg = await new web3.eth.Contract(abi_Murasaki_Function_Feeding_and_Grooming, address_trial_Murasaki_Function_Feeding_and_Grooming);
    contract_trial_mfmf = await new web3.eth.Contract(abi_Murasaki_Function_Mining_and_Farming, address_trial_Murasaki_Function_Mining_and_Farming);
    contract_trial_mfc = await new web3.eth.Contract(abi_Murasaki_Function_Crafting, address_trial_Murasaki_Function_Crafting);
    contract_trial_mfc2 = await new web3.eth.Contract(abi_Murasaki_Function_Crafting2, address_trial_Murasaki_Function_Crafting2);
    contract_trial_mfcc = await new web3.eth.Contract(abi_Murasaki_Function_Crafting_Codex, address_trial_Murasaki_Function_Crafting_Codex);
    contract_trial_mfn = await new web3.eth.Contract(abi_Murasaki_Function_Name, address_trial_Murasaki_Function_Name);
    contract_trial_mfa = await new web3.eth.Contract(abi_Murasaki_Function_Achievement, address_trial_Murasaki_Function_Achievement);
    contract_trial_mfp = await new web3.eth.Contract(abi_Murasaki_Function_Music_Practice, address_trial_Murasaki_Function_Music_Practice);
    contract_trial_mfst = await new web3.eth.Contract(abi_Murasaki_Function_Staking_Reward, address_trial_Murasaki_Function_Staking_Reward);
    //treasury
    contract_trial_bv = await new web3.eth.Contract(abi_BufferVault, address_trial_BufferVault);
    contract_trial_bt = await new web3.eth.Contract(abi_BuybackTreasury, address_trial_BuybackTreasury);
    //etc
    contract_trial_md = await new web3.eth.Contract(abi_Murasaki_Dice, address_trial_Murasaki_Dice);
    contract_trial_mml = await new web3.eth.Contract(abi_Murasaki_Mail, address_trial_Murasaki_Mail);
    contract_trial_mll = await new web3.eth.Contract(abi_Murasaki_Lootlike, address_trial_Murasaki_Lootlike);
    contract_trial_info = await new web3.eth.Contract(abi_Murasaki_Info, address_trial_Murasaki_Info);
    //contract_trial_info_fromWallet = await new web3.eth.Contract(abi_Murasaki_Info_fromWallet, address_trial_Murasaki_Info_fromWallet);
    contract_trial_ff = await new web3.eth.Contract(abi_Fluffy_Festival, address_trial_Fluffy_Festival);
    contract_trial_mu = await new web3.eth.Contract(abi_Murasaki_tokenURI, address_trial_Murasaki_tokenURI);
    contract_trial_ac = await new web3.eth.Contract(abi_Achievement_onChain, address_trial_Achievement_onChain);
    //converter
    contract_trial_tc = await new web3.eth.Contract(abi_Trial_Converter, address_trial_Trial_Converter);

    //nft, ntt
    contract_trial_mm_wss = await new web3wss.eth.Contract(abi_Murasaki_Main, address_trial_Murasaki_Main);
    contract_trial_mc_wss = await new web3wss.eth.Contract(abi_Murasaki_Craft, address_trial_Murasaki_Craft);
    contract_trial_mn_wss = await new web3wss.eth.Contract(abi_Murasaki_Name, address_trial_Murasaki_Name);
    //storage
    contract_trial_ma_wss = await new web3wss.eth.Contract(abi_Murasaki_Address, address_trial_Murasaki_Address);
    contract_trial_mp_wss = await new web3wss.eth.Contract(abi_Murasaki_Parameter, address_trial_Murasaki_Parameter);
    contract_trial_ms_wss = await new web3wss.eth.Contract(abi_Murasaki_Storage, address_trial_Murasaki_Storage);
    contract_trial_mss_wss = await new web3wss.eth.Contract(abi_Murasaki_Storage_Score, address_trial_Murasaki_Storage_Score);
    contract_trial_msn_wss = await new web3wss.eth.Contract(abi_Murasaki_Storage_Nui, address_trial_Murasaki_Storage_Nui);
    //Function
    contract_trial_mfs_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Share, address_trial_Murasaki_Function_Share);
    contract_trial_mfsl_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Summon_and_LevelUp, address_trial_Murasaki_Function_Summon_and_LevelUp);
    contract_trial_mffg_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Feeding_and_Grooming, address_trial_Murasaki_Function_Feeding_and_Grooming);
    contract_trial_mfmf_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Mining_and_Farming, address_trial_Murasaki_Function_Mining_and_Farming);
    contract_trial_mfc_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Crafting, address_trial_Murasaki_Function_Crafting);
    contract_trial_mfc2_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Crafting2, address_trial_Murasaki_Function_Crafting2);
    contract_trial_mfcc_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Crafting_Codex, address_trial_Murasaki_Function_Crafting_Codex);
    contract_trial_mfn_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Name, address_trial_Murasaki_Function_Name);
    contract_trial_mfa_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Achievement, address_trial_Murasaki_Function_Achievement);
    contract_trial_mfp_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Music_Practice, address_trial_Murasaki_Function_Music_Practice);
    contract_trial_mfst_wss = await new web3wss.eth.Contract(abi_Murasaki_Function_Staking_Reward, address_trial_Murasaki_Function_Staking_Reward);
    //treasury
    contract_trial_bv_wss = await new web3wss.eth.Contract(abi_BufferVault, address_trial_BufferVault);
    contract_trial_bt_wss = await new web3wss.eth.Contract(abi_BuybackTreasury, address_trial_BuybackTreasury);
    //etc
    contract_trial_md_wss = await new web3wss.eth.Contract(abi_Murasaki_Dice, address_trial_Murasaki_Dice);
    contract_trial_mml_wss = await new web3wss.eth.Contract(abi_Murasaki_Mail, address_trial_Murasaki_Mail);
    contract_trial_mll_wss = await new web3wss.eth.Contract(abi_Murasaki_Lootlike, address_trial_Murasaki_Lootlike);
    contract_trial_info_wss = await new web3wss.eth.Contract(abi_Murasaki_Info, address_trial_Murasaki_Info);
    //contract_trial_info_fromWallet_wss = await new web3wss.eth.Contract(abi_Murasaki_Info_fromWallet, address_trial_Murasaki_Info_fromWallet);
    contract_trial_ff_wss = await new web3wss.eth.Contract(abi_Fluffy_Festival, address_trial_Fluffy_Festival);
    contract_trial_mu_wss = await new web3wss.eth.Contract(abi_Murasaki_tokenURI, address_trial_Murasaki_tokenURI);
    contract_trial_ac_wss = await new web3.eth.Contract(abi_Achievement_onChain, address_trial_Achievement_onChain);
    //converter
    contract_trial_tc_wss = await new web3wss.eth.Contract(abi_Trial_Converter, address_trial_Trial_Converter);
    
    flag_web3Loaded = true;
}



console.warn(
    "%c"+
    "\n"+
    "'##::::'##:'##::::'##:'########:::::'###:::::'######:::::'###::::'##:::'##:'####:::::::::::'######:::::'###::::'##::: ##:\n"+
    " ###::'###: ##:::: ##: ##.... ##:::'## ##:::'##... ##:::'## ##::: ##::'##::. ##:::::::::::'##... ##:::'## ##::: ###:: ##:\n"+
    " ####'####: ##:::: ##: ##:::: ##::'##:. ##:: ##:::..:::'##:. ##:: ##:'##:::: ##::::::::::: ##:::..:::'##:. ##:: ####: ##:\n"+
    " ## ### ##: ##:::: ##: ########::'##:::. ##:. ######::'##:::. ##: #####::::: ##::'#######:. ######::'##:::. ##: ## ## ##:\n"+
    " ##. #: ##: ##:::: ##: ##.. ##::: #########::..... ##: #########: ##. ##:::: ##::........::..... ##: #########: ##. ####:\n"+
    " ##:.:: ##: ##:::: ##: ##::. ##:: ##.... ##:'##::: ##: ##.... ##: ##:. ##::: ##:::::::::::'##::: ##: ##.... ##: ##:. ###:\n"+
    " ##:::: ##:. #######:: ##:::. ##: ##:::: ##:. ######:: ##:::: ##: ##::. ##:'####::::::::::. ######:: ##:::: ##: ##::. ##:\n"+
    "..:::::..:::.......:::..:::::..::..:::::..:::......:::..:::::..::..::::..::....::::::::::::......:::..:::::..::..::::..::\n"+
    "\n"+
    "%cWelcome to House of Murasaki-san!\n"+
    "..._@ﾉ\" < Cheers to ASTR!\n"+
    "\n",
    "color: pink;",
    "color: pink; font-size: 16px;",
)