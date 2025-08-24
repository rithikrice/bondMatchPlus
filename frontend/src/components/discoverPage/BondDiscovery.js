import FiltersCard from "./FilterCard";

function BondDiscovery() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Bond Discovery</h1>
      <FiltersCard onChange={(f) => console.log("filters:", f)} />

      {/* 📋 Bond List */}
      <div className="bg-white shadow-sm rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4">Available Bonds</h2>
        <div className="divide-y">
          <BondRow
            name="HDFC 2028 8.5%"
            price="₹102.5 ±1.2"
            score={82}
            coupon="8.5%"
            maturity="2028"
            rating="AAA"
            tag="🔥 Hot this week"
          />
          <BondRow
            name="SBI 2027 7.9%"
            price="₹98.4 ±0.9"
            score={71}
            coupon="7.9%"
            maturity="2027"
            rating="AA+"
            tag="💹 High demand"
          />
          <BondRow
            name="Reliance 2030 9.1%"
            price="₹105.0 ±1.5"
            score={65}
            coupon="9.1%"
            maturity="2030"
            rating="AA"
            tag="⚡ Discounted"
          />
        </div>
      </div>
    </div>
  );
}

function BondRow({ name, price, score, coupon, maturity, rating, tag }) {
  const scoreColor =
    score > 75
      ? "bg-green-100 text-green-700"
      : score > 50
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
      {/* Bond Info */}
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{price}</p>
        <p className="text-xs text-gray-400">{tag}</p>
      </div>

      {/* Details */}
      <div className="flex gap-6 text-sm text-gray-600">
        <span>Coupon: {coupon}</span>
        <span>Maturity: {maturity}</span>
        <span>Rating: {rating}</span>
      </div>

      {/* Score + Actions */}
      <div className="flex items-center gap-3">
        <span className={`${scoreColor} text-xs px-3 py-1 rounded-lg`}>
          BLI {score}
        </span>
        <button className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">
          Details
        </button>
        <button className="px-3 py-1 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Quote
        </button>
      </div>
    </div>
  );
}

export default BondDiscovery;
