const { ethers } = require("hardhat");
const {
  wethAddress,
  adminOneAddress,
  adminTwoAddress,
} = require("../constants");

const init = async () => {
  console.log("will verify");

  await run("verify:verify", {
    address: "0x421f1edAD645838BA70ce674153EaBEEA0F3B7FF",
    contract: "contracts/Auction.sol:Auction",
    constructorArguments: [
      "0x51161bFC191A6a4c6b12471CCB386De9f0B5961E", // _nftContractAddress
      0, // tokenId
      "10000000000000000000", // 10 eth // startBidAmount
      60, // 1 minute // _auctionTimeIncrementOnBid
      "100000000000000000", // 0.1 eth // _minimumBidIncrement
      "0x378a29135fdFE323414189f682b061fc64aDC0B3", // chrome // _nftOwner
      "100", // 100 bp // 1% // listerFeeInBasisPoints
      0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2, // _wethAddress
      "0x378a29135fdFE323414189f682b061fc64aDC0B3",
      "0x378a29135fdFE323414189f682b061fc64aDC0B3",
    ],
  });
};

init();
