import { useEffect, useState } from "react";
import {ethers} from "ethers";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json";
import axios from "axios";

const useNftOptions = (nftContractAddress, localProvider, tokenId) => {
  const [nftOptions, setNftOptions] = useState({
    symbol: '',
    name: '',
    tokenUri: '',
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
            responsedType: 'json'
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
    // this is the way to see latest state, not printing after setting it, as set is async
    // console.log('*** nftOptions: ', nftOptions)
  }, [nftOptions])

  useEffect(() => {
    const init = async () => {
      try{
        if(nftContractAddress && localProvider && tokenId){
          const myErc721 = new ethers.Contract(
            nftContractAddress,
            ERC721PresetMinterPauserAutoIdABI,
            localProvider
          );
          let tokenUri = await myErc721.tokenURI(tokenId)
          tokenUri = tokenUri.replace('data:application/json;base64,', '')
          tokenUri = JSON.parse(atob(tokenUri))
          tokenUri = tokenUri.image
          updateOptions('tokenUri', tokenUri);
          const name = await myErc721.name()
          updateOptions('name', name);
          const symbol = await myErc721.symbol()
          updateOptions('symbol', symbol);
        }
      }catch(e){
        console.error('unable to get nft options: ', e)
      }
    }
    init()
  }, [nftContractAddress && localProvider && tokenId]);

  return nftOptions
};

export default useNftOptions