
/*
https://tky-advinfo.com/programing/datatables/
*/


//get items on market
async function update_onMarketItems() {
    let ListLength = await contract_mmt_wss.methods.listLength().call();
    let ListsAt = await contract_mmt_wss.methods.listsAt(0, ListLength).call();
    let _html_all = "";
    for (let i = 0; i < ListLength; i++) {

        //get info
        let _item = ListsAt[0][i];
        let _itemInfo = await contract_mmt.methods.get_itemInfo(_item).call();
        let _item_type = _itemInfo[0][0];
        let _item_subtype = _itemInfo[0][1];
        let _crafter = _itemInfo[0][2];
        let _listedPrice = _itemInfo[0][3];
        let _auctionPrice = _itemInfo[0][4];
        let _auctionRestingTime = _itemInfo[0][5];
        let _crafterName = _itemInfo[1];
        let _itemName = dic_items_reverse[_item_type];
        let _itemPng = dic_items[_itemName]["icon_png"];

        //convert prices
        _listedPrice = web3.utils.fromWei(_listedPrice, "ether")
        _auctionPrice = web3.utils.fromWei(_auctionPrice, "ether")

        //define mode
        let _isPrelisting = false;
        if (
            _listedPrice < 100
            //&& _auctionRestingTime <= 24 * 60 * 60
            && _auctionRestingTime > 0
        ) {
            _isPrelisting = true;
        }
        
        //round prices
        _listedPrice = (Math.round(_listedPrice*100)/100).toFixed(2);
        _auctionPrice = (Math.round(_auctionPrice*100)/100).toFixed(2);

        //convert time
        let _h = Math.floor(_auctionRestingTime / 3600);
        let _m = Math.floor(_auctionRestingTime % 3600 / 60);
        _auctionRestingTime = 
            _h.toString().padStart(2, "0") + "h:" 
            + _m.toString().padStart(2, "0") + "m";
        
        //name check
        if (_crafter == 0) {
            _crafterName = "*Fluffy Kingdom*";
        } else if (_crafterName == "") {
            _crafterName = "#" + _crafter;
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
            _item_rarity = "<font color=black>common</font>";
        } else if (_item_type >= 213 && _item_type <= 224) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type >= 225 && _item_type <= 236) {
            _item_rarity = "<font color=orange>rare</font>";
        } else {
            _item_rarity = "<font color=black>---</font>";
        }
        
        //prepare html
        let _html = "";
        _html += "<tr><td><center>"
        _html += _item;
        _html += "</center></td><td><center>";
        _html += "<img src='";
        _html += "src/" + _itemPng;
        _html += "' width='32' height='32'> ";
        _html += _itemName;
        _html += "</center></td><td><center>";
        _html += _item_rarity;
        _html += "</center></td><td><center>";
        _html += _crafterName;
        _html += "</center></td>";
        if (_isPrelisting == false) {
            _html += "<td id='" + "input_price_" + _item + "'><center><b>";
            _html += _listedPrice;
            _html += "</b></center></td><td><center>";
            _html += "<button onclick='buy_item(" + _item + "," + _auctionPrice + ");'>";
            _html += "Buy";
            _html += "</button>";
            _html += "</center></td></tr>";
        } else {
            _html += "<td id='" + "input_price_" + _item + "'><center>";
            _html += "<font color='blue'><b>" + _auctionPrice + "</b></font><br>";
            _html += "<div style='line-height:100%'>";
            _html += "<font size='2' color='blue'>" + "- prelisting -" + "</font><br>";
            //_html += "(Listing price: <b>" + _listedPrice + "</b>)<br>";
            _html += "<font size='2' color='blue'>&#x231b;" + _auctionRestingTime + "</font>";
            _html += "</div>";
            _html += "</center></td><td><center>";
            _html += "<button onclick='buy_item(" + _item + "," + _auctionPrice + ");'>";
            _html += "Buy";
            _html += "</button>";
            _html += "</center></td></tr>";
        }
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
        let _item_name = dic_items_reverse[_item_type];
        let _crafted_summoner = _items[2];
        //summoner_name
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = "#" + _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=black>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
        } else if (_item_type == 197) {
            let _score = await contract_msn_wss.methods.score(_item).call();
            _item_rarity = "<font color=#E85298>score: " + _score + "</font>";
        } else if (_item_type >= 201 && _item_type <= 212) {
            _item_rarity = "<font color=black>common</font>";
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
        _html += '</center></td><td><center>';
        _html += "<img src='";
        _html += "src/" + dic_items[_item_name]["icon_png"];
        _html += "' width='32' height='32'> ";
        _html += _item_name;
        _html += "</center></td><td><center>";
        _html += _item_rarity;
        _html += "</center></td><td><center>";
        _html += _crafted_summoner_name;
        _html += "</center></td><td><center><b>";
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
    let _dic_summoner_name = {};
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[i];
        _items = await contract_mc_wss.methods.items(_item).call();
        let _item_type = _items[0];
        let _item_name = dic_items_reverse[_item_type];
        //let _crafted_time = _items[1];
        let _crafted_summoner = _items[2];
        let _crafted_wallet = _items[3];
        let _wallet1 = _crafted_wallet.substring(0,5);
        let _wallet2 = _crafted_wallet.slice(-4);
        //summoner_name
        let _crafted_summoner_name = "";
        _crafted_summoner_name = _dic_summoner_name[_crafted_summoner];
        if (typeof _crafted_summoner_name == "undefined"){
            _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
            _dic_summoner_name[_crafted_summoner] = _crafted_summoner_name;
        }
        /*
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        */
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = "#" + _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=black>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
        } else if (_item_type == 197) {
            let _score = await contract_msn_wss.methods.score(_item).call();
            _item_rarity = "<font color=#E85298>score: " + _score + "</font>";
        } else if (_item_type >= 201 && _item_type <= 212) {
            _item_rarity = "<font color=black>common</font>";
        } else if (_item_type >= 213 && _item_type <= 224) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type >= 225 && _item_type <= 236) {
            _item_rarity = "<font color=orange>rare</font>";
        } else {
            _item_rarity = "<font color=black>---</font>";
        }
        //console.log(_item, _item_type, _crafted_time, _crafted_summoner, _crafted_wallet);
        let _html = "";
        _html += "<tr><td valign='middle' align='center'><center>"
        _html += _item;
        _html += "</center></td><td valign='middle' align='center'><center>";
        _html += "<img src='";
        _html += "src/" + dic_items[_item_name]["icon_png"];
        _html += "' width='32' height='32'> ";
        _html += _item_name;
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
        _html += "<input type='number' style='width:70px;' id='" + "input_price_" + _item + "'>";
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


