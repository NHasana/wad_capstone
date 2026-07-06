const express = require("express");
const router = express.Router();

const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const taskRoutes = require("./tasks.routes");
const notificationRoutes = require("./notification.routes");

// public
router.use("/", healthRoutes);

// auth — pakai /auth bukan /api/v1/auth
router.use("/auth", authRoutes);

// tasks
router.use("/api/v1/tasks", taskRoutes);

// notifications
router.use("/api/v1/notifications", notificationRoutes);

module.exports = router;