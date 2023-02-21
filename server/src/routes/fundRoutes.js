const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { createFund, updateFund } = require("../middlewares/permissions");

const { create, update, uploadImage, get } = require("../controllers/fundController");

router.post("/", authenticate, createFund, create);
router.put("/:address", authenticate, updateFund, update);
router.put("/:address", authenticate, updateFund, uploadImage);
router.get("/:address", get);

module.exports = router;
