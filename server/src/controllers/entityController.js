const { Entity } = require("../models/index");
const { compareAddresses } = require("web3-simple-helpers/methods/general");
const multer = require("multer");
const fs = require("fs");

const create = async (req, res) => {
  if (!(await Entity.findOne({ address: req.entityAddress }))) {
    const { fullname, type, description, email, phone, location, url } = req.body;

    // new entity
    const entity = new Entity({
      address: req.entityAddress,
      fullname,
      type,
      description,
      email,
      phone,
      location,
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
    const { fullname, type, description, email, phone, location, url } = req.body;

    // update fields
    if (fullname) entityToUpdate.fullname = fullname;
    if (type) entityToUpdate.type = type;
    if (description) entityToUpdate.description = description;
    if (email) entityToUpdate.email = email;
    if (phone) entityToUpdate.phone = phone;
    if (location) entityToUpdate.location = location;
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
    // remove prior image
    if (entityToUpdate.image) {
      fs.unlink("uploads/" + entityToUpdate.image, (err) => {
        if (err) console.log(err);
      });
    }

    // set next image name
    nextImageName = req.entityAddress + "v" + (entityToUpdate.imageVersion + 1) + ".jpeg";

    // save the image in disk
    multer({
      storage: multer.diskStorage({
        destination: "./uploads",
        filename(_, file, cb) {
          return cb(null, nextImageName);
        },
      }),
    }).single("image")(req, res, async (err) => {
      if (err) {
        return res.send(400).send({ message: "Error al guardar la imagen" });
      }

      // save the name image in the DB
      entityToUpdate.image = nextImageName;
      entityToUpdate.imageVersion = entityToUpdate.imageVersion + 1;
      const savedEntity = await entityToUpdate.save();

      // return success
      return res.status(200).json(savedEntity);
    });
  } else {
    return res.status(400).send({ message: "La entidad aún no ha sido creada" });
  }
};

const removeImage = async (req, res) => {
  let entityToUpdate = await Entity.findOne({ address: req.entityAddress });
  if (entityToUpdate) {
    if (entityToUpdate.image) {
      // remove image
      fs.unlink("uploads/" + entityToUpdate.image, (err) => {
        if (err) console.log(err);
      });

      // update field
      entityToUpdate.image = undefined;

      // save the entity in the DB
      const savedEntity = await entityToUpdate.save();

      // return success
      return res.status(200).json(savedEntity);
    } else {
      return res.status(200).json(entityToUpdate);
    }
  } else {
    return res.status(400).send({ message: "La entidad aún no ha sido creada" });
  }
};

const saveFund = async (req, res) => {
  let entityToUpdate = await Entity.findOne({ address: req.entityAddress });
  if (entityToUpdate) {
    const { fund } = req.body;

    // update field
    let index = -1;
    for (let i = 0; i < entityToUpdate.savedFunds.length; i++) {
      if (compareAddresses(fund, entityToUpdate.savedFunds[i])) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      entityToUpdate.savedFunds.push(fund);

      // save the entity in the DB
      const savedEntity = await entityToUpdate.save();

      // return success
      return res.status(200).json(savedEntity);
    }

    // return success
    return res.status(200).json(entityToUpdate);
  } else {
    return res.status(400).send({ message: "La entidad aún no ha sido creada" });
  }
};

const removeFund = async (req, res) => {
  let entityToUpdate = await Entity.findOne({ address: req.entityAddress });
  if (entityToUpdate) {
    const { fund } = req.body;

    // update field
    let indexToRemove = -1;
    for (let i = 0; i < entityToUpdate.savedFunds.length; i++) {
      if (compareAddresses(fund, entityToUpdate.savedFunds[i])) {
        indexToRemove = i;
        break;
      }
    }
    if (indexToRemove >= 0) {
      entityToUpdate.savedFunds.splice(indexToRemove, 1);

      // save the entity in the DB
      const savedEntity = await entityToUpdate.save();

      // return success
      return res.status(200).json(savedEntity);
    }

    // return success
    return res.status(200).json(entityToUpdate);
  } else {
    return res.status(400).send({ message: "La entidad aún no ha sido creada" });
  }
};

const getAmount = async (req, res) => {
  const amount = await Entity.find().countDocuments();
  return res.status(200).json(amount);
};

const getAll = async (req, res) => {
  const entities = await Entity.find();
  return res.status(200).json(entities);
};

const get = async (req, res) => {
  const entity = await Entity.findOne({ address: req.params.address });
  return res.status(200).json(entity);
};

module.exports = { create, update, uploadImage, removeImage, saveFund, removeFund, getAmount, getAll, get };
