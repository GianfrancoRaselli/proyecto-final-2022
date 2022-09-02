const { expect } = require('chai');
const { ethers } = require('hardhat');

let fundFactory;

beforeEach(async function() {
  const FundFactory = await ethers.getContractFactory('FundFactory');
  fundFactory = await FundFactory.deploy();
});

describe('FundFactory contract', function() {
  it('Contract deployed', async function() {
    expect(await fundFactory.address).to.not.equal(null || undefined);
    expect(await fundFactory.getDeployedFundsCount()).to.equal(0);
  });

  describe('Create fund', function() {
    it('Incorrect contribution percentage', async function() {
      const args = ['Name', 'Description', [(await ethers.getSigners())[0].address], true, true, true, false, false, 105, 50];

      await expect(fundFactory.createFund(...args)).to.be.revertedWith('Incorrect contribution percentage');
      expect(await fundFactory.getDeployedFundsCount()).to.equal(0);
    });

    it('Incorrect approvals percentage', async function() {
      const args = ['Name', 'Description', [(await ethers.getSigners())[0].address], true, true, true, false, false, 5, 105];

      await expect(fundFactory.createFund(...args)).to.be.revertedWith('Incorrect approvals percentage');
      expect(await fundFactory.getDeployedFundsCount()).to.equal(0);
    });

    it('Create new fund', async function() {
      const args = ['Name', 'Description', [(await ethers.getSigners())[0].address], true, true, true, false, false, 5, 50];
      const createFundTx = await fundFactory.createFund(...args);
      
      await expect(createFundTx)
        .to.emit(fundFactory, 'NewFund')
        .withArgs(args[0], args[1], (await ethers.getSigners())[0].address, (await ethers.provider.getBlock(createFundTx.blockNumber)).timestamp);
      // Not supported yet
      /*
      .withNamedArgs({
        name: args[0],
        description: args[1],
        creator: (await ethers.getSigners())[0].address,
        createdAt: createFundTx.timestamp,
      })
    */
      // Not supported yet
      //expect('createFund').to.be.calledOnContractWith(fundFactory, [...args]);
      expect(await fundFactory.getDeployedFundsCount()).to.equal(1);
      expect(await fundFactory.deployedFunds(0)).to.equal((await fundFactory.getDeployedFunds())[0]);
    });
  });
});

describe('Fund contract', function() {
  describe('Friends fund', function() {
    let fund;

    beforeEach(async function() {
      const args = ['Name', 'Description', [(await ethers.getSigners())[0].address], true, true, true, false, false, 0, 50];
      await fundFactory.createFund(...args);

      const Fund = await ethers.getContractFactory('Fund');
      fund = Fund.attach(await fundFactory.deployedFunds(0));
    });

    it('Contract deployed', async function() {
      expect(await fund.address).to.not.equal(null || undefined);
      expect(await fund.address).to.equal(await fundFactory.deployedFunds(0));
      expect(await fund.balance()).to.equal(0);
    });
  });

  describe('Campaign fund', function() {
    let fund;

    beforeEach(async function() {
      const args = ['Name', 'Description', [(await ethers.getSigners())[0].address], false, false, true, true, true, 5, 50];
      await fundFactory.createFund(...args);

      const Fund = await ethers.getContractFactory('Fund');
      fund = Fund.attach(await fundFactory.deployedFunds(0));
    });

    it('Contract deployed', async function() {
      expect(await fund.address).to.not.equal(null || undefined);
      expect(await fund.address).to.equal(await fundFactory.deployedFunds(0));
      expect(await fund.balance()).to.equal(0);
    });
  });

  describe('Donation fund', function() {
    let fund;

    beforeEach(async function() {
      const args = ['Name', 'Description', [(await ethers.getSigners())[0].address], true, true, true, true, true, 5, 50];
      await fundFactory.createFund(...args);

      const Fund = await ethers.getContractFactory('Fund');
      fund = Fund.attach(await fundFactory.deployedFunds(0));
    });

    it('Contract deployed', async function() {
      expect(await fund.address).to.not.equal(null || undefined);
      expect(await fund.address).to.equal(await fundFactory.deployedFunds(0));
      expect(await fund.balance()).to.equal(0);
    });
  });
});
