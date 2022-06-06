import React, { createContext } from "react";
import { useAuctionOptions } from "../hooks";
import { useParams } from "react-router-dom";

const AuctionOptionsContext = createContext({});

export default AuctionOptionsContext;

export const AuctionOptionsProvider = props => {
  const { children } = props;
  const { readContracts, localProvider, address } = props;
  const { targetNetwork, mainnetProvider } = props;

  const { slug: auctionContractAddress } = useParams();
  const auctionOptions = useAuctionOptions(
    readContracts,
    auctionContractAddress,
    localProvider,
    address,
    targetNetwork,
    mainnetProvider,
  );
  window.auctionOptions = auctionOptions;
  return (
    <AuctionOptionsContext.Provider value={auctionOptions}>
      {children}
    </AuctionOptionsContext.Provider>
  );
};
