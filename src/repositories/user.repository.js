const prisma = require("../config/prisma");

const findById = async (id) => {
  return prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
};

const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const create = async (data) => {
  return prisma.user.create({
    data,
  });
};

const findAll = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

module.exports = {
  findById,
  findByEmail,
  create,
  findAll,
};