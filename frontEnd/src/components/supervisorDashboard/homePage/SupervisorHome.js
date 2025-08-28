import React from "react";
import KeyMetrics from "./KeyMetrics";
import ActivityChart from "./ActivityChart";
import AuctionQuickView from "./AuctionQuickView";
import AnomalyHeatmap from "./AnomalyHeatmap";
import QuickActionsSupervisor from "./QuickActionsSupervisor";

function SupervisorHome() {
  return (
    <div className="space-y-6">
      {/* Row 1 - Key Metrics */}
      <KeyMetrics />

      {/* Row 2 - Past Week Activity */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <ActivityChart />
      </div>

      {/* Row 3 - Auctions Quick View + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AuctionQuickView />
        <AnomalyHeatmap />
      </div>

      {/* Row 4 - Quick Actions */}
      <QuickActionsSupervisor />
    </div>
  );
}

export default SupervisorHome;
