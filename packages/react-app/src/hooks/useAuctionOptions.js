import { useAuctionContract } from "./index";
import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useBlockNumber } from "eth-hooks";
import axios from "axios";
import { nftNameOpenSeaMappings } from '../constants'

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
    dynamicProtocolFeeInBasisPoints: ethers.BigNumber.from(0),
    listerTakeInPercentage: ethers.BigNumber.from(0),
    winningAddress: zeroAddress,
    highestBid: ethers.BigNumber.from(0),
    maxBid: ethers.BigNumber.from(0),
    expiration: ethers.BigNumber.from(0),
    createdAt: ethers.BigNumber.from(0),
    secondsLeftInAuction: ethers.BigNumber.from(0),
    hoursLeftInAuction: ethers.BigNumber.from(0),
    minimumBidIncrement: ethers.BigNumber.from(0),
    auctionTimeIncrementOnBid: ethers.BigNumber.from(0),
    _weHavePossessionOfNft: false,
    qualifiesForRewards: false,
    paused: false,
    nftContract: zeroAddress,
    nftOwner: zeroAddress,
    auctionFactory: zeroAddress,
    tokenId: ethers.BigNumber.from(0),
    currentReward: ethers.BigNumber.from(0),
    rewards: ethers.BigNumber.from(0),
    wethBalance: ethers.BigNumber.from(0),
    symbol: "",
    name: "",
    tokenURI: "",
    imageUrl: "",
    stats: {},
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

  useEffect(() => {
    const getImageFromUrl = async url => {
      const result = await axios({
        method: "get",
        url: url,
        headers: {
          Accept: "application/json",
        },
      });
      const imageUrl = result.data.image;
      return imageUrl;
    };

    const init = async () => {
      const tokenURI = auctionOptions.tokenURI;
      var imageUrl;
      if (tokenURI.indexOf("http") == 0) {
        const imageUrl = await getImageFromUrl(tokenURI);
        updateAuctionOptions("imageUrl", imageUrl);
      } else if (tokenURI.indexOf("ipfs://") == 0) {
        const ipfsHash = tokenURI.split("ipfs://")[1];
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
        imageUrl = await getImageFromUrl(ipfsUrl);
        console.log("*** imageUrl: ", imageUrl);

        if (imageUrl.indexOf("http") == 0) {
          updateAuctionOptions("imageUrl", imageUrl);
        } else if (imageUrl.indexOf("ipfs://") == 0) {
          const ipfsHash = imageUrl.split("ipfs://")[1];
          imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
          updateAuctionOptions("imageUrl", imageUrl);
        } else {
          updateAuctionOptions("imageUrl", "");
        }
      } else if (tokenURI.indexOf("data:application/json;base64,") == 0) {
        const base64DataObj = tokenURI.replace(
          "data:application/json;base64,",
          "",
        );
        const dataObj = JSON.parse(atob(base64DataObj));
        const imageUrl = dataObj.image;
        updateAuctionOptions("imageUrl", imageUrl);
      } else {
        updateAuctionOptions("imageUrl", "");
      }
    };
    init();
  }, [auctionOptions.tokenURI]);

  useEffect(() => {
    const init = async () => {
      try {
        if (auctionOptions.name) {
          const nftNameInOpenSea = nftNameOpenSeaMappings[auctionOptions.name]
            ? nftNameOpenSeaMappings[auctionOptions.name].toLowerCase()
            : auctionOptions.name.toLowerCase();
          console.log("calling opensea and get details ", nftNameInOpenSea);
          const result = await axios({
            method: "get",
            url: `https://api.opensea.io/api/v1/collection/${nftNameInOpenSea}/stats`,
            headers: {
              Accept: "application/json",
            },
          });
          console.log("opensea gave: ", result);
          setAuctionOptions(prevObj => {
            return { ...prevObj, stats: result.data.stats };
          });
        }
      } catch (e) {
        console.error("unable to get nft options");
      }
    };
    init();
  }, [auctionOptions.name]);

  return auctionOptions;
};

export default useAuctionOptions;
