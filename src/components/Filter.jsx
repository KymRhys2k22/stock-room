import React from "react";
import { ArrowUpDown } from "lucide-react";

export default function Filter({ sortOrder, setSortOrder }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
        <ArrowUpDown className="w-4 h-4 text-gray-500" />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer appearance-none pr-4"
          style={{ backgroundImage: "none" }}>
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
