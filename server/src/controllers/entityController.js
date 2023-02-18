const { Entity } = require("../models/index");

const create = async (req, res) => {
  const { fullname, type, email, phone, photo, url } = req.body;
  const entity = new Entity({
    address: req.entityAddress,
    fullname,
    type,
    email,
    phone,
    photo,
    url,
  });
  const savedEntity = await entity.save();
  return res.status(200).json(savedEntity);
};

const update = async (req, res) => {
  const { fullname, type, email, phone, photo, url } = req.body;
  let entityToUpdate = await Entity.findOne({ address: req.entityAddress });
  entityToUpdate.fullname = fullname;
  entityToUpdate.type = type;
  entityToUpdate.email = email;
  entityToUpdate.phone = phone;
  entityToUpdate.photo = photo;
  entityToUpdate.url = url;
  const savedEntity = await entityToUpdate.save();
  return res.status(200).json(savedEntity);
};

const get = async (req, res) => {
  const entity = await Entity.findOne({ address: req.params.address });
  return res.status(200).json(entity);
};

module.exports = { create, update, get };
