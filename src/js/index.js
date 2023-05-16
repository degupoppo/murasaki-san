

//eventMonitor

async function eventMonitor(_contract, li_eventLog) {
    (async () => {
        _contract.events.allEvents({}, (err, event) => {
            let _json_string = JSON.stringify(event, null, "    ");
            let _json = JSON.parse(_json_string);
            //console.log(_json);
            let _blockNumber = _json.blockNumber;
            let _event = _json.event;
            let _hash = _json.transactionHash;
            let _res = [_blockNumber, _event, _hash];
            for (let i=0; i<=5; i++) {
                let _eventRaw = _json.returnValues[i]
                if (typeof(_eventRaw) != "undefined") {
                    _res.push(_eventRaw);
                }
            }
            console.log(_res);
            li_eventLog.push(_res);
        });
    })();
}

async function get_recent_activity(_contract, li_eventLog) {
    let _block_latest = await web3.eth.getBlockNumber();
    let _block_from = _block_latest - 10000;
    if (_block_from < 1) {
        _block_from = 1;
    }
    let events = await _contract.getPastEvents("AllEvents", {
            fromBlock: _block_from,
            toBlock: _block_latest
    })
    if (events) {
        for (let event of events) {
            let _blockNumber = event.blockNumber;
            let _event = event.event;
            let _hash = event.transactionHash;
            let _res = [_blockNumber, _event, _hash];
            for (let i=0; i<=5; i++) {
                let _eventRaw = event.returnValues[i]
                if (typeof(_eventRaw) != "undefined") {
                    _res.push(_eventRaw);
                }
            }
            console.log(_res);
            li_eventLog.push(_res);
            /*
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
            let _item_name = dic_items_reverse[_item_type];
            let _text = "&nbsp;&nbsp;&nbsp;" + _block + " : <u>" + _name_buyer + "</u> bought <b>" + _item_name + "</b> from <u>" + _name_seller + "</u> for <b>" + _price + " $ASTR</b>.<br>"
            recentActivity.innerHTML += _text;
            */
        }
    }
}

function start_eventMonitor() {
    //global variant
    li_eventLog = [];

    //get recent activity
    get_recent_activity(contract_mfsl_wss, li_eventLog);
    get_recent_activity(contract_mffg_wss, li_eventLog);
    get_recent_activity(contract_mfmf_wss, li_eventLog);
    get_recent_activity(contract_mfc_wss, li_eventLog);
    get_recent_activity(contract_mfc2_wss, li_eventLog);
    get_recent_activity(contract_mfn_wss, li_eventLog);
    get_recent_activity(contract_md_wss, li_eventLog);
    get_recent_activity(contract_mml_wss, li_eventLog);
    get_recent_activity(contract_ff_wss, li_eventLog);
    get_recent_activity(contract_bt_wss, li_eventLog);
    get_recent_activity(contract_mfp_wss, li_eventLog);
    get_recent_activity(contract_st_wss, li_eventLog);
    get_recent_activity(contract_trial_tc_wss, li_eventLog);

    //start realtime monitoring
    eventMonitor(contract_mfsl_wss, li_eventLog);
    eventMonitor(contract_mffg_wss, li_eventLog);
    eventMonitor(contract_mfmf_wss, li_eventLog);
    eventMonitor(contract_mfc_wss, li_eventLog);
    eventMonitor(contract_mfc2_wss, li_eventLog);
    eventMonitor(contract_mfn_wss, li_eventLog);
    eventMonitor(contract_md_wss, li_eventLog);
    eventMonitor(contract_mml_wss, li_eventLog);
    eventMonitor(contract_ff_wss, li_eventLog);
    eventMonitor(contract_bt_wss, li_eventLog);
    eventMonitor(contract_mfp_wss, li_eventLog);
    eventMonitor(contract_st_wss, li_eventLog);
    eventMonitor(contract_trial_tc_wss, li_eventLog);
}

