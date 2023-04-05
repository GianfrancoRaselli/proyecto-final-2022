const mongoose = require("mongoose");

const { seedImages } = require("./imagesSeeder/imagesSeeder");
const { seedEntity } = require("./entitySeeder/entitySeeder");
const { seedFund } = require("./fundSeeder/fundSeeder");

const seed = async () => {
  if (process.env.SEED_IMAGES === "true") seedImages();
  if (process.env.SEED_DB === "true") {
    await dropCollections();
    await seedFund();
    await seedEntity();
  }
};

const dropCollections = async () => {
  console.log("Dropping collections...");
  for (let collection of await mongoose.connection.db.listCollections().toArray()) {
    await mongoose.connection.db.dropCollection(collection.name);
  }
  console.log("Collections dropped");
};

module.exports = { seed };
