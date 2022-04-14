import {Button, Card, DatePicker, Divider, Input, Progress, Slider, Space, Spin, Switch} from "antd";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import {
  useParams
} from "react-router-dom";
import {ethers, utils, BigNumber} from "ethers";
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
  const setupNftAddressAndId = async () => {
    if(readContracts && readContracts.Auction && readContracts.Auction.interface){
      const auctionReader = readContracts.Auction.attach(auctionContractAddress);
      const nftContractAddress = await auctionReader.nftContract();
      setNftContractAddress(nftContractAddress.toString())
      const tokenId = await auctionReader.tokenId()
      setTokenId(tokenId.toString())
    }
  }

  useEffect(async () => {
    try{
      await setupNftAddressAndId()
    }catch(e){
      console.error('error getting nft address and id')
      console.error(e)
    }
  }, [readContracts, auctionContractAddress])

  const blockNumber = useBlockNumber(localProvider);
  const [auctionOptions, setAuctionOptions] = useState({
    winningAddress: '',
    highestBid: '',
    expiration: '',
    minimumBidIncrement: '',
    _weHavePossessionOfNft: false,
    desiredApprovalAmount: ethers.BigNumber.from(0)
  });
  const updateAuctionOptions = (name, value) => {
    setAuctionOptions(prev => {
      return {...prev, [name]: value}
    })
  }
  const setupAuctionOptions = async () => {
    if(address && readContracts && readContracts.Auction && readContracts.Auction.interface){
      const auctionReader = readContracts.Auction.attach(auctionContractAddress);
      const winningAddress = await auctionReader.winningAddress();
      const highestBid = await auctionReader.highestBid();
      const expiration = await auctionReader.expiration();
      const minimumBidIncrement = await auctionReader.minimumBidIncrement();
      const _weHavePossessionOfNft = await auctionReader._weHavePossessionOfNft();
      updateAuctionOptions('winningAddress', winningAddress)
      updateAuctionOptions('highestBid', highestBid.toString())
      updateAuctionOptions('expiration', expiration.toString())
      updateAuctionOptions('minimumBidIncrement', minimumBidIncrement.toString())
      updateAuctionOptions('_weHavePossessionOfNft', _weHavePossessionOfNft)
      const desiredApprovalAmount = BigNumber.from(highestBid).add(BigNumber.from(minimumBidIncrement).mul(1000));
      updateAuctionOptions('desiredApprovalAmount', desiredApprovalAmount)
    }
  }
  useEffect(async () => {
    try{
      await setupAuctionOptions()
    }catch(e){
      console.error('error getting auction options')
      console.error(e)
    }
  }, [readContracts, auctionContractAddress, blockNumber, address]);

  const bid = async () => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      const estimate = await auctionWriter.estimateGas.bid();
      await tx(
        auctionWriter.bid({gasLimit: estimate.mul(13).div(10)}),
        update => console.log(update)
      );
    }
  }
  const claimNft = async () => {
    if(writeContracts && writeContracts.Auction && writeContracts.Auction.interface){
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      await tx(
        auctionWriter.claimNftUponWinning(),
        update => console.log(update)
      );
    }
  }
  const approvalAmount = '100000000000000000000000'
  const approveButtonHandler = async () => {
    const result = await tx(writeContracts.WETH.approve(auctionContractAddress, approvalAmount))
    console.log('approval result: ', result)
  }
  const [fundsApproved, setFundsApproved] = useState(ethers.BigNumber.from(0))
  const setupFundsApproved = async () => {
    if(readContracts && readContracts.WETH && address && auctionContractAddress){
      const result = await readContracts.WETH.allowance(address, auctionContractAddress)
      setFundsApproved(result);
    }
  }
  useEffect(async () => {
    try{
      await setupFundsApproved()
    }catch(e){
      console.error('unable to get funds approved');
      console.erorr(e)
    }
  }, [readContracts, readContracts.WETH, address, blockNumber, auctionContractAddress]);

  const disableApproval = () => {
    if (fundsApproved.gt(auctionOptions.desiredApprovalAmount)){
      return true
    }else {
      return false
    }
  }

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
        Current Highest Bid: Ξ{auctionOptions.highestBid && utils.formatEther(auctionOptions.highestBid)}
        <Divider />
        Current Winner: {auctionOptions.winningAddress}<br/>
        <Text mark>
          {(address) && (auctionOptions.winningAddress == address) ? "This is you! :=)": "Not you :-("}
        </Text>

        <Divider />
        Expiration: {moment(auctionOptions.expiration, 'X').fromNow()}
        <br/>
        {(moment().unix() > auctionOptions.expiration) && <Text type="danger">Expired</Text>}
        {(auctionOptions.expiration > 0) && (moment().unix() < auctionOptions.expiration) &&
          <Text type="success">Active</Text>}
        <Divider />
        <Button type={'primary'} onClick={approveButtonHandler}
          disabled={disableApproval()}>
          Approve
        </Button>
        <Space style={{marginLeft:5, marginRight: 5}}>&nbsp;</Space>
        <Button
          disabled={!disableApproval() || moment().unix() > auctionOptions.expiration}
          type={'primary'} onClick={bid}>
          Place Bid
        </Button>
        <Divider />
        fundsApproved : {fundsApproved && fundsApproved.toString()}<br/>
        desiredApprovalAmount: {auctionOptions.desiredApprovalAmount && auctionOptions.desiredApprovalAmount.toString()}
        <Divider />
        Block Number: {blockNumber}
        <Divider />
        <Button
          disabled={
          (auctionOptions._weHavePossessionOfNft == false) || (auctionOptions.winningAddress != address) ?
            true: false
        }
          style={{marginBottom:4}}
          onClick={claimNft}>
          Claim Nft upon Winning
        </Button>
        <Divider />
      </div>
    </div>
  );
}
