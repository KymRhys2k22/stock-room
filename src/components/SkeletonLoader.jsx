import React from "react";

export default function SkeletonLoader() {
  return (
    <section className="product-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
      </div>
    </section>
  );
}
