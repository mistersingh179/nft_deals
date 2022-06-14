import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  YourContract,
  SetPurpose,
} from "../generated/YourContract/YourContract";
import {Purpose, Sender, Auction, Bid} from "../generated/schema";
import {AuctionGenerated} from "../generated/AuctionFactory/AuctionFactory";
import {Bid as BidGenerated} from "../generated/templates/Auction/Auction";
import {Auction as AuctionTemplate} from "../generated/templates";

export function handleSetPurpose(event: SetPurpose): void {
  let senderString = event.params.sender.toHexString();

  let sender = Sender.load(senderString);

  if (sender === null) {
    sender = new Sender(senderString);
    sender.address = event.params.sender;
    sender.createdAt = event.block.timestamp;
    sender.purposeCount = BigInt.fromI32(1);
  } else {
    sender.purposeCount = sender.purposeCount.plus(BigInt.fromI32(1));
  }

  let purpose = new Purpose(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  purpose.purpose = event.params.purpose;
  purpose.sender = senderString;
  purpose.createdAt = event.block.timestamp;
  purpose.transactionHash = event.transaction.hash.toHex();

  purpose.save();
  sender.save();
}

export function handleAuctionGenerated(event: AuctionGenerated): void {
  let auction = Auction.load(event.params.auctionContractAddress.toHex())
  if(auction == null) {
    const auction = new Auction(event.params.auctionContractAddress.toHex());
    auction.createdAt = event.block.timestamp;
    auction.listerAddress = event.params.nftOwner;
    auction.contractAddress = event.params.auctionContractAddress;
    auction.bidsCount =  BigInt.fromI32(0);
    auction.save();
    AuctionTemplate.create(event.params.auctionContractAddress)
  }
}

export function handleBidGenerated(event: BidGenerated): void {
  let auction = Auction.load(event.address.toHexString())
  if(auction !== null){
    auction.bidsCount = auction.bidsCount.plus(BigInt.fromI32(1));
    auction.save();
  }

  const bid = new Bid(event.transaction.hash.toHex());
  bid.fromAddress = event.params.from;
  bid.amount = event.params.amount;
  bid.auction = event.address.toHexString();
  bid.createdAt = event.block.timestamp;
  bid.save();
}