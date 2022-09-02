require("@nomicfoundation/hardhat-chai-matchers");
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-solhint');
require('solidity-coverage');
require('hardhat-tracer');
require('hardhat-gas-reporter');
require('hardhat-watcher');
require('hardhat-spdx-license-identifier');

require('dotenv').config();

module.exports = {
  solidity: '0.8.16',
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
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.ETHERSCAN_KEY,
    },
    customChains: [
      {
        network: 'rinkeby',
        chainId: 4,
        urls: {
          apiURL: 'https://api-rinkeby.etherscan.io/api',
          browserURL: 'https://rinkeby.etherscan.io',
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
