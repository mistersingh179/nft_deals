import { Col, Modal, Row, Tooltip } from "antd";
import bayc300 from '../img/BAYC300.png'; // delete after you wire the real image 
import happyPepe from '../img/happy-clap-pepe.gif'; 
import excitedPepe from '../img/excited-pepe.gif';

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
        {/* IF User = WINNER && auction is expired */}
        {/* <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>You won this NFT!</h1>
            <img src={bayc300} className="winner-modal-badge" />
            <h4>
                We received your claim request.
            </h4>
            <p>This NFT will arrive in your wallet address when the transaction is confirmed.</p>
            <a className="rewards-contract" href={"use blockExplorer with readContracts.Reward.address"}>View this transaction on Etherscan</a>
          </Col>
        </Row> */}

        {/* inspire user = current_winner && auction still open */}
        {/* <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>You're so close to winning this NFT!</h1>
            <img src={bayc300} className="winner-modal-badge" />
            <h4>
                But you could still be outbid...
            </h4>
            <p>Be sure to come back within 24 hours to see if you won. In the meantime, follow us on Twitter for the latest announcements:</p>
            <div class="social-links mt-4">
                <a href="https://twitter.com/NFT_Deals_xyz" class="twitter"><i class="bx bxl-twitter"></i></a>
            </div>
          </Col>
        </Row> */}
        
        {/* inspire bidder who lost && auction still open */}
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>Keep Trying!</h1>
            <img src={excitedPepe} className="winner-modal-badge" />
            <h4>
                You can't claim the NFT because you're not the winner.
            </h4>             
            <p>
                But there's still time left! Bid again to stay on top.
            </p>
          </Col>
        </Row>      

        {/* inspire bidder who lost && auction expired */}
        {/* <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <h1>Sorry, you didn't win this time.</h1>
            <img src={happyPepe} className="winner-modal-badge" />
            <h4>
                But there will be more auctions!
            </h4> 
            <p>Be sure to come back to bid in the next auction. In the meantime, follow us on Twitter for the latest announcements:</p>
            <div class="social-links mt-4">
                <a href="https://twitter.com/NFT_Deals_xyz" class="twitter"><i class="bx bxl-twitter"></i></a>
            </div>            
          </Col>
        </Row>       */}

      </Modal>
    </>
  );
};

export default ClaimNFTModal;
