// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");
const {
  wethAddress,
  adminOneAddress,
  adminTwoAddress,
} = require("../constants");

const localChainId = "31337";

const sleep = ms =>
  new Promise(r =>
    setTimeout(() => {
      console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
      r();
    }, ms),
  );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  try {
    const theWETHContract = await ethers.getContract("WETH", deployer);
    wethAddress[chainId] = theWETHContract.address;
  } catch (e) {
    console.log("no local WETH contract found for chainId: ", chainId);
  }

  const bestNft = await ethers.getContract("BestNft", deployer);
  console.log("we have deployer as: ", deployer);

  const tokenId = (await bestNft.tokenOfOwnerByIndex(deployer, 0)).toNumber();
  console.log("deployer has token id: ", tokenId);

  await deploy("Auction", {
    // Learn more about args here:
    // https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      bestNft.address, // _nftContractAddress
      tokenId, // tokenId
      "10000000000000000000", // 10 eth // startBidAmount
      60, // 1 minute // _auctionTimeIncrementOnBid
      "100000000000000000", // 0.1 eth // _minimumBidIncrement
      deployer, // chrome // _nftOwner
      "100", // 100 bp // 1% // listerFeeInBasisPoints
      wethAddress[chainId], // _wethAddress
      adminOneAddress[chainId],
      adminTwoAddress[chainId],
    ],
    log: true,
    waitConfirmations: 5,
  });

  const theAuctionContract = await ethers.getContract("Auction", deployer);
  console.log("deployed Auction contract here: ", theAuctionContract.address);

  try {
    if (chainId !== localChainId) {
      console.log("will verify");
      // await sleep(10000);
      await run("verify:verify", {
        address: theAuctionContract.address,
        contract: "contracts/Auction.sol:Auction",
        constructorArguments: [
          bestNft.address, // _nftContractAddress
          tokenId, // tokenId
          "10000000000000000000", // 10 eth // startBidAmount
          60, // 1 minute // _auctionTimeIncrementOnBid
          "100000000000000000", // 0.1 eth // _minimumBidIncrement
          deployer, // chrome // _nftOwner
          "100", // 100 bp // 1% // listerFeeInBasisPoints
          wethAddress[chainId], // _wethAddress
          adminOneAddress[chainId],
          adminTwoAddress[chainId],
        ],
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["Auction"];
