import React, { useState, useEffect } from "react";
import {ethers, utils, BigNumber} from "ethers";
import {Table} from "antd";
import {Address} from "./index";
import {useBlockNumber} from "eth-hooks";

const BidEvents = props => {
  const {readContracts, auctionContractAddress, mainnetProvider, localProvider} = props;
  const eventsCount = props.eventsCount || 5;
  const blockCount = props.blockCount || 10;
  const blockNumber = useBlockNumber(localProvider);

  const [bidEvents, setBidEvents] = useState([]);

  const addBidEvent = eventObj => {
    setBidEvents(prevState => {
      const alreadyExists = prevState.find(prevObj => prevObj.hash == eventObj.hash)
      if(alreadyExists){
        console.log('*** skipping as we already have this item: ', eventObj.hash)
        return prevState
      }else{
       return [eventObj, ...prevState].slice(0,eventsCount)
      }
    })
  }


  useEffect(() => {
    async function getOldEvents(){
      if(readContracts && readContracts.Auction && auctionContractAddress){
        const auctionContract = readContracts.Auction.attach(auctionContractAddress);
        let events =  await auctionContract.queryFilter("Bid", -blockCount, "latest")
        console.log('*** old events', events.length)
        events = events.slice(-eventsCount)
        console.log('*** old events', events.length)
        if(bidEvents.length == 0){
          events.map(event => {
            addBidEvent({
              amount: event.args.amount,
              address: event.args.from,
              hash: event.transactionHash,
            })
          })
        }
      }
    }
    getOldEvents()
  }, [readContracts, auctionContractAddress])

  useEffect(() => {
    if(readContracts && readContracts.Auction && auctionContractAddress){
      const auctionContract = readContracts.Auction.attach(auctionContractAddress);
      const bidEventHandler = (from, amount, event) => {
        console.log("*** got bid event with data: ", from, amount, event);
        addBidEvent({address: from, amount: amount, hash: event.transactionHash})
        }
      console.log("*** adding events handler for Bids", auctionContract);
      auctionContract.on("Bid", bidEventHandler);
      return () => {
        console.log("*** removing events handler for Bids", auctionContract);
        auctionContract.off("Bid", bidEventHandler)
      }
    }
  }, [localProvider, readContracts, auctionContractAddress]);

  const bidEventColumns = [
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: text => <Address address={text} ensProvider={mainnetProvider} fontSize={16} />
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: text => utils.formatEther(text)
    },
  ]

  return (
    <Table columns={bidEventColumns} dataSource={bidEvents} />
  )

}

export default BidEvents