//buyback
async function update_buyback() {
    let myListLength = await contract_mc_wss.methods.myListLength(wallet).call();
    let myListsAt = await contract_mc_wss.methods.myListsAt(wallet, 0, myListLength).call();
    let buybackPrices = await contract_bt_wss.methods.calc_buybackPrice_asArray().call();
    let _html_all = "";
    let _dic_summoner_name = {};
    for (let i = 0; i < myListLength; i++) {
        let _item = myListsAt[i];
        let _items = await contract_mc_wss.methods.items(_item).call();
        let _item_type = Number(_items[0]);
        //item level
        let _item_level = 0;
        //craft item
        if (_item_type <= 192) {
            _item_level = _item_type % 16;
            if (_item_level == 0) {
                _item_level = 16;
            }
        //fluffy
        } else if (_item_type >= 201 && _item_type <= 248) {
            if (_item_type <= 212) {
                _item_level = 21;
            } else if (_item_type <= 224) {
                _item_level = 22;
            } else if (_item_type <= 236) {
                _item_level = 23;
            } else if (_item_type <= 248) {
                _item_level = 24;
            }
        //twinkleSparkleGlitter
        } else if (_item_type >= 251 && _item_type <= 256) {
            _item_level = 22;
        } else {
            _item_level = 0;
        }
        let _item_price = (buybackPrices[_item_level]/10**18).toFixed(2);
        let _item_name = dic_items_reverse[_item_type];
        //let _crafted_time = _items[1];
        let _crafted_summoner = _items[2];
        let _crafted_wallet = _items[3];
        let _wallet1 = _crafted_wallet.substring(0,5);
        let _wallet2 = _crafted_wallet.slice(-4);
        //summoner_name
        let _crafted_summoner_name = "";
        _crafted_summoner_name = _dic_summoner_name[_crafted_summoner];
        if (typeof _crafted_summoner_name == "undefined"){
            _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
            _dic_summoner_name[_crafted_summoner] = _crafted_summoner_name;
        }
        /*
        try {
            _crafted_summoner_name = _dic_summoner_name[_crafted_summoner];
        } catch (error) {
            _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
            _dic_summoner_name[_crafted_summoner] = _crafted_summoner_name;
        }
        let _crafted_summoner_name = await call_name_from_summoner(_crafted_summoner);
        */
        if (_crafted_summoner_name == "") {
            _crafted_summoner_name = "#" + _crafted_summoner;
        }
        //item_rarity
        let _item_rarity;
        if (_item_type <= 64) {
            _item_rarity = "<font color=black>common</font>";
        } else if (_item_type <= 128) {
            _item_rarity = "<font color=blue>uncommon</font>";
            _item_price *= 3;
        } else if (_item_type <= 192) {
            _item_rarity = "<font color=orange>rare</font>";
            _item_price *= 9;
        } else if (_item_type == 197) {
            let _score = await contract_msn_wss.methods.score(_item).call();
            _item_rarity = "<font color=#E85298>score: " + _score + "</font>";
        } else if (_item_type >= 201 && _item_type <= 212) {
            _item_rarity = "<font color=black>common</font>";
        } else if (_item_type >= 213 && _item_type <= 224) {
            _item_rarity = "<font color=blue>uncommon</font>";
        } else if (_item_type >= 225 && _item_type <= 236) {
            _item_rarity = "<font color=orange>rare</font>";
        } else {
            _item_rarity = "<font color=black>---</font>";
        }
        //console.log(_item, _item_type, _crafted_time, _crafted_summoner, _crafted_wallet);
        let _html = "";
        _html += "<tr><td valign='middle' align='center'><center>"
        _html += _item;
        _html += "</center></td><td valign='middle' align='center'><center>";
        _html += "<img src='";
        _html += "src/" + dic_items[_item_name]["icon_png"];
        _html += "' width='32' height='32'> ";
        _html += _item_name;
        _html += "</center></td><td><center>";
        _html += _item_rarity;
        _html += "</center></td><td><center>";
        _html += _crafted_summoner_name;
        _html += "</center></td><td><center>";
        if (_item_price > 0) {
            _html += "<b>";
            _html += _item_price;
            _html += "</b>";
            //_html += "<input type='number' style='width:70px;' id='" + "input_price_" + _item + "'>";
            _html += "&nbsp;&nbsp;";
            _html += "<button style='background-color:#ff4500' onclick='buyback_item(" + _item + ");'>";
            _html += "Burn";
            _html += "</button>";
        } else {
            _html += "---";
        }
        _html += "</center></td></tr>";
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
       $('#table_buyback').DataTable({lengthChange: false});
    });

    //update amountpaied
    let _summoner = await contract_mm.methods.tokenOf(wallet).call() 
    let _amountpained = await contract_bt.methods.amountPaied(_summoner).call() 
    _html_all = "";
    _html_all += "Your total buybacked amount: <b>";
    _html_all += (Number(_amountpained)/10**18).toFixed(2);
    _html_all += "&nbsp;$ASTR</b>";
    total_paied.innerHTML = _html_all;
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

