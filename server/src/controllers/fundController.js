const { Fund } = require("../models/index");

const create = async (req, res) => {
  const { description, photo } = req.body;
  const fund = new Fund({
    address: req.fundAddress,
    creator: req.entityAddress,
    description,
    photo,
  });
  const savedFund = await fund.save();
  return res.status(200).json(savedFund);
};

const update = async (req, res) => {
  const { description, photo } = req.body;
  let fundToUpdate = await Fund.findOne({ address: req.FUNDAddress });
  fundToUpdate.description = description;
  fundToUpdate.photo = photo;
  const savedFund = await fundToUpdate.save();
  return res.status(200).json(savedFund);
};

const get = async (req, res) => {
  const fund = await Fund.findOne({ address: req.params.address });
  return res.status(200).json(fund);
};

module.exports = { create, update, get };
