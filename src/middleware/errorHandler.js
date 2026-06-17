const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Error manual yang kita buat (400, 401, dll)
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Error Prisma
  if (err.code === "P2002") {
    return res.status(409).json({ message: "Data sudah ada (unique constraint)." });
  }
  if (err.code === "P2003") {
    return res.status(400).json({ message: "Foreign key tidak valid." });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Data tidak ditemukan." });
  }

  // Fallback ke 500
  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;