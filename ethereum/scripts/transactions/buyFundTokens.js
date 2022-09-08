const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const FundFactory = await hre.ethers.getContractFactory('FundFactory');
  const fundFactory = FundFactory.attach(
    fs
      .readFileSync('.lastFundFactoryAddress')
      .toString()
      .trim(),
  );

  const fundTokens = 1;
  await fundFactory.buyFundTokens(fundTokens, { value: fundTokens * (await fundFactory.fundTokenPrice()) });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
