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
  const web3 = new Web3(provider);
  const fundFactoryInstance = await deployNewFundFactoryContract(web3);
  const accounts = await web3.eth.getAccounts();
  for (let fund of funds) {
    await fundFactoryInstance.methods
      .buyFundTokens(1)
      .send({ from: accounts[fund.creator], value: await fundFactoryInstance.methods.fundTokenPrice().call() });
    const createFundTx = await fundFactoryInstance.methods
      .createFund(
        fund.name,
        fund.managers.map((manager) => {
          return accounts[manager];
        }),
        fund.managersCanBeAddedOrRemoved,
        fund.managersCanTransferMoneyWithoutARequest,
        fund.requestsCanBeCreated,
        fund.onlyManagersCanCreateARequest,
        fund.onlyContributorsCanApproveARequest,
        fund.minimumContributionPercentageRequired,
        fund.minimumApprovalsPercentageRequired
      )
      .send({ from: accounts[fund.creator] });
    const address = createFundTx.events.NewFund.returnValues.fundAddress;
    const image = address + "v" + fund.imageVersion + ".jpeg";
    fs.renameSync("uploads/" + fund.image, "uploads/" + image);
    new Fund({
      address,
      creator: accounts[fund.creator],
      description: fund.description,
      imageVersion: fund.imageVersion,
      image: image,
      history: fund.history,
      risks: fund.risks,
      rewards: fund.rewards,
    }).save();
    const FundContract = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../build", "Fund.json"), "utf-8"));
    const fundInstance = new web3.eth.Contract(FundContract.abi, address);
    for (let contribution of fund.contributions) {
      await fundInstance.methods.contribute().send({ from: accounts[contribution.contributor], value: contribution.value });
    }
    for (let transfer of fund.transfers) {
      await fundInstance.methods.transfer(accounts[transfer.to], transfer.value).send({ from: accounts[transfer.sender] });
    }
    for (let request of fund.requests) {
      const createRequestTx = await fundInstance.methods
        .createRequest(request.description, accounts[request.recipient], request.valueToTransfer)
        .send({ from: accounts[request.petitioner] });
      for (let approver of request.approvers) {
        await fundInstance.methods
          .approveRequest(createRequestTx.events.NewRequest.returnValues.requestIndex)
          .send({ from: accounts[approver] });
      }
      if (request.finalize)
        await fundInstance.methods
          .finalizeRequest(createRequestTx.events.NewRequest.returnValues.requestIndex)
          .send({ from: accounts[request.petitioner] });
    }
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
  compileFile("Fund.sol");
};

const deployNewFundFactoryContract = async (web3) => {
  const FundFactoryContract = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../build", "FundFactory.json"), "utf-8"));
  const fundFactoryInstance = await new web3.eth.Contract(FundFactoryContract.abi)
    .deploy({ data: FundFactoryContract.evm.bytecode.object, arguments: ["1000000000000000"] })
    .send({ from: process.env.GANACHE_ADDRESS });

  // Save the last addresses deployed
  fs.writeFileSync(
    "../UIWeb/src/assets/addresses/ganache.json",
    JSON.stringify({
      fundFactoryAddress: fundFactoryInstance.options.address,
      fundTokenAddress: await fundFactoryInstance.methods.fundToken().call(),
    })
  );

  return fundFactoryInstance;
};

module.exports = { seedFund };
