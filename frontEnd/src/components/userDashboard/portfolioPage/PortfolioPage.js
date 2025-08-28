import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function PortfolioDashboard() {
  const portfolioData = [
    { name: "PSU", value: 50 },
    { name: "NBFC", value: 24 },
    { name: "GOVT", value: 26 },
  ];
  const COLORS = ["#10B981", "#34D399", "#6EE7B7"];

  const returnsData = [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 110 },
    { month: "Mar", value: 105 },
    { month: "Apr", value: 120 },
    { month: "May", value: 130 },
  ];

  const holdings = [
    {
      name: "HDFC 2028 8.5%",
      qty: 50,
      avg: "₹100.0",
      current: "₹5,050",
      pnl: "+125",
      tag: "🔥 Hot it week",
    },
    {
      name: "Treasury Note 205",
      qty: 20,
      avg: "₹100.5",
      current: "₹2,024",
      pnl: "-₹6",
      tag: "BLI score 82",
    },
    {
      name: "SBI 3027 7.9%",
      qty: 15,
      avg: "₹98.0",
      current: "₹1,476",
      pnl: "+112",
      tag: "BLI score 68",
    },
    {
      name: "Reliance 2030 9.1%",
      qty: 8,
      avg: "₹104.2",
      current: "₹1,210",
      pnl: "₹0",
      tag: "BLI score 86",
    },
  ];

  return (
    <main className="flex-1 p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-6">Portfolio</h2>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Invested Card */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col justify-center items-center">
          <div className="relative w-full h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={portfolioData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                >
                  {portfolioData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Text inside donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-lg font-bold">₹12,760</h2>
              <p className="text-green-600 text-sm">+2.8%</p>
            </div>
          </div>
        </div>

        {/* Portfolio by Sector */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="font-semibold mb-4">Portfolio by Sector</h3>
          <div className="h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={portfolioData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={55}
                >
                  {portfolioData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Returns over time */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="font-semibold mb-4">Returns over time</h3>
          <div className="h-40">
            <ResponsiveContainer>
              <LineChart data={returnsData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  name="Returns"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Holdings + Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <div className="bg-white shadow rounded-xl p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Holdings</h3>
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left">Qty</th>
                <th className="text-left">Avg Buy</th>
                <th className="text-left">Current Value</th>
                <th className="text-left">Unrealized P&L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2">
                    <div className="font-medium">{h.name}</div>
                    <div className="text-xs text-gray-500">{h.tag}</div>
                  </td>
                  <td>{h.qty}</td>
                  <td>{h.avg}</td>
                  <td>{h.current}</td>
                  <td
                    className={
                      h.pnl.startsWith("-")
                        ? "text-red-500 font-semibold"
                        : h.pnl === "₹0"
                        ? "text-gray-500 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {h.pnl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Insights */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="font-semibold mb-4">AI Insights</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
            <li>Your PSU bonds are outperforming private NBFCs</li>
            <li>One bond is approaching maturity next month</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
