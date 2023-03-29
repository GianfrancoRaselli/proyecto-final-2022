const mongoose = require("mongoose");

const { seedImages } = require("./imagesSeeder/imagesSeeder");
const { seedEntity } = require("./entitySeeder/entitySeeder");
const { seedFund } = require("./fundSeeder/fundSeeder");

const seedDB = async () => {
  seedImages();
  await dropCollections();
  seedEntity();
  seedFund();
};

const dropCollections = async () => {
  console.log("Dropping collections...");
  for (let collection of await mongoose.connection.db.listCollections().toArray()) {
    await mongoose.connection.db.dropCollection(collection.name);
  }
  console.log("Collections dropped");
};

module.exports = { seedDB };
