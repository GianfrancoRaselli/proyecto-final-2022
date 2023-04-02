const { Fund } = require("../models/index");
const multer = require("multer");
const fs = require("fs");

const create = async (req, res) => {
  const { address } = req.body;

  if (!(await Fund.findOne({ address: address }))) {
    // new fund
    const fund = new Fund({
      address: address,
      creator: req.entityAddress,
    });

    // save the fund in the DB
    const savedFund = await fund.save();

    // return success
    return res.status(200).json(savedFund);
  } else {
    return res.status(400).send({ message: "El fondo ya ha sido creado" });
  }
};

const update = async (req, res) => {
  let fundToUpdate = await Fund.findOne({ address: req.params.address });
  if (fundToUpdate) {
    const { description, history, risks, rewards, update } = req.body;

    // update fields
    if (description || description === "") fundToUpdate.description = description;
    if (history || history === "") fundToUpdate.history = history;
    if (risks || risks === "") fundToUpdate.risks = risks;
    if (rewards || rewards === "") fundToUpdate.rewards = rewards;
    if (update)
      fundToUpdate.updates.push({
        updater: req.entityAddress,
        description: update,
      });

    // save the fund in the DB
    const savedFund = await fundToUpdate.save();

    // return success
    return res.status(200).json(savedFund);
  } else {
    return res.status(400).send({ message: "El fondo aún no ha sido creado" });
  }
};

const uploadImage = async (req, res) => {
  let fundToUpdate = await Fund.findOne({ address: req.params.address });
  if (fundToUpdate) {
    // remove prior image
    if (fundToUpdate.image) {
      fs.unlink("uploads/" + fundToUpdate.image, (err) => {
        if (err) console.log(err);
      });
    }

    // set next image name
    const nextImageName = req.params.address + "V" + (fundToUpdate.imageVersion + 1) + ".jpeg";

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
      fundToUpdate.image = nextImageName;
      fundToUpdate.imageVersion++;
      const savedFund = await fundToUpdate.save();

      // return success
      return res.status(200).json(savedFund);
    });
  } else {
    return res.status(400).send({ message: "El fondo aún no ha sido creado" });
  }
};

const removeImage = async (req, res) => {
  let fundToUpdate = await Fund.findOne({ address: req.params.address });
  if (fundToUpdate) {
    if (fundToUpdate.image) {
      // remove image
      fs.unlink("uploads/" + fundToUpdate.image, (err) => {
        if (err) console.log(err);
      });

      // update field
      fundToUpdate.image = undefined;

      // save the entity in the DB
      const savedFund = await fundToUpdate.save();

      // return success
      return res.status(200).json(savedFund);
    } else {
      return res.status(200).json(fundToUpdate);
    }
  } else {
    return res.status(400).send({ message: "El fondo aún no ha sido creado" });
  }
};

const uploadImageToImages = async (req, res) => {
  let fundToUpdate = await Fund.findOne({ address: req.params.address });
  if (fundToUpdate) {
    // set next image name
    const nextImageName = req.params.address + "Num" + (fundToUpdate.imagesAmount + 1) + ".jpeg";

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
      fundToUpdate.images.push(nextImageName);
      fundToUpdate.imagesAmount++;
      const savedFund = await fundToUpdate.save();

      // return success
      return res.status(200).json(savedFund);
    });
  } else {
    return res.status(400).send({ message: "El fondo aún no ha sido creado" });
  }
};

const removeImageFromImages = async (req, res) => {
  let fundToUpdate = await Fund.findOne({ address: req.params.address });
  if (fundToUpdate) {
    const indexToRemove = fundToUpdate.images.findIndex((image) => image === req.params.imageName);
    if (indexToRemove >= 0) {
      // remove image
      fs.unlink("uploads/" + fundToUpdate.images[indexToRemove], (err) => {
        if (err) console.log(err);
      });

      // update field
      fundToUpdate.images.splice(indexToRemove, 1);

      // save the entity in the DB
      const savedFund = await fundToUpdate.save();

      // return success
      return res.status(200).json(savedFund);
    } else {
      return res.status(200).json(fundToUpdate);
    }
  } else {
    return res.status(400).send({ message: "El fondo aún no ha sido creado" });
  }
};

const get = async (req, res) => {
  const fund = await Fund.findOne({ address: req.params.address });
  return res.status(200).json(fund);
};

module.exports = { create, update, uploadImage, removeImage, uploadImageToImages, removeImageFromImages, get };
