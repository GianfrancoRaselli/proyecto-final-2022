const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { fundAddress, updateFund } = require("../middlewares/permissions");

const { create, update, get } = require("../controllers/fundController");

router.post("/", authenticate, fundAddress, create);
router.put("/:address", authenticate, fundAddress, updateFund, update);
router.get("/:address", get);

module.exports = router;
