const taskRepository = require("../repositories/task.repository");

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
    console.log("==================================");
    console.log("🚀 CREATE TASK");
    console.log("USER :", req.user);
    console.log("BODY :", req.body);

    const task = await taskRepository.create({
      ...req.body,
      userId: req.user.userId,
    });

    console.log("✅ TASK BERHASIL DIBUAT");
    console.log(task);

    const io = req.app.get("io");

    if (io) {
      io.to("tasks:global").emit("task:created", {
        task,
      });

      io.to(`user:${req.user.userId}`).emit(
        "notification",
        {
          type: "SUCCESS",
          title: "Task Berhasil Dibuat",
          message: `Task "${task.title}" berhasil dibuat.`,
        }
      );
    }

    res
      .location(`/api/v1/tasks/${task.id}`)
      .status(201)
      .json({
        data: task,
      });
  } catch (error) {
    console.log("❌ CREATE TASK ERROR");
    console.error(error);
    next(error);
  }
};

const replaceTask = async (req, res, next) => {
  try {
    console.log("==================================");
    console.log("🔄 REPLACE TASK");
    console.log("ID :", req.params.id);
    console.log("USER :", req.user);
    console.log("BODY :", req.body);

    const task = await taskRepository.update(
      req.params.id,
      req.body
    );

    console.log("✅ TASK BERHASIL DIREPLACE");
    console.log(task);

    const io = req.app.get("io");

    if (io) {
      io.to("tasks:global").emit("task:updated", {
        task,
      });
    }

    res.json({
      data: task,
    });
  } catch (error) {
    console.log("❌ REPLACE TASK ERROR");
    console.error(error);
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    console.log("==================================");
    console.log("✏ UPDATE TASK");
    console.log("ID :", req.params.id);
    console.log("USER :", req.user);
    console.log("BODY :", req.body);

    const task = await taskRepository.update(
      req.params.id,
      req.body
    );

    console.log("✅ TASK BERHASIL DIUPDATE");
    console.log(task);

    const io = req.app.get("io");

    if (io) {
      io.to("tasks:global").emit("task:updated", {
        task,
      });
    }

    res.json({
      data: task,
    });
  } catch (error) {
    console.log("❌ UPDATE TASK ERROR");
    console.error(error);
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    console.log("==================================");
    console.log("🗑 DELETE TASK");
    console.log("ID :", req.params.id);

    await taskRepository.remove(req.params.id);

    console.log("✅ TASK BERHASIL DIHAPUS");

    const io = req.app.get("io");

    if (io) {
      io.to("tasks:global").emit("task:deleted", {
        taskId: Number(req.params.id),
      });
    }

    res.status(204).send();
  } catch (error) {
    console.log("❌ DELETE TASK ERROR");
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