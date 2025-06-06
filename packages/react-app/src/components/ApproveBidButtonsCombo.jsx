import { Button, Col, Row } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { useBlockNumber } from "eth-hooks";
import { BidWinningModal, Confetti, LoginLogoutButton } from "./index";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import { Link } from "react-router-dom";
import TransactionPendingModal from "./TransactionPendingModal";
import CheckoutModal from "./CheckoutModal";
import NotificationsModal from "./NotificationsModal";
import { sleep } from "../helpers";

const ApproveBidButtonsCombo = props => {
  const auctionOptions = useContext(AuctionOptionsContext);
  const {
    address,
    writeContracts,
    readContracts,
    tx,
    price,
    localProvider,
    auctionContractAddress,
  } = props;
  const { web3Modal, loadWeb3Modal, logoutOfWeb3Modal } = props;
  const { blockExplorer } = props;
  const approvalAmount = "100000000000000000000000";
  const [desiredApprovalAmount, setDesiredApprovalAmount] = useState(
    ethers.BigNumber.from(0),
  );
  const [fundsApproved, setFundsApproved] = useState(ethers.BigNumber.from(0));
  const blockNumber = useBlockNumber(localProvider);
  const isOffer = auctionOptions.minimumBidIncrement.eq(0);
  const isBidding = !isOffer;

  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 10000,
  };

  useEffect(async () => {
    const highestBid = auctionOptions.highestBid;
    const minimumBidIncrement = auctionOptions.minimumBidIncrement;
    const desiredApprovalAmount = highestBid.add(
      BigNumber.from(minimumBidIncrement).mul(1000),
    );
    setDesiredApprovalAmount(desiredApprovalAmount);
  }, [auctionOptions.highestBid, auctionOptions.minimumBidIncrement]);

  useEffect(async () => {
    try {
      if (
        readContracts &&
        readContracts.WETH &&
        address &&
        auctionContractAddress
      ) {
        const result = await readContracts.WETH.allowance(
          address,
          auctionContractAddress,
        );
        setFundsApproved(result);
      }
    } catch (e) {
      console.error("unable to get approved funds", e);
    }
  }, [
    readContracts && readContracts.WETH,
    address,
    auctionContractAddress,
    blockNumber,
  ]);

  useEffect(() => {
    if (fundsApproved.gt(desiredApprovalAmount)) {
      setDisableApprove(true);
      const expiration = auctionOptions.expiration;
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

  const approveButtonHandler = async () => {
    if (writeContracts && writeContracts.WETH && auctionContractAddress) {
      try {
        setDisableApprove(true);
        const result = await tx(
          writeContracts.WETH.approve(auctionContractAddress, approvalAmount),
        );
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
      const auctionWriter = writeContracts.Auction.attach(
        auctionContractAddress,
      );
      try {
        setDisableBid(true);
        setTransactionHash(null);
        setShowTransactionModal(true);
        const options = {};
        try {
          const estimate = await auctionWriter.estimateGas.bid();
          if (estimate > 0) {
            options["gasLimit"] = estimate.mul(13).div(10);
          }
        } catch (e) {
          console.error("failed to get estimate");
        }
        await tx(
          auctionWriter.bid(options),
          update => {
            if (update.status == 1 || update.status == "confirmed") {
              console.log("***the bid was successful");
              setDisableBid(false);
              setShowTransactionModal(false);
              setShowWinningModal(true);
              setShowConfetti(new Date().getTime());
            }
          },
          setTransactionHash,
        );
      } catch (e) {
        console.error("failed placing bid: ", e);
      } finally {
        setDisableBid(false);
        setShowTransactionModal(false);
      }
    }
  };

  const [disableApprove, setDisableApprove] = useState(true);
  const [disableBid, setDisableBid] = useState(true);
  const [showWinningModal, setShowWinningModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(undefined);

  if (address === ethers.constants.AddressZero) {
    return (
      <Row style={{ marginBottom: 20 }}>
        <Col span={24}>
          <LoginLogoutButton
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            className="connect-wallet-btn scrollto"
          />
        </Col>
      </Row>
    );
  } else {
    return (
      <Row>
        <Col lg={{ offset: 0, span: 10 }} xs={{ span: 24 }}>
          <Button
            onClick={approveButtonHandler}
            className="btn-primary bid-btn"
            size={"large"}
            disabled={disableApprove}
          >
            Approve WETH
          </Button>
        </Col>
        <Col lg={{ offset: 2, span: 10 }} xs={{ span: 24 }}>
          <Button
            disabled={disableBid}
            className="btn-primary bid-btn"
            size={"large"}
            onClick={evt => setShowCheckoutModal(true)}
          >
            Place Bid
          </Button>
          <TransactionPendingModal
            showTransactionModal={showTransactionModal}
            setShowTransactionModal={setShowTransactionModal}
            transactionHash={transactionHash}
            readContracts={readContracts}
            localProvider={localProvider}
            price={price}
            address={address}
            blockExplorer={blockExplorer}
          />
          <CheckoutModal
            showCheckoutModal={showCheckoutModal}
            setshowCheckoutModal={setShowCheckoutModal}
            readContracts={readContracts}
            localProvider={localProvider}
            price={price}
            address={address}
            bidButtonHandler={bidButtonHandler}
          />
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
  }
};

export default ApproveBidButtonsCombo;
