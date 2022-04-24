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

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "hardhat/console.sol";

contract Reward is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private auctionAddresses;

    EnumerableSet.AddressSet private addressesWithRewards;
    mapping(address => uint) public rewards;

    address public auctionFactoryAddress;

    event RewardGiven(address to, uint rewardAmout);

    modifier youAreAuctionFactory(){
        require(msg.sender == auctionFactoryAddress, 'you are not the auction factory');
        _;
    }

    function setAuctionFactoryContractAddress(address _auctionFactoryAddress) onlyOwner public{
        auctionFactoryAddress = _auctionFactoryAddress;
    }

    function addAuctionAddress(address auctionAddress) youAreAuctionFactory public {
        auctionAddresses.add(auctionAddress);
    }

    function getAllAuctionAddresses() view public returns(address[] memory){
        return auctionAddresses.values();
    }

    function numberOfAuctions() view public returns(uint){
        return auctionAddresses.length();
    }

    function auctionAddressAtIndex(uint idx) view public returns(address){
        return auctionAddresses.at(idx);
    }

    function auctionAddressExists(address _auctionAddress) view public returns(bool){
        return auctionAddresses.contains(_auctionAddress);
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

    function giveReward(address to, uint reward) youAreAnAuction public {
        console.log('going to give reward');
        console.log(to);
        console.log(reward);
        rewards[to] += reward;
        addressesWithRewards.add(to);
        emit RewardGiven(to, reward);
    }

    modifier youAreAnAuction(){
        require(auctionAddresses.contains(msg.sender) == true, 'you are not an auction');
        _;
    }

}