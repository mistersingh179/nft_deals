import React, { useState } from "react";
import Address from "./Address";
import Balance from "./Balance";

import { Skeleton, Typography, Space, Row, Col } from "antd";
const { Text } = Typography;

const { utils } = require("ethers");

export default function BalanceTable(props) {

  const displayTable = props.minimized ? (
      ""
    ) : (
      <>
        <Address address={props.address} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} />

        <div style={{ fontSize: 16, fontWeight: 500, padding: "2em 0 0.5em 0" }}>Funds Available</div>
        <div style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderImage: "initial",
          borderColor: "#dde1e6",
          padding: "1rem",
        }}>
            <Balance token_type="ETH" address={props.address} provider={props.localProvider} price={props.price} readContracts={props.readContracts} />
            <Balance token_type="WETH" address={props.address} provider={props.localProvider} price={props.price} readContracts={props.readContracts} />
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
      </>
  );

  return (
    <div>
      {displayTable}
    </div>
  );
}