const { compareAddresses } = require("web3-simple-helpers/methods/general");
const fundABI = require("../../abis/Fund");
const { infuraProvider } = require("../config");
const Web3 = require("web3");
const web3 = new Web3(infuraProvider);

const isTheCreator = async (req, res, next) => {
  const fundAddress = req.params.address ? req.params.address : req.body.address;
  try {
    const fund = new web3.eth.Contract(fundABI, fundAddress);
    const creatorAddress = await fund.methods.creator().call();
    if (compareAddresses(creatorAddress, req.entityAddress)) {
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

const isAManager = async (req, res, next) => {
  const fundAddress = req.params.address ? req.params.address : req.body.address;
  try {
    const fund = new web3.eth.Contract(fundABI, fundAddress);
    const managers = await fund.methods.getManagers().call();
    if (managers.findIndex((manager) => compareAddresses(manager, req.entityAddress)) >= 0) {
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

module.exports = { isTheCreator, isAManager };
