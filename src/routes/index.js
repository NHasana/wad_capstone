const express = require("express");
const router = express.Router();

const healthRoutes = require("./health.routes");
const taskRoutes = require("./tasks.routes");
const notificationRoutes = require("./notification.routes");

// public
router.use("/", healthRoutes);

// tasks
router.use("/api/v1/tasks", taskRoutes);

// notifications (UTS)
router.use("/api/v1/notifications", notificationRoutes);

module.exports = router;