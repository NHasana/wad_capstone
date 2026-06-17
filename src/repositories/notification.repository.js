const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async () => {
  return await prisma.notification.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      task: true
    }
  });
};

const findById = async (id) => {
  return await prisma.notification.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      task: true
    }
  });
};

const create = async (data) => {
  return await prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      type: data.type,
      userId: parseInt(data.userId),
      relatedTaskId: data.relatedTaskId ? parseInt(data.relatedTaskId) : null
    }
  });
};

const update = async (id, data) => {
  return await prisma.notification.update({
    where: { id: parseInt(id) },
    data: data
  });
};

const remove = async (id) => {
  return await prisma.notification.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};