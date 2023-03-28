const { seedEntity } = require("./entitySeeder");
const { seedFund } = require("./fundSeeder");

const seedDB = () => {
  seedEntity();
  seedFund();
};

module.exports = { seedDB };