function _show_realtimeLog() {
    //override text
    let _target = document.getElementById("realtimeLog");
    let _text_pre = "";
    _text_pre += '<code><font color="gray">';
    //_text_pre += "&nbsp;&nbsp;&nbsp;&nbsp;Now monitoring (no events yet)...";
    _text_pre += "&nbsp;&nbsp;&nbsp;&nbsp;Monitoring...";
    _text_pre += "</font></code>";
    _target.innerHTML = _text_pre;
    start_eventMonitor();
    function _do() {
        let _text = '<code><font color="gray">';
        let _target = document.getElementById("realtimeLog");
        if (li_eventLog.length > 0) {
            _text += "";
            for (let i=0; i<li_eventLog.length && i<=10; i++) {
                let _eventLog = li_eventLog[li_eventLog.length - 1 - i];
                let _blockNumber = _eventLog[0];
                let _event = _eventLog[1];
                let _summoner = _eventLog[3];
                let __text = "";
                __text += "&nbsp;&nbsp;&nbsp;&nbsp;";
                __text += 'block_no:<b><font color="blue">' + _blockNumber + "</font></b>, ";
                __text += 'murasaki_id:<b><font color="blue">#' + _summoner + "</font></b>, ";
                __text += 'action:<b><font color="blue">' + _event + "</font></b><br>";
                _text += __text;
            }
            _text += "</font></code>";
            _target.innerHTML = _text;
        }
    }
    setInterval(_do, 5000);
}


//get info
async function total_trial_summoned() {
    let _res = await contract_trial_mm_wss.methods.next_token().call();
    return Number(_res) - 1;
}
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
    //if (typeof(wallet) != "undefined" && wallet != "") {
    if (flag_web3Loaded) {
        let _text
        let _target
        //total_summoned_trial
        _text = await total_trial_summoned();
        _target = document.getElementById("info_total_trial_summoned");
        _target.innerHTML = _text + " wallets";
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
        //festival block
        _text = await contract_ff.methods.next_festival_block().call();
        _target = document.getElementById("info_festivalBlock");
        _target.innerHTML = _text + " block";
        //festival winner
        let _dic = {
            201: "Gray Fluffy",
            202: "Beige Fluffy",
            203: "Limegreen Fluffy",
            204: "Lightblue Fluffy",
            205: "Blue Fluffy",
            206: "Purple Fluffy",
            207: "Redpurple Fluffy",
            208: "Red Fluffy",
            209: "Orange Fluffy",
            210: "Pink Fluffy",
            211: "Yellow Fluffy",
            212: "White Fluffy",
        }
        _text = await contract_ff.methods.elected_type().call();
        _target = document.getElementById("info_festivalWinner");
        _target.innerHTML = _dic[_text];
        //balance of bv
        _text = await balanceOfbv();
        _target = document.getElementById("info_balanceOf_bv");
        _target.innerHTML = _text + " $ASTR";
        //balance of bt
        _text = await balanceOfbt();
        _target = document.getElementById("info_balanceOf_bt");
        _target.innerHTML = _text + " $ASTR";
    } else {
        setTimeout(_show_onChain_parameters, 1000);
    }
    /*
    try {
        if (typeof(wallet) == "undefined") {
            await init_web3();
        }
        let _text
        let _target
        //total_summoned_trial
        _text = await total_trial_summoned();
        _target = document.getElementById("info_total_trial_summoned");
        _target.innerHTML = _text + " wallets";
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
    } catch (err) {
        setTimeout(_show_onChain_parameters, 5000);
    }
    */
}

