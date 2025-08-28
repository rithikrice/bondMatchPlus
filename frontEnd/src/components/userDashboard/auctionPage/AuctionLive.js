import React from "react";
import { Trophy, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export default function AuctionLive() {
  const [stage, setStage] = React.useState("LIVE"); // LIVE → RESULT
  const [allocations, setAllocations] = React.useState([]);
  const [countdown, setCountdown] = React.useState(30); // ⏱ 30s timer
  const [didWin, setDidWin] = React.useState(false);

  // ✅ Confetti dimensions
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  React.useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📊 Simulated live chart + stats
  const [chartData, setChartData] = React.useState([]);
  const [stats, setStats] = React.useState({
    orders: 0,
    volume: 0,
    bestBid: 102.3,
    bestAsk: 102.7,
  });

  React.useEffect(() => {
    if (stage === "LIVE") {
      const interval = setInterval(() => {
        setChartData((d) => [
          ...d,
          { time: d.length, price: 102 + Math.random() * 1 },
        ]);
        setStats((s) => ({
          orders: s.orders + Math.floor(Math.random() * 10 + 5),
          volume: s.volume + Math.floor(Math.random() * 1000 + 500),
          bestBid: (102 + Math.random() * 0.5).toFixed(2),
          bestAsk: (102.5 + Math.random() * 0.5).toFixed(2),
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Countdown timer
  React.useEffect(() => {
    if (stage === "LIVE" && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (stage === "LIVE" && countdown === 0) {
      // simulate results
      const allocs = [
        { user: "You", qty: 12000, price: 102.5 },
        { user: "MM-Alpha", qty: 5000, price: 102.4 },
        { user: "Bank-Beta", qty: 3000, price: 102.3 },
      ];
      setAllocations(allocs);
      setDidWin(allocs.some((a) => a.user === "You"));
      setStage("RESULT");
    }
  }, [stage, countdown]);

  // ================== LIVE AUCTION ==================
  if (stage === "LIVE") {
    return (
      <div className="p-8 space-y-6">
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="mx-auto text-teal-600" size={50} />
        </motion.div>

        <h1 className="text-2xl font-bold text-center">Auction in progress…</h1>
        <p className="text-gray-500 text-sm text-center">
          Matching orders in micro-lots. Please wait.
        </p>

        {/* Countdown */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Clock className="text-gray-600" />
          <span className="font-mono text-lg">
            Results in <span className="font-bold">{countdown}</span>s
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <motion.div
            className="bg-teal-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((30 - countdown) / 30) * 100}%` }}
            transition={{ ease: "linear", duration: 1 }}
          />
        </div>

        {/* 📊 Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
          <div className="p-3 bg-white rounded-lg shadow">
            <div className="text-xs text-gray-500">Orders Matched</div>
            <div className="text-lg font-bold">{stats.orders}</div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow">
            <div className="text-xs text-gray-500">Volume</div>
            <div className="text-lg font-bold">
              {stats.volume.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow">
            <div className="text-xs text-gray-500">Best Bid</div>
            <div className="text-lg font-bold">₹{stats.bestBid}</div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow">
            <div className="text-xs text-gray-500">Best Ask</div>
            <div className="text-lg font-bold">₹{stats.bestAsk}</div>
          </div>
        </div>

        {/* 📈 Chart */}
        <div className="h-64 bg-white rounded-xl shadow p-4 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[101.5, 103]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // ================== RESULTS SCREEN ==================
  const totalVolume = allocations.reduce((sum, a) => sum + a.qty, 0);
  const yourAlloc = allocations.find((a) => a.user === "You");
  const fillRatio = yourAlloc
    ? ((yourAlloc.qty / totalVolume) * 100).toFixed(1)
    : 0;

  const pieData = allocations.map((a) => ({
    name: a.user === "You" ? "You" : a.user,
    value: a.qty,
  }));

  const COLORS = ["#14b8a6", "#f59e0b", "#3b82f6", "#ef4444", "#9ca3af"];

  return (
    <div className="p-8 space-y-8 text-center relative">
      {didWin && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      {/* 🎊 Win / Lose Message */}
      <AnimatePresence>
        {didWin ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <Trophy className="text-yellow-500" size={50} />
            <h1 className="text-3xl font-bold text-teal-700">
              🎉 Congratulations! You Won Allocation
            </h1>
            <p className="text-gray-600">
              You now own{" "}
              <span className="font-bold text-teal-700">
                {yourAlloc?.qty.toLocaleString()} units ({fillRatio}% of bond)
              </span>
              .
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <XCircle className="text-red-500" size={50} />
            <h1 className="text-3xl font-bold text-red-600">
              😞 Better luck next time
            </h1>
            <p className="text-gray-600">
              You did not get allocation. Here’s how the bond was divided:
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allocation Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* List view */}
        <div className="bg-white rounded-xl border shadow-sm divide-y">
          {allocations.map((a, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className={`flex justify-between items-center p-4 ${
                a.user === "You" ? "bg-teal-50 border-l-4 border-teal-500" : ""
              }`}
            >
              <div>
                <div className="font-semibold">
                  {a.user === "You" ? "👉 You" : a.user}
                </div>
                <div className="text-xs text-gray-500">
                  Qty {a.qty.toLocaleString()} · Price ₹{a.price}
                </div>
              </div>
              <CheckCircle
                className={a.user === "You" ? "text-teal-600" : "text-gray-400"}
              />
            </motion.div>
          ))}
        </div>

        {/* Pie Chart */}
        <div className="h-64 bg-white rounded-xl shadow p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "You"
                        ? "#14b8a6"
                        : COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 Result Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
        <div className="p-3 bg-white rounded-lg shadow">
          <div className="text-xs text-gray-500">Total Orders</div>
          <div className="text-lg font-bold">{allocations.length}</div>
        </div>
        <div className="p-3 bg-white rounded-lg shadow">
          <div className="text-xs text-gray-500">Total Volume</div>
          <div className="text-lg font-bold">
            {totalVolume.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-white rounded-lg shadow">
          <div className="text-xs text-gray-500">Clearing Price</div>
          <div className="text-lg font-bold">₹{allocations[0]?.price}</div>
        </div>
        <div className="p-3 bg-white rounded-lg shadow">
          <div className="text-xs text-gray-500">Your Fill %</div>
          <div className="text-lg font-bold">{fillRatio}%</div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex justify-center gap-3">
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          Download Contract
        </button>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Verify Allocation
        </button>
      </div>
    </div>
  );
}
