const repo = require("../repositories/notification.repository");

const getAll = async (req, res, next) => {
  try {
    const data = await repo.findByUser(req.user.userId);
    res.status(200).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await repo.countUnread(req.user.userId);
    res.status(200).json({ status: "success", data: { count } });
  } catch (err) {
    next(err);
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

const markAllAsRead = async (req, res, next) => {
  try {
    await repo.markAllRead(req.user.userId);
    res.status(200).json({ status: "success", message: "Semua notifikasi ditandai sudah dibaca" });
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
  getUnreadCount,
  getById,
  create,
  update,
  markAllAsRead,
  remove,
};
