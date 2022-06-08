/* eslint-disable max-len */

const hre = require("hardhat");
const hardhatContracts = require("../../react-app/src/contracts/hardhat_contracts.json");
const { Interface, FormatTypes } = require("ethers/lib/utils");

const {
  ethers,
  config: { networks },
} = hre;

const init = async () => {
  const contracts = hardhatContracts["137"].polygon.contracts;
  // const address = contracts.BestNft.address;
  const address = "0x36daf3be531ca494561a4560453b4e04f560ffbb";
  console.log("address: ", address);

  // https://docs.ethers.io/v5/api/utils/abi/formats/#abi-formats--human-readable-abi

  const provider = ethers.getDefaultProvider(networks.polygon.url);
  // console.log("provider: ", provider);

  const bestNft = new ethers.Contract(address, contracts.BestNft.abi, provider);
  // console.log("bestNft: ", bestNft);

  try {
    console.log("answer starts ***");
    let ans;
    ans = await bestNft.ownerOf(2);
    console.log(ans, ans.toString());
    ans = await bestNft.ownerOf(2);
    console.log(ans, ans.toString());
    ans = await bestNft.balanceOf("0x6B09B3C63B72fF54Bcb7322B607E304a13Fba72B");
    console.log(ans, ans.toString());
    ans = await bestNft.baseURI();
    console.log(ans, ans.toString());
    console.log("answer ends ***");
  } catch (e) {
    console.log(e);
  }
};

init();
