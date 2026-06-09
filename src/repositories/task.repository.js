const prisma = require("../config/prisma");

const findMany = async () => {
  return prisma.task.findMany({
    include: {
      user: true,
      category: true,
    },
  });
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