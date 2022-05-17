import { Col, Modal, Row } from "antd";
import EmailCapture from './EmailCapture'

const NotificationsModal = props => {
  const { showNotificationsModal, setshowNotificationsModal, address } = props;

  const handleOk = evt => {
    setshowNotificationsModal(false);
  };
  const handleCancel = evt => {
    setshowNotificationsModal(false);
  };

  const onFinish = values => {
    console.log("Success:", values);
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        className="winner-modal"
        title="Configure Notifications"
        visible={showNotificationsModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={22} align="center">
            <h1>Setup Notifications</h1>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={22}>
            <ul>
              <li>If you are outbid, our bot can notify you.</li>
              <li>If a new auction is going to launch, our bot can notify you.</li>
              <li>If there is alpha on the table, our bot can notify you.</li>
              <li>If we break the internet, still our bot can notify you.</li>
            </ul>

          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={22} align="center">
            <EmailCapture address={address} />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default NotificationsModal;
