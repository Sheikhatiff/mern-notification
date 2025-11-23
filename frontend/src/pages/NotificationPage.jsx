import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";
import Loader from "../components/Loader";
import { notificationAPI, handleApiError } from "../utils/api";
import {
  useNewNotification,
  useNotificationUpdated,
  useNotificationDeleted,
} from "../utils/useSocket";
import { CheckCheck, Trash2, Filter } from "lucide-react";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [deletingRead, setDeletingRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await notificationAPI.getAll();
      setNotifications(response.data.data?.notifications || []);
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true);
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error("Error marking all as read:", err);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleDeleteReadNotifications = async () => {
    try {
      setDeletingRead(true);
      await notificationAPI.deleteReadNotifications();
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error("Error deleting read notifications:", err);
    } finally {
      setDeletingRead(false);
    }
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  // Real-time socket listeners for notifications
  useNewNotification((data) => {
    console.log("New notification received:", data);
    const notification = data?.data?.notification || data?.notification;
    if (notification && Array.isArray(notification) === false) {
      setNotifications((prev) => {
        if (!Array.isArray(prev)) return [notification];
        return [notification, ...prev];
      });
    }
  });

  useNotificationUpdated((data) => {
    console.log("Notification updated:", data);
    const notification = data?.data?.notification || data?.notification;
    if (notification) {
      setNotifications((prev) => {
        if (!Array.isArray(prev)) return [notification];
        return prev.map((n) => (n._id === notification._id ? notification : n));
      });
    }
  });

  useNotificationDeleted((data) => {
    console.log("Notification deleted:", data);
    const notificationId = data?.data?.notificationId || data?.notificationId;
    if (notificationId) {
      setNotifications((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.filter((n) => n._id !== notificationId);
      });
    }
  });

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true; // all
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  return (
    <div className="h-full flex flex-col m-2 sm:m-4">
      {/* Header with stats and actions */}
      <div className="bg-stone-900 rounded-2xl p-4 sm:p-6 mb-4 border border-stone-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Notifications
            </h2>
            <p className="text-stone-400 text-sm">
              <span className="text-amber-400 font-semibold">
                {unreadCount}
              </span>{" "}
              unread •{" "}
              <span className="text-green-400 font-semibold">{readCount}</span>{" "}
              read
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAllRead}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600/40 border border-amber-600/30 hover:border-amber-500 transition-all duration-200 font-medium text-sm ${
                  markingAllRead ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CheckCheck size={16} />
                Mark All Read
              </button>
            )}
            {readCount > 0 && (
              <button
                onClick={handleDeleteReadNotifications}
                disabled={deletingRead}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/40 border border-red-600/30 hover:border-red-500 transition-all duration-200 font-medium text-sm ${
                  deletingRead ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Trash2 size={16} />
                Clear Read
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {[
            { label: "All", value: "all", count: notifications.length },
            { label: "Unread", value: "unread", count: unreadCount },
            { label: "Read", value: "read", count: readCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                filter === tab.value
                  ? "bg-blue-600/40 text-blue-300 border border-blue-500"
                  : "bg-stone-800/50 text-stone-400 hover:bg-stone-800 border border-stone-700"
              }`}
            >
              {tab.label}
              <span className="text-xs bg-stone-700 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-4 text-sm border border-red-800 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Notifications list */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <Loader />
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-400">
            <Filter size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">
              {notifications.length === 0
                ? "No notifications yet"
                : `No ${filter} notifications`}
            </p>
            <p className="text-sm mt-2 opacity-75">
              {notifications.length === 0
                ? "Create an entry to get started!"
                : "Try a different filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {filteredNotifications.map((notification, i) => (
              <Notification
                key={notification._id || i}
                val={notification}
                onDelete={() => handleDeleteNotification(notification._id)}
                onMarkRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
