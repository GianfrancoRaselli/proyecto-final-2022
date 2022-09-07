const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const FundFactory = await hre.ethers.getContractFactory('FundFactory');
  const fundFactory = FundFactory.attach(
    fs
      .readFileSync('.lastAddressDeployed')
      .toString()
      .trim(),
  );

  await fundFactory.changeFundTokenPrice("1000000000000000");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
