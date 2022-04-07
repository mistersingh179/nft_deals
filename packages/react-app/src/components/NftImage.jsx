import { Skeleton, Typography } from "antd";
import React, {useEffect, useState} from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Blockies from "react-blockies";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import {ethers} from "ethers";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json";

const { Text } = Typography;

export default function NftImage(props) {
  const {
    nftContractAddress,
    tokenId,
    localProvider,
    width,
    height
  } = props

  const [nftTokenUrl, setNftTokenUrl] = useState("");

  useEffect(async () => {
    if(nftContractAddress && localProvider && tokenId){
      try{
        const myErc721 = new ethers.Contract(
          nftContractAddress,
          ERC721PresetMinterPauserAutoIdABI,
          localProvider
        );
        let tokenUri = await myErc721.tokenURI(tokenId)
        tokenUri = tokenUri.replace('data:application/json;base64,', '')
        tokenUri = JSON.parse(atob(tokenUri))
        console.log(tokenUri.image);
        setNftTokenUrl(tokenUri.image);
      }catch(e){
        setNftTokenUrl('https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg');
      }
    }
  }, [nftContractAddress, localProvider, tokenId])

  return (
    <img src={nftTokenUrl} width={width} height={height} />
  );
}
