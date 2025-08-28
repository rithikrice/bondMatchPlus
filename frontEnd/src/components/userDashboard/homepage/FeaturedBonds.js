function FeaturedBonds() {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold">Featured Bonds</h2>
      <BondItem name="HDFC 2028 8.5%" price="₹101.2 ±1.0" tag="55" />
      <BondItem name="Treasury Note 2025" price="₹101.2 ±1.0" tag="32" />
    </div>
  );
}

function BondItem({ name, price, tag }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-none">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{price}</p>
      </div>
      <span className="bg-teal-100 text-teal-700 text-sm px-3 py-1 rounded-lg">
        {tag}
      </span>
    </div>
  );
}

export default FeaturedBonds;
