const mongoose = require("mongoose");
const { Entity } = require("../../models/index");
const entities = require("./entities.json");

const seedEntity = async () => {
  await mongoose.connection.db.dropCollection("entities");
  Entity.insertMany(entities, (err) => {
    if (err) return console.log(err);
    console.log("Entity seeded");
  });
};

module.exports = { seedEntity };
