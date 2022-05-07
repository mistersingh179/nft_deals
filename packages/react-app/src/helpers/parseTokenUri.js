import axios from "axios";

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

const parseTokenUri = async tokenURI => {
  var imageUrl;
  if (tokenURI.indexOf("http") == 0) {
    const imageUrl = await getImageFromUrl(tokenURI);
    return imageUrl;
  } else if (tokenURI.indexOf("ipfs://") == 0) {
    const ipfsHash = tokenURI.split("ipfs://")[1];
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
    imageUrl = await getImageFromUrl(ipfsUrl);
    console.log("*** imageUrl: ", imageUrl);

    if (imageUrl.indexOf("http") == 0) {
      return imageUrl;
    } else if (imageUrl.indexOf("ipfs://") == 0) {
      const ipfsHash = imageUrl.split("ipfs://")[1];
      imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      return imageUrl;
    } else {
      return imageUrl;
    }
  } else if (tokenURI.indexOf("data:application/json;base64,") == 0) {
    const base64DataObj = tokenURI.replace("data:application/json;base64,", "");
    const dataObj = JSON.parse(atob(base64DataObj));
    const imageUrl = dataObj.image;
    return imageUrl;
  } else {
    return "";
  }
};

export default parseTokenUri;
