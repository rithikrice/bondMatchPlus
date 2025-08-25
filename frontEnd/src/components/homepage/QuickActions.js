function QuickActions() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          title="Buy"
          desc="Bond spreads tightening this week"
          icon=""
        />
        <ActionCard title="Sell" desc="Retail demand high in PSU bonds" />
        <ActionCard
          title="Tax Tip"
          desc="Fair Price deviation flagged in XYZ Bond"
        />
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border hover:shadow-md transition">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

export default QuickActions;
