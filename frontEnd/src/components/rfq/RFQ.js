import React from "react";
import {
  ArrowLeft,
  Send,
  TrendingUp,
  Users,
  Info,
  Activity,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RFQPage() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ side: "BUY", qty: "", price: "" });
  const [rfqs, setRfqs] = React.useState([]);
  const [rfqPlaced, setRfqPlaced] = React.useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.qty) return alert("Enter quantity");
    const newRfqs = [
      {
        id: `rfq-${Date.now()}`,
        side: form.side,
        qty: Number(form.qty),
        price: form.price ? Number(form.price) : null,
        ts: Date.now(),
      },
      ...rfqs,
    ];
    setRfqs(newRfqs);
    setForm({ side: "BUY", qty: "", price: "" });
    setRfqPlaced(true);
  }

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/auctions")}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Request for Quote
        </h1>
      </div>

      {/* RFQ Form + Live */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* RFQ Form */}
        <div className="lg:col-span-1 bg-white/90 backdrop-blur rounded-2xl border shadow-lg p-6">
          <h2 className="font-semibold text-lg mb-5 border-b pb-2">New RFQ</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-gray-500">Side</label>
              <select
                value={form.side}
                onChange={(e) =>
                  setForm((s) => ({ ...s, side: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500"
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Quantity (₹)
              </label>
              <input
                type="number"
                value={form.qty}
                onChange={(e) =>
                  setForm((s) => ({ ...s, qty: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                placeholder="Enter lot size"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Limit Price (optional)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((s) => ({ ...s, price: e.target.value }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500"
                placeholder="Leave blank for market RFQ"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2.5 rounded-xl hover:from-teal-700 hover:to-teal-800 transition shadow"
            >
              <Send size={16} /> Submit RFQ
            </button>
          </form>

          {/* Show Join Auction Live after RFQ */}
          {rfqPlaced && (
            <div className="mt-6">
              <button
                onClick={() => navigate("/auction-live")}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition shadow"
              >
                <PlayCircle size={18} /> Join Auction Live
              </button>
            </div>
          )}
        </div>

        {/* Live Preview + Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl border shadow-lg p-6">
            <h2 className="font-semibold text-lg mb-4 border-b pb-2">
              Live RFQs (Preview)
            </h2>
            {rfqs.length ? (
              <div className="divide-y">
                {rfqs.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <div className="flex gap-2 items-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-lg ${
                            r.side === "BUY"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {r.side}
                        </span>
                        <span className="font-medium">
                          {r.price ? `₹${r.price}` : "Market"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Qty: {r.qty.toLocaleString()} · {timeAgo(r.ts)}
                      </div>
                    </div>
                    <button className="px-3 py-1 border text-xs rounded-lg hover:bg-slate-50">
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No RFQs placed yet.</div>
            )}
          </div>

          {/* Insights */}
          <div className="grid md:grid-cols-3 gap-5">
            <InsightCard
              icon={<TrendingUp />}
              title="Market Depth"
              value="Strong"
            />
            <InsightCard icon={<Users />} title="Participants" value="24" />
            <InsightCard icon={<Info />} title="Auction Link" value="A-1" />
            <InsightCard icon={<Activity />} title="Volatility" value="Low" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, value }) {
  return (
    <div className="bg-white/90 backdrop-blur rounded-xl border shadow p-5 flex gap-3 items-center hover:shadow-md transition">
      <div className="text-slate-600">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}
