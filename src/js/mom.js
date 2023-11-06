

// prep contracts
async function prep_contracts () {

    // def contracts
    
    // mah
    address_Murasaki_AuctionHouse = "0xd675daceecafC225690327d38D652eFf4EE9cA0d";
    let abi_Murasaki_AuctionHouse = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bool","name":"extended","type":"bool"}],"name":"AuctionBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"AuctionCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"AuctionExtended","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minBidIncrementPercentage","type":"uint256"}],"name":"AuctionMinBidIncrementPercentageUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reservePrice","type":"uint256"}],"name":"AuctionReservePriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"nounId","type":"uint256"},{"indexed":false,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AuctionSettled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timeBuffer","type":"uint256"}],"name":"AuctionTimeBufferUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"duration","type":"uint256"}],"name":"DurationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set0_NFTAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set0_VaultAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set0_address_Murasaki_Craft","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set0_address_Murasaki_Main","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_val","type":"uint256"}],"name":"_set_numberOfColor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_val","type":"uint256"}],"name":"_set_numberOfFlavorText","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_val","type":"uint256"}],"name":"_set_numberOfFluffy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_val","type":"uint256"}],"name":"_set_numberOfMain","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_val","type":"uint256"}],"name":"_set_numberOfOhana","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_val","type":"uint256"}],"name":"_set_numberOfPippel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"address_Murasaki_Craft","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Main","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"auction","outputs":[{"internalType":"uint256","name":"nounId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"addresspayable","name":"bidder","type":"address"},{"internalType":"bool","name":"settled","type":"bool"},{"internalType":"string","name":"userMsg","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"auctionLogs","outputs":[{"internalType":"uint256","name":"nounId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"addresspayable","name":"bidder","type":"address"},{"internalType":"bool","name":"settled","type":"bool"},{"internalType":"string","name":"userMsg","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bidCounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"bidLogs","outputs":[{"internalType":"uint256","name":"bidTime","type":"uint256"},{"internalType":"address","name":"bidder","type":"address"},{"internalType":"uint256","name":"bidAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"call_bidLog","outputs":[{"internalType":"uint256[10]","name":"","type":"uint256[10]"},{"internalType":"address[10]","name":"","type":"address[10]"},{"internalType":"uint256[10]","name":"","type":"uint256[10]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"nounId","type":"uint256"},{"internalType":"string","name":"_userMsg","type":"string"}],"name":"createBid","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"duration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minBidIncrementPercentage","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nouns","outputs":[{"internalType":"contractMurasaki_Memento","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfColor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfFlavorText","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfFluffy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfMain","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfOhana","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfPippel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reservePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"setDuration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"_minBidIncrementPercentage","type":"uint8"}],"name":"setMinBidIncrementPercentage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reservePrice","type":"uint256"}],"name":"setReservePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timeBuffer","type":"uint256"}],"name":"setTimeBuffer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"settleAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"settleCurrentAndCreateNewAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"start_firstAuction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"timeBuffer","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAuctionAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_summoner","type":"uint256"}],"name":"update_salt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vault_address","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"weth","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
    contract_mah = await new web3.eth.Contract(abi_Murasaki_AuctionHouse, address_Murasaki_AuctionHouse);

    // mom
    address_Murasaki_Memento = "0x20f18BeDd45a6d6631D3a92ac501d03a51Ac9D18";
    let abi_Murasaki_Memento = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"NFTSeed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_add_permitted_address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"_get_blockNumberString","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_remove_permitted_address","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_codex","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_codex","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"blockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"blockNumberString","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"colorId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"flavorText","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"flavorTextId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"fluffyId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"mainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_colorId","type":"uint256"},{"internalType":"uint256","name":"_mainId","type":"uint256"},{"internalType":"uint256","name":"_ohanaId","type":"uint256"},{"internalType":"uint256","name":"_pippelId","type":"uint256"},{"internalType":"uint256","name":"_fluffyId","type":"uint256"},{"internalType":"uint256","name":"_NFTSeed","type":"uint256"},{"internalType":"string","name":"_userMsg","type":"string"},{"internalType":"address","name":"_wallet","type":"address"},{"internalType":"uint256","name":"_flavorTextId","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"mintDate","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"mintTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"myListLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"count","type":"uint256"}],"name":"myListsAt","outputs":[{"internalType":"uint256[]","name":"rIds","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"next_nft","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nfts","outputs":[{"internalType":"uint256","name":"colorId","type":"uint256"},{"internalType":"uint256","name":"mainId","type":"uint256"},{"internalType":"uint256","name":"ohanaId","type":"uint256"},{"internalType":"uint256","name":"pippelId","type":"uint256"},{"internalType":"uint256","name":"fluffyId","type":"uint256"},{"internalType":"uint256","name":"NFTSeed","type":"uint256"},{"internalType":"uint256","name":"mintTime","type":"uint256"},{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"string","name":"mintDate","type":"string"},{"internalType":"string","name":"tokenId","type":"string"},{"internalType":"string","name":"userMsg","type":"string"},{"internalType":"string","name":"blockNumberString","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ohanaId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"pippelId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenId","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"userMsg","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];
    contract_mom = await new web3.eth.Contract(abi_Murasaki_Memento, address_Murasaki_Memento);

    // momc
    address_Murasaki_Memento_Codex = "0xE3F8B20FF46d273541CC3512C76d35F07EB48F3d";
    let abi_Murasaki_Memento_Codex = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_flavorText","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_01","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_02","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_03","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_04","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_05","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_06","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_07","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_08","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"_set_address_Murasaki_Memento_mainPng_09","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_flavorText","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_01","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_02","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_03","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_04","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_05","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_06","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_07","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_08","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"address_Murasaki_Memento_mainPng_09","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    contract_momc = await new web3.eth.Contract(abi_Murasaki_Memento_Codex, address_Murasaki_Memento_Codex);

    // address, codex
    address_Murasaki_Memento_mainPng_01 = "0x71c91F52135afdff323795dbe3Cb34BfC38654f6";
    address_Murasaki_Memento_mainPng_02 = "0xdCCCd34d80f4CbeB34c5f58Ff34a1786525Ef4B1";
    address_Murasaki_Memento_mainPng_03 = "0xB930d720F57924345B49894283b7fD1eA9850381";
    address_Murasaki_Memento_mainPng_04 = "0xDcDc90a7776EF123e2d47bFc9D091D818f8ed8eC";
    address_Murasaki_Memento_mainPng_05 = "0x07A44EaAaF3745cA6fECe7071ABe38c885b2D2d7";
    address_Murasaki_Memento_mainPng_06 = "0x9552409fF6C4c3B1CddAB2DA6f2ac9892d50F47c";

    // address flavor text
    address_Murasaki_Memento_flavorText = "0x8A4a5F713E8070730270232Bc0Ef5aD209964fDc";
}



// init at load
async function init_auctionContracts () {

    if (flag_web3Loaded && typeof(wallet) != "undefined") {

        // prep contra
        await prep_contracts();

        // check auction settle
        let _auction = await call_auction();
        
        // when under auction
        let _date = new Date();
        let _unix = Math.round(_date.getTime()/1000);
        let _endTime = Number(_auction.endTime);
        if (_endTime >= _unix) {
        
            // show minimum bid and current bid
            let {_currentBid, _minimumBid} = await calc_bidPrice();
            document.getElementById("bidAmount").placeholder = "≥" + _minimumBid;
            currentBid.innerHTML = _currentBid;
            
            // show default user msg
            document.getElementById("userMsg").value="&#x273f; Memento of Murasaki-san, built on Astar.";
            
            // show end timer
            show_endTime();
        
            // show svg with on-chain text
            show_unrevealedSvg_with_onChainText();

        // when auction finished
        // rewrite span and update info
        } else {
        
            // _update_html_to_endTheAuction
            _update_html_to_endTheAuction();

        }

        // show total auction volume
        show_totalAuctionVolume();
                
        // show tokenId
        show_tokenId();
        
        // show bid log
        show_bidLog();
        
        // show user NFT
        await show_userNFT();

        // show random NFT
        await show_randomNFT();
        
    } else {
        setTimeout(init_auctionContracts, 1000);
    }
}


// update html when end the auction
async function _update_html_to_endTheAuction() {

    // update html
    let _html = "";
    _html += '<font size="+2"><b>Memento of Murasaki-san #<span id="tokenId">-</span></b></font><br>';
    _html += '<br>';
    _html += '&#128718; Final Bid:&nbsp;&nbsp;<b><font color="blue"><span id="currentBid">---</span> $ASTR</font></b><br>';
    _html += '&#x1F389; The Winner:&nbsp;&nbsp;<b><span id="winner">---</span></b><br>';
    _html += '<br>';
    _html += '<button onclick="button_conclude();" style="background-color:#FF4F6F"><b>&#x273d; Conclude the Auction &#x273d;</b></button><br>';
    _html += '<font size="-1">Reveal and send the NFT to the winner,<br>and a new auction will commence.<br>';
    _html += '</font>';
    document.getElementById("auctionInfo").innerHTML = _html;

    // show current bid
    let {_currentBid, _minimumBid} = await calc_bidPrice();
    currentBid.innerHTML = _currentBid;

    // show winner
    show_winner();

    // show svg with on-chain text
    show_unrevealedSvg_with_onChainText_finished();

    // update twemoji            
    twemoji.parse(document.body);
}


// send, create bid
async function createBid (_momId, _userMsg, _price) {
    _price = (_price).toString();   // ETH
    _price = web3.utils.toWei(_price);
    await contract_mah.methods.createBid(_momId, _userMsg).send({from: wallet, value: _price});
}

// call, current auction info
async function call_auction () {
    let _auction = await contract_mah.methods.auction().call();
    return _auction;
    // usage: Number(_auction.startTime)
}

// call, bid log
async function call_bidLog (_momId) {
    let _bidLog = await contract_mah.methods.call_bidLog(_momId).call();
    return _bidLog;
    // usage: Number(_bidLog.bidTime)
}

// call, total auction amount
async function call_totalAuctionAmount() {
    let _res = await contract_mah.methods.totalAuctionAmount().call();
    _res = web3.utils.fromWei(_res, "ether");
    _res = Math.round(_res*100)/100;
    return Number(_res);
}

// call, token svg from tokenId
async function call_tokenURI (_tokenId) {
    let _url = await contract_mom.methods.tokenURI(_tokenId).call();
    return _url;
}

// call, total token number
async function call_totalTokenNumber() {
    let _next_nft = await contract_mom.methods.next_nft().call();
    return Number(_next_nft) - 1;
}

// call, user token list
async function call_userTokenList (_wallet) {
    let myListLength = await contract_mom.methods.myListLength(_wallet).call();
    let myListsAt = await contract_mom.methods.myListsAt(_wallet, 0, myListLength).call();
    return myListsAt;
}


// button, bid
async function button_bid() {
    let _momId = await call_totalTokenNumber();
    _momId += 1;
    let _price = document.getElementById("bidAmount").value;
    let _userMsg = document.getElementById("userMsg").value;
    createBid(_momId, _userMsg, _price);
}

// calc minimum bid price
async function calc_bidPrice() {
    let _auction = await call_auction();
    let _currentBid = Number(_auction.amount);
    let _minimumBid = 0;
    if (_currentBid == 0) {
        _currentBid = "---";
        _minimumBid = 20;
    } else {
        _minimumBid = _currentBid * 1.05;
        _minimumBid = web3.utils.fromWei((_minimumBid).toString(), "ether");
        _minimumBid = Math.round(_minimumBid*100)/100;
        _currentBid = web3.utils.fromWei((_currentBid).toString(), "ether");
        _currentBid = Math.round(_currentBid*100)/100;
        _currentBid = _currentBid.toFixed(2)
    }
    return {_currentBid, _minimumBid};
}


// total auction volume
async function show_totalAuctionVolume() {
    let _volume = await call_totalAuctionAmount();
    totalAuctionVolume.innerHTML = _volume;
}


// show end time
async function show_endTime() {

    // clear old timer
    try {
        clearTimeout(endTimerNow);
    } catch(e){
    }

    let _auction = await call_auction();
    let _endTime = Number(_auction.endTime);
    
    /*
    let _date = new Date();
    let _unix = Math.round(_date.getTime()/1000);
    let _deltaSec = _endTime - _unix;
    endTimer(_deltaSec);
    */
    
    endTimer2(_endTime);
}


// timer
function endTimer(_deltaSec) {
    let _hour = Math.floor(_deltaSec / 3600);
    let _min = Math.floor(_deltaSec % 3600 / 60);
    let _sec = _deltaSec % 60;
    let _txt = _hour + "h " + _min + "m " + _sec + "s";
    endTime.innerHTML = _txt;
    endTimerNow = setTimeout( () => {endTimer(_deltaSec-1)}, 1000);
}

// timer2
function endTimer2(_endTime) {

    // get unix now time
    let _date = new Date();
    let _unix = Math.round(_date.getTime()/1000);
    
    // calc delta sec
    let _deltaSec = _endTime - _unix;

    // prepare text
    let _hour = Math.floor(_deltaSec / 3600);
    let _min = Math.floor(_deltaSec % 3600 / 60);
    let _sec = _deltaSec % 60;
    let _txt = _hour + "h " + _min + "m " + _sec + "s";
    
    // color
    if (_deltaSec <= 300) { //***TODO*** 5min -> 1hr
        _txt = '<font color="red">' + _txt + '</font>';
    }
    
    // check end auction
    if (_deltaSec <= 0) {
        _update_html_to_endTheAuction();
    }

    // update timer text
    endTime.innerHTML = _txt;
    
    // loop
    endTimerNow = setTimeout( () => {endTimer2(_endTime)}, 1000);
}


// show token id
async function show_tokenId() {
    let _auction = await call_auction();
    let _tokenId = Number(_auction.nounId);
    tokenId.innerHTML = _tokenId;
}


// show bid log
async function show_bidLog() {

    // date -> "2023/10/31 05:04"
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    // wallet to summoner name
    async function wallet2summonerNmae (_wallet) {
        let _murasakiNameId = await contract_mn.methods.tokenOf(_wallet).call();
        _murasakiNameId = Number(_murasakiNameId);
        let _murasakiName = "";
        if (_murasakiNameId > 0) {
            _murasakiName = await contract_mn.methods.names(1).call();
        }
        return _murasakiName;
    }
    
    // wallet -> shorter wallet
    async function formatWallet(_address) {
        let _bidder = "";
        let _summonerName = await wallet2summonerNmae(_address);
        if (_summonerName != "") {
            _bidder = _summonerName;
        } else {
            let _hash1 = _address.substring(0,4);
            let _hash2 = _address.slice(-4);
            let _txt = _hash1 + "..." + _hash2;
            _bidder = _txt;
        }
        return _bidder;
    }

    // call tokenId
    let _auction = await call_auction();
    let _tokenId = Number(_auction.nounId);
    
    // call bidlogs
    let _bidlog = await contract_mah.methods.call_bidLog(_tokenId).call();
    
    // prepare html
    let _html = "";
    for (i=0; i<10; i++) {
    
        // prepare time
        let _bidTime = _bidlog[0][i];
        let timeZoneOffset = new Date().getTimezoneOffset() * 60000;
        _bidTime = new Date(_bidTime * 1000 + timeZoneOffset);
        _bidTime = formatDate(_bidTime);
        
        // prepare amount
        let _bidAmount = _bidlog[2][i];
        _bidAmount = web3.utils.fromWei((_bidAmount).toString(), "ether");
        _bidAmount = Math.round(_bidAmount*100)/100;
        _bidAmount = _bidAmount.toFixed(2);

        // when time=0, break
        if (_bidAmount == "0.00") {
            break;
        }
        
        // prepare bidder
        let _bidder = _bidlog[1][i];
        _bidder = await formatWallet(_bidder);
        
        let _htmlCurrent = "";
        _htmlCurrent += "<tr>";
        _htmlCurrent += '<td class="cell1">' + _bidTime + "</td>";
        _htmlCurrent += '<td class="cell2">' + _bidder + "</td>";
        _htmlCurrent += '<td class="cell3"><b>' + _bidAmount + "&nbsp;&nbsp;$ASTR" + "</b></td>";
        _htmlCurrent += "</tr>";
        
        // add into html
        _html = _htmlCurrent + _html;
    }
    _html = "<table>" + _html + "</table>";
    
    // insert html
    let _target = document.getElementById("bidLog");
    _target.innerHTML = _html;
}



// show svg
async function show_unrevealedSvg_with_inputText() {

    // get user msg from input
    let _userMsg = document.getElementById("userMsg").value;

    // when input empty, reset msg
    if (_userMsg.length == 0) {
        document.getElementById("userMsg").value="&#x273f; Memento of Murasaki-san, built on Astar.";
    }
    
    // show svg
    show_unrevealedSvg(_userMsg);
}

async function show_unrevealedSvg_with_onChainText() {

    // call onChain auction msg
    let _auction = await call_auction();
    _userMsg = _auction.userMsg;
    
    // show svg
    show_unrevealedSvg(_userMsg);
}


async function show_unrevealedSvg_with_onChainText_finished() {

    // call onChain auction msg
    let _auction = await call_auction();
    _userMsg = _auction.userMsg;
    
    // show svg
    show_unrevealedSvg(_userMsg, true);
}


async function show_unrevealedSvg(_userMsg, flag_finished=false) {

    // check emtpy userMsg
    if (_userMsg.length == 0) {
        _userMsg = "&#x273f; Memento of Murasaki-san, built on Astar.";
    }

    // prepare id
    let _auction = await call_auction();
    let _tokenId = Number(_auction.nounId);
    
    // prepare date
    // date -> "2023.10.25"
    function formatDate2(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1);
        const day = String(date.getDate());
        return `${year}.${month}.${day}`;
    }
    let _endTime = _auction.endTime;
    let timeZoneOffset = new Date().getTimezoneOffset() * 60000;
    _endTime = new Date(_endTime * 1000 + timeZoneOffset);
    _endTime = formatDate2(_endTime);
    

    let _html = "";
    _html += '<svg width="256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128"><rect width="128" height="128" fill="#fff" rx="12" ry="12"/><g fill="#222" fill-opacity=".1" transform="translate(64 64)"><path id="b" d="M64-4A64 64 0 0 0-47.8-42l-.2.4A63.8 63.8 0 0 0-63 9.6v.2a78.6 78.6 0 0 0 1.2 6.1 64 64 0 0 0 126-20zM50.1-3a48 48 0 0 1-.8 12.6 50.7 50.7 0 0 0-21.9-24.1c1.8-19.2-4.8-27.3-12.2-28.7A10.7 10.7 0 1 0 13.4-22v2a57.3 57.3 0 0 0-25.5-.6c.7-6.5 3.2-13.8 7.9-19A21.9 21.9 0 0 1 19-46 50.1 50.1 0 0 1 50-3h.1zM5.5 6.7A45 45 0 0 1 0 13.2c-3-3.3-5.7-7-7.7-10.9l-.3-.6a45.6 45.6 0 0 1-2.9-8c4.6-1 9-1.5 13.3-1.2h.7c2.7.2 5.4.7 8.9 1.5A47.6 47.6 0 0 1 6 6.7zm-21.9-53.6a50.7 50.7 0 0 0-9.9 31C-43.8-7.7-47.5 2-45 9.1l.3.5a10.7 10.7 0 1 0 19-9.6l1.8-1a57.2 57.2 0 0 0 12.1 22.3c-6 2.6-13.5 4.1-20.5 2.7a22 22 0 0 1-17-16.7 49.6 49.6 0 0 1 33-54.3zm20 97.1a49.8 49.8 0 0 1-36-12A50.6 50.6 0 0 0-.6 31.3c15.8 11 26.1 9.4 31 3.7a10.7 10.7 0 1 0-16.7-13.4l-.8 1.3-1.8-1A57.1 57.1 0 0 0 24.4.1 35.3 35.3 0 0 1 37 16.5a22 22 0 0 1-6 23.1A49.7 49.7 0 0 1 3.7 50.3z"/><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" from="360 0 0" to="0 0 0" dur="60s" additive="sum"/></g><g><rect width="128" height="128" rx="12" ry="12" fill-opacity=".6"/><animate attributeName="fill" values="#E60012;#F39800;#2f34d3;#8FC31F;#009944;#009E96;#00A0E9;#0068B7;#1D2088;#920783;#E4007F;#E5004F;#E60012" keyTimes="0.00;0.08;0.17;0.25;0.33;0.42;0.50;0.58;0.67;0.75;0.83;0.92;1.00" dur="60s" repeatCount="indefinite"/></g><rect x="10" y="10" width="108" height="108" fill="#fff" rx="10" ry="10" fill-opacity=".3"/><path d="M111 8q9 0 9 9v94q0 9-9 9H17q-9 0-9-9V17q0-9 9-9Z" fill="none" id="a"/><text text-rendering="optimizeSpeed" fill="#fff" font-family="arial" font-size="9" font-weight="bold" fill-opacity=".8"> <textPath startOffset="0%" xlink:href="#a">';
    _html += _userMsg;
    _html += '<animate additive="sum" attributeName="startOffset" from="100%" to="0%" begin="0s" dur="20s" repeatCount="indefinite"/> </textPath> <textPath startOffset="-100%" xlink:href="#a">';
    _html += _userMsg;
    _html += '<animate additive="sum" attributeName="startOffset" from="100%" to="0%" begin="0s" dur="20s" repeatCount="indefinite"/> </textPath> </text><g font-family="arial" font-weight="bold" fill-opacity=".6" stroke-opacity=".6"><text x="14" y="23" font-size="14">';
    _html += "#" + _tokenId,
    _html += '</text><text x="114" y="21" font-size="10" text-anchor="end">';
    _html += _endTime;
    _html += '</text><text x="108" y="117" font-size="2.5" text-anchor="end">Character and other misc. will be revealed at the conclusion of the auction</text><animate attributeName="fill" values="#E60012;#F39800;#2f34d3;#8FC31F;#009944;#009E96;#00A0E9;#0068B7;#1D2088;#920783;#E4007F;#E5004F;#E60012" keyTimes="0.00;0.08;0.17;0.25;0.33;0.42;0.50;0.58;0.67;0.75;0.83;0.92;1.00" dur="60s" repeatCount="indefinite"/></g><g><use xlink:href="#b" transform="matrix(.005 0 0 .005 108.5 116.8)" fill="#222"/><animate attributeName="fill-opacity" values="0.3;0.3;0;0;0.3" keyTimes="0;0.5;0.5;1;1" dur="3s" repeatCount="indefinite"/></g><g transform="translate(0 5)"><g><image width="28" height="28" x="64" y="28" transform="translate(-14 -14)" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAB5CAMAAADLY6lvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKaUExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXVVVVU5OTltbW1VVVVBQUFpaWlVVVVFRUVlZWVVVVVVVVVhYTlVVVVJSUlhYT1VVVVJSUlhYUFVVVVNTU1dXUFVVVVNTU1dXUVVVVVNTU1VVVVNZU1FXUVVVVVNZU1VVVVJXUlVVVVNYU1JXUlVVVVNYU1JXUlVVVVRYVFJWUlVVVVJWUlVVVVJWUlRYVFNWU1VVUVRXVFNWU1VVUVRXVFNWU1VVUlRXVFNWU1RXVFNWU1VVUlRXVFRXVFNWU1VVUlRXVFVVUlNWU1VVUlRXVFNWU1VVUlRXVFNWU1NWU1VVU1RXVFNWU1VVU1RXVFVVU1RXUlNWU1VVU1NWU1VVU1RWVFVVU1RWUlRWVFVVU1RWUlRWVFVVU1RWUlRWVFVVU1RWUlNXU1RWVFRWUlRWVFRWU1RWVFNXU1RWU1RWVFNXU1RWU1RWVFNXU1RWVFNXU1RWU1RWUlNXU1RWU1RWUlNXU1NXU1RWU1RWUlNXU1RWU1RWUlNXU1RWU1RWUlNXU1RWUlRWU1RWU1VWU1VWU1RWVFVWU1RVU1RWVFVWU1RVU1RWVFVWU1RWVFVWU1RVU1RWVFVWU1RVU1RWUlVWU1RVU1RWUlRVU1RWUlVWU1RWUlVWU1RWU1VWU1RVU1RWU1VWU1RVU1RWU1RWU1NWU1RXU1NWU1RXU1RWU1NWU1RXU1NWU1RXU1RWU1NWU1RWU1RWVFRWVFRWU1RWU1RWUlRWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU2dpZo+GhLWmouPIweXBqPvK0f/I1v/X0//f0jEw/gQAAADUdFJOUwABAgMEBQYHCAkKCwwNDg8QERITFBUYGhscHR4fICEiIyQlJicoKissLS4wMjM0NTY3ODk6Ozw+P0FDREVGR0hJSktMTU9QUVJVVldYWlxdXl9gYWJlZmdoaWpsbW5vcXJ0dXZ3eHl6e3x9fn+Bg4WGiImKi4yNjo+QkpOUlZaXmJmcnZ6foKGio6Slp6mqrK+xsrO0tba3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"/><animateTransform attributeName="transform" type="rotate" from="360 64 64" to="0 64 64" dur="30s" repeatCount="indefinite" additive="sum"/></g><g><image width="28" height="28" x="64" y="28" transform="translate(-14 -14)" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAACjCAMAAABytvoxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKCUExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXU5OTltbW1VVVVBQUFpaWlVVVVFRUVlZWVVVVVFRUVlZTlVVVVhYTlVVVVJSUlhYT1VVVVJSUlhYUFVVVVNTU1dXUFVVVVNTU1dXUVNTU1NZU1NZU1FXUVVVVVJXUlVVVVJXUlVVVVNYU1JXUlVVVVJWUlVVVVRYVFJWUlVVVVRYVFJWUlVVUVRYVFNWU1VVUVRXVFNWU1VVUVNWU1VVUlNWU1VVUlRXVFNWU1NWU1RXVFNWU1VVUlRXVFNWU1VVUlRXVFNWU1NWU1RXVFNWU1NWU1VVU1VVU1RXUlNWU1VVU1RWVFRWUlRWVFVVU1RWUlRWVFVVU1RWUlRWVFNXU1RWUlRWVFNXU1NXU1RWU1RWVFRWU1NXU1RWU1RWVFNXU1RWU1NXU1RWU1NXU1RWUlNXU1RWU1NXU1RWU1RWUlRWU1RWUlRWU1RWUlNXU1RWU1RWUlNXU1RWU1RWU1RWVFVWU1VWU1RVU1RWVFVWU1RVU1RWVFVWU1RVU1VWU1RVU1RWVFVWU1RVU1RWVFVWU1RVU1RWUlVWU1RVU1VWU1RVU1RWUlVWU1RVU1RWUlVWU1RVU1RWU1VWU1RVU1RVU1VWU1RVU1RWU1NWU1RXU1RWU1NWU1RXU1RWU1NWU1RXU1RWU1RXU1NWU1RWU1RWVFRWU1RWU1RWVFRWU1RWU1RWUlRWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU2dpZndHT4+GhJKvpbHAxrWmoro2RNbZ1uPIwfYkJ/vK0f/X0yp9y40AAADJdFJOUwABAgMEBQYHCAkKCw0ODxAREhMUFRYXGBobHB0eHyAhIiMkJSYoKy4vMDIzNTY3ODk7PD0+P0BBQkNERUZHSEpLTU5PUFNVVldYWVpbX2JkZWtsb3BxcnR2d3t8fX5/gIGCg4SHiImLjY6PkJGTlJaYmZqcnZ6goaOkpaanqKmqq6yvsLGys7S1tri5uru8vb6/wMHCxMXGx8jJysvMzc7R09TV1tfY2drb3N3e4OLj5ebn6Onq6+zt7u/w8fL09fb3+Pn6+/z9/utbUIkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAmrSURBVHhe7Zv7m1VVGccPg0JBaVwqB1CToduAUCTKxURFJzCsyCioqLRSvGRJaWWZaKhoBMRFLoFBgmEaVNIk95lAZtY5+8yZGeD/6f2+6923c/Y5Z102P3k+zwPPnr33+n7X+653rb3PPvsUWrRo0aLF+5IJnR+TrTzpmNMpW3WZ/tyb6u0VeZtP+8l/Vc/eO+WvTK56/n8KbJe/c+LT/2bV02vHyI5aug7zKUqd+5bsyYURvxVZtf7zsquarl45Q6n9sisXRr0rqhT4AtmXpouTXSwH9H//XNmZB19j2XIR8mdulZ0JRnSdxaFgYGAA5zwou/NgBekVBwbE+zbZG7P4HA7AeaBMGztkdx4cCYWRT3V6oewOuSeK+fJYl1lZe98h+zXjuRK0M1vv+6Ac8WcB1RDlm2HvQx+SI2D8roSzHuzZcsif+0kttNbeGz4shwqFiWlntq43A+05lNJm742R90r8GXUsZ+vrjpKaHmqG63zzVSNBYdl7cK46ep+09OYuiIsww97H3yWOvXAe2wlnTsoGaenNYhJLWVfYOyYeDAIlnpv13mp1WVtCqo7Rntys/0JiyZQSCe9i2jlX67FvkFiVNTlogirjfK3nIzTRNQDWf5Cmvsyzs67Q6ac6pK0nltYDdPo7U6StJ7bWVIEHx0lbTxys1XRp68ntltZYzp6Rtp5sIamaKdQAlPjfx0tjP7aRVM20bgSdr5ZLYz+srZHxF66Q1j6M3WdrjYyrWdLch1mkY1NlBGr8cWnuw0x7a2S8O76FcsbBGhnvu0Xae7CcdGzmFkDYP5L2Hqw3sk7XIawfHiEC7qStg6AiW0noziHVO2T8TP3Pw6akrCmcrHFHlMm4Yd2bszWmTcYcr9lNOy6HdUbGkYzU7nysH4P10PDw8BBJkkdqUEMCvjmks4ZwVl7WN8KanLV3OdOZGRq+eOnSRT4LV5DIetE9n5ItW2hJKQZQHR5mB4ZuRYvFoJxK8tDwJeIidzCynvTw4T514nG3ida2E9YkmrTG4FJSkyngoAkZF7X9Smrc/rpSpZI6/RmtZcu2DGsKW/+LoYGGM0eNasRqNumAUoMXLpTU17WULd+m6Co82NqjHvFY8xq+oFCYfFCVLhCD6i3RsoQ+AlDYusoagmnAZyHo964utD2jncn69I0iZseEf5BS/cKuBSOt+tct+w5nG5RcP3F/E1IZa1gd2Fmjg0bYB0XLklk9pGIcNgaaqprqOgqarF8XLVtswkbMJbYshSM9SL04IFK2jP0X6RndqeBztzaGITbg29+3db5IWfMNhN085bTEhUkeRAuyJ+PzOxZN+IAI2TNqnYE3PxXWIcOZB5v4xV2jRMWNmcehEqTXryQccGRMWaZx1t7n1jw0yesihgeGBF0zKumLBlEpYz2nMPUga8fImujftbpddOwZ8VOKiEuVKQZBQAmo4FkKh4ujOmA6Rc8sSTgdwMapR12He3SPLh8UTjiIMZEvG2Obq0xDf/P+vY435m0/j9cHghLAfaAcE+E+7pL+K9U76cvxJ9zqbTJd/qSIMkBHYhtxLkYrKhqiY298TtTsaH+6X0TSRBVA41+U9UvvCPTzzP339sgglNTJJ0eKnBVtn/w1HgKjiJBlWALsIlu+dZCgKbkwDeSZ4h8X/0m6XFL9y0TNkrYvQilNEbdo4WwnJ/IgZ8SPlVd793xps8Stzn5BtKx5jYTIKUF6jmOiUSIC6sQgL/o65z1f7WPvQfWiU8LBRlhrlzqgtIqU+hLFzslgby4TWO9wfs5xBws3hFa2MqxpYHUnE3U+qM5cI0rWzO5tas0EZK0zzn8IJarxR50/+h4khbqXkJgApV4Kz0w8PFenrhUla2yso7BT3o+JkjW/ocYGd2lIOMIOT+VLuaZvkUjZ8mVqbGBNi4teWqIMiffuPeeWiJQtS6m5SZ3RvGbv+FO3TvrZdeNdp9fdNENNSzyV8mjA144WKWsOk7VBnVVkOU8VpU762o+LlC2G1mHYcZUD7X3iZtGyBNbV92ZZUHprw5akn3C7X4G16DSGwtaVlpoQ4u30HoWxNV83sGxXnc7eJx28bzhmbE3XEbKhW4mq0uAB32r/SoHpvBb4Rrm6Ktn7RWtvWBusZjHkUzMhOOc/EEVjrK2zHrTxrUvvPJE0xd46C67zTZZXbnza9bfm4T67VDQNyfwq2wGE3T1RRM0wvFVoCj9w+b6ImpGXNYd9SETNyM0aYZ/PeH2sPrlZc9hWbyHmZ82jbXP5zM+aw/6xyJpA1uHluhwY3TPUBWH/2eJGDdbSlHptcSGphTM+U3SbM/NM5IcFycuaM27+rPrO2A8N/ZZUdP5nItycKmu/goP1ehFuTmyNkfLLN0u4WPsPNb8x5Gtd/8lpQ3KwpsS51ZuHtRg6T3Bva+eC80m4tk7Eb4ePta6ueMsSn8mlDZ3XFki8LMLNydUaDWtfNa8HW/NF098a+ba4fCzE6ewDa11crtZQeNXiY0B0H+5vjXarRNaE6AYJ1nrUHa0hcMTmiWl+1mj2XVE1IrKO1zB0wt4arf75UVE1oo61/WqGoF8RUSPm4FcW+o6U2mprpzUc/e29SVSNWBXbwJo74WLNc9p8ESXao5+eJKrLxRpBK6svf76XcImsOX67OuOg1X+a/jQtpu1VahBWVGwYd8IUtCC6zd8snoHzxSSRZmtrTjfoniHKTYF1mO/ElLK15nTzN96q+xMi3YyENT8DEj9ba5xPMhz7U4bfak87ISbyVYabNYeL81nE9FU0vK6NL+zRhqCtINC/bWtonXqIzc7xNc/0C6C70SyLsAIi8HVnUIyIe8bdltOxvXusaDfhyjVomEFyXvPrCxxbgvC4LjFJA25J1fWi3Ywr1vCP9DKgyBj90kQNoTWOxv3EEVPrwsgZK1euXIFf3mDQ8YJGwirbFd2KrmyU40SGcNDYmvkIfloWKWQGigGOvuhOlhm/VCIg+z2TRdSMyRCPFarcORtyoDEos9+JpiGwrq5ppJ4CTQbVDH4s/ohoGpJl7QCCPmb5i5yahDvBM3y1SJoy7m1q5Bs2O+/Ba65W3IdmPt5Sl0ctbhaECQfYO7U2WxBOiKOfFT0b8CowQVNX1KqoYDrz1YXgua2hv2gecFul3nF7kbj9r9K++nVpuWrI0Ua86fgKc+Ga7fzbUAbTmTFx1Lz11JI2UXJgwRa84unC3/Z+xf0NS82UBzbh17oZHN9EvDx3DngW28IPsePmHH6CQ1y78Pc7xU7z0vO/6uzsnCqHLzNjpnUs/SWzampHh/9PXFq0aNGihTOFwv8B0uTdT0KsqAkAAAAASUVORK5CYII="/><animateTransform attributeName="transform" type="rotate" from="300 64 64" to="-60 64 64" dur="30s" repeatCount="indefinite" additive="sum"/></g><g><image width="28" height="28" x="64" y="28" transform="translate(-14 -14)" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABnCAMAAAAAL11kAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJPUExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXU5OTltbW1VVVVBQUFpaWlVVVVFRUVlZWVlZTlJSUlhYTlVVVVhYT1VVVVhYUFVVVVNTU1dXUFNTU1dXUVVVVVNTU1dXUVVVVVNZU1NZU1FXUVVVVVNYU1JXUlVVVVNYU1JXUlJXUlRYVFJWUlVVVVRYVFJWUlVVUVVVUVRXVFVVUVVVUlRXVFNWU1VVUlRXVFVVUlRXVFVVUlNWU1VVUlNWU1RXVFVVUlNWU1RXVFNWU1VVU1RXVFNWU1VVU1NWU1VVU1RXUlVVU1RWUlRWVFVVU1RWUlRWVFVVU1RWUlVVU1RWUlRWVFNXU1RWUlRWVFNXU1RWVFNXU1RWU1RWVFNXU1RWVFNXU1RWVFNXU1RWU1RWVFNXU1RWUlNXU1RWU1RWUlNXU1RWU1RWUlRWU1RWUlNXU1RWU1RWUlNXU1RWU1RWVFRVU1RWVFRVU1RWVFVWU1RVU1VWU1RVU1RWVFVWU1RVU1VWU1VWU1RVU1RWUlVWU1RWUlVWU1RVU1RWUlVWU1RVU1RWU1VWU1RWU1VWU1RVU1RWU1NWU1RXU1RWU1RXU1RWU1NWU1RXU1RWU1NWU1RXU1RWU1NWU1RWU1RWU1RWVFRWU1RWVFRWU1RWU1RWUlRWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU1RWU2dpZndHT4+GhLHAxrWmoro2RMeGkNbZ1uXBqP9SgNxSmtkAAAC6dFJOUwABAgMEBQYHCAkKCw0ODxAREhMUFxkaGx0eICEiIyUmJygpKisuLzAxMjM0NTg6Ozw9QUJFRkhLT1BUVVdYWlxdX2FjZWdoaWprbG5vcHJzdHV2d3h5e3x9gYKDhIaHiImKjI2PkJGSk5iZmpucnZ6goaKjpKWqq62usLGys7W2t7i5u76/wMHDx8jJysvM0NLT1NXW19ja29zd3t/g4eLj5OXm6Onq6+3u7/Dx8vP09fb3+Pn6+/z9/t1YWtIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAX/SURBVGhD7Zr5fxNV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"/><animateTransform attributeName="transform" type="rotate" from="240 64 64" to="-120 64 64" dur="30s" repeatCount="indefinite" additive="sum"/></g><g><image width="28" height="28" x="64" y="28" transform="translate(-14 -14)" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAACOCAMAAAAGhhpfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIfUExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXVVVVU5OTltbW1VVVVpaWlVVVVFRUVVVVVFdUVlZWVVVVVhYWFVVVVJbUlhYWFVVVVJaUlhYWFVVVVVVVVNaU1dXV1VVVVNZU1VVVVNYU1NYU1dXUlVVVVZWUlZWUlRXVFRXVFVYVVRXVFVYVVRXVFVYVVZWU1RXVFVYVVRXVFZWU1VYVVZWU1VXVVRXVF9iX1VXVVZYU1VXVVRXVFZYU1VXVVRWVFZYVFRWVFZYVFRWVFZYVFVXVVZYVFRWVFVXU1RWVFZXVFVXU1RWVFZXVFVXU1RWVFZXVFRWVFZXVFVXU1RYVFZXVFVXU1RYVFZXVFVXU1RYVGBhXlZXVFVXU1RYVFZXVFVXU1RYVFZXVFZXVFVXU1RYVFZXVFVWVFVXVVVXVFVXVVVWVFVXVVVWVFVXVVVWVFVXVVVXVVVXVVVXVFVYVGBhX1VXVFVXVVVYVFVXVFVXVFVXVVVXVFVXU1VXVFVXU1VXU1VXVFVXU2BhX1VXU1VXVFVWVFVXVFVXVFVYVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVElLSFVXVGBhX2hqZ29KUXFwb4BsdYV/fpFeYZI4SpaQj5d/jaeFqLBBSrKhnbV5rsKgqtWo19a+teCl5frU/Py+//9SgP/I1hVLV2MAAACddFJOUwABAgMEBQYHCAkKCwwNDg8REhMVFhcYGhscHR4fICEkJSYqLjAxNDU8PkFJTE5PVFVXWVtdYWJjaGlqa2xub3BxcnN0dnd5ent9f4GFiYqLjJCRkpSVlpeYmZqbnJ2dnp+goaKjpKeoqaqrrK2vsbW3uLq7vsTFxsfIyszR0tPV1tjZ3N3f3+Ll5ufo7O3u7/Dx8vX29/j5+vv8/f41c9IuAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAKXklEQVR4Xu2b7b/cRBXHty3YB0QREXkqVkQrogIFRBBBK1SLFi2IgKJeEOVZsTwKgorWB0QFrBZKb+be3aUk0MTcS/9Az5zzSzKTnSSTnXz48GK/L9qbyeTM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"/><animateTransform attributeName="transform" type="rotate" from="180 64 64" to="-180 64 64" dur="30s" repeatCount="indefinite" additive="sum"/></g><g><image width="28" height="28" x="64" y="28" transform="translate(-14 -14)" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAABSCAMAAAC8NLwUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI0UExURQAAAAAAAICAgFVVVUBAQGZmZlVVVUlJSWBgYFVVVU1NTV1dXVVVVVtbW1BQUFpaWlVVVVFRUVlZWVVVVVlZWVVVVVJcUlhYWFVVVVhYWFVVVVJaUlhYWFNaU1dXV1VVVVdXV1VVVVNZU1VVVVNZU1VVVVdXUVVVVVNYU1dXUlNYU1dXUlNYU1RYVFVVVVRYVFZWUlZWUlVZVVRYVFVZVVRXVFZWU1VZVVRXVFVYVVZWU1VYVVZWU1RXVFZWU1RXVFVYVVZWU1VYVVRXVFZWU1ZWU1VYVVRXVFZWU1VYVVZWU1ZYU1VXVVZYU1VXVVZYU1RWVFRWVFVXVVRWVFZYVFVXVVVXVVRWVFZYVFVXU1RWVFZYVFRWVFZXVFZXVFVXU1ZXVFVXU1RWVFZXVFVXU1ZXVFZXVFZXVFVXU1RYVFZXVFZXVFRYVFZXVFVXU1RYVFZXVFVXU1RYVFZXVFVXVVVXVFVWVFVXVFVWVFVXVVVXVVVXVVVYVFVXVFVYVFVXVVVXVFVYVFVXVVVYVFVXVVVXVFVXVFVXVVVXVFVXVVVXVFVXVFVXU1VXVFVXU1VXVFVXVFVXU1VXVFVXVFVXVFVXVFVWVFVXVFVWVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVF9hX1VXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVFVXVElLSFVXVGBhX2hqZ3Fwb4BsdYV/fpeDdqGKar+meMOrn+O/gOXBqPDgoH7mTLoAAACudFJOUwABAgMEBQYHCAkKCwwOEBESExQVFxgZGhsdHh8gIiMkJicoKistLzAxMjQ1Nzo8PT5BQkNFRkdISUtNTlBSU1VXWVpbXF9jZGVmaGtsbm9xc3Z4eXp7fn+AgYKDhYmMjY+QkZKTlZibnJ2eoaOkpaanqKmqrK2us7S1uLvAwsPExcbHzM3Oz9DR09TV1tfZ2tvc3d7g4ePl5urr7e7v8PHy8/P09fb3+Pn6+/z9/s8Pi4UAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAaHSURBVGhD7Zr5exRFEIYnB8EjqAhKRCOKCioYREXxxpuoiCJ4K94XciioeIGgKBIVPPEIRAVjIMfM7jLbLP5zVlV/c+7MTk92F/B58v4A3T3VXd9UV/f07MSaYIKTizdeROFE8tDrtsfy+9GWkwVXoVAH0xf8OgoZoAtXjGn7tL/fHu3vH5h1LlpSOWsGkexg2msHISBg8INWXDWjpw8diS9WdKA1QkfHvC+FAW1Fpd6OjhZcZdq2DMolplBy3aKjy9Nw3YgbdR+fTW/hgsfctRtwKcbmDbCwrPVosl1VOfavUClzfegCWBhws4zgFL3bYJbfg4uW1fsw2lJ4fDoZtXyrK0VV0TI0FR5ytR7HgJZtZO6UpacqyoDM4DV8cfZqVH0cARWw8Npf5P+iEgEhFLUOs1YjdpK1E4yh/OAcnDlz+xDKpKBUVpUQquwWoooKVUIIvrf74CmLCw+RscTEJxQbjUPzn4hyAzUl9I7CYTGV8j7ZFtHPp1IOXDjRaMQJ1LiRNAEVurADrrLgFZgQWUl+olRTh6DKBRi7WDohJHHhKoM7ybKAbgGYIsdAiOCHpuqmcki5gyxddPPhCSaOGAphPDGF+CxxxOArA5IyFr+Vkh40hxBGudJNbwsBPBh8ZbCDLKM3ckxuzynDQw6UzpliZDxzKdw30lWJEto1x4NeeKFdKqcUJyxFp8k4QqJBvocmyTxtyTAspU4lhN4F/JWQYwWRYUgKb0gUX4w6PvQMe1pkRPjKgF37UuQW8q6cKnT2QktlzLZfgq8MwlIqMka9SkiL7AZay1EqGT6DyNKTckxSrn4lhGwxooVTx1yKt5ilfz0ZG6Djwms6xyGBDiRjR0WJpL6LsepGz7Xs+4dPga8MlnhSZBkXMVAD4BXgyLZyGK6y8B6HevFgmEYga7rE/5pKuQtSeE7r3FBiyIRzzphK4aMTnVekX0OVYBkReaTYOlEas3gC9LZr27/DUyZyoOR8b2DKApzA5sJTJofJmJU0NlE0+tF4BTxlcpGY1zU9qpz2UiC7i7GUS0SIXULnMEoZRUrmIdlSwpJXSsJQPI5JrOTRdQSVGBwWeeM14dS9PFLShi8LwCAuYpcUVYIjNgxP2fyU4lGvRQMpEpW08HFYeuEpk7vJOPGeTM8MrDl1J+BZXgtPWcgEJd4TuzB7UtdIb8np8+ErA07btMdgzEWBoqcKOTegI+Zh+TwtKFXwDXL+5NuWJSztcFYb2fjRLQNJntybIfd6Es5qMos2fuNjCv96kfuFgBP3M3irCR+dUvaEJMz23yg8qSa/JD9AduMYPg98fLoc7mpBZs2WwjO0H+5qQWbNOB5EoAwbuhT+akBSGn9misEztBD+0nmBrHJk7fiQrQUO02EpDXsNS8NMystk1OxU0ct5KTym0cp6my+Fk2UlXKbBUhr5SpgCz1CWFF5ATc9aLWUFPKbxEdnkfLqNB5YyCpdpbD0+UiRv4TINlpIra5Vyi8WiW/tjSDV8woXLNEiKA+sU6F0oeBr7nziom7kapeSX5T1PnAGviWypLUWV5UOYU5BPU97rODB7dIU+XlFhcw8cV3E2G6BPAt6vEkxJxZQQ3msYf7ujSUMtAg5+AVfCdZTO0/hbQ1gKnaG5RQ8ady3VA1d3M2v+lCbZB4IPavxhQJUKDqIYvuQz0jMJ7gPaP8RFr5/34YLg2Mvrbpwb0NmyHpS6G/Pm8vleYFmI6siixcxTumbvwQg+/Bz0kY9h4Sg4Sh5htv2oGHc/p2vLpKZp+5FbqiYgALJWtqGDZS3dJS23o6q5WNpClKFkcONG/tirZ+O3V2EO5SOogN3cxux8t9Wy3vsEtQjblsBYcz23rUdFI2Z23y7iO10uyf29wn+P8BX/+kPsC8/qO9QQ2zCXabPh+fq+W8/7WuqtkydP+UZKJFKuhJg/HJXS8jabDc2QyqTZB/6RbsTT0mL9oGun65rmTNJ3K8oe/Aplj1yGGiF/uSB/mTFD8np3MDkeXR+vnIois4nNDgUtXVwnHkG9Teb0MdTAOfZt8S3qJjabhwojv2CtkmLnfir2SbEGXX+R1cAU1IRVPIZ9HWrycjTUjUo63SO2vT38dyPWvdQRO8eknw3eT+eQ/d6Y1TMsZREqVsv3tr0R5VpMXRf80Yhmzdp1KBnxN3l9HmWP9oHIu0rbLZ2Ru20WvEBQDOj8Y98cFI8jiVJODM+ePFKs1W8uRmmCCf4PWNZ/rK5bW8gozl8AAAAASUVORK5CYII="/><animateTransform attributeName="transform" type="rotate" from="120 64 64" to="-240 64 64" dur="30s" repeatCount="indefinite" additive="sum"/></g><g><image width="28" height="28" x="64" y="28" transform="translate(-14 -14)" href="data:image/png;base64,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"/><animateTransform attributeName="transform" type="rotate" from="60 64 64" to="-300 64 64" dur="30s" repeatCount="indefinite" additive="sum"/></g><image width="80" height="80" x="64" y="59" transform="translate(-40 -40)" href="data:image/png;base64,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"/></g>';
    
    // when under auction
    if (flag_finished == false) {
        _html += '<g font-family="arial" font-weight="bold" font-size="12" text-anchor="middle"><text x="65" y="75" fill-opacity=".3">Unrevealed</text><text x="64" y="74" fill="#fff" fill-opacity=".9">Unrevealed</text></g><g><rect width="128" height="128" fill="#ffffff" rx="10" ry="10"/><animate attributeName="fill-opacity" values="1;0" keyTimes="0;1" dur="0.5s" repeatCount="once" fill="freeze"/></g></svg>';
    
    // when auction finished
    } else {
        _html += '<g font-family="arial" font-weight="bold" font-size="12" text-anchor="middle"><text x="65" y="75" fill-opacity=".3">Finished!</text><text x="64" y="74" fill="#fff" fill-opacity=".9">Finished!</text></g><g><rect width="128" height="128" fill="#ffffff" rx="10" ry="10"/><animate attributeName="fill-opacity" values="1;0" keyTimes="0;1" dur="0.5s" repeatCount="once" fill="freeze"/></g></svg>';
    }
    _html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    // insert html
    let _target = document.getElementById("unrevealedSvg");
    _target.innerHTML = _html;        
}


// reload on-chain data
async function reload_onChainData() {

    // show minimum bid and current bid
    let {_currentBid, _minimumBid} = await calc_bidPrice();
    document.getElementById("bidAmount").placeholder = "≥" + _minimumBid;
    currentBid.innerHTML = _currentBid;
    
    // show end timer
    show_endTime();
    
    // show tokenId
    show_tokenId();
    
    // show bid log
    show_bidLog();
    
    // show svg with on-chain text
    show_unrevealedSvg_with_onChainText();
}


// show winner
async function show_winner() {

    // duplicated codes

    // wallet to summoner name
    async function wallet2summonerNmae (_wallet) {
        let _murasakiNameId = await contract_mn.methods.tokenOf(_wallet).call();
        _murasakiNameId = Number(_murasakiNameId);
        let _murasakiName = "";
        if (_murasakiNameId > 0) {
            _murasakiName = await contract_mn.methods.names(1).call();
        }
        return _murasakiName;
    }
    
    // wallet -> shorter wallet
    async function formatWallet(_address) {
        let _bidder = "";
        let _summonerName = await wallet2summonerNmae(_address);
        if (_summonerName != "") {
            _bidder = _summonerName;
        } else {
            let _hash1 = _address.substring(0,4);
            let _hash2 = _address.slice(-4);
            let _txt = _hash1 + "..." + _hash2;
            _bidder = _txt;
        }
        return _bidder;
    }

    // call winner
    let _auction = await call_auction();
    let _bidder = _auction.bidder;
    
    // format winner
    _bidder = await formatWallet(_bidder);

    // update html
    let _target = document.getElementById("winner");
    _target.innerHTML = _bidder;
}


// conclude auction
async function button_conclude() {
    contract_mah.methods.settleCurrentAndCreateNewAuction().send({from:wallet});
}


// show user NFT
async function show_userNFT() {

    // call user NFT list
    let myListLength = await contract_mom.methods.myListLength(wallet).call();
    let myListsAt = await contract_mom.methods.myListsAt(wallet, 0, myListLength).call();
        
    if (myListsAt.length > 0) {
    
        // show loading text
        let _target = document.getElementById("userNFT");
        _target.innerHTML = "&nbsp;&nbsp;Loading...";
        
        // prepare each svg
        let _html = "";
        //_html += "&nbsp;&nbsp;";
        for (i=0; i < myListsAt.length; i++) {
        
            // prepare token id
            let _tokenId = myListsAt[i];
            
            // get svg and description
            let _res = await _getSvg2(_tokenId);
            let _svg = _res[0];
            let _description = _res[1];

            // prepare html
            // onclick, open modal window
            _html += '<img width="128" style="cursor: pointer;"';
            _html += ' src="' + _svg + '" onclick="update_modal(' + _tokenId + ')" >';
            _html += "&nbsp;&nbsp;&nbsp;";
        }

        // insert html
        _target.innerHTML = _html;
    }
}


// base64 image version
async function _getSvg2 (_tokenId) {

    // call tokenURI
    let _res = await contract_mom.methods.tokenURI(_tokenId).call();
    
    // prepare svg
    _res = _res.split("base64,")[1];
    _res = atob(_res);
    
    // prepare description
    let _json = JSON.parse(_res);
    let _description = _json.description;
    
    // prepare svg
    let _svg = _json.image
    //_svg = _svg.split("base64,")[1];
    //_svg = _svg.split('"')[0];
    //_svg = atob(_svg);
    
    return [_svg, _description];
}



// show random NFT
async function show_randomNFT() {

    // show loading text
    let _target = document.getElementById("randomNFT");
    _target.innerHTML = "&nbsp;&nbsp;Loading...";
    
    // call total nft number
    let _totalTokenNumber = await contract_mom.methods.next_nft().call();
    _totalTokenNumber = Number(_totalTokenNumber);
    _totalTokenNumber -= 1;

    // get random 5 tokenId
    let tokenList = [];
    for (let i=0; i<5; i++){
        let _rnd = Math.round(Math.random()*_totalTokenNumber);
        if (
            _rnd != 0 && tokenList.indexOf(_rnd) < 0
        ){
            tokenList.push(_rnd);
        }
    }
    tokenList.sort();
        
    // prepare each svg
    let _html = "";
    //_html += "&nbsp;&nbsp;";
    for (i=0; i < tokenList.length; i++) {
    
        // prepare token id
        let _tokenId = tokenList[i];

        // get svg and description
        let _res = await _getSvg2(_tokenId);
        let _svg = _res[0];
        let _description = _res[1];

        // onclick, open modal window
        _html += '<img width="128" style="cursor: pointer;"';
        _html += ' src="' + _svg + '" onclick="update_modal(' + _tokenId + ')" >';
        _html += "&nbsp;&nbsp;&nbsp;";
    }

    // insert html
    _target.innerHTML = _html;
}


// modal window
// https://recooord.org/modal-window-on-javascript/

function modalOpen() {
    let modal = document.querySelector('.js-modal');
    modal.classList.add('is-active');
}
//open.addEventListener('click', modalOpen);

function modalClose() {
    let modal = document.querySelector('.js-modal');
    modal.classList.remove('is-active');
}
//close.addEventListener('click', modalClose);

function modalOut(e) {
    let modal = document.querySelector('.js-modal');
    if (e.target == modal) {
        modal.classList.remove('is-active');
    }
}
addEventListener('click', modalOut);

// update modal window info
async function update_modal(_tokenId) {
    
    // open modal window
    modalOpen();

    // show loading text
    let _target = document.getElementById("svgDetail");
    _target.innerHTML = "Loading...";

    // call owner
    let _owner = await contract_mom.methods.ownerOf(_tokenId).call();
    _owner = await _formatWallet(_owner);

    // call svg and description
    let _res = await _getSvg2(_tokenId);
    let _svg = _res[0];
    let _description = _res[1];

    // prepare html    
    let _html = "";
    _html += "<center>";
    _html += '<img width="256" src="' + _svg + '"><br>';
    _html += "Owner:&nbsp;<b>" + _owner + "</b><br>";
    _html += "<p>";
    _html += '<b><font size="+2">Memento of <br class="br-sp">Murasaki-san #' + _tokenId + "</font></b>";
    _html += '<br><br class="br-sp"><br class="br-sp">';
    _html += _description;
    _html += "</p>";
    _html += "</center>";
    
    // insert html
    _target.innerHTML = _html;    
}


// wallet to summoner name
async function _wallet2summonerNmae (_wallet) {
    let _murasakiNameId = await contract_mn.methods.tokenOf(_wallet).call();
    _murasakiNameId = Number(_murasakiNameId);
    let _murasakiName = "";
    if (_murasakiNameId > 0) {
        _murasakiName = await contract_mn.methods.names(_murasakiNameId).call();
    }
    return _murasakiName;
}

// wallet -> shorter wallet
async function _formatWallet(_address) {
    let _bidder = "";
    let _summonerName = await _wallet2summonerNmae(_address);
    if (_summonerName != "") {
        _bidder = _summonerName;
    } else {
        let _hash1 = _address.substring(0,4);
        let _hash2 = _address.slice(-4);
        let _txt = _hash1 + "..." + _hash2;
        _bidder = _txt;
    }
    return _bidder;
}


// init contract
async function init_contract () {

    // init mah
    contract_mah.methods._set0_address_Murasaki_Craft(address_Murasaki_Craft).send({from:wallet});
    contract_mah.methods._set0_address_Murasaki_Main(address_Murasaki_Main).send({from:wallet});
    contract_mah.methods._set0_NFTAddress(address_Murasaki_Memento).send({from:wallet});
    contract_mah.methods._set0_VaultAddress(address_BufferVault).send({from:wallet});
    
    // init mom
    contract_mom.methods._add_permitted_address(address_Murasaki_AuctionHouse).send({from:wallet});
    contract_mom.methods._set_address_Murasaki_Memento_codex(address_Murasaki_Memento_Codex).send({from:wallet});
    
    // init momc
    contract_momc.methods._set_address_Murasaki_Memento(address_Murasaki_Memento).send({from:wallet});
    contract_momc.methods._set_address_Murasaki_Memento_mainPng_01(address_Murasaki_Memento_mainPng_01).send({from:wallet});
    contract_momc.methods._set_address_Murasaki_Memento_mainPng_02(address_Murasaki_Memento_mainPng_02).send({from:wallet});
    contract_momc.methods._set_address_Murasaki_Memento_mainPng_03(address_Murasaki_Memento_mainPng_03).send({from:wallet});
    contract_momc.methods._set_address_Murasaki_Memento_mainPng_04(address_Murasaki_Memento_mainPng_04).send({from:wallet});
    contract_momc.methods._set_address_Murasaki_Memento_mainPng_05(address_Murasaki_Memento_mainPng_05).send({from:wallet});
    contract_momc.methods._set_address_Murasaki_Memento_mainPng_06(address_Murasaki_Memento_mainPng_06).send({from:wallet});
    contract_momc.methods._set_address_Murasaki_Memento_flavorText(address_Murasaki_Memento_flavorText).send({from:wallet});

    // init mc
    contract_mc.methods._add_permitted_address(address_Murasaki_AuctionHouse).send({from:wallet});
    
    // init params
    //contract_mah.methods._set_numberOfColor(12).send({from:wallet});
    //contract_mah.methods._set_numberOfMain(6).send({from:wallet});
    //contract_mah.methods._set_numberOfOhana(6).send({from:wallet});
    //contract_mah.methods._set_numberOfPippel(5).send({from:wallet});
    //contract_mah.methods._set_numberOfFluffy(12).send({from:wallet});
    contract_mah.methods._set_numberOfFlavorText(30).send({from:wallet});
}

