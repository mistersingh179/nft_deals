import { displayWeiAsEther } from "../helpers";
import { YoutubeFilled } from "@ant-design/icons";
import { useContext } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import {Tooltip} from "antd";

const TopBannerRow = props => {
  const auctionOptions = useContext(AuctionOptionsContext);
  const isNoRefundAuction =
    auctionOptions.auctionFeeType === 1 &&
    auctionOptions.staticFeeInBasisPoints.eq(10000);
  const isRefundAuction = !isNoRefundAuction;
  const isOffer = auctionOptions.minimumBidIncrement.eq(0);
  const isBidding = !isOffer;

  const discountCalc = (floor, nextBid) => {
    let amount = 90;
    if (floor && nextBid) {
      amount = (1 - nextBid / floor) * 100;
      amount = Math.trunc(amount * 10) / 10; // <-- gives 1 digit after decimal without rounding.
    }
    return <>{amount}</>;
  };

  const auctionRulesLastBidStanding = (
    <>
      <ul className="auction-rules">
        <li>Win by bidding and holding the 'Current Winner' status for 24 hours.</li>
        <li>Each bid extends the timer by 24 hours.</li>
        <li>You cannot choose a bid amount. It is the same for everyone.</li>
        <li>Each bid is a non-refundable payment to participate in this auction.</li>
      </ul>
    </>
  );
  const auctionRulesIncrementalBidding = (
    <>
      <ul className="auction-rules">
        <li>Win by bidding and holding the 'Current Winner' status for 24 hours.</li>
        <li>Each bid extends the timer by 24 hours.</li>
        <li>You cannot choose a bid amount. The next bid is a fixed amount above the last bid.</li>
        <li>Each bid is a non-refundable payment to participate in this auction.</li>
      </ul>
    </>
  );  
  const auctionRulesIncrementAndRefund = (
    <>
      <ul className="auction-rules">
        <li>Win by bidding and holding the 'Current Winner' status for 24 hours.</li>
        <li>Each bid extends the timer by 24 hours.</li>
        <li>You cannot choose a bid amount. The next bid is a fixed amount above the current bid.</li>
        <li>A percentage of each bid is a non-refundable payment to participate in this auction.</li>
      </ul>
    </>
  );    

  return (
    <div className="row">
      <div
        className="col-lg-12 d-flex flex-column justify-content-center"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="explainer-banner text-center">
          <p>
          Auction Format:{" "}
          {isOffer && <Tooltip placement="bottom" title={auctionRulesLastBidStanding}>
              <u>Last Bid Standing</u>
            </Tooltip>
          }
          {isBidding && isNoRefundAuction && <Tooltip placement="bottom" title={auctionRulesIncrementalBidding}>
              <u>Fixed Increments</u>
            </Tooltip>
          }          
          {isBidding && isRefundAuction && <Tooltip placement="bottom" title={auctionRulesIncrementAndRefund}>
              <u>Fixed Increments + Outbid Refunds</u>
            </Tooltip>
          }                    
          . Win this NFT for{" "}
            {discountCalc(
              auctionOptions.stats.floor_price,
              displayWeiAsEther(
                auctionOptions.maxBid.add(auctionOptions.minimumBidIncrement),
              ),
            )}
            % off the floor price 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopBannerRow;
