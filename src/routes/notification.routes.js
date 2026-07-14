const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validate.middleware");
const notificationValidator = require("../validators/notification.validator");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Ambil semua notification milik user yang login
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data notification
 */
router.get("/", authenticate, notificationController.getAll);

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Ambil jumlah notifikasi yang belum dibaca
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Berhasil mengambil jumlah unread
 */
router.get("/unread-count", authenticate, notificationController.getUnreadCount);

/**
 * @swagger
 * /notifications/mark-all-read:
 *   put:
 *     summary: Tandai semua notifikasi sebagai sudah dibaca
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Semua notifikasi ditandai sudah dibaca
 */
router.put("/mark-all-read", authenticate, notificationController.markAllAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Ambil notification berdasarkan ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification ditemukan
 *       404:
 *         description: Notification tidak ditemukan
 */
router.get("/:id", authenticate, notificationController.getById);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Buat notification baru
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *               userId:
 *                 type: integer
 *               relatedTaskId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Notification berhasil dibuat
 */
router.post(
  "/",
  authenticate,
  validate(notificationValidator.create),
  notificationController.create
);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Update notification
 *     tags: [Notifications]
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
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *               isRead:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification berhasil diperbarui
 */
router.put(
  "/:id",
  authenticate,
  validate(notificationValidator.update),
  notificationController.update
);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Hapus notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification berhasil dihapus
 */
router.delete(
  "/:id",
  authenticate,
  notificationController.remove
);

module.exports = router;
