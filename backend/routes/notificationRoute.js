import express from "express";
import {
  getAllNotifications,
  getUnreadNotifications,
  getNotificationsByType,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getNotificationStats,
} from "../controllers/notificationController.js";

const router = express.Router();

// Statistics
router.get("/stats", getNotificationStats);

// Bulk operations
router.get("/unread", getUnreadNotifications);
router.get("/filter", getNotificationsByType);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/delete-read", deleteReadNotifications);

// Individual operations
router.route("/").get(getAllNotifications);

router
  .route("/:id")
  .get(getNotification)
  .patch(markAsRead)
  .delete(deleteNotification);

export default router;
