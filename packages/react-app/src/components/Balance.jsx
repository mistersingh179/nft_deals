import React, { useState } from "react";
import {useBalance, useContractReader} from "eth-hooks";
import Blockies from "react-blockies";

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
            <svg style={{width: "1.5em"}} viewBox="0 0 96 96" focusable="false" className="chakra-icon token-icon" data-id="icon">
                    <g>
                      <path d="M47.9898 0L47.3457 2.18771V65.6644L47.9898 66.307L77.4543 48.8902L47.9898 0Z"
                            fill="#DF5960"></path>
                      <path d="M47.9907 0L18.5254 48.8902L47.9907 66.307V35.4971V0Z" fill="#EE9398"></path>
                      <path d="M47.9899 71.8882L47.627 72.3309V94.9422L47.9899 96.0019L77.4726 54.4805L47.9899 71.8882Z"
                            fill="#DF5960"></path>
                      <path d="M47.9907 96.0019V71.8882L18.5254 54.4805L47.9907 96.0019Z" fill="#EE9398"></path>
                      <path d="M47.9902 66.3059L77.4548 48.8892L47.9902 35.4961V66.3059Z" fill="#CF373E"></path>
                      <path d="M18.5254 48.8892L47.9907 66.3059V35.4961L18.5254 48.8892Z" fill="#DF5960"></path>
                    </g>
            </svg>
          </Col>
          <Col span={4}><Space><Text >{token_type}</Text></Space></Col>
          <Col span={4} push={12}><Space><Text >{displayBalance}</Text></Space></Col>
        </Row>
      );
    } else {
      return (
        <Row type={"flex"} justify={"start"} style={{fontSize: props.size ? props.size : 16, padding: 8}}>
          <Col span={3}>
            <svg style={{width: "1.5em"}} viewBox="0 0 96 96" focusable="false" className="chakra-icon token-icon" data-id="icon">
                <g clip-path="url(#eth-clip-1)">
                  <path d="M47.9907 0L47.3467 2.18771V65.6644L47.9907 66.307L77.4553 48.8902L47.9907 0Z"
                        fill="#757576"></path>
                  <path d="M47.9912 0L18.5259 48.8902L47.9912 66.307V35.4971V0Z" fill="#8E8E8E"></path>
                  <path d="M47.9909 71.8882L47.6279 72.3309V94.9422L47.9909 96.0019L77.4735 54.4805L47.9909 71.8882Z"
                        fill="#5F5F5F"></path>
                  <path d="M47.9912 96.0019V71.8882L18.5259 54.4805L47.9912 96.0019Z" fill="#8E8E8E"></path>
                  <path d="M47.9912 66.3059L77.4558 48.8892L47.9912 35.4961V66.3059Z" fill="#5F5F5F"></path>
                  <path d="M18.5259 48.8892L47.9912 66.3059V35.4961L18.5259 48.8892Z" fill="#757576"></path>
                </g>
                <defs>
                  <clipPath id="eth-clip-1">
                    <rect width="96" height="96" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
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
