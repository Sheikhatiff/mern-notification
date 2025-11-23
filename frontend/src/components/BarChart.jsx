import React from "react";

// const data = { a: 20, b: 3.2, c: 32, d: 12.22, e: 3.44, others: 32.2 };
const emotionColorMap = {
  joy: { base: "bg-amber-500", hover: "hover:bg-amber-700" },
  amusement: { base: "bg-amber-500", hover: "hover:bg-amber-700" },
  excitement: { base: "bg-amber-500", hover: "hover:bg-amber-700" },

  love: { base: "bg-rose-500", hover: "hover:bg-rose-700" },
  admiration: { base: "bg-rose-500", hover: "hover:bg-rose-700" },
  caring: { base: "bg-rose-500", hover: "hover:bg-rose-700" },

  anger: { base: "bg-red-600", hover: "hover:bg-red-700" },
  annoyance: { base: "bg-red-600", hover: "hover:bg-red-700" },
  disapproval: { base: "bg-red-600", hover: "hover:bg-red-700" },

  sadness: { base: "bg-sky-500", hover: "hover:bg-sky-700" },
  grief: { base: "bg-sky-500", hover: "hover:bg-sky-700" },
  disappointment: { base: "bg-sky-500", hover: "hover:bg-sky-700" },

  fear: { base: "bg-violet-500", hover: "hover:bg-violet-700" },
  nervousness: { base: "bg-violet-500", hover: "hover:bg-violet-700" },

  surprise: { base: "bg-teal-500", hover: "hover:bg-teal-700" },
  confusion: { base: "bg-teal-500", hover: "hover:bg-teal-700" },
  realization: { base: "bg-teal-500", hover: "hover:bg-teal-700" },

  neutral: { base: "bg-stone-500", hover: "hover:bg-stone-600" },
  others: { base: "bg-stone-500", hover: "hover:bg-stone-600" },
};

const BarChart = ({ data }) => {
  const values = Object.values(data);
  const maxValue = Math.max(...values);
  //   const chartHeight = 300;

  return (
    <div className="p-4 text-stone-300 shadow-lg rounded-lg m-2 sm:p-8 overflow-auto">
      <h2 className="text-xl font-semibold uppercase mb-4">Emotions Outcome</h2>

      <div
        className="flex items-end border-l-2 border-b-2 border-gray-700 pt-4 sm:p-4 sm:py-8 gap-2 h-80 mb-6 sm:overflow-auto
        my-4"
      >
        {Object.entries(data).map(([label, value]) => {
          const barHeightPercent = (value / maxValue) * 100;

          return (
            <div
              key={label}
              className={`flex-1   ${emotionColorMap[label].base} 
  ${emotionColorMap[label].hover} transition-colors duration-300 relative group`}
              style={{ height: `${barHeightPercent}%` }}
              title={`Value: ${value}`}
            >
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 uppercase font-semibold text-stone-200 mb-1 text-xs ">
                {label}
              </span>

              <span className="absolute top-full left-1/2 transform -translate-x-1/2 text-xs text-stone-300 font-medium mt-2">
                {value}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
