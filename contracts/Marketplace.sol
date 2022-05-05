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
    Counters.Counter private _itemsSold;
    

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
        require(msg.sender != item.seller, "seller should not be same as buyer");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        item.owner =  payable(msg.sender);
        _itemsSold.increment();
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

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (Item[] memory) {
      uint _itemCount = itemCount.current();
      uint unsoldItemCount = itemCount.current() - _itemsSold.current();
      uint currentIndex = 0;

      Item[] memory allItems = new Item[](unsoldItemCount);
      for (uint i = 0; i < _itemCount; i++) {
        if (items[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          Item  storage currentItem = items[currentId];
          allItems[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return allItems;
    }

     /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (Item[] memory) {
      uint totalItemCount = itemCount.current();
      uint Count = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (items[i + 1].seller == msg.sender) {
          Count += 1;
        }
      }

      Item[] memory allItems = new Item[](Count);
      for (uint i = 0; i < totalItemCount; i++) {
        if (items[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          Item storage currentItem = items[currentId];
          allItems[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return allItems;
    }
    function fetchMyNft() public view returns (Item[] memory) {
      uint totalItemCount = itemCount.current();
      uint Count = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (items[i + 1].owner == msg.sender) {
          Count += 1;
        }
      }

      Item[] memory allItems = new Item[](Count);
      for (uint i = 0; i < totalItemCount; i++) {
        if (items[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          Item storage currentItem = items[currentId];
          allItems[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return allItems;
    }

}