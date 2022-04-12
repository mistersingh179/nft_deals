import {Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch} from "antd";
import React, {useEffect, useState} from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";
import {useBlockNumber, useContractReader} from "eth-hooks";
import NftImage from "../components/NftImage";

export default function BestNFT({
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
  const [newPurpose, setNewPurpose] = useState("loading...");
  const blockNumber = useBlockNumber(localProvider);
  console.log('*** address: ', address)
  const mintNft = async () => {
    console.log("inside mintNft");
    const result = await tx(writeContracts.BestNft.mint(address));
    console.log("result is: ", result);
    console.log("finished mintNft");
  }

  const [nftBalance, setNftBalance] = useState([]);
  const [nftTokens, setNftTokens] = useState([]);

  const getNftBalanceAndTokens = async () => {
    let tokenId, tokenUri, tokenObj;
    const arr = []
    if(readContracts && readContracts.BestNft && readContracts.BestNft){
      const nftBalance = await readContracts.BestNft.balanceOf(address);
      setNftBalance(nftBalance.toString())

      for (let i = nftBalance - 1; i >= 0; i--) {
        tokenId = await readContracts.BestNft.tokenOfOwnerByIndex(address, i);
        tokenId = tokenId.toString();
        arr.push(tokenId);
      }
      setNftTokens(arr);
    }
  }

  useEffect(async () => {
    try {
      await getNftBalanceAndTokens()
    }
    catch(e){
      console.error('unable to get nft urls and balance')
      console.error(e)
    }
  }, [blockNumber]);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 32 }}>
        <h2>Best NFT</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          NFT Contract Address:{' '}
          <Address
            address={readContracts && readContracts.BestNft && readContracts.BestNft.address}
            ensProvider={mainnetProvider}
            fontSize={16}
          />
          <Divider />
          <Button style={{margin: 8}} onClick={mintNft}>
            Mint me a NFT
          </Button>
        </div>
        <Divider />
        <List
          header={<div>Your NFT's</div>}
          footer={''}
          bordered
          dataSource={nftTokens}
          renderItem={item => (
            <List.Item>
              <NftImage nftContractAddress={readContracts && readContracts.BestNft && readContracts.BestNft.address}
                tokenId={item}
                localProvider={localProvider}
                height={100}
                style={{margin: 'auto'}}
              />
            </List.Item>
          )}
        />
        <Divider />
        Your NFT Balance: {nftBalance}
        <Divider />
      </div>

      {/*<Events*/}
      {/*  contracts={readContracts}*/}
      {/*  contractName="BestNft"*/}
      {/*  eventName="Transfer"*/}
      {/*  localProvider={localProvider}*/}
      {/*  mainnetProvider={mainnetProvider}*/}
      {/*  startBlock={1}*/}
      {/*/>*/}

    </div>
  );
}
