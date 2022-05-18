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

  const AlreadyInMessage = props => {
    return <span>You are on the Red Carpet List.</span>;
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
          Join Red Carpet List
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
          The Red Carpet has {redCarpetLength}{" "}
          {plural("bidder", redCarpetLength)}. The auction will launch if a
          total of {threshold} bidders join the list by {thresholdDate}.{" "}
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
