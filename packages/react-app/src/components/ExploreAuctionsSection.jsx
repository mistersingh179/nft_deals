import { Card, Col, Divider, Row } from "antd";
import bayc300 from "../img/BAYC300.png";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";
import { useAuctionOptions } from "../hooks";
import { useBlockNumber } from "eth-hooks";
import { displayWeiAsEther, nftNameFixer, parseTokenUri } from "../helpers";
import Duration from "./Duration";
import { Link } from "react-router-dom";

const AuctionCardDesc = props => {
  const {
    readContracts,
    localProvider,
    auctionContractAddress,
    auctionOptions,
  } = props;
  return (
    <>
      <p>Collection Floor Price: Ξ {auctionOptions.stats.floor_price}</p>
      <p>Top Bid: Ξ{displayWeiAsEther(auctionOptions.maxBid)}</p>
      <p>
        Ends in:{" "}
        <Duration
          readContracts={readContracts}
          auctionContractAddress={auctionContractAddress}
          localProvider={localProvider}
        />
      </p>
    </>
  );
};

const AuctionCol = props => {
  const { readContracts, localProvider, address, auctionContractAddress } =
    props;
  const auctionOptions = useAuctionOptions(
    readContracts,
    auctionContractAddress,
    localProvider,
    address,
  );
  return (
    <Col className="gutter-row" span={8}>
      <Link to={`/auction2/${auctionContractAddress}`}>
        <Card
          hoverable
          style={{ width: "80%", margin: "0 auto", marginBottom: "1em", marginTop: "1em" }}
          cover={<img src={auctionOptions.imageUrl} className={"img-fluid"} />}
        >
          <Meta
            title={
              nftNameFixer(auctionOptions.name) + " #" + auctionOptions.tokenId
            }
            description={
              <AuctionCardDesc
                readContracts={readContracts}
                localProvider={localProvider}
                auctionOptions={auctionOptions}
                auctionContractAddress={auctionContractAddress}
              />
            }
          />
        </Card>
      </Link>
    </Col>
  );
};

const ExploreAuctionsSection = props => {
  const { readContracts, localProvider, address } = props;
  const blockNumber = useBlockNumber(localProvider);

  const [auctions, setAuctions] = useState([]);

  useEffect(async () => {
    if (readContracts && readContracts.AuctionFactory) {
      const auctions = await readContracts.AuctionFactory.auctions();
      setAuctions(auctions);
    }
  }, [
    readContracts,
    readContracts && readContracts.AuctionFactory,
    blockNumber,
  ]);

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
          {auctions.map(auctionContractAddress => {
            return (
              <AuctionCol
                key={auctionContractAddress}
                readContracts={readContracts}
                localProvider={localProvider}
                address={address}
                auctionContractAddress={auctionContractAddress}
              />
            );
          })}
        </Row>
      </div>
    </section>
  );
};

export default ExploreAuctionsSection;
