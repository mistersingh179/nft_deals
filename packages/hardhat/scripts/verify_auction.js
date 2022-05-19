const { ethers } = require("hardhat");
const {
  wethAddress,
  adminOneAddress,
  adminTwoAddress,
} = require("../constants");

const init = async () => {
  console.log("will verify");

  await run("verify:verify", {
    address: "0xf2c50dA3C1462873d8604a2E9Dc92FcC6f80924a",
    contract: "contracts/Auction.sol:Auction",
    constructorArguments: [
      "0x42e82cda993D26Cd9F1FfB0944d565549E46B289", // _nftContractAddress
      7672, // _tokenId
      0, // startBidAmount
      86400, // _auctionTimeIncrementOnBid
      500000000000000, // _minimumBidIncrement
      "0x96d5F595200685706A73D7988AF8223CD41f9d9F", // _nftOwner
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // _wethAddress
      "0x6b09b3c63b72ff54bcb7322b607e304a13fba72b", // _adminOneAddress
      "0x44791f3a984982499dc582633d2b5bfc8f9850c5", // _adminTwoAddress
      "0xCD662030BAd6E50109fe85eCEbd56A8Af57cec4D", // _auctionFactoryAddress
    ],
  });
};

init();
