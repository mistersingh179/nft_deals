import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Input } from "antd";

const EmailCapture = props => {
  const { address } = props;
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(async () => {
    if (!address) {
      return;
    }
    try {
      const result = await axios({
        method: "post",
        url: `${process.env.REACT_APP_NFT_DEALS_BE_DOMAIN}/users/search`,
        data: {
          walletAddress: address,
        },
      });
      console.log("*** address: ", address, " fetched email: ", result.data.emailAddress);
      setEmail(result.data.emailAddress);
    } catch (e) {
      console.log("unable to save email address: ", e);
    }
  }, [address]);

  const handleSubmit = async evt => {
    try {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_NFT_DEALS_BE_DOMAIN}/users`,
        data: {
          walletAddress: address,
          emailAddress: email,
        },
      });
      setMessage(`Our bot will notify ${email} in case you are outbid`);
    } catch (e) {
      console.log("*** unable to save email address: ", e);
    }
  };
  console.log("*** message: ", message);
  if (message && message.length && message.length > 0) {
    return <Alert style={{marginTop: 14}} message={message} type="success" />;
  }

  return (
    <>
      <p>Our notification bot can email in case you are outbid.</p>
      <Input.Group compact>
        <Input
          style={{ width: "calc(100% - 100px)" }}
          placeholder="your-email@you.com"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Input.Group>
    </>
  );
};

export default EmailCapture;
