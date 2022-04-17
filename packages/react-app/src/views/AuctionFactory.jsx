import {Button, Card, DatePicker, Divider, Input, Progress, Slider, Space, Spin, Switch} from "antd";
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
  const [listerAddress, setListerAddress] = useState(address);
  const [auctionOptions, setAuctionOptions] = useState({
    startingBid: '',
    initialAuctionLength: '',
    auctionTimeIncrementOnBid: '',
    minimumBidIncrement: '',
    listerFeeInBasisPoints: ''
  });
  const [auctionFactoryAddress, setAuctionFactoryAddress] = useState('');
  const blockNumber = useBlockNumber(localProvider);

  const createAuction = async () => {
    await tx(
      writeContracts.AuctionFactory.createAuction(
        nftTokenId,
        nftContractAddress,
        auctionOptions.startingBid,
        auctionOptions.initialAuctionLength,
        auctionOptions.auctionTimeIncrementOnBid,
        auctionOptions.minimumBidIncrement,
        listerAddress,
        auctionOptions.listerFeeInBasisPoints
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
          <AddressInput
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
          <AddressInput
            autoFocus
            ensProvider={mainnetProvider}
            placeholder="Enter Lister Address"
            value={listerAddress}
            onChange={setListerAddress}
          />
          <Input
            value={auctionOptions.listerFeeInBasisPoints}
            placeholder="Enter lister fee in basis points"
            onChange={e => updateAuctionOptions('listerFeeInBasisPoints', e.target.value)}
          />
          <Input
            value={auctionOptions.startingBid}
            placeholder="Enter starting bid amount in wei"
            onChange={e => updateAuctionOptions('startingBid', e.target.value)}
          />
          <Input
            value={auctionOptions.initialAuctionLength}
            placeholder="Enter initial auction length in seconds"
            onChange={e => updateAuctionOptions('initialAuctionLength', e.target.value)}
          />
          <Input
            value={auctionOptions.auctionTimeIncrementOnBid}
            placeholder="Enter auction time increment on a bid in minutes"
            onChange={e => updateAuctionOptions('auctionTimeIncrementOnBid', e.target.value)}
          />
          <Input
            value={auctionOptions.minimumBidIncrement}
            placeholder="Minimum increment of bid in wei"
            onChange={e => updateAuctionOptions('minimumBidIncrement', e.target.value)}
          />
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