//show icon
async function _show_icon() {
    if (typeof(wallet) != "undefined") {
        let _res;
        let _balance = await contract_mm.methods.balanceOf(wallet).call();
        if (_balance == 0) {    //when no token, call for trial
            _res = await contract_trial_mu.methods.tokenURI_fromWallet(wallet).call();
        } else {
            _res = await contract_mu.methods.tokenURI_fromWallet(wallet).call();
        }
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
    } else {
        setTimeout( _show_icon, 5000);
    }
        /*
    try {
        if (typeof(wallet) == "undefined") {
            await init_web3();
        }
        //let web3 = await new Web3("wss://testnetwss.murasaki-san.com");
        //let web3 = await new Web3(window.ethereum);
        //let _wallets = await window.ethereum.request({method: 'eth_requestAccounts'});
        // get wallet
        //let _wallets = await web3.eth.getAccounts();
        //let wallet = _wallets[0];
        // prepare contract
        //let _abi = [{'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'tokenURI_fromWallet', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}];
        //let _address = "0xcdA558BE0717D4F34b1f288c79a60d007daA11bf";
        //let contract = new web3.eth.Contract(_abi, _address);
        //let contract = contract_mu;
        // get tokenURI
        //let _res = await contract.methods.tokenURI_fromWallet(wallet).call();
        //check regular token
        let _res;
        let _balance = await contract_mm.methods.balanceOf(wallet).call();
        if (_balance == 0) {    //when no token, call for trial
            _res = await contract_trial_mu.methods.tokenURI_fromWallet(wallet).call();
        } else {
            _res = await contract_mu.methods.tokenURI_fromWallet(wallet).call();
        }
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
    } catch (err) {
        setTimeout( _show_icon, 5000);
    }
        */
}


//show icon2
async function _show_icon2() {
    //if (typeof(wallet) != "undefined" && wallet != "") {
    if (flag_web3Loaded) {
        let _res;
        let _balance = await contract_mm.methods.balanceOf(wallet).call();
        if (_balance == 0) {    //when no token, call for trial
            _res = await contract_trial_mu.methods.tokenURI_fromWallet(wallet).call();
        } else {
            _res = await contract_mu.methods.tokenURI_fromWallet(wallet).call();
        }
        // get SVG
        _res = _res.split("base64,")[1];
        _res = atob(_res);
        _res = _res.split("base64,")[1];
        _res = _res.split('"')[0];
        _res = atob(_res);
        // insert into html
        let _text = "";

        //_text += "<style>.showIcon{display: inline-block; width: 64px; float: center; margin-right: 16px; margin-top: 0px;}</style>";
        //_text += "<span class='showIcon' align='center'>";
        _text += _res;
        //_text += "</span>";

        let target = document.getElementById("output_murasakiIcon");
        target.innerHTML = _text;
    } else {
        setTimeout( _show_icon2, 1000);
    }
    /*
    try {
        if (typeof(wallet) == "undefined") {
            await init_web3();
        }
        let _res;
        let _balance = await contract_mm.methods.balanceOf(wallet).call();
        if (_balance == 0) {    //when no token, call for trial
            _res = await contract_trial_mu.methods.tokenURI_fromWallet(wallet).call();
        } else {
            _res = await contract_mu.methods.tokenURI_fromWallet(wallet).call();
        }
        // get SVG
        _res = _res.split("base64,")[1];
        _res = atob(_res);
        _res = _res.split("base64,")[1];
        _res = _res.split('"')[0];
        _res = atob(_res);
        // insert into html
        let _text = "";

        //_text += "<style>.showIcon{display: inline-block; width: 64px; float: center; margin-right: 16px; margin-top: 0px;}</style>";
        //_text += "<span class='showIcon' align='center'>";
        _text += _res;
        //_text += "</span>";

        let target = document.getElementById("output_murasakiIcon");
        target.innerHTML = _text;
    } catch (err) {
        setTimeout( _show_icon2, 5000);
    }
    */
}


