const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const express = require("express");
const routes = require("./routes");
const config = require("./config");
const tasksRoutes = require("./routes/tasks.routes");

const app = express();

app.use(express.json());

// route lama
app.use("/", routes);

// route tasks
app.use("/api/v1/tasks", tasksRoutes);

// swagger docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// 500 handler
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});