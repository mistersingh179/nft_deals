import {useState, useEffect} from "react";
import moment from "moment";
import {useBlockNumber} from "eth-hooks";
import useAuctionContract from './useAuctionContract'
import {ethers} from "ethers";

export default (readContracts, auctionContractAddress, localProvider) => {

  const [durationToExpire, setDurationToExpire] = useState(undefined)
  const blockNumber = useBlockNumber(localProvider)
  const auctionContract = useAuctionContract(readContracts, auctionContractAddress, localProvider);

  useEffect(() => {
    const init = async () => {
      if(localProvider && auctionContract){
        const block = await localProvider.getBlock()
        let secondsLeftInAuction = await auctionContract.secondsLeftInAuction();
        secondsLeftInAuction = secondsLeftInAuction.toNumber()
        console.log('*** seconds left in auction: ', secondsLeftInAuction)
        if(secondsLeftInAuction == 0){
          setDurationToExpire(moment.duration(0, 'seconds'));
        }else {
          const behindBy = (moment().unix() - block.timestamp)
          console.log('*** behind by: ', behindBy)
          let adjustSecondsLeftInAuction = secondsLeftInAuction - behindBy
          console.log('*** seconds left in auction: ', adjustSecondsLeftInAuction)
          setDurationToExpire(moment.duration(adjustSecondsLeftInAuction, 'seconds'));
        }
      }
    }
    init()
  }, [localProvider, auctionContract, blockNumber])

  // setup decremnting the time manually
  useEffect(() => {
    let intervalHandler
    const decrementDuration = async () => {
      console.log('*** decrementing')
      setDurationToExpire(previous => {
        if(!previous){
          return previous
        }else{
          const updatedDuration = previous.clone()
          updatedDuration.subtract(1, 'seconds')
          return updatedDuration
        }
      })
    }
    console.log('*** registering')
    intervalHandler = window.setInterval(decrementDuration, 1000)
    return () => {
      console.log('*** unregistering')
      window.clearInterval(intervalHandler)
    }
  }, [auctionContractAddress])

  return durationToExpire
}