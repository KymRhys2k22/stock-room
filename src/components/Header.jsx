import React from "react";
import { ListFilter, Menu } from "lucide-react";

export default function Header({ title, headerText, sortOrder, setSortOrder }) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSortChange = (value) => {
    setSortOrder(value);
    setIsDropdownOpen(false);
  };

  const text = title;
  return (
    <header className="flex lg:px-96 items-center justify-between px-4 py-4 bg-gray-50 sticky top-0 z-10">
      <Menu className="w-6 h-6 text-slate-900" />
      <h1 className="text-xl text-center font-bold text-slate-900 pl-2">
        {headerText} {text}
      </h1>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="focus:outline-none">
          <ListFilter className="w-6 h-6 text-slate-900" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
            <button
              onClick={() => handleSortChange("default")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "default"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              Default
            </button>
            <button
              onClick={() => handleSortChange("price-asc")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "price-asc"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              <strong>Price:</strong> Low to High
            </button>
            <button
              onClick={() => handleSortChange("price-desc")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "price-desc"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              <strong>Price:</strong> High to Low
            </button>
            <button
              onClick={() => handleSortChange("quantity-asc")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "quantity-asc"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              <strong>Stock:</strong> Low to High
            </button>
            <button
              onClick={() => handleSortChange("quantity-desc")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "quantity-desc"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              <strong>Stock:</strong> High to Low
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
