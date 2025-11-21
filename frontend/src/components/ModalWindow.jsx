import React from "react";
import { formatdate } from "../utils/formatDate";
import { X } from "lucide-react";

function ModalWindow({
  text,
  date,
  title,
  onClose,
  permission = false,
  onSure,
}) {
  return (
    <div className="absolute inset-0 flex justify-center items-center h-100 m-4 p-8 sm:px-20 bg-stone-950/90">
      <div>
        <div className="flex justify-between items-center sm:mb-8 mb-3 gap-4 sm:gap-20">
          <small className="text-[8px] sm:text-xs text-stone-400">
            {formatdate(date)}
          </small>

          {title && (
            <h1 className="text-[16px] sm:text-xl font-semibold text-stone-200">
              {title}
            </h1>
          )}

          <X
            onClick={onClose}
            className="cursor-pointer hover:scale-110 transition"
            color="#ef4444"
          />
        </div>

        <h2 className="text-stone-300 leading-relaxed">{text}</h2>

        {permission && (
          <>
            <h1 className="flex items-center justify-center text-stone-400 mt-6">
              Are you sure you want to delete this?
            </h1>

            <div className="text-xl text-stone-300 font-medium flex justify-between mt-8">
              <button
                className="border border-stone-500 rounded-full px-3 sm:px-5 py-1 hover:bg-stone-700 hover:text-white transition"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="border border-red-500 rounded-full px-3 sm:px-5 py-1 text-red-400 hover:bg-red-600 hover:text-white transition"
                onClick={onSure}
              >
                Sure
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalWindow;
