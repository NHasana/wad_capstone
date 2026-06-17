const repo = require("../repositories/notification.repository");

const getAll = async (req, res, next) => {
  try {
    const data = await repo.findAll();
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err); // Diteruskan ke errorHandler Prisma kamu
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await repo.findById(Number(req.params.id));
    if (!data) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Data notifikasi tidak ditemukan",
          details: "ID yang diminta tidak ada di database"
        }
      });
    }
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await repo.create(req.body);
    res.status(201).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    // Cek dulu apakah datanya eksis sebelum di-update
    const check = await repo.findById(Number(req.params.id));
    if (!check) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Gagal memperbarui data",
          details: "Data tidak ditemukan"
        }
      });
    }

    const data = await repo.update(Number(req.params.id), req.body);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const check = await repo.findById(Number(req.params.id));
    if (!check) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Gagal menghapus data",
          details: "Data memang sudah tidak ada"
        }
      });
    }

    await repo.remove(Number(req.params.id));
    res.status(200).json({ 
      status: "success", 
      message: "Notifikasi berhasil dihapus" 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};