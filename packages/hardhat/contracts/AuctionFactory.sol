pragma solidity ^0.8.4;
// SPDX-License-Identifier: GPL-3.0

import "./Auction.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "hardhat/console.sol";

contract AuctionFactory {
    Auction[] public auctions;
    uint public auctionsCount;
    mapping(address => Auction[]) public auctionsByLister;
    mapping(address => uint) public auctionSizeByLister;
    mapping(address => bool) public allAuctionsHash;
    address public immutable wethAddress;

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private addressesWithRewards;
    mapping(address => uint) public rewards;
    event RewardGiven(address to, uint rewardAmout);

    constructor(address _addr){
        wethAddress = _addr;
    }

    modifier youAreAnAuction(){
        require(allAuctionsHash[msg.sender] == true, 'you are not an auction');
        _;
    }

    function giveReward(address to, uint reward) youAreAnAuction public {
        console.log('going to give reward');
        console.log(to);
        console.log(reward);
        rewards[to] += reward;
        addressesWithRewards.add(to);
        emit RewardGiven(to, reward);
    }

    function numberOfAddressesWithRewards() public view returns(uint){
        return addressesWithRewards.length();
    }

    function addressWithRewardAtIndex(uint index) public view returns(address){
        return addressesWithRewards.at(index);
    }

    function allAddressesWithRewards() public view returns(address[] memory){
        return addressesWithRewards.values();
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
        allAuctionsHash[address(pennyAuction)] = true;
        emit AuctionGenerated(_nftListerAddress, address(pennyAuction));
    }
}
