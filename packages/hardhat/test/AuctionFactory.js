const { expect } = require("chai");
const { ethers } = require("hardhat");

const startBidAmount = 1000;
const auctionTimeIncrementOnBid = 24 * 60 * 60;
const minimumBidIncrement = 1000;
const listerFeeInBasisPoints = 1000;
const approvalAmount = "100000000000000000000000";

describe("AuctionFactory", () => {
  let weth;
  let auctionFactory;
  let owner;
  let chrome;
  let firefox;
  let safari;
  let adminOne;
  let adminTwo;
  let bestNft;

  before(async () => {
    console.log("*** setting up an auctionFactory for you ***");
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
    console.log("chrome address: ", chrome.address);
    console.log("firefox address: ", firefox.address);
    console.log("safari address: ", safari.address);

    const Weth = await ethers.getContractFactory("WETH");
    weth = await Weth.deploy();
    console.log("weth address: ", weth.address);

    signers.map(async wallet => {
      await weth
        .connect(wallet)
        .deposit({ value: ethers.constants.WeiPerEther.mul(10) });
    });

    const AuctionFactory = await ethers.getContractFactory("AuctionFactory");
    auctionFactory = await AuctionFactory.deploy(
      weth.address,
      adminOne.address,
      adminTwo.address,
    );
    console.log("auctionFactory address: ", auctionFactory.address);
  });

  it("should succeed in setting reward with owner signer", async () => {
    expect(await auctionFactory.rewards(firefox.address)).to.equal(0);
    await auctionFactory.connect(owner).setRewardBalance(firefox.address, 100);
    expect(await auctionFactory.rewards(firefox.address)).to.equal(100);
  });

  it("should revert when setting reward without owner signer", async () => {
    await expect(
      auctionFactory.connect(firefox).setRewardBalance(firefox.address, 500),
    ).to.be.reverted;
  });

  describe("with 3 auctions created", async () => {
    let tokenId1;
    let tokenId2;
    let tokenId3;

    before(async () => {
      const BestNft = await ethers.getContractFactory("BestNft");
      bestNft = await BestNft.deploy();
      await bestNft.mint(chrome.address);
      await bestNft.mint(chrome.address);
      await bestNft.mint(chrome.address);
      tokenId1 = await bestNft.tokenOfOwnerByIndex(chrome.address, 0);
      tokenId2 = await bestNft.tokenOfOwnerByIndex(chrome.address, 1);
      tokenId3 = await bestNft.tokenOfOwnerByIndex(chrome.address, 2);

      await auctionFactory
        .connect(chrome)
        .createAuction(
          tokenId1,
          bestNft.address,
          startBidAmount,
          auctionTimeIncrementOnBid,
          minimumBidIncrement,
          listerFeeInBasisPoints,
        );

      await auctionFactory
        .connect(chrome)
        .createAuction(
          tokenId2,
          bestNft.address,
          startBidAmount,
          auctionTimeIncrementOnBid,
          minimumBidIncrement,
          listerFeeInBasisPoints,
        );

      await auctionFactory
        .connect(chrome)
        .createAuction(
          tokenId3,
          bestNft.address,
          startBidAmount,
          auctionTimeIncrementOnBid,
          minimumBidIncrement,
          listerFeeInBasisPoints,
        );
    });

    it("returns 3 auctions", async () => {
      const auctions = await auctionFactory.auctions();
      console.log("we have auctions length: ", auctions.length);
      expect(await auctionFactory.auctions()).to.have.lengthOf.greaterThan(0);
    });

    it("gives auction length count", async () => {
      expect(await auctionFactory.auctionsLength()).to.be.equal(3);
    });

    it("gives auction by index", async () => {
      const firstAuctionAddress = await auctionFactory.getAuction(0);
      console.log("firstAuctionAddress: ", firstAuctionAddress);
      const firstAuction = await ethers.getContractAt(
        "Auction",
        firstAuctionAddress,
      );
      expect(await firstAuction.tokenId()).to.be.equal(tokenId1);

      const thirdAuctionAddress = await auctionFactory.getAuction(2);
      console.log("thirdAuctionAddress: ", thirdAuctionAddress);
      const thirdAuction = await ethers.getContractAt(
        "Auction",
        thirdAuctionAddress,
      );
      expect(await thirdAuction.tokenId()).to.be.equal(tokenId3);
    });

    it("gives addresses of bidders who have rewards", async () => {
      const auctions = await auctionFactory.auctions();

      const firstAuction = await ethers.getContractAt("Auction", auctions[0]);
      const secondAuction = await ethers.getContractAt("Auction", auctions[1]);
      const thirdAuction = await ethers.getContractAt("Auction", auctions[2]);

      await firstAuction.connect(adminOne).setQualifiesForRewards(true);
      await secondAuction.connect(adminOne).setQualifiesForRewards(true);
      await thirdAuction.connect(adminOne).setQualifiesForRewards(false);

      await bestNft.connect(chrome).approve(firstAuction.address, 0);
      await bestNft.connect(chrome).approve(secondAuction.address, 1);
      await bestNft.connect(chrome).approve(thirdAuction.address, 2);

      await firstAuction.connect(chrome).startAuction();
      await secondAuction.connect(chrome).startAuction();
      await thirdAuction.connect(chrome).startAuction();

      await weth.connect(chrome).approve(firstAuction.address, approvalAmount);
      await weth.connect(chrome).approve(secondAuction.address, approvalAmount);
      await weth
        .connect(firefox)
        .approve(secondAuction.address, approvalAmount);
      await weth.connect(safari).approve(thirdAuction.address, approvalAmount);

      await firstAuction.connect(chrome).bid();
      await secondAuction.connect(chrome).bid();
      await secondAuction.connect(firefox).bid();
      await thirdAuction.connect(safari).bid();

      expect(
        (await auctionFactory.numberOfBidderAddressesWithRewards()).toNumber(),
      ).to.be.equal(2);
      const addresses = await auctionFactory.allAddressesWithRewards();
      expect(addresses).to.include(chrome.address);
      expect(addresses).to.include(firefox.address);
      expect(addresses).to.not.include(safari.address);
    });

    it("creates an auction with the nftOwner being the signer", async () => {
      const auctions = await auctionFactory.auctions();
      const firstAuction = await ethers.getContractAt("Auction", auctions[0]);

      expect(await firstAuction.nftOwner()).to.be.equal(chrome.address);
    });

    xit("allows removing an auction", async () => {
      let auctionsLength = await auctionFactory.auctionsLength();
      expect(auctionsLength).to.be.equal(3);

      const firstAuctionAddress = await auctionFactory.getAuction(0);
      await auctionFactory.removeAuction(firstAuctionAddress);

      auctionsLength = await auctionFactory.auctionsLength();
      expect(auctionsLength).to.be.equal(2);
    });

    it("allows adding auctions via admin role", async () => {
      await bestNft.mint(chrome.address);
      const balance = (await bestNft.balanceOf(chrome.address)).toNumber();
      const newTokenId = await bestNft.tokenOfOwnerByIndex(
        chrome.address,
        balance - 1,
      );
      await auctionFactory
        .connect(chrome)
        .createAuction(
          newTokenId,
          bestNft.address,
          startBidAmount,
          auctionTimeIncrementOnBid,
          minimumBidIncrement,
          listerFeeInBasisPoints,
        );
      const auctions = await auctionFactory.auctions();
      const latestAuction = auctions[auctions.length - 1];
      const AuctionFactory = await ethers.getContractFactory("AuctionFactory");
      const newAuctionFactory = await AuctionFactory.deploy(
        weth.address,
        adminOne.address,
        adminTwo.address,
      );
      console.log(
        "this new auction has address of: ",
        newAuctionFactory.address,
      );
      await newAuctionFactory.connect(owner).addAuction([latestAuction]);
      expect(await newAuctionFactory.auctionsLength()).to.equal(1);
    });

    it("does not allow adding auctions without admin role", async () => {
      const auctions = await auctionFactory.auctions();
      console.log("we have auctions length: ", auctions.length);
      const auction = auctions[auctions.length - 1];
      console.log("latest auction is: ", auction);
      await expect(auctionFactory.connect(chrome).addAuction([auction])).to.be
        .reverted;
    });
  });
});
