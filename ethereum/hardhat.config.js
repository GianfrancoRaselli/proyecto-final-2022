require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const fs = require('fs')
const privateKey = fs.readFileSync(".secret").toString().trim();

module.exports = {
  solidity: "0.8.16",
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test"
  },
  //defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545"
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.RINKEBY_INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
