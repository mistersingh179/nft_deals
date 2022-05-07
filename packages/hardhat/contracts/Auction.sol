pragma solidity ^0.8.4;
// SPDX-License-Identifier: UNLICENSED
/*
 * (c) Copyright 2022 Masalsa, Inc., all rights reserved.
  You have no rights, whatsoever, to fork, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
  By using this file/contract, you agree to the Customer Terms of Service at nftdeals.xyz
  THE SOFTWARE IS PROVIDED AS-IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  This software is Experimental, use at your own risk!
 */

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

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
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./AuctionFactory.sol";

contract Auction is IERC721Receiver, Ownable, AccessControl {
    using Strings for uint;

    bytes32 public constant CASHIER_ROLE = keccak256("CASHIER_ROLE");
    bytes32 public constant MAINTENANCE_ROLE = keccak256("MAINTENANCE_ROLE");

    uint public immutable platformFeeInBasisPoints;
    uint public immutable listerFeeInBasisPoints;
    IERC20 public immutable weth;
    uint public immutable minimumBidIncrement;
    uint public immutable auctionTimeIncrementOnBid;
    uint public immutable createdAt;

    address public immutable nftOwner;
    IERC721 public immutable nftContract;
    uint public immutable tokenId;

    AuctionFactory public auctionFactory;
    bool public _weHavePossessionOfNft;
    uint public expiration;
    address public winningAddress;
    uint public highestBid;
    uint public _platformFeesAccumulated;
    uint public _listerFeesAccumulated;
    uint public maxBid;
    bool public qualifiesForRewards;
    bool public paused;


    event Bid(address from, uint amount, uint secondsLeftInAuction);
    event MoneyOut(address to, uint amount);
    event FailedToSendMoney(address to, uint amount);
    event NftOut(address to, uint tokenId);
    event NftIn(address from, uint tokenId);
    event AuctionExtended(uint from, uint to);

    struct AllData {
        uint platformFeeInBasisPoints;
        uint listerFeeInBasisPoints;
        IERC20 weth;
        uint minimumBidIncrement;
        uint auctionTimeIncrementOnBid;
        IERC721 nftContract;
        uint tokenId;
        bool _weHavePossessionOfNft;
        uint expiration;
        address winningAddress;
        uint highestBid;
        uint _platformFeesAccumulated;
        uint _listerFeesAccumulated;
        uint maxBid;
        uint secondsLeftInAuction;
        uint currentReward;
        uint rewards;
        uint wethBalance;
        string name;
        string symbol;
        string tokenURI;
        uint createdAt;
        address nftOwner;
        AuctionFactory auctionFactory;
        bool qualifiesForRewards;
        bool paused;
    }

    function getAllData(address me) public view returns(AllData memory) {
        AllData memory data;

        data.platformFeeInBasisPoints = platformFeeInBasisPoints;
        data.listerFeeInBasisPoints = listerFeeInBasisPoints;
        data.weth = weth;
        data.minimumBidIncrement = minimumBidIncrement;
        data.auctionTimeIncrementOnBid = auctionTimeIncrementOnBid;
        data.nftContract = nftContract;
        data.tokenId = tokenId;
        data._weHavePossessionOfNft = _weHavePossessionOfNft;
        data.expiration = expiration;
        data.winningAddress = winningAddress;
        data.highestBid = highestBid;
        data._platformFeesAccumulated = _platformFeesAccumulated;
        data._listerFeesAccumulated = _listerFeesAccumulated;
        data.maxBid = maxBid;
        data.secondsLeftInAuction = secondsLeftInAuction();
        data.currentReward = currentReward();
        data.rewards = auctionFactory.rewards(me);
        data.wethBalance = weth.balanceOf(me);
        if(nftContract.supportsInterface(type(IERC721Metadata).interfaceId) == true){
            IERC721Metadata nft_contract_meta = IERC721Metadata(address(nftContract));
            data.name = nft_contract_meta.name();
            data.symbol = nft_contract_meta.symbol();
            data.tokenURI = nft_contract_meta.tokenURI(tokenId);
        }
        data.createdAt = createdAt;
        data.nftOwner = nftOwner;
        data.auctionFactory = auctionFactory;
        data.qualifiesForRewards = qualifiesForRewards;
        data.paused = paused;
        return data;
    }

    constructor(
        address _nftContractAddress,
        uint _tokenId,
        uint startBidAmount,
        uint _auctionTimeIncrementOnBid,
        uint _minimumBidIncrement,
        address _nftOwner,
        uint _listerFeeInBasisPoints,
        address _wethAddress,
        address _adminOneAddress,
        address _adminTwoAddress){
            nftContract = IERC721(_nftContractAddress);
            tokenId = _tokenId;
            nftOwner = _nftOwner;

            require(nftContract.ownerOf(tokenId) == nftOwner, "you are not the owner of this nft");

            listerFeeInBasisPoints = _listerFeeInBasisPoints;
            platformFeeInBasisPoints = _listerFeeInBasisPoints > 100 ? _listerFeeInBasisPoints : 100;
            highestBid = startBidAmount;
            maxBid = highestBid; // need to get rid of this
            auctionTimeIncrementOnBid = _auctionTimeIncrementOnBid;
            minimumBidIncrement = _minimumBidIncrement;
            createdAt = block.timestamp;

            weth = IERC20(_wethAddress);
            auctionFactory = AuctionFactory(msg.sender);

            _setupRole(DEFAULT_ADMIN_ROLE, _adminOneAddress);
            _setupRole(DEFAULT_ADMIN_ROLE, _adminTwoAddress);

            _setupRole(CASHIER_ROLE, _adminOneAddress);
            _setupRole(CASHIER_ROLE, _adminTwoAddress);

            _setupRole(MAINTENANCE_ROLE, _adminOneAddress);
            _setupRole(MAINTENANCE_ROLE, _adminTwoAddress);
    }

    function startAuction() youAreTheNftOwner auctionHasNotStarted external{
        address operatorAddress = nftContract.getApproved(tokenId);
        require(operatorAddress == address(this), 'approval not found');
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);
        expiration = block.timestamp + auctionTimeIncrementOnBid;
        _weHavePossessionOfNft = true;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 _tokenId,
        bytes calldata data
    ) external override returns (bytes4){
        require(_weHavePossessionOfNft == false, "we already have an nft");
        require(_tokenId == tokenId, "this is the wrong nft tokenId");
        require(msg.sender == address(nftContract), "this is the wrong nft contract");
        emit NftIn(from, _tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }

    modifier auctionHasNotStarted() {
        require(expiration == 0, "expiration has started");
        _;
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

    modifier auctionIsPaused() {
        require(paused == true, "auction is not paused");
        _;
    }

    modifier auctionIsNotPaused() {
        require(paused == false, "auction is paused");
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

    modifier youAreTheNftOwner() {
        require(msg.sender == nftOwner, "you are not the lister");
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
        console.log("calculated currentReward to be: ");
        console.log(reward);
        return reward;
    }

    function giveReward() private {
        if(qualifiesForRewards == true){
            console.log("you qualify for rewards");
            uint reward = currentReward();
            if(reward > 0){
                auctionFactory.giveReward(msg.sender, reward);
            }
        }else {
            console.log('this auction does not qualify for rewards');
        }
    }

    function setQualifiesForRewards(bool _qualifies) public onlyRole(MAINTENANCE_ROLE) {
        qualifiesForRewards = _qualifies;
    }

    function bid() auctionHasStarted auctionHasNotEnded auctionIsNotPaused external {
        uint totalNextBid = highestBid + minimumBidIncrement;
        uint platformFee;
        uint listerFee;
        console.log("totalNextBid: ");
        console.log(totalNextBid);

        require(weth.allowance(msg.sender, address(this)) >= totalNextBid, 'WETH approval not found');
        require(weth.balanceOf(msg.sender) >= totalNextBid, 'WETH insufficient  funds');
        require(weth.transferFrom(msg.sender, address(this), totalNextBid), 'WETH transfer failed!');

        _sendPreviousWinnerTheirBidBack(winningAddress, highestBid);
        giveReward();

        platformFee = calculateFee(totalNextBid, platformFeeInBasisPoints);
        listerFee = calculateFee(totalNextBid, listerFeeInBasisPoints);
        _platformFeesAccumulated += platformFee;
        _listerFeesAccumulated += listerFee;

        highestBid = totalNextBid; // new highest bid
        winningAddress = msg.sender;
        console.log('increasing expiration timestamp');
        console.log(block.timestamp);
        console.log(auctionTimeIncrementOnBid);
        console.log(block.timestamp + auctionTimeIncrementOnBid);
        emit AuctionExtended(expiration, block.timestamp + auctionTimeIncrementOnBid);
        emit Bid(msg.sender, totalNextBid, secondsLeftInAuction());
        expiration = block.timestamp + auctionTimeIncrementOnBid;

        maxBid = highestBid;
    }

    function secondsLeftInAuction() public view returns(uint) {
        console.log('in secondsLeftInAuction');
        console.log(expiration);
        console.log(block.timestamp);
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
        thereIsNoWinner youAreTheNftOwner weHavePossessionOfNft external {
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

    function claimListerFees() youAreTheNftOwner external {
        uint amountToSend = _listerFeesAccumulated;
        _listerFeesAccumulated = 0;
        _sendMoney(msg.sender, amountToSend);
    }

    function claimFinalBidAmount() auctionHasStarted auctionHasEnded
        thereIsAWinner youAreTheNftOwner public {
            require(highestBid != 0, 'the highest bid is 0!');
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

    function selfDestruct() onlyRole(DEFAULT_ADMIN_ROLE) external {
        try nftContract.safeTransferFrom(address(this), msg.sender, tokenId) {
            console.log('sent nft');
        }catch {
            console.log('unable to get nft');
        }
        try weth.balanceOf(address(this)) returns (uint bal) {
            try weth.transfer(msg.sender, bal) {
                console.log('transfered weth');
            }catch {
                console.log('unable to transfer weth');
            }
        }catch{
            console.log('unable to get balance');
        }
        selfdestruct(payable(msg.sender));
    }

    function setPaused(bool val) onlyRole(MAINTENANCE_ROLE) external {
        paused = val;
    }

    function setAuctionFactory(address _auctionFactoryAddress) onlyRole(MAINTENANCE_ROLE) external {
        auctionFactory = AuctionFactory(_auctionFactoryAddress);
    }
}
