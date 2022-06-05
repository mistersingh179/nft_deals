import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Progress,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Switch,
} from 'antd'
import React, {useEffect, useState} from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import {Address, Balance, Events, AddressInput, EtherInput, TopNavMenu} from "../components";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json"
import Text from "antd/es/typography/Text";
import {useBlockNumber, useContractReader} from "eth-hooks";
import NftImage from "../components/NftImage";
import {useLocation} from "react-router-dom";

console.log(ERC721PresetMinterPauserAutoIdABI);

const { ethers } = require("ethers");

export default function AuctionFactory({
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
  const [newPurpose, setNewPurpose] = useState("loading...");
  const [nftContractAddress, setNftContractAddress] = useState("");
  const [nftTokenId, setNftTokenId] = useState("");
  const [nftOwner, setNftOwner] = useState("");
  const [auctionOptions, setAuctionOptions] = useState({
    startingBid: '1000000000000000000',
    auctionTimeIncrementOnBid: (24*60*60)+"",
    minimumBidIncrement: '0',
    auctionFeeType: '1',
    staticFeeInBasisPoints: '10000',
  });
  const [auctionFactoryAddress, setAuctionFactoryAddress] = useState('');
  const blockNumber = useBlockNumber(localProvider);

  const createAuction = async () => {
    await tx(
      writeContracts.AuctionFactory.createAuction(
        nftTokenId,
        nftContractAddress,
        auctionOptions.startingBid,
        auctionOptions.auctionTimeIncrementOnBid,
        auctionOptions.minimumBidIncrement,
        auctionOptions.auctionFeeType,
        auctionOptions.staticFeeInBasisPoints,
      ), update => {
        console.log('*** create auction: ', update);
      }
    )

  }

  const updateAuctionOptions = (name, value) => {
    setAuctionOptions(prev => {
      return {...prev, [name]: value}
    })
  }

  const setupNftOwner = async (addr, id) => {
    if(addr && id){
      const myErc721 = new ethers.Contract(
        addr,
        ERC721PresetMinterPauserAutoIdABI,
        localProvider
      );
      try{
        let nftOwner = await myErc721.ownerOf(id);
        setNftOwner(nftOwner);
      }catch(e) {
        setNftOwner('')
      }
    }
  }

  useEffect(async () => {
    try{
      await setupNftOwner(nftContractAddress, nftTokenId);
    }catch(e){
      console.error('unable to get nft owner');
      console.error(e);
    }
  }, [nftContractAddress, nftTokenId])

  const approve = async () => {
    try{
      if(readContracts && readContracts.AuctionFactory && readContracts.AuctionFactory.address){
        const myErc721 = new ethers.Contract(
          nftContractAddress,
          ERC721PresetMinterPauserAutoIdABI,
          userSigner
        );
        const result = await myErc721.approve(readContracts.AuctionFactory.address, nftTokenId);
        let nftApproval = await myErc721.getApproved(nftTokenId);
        console.log('nft approval is with: ', nftApproval);
      }
    }catch(err){
      console.error('error while getting approval');
      console.error(err);
    }
  }
  const location = useLocation();

  return (
    <div>
      <TopNavMenu location={location} />
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 450, margin: "auto", marginTop: 64 }}>
        <h2>Auction Factory</h2>
        <Divider />
        Auction Factory Contract Address:
        <Address
          address={readContracts && readContracts.AuctionFactory && readContracts.AuctionFactory.address}
          ensProvider={mainnetProvider}
          fontSize={16}
          blockExplorer={blockExplorer}
        />
        <Divider />
        <Space direction="vertical">
          Lister Address: <AddressInput
            ensProvider={mainnetProvider}
            placeholder="Enter NFT contract address"
            value={nftContractAddress}
            onChange={setNftContractAddress}
          />
          <Input
            placeholder="Enter NFT Token Id"
            value={nftTokenId}
            onChange={e => setNftTokenId(e.target.value)}
          />
          <NftImage nftContractAddress={nftContractAddress}
                    fetchImageDirect={true}
                    tokenId={nftTokenId}
                    localProvider={localProvider}
                    height={200} />
          {nftOwner && nftOwner == address &&
            <div>Currently owned by you:
              <Address
                address={nftOwner}
                ensProvider={mainnetProvider}
                fontSize={16} />
            </div>
          }
          {nftOwner && nftOwner != address &&
            <div>FYI – Currently <Text mark>not owned by you</Text> <br /> instead owned by:
              <Address
                address={nftOwner}
                ensProvider={mainnetProvider}
                fontSize={16} />
            </div>
          }
        </Space>
        <Divider />

        <Space direction={'vertical'} style={{marginTop: 8}}>
          <Row gutter={16}>
            <Col span={6}>
              Starting Bid
            </Col>
            <Col span={18}>
              <Input
                value={auctionOptions.startingBid}
                placeholder="Enter starting bid amount in wei"
                onChange={e => updateAuctionOptions('startingBid', e.target.value)}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              Auction increment
            </Col>
            <Col span={18}>
              <Input
                value={auctionOptions.auctionTimeIncrementOnBid}
                placeholder="Enter auction time increment on a bid in seconds"
                onChange={e => updateAuctionOptions('auctionTimeIncrementOnBid', e.target.value)}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              Bid min wei increment
            </Col>
            <Col span={18}>
              <Input
                value={auctionOptions.minimumBidIncrement}
                placeholder="Minimum increment of bid in wei"
                onChange={e => updateAuctionOptions('minimumBidIncrement', e.target.value)}
              />
              {auctionOptions.minimumBidIncrement == 0 && <Text type={'secondary'}>"King of Hill"</Text>}
              {auctionOptions.minimumBidIncrement > 0 && <Text type={'secondary'}>"Auction"</Text>}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              Auction Fee Type
            </Col>
            <Col span={18}>
              <Select defaultValue={auctionOptions.auctionFeeType} style={{ width: '100%' }}
                      onChange={value => updateAuctionOptions('auctionFeeType', value)}>
                <Select.Option value="0">Dynamic (~4% for every hour)</Select.Option>
                <Select.Option value="1">Static</Select.Option>
              </Select>
            </Col>
          </Row>
          {auctionOptions.auctionFeeType == '1' && <Row gutter={16}>
            <Col span={6}>
              Static Fee in Basis Points
            </Col>
            <Col span={18}>
              <Input
                value={auctionOptions.staticFeeInBasisPoints}
                placeholder="Static Fee In Basis Points"
                onChange={e => updateAuctionOptions('staticFeeInBasisPoints', e.target.value)}
              />
            </Col>
          </Row>}
        </Space>

        <Divider />

        <Space style={{ marginTop: 8 }}>
          <Button type={'primary'} onClick={createAuction}>
            Create Auction
          </Button>
        </Space>
         <Divider />
      </div>
      <Events
          contracts={readContracts}
          contractName="AuctionFactory"
          eventName="AuctionGenerated"
          localProvider={localProvider}
          mainnetProvider={mainnetProvider}
          startBlock={blockNumber}
        />
    </div>
  );
}
