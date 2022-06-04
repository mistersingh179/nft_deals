import { Skeleton, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AuctionOptionsContext } from "../contexts";
import getImageUrl from "../helpers/getImageUrl";
import { ethers } from "ethers";
import ERC721PresetMinterPauserAutoIdABI from "../abis/ERC721PresetMinterPauserAutoIdABI.json";

export default function NftImage(props) {
  const { width, height, className, style } = props;
  const { nftContractAddress, tokenId, localProvider, fetchImageDirect } = props;

  const [imageUrl, setImageUrl] = useState("");
  useEffect(async () => {
    if(fetchImageDirect == true){
      try {
        const myErc721 = new ethers.Contract(
          nftContractAddress,
          ERC721PresetMinterPauserAutoIdABI,
          localProvider,
        );
        let tokenUri = await myErc721.tokenURI(tokenId);
        const result = await getImageUrl(tokenUri);
        setImageUrl(result);
      } catch (e) {
        setImageUrl("");
      }
    }
  }, [fetchImageDirect, nftContractAddress, tokenId]);

  const auctionOptions = useContext(AuctionOptionsContext);
  if (!auctionOptions.imageUrl && !imageUrl) {
    return <Skeleton />;
  }
  return (
    <div style={style}>
      <img
        src={auctionOptions.imageUrl || imageUrl}
        width={width}
        height={height}
        className={className}
      />
    </div>
  );
}
