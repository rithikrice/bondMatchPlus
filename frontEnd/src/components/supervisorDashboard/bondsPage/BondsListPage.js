import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Filter,
  Plus,
  Download,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

// ---------- Utility functions for dynamic colors ----------
const getRatingBadgeColor = (rating) => {
  switch (rating) {
    case "AAA":
      return "bg-green-100 text-green-700";
    case "AA":
      return "bg-emerald-100 text-emerald-700";
    case "A":
      return "bg-blue-100 text-blue-700";
    case "BBB":
      return "bg-yellow-100 text-yellow-700";
    case "Junk":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getActivityColor = (level) => {
  switch (level) {
    case "High":
      return "bg-green-100 text-green-700";
    case "Medium":
      return "bg-blue-100 text-blue-700";
    case "Low":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ---------- Dummy Data ----------
const bondsData = [
  {
    isin: "IN12345",
    name: "Bond A",
    rating: "AAA",
    maturity: "2032 (8 yrs)",
    coupon: "6.5%",
    liquidity: "High",
    activity: "Medium",
    anomaly: true,
  },
  {
    isin: "IN67890",
    name: "Bond B",
    rating: "BBB",
    maturity: "2026 (2 yrs)",
    coupon: "7.1%",
    liquidity: "Moderate",
    activity: "High",
    anomaly: false,
  },
  {
    isin: "IN54321",
    name: "Bond C",
    rating: "Junk",
    maturity: "2024 (6 months)",
    coupon: "11.5%",
    liquidity: "Low",
    activity: "Low",
    anomaly: true,
  },
  {
    isin: "IN98765",
    name: "Bond D",
    rating: "AA",
    maturity: "2029 (5 yrs)",
    coupon: "5.9%",
    liquidity: "Moderate",
    activity: "High",
    anomaly: false,
  },
];

// ---------- Components ----------
const MarketIndicators = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      { label: "Avg Bond Yield", value: "6.3%" },
      { label: "Liquidity Index", value: "72.4" },
      { label: "Spread Deviation", value: "+18 bps" },
    ].map((item, i) => (
      <div key={i} className="bg-white shadow rounded-xl p-4">
        <p className="text-sm text-gray-500">{item.label}</p>
        <p className="text-xl font-semibold text-gray-900">{item.value}</p>
      </div>
    ))}
  </div>
);

const Filters = ({ filtersOpen, setFiltersOpen }) => (
  <div className="bg-white shadow rounded-xl">
    <div
      className="flex justify-between items-center px-4 py-3 border-b cursor-pointer"
      onClick={() => setFiltersOpen(!filtersOpen)}
    >
      <h2 className="text-lg font-semibold text-gray-700 flex items-center">
        <Filter className="h-5 w-5 mr-2" /> Filters
      </h2>
      <span className="text-sm text-teal-600">
        {filtersOpen ? "Hide" : "Show"}
      </span>
    </div>
    {filtersOpen && (
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <select className="border rounded-lg p-2">
          <option>Tenor</option>
          <option>0-1 yr</option>
          <option>1-5 yr</option>
          <option>5-10 yr</option>
          <option>10+ yr</option>
        </select>
        <select className="border rounded-lg p-2">
          <option>Rating</option>
          <option>AAA</option>
          <option>AA</option>
          <option>A</option>
          <option>BBB</option>
          <option>Junk</option>
        </select>
        <input
          type="text"
          placeholder="Issuer"
          className="border rounded-lg p-2"
        />
        <select className="border rounded-lg p-2">
          <option>Sector</option>
          <option>Financials</option>
          <option>PSU</option>
          <option>Infrastructure</option>
          <option>Sovereign</option>
        </select>
        <select className="border rounded-lg p-2">
          <option>Status</option>
          <option>Active</option>
          <option>Matured</option>
          <option>Auctioned</option>
          <option>Flagged</option>
        </select>
        <button className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-700 transition">
          Apply
        </button>
      </div>
    )}
  </div>
);

const BondRow = ({ bond, onView }) => (
  <tr className="hover:bg-gray-50 transition cursor-pointer">
    <td className="px-6 py-4 whitespace-nowrap">
      {bond.name} / {bond.isin}
    </td>
    <td className="px-6 py-4">
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${getRatingBadgeColor(
          bond.rating
        )}`}
      >
        {bond.rating}
      </span>
    </td>
    <td className="px-6 py-4">{bond.maturity}</td>
    <td className="px-6 py-4">{bond.coupon}</td>
    <td className="px-6 py-4">{bond.liquidity}</td>
    <td className="px-6 py-4">
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${getActivityColor(
          bond.activity
        )}`}
      >
        {bond.activity}
      </span>
    </td>
    <td className="px-6 py-4 text-center">
      {bond.anomaly ? (
        <AlertTriangle className="h-5 w-5 text-red-500" />
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </td>
    <td className="px-6 py-4">
      <button
        onClick={() => onView(bond.isin)}
        className="inline-flex items-center gap-2 bg-white-600 border border-teal-600 text-xs text-teal-600 px-3 py-1 rounded-lg hover:bg-teal-200 transition"
      >
        Details
      </button>
    </td>
  </tr>
);

const BondsTable = ({ data, onView }) => (
  <div className="bg-white shadow rounded-xl overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          {[
            "Bond / ISIN",
            "Rating",
            "Maturity",
            "Coupon",
            "Liquidity",
            "Activity",
            "Anomaly",
            "Details",
          ].map((col) => (
            <th
              key={col}
              className="px-6 py-3 text-left text-sm font-medium text-gray-600"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.map((bond, i) => (
          <BondRow key={i} bond={bond} onView={onView} />
        ))}
      </tbody>
    </table>
  </div>
);

// ---------- Main Page ----------
const SupervisorBondsPage = () => {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const navigate = useNavigate();

  const handleView = (isin) => {
    navigate(`/supervisor/bonds/${isin}`);
  };

  return (
    <div className="space-y-6">
      {/* Header + Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Bonds</h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
            <Plus className="h-5 w-5 mr-2" /> Create Bond
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <Download className="h-5 w-5 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Market Indicators */}
      <MarketIndicators />

      {/* Filters */}
      <Filters filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} />

      {/* Bond Table */}
      <BondsTable data={bondsData} onView={handleView} />
    </div>
  );
};

export default SupervisorBondsPage;
