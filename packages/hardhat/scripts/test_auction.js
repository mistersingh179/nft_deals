const hre = require("hardhat");
// eslint-disable-next-line max-len
const hardhatContracts = require("../../react-app/src/contracts/hardhat_contracts.json");

const {
  ethers,
  config: { networks },
} = hre;

const init = async () => {
  const contracts = hardhatContracts["1"].mainnet.contracts;
  const address = contracts.Auction.address;
  // const address = "0xf2c50dA3C1462873d8604a2E9Dc92FcC6f80924a";
  console.log("address: ", address);

  const abi = contracts.Auction.abi;
  // console.log("abi: ", abi);

  const provider = ethers.getDefaultProvider(networks.mainnet.url);
  // console.log("provider: ", provider);
  const auction = new ethers.Contract(address, abi, provider);
  // console.log("auction: ", auction);
  try {
    const ans = await auction.getAllData(ethers.constants.AddressZero);
    console.log("answer starts ***");
    console.log(ans);
    console.log("answer ends ***");
  } catch (e) {
    console.log(e);
  }
};

init();
