require('@nomicfoundation/hardhat-chai-matchers');
require('hardhat-abi-exporter');
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-solhint');
require('solidity-coverage');
require('hardhat-tracer');
require('hardhat-gas-reporter');
require('hardhat-watcher');
require('hardhat-spdx-license-identifier');

require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  paths: {
    artifacts: './artifacts',
    sources: './contracts',
    cache: './cache',
    tests: './test',
  },
  //defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: 'http://127.0.0.1:7545',
      accounts: [process.env.GANACHE_PRIVATE_KEY],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  abiExporter: [
    // server
    {
      path: '../server/abis',
      runOnCompile: true,
      clear: true,
      flat: true,
      only: ['Fund.sol'],
      spacing: 2,
      pretty: false,
      format: 'json', // Alternative to pretty
    },
    // UIWeb
    {
      path: '../UIWeb/src/assets/abis',
      runOnCompile: true,
      clear: true,
      flat: true,
      only: ['FundFactory.sol', 'FundToken.sol', 'Fund.sol'],
      spacing: 2,
      pretty: false,
      format: 'json', // Alternative to pretty
    },
  ],
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_KEY,
    },
    customChains: [
      {
        network: 'sepolia',
        chainId: 11155111,
        urls: {
          apiURL: 'https://api-sepolia.etherscan.io/api',
          browserURL: 'https://sepolia.etherscan.io',
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true' ? true : false,
    currency: 'USD',
  },
  watcher: {
    compilation: {
      tasks: ['compile'],
      files: ['./contracts'],
      ignoredFiles: ['**/.vscode'],
      verbose: true,
      clearOnStart: true,
      start: 'echo Running my compilation task now...',
    },
    ci: {
      tasks: ['clean', { command: 'compile', params: { quiet: true } }, { command: 'test', params: { noCompile: true } }],
    },
  },
  /*spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  }*/
};
