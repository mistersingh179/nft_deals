import { useAuctionContract } from "./index";
import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBlockNumber } from "eth-hooks";
import axios from "axios";
import { nftNameOpenSeaMappings } from "../constants";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import getImageUrl from '../helpers/getImageUrl'

const useAuctionOptions = (
  readContracts,
  auctionContractAddress,
  localProvider,
  address,
  targetNetwork,
  mainnetProvider,
) => {
  const blockNumber = useBlockNumber(localProvider);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const retries = useRef(0);
  useEffect(() => {
    const getData = async () => {
      try {
        console.log("*** getting price from etherscan");
        const result = await axios({
          method: "get",
          url: `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHER_SCAN_API_KEY_TOKEN}`,
          headers: {
            Accept: "application/json",
          },
        });
        if (result && result.data && result.data.status == "0") {
          throw "eror";
        }
        const price = result.data.result.ethusd;
        const priceInCents = parseInt(parseFloat(price).toFixed(2) * 100);
        setAuctionOptions(prevObj => {
          return { ...prevObj, priceInCents: BigNumber.from(priceInCents) };
        });
      } catch (e) {
        if (retries.current < 5) {
          console.log(
            "*** etherscan data error. retry count is: ",
            retries.current,
          );
          setTimeout(getData, 1000);
          retries.current = retries.current + 1;
        } else {
          console.log(
            "*** etherscan data error. no retries as: ",
            retries.current,
          );
        }
      }
    };
    getData();
  }, []);

  const auctionContract = useAuctionContract(
    readContracts,
    auctionContractAddress,
    localProvider,
  );

  const [auctionOptions, setAuctionOptions] = useState({
    auctionFeeType: 1,
    staticFeeInBasisPoints: ethers.BigNumber.from(10000),
    feeInBasisPoints: ethers.BigNumber.from(10000),
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
    priceInCents: ethers.BigNumber.from(0),
    redCarpetLength: 0,
    redCarpetState: 1,
    presentInRedCarpet: false,
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
          window.allData = allData; // for Debug Purposes
        }
      } catch (e) {
        console.error("*** error: ", e);
      }
    };
    getAllAuctionData();
  }, [auctionContract, blockNumber, address]);

  useEffect(() => {
    const init = async () => {
      const tokenURI = auctionOptions.tokenURI;
      if(tokenURI){
        const imageUrl = await getImageUrl(tokenURI);
        updateAuctionOptions("imageUrl", imageUrl);
      }
    };
    init();
  }, [auctionOptions.tokenURI]);

  useEffect(() => {
    const init = async () => {
      try {
        if (auctionOptions.name) {
          console.log("we have name as: ", auctionOptions.name);
          const nftNameInOpenSea = nftNameOpenSeaMappings[auctionOptions.name]
            ? nftNameOpenSeaMappings[auctionOptions.name]
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
