import { Col, Modal, Row, Tooltip } from "antd";
import rewardsImage from "../img/rewards.png";
import { displayWeiAsEther } from "../helpers";
import { useParams } from "react-router-dom";
import { useNftOptions } from "../hooks";
import { ethers } from "ethers";
import { useContractReader } from 'eth-hooks'
import { useContext } from 'react'
import AuctionOptionsContext from '../contexts/AuctionOptionsContext'

const BidWinningModal = props => {
  const { showWinningModal, setShowWinningModal } = props;
  const { readContracts, localProvider, address } = props;
  const { price } = props;
  const auctionOptions = useContext(AuctionOptionsContext);
  const nftOptions = useNftOptions(auctionOptions.nftContract, localProvider, auctionOptions.tokenId);
  const rewards = useContractReader(readContracts, "Reward", "rewards", [address]);

  const handleOk = evt => {
    setShowWinningModal(false);
  };
  const handleCancel = evt => {
    setShowWinningModal(false);
  };

  const nftPriceInUsd = () => {
    if(nftOptions.floor_price && price){
      return ethers.utils.commify(parseFloat(nftOptions.floor_price * price).toFixed(2))
    }else {
      return "0";
    }
  };

  const nftEthProfit = () => {
    if(nftOptions.floor_price && auctionOptions.maxBid){
      const floor_price = ethers.utils.parseEther(nftOptions.floor_price+""); // standardizing opensea value to big number holding wei
      const maxBid = auctionOptions.maxBid;
      return displayWeiAsEther(floor_price.sub(maxBid));
    } else {
      return "0";
    }
  };

  const roi = () => {
    if(auctionOptions.maxBid && auctionOptions.maxBid.gt(0) && nftOptions.floor_price){
      const floor_price = ethers.utils.parseEther(nftOptions.floor_price+""); // standardizing opensea value to big number holding wei
      const maxBid = auctionOptions.maxBid;
      let ans = (floor_price.sub(maxBid)).div(maxBid);
      ans = ethers.utils.commify(ans);
      return ans;
    } else {
      return "Gazillion";
    }
  };
  const rewardsExplainer = <>Get rewards every time you bid based on the number of hours
  remaining in the auction. If you bid again right now you can 
  earn {auctionOptions.currentReward.toString()} more points.</>;

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
            <h5>
              You got rewards just for bidding! <Tooltip
                placement="right"
                title={rewardsExplainer}
              >
                <i className="bi bi-info-circle bid-info winner-info-icon"/>
              </Tooltip>
            </h5>
            <h6>You now have {rewards ? rewards.toString() : 0} points.</h6>
            <img src={rewardsImage} className="winner-modal-badge"  alt={'rewards'}/>
            <h5>You will win this NFT if you're not outbid within 24 hours!</h5>
            <p>
              The highest bid is Ξ{displayWeiAsEther(auctionOptions.maxBid)}. If you win this NFT, 
              you can likely flip it for Ξ{nftEthProfit()} in profit.
            </p>
            <h6>That's a {roi()}x ROI! 🤑</h6>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default BidWinningModal;
