const store = require("../data/tasks.store");

const getTasks = (req, res) => {
  const {
    status,
    limit = 10,
    offset = 0,
    sort = "id",
    order = "asc",
  } = req.query;

  let tasks = store.findAll();

  // filter status
  if (status) {
    tasks = tasks.filter(
      (task) => task.status === status
    );
  }

  // sorting
  tasks.sort((a, b) => {
    if (a[sort] < b[sort]) {
      return order === "asc" ? -1 : 1;
    }

    if (a[sort] > b[sort]) {
      return order === "asc" ? 1 : -1;
    }

    return 0;
  });

  // pagination
  const paginatedTasks = tasks.slice(
    Number(offset),
    Number(offset) + Number(limit)
  );

  res.json({
    data: paginatedTasks,
    pagination: {
      limit: Number(limit),
      offset: Number(offset),
      total: tasks.length,
    },
  });
};

const getTaskById = (req, res) => {
  const task = store.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json({
    data: task,
  });
};

const createTask = (req, res) => {
  const task = store.create(req.body);

  res
    .location(`/api/v1/tasks/${task.id}`)
    .status(201)
    .json({
      data: task,
    });
};

const replaceTask = (req, res) => {
  const task = store.replace(req.params.id, req.body);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json({
    data: task,
  });
};

const updateTask = (req, res) => {
  const task = store.update(req.params.id, req.body);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json({
    data: task,
  });
};

const deleteTask = (req, res) => {
  const deleted = store.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.status(204).send();
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
};