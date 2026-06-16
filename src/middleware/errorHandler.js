const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({
      message: "Data sudah ada (unique constraint).",
    });
  }

  if (err.code === "P2003") {
    return res.status(400).json({
      message: "Foreign key tidak valid.",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      message: "Data tidak ditemukan.",
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;