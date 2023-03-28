const mongoose = require("mongoose");
const { Entity } = require("../models/index");

const entities = [
  {
    address: "0xB0eAa5419A35F7e638910f1c47C747486D5CCEd2",
    fullname: "Gianfranco Raselli",
    type: "Persona",
    description: "Estudiante de Ingeniería en Sistemas de Información en la Facultad Regional Rosario de la UTN",
    email: "gianrase@hotmail.com",
    phone: "(3482) 334910",
    location: "Reconquista, Santa Fe, Argentina",
    url: "https://www.instagram.com/gianfrancoraselli/",
    imageVersion: 1,
    image: "0xB0eAa5419A35F7e638910f1c47C747486D5CCEd2v1.jpeg",
  },
  {
    address: "0x7CE000A79F60e874049b6610876117eF9C7DCA1c",
    fullname: "Juan Pérez",
    type: "Persona",
    description: "Profesor de física II",
    email: "juanito@gmail.com",
    phone: "(341) 3876691",
    location: "Rosario, Santa Fe, Argentina",
  },
];

const seedEntity = async () => {
  await mongoose.connection.db.dropCollection("entities");
  Entity.insertMany(entities, (err) => {
    if (err) return console.log(err);
    console.log("Entity seeded");
  });
};

module.exports = { seedEntity };
