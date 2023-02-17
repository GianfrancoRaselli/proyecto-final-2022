const { Fund } = require("../models/index");

const create = (req, res) => {
  const juego = crearNuevoJuego();
  return res.status(200).json(juego);
};

const update = (req, res) => {
  const juego = crearNuevoJuego();
  return res.status(200).json(juego);
};

const get = (req, res) => {
  const juego = crearNuevoJuego();
  return res.status(200).json(juego);
};

module.exports = { create, update, get };
