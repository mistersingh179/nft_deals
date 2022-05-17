import { Button, Col, Modal, Row } from "antd";
import { useAuctionContract } from "../hooks";
import { useParams } from "react-router-dom";
import NftImage from "./NftImage";
import gameOver from "../img/game_over.gif";
import nopeRooster from "../img/nope_rooster.gif";
import { useCallback, useContext } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import { ethers } from "ethers";
const {
  constants: { AddressZero },
} = ethers;

const blockExplorerLink = (address, blockExplorer) =>
  `${blockExplorer || "https://etherscan.io/"}address/${address}`;

const ClaimNFTModal = props => {
  const { showClaimNftModal, setShowClaimNftModal } = props;
  const { localProvider, address, writeContracts, tx, blockExplorer } = props;

  const { slug: auctionContractAddress } = useParams();
  const auctionContractWriter = useAuctionContract(
    writeContracts,
    auctionContractAddress,
    localProvider,
  );
  const handleOk = evt => {
    setShowClaimNftModal(false);
  };

  const handleCancel = evt => {
    setShowClaimNftModal(false);
  };
  const auctionOptions = useContext(AuctionOptionsContext);

  const youAreWinner = () => {
    return auctionOptions.winningAddress == address && address != AddressZero;
  };

  const auctionHasExpired = () => {
    return auctionOptions.secondsLeftInAuction.eq(0);
  };

  const InstructFinalWinner = useCallback(
    props => {
      const transferNftHandler = () => {
        if (auctionContractWriter) {
          tx(auctionContractWriter.claimNftUponWinning());
        }
      };
      return (
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>You won this NFT!</h1>
            <NftImage
              nftContractAddress={auctionOptions.nftContract}
              tokenId={auctionOptions.tokenId}
              localProvider={localProvider}
              className="winner-modal-badge"
            />

            {auctionOptions._weHavePossessionOfNft && (
              <>
                <h4>
                  <Button
                    type={"primary"}
                    className="ant-btn-lg transfer-btn"
                    onClick={transferNftHandler}
                  >
                    Transfer NFT
                  </Button>
                </h4>
                <p>
                  The NFT will arrive in your wallet address after this
                  transaction is confirmed.
                </p>
              </>
            )}

            {!auctionOptions._weHavePossessionOfNft && (
              <>
                <a
                  className="rewards-contract"
                  target="_blank"
                  href={blockExplorerLink(
                    auctionContractAddress,
                    blockExplorer,
                  )}
                >
                  View this transaction on Etherscan
                </a>
              </>
            )}
          </Col>
        </Row>
      );
    },
    [
      auctionOptions.nftContract,
      auctionOptions.tokenId,
      auctionOptions._weHavePossessionOfNft,
      localProvider,
      tx,
      auctionContractWriter,
    ],
  );

  const InspireTempWinner = useCallback(
    props => {
      return (
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>You're so close to winning this NFT!</h1>
            <NftImage
              nftContractAddress={auctionOptions.nftContract}
              tokenId={auctionOptions.tokenId}
              localProvider={localProvider}
              className="winner-modal-badge"
            />
            <h4>But you could still be outbid...</h4>
            <p>
              Be sure to come back within 24 hours to see if you won. In the
              meantime, follow us on Twitter for the latest announcements:
            </p>
            <div className="social-links mt-4">
              <a href="https://twitter.com/NFT_Deals_xyz" className="twitter">
                <i className="bx bxl-twitter" />
              </a>
            </div>
          </Col>
        </Row>
      );
    },
    [auctionOptions.tokenId, auctionOptions.nftContract, localProvider],
  );

  const InspireTempLooser = useCallback(props => {
    return (
      <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={18} align="middle">
          <h1>Keep Trying!</h1>
          <img src={nopeRooster} className="winner-modal-badge" />
          <h4>You can't claim the NFT because you're not the winner.</h4>
          <p>But there's still time left! Bid again to stay on top.</p>
        </Col>
      </Row>
    );
  }, []);

  const ComfortFinalLooser = useCallback(props => {
    return (
      <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
        <Col span={22} align="middle">
          <h1>Try Again Next Time</h1>
          <img
            src={gameOver}
            className="winner-modal-badge"
            alt={"game over"}
          />
          <h4>You did not win this auction.</h4>
          <p>
            But there will be more auctions, so come back to bid on the next
            one. In the meantime, follow us on Twitter for the latest
            announcements:
          </p>
          <div className="social-links mt-4">
            <a href="https://twitter.com/NFT_Deals_xyz" className="twitter">
              <i className="bx bxl-twitter"></i>
            </a>
          </div>
        </Col>
      </Row>
    );
  }, []);

  return (
    <Modal
      className="winner-modal"
      title="Latest Bids"
      visible={showClaimNftModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {/* IF User = WINNER && auction is expired */}
      {youAreWinner() && auctionHasExpired() && <InstructFinalWinner />}

      {/* inspire user = current_winner && auction still open */}
      {youAreWinner() && !auctionHasExpired() && <InspireTempWinner />}

      {/* inspire bidder who lost && auction still open */}
      {!youAreWinner() && !auctionHasExpired() && <InspireTempLooser />}

      {/* inspire bidder who lost && auction expired */}
      {!youAreWinner() && auctionHasExpired() && <ComfortFinalLooser />}
    </Modal>
  );
};

export default ClaimNFTModal;
