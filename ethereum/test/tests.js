const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('FundFactory', function() {
  let fundFactory;

  beforeEach(async function() {
    const FundFactory = await ethers.getContractFactory('FundFactory');
    fundFactory = await FundFactory.deploy();
  });

  it('Contract deployed', async function() {
    expect(await fundFactory.address).to.not.equal(null || undefined);
  });
});

describe('Fund', function() {
  let fund;

  it('Create fund', async function() {
    const FundFactory = await ethers.getContractFactory('FundFactory');
    fundFactory = await FundFactory.deploy();

    const createFundTx = await fundFactory.createFund('Name', 'Description', [(await ethers.getSigners())[0].address], true, true, false, false, 5, 50);
    await createFundTx.wait();

    expect(await fundFactory.address).to.not.equal(null || undefined);
    expect(await fundFactory.getDeployedFundsCount()).to.equal(1);
  });
});
