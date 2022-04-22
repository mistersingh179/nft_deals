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

  console.log("deployer is: ", deployer);

  await deploy("Reward", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 5,
  });

  const theRewardContract = await ethers.getContract("Reward", deployer);
  console.log("deployed Reward contract here: ", theRewardContract.address);

  const theAuctionFactoryContract = await ethers.getContract(
    "AuctionFactory",
    deployer
  );

  let result = await theAuctionFactoryContract.setRewardContractAddress(
    theRewardContract.address
  );
  let receipt = await result.wait();
  console.log(
    "setting reward address in auction factory contract status: ",
    receipt.status
  );

  result = await theRewardContract.setAuctionFactoryContractAddress(
    theAuctionFactoryContract.address
  );
  receipt = await result.wait();
  console.log(
    "setting auction factory contract address in reward contract status: ",
    receipt.status
  );

  try {
    if (chainId !== localChainId) {
      console.log("will verify");
      await run("verify:verify", {
        address: theRewardContract.address,
        contract: "contracts/Reward.sol:Reward",
        constructorArguments: [theAuctionFactoryContract.address],
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["Reward"];
