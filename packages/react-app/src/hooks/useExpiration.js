import {useState, useEffect} from "react";
import moment from "moment";
import {useBlockNumber} from "eth-hooks";
import useAuctionContract from './useAuctionContract'
import {ethers} from "ethers";

export default (readContracts, auctionContractAddress, localProvider) => {

  const incrementTime = 1000
  const [durationToExpire, setDurationToExpire] = useState(moment.duration(24, 'hours'))
  const blockNumber = useBlockNumber(localProvider)
  const auctionContract = useAuctionContract(readContracts, auctionContractAddress, localProvider);

  useEffect(() => {
    const init = async () => {
      if(auctionContract){
        const expiration = await auctionContract.expiration()
        const exp = moment(expiration, 'X')
        const duration = moment.duration(exp.diff(moment()))
        console.log('*** syncing with blockchain and got latest duration to be: ', duration)
        setDurationToExpire(duration)
      }
    }
    init()
  }, [auctionContract, blockNumber])

  useEffect(() => {
    const updateExpiration = () => {
      setDurationToExpire(prevDuration => {
        // console.log('*** manually ticking time down')
        const newDuration = prevDuration.clone()
        newDuration.subtract(incrementTime, 'ms')
        return newDuration
      })
    };

    // console.log('*** setting up interval to update time')
    const intervalHandler = setInterval(updateExpiration, incrementTime);

    return () => {
      // console.log('*** removing interval which updates time')
      window.clearInterval(intervalHandler)
    }
  }, [])

  return durationToExpire
}