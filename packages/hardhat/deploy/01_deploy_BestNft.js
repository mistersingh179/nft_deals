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
  console.log(
    "deployed BestNft contract here: ",
    theBestNftContract.address
  );

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

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
