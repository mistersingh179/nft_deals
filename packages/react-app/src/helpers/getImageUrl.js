import axios from "axios";

const getImageFromExternalJsonUrl = async url => {
  const result = await axios({
    method: "get",
    url: url,
    headers: {
      Accept: "application/json",
    },
  });
  return result.data.image;
};

const getImageUrl = async tokenURI => {
  var imageUrl;
  if (
    tokenURI === "https://live---metadata-5covpqijaa-uc.a.run.app/metadata/7672"
  ) {
    imageUrl = "https://live---metadata-5covpqijaa-uc.a.run.app/images/7672";
  } else if (tokenURI.indexOf("http") === 0) {
    imageUrl = await getImageFromExternalJsonUrl(tokenURI);
  } else if (tokenURI.indexOf("ipfs://") === 0) {
    const ipfsHash = tokenURI.split("ipfs://")[1];
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
    imageUrl = await getImageFromExternalJsonUrl(ipfsUrl);
    if (imageUrl.indexOf("http") === 0) {
      // updateAuctionOptions("imageUrl", imageUrl);
    } else if (imageUrl.indexOf("ipfs://") === 0) {
      const ipfsHash = imageUrl.split("ipfs://")[1];
      imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
    } else {
      imageUrl = "";
    }
  } else if (tokenURI.indexOf("data:application/json;base64,") === 0) {
    const base64DataObj = tokenURI.replace("data:application/json;base64,", "");
    const dataObj = JSON.parse(atob(base64DataObj));
    imageUrl = dataObj.image;
  } else {
    imageUrl = "";
  }

  return imageUrl;
};

export default getImageUrl;
