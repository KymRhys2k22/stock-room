import React from "react";
import {
  ListFilter,
  Menu,
  Home,
  Upload,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function Header({ title, headerText, sortOrder, setSortOrder }) {
  const { user } = useUser();

  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      // Logic to ignore clicks if they are inside Clerk elements (portals)
      // This prevents the menu from closing if you do decide to keep UserButton interactions
      if (event.target.closest(".cl-component")) {
        return;
      }

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

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate("/");
  };

  const text = title;

  return (
    <header className="flex lg:px-96 shadow-sm md:px-10 items-center justify-between px-4 py-4 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-15 dark:bg-opacity-90 border border-gray-100 dark:border-gray-800">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none flex items-center">
          <Menu className="w-7 h-7 text-slate-900 dark:text-gray-100" />
        </button>

        {isMenuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black dark:ring-gray-700 ring-opacity-5">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 items-center gap-2">
              <Home className="w-4 h-4" />
              HOME
            </Link>
            <Link
              to="/upload-image"
              onClick={() => setIsMenuOpen(false)}
              className="flex px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 items-center gap-2">
              <Upload className="w-4 h-4" />
              UPLOAD IMAGE
            </Link>
            <button
              onClick={toggleDarkMode}
              className="flex px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 items-center gap-2">
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  LIGHT MODE
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  DARK MODE
                </>
              )}
            </button>
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 w-full text-left">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    {user?.imageUrl && (
                      <img
                        src={user?.imageUrl}
                        alt="User"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 overflow-hidden text-ellipsis">
                      {user?.firstName || user?.username || "User"}
                    </span>
                  </div>
                  {/* Custom Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 py-1">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>

      {/* ... Rest of your component (Header Text and Sort Dropdown) ... */}
      <h1 className="text-xl text-center font-bold text-slate-900 dark:text-gray-100 pl-2">
        {headerText} {text}
      </h1>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="focus:outline-none">
          <ListFilter className="w-6 h-6 text-slate-900 dark:text-gray-100" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 ring-1 ring-black dark:ring-gray-700 ring-opacity-5">
            <button
              onClick={() => handleSortChange("default")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "default"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
              Default
            </button>
            <button
              onClick={() => handleSortChange("price-asc")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "price-asc"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
              <strong>Price:</strong> Low to High
            </button>
            <button
              onClick={() => handleSortChange("price-desc")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "price-desc"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
              <strong>Price:</strong> High to Low
            </button>
            <button
              onClick={() => handleSortChange("quantity-asc")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "quantity-asc"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
              <strong>Stock:</strong> Low to High
            </button>
            <button
              onClick={() => handleSortChange("quantity-desc")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                sortOrder === "quantity-desc"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
              <strong>Stock:</strong> High to Low
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
