
/*

https://tky-advinfo.com/programing/datatables/
jQueryのDataTablesプラグインを使用

*/


//get items on market
async function update_onMarketItems() {
    let ListLength = await contract_mmt_wss.methods.listLength().call();
    let ListsAt = await contract_mmt_wss.methods.listsAt(0, ListLength).call();
    let _html_all = "";
    for (let i = 0; i < ListLength; i++) {
        let _item = ListsAt[0][i];
        let _price = ListsAt[1][i];
        _price = web3.utils.fromWei(_price, "ether");
        let _items = await contract_mc_wss.methods.items(_item).call();
        let _item_type = _items[0];
        let _crafted_summoner = _items[2];
        //summoner_name
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = "#" + _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
        } else if (_item_type == 197) {
            let _score = await contract_msn_wss.methods.score(_item).call();
            _item_rarity = "<font color=#E85298>score: " + _score + "</font>";
        } else if (_item_type >= 201 && _item_type <= 212) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type >= 213 && _item_type <= 224) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type >= 225 && _item_type <= 236) {
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
        //combine html
        _html_all += _html;
        //count-up loading
        let _text = "&nbsp;Now&nbsp;Loading...&nbsp;" + i + "/" + ListLength;
        tbody_sellingItems.innerHTML = _text;
    }
    //write html
    tbody_sellingItems.innerHTML = _html_all;
    //after loading, activate JQuery CSS
    $(document).ready(function(){
       $('#table_onMarketItems').DataTable({lengthChange: false});
    });
}

//get selling items of listed
async function update_sellingItems() {
    let myListLength = await contract_mmt_wss.methods.myListLength(wallet).call();
    let myListsAt = await contract_mmt_wss.methods.myListsAt(wallet, 0, myListLength).call();
    let _html_all = "";
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[0][i];
        let _price = myListsAt[1][i];
        _price = web3.utils.fromWei(_price, "ether");
        let _items = await contract_mc_wss.methods.items(_item).call();
        let _item_type = _items[0];
        let _crafted_summoner = _items[2];
        //summoner_name
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = "#" + _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
        } else if (_item_type == 197) {
            let _score = await contract_msn_wss.methods.score(_item).call();
            _item_rarity = "<font color=#E85298>score: " + _score + "</font>";
        } else if (_item_type >= 201 && _item_type <= 212) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type >= 213 && _item_type <= 224) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type >= 225 && _item_type <= 236) {
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
        //combine html
        _html_all += _html;
        //count-up loading
        let _text = "&nbsp;Now&nbsp;Loading...&nbsp;" + i + "/" + myListLength;
        tbody_listedItems.innerHTML = _text;
    }
    //write html
    tbody_listedItems.innerHTML = _html_all;
    //after loading, activate JQuery CSS
    $(document).ready(function(){
       $('#talbe_sellingItems').DataTable({lengthChange: false});
    });
}

//get items of users
async function update_userItems() {
    let myListLength = await contract_mc_wss.methods.myListLength(wallet).call();
    let myListsAt = await contract_mc_wss.methods.myListsAt(wallet, 0, myListLength).call();
    let _html_all = "";
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[i];
        _items = await contract_mc_wss.methods.items(_item).call();
        let _item_type = _items[0];
        //let _crafted_time = _items[1];
        let _crafted_summoner = _items[2];
        let _crafted_wallet = _items[3];
        let _wallet1 = _crafted_wallet.substring(0,5);
        let _wallet2 = _crafted_wallet.slice(-4);
        //summoner_name
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = "#" + _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
        } else if (_item_type == 197) {
            let _score = await contract_msn_wss.methods.score(_item).call();
            _item_rarity = "<font color=#E85298>score: " + _score + "</font>";
        } else if (_item_type >= 201 && _item_type <= 212) {
            _item_rarity = "<font color=green>common</font>";
        } else if (_item_type >= 213 && _item_type <= 224) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type >= 225 && _item_type <= 236) {
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
        _html += "<input type='number' style='width:80px;' id='" + "input_price_" + _item + "'>";
        _html += "&nbsp;&nbsp;";
        _html += "<button onclick='list_item(" + _item + ");'>";
        _html += "List";
        _html += "</button>";
        _html += "</center></td></tr>";
        //tbody_myItems.innerHTML += _html;
        //add html
        _html_all += _html;
        //count-up loading
        let _text = "&nbsp;Now&nbsp;Loading...&nbsp;" + i + "/" + myListLength;
        tbody_myItems.innerHTML = _text;
    }
    //write html
    tbody_myItems.innerHTML = _html_all;
    //after loading, activate JQuery CSS
    $(document).ready(function(){
       $('#table_userItems').DataTable({lengthChange: false});
    });
}


