import React from "react";

// const data = { a: 20, b: 3.2, c: 32, d: 12.22, e: 3.44, others: 32.2 };
const emotionColorMap = {
  // Positive emotions
  admiration: { base: "bg-amber-500", hover: "hover:bg-amber-700" },
  amusement: { base: "bg-yellow-500", hover: "hover:bg-yellow-700" },
  awe: { base: "bg-indigo-500", hover: "hover:bg-indigo-700" },
  excitement: { base: "bg-orange-500", hover: "hover:bg-orange-700" },
  joy: { base: "bg-lime-500", hover: "hover:bg-lime-700" },
  gratitude: { base: "bg-emerald-500", hover: "hover:bg-emerald-700" },
  pride: { base: "bg-amber-600", hover: "hover:bg-amber-800" },
  optimism: { base: "bg-lime-400", hover: "hover:bg-lime-600" },
  relief: { base: "bg-sky-400", hover: "hover:bg-sky-600" },
  love: { base: "bg-rose-500", hover: "hover:bg-rose-700" },
  caring: { base: "bg-pink-500", hover: "hover:bg-pink-700" },

  // Negative emotions
  anger: { base: "bg-red-600", hover: "hover:bg-red-800" },
  annoyance: { base: "bg-red-500", hover: "hover:bg-red-700" },
  disapproval: { base: "bg-red-400", hover: "hover:bg-red-600" },
  disgust: { base: "bg-green-600", hover: "hover:bg-green-800" },
  embarrassment: { base: "bg-orange-300", hover: "hover:bg-orange-500" },
  sadness: { base: "bg-blue-600", hover: "hover:bg-blue-800" },
  disappointment: { base: "bg-blue-500", hover: "hover:bg-blue-700" },
  grief: { base: "bg-blue-800", hover: "hover:bg-blue-900" },
  fear: { base: "bg-violet-600", hover: "hover:bg-violet-800" },
  nervousness: { base: "bg-purple-500", hover: "hover:bg-purple-700" },

  // Cognitive emotions
  confusion: { base: "bg-slate-500", hover: "hover:bg-slate-700" },
  curiosity: { base: "bg-indigo-400", hover: "hover:bg-indigo-600" },
  realization: { base: "bg-cyan-500", hover: "hover:bg-cyan-700" },
  surprise: { base: "bg-teal-500", hover: "hover:bg-teal-700" },
  boredom: { base: "bg-gray-500", hover: "hover:bg-gray-700" },

  // Social emotions
  desire: { base: "bg-red-300", hover: "hover:bg-red-500" },
  approval: { base: "bg-green-400", hover: "hover:bg-green-600" },

  // Neutral / fallback
  neutral: { base: "bg-stone-600", hover: "hover:bg-stone-800" },
  others: { base: "bg-stone-700", hover: "hover:bg-stone-900" },
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
