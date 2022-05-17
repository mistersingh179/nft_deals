import { ethers } from "ethers";
import React from "react";
import { DisplayEther } from "./index";
import { ReactComponent as TraitSniperIcon } from "../img/traitsniper_icon.svg";
import { Tooltip } from "antd";

const SubTitle = ({ auctionOptions, price }) => {
  const floorPrice = auctionOptions.stats.floor_price
    ? auctionOptions.stats.floor_price + ""
    : 0 + "";

  const DefaultSubTitle = props => {
    return (
      <h3 className="bid-box">
        Collection Floor Price: {floorPrice === "0" && "Unavailable"}
        {floorPrice !== "0" && (
          <DisplayEther
            wei={ethers.utils.parseEther(floorPrice)}
            priceInCents={auctionOptions.priceInCents}
          />
        )}
        <Tooltip title="The floor price is currently unavailable from third-party sources, like Opensea.">
          {" "}<i class="bi bi-info-circle bid-info"></i>
        </Tooltip>                    
      </h3>
    );
  };

  const BffSubTitle = props => {
    return (
        <h3 className="bid-box">
          Last Traded Price:{" "}
          <DisplayEther
            wei={ethers.BigNumber.from("1090000000000000000")}
            priceInCents={auctionOptions.priceInCents}
          />{" "}
          <Tooltip title="View the last trade on Etherscan.">
            <a
              target="_blank"
              href="https://etherscan.io/tx/0x5c01ec027518e4386eeec9cbae5d06061666feeb12ddffcbf6875848b992165e"
            ><i className="bx bx-link-external trait-details"></i></a>
          </Tooltip>            
          <Tooltip title="Trait Sniper Rarity Rank #237 of 10,000. Click for more details.">
            <a
              href="https://app.traitsniper.com/bff-you?token=1785&view=1785"
              target="_blank"
              className="trait-details"
            >
              <TraitSniperIcon className="trait-details" />
            </a>
          </Tooltip>          
        </h3>
    );
  };

  return auctionOptions.name == "You" ? <BffSubTitle /> : <DefaultSubTitle />;
  // return <BffSubTitle />;
};

export default SubTitle;
