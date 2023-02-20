const { Entity } = require("../models/index");
const multer = require("multer");

const create = async (req, res) => {
  if (await Entity.findOne({ address: req.entityAddress })) {
    const { fullname, type, email, phone, photoExtension, url } = req.body;

    // new entity
    const entity = new Entity({
      address: req.entityAddress,
      fullname,
      type,
      email,
      phone,
      photo: photoExtension ? req.entityAddress + "." + photoExtension : null,
      url,
    });

    // save the entity in the DB
    const savedEntity = await entity.save();

    // save the photo in disk
    if (photoExtension)
      multer({
        storage: multer.diskStorage({
          destination: "./uploads",
          filename(_, file, cb) {
            return cb(null, req.entityAddress + "." + photoExtension);
          },
        }),
      }).single("photo")();

    return res.status(200).json(savedEntity);
  } else {
    return res.send(400).send({ message: "La entidad ya ha sido creada" });
  }
};

const update = async (req, res) => {
  let entityToUpdate = await Entity.findOne({ address: req.entityAddress });
  if (entityToUpdate) {
    const { fullname, type, email, phone, photoExtension, url } = req.body;

    // update fields
    entityToUpdate.fullname = fullname;
    entityToUpdate.type = type;
    entityToUpdate.email = email;
    entityToUpdate.phone = phone;
    if (photoExtension) entityToUpdate.photo = req.entityAddress + "." + photoExtension;
    entityToUpdate.url = url;

    // save the entity in the DB
    const savedEntity = await entityToUpdate.save();

    // save the photo in disk
    if (photoExtension)
      multer({
        storage: multer.diskStorage({
          destination: "./uploads",
          filename(_, file, cb) {
            return cb(null, req.entityAddress + "." + photoExtension);
          },
        }),
      }).single("photo")();

    return res.status(200).json(savedEntity);
  } else {
    return res.send(400).send({ message: "La entidad aún no ha sido creada" });
  }
};

const get = async (req, res) => {
  const entity = await Entity.findOne({ address: req.params.address });
  return res.status(200).json(entity);
};

module.exports = { create, update, get };
