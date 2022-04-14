import {Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch} from "antd";
import React, {useEffect, useState} from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import {Address, Balance, EtherInput, Events} from "../components";
import {useBlockNumber, useContractReader} from "eth-hooks";
import NftImage from "../components/NftImage";

export default function WETH({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const blockNumber = useBlockNumber(localProvider);

  const exchangeClickHandler = async () => {
    const result = await tx(writeContracts.WETH.deposit({value: swapAmount}))
    console.log('*** exchange result: ', result)
    if(result && result.wait){
      const receipt = await result.wait(1);
      console.log('*** exchange receipt: ', receipt)
      if(receipt.status == 1){
        setSwapAmount('')
      }
    }
  }

  const [swapAmount, setSwapAmount] = useState('')

  const wethBalance = useContractReader(readContracts, "WETH", "balanceOf", [address]);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 32 }}>
        <h2>WETH</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          WETH Contract Address:{' '}
          <Address
            address={readContracts && readContracts.WETH && readContracts.WETH.address}
            ensProvider={mainnetProvider}
            fontSize={16}
          />
          <Divider />
          <Input
            value={swapAmount}
            placeholder="Enter amount you want to swap in wei"
            onChange={e => setSwapAmount(e.target.value)}
          />
          <Button style={{margin: 8}} onClick={exchangeClickHandler} type={'primary'}>
            Exchange Eth for WETH
          </Button>
        </div>
        <Divider />
        Your WETH Balance: {wethBalance && utils.formatEther(wethBalance)}
        <Divider />
        Your ETH Balance: {yourLocalBalance && utils.formatEther(yourLocalBalance)}
        <Divider />
      </div>

      {/*<Events*/}
      {/*  contracts={readContracts}*/}
      {/*  contractName="WETH"*/}
      {/*  eventName="Transfer"*/}
      {/*  localProvider={localProvider}*/}
      {/*  mainnetProvider={mainnetProvider}*/}
      {/*  startBlock={1}*/}
      {/*/>*/}

    </div>
  );
}
