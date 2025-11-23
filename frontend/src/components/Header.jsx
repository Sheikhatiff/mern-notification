import React, { useState, useEffect } from "react";
import { Bell, BellRing } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notificationAPI, handleApiError } from "../utils/api";
import {
  useNewNotification,
  useNotificationUpdated,
  useNotificationDeleted,
} from "../utils/useSocket";

function Header() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
  }, []);
  async function fetchUnreadCount() {
    try {
      const response = await notificationAPI.getStats();
      const stats = response.data.data?.stats;
      if (stats) {
        setUnreadCount(stats.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error fetching unread count:", handleApiError(err));
    }
  }

  // Real-time socket listeners
  useNewNotification((data) => {
    const notification = data?.data?.notification || data?.notification;
    if (notification && !notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  });

  useNotificationUpdated((data) => {
    const notification = data?.data?.notification || data?.notification;
    if (notification && notification.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  });

  useNotificationDeleted(() => {
    fetchUnreadCount();
  });

  function handleBellClick() {
    navigate("/all-notifications");
  }

  return (
    <div className="bg-stone-900 text-xl sm:text-3xl text-stone-100 px-4 sm:px-6 py-4 flex justify-between items-center w-full mt-2">
      <span
        onClick={() => navigate("/")}
        className="font-semibold cursor-pointer hover:text-stone-300 transition-colors"
      >
        💌 | NOTIFICATIONS
      </span>
      <div className="relative cursor-pointer" onClick={handleBellClick}>
        {unreadCount > 0 ? (
          <BellRing
            size={30}
            className="shrink-0 hover:size-9 text-amber-200 hover:text-amber-400 transition-all duration-200"
          />
        ) : (
          <Bell
            size={30}
            className="shrink-0 hover:size-9 text-amber-200 hover:text-amber-400 transition-all duration-200"
          />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : "*"}
          </span>
        )}
      </div>
    </div>
  );
}

export default Header;
