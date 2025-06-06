import React, { useContext } from "react";
import { Col, Divider, Row, Space, Tooltip } from "antd";
import Duration from "./Duration";
import { ReactComponent as WEthLogo } from "../img/wrapped_ethereum_icon.svg";
import { ApproveBidButtonsCombo, JoinRedCarpetRow } from "./index";
import BidHistoryButtonModalCombo from "./BidHistoryButtonModalCombo";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import { useContractReader } from "eth-hooks";
import CurrentWinner from "../components/CurrentWinner";
import useBlockExplorerLink from "../hooks/useBlockExplorerLink";
import NftImage from "./NftImage";
import { displayWeiAsEther } from "../helpers";
import nftNameFixer from "../helpers/nftNameFixer";
import SubTitle from "./SubTitle";
import DisplayEther from "./DisplayEther";

const NftInteractionRow = props => {
  const { price } = props;
  const { readContracts, localProvider } = props;
  const { address, writeContracts, tx } = props;
  const { mainnetProvider, blockExplorer } = props;
  const { web3Modal, loadWeb3Modal, logoutOfWeb3Modal } = props;
  const { animateIt } = props;

  const { slug: auctionContractAddress } = useParams();
  const auctionOptions = useContext(AuctionOptionsContext);
  const blockExplorerLink = useBlockExplorerLink(blockExplorer);
  const isOffer = auctionOptions.minimumBidIncrement.eq(0);
  const isBidding = !isOffer;
  let displayToken = auctionOptions.tokenId.toString();
  if(displayToken.length > 10){
    displayToken = displayToken.substr(0, 5) + "..." + displayToken?.substr(-4);
  }


  return (
    <div className="row">
      <div
        className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-2 order-sm-2"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <h1>
          {auctionOptions.name && nftNameFixer(auctionOptions.name)} #
          {displayToken}{" "}
          <Tooltip title="Click to verify this NFT's contract address.">
            <a
              target="_blank"
              href={`${blockExplorer || "https://etherscan.io/"}address/${
                auctionOptions.nftContract
              }`}
            >
              <i className="bi bi-patch-check-fill btn-icon accent-icon" />
            </a>
          </Tooltip>
        </h1>
        <SubTitle auctionOptions={auctionOptions} price={price} />

        {isOffer && <div className="row">
          <div className="col-md-6 bid-box">
            <h3>
              Current Winner{" "}
              <Tooltip title="The address which can claim the NFT on expiration provided it is not outbid.">
                <i className="bi bi-info-circle bid-info"></i>
              </Tooltip>
            </h3>
            <h1>
              <CurrentWinner
                className="current-winner"
                user_address={address}
                address={auctionOptions.winningAddress}
                ensProvider={mainnetProvider}
                blockExplorer={blockExplorer}
              />
            </h1>
          </div>
          {auctionOptions.tokenId != "418791" &&<div className="col-md-6 bid-box">
            <h3>
              Rewards{" "}
              <Tooltip title="You get 2 Free Bids after placing a Paid Bid. You can use those Free Bids on future auctions – even for higher value NFTs! Of course, you cannot get Free Bids from placing a Free Bid.">
                <i className="bi bi-info-circle bid-info"></i>
              </Tooltip>
            </h3>

            <h1 className="grad-animated-text">
              <Tooltip title="You get 2 Free Bids after placing a Paid Bid. You can use those Free Bids on future auctions – even for higher value NFTs! Of course, you cannot get Free Bids from placing a Free Bid.">
                2 Free Bids
              </Tooltip>
            </h1>
          </div>}
        </div>}

        <div className="row">
          <div className="col-md-6 bid-box">
            <Space>
              <h3>
                {isOffer && "Bid Amount "}
                {isBidding && "Last Bid "}
                <Tooltip title="The last bidder when the timer ends will win the auction.">
                  <i className="bi bi-info-circle bid-info"></i>
                </Tooltip>
              </h3>
            </Space>
            <h1>
              <DisplayEther
                wei={auctionOptions.maxBid}
                priceInCents={auctionOptions.priceInCents}
              />
            </h1>
          </div>
          <div className="col-md-6 bid-box">
            <h3>
              Ends in{" "}
              <Tooltip
                title="A new bid will extend the auction by 24 hours. There’s no advantage to waiting
                      until the last few minutes."
              >
                <i className="bi bi-info-circle bid-info"></i>
              </Tooltip>
            </h3>
            <h1 id="end-timer">
              {auctionOptions.expiration.eq(0) && "Coming Soon"}
              {auctionOptions.expiration.gt(0) && (
                <Duration
                  readContracts={readContracts}
                  auctionContractAddress={auctionContractAddress}
                  localProvider={localProvider}
                />
              )}
            </h1>
          </div>
        </div>
        {isBidding && <div className="row">
          <div className="col-md-6 bid-box">
            <h3>
              Next Bid{" "}
              <Tooltip title="You cannot choose a bid amount. The next possible bid is a fixed amount above the current bid.">
                <i className="bi bi-info-circle bid-info"></i>
              </Tooltip>
            </h3>
            <h1>
              <DisplayEther
                wei={auctionOptions.maxBid.add(
                  auctionOptions.minimumBidIncrement,
                )}
                priceInCents={auctionOptions.priceInCents}
              />
            </h1>
          </div>
          <div className="col-md-6 bid-box">
            <h3>
              Current Winner{" "}
              <Tooltip title="The address which can claim the NFT on expiration provided it is not outbid.">
                <i className="bi bi-info-circle bid-info"></i>
              </Tooltip>
            </h3>
            <h1>
              <CurrentWinner
                className="current-winner"
                user_address={address}
                address={auctionOptions.winningAddress}
                ensProvider={mainnetProvider}
                blockExplorer={blockExplorer}
              />
            </h1>
          </div>
        </div>}
        {auctionOptions.expiration.eq(0) && (
          <JoinRedCarpetRow
            writeContracts={writeContracts}
            readContracts={readContracts}
            tx={tx}
            address={address}
            localProvider={localProvider}
            animateIt={animateIt}
          />
        )}
        {auctionOptions.expiration.gt(0) && (
          <ApproveBidButtonsCombo
            writeContracts={writeContracts}
            readContracts={readContracts}
            address={address}
            localProvider={localProvider}
            auctionContractAddress={auctionContractAddress}
            tx={tx}
            price={price}
            blockExplorer={blockExplorer}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
        )}

        <Row>
          <Col lg={{ offset: 0, span: 10 }} xs={{ span: 24 }}>
            <BidHistoryButtonModalCombo
              readContracts={readContracts}
              auctionContractAddress={auctionContractAddress}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Col>
          <Col lg={{ offset: 2, span: 10 }} xs={{ span: 24 }}>
            <a
              href={blockExplorerLink}
              className="ant-btn btn btn-secondary btn-sm btn-block bid-details-btn"
              target="_blank"
            >
              <i className="bi bi-patch-check-fill btn-icon" /> Inspect Auction
              on Etherscan
            </a>
          </Col>
        </Row>
      </div>
      <div
        className="col-lg-6 order-1 order-lg-1 order-sm-1 hero-img"
        data-aos="zoom-in"
        data-aos-delay="200"
      >
        <NftImage
          nftContractAddress={auctionOptions.nftContract}
          tokenId={auctionOptions.tokenId}
          localProvider={localProvider}
          className="img-fluid nft-image"
        />
      </div>
    </div>
  );
};

export default NftInteractionRow;
