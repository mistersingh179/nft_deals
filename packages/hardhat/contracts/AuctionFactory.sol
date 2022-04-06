pragma solidity ^0.8.4;
// SPDX-License-Identifier: GPL-3.0

import "./Auction.sol";

contract AuctionFactory {
    Auction[] public auctions;
    uint public auctionsCount;
    mapping(address => Auction[]) public auctionsByLister;
    mapping(address => uint) public auctionSizeByLister;

    function getAuction(uint index) public view returns(Auction){
        return auctions[index];
    }

    event AuctionGenerated(address _nftListerAddress, address auctionContractAddress);

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
        _saveNewAuction(_nftListerAddress, pennyAuction);
    }

    function _saveNewAuction(address _nftListerAddress, Auction pennyAuction) private {
        auctions.push(pennyAuction);
        auctionsCount += 1;
        auctionsByLister[_nftListerAddress].push(pennyAuction);
        auctionSizeByLister[_nftListerAddress] += 1;
        emit AuctionGenerated(_nftListerAddress, address(pennyAuction));
    }
}
