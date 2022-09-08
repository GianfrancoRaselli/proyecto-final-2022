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

  await fundFactory.createFund(
    'Name',
    'Description',
    [(await ethers.getSigners())[0].address],
    true,
    true,
    true,
    false,
    false,
    5,
    50,
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
