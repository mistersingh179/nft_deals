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

describe("AuctionWithRedCarpetList", () => {
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
      100, // _minimumBidIncrement
      walletOne.address, // _nftOwner
      weth.address, // _wethAddress
      adminOne.address, // _adminOneAddress
      adminTwo.address, // _adminTwoAddress
      auctionFactory.address, // _auctionFactoryAddress
      1, // auctionFeeType
      10000, // staticFeeInBasisPoints
    ]);

    for (let i = 0; i < wallets.length; i += 1) {
      const wallet = wallets[i];
      await weth
        .connect(wallet)
        .deposit({ value: ethers.constants.WeiPerEther.mul(10) });
      await weth.connect(wallet).approve(auction.address, approvalAmount);
    }

    return { weth, bestNft, auctionFactory, auction, tokenId };
  };

  const auctionStartedWithRewardFixture = async () => {
    const { auction, bestNft, auctionFactory, tokenId } = await loadFixture(
      AuctionFromConstructorFixture,
    );
    const wallets = provider.getWallets();
    const w1 = wallets[0];
    const adminOne = wallets[18];
    await auctionFactory.connect(adminOne).addAuction([auction.address]);
    await auction.connect(adminOne).setQualifiesForRewards(true);
    await bestNft.connect(w1).approve(auction.address, tokenId);
    await auction.connect(w1).startAuction();

    return { auction, auctionFactory };
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

  it("has zero addresses in red carpet set", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    const len = await auction.getRedCarpetLength();
    expect(len).to.be.equal(0);
  });

  it("can add an address", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    await auction.joinRedCarpet();
    const len = await auction.getRedCarpetLength();
    expect(len).to.be.equal(1);
  });

  it("only added addresses are there", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    const [w1, w2, w3] = provider.getWallets();
    await auction.connect(w1).joinRedCarpet();
    await auction.connect(w2).joinRedCarpet();
    expect(await auction.getRedCarpetLength()).to.be.eq(2);
    expect(await auction.checkRedCarpet(w1.address)).to.be.eq(true);
    expect(await auction.checkRedCarpet(w2.address)).to.be.eq(true);
    expect(await auction.checkRedCarpet(w3.address)).to.be.eq(false);
  });

  it("gives all added addresses back", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    const [w1, w2, w3] = provider.getWallets();
    await auction.connect(w2).joinRedCarpet();
    await auction.connect(w3).joinRedCarpet();
    const addresses = await auction.getRedCarpet();
    expect(addresses).to.include(w2.address);
    expect(addresses).to.include(w3.address);
    expect(addresses).to.not.include(w1.address);
  });

  it("red carpet by default is open", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    expect(await auction.redCarpetState()).to.be.eq(1);
  });

  it("red carpet state can only be changed by role holder", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    const wallets = provider.getWallets();
    const walletOne = wallets[0];
    const adminOne = wallets[18];
    expect(await auction.redCarpetState()).to.be.eq(1);
    await auction.connect(adminOne).changeRedCarpetState(0);
    expect(await auction.redCarpetState()).to.be.eq(0);
    await expect(auction.connect(walletOne).changeRedCarpetState(1)).to.be
      .reverted;
  });

  it("once red carpet is closed we cant add addresses", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    const wallets = provider.getWallets();
    const [w1, w2] = wallets;
    const adminOne = wallets[18];
    await auction.connect(w1).joinRedCarpet();
    await auction.connect(adminOne).changeRedCarpetState(0);
    await expect(auction.connect(w2).joinRedCarpet()).to.be.reverted;
  });

  it("we can open red carpet back up", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    const wallets = provider.getWallets();
    const [w1] = wallets;
    const adminOne = wallets[18];
    await auction.connect(adminOne).changeRedCarpetState(0);
    await expect(auction.connect(w1).joinRedCarpet()).to.be.reverted;
    await auction.connect(adminOne).changeRedCarpetState(1);
    await expect(auction.connect(w1).joinRedCarpet()).to.not.be.reverted;
  });

  it("tells if address in list", async () => {
    const { auction } = await loadFixture(AuctionFromConstructorFixture);
    const [w1, w2] = provider.getWallets();
    await auction.connect(w1).joinRedCarpet();
    expect(await auction.checkRedCarpet(w1.address)).to.be.eq(true);
    expect(await auction.checkRedCarpet(w2.address)).to.be.eq(false);
  });

  it("gives reward when auction is qualified", async () => {
    const { auction, auctionFactory } = await loadFixture(
      auctionStartedWithRewardFixture,
    );
    const [w1] = provider.getWallets();
    await auction.connect(w1).bid();
    expect(await auctionFactory.rewards(w1.address)).to.be.equal(23);
  });

  it("gives double reward to red carpet addresses", async () => {
    const { auction, auctionFactory } = await loadFixture(
      auctionStartedWithRewardFixture,
    );
    const [w1, w2] = provider.getWallets();
    await auction.connect(w1).joinRedCarpet();
    await auction.connect(w1).bid();
    await auction.connect(w2).bid();
    expect(await auctionFactory.rewards(w1.address)).to.be.equal(46);
    expect(await auctionFactory.rewards(w2.address)).to.be.equal(23);
  });
});
