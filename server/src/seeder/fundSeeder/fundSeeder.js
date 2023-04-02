const { Fund } = require("../../models/index");
const fundsToCreate = require("./funds.json");
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
  for (let fundToCreate of fundsToCreate) {
    await fundFactoryInstance.methods
      .buyFundTokens(1)
      .send({ from: accounts[fundToCreate.creator], value: await fundFactoryInstance.methods.fundTokenPrice().call() });
    const createFundTx = await fundFactoryInstance.methods
      .createFund(
        fundToCreate.name,
        fundToCreate.managers.map((manager) => {
          return accounts[manager];
        }),
        fundToCreate.managersCanBeAddedOrRemoved,
        fundToCreate.managersCanTransferMoneyWithoutARequest,
        fundToCreate.requestsCanBeCreated,
        fundToCreate.onlyManagersCanCreateARequest,
        fundToCreate.onlyContributorsCanApproveARequest,
        fundToCreate.minimumContributionPercentageRequired,
        fundToCreate.minimumApprovalsPercentageRequired
      )
      .send({ from: accounts[fundToCreate.creator] });
    const address = createFundTx.events.NewFund.returnValues.fundAddress;
    let imageVersion = 0;
    let image = null;
    if (fundToCreate.image) {
      imageVersion++;
      image = address + "V" + imageVersion + ".jpeg";
      fs.renameSync("uploads/" + fundToCreate.image, "uploads/" + image);
    }
    let savedFund = await new Fund({
      address,
      creator: accounts[fundToCreate.creator],
      description: fundToCreate.description,
      imageVersion,
      image,
      history: fundToCreate.history,
      risks: fundToCreate.risks,
      rewards: fundToCreate.rewards,
      imagesAmount: 0,
      images: [],
    }).save();
    const FundContract = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../build", "Fund.json"), "utf-8"));
    const fundInstance = new web3.eth.Contract(FundContract.abi, address);
    if (fundToCreate.images && fundToCreate.images.length > 0) {
      let imageName;
      for (let image of fundToCreate.images) {
        savedFund.imagesAmount++;
        imageName = address + "Num" + savedFund.imagesAmount + ".jpeg";
        fs.renameSync("uploads/" + image, "uploads/" + imageName);
        savedFund.images.push(imageName);
      }
      await savedFund.save();
    }
    if (fundToCreate.updates && fundToCreate.updates.length > 0) {
      for (let update of fundToCreate.updates) {
        savedFund.updates.push({
          updater: accounts[update.updater],
          description: update.description,
        });
      }
      await savedFund.save();
    }
    if (fundToCreate.contributions) {
      for (let contribution of fundToCreate.contributions) {
        await fundInstance.methods.contribute().send({ from: accounts[contribution.contributor], value: contribution.value });
      }
    }
    if (fundToCreate.transfers) {
      for (let transfer of fundToCreate.transfers) {
        await fundInstance.methods.transfer(accounts[transfer.to], transfer.value).send({ from: accounts[transfer.sender] });
      }
    }
    if (fundToCreate.requests) {
      for (let request of fundToCreate.requests) {
        const createRequestTx = await fundInstance.methods
          .createRequest(request.description, accounts[request.recipient], request.valueToTransfer)
          .send({ from: accounts[request.petitioner] });
        if (request.approvers) {
          for (let approver of request.approvers) {
            await fundInstance.methods
              .approveRequest(createRequestTx.events.NewRequest.returnValues.requestIndex)
              .send({ from: accounts[approver] });
          }
        }
        if (request.finalize)
          await fundInstance.methods
            .finalizeRequest(createRequestTx.events.NewRequest.returnValues.requestIndex)
            .send({ from: accounts[request.petitioner] });
      }
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
