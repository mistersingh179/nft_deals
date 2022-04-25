import { useEffect, useState } from "react";
import {ethers} from "ethers";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json";
import axios from "axios";

const useNftOptions = (nftContractAddress, localProvider, tokenId) => {
  const [nftOptions, setNftOptions] = useState({
    symbol: '',
    name: '',
    tokenUri: '',
    imageUrl: ''
  });

  const updateOptions = (name, value) => {
    setNftOptions(prev => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(()=> {
    const init = async () => {
      try{
        if(nftOptions.name){
          console.log('*** lets call opensea and get details for: ', nftOptions.name)
          const result = await axios({
            method: 'get',
            url: `https://api.opensea.io/api/v1/collection/${nftOptions.name.toLowerCase()}/stats`,
            headers: {
              'Accept': 'application/json'
            },
          })
          console.log('*** opensea gave: ', result)
          setNftOptions(prevObj => {
            return {...prevObj, ...result.data.stats}
          })
        }
      }catch(e){
        console.error('unable to get nft options')
      }
    }
    init()
  }, [nftOptions.name]);


  useEffect(() => {
    const init = async () => {
      try{
        if(nftContractAddress && localProvider && tokenId){
          console.log('*** getting nft data: ', tokenId.toString())
          const myErc721 = new ethers.Contract(
            nftContractAddress,
            ERC721PresetMinterPauserAutoIdABI,
            localProvider
          );
          let tokenUri = await myErc721.tokenURI(tokenId)
          const name = await myErc721.name()
          const symbol = await myErc721.symbol()
          updateOptions('name', name);
          updateOptions('tokenUri', tokenUri);
          updateOptions('symbol', symbol);
        }
      }catch(e){
        console.error('unable to get nft options: ', e)
      }
    }
    init()
  }, [nftContractAddress && localProvider && tokenId]);

  useEffect(() => {
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
      const tokenUri = nftOptions.tokenUri
      var imageUrl;
      if(tokenUri.indexOf('http') == 0){
        const imageUrl = await getImageFromUrl(tokenUri)
        updateOptions('imageUrl', imageUrl)

      }else if (tokenUri.indexOf('ipfs://') == 0){
        const ipfsHash = tokenUri.split("ipfs://")[1]
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        imageUrl = await getImageFromUrl(ipfsUrl)
        console.log('*** imageUrl: ', imageUrl)

        if(imageUrl.indexOf('http') == 0){
          updateOptions('imageUrl', imageUrl)
        }else if(imageUrl.indexOf('ipfs://') == 0){
          const ipfsHash = imageUrl.split("ipfs://")[1]
          imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`
          updateOptions('imageUrl', imageUrl)
        }else{
          updateOptions('imageUrl', '')
        }

      }else if (tokenUri.indexOf('data:application/json;base64,') == 0){
        const base64DataObj = tokenUri.replace('data:application/json;base64,', '')
        const dataObj = JSON.parse(atob(base64DataObj))
        const imageUrl = dataObj.image
        updateOptions('imageUrl', imageUrl)
      }else {
        updateOptions('imageUrl', '')
      }
    }
    init()
  }, [nftOptions.tokenUri])

  return nftOptions
};

export default useNftOptions