// src/components/auctionPage/BondSplitVisualization.js
import React from "react";

export default function BondSplitVisualization({
  totalLots = 2000,
  lotSize = 25000,
  highlighted = 1,
}) {
  // Show ~50 representative tiles instead of all 2000
  const displayTiles = 50;
  const lotsPerTile = Math.ceil(totalLots / displayTiles);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-lg font-semibold mb-2">How this bond is divided</h2>
      <p className="text-gray-600 text-sm mb-4">
        Total size split into {totalLots.toLocaleString()} micro-lots (₹
        {lotSize.toLocaleString()} each). Each tile represents ~
        {lotsPerTile.toLocaleString()} micro-lots.
      </p>

      {/* Grid of micro-lot tiles */}
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: displayTiles }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded-sm ${
              i === highlighted
                ? "bg-teal-600"
                : "bg-teal-100 hover:bg-teal-200 transition"
            }`}
            title={
              i === highlighted
                ? `👉 Your allocation (~${lotsPerTile} micro-lots)`
                : `~${lotsPerTile} micro-lots`
            }
          />
        ))}
      </div>
    </div>
  );
}
