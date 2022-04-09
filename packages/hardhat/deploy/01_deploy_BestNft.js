// deploy/01_deploy_BestNft.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = await getChainId();
  console.log("deploying to: ", chainId);
  if (chainId !== localChainId) {
    console.warn("This is not local hardhat chain. beware.");
  }
  // deploy options https://github.com/wighawag/hardhat-deploy#deploymentsdeployname-options
  await deploy("BestNft", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  const theBestNftContract = await ethers.getContract("BestNft", deployer);
  console.log("deployed BestNft contract here: ", theBestNftContract.address);

  try {
    if (chainId !== localChainId) {
      console.log("will verify");
      await run("verify:verify", {
        address: theBestNftContract.address,
        contract: "contracts/BestNft.sol:BestNft",
        constructorArguments: [],
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["BestNft"];
