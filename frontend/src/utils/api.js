import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ENVIRONMENT = import.meta.env.VITE_NODE_ENV;

const api = axios.create({
  baseURL: `${
    ENVIRONMENT === "development"
      ? `${API_URL}/api/v1`
      : import.meta.env.VITE_CLIENT_URL
  }`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Entry API endpoints
export const entryAPI = {
  getAll: () => api.get("/entries"),
  getById: (id) => api.get(`/entries/${id}`),
  create: (data) => api.post("/entries", data),
  update: (id, data) => api.patch(`/entries/${id}`, data),
  delete: (id) => api.delete(`/entries/${id}`),
  getStats: () => api.get("/entries/stats"),
};

// Notification API endpoints
export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  getUnread: () => api.get("/notifications/unread"),
  getByType: (type) => api.get(`/notifications/filter?type=${type}`),
  getById: (id) => api.get(`/notifications/${id}`),
  create: (data) => api.post("/notifications", data),
  update: (id, data) => api.patch(`/notifications/${id}`, data),
  delete: (id) => api.delete(`/notifications/${id}`),
  markAsRead: (id) => api.patch(`/notifications/${id}`, { isRead: true }),
  markAllAsRead: () => api.patch("/notifications/mark-all-read"),
  deleteReadNotifications: () => api.delete("/notifications/delete-read"),
  getStats: () => api.get("/notifications/stats"),
};

// Error handler utility
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || error.response.statusText;
  } else if (error.request) {
    return "No response from server. Check your connection.";
  } else {
    return error.message || "An error occurred";
  }
};

export default api;
