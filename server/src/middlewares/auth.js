const Web3 = require("web3");

const message =
  "Firme este mensaje para validar que tiene acceso a esta billetera para iniciar sesión.\n\nEsto no le costará ningún Ether.";

const authenticate = async (req, res, next) => {
  if (req.headers.authorization) {
    const signature = req.headers.authorization.split(" ")[1];
    if (signature) {
      try {
        req.entityAddress = await new Web3().eth.accounts.recover(message, signature);
        return next();
      } catch (e) {
        console.log(e);
        return res.status(401).send({
          message: "unauthenticated",
        });
      }
    }
  }
  return res.status(401).send({
    message: "unauthenticated",
  });
};

module.exports = { authenticate };
