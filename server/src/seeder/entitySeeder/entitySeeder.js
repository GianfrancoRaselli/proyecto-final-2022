const { Entity, Fund } = require("../../models/index");
const entitiesToCreate = require("./entities.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { infuraProvider } = require("../../config");
const Web3 = require("web3");
const fs = require("fs-extra");

const seedEntity = async () => {
  console.log("Seeding entity...");
  const provider = new HDWalletProvider(process.env.GANACHE_MNEMONIC_PHRASE.split("/").join(" "), infuraProvider);
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const funds = await Fund.find();
  for (let i = 0; i < entitiesToCreate.length; i++) {
    const entityToCreate = entitiesToCreate[i];
    const address = accounts[i];
    const image = address + "v" + entityToCreate.imageVersion + ".jpeg";
    fs.renameSync("uploads/" + entityToCreate.image, "uploads/" + image);
    new Entity({
      address,
      fullname: entityToCreate.fullname,
      type: entityToCreate.type,
      description: entityToCreate.description,
      email: entityToCreate.email,
      phone: entityToCreate.phone,
      country: entityToCreate.country,
      region: entityToCreate.region,
      url: entityToCreate.url,
      imageVersion: entityToCreate.imageVersion,
      image: image,
      savedFunds: entityToCreate.savedFunds.map((fund) => {
        return funds[fund].address;
      }),
    }).save();
  }
  provider.engine.stop();
  console.log("Entity seeded");
};

module.exports = { seedEntity };
