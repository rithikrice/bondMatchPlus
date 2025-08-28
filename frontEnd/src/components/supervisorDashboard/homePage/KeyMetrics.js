import React from "react";
import { TrendingUp, AlertTriangle, Gavel, Bell } from "lucide-react";

const metrics = [
  {
    title: "Active Bonds",
    value: "1,245",
    icon: <TrendingUp className="w-6 h-6 text-teal-600" />,
  },
  {
    title: "Total Auctions",
    value: "58",
    icon: <Gavel className="w-6 h-6 text-indigo-600" />,
  },
  {
    title: "Anomalies Flagged",
    value: "12",
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
  },
  {
    title: "Supervisor Alerts",
    value: "7",
    icon: <Bell className="w-6 h-6 text-amber-500" />,
  },
];

function KeyMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="bg-white shadow-sm rounded-xl p-4 flex items-center justify-between border hover:shadow-md transition"
        >
          <div>
            <p className="text-sm text-gray-500">{m.title}</p>
            <p className="text-xl font-bold">{m.value}</p>
          </div>
          {m.icon}
        </div>
      ))}
    </div>
  );
}

export default KeyMetrics;
