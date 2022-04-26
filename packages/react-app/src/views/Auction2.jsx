import React from "react";
import { AuctionOptionsProvider, NftOptionsProvider } from "../contexts/";
import {
  Footer,
  MainContentSection,
  NetworkDisplay,
  TheHeader,
  TopBannerRow,
  NftInteractionRow,
} from "../components";

const Auction2 = props => {
  const {
    NETWORKCHECK,
    localChainId,
    selectedChainId,
    targetNetwork,
    logoutOfWeb3Modal,
    USE_NETWORK_SELECTOR,
  } = props;

  const {
    address,
    localProvider,
    mainnetProvider,
    price,
    web3Modal,
    loadWeb3Modal,
    blockExplorer,
    readContracts,
    writeContracts,
    networkOptions,
    selectedNetwork,
    setSelectedNetwork,
    yourLocalBalance,
    tx,
  } = props;

  return (
    <AuctionOptionsProvider
      readContracts={readContracts}
      localProvider={localProvider}
      address={address}
    >
      <NftOptionsProvider localProvider={localProvider}>
        <TheHeader
          address={address}
          mainnetProvider={mainnetProvider}
          blockExplorer={blockExplorer}
          readContracts={readContracts}
          yourLocalBalance={yourLocalBalance}
          targetNetwork={targetNetwork}
          USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
          networkOptions={networkOptions}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          localProvider={localProvider}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          NETWORKCHECK={NETWORKCHECK}
          localChainId={localChainId}
          selectedChainId={selectedChainId}
        />

        <section id="hero" className="d-flex align-items-center">
          <div className={"container"}>
            <TopBannerRow />

            <NftInteractionRow
              readContracts={readContracts}
              localProvider={localProvider}
              address={address}
              writeContracts={writeContracts}
              tx={tx}
              mainnetProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              price={price}
            />
          </div>
        </section>

        <MainContentSection />

        <Footer />

        <NetworkDisplay
          NETWORKCHECK={NETWORKCHECK}
          localChainId={localChainId}
          selectedChainId={selectedChainId}
          targetNetwork={targetNetwork}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
        />
      </NftOptionsProvider>
    </AuctionOptionsProvider>
  );
};

export default Auction2;
