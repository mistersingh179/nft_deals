const { ethers } = require("hardhat");

const init = async () => {
  const oldAddress = process.argv[2];
  const newAddress = process.argv[3];
  if (!oldAddress || !newAddress) {
    console.log("must provide old & new address");
    return;
  } else {
    console.log("will move auctions from: ", oldAddress, "to : ", newAddress);
  }
  const [w1] = await ethers.getSigners();
  console.log("w1: ", w1.address);
  const oldAuctionFactory = await ethers.getContractAt(
    "AuctionFactory",
    oldAddress,
  );
  const auctions = await oldAuctionFactory.auctions();
  console.log("oldAuctionFactory auctions: ", auctions);
  const newAuctionFactory = await ethers.getContractAt(
    "AuctionFactory",
    newAddress,
    w1,
  );
  await newAuctionFactory.addAuction(auctions);
  console.log("moved over ", auctions.length, " to the new contract");
};

init();
