import { Button, Col, Row, Tooltip } from "antd";
import { LoginLogoutButton } from "./index";
import React, { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuctionOptions from "../hooks/useAuctionOptions";
import useAuctionContract from "../hooks/useAuctionContract";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import { ethers } from "ethers";
import moment from "moment";
import PostRedCarpetSignupModal from "./PostRedCarpetSignupModal";
const {
  constants: { AddressZero },
} = ethers;

const JoinRedCarpetRow = props => {
  const {
    writeContracts,
    readContracts,
    address,
    localProvider,
    targetNetwork,
    tx,
    animateIt,
  } = props;
  const { slug: auctionContractAddress } = useParams();

  const auctionContractWriter = useAuctionContract(
    writeContracts,
    auctionContractAddress,
    localProvider,
  );

  const auctionOptions = useContext(AuctionOptionsContext);

  const [showPostRedCarpetSignupModal, setShowPostRedCarpetSignupModal] =
    useState(false);

  const joinHandler = async () => {
    if (address === AddressZero) {
      console.log("wont do anything as no wallet");
      animateIt();
      return;
    }
    await tx(auctionContractWriter.joinRedCarpet(), update => {
      if (update.status == 1 || update.status == "confirmed") {
        console.log("***the joinRedCarpet was successful");
        setShowPostRedCarpetSignupModal(true);
      }
    });
  };

  const alreadyOnWaitList = async () => {
    console.log("Do nothing; already on wait list.");
    return;
  }

  const AlreadyInMessage = props => {
    return <Button
              type="secondary wait-list-btn"
              onClick={alreadyOnWaitList}
              size={"large"}
              style={{ width: "100%" }}>
                You're on the Wait List. Go tell a friend!
          </Button>;
  };

  const JoinRedCarpetButton = props => {
    return (
      <Tooltip
        title={address == AddressZero ? "Connect Your wallet first" : ""}
      >
        <Button
          type="primary"
          onClick={joinHandler}
          size={"large"}
          style={{ width: "100%" }}
        >
          Join The Wait List
        </Button>
      </Tooltip>
    );
  };

  const plural = (word, count) => {
    if (count == 1) {
      return word;
    } else {
      return word + "s";
    }
  };

  const threshold = ethers.utils.commify(2500);
  const thresholdDate = moment("2022-05-31").format("dddd, MMMM Do, YYYY");
  const redCarpetLength = ethers.utils.commify(auctionOptions.redCarpetLength);

  return (
    <>
      <Row style={{ marginBottom: 20 }}>
        <Col span={24}>
          Join the Wait List to get 2x rewards on every bid!{" "}
          There are {redCarpetLength} {plural("player", redCarpetLength)} waiting for this auction to launch.
        </Col>
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Col span={24}>
          {auctionOptions.presentInRedCarpet && <AlreadyInMessage />}
          {!auctionOptions.presentInRedCarpet && <JoinRedCarpetButton />}
          <PostRedCarpetSignupModal
            address={address}
            showPostRedCarpetSignupModal={showPostRedCarpetSignupModal}
            setShowPostRedCarpetSignupModal={setShowPostRedCarpetSignupModal}
          />
        </Col>
      </Row>
    </>
  );
};

export default JoinRedCarpetRow;
