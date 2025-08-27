import React from "react";
import { Clock, PieChart, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_AUCTIONS = [
  {
    id: "A-1",
    name: "HDFC 2028 8.5%",
    isin: "INHDFC2028",
    status: "OPEN",
    notional: 50_000_000,
    bli: 82,
    bids: 34,
    startsAt: Date.now() - 1000 * 60 * 2,
    endsAt: Date.now() + 1000 * 60 * 8,
    fairPrice: 102.5,
    band: 1.2,
    tag: "Hot (Retail Flow)",
  },
  {
    id: "A-2",
    name: "SBI 2027 7.9%",
    isin: "INSBI2027",
    status: "UPCOMING",
    notional: 30_000_000,
    bli: 71,
    bids: 10,
    startsAt: Date.now() + 1000 * 60 * 60,
    endsAt: Date.now() + 1000 * 60 * 65,
    fairPrice: 98.4,
    band: 0.9,
    tag: "High Demand",
  },
  {
    id: "A-3",
    name: "Reliance 2030 9.1%",
    isin: "INREL2030",
    status: "CLOSED",
    notional: 20_000_000,
    bli: 65,
    bids: 8,
    startsAt: Date.now() - 1000 * 60 * 60 * 24,
    endsAt: Date.now() - 1000 * 60 * 60 * 23.5,
    fairPrice: 105.0,
    band: 1.5,
    tag: "Discounted",
  },
];

function formatNotional(n) {
  if (!n) return "—";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${n}`;
}

export default function AuctionList({}) {
  const navigate = useNavigate();

  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("ALL");
  const auctions = MOCK_AUCTIONS.filter((a) =>
    `${a.name} ${a.isin}`.toLowerCase().includes(query.toLowerCase())
  ).filter((a) =>
    filter === "ALL"
      ? true
      : filter === "OPEN"
      ? a.status === "OPEN"
      : filter === "CLOSED"
      ? a.status === "CLOSED"
      : a.status === filter
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Auctions</h1>
          <p className="text-sm text-slate-500">
            Live and upcoming auctions — participate, monitor or investigate.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm bg-white"
          >
            <option value="ALL">All status</option>
            <option value="OPEN">Open</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {auctions.map((a) => (
          <AuctionCard
            key={a.id}
            a={a}
            onView={(id) => navigate(`/auctions/${id}`)}
          />
        ))}
      </div>

      {/* Quick insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <InsightCard
          title="Total Open Auctions"
          value={MOCK_AUCTIONS.filter((x) => x.status === "OPEN").length}
          icon={<Clock />}
        />
        <InsightCard
          title="Average BLI"
          value={`${Math.round(
            MOCK_AUCTIONS.reduce((s, x) => s + x.bli, 0) / MOCK_AUCTIONS.length
          )}`}
          icon={<PieChart />}
        />
        <InsightCard
          title="Match Rate (sim)"
          value="70%"
          icon={<ArrowRight />}
        />
      </div>
    </div>
  );
}

/* ---------------------------
   Auction Card component
   --------------------------- */
function AuctionCard({ a, onView }) {
  const timeLeft = Math.max(0, a.endsAt - Date.now());
  const percentElapsed =
    a.status === "OPEN"
      ? Math.min(
          95,
          Math.round(
            ((Date.now() - a.startsAt) / (a.endsAt - a.startsAt)) * 100
          )
        )
      : a.status === "UPCOMING"
      ? 0
      : 100;
  const statusColors = {
    OPEN: "bg-green-50 text-green-700",
    UPCOMING: "bg-yellow-50 text-yellow-700",
    CLOSED: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{a.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                statusColors[a.status]
              }`}
            >
              {a.status}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ISIN: <span className="font-medium text-slate-700">{a.isin}</span>
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Notional</div>
          <div className="font-semibold">{formatNotional(a.notional)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-slate-500">Fair price</div>
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-semibold">
              ₹{a.fairPrice.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">±{a.band}</div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-sky-400"
                style={{ width: `${percentElapsed}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {a.bids} RFQs · BLI {a.bli}
            </div>
          </div>
        </div>

        <div className="w-36 flex flex-col items-end gap-2">
          <div className="text-xs text-gray-500">Time left</div>
          <div className="text-sm font-medium">
            {a.status === "OPEN"
              ? msToTime(timeLeft)
              : a.status === "UPCOMING"
              ? "Starts Soon"
              : "Closed"}
          </div>
          <button
            onClick={() => onView(a.id)}
            className="mt-2 inline-flex items-center gap-2 text-teal-600 border border-teal-100 px-3 py-1 rounded-lg hover:bg-teal-50"
          >
            View auction
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Small components
   --------------------------- */
function InsightCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-slate-50 to-white flex items-center justify-center text-slate-700">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}

function msToTime(ms) {
  if (ms <= 0) return "00:00";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
