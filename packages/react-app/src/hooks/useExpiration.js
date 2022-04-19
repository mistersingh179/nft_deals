import {useState, useEffect} from "react";
import moment from "moment";
import {useBlockNumber} from "eth-hooks";

export default (expiration, localProvider) => {

  const blockNumber = useBlockNumber(localProvider);

  const [durationToExpire, setDurationToExpire] = useState(moment.duration(24, 'hours'))

  useEffect(() => {
    const updateExpiration = () => {
      console.log('asked to update time')
      setDurationToExpire(prevDuration => {
        console.log('*** manually ticking time down')
        const newDuration = prevDuration.clone()
        newDuration.subtract(1, 's')
        return newDuration
      })
    }

    if(expiration){
      const exp = moment(expiration, 'X')
      const duration = moment.duration(exp.diff(moment()))
      console.log('*** syncing time with blockchain')
      setDurationToExpire(duration)
    }

    const intervalHandler = setInterval(updateExpiration, 1000);

    return () => {
      console.log('*** stopping manual time ticking')
      window.clearInterval(intervalHandler)
    }
  }, [expiration, blockNumber])

  return durationToExpire
}