const { wethAddresses } = require("../constants");
// import { wethAddresses } from "../constants";

// const { ethers } = require("hardhat");

console.log("in foo.js script");

const main = async () => {
  // const foo = await ethers.getContract("ABC");
  // console.log("foo: ", foo);
  console.log(wethAddresses);
};

main();
