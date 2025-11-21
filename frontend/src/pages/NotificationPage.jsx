import React from "react";
import Notification from "../components/Notification";
import { entries } from "../data";

function NotificationPage() {
  return (
    <div className="text-stone-200 m-2 p-2 sm:m-4 sm:p-6 divide-y divide-stone-700 overflow-auto h-full mb-8">
      {entries.map((v, i) => (
        <Notification key={i} val={v} />
      ))}
    </div>
  );
}

export default NotificationPage;