//buyback item
async function buyback_item(_item) {
    let _summoner = await contract_mm.methods.tokenOf(wallet).call() 
    await contract_bt.methods.buyback(_summoner, _item).send({from:wallet});
}

//approve
async function approve() {
    await contract_mc.methods.setApprovalForAll(address_Murasaki_Market_Item, true).send({from:wallet});
}
async function approve_buyback() {
    await contract_mc.methods.setApprovalForAll(address_BuybackTreasury, true).send({from:wallet});
}

async function transfer_item() {
    let _fee = await contract_mc.methods.getTransferFee(0).call();
    let _item = document.getElementById("transfer_item_id").value;
    let _to_summoner = document.getElementById("transfer_summoner").value;
    let _to_wallet = await contract_mm.methods.ownerOf(_to_summoner).call();
    contract_mc.methods.safeTransferFrom(wallet, _to_wallet, _item).send({from:wallet, value: _fee});
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
    let _res = await contract_mc_wss.methods.isApprovedForAll(wallet, address_Murasaki_Function_Crafting).call();
    //console.log(_res);
    if (_res == true) {
        document.getElementById("button_approve_upgrade").disabled = true;
        document.getElementById("button_approve_upgrade").firstChild.data = "Approved";
    }
}
    
//check_approve
async function check_approve() {
    let _res = await contract_mc_wss.methods.isApprovedForAll(wallet, address_Murasaki_Market_Item).call();
    //console.log(_res);
    if (_res == true) {
        document.getElementById("button_approve").disabled = true;
        document.getElementById("button_approve").firstChild.data = "Approved";
    }
}

