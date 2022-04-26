import { useAuctionContract } from "./index";
import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useBlockNumber } from "eth-hooks";
import axios from 'axios'

const useAuctionOptions = (
  readContracts,
  auctionContractAddress,
  localProvider,
  address,
) => {
  const auctionContract = useAuctionContract(
    readContracts,
    auctionContractAddress,
    localProvider,
  );
  const blockNumber = useBlockNumber(localProvider);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const [auctionOptions, setAuctionOptions] = useState({
    winningAddress: zeroAddress,
    highestBid: ethers.BigNumber.from(0),
    maxBid: ethers.BigNumber.from(0),
    expiration: ethers.BigNumber.from(0),
    secondsLeftInAuction: ethers.BigNumber.from(0),
    minimumBidIncrement: ethers.BigNumber.from(0),
    auctionTimeIncrementOnBid: ethers.BigNumber.from(0),
    _weHavePossessionOfNft: false,
    nftContract: zeroAddress,
    tokenId: ethers.BigNumber.from(0),
    currentReward: ethers.BigNumber.from(0),
    rewards: ethers.BigNumber.from(0),
    wethBalance: ethers.BigNumber.from(0),
    /*sybmol: "",
    name: "",
    tokenUri: "",
    imageUrl: "",*/
  });

  const updateAuctionOptions = (name, value) => {
    setAuctionOptions(prev => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    const getAllAuctionData = async () => {
      try {
        if (auctionContract && address) {
          const allData = await auctionContract.getAllData(address);
          Object.keys(allData).map(key => {
            if (window.isNaN(key)) {
              console.log("*** fetched: ", key, allData[key]);
              updateAuctionOptions(key, allData[key]);
            }
          });
          console.log("*** allData: ", allData);
        }
      } catch (e) {
        console.error("*** error: ", e);
      }
    };
    getAllAuctionData();
  }, [auctionContract, blockNumber, address]);

  /*useEffect(() => {
    const getImageFromUrl = async (url) => {
      const result = await axios({
        method: 'get',
        url: url,
        headers: {
          'Accept': 'application/json'
        }
      })
      const imageUrl = result.data.image
      return imageUrl
    };

    const init = async () => {
      const tokenUri = auctionOptions.tokenUri
      var imageUrl;
      if(tokenUri.indexOf('http') == 0){
        const imageUrl = await getImageFromUrl(tokenUri)
        updateAuctionOptions('imageUrl', imageUrl)

      }else if (tokenUri.indexOf('ipfs://') == 0){
        const ipfsHash = tokenUri.split("ipfs://")[1]
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        imageUrl = await getImageFromUrl(ipfsUrl)
        console.log('*** imageUrl: ', imageUrl)

        if(imageUrl.indexOf('http') == 0){
          updateAuctionOptions('imageUrl', imageUrl)
        }else if(imageUrl.indexOf('ipfs://') == 0){
          const ipfsHash = imageUrl.split("ipfs://")[1]
          imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`
          updateAuctionOptions('imageUrl', imageUrl)
        }else{
          updateAuctionOptions('imageUrl', '')
        }

      }else if (tokenUri.indexOf('data:application/json;base64,') == 0){
        const base64DataObj = tokenUri.replace('data:application/json;base64,', '')
        const dataObj = JSON.parse(atob(base64DataObj))
        const imageUrl = dataObj.image
        updateAuctionOptions('imageUrl', imageUrl)
      }else {
        updateAuctionOptions('imageUrl', '')
      }
    }
    init()
  }, [updateAuctionOptions.tokenUri])*/

  return auctionOptions;
};

export default useAuctionOptions;