async function _show_icon3() {
    //if (typeof(wallet) != "undefined" && wallet != "") {
    if (flag_web3Loaded) {
        //get random summoner
        let _tokenTotal = await contract_mm.methods.next_token().call();
        _tokenTotal = Number(_tokenTotal) -1;
        let li_summoner = [];
        for (let i=0; i<5; i++){
            let _rnd = Math.round(Math.random()*_tokenTotal);
            if (
                _rnd != 0 && li_summoner.indexOf(_rnd) < 0
            ){
                li_summoner.push(_rnd);
            }
        }
        //get tokenURI
        let target = document.getElementById("output_murasakiIcon");
        let _text = "";
        _text += "&nbsp;&nbsp;&nbsp;";
        for (let i=0; i<li_summoner.length; i++){
            let _summoner = li_summoner[i];
            let _res = await contract_mu.methods.tokenURI(_summoner).call();
            // get SVG
            _res = _res.split("base64,")[1];
            _res = atob(_res);
            _res = _res.split("base64,")[1];
            _res = _res.split('"')[0];
            _res = atob(_res);
            _res = '<a href="house.html?summoner=' + _summoner + '">' + _res + '</a>';
            _res += "&nbsp;&nbsp;&nbsp;";
            // insert into html
            _text += _res;
        }
        target.innerHTML = _text;
    } else {
        setTimeout( _show_icon3, 1000);
    }
}



//Hello Murasaki-san button

/*
in web page, these codes are required:

<div id="output_murasakiInfo">
    <button style="height:28px;font-size:80%" onclick="show_murasakiInfo();">
        &nbsp;<b>About your Murasaki-san</b>&nbsp;
    </button>
</div>

*/


