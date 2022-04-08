import {Button, Card, DatePicker, Divider, Input, Progress, Slider, Space, Spin, Switch} from "antd";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import {
  useParams
} from "react-router-dom";
import {ethers, utils} from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";
import {useContractReader} from "eth-hooks";
import NftImage from "../components/NftImage";
import {useBlockNumber} from "eth-hooks";
import Text from "antd/es/typography/Text";

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
    minimumBidIncrement: '',
    pendingRefund: 0
  });
  const updateAuctionOptions = (name, value) => {
    setAuctionOptions(prev => {
      return {...prev, [name]: value}
    })
  }
  const setupAuctionOptions = async () => {
    if(readContracts && readContracts.Auction && readContracts.Auction.interface){
      const auctionReader = readContracts.Auction.attach(auctionContractAddress);
      const winningAddress = await auctionReader.winningAddress();
      const highestBid = await auctionReader.highestBid();
      const expiration = await auctionReader.expiration();
      const minimumBidIncrement = await auctionReader.minimumBidIncrement();
      const pendingRefunds = await auctionReader.pendingRefunds(address);
      const extraPaymentRefunds = await auctionReader.extraPaymentRefunds(address);
      updateAuctionOptions('extraPaymentRefunds', extraPaymentRefunds.toString())
      updateAuctionOptions('pendingRefunds', pendingRefunds.toString())
      updateAuctionOptions('winningAddress', winningAddress)
      updateAuctionOptions('highestBid', highestBid.toString())
      updateAuctionOptions('expiration', expiration.toString())
      updateAuctionOptions('minimumBidIncrement', minimumBidIncrement.toString())
    }
  }
  useEffect(async () => {
    setupAuctionOptions()
  }, [readContracts, auctionContractAddress]);

  const approve = () => { }
  const bid = async () => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      const amountToSend = parseInt(auctionOptions.highestBid) + (parseInt(auctionOptions.minimumBidIncrement) * 10)
      console.log('amountToSend: ', amountToSend);
      await tx(
        auctionWriter.bid({value: amountToSend}),
        update => console.log(update)
      );
      setupAuctionOptions()
    }
  }
  const claimRefunds = async () => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(
        auctionWriter.claimLoosingBids(),
        update => console.log(update)
      );
      setupAuctionOptions()
    }
  }
  const claimExtraPayments = async () => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(
        auctionWriter.claimExtraPayments(),
        update => console.log(update)
      );
      setupAuctionOptions()
    }
  }
  const claimNft = async () => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(
        auctionWriter.claimNftUponWinning(),
        update => console.log(update)
      );
      setupAuctionOptions()
    }
  }
  const fundsApproved = true

  const blockNumber = useBlockNumber(localProvider);
  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 32 }}>
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
        Expiration: {moment(auctionOptions.expiration, 'X').fromNow()}
        <br/>
        {(moment().unix() > auctionOptions.expiration) && <Text type="danger">Expired</Text>}
        {(auctionOptions.expiration > 0) && (moment().unix() < auctionOptions.expiration) &&
          <Text type="success">Active</Text>}
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
        <Button
          style={{marginBottom:4}}
          onClick={claimNft}>
          Claim Nft upon Winning
        </Button>
        <Divider />
        Pending Refund: {auctionOptions.pendingRefunds} Wei
        <br/>
        <Button disabled={auctionOptions.pendingRefunds == 0 ? true : false}
          onClick={claimRefunds}>
          Claim Loosing Bids
        </Button>
        <Divider />
        Extra Payments Refund: {auctionOptions.extraPaymentRefunds} Wei
        <br/>
        <Button disabled={auctionOptions.extraPaymentRefunds == 0 ? true : false}
          onClick={claimExtraPayments}>
          Claim Extra Payments Refunds
        </Button>

      </div>
    </div>
  );
}
