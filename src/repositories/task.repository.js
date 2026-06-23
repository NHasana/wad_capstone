const prisma = require("../config/prisma");

const findMany = async ({ userId, status, priority, sort, order, limit, offset } = {}) => {
  const where = {};
  if (userId) where.userId = Number(userId);
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const tasks = await prisma.task.findMany({
    where,
    include: {
      user: true,
      category: true,
    },
    orderBy: sort ? { [sort]: order || 'asc' } : { createdAt: 'desc' },
    take: limit ? Number(limit) : 10,
    skip: offset ? Number(offset) : 0,
  });

  const total = await prisma.task.count({ where });

  return { data: tasks, total };
};

const findById = async (id) => {
  return prisma.task.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
      category: true,
    },
  });
};

const create = async (data) => {
  return prisma.task.create({
    data,
  });
};

const update = async (id, data) => {
  return prisma.task.update({
    where: {
      id: Number(id),
    },
    data,
  });
};

const remove = async (id) => {
  return prisma.task.delete({
    where: {
      id: Number(id),
    },
  });
};

const findByUser = async (userId) => {
  return prisma.task.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      user: true,
      category: true,
    },
  });
};

module.exports = {
  findMany,
  findById,
  create,
  update,
  remove,
  findByUser,
};