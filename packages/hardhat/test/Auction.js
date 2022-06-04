const { expect } = require("chai");
const { ethers } = require("hardhat");

const startBidAmount = 1000;
const auctionTimeIncrementOnBid = 24 * 60 * 60;
const minimumBidIncrement = 1000;
const approvalAmount = "100000000000000000000000";
const staticFeeInBasisPoints = "10000";
const auctionFeeType = 1;

describe("Auction", () => {
  let weth;
  let bestNft;
  let auctionFactory;
  let tokenId;
  let auction;
  let owner;
  let chrome;
  let firefox;
  let safari;
  let adminOne;
  let adminTwo;

  // starts the auction
  before(async () => {
    console.log("*** setting up an auction for you ***");
    const signers = await ethers.getSigners();
    owner = signers[0];
    chrome = signers[1];
    firefox = signers[2];
    safari = signers[3];
    adminOne = signers[18];
    adminTwo = signers[19];
    console.log(
      "owner address: ",
      owner.address,
      "owner balance: ",
      ethers.utils.formatEther(await owner.getBalance()),
    );

    const Weth = await ethers.getContractFactory("WETH");
    weth = await Weth.deploy();
    console.log("weth address: ", weth.address);

    signers.map(async wallet => {
      await weth
        .connect(wallet)
        .deposit({ value: ethers.constants.WeiPerEther.mul(10) });
    });

    const BestNft = await ethers.getContractFactory("BestNft");
    bestNft = await BestNft.deploy();
    console.log("bestNft address: ", bestNft.address);

    const AuctionFactory = await ethers.getContractFactory("AuctionFactory");
    auctionFactory = await AuctionFactory.deploy(
      weth.address,
      adminOne.address,
      adminTwo.address,
    );
    console.log("auctionFactory address: ", auctionFactory.address);

    await bestNft.mint(owner.address);
    tokenId = await bestNft.tokenOfOwnerByIndex(owner.address, 0);
    tokenId = tokenId.toString();
    console.log("owner has minted tokenId: ", tokenId);
    let ownerOfToken = await bestNft.ownerOf(tokenId);
    console.log("owner of: ", tokenId, " is: ", ownerOfToken);

    await auctionFactory
      .connect(owner)
      .createAuction(
        tokenId,
        bestNft.address,
        startBidAmount,
        auctionTimeIncrementOnBid,
        minimumBidIncrement,
        auctionFeeType,
        staticFeeInBasisPoints,
      );

    const auctions = await auctionFactory.auctions();
    const lastAuctionAddress = auctions[auctions.length - 1];
    auction = await ethers.getContractAt("Auction", lastAuctionAddress);
    console.log("auction address: ", auction.address);
    await auction.connect(adminOne).setAuctionFeeType(0);

    let approvalHolder = await bestNft.getApproved(tokenId);
    console.log("for tokenId: ", tokenId, "approval is with: ", approvalHolder);

    await bestNft.connect(owner).approve(auction.address, tokenId);
    approvalHolder = await bestNft.getApproved(tokenId);
    console.log("for tokenId: ", tokenId, "approval is with: ", approvalHolder);

    await auction.connect(owner).startAuction();

    ownerOfToken = await bestNft.ownerOf(tokenId);
    console.log("ownerOf tokenId: ", tokenId, "is: ", ownerOfToken);

    [chrome, firefox, safari].map(async wallet =>
      weth.connect(wallet).approve(auction.address, approvalAmount),
    );
  });

  it("should have factory address on it", async () => {
    const result = await auction.auctionFactory();
    expect(result).to.equal(auctionFactory.address);
  });

  it("should have qualifies for reward as false", async () => {
    const result = await auction.qualifiesForRewards();
    expect(result).to.equal(false);
  });

  it("can set qualifies for reward with rewards op role", async () => {
    await expect(auction.connect(adminOne).setQualifiesForRewards(true)).to.not
      .be.reverted;
  });

  it("can NOT set qualifiers for reward without rewards op role", async () => {
    await expect(auction.connect(chrome).setQualifiesForRewards(true)).to.be
      .reverted;
  });

  it("can NOT pause an auction without watchdog role", async () => {
    await expect(auction.connect(chrome).setPaused(true)).to.be.reverted;
    await expect(auction.connect(chrome).setPaused(false)).to.be.reverted;
  });

  it("can pause an auction with watchdog role", async () => {
    await expect(auction.connect(adminOne).setPaused(true)).to.not.be.reverted;
    await expect(auction.connect(adminOne).setPaused(false)).to.not.be.reverted;
  });

  it("accepts a bid when auction is not paused", async () => {
    await expect(auction.connect(chrome).bid()).to.not.be.reverted;
  });

  it("rejects bid when paused", async () => {
    await auction.connect(adminOne).setPaused(true);
    await expect(auction.connect(chrome).bid()).to.be.reverted;
    await auction.connect(adminOne).setPaused(false);
  });

  it("has createdAt to show when auction was created", async () => {
    const now = parseInt(new Date().getTime() / 1000, 10);
    let createdAt = await auction.createdAt();
    createdAt = createdAt.toNumber();
    console.log("now: ", now, " and createdAt: ", createdAt);
    expect(createdAt).to.be.closeTo(now, 60);
  });

  it("does not give rewards for non qualifying auctions", async () => {
    await auction.connect(adminOne).setQualifiesForRewards(false);
    expect(await auction.qualifiesForRewards()).to.equal(false);
    const origRewards = (
      await auctionFactory.rewards(chrome.address)
    ).toNumber();
    console.log("origRewards: ", origRewards);
    await auction.connect(chrome).bid();
    const newRewards = (
      await auctionFactory.rewards(chrome.address)
    ).toNumber();
    console.log("newRewards: ", newRewards);
    expect(newRewards).to.be.equal(origRewards);
    await auction.connect(adminOne).setQualifiesForRewards(true);
  });

  it("should give reward after a bid has been made", async () => {
    await auction.connect(adminOne).setQualifiesForRewards(true);
    expect(await auction.qualifiesForRewards()).to.equal(true);
    const origRewards = (
      await auctionFactory.rewards(chrome.address)
    ).toNumber();
    console.log("origRewards: ", origRewards);
    await auction.connect(chrome).bid();
    const newRewards = (
      await auctionFactory.rewards(chrome.address)
    ).toNumber();
    console.log("newRewards: ", newRewards);
    expect(newRewards).to.be.greaterThan(origRewards);
  });

  it("rejects bids when auction has expired", async () => {
    const secondsLeftInAuction = await auction.secondsLeftInAuction();
    await ethers.provider.send("evm_increaseTime", [
      secondsLeftInAuction.toNumber(),
    ]);
    await ethers.provider.send("evm_mine");
    await expect(auction.connect(chrome).bid()).to.be.reverted;
  });

  it("accepts the correct nft", async () => {
    await bestNft.mint(chrome.address);
    const balance = (await bestNft.balanceOf(chrome.address)).toNumber();
    console.log("my nft balance is: ", balance);
    const newTokenId = await bestNft.tokenOfOwnerByIndex(
      chrome.address,
      balance - 1,
    );
    console.log("we minted tokenId: ", tokenId);
    await auctionFactory
      .connect(chrome)
      .createAuction(
        newTokenId,
        bestNft.address,
        startBidAmount,
        auctionTimeIncrementOnBid,
        minimumBidIncrement,
        auctionFeeType,
        staticFeeInBasisPoints,
      );
    const auctions = await auctionFactory.auctions();
    console.log("here all auctions: ", auctions);
    const newAuctionAddress = auctions[auctions.length - 1];
    console.log("this is address of new auction: ", newAuctionAddress);
    const newAuction = await ethers.getContractAt("Auction", newAuctionAddress);
    await newAuction.connect(adminOne).setAuctionFeeType(0);
    await bestNft.connect(chrome).approve(newAuctionAddress, newTokenId);

    expect(await bestNft.ownerOf(newTokenId)).to.be.equal(chrome.address);
    await newAuction.connect(chrome).startAuction();
    expect(await bestNft.ownerOf(newTokenId)).to.be.equal(newAuction.address);
  });

  it("can be changed to belong to a new factory", async () => {
    expect(await auction.auctionFactory()).to.be.equal(auctionFactory.address);
    const AuctionFactory = await ethers.getContractFactory("AuctionFactory");
    const newAuctionFactory = await AuctionFactory.deploy(
      weth.address,
      adminOne.address,
      adminTwo.address,
    );
    console.log("newAuctionFactory address: ", newAuctionFactory.address);
    auction.connect(adminOne).setAuctionFactory(newAuctionFactory.address);
    expect(await auction.auctionFactory()).to.be.equal(
      newAuctionFactory.address,
    );
  });

  it("recovers all assets upon self destruction", async () => {
    const oldWethBal = await weth.balanceOf(adminTwo.address);
    const oldNftBal = await bestNft.balanceOf(adminTwo.address);
    await auction.connect(adminTwo).selfDestruct();
    const newNftBal = await bestNft.balanceOf(adminTwo.address);
    const newWethBal = await weth.balanceOf(adminTwo.address);

    console.log(
      "old weth balance: ",
      ethers.utils.formatEther(oldWethBal),
      "new weth balance: ",
      ethers.utils.formatEther(newWethBal),
    );

    console.log(
      "old nft balance: ",
      oldNftBal.toString(),
      "new nft balance: ",
      newNftBal.toString(),
    );

    expect(newWethBal).to.be.gt(oldWethBal);
    expect(newNftBal).to.be.gt(oldNftBal);
    expect(await auction.provider.getCode(auction.address)).to.be.equal("0x");
  });

  describe("startAuction", () => {
    xit("can be started only by the nft Owner", () => {});
  });
});