async function show_murasakiInfo() {

    let _target = document.getElementById("output_murasakiInfo");
    let _text = "";

    //loading
    _text = '&nbsp;&nbsp;&nbsp;<b>Loading...</b>';
    _target.innerHTML = _text;
    
    //get web3
    let web3 = await new Web3(window.ethereum);
    //let web3 = await new Web3("wss://testnetwss.murasaki-san.com");
    await window.ethereum.request({method: 'eth_requestAccounts'});

    //get wallet
    let _wallets = await web3.eth.getAccounts();
    let wallet = _wallets[0];
    
    //prepare contract
    let _abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_Murasaki_Address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"address_Murasaki_Address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"age","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"birthplace","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"character","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"city","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"clarinet_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"class","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"coin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"countOf_achievement","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"critical_count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"dexterity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"dexterity_withItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"doing_now","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"exp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"flower","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"fluffy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"fumble_count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"happy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"harp_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"horn_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"inHouse","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"intelligence","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"intelligence_withItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"isActive","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"leaf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck_withItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck_withItems_withDice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"not_petrified","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"personality","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"piano_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"satiety","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"scent","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"score","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"scoreOf_achievement_onChain","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"street","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"strength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"strength_withItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"summoner","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"timpani_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_coin_mined","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_exp_gained","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_fluffy_received","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_item_crafted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_leaf_farmed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_mail_opened","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_mail_sent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_metSummoners","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_strolledDistance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_voted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"violin_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"weakpoint","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
    let _address = "0x31d69b5125ce419a2948a58b7Aa0883D57c06850";
    let contract = new web3.eth.Contract(_abi, _address);

    //get summoner
    let _summoner = await contract.methods.summoner(wallet).call();
    
    //when token not possess, err text
    if (_summoner == 0) {
        _text = "";
        _text += "&nbsp;&nbsp;&nbsp;";
        _text += "You have not summoned your Murasaki-san yet.";
    
    //when token possess
    } else {
    
        //prepare info
        let _character = await contract.methods.character(wallet).call();
        let _personality = await contract.methods.personality(wallet).call();
        let _weakpoint = await contract.methods.weakpoint(wallet).call();
        let _name = await contract.methods.name(wallet).call();
        if (_name == "") {
            _name = "#" + _summoner;
        }
        let _birthplace = await contract.methods.birthplace(wallet).call();
        let _flower = await contract.methods.flower(wallet).call();
        let _street = await contract.methods.street(wallet).call();
        let _city = await contract.methods.city(wallet).call();
        let _age = await contract.methods.age(wallet).call();
        _age = Math.floor(_age / 86400);    //sec -> days
        let _str = await contract.methods.strength(wallet).call();
        _str /= 100;    // x100 point -> x1 point
        let _total_leaf_farmed = await contract.methods.total_leaf_farmed(wallet).call();
        let _total_item_crafted = await contract.methods.total_item_crafted(wallet).call();
        //let _total_metSummoners = await contract.methods.total_metSummoners(wallet).call();
        let _total_metSummoners = 0;
        let _score = await contract.methods.score(wallet).call();
        let _happy = await contract.methods.happy(wallet).call();
        if (_happy >= 80) { //define happy degree
            _happy = "Very Happy (" + _happy + "%)";
        } else if (_happy >= 60) {
            _happy = "Happy (" + _happy + "%)";
        } else if (_happy >= 40) {
            _happy = "Neutral (" + _happy + "%)";
        } else if (_happy >= 20) {
            _happy = "Sad (" + _happy + "%)";
        } else {
            _happy = "Very Sad (" + _happy + "%)";
        }
        let _doing_now = await contract.methods.doing_now(wallet).call();
        let _total_mail_opened = await contract.methods.total_mail_opened(wallet).call();

        //parepare tokenURI and extract SVG
        let _tokenURI = await contract.methods.tokenURI(_summoner).call();
        _tokenURI = _tokenURI.split("base64,")[1];
        _tokenURI = atob(_tokenURI);
        _tokenURI = _tokenURI.split("base64,")[1];
        _tokenURI = _tokenURI.split('"')[0];
        _tokenURI = atob(_tokenURI);

        //prepare text

        _text = "";
        _text += "-------------------------------------------------------------------------";
        _text += "<br>";

        //icon
        _text += "<style>.showIcon{display: inline-block; width: 64px; float: left; margin-right: 16px; margin-top: 8px;}</style>";
        _text += "<span class='showIcon' align='left'>";
        _text += _tokenURI;
        _text += "</span>";

        //text
        _text += "You are the owner of a <b><font color='#ff7f50'>";
        _text += _character;
        _text += "</font></b>, <b><font color='#ff4500'>";
        _text += _personality;
        _text += "</font></b>, but <b><font color='#ff0000'>";
        _text += _weakpoint;
        _text += "</font></b> <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b>. <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b> was born from a <b><font color='#008080 '>";
        _text += _birthplace;
        _text += "</font></b> with a scent of <b><font color='#006400'>";
        _text += _flower;
        _text += "</font></b> and lives in a house on <b><font color='#8a2be2'>";
        _text += _street;
        _text += "</font></b> in <b><font color='#800080'>";
        _text += _city;
        _text += "</font></b> of State of Astar, Polkadot Union. At <b><font color='blue'>";
        _text += _age;
        _text += " days</font></b> old, <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b> has earned <b><font color='blue'>";
        _text += _str;
        _text += " STR</font></b> status, farmed a total of <b><font color='blue'>";
        _text += _total_leaf_farmed;
        _text += " leaves</font></b>, crafted <b><font color='blue'>";
        _text += _total_item_crafted;
        _text += " items</font></b>, received <b><font color='blue'>";
        _text += _total_mail_opened;
        _text += " mails</font></b>, and made <b><font color='blue'>";
        _text += _total_metSummoners;
        _text += " friends</font></b> while strolling. <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b> is currently <b><font color='#00bfff'>";
        _text += _doing_now;
        _text += "</font></b> and looks <b><font color='#ff0000'>";
        _text += _happy;
        _text += "</font></b> now. The current comfort score of <b><font color='#ff1493'>the house of ";
        _text += _name;
        _text += "</font></b> is <b><font color='#ffa500'>&#x273f;";
        _text += _score;
        _text += "</font></b>.";
        _text += "<br>";
        _text += "-------------------------------------------------------------------------";
        _text += "<br>";
    }
    //override html
    _target.innerHTML = _text;
}





