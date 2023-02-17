const express = require("express");
const router = express.Router();

const { authenticate } = require("./middlewares/auth");
const { updateFund } = require("./middlewares/permissions");

const { create, update, get } = require("../controllers/fundController");

router.post("/", authenticate, create);
router.put("/:address", authenticate, updateFund, update);
router.get("/:address", get);

module.exports = router;
