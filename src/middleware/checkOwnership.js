const taskRepo = require('../repositories/task.repository');

const checkTaskOwnership = async (req, res, next) => {
  try {
    if (req.user.role === 'ADMIN') return next();

    const task = await taskRepo.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Task tidak ditemukan.' },
      });
    }

    if (task.userId !== req.user.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Kamu tidak memiliki izin untuk mengakses task ini.',
        },
      });
    }

    req.task = task;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { checkTaskOwnership };