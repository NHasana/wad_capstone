const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WAD Capstone API",
      version: "1.0.0",
      description: "Dokumentasi API untuk tugas praktikum WAD",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1", // Ini base url api kamu
        description: "Development server",
      },
    ],
  },
  // Pastikan path ke rute ini sudah benar mendeteksi semua file .js di dalam folder routes
  apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;