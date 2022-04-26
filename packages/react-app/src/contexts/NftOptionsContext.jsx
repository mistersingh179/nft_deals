import React, { createContext, useContext } from "react";
import { useNftOptions } from "../hooks";
import AuctionOptionsContext from "./AuctionOptionsContext";

const NftOptionsContext = createContext({});

export default NftOptionsContext;

export const NftOptionsProvider = props => {
  const { localProvider } = props;
  const { children } = props;
  const auctionOptions = useContext(AuctionOptionsContext);
  const nftOptions = useNftOptions(
    auctionOptions.nftContract,
    localProvider,
    auctionOptions.tokenId,
  );

  return (
    <NftOptionsContext.Provider value={nftOptions}>
      {children}
    </NftOptionsContext.Provider>
  );
};
