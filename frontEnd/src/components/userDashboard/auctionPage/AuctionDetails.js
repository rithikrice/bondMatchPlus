import React from "react";
import {
  ChevronDown,
  Clock,
  ChevronLeft,
  User,
  Zap,
  FileText,
  CheckCircle,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";
import { useParams, useNavigate } from "react-router-dom";
import BondSplitVisualization from "../discoverPage/BondSplitVisual";

const PRICE_SERIES = [
  { t: "T-5", p: 101.2 },
  { t: "T-4", p: 101.0 },
  { t: "T-3", p: 100.8 },
  { t: "T-2", p: 100.9 },
  { t: "T-1", p: 101.1 },
  { t: "Now", p: 101.05 },
];

const MOCK_AUCTION = {
  id: "A-1",
  name: "HDFC 2028 8.5%",
  isin: "INHDFC2028",
  status: "OPEN",
  notional: 50_000_000,
  bli: 82,
  fairPrice: 102.5,
  bandLow: 101.3,
  bandHigh: 103.7,
  endsAt: Date.now() + 1000 * 60 * 7 + 5000,
};

const INITIAL_RFQS = [
  {
    id: "r1",
    user: "Retail-1",
    side: "BUY",
    qty: 10000,
    price: 102.4,
    ts: Date.now() - 10000,
  },
  {
    id: "r2",
    user: "MM-Alpha",
    side: "SELL",
    qty: 50000,
    price: 102.8,
    ts: Date.now() - 8000,
  },
  {
    id: "r3",
    user: "Retail-2",
    side: "BUY",
    qty: 5000,
    price: null,
    ts: Date.now() - 2000,
  }, // market order
];

export default function AuctionDetails({ onBack }) {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ auction ID from URL

  const handleBack = onBack || (() => navigate("/auctions"));

  const [auction] = React.useState(MOCK_AUCTION);
  const [rfqs, setRfqs] = React.useState(INITIAL_RFQS);
  const [timeLeft, setTimeLeft] = React.useState(
    Math.max(0, auction.endsAt - Date.now())
  );
  const [placing, setPlacing] = React.useState(false);
  const [form, setForm] = React.useState({ side: "BUY", qty: "", price: "" });

  React.useEffect(() => {
    const t = setInterval(
      () => setTimeLeft(Math.max(0, auction.endsAt - Date.now())),
      1000
    );
    return () => clearInterval(t);
  }, [auction.endsAt]);

  function submitRFQ(e) {
    e.preventDefault();
    setPlacing(true);
    // Basic validation
    const qty = Number(form.qty);
    if (!qty || qty <= 0) {
      alert("Quantity must be > 0");
      setPlacing(false);
      return;
    }
    const newR = {
      id: `r-${Date.now()}`,
      user: "You",
      side: form.side,
      qty,
      price: form.price ? Number(form.price) : null,
      ts: Date.now(),
    };
    setTimeout(() => {
      setRfqs((s) => [newR, ...s]);
      setPlacing(false);
      setForm({ side: "BUY", qty: "", price: "" });
    }, 600);
  }

  const buyOrders = rfqs.filter((r) => r.side === "BUY");
  const sellOrders = rfqs.filter((r) => r.side === "SELL");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={handleBack}
            className="text-sm text-gray-600 hover:underline mb-2 flex items-center gap-2"
          >
            <ChevronLeft size={18} /> Back to Auctions
          </button>

          <h1 className="text-2xl font-bold text-slate-900">{auction.name}</h1>
          <div className="text-sm text-gray-500">
            ISIN: {auction.isin} · Notional {formatNotional(auction.notional)}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="text-right">
            <div className="text-xs text-gray-500">Time left</div>
            <div className="text-sm font-semibold">{msToTime(timeLeft)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border">
            <div className="text-xs text-gray-500">BLI</div>
            <div className="text-lg font-semibold text-teal-600">
              {auction.bli}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Fair price + quick actions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">AI Fair Price</div>
                <div className="text-2xl font-semibold">
                  ₹{auction.fairPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Band: ₹{auction.bandLow.toFixed(2)} — ₹
                  {auction.bandHigh.toFixed(2)}
                </div>
              </div>
              <div className="text-sm text-gray-500 text-right">
                <div>Confidence</div>
                <div className="font-semibold">High</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Why:</strong> Peer AA- tenors tightened; last trade at
                ₹101.05 two days ago.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Auto-Quote (Quick)
              </button>
              <button className="px-3 py-2 border rounded-lg">Explain</button>
            </div>
          </div>

          {/* Price series */}
          <div className="bg-white rounded-2xl p-4 border shadow-sm">
            <div className="text-sm text-gray-600 mb-2">Price history</div>
            <div className="h-36">
              <ResponsiveContainer>
                <LineChart data={PRICE_SERIES}>
                  <XAxis dataKey="t" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="p"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick details */}
          <div className="bg-white rounded-2xl p-4 border shadow-sm text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} /> Issuer HDFC
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} /> Coupon 8.5%
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} /> Grade: AAA
            </div>
          </div>
        </div>

        {/* Center: Live orderbook */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Live RFQs</h3>
            <div className="text-xs text-gray-400">Realtime · Audit trail</div>
          </div>

          {/* Sell orders (top) */}
          <div className="text-sm text-gray-500">Sells</div>
          <div className="divide-y mt-2">
            {sellOrders.length ? (
              sellOrders.map((r) => <OrderRow key={r.id} r={r} />)
            ) : (
              <div className="py-4 text-center text-gray-400">No sell RFQs</div>
            )}
          </div>

          <div className="my-3 border-t" />

          <div className="text-sm text-gray-500">Buys</div>
          <div className="divide-y mt-2">
            {buyOrders.length ? (
              buyOrders.map((r) => <OrderRow key={r.id} r={r} />)
            ) : (
              <div className="py-4 text-center text-gray-400">No buy RFQs</div>
            )}
          </div>
        </div>

        {/* Right: Place RFQ */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Place RFQ</h3>
            <div className="text-xs text-gray-400">Micro-lot ₹1k–₹25k</div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() =>
                navigate("/rfq", {
                  state: {
                    isin: auction.isin,
                    name: auction.name,
                    notional: auction.notional,
                  },
                })
              }
              className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              Go to RFQ Page
            </button>

            <div className="text-xs text-gray-500 mt-2">
              You’ll be redirected to the RFQ form where you can submit your
              quote.
            </div>
          </div>

          <BondSplitVisualization
            totalLots={2000}
            lotSize={25000}
            highlighted={3}
          />

          <div className="mt-4 text-sm">
            <div className="text-xs text-gray-500">Quick actions</div>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-2 rounded-lg border text-sm">
                Verify Merkle
              </button>
              <button className="px-3 py-2 rounded-lg border text-sm">
                Download Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Subcomponents
   --------------------------- */
function OrderRow({ r }) {
  const isBuy = r.side === "BUY";
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="flex items-center gap-2">
          <div
            className={`text-xs px-2 py-1 rounded-lg ${
              isBuy ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {r.side}
          </div>
          <div className="font-medium text-sm">{r.user}</div>
          <div className="text-xs text-gray-400 ml-1">· {timeAgo(r.ts)}</div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {r.price ? `₹${r.price.toFixed(2)}` : "Market"} · Qty{" "}
          {formatQty(r.qty)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-2 py-1 text-xs border rounded-lg">Inspect</button>
        <button className="px-2 py-1 text-xs bg-teal-600 text-white rounded-lg">
          Take
        </button>
      </div>
    </div>
  );
}

/* ---------------------------
   Helpers
   --------------------------- */
function formatNotional(n) {
  if (!n) return "—";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${n}`;
}
function formatQty(q) {
  if (q >= 100000) return `${(q / 100000).toFixed(1)} L`;
  return `${q}`;
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}
function msToTime(ms) {
  if (ms <= 0) return "00:00";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
