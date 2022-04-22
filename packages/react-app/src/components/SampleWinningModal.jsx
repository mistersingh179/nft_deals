import {Button, Modal, Row, Col, Tooltip} from "antd";
import {useState} from "react";
import rewardsImage from '../img/rewards.png';
import {ethers, utils} from "ethers";
// use something like ConfettiCannon to show up on modal open:
// import ConfettiCannon from 'react-native-confetti-cannon';

const SampleWinningModal = props => {
  const {readContracts, auctionContractAddress, mainnetProvider, localProvider, address, blockExplorer, rewards} = props
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false)
  const handleOk = evt => {setShowBidHistoryModal(false)}
  const handleCancel = evt => {setShowBidHistoryModal(false)};

  return (
    <>
        {/* <ConfettiCannon count={200} origin={{x: -10, y: 0}} /> */}
        <Button
            className="btn btn-secondary btn-sm btn-block bid-details-btn code-placeholder"
            onClick={evt => setShowBidHistoryModal(true)}
        >
            Manually Trigger Condition: Winning Bid
        </Button>
        <Modal className="winner-modal" title="Latest Bids" visible={showBidHistoryModal} onOk={handleOk} onCancel={handleCancel}>
            <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
                <Col span={18} align="middle">
                    <h1>Congratulations!</h1>
                    <h5>You earned 20 points by bidding.
                        <Tooltip placement="right" title="Get rewards every time you bid, 
                        where the amount is based on the number of hours 
                        remaining in the auction."> <i className="bi bi-info-circle bid-info winner-info-icon"></i></Tooltip>
                    </h5>
                    <img src={rewardsImage} className="winner-modal-badge"/>
                    <h5>You will win this NFT if you're not outbid within 24 hours!</h5>
                    <p>
                        You bid Ξ0.0021. If you win this NFT – worth approximately 
                        Ξ124 ($334,234) – you can flip it for Ξ123.99 in profit.
                    </p>                    
                    <h6>That's a 104,122x ROI! 🤑</h6>

                    {/* <h5>Your Rewards Balance </h5>
                    <h5>{rewards && ethers.utils.commify(rewards)}</h5> */}
                </Col>
            </Row>
        </Modal>
    </>
  )
}

export default SampleWinningModal