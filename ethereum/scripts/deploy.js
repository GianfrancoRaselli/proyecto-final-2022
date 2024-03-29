// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  // We get the contract to deploy
  const FundFactory = await hre.ethers.getContractFactory('FundFactory');
  const fundTokenPrice = '1000000000000000';
  const fundFactory = await FundFactory.deploy(fundTokenPrice);
  await fundFactory.deployed();
  console.log('FundFactory deployed to:', fundFactory.address);
  console.log('FundToken deployed to:', await fundFactory.fundToken());

  // Save the last addresses deployed
  fs.writeFileSync(
    '../UIWeb/src/assets/addresses/' + hre.network.name + '.json',
    JSON.stringify({ fundFactoryAddress: fundFactory.address, fundTokenAddress: await fundFactory.fundToken() }),
  );

  /*if (hre.network.name === 'goerli') {
    // Verify deployed contract in Etherscan
    console.log('Waiting 5 block confirmations...');
    await fundFactory.deployTransaction.wait(5); // needed if verifyContract() is called immediately after deployment
    try {
      console.log('Verifying contract...');
      await hre.run('verify:verify', {
        address: fundFactory.address,
        constructorArguments: [fundTokenPrice],
      });
    } catch (err) {
      if (err.message.includes('Reason: Already Verified')) {
        console.log('Contract is already verified');
      } else {
        throw err;
      }
    }
    console.log('Deployed contract verified');
  }*/
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
