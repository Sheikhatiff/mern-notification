import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, Heart } from "lucide-react";

function Toast({ message, type = "success", duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseClass =
    "fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in";

  const typeStyles = {
    success: "bg-green-900/80 border-green-700 text-green-200",
    error: "bg-red-900/80 border-red-700 text-red-200",
    info: "bg-blue-900/80 border-blue-700 text-blue-200",
    entry: "bg-purple-900/80 border-purple-700 text-purple-200",
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    entry: <Heart size={20} className="text-pink-300" />,
  };

  return (
    <div className={`${baseClass} ${typeStyles[type]}`}>
      {icons[type]}
      <span className="text-sm sm:text-base font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-75 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;