async function show_murasakiInfo2() {

    let _target = document.getElementById("output_murasakiInfo");
    let _text = "";

    //loading
    _text = '&nbsp;&nbsp;&nbsp;<b>Loading...</b>';
    _target.innerHTML = _text;
    
    //get web3
    let web3 = await new Web3(window.ethereum);
    //let web3 = await new Web3("wss://testnetwss.murasaki-san.com");
    await window.ethereum.request({method: 'eth_requestAccounts'});

    //get summoner
    let _summoner = document.getElementById("input_summoner").value;

    //get wallet
    /*
    let _wallets = await web3.eth.getAccounts();
    let wallet = _wallets[0];
    */
    let wallet = await contract_mm.methods.ownerOf(_summoner).call();
    
    //prepare contract
    let _abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_Murasaki_Address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"address_Murasaki_Address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"age","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"birthplace","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"character","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"city","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"clarinet_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"class","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"coin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"countOf_achievement","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"critical_count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"dexterity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"dexterity_withItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"doing_now","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"exp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"flower","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"fluffy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"fumble_count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"happy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"harp_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"horn_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"inHouse","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"intelligence","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"intelligence_withItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"isActive","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"leaf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck_withItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"luck_withItems_withDice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"not_petrified","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"personality","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"piano_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"satiety","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"scent","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"score","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"scoreOf_achievement_onChain","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"street","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"strength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"strength_withItems","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"summoner","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"timpani_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_coin_mined","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_exp_gained","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_fluffy_received","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_item_crafted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_leaf_farmed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_mail_opened","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_mail_sent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_metSummoners","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_strolledDistance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"total_voted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"violin_level","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_wallet","type":"address"}],"name":"weakpoint","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
    let _address = "0x31d69b5125ce419a2948a58b7Aa0883D57c06850";
    let contract = new web3.eth.Contract(_abi, _address);

    //get summoner
    //let _summoner = await contract.methods.summoner(wallet).call();
    
    //when token not possess, err text
    if (_summoner == 0) {
        _text = "";
        _text += "&nbsp;&nbsp;&nbsp;";
        _text += "You have not summoned your Murasaki-san yet.";
    
    //when token possess
    } else {
    
        //prepare info
        let _character = await contract.methods.character(wallet).call();
        let _personality = await contract.methods.personality(wallet).call();
        let _weakpoint = await contract.methods.weakpoint(wallet).call();
        let _name = await contract.methods.name(wallet).call();
        if (_name == "") {
            _name = "#" + _summoner;
        }
        let _birthplace = await contract.methods.birthplace(wallet).call();
        let _flower = await contract.methods.flower(wallet).call();
        let _street = await contract.methods.street(wallet).call();
        let _city = await contract.methods.city(wallet).call();
        let _age = await contract.methods.age(wallet).call();
        _age = Math.floor(_age / 86400);    //sec -> days
        let _str = await contract.methods.strength(wallet).call();
        _str /= 100;    // x100 point -> x1 point
        let _total_leaf_farmed = await contract.methods.total_leaf_farmed(wallet).call();
        let _total_item_crafted = await contract.methods.total_item_crafted(wallet).call();
        //let _total_metSummoners = await contract.methods.total_metSummoners(wallet).call();
        let _total_metSummoners = 0;
        let _score = await contract.methods.score(wallet).call();
        let _happy = await contract.methods.happy(wallet).call();
        if (_happy >= 80) { //define happy degree
            _happy = "Very Happy (" + _happy + "%)";
        } else if (_happy >= 60) {
            _happy = "Happy (" + _happy + "%)";
        } else if (_happy >= 40) {
            _happy = "Neutral (" + _happy + "%)";
        } else if (_happy >= 20) {
            _happy = "Sad (" + _happy + "%)";
        } else {
            _happy = "Very Sad (" + _happy + "%)";
        }
        let _doing_now = await contract.methods.doing_now(wallet).call();
        let _total_mail_opened = await contract.methods.total_mail_opened(wallet).call();

        //parepare tokenURI and extract SVG
        let _tokenURI = await contract.methods.tokenURI(_summoner).call();
        _tokenURI = _tokenURI.split("base64,")[1];
        _tokenURI = atob(_tokenURI);
        _tokenURI = _tokenURI.split("base64,")[1];
        _tokenURI = _tokenURI.split('"')[0];
        _tokenURI = atob(_tokenURI);

        //prepare text

        _text = "";
        _text += "-------------------------------------------------------------------------";
        _text += "<br>";

        //icon
        _text += "<style>.showIcon{display: inline-block; width: 64px; float: left; margin-right: 16px; margin-top: 8px;}</style>";
        _text += "<span class='showIcon' align='left'>";
        _text += _tokenURI;
        _text += "</span>";

        //text
        _text += "Murasaki-san of ID <b><font color='blue'>#";
        _text += _summoner;
        _text += "</font></b> is a <b><font color='#ff7f50'>";
        _text += _character;
        _text += "</font></b>, <b><font color='#ff4500'>";
        _text += _personality;
        _text += "</font></b>, but <b><font color='#ff0000'>";
        _text += _weakpoint;
        _text += "</font></b> <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b>. <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b> was born from a <b><font color='#008080 '>";
        _text += _birthplace;
        _text += "</font></b> with a scent of <b><font color='#006400'>";
        _text += _flower;
        _text += "</font></b> and lives in a house on <b><font color='#8a2be2'>";
        _text += _street;
        _text += "</font></b> in <b><font color='#800080'>";
        _text += _city;
        _text += "</font></b> of State of Astar, Polkadot Union. At <b><font color='blue'>";
        _text += _age;
        _text += " days</font></b> old, <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b> has earned <b><font color='blue'>";
        _text += _str;
        _text += " STR</font></b> status, farmed a total of <b><font color='blue'>";
        _text += _total_leaf_farmed;
        _text += " leaves</font></b>, crafted <b><font color='blue'>";
        _text += _total_item_crafted;
        _text += " items</font></b>, received <b><font color='blue'>";
        _text += _total_mail_opened;
        _text += " mails</font></b>, and made <b><font color='blue'>";
        _text += _total_metSummoners;
        _text += " friends</font></b> while strolling. <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b> is currently <b><font color='#00bfff'>";
        _text += _doing_now;
        _text += "</font></b> and looks <b><font color='#ff0000'>";
        _text += _happy;
        _text += "</font></b> now. The current comfort score of <b><font color='#ff1493'>the house of ";
        _text += _name;
        _text += "</font></b> is <b><font color='#ffa500'>&#x273f;";
        _text += _score;
        _text += "</font></b>.";
        _text += "<br>";
        _text += "-------------------------------------------------------------------------";
        _text += "<br>";
    }
    //override html
    _target.innerHTML = _text;
}



