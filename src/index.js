require("dotenv").config();

const express = require("express");
const http = require("http"); // ← TAMBAH
const { Server } = require("socket.io"); // ← TAMBAH

const helmet = require("helmet");
const cors = require("cors");

const corsOptions = require("./config/cors");
const {
  apiLimiter,
  authLimiter,
  sensitiveLimiter,
} = require("./config/rateLimiter");

const routes = require("./routes");
const config = require("./config");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const authRoutes = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");

const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app); // ← TAMBAH

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: config.allowedOrigins || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// supaya bisa dipanggil dari controller
app.set("io", io);

// load socket handler
require("./socket")(io);

// =============================================

// ─── 1. Security Headers (Helmet) ──────────────────────
app.use(helmet());

// ─── 2. CORS ───────────────────────────────────────────
app.use(cors(corsOptions));

// ─── 3. Body Parser ────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── 4. Rate Limiting Global ───────────────────────────
app.use("/api/", apiLimiter);

// ─── 5. Request Logger ─────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});

// ─── 6. Routes ─────────────────────────────────────────
app.use("/", routes);

// Auth rate limiting
app.use("/auth/login", authLimiter);
app.use("/auth/refresh", sensitiveLimiter);

// API routes
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);

// ─── 7. Swagger ────────────────────────────────────────
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ─── 8. Error Handler ──────────────────────────────────
app.use(errorHandler);

// ─── 9. 404 Handler ────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} tidak ditemukan.`,
    },
  });
});

// ================= START SERVER =================
server.listen(config.port, () => {
  console.log("─".repeat(55));
  console.log(` ${config.appName} v${config.version}`);
  console.log(` Environment : ${config.nodeEnv}`);
  console.log(` Server      : http://localhost:${config.port}`);
  console.log(` Docs        : http://localhost:${config.port}/api-docs`);
  console.log(` Socket.IO   : Aktif ✅`);
  console.log(` Security    : Helmet ✓ CORS ✓ Rate Limit ✓`);
  console.log("─".repeat(55));
});