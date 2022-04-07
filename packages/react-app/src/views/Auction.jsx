import {Button, Card, DatePicker, Divider, Input, Progress, Slider, Space, Spin, Switch} from "antd";
import React, { useState, useEffect } from "react";
import {
  useParams
} from "react-router-dom";
import {ethers, utils} from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";
import {useContractReader} from "eth-hooks";
import NftImage from "../components/NftImage";
import {useBlockNumber} from "eth-hooks";

export default function Auction({
  purpose,
  address,
  userSigner,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  blockExplorer
}) {
  let { slug } = useParams();
  console.log('slug:', slug);
  const auctionContractAddress = slug

  const [tokenId, setTokenId] = useState("")
  const [nftContractAddress, setNftContractAddress] = useState("")
  useEffect(async () => {
    if(readContracts && readContracts.Auction && readContracts.Auction.interface){
      const auctionReader = readContracts.Auction.attach(auctionContractAddress);
      const nftContractAddress = await auctionReader.nftContract();
      setNftContractAddress(nftContractAddress.toString())
      const tokenId = await auctionReader.tokenId()
      setTokenId(tokenId.toString())
    }
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      // await tx(auctionWriter.doEmptyTransaction(), update => console.log(update));
    }
  }, [writeContracts, readContracts, auctionContractAddress])

  const [auctionOptions, setAuctionOptions] = useState({
    winningAddress: '',
    highestBid: '',
    expiration: '',
  });
  const updateAuctionOptions = (name, value) => {
    setAuctionOptions(prev => {
      return {...prev, [name]: value}
    })
  }
  useEffect(async () => {
    if(readContracts && readContracts.Auction && readContracts.Auction.interface){
      const auctionReader = readContracts.Auction.attach(auctionContractAddress);
      const winningAddress = await auctionReader.winningAddress();
      const highestBid = await auctionReader.highestBid();
      const expiration = await auctionReader.expiration();
      updateAuctionOptions('winningAddress', winningAddress)
      updateAuctionOptions('highestBid', highestBid.toString())
      updateAuctionOptions('expiration', expiration.toString())
    }
  }, [readContracts, auctionContractAddress]);

  const approve = () => { }
  const bid = async () => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(
        auctionWriter.bid({value: auctionOptions.highestBid + (300000000000000 * 10)}),
        update => console.log(update)
      );
    }
  }
  const fundsApproved = true

  const blockNumber = useBlockNumber(localProvider);

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Auction</h2>
        <Divider />
        Auction Address: {' '}
        <Address
          address={auctionContractAddress}
          ensProvider={mainnetProvider}
          fontSize={16}
          blockExplorer={blockExplorer}
        />
        <Divider />
        <NftImage {...{nftContractAddress, tokenId, localProvider}} width={200} height={200}/>
        <Divider />
        Current Highest Bid: {auctionOptions.highestBid}
        <Divider />
        Current Winner: {auctionOptions.winningAddress}
        <Divider />
        Expiration: {auctionOptions.expiration}
        <Divider />
        {/*<Button type={'primary'} onClick={approve} disabled={fundsApproved? false: true}>*/}
        {/*  Approve*/}
        {/*</Button>*/}
        {/*<Space style={{marginLeft:5, marginRight: 5}}>&nbsp;</Space>*/}
        <Button type={'primary'} onClick={bid}>
          Place Bid
        </Button>
        <Divider />
        Block Number: {blockNumber}
        <Divider />
      </div>
    </div>
  );
}
