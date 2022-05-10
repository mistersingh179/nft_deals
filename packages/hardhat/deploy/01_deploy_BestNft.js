// deploy/01_deploy_BestNft.js

const { ethers } = require("hardhat");

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
  console.log("deploying to: ", chainId);
  if (chainId !== localChainId) {
    console.warn("This is not local hardhat chain. beware.");
  }
  // deploy options
  // https://github.com/wighawag/hardhat-deploy#deploymentsdeployname-options
  await deploy("BestNft", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  const theBestNftContract = await ethers.getContract("BestNft", deployer);
  console.log("deployed BestNft contract here: ", theBestNftContract.address);

  const balance = await theBestNftContract.balanceOf(deployer);
  console.log("deployer : ", deployer, " has balance of: ", balance.toNumber());

  if (balance.toNumber() === 0) {
    console.log("will mint deployer a nft");
    const mintResult = await theBestNftContract.mint(deployer);
    console.log("mintResult: ", mintResult);
    const mintReceipt = await mintResult.wait();
    console.log("mintReceipt: ", mintReceipt);
  }

  try {
    if (chainId !== localChainId) {
      console.log("will verify");
      // await sleep(10000);
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
