import { Col, Modal, Row, Table, Select, InputNumber, Space, 
    Tooltip, Button, Checkbox, Form, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ReactComponent as WEthLogo } from "../img/wrapped_ethereum_icon.svg";
import { useContext } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";

const NotificationsModal = props => {
  const { showNotificationsModal, setshowNotificationsModal } = props;

  const handleOk = evt => {
    setshowNotificationsModal(false);
  };
  const handleCancel = evt => {
    setshowNotificationsModal(false);
  };
  
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Modal
        className="winner-modal"
        title="Configure Notifications"
        visible={showNotificationsModal}
        onOk={handleOk}
        onCancel={handleCancel}
        // width={800}
      >
        <Row justify="center" style={{ marginTop: 24, marginBottom: 24 }}>
          <Col span={22} align="center"><h1>Setup Notifications</h1></Col>
          <Col span={18} align="left">

            <Form
                name="basic"
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email.' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="Auction">
                <Select>
                    <Select.Option value="demo">BoredApeYachtClub, #2124</Select.Option>
                    <Select.Option value="demo">Doodles, Doodle #368</Select.Option>
                    <Select.Option value="demo">Azuki, Azuki #52</Select.Option>
                    <Select.Option value="demo">Mfers, #234 </Select.Option>
                </Select>
            </Form.Item>
            <h6>Notify me when:</h6>
            <Form.Item name="outbidNotification" 
                valuePropName="checked">
            <Checkbox>I'm outbid</Checkbox>
            </Form.Item>

            <Form.Item label="There are" colon={false}>
                <Form.Item name="input-number" noStyle>
                    <InputNumber size="small" min={1} max={23} />
                </Form.Item>
                <span className="ant-form-text"> hours left in the auction</span>
            </Form.Item>
            <Form.List name="timed-notification">
                {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 1 }} align="baseline">
                        <Form.Item label="There are" colon={false}>
                            <Form.Item name="input-number" noStyle>
                                <InputNumber size="small" min={1} max={23} />
                            </Form.Item>
                            <span className="ant-form-text"> hours left in the auction</span>
                        </Form.Item>                        
                        <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                    ))}
                    <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Timed Notification
                    </Button>
                    </Form.Item>
                </>
                )}
            </Form.List>
            
            <Form.Item >
            <Button type="primary" htmlType="submit" className="notifications-form-button">
            Save
            </Button>
            </Form.Item>
            </Form>              
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default NotificationsModal;
