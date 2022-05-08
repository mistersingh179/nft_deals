const { expect } = require("chai");
const { ethers } = require("hardhat");

const {
  utils: { formatEther },
  provider,
  constants,
} = ethers;

describe.only("AuctionEnd2End and more", () => {
  const startBidAmount = 1000;
  const auctionTimeIncrementOnBid = 24 * 60 * 60;
  const minimumBidIncrement = 1000;
  const listerFeeInBasisPoints = 1000;
  const approvalAmount = "100000000000000000000000";

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

  before(async () => {
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
    console.log(
      "chrome address: ",
      chrome.address,
      "has WETH balance: ",
      ethers.utils.formatEther(await weth.balanceOf(chrome.address)),
    );
    console.log(
      "firefox address: ",
      firefox.address,
      "has WETH balance: ",
      ethers.utils.formatEther(await weth.balanceOf(firefox.address)),
    );
    console.log(
      "safari address: ",
      safari.address,
      "has WETH balance: ",
      ethers.utils.formatEther(await weth.balanceOf(safari.address)),
    );

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
  });

  it("is sane", () => {
    expect(true).to.be.equal(true);
  });

  it("can mint an nft", async () => {
    await bestNft.mint(chrome.address);
    const balance = (await bestNft.balanceOf(chrome.address)).toNumber();
    tokenId = await bestNft.tokenOfOwnerByIndex(chrome.address, balance - 1);
    tokenId = tokenId.toNumber();
    console.log("chrome has minted tokenId: ", tokenId);
    const ownerOfToken = await bestNft.ownerOf(tokenId);
    console.log("owner of: ", tokenId, " is: ", ownerOfToken);
  });

  it("can create an auction", async () => {
    await auctionFactory
      .connect(chrome)
      .createAuction(
        tokenId,
        bestNft.address,
        startBidAmount,
        auctionTimeIncrementOnBid,
        minimumBidIncrement,
        listerFeeInBasisPoints,
      );

    const auctions = await auctionFactory.auctions();
    const lastAuctionAddress = auctions[auctions.length - 1];
    auction = await ethers.getContractAt("Auction", lastAuctionAddress);
    console.log("we have auction at: ", auction.address);
    // eslint-disable-next-line no-unused-expressions
    expect(auction.address).to.be.properAddress;
    expect(await auction.provider.getCode(auction.address)).to.not.be.equal(
      "0x",
    );
  });

  it("can start an auction", async () => {
    expect(await auction.expiration()).to.be.equal(0);
    await bestNft.connect(chrome).approve(auction.address, tokenId);
    await auction.connect(chrome).startAuction();
    expect(await auction.expiration()).to.not.be.equal(0);
  });

  it("can take a few bids and emit events", async () => {
    await weth.connect(chrome).approve(auction.address, approvalAmount);
    await weth.connect(firefox).approve(auction.address, approvalAmount);
    await weth.connect(safari).approve(auction.address, approvalAmount);

    expect(await auction.winningAddress()).to.be.equal(
      ethers.constants.AddressZero,
    );

    await expect(auction.connect(chrome).bid())
      .to.emit(auction, "Bid")
      .withArgs(chrome.address, ethers.constants.AddressZero, [], []);

    await auction.connect(chrome).bid();
    await expect(auction.connect(firefox).bid())
      .to.emit(auction, "Bid")
      .withArgs(firefox.address, chrome.address, [], []);

    await auction.connect(safari).bid();

    expect(await auction.winningAddress()).to.be.equal(safari.address);
  });

  xit("emits event with remaining time when bid comes in", async () => {
    const timeToPass = 60 * 60 * 5;
    auction.provider.send("evm_increaseTime", [timeToPass]);
    auction.provider.send("evm_mine");
    const result = await auction.connect(safari).bid();
    const receipt = await result.wait();
    const events = receipt.events;
    const bidEvent = events[events.length - 1];
    console.log(
      "the bid event has secondsLeftInAuction: ",
      bidEvent.args.secondsLeftInAuction.toNumber(),
    );
    expect(bidEvent.args.secondsLeftInAuction.toNumber()).to.be.closeTo(
      auctionTimeIncrementOnBid - timeToPass,
      5,
    );
  });

  it("has earned fees", async () => {
    expect(await auction._platformFeesAccumulated()).to.not.be.equal(0);
    expect(await auction._listerFeesAccumulated()).to.not.be.equal(0);
  });

  it("lister can NOT claim nft once we have bids", async () => {
    await expect(auction.connect(chrome).claimNftWhenNoAction()).to.be.reverted;
  });

  it("only cashier can withdraw platform fees", async () => {
    await expect(auction.connect(chrome).claimPlatformFees()).to.be.reverted;
    const origBalance = await weth.balanceOf(adminOne.address);
    console.log("balance before withdrawl: ", formatEther(origBalance));
    await auction.connect(adminOne).claimPlatformFees();
    const newBalance = await weth.balanceOf(adminOne.address);
    console.log("balance after withdrawl: ", formatEther(newBalance));
    expect(newBalance).to.be.gt(origBalance);
  });

  it("only lister can withdraw lister fees", async () => {
    await expect(auction.connect(adminOne).claimListerFees()).to.be.reverted;
    const origBalance = await weth.balanceOf(chrome.address);
    console.log("balance before withdrawl: ", formatEther(origBalance));
    await auction.connect(chrome).claimListerFees();
    const newBalance = await weth.balanceOf(chrome.address);
    console.log("balance after withdrawl: ", formatEther(newBalance));
    expect(newBalance).to.be.gt(origBalance);
  });

  it("does NOT give nft to winner when auction is live", async () => {
    await expect(auction.connect(safari).claimNftUponWinning()).to.be.reverted;
  });

  it("lister can NOT claim nft back when is live", async () => {
    await expect(auction.connect(chrome).claimNftWhenNoAction()).to.be.reverted;
  });

  it("timer resets when a new bid comes in", async () => {
    auction.provider.send("evm_increaseTime", [60 * 60 * 5]);
    auction.provider.send("evm_mine");

    const oldExpiration = await auction.expiration();
    console.log("expiration before placing bid: ", oldExpiration.toString());

    const oldSecsLeft = await auction.secondsLeftInAuction();
    console.log("oldSecsLeft: ", oldSecsLeft.toString());

    await auction.connect(firefox).bid();

    const newExpiration = await auction.expiration();
    console.log("expiration after placing bid: ", newExpiration.toString());

    const newSecsLeft = await auction.secondsLeftInAuction();
    console.log("newSecsLeft: ", newSecsLeft.toString());

    expect(newExpiration).to.be.gt(oldExpiration);
    expect(newSecsLeft).to.equal(auctionTimeIncrementOnBid);
  });

  it("no more bids after auction has ended", async () => {
    const origSecsLeft = await auction.secondsLeftInAuction();
    console.log("time left in auction: ", origSecsLeft.toString());
    provider.send("evm_increaseTime", [origSecsLeft.toNumber()]);
    provider.send("evm_mine");
    const newSecsLeft = await auction.secondsLeftInAuction();
    console.log("after time FF we have time left: ", newSecsLeft.toString());
    expect(newSecsLeft).to.be.equal(0);
    await expect(auction.connect(chrome).bid()).to.be.reverted;
  });

  it("last bidder is made the winner", async () => {
    expect(await auction.winningAddress()).to.be.equal(firefox.address);
  });

  it("only lister gets final bid when auction has finished", async () => {
    await expect(auction.connect(adminOne).claimFinalBidAmount()).to.be
      .reverted;
    const origBalance = await weth.balanceOf(chrome.address);
    console.log("bal before claiming final bid: ", formatEther(origBalance));
    await auction.connect(chrome).claimFinalBidAmount();
    const newBalance = await weth.balanceOf(chrome.address);
    console.log("bal after claiming final bid: ", formatEther(newBalance));
    expect(newBalance).to.be.gt(origBalance);
  });

  it("lister can NOT claim nft after auction ended with bids", async () => {
    await expect(auction.connect(chrome).claimNftWhenNoAction()).to.be.reverted;
  });

  it("only winner gets NFT once auction has finished", async () => {
    await expect(auction.connect(chrome).claimNftUponWinning()).to.be.reverted;
    const origBalance = await bestNft.balanceOf(firefox.address);
    console.log("before claiming nft balance is: ", origBalance.toString());
    await auction.connect(firefox).claimNftUponWinning();
    const newBalance = await bestNft.balanceOf(firefox.address);
    console.log("after claiming nft balance is: ", newBalance.toString());
    expect(newBalance.sub(origBalance)).to.be.equal(1);
  });

  it("auction has zero money left after all fees are taken out", async () => {
    const origBalance = await weth.balanceOf(auction.address);
    console.log("auction currently holds: ", origBalance.toString());
    await auction.connect(adminOne).claimPlatformFees();
    await auction.connect(chrome).claimListerFees();
    const newBalance = await weth.balanceOf(auction.address);
    console.log("auction now holds: ", newBalance.toString());
    expect(origBalance).to.be.gt(newBalance);
    expect(newBalance).to.be.equal(0);
  });

  it("lister can claim nft after auction ended with no bids", async () => {
    const origBalance = await bestNft.balanceOf(firefox.address);
    console.log("firefox has nft count: ", origBalance.toString());

    await auctionFactory
      .connect(firefox)
      .createAuction(
        tokenId,
        bestNft.address,
        startBidAmount,
        auctionTimeIncrementOnBid,
        minimumBidIncrement,
        listerFeeInBasisPoints,
      );

    const auctions = await auctionFactory.auctions();
    const lastAuctionAddress = auctions[auctions.length - 1];
    auction = await ethers.getContractAt("Auction", lastAuctionAddress);
    await bestNft.connect(firefox).approve(auction.address, tokenId);
    await auction.connect(firefox).startAuction();

    const newBalance = await bestNft.balanceOf(firefox.address);
    console.log("after auction start firefox nft bal: ", newBalance.toString());

    expect(origBalance.sub(newBalance)).to.be.equal(1);

    provider.send("evm_increaseTime", [auctionTimeIncrementOnBid]);
    provider.send("evm_mine");

    expect(await auction.secondsLeftInAuction()).to.be.equal(0);
    expect(await auction.winningAddress()).to.be.equal(constants.AddressZero);

    await auction.connect(firefox).claimNftWhenNoAction();

    const latestBalance = await bestNft.balanceOf(firefox.address);
    expect(latestBalance).to.be.equal(origBalance);
  });
});
