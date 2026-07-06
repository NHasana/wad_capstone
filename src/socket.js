const jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = function setupSocket(io) {
  console.log("✅ Socket.IO initialized");

  io.use((socket, next) => {
    try {
      console.log("==================================");
      console.log("Socket auth:", socket.handshake.auth);

      const token = socket.handshake.auth?.token;

      if (!token) {
        console.log("❌ Token tidak dikirim");
        return next(new Error("Token tidak disertakan"));
      }

const payload = jwt.verify(token, config.jwt.accessSecret);
      console.log("✅ JWT VALID");
      console.log(payload);

      socket.data.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (err) {
      console.log("❌ JWT ERROR");
      console.log(err.message);
      next(new Error(err.message));
    }
  });

  io.on("connection", (socket) => {
    const { userId, email } = socket.data.user;

    console.log(`🟢 CONNECTED ${email} (${userId})`);

    socket.join(`user:${userId}`);
    socket.join("tasks:global");

    io.emit("users:online", {
      count: io.sockets.sockets.size,
    });

    socket.on("disconnect", (reason) => {
      console.log(`🔴 DISCONNECT ${email}`);
      console.log(reason);

      io.emit("users:online", {
        count: io.sockets.sockets.size,
      });
    });
  });
};