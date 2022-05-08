import { Col, Modal, Row, Table, Tooltip, Button, Checkbox } from "antd";
import { ReactComponent as WEthLogo } from "../img/wrapped_ethereum_icon.svg";
import { useContext } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";

const CheckoutModal = props => {
  const { showCheckoutModal, setshowCheckoutModal } = props;

  const handleOk = evt => {
    setshowCheckoutModal(false);
  };
  const handleCancel = evt => {
    setshowCheckoutModal(false);
  };

  const rewardsInfo = <>
    Rewards <Tooltip
        placement="right"
        title="Earn rewards everytime you bid. Rewards are based on the number of hours remaining in this auction. Bid early, get more. Rewards will be used to calculate sweet airdrops 🎁"
      >
        <i className="bi bi-info-circle info-icon"></i>
      </Tooltip>
  </>

const rebateExplainer = <>You get money back if someone outbids you!
        That rebate is based on the time remaining in the auction when you bid. 
        The earlier you bid, the more money you get back. <a target="_blank" className="rebateLink" href="https://coral-credit-8f4.notion.site/Outbid-Rebate-Explainer-418da5f676f44d44910e831b2a81b8f4">Click here to learn more.</a>
    </>

const fundsAavailable = <><WEthLogo className="weth-bid-icon" /> 0.0231
    </>

const bidAmount = <><WEthLogo className="weth-bid-icon" /> 0.0036
    </>

const rebateAmount = <>
        <div>96%</div>
        <div className="rebateDecrease">
        <Tooltip placement="right" 
        title="The rebate rate drops approximately 4% per hour remaining in the auction to encourage early bidding."
        >
         -4% in 34m
        </Tooltip></div>
    </>

  const rebateInfo = <>
    Rebate If Outbid <Tooltip
        placement="right"
        title={rebateExplainer}
        >
        <i className="bi bi-info-circle info-icon"></i>
    </Tooltip>        
  </>  

  const confirmBidDataSource = [
    {
      key: '1',
      col1: 'Your Available WETH',
      col2: fundsAavailable,
    },
    {
      key: '2',
      col1: 'Your Bid Amount',
      col2: bidAmount,
    },
    {
        key: '3',
        col1: rebateInfo,
        col2: rebateAmount,
    },
    {
        key: '4',
        col1: rewardsInfo,
        col2: 23,
    },          
  ];
  
  const confirmBidColumns = [
    { 
      dataIndex: 'col1',
      key: 'col1',
    },
    {
      dataIndex: 'col2',
      key: 'col2',
    },
  ];
  
  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  return (
    <>
      <Modal
        className="winner-modal"
        title="Confirm Bid"
        visible={showCheckoutModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={22} align="center"><h1>Confirm Bid</h1></Col>
          <Col span={22} align="left">
            <h6 className="confirmBidItem">Bored Ape Yacht Club #8956</h6>
            <Table className="confirmBidTable" 
                pagination={{ position: ["none"] }}
                dataSource={confirmBidDataSource} 
                columns={confirmBidColumns} />
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={22} align="left">
            <Checkbox onChange={onChange}>By checking this box, I agree to NFT Deals' <a target="_blank" href="https://nftdeals.xyz/tos">Terms of Service</a></Checkbox>
            <Button
                className="btn-primary bid-btn"
                size={"large"}
                onClick={handleOk} // @SANDEEP: update with proper click handler
            >
                Bid Now
            </Button>        
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default CheckoutModal;
