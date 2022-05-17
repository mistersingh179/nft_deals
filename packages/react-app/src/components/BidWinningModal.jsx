import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
} from "antd";
import rewardsImage from "../img/rewards.png";
import { displayWeiAsEther } from "../helpers";
import { ethers } from "ethers";
import { useContext, useState } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import EmailCapture from "./EmailCapture";

const BidWinningModal = props => {
  const { showWinningModal, setShowWinningModal } = props;
  const { price, address } = props;
  const auctionOptions = useContext(AuctionOptionsContext);
  const [email, setEmail] = useState(null);

  const handleSubmit = async evt => {
    try {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_NFT_DEALS_BE_DOMAIN}/users`,
        data: {
          walletAddress: address,
          emailAddress: email,
        },
      });
    } catch (e) {
      console.log("unable to save email address: ", e);
    }

    setShowWinningModal(false);
  };

  const handleOk = evt => {
    setShowWinningModal(false);
  };
  const handleCancel = evt => {
    setShowWinningModal(false);
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

  const rewardsExplainer = (
    <>
      Get rewards every time you bid based on the number of hours remaining in
      the auction. If you bid again right now you can earn{" "}
      {auctionOptions.currentReward.toString()} more points.
    </>
  );

  const RewardsMessage = () => {
    return (
      <>
        <h5>
          You got rewards just for bidding!{" "}
          <Tooltip placement="right" title={rewardsExplainer}>
            <i className="bi bi-info-circle bid-info winner-info-icon" />
          </Tooltip>
        </h5>
        <h6>You now have {auctionOptions.rewards.toString()} points.</h6>
      </>
    );
  };

  return (
    <>
      <Modal
        className="winner-modal"
        title="Latest Bids"
        visible={showWinningModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>Congratulations</h1>
            {auctionOptions.qualifiesForRewards && <RewardsMessage />}
            <img
              src={rewardsImage}
              className="winner-modal-badge"
              alt={"rewards"}
            />
            <h5>You will win this NFT if you're not outbid within 24 hours!</h5>
            <p>
              The highest bid is Ξ{displayWeiAsEther(auctionOptions.maxBid)}. If
              you win this NFT, you can likely flip it for Ξ{nftEthProfit()} in
              profit.
            </p>
            <h6>That's a {roi()}x ROI! 🤑</h6>
          </Col>
        </Row>
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Col span={18} align="middle">
            <p>Input your email to receive outbid notifications:</p>
            <EmailCapture address={address} />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default BidWinningModal;
