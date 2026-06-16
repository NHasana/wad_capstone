let tasks = [
  {
    id: 1,
    title: "Belajar Express",
    status: "todo",
    priority: "high",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 2;

const store = {
  findAll() {
    return tasks;
  },

  findById(id) {
    return tasks.find((t) => t.id === Number(id));
  },

  create(payload) {
    const now = new Date().toISOString();

    const task = {
      id: nextId++,
      ...payload,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(task);

    return task;
  },

  update(id, payload) {
    const index = tasks.findIndex((t) => t.id === Number(id));

    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return tasks[index];
  },

replace(id, payload) {
  const index = tasks.findIndex((t) => t.id === Number(id));

  if (index === -1) return null;

  tasks[index] = {
    id: Number(id),
    ...payload,
    createdAt: tasks[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  return tasks[index];
},


  remove(id) {
    const index = tasks.findIndex((t) => t.id === Number(id));

    if (index === -1) return false;

    tasks.splice(index, 1);

    return true;
  },
};

module.exports = store;