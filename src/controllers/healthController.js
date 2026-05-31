const config = require("../config");

const getHealth = (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

const getInfo = (req, res) => {
  res.status(200).json({
    name: config.appName,
    version: config.appVersion,
    environment: config.nodeEnv,
  });
};

const echoMessage = (req, res) => {
  let msg = req.params.msg;
  const upper = req.query.upper === "true";

  if (upper) {
    msg = msg.toUpperCase();
  }

  res.status(200).json({
    message: msg,
  });
};

module.exports = {
  getHealth,
  getInfo,
  echoMessage,
};