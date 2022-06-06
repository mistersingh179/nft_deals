import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import bffAbi from "../abis/bffAbi.json";

const useAuctionContract = (
  readOrWriteContracts,
  auctionContractAddress,
  localProvider,
) => {
  const [auctionContract, setAuctionContract] = useState();

  useEffect(async () => {
    if (
      readOrWriteContracts &&
      readOrWriteContracts.Auction &&
      auctionContractAddress &&
      localProvider
    ) {
      try {
        const contractCode = await localProvider.getCode(
          auctionContractAddress,
        );
        if (contractCode != "0x") {
          let ac;
          // check for bff/goro vs others
          if (
            auctionContractAddress === process.env.REACT_APP_BFF_GOROS_ADDRESS
          ) {
            ac = new ethers.Contract(
              auctionContractAddress,
              bffAbi,
              localProvider, // only read access
            );
          } else {
            ac = readOrWriteContracts.Auction.attach(auctionContractAddress);
          }

          setAuctionContract(ac);
        }
      } catch (e) {
        console.error("unable to setup contract", e);
      }
    }
  }, [
    readOrWriteContracts && readOrWriteContracts.Auction,
    auctionContractAddress,
    localProvider,
  ]);

  return auctionContract;
};

export default useAuctionContract;
