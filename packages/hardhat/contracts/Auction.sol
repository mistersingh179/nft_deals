pragma solidity ^0.8.4;
// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
import "./AuctionFactory.sol";

// someones deploy us [contract] with nft contract address
// lister approves us [contract] to take nft or take all of their nfts
// lister starts the auction. here we [contract] take possession of the nft.

// buyers can place bid, this pushes expiration time out
// as time passes, auction will eventually end when time is greater than expiration time
// smaller bids are rejected
// a higher bid becomes the winning bid and previous winning bid is claimable as refund
// higher bid is calculated as previousBid + minimum increase + platformFee
// there is only 1 winning bidder at any time
// when auction ends, if there is winner, they can claim their nft
// when auction ends, if there is no winner, they lister can claim their nft
// when auction ends, owner can claim the highest bidding amount
// when auction ends, lister can claim their portion of fees, how much, unknown?
// anytime, the owner can claim platform fees

// Assumptions:
// 1.Auction Builder is the same as NFT Lister


import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Auction is IERC721Receiver, Ownable, AccessControl {
    using Strings for uint;

    bytes32 public constant CASHIER_ROLE = keccak256("CASHIER_ROLE");
    address public constant _rodAddress = 0x44791F3A984982499Dc582633D2b5BFc8F9850c5;
    address public constant _sandeepAddress = 0x6B09B3C63B72fF54Bcb7322B607E304a13Fba72B;

    uint public immutable platformFeeInBasisPoints;
    uint public immutable listerFeeInBasisPoints;
    IERC20 public immutable weth;
    uint public immutable minimumBidIncrement;
    uint public immutable auctionTimeIncrementOnBid;
    address public immutable nftListerAddress;
    uint public immutable initialAuctionLength;
    AuctionFactory public immutable auctionFactory;

    IERC721 public immutable nftContract;
    uint public immutable tokenId;

    bool public _weHavePossessionOfNft;
    uint public expiration;
    address public winningAddress;
    uint public highestBid;
    uint public _platformFeesAccumulated;
    uint public _listerFeesAccumulated;

    event Bid(address from, uint amount);
    event MoneyOut(address to, uint amount);
    event FailedToSendMoney(address to, uint amount);
    event NftOut(address to, uint tokenId);
    event NftIn(address from, uint tokenId);

    constructor(
        address _nftContractAddress,
        uint _tokenId,
        uint startBidAmount,
        uint _initialAuctionLength,
        uint _auctionTimeIncrementOnBid,
        uint _minimumBidIncrement,
        address _nftListerAddress,
        uint _listerFeeInBasisPoints,
        address _wethAddress){
            nftContract = IERC721(_nftContractAddress);
            tokenId = _tokenId;
            nftListerAddress = _nftListerAddress;
            listerFeeInBasisPoints = _listerFeeInBasisPoints;
            platformFeeInBasisPoints = _listerFeeInBasisPoints > 100 ? _listerFeeInBasisPoints : 100;
            initialAuctionLength = _initialAuctionLength;
            highestBid = startBidAmount;
            auctionTimeIncrementOnBid = _auctionTimeIncrementOnBid;
            minimumBidIncrement = _minimumBidIncrement;

            _setupRole(DEFAULT_ADMIN_ROLE, _rodAddress);
            _setupRole(DEFAULT_ADMIN_ROLE, _sandeepAddress);
            _setupRole(CASHIER_ROLE, _rodAddress);
            _setupRole(CASHIER_ROLE, _sandeepAddress);

            weth = IERC20(_wethAddress);
            auctionFactory = AuctionFactory(msg.sender);
    }

    function startAuction() youAreTheNftLister external{
        address operatorAddress = nftContract.getApproved(tokenId);
        require(operatorAddress == address(this), 'approval not found');
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);
        expiration = block.timestamp + initialAuctionLength;
        _weHavePossessionOfNft = true;
    }

    modifier auctionHasStarted() {
        require(expiration != 0, 'auction has not started');
        _;
    }

    modifier auctionHasEnded() {
        require(block.timestamp > expiration, "auction is still active");
        _;
    }

    modifier auctionHasNotEnded() {
        require(expiration > block.timestamp, "auction has expired");
        _;
    }

    modifier thereIsNoWinner() {
        require(winningAddress == address(0), "there is a winner");
        _;
    }

    modifier thereIsAWinner() {
        require(winningAddress != address(0), 'there is no winner');
        _;
    }

    modifier youAreTheWinner() {
        require(msg.sender == winningAddress, "you are not the winner");
        _;
    }

    modifier youAreTheNftLister() {
        require(msg.sender == nftListerAddress, "you are not the lister");
        _;
    }

    modifier weHavePossessionOfNft() {
        require(_weHavePossessionOfNft == true, "we dont have the nft");
        _;
    }

    function calculateFee(uint amount, uint bp) pure public returns(uint){
        return (amount * bp) / 10000;
    }

    function currentReward() view public returns(uint){
        uint reward = 0;
        if(expiration > block.timestamp){
            reward = (expiration - block.timestamp) / 60 / 60;
        }
        return reward;
    }

    function giveReward() private {
        uint reward = currentReward();
        if(reward > 0){
            auctionFactory.giveReward(msg.sender, reward);
        }
    }

    function bid() auctionHasStarted auctionHasNotEnded external {
        uint totalNextBid = highestBid + minimumBidIncrement;
        uint platformFee;
        uint listerFee;

        require(weth.balanceOf(msg.sender) >= totalNextBid, 'insufficient WETH funds');
        require(weth.transferFrom(msg.sender, address(this), totalNextBid), 'transfer of WETH failed!');

        _sendPreviousWinnerTheirBidBack(winningAddress, highestBid);
        giveReward();

        platformFee = calculateFee(totalNextBid, platformFeeInBasisPoints);
        listerFee = calculateFee(totalNextBid, listerFeeInBasisPoints);
        _platformFeesAccumulated += platformFee;
        _listerFeesAccumulated += listerFee;

        highestBid = totalNextBid; // new highest bid
        winningAddress = msg.sender;
        expiration = block.timestamp + auctionTimeIncrementOnBid;

        emit Bid(msg.sender, totalNextBid);
    }

    function secondsLeftInAuction() external view returns(uint) {
        if(expiration == 0){
            return 0;
        } else if(expiration < block.timestamp){
            return 0;
        } else {
            return expiration - block.timestamp;
        }
    }

    function doEmptyTransaction() external { }

    function claimNftWhenNoAction() auctionHasStarted auctionHasEnded
        thereIsNoWinner youAreTheNftLister weHavePossessionOfNft external {
            _transfer();
    }

    function claimNftUponWinning() auctionHasStarted auctionHasEnded
        thereIsAWinner youAreTheWinner weHavePossessionOfNft external {
            _transfer();
    }

    function claimPlatformFees() onlyRole(CASHIER_ROLE) external {
        uint amountToSend = _platformFeesAccumulated;
        _platformFeesAccumulated = 0;
        _sendMoney(msg.sender, amountToSend);
    }

    function claimListerFees() youAreTheNftLister external {
        uint amountToSend = _listerFeesAccumulated;
        _listerFeesAccumulated = 0;
        _sendMoney(msg.sender, amountToSend);
    }

    function claimFinalBidAmount() auctionHasStarted auctionHasEnded
        thereIsAWinner youAreTheNftLister public {
            require(highestBid != 0, 'the highest bid is 0');
            uint bidAmount = highestBid;
            uint platformFee = calculateFee(highestBid, platformFeeInBasisPoints);
            uint listerFee = calculateFee(highestBid, listerFeeInBasisPoints);
            bidAmount -= platformFee;
            bidAmount -= listerFee;
            highestBid = 0;
            _sendMoney(msg.sender, bidAmount);
    }

    function _sendPreviousWinnerTheirBidBack(address _previousWinnerAddress, uint bidAmount) private {
        if(_previousWinnerAddress == address(0)){
            console.log('wont sent previous bid back as previous winner is 0');
        }else{
            console.log('sending previous winner money back');
            console.log(bidAmount);
            uint platformFee = calculateFee(bidAmount, platformFeeInBasisPoints);
            console.log(platformFee);
            uint listerFee = calculateFee(bidAmount, listerFeeInBasisPoints);
            console.log(listerFee);
            bidAmount -= platformFee;
            bidAmount -= listerFee;
            console.log('amount sending back');
            console.log(bidAmount);
            _sendMoney(_previousWinnerAddress, bidAmount);
        }
    }

    function _transfer() private {
        _weHavePossessionOfNft = false;
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);
        emit NftOut(msg.sender, tokenId);
    }

    function _sendMoney(address recipient, uint amount) private {
        console.log('in sendmoney');
        console.log(recipient);
        console.log(amount);
        bool result = weth.transfer(recipient, amount);
        if(result == true){
            emit MoneyOut(recipient, amount);
        }else{
            emit FailedToSendMoney(recipient, amount);
        }
    }

    function shutdown() onlyRole(DEFAULT_ADMIN_ROLE) external {
        selfdestruct(payable(msg.sender));
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4){
        require(_weHavePossessionOfNft == false, "we already have an nft");
        emit NftIn(from, tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }
}
