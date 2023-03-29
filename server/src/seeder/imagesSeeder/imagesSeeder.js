const fs = require("fs-extra");

const seedImages = async () => {
  fs.rmSync("uploads", { recursive: true, force: true });
  fs.copySync("src/seeder/imagesSeeder/images/", "uploads");
};

module.exports = { seedImages };
