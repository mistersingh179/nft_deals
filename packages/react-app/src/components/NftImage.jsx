import { Skeleton, Typography } from "antd";
import React, {useEffect, useState} from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Blockies from "react-blockies";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import {ethers} from "ethers";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json";
import {Address} from "./index";
import {useNftOptions} from "../hooks";

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

  const nftOptions = useNftOptions(nftContractAddress, localProvider, tokenId)
  // console.log('*** nftOptions: ', nftOptions)
  if(!nftOptions.imageUrl){
    return <Skeleton />
  }
  return (
    <div style={style}>
      <img src={nftOptions.imageUrl} width={width} height={height} className={className} /><br/><br/>
    </div>
  );
}
