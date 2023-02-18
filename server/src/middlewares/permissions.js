const Web3 = require("web3");
const { Fund } = require("../models/index");

const message = "Firme este mensaje para validar la dirección del fondo.\n\nEsto no le costará ningún Ether.";

const updateEntity = async (req, res, next) => {
  if (req.entityAddress.toUpperCase() === req.params.address.toUpperCase()) {
    return next();
  }
  return res.status(401).send({
    message: "unauthorized",
  });
};

const fundAddress = async (req, res, next) => {
  try {
    const fundAddress = await new Web3().eth.accounts.recover(message, req.body.fundSignature);
    if (req.body.fundAddress.toUpperCase() === fundAddress.toUpperCase()) {
      req.fundAddress = fundAddress;
      return next();
    }
  } catch (e) {
    return res.status(401).send({
      message: "unauthorized",
    });
  }
  return res.status(401).send({
    message: "unauthorized",
  });
};

const updateFund = async (req, res, next) => {
  try {
    const fund = await Fund.findOne({ address: req.params.address });
    if (req.entityAddress.toUpperCase() === fund.creator.toUpperCase()) {
      return next();
    }
    return res.status(401).send({
      message: "unauthorized",
    });
  } catch (e) {
    return res.status(401).send({
      message: "unauthorized",
    });
  }
};

module.exports = { updateEntity, fundAddress, updateFund };
