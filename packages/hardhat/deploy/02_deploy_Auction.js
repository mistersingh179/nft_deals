// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("Auction", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      "0x5FbDB2315678afecb367f032d93F642f64180aa3", // _nftContractAddress
      6, // tokenId
      "10000000000000000000", // 10 eth // startBidAmount
      100, // 1% // _platformFeeInBasisPoints
      5 * 60, // 5 minutes // _initialAuctionLength
      60, // 1 minute // _auctionTimeIncrementOnBid
      "100000000000000000", // 0.1 eth // _minimumBidIncrement
      "0xF530CAb59d29c45d911E3AfB3B69e9EdB68bA283", // chrome // _platformOwnerAddress
      "0xF530CAb59d29c45d911E3AfB3B69e9EdB68bA283", // chrome // _nftListerAddress
    ],
    log: true,
    waitConfirmations: 5,
  });
};
module.exports.tags = ["YourContract"];
