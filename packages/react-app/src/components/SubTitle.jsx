import { ethers } from "ethers";
import React from "react";
import { DisplayEther } from "./index";

const SubTitle = ({ auctionOptions, price }) => {
  const floorPrice = auctionOptions.stats.floor_price
    ? auctionOptions.stats.floor_price + ""
    : 0 + "";

  const DefaultSubTitle = props => {
    return (
      <h2>
        Collection Floor Price: {floorPrice === "0" && "Unavailable"}
        {floorPrice !== "0" && (
          <DisplayEther
            wei={ethers.utils.parseEther(floorPrice)}
            priceInCents={auctionOptions.priceInCents}
          />
        )}
      </h2>
    );
  };

  const BffSubTitle = props => {
    return (
      <h3>
        OpenSea Last Traded Price:{" "}
        <DisplayEther
          wei={ethers.BigNumber.from("1090000000000000000")}
          priceInCents={auctionOptions.priceInCents}
        />{" "}
        <a
          target="_blank"
          href="https://etherscan.io/tx/0x5c01ec027518e4386eeec9cbae5d06061666feeb12ddffcbf6875848b992165e"
        >
          <i className="bi bi-patch-check-fill btn-icon accent-icon" />
        </a>{" "}
        <br />
        Trait Sniper
        <a
          href="https://app.traitsniper.com/bff-you?token=1785&view=1785"
          target="_blank"
          className="trait-details"
        >
          Rarity Rank #237
        </a>{" "}
        of 10,000
        <span className="smaller-usdc">
          <p>Key Traits: Ice Cream Cone (0.33%) and Angel Wings (0.3%)</p>
        </span>
      </h3>
    );
  };

  return auctionOptions.name == "You" ? <BffSubTitle /> : <DefaultSubTitle />;
};

export default SubTitle;
