import React from "react";
import { ListFilter, Menu, Home, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

export default function Header({ title, headerText, sortOrder, setSortOrder }) {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, menuRef]);

  const handleSortChange = (value) => {
    setSortOrder(value);
    setIsDropdownOpen(false);
  };

  const text = title;
  return (
    <header className="flex lg:px-96 shadow-sm md:px-10 items-center justify-between px-4 py-4 bg-gray-50 sticky top-0 z-10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 border border-gray-100">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none flex items-center">
          <Menu className="w-7 h-7 text-slate-900" />
        </button>

        {isMenuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  items-center gap-2">
              <Home className="w-4 h-4" />
              HOME
            </Link>
            <Link
              to="/upload-image"
              onClick={() => setIsMenuOpen(false)}
              className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  items-center gap-2">
              <Upload className="w-4 h-4" />
              UPLOAD IMAGE
            </Link>
            <div className="px-4 py-2 border-t border-gray-100">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm text-gray-700 hover:text-gray-900 w-full text-left">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-2">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm text-gray-700">
                    {user?.firstName || user?.username || "User"}
                  </span>
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>

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
