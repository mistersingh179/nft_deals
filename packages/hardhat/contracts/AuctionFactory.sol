pragma solidity ^0.8.4;
// SPDX-License-Identifier: GPL-3.0

import "./Auction.sol";

contract AuctionFactory {
    Auction[] public auctions;
    uint public auctionsCount;
    mapping(address => Auction[]) public auctionsByLister;
    mapping(address => uint) public auctionSizeByLister;
    address public immutable wethAddress;

    constructor(address _addr){
        wethAddress = _addr;
    }

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
        address _nftListerAddress,
        uint _listerFeeInBasisPoints
    ) external{
        Auction pennyAuction = new Auction(
            nftContract, // _nftContractAddress
            tokenId,
            startBidAmount, // 1 eth // startBidAmount
            _initialAuctionLength, // 5 minutes // _initialAuctionLength
            _auctionTimeIncrementOnBid, // 1 minute // _auctionTimeIncrementOnBid
            _minimumBidIncrement, // 0.1 eth // _minimumBidIncrement
            _nftListerAddress, // chrome // _nftListerAddress
            _listerFeeInBasisPoints, // 100 basis points // 1%
            wethAddress // address given to us when constructed per chain.
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
