import React, { useState, useEffect } from "react";
import BarChart from "../components/BarChart";
import { useParams } from "react-router-dom";
import { formatdate } from "../utils/formatDate";
import Loader from "../components/Loader";
import { notificationAPI, handleApiError } from "../utils/api";

function ReportPage() {
  const { title: notificationId } = useParams();
  const [notification, setNotification] = useState(null);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotification();
  }, [notificationId]);

  const fetchNotification = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await notificationAPI.getById(notificationId);
      const notifData = response.data.data?.notification;
      setNotification(notifData);

      // Extract entry data from notification
      if (notifData?.entryId) {
        // The entry data might be populated in the response
        if (typeof notifData.entryId === "object") {
          setEntry(notifData.entryId);
        } else {
          // If only ID is present, you might need to fetch separately
          setEntry({ title: notifData.title });
        }
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error("Error fetching notification:", err);
    } finally {
      setLoading(false);
    }
  };

  // Convert emotionScores array to chart-friendly format
  const emotionData = {};
  if (
    notification?.emotionScores &&
    Array.isArray(notification.emotionScores)
  ) {
    notification.emotionScores.forEach(({ label, score }) => {
      emotionData[label] = parseFloat((score * 100).toFixed(2));
    });
  }
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="m-4 p-4 text-red-400 bg-red-900 rounded-lg">{error}</div>
    );
  }

  if (!notification || !entry) {
    return (
      <p className="italic m-4 p-4 text-stone-300">
        No Record Found or you deleted this record!
      </p>
    );
  }

  return (
    <div className="">
      <div className="m-2 p-2 sm:mx-6 px-4 text-stone-200">
        <div className="sm:flex sm:justify-around sm:items-center">
          {" "}
          <h1 className="uppercase font-bold text-xl items-center">
            {entry.title}
          </h1>
          <p className="text-xs text-stone-400">
            {formatdate(entry.createdAt)}
          </p>
        </div>
        <p className="mt-4 sm:h-18 sm:overflow-auto text-stone-300">
          {entry.text}
        </p>
      </div>
      {Object.keys(emotionData).length > 0 ? (
        <BarChart data={emotionData} />
      ) : (
        <p className="p-4 text-stone-400 text-center">
          No emotion data available
        </p>
      )}
    </div>
  );
}

export default ReportPage;
