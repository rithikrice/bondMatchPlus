import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, PlusCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockAuctions = [
  {
    id: "1",
    bond: "GSEC 2033",
    issuer: "Govt of India",
    date: "2025-09-01",
    status: "Live",
    bids: 45,
    winningPrice: "₹102.45",
  },
  {
    id: "2",
    bond: "PSU 2029",
    issuer: "State Bank of India",
    date: "2025-09-03",
    status: "Upcoming",
    bids: 0,
    winningPrice: "-",
  },
  {
    id: "3",
    bond: "Infra 2030",
    issuer: "NTPC Ltd",
    date: "2025-08-20",
    status: "Closed",
    bids: 32,
    winningPrice: "₹99.80",
  },
];

const statusColors = {
  Live: "bg-green-100 text-green-700",
  Closed: "bg-gray-200 text-gray-700",
  Upcoming: "bg-blue-100 text-blue-700",
};

// Mock chart data
const bidsTrend = [
  { date: "Aug 1", bids: 20, volume: 120 },
  { date: "Aug 8", bids: 35, volume: 150 },
  { date: "Aug 15", bids: 40, volume: 180 },
  { date: "Aug 22", bids: 25, volume: 140 },
  { date: "Aug 29", bids: 50, volume: 200 },
];

export default function SupervisorAuctionListPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAuctions = mockAuctions.filter((a) => {
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    const matchSearch =
      a.bond.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Quick stats
  const totalAuctions = mockAuctions.length;
  const liveCount = mockAuctions.filter((a) => a.status === "Live").length;
  const upcomingCount = mockAuctions.filter(
    (a) => a.status === "Upcoming"
  ).length;
  const closedCount = mockAuctions.filter((a) => a.status === "Closed").length;
  const totalBids = mockAuctions.reduce((sum, a) => sum + a.bids, 0);
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/supervisor/auctions/${id}`);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header + Create Auction */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Auctions</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-2 shadow-lg">
            <PlusCircle className="w-4 h-4" />
            Create Auction
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">Total Auctions</p>
          <h2 className="text-2xl font-bold text-teal-600">{totalAuctions}</h2>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">Total Bids</p>
          <h2 className="text-2xl font-bold text-teal-600">{totalBids}</h2>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">Live</p>
          <h2 className="text-2xl font-bold text-green-600">{liveCount}</h2>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">Upcoming</p>
          <h2 className="text-2xl font-bold text-blue-600">{upcomingCount}</h2>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">Closed</p>
          <h2 className="text-2xl font-bold text-gray-600">{closedCount}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by bond or issuer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {/* Status Filter */}
        <div className="flex gap-3">
          {["All", "Live", "Upcoming", "Closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                statusFilter === status
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Auction List */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-200">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Auction List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Bond</th>
                <th className="px-6 py-3">Issuer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Bids</th>
                <th className="px-6 py-3">Winning Price</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuctions.map((auction) => (
                <tr
                  key={auction.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{auction.bond}</td>
                  <td className="px-6 py-4">{auction.issuer}</td>
                  <td className="px-6 py-4">{auction.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[auction.status]
                      }`}
                    >
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{auction.bids}</td>
                  <td className="px-6 py-4">{auction.winningPrice}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleView(auction.id)}
                      className="inline-flex items-center gap-2 bg-white-600 border border-teal-600 text-xs text-teal-600 px-3 py-1 rounded-lg hover:bg-teal-200 transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
          <h2 className="text-lg font-medium mb-4">Bids Trend</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={bidsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="bids"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
          <h2 className="text-lg font-medium mb-4">Auction Volume</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={bidsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volume" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
