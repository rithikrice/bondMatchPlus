import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", buy: 400, sell: 240 },
  { day: "Tue", buy: 300, sell: 139 },
  { day: "Wed", buy: 500, sell: 200 },
  { day: "Thu", buy: 478, sell: 390 },
  { day: "Fri", buy: 589, sell: 480 },
  { day: "Sat", buy: 439, sell: 380 },
  { day: "Sun", buy: 349, sell: 300 },
];

function ActivityChart() {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Past Week Buy & Sell Volume
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="buy"
            stroke="#14b8a6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="sell"
            stroke="#6366f1"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default ActivityChart;
