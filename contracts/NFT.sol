// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public tokenCount;
  

    constructor() ERC721("RealLife NFT", "REAL"){}

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount.increment();
        uint256 newTokenCount = tokenCount.current();
        _safeMint(msg.sender, newTokenCount);
        _setTokenURI(newTokenCount, _tokenURI);
        return(newTokenCount);
    }
}