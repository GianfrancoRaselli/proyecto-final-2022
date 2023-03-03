const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");

const { create, update, uploadImage, removeImage, get, getAmount } = require("../controllers/entityController");

router.post("/", authenticate, create);
router.put("/", authenticate, update);
router.put("/uploadImage", authenticate, uploadImage);
router.delete("/removeImage", authenticate, removeImage);
router.get("/amount", getAmount);
router.get("/:address", get);

module.exports = router;
