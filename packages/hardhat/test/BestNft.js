const { waffle, ethers } = require("hardhat");
const { expect } = require("chai");
const BestNft = require("../artifacts/contracts/BestNft.sol/BestNft.json");
const Weth = require("../artifacts/contracts/WETH.sol/WETH.json");

const {
  provider, // this is a MockProvider
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

describe("BestNft", async () => {
  console.log(provider.constructor.name);
  console.log(p.constructor.name);

  let weth;

  // this provider defaults to one created from `createMockProvider`
  // note here no params to this fixture
  // this is because we are using loadFixture from hardhat's waffle
  // and not using loadFixture from waffle directly

  async function deployBestNftAndMintIt() {
    console.log("*** in fixture ***");
    const [walletOne, walletTwo] = provider.getWallets();
    const bestNft = await deployContract(walletOne, BestNft);
    await bestNft.mint(walletOne.address);
    await bestNft.mint(walletTwo.address);
    return { bestNft };
  }

  it("is sane", async () => {
    expect(true).to.equal(true);
    const [walletOne, walletTwo] = provider.getWallets(); // gets 20 wallets
    console.log(walletOne.address, formatEther(await walletTwo.getBalance()));
    console.log(walletTwo.address);
  });

  it("is also sane", async () => {
    expect(true).to.equal(true);
    const [walletOne, walletTwo] = await ethers.getSigners(); // gets 20 wallets
    // will error. this `getWallets` is only available on waffle's provider
    // p.getWallets();
    console.log(walletOne.address, formatEther(await walletTwo.getBalance()));
    console.log(walletTwo.address);
  });

  it("can be deployed", async () => {
    const [walletOne] = provider.getWallets(); // gets 20 wallets
    const bestNft = await deployContract(walletOne, BestNft);
    console.log("address of bestNft is: ", bestNft.address);
    const code1 = await provider.getCode(bestNft.address);
    const code2 = await p.getCode(bestNft.address);
    expect(code1).to.not.be.equal("0x"); // shows that it is deployed
    expect(code1).to.equal(code2); // shows that both providers have it
  });

  it("can be accessed via address", async () => {
    const [walletOne] = provider.getWallets(); // gets 20 wallets
    const bestNft = await deployContract(walletOne, BestNft);
    console.log("address of bestNft is: ", bestNft.address);
    // shows we can access code via getContractAt
    const b = await ethers.getContractAt("BestNft", bestNft.address);
    console.log("address of b is: ", b.address);
  });

  it("can check nft balance", async () => {
    const [walletOne, walletTwo] = provider.getWallets();

    weth = await deployContract(walletOne, Weth);
    await weth.connect(walletOne).deposit({ value: 100 });

    // this is first time calling fixture so will actually run
    const { bestNft } = await loadFixture(deployBestNftAndMintIt);
    console.log("we have bestNft here: ", bestNft.address);
    expect(await provider.getCode(bestNft.address)).to.not.equal("0x");

    expect(await bestNft.balanceOf(walletOne.address)).to.equal(1);
    expect(await bestNft.balanceOf(walletTwo.address)).to.equal(1);

    expect(await weth.balanceOf(walletOne.address)).to.equal(100);
    await weth.connect(walletOne).transfer(walletTwo.address, 10);
    // we changed state of blockchain after fixture
    expect(await weth.balanceOf(walletOne.address)).to.equal(90);
    console.log("wallet one has: ", await weth.balanceOf(walletOne.address));
  });

  it("can transfer nft's from 1 to 2", async () => {
    const [walletOne, walletTwo] = provider.getWallets();
    // before calling fixture, getting latest manipulated value
    console.log("w1 before fixture ", await weth.balanceOf(walletOne.address));

    // this is second time calling fixture so wont actually run
    const { bestNft } = await loadFixture(deployBestNftAndMintIt);

    // after fixture getting latest snapshotted value
    console.log("w1 after fixture ", await weth.balanceOf(walletOne.address));
    expect(await weth.balanceOf(walletOne.address)).to.equal(100);

    console.log("we have bestNft here:  ", bestNft.address);
    await bestNft
      .connect(walletOne)
      ["safeTransferFrom(address,address,uint256)"](
        walletOne.address,
        walletTwo.address,
        0,
      );
    expect(await bestNft.balanceOf(walletOne.address)).to.equal(0);
    expect(await bestNft.balanceOf(walletTwo.address)).to.equal(2);
  });

  // bestNft contract from fixture has its original values
  // in last test we changed values, but now they are back to 1,1
  it("can get balance on each wallet", async () => {
    // this is third time calling fixture so wont actually run
    const { bestNft } = await loadFixture(deployBestNftAndMintIt);
    console.log("we have bestNft here: ", bestNft.address);
    expect(await provider.getCode(bestNft.address)).to.not.equal("0x");
    const [walletOne, walletTwo] = provider.getWallets();
    expect(await bestNft.balanceOf(walletOne.address)).to.equal(1);
    expect(await bestNft.balanceOf(walletTwo.address)).to.equal(1);
  });

  it("can transfer from 2 to 1", async () => {
    // 4th call. wont actually run.
    // will give original state as it was after running first time
    const { bestNft } = await loadFixture(deployBestNftAndMintIt);
    console.log("we have bestNft here:  ", bestNft.address);
    const [walletOne, walletTwo] = provider.getWallets();
    await bestNft
      .connect(walletTwo)
      ["safeTransferFrom(address,address,uint256)"](
        walletTwo.address,
        walletOne.address,
        1,
      );
    expect(await bestNft.balanceOf(walletOne.address)).to.equal(2);
    expect(await bestNft.balanceOf(walletTwo.address)).to.equal(0);
  });
});