/* all in one

<div id="output_murasakiInfo">
    <button style="height:28px;font-size:80%" onclick="show_murasakiInfo();">
        &nbsp;<b>About your Murasaki-san</b>&nbsp;
    </button>
</div>

<script>

async function show_murasakiInfo() {

    let _target = document.getElementById("output_murasakiInfo");
    let _text = "";

    //loading
    //let _loadingText = '&nbsp;&nbsp;&nbsp;<button disabled style="height:28px;font-size:80%" onclick="_show_info();">&nbsp;<b>Loading...</b>&nbsp;</button>';
    _text = '&nbsp;&nbsp;&nbsp;<b>Loading...</b>';
    //let target_pre = document.getElementById("output");
    _target.innerHTML = _text;
    
    //get web3
    let web3 = await new Web3(window.ethereum);
    //let web3 = await new Web3("wss://testnetwss.murasaki-san.com");
    await window.ethereum.request({method: 'eth_requestAccounts'});

    //get wallet
    let _wallets = await web3.eth.getAccounts();
    let wallet = _wallets[0];
    
    //prepare contract
    let _abi = [{'anonymous': false, 'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'previousOwner', 'type': 'address'}, {'indexed': true, 'internalType': 'address', 'name': 'newOwner', 'type': 'address'}], 'name': 'OwnershipTransferred', 'type': 'event'}, {'inputs': [{'internalType': 'address', 'name': '_address', 'type': 'address'}], 'name': '_set_Murasaki_Address', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'}, {'inputs': [], 'name': 'address_Murasaki_Address', 'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'age', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'birthplace', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'character', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'city', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'class', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'coin', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'countOf_achievement', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'dexterity', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'dexterity_withItems', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'exp', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'flower', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'happy', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'inHouse', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'intelligence', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'intelligence_withItems', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'isActive', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'level', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'luck', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'luck_withItems', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'luck_withItems_withDice', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'material', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'name', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'not_petrified', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [], 'name': 'owner', 'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'personality', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'precious', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [], 'name': 'renounceOwnership', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'satiety', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'scent', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'score', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'scoreOf_achievement_onChain', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'street', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'strength', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'strength_withItems', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'summoner', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'total_coin_mined', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'total_exp_gained', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'total_item_crafted', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'total_material_farmed', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'total_precious_received', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': 'newOwner', 'type': 'address'}], 'name': 'transferOwnership', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': '_wallet', 'type': 'address'}], 'name': 'weakpoint', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}];
    //let _address = "0x1525983482727b079C54dB04b95fB7BB3D1c90c5";
    let _address = "0xfa6D20407E6b1A3BE061357A26712e77c8c9Bde7";    //trial
    let contract = new web3.eth.Contract(_abi, _address);

    //get summoner
    let _summoner = await contract.methods.summoner(wallet).call();
    
    //check summoner

    //when token not possess
    if (_summoner == 0) {
        _text = "";
        _text += "&nbsp;&nbsp;&nbsp;";
        _text += "You have not summoned your Murasaki-san yet.";
    
    //when token possess
    } else {
    
        //prepare info
        let _character = await contract.methods.character(wallet).call();
        let _personality = await contract.methods.personality(wallet).call();
        let _weakpoint = await contract.methods.weakpoint(wallet).call();
        let _name = await contract.methods.name(wallet).call();
        if (_name == "") {
            _name = "#" + _summoner;
        }
        let _birthplace = await contract.methods.birthplace(wallet).call();
        let _flower = await contract.methods.flower(wallet).call();
        let _street = await contract.methods.street(wallet).call();
        let _city = await contract.methods.city(wallet).call();
        let _age = await contract.methods.age(wallet).call();
        _age = Math.floor(_age / 86400);
        let _str = await contract.methods.strength(wallet).call();
        _str /= 100;
        let _total_material_farmed = await contract.methods.total_material_farmed(wallet).call();
        let _total_item_crafted = await contract.methods.total_item_crafted(wallet).call();
        //let _total_metSummoners = await contract.methods.total_metSummoners(wallet).call();
        let _total_metSummoners = 0;
        let _score = await contract.methods.score(wallet).call();

        //prepare text
        _text = "";
        _text += "&nbsp;&nbsp;&nbsp;";
        _text += "You are the owner of a <b><font color='#ff7f50'>";
        _text += _character;
        _text += "</font></b>, <b><font color='#ff4500'>";
        _text += _personality;
        _text += "</font></b>, but <b><font color='#ff0000'>";
        _text += _weakpoint;
        _text += "</font></b> <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b>. <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b> was born from a <b><font color='#008080 '>";
        _text += _birthplace;
        _text += "</font></b> with <b><font color='#006400'>";
        _text += _flower;
        _text += "</font></b> and currently resides on <b><font color='#8a2be2'>";
        _text += _street;
        _text += "</font></b> in <b><font color='#800080'>";
        _text += _city;
        _text += "</font></b>. At <b><font color='blue'>";
        _text += _age;
        _text += " days</font></b> old, <b><font color='#ff1493'>";
        _text += _name;
        _text += "</font></b> has earned <b><font color='blue'>";
        _text += _str;
        _text += " STR</font></b> status, farmed a total of <b><font color='blue'>";
        _text += _total_material_farmed;
        _text += " leaves</font></b>, crafted <b><font color='blue'>";
        _text += _total_item_crafted;
        _text += " items</font></b>, and made <b><font color='blue'>";
        _text += _total_metSummoners;
        _text += " friends</font></b> while strolling. The current comfort score of the <b><font color='#ff1493'>house of ";
        _text += _name;
        _text += "</font></b> is <b><font color='#ffa500'>";
        _text += _score;
        _text += "</font></b>.<br>";
    }
    
    //override html
    _target.innerHTML = _text;
}

</script>


*/


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
