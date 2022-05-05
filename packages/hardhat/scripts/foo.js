const { wethAddress } = require("../constants");
// import { wethAddress } from "../constants";

// const { ethers } = require("hardhat");

console.log("in foo.js script");

const main = async () => {
  // const foo = await ethers.getContract("ABC");
  // console.log("foo: ", foo);
  console.log(wethAddress);
};

main();
