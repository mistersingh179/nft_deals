import {useEffect, useState} from "react";

const useAuctionContract = (readContracts, auctionContractAddress, localProvider) => {
  const [auctionContract, setAuctionContract] = useState();

  useEffect(async () => {
    if(readContracts && readContracts.Auction && auctionContractAddress && localProvider){
      try{
        const contractCode = await localProvider.getCode(auctionContractAddress)
        if(contractCode != '0x'){
          const ac = readContracts.Auction.attach(auctionContractAddress);
          setAuctionContract(ac)
        }
      }catch(e){
        console.error('unable to setup contract', e)
      }

    }
  }, [readContracts && readContracts.Auction, auctionContractAddress]);

  return auctionContract
}

export default useAuctionContract