
// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.13;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/utils/Strings.sol";


contract TestNFT is ERC721 {

    //names
    constructor() ERC721("Test NFT", "TNFT") {}
    
    // next_token
    uint public next_token = 1;

    // mint
    function mint () external {
        _safeMint(msg.sender, next_token);
        next_token++;
    }

    //URI
    string public baseURI = "https://murasaki-san.com/src/json/test/";
    string public tailURI = ".json";
    function set_baseURI(string memory _string) external {
        baseURI = _string;
    }
    function set_tailURI(string memory _string) external {
        tailURI = _string;
    }
    //override tokenURI
    function tokenURI (uint _tokenId) public view override returns (string memory) {
        return string(
            abi.encodePacked(
                baseURI,
                Strings.toString(_tokenId),
                tailURI
            )
        );
    }    
}


// 0x579AbE72E74f4A55d289d059CFd265EfcEaA7501
