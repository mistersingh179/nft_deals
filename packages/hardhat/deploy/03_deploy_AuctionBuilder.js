// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("AuctionFactory", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [],
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
        constructorArguments: [],
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["YourContract"];
