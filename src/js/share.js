
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

//donate
async function donate() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let _to_wallet = "0x2F7448B62134e52C2f46454d0089Ae21B5248805";
    let _value = web3.utils.toWei("10");
    web3.eth.sendTransaction({from: wallet, to: _to_wallet, value: _value});
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
