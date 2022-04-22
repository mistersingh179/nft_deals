pragma solidity ^0.8.4;
// SPDX-License-Identifier: GPL-3.0

import "./Auction.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Reward.sol";

contract AuctionFactory is Ownable {
    Auction[] public auctions;
    uint public auctionsCount;
    mapping(address => Auction[]) public auctionsByLister;
    mapping(address => uint) public auctionSizeByLister;
    mapping(address => bool) public allAuctionsHash;
    address public immutable wethAddress;

    Reward public rewardContract;

    constructor(address _addr){
        wethAddress = _addr;
    }

    function setRewardContractAddress(address _rewardContractAddress) onlyOwner public{
        rewardContract = Reward(_rewardContractAddress);
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
            wethAddress, // address given to us when constructed per chain.
            address(rewardContract) // _rewardContractAddress
        );
        _saveNewAuction(_nftListerAddress, pennyAuction);
    }

    function _saveNewAuction(address _nftListerAddress, Auction pennyAuction) private {
        auctions.push(pennyAuction);
        auctionsCount += 1;
        auctionsByLister[_nftListerAddress].push(pennyAuction);
        auctionSizeByLister[_nftListerAddress] += 1;
        allAuctionsHash[address(pennyAuction)] = true;
        rewardContract.addAuctionAddress(address(pennyAuction));
        emit AuctionGenerated(_nftListerAddress, address(pennyAuction));
    }
}
