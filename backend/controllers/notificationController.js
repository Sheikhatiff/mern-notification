import Notification from "../models/notification.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {
  emitNewNotification,
  emitNotificationStatusChanged,
  emitNotificationDeleted,
  emitStatsUpdate,
} from "../utils/socketHandler.js";

// Get all notifications
export const getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find()
    .populate("entryId", "title text")
    .sort({ createdAt: -1 });

  if (!notifications) {
    return next(new AppError("Failed to retrieve notifications", 500));
  }

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

// Get unread notifications
export const getUnreadNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ isRead: false })
    .populate("entryId", "title text")
    .sort({ createdAt: -1 });

  if (!notifications) {
    return next(new AppError("Failed to retrieve unread notifications", 500));
  }

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

// Get notifications by emotion/type
export const getNotificationsByType = catchAsync(async (req, res, next) => {
  const { emotion, type } = req.query;

  if (!emotion && !type) {
    return next(
      new AppError("Please provide emotion or type query parameter", 400)
    );
  }

  let filter = {};
  if (emotion) filter.emotion = emotion;
  if (type) filter.type = type;

  const notifications = await Notification.find(filter)
    .populate("entryId", "title text")
    .sort({ createdAt: -1 });

  if (!notifications) {
    return next(new AppError("Failed to retrieve filtered notifications", 500));
  }

  res.status(200).json({
    status: "success",
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

// Get single notification
export const getNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id).populate(
    "entryId"
  );

  if (!notification) {
    return next(new AppError("No notification found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  });
});

// Mark notification as read
export const markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!notification) {
    return next(new AppError("No notification found with that ID", 404));
  }

  // Emit real-time status update to all connected clients
  if (global.io) {
    emitNotificationStatusChanged(global.io, notification);
  }

  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  });
});

// Mark all notifications as read
export const markAllAsRead = catchAsync(async (req, res, next) => {
  const result = await Notification.updateMany(
    { isRead: false },
    { isRead: true },
    { new: true }
  );

  if (!result) {
    return next(new AppError("Failed to mark notifications as read", 500));
  }

  // Emit real-time status update to all connected clients
  if (global.io) {
    global.io.to("broadcast").emit("notifications:all-read", {
      status: "success",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      modifiedCount: result.modifiedCount,
    },
  });
});

// Delete notification
export const deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return next(new AppError("No notification found with that ID", 404));
  }

  // Emit real-time deletion to all connected clients
  if (global.io) {
    emitNotificationDeleted(global.io, notification._id);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Delete all read notifications
export const deleteReadNotifications = catchAsync(async (req, res, next) => {
  const result = await Notification.deleteMany({ isRead: true });

  if (!result) {
    return next(new AppError("Failed to delete read notifications", 500));
  }

  // Emit real-time update to all connected clients
  if (global.io) {
    global.io.to("broadcast").emit("notifications:read-deleted", {
      status: "success",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      deletedCount: result.deletedCount,
    },
  });
});

// Get notification statistics
export const getNotificationStats = catchAsync(async (req, res, next) => {
  const stats = await Notification.aggregate([
    {
      $group: {
        _id: null,
        totalNotifications: { $sum: 1 },
        unreadCount: {
          $sum: { $cond: ["$isRead", 0, 1] },
        },
      },
    },
  ]);

  const emotionBreakdown = await Notification.aggregate([
    {
      $match: { type: "sentiment" },
    },
    {
      $group: {
        _id: "$emotion",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  if (!stats || !emotionBreakdown) {
    return next(
      new AppError("Failed to retrieve notification statistics", 500)
    );
  }

  const statsData = {
    stats: stats[0] || { totalNotifications: 0, unreadCount: 0 },
    emotionBreakdown,
  };

  // Emit stats update to all connected clients
  if (global.io) {
    emitStatsUpdate(global.io, statsData);
  }

  res.status(200).json({
    status: "success",
    data: statsData,
  });
});
