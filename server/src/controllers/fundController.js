const { Fund } = require("../models/index");
const multer = require("multer");

const create = async (req, res) => {
  if (await Fund.findOne({ address: req.fundAddress })) {
    const { description, photoExtension } = req.body;

    // new fund
    const fund = new Fund({
      address: req.fundAddress,
      creator: req.entityAddress,
      description,
      photo: photoExtension ? req.fundAddress + "." + photoExtension : null,
    });

    // save the fund in the DB
    const savedFund = await fund.save();

    // save the photo in disk
    if (photoExtension)
      multer({
        storage: multer.diskStorage({
          destination: "./uploads",
          filename(_, _, cb) {
            return cb(null, req.fundAddress + "." + photoExtension);
          },
        }),
      }).single("photo")();

    return res.status(200).json(savedFund);
  } else {
    return res.send(400).send({ message: "El fondo ya ha sido creada" });
  }
};

const update = async (req, res) => {
  let fundToUpdate = await Fund.findOne({ address: req.fundAddress });
  if (fundToUpdate) {
    const { description, photoExtension } = req.body;

    // update fields
    fundToUpdate.description = description;
    if (photoExtension) fundToUpdate.photo = req.fundAddress + "." + photoExtension;

    // save the fund in the DB
    const savedFund = await fundToUpdate.save();

    // save the photo in disk
    if (photoExtension)
      multer({
        storage: multer.diskStorage({
          destination: "./uploads",
          filename(_, _, cb) {
            return cb(null, req.fundAddress + "." + photoExtension);
          },
        }),
      }).single("photo")();

    return res.status(200).json(savedFund);
  } else {
    return res.send(400).send({ message: "El fondo aún no ha sido creada" });
  }
};

const get = async (req, res) => {
  const fund = await Fund.findOne({ address: req.params.address });
  return res.status(200).json(fund);
};

module.exports = { create, update, get };
