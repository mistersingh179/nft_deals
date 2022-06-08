/* eslint-disable max-len */

const hre = require("hardhat");
const hardhatContracts = require("../../react-app/src/contracts/hardhat_contracts.json");
const { Interface, FormatTypes } = require("ethers/lib/utils");

const {
  ethers,
  config: { networks },
} = hre;

const init = async () => {
  const contracts = hardhatContracts["1"].mainnet.contracts;
  const address = contracts.Auction.address;
  // const address = "0xf2c50dA3C1462873d8604a2E9Dc92FcC6f80924a";
  console.log("address: ", address);

  // https://docs.ethers.io/v5/api/utils/abi/formats/#abi-formats--human-readable-abi
  let abi;
  abi = contracts.Auction.abi;
  // console.log("abi: ", abi);
  const iface = new Interface(abi);
  const outputInHumanReadableAbi = iface.format(FormatTypes.full);
  // console.log("*** outputInHumanReadableAbi: *** \n", outputInHumanReadableAbi);
  // console.log(iface.getFunction("calculateFeeFromBasisPoints")); // gives fragement of this function
  console.log(iface.getSighash("calculateFeeFromBasisPoints"));
  console.log(
    iface.getSighash("calculateFeeFromBasisPoints(uint256, uint256)"),
  );
  console.log(
    iface.encodeFunctionData("calculateFeeFromBasisPoints", [100, 200]),
  );
  console.log(iface.encodeFunctionData("bid"));

  return;

  // Solidity JSON ABI

  abi = [
    {
      inputs: [],
      name: "secondsLeftInAuction",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "bp",
          type: "uint256",
        },
      ],
      name: "calculateFeeFromBasisPoints",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
  ];

  // A Human-Readable ABI is simple an array of strings, where each string is the Solidity signature.

  // abi = [
  //   "function secondsLeftInAuction() public view returns(uint256)",
  //   "function calculateFeeFromBasisPoints(uint, uint) pure public returns(uint)",
  // ];

  const provider = ethers.getDefaultProvider(networks.mainnet.url);
  // console.log("provider: ", provider);

  const auction = new ethers.Contract(address, abi, provider);
  // console.log("auction: ", auction);
  // console.log(auction.interface);

  try {
    const encodedData = iface.encodeFunctionData(
      "calculateFeeFromBasisPoints",
      [300, 500],
    );
    console.log(encodedData);
    const ans = await auction.calculateFeeFromBasisPoints(300, 500);
    console.log("answer starts ***");
    console.log(ans, ans.toString());
    console.log("answer ends ***");

    auction.call("0x1234");
  } catch (e) {
    console.log(e);
  }
};

init();
