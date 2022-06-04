import { Col, Modal, Row, Table, Tooltip, Button, Checkbox, Alert } from "antd";
import { ReactComponent as WEthLogo } from "../img/wrapped_ethereum_icon.svg";
import { useContext, useState } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import nftNameFixer from "../helpers/nftNameFixer";
import { BigNumber, ethers } from "ethers";
import { useBalance } from "eth-hooks";
import { displayWeiAsEther } from "../helpers";
import moment from "moment";

const CheckoutModal = props => {
  const { showCheckoutModal, setshowCheckoutModal } = props;
  const { localProvider, address } = props;
  const { bidButtonHandler } = props;
  const yourLocalBalance = useBalance(localProvider, address);
  const [readTos, setReadTos] = useState(false);
  const auctionOptions = useContext(AuctionOptionsContext);
  const isNoRefundAuction =
    auctionOptions.auctionFeeType === 1 &&
    auctionOptions.staticFeeInBasisPoints.eq(10000);
  const isRefundAuction = !isNoRefundAuction;
  const isOffer = auctionOptions.minimumBidIncrement.eq(0);
  const isBidding = !isOffer;

  const handleOk = async evt => {
    setshowCheckoutModal(false);
    await bidButtonHandler();
  };
  const handleCancel = evt => {
    setshowCheckoutModal(false);
  };

  const weHaveEnoughWeth = () => {
    const weHave = auctionOptions.wethBalance;
    const weRequire = auctionOptions.maxBid.add(
      auctionOptions.minimumBidIncrement,
    );
    if (weHave.gt(weRequire)) {
      return true;
    } else {
      return false;
    }
  };

  const rewardsInfo = (
    <>
      Rewards{" "}
      <Tooltip
        placement="right"
        title="Earn rewards everytime you bid. Rewards are based on the number of hours remaining in this auction. Bid early, get more. Rewards will be used to calculate sweet airdrops 🎁"
      >
        <i className="bi bi-info-circle info-icon"></i>
      </Tooltip>
    </>
  );

  const rebateExplainer = (
    <>
      You get money back if someone outbids you! That refund is based on the
      time remaining in the auction when you bid. The earlier you bid, the more
      money you get back.{" "}
      <a
        target="_blank"
        className="rebateLink"
        href="https://coral-credit-8f4.notion.site/Outbid-Rebate-Explainer-418da5f676f44d44910e831b2a81b8f4"
      >
        Click here to learn more.
      </a>
    </>
  );

  const RebateAmount = props => {
    // 100 - (100 + 200)/100
    const tfInBp = auctionOptions.feeInBasisPoints.toNumber();
    const tf = (tfInBp / 100).toFixed(2);
    const result = (100 - tf).toFixed(2);
    const durationToExpire = moment.duration(
      auctionOptions.secondsLeftInAuction,
      "seconds",
    );
    return (
      <>
        <Tooltip
          placement="right"
          title="The refund rate decreases ~4% every hour to encourage early bidding."
        >
          <div>{result}%</div>
        </Tooltip>
      </>
    );
  };

  const rebateInfo = (
    <>
      Refund If Outbid{" "}
      <Tooltip placement="right" title={rebateExplainer}>
        <i className="bi bi-info-circle info-icon"></i>
      </Tooltip>
    </>
  );

  const confirmBidDataSource = [
    {
      key: "1",
      col1: "Your Available WETH",
      col2: (
        <>
          <WEthLogo className="weth-bid-icon" />{" "}
          {displayWeiAsEther(auctionOptions.wethBalance)}
        </>
      ),
    },
    {
      key: "2",
      col1: "Your Bid Amount",
      col2: (
        <>
          <WEthLogo className="weth-bid-icon" />{" "}
          {displayWeiAsEther(
            auctionOptions.maxBid.add(auctionOptions.minimumBidIncrement),
          )}
        </>
      ),
    },
    {
      key: "3",
      col1: rewardsInfo,
      col2: auctionOptions.currentReward.toNumber(),
    }
  ];

  if(isRefundAuction){
    confirmBidDataSource.push({
      key: "4",
      col1: rebateInfo,
      col2: <RebateAmount />,
    },)
  }

  const confirmBidColumns = [
    {
      dataIndex: "col1",
      key: "col1",
    },
    {
      dataIndex: "col2",
      key: "col2",
    },
  ];

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
          <Col span={22} align="center">
            <h1>Confirm Bid</h1>
          </Col>
          <Col span={22} align="left">
            <h6 className="confirmBidItem">
              {auctionOptions.name && nftNameFixer(auctionOptions.name)} #
              {auctionOptions.tokenId.toString()}
            </h6>
            <Table
              className="confirmBidTable"
              pagination={{ position: ["none"] }}
              dataSource={confirmBidDataSource}
              columns={confirmBidColumns}
            />
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 24, marginBottom: 12 }}>
          <Col span={22} align="left">
            <Checkbox className="normal-line-height" onChange={evt => setReadTos(evt.target.checked)}>
              By checking this box, I agree to NFT Deals'{" "}
              <a target="_blank" href="https://nftdeals.xyz/tos">
                Terms of Service {" "}
              </a> {isNoRefundAuction && "and that my entire bid is a non-refundable payment to participate in this auction."}
            </Checkbox>
            <Button
              className="btn-primary bid-btn"
              size={"large"}
              disabled={readTos == false || weHaveEnoughWeth() == false}
              onClick={handleOk}
            >
              Bid Now
            </Button>
          </Col>
        </Row>
        {weHaveEnoughWeth() == false && <ErrorAlertRow />}
      </Modal>
    </>
  );
};

const ErrorAlertRow = props => {
  return (
    <Row justify="center" style={{ marginTop: 12, marginBottom: 12 }}>
      <Col span={22} align="left">
        <Alert
          message="You don't have enough WETH to bid."
          type="error"
          showIcon
          description=<ErrorDescription />
        />
      </Col>
    </Row>
  );
};

const ErrorDescription = props => {
  return (
    <>
      Get WETH from{" "}
      <a target={"_blank"} href="https://app.uniswap.org/#/swap?chain=mainnet">
        Uniswap here{"."}
      </a>
    </>
  );
};

export default CheckoutModal;
