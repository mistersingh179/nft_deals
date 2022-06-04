const { waffle, ethers, network, getChainId } = require("hardhat"); // note waffle comes hardhat and not direct
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

describe("UpdateAuction", () => {
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
      60, // 1 minute // _auctionTimeIncrementOnBid
      100, // _minimumBidIncrement
      walletOne.address, // _nftOwner
      weth.address, // _wethAddress
      adminOne.address, // _adminOneAddress
      adminTwo.address, // _adminTwoAddress
      auctionFactory.address, // _auctionFactoryAddress
      1, // auctionFeeType
      10000, // staticFeeInBasisPoints
    ]);
    return { weth, bestNft, auctionFactory, auction };
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

  it("auction can be updated before it has started", async () => {
    const { bestNft, auction } = await loadFixture(
      AuctionFromConstructorFixture,
    );
    const wallets = provider.getWallets();
    const walletOne = wallets[0];
    expect(await auction.minimumBidIncrement()).to.not.equal(1);
    await auction.updateAuction(
      1,
      1,
      bestNft.address,
      0,
      walletOne.address,
      0,
      1, // fee type static
      10000, // static fee percentage
    );
    expect(await auction.minimumBidIncrement()).to.equal(1);
  });

  it("fee type & static fee can be updated before starting", async () => {
    const { bestNft, auction } = await loadFixture(
      AuctionFromConstructorFixture,
    );
    const wallets = provider.getWallets();
    const walletOne = wallets[0];
    expect(await auction.auctionFeeType()).to.not.equal(0);
    expect(await auction.staticFeeInBasisPoints()).to.not.equal(500);
    await auction.updateAuction(
      1,
      1,
      bestNft.address,
      0,
      walletOne.address,
      0,
      0, // auctionFeeType
      500, // staticFeeInBasisPoints
    );
    expect(await auction.auctionFeeType()).to.equal(0);
    expect(await auction.staticFeeInBasisPoints()).to.equal(500);
  });

  it("auction can not be updated once started", async () => {
    const wallets = provider.getWallets();
    const walletOne = wallets[0];
    const { bestNft, auction } = await loadFixture(
      AuctionFromConstructorFixture,
    );
    await bestNft.connect(walletOne).approve(auction.address, 0);
    await auction.connect(walletOne).startAuction();
    await expect(
      auction.updateAuction(1, 1, bestNft.address, 0, walletOne.address, 0),
    ).to.be.reverted;
  });
});
