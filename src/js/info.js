

//---eventMonitor

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


//---on-chain parameters
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
    if (flag_web3Loaded && typeof(wallet) != "undefined") {
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
}

//---show icon2
async function _show_icon2() {
    //if (typeof(wallet) != "undefined" && wallet != "") {
    if (flag_web3Loaded && typeof(wallet) != "undefined") {
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
        _text += _res;
        _text = '<a href="house.html">' + _text + "</a>";

        let target = document.getElementById("output_murasakiIcon");
        target.innerHTML = _text;
    } else {
        setTimeout( _show_icon2, 1000);
    }
}


async function _show_icon3() {
    //if (typeof(wallet) != "undefined" && wallet != "") {
    if (flag_web3Loaded && typeof(wallet) != "undefined") {
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
        li_summoner.sort();
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



//---introduction

async function show_murasakiInfo2() {

    //disable button
    let _button = document.getElementById("button_info")
    _button.disabled = true;
    
    //clear canvas
    let canvas = document.getElementById("canvas_status");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;

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
        let _dex = await contract.methods.dexterity(wallet).call();
        let _int = await contract.methods.intelligence(wallet).call();
        _str = Number(_str);
        _dex = Number(_dex);
        _int = Number(_int);
        _str /= 100;    // x100 point -> x1 point
        _dex /= 100;    // x100 point -> x1 point
        _int /= 100;    // x100 point -> x1 point
        let _total_coin_mined = await contract.methods.total_coin_mined(wallet).call();
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
        if (_str >= _dex && _str >= _int) {
            _text += _str;
            _text += " STR</font></b> status";
        } else if (_dex >= _str && _dex >= _int) {
            _text += _dex;
            _text += " DEX</font></b> status";
        } else {
            _text += _int;
            _text += " INT</font></b> status";
        }
        if (Number(_total_coin_mined) >= Number(_total_leaf_farmed)) {
            _text += ", mined a total of <b><font color='blue'>";
            _text += _total_coin_mined;
            _text += " coins</font></b>"; 
        } else {
            _text += ", farmed a total of <b><font color='blue'>";
            _text += _total_leaf_farmed;
            _text += " leaves</font></b>"; 
        }
        _text += ", crafted <b><font color='blue'>";
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
    
    //activate button
    _button.disabled = false;
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
    summoner = document.getElementById("input_summoner").value;
    window.location.href = "house.html?summoner=" + summoner;
}


//get info
async function get_murasakisan() {
    if (flag_web3Loaded && typeof(wallet) != "undefined") {
        let _res = await contract_murasakisan.methods.next_token().call();
        let _target = document.getElementById("output_murasakiInfo");
    } else {
        setTimeout( get_murasakisan, 1000);
    }
}


//---status


function createRoundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, Math.PI * (3/2), 0, false);
    ctx.lineTo(x + w, y + h - r);
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * (1/2), false);
    ctx.lineTo(x + r, y + h);       
    ctx.arc(x + r, y + h - r, r, Math.PI * (1/2), Math.PI, false);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * (3/2), false);
    ctx.closePath();
}

function fillRoundRect(ctx, x, y, w, h, r) {
    createRoundRectPath(ctx, x, y, w, h, r);
    ctx.fill();
}

function strokeRoundRect(ctx, x, y, w, h, r) {
    createRoundRectPath(ctx, x, y, w, h, r);
    ctx.stroke();       
}

function drawText(ctx, x, y, text1, text2, color="blue") {
    let _space = 4;
    ctx.font = "18px Arial";
    ctx.fillStyle = "#333333";
    ctx.textAlign = "right";
    ctx.fillText(text1, x-_space, y);
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.fillText(text2, x+_space, y);
}

function drawCount(ctx, x, y, text1, color="blue") {
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "right";
    ctx.fillText(text1, x, y);
}

function drawWindow(ctx, x, y, width, height, r, color="white", alpha=1) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 4;
    ctx.globalAlpha = alpha;
    fillRoundRect(ctx, x, y, width, height, r);
    ctx.globalAlpha = 1;
    strokeRoundRect(ctx, x, y, width, height, r);
}

