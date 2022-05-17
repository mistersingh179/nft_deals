import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
} from "antd";
import rewardsImage from "../img/rewards.png";
import { displayWeiAsEther } from "../helpers";
import { ethers } from "ethers";
import { useContext, useState } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import EmailCapture from "./EmailCapture";

const PostRedCarpetSignupModal = props => {
  const { showPostRedCarpetSignupModal, setShowPostRedCarpetSignupModal } =
    props;
  const { address } = props;

  const handleOk = evt => {
    setShowPostRedCarpetSignupModal(false);
  };
  const handleCancel = evt => {
    setShowPostRedCarpetSignupModal(false);
  };

  return (
    <>
      <Modal
        title="Red Carpet List Confirmation"
        visible={showPostRedCarpetSignupModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Row justify="center">
          <Col span={18} align="middle">
            <h1>Congratulations</h1>
            <img
              src={rewardsImage}
              className="winner-modal-badge"
              alt={"rewards"}
            /><br/>
            You have been added to the Red Carpet List. When this auction
            launches you will get 2x rewards.{""}
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop:12, marginBottom: 24 }}>
          <Col span={18} align="middle">
            <p>
              Input your email and we will let you know when this auction
              launches:
            </p>
            <EmailCapture address={address} />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default PostRedCarpetSignupModal;
