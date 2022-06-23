import { useEffect, useState } from "react";
import hardhatContracts from "../contracts/hardhat_contracts.json";
import bffAbi from "../abis/bffAbi.json";
import { chainToName, NETWORKS } from "../constants";
import { ethers } from "ethers";

// let chainsToShow = "1,137";
// let chainsToShow = "1,4,137,31337,80001";
let chainsToShow = process.env.REACT_APP_CHAINS_TO_SHOW || "";
chainsToShow = chainsToShow.split(",")

const useAllAuctionsData = address => {
  const [allAuctionsData, setAllAuctionsData] = useState([]);
  const getAllData = async () => {
    console.log("*** getting all auctions data");
    const newData = [];
    for (const chainId of Object.keys(hardhatContracts)) {
      if (chainsToShow.find(item => item === chainId) === undefined) {
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
        // goro or bff
        let abi;
        if (auctionAddress === process.env.REACT_APP_BFF_GOROS_ADDRESS) {
          abi = bffAbi;
        } else {
          abi = auctionJson.abi;
        }
        const auction = new ethers.Contract(auctionAddress, abi, provider);
        try{
          let allData = await auction.getAllData(address);
          allData = {
            ...allData,
            chainId: chainId,
            chainName: chainToName[chainId],
            contractAddress: auctionAddress,
          };
          newData.push(allData);
        }catch(e){
          console.error("*** unable to get data for auction: ", auctionAddress, e)
        }
      }
    }
    setAllAuctionsData(newData);
  };
  useEffect(getAllData, [address]);
  return allAuctionsData;
};

export default useAllAuctionsData;
