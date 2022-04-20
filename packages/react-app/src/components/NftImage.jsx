import { Skeleton, Typography } from "antd";
import React, {useEffect, useState} from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Blockies from "react-blockies";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import {ethers} from "ethers";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json";
import {Address} from "./index";

const { Text } = Typography;

export default function NftImage(props) {
  const {
    nftContractAddress,
    tokenId,
    localProvider,
    width,
    height,
    className,
    style
  } = props

  const [nftTokenUrl, setNftTokenUrl] = useState("");

  const setupTokeUrl = async () => {
    if(nftContractAddress && localProvider && tokenId){
      const myErc721 = new ethers.Contract(
        nftContractAddress,
        ERC721PresetMinterPauserAutoIdABI,
        localProvider
      );
      let tokenUri = await myErc721.tokenURI(tokenId)
      tokenUri = tokenUri.replace('data:application/json;base64,', '')
      tokenUri = JSON.parse(atob(tokenUri))
      setNftTokenUrl(tokenUri.image);
    }
  }

  useEffect(async () => {
    try{
      await setupTokeUrl()
    }catch(e){
      console.error('unable to get nft token URL')
      setNftTokenUrl('')
    }

  }, [nftContractAddress, localProvider, tokenId])

  if(!nftTokenUrl){
    return <Skeleton />
  }

  return (
    <div style={style}>
      <img src={nftTokenUrl} width={width} height={height} className={className} /><br/><br/>
      {/*<Address address={nftContractAddress} fontSize={14}></Address> Token Id: {tokenId && tokenId.toString()}*/}
    </div>
  );
}
