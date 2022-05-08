const { ethers } = require("hardhat");
// eslint-disable-next-line max-len
const AuctionArtifact = require("../artifacts/contracts/Auction.sol/Auction.json");

const main = async () => {
  console.log(process.env.RINKEBY_INFURA_KEY);
  console.log(process.env.RINKEBY_DEPLOYER_PRIV_KEY);

  const provider = ethers.getDefaultProvider(
    "https://rinkeby.infura.io/v3/4dd76a24cb4540f0aa51b55a3f9a4529",
    {
      etherscan: process.env.ETHERSCAN_API_KEY,
      infura: {
        projectId: process.env.RINKEBY_INFURA_KEY,
        projectSecret: process.env.RINKEBY_DEPLOYER_PRIV_KEY,
      },
      alchemy: process.env.ALCHEMY_API_KEY,
      pocket: "-",
      ankr: "-",
    },
  );
  console.log("polling: ", provider.polling, provider.pollingInterval);
  // console.log("auctionArtifact: ", AuctionArtifact);
  // const auctionInterface = new ethers.utils.Interface(AuctionArtifact.abi);
  const auctionAddress = "0x6A358FD7B7700887b0cd974202CdF93208F793E2";
  const auction = new ethers.Contract(
    auctionAddress,
    AuctionArtifact.abi,
    provider,
  );
  // const auction = await ethers.getContractAt("Auction", auctionAddress);
  console.log("monitoring bids for: ", auction.address);

  const bidHandler = (
    fromAddress,
    previousWinnerAddress,
    amount,
    secondsLeftInAuction,
  ) => {
    console.log("got bid: ");
    console.log("from: ", fromAddress);
    console.log("previousWinnerAddress: ", previousWinnerAddress);
    console.log("amount: ", amount.toString());
    console.log("secondsLeftInAuction: ", secondsLeftInAuction.toString());
    console.log("polling: ", provider.polling(), provider.pollingInterval());
  };

  auction.on("Bid", bidHandler);
  console.log("polling: ", provider.polling, provider.pollingInterval);

};

main();
