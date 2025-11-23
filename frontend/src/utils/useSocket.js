import { useEffect } from "react";
import {
  onNewEntry,
  onEntryUpdated,
  onEntryDeleted,
  onNewNotification,
  onNotificationUpdated,
  onNotificationDeleted,
  onAllNotificationsRead,
  onReadNotificationsDeleted,
  onStatsUpdated,
} from "./socketClient";

/**
 * Custom hook to listen for new entry creation
 */
export const useNewEntry = (callback) => {
  useEffect(() => {
    const unsubscribe = onNewEntry(callback);
    return unsubscribe;
  }, [callback]);
};

/**
 * Custom hook to listen for entry updates
 */
export const useEntryUpdated = (callback) => {
  useEffect(() => {
    const unsubscribe = onEntryUpdated(callback);
    return unsubscribe;
  }, [callback]);
};

/**
 * Custom hook to listen for entry deletions
 */
export const useEntryDeleted = (callback) => {
  useEffect(() => {
    const unsubscribe = onEntryDeleted(callback);
    return unsubscribe;
  }, [callback]);
};

/**
 * Custom hook to listen for new notifications
 */
export const useNewNotification = (callback) => {
  useEffect(() => {
    const unsubscribe = onNewNotification(callback);
    return unsubscribe;
  }, [callback]);
};

/**
 * Custom hook to listen for notification updates
 */
export const useNotificationUpdated = (callback) => {
  useEffect(() => {
    const unsubscribe = onNotificationUpdated(callback);
    return unsubscribe;
  }, [callback]);
};

/**
 * Custom hook to listen for notification deletions
 */
export const useNotificationDeleted = (callback) => {
  useEffect(() => {
    const unsubscribe = onNotificationDeleted(callback);
    return unsubscribe;
  }, [callback]);
};

/**
 * Custom hook to listen for all notifications marked as read
 */
export const useAllNotificationsRead = (callback) => {
  useEffect(() => {
    const unsubscribe = onAllNotificationsRead(callback);
    return unsubscribe;
  }, [callback]);
};

/**
 * Custom hook to listen for read notifications deletion
 */
export const useReadNotificationsDeleted = (callback) => {
  useEffect(() => {
    const unsubscribe = onReadNotificationsDeleted(callback);
    return unsubscribe;
  }, [callback]);
};

/**
 * Custom hook to listen for statistics updates
 */
export const useStatsUpdated = (callback) => {
  useEffect(() => {
    const unsubscribe = onStatsUpdated(callback);
    return unsubscribe;
  }, [callback]);
};
