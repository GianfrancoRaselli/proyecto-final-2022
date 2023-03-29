const { seedImages } = require("./imagesSeeder/imagesSeeder");
const { seedEntity } = require("./entitySeeder/entitySeeder");
const { seedFund } = require("./fundSeeder/fundSeeder");

const seedDB = () => {
  seedImages();
  seedEntity();
  seedFund();
};

module.exports = { seedDB };
