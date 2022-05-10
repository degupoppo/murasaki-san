
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
