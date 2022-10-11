const { expect } = require('chai');
const { ethers } = require('hardhat');

let FundFactory;
let Fund;
let fundFactory;
let defaultCreateFundArgs;
const fundTokenPrice = 100;

before(async function() {
  FundFactory = await ethers.getContractFactory('FundFactory');
  Fund = await ethers.getContractFactory('Fund');
  defaultCreateFundArgs = ['Name', 'Description', [(await ethers.getSigners())[0].address]];
});

beforeEach(async function() {
  fundFactory = await FundFactory.deploy(fundTokenPrice);
});

describe('FundFactory contract', function() {
  it('Contract deployed', async function() {
    expect(await fundFactory.address).to.not.equal(null || undefined);
    expect(await fundFactory.getDeployedFundsCount()).to.equal(0);
  });

  describe('Create fund', function() {
    beforeEach(async function() {
      await fundFactory.buyFundTokens(1, { value: fundTokenPrice });
    });

    it('Incorrect contribution percentage', async function() {
      const createFundArgs = [...defaultCreateFundArgs, true, true, true, false, false, 105, 50];

      await expect(fundFactory.createFund(...createFundArgs)).to.be.revertedWith('Incorrect contribution percentage');
      expect(await fundFactory.getDeployedFundsCount()).to.equal(0);
    });

    it('Incorrect approvals percentage', async function() {
      const createFundArgs = [...defaultCreateFundArgs, true, true, true, false, false, 5, 105];

      await expect(fundFactory.createFund(...createFundArgs)).to.be.revertedWith('Incorrect approvals percentage');
      expect(await fundFactory.getDeployedFundsCount()).to.equal(0);
    });

    it('Create new fund', async function() {
      const createFundArgs = [...defaultCreateFundArgs, true, true, true, false, false, 5, 50];
      const createFundTx = await fundFactory.createFund(...createFundArgs);

      await expect(createFundTx)
        .to.emit(fundFactory, 'NewFund')
        .withArgs(
          await fundFactory.deployedFunds(0),
          createFundArgs[0],
          createFundArgs[1],
          (await ethers.getSigners())[0].address,
          (await ethers.provider.getBlock(createFundTx.blockNumber)).timestamp,
        );
      // Not supported yet
      /*
      .withNamedArgs({
        fundAddress: await fundFactory.deployedFunds(0),
        name: createFundArgs[0],
        description: createFundArgs[1],
        creator: (await ethers.getSigners())[0].address,
        createdAt: createFundTx.timestamp,
      })
    */
      // Not supported yet
      //expect('createFund').to.be.calledOnContractWith(fundFactory, [...createFundArgs]);
      expect(await fundFactory.getDeployedFundsCount()).to.equal(1);
      expect(await fundFactory.deployedFunds(0)).to.equal((await fundFactory.getDeployedFunds())[0]);
    });
  });
});

describe('Fund contract', function() {
  let fund;

  beforeEach(async function() {
    await fundFactory.buyFundTokens(1, { value: fundTokenPrice });
  });

  describe('Friends fund', function() {
    beforeEach(async function() {
      const createFundArgs = [...defaultCreateFundArgs, true, true, true, false, false, 0, 50];
      await fundFactory.createFund(...createFundArgs);

      fund = Fund.attach(await fundFactory.deployedFunds(0));
    });

    it('Contract deployed', async function() {
      expect(await fund.address).to.not.equal(null || undefined);
      expect(await fund.address).to.equal(await fundFactory.deployedFunds(0));
      expect(await fund.balance()).to.equal(0);
    });z
  });

  describe('Campaign fund', function() {
    beforeEach(async function() {
      const createFundArgs = [...defaultCreateFundArgs, false, false, true, true, true, 5, 50];
      await fundFactory.createFund(...createFundArgs);

      fund = Fund.attach(await fundFactory.deployedFunds(0));
    });

    it('Contract deployed', async function() {
      expect(await fund.address).to.not.equal(null || undefined);
      expect(await fund.address).to.equal(await fundFactory.deployedFunds(0));
      expect(await fund.balance()).to.equal(0);
    });
  });

  describe('Donation fund', function() {
    beforeEach(async function() {
      const createFundArgs = [...defaultCreateFundArgs, true, true, true, true, true, 5, 50];
      await fundFactory.createFund(...createFundArgs);

      fund = Fund.attach(await fundFactory.deployedFunds(0));
    });

    it('Contract deployed', async function() {
      expect(await fund.address).to.not.equal(null || undefined);
      expect(await fund.address).to.equal(await fundFactory.deployedFunds(0));
      expect(await fund.balance()).to.equal(0);
    });
  });
});
