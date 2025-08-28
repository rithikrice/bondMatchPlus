import React from "react";
import { Plus, Shield, AlertTriangle } from "lucide-react";

const actions = [
  { title: "Create Auction", desc: "Launch new bond auction", icon: <Plus /> },
  {
    title: "Review Alerts",
    desc: "Check anomaly & system alerts",
    icon: <AlertTriangle />,
  },
  {
    title: "Risk Controls",
    desc: "Set supervisor thresholds",
    icon: <Shield />,
  },
];

function QuickActionsSupervisor() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((a, i) => (
          <div
            key={i}
            className="bg-white shadow-sm rounded-xl p-4 border hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-teal-600 mb-2">
              {a.icon}
              <p className="font-semibold">{a.title}</p>
            </div>
            <p className="text-sm text-gray-600">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickActionsSupervisor;
