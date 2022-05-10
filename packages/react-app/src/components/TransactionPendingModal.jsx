import { Col, Modal, Row, Button } from "antd";
import { useContext, useMemo } from 'react'
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";

const TransactionPendingModal = props => {
  const { showTransactionModal, setShowTransactionModal } = props;
  const { transactionHash, blockExplorer } = props;

  const transactionLink = useMemo(() => {
    return `${blockExplorer || "https://etherscan.io/"}tx/${transactionHash}`;
  }, [blockExplorer, transactionHash]);

  return (
    <>
      <Modal
        className="winner-modal"
        title="Latest Bids"
        visible={showTransactionModal}
        closeIcon={<></>}
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
              Your bid should be confirmed on the blockchain soon. You may
              navigate away from this modal.
            </p>
            <Button
              className="etherscan-link"
              type="link"
              href={transactionLink}
              target="_blank"
              disabled={transactionHash == null}
            >
              View your transaction on Etherscan.
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TransactionPendingModal;
