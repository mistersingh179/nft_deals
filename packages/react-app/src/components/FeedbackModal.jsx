import { Col, Modal, Row } from "antd";
import { TwitterTweetEmbed } from "react-twitter-embed";

const FeedbackModal = props => {
  const { showFeedbackModal, setShowFeedbackModal } = props;

  const handleOk = evt => {
    setShowFeedbackModal(false);
  };
  const handleCancel = evt => {
    setShowFeedbackModal(false);
  };

  return (
    <Modal
      className="winner-modal"
      title="Daily Rewards"
      visible={showFeedbackModal}
      onOk={handleOk}
      width={600}
      onCancel={handleCancel}
    >
      <Row justify="center" style={{ marginTop: 12, marginBottom: 12 }}>
        <Col span={24} align="middle">
          <h4>Want some bonus rewards?</h4>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: 12, marginBottom: 0 }}>
        <Col span={24}>
          <ul>
            <li>Heart & reply the tweet below and tag 2 friends.</li>
            <li>Then DM us your wallet address.</li>
            <li>Now our bot will drop 23 bonus rewards to your wallet.</li>
            <li>You can do this at most once per day to get rewards.</li>
          </ul>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: 0, marginBottom: 12 }}>
        <Col span={24} align="middle">
          <TwitterTweetEmbed tweetId={"1527343719040819200"} />
        </Col>
      </Row>
    </Modal>
  );
};

export default FeedbackModal;
