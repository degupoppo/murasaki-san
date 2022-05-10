
/*

https://tky-advinfo.com/programing/datatables/
jQueryのDataTablesプラグインを使用

*/


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

//get items on market
async function update_onMarketItems() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    //contract
    let contract = await new web3.eth.Contract(abi_murasaki_item_market, contract_murasaki_item_market);
    let contract_mc = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let ListLength = await contract.methods.listLength().call();
    let ListsAt = await contract.methods.listsAt(0, ListLength).call();
    for (let i = 0; i < ListLength; i++) {
        let _item = ListsAt[0][i];
        let _price = ListsAt[1][i];
        _price = web3.utils.fromWei(_price, "ether");
        let _items = await contract_mc.methods.items(_item).call();
        let _item_type = _items[0];
        let _crafted_summoner = _items[2];
        //summoner_name
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
        } else {
            _item_rarity = "<font color=black>---</font>";
        }
        let _html = "";
        _html += "<tr><td><center>"
        _html += _item;
        _html += "</center></td><td><center>";
        //_html += _item_type;
        _html += "<img src='";
        _html += "src/market_icon/" + array_item_png[_item_type];
        _html += "' width='18' height='18'> ";
        _html += array_item_name[_item_type];
        _html += "</center></td><td><center>";
        _html += _item_rarity;
        _html += "</center></td><td><center>";
        _html += _crafted_summoner_name;
        _html += "</center></td><td id='" + "input_price_" + _item + "'><center><b>";
        //_html += (Math.round(_price/(10**18)*100)/100).toFixed(2);
        _html += (Math.round(_price*100)/100).toFixed(2);
        _html += "</b></center></td><td><center>";
        _html += "<button onclick='buy_item(" + _item + "," + _price + ");'>";
        _html += "Buy";
        _html += "</button>";
        _html += "</center></td></tr>";
        tbody_sellingItems.innerHTML += _html;
    }
    //after loading, activate JQuery CSS
    $(document).ready(function(){
       $('#table_onMarketItems').DataTable({lengthChange: false});
    });
}

//get selling items of listed
async function update_sellingItems() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    //contract
    let contract = await new web3.eth.Contract(abi_murasaki_item_market, contract_murasaki_item_market);
    let contract_mc = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let myListLength = await contract.methods.myListLength(wallet).call();
    let myListsAt = await contract.methods.myListsAt(wallet, 0, myListLength).call();
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[0][i];
        let _price = myListsAt[1][i];
        _price = web3.utils.fromWei(_price, "ether");
        let _items = await contract_mc.methods.items(_item).call();
        let _item_type = _items[0];
        let _crafted_summoner = _items[2];
        //summoner_name
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
        } else {
            _item_rarity = "<font color=black>---</font>";
        }
        let _html = "";
        _html += "<tr><td><center>"
        _html += _item;
        _html += "</center></td><td><center>";
        _html += "<img src='";
        _html += "src/market_icon/" + array_item_png[_item_type];
        _html += "' width='18' height='18'> ";
        _html += array_item_name[_item_type];
        _html += "</center></td><td><center>";
        _html += _item_rarity;
        _html += "</center></td><td><center>";
        _html += _crafted_summoner_name;
        _html += "</center></td><td><center><b>";
        //_html += (Math.round(_price/(10**18)*100)/100).toFixed(2);
        _html += (Math.round(_price*100)/100).toFixed(2);
        _html += "</b></center></td><td><center>";
        _html += "<button onclick='unlist_item(" + _item + ");'>";
        _html += "Unlist";
        _html += "</button>";
        _html += "</center></td></tr>";
        tbody_listedItems.innerHTML += _html;
    }
    //after loading, activate JQuery CSS
    $(document).ready(function(){
       $('#talbe_sellingItems').DataTable({lengthChange: false});
    });
}