async function drawStatus() {

    //disable button
    let _button = document.getElementById("button_status")
    _button.disabled = true;
    
    //reset introduction text
    let _target = document.getElementById("output_murasakiInfo");
    _target.innerHTML = "";
    
    if (flag_web3Loaded && typeof(wallet) != "undefined") {

        //parepare canvas, loading...
        let canvas = document.getElementById("canvas_status");
        let ctx = canvas.getContext("2d");
        canvas.width = 600;
        canvas.height = 690;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "18px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Loading...", 30, 30);

        //get summoner from input
        let _summoner = document.getElementById("input_summoner").value;
    
        //call on-chain data
        let _all_static_status = await contract_info_wss.methods.allStaticStatus(_summoner).call({from:wallet});
        let _all_dynamic_status = await contract_info_wss.methods.allDynamicStatus(_summoner).call({from:wallet});
        let _wallet = await contract_mm.methods.ownerOf(_summoner).call();

        //prepare on-chain data
        let local_level =               Number(_all_dynamic_status[2]);
        let local_exp =                 Number(_all_dynamic_status[3]);
        let local_strength =            Number(_all_dynamic_status[4])/100;
        let local_dexterity =           Number(_all_dynamic_status[5])/100;
        let local_intelligence =        Number(_all_dynamic_status[6])/100;
        let local_luck =                Number(_all_dynamic_status[7])/100;
        let local_next_exp_required =   Number(_all_dynamic_status[8]);
        let local_age =                 Number(_all_dynamic_status[1]);
        local_age = Math.floor(local_age / 86400);    //sec -> days
        let local_strength_withItems =          Number(_all_dynamic_status[35])/100;
        let local_dexterity_withItems =         Number(_all_dynamic_status[36])/100;
        let local_intelligence_withItems =      Number(_all_dynamic_status[37])/100;
        let local_luck_withItems =              Number(_all_dynamic_status[38])/100;
        let local_luck_withItems_withDice =     Number(_all_dynamic_status[42])/100;
        let local_coin =        Number(_all_dynamic_status[9]);
        let local_material =    Number(_all_dynamic_status[10]);
        let local_precious =    Number(_all_dynamic_status[30]);
        let local_score =   Number(_all_dynamic_status[34]);
        let local_practice_exp_clarinet = Number(_all_dynamic_status[69]);
        let local_practice_exp_piano = Number(_all_dynamic_status[70]);
        let local_practice_exp_violin = Number(_all_dynamic_status[71]);
        let local_stroll_total_strolledDistance = Number(_all_dynamic_status[87]);
        let local_stroll_total_metSummoners = Number(_all_dynamic_status[88]);
        let local_total_exp_gained = Number(_all_dynamic_status[23]);
        let local_total_coin_mined = Number(_all_dynamic_status[24]);
        let local_total_material_farmed = Number(_all_dynamic_status[25]);
        let local_total_item_crafted = Number(_all_dynamic_status[26]);
        let local_total_precious_received = Number(_all_dynamic_status[27]);
        let local_dapps_staking_amount =    Number(_all_dynamic_status[32]);
        let local_satiety = Number(_all_dynamic_status[28]);
        let local_happy =   Number(_all_dynamic_status[29]);
        let local_class =       Number(_all_static_status[0]);
        let local_owner =       _all_static_status[1];
        let local_name_str =    _all_static_status[2];
        let local_price =       _all_static_status[5];

        //call on-chain data individually from murasakisan contract
        let _character = await contract_murasakisan.methods.character(_wallet).call();
        let _personality = await contract_murasakisan.methods.personality(_wallet).call();
        let _weakpoint = await contract_murasakisan.methods.weakpoint(_wallet).call();
        let _name = await contract_murasakisan.methods.name(_wallet).call();
        if (_name == "") {
            _name = "#" + _summoner;
        }
        let _birthplace = await contract_murasakisan.methods.birthplace(_wallet).call();
        let _flower = await contract_murasakisan.methods.flower(_wallet).call();
        let _street = await contract_murasakisan.methods.street(_wallet).call();
        let _city = await contract_murasakisan.methods.city(_wallet).call();
        let _doing_now = await contract_murasakisan.methods.doing_now(_wallet).call();

        //call tokenURI from murasakisan contract
        let _tokenURI = await contract_murasakisan.methods.tokenURI(_summoner).call();
        _tokenURI = _tokenURI.split("base64,")[1];
        _tokenURI = atob(_tokenURI);
        _tokenURI = _tokenURI.split("base64,")[1];
        _tokenURI = _tokenURI.split('"')[0];
        _tokenURI = atob(_tokenURI);

        //clear canvas size
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //canvas.width = 600;
        //canvas.height = 660;

        //## draw window ##

        //set variants
        let _x = 10;
        let _y = 10;
        let _width = 280;
        let _height = 260;
        let _space = 10;
        let _r = 7;
        let _inside = 20;
        let _rawHeight = 20;
        let _xt;
        let _yt;
        let _color;

        //window1
        let _x1 = _x;
        let _y1 = _y;
        let _width1 = _width;
        let _height1 = 210;
        drawWindow(ctx, _x1, _y1, _width1, _height1, _r);
        strokeRoundRect(ctx, _x1, _y1+40, _width1, 0, 0);

        //text1
        _xt = _x + _width/2 -10;
        _yt = _y1 + 25;
        drawText(ctx, _xt, _yt + _rawHeight*0, "Name :", _name + "#" + _summoner, "#ff1493");
        _xt = _x + _width/2 -10;
        _yt = _y1 + 70;
        drawText(ctx, _xt, _yt + _rawHeight*0, "Flower :", _flower, "#006400");
        drawText(ctx, _xt, _yt + _rawHeight*1, "Personality :", _personality, "#006400");
        drawText(ctx, _xt, _yt + _rawHeight*2, "Character :", _character, "#006400");
        drawText(ctx, _xt, _yt + _rawHeight*3, "Weak Point :", _weakpoint, "#006400");
        drawText(ctx, _xt, _yt + _rawHeight*4, "Birth Place :", _birthplace, "#006400");
        drawText(ctx, _xt, _yt + _rawHeight*5, "Address 1 :", _street, "#006400");
        drawText(ctx, _xt, _yt + _rawHeight*6, "Address 2 :", _city, "#006400");

        //window2
        let _x2 = _x;
        let _y2 = _y + _space + _height1;
        let _width2 = _width;
        let _height2 = 345;
        drawWindow(ctx, _x2, _y2, _width2, _height2, _r);
        
        //text2
        _xt = _x + _width/2;
        _yt = _y2 + 28;
        _color = "#ff4500";
        drawText(ctx, _xt, _yt + _rawHeight*0, "Lv :", local_level, _color);
        drawText(ctx, _xt, _yt + _rawHeight*1, "Age :", local_age + " days", _color);
        drawText(ctx, _xt, _yt + _rawHeight*3, "Strength :", local_strength_withItems.toFixed(2) + " (+" + (Math.round( (local_strength_withItems - local_strength)*100 )/100).toFixed(2) + ")", _color);
        drawText(ctx, _xt, _yt + _rawHeight*4, "Dexterity :", local_dexterity_withItems.toFixed(2) + " (+" + (Math.round( (local_dexterity_withItems - local_dexterity)*100 )/100).toFixed(2) + ")", _color);
        drawText(ctx, _xt, _yt + _rawHeight*5, "Intelligence :", local_intelligence_withItems.toFixed(2) + " (+" + (Math.round( (local_intelligence_withItems - local_intelligence)*100 )/100).toFixed(2) + ")", _color);
        drawText(ctx, _xt, _yt + _rawHeight*6, "Luck :", local_luck_withItems_withDice.toFixed(2) + " (+" + (Math.round( (local_luck_withItems_withDice - local_luck)*100 )/100).toFixed(2) + ")", _color);
        drawText(ctx, _xt, _yt + _rawHeight*8, "Satiety :", local_satiety + "%", _color);
        drawText(ctx, _xt, _yt + _rawHeight*9, "Happy :", local_happy + "%", _color);
        drawText(ctx, _xt, _yt + _rawHeight*10, "Exp :", local_exp, _color);
        drawText(ctx, _xt, _yt + _rawHeight*11, "Coin :", local_coin, _color);
        drawText(ctx, _xt, _yt + _rawHeight*12, "Leaf :", local_material, _color);
        drawText(ctx, _xt, _yt + _rawHeight*13, "Fluffy Score :", local_precious, _color);
        drawText(ctx, _xt, _yt + _rawHeight*15, "Status :", _doing_now, "red", _color);

        //window3
        let _x3 = _x + _space + _width1;
        let _y3 = _y;
        let _width3 = 200;
        let _height3 = 80;
        drawWindow(ctx, _x3, _y3, _width3, _height3, _r);
        
        //text3
        _xt = _x3 + _width3/2;
        _yt = _y3 + 50;
        drawText(ctx, _xt, _yt + _rawHeight*0, "Score :", local_score, "#ffa500");
        //drawText(ctx, _xt, _yt + _rawHeight*1, "Staking :", local_dapps_staking_amount, "#ffa500");

        //window4
        let _dic_color_class = {
            "Rose":"#E60012",
            "Marigold":"#F39800",
            "Dandelion":"#FFF100",
            "Rosemary":"#8FC31F",
            "Olive":"#009944",
            "Holly":"#009E96",
            "Nemophila":"#00A0E9",
            "Hydrangea":"#0068B7",
            "Forget-me-not":"#1D2088",
            "Sumire":"#920783",
            "Gerbera":"#E4007F",
            "Anemone":"#E5004F",
        };
        let _x4 = _x3 + _space + _width3;
        let _y4 = _y;
        let _width4 = _height3;
        let _height4 = _height3;
        drawWindow(ctx, _x4, _y4, _width4, _height4, _r, _dic_color_class[_flower], 0.4);
        
        //icon_murasaki
        let _icon = new Image();
        if (local_satiety <= 20) {
            _icon.src = "src/icon/murasaki_hungry.png";
        } else if (local_happy <= 20) {
            _icon.src = "src/icon/murasaki_unhappy.png";
        } else if (local_happy >= 80 && local_satiety >= 80) {
            _icon.src = "src/icon/murasaki_happy.png";
        } else {
            _icon.src = "src/icon/murasaki_normal.png";
        }
        _icon.onload = () => {
            ctx.drawImage(_icon, _x4-6, _y4, 92.5, 80);
        }

        //window5
        let _x5 = _x3;
        let _y5 = _y3 + _height3 + _space;
        let _width5 = _width1 + _space;
        let _height5 = _height1 + _height2 - _height3;
        drawWindow(ctx, _x5, _y5, _width5, _height5, _r);
        
        //text5
        _xt = _x5 + _width5/2 + 50;
        _yt = _y5 + 35;
        drawText(ctx, _xt, _yt + _rawHeight*0, "Total Coin Mined :", local_total_coin_mined);
        drawText(ctx, _xt, _yt + _rawHeight*1, "Total Leaf Farmed :", local_total_material_farmed);
        drawText(ctx, _xt, _yt + _rawHeight*2, "Total Item Crafted :", local_total_item_crafted);        drawText(ctx, _xt, _yt + _rawHeight*3, "Total Exp Gained:", local_total_exp_gained);

        drawText(ctx, _xt, _yt + _rawHeight*4, "Total Fluffy Received :", local_total_precious_received);
        drawText(ctx, _xt, _yt + _rawHeight*6, "Total Dice Critical :", "---");
        drawText(ctx, _xt, _yt + _rawHeight*7, "Total Dice Fumble :", "---");
        drawText(ctx, _xt, _yt + _rawHeight*9, "Total Mail Sent :", "---");
        drawText(ctx, _xt, _yt + _rawHeight*10, "Total Mail Opened :", "---");
        drawText(ctx, _xt, _yt + _rawHeight*12, "Total Stroll Distance :", local_stroll_total_strolledDistance);
        drawText(ctx, _xt, _yt + _rawHeight*13, "Total Stroll Friends :", local_stroll_total_metSummoners);
        drawText(ctx, _xt, _yt + _rawHeight*15, "Clarinet Practice Lv :", local_practice_exp_clarinet);
        drawText(ctx, _xt, _yt + _rawHeight*16, "Piano Practice Lv :", local_practice_exp_piano);
        drawText(ctx, _xt, _yt + _rawHeight*17, "Violin Practice Lv :", local_practice_exp_violin);
        drawText(ctx, _xt, _yt + _rawHeight*19, "Total Festival Voted :", "---");
        
        //window6
        let _x6 = _x;
        let _y6 = _y2 + _space + _height2;
        let _width6 = _width1 + _space + _width5;
        let _height6 = 100;
        drawWindow(ctx, _x6, _y6, _width6, _height6, _r);
        
        //icon_items
        let myListLength = await contract_mc_wss.methods.myListLength(_wallet).call();
        let myListsAt = await contract_mc_wss.methods.myListsAt(_wallet, 0, myListLength).call();
        let _count = 0;
        let _count_fluffy = 0;
        let _count_fluffier = 0;
        let _count_fluffiest = 0;
        let _count_fluffyDoll = 0;
        let _dic_count_fluffy = {
            201:0,
            202:0,
            203:0,
            204:0,
            205:0,
            206:0,
            207:0,
            208:0,
            209:0,
            210:0,
            211:0,
            212:0,
            213:0,
            214:0,
            215:0,
            216:0,
            217:0,
            218:0,
            219:0,
            220:0,
            221:0,
            222:0,
            223:0,
            224:0,
            225:0,
            226:0,
            227:0,
            228:0,
            229:0,
            230:0,
            231:0,
            232:0,
            233:0,
            234:0,
            235:0,
            236:0,
            237:0,
            238:0,
            239:0,
            240:0,
            241:0,
            242:0,
            243:0,
            244:0,
            245:0,
            246:0,
            247:0,
            248:0,
        };
        //draw normal items
        //count up fluffies
        let _xi = _x6+10;
        let _yi = _y6+10;
        for (let i = 0; i < myListLength; i++) {
            let _item = myListsAt[i];
            _items = await contract_mc_wss.methods.items(_item).call();
            let _item_type = _items[0];
            if (_item_type <= 195) {
                let _item_name = dic_items_reverse[_item_type];
                let _item_png = "src/" + dic_items[_item_name]["icon_png"];
                let _img = new Image();
                _img.src = _item_png;
                _img.onload = () => {
                    ctx.drawImage(_img, _xi+30*_count, _yi, 32, 28);
                    _count += 1;
                    if (_count >= 18) {
                        _count = 0;
                        _yi += 30;
                    }
                }
            } else if (_item_type >= 201 && _item_type <= 248) {
                _dic_count_fluffy[_item_type] += 1;
            }
        }
        //draw fluffies
        for (let _fluffy_type in _dic_count_fluffy) {
            if (_dic_count_fluffy[_fluffy_type] > 0) {
                let _src;
                let _magni;
                if (_fluffy_type >= 201 && _fluffy_type <= 212) {
                    let _num = ( "00" + (_fluffy_type - 200) ).slice(-2);
                    _src = "src/icon/fluffy_" + _num + ".png";
                    _magni = 0.7;
                } else if (_fluffy_type >= 213 && _fluffy_type <= 224) {
                    let _num = ( "00" + (_fluffy_type - 212) ).slice(-2);
                    _src = "src/icon/fluffier_" + _num + ".png";
                    _magni = 0.85;
                } else if (_fluffy_type >= 225 && _fluffy_type <= 236) {
                    let _num = ( "00" + (_fluffy_type - 224) ).slice(-2);
                    _src = "src/icon/fluffiest_" + _num + ".png";
                    _magni = 1;
                } else if (_fluffy_type >= 237 && _fluffy_type <= 248) {
                    let _num = ( "00" + (_fluffy_type - 236) ).slice(-2);
                    _src = "src/icon/doll_" + _num + ".png";
                    _magni = 0.8;
                }
                let _img = new Image();
                _img.src = _src;
                _img.onload = () => {
                    ctx.drawImage(_img, _xi+30*_count, _yi, 32*_magni, 28*_magni);
                    drawCount(ctx, _xi+30*_count+24, _yi+24, _dic_count_fluffy[_fluffy_type]);
                    _count += 1;
                    if (_count >= 18) {
                        _count = 0;
                        _yi += 30;
                    }
                }
            }
        }
        
        //footer
        ctx.font = "10px Arial";
        ctx.fillStyle = "#ff1493";
        ctx.textAlign = "right";
        ctx.fillText("✿ https://murasaki-san.com", _width6, _y6+_height6-5);
        
        //enable button
        _button.disabled = false;
    } else {
        setTimeout(drawStatus, 1000);
    }
}
