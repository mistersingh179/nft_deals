import {useAuctionContract} from "./index";
import {BigNumber, ethers} from "ethers";
import {useEffect, useState} from "react";
import {useBlockNumber} from "eth-hooks";

const useAuctionOptions = (readContracts, auctionContractAddress, localProvider) => {
  const auctionContract = useAuctionContract(readContracts, auctionContractAddress, localProvider)
  const blockNumber = useBlockNumber(localProvider);
  const zeroAddress = '0x0000000000000000000000000000000000000000'

  const [auctionOptions, setAuctionOptions] = useState({
    winningAddress: zeroAddress,
    highestBid: ethers.BigNumber.from(0),
    maxBid: ethers.BigNumber.from(0),
    expiration: ethers.BigNumber.from(0),
    minimumBidIncrement: ethers.BigNumber.from(0),
    auctionTimeIncrementOnBid: ethers.BigNumber.from(0),
    _weHavePossessionOfNft: false,
    nftContract: zeroAddress,
    tokenId: ethers.BigNumber.from(0)
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
        const maxBid = await auctionContract.maxBid();
        const expiration = await auctionContract.expiration();
        const _weHavePossessionOfNft = await auctionContract._weHavePossessionOfNft();
        updateAuctionOptions('winningAddress', winningAddress)
        updateAuctionOptions('highestBid', highestBid)
        updateAuctionOptions('expiration', expiration)
        updateAuctionOptions('_weHavePossessionOfNft', _weHavePossessionOfNft)
        updateAuctionOptions('maxBid', maxBid)
      }
    }
    setupAuctionOptions()
  }, [auctionContract, blockNumber]);

  useEffect(() => {
    const setupAuctionOptions = async () => {
      if(auctionContract){
        const nftContract = await auctionContract.nftContract();
        const tokenId = await auctionContract.tokenId();
        const minimumBidIncrement = await auctionContract.minimumBidIncrement();
        const auctionTimeIncrementOnBid = await auctionContract.auctionTimeIncrementOnBid();
        updateAuctionOptions('nftContract', nftContract)
        updateAuctionOptions('tokenId', tokenId)
        updateAuctionOptions('minimumBidIncrement', minimumBidIncrement)
        updateAuctionOptions('auctionTimeIncrementOnBid', auctionTimeIncrementOnBid)
      }
    }
    setupAuctionOptions()
  }, [auctionContract]);



  return auctionOptions
}

export default useAuctionOptions