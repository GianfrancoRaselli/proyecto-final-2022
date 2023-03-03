const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { createFund, updateFund } = require("../middlewares/permissions");

const { create, update, uploadImage, removeImage, get } = require("../controllers/fundController");

router.post("/", authenticate, createFund, create);
router.put("/:address", authenticate, updateFund, update);
router.put("/uploadImage/:address", authenticate, updateFund, uploadImage);
router.delete("/removeImage/:address", authenticate, updateFund, removeImage);
router.get("/:address", get);

module.exports = router;
