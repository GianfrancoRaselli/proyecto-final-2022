const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BaseFundFactory", function () {

  let baseFundFactory;
  let deploymentAccount;

  beforeEach(async function () {
    const BaseFundFactory = await ethers.getContractFactory("BaseFundFactory");
    baseFundFactory = await BaseFundFactory.deploy();

    deploymentAccount = (await ethers.getSigners())[0];
  });

  it("Contract deployed", async function () {
    expect(await baseFundFactory.address).to.not.equal(null || undefined);
  });

});
