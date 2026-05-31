const express = require("express");
const router = express.Router();

const {
  getHealth,
  getInfo,
  echoMessage,
} = require("../controllers/healthController");

router.get("/health", getHealth);
router.get("/api/info", getInfo);
router.get("/api/echo/:msg", echoMessage);

router.get("/error", (req, res) => {
  throw new Error("Test error");
});

module.exports = router;