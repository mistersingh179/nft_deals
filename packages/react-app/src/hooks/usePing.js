import { useCallback, useEffect } from "react";
import axios from "axios";

const usePing = address => {
  const makePingRequest = useCallback(async () => {
    try {
      console.log("pinging");
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_NFT_DEALS_BE_DOMAIN}/ping`,
      });
    } catch (err) {
      console.log("errror pinging be: ", err);
    }
  });

  useEffect(() => {
    console.log("registering pinger");
    makePingRequest();
    const intervalHandler = setInterval(makePingRequest, 59 * 60 * 1000);
    return () => {
      console.log("unregistering pinger");
      window.clearInterval(intervalHandler);
    };
  }, [address]);
};

export default usePing;
