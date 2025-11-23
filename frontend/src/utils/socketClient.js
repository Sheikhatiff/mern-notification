import { io } from "socket.io-client";

const SOCKET_URL = `${
  import.meta.env.VITE_NODE_ENV === "development"
    ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`
    : import.meta.env.VITE_CLIENT_URL
}`;
let socket = null;

/**
 * Initialize Socket.IO connection
 */
export const initializeSocket = () => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("✅ Connected to server via Socket.IO");
    console.log("Socket ID:", socket.id);
    console.log("Rooms:", socket.rooms);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
    console.error("Error message:", error.message);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });

  return socket;
};

/**
 * Get the socket instance
 */
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Listen for new entries
 */
export const onNewEntry = (callback) => {
  const sock = getSocket();
  sock.on("entry:created", callback);
  return () => sock.off("entry:created", callback);
};

/**
 * Listen for entry updates
 */
export const onEntryUpdated = (callback) => {
  const sock = getSocket();
  sock.on("entry:updated", callback);
  return () => sock.off("entry:updated", callback);
};

/**
 * Listen for entry deletions
 */
export const onEntryDeleted = (callback) => {
  const sock = getSocket();
  sock.on("entry:deleted", callback);
  return () => sock.off("entry:deleted", callback);
};

/**
 * Listen for new notifications
 */
export const onNewNotification = (callback) => {
  const sock = getSocket();
  sock.on("notification:created", callback);
  return () => sock.off("notification:created", callback);
};

/**
 * Listen for notification updates
 */
export const onNotificationUpdated = (callback) => {
  const sock = getSocket();
  sock.on("notification:updated", callback);
  return () => sock.off("notification:updated", callback);
};

/**
 * Listen for notification deletions
 */
export const onNotificationDeleted = (callback) => {
  const sock = getSocket();
  sock.on("notification:deleted", callback);
  return () => sock.off("notification:deleted", callback);
};

/**
 * Listen for all notifications marked as read
 */
export const onAllNotificationsRead = (callback) => {
  const sock = getSocket();
  sock.on("notifications:all-read", callback);
  return () => sock.off("notifications:all-read", callback);
};

/**
 * Listen for read notifications deletion
 */
export const onReadNotificationsDeleted = (callback) => {
  const sock = getSocket();
  sock.on("notifications:read-deleted", callback);
  return () => sock.off("notifications:read-deleted", callback);
};

/**
 * Listen for statistics updates
 */
export const onStatsUpdated = (callback) => {
  const sock = getSocket();
  sock.on("stats:updated", callback);
  return () => sock.off("stats:updated", callback);
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
