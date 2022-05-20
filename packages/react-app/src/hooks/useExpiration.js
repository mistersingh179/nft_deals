import { useState, useEffect } from "react";
import moment from "moment";
import { useBlockNumber } from "eth-hooks";
import useAuctionContract from "./useAuctionContract";
import { ethers } from "ethers";

export default (readContracts, auctionContractAddress, localProvider) => {
  const [durationToExpire, setDurationToExpire] = useState(undefined);
  const blockNumber = useBlockNumber(localProvider);
  const auctionContract = useAuctionContract(
    readContracts,
    auctionContractAddress,
    localProvider,
  );

  useEffect(() => {
    const init = async () => {
      if (localProvider && auctionContract) {
        const block = await localProvider.getBlock();
        let secondsLeftInAuction = await auctionContract.secondsLeftInAuction();
        secondsLeftInAuction = secondsLeftInAuction.toNumber();
        if (secondsLeftInAuction === 0) {
          setDurationToExpire(moment.duration(0, "seconds"));
        } else {
          const behindBy = moment().unix() - block.timestamp;
          let adjustSecondsLeftInAuction = secondsLeftInAuction - behindBy;
          console.log(adjustSecondsLeftInAuction);
          setDurationToExpire(
            moment.duration(adjustSecondsLeftInAuction, "seconds"),
          );
        }
      }
    };
    init();
  }, [localProvider, auctionContract, blockNumber]);

  // setup decremnting the time manually
  useEffect(() => {
    let intervalHandler;
    const decrementDuration = async () => {
      setDurationToExpire(previous => {
        if (!previous) {
          return previous;
        } else {
          const updatedDuration = previous.clone();
          updatedDuration.subtract(1, "seconds");
          return updatedDuration;
        }
      });
    };
    intervalHandler = window.setInterval(decrementDuration, 1000);
    return () => {
      window.clearInterval(intervalHandler);
    };
  }, [auctionContractAddress]);

  return durationToExpire;
};
