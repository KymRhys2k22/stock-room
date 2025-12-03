import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
}) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none shadow-sm">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-white dark:bg-gray-800 shadow-sm
         text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2
          focus:ring-pink-500 dark:focus:ring-pink-400"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
