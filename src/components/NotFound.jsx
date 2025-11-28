import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200">
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
