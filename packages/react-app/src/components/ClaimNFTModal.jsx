import { Col, Modal, Row, Tooltip } from "antd";
import bayc300 from '../img/BAYC300.png'; // delete after you wire the real image 

const ClaimNFTModal = props => {
  const { showNFTModal, setShowNFTModal } = props;

  const handleOk = evt => {
    setShowNFTModal(false);
  };
  const handleCancel = evt => {
    setShowNFTModal(false);
  };

  return (
    <>
      <Modal
        className="winner-modal"
        title="Latest Bids"
        visible={showNFTModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>You won this NFT!</h1>
            <img src={bayc300} className="winner-modal-badge" />
            <h6>
                Your claim is being mined, and the NFT will arrive in your wallet when the transaction is confirmed.
            </h6>
{/* NEEDS REAL HREF from readContracts.Reward.address – don't forget to wire this */}
            <a className="rewards-contract" href={"use blockExplorer with readContracts.Reward.address"}>View this transaction on Etherscan</a>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ClaimNFTModal;
