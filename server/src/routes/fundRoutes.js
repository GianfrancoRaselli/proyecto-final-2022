const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { isTheCreator, isAManager } = require("../middlewares/permissions");

const { create, update, uploadImage, removeImage, get } = require("../controllers/fundController");

router.post("/", authenticate, isTheCreator, create);
router.put("/:address", authenticate, isAManager, update);
router.put("/uploadImage/:address", authenticate, isAManager, uploadImage);
router.delete("/removeImage/:address", authenticate, isAManager, removeImage);
router.get("/:address", get);

module.exports = router;
