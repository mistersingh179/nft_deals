import { Button, Space } from "antd";
import moment from "moment";
import {useEffect, useState} from "react";
import {BigNumber, ethers} from "ethers";
import {Auction} from "../views";
import {useBlockNumber} from "eth-hooks";

const ApproveBidButtonsCombo = props => {
  const {
    address,
    writeContracts,
    readContracts,
    tx,
    localProvider,
    auctionContractAddress } = props;

  const approvalAmount = "100000000000000000000000";
  const [desiredApprovalAmount, setDesiredApprovalAmount] = useState(ethers.BigNumber.from(0));
  const [fundsApproved, setFundsApproved] = useState(ethers.BigNumber.from(0));
  const [expiration, setExpiration] = useState(ethers.BigNumber.from(0));
  const blockNumber = useBlockNumber(localProvider);

  useEffect(async () => {
    if (readContracts && readContracts.Auction && auctionContractAddress) {
      const auctionContract = readContracts.Auction.attach(auctionContractAddress);
      const highestBid = await auctionContract.highestBid()
      const minimumBidIncrement = await auctionContract.minimumBidIncrement()
      const desiredApprovalAmount = highestBid.add(BigNumber.from(minimumBidIncrement).mul(1000))
      setDesiredApprovalAmount(desiredApprovalAmount)
    }
  }, [readContracts && readContracts.Auction, auctionContractAddress, blockNumber]);

  useEffect(async () => {
    if(readContracts && readContracts.WETH && address && auctionContractAddress){
      const result = await readContracts.WETH.allowance(address, auctionContractAddress)
      setFundsApproved(result);
    }
  }, [readContracts && readContracts.WETH, address, auctionContractAddress, blockNumber])

  useEffect(() => {
    if(fundsApproved.gt(desiredApprovalAmount)){
      setDisableApprove(true)
      if(expiration.gt(ethers.BigNumber.from(moment().unix()))){
        setDisableBid(false)
      }else{
        setDisableBid(true)
      }
    }else{
      setDisableApprove(false)
      setDisableBid(true)
    }
  }, [desiredApprovalAmount, fundsApproved])

  useEffect(async () => {
    if (readContracts && readContracts.Auction && auctionContractAddress) {
      const auctionContract = readContracts.Auction.attach(auctionContractAddress);
      const expiration = await auctionContract.expiration()
      setExpiration(expiration)
    }
  },[readContracts && readContracts.Auction, auctionContractAddress, blockNumber])

  const approveButtonHandler = async () => {
    if (writeContracts && writeContracts.WETH && auctionContractAddress) {
      try{
        setDisableApprove(true)
        const result = await tx(writeContracts.WETH.approve(auctionContractAddress, approvalAmount));
        console.log("approval result: ", result);
      }catch(e){
        console.error('failed to run approval')
      } finally {
        setDisableApprove(false)
      }
    }
  };
  const bidButtonHandler = async () => {
    if (writeContracts && writeContracts.Auction && auctionContractAddress) {
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      try {
        setDisableBid(true)
        const estimate = await auctionWriter.estimateGas.bid();
        if (estimate !== undefined) {
          await tx(auctionWriter.bid({ gasLimit: estimate.mul(13).div(10) }), update => console.log(update));
        }
      } catch (e) {
        console.error("failed placing bid: ", e);
      } finally {
        setDisableBid(false)
      }
    }
  };

  const [disableApprove, setDisableApprove] = useState(true);
  const [disableBid, setDisableBid] = useState(true);

  return (
    <Space>
      <Button
        onClick={approveButtonHandler}
        className="btn btn-primary btn-lg btn-block"
        size={"large"}
        disabled={disableApprove}
      >
        Approve
      </Button>
      <Space style={{ marginLeft: 5, marginRight: 5 }}>&nbsp;</Space>
      <Button
        disabled={disableBid}
        className="btn btn-primary btn-lg btn-block"
        size={"large"}
        onClick={bidButtonHandler}
      >
        Place Bid
      </Button>
    </Space>
  );
};

export default ApproveBidButtonsCombo;
