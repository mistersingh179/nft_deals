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
                <Col span={24} align="middle">
                    <h1>Congratulations!</h1>
                    <h5>You outbid the competition and</h5>
                        <h5>earned 20 points for bidding.
                        <Tooltip placement="right" title="You earn rewards every time you bid, 
                        where the number of points is based on the number of hours 
                        remaining in the auction."> <i className="bi bi-info-circle bid-info winner-info-icon"></i></Tooltip>
                    </h5>
                    <h1><img src={rewardsImage} style={{height: 50}} /></h1>
                    <h5>Your Rewards Balance </h5>
                    <h5>{rewards && ethers.utils.commify(rewards)}</h5>
                </Col>
            </Row>
        </Modal>
    </>
  )
}

export default SampleWinningModal