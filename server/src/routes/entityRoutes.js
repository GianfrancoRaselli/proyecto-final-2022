const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { updateEntity } = require("../middlewares/permissions");

const { create, update, get } = require("../controllers/entityController");

router.post("/", authenticate, create);
router.put("/:address", authenticate, updateEntity, update);
router.get("/:address", get);

module.exports = router;
