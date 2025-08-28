import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../../userDashboard/ui/RandomCard";
import { Button } from "../../userDashboard/ui/RandomButton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Plus,
  Scissors,
  Hammer,
  Edit,
  AlertTriangle,
  Building2,
  Star,
  Layers,
} from "lucide-react";

// Dummy data for charts
const priceData = [
  { date: "Jan", price: 102 },
  { date: "Feb", price: 104 },
  { date: "Mar", price: 101 },
  { date: "Apr", price: 105 },
  { date: "May", price: 106 },
];

const ownershipData = [
  { name: "Institutional", value: 60 },
  { name: "Retail", value: 25 },
  { name: "Foreign", value: 15 },
];

const COLORS = ["#14b8a6", "#6366f1", "#f59e0b"];

export default function BondDetailPage() {
  const { isin } = useParams();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Bond Details: <span className="text-teal-600">{isin}</span>
      </h1>

      {/* Sticky Action Buttons */}
      <div className="sticky top-0 flex justify-end gap-3 bg-white p-4 z-10 shadow rounded-xl">
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Scissors className="w-4 h-4 mr-2" /> Split Bond
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Hammer className="w-4 h-4 mr-2" /> Start Auction
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Hammer className="w-4 h-4 mr-2" /> End Auction
        </Button>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" /> Edit Details
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Value", value: "$10M" },
          { label: "Maturity", value: "2029 (5 yrs)" },
          { label: "Coupon", value: "7.2%" },
          { label: "Liquidity Index", value: "0.82" },
          { label: "YTM", value: "7.5%" },
          { label: "Duration", value: "4.1 yrs" },
        ].map((kpi, i) => (
          <Card
            key={i}
            className="rounded-2xl shadow-sm bg-gray-50 hover:bg-gray-100 transition"
          >
            <CardContent className="p-4 text-center flex flex-col justify-center h-24">
              <p className="text-sm font-medium text-gray-500 mb-1">
                {kpi.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Historical Price / Yield
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={priceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#14b8a6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Ownership Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={ownershipData} dataKey="value" outerRadius={90}>
                  {ownershipData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics + Market Depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Risk Metrics
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Credit Spread vs G-Sec</span>
                <span className="font-semibold text-red-600">+180 bps</span>
              </li>
              <li className="flex justify-between">
                <span>Volatility Score</span>
                <span className="font-semibold text-yellow-500">Moderate</span>
              </li>
              <li className="flex justify-between">
                <span>VaR-lite</span>
                <span className="font-semibold text-green-600">Low</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Market Depth (Top Bids/Offers)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-semibold mb-1">Bids</p>
                <p>$1M @ 101.2</p>
                <p>$2M @ 101.0</p>
                <p>$1.5M @ 100.8</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Offers</p>
                <p>$1M @ 102.0</p>
                <p>$2M @ 102.3</p>
                <p>$0.5M @ 102.5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auction History + Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Auction History
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={priceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="text-yellow-500 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Alerts & Flags
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                <li>Spread deviation detected</li>
                <li>Liquidity risk flagged</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issuer Info & Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Issuer Info
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="font-medium">XYZ Infrastructure Ltd.</span>
              </p>
              <p className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-500" />
                <span>Sector: Infrastructure</span>
              </p>
              <p className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Rating: AA</span>
              </p>
            </div>
            <div className="mt-4">
              <p className="font-semibold text-sm text-gray-700 mb-2">
                Recent News
              </p>
              <ul className="space-y-2 text-sm text-gray-600 border-l pl-4">
                <li>XYZ Infra wins $500M highway contract</li>
                <li>Credit rating reaffirmed at AA (Stable)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Compare with Similar Bonds
            </h3>
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-1">Bond</th>
                  <th className="py-1">Rating</th>
                  <th className="py-1">Coupon</th>
                  <th className="py-1">YTM</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-1">ABC Infra 2028</td>
                  <td>AA</td>
                  <td>7.1%</td>
                  <td>7.3%</td>
                </tr>
                <tr>
                  <td className="py-1">DEF Power 2029</td>
                  <td>A+</td>
                  <td>7.5%</td>
                  <td>7.7%</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
