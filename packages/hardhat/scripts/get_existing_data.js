const { ethers } = require("hardhat");

const init = async () => {
  const [w1] = await ethers.getSigners();
  console.log("w1: ", w1.address);
  const auctionFactory = await ethers.getContract("AuctionFactory");
  console.log("auctionFactory.address: ", auctionFactory.address);
  const auctions = await auctionFactory.auctions();
  console.log('auctions: ', auctions);
};

init();
