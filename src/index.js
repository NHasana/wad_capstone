const express = require("express");
const routes = require("./routes");
const config = require("./config");

const app = express();

app.use(express.json());

// pakai semua routes
app.use("/", routes);

// 404 handler (kalau route tidak ada)
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// 500 handler (kalau server error)
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});