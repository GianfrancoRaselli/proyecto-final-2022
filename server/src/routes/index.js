const express = require("express");
const router = express.Router();

// routes
router.get("/", (req, res) => {
  return res.status(200).json({ message: "Server listening" });
});
router.use("/entity", require("./entityRoutes"));
router.use("/fund", require("./fundRoutes"));

module.exports = router;
