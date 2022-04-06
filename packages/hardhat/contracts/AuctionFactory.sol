pragma solidity ^0.8.4;
// SPDX-License-Identifier: GPL-3.0

import "./Auction.sol";

contract AuctionFactory {
    Auction[] public auctions;
    mapping(address => Auction[]) public auctionsByOwner;
    mapping(address => uint) public auctionSizeByOwner;

    event AuctionGenerated(address auctionContractAddress);

    function createAuction(
        uint tokenId,
        address nftContract,
        uint startBidAmount,
        uint _initialAuctionLength,
        uint _auctionTimeIncrementOnBid,
        uint _minimumBidIncrement,
        address _nftListerAddress
    ) external{
        Auction pennyAuction = new Auction(
            nftContract, // _nftContractAddress
            tokenId,
            startBidAmount, // 1 eth // startBidAmount
            100, // 1% // _platformFeeInBasisPoints // TODO
            _initialAuctionLength, // 5 minutes // _initialAuctionLength
            _auctionTimeIncrementOnBid, // 1 minute // _auctionTimeIncrementOnBid
            _minimumBidIncrement, // 0.1 eth // _minimumBidIncrement
            0x0000000000000000000000000000000000000000, // chrome // _platformOwnerAddress // TODO
            _nftListerAddress // chrome // _nftListerAddress
        );
        _saveNewAuction(pennyAuction);
    }

    function _saveNewAuction(Auction pennyAuction) private {
        auctions.push(pennyAuction);
        auctionsByOwner[msg.sender].push(pennyAuction);
        auctionSizeByOwner[msg.sender] += 1;
        emit AuctionGenerated(address(pennyAuction));
    }
}
