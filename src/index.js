require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const config = require("./config");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const authRoutes = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes");
const notificationRoutes = require("./routes/notification.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://103.93.163.136", credentials: true }));

// Routes
app.use("/", routes);
app.use("/auth", authRoutes);
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});