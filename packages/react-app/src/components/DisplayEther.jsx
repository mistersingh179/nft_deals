import { ethers } from "ethers";
import { displayWeiAsEther } from "../helpers";
import React, { useContext, useState } from "react";
import { Tooltip } from "antd";
import CurrencySymbolContext from "../contexts/CurrencySymbolContext";
const {
  constants: { WeiPerEther, EtherSymbol },
  utils: { commify },
} = ethers;

const DisplayEther = props => {
  const { wei, priceInCents } = props;
  const { showInEth, setShowInEth } = useContext(CurrencySymbolContext);

  const inEth = parseFloat(ethers.utils.formatEther(wei));
  const formattedInEth = EtherSymbol + " " + commify(inEth.toFixed(4));

  const inDollars = parseFloat(wei.mul(priceInCents).div(WeiPerEther)) / 100;
  const formattedInDollars = "$ " + commify(inDollars.toFixed(2));

  return (
    <Tooltip title={`Tap to see in ${showInEth ? "$" : EtherSymbol}`}>
      <span
        onClick={evt => setShowInEth(prevState => !prevState)}
        style={{ cursor: "pointer" }}
      >
        {showInEth ? formattedInEth : formattedInDollars}
      </span>
    </Tooltip>
  );
};

export default DisplayEther;
