

// top page animation
function create_canvas () {

    // prepare canvas
    const canvas = document.getElementById('top_animation');
    const ctx = canvas.getContext('2d');

    // set canvas size
    canvas.width = document.getElementById('top_p').offsetWidth*0.8;
    //canvas.width = window.innerWidth * devicePixelRatio *0.5;
    //canvas.width = document.body.clientWidth * devicePixelRatio *0.5;
    //canvas.height = window.innerHeight * devicePixelRatio *0.5;
    canvas.height = 64;
    
    // prepare sprite
    // https://codepen.io/redspiderfish/pen/YPVvOz

    // murasaki-san

    let _murasaki = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:0, 
        totalframes:3
    };
    
    _murasaki.img = new Image();
    _murasaki.img.src = "src/png/murasaki_left.png";
    
    // fluffy

    let _fluffy1_frame = Math.floor(Math.random()*12);
    let _fluffy2_frame = Math.floor(Math.random()*12);
    let _fluffy3_frame = Math.floor(Math.random()*12);
    
    let _fluffy1 = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:5+8*_fluffy1_frame, 
        startframe:5+8*_fluffy1_frame,
        endframe:6+8*_fluffy1_frame
    };
    let _fluffy2 = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:6+8*_fluffy2_frame, 
        startframe:5+8*_fluffy2_frame,
        endframe:6+8*_fluffy2_frame
    };
    let _fluffy3 = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:5+8*_fluffy3_frame, 
        startframe:5+8*_fluffy3_frame,
        endframe:6+8*_fluffy3_frame
    };

    let _fluffy_img = new Image();
    _fluffy_img.src = "src/png/fluffy_fluffys3.png";
    
    // ohana
    
    let _li_frame = [0,1,2,3,4,5,6,6,6,7,7,7];

    let _flower1 = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:_li_frame[Math.floor(Math.random() * _li_frame.length)]
    };
    let _flower2 = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:_li_frame[Math.floor(Math.random() * _li_frame.length)]
    };
    let _flower3 = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:_li_frame[Math.floor(Math.random() * _li_frame.length)]
    };
    let _flower4 = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:_li_frame[Math.floor(Math.random() * _li_frame.length)]
    };
    let _flower5 = {
        img:null, 
        x:0, 
        y:0, 
        width:370, 
        height:320, 
        currentframe:_li_frame[Math.floor(Math.random() * _li_frame.length)]
    };

    let _flower_img = new Image();
    _flower_img.src = "src/particle/par_flower2.png";
    
    // initiate variants
    let x = canvas.width + 5;
    let _turn = 0;
    let _turn_ohana1 = 100 + Math.floor(Math.random()*50);
    let _turn_ohana2 = _turn_ohana1 + 100;
    let _turn_ohana3 = _turn_ohana2 + 100;
    let _turn_ohana4 = _turn_ohana3 + 100;
    let _turn_ohana5 = _turn_ohana4 + 100;

    // start animation loop
    setInterval(_loop, 30);

    // animation loop function
    function _loop(){
        
        _turn += 1;
    
        // increment frame No.
        if (_turn % 20 == 0) {
        
            // murasakisan
            _murasaki.currentframe++;
            if (_murasaki.currentframe > _murasaki.totalframes){
                _murasaki.currentframe = 0;
            }
            
            // fluffy
            _fluffy1.currentframe++;
            if (_fluffy1.currentframe > _fluffy1.endframe){
                _fluffy1.currentframe = _fluffy1.startframe;
            }
            _fluffy2.currentframe++;
            if (_fluffy2.currentframe > _fluffy2.endframe){
                _fluffy2.currentframe = _fluffy2.startframe;
            }
            _fluffy3.currentframe++;
            if (_fluffy3.currentframe > _fluffy3.endframe){
                _fluffy3.currentframe = _fluffy3.startframe;
            }
        }

        // moving pos x
        x -= 0.8;
        
        // reset pos x
        if (x <= -1 * (_murasaki.width/5+60)) {
            x = canvas.width + 5;
            //_turn = 0;
        }

        // draw canvas

        // reset canvas        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw ohana
        if (_turn == _turn_ohana1) {
            _flower1.x = x+25;
        }
        if (_turn == _turn_ohana2) {
            _flower2.x = x+25;
        }
        if (_turn == _turn_ohana3) {
            _flower3.x = x+25;
        }
        if (_turn == _turn_ohana4) {
            _flower4.x = x+25;
        }
        if (_turn == _turn_ohana5) {
            _flower5.x = x+25;
        }
        if (_turn > _turn_ohana1) {
            ctx.drawImage(
                _flower_img, 
                _flower1.currentframe*_flower1.width, 
                0, 
                _flower1.width, 
                _flower1.height, 
                _flower1.x, 
                0+32, 
                _flower1.width/11, 
                _flower1.height/11
            );
        }
        if (_turn > _turn_ohana2) {
            ctx.drawImage(
                _flower_img, 
                _flower2.currentframe*_flower1.width, 
                0, 
                _flower1.width, 
                _flower1.height, 
                _flower2.x, 
                0+32, 
                _flower1.width/11, 
                _flower1.height/11
            );
        }
        if (_turn > _turn_ohana3) {
            ctx.drawImage(
                _flower_img, 
                _flower3.currentframe*_flower1.width, 
                0, 
                _flower1.width, 
                _flower1.height, 
                _flower3.x, 
                0+32, 
                _flower1.width/11, 
                _flower1.height/11
            );
        }
        if (_turn > _turn_ohana4) {
            ctx.drawImage(
                _flower_img, 
                _flower4.currentframe*_flower1.width, 
                0, 
                _flower1.width, 
                _flower1.height, 
                _flower4.x, 
                0+32, 
                _flower1.width/11, 
                _flower1.height/11
            );
        }
        if (_turn > _turn_ohana5) {
            ctx.drawImage(
                _flower_img, 
                _flower5.currentframe*_flower1.width, 
                0, 
                _flower1.width, 
                _flower1.height, 
                _flower5.x, 
                0+32, 
                _flower1.width/11, 
                _flower1.height/11
            );
        }

        // draw murasaki-san
        ctx.drawImage(
            _murasaki.img, 
            _murasaki.currentframe*_murasaki.width, 
            0, 
            _murasaki.width, 
            _murasaki.height, 
            x, 
            0, 
            _murasaki.width/5, 
            _murasaki.height/5
        );
        
        // draw fluffy1
        ctx.drawImage(
            _fluffy_img, 
            (_fluffy1.currentframe%8)*_fluffy1.width, 
            Math.floor(_fluffy1.currentframe/8)*320, 
            _fluffy1.width, 
            _fluffy1.height, 
            x+58, 
            0+30, 
            _fluffy1.width/12, 
            _fluffy1.height/12
        );

        // draw fluffy2
        ctx.drawImage(
            _fluffy_img, 
            (_fluffy2.currentframe%8)*_fluffy1.width, 
            Math.floor(_fluffy2.currentframe/8)*320, 
            _fluffy2.width, 
            _fluffy2.height, 
            x+58+20*1, 
            0+30, 
            _fluffy2.width/12, 
            _fluffy2.height/12
        );

        // draw fluffy3
        ctx.drawImage(
            _fluffy_img, 
            (_fluffy3.currentframe%8)*_fluffy1.width, 
            Math.floor(_fluffy3.currentframe/8)*320, 
            _fluffy3.width, 
            _fluffy3.height, 
            x+58+20*2, 
            0+30, 
            _fluffy3.width/12, 
            _fluffy3.height/12
        );
    }
}


//show icon2
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