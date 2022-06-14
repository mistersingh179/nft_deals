import React, { useState, useEffect, useContext } from "react";
import { BigNumber } from "ethers";
import { Table } from "antd";
import { Address, DisplayEther } from "./index";
import moment from "moment";
import AuctionOptionsContext from "../contexts/AuctionOptionsContext";
import { gql, useQuery } from "@apollo/client";

const GET_AUCTION_BIDS_GQL = gql(`
  query($addr: String) {
    auction(id: $addr) {
      bids(orderBy: createdAt, orderDirection: desc, first: 5) {
        id
        createdAt
        amount
        fromAddress
      }
    }
  }
`);

const BidEvents = props => {
  const {
    auctionContractAddress,
    mainnetProvider,
  } = props;
  const auctionOptions = useContext(AuctionOptionsContext);

  const [bidEvents, setBidEvents] = useState([]);

  const { loading, data } = useQuery(GET_AUCTION_BIDS_GQL, {
    pollInterval: 2500,
    variables: { addr: auctionContractAddress.toLowerCase() },
  });
  useEffect(() => {
    if (data && data.auction && data.auction.bids) {
      console.log("*** updating bid events: ", data.auction.bids);
      setBidEvents(data.auction.bids);
    }
  }, [data]);

  const bidEventColumns = [
    {
      title: "Address",
      dataIndex: "fromAddress",
      key: "fromAddress",
      render: text => (
        <Address
          address={text}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: text => (
        <DisplayEther
          wei={BigNumber.from(text)}
          priceInCents={auctionOptions.priceInCents}
        />
      ),
    },
    {
      title: "When",
      dataIndex: "createdAt",
      key: "createdAt",
      render: text => moment(text, "X").calendar(),
    },
  ];

  return (
    <>
      {loading && "Loading"}
      {!loading && <Table
        columns={bidEventColumns}
        dataSource={bidEvents}
        pagination={false}
      />}
    </>
  );
};

export default BidEvents;
