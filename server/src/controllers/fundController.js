const { Fund } = require("../models/index");
const multer = require("multer");

const create = async (req, res) => {
  const { address, description } = req.body;

  if (!(await Fund.findOne({ address: address }))) {
    // new fund
    const fund = new Fund({
      address: address,
      creator: req.entityAddress,
      description,
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
    const { description } = req.body;

    // update fields
    if (description) fundToUpdate.description = description;

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
    nextImageName = req.params.address + "v" + (fundToUpdate.imageVersion + 1) + ".jpeg";

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
      fundToUpdate.imageVersion = fundToUpdate.imageVersion + 1;
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

const get = async (req, res) => {
  const fund = await Fund.findOne({ address: req.params.address.toLowerCase() });
  return res.status(200).json(fund);
};

module.exports = { create, update, uploadImage, removeImage, get };
