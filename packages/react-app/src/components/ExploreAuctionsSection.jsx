import { Card, Col, Divider, Row } from "antd";
import bayc300 from "../img/BAYC300.png";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";
import { useAllAuctionsData, useAuctionOptions } from "../hooks";
import { useBlockNumber } from "eth-hooks";
import { displayWeiAsEther, nftNameFixer, parseTokenUri } from "../helpers";
import { Link } from "react-router-dom";
import getImageUrl from "../helpers/getImageUrl";
import getOpenSeaStats from "../helpers/getOpenSeaStats";
import FormatDuration from "./FormatDuration";

const DurationOrComingSoon = props => {
  const { auction } = props;
  if (auction.expiration.eq(0)) {
    return (
      <>
        Ends in: <span>Coming Soon</span>
      </>
    );
  } else {
    return (
      <>
        Ends in:{" "}
        <FormatDuration
          secondsRemaining={auction.secondsLeftInAuction}
          showSeconds={false}
        />
      </>
    );
  }
};

const AuctionCardDesc = props => {
  const { auction } = props;
  const [stats, setStats] = useState({});
  useEffect(async () => {
    const s = await getOpenSeaStats(auction.name);
    setStats(s);
  }, [auction.name]);
  const floorPrice = () =>
    stats.floor_price ? "Ξ " + stats.floor_price : "Unavailable";
  return (
    <>
      <p>Collection Floor Price: {floorPrice()}</p>
      <p>Top Bid: Ξ {displayWeiAsEther(auction.maxBid)}</p>
      <DurationOrComingSoon auction={auction} />
    </>
  );
};

const ChainName = ({ name }) => {
  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return <>{capitalizeFirstLetter(name)}</>;
};

const AuctionCol = ({ auction }) => {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(async () => {
    const url = await getImageUrl(auction.tokenURI);
    setImageUrl(url);
  }, [auction.tokenURI]);

  return (
    <Col className="gutter-row" span={8}>
      <Link
        to={`/auction2/${auction.contractAddress}?chain=${auction.chainName}`}
      >
        <Card
          hoverable
          style={{
            width: "80%",
            margin: "0 auto",
            marginBottom: "1em",
            marginTop: "1em",
          }}
          actions={[<ChainName name={auction.chainName} />]}
          cover={<img src={imageUrl} className={"img-fluid"} />}
        >
          <Meta
            title={nftNameFixer(auction.name) + " #" + auction.tokenId}
            description={<AuctionCardDesc auction={auction} />}
          />
        </Card>
      </Link>
    </Col>
  );
};

const ExploreAuctionsSection = props => {
  const {
    readContracts,
    localProvider,
    address,
    targetNetwork,
    mainnetProvider,
  } = props;
  const blockNumber = useBlockNumber(localProvider);
  const auctions = useAllAuctionsData(address);


  return (
    <section id="hero" className="d-flex align-items-center">
      <div className={"container"}>
        <Row>
          <Col span={24} type="flex" justify="center" align="middle">
            <h1>Explore Our Auctions</h1>
          </Col>
        </Row>
        <Divider />
        <Row gutter={[16, 16]}>
          {auctions.map(auction => {
            return (
              <AuctionCol
                key={auction.chainName + "-" + auction.contractAddress}
                auction={auction}
              />
            );
          })}
        </Row>
      </div>
    </section>
  );
};

export default ExploreAuctionsSection;
