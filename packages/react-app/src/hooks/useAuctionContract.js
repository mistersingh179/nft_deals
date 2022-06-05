import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import bffAbi from "../abis/bffAbi.json";

const useAuctionContract = (
  readContracts,
  auctionContractAddress,
  localProvider,
) => {
  const [auctionContract, setAuctionContract] = useState();

  useEffect(async () => {
    if (
      readContracts &&
      readContracts.Auction &&
      auctionContractAddress &&
      localProvider
    ) {
      try {
        const contractCode = await localProvider.getCode(
          auctionContractAddress,
        );
        if (contractCode != "0x") {
          let auctionAbi;
          if (
            // bff and goro
            auctionContractAddress === process.env.REACT_APP_BFF_GOROS_ADDRESS
          ) {
            auctionAbi = bffAbi;
          } else {
            auctionAbi = readContracts.Auction.interface.format(
              utils.FormatTypes.full,
            );
          }
          const ac = new ethers.Contract(
            auctionContractAddress,
            auctionAbi,
            localProvider,
          );
          // const ac = readContracts.Auction.attach(auctionContractAddress);
          setAuctionContract(ac);
        }
      } catch (e) {
        console.error("unable to setup contract", e);
      }
    }
  }, [
    readContracts && readContracts.Auction,
    auctionContractAddress,
    localProvider,
  ]);

  return auctionContract;
};

export default useAuctionContract;
