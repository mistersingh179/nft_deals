import {Button, Card, DatePicker, Divider, Input, Progress, Slider, Space, Spin, Switch, Table} from "antd";
import React, {useEffect, useState} from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import {Address, Balance, Events, AddressInput, EtherInput} from "../components";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json"
import Text from "antd/es/typography/Text";
import {useBlockNumber, useContractReader} from "eth-hooks";
import {Link} from "react-router-dom";

console.log(ERC721PresetMinterPauserAutoIdABI);

const { ethers } = require("ethers");

export default function AuctionList({
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
  blockExplorer,
}) {
  const blockNumber = useBlockNumber(localProvider);
  const auctionsCount = useContractReader(
    readContracts,
    "AuctionFactory",
    "auctionsCount",
    [],
    undefined,
    (val) => val.toString()
  );
  const [auctions, setAuctions] = useState([]);
  const [auctionsDataByAddress, setAuctionsDataByAddress] = useState({});
  const [auctionsArray, setAuctionsArray] = useState([]);

  useEffect( async () => {
    if(readContracts && readContracts.AuctionFactory && readContracts.AuctionFactory.auctions){
      const auctions = [];
      const auctionsDataByAddress = {};
      const auctionsArray = [];
      try{
        for(var i=0;i<auctionsCount;i++){
          const auctionContractAddress = await readContracts.AuctionFactory.auctions(i);
          auctions.push(auctionContractAddress);
          const auction = readContracts.Auction.attach(auctionContractAddress);
          const nftContract = await auction.nftContract();
          const tokenId = (await auction.tokenId());
          const expiration = await auction.expiration();
          const highestBid = await auction.highestBid();
          const minimumBidIncrement = await auction.minimumBidIncrement();
          auctionsDataByAddress[auctionContractAddress] = { nftContract, tokenId, expiration,
            highestBid, minimumBidIncrement}
          auctionsArray.push({
            nftContract, tokenId, expiration,
            highestBid, minimumBidIncrement, key: auctionContractAddress
          })
        }
      }catch(e){
        console.error('unable to get auction: ', e)
      }
      setAuctionsDataByAddress(auctionsDataByAddress);
      setAuctionsArray(auctionsArray);
      setAuctions(auctions);
      console.log('auctionsDataByAddress: ', auctionsDataByAddress);
      console.log('auctions: ', auctions);
      console.log('auctionsArray: ', auctionsArray);
    }
  }, [readContracts, auctionsCount]);

  const startAuction = async (auctionContractAddress, e) => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(auctionWriter.startAuction(), update => console.log(update));
    }
  }

  const columns = [
  {
    title: 'NFT Contract Address',
    dataIndex: 'nftContract',
    key: 'nftContract',
        render: (elem) => <Address address={elem} fontSize={14}></Address>
  },
  {
    title: 'Token Id',
    dataIndex: 'tokenId',
    key: 'tokenId',
    render: (elem) => elem.toString()
  },
  {
    title: 'expiration',
    dataIndex: 'expiration',
    key: 'expiration',
    render: (elem) => elem.toString()
  },
  {
    title: 'highestBid',
    dataIndex: 'highestBid',
    key: 'highestBid',
    render: (elem) => elem.toString()
  },
  {
    title: 'minimumBidIncrement',
    dataIndex: 'minimumBidIncrement',
    key: 'minimumBidIncrement',
    render: (elem) => elem.toString()
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Link to={`/Auction/${record.key}`}>Open Auction</Link>
        <Button onClick={startAuction.bind(this, record.key)}>
          Start Auction
        </Button>
      </Space>
    ),
  },
  ];

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 900, margin: "auto", marginTop: 64 }}>
        <h2>Auction List</h2>
        <Divider />
        <Table dataSource={auctionsArray} columns={columns} />
      </div>
    </div>
  );
}
