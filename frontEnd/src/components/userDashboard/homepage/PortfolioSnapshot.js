function PortfolioSnapshot() {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6 col-span-2">
      <h2 className="text-lg font-semibold">Portfolio Snapshot</h2>
      <p className="text-2xl font-bold mt-2">
        ₹12,760 <span className="text-teal-500 text-sm">+2% Returns</span>
      </p>
      <div className="h-40 my-4 bg-gradient-to-t from-teal-200 to-white rounded-lg"></div>
      <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
        View Portfolio
      </button>
    </div>
  );
}

export default PortfolioSnapshot;
