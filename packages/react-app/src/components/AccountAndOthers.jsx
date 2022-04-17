import {Account, FaucetHint, NetworkSwitch} from "./index";
import {ethers} from "ethers";

const AccountAndOthers = props => {
  const {useBurner, address, localProvider, userSigner,
    mainnetProvider, price, web3Modal, loadWeb3Modal,
    logoutOfWeb3Modal, blockExplorer, readContracts,
    USE_NETWORK_SELECTOR, networkOptions,
    selectedNetwork, setSelectedNetwork,
    USE_BURNER_WALLET, yourLocalBalance, targetNetwork
  } = props
  return (

  <div style={{ position: "fixed", textAlign: "right", right: 0, top: 5, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          {USE_NETWORK_SELECTOR && (
            <div style={{ marginRight: 20 }}>
              <NetworkSwitch
                networkOptions={networkOptions}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
              />
            </div>
          )}
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
        {yourLocalBalance.lte(ethers.BigNumber.from("0")) && targetNetwork.name.indexOf("local") == 0 && (
          <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
        )}
      </div>
  )
}

export default AccountAndOthers