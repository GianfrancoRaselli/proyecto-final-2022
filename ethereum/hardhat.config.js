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
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  abiExporter: {
    path: '../UIWeb/src/assets/abis',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: ['FundFactory', 'FundToken', 'Fund'],
    spacing: 2,
    pretty: false,
    format: 'json', // Alternative to pretty
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_KEY,
    },
    customChains: [
      {
        network: 'goerli',
        chainId: 5,
        urls: {
          apiURL: 'https://api-goerli.etherscan.io/api',
          browserURL: 'https://goerli.etherscan.io',
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
