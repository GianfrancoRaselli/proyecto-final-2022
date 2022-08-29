const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('FundFactory', function () {
  let fundFactory;
  let deploymentAccount;

  beforeEach(async function () {
    const FundFactory = await ethers.getContractFactory('FundFactory');
    fundFactory = await FundFactory.deploy();

    deploymentAccount = (await ethers.getSigners())[0];
  });

  it('Contract deployed', async function () {
    expect(await fundFactory.address).to.not.equal(null || undefined);
  });
});
