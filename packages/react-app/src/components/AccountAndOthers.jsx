import {Account, FaucetHint, NetworkSwitch} from "./index";
import {ethers} from "ethers";
import React, { useState } from 'react';

const AccountAndOthers = props => {
  const {useBurner, address, localProvider, userSigner,
    mainnetProvider, price, web3Modal, loadWeb3Modal,
    logoutOfWeb3Modal, blockExplorer, readContracts,
    USE_NETWORK_SELECTOR, networkOptions,
    selectedNetwork, setSelectedNetwork,
    USE_BURNER_WALLET, yourLocalBalance, targetNetwork
  } = props;

  return (

      <div style={{}}>
        <div style={{ alignItems: "center" }}>
            <Account
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
              readContracts={readContracts}
            />
        </div>
        <div style={{ position: "fixed", bottom: "24px" }}>
          {USE_NETWORK_SELECTOR && (
            <div >
              <NetworkSwitch
                networkOptions={networkOptions}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
              />
            </div>
          )}
          {yourLocalBalance.lte(ethers.BigNumber.from("0")) && targetNetwork.name.indexOf("local") == 0 && (
              <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
          )}
        </div>
      </div>
  )
}

export default AccountAndOthers