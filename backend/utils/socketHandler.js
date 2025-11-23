// Socket.IO event handlers for real-time notifications
export const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Client automatically joins broadcast room
    socket.join("broadcast");

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

// Emit new entry to all connected clients
export const emitNewEntry = (io, entry, notification) => {
  io.to("broadcast").emit("entry:created", {
    status: "success",
    data: {
      entry,
      notification,
    },
  });
};

// Emit updated entry to all connected clients
export const emitEntryUpdated = (io, entry, notification) => {
  io.to("broadcast").emit("entry:updated", {
    status: "success",
    data: {
      entry,
      notification,
    },
  });
};

// Emit deleted entry to all connected clients
export const emitEntryDeleted = (io, entryId) => {
  io.to("broadcast").emit("entry:deleted", {
    status: "success",
    data: {
      entryId,
    },
  });
};

// Emit new notification
export const emitNewNotification = (io, notification) => {
  io.to("broadcast").emit("notification:created", {
    status: "success",
    data: {
      notification,
    },
  });
};

// Emit notification status changed
export const emitNotificationStatusChanged = (io, notification) => {
  io.to("broadcast").emit("notification:updated", {
    status: "success",
    data: {
      notification,
    },
  });
};

// Emit notification deleted
export const emitNotificationDeleted = (io, notificationId) => {
  io.to("broadcast").emit("notification:deleted", {
    status: "success",
    data: {
      notificationId,
    },
  });
};

// Emit statistics update
export const emitStatsUpdate = (io, stats) => {
  io.to("broadcast").emit("stats:updated", {
    status: "success",
    data: stats,
  });
};
