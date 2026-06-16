const prisma = require("../config/prisma");

const create = async (data) => {
  return prisma.refreshToken.create({
    data,
  });
};

const findByToken = async (token) => {
  return prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
};

const findValid = async (token) => {
  return prisma.refreshToken.findFirst({
    where: {
      token,
      isRevoked: false,
    },
    include: {
      user: true,
    },
  });
};

const revoke = async (id) => {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      isRevoked: true,
    },
  });
};

const revokeAllByUser = async (userId) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      isRevoked: true,
    },
  });
};

module.exports = {
  create,
  findByToken,
  findValid,
  revoke,
  revokeAllByUser,
};