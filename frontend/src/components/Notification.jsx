import { FileSymlink, Trash2, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatdate } from "../utils/formatDate";
import { notificationAPI, handleApiError } from "../utils/api";

// Emotion color mapping
const emotionColors = {
  joy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  amusement: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  excitement: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  love: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  admiration: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  caring: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  anger: "bg-red-500/20 text-red-300 border-red-500/30",
  annoyance: "bg-red-500/20 text-red-300 border-red-500/30",
  disapproval: "bg-red-500/20 text-red-300 border-red-500/30",
  sadness: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  grief: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  disappointment: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  fear: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  nervousness: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  surprise: "bg-green-500/20 text-green-300 border-green-500/30",
  confusion: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  realization: "bg-green-500/20 text-green-300 border-green-500/30",
  neutral: "bg-stone-500/20 text-stone-300 border-stone-500/30",
  others: "bg-stone-500/20 text-stone-300 border-stone-500/30",
};

function Notification({ val, onDelete, onMarkRead }) {
  const navigate = useNavigate();
  const [marking, setMarking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleMarkAsRead = async () => {
    try {
      setMarking(true);
      await notificationAPI.markAsRead(val._id);
      onMarkRead && onMarkRead(val._id);
    } catch (err) {
      console.error("Error marking as read:", handleApiError(err));
    } finally {
      setMarking(false);
    }
  };

  const handleViewReport = async () => {
    // Auto-mark as read when viewing report
    if (!val?.isRead) {
      await handleMarkAsRead();
    }
    // Navigate to report page
    navigate(`/all-notifications/report/${val?._id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await notificationAPI.delete(val._id);
      onDelete && onDelete();
    } catch (err) {
      console.error("Error deleting:", handleApiError(err));
    } finally {
      setDeleting(false);
    }
  };

  const emotionClass = emotionColors[val?.emotion] || emotionColors.neutral;

  return (
    <div
      className={`group relative mb-4 rounded-lg border-2 transition-all duration-300 ${
        val?.isRead
          ? "bg-stone-800/50 border-stone-700 hover:border-stone-600"
          : "bg-stone-800/80 border-amber-600/50 hover:border-amber-500"
      }`}
    >
      {/* Unread indicator bar */}
      {!val?.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-amber-400 to-orange-500 rounded-l-lg"></div>
      )}

      <div className="p-4 sm:p-5 flex gap-4">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-3 mb-2">
            {/* Emotion badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0 ${emotionClass}`}
            >
              {val?.emotion?.charAt(0).toUpperCase() + val?.emotion?.slice(1)}
            </span>

            {/* Unread badge */}
            {!val?.isRead && (
              <span className="px-2 py-1 rounded text-xs font-bold bg-amber-500/30 text-amber-300 border border-amber-500/50 shrink-0">
                NEW
              </span>
            )}
          </div>

          {/* Title and message */}
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 line-clamp-2">
              {val?.title || val?.message}
            </h3>
            <p className="text-sm text-stone-300 line-clamp-2">
              {val?.message}
            </p>
          </div>

          {/* Emotion scores bar */}
          {val?.emotionScores && val.emotionScores.length > 0 && (
            <div className="mb-3">
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-stone-700">
                {val.emotionScores.map((score, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: `${Math.max(score.score * 100, 2)}%`,
                    }}
                    className={`${
                      emotionColors[score.label]
                        ? emotionColors[score.label].split(" ")[0]
                        : "bg-stone-600"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>
              {val?.type?.charAt(0).toUpperCase() + val?.type?.slice(1)}
            </span>
            <span>{formatdate(val?.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          {/* View report button - auto-marks as read */}
          <button
            onClick={handleViewReport}
            disabled={marking}
            className={`group/btn flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 border border-blue-600/30 hover:border-blue-500 transition-all duration-200 text-sm font-medium ${
              marking ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="View report (auto-marks as read)"
          >
            <FileSymlink size={16} />
            <span className="hidden sm:inline text-xs">Report</span>
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`group/btn flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/40 border border-red-600/30 hover:border-red-500 transition-all duration-200 text-sm font-medium ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Delete notification"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline text-xs">Delete</span>
          </button>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-600 group-hover:text-stone-400 transition-colors duration-200">
        <ChevronRight size={20} />
      </div>
    </div>
  );
}

export default Notification;
