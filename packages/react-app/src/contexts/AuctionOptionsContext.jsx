import React, { createContext } from "react";
import { useAuctionOptions } from "../hooks";

const AuctionOptionsContext = createContext({});

export default AuctionOptionsContext;

export const AuctionOptionsProvider = props => {
  const { children } = props;
  const { readContracts, auctionContractAddress, localProvider } = props;
  const auctionOptions = useAuctionOptions(readContracts, auctionContractAddress, localProvider);

  return (
    <AuctionOptionsContext.Provider value={auctionOptions}>
      {children}
    </AuctionOptionsContext.Provider>
  );
};
