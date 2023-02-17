const { Fund } = require("../models/index");

const updateEntity = async (req, res, next) => {
  if (req.body.entityAddress.toUpperCase() === req.params.address.toUpperCase()) {
    return next();
  }
  return res.status(401).send({
    message: "unauthorized",
  });
};

const updateFund = async (req, res, next) => {
  try {
    const fund = await Fund.findOne({ address: req.params.address });
    if (req.body.entityAddress.toUpperCase() === fund.creator.toUpperCase()) {
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

module.exports = { updateEntity };
