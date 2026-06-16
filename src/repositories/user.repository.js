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

module.exports = {
  findById,
  findByEmail,
  create,
};