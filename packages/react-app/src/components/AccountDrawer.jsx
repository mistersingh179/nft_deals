import {Address, FaucetHint, NetworkDisplay, NetworkSwitch} from "./index";
import {Button, Col, Drawer, Row, Space, Typography} from "antd";
import {ReactComponent as WEthLogo} from "../img/wrapped_ethereum_icon.svg";
import {ReactComponent as EthLogo} from "../img/ethereum_icon.svg";
import {ethers} from "ethers";
import React, {useState} from "react";
import {useContractReader} from "eth-hooks";
import Blockies from "react-blockies";

const { Text } = Typography;

const AccountDrawer = (props) => {
  const {address, mainnetProvider, blockExplorer, readContracts, yourLocalBalance} = props
  const {NETWORKCHECK,localChainId,selectedChainId,targetNetwork,logoutOfWeb3Modal,USE_NETWORK_SELECTOR} = props
  const {networkOptions, selectedNetwork, setSelectedNetwork} = props
  const {localProvider} = props
  const [showDrawer, setShowDrawer] = useState(false);

  let wethBalance = useContractReader(readContracts, "WETH", "balanceOf", [address]);
  if(wethBalance){
    wethBalance = parseFloat(ethers.utils.formatEther(wethBalance)).toFixed(4)
  }

  let ethBalance = yourLocalBalance;
  if(ethBalance){
    ethBalance = parseFloat(ethers.utils.formatEther(yourLocalBalance)).toFixed(4)
  }
  const rewards = useContractReader(readContracts, "Reward", "rewards", [address]);

  return (
    <>
      {address && <a href={'javascript:void(0)'} onClick={evt => setShowDrawer(true)}>
        <Blockies seed={address.toLowerCase()} size={8} scale={4}/>
      </a>}

      <Drawer
          title="Your Wallet"
          placement={'right'}
          width={400}
          onClose={(evt) => setShowDrawer(false)}
          visible={showDrawer}
        >
          <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
          <div style={{ fontSize: 16, fontWeight: 500, padding: "2em 0 0.5em 0" }}>
            Funds Available
          </div>
          <div style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: "initial",
            borderColor: "#dde1e6",
            padding: "1rem",
          }}>
            <Row type={"flex"} justify={"start"} style={{fontSize: 16, padding: 8}}>
              <Col span={3}>
                <WEthLogo />
              </Col>
              <Col span={4}><Space><Text >WETH</Text></Space></Col>
              <Col span={4} push={12}>
                <Space>
                  <Text>
                    {wethBalance}
                  </Text>
                </Space>
              </Col>
            </Row>
            <Row type={"flex"} justify={"start"} style={{fontSize: 16, padding: 8}}>
              <Col span={3}>
                <EthLogo />
              </Col>
              <Col span={4}><Space><Text >ETH</Text></Space></Col>
              <Col span={4} push={12}>
                <Space>
                  <Text>
                    {ethBalance}
                  </Text>
                </Space>
              </Col>
            </Row>
          </div>
          <div style={{
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: "initial",
            borderColor: "#dde1e6",
            padding: "1rem",
            textAlign: "right",
          }}>
            <a href={"https://app.uniswap.org/#/swap?chain=mainnet"}>Convert ETH / WETH</a>
          </div>
          <div>
            Rewards Contract: <Address address={readContracts && readContracts.Reward && readContracts.Reward.address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
            Rewards accumulated: {rewards ? ethers.utils.commify(rewards) : 0}
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
        </Drawer>
    </>
  )
}

export default AccountDrawer