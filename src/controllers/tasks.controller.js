const taskRepository = require("../repositories/task.repository");
const notificationRepository = require("../repositories/notification.repository");

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort, order, limit, offset } = req.query;

    const userId =
      req.user.role === "ADMIN"
        ? undefined
        : req.user.userId;

    const { data, total } = await taskRepository.findMany({
      userId,
      status,
      priority,
      sort,
      order,
      limit,
      offset,
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
        nextOffset:
          numOffset + numLimit < total
            ? numOffset + numLimit
            : null,
        prevOffset:
          numOffset > 0
            ? Math.max(0, numOffset - numLimit)
            : null,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task =
      req.task ||
      (await taskRepository.findById(req.params.id));

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      data: task,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskRepository.create({
      ...req.body,
      userId: req.user.userId,
    });

    const io = req.app.get("io");

    const notif = await notificationRepository.create({
      title: "Task Berhasil Dibuat",
      message: `Task "${task.title}" berhasil dibuat.`,
      type: "SUCCESS",
      userId: req.user.userId,
      relatedTaskId: task.id,
    });

    if (io) {
      io.to("tasks:global").emit("task:created", {
        task,
      });

      io.to(`user:${req.user.userId}`).emit(
        "notification",
        notif
      );
    }

    res
      .location(`/api/v1/tasks/${task.id}`)
      .status(201)
      .json({
        data: task,
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const replaceTask = async (req, res, next) => {
  try {
    const task = await taskRepository.update(
      req.params.id,
      req.body
    );

    const io = req.app.get("io");

    const notif = await notificationRepository.create({
      title: "Task Diperbarui",
      message: `Task "${task.title}" telah diperbarui.`,
      type: "INFO",
      userId: task.userId,
      relatedTaskId: task.id,
    });

    if (io) {
      io.to("tasks:global").emit("task:updated", {
        task,
      });

      io.to(`user:${task.userId}`).emit(
        "notification",
        notif
      );
    }

    res.json({
      data: task,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskRepository.update(
      req.params.id,
      req.body
    );

    const io = req.app.get("io");

    const notif = await notificationRepository.create({
      title: "Task Diperbarui",
      message: `Task "${task.title}" telah diperbarui.`,
      type: "INFO",
      userId: task.userId,
      relatedTaskId: task.id,
    });

    if (io) {
      io.to("tasks:global").emit("task:updated", {
        task,
      });

      io.to(`user:${task.userId}`).emit(
        "notification",
        notif
      );
    }

    res.json({
      data: task,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const existing = await taskRepository.findById(req.params.id);

    await taskRepository.remove(req.params.id);

    const io = req.app.get("io");

    if (existing) {
      const notif = await notificationRepository.create({
        title: "Task Dihapus",
        message: `Task "${existing.title}" telah dihapus.`,
        type: "WARNING",
        userId: existing.userId,
        relatedTaskId: null,
      });

      if (io) {
        io.to(`user:${existing.userId}`).emit(
          "notification",
          notif
        );
      }
    }

    if (io) {
      io.to("tasks:global").emit("task:deleted", {
        taskId: Number(req.params.id),
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
