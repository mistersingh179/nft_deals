import { ethers } from "ethers";
import React from "react";

const SubTitle = ({ auctionOptions, price }) => {
  const defaultSubTitle = <h2>
      Collection Floor Price: Ξ {auctionOptions.stats.floor_price}{" "}
      <span className="smaller-usdc">
        (~
        {auctionOptions.stats.floor_price &&
          price &&
          `$${ethers.utils.commify(
            (auctionOptions.stats.floor_price * price).toFixed(2),
          )}`}
        )
      </span>
    </h2>

  const BffSubTitle = <h3>
    OpenSea Last Traded Price: Ξ 1.09{" "}
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

  return auctionOptions.name == "you" ? BffSubTitle : defaultSubTitle;
};

export default SubTitle