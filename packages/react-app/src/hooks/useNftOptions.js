import { useEffect, useState } from "react";
import {ethers} from "ethers";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json";

const useNftOptions = (nftContractAddress, localProvider, tokenId) => {
  const [options, setOptions] = useState({
    symbol: '',
    name: '',
    tokenUri: ''
  });

  const updateOptions = (name, value) => {
    setOptions(prev => {
      return { ...prev, [name]: value };
    });
  };

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

  return options
};

export default useNftOptions