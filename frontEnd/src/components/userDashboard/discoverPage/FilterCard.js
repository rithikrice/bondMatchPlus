import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * FiltersCard
 * - Self-contained UI for the "Filters" section
 * - Emits a combined `filters` object on every change (via onChange)
 *
 * Usage:
 *   <FiltersCard onChange={(filters) => setFilters(filters)} />
 */
export default function FiltersCard({ onChange }) {
  const [filters, setFilters] = React.useState({
    tenor: "Any",
    rating: "AAA",
    maturity: "Any",
    sector: "All Sectors",
    aiLiquidity: "Any",
  });

  const update = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onChange?.(next);
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">
      <div className="text-sm font-semibold text-gray-700 mb-4">Filters</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <FilterSelect
          value={filters.tenor}
          onChange={(v) => update("tenor", v)}
          options={["Any", "0–3y", "3–5y", "5–10y", "10y+"]}
          placeholder="Tenor"
        />

        <FilterSelect
          value={filters.rating}
          onChange={(v) => update("rating", v)}
          options={[
            "Any",
            "AA+",
            "AA",
            "AA-",
            "A+",
            "A",
            "A-",
            "BBB+",
            "BBB",
            "BBB-",
          ]}
          placeholder="Rating"
        />

        <FilterSelect
          value={filters.sector}
          onChange={(v) => update("sector", v)}
          options={[
            "All Sectors",
            "PSU",
            "Bank",
            "NBFC",
            "Corporate",
            "Govt",
            "Municipal",
          ]}
          placeholder="Sector"
        />

        <FilterSelect
          value={filters.aiLiquidity}
          onChange={(v) => update("aiLiquidity", v)}
          options={[
            "Any",
            "High → Low",
            "Low → High",
            "Highly Liquid (80+)",
            "Moderate (60–79)",
            "Illiquid (<60)",
          ]}
          placeholder="AI Liquidity"
        />
      </div>
    </div>
  );
}

/** Reusable pill-styled select to match the mock */
function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full appearance-none bg-white
          border rounded-lg px-3 py-2 pr-8
          text-sm text-gray-700
          hover:border-gray-300
          focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-600
        "
      >
        {/* Show placeholder when 'value' isn't in options (fallback) */}
        {!options.includes(value) && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {/* First option mirrors the screenshot text if it's a label-like value */}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === "Any" || opt === "All Sectors" ? placeholder : opt}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
