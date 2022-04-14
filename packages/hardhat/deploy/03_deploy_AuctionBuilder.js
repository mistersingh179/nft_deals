// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";
const { wethAddresses } = require("../constants");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  try {
    const theWETHContract = await ethers.getContract("WETH", deployer);
    wethAddresses[chainId] = theWETHContract.address;
  } catch (e) {
    console.log("no local WETH contract found for chainId: ", chainId);
  }

  await deploy("AuctionFactory", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [wethAddresses[chainId]],
    log: true,
    waitConfirmations: 5,
  });

  const theAuctionFactoryContract = await ethers.getContract(
    "AuctionFactory",
    deployer
  );
  console.log(
    "deployed AuctionFactory contract here: ",
    theAuctionFactoryContract.address
  );

  try {
    if (chainId !== localChainId) {
      console.log("will verify");
      await run("verify:verify", {
        address: theAuctionFactoryContract.address,
        contract: "contracts/AuctionFactory.sol:AuctionFactory",
        constructorArguments: [wethAddresses[chainId]],
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["AuctionBuilder"];
