import { displayWeiAsEther } from "../helpers";
import { YoutubeFilled } from "@ant-design/icons";
import { useContext } from "react";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";

const TopBannerRow = props => {
  const auctionOptions = useContext(AuctionOptionsContext);

  const discountCalc = (floor, nextBid) => {
    let amount = 90;
    if (floor && nextBid) {
      amount = (1 - nextBid / floor) * 100;
      amount = Math.trunc(amount * 10) / 10; // <-- gives 1 digit after decimal without rounding.
    }
    return <>{amount}</>;
  };

  return (
    <div className="row">
      <div
        className="col-lg-12 d-flex flex-column justify-content-center"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="explainer-banner text-center">
          <p>
            🎉 Bid to win this NFT for{" "}
            {discountCalc(
              auctionOptions.stats.floor_price,
              displayWeiAsEther(
                auctionOptions.maxBid.add(auctionOptions.minimumBidIncrement),
              ),
            )}
            % off floor price??? Ok, STFU,{" "}
            <a href="#video" title="Watch Video" className="video-link">
              show me how <YoutubeFilled />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopBannerRow;
