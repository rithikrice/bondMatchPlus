import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Download,
  PlayCircle,
  StopCircle,
  Edit3,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock4,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* -------------------------------------------------------
   Mock Data (replace with your API later)
------------------------------------------------------- */
const AUCTIONS = {
  // Upcoming
  1001: {
    id: "1001",
    status: "Upcoming",
    bond: "GSEC 2029",
    cusip: "IN-GSEC-2029",
    issuer: "Govt of India",
    coupon: 7.3,
    auctionSize: 150000000, // 150M
    minBid: 1000000, // 1M
    rating: "Sov / Stable",
    anomalyCount: 1,
    timeline: {
      announcedAt: "2025-09-01T09:00:00Z",
      registrationClosesAt: "2025-09-08T15:00:00Z",
      startsAt: "2025-09-10T10:00:00Z",
      endsAt: "2025-09-10T12:00:00Z",
      allocatedAt: null,
    },
    insights: {
      yieldCurveHint: [
        { x: "Short", y: 6.9 },
        { x: "5Y", y: 7.1 },
        { x: "10Y", y: 7.3 },
        { x: "15Y", y: 7.4 },
      ],
      creditSpread: [
        { label: "Benchmark", spread: 0.0 },
        { label: "Expected", spread: 0.57 },
      ],
      demandScenarios: [
        { t: "Base", demand: 1.0 },
        { t: "Optimistic", demand: 1.25 },
        { t: "Stress", demand: 0.72 },
      ],
      topLikelyParticipants: ["SBI", "LIC", "HDFC MF", "ICICI Pru MF"],
    },
  },

  // Live
  2002: {
    id: "2002",
    status: "Live",
    bond: "PSU 2031",
    cusip: "IN-PSU-2031",
    issuer: "NTPC Ltd",
    coupon: 7.1,
    auctionSize: 80000000, // 80M
    minBid: 500000, // 0.5M
    rating: "AA+ / Stable",
    anomalyCount: 0,
    timeline: {
      announcedAt: "2025-08-22T09:00:00Z",
      registrationClosesAt: "2025-08-29T15:00:00Z",
      startsAt: "2025-09-02T10:00:00Z",
      endsAt: "2025-09-02T12:00:00Z",
      allocatedAt: null,
    },
    liveSeed: {
      startPrice: 100.2,
      bids: [
        // seed points; live loop will append
        { t: "10:00", px: 100.2, qty: 1.0 },
        { t: "10:15", px: 100.3, qty: 1.5 },
        { t: "10:30", px: 100.35, qty: 2.1 },
      ],
    },
  },

  // Closed
  3003: {
    id: "3003",
    status: "Closed",
    bond: "Infra 2030",
    cusip: "IN-INFRA-2030",
    issuer: "NHAI",
    coupon: 7.5,
    auctionSize: 120000000, // 120M
    minBid: 1000000,
    rating: "AAA / Stable",
    anomalyCount: 2,
    merkleRoot:
      "0x6f1c77d4e5b6a0af1aa2e3b09d9d2e7f2f5c33a0a4f1b8d7c2e6b9a3c1d7e4f2",
    timeline: {
      announcedAt: "2025-08-10T09:00:00Z",
      registrationClosesAt: "2025-08-17T15:00:00Z",
      startsAt: "2025-08-20T10:00:00Z",
      endsAt: "2025-08-20T12:00:00Z",
      allocatedAt: "2025-08-20T13:00:00Z",
    },
    summary: {
      winningPrice: 101.2,
      totalBids: 435,
      participants: 27,
      totalVolume: 1500000, // 1.5M (units)
    },
    distributions: {
      priceHistogram: [
        { bucket: "100.6", vol: 4 },
        { bucket: "100.8", vol: 9 },
        { bucket: "101.0", vol: 13 },
        { bucket: "101.2", vol: 18 },
        { bucket: "101.4", vol: 11 },
        { bucket: "101.6", vol: 6 },
        { bucket: "101.8", vol: 3 },
      ],
      cumulativeBids: [
        { time: "10:00", cum: 0 },
        { time: "10:15", cum: 18 },
        { time: "10:30", cum: 47 },
        { time: "10:45", cum: 71 },
        { time: "11:00", cum: 95 },
        { time: "11:30", cum: 121 },
        { time: "12:00", cum: 143 },
      ],
    },
  },
};

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const fmtINR = (n) =>
  "₹" +
  (Math.abs(n) >= 1e7
    ? (n / 1e7).toFixed(1) + " Cr"
    : Math.abs(n) >= 1e5
    ? (n / 1e5).toFixed(1) + " L"
    : n.toLocaleString());

