import React from "react";

function AnomalyHeatmap() {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Bond Activity Heatmap</h2>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded ${
              i % 7 === 0
                ? "bg-red-400"
                : i % 5 === 0
                ? "bg-yellow-300"
                : "bg-teal-300"
            }`}
          ></div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        *Darker cells indicate higher volume
      </p>
    </div>
  );
}

export default AnomalyHeatmap;
