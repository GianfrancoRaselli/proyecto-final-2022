const mongoose = require("mongoose");
const { Fund } = require("../../models/index");
const funds = require("./funds.json");
const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { infuraProvider } = require("../../config");
const Web3 = require("web3");

const seedFund = async () => {
  console.log("Seeding fund...");
  if (process.env.COMPILE_CONTRACTS === "true") compileContracts();
  const provider = new HDWalletProvider(process.env.GANACHE_MNEMONIC_PHRASE.split("/").join(" "), infuraProvider);
  const fundFactory = await deployNewFundFactoryContract(provider);
  await mongoose.connection.db.dropCollection("funds");
  for (let fund of funds) {
    await fundFactory.methods
      .buyFundTokens(1)
      .send({ from: fund.creator, value: await fundFactory.methods.fundTokenPrice().call() });
    const tx = await fundFactory.methods
      .createFund(
        fund.name,
        fund.managers,
        fund.managersCanBeAddedOrRemoved,
        fund.managersCanTransferMoneyWithoutARequest,
        fund.requestsCanBeCreated,
        fund.onlyManagersCanCreateARequest,
        fund.onlyContributorsCanApproveARequest,
        fund.minimumContributionPercentageRequired,
        fund.minimumApprovalsPercentageRequired
      )
      .send({ from: fund.creator });
    const address = tx.events.NewFund.returnValues.fundAddress;
    const image = address + "v" + fund.imageVersion + ".jpeg";
    fs.renameSync("uploads/" + fund.image, "uploads/" + image);
    new Fund({
      address,
      creator: fund.creator,
      description: fund.description,
      imageVersion: fund.imageVersion,
      image: image,
      history: fund.history,
      risks: fund.risks,
      rewards: fund.rewards,
    }).save();
  }
  provider.engine.stop();
  console.log("Fund seeded");
};

const compileContracts = () => {
  const buildPath = path.resolve(__dirname, "../../../", "build");
  fs.removeSync(buildPath);

  const compileFile = (fileName) => {
    let source = {};
    source[fileName] = {
      content: fs.readFileSync(path.resolve(__dirname, "../../../../ethereum/contracts", fileName), "utf-8"),
    };
    const input = {
      language: "Solidity",
      sources: {
        ...source,
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    const findImports = (filePath) => {
      const source = filePath.split("/")[0];
      if (source === "@openzeppelin") {
        const filePathArray = filePath.split("/");
        let folder = "";
        for (let i = 0; i < filePathArray.length - 1; i++) {
          folder += "/" + filePathArray[i];
        }
        const file = filePath.split("/")[filePathArray.length - 1];

        return {
          contents: fs.readFileSync(path.resolve(__dirname, "../../../../ethereum/node_modules" + folder, file), "utf-8"),
        };
      }
      return {
        contents: fs.readFileSync(path.resolve(__dirname, "../../../../ethereum/contracts", filePath), "utf-8"),
      };
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports })).contracts[fileName];

    fs.ensureDirSync(buildPath);
    for (let contract in output) {
      fs.outputJsonSync(path.resolve(buildPath, contract + ".json"), output[contract]);
    }
  };

  compileFile("FundFactory.sol");
};

const deployNewFundFactoryContract = async (provider) => {
  const web3 = new Web3(provider);
  const FundFactory = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../build", "FundFactory.json"), "utf-8"));
  const fundFactory = await new web3.eth.Contract(FundFactory.abi)
    .deploy({ data: FundFactory.evm.bytecode.object, arguments: ["1000000000000000"] })
    .send({ from: process.env.GANACHE_ADDRESS });

  // Save the last addresses deployed
  fs.writeFileSync(
    "../UIWeb/src/assets/addresses/ganache.json",
    JSON.stringify({
      fundFactoryAddress: fundFactory.options.address,
      fundTokenAddress: await fundFactory.methods.fundToken().call(),
    })
  );

  return fundFactory;
};

module.exports = { seedFund };
