import React, { useState } from "react";
import {useBalance, useContractReader} from "eth-hooks";
import { ReactComponent as EthLogo } from '../img/ethereum_icon.svg';
import { ReactComponent as WEthLogo } from '../img/wrapped_ethereum_icon.svg';

import { Skeleton, Typography, Space, Row, Col } from "antd";
const { Text } = Typography;

const { utils } = require("ethers");

/** 
  ~ What it does? ~

  Displays a balance of given address in ether & dollar

  ~ How can I use? ~

  <Balance
    address={address}
    provider={mainnetProvider}
    price={price}
  />

  ~ If you already have the balance as a bignumber ~
  <Balance
    balance={balance}
    price={price}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to given address
  - Provide provider={mainnetProvider} to access balance on mainnet or any other network (ex. localProvider)
  - Provide price={price} of ether and get your balance converted to dollars
**/

export default function Balance(props) {
  const [dollarMode, setDollarMode] = useState(false);
  const token_type = props.token_type;
  //const balance = useBalance(props.provider, props.address);
  const balance = useContractReader(
    props.readContracts,
    "WETH",
    "balanceOf",
    [props.address]
  );

  // console.log('*** WETH', balance && utils.formatEther(balance), ' at :', props.address, props.readContracts)

  let floatBalance = parseFloat("0.00");
  let usingBalance = balance;

  if (typeof props.balance !== "undefined") usingBalance = props.balance;
  if (typeof props.value !== "undefined") usingBalance = props.value;

  if (usingBalance) {
    const etherBalance = utils.formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);
  let denomination = "WETH ";

  const price = props.price || props.dollarMultiplier || 1;

  // Added complexity. Do without until further notice.
  // if (dollarMode) {
  //   displayBalance = (floatBalance * price).toFixed(2);
  //   denomination = "$ ";
  // }

  let denomAndBalance = denomination + displayBalance;

  function BalanceRow(props) {
    if (token_type == "WETH") {
      return (
        <Row type={"flex"} justify={"start"} style={{fontSize: props.size ? props.size : 16, padding: 8}}>
          <Col span={3}>
            <WEthLogo />
          </Col>
          <Col span={4}><Space><Text >{token_type}</Text></Space></Col>
          <Col span={4} push={12}><Space><Text >{displayBalance}</Text></Space></Col>
        </Row>
      );
    } else {
      return (
        <Row type={"flex"} justify={"start"} style={{fontSize: props.size ? props.size : 16, padding: 8}}>
          <Col span={3}>
            <EthLogo />
          </Col>
          <Col span={4}><Space><Text >{token_type}</Text></Space></Col>
          <Col span={4} push={12}><Space><Text >{displayBalance}</Text></Space></Col>
        </Row>
      );
    }
  }

  return (
      <BalanceRow/>
  );
}
