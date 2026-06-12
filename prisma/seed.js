const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Categories
  const work = await prisma.category.create({
    data: {
      name: "Work",
      color: "#EF4444",
    },
  });

  const study = await prisma.category.create({
    data: {
      name: "Study",
      color: "#3B82F6",
    },
  });

  const personal = await prisma.category.create({
    data: {
      name: "Personal",
      color: "#10B981",
    },
  });

  // Users
  const user1 = await prisma.user.create({
    data: {
      name: "Nung",
      email: "nung@example.com",
      password: "password123",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Budi",
      email: "budi@example.com",
      password: "password123",
    },
  });

  // Tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Belajar Prisma",
        description: "Mempelajari ORM Prisma",
        status: "TODO",
        priority: "HIGH",
        userId: user1.id,
        categoryId: study.id,
      },
      {
        title: "Kerjakan Tugas WAD",
        description: "Repository Pattern",
        status: "IN_PROGRESS",
        priority: "HIGH",
        userId: user1.id,
        categoryId: study.id,
      },
      {
        title: "Meeting Project",
        description: "Diskusi progress",
        status: "DONE",
        priority: "MEDIUM",
        userId: user1.id,
        categoryId: work.id,
      },
      {
        title: "Belanja Bulanan",
        description: "Ke supermarket",
        status: "TODO",
        priority: "LOW",
        userId: user2.id,
        categoryId: personal.id,
      },
      {
        title: "Olahraga",
        description: "Jogging 30 menit",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        userId: user2.id,
        categoryId: personal.id,
      },
      {
        title: "Review Kode",
        description: "Review pull request",
        status: "DONE",
        priority: "HIGH",
        userId: user2.id,
        categoryId: work.id,
      },
    ],
  });

  console.log("✅ Seed berhasil dijalankan");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });