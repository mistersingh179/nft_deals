import {useAuctionContract} from "./index";
import {BigNumber, ethers} from "ethers";
import {useEffect, useState} from "react";
import {useBlockNumber} from "eth-hooks";

const useAuctionOptions = (readContracts, auctionContractAddress, localProvider) => {
  const auctionContract = useAuctionContract(readContracts, auctionContractAddress, localProvider)
  const blockNumber = useBlockNumber(localProvider);

  const [auctionOptions, setAuctionOptions] = useState({
    winningAddress: '0x0000000000000000000000000000000000000000',
    highestBid: ethers.BigNumber.from(0),
    expiration: ethers.BigNumber.from(0),
    minimumBidIncrement: ethers.BigNumber.from(0),
    _weHavePossessionOfNft: false,
  });
  const updateAuctionOptions = (name, value) => {
    setAuctionOptions(prev => {
      return {...prev, [name]: value}
    })
  }

  useEffect(() => {
    const setupAuctionOptions = async () => {
      if(auctionContract){
        const winningAddress = await auctionContract.winningAddress();
        const highestBid = await auctionContract.highestBid();
        const expiration = await auctionContract.expiration();
        const minimumBidIncrement = await auctionContract.minimumBidIncrement();
        const _weHavePossessionOfNft = await auctionContract._weHavePossessionOfNft();
        updateAuctionOptions('winningAddress', winningAddress)
        updateAuctionOptions('highestBid', highestBid)
        updateAuctionOptions('expiration', expiration)
        updateAuctionOptions('minimumBidIncrement', minimumBidIncrement)
        updateAuctionOptions('_weHavePossessionOfNft', _weHavePossessionOfNft)
      }
    }
    setupAuctionOptions()
  }, [auctionContract, blockNumber]);

  return auctionOptions
}

export default useAuctionOptions