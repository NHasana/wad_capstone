const taskRepository = require("../repositories/task.repository");

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, order, limit, offset } = req.query;

    // User biasa hanya lihat task miliknya; Admin lihat semua
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;

    const { data, total } = await taskRepository.findMany({
      userId, status, priority, sort, order, limit, offset
    });

    const numLimit = Number(limit) || 10;
    const numOffset = Number(offset) || 0;

    res.json({
      data,
      pagination: {
        total,
        limit: numLimit,
        offset: numOffset,
        hasNext: numOffset + numLimit < total,
        hasPrev: numOffset > 0,
        nextOffset: numOffset + numLimit < total ? numOffset + numLimit : null,
        prevOffset: numOffset > 0 ? Math.max(0, numOffset - numLimit) : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = req.task || await taskRepository.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    // Gunakan userId dari token — jangan percaya userId dari request body!
    const task = await taskRepository.create({
      ...req.body,
      userId: req.user.userId,
    });

    res
      .location(`/api/v1/tasks/${task.id}`)
      .status(201)
      .json({
        data: task,
      });
  } catch (error) {
    next(error);
  }
};

const replaceTask = async (req, res, next) => {
  try {
    const task = await taskRepository.update(
      req.params.id,
      req.body
    );

    res.json({
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskRepository.update(
      req.params.id,
      req.body
    );

    res.json({
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskRepository.remove(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getTasksByUser = async (req, res, next) => {
  try {
    const tasks = await taskRepository.findByUser(
      req.params.userId
    );

    res.json({
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
  getTasksByUser,
};