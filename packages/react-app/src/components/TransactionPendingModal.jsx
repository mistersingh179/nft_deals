import { Col, Modal, Row, Button } from "antd";
import rewardsImage from "../img/rewards.png";
import { displayWeiAsEther } from "../helpers";
import { ethers } from "ethers";
import { useContext } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";

const TransactionPendingModal = props => {
  const { showTransactionModal, setShowTransactionModal } = props;
  const { price } = props;
  const auctionOptions = useContext(AuctionOptionsContext);

  const handleOk = evt => {
    setShowTransactionModal(false);
  };
  const handleCancel = evt => {
    setShowTransactionModal(false);
  };

  const nftPriceInUsd = () => {
    if (auctionOptions.stats.floor_price && price) {
      return ethers.utils.commify(
        parseFloat(auctionOptions.stats.floor_price * price).toFixed(2),
      );
    } else {
      return "0";
    }
  };

  const nftEthProfit = () => {
    if (auctionOptions.stats.floor_price && auctionOptions.maxBid) {
      const floor_price = ethers.utils.parseEther(
        auctionOptions.stats.floor_price + "",
      ); // standardizing opensea value to big number holding wei
      const maxBid = auctionOptions.maxBid;
      return displayWeiAsEther(floor_price.sub(maxBid));
    } else {
      return "0";
    }
  };

  const roi = () => {
    if (
      auctionOptions.maxBid &&
      auctionOptions.maxBid.gt(0) &&
      auctionOptions.stats.floor_price
    ) {
      const floor_price = ethers.utils.parseEther(
        auctionOptions.stats.floor_price + "",
      ); // standardizing opensea value to big number holding wei
      const maxBid = auctionOptions.maxBid;
      let ans = floor_price.sub(maxBid).div(maxBid);
      ans = ethers.utils.commify(ans);
      return ans;
    } else {
      return "Gazillion";
    }
  };

  return (
    <>
      <Modal
        className="winner-modal"
        title="Latest Bids"
        visible={showTransactionModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>Processing Bid</h1>          
            <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
            </div>            
            <h5>You're closer to winning this NFT! </h5>
            <p>
                Your bid should be confirmed on the blockchain soon. You may navigate away from this modal.
            </p>
            {/* @sandeep: need to update the HREF below to include the transaction URL for this bid. */}
            <Button className="etherscan-link" type="link" href="#" target="_blank"> 
                View your transaction on Etherscan.
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TransactionPendingModal;