//check_approve buyback
async function check_approve_buyback() {
    let _res = await contract_mc_wss.methods.isApprovedForAll(wallet, address_BuybackTreasury).call();
    //console.log(_res);
    if (_res == true) {
        document.getElementById("button_approve_buyback").disabled = true;
        document.getElementById("button_approve_buyback").firstChild.data = "Approved";
    }
}

//get event
async function get_recent_activity() {
    let _block_latest = await web3.eth.getBlockNumber();
    let _block_from = _block_latest - 10000;
    if (_block_from < 1) {
        _block_from = 1;
    }
    let events = await contract_mmt_wss.getPastEvents("Buy", {
            fromBlock: _block_from,
            toBlock: _block_latest
    })
    console.log(events);
    if (events.length > 0) {
        recentActivity.innerHTML = "";
        for (let event of events) {
            let _block = event.blockNumber;
            let _item_id = event.returnValues[2];
            //let _wallet_seller = event.returnValues[1];
            //let _wallet_buyer = event.returnValues[2];
            let _summoner_seller = event.returnValues[1];
            let _summoner_buyer = event.returnValues[0];
            let _price = web3.utils.fromWei(event.returnValues[3]);
            _price = Math.round(_price*100)/100;
            //let _summoner_seller = await contract_mm_wss.methods.tokenOf(_wallet_seller).call();  //have not summoned yet: 0
            //let _summoner_buyer = await contract_mm_wss.methods.tokenOf(_wallet_buyer).call();  //have not summoned yet: 0
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
            let _item_name = dic_items_reverse[_item_type];
            let _text = "&nbsp;&nbsp;&nbsp;" + _block + " : <u>" + _name_buyer + "</u> bought <b>" + _item_name + "</b> from <u>" + _name_seller + "</u> for <b>" + _price + " $ASTR</b>.<br>"
            recentActivity.innerHTML += _text;
        }
    } else {
        let _text = "&nbsp;&nbsp;&nbsp;No recent sacles."
        recentActivity.innerHTML = _text;
    }
}


//trading volume
async function show_totalTradingVolume() {
    let _volume = await contract_mmt.methods.total_tradingVolume().call();
    _volume = web3.utils.fromWei(_volume, "ether");
    _volume = Math.round(_volume*100)/100;
    totalTradingVolume.innerHTML = _volume;
}


//load, for html
async function loading_in_html() {
    //active JQuery Datatable
    //TOFIX: using JSON!
    //await init_web3();
    if (flag_web3Loaded && typeof(wallet) != "undefined") {
        update_onMarketItems();
        update_sellingItems();
        update_userItems();
        check_approve();
        check_approve_upgrade();
        get_recent_activity();
        show_transferFee();
        show_totalTradingVolume();
    } else {
        tbody_sellingItems.innerHTML = "&nbsp;Waiting...";
        tbody_listedItems.innerHTML = "&nbsp;Waiting...";
        tbody_myItems.innerHTML = "&nbsp;Waiting...";
        setTimeout(loading_in_html, 1000);
    }
}
async function loading_in_html_buyback() {
    await init_web3();
    update_buyback();
    check_approve_buyback();
}

//transfer fee
async function show_transferFee() {
    let _text = await contract_mc.methods.TRANSFER_FEE().call() 
    _text = (Math.round(_text/10**18)).toFixed(2);
    let _target = document.getElementById("transferFee");
    _target.innerHTML = _text;
}
