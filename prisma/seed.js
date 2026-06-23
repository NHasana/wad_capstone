const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
const prisma = new PrismaClient();

async function main() {
  console.log("Membersihkan data lama di database...");
  
  await prisma.notification.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log("Mulai memasukkan data seed baru...");

  // Hash password dulu
  const hashedPassword = await argon2.hash("password123");

  // 1. Seed Categories
  const work = await prisma.category.create({
    data: { name: "Work", color: "#EF4444" },
  });

  const study = await prisma.category.create({
    data: { name: "Study", color: "#3B82F6" },
  });

  const personal = await prisma.category.create({
    data: { name: "Personal", color: "#10B981" },
  });

  // 2. Seed Users
  const user1 = await prisma.user.create({
    data: {
      name: "Nung",
      email: "nung@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Budi",
      email: "budi@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // 3. Seed Tasks
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: "Belajar Prisma",
        status: "TODO",
        priority: "HIGH",
        userId: user1.id,
        categoryId: study.id,
      },
      {
        title: "Kerjakan WAD",
        status: "IN_PROGRESS",
        priority: "HIGH",
        userId: user1.id,
        categoryId: study.id,
      },
      {
        title: "Meeting",
        status: "DONE",
        priority: "MEDIUM",
        userId: user2.id,
        categoryId: work.id,
      },
      {
        title: "Belanja",
        status: "TODO",
        priority: "LOW",
        userId: user2.id,
        categoryId: personal.id,
      },
      {
        title: "Olahraga",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        userId: user1.id,
        categoryId: personal.id,
      },
      {
        title: "Review Hasil Code",
        status: "TODO",
        priority: "MEDIUM",
        userId: user2.id,
        categoryId: work.id,
      },
    ],
  });

  // 4. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        title: "Task dibuat",
        message: "Belajar Prisma berhasil dibuat",
        type: "SUCCESS",
        userId: user1.id,
      },
      {
        title: "Reminder",
        message: "Kerjakan WAD sekarang",
        type: "WARNING",
        userId: user1.id,
      },
      {
        title: "Info sistem",
        message: "Sistem berjalan normal",
        type: "INFO",
        userId: user2.id,
      },
      {
        title: "Task selesai",
        message: "Meeting selesai",
        type: "SUCCESS",
        userId: user2.id,
      },
      {
        title: "Deadline",
        message: "Olahraga belum selesai",
        type: "WARNING",
        userId: user1.id,
      },
    ],
  });

  console.log("SEED SUCCESS - Semua kriteria minimal data terpenuhi!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());