//send

//buy item
async function buy_item(_item, _price) {
    _price = (_price).toString();
    _price = web3.utils.toWei(_price);
    await contract_mmt.methods.buy(_item).send({from: wallet, value: _price});
}

//unlist item
async function unlist_item(_item) {
    await contract_mmt.methods.unlist(_item).send({from:wallet});
}

//list item
async function list_item(_item) {
    //let _price = new BigNumber(document.getElementById("input_price_"+_item).value * 10**18);
    let _price = document.getElementById("input_price_"+_item).value
    _price = web3.utils.toWei(_price);
    await contract_mmt.methods.list(_item, _price).send({from:wallet});
}

//approve
async function approve() {
    await contract_mmt.methods.setApprovalForAll(contract_murasaki_item_market, true).send({from:wallet});
}

async function transfer_item() {
    let _item = document.getElementById("transfer_item_id").value;
    let _to_summoner = document.getElementById("transfer_summoner").value;
    let _to_wallet = await contract_mm.methods.ownerOf(_to_summoner).call();
    contract_mc.methods.safeTransferFrom(wallet, _to_wallet, _item).send({from:wallet});
}

//transfer item
//call name from summoner id
async function call_name_from_summoner(_summoner) {
    let _name = await contract_mfs_wss.methods.call_name_from_summoner(_summoner).call();
    return _name;
}

//approve_upgrade
async function approve_upgrade() {
    await contract_mc.methods.setApprovalForAll(contract_murasaki_function_crafting, true).send({from:wallet});
}

//upgrade item
async function upgrade_item() {
    let _summoner = await contract_mm_wss.methods.tokenOf(wallet).call();  //have not summoned yet: 0
    let _item1 = document.getElementById("upgrade_item_id1").value;
    let _item2 = document.getElementById("upgrade_item_id2").value;
    let _item3 = document.getElementById("upgrade_item_id3").value;
    contract_mfc.methods.upgrade_item(_summoner, _item1, _item2, _item3).send({from:wallet});
}


//call

//check_approve_upgrade
async function check_approve_upgrade() {
    let _res = await contract_mc_wss.methods.isApprovedForAll(wallet, contract_murasaki_function_crafting).call();
    //console.log(_res);
    if (_res == true) {
        document.getElementById("button_approve_upgrade").disabled = true;
        document.getElementById("button_approve_upgrade").firstChild.data = "Approved";
    }
}
    
//check_approve
async function check_approve() {
    let _res = await contract_mc_wss.methods.isApprovedForAll(wallet, contract_murasaki_item_market).call();
    //console.log(_res);
    if (_res == true) {
        document.getElementById("button_approve").disabled = true;
        document.getElementById("button_approve").firstChild.data = "Approved";
    }
}

//get event
async function get_recent_activity() {
    let _block_latest = await web3.eth.getBlockNumber();
    let _block_from = _block_latest - 10000;
    let events = await contract_mmt_wss.getPastEvents("Buy", {
            fromBlock: _block_from,
            toBlock: _block_latest
    })
    if (events) {
        for (let event of events) {
            let _block = event.blockNumber;
            let _item_id = event.returnValues[0];
            let _wallet_seller = event.returnValues[1];
            let _wallet_buyer = event.returnValues[2];
            let _price = web3.utils.fromWei(event.returnValues[3]);
            let _summoner_seller = await contract_mm_wss.methods.tokenOf(_wallet_seller).call();  //have not summoned yet: 0
            let _summoner_buyer = await contract_mm_wss.methods.tokenOf(_wallet_buyer).call();  //have not summoned yet: 0
            let _name_seller = await call_name_from_summoner(_summoner_seller);
            if (_name_seller == "") {
                _name_seller = "#" + _summoner_seller;
            }
            let _name_buyer = await call_name_from_summoner(_summoner_buyer);
            if (_name_buyer == "") {
                _name_buyer = "#" + _summoner_buyer;
            }
            let _item = await contract_mc_wss.methods.items(_item_id).call();
            let _item_type = _item[0];
            let _item_name = array_item_name[_item_type];
            let _text = "&nbsp;&nbsp;&nbsp;" + _block + " : <u>" + _name_buyer + "</u> bought <b>" + _item_name + "</b> from <u>" + _name_seller + "</u> for <b>" + _price + " $ASTR</b>.<br>"
            recentActivity.innerHTML += _text;
        }
    }
}

//load, for html
async function loading_in_html() {
    //active JQuery Datatable
    //TOFIX: using JSON!
    await init_web3();
    update_onMarketItems();
    update_sellingItems();
    update_userItems();
    check_approve();
    check_approve_upgrade();
    get_recent_activity();
}
