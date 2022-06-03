// note waffle comes hardhat and not direct
const { waffle, ethers, network, getChainId } = require("hardhat");
const { expect } = require("chai");
const BestNftArtifacts = require("../artifacts/contracts/BestNft.sol/BestNft.json");
const WethArtifacts = require("../artifacts/contracts/WETH.sol/WETH.json");
const AuctionFactoryArtifacts = require("../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json");
const AuctionArtifacts = require("../artifacts/contracts/Auction.sol/Auction.json");
const {
  wethAddress,
  adminOneAddress,
  adminTwoAddress,
} = require("../constants");
const { load } = require("dotenv");

const approvalAmount = "100000000000000000000000";

const {
  provider,
  deployContract,
  solidity,
  link,
  deployMockContract,
  createFixtureLoader,
  loadFixture,
} = waffle;

const {
  utils: { formatEther },
  provider: p,
  constants,
} = ethers;

console.log("Running UpdateAuction: ", network.name, network.config.chainId);

describe("AuctionWithStaticProtocolFee", () => {
  const AuctionFromConstructorFixture = async () => {
    const wallets = provider.getWallets();
    const walletOne = wallets[0];
    const adminOne = wallets[18];
    const adminTwo = wallets[19];
    const weth = await deployContract(walletOne, WethArtifacts);
    const bestNft = await deployContract(walletOne, BestNftArtifacts);
    const auctionFactory = await deployContract(
      walletOne,
      AuctionFactoryArtifacts,
      [weth.address, adminOne.address, adminTwo.address],
    );
    await bestNft.connect(walletOne).mint(walletOne.address);
    const tokenId = 0;

    const auction = await deployContract(walletOne, AuctionArtifacts, [
      bestNft.address, // _nftContractAddress
      tokenId, // tokenId
      0, // 10 eth // startBidAmount
      24 * 60 * 60, // 1 day // _auctionTimeIncrementOnBid
      constants.WeiPerEther, // _minimumBidIncrement
      walletOne.address, // _nftOwner
      weth.address, // _wethAddress
      adminOne.address, // _adminOneAddress
      adminTwo.address, // _adminTwoAddress
      auctionFactory.address, // _auctionFactoryAddress
    ]);

    for (let i = 0; i < wallets.length; i += 1) {
      const wallet = wallets[i];
      // eslint-disable-next-line no-await-in-loop
      await weth
        .connect(wallet)
        .deposit({ value: ethers.constants.WeiPerEther.mul(10) });
      // eslint-disable-next-line no-await-in-loop
      await weth.connect(wallet).approve(auction.address, approvalAmount);
    }

    return { weth, bestNft, auctionFactory, auction, tokenId };
  };

  const auctionStartedWithStaticFeeFixture = async () => {
    const { weth, auction, bestNft, auctionFactory, tokenId } =
      await loadFixture(AuctionFromConstructorFixture);
    const wallets = provider.getWallets();
    const w1 = wallets[0];
    const adminOne = wallets[18];
    await auctionFactory.connect(adminOne).addAuction([auction.address]);
    await auction.connect(adminOne).setAuctionFeeType(1);
    await bestNft.connect(w1).approve(auction.address, tokenId);
    await auction.connect(w1).startAuction();

    return { weth, auction, auctionFactory };
  };

  const auctionStartedWithDynamicFeeFixture = async () => {
    const { weth, auction, bestNft, auctionFactory, tokenId } =
      await loadFixture(AuctionFromConstructorFixture);
    const wallets = provider.getWallets();
    const w1 = wallets[0];
    const adminOne = wallets[18];
    await auctionFactory.connect(adminOne).addAuction([auction.address]);
    await auction.connect(adminOne).setAuctionFeeType(0);
    await bestNft.connect(w1).approve(auction.address, tokenId);
    await auction.connect(w1).startAuction();

    return { weth, auction, auctionFactory };
  };

  it("is sane", async () => {
    expect(true).to.be.eq(true);
    const { weth, bestNft, auctionFactory, auction } = await loadFixture(
      AuctionFromConstructorFixture,
    );
    expect(weth.address).to.be.properAddress;
    expect(bestNft.address).to.be.properAddress;
    expect(auctionFactory.address).to.be.properAddress;
    expect(auction.address).to.be.properAddress;
  });

  it("has correct defaults", async () => {
    const { auction } = await loadFixture(auctionStartedWithStaticFeeFixture);
    expect(await auction.auctionFeeType()).to.be.equal(1);
    expect(await auction.staticFeeInBasisPoints()).to.be.equal(10000);
  });

  it("with static auction returns nothing on loosing a bid", async () => {
    const [w1, w2] = provider.getWallets();
    const { auction, weth } = await loadFixture(
      auctionStartedWithStaticFeeFixture,
    );
    const balBeforeBid = await weth.balanceOf(w1.address);
    await auction.connect(w1).bid();
    const balAfterBid = await weth.balanceOf(w1.address);
    await auction.connect(w2).bid();
    const balAfterOutBid = await weth.balanceOf(w1.address);
    expect(balAfterBid).to.be.lt(balBeforeBid);
    expect(balAfterOutBid).to.be.eq(balAfterBid);
  });

  it("with dynamic auction returns some funds on loosing bid", async () => {
    const [w1, w2] = provider.getWallets();
    const { auction, weth } = await loadFixture(
      auctionStartedWithDynamicFeeFixture,
    );
    const balBeforeBid = await weth.balanceOf(w1.address);
    await auction.connect(w1).bid();
    const balAfterBid = await weth.balanceOf(w1.address);
    await auction.connect(w2).bid();
    const balAfterOutBid = await weth.balanceOf(w1.address);
    expect(balAfterBid).to.be.lt(balBeforeBid);
    expect(balAfterOutBid).to.be.gt(balAfterBid);
  });
});