const fmtNum = (n) => n.toLocaleString();
const chip = (t) =>
  t === "Live"
    ? "bg-teal-100 text-teal-700"
    : t === "Upcoming"
    ? "bg-indigo-100 text-indigo-700"
    : "bg-gray-200 text-gray-700";

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
export default function SupervisorAuctionDetailPage() {
  const { id } = useParams(); // expect /auctions/:id or your route
  const navigate = useNavigate();
  const base = AUCTIONS[id] || AUCTIONS["1001"];
  const [auction, setAuction] = useState(base);

  // Live sim: append a bid every ~8s while status === 'Live'
  const timerRef = useRef(null);
  useEffect(() => {
    if (auction.status !== "Live") return;
    let t = 33; // minutes since 10:00 for synthetic timestamps
    timerRef.current = setInterval(() => {
      setAuction((prev) => {
        const last =
          prev.liveSeed.bids[prev.liveSeed.bids.length - 1] ||
          prev.liveSeed.bids[0];
        const nextPx = (last.px + (Math.random() - 0.45) * 0.08).toFixed(2);
        const nextQty = +(0.5 + Math.random() * 2).toFixed(2);
        t += 2;
        const hhmm = `${String(10 + Math.floor(t / 60)).padStart(
          2,
          "0"
        )}:${String(t % 60).padStart(2, "0")}`;
        return {
          ...prev,
          liveSeed: {
            ...prev.liveSeed,
            bids: [
              ...prev.liveSeed.bids,
              { t: hhmm, px: +nextPx, qty: nextQty },
            ],
          },
        };
      });
    }, 8000);
    return () => clearInterval(timerRef.current);
  }, [auction.status]);

  const liveCumulative = useMemo(() => {
    if (auction.status !== "Live") return [];
    let cum = 0;
    return auction.liveSeed.bids.map((b) => {
      cum += b.qty;
      return { time: b.t, cum: +cum.toFixed(2), px: b.px, qty: b.qty };
    });
  }, [auction]);

  const onExport = () => {
    // simple CSV export of bids/timeline
    let rows = [["time", "price", "qty"]];
    if (auction.status === "Live") {
      auction.liveSeed.bids.forEach((b) => rows.push([b.t, b.px, b.qty]));
    } else if (auction.status === "Closed") {
      auction.distributions.cumulativeBids.forEach((d) =>
        rows.push([d.time, "", d.cum])
      );
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auction_${auction.id}_${auction.status}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ActionButtons = () => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {auction.status === "Upcoming" && (
          <>
            <button className="flex items-center gap-2 rounded-xl border border-indigo-200 text-indigo-700 px-3 py-2 hover:bg-indigo-50">
              <Edit3 className="w-4 h-4" />
              Edit Auction
            </button>
            <button
              onClick={() =>
                setAuction((a) => ({
                  ...a,
                  status: "Live",
                  liveSeed: a.liveSeed || { startPrice: a.coupon, bids: [] },
                }))
              }
              className="flex items-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 shadow"
            >
              <PlayCircle className="w-4 h-4" />
              Start Auction
            </button>
          </>
        )}

        {auction.status === "Live" && (
          <button
            onClick={() => {
              clearInterval(timerRef.current);
              // snapshot to a "closed" summary
              const totalBids = auction.liveSeed.bids.length;
              const participants = Math.max(12, Math.round(totalBids / 2.2));
              const winning = [...auction.liveSeed.bids].sort(
                (a, b) => b.qty - a.qty
              )[0];
              setAuction((a) => ({
                ...a,
                status: "Closed",
                summary: {
                  winningPrice: winning ? winning.px : a.coupon,
                  totalBids,
                  participants,
                  totalVolume: liveCumulative.length
                    ? Math.round(
                        liveCumulative[liveCumulative.length - 1].cum * 1e6
                      )
                    : 0,
                },
                merkleRoot:
                  "0x" + Math.random().toString(16).slice(2).padEnd(62, "a"),
                distributions: {
                  priceHistogram: aggregateHistogram(a.liveSeed.bids),
                  cumulativeBids: liveCumulative.map((d) => ({
                    time: d.time,
                    cum: Math.round(d.cum),
                  })),
                },
                timeline: {
                  ...a.timeline,
                  allocatedAt: new Date().toISOString(),
                },
              }));
            }}
            className="flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-2 hover:bg-red-700 shadow"
          >
            <StopCircle className="w-4 h-4" />
            End Auction
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Title + Status + Actions */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auction Details</h1>
          <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
            <span>
              <span className="font-medium">Bond:</span> {auction.bond}
            </span>
            <span>
              <span className="font-medium">CUSIP / ISIN:</span> {auction.cusip}
            </span>
            <span>
              <span className="font-medium">Issuer:</span> {auction.issuer}
            </span>
            <span>
              <span className="font-medium">Coupon:</span> {auction.coupon}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${chip(
              auction.status
            )}`}
          >
            {auction.status.toUpperCase()}
          </span>
          <ActionButtons />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Auction Size" value={fmtINR(auction.auctionSize)} />
        <KPI label="Min Bid Size" value={fmtINR(auction.minBid)} />
        {auction.status === "Closed" && (
          <>
            <KPI
              label="Winning Price"
              value={`₹${
                auction.summary.winningPrice.toFixed
                  ? auction.summary.winningPrice.toFixed(2)
                  : auction.summary.winningPrice
              }`}
            />
            <KPI
              label="Participants"
              value={fmtNum(auction.summary.participants)}
            />
          </>
        )}
        {auction.status !== "Closed" && (
          <>
            <KPI label="Rating / Outlook" value={auction.rating} />
            <KPI
              label="Anomalies (last 30d)"
              value={fmtNum(auction.anomalyCount)}
              accent="warning"
            />
          </>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <Timeline timeline={auction.timeline} status={auction.status} />
      </div>

      {/* Content Sections by Status */}
      {auction.status === "Upcoming" && <UpcomingPanels auction={auction} />}
      {auction.status === "Live" && (
        <LivePanels auction={auction} liveCumulative={liveCumulative} />
      )}
      {auction.status === "Closed" && <ClosedPanels auction={auction} />}

      {/* Merkle Root (Closed auditability) */}
      {auction.status === "Closed" && auction.merkleRoot && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-2">Audit Trail</h3>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span className="font-medium">Merkle Root:</span>
            <code className="px-2 py-1 bg-gray-100 rounded-md break-all">
              {auction.merkleRoot}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   Subcomponents
------------------------------------------------------- */
function KPI({ label, value, accent }) {
  const tone =
    accent === "warning"
      ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100"
      : "bg-white text-gray-900";
  return (
    <div className={`rounded-2xl shadow-sm border border-gray-200 p-4 ${tone}`}>
      <p className="text-xs tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Timeline({ timeline, status }) {
  const steps = [
    { key: "announcedAt", label: "Announcement" },
    { key: "registrationClosesAt", label: "Registration Close" },
    { key: "startsAt", label: "Live Auction" },
    { key: "endsAt", label: "Bidding Window" },
    { key: "allocatedAt", label: "Allocation" },
  ];

  const activeIndex = status === "Upcoming" ? 1 : status === "Live" ? 3 : 4;

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-700 mb-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex-1 text-center">
            <div
              className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${
                i <= activeIndex
                  ? "bg-teal-50 text-teal-700"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <Clock4 className="w-4 h-4" />
              {s.label}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {timeline[s.key]
                ? new Date(timeline[s.key]).toLocaleString()
                : "—"}
            </div>
          </div>
        ))}
      </div>
      <div className="h-1 w-full bg-gray-100 rounded-full relative">
        <div
          className="h-1 bg-teal-500 rounded-full transition-all"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function UpcomingPanels({ auction }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bond Insights */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">Bond Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Yield Curve Position</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={auction.insights.yieldCurveHint}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
                      <stop
                        offset="100%"
                        stopColor="#14b8a6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis domain={["dataMin-0.2", "dataMax+0.2"]} />
                  <Tooltip />
                  <Area
                    dataKey="y"
                    stroke="#14b8a6"
                    fill="url(#grad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Credit Spread vs Benchmark
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={auction.insights.creditSpread}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="spread" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-2">Top Likely Participants</h3>
        <ul className="space-y-2">
          {auction.insights.topLikelyParticipants.map((p) => (
            <li
              key={p}
              className="flex items-center justify-between rounded-lg border p-2"
            >
              <span>{p}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                High Prob.
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          Simulated model output; confirm with KYC/eligibility lists.
        </div>
      </div>
    </div>
  );
}

function LivePanels({ auction, liveCumulative }) {
  const totalQty = liveCumulative.length
    ? liveCumulative[liveCumulative.length - 1].cum
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Price & Cumulative */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">Live Bidding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price over time */}
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liveCumulative}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" domain={["dataMin-0.1", "dataMax+0.1"]} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  dataKey="px"
                  name="Price"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <ReferenceLine
                  y={auction.coupon}
                  label="Coupon"
                  stroke="#6366f1"
                  strokeDasharray="4 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cumulative qty */}
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveCumulative}>
                <defs>
                  <linearGradient id="cum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                    <stop
                      offset="100%"
                      stopColor="#14b8a6"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  dataKey="cum"
                  name="Cumulative Qty"
                  stroke="#14b8a6"
                  fill="url(#cum)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <span className="font-medium">Total Cumulative Bids:</span>{" "}
          {totalQty.toFixed ? totalQty.toFixed(2) : totalQty} units
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-2">Top Bidders (Live)</h3>
        <ul className="space-y-2">
          {topNFromBids(auction.liveSeed?.bids || [], 6).map((b, i) => (
            <li
              key={i}
              className="flex items-center justify-between border rounded-lg px-3 py-2"
            >
              <span className="text-sm">Bidder #{i + 1}</span>
              <span className="text-sm text-gray-600">{b.t}</span>
              <span className="font-semibold">₹{b.px.toFixed(2)}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-teal-50 text-teal-700">
                {b.qty}M
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ClosedPanels({ auction }) {
  const { summary, distributions } = auction;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* KPI strip for closed */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Total Bids" value={fmtNum(summary.totalBids)} />
        <KPI label="Winning Price" value={`₹${summary.winningPrice}`} />
        <KPI label="Participants" value={fmtNum(summary.participants)} />
        <KPI label="Auction Size (units)" value={fmtNum(summary.totalVolume)} />
      </div>

      {/* Histogram */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-2">Bid Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributions.priceHistogram}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="bucket"
                label={{ value: "Price", position: "insideBottom", offset: -2 }}
              />
              <YAxis />
              <Tooltip />
              <ReferenceLine
                x={
                  summary.winningPrice.toFixed
                    ? summary.winningPrice.toFixed(1)
                    : summary.winningPrice
                }
                stroke="#14b8a6"
                label="Winner"
              />
              <Bar dataKey="vol" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-2">
          Cumulative Bids Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distributions.cumulativeBids}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cum"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Notes / anomalies */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-2">Anomalies & Notes</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            Price cluster near winner suggests tight book; monitor next
            issuance.
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            Two late bursts (11:30 & 11:55)—possible algorithmic aggregation.
          </li>
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Small Utilities
------------------------------------------------------- */
function topNFromBids(bids, n = 5) {
  // crude: pick n largest qty entries
  return [...bids].sort((a, b) => b.qty - a.qty).slice(0, n);
}
function aggregateHistogram(bids) {
  // bucket price to one decimal
  const map = new Map();
  bids.forEach((b) => {
    const key = (+b.px).toFixed(1);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()]
    .map(([bucket, vol]) => ({ bucket, vol }))
    .sort((a, b) => parseFloat(a.bucket) - parseFloat(b.bucket));
}
