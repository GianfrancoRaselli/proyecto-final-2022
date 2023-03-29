const mongoose = require("mongoose");
const { Entity } = require("../../models/index");
const entities = require("./entities.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { infuraProvider } = require("../../config");
const Web3 = require("web3");
const fs = require("fs-extra");

const seedEntity = async () => {
  console.log("Seeding entity...");
  await mongoose.connection.db.dropCollection("entities");
  const provider = new HDWalletProvider(process.env.GANACHE_MNEMONIC_PHRASE.split("/").join(" "), infuraProvider);
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const address = accounts[i];
    const image = address + "v" + entity.imageVersion + ".jpeg";
    fs.renameSync("uploads/" + entity.image, "uploads/" + image);
    new Entity({
      address,
      fullname: entity.fullname,
      type: entity.type,
      description: entity.description,
      email: entity.email,
      phone: entity.phone,
      location: entity.location,
      url: entity.url,
      imageVersion: entity.imageVersion,
      image: image,
    }).save();
  }
  provider.engine.stop();
  console.log("Entity seeded");
};

module.exports = { seedEntity };
