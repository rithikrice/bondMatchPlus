import React from "react";

const auctions = [
  { id: 1, name: "HDFC Infra Bond 2028", status: "Live" },
  { id: 2, name: "Treasury Bill 2025", status: "Upcoming" },
  { id: 3, name: "SBI PSU Bond 2030", status: "Closing Soon" },
];

const statusColors = {
  Live: "bg-green-100 text-green-700",
  Upcoming: "bg-yellow-100 text-yellow-700",
  "Closing Soon": "bg-red-100 text-red-700",
};

function AuctionQuickView() {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        Ongoing & Upcoming Auctions
      </h2>
      <div className="space-y-3">
        {auctions.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between border-b last:border-none pb-3"
          >
            <div>
              <p className="font-medium">{a.name}</p>
              <span
                className={`text-xs px-2 py-1 rounded-lg ${
                  statusColors[a.status]
                }`}
              >
                {a.status}
              </span>
            </div>
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuctionQuickView;
