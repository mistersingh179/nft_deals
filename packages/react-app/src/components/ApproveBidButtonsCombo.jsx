import { Button, Space, Row, Col, Tooltip, Modal } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useBlockNumber } from "eth-hooks";
import useAuctionContract from "../hooks/useAuctionContract";
import useAuctionOptions from "../hooks/useAuctionOptions";
import {BidWinningModal, Confetti} from "./index";

const ApproveBidButtonsCombo = props => {
  const { address, writeContracts, readContracts, tx, price, localProvider, auctionContractAddress } = props;

  const approvalAmount = "100000000000000000000000";
  const [desiredApprovalAmount, setDesiredApprovalAmount] = useState(ethers.BigNumber.from(0));
  const [fundsApproved, setFundsApproved] = useState(ethers.BigNumber.from(0));
  const [expiration, setExpiration] = useState(ethers.BigNumber.from(0));
  const blockNumber = useBlockNumber(localProvider);
  const auctionContract = useAuctionContract(readContracts, auctionContractAddress, localProvider);
  const auctionOptions = useAuctionOptions(readContracts, auctionContractAddress, localProvider);

  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 10000
  };

  useEffect(async () => {
    if (auctionContract && localProvider) {
      const highestBid = await auctionContract.highestBid();
      const minimumBidIncrement = await auctionContract.minimumBidIncrement();
      const desiredApprovalAmount = highestBid.add(BigNumber.from(minimumBidIncrement).mul(1000));
      setDesiredApprovalAmount(desiredApprovalAmount);
    }
  }, [localProvider, auctionContract, blockNumber]);

  useEffect(async () => {
    try {
      if (readContracts && readContracts.WETH && address && auctionContractAddress) {
        const result = await readContracts.WETH.allowance(address, auctionContractAddress);
        setFundsApproved(result);
      }
    } catch (e) {
      console.error("unable to get approved funds", e);
    }
  }, [readContracts && readContracts.WETH, address, auctionContractAddress, blockNumber]);

  useEffect(() => {
    if (fundsApproved.gt(desiredApprovalAmount)) {
      setDisableApprove(true);
      if (expiration.gt(ethers.BigNumber.from(moment().unix()))) {
        setDisableBid(false);
      } else {
        setDisableBid(true);
      }
    } else {
      setDisableApprove(false);
      setDisableBid(true);
    }
  }, [desiredApprovalAmount, fundsApproved]);

  useEffect(async () => {
    if (auctionContract) {
      const expiration = await auctionContract.expiration();
      setExpiration(expiration);
    }
  }, [localProvider, auctionContract, blockNumber]);

  const approveButtonHandler = async () => {
    if (writeContracts && writeContracts.WETH && auctionContractAddress) {
      try {
        setDisableApprove(true);
        const result = await tx(writeContracts.WETH.approve(auctionContractAddress, approvalAmount));
        console.log("approval result: ", result);
      } catch (e) {
        console.error("failed to run approval");
      } finally {
        setDisableApprove(false);
      }
    }
  };
  const bidButtonHandler = async () => {
    if (writeContracts && writeContracts.Auction && auctionContractAddress) {
      const auctionWriter = writeContracts.Auction.attach(auctionContractAddress);
      // setShowConfetti((new Date()).getTime())
      // setShowWinningModal(true);
      // return;
      try {
        setDisableBid(true);
        const options = {};
        try {
          const estimate = await auctionWriter.estimateGas.bid();
          if(estimate > 0){
            options["gasLimit"] = estimate.mul(13).div(10);
          }
        } catch (e) {
          console.error("failed to get estimate");
        }
        await tx(auctionWriter.bid(options), update => {
          console.log(update);
          if (update.status == 1 || update.status == 'confirmed') {
            console.log("***the bid was successful");
            setShowWinningModal(true);
            setShowConfetti((new Date()).getTime())
          }
        });
      } catch (e) {
        console.error("failed placing bid: ", e);
      } finally {
        setDisableBid(false);
      }
    }
  };

  const [disableApprove, setDisableApprove] = useState(true);
  const [disableBid, setDisableBid] = useState(true);
  const [showWinningModal, setShowWinningModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(undefined);

  return (
    <Row>
      <Col lg={{ offset: 0, span: 10 }} xs={{ span: 24 }}>
        <Button onClick={approveButtonHandler} className="btn-primary bid-btn" size={"large"} disabled={disableApprove}>
          Approve
        </Button>
      </Col>
      <Col lg={{ offset: 2, span: 10 }} xs={{ span: 24 }}>
        <Button disabled={disableBid} className="btn-primary bid-btn" size={"large"} onClick={bidButtonHandler}>
          Place Bid
        </Button>
        <BidWinningModal
          showWinningModal={showWinningModal}
          setShowWinningModal={setShowWinningModal}
          readContracts={readContracts}
          localProvider={localProvider}
          price={price}
          address={address}
        />
        <Confetti
          style={canvasStyles}
          fireConfetti={showConfetti}
          // nextFn={() => setShowWinningModal(true)}
        />
      </Col>
    </Row>
  );
};

export default ApproveBidButtonsCombo;
