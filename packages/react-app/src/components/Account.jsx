import { Button } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";

import '../css/Account.css';
import BalanceTable from "./BalanceTable";

/** 
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    useBurner={boolean}
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
    isContract={boolean}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
**/

export default function Account({
  useBurner,
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
  readContracts
}) {
  const { currentTheme } = useThemeSwitcher();

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ position: "fixed", bottom: "24px", right: "24px" }}
          onClick={logoutOfWeb3Modal}
        >
          Disconnect Wallet
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ position: "fixed", bottom: "24px", right: "24px" }}
          onClick={loadWeb3Modal}
        >
          Connect Wallet
        </Button>,
      );
    }
  }

  const display = minimized ? (
    ""
  ) : (
    <div>
      {web3Modal && web3Modal.cachedProvider ? (
        <>
          <BalanceTable address={address} provider={localProvider}
                        price={price} readContracts={readContracts}
                        ensProvider={mainnetProvider} blockExplorer={blockExplorer}
          />
        </>
      ) : useBurner ? (
        ""
      ) : isContract ? (
        <>
          <BalanceTable address={address} provider={localProvider}
                        price={price} readContracts={readContracts}
                        ensProvider={mainnetProvider} blockExplorer={blockExplorer}
          />
        </>
      ) : (
        ""
      )}
      {useBurner && web3Modal && !web3Modal.cachedProvider ? (
        <>
          <BalanceTable address={address} provider={localProvider} price={price} readContracts={readContracts}/>
        </>
      ) : (
        <></>
      )}
    </div>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
