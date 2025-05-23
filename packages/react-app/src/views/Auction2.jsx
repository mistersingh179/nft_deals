import React from "react";
import { AuctionOptionsProvider } from "../contexts/";
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
    isPlaying,
    animateIt
  } = props;

  return (
    <AuctionOptionsProvider
      readContracts={readContracts}
      localProvider={localProvider}
      address={address}
      targetNetwork={targetNetwork}
      mainnetProvider={mainnetProvider}
    >
      <TheHeader
        address={address}
        mainnetProvider={mainnetProvider}
        blockExplorer={blockExplorer}
        readContracts={readContracts}
        writeContracts={writeContracts}
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
        tx={tx}
        isPlaying={isPlaying}
        showClaimIcon={true}
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
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            animateIt={animateIt}
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
    </AuctionOptionsProvider>
  );
};

export default Auction2;
