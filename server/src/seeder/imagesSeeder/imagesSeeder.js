const fs = require("fs-extra");

const seedImages = () => {
  console.log("Seeding images...");
  fs.rmSync("uploads", { recursive: true, force: true });
  fs.copySync("src/seeder/imagesSeeder/images/", "uploads");
  console.log("Images seeded");
};

module.exports = { seedImages };
