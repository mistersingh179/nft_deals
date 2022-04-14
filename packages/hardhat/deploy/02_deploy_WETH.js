// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  if (chainId !== localChainId) {
    console.warn(
      "will not deploy WETH as the chain is not localhost (i.e. 31337)"
    );
    return;
  }

  await deploy("WETH", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 5,
  });

  const theWETHContract = await ethers.getContract("WETH", deployer);
  console.log("deployed WETH contract here: ", theWETHContract.address);

  try {
    if (chainId !== localChainId) {
      console.log("will verify");
      await run("verify:verify", {
        address: theWETHContract.address,
        contract: "contracts/WETH.sol:WETH",
        constructorArguments: [],
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["WETH"];
