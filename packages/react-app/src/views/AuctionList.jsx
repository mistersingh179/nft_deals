import {Button, Card, DatePicker, Divider, Input, Progress, Slider, Space, Spin, Switch, Table} from "antd";
import React, {useEffect, useState} from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import {Address, Balance, Events, AddressInput, EtherInput} from "../components";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json"
import Text from "antd/es/typography/Text";
import {useBlockNumber, useContractReader} from "eth-hooks";
import {Link} from "react-router-dom";
import NftImage from "../components/NftImage";
import moment from "moment";

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
  const [auctions, setAuctions] = useState([]);
  const [auctionsDataByAddress, setAuctionsDataByAddress] = useState({});
  const [auctionsArray, setAuctionsArray] = useState([]);

  const setupAuctionsData = async () => {
    if(readContracts && readContracts.AuctionFactory && readContracts.AuctionFactory){
      const auctionsCount = await readContracts.AuctionFactory.auctionsCount()
      const auctions = [];
      const auctionsDataByAddress = {};
      const auctionsArray = [];
      try{
        for(var i=0;i<auctionsCount;i++){
          const auctionContractAddress = await readContracts.AuctionFactory.auctions(i);
          const auctionCode = await localProvider.getCode(auctionContractAddress);
          if(auctionCode == '0x'){
            continue
          }
          auctions.push(auctionContractAddress);
          const auction = readContracts.Auction.attach(auctionContractAddress);
          const nftContract = await auction.nftContract();
          const tokenId = await auction.tokenId();
          const expiration = await auction.expiration();
          const highestBid = await auction.highestBid();
          const winningAddress = await auction.winningAddress();
          const _weHavePossessionOfNft = await auction._weHavePossessionOfNft();
          const _platformFeesAccumulated = await auction._platformFeesAccumulated();
          const _listerFeesAccumulated = await auction._listerFeesAccumulated();
          const minimumBidIncrement = await auction.minimumBidIncrement();
          const balance = await localProvider.getBalance(auctionContractAddress);
          const myErc721 = new ethers.Contract(
            nftContract,
            ERC721PresetMinterPauserAutoIdABI,
            userSigner
          );
          const nftApproval = await myErc721.getApproved(tokenId.toString());
          const weHaveApproval = (nftApproval == auctionContractAddress)
          const data = { nftContract, tokenId, expiration,
            highestBid, minimumBidIncrement, weHaveApproval,
          _weHavePossessionOfNft, winningAddress,
            balance, _platformFeesAccumulated, _listerFeesAccumulated }
          auctionsDataByAddress[auctionContractAddress] = { ...data}
          auctionsArray.push({
            ...data, key: auctionContractAddress
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
  }

  useEffect( async () => {
    setupAuctionsData()
  }, [readContracts, blockNumber]);

  const startAuction = async (auctionContractAddress, e) => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(auctionWriter.startAuction(), update => console.log(update));
    }
  };

  const claimNftWhenNoAction = async (auctionContractAddress, e) => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(auctionWriter.claimNftWhenNoAction(), update => console.log(update));
    }
  };

  const claimFinalBidAmount = async (auctionContractAddress, e) => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(auctionWriter.claimFinalBidAmount(), update => console.log(update));
    }
  };

  const claimListerFees = async (auctionContractAddress, e) => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(auctionWriter.claimListerFees(), update => console.log(update));
    }
  };

  const claimNftUponWinning = async (auctionContractAddress, e) => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(auctionWriter.claimNftWhenNoAction(), update => console.log(update));
    }
  };

  const approve = async (nftContractAddress, nftTokenId, auctionContractAddress, e) => {
    try {
      const myErc721 = new ethers.Contract(
        nftContractAddress,
        ERC721PresetMinterPauserAutoIdABI,
        userSigner
      );
      console.log('calling approve for tokenId:', nftTokenId, 'at contract: ', auctionContractAddress);
      const result = await myErc721.approve(auctionContractAddress, nftTokenId);
      console.log(result);
      let nftApproval = await myErc721.getApproved(nftTokenId);
      console.log('nft approval is with: ', nftApproval);
      const weHaveApproval = (nftApproval == auctionContractAddress)
      console.log('we have approval: ', weHaveApproval)
      setupAuctionsData()
    } catch (err) {
      console.error('error while getting approval');
      console.error(err);
    }
  }

  const columns = [

  {
    title: 'Address',
    dataIndex: 'key',
    key: 'key',
    render: (elem) => <Address address={elem} fontSize={14}></Address>
  },
  {
  title: 'Nft Image',
  dataIndex: 'tokenId',
  key: 'tokenId',
  render: (elem, record) => <NftImage
      nftContractAddress={record.nftContract} tokenId={record.tokenId}
      localProvider={localProvider} width={50} height={50}
    />
  },
  {
    title: 'Balance',
    dataIndex: 'key',
    key: 'key',
    render: (elem, record) => <span>Ξ{utils.formatEther(record.balance.toString())}</span>
  },
  {
    title: 'Platform Fees',
    dataIndex: '_platformFeesAccumulated',
    key: '_platformFeesAccumulated',
    render: (elem, record) => {return (
      <div>
        <div>Platform Fees: Ξ{utils.formatEther(record._platformFeesAccumulated.toString())}</div>
        <div>Lister Fees: Ξ{utils.formatEther(record._listerFeesAccumulated.toString())}</div>
      </div>
    )}
  },
  {
    title: 'Expiraton',
    dataIndex: 'expiration',
    key: 'expiration',
    render: (elem) => moment(parseInt(elem), 'X').fromNow()
  },
  {
    title: 'Highest Bid',
    dataIndex: 'highestBid',
    key: 'highestBid',
    render: (elem) => <span>Ξ{utils.formatEther(elem.toString())}</span>
  },
  {
    title: 'Min Bid Increment',
    dataIndex: 'minimumBidIncrement',
    key: 'minimumBidIncrement',
    render: (elem) => <span>Ξ{utils.formatEther(elem.toString())}</span>
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <div>
        <Button disabled={record.weHaveApproval || record.expiration > 0 ? true: false}
                style={{marginBottom:4}}
                onClick={approve.bind(this, record.nftContract, record.tokenId, record.key)}>
          Approve
        </Button>
        <br/>
        <Button disabled={(record.expiration > 0) || (record.weHaveApproval == false) ? true: false}
          style={{marginBottom:4}}
          onClick={startAuction.bind(this, record.key)}>
          Start Auction
        </Button>
        <br/>
        <Link to={`/Auction/${record.key}`}>
          <Button style={{marginBottom:4}} disabled={record.expiration == 0 ? true : false}>Open Auction</Button>
        </Link>
        <br/>
        <Button disabled={(record.expiration > 0) && (record._weHavePossessionOfNft == true) ? false: true}
          style={{marginBottom:4}}
          onClick={claimNftWhenNoAction.bind(this, record.key)}>
          Claim Nft Back
        </Button>
        <br/>
        <Button disabled={(record.expiration > 0) ? false: true}
          style={{marginBottom:4}}
          onClick={claimFinalBidAmount.bind(this, record.key)}>
          Claim Final Winning Bid
        </Button>
        <br/>
        <Button disabled={(record.expiration > 0) ? false: true}
          onClick={claimListerFees.bind(this, record.key)}>
          Claim Lister Fees
        </Button>
      </div>
    ),
  },
  ];

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 1500, margin: "auto", marginTop:32 }}>
        <h2>Auction List</h2>
        <Divider />
        <Table dataSource={auctionsArray} columns={columns} />
      </div>
    </div>
  );
}
