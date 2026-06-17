const authenticate = require("../middleware/authenticate");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
router.use(authenticate);

const controller = require("../controllers/tasks.controller");

const validate = require("../middleware/validate.middleware");

const {
  createTaskSchema,
  replaceTaskSchema,
  updateTaskSchema,
  listTasksSchema,
} = require("../validators/task.validator");

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Ambil semua task dengan pagination, filtering, dan sorting
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar task
 */
router.get(
  "/",
  validate(listTasksSchema, "query"),
  controller.getTasks
);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Ambil detail task berdasarkan ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task berhasil ditemukan
 *       404:
 *         description: Task tidak ditemukan
 */


router.get(
  "/:id",
  controller.getTaskById
);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Tambah task baru
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task berhasil dibuat
 */
router.post(
  "/",
  validate(createTaskSchema, "body"),
  controller.createTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Perbarui task sepenuhnya (Replace)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task berhasil diperbarui
 *       404:
 *         description: Task tidak ditemukan
 */
router.put(
  "/:id",
  validate(replaceTaskSchema, "body"),
  controller.replaceTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Perbarui sebagian data task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sebagian data task diperbarui
 *       404:
 *         description: Task tidak ditemukan
 */
router.patch(
  "/:id",
  validate(updateTaskSchema, "body"),
  controller.updateTask
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Hapus task berdasarkan ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task berhasil dihapus
 *       404:
 *         description: Task tidak ditemukan
 */
router.delete("/:id", controller.deleteTask);

module.exports = router;