//get items of users
async function update_userItems() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    //contract
    let contract = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let myListLength = await contract.methods.myListLength(wallet).call();
    let myListsAt = await contract.methods.myListsAt(wallet, 0, myListLength).call();
    //console.log(myListsAt);
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[i];
        _items = await contract.methods.items(_item).call();
        let _item_type = _items[0];
        //let _crafted_time = _items[1];
        let _crafted_summoner = _items[2];
        let _crafted_wallet = _items[3];
        let _wallet1 = _crafted_wallet.substring(0,5);
        let _wallet2 = _crafted_wallet.slice(-4);
        //summoner_name
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
        } else {
            _item_rarity = "<font color=black>---</font>";
        }
        //console.log(_item, _item_type, _crafted_time, _crafted_summoner, _crafted_wallet);
        let _html = "";
        _html += "<tr><td><center>"
        _html += _item;
        _html += "</center></td><td><center>";
        _html += "<img src='";
        _html += "src/market_icon/" + array_item_png[_item_type];
        _html += "' width='20' height='20'> ";
        _html += array_item_name[_item_type];
        _html += "</center></td><td><center>";
        //_html += _crafted_time;
        _html += _item_rarity;
        _html += "</center></td><td><center>";
        //_html += _crafted_summoner;
        //_html += await call_name_from_summoner(_crafted_summoner);
        _html += _crafted_summoner_name;
        //_html += "</center></td><td><center>";
        //_html += _wallet1 + "..." + _wallet2;
        _html += "</center></td><td><center>";
        _html += "<input type='number' id='" + "input_price_" + _item + "'>";
        _html += "&nbsp;&nbsp;";
        _html += "<button onclick='list_item(" + _item + ");'>";
        _html += "Sell";
        _html += "</button>";
        _html += "</center></td></tr>";
        tbody_myItems.innerHTML += _html;
    }
    //after loading, activate JQuery CSS
    $(document).ready(function(){
       $('#table_userItems').DataTable({lengthChange: false});
    });
}

//buy item
async function buy_item(_item, _price) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_murasaki_item_market, contract_murasaki_item_market);
    _price = (_price).toString();
    _price = web3.utils.toWei(_price);
    await contract.methods.buy(_item).send({from: wallet, value: _price});
}

//unlist item
async function unlist_item(_item) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_murasaki_item_market, contract_murasaki_item_market);
    await contract.methods.unlist(_item).send({from:wallet});
}

//list item
async function list_item(_item) {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    //let _price = new BigNumber(document.getElementById("input_price_"+_item).value * 10**18);
    let _price = document.getElementById("input_price_"+_item).value
    _price = web3.utils.toWei(_price);
    let contract = await new web3.eth.Contract(abi_murasaki_item_market, contract_murasaki_item_market);
    await contract.methods.list(_item, _price).send({from:wallet});
}

//approve
async function approve() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    //console.log(await contract.methods.isApprovedForAll(wallet, contract_murasaki_item_market).call());
    await contract.methods.setApprovalForAll(contract_murasaki_item_market, true).send({from:wallet});
}

//check_approve
async function check_approve() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let _res = await contract.methods.isApprovedForAll(wallet, contract_murasaki_item_market).call();
    //console.log(_res);
    if (_res == true) {
        document.getElementById("button_approve").disabled = true;
        document.getElementById("button_approve").firstChild.data = "Approved";
    }
}

//transfer item
async function transfer_item() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mm = await new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
    let _item = document.getElementById("transfer_item_id").value;
    let _to_summoner = document.getElementById("transfer_summoner").value;
    let _to_wallet = await contract_mm.methods.ownerOf(_to_summoner).call();
    let contract = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    contract.methods.safeTransferFrom(wallet, _to_wallet, _item).send({from:wallet});
}

//call name from summoner id
async function call_name_from_summoner(_summoner) {
    let web3 = await connect();
    let contract = await new web3.eth.Contract(abi_murasaki_function_name, contract_murasaki_function_name);
    let _name = await contract.methods.call_name_from_summoner(_summoner).call();
    return _name;
}

//approve_upgrade
async function approve_upgrade() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    await contract.methods.setApprovalForAll(contract_murasaki_function_crafting, true).send({from:wallet});
}

//check_approve_upgrade
async function check_approve_upgrade() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract = await new web3.eth.Contract(abi_murasaki_craft, contract_murasaki_craft);
    let _res = await contract.methods.isApprovedForAll(wallet, contract_murasaki_function_crafting).call();
    //console.log(_res);
    if (_res == true) {
        document.getElementById("button_approve_upgrade").disabled = true;
        document.getElementById("button_approve_upgrade").firstChild.data = "Approved";
    }
}
    
//upgrade item
async function upgrade_item() {
    let web3 = await connect();
    let wallet = await get_wallet(web3);
    let contract_mm = await new web3.eth.Contract(abi_murasaki_main, contract_murasaki_main);
    let _summoner = await contract_mm.methods.tokenOf(wallet).call();  //have not summoned yet: 0
    let _item1 = document.getElementById("upgrade_item_id1").value;
    let _item2 = document.getElementById("upgrade_item_id2").value;
    let _item3 = document.getElementById("upgrade_item_id3").value;
    let contract_mfc = await new web3.eth.Contract(abi_murasaki_function_crafting, contract_murasaki_function_crafting);
    contract_mfc.methods.upgrade_item(_summoner, _item1, _item2, _item3).send({from:wallet});
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
