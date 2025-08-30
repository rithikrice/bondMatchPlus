// src/components/common/AIChat.js
import React, { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const sampleYield = [
  { time: "1Y", value: 3.1 },
  { time: "3Y", value: 3.8 },
  { time: "5Y", value: 4.2 },
  { time: "7Y", value: 4.6 },
  { time: "10Y", value: 5.0 },
];

const AIChat = ({ mode = "user" }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello, I’m your Bond AI Assistant. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Got it ✅ Running analysis…" },
      ]);
    }, 800);
  };

  return (
    <div
      className={`flex flex-col h-full rounded-2xl shadow-2xl border overflow-hidden ${"bg-gradient-to-br from-white via-gray-50 to-gray-100"}`}
    >
      {/* Header */}
      <div className="px-6 py-4 font-bold text-xl border-b border-indigo-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        Bond AI Chat
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with Finance Context */}
        <aside
          className={`w-1/4 hidden lg:flex flex-col p-4 border-r ${
            mode === "supervisor" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3 className="font-semibold mb-3 text-lg">📊 Market Snapshot</h3>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow">
              Avg Yield: <span className="font-bold">5.2%</span>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow">
              Risk Spread: <span className="font-bold">1.4%</span>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow">
              Market Depth: <span className="font-bold">High</span>
            </div>
          </div>

          {/* Yield Curve Mini Chart */}
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-indigo-200">
            <h4 className="font-medium text-sm mb-2">Yield Curve</h4>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={sampleYield}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Auction Highlight */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow">
            ⏳ Next Auction in 3 days
          </div>
        </aside>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-700 rounded-full text-white shadow">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-md shadow-lg backdrop-blur-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                      : mode === "supervisor"
                      ? "bg-white/10 text-black-100 rounded-bl-none"
                      : "bg-gray-100 text-black-900 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="p-2 bg-indigo-600 text-white rounded-full shadow">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="px-6 py-3 flex space-x-3 overflow-x-auto border-t border-indigo-200 bg-gradient-to-r from-indigo-50 to-white">
            {[
              "📈 Show yield curve",
              "📊 Auction analysis",
              "⚡ Risk breakdown",
              "📅 Upcoming auctions",
            ].map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="px-4 py-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium shadow-sm whitespace-nowrap transition"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center px-4 py-3 border-t border-indigo-200 bg-white/70 backdrop-blur-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about bonds, yields, or auctions..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="ml-3 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
