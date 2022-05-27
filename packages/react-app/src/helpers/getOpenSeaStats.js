import { nftNameOpenSeaMappings } from "../constants";
import axios from "axios";

const getOpenSeaStats = async (nftName) => {
  try {
    if (nftName) {
      console.log("we have name as: ", nftName);
      const nftNameInOpenSea = nftNameOpenSeaMappings[nftName]
        ? nftNameOpenSeaMappings[nftName]
        : nftName.toLowerCase();
      console.log("calling opensea and get details ", nftNameInOpenSea);
      const result = await axios({
        method: "get",
        url: `https://api.opensea.io/api/v1/collection/${nftNameInOpenSea}/stats`,
        headers: {
          Accept: "application/json",
        },
      });
      console.log("opensea gave: ", result);
      return result.data.stats;
    }
  } catch (e) {
    console.error("unable to get nft options");
    return {};
  }
};

export default getOpenSeaStats;
