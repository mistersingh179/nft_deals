import { Skeleton, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AuctionOptionsContext } from "../contexts";

export default function NftImage(props) {
  const { width, height, className, style } = props;

  const auctionOptions = useContext(AuctionOptionsContext);
  if (!auctionOptions.imageUrl) {
    return <Skeleton />;
  }
  return (
    <div style={style}>
      <img
        src={auctionOptions.imageUrl}
        width={width}
        height={height}
        className={className}
      />
    </div>
  );
}
