import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, {useEffect, useState} from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";
import {useContractReader} from "eth-hooks";

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

  const nftBalance = useContractReader(
    readContracts,
    "BestNft",
    "balanceOf",
    [address],
    undefined,
    (val) => val.toString()
  );

  const mintNft = async () => {
    console.log("inside mintNft");
    const result = await tx(writeContracts.BestNft.mint(address));
    console.log("result is: ", result);
    console.log("finished mintNft");
  }

  const [nftUrls, setNftUrls] = useState([]);

  useEffect(async () => {
    console.log("in effect to get NFT's")
    let tokenId, tokenUri, tokenObj;
    const arr = []
    if(readContracts && readContracts.BestNft && readContracts.BestNft){
      for(let i=nftBalance-1;i >=0;i--){
        tokenId = await readContracts.BestNft.tokenOfOwnerByIndex(address, i);
        tokenId = tokenId.toString();
        console.log(tokenId);
        tokenUri = await readContracts.BestNft.tokenURI(tokenId);
        // console.log(tokenUri);
        tokenUri = tokenUri.replace('data:application/json;base64,', '')
        tokenObj = JSON.parse(atob(tokenUri))
        console.log(tokenObj);
        arr.push({url: tokenObj.image, id: tokenId});
      }
      setNftUrls(arr);
    }
  }, [nftBalance]);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 32 }}>
        <h2>Best NFT</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          Your Contract Address:
          <Address
            address={readContracts && readContracts.BestNft ? readContracts.BestNft.address : null}
            ensProvider={mainnetProvider}
            fontSize={16}
          />
          <Divider />
          Your NFT Balance: {nftBalance}
          <Divider />
          <Button style={{margin: 8}} onClick={mintNft}>
            Mint me a NFT
          </Button>
        </div>
        <Divider />
        <ul>
          {nftUrls.map(item => {
            return <li key={item.id}>
              <img width={100} height={100} src={item.url} /><br/>
              Token Id: {item.id}
            </li>;
          })}
        </ul>
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
