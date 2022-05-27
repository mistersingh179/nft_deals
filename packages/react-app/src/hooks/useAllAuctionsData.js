import { useEffect, useState } from "react";
import hardhatContracts from "../contracts/hardhat_contracts.json";
import { chainToName, NETWORKS } from "../constants";
import { ethers } from "ethers";

let chainsToShow = process.env.REACT_APP_CHAINS_TO_SHOW || "";
chainsToShow = chainsToShow.split(",")

const useAllAuctionsData = address => {
  const [allAuctionsData, setAllAuctionsData] = useState([]);
  const getAllData = async () => {
    console.log("*** getting all auctions data");
    const newData = [];
    for (const chainId of Object.keys(hardhatContracts)) {
      if(chainsToShow.find(item => item === chainId) === undefined){
        continue;
      }
      const auctionFactoryJson =
        hardhatContracts[chainId][chainToName[chainId]].contracts[
          "AuctionFactory"
        ];
      const provider = new ethers.providers.StaticJsonRpcProvider(
        NETWORKS[chainToName[chainId]].rpcUrl,
      );
      const auctionFactory = new ethers.Contract(
        auctionFactoryJson.address,
        auctionFactoryJson.abi,
        provider,
      );
      const auctions = await auctionFactory.auctions();
      const auctionJson =
        hardhatContracts[chainId][chainToName[chainId]].contracts["Auction"];
      for (let auctionAddress of auctions) {
        const auction = new ethers.Contract(
          auctionAddress,
          auctionJson.abi,
          provider,
        );
        let allData = await auction.getAllData(address);
        allData = {
          ...allData,
          chainId: chainId,
          chainName: chainToName[chainId],
          contractAddress: auctionAddress,
        };
        newData.push(allData);
      }
    }
    setAllAuctionsData(newData);
  };
  useEffect(getAllData, [address]);
  return allAuctionsData;
};

export default useAllAuctionsData;
