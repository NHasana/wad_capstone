const express = require("express");
const swaggerUi = require("swagger-ui-express");

const routes = require("./routes");
const config = require("./config");
const authRoutes = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes");
const swaggerSpec = require("./docs/swagger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

// route lama
app.use("/", routes);

// route auth
app.use("/auth", authRoutes);

// route tasks
app.use("/api/v1/tasks", tasksRoutes);

// swagger docs
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// error handler Prisma
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(config.port, () => {
  console.log(
    `Server running on port ${config.port}`
  );
});