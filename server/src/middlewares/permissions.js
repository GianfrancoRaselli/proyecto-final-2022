const { Fund } = require("../models/index");
const Web3 = require("web3");
const fundABI = require("../../abis/Fund");

const createFund = async (req, res, next) => {
  try {
    const web3 = new Web3("https://goerli.infura.io/v3/c2c820555fad43838ab62145a03e4a2a");
    const fund = new web3.eth.Contract(fundABI, req.body.address);
    const creatorAddress = await fund.methods.creator.call();
    if (req.entityAddress.toUpperCase() === creatorAddress.toUpperCase()) {
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

module.exports = { createFund, updateFund };
