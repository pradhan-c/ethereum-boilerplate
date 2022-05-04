// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Marketplace is ERC721URIStorage {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    using Counters for Counters.Counter;
    Counters.Counter public itemCount;
    

    struct Item {
        uint tokenId;
        uint price;
        address payable seller;
        address payable owner;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        bool sold,
        uint price,
        address indexed seller,
        address indexed owner
    );
    event Bought(
        uint itemId,
         bool sold,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) ERC721("RealLife NFT", "Real"){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

     /* Mints a token and lists it in the marketplace */
    function createNFT(string memory tokenURI, uint256 price) external payable  {
      itemCount.increment();
      uint256 newTokenId = itemCount.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      makeItem(newTokenId, price);
      
    }

    // Make item to offer on the marketplace
    function makeItem( uint _tokenId, uint _price) private  {
        require(_price > 0, "Price must be greater than zero");
        // transfer nft
        _transfer(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[_tokenId] = Item (
            _tokenId,
            _price,
            payable(msg.sender),
            payable(address(this)),
            false
        );
        // emit Offered event
        emit Offered(
            _tokenId,
            false,
            _price,
            msg.sender,
            address(this)
        );
    }

    function purchaseItem(uint _itemId) external payable  {
        uint _totalPrice = getTotalPrice(_itemId);
        uint256 currentItemCount = itemCount.current();
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= currentItemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        _transfer(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            item.sold,
            item.price,
            item.seller,
            msg.sender
        );
    }
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
}