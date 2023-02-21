const { Entity } = require("../models/index");
const multer = require("multer");

const create = async (req, res) => {
  if (!(await Entity.findOne({ address: req.entityAddress }))) {
    const { fullname, type, email, phone, url } = req.body;

    // new entity
    const entity = new Entity({
      address: req.entityAddress,
      fullname,
      type,
      email,
      phone,
      url,
    });

    // save the entity in the DB
    const savedEntity = await entity.save();

    // return success
    return res.status(200).json(savedEntity);
  } else {
    return res.status(400).send({ message: "La entidad ya ha sido creada" });
  }
};

const update = async (req, res) => {
  let entityToUpdate = await Entity.findOne({ address: req.entityAddress });
  if (entityToUpdate) {
    const { fullname, type, email, phone, url } = req.body;

    // update fields
    if (fullname) entityToUpdate.fullname = fullname;
    if (type) entityToUpdate.type = type;
    if (email) entityToUpdate.email = email;
    if (phone) entityToUpdate.phone = phone;
    if (url) entityToUpdate.url = url;

    // save the entity in the DB
    const savedEntity = await entityToUpdate.save();

    // return success
    return res.status(200).json(savedEntity);
  } else {
    return res.status(400).send({ message: "La entidad aún no ha sido creada" });
  }
};

const uploadImage = async (req, res) => {
  let entityToUpdate = await Entity.findOne({ address: req.entityAddress });
  if (entityToUpdate) {
    // save the image in disk
    multer({
      storage: multer.diskStorage({
        destination: "./uploads",
        filename(_, file, cb) {
          return cb(null, req.entityAddress + ".jpeg");
        },
      }),
    }).single("photo")(req, res, async (err) => {
      if (err) {
        return res.send(400).send({ message: "Error al guardar la imagen" });
      }

      // save the name image in the DB
      entityToUpdate.image = req.entityAddress + ".jpeg";
      const savedEntity = await entityToUpdate.save();

      // return success
      return res.status(200).json(savedEntity);
    });
  } else {
    return res.status(400).send({ message: "La entidad aún no ha sido creada" });
  }
};

const get = async (req, res) => {
  const entity = await Entity.findOne({ address: req.params.address });
  return res.status(200).json(entity);
};

module.exports = { create, update, uploadImage, get };
