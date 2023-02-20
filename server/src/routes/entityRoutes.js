const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");

const { create, update, get } = require("../controllers/entityController");

router.post("/", authenticate, create);
router.put("/", authenticate, update);
router.get("/:address", get);

module.exports = router;
