

//get info
async function total_summoned() {
    let _res = await contract_mm_wss.methods.next_token().call();
    return Number(_res) - 1;
}
async function totalItemMinted() {
    let _res = await contract_mc_wss.methods.next_item().call();
    return Number(_res) - 1;
}
async function getPrice() {
    let _res = await contract_mp_wss.methods.PRICE().call();
    return Number(_res) / (10**18);
}
async function balanceOfbv() {
    let _res = await web3.eth.getBalance(contract_bv.options.address);
    return Math.floor( Number(_res) / (10**18) * 100 )/100;
}
async function balanceOfbt() {
    let _res = await web3.eth.getBalance(contract_bt.options.address);
    return Math.floor( Number(_res) / (10**18) * 100 )/100;
}
async function _show_onChain_parameters() {
    if (typeof(contract_mm_wss) == "undefined") {
        await init_web3();
    }
    let _text
    let _target
    //total_summoned
    _text = await total_summoned();
    _target = document.getElementById("info_total_summoned");
    _target.innerHTML = _text + " wallets";
    //total_item_minted
    _text = await totalItemMinted();
    _target = document.getElementById("info_total_item_minted");
    _target.innerHTML = _text + " NFTs";
    //price
    _text = await getPrice();
    _target = document.getElementById("info_price");
    _target.innerHTML = _text + " $ASTR";
    //balance of bv
    _text = await balanceOfbv();
    _target = document.getElementById("info_balanceOf_bv");
    _target.innerHTML = _text + " $ASTR";
    //balance of bt
    _text = await balanceOfbt();
    _target = document.getElementById("info_balanceOf_bt");
    _target.innerHTML = _text + " $ASTR";
}

//show icon
async function _show_icon() {
    let web3 = await new Web3(window.ethereum);
    await window.ethereum.request({method: 'eth_requestAccounts'});
    // get wallet
    let _wallets = await web3.eth.getAccounts();
    let wallet = _wallets[0];
    // prepare contract
    //let _abi = [{'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'tokenURI_fromWallet', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}];
    //let _address = "0xcdA558BE0717D4F34b1f288c79a60d007daA11bf";
    //let contract = new web3.eth.Contract(_abi, _address);
    let contract = contract_mu;
    // get tokenURI
    let _res = await contract.methods.tokenURI_fromWallet(wallet).call();
    // get SVG
    _res = _res.split("base64,")[1];
    _res = atob(_res);
    _res = _res.split("base64,")[1];
    _res = _res.split('"')[0];
    _res = atob(_res);
    // insert into html
    let _text = _res;
    let target = document.getElementById("icon");
    target.innerHTML = _text;
}


//show onChain info using greeting button
async function _show_info() {
    let web3 = await new Web3(window.ethereum);
    //let web3 = await new Web3("wss://testnetwss.murasaki-san.com");
    await window.ethereum.request({method: 'eth_requestAccounts'});
    let _wallets = await web3.eth.getAccounts();
    let wallet = _wallets[0];
    let _abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set1_murasaki_function_share_address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set2_murasaki_info_address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"age","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"birthplace","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"city","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"class","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"coin","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"dexterity","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"dexterity_withItems","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"elasticity","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"exp","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"flower","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"fluffiness","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"happy","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"inHouse","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"intelligence","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"intelligence_withItems","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"isActive","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"level","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck_withItems","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck_withItems_withDice","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"material","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"murasaki_function_share_address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"murasaki_info_address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"not_petrified","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"personality","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"precious","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"satiety","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"score","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"softness","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"street","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"strength","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"strength_withItems","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"summoner","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_coin_mined","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_exp_gained","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_item_crafted","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_material_farmed","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_precious_received","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"}];
    let _address = "0x73c446a4531b67dEBd93fC9Dc904c822723Da95A";
    let contract = new web3.eth.Contract(_abi, _address);
    let _text = "";
    let _summoner = await contract.methods.summoner(wallet).call();
    if (_summoner == 0) {
        _text += "&nbsp;&nbsp;&nbsp;";
        _text += "You have not summoned your Murasaki-san yet.";
    } else {
        let _name = await contract.methods.name(wallet).call();
        if (_name == "") {
            _name = "#" + _summoner;
        }
        //let _flower = await contract.methods.flower(wallet).call();
        let _street = await contract.methods.street(wallet).call();
        let _city = await contract.methods.city(wallet).call();
        let _personality = await contract.methods.personality(wallet).call();
        _text += "&nbsp;&nbsp;&nbsp;";
        _text += "You are the owner of <b>";
        _text += _personality;
        _text += " ";
        _text += _name;
        _text += "</b> lives at <b>";
        _text += _street;
        _text += "</b> of <b>";
        _text += _city;
        _text += "</b>.";
    }
    let target = document.getElementById("output");
    target.innerHTML = _text;
}


//reset item position
function reset_item_position() {
    localStorage.removeItem("pos_item_musicbox");
    localStorage.removeItem("pos_item_fortune_status");
    localStorage.removeItem("pos_item_asnya");
    localStorage.removeItem("pos_item_vase");
    localStorage.removeItem("pos_item_tablet");
    localStorage.removeItem("pos_item_violin");
    localStorage.removeItem("pos_item_piano");
    localStorage.removeItem("pos_item_book");
    localStorage.removeItem("pos_item_fishbowl");
    localStorage.removeItem("pos_item_hourglass");
}


//update summoner
function button_select_summoner() {
    summoner = document.getElementById("summoner").value;
    window.location.href = "house.html?summoner=" + summoner;
}


/*
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
            rpcUrls: ["https://https://evm.shibuya.astar.network"],
            blockExplorerUrls: ['https://blockscout.com/shibuya'],
        }]
    });
    return web3;
}

//get wallet
async function get_wallet() {
    let web3 = await connect();
    let wallet = await web3.eth.getAccounts();
    return wallet[0];
}
*/

//write message
async function contract_write_message(_message) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_bulletin_board, contract_bulletin_board);
    let wallet = await get_wallet(web3);
    contract.methods.write_message(_message).send({from:wallet});
}
function write_message() {
    let _message = document.getElementById("message").value;
    contract_write_message(_message);
}

//read message
async function contract_read_message(_count) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_bulletin_board, contract_bulletin_board);
    let wallet = await get_wallet(web3);
    let _message = await contract.methods.read_recent_messages(_count).call(); 
    //console.log(_message);
    return _message;
}

//show messages
async function show_messages() {
    let _res;
    let _count;
    //reset text
    messages.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
        _res = await contract_read_message(i);
        //when count=0, stop
        _count = _res[0];
        if (_count == 0) {
            return 0;
        }
        if (_res[2] == "0x0000000000000000000000000000000000000000") {
            continue;
        }
        messages.innerHTML += "<p>";
        messages.innerHTML += "<font color='blue'>" + _res[1] + " / " + _res[2].substring(0,10) +"... :</font>";
        messages.innerHTML += "<br>";
        messages.innerHTML += _res[3];
        messages.innerHTML += "</p>";
    }
}

/*
//donate
async function donate(_value) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let _to_wallet = "0x2F7448B62134e52C2f46454d0089Ae21B5248805";
    let _value_wei = web3.utils.toWei(_value.toString());
    await web3.eth.sendTransaction({from: wallet, to: _to_wallet, value: _value_wei});
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
*/
