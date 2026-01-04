import React, { useState } from "react";
import { getStatusColor } from "../utils/helpers";

/**
 * ProductCard Component
 *
 * Detailed card view for products, used specifically in the "List View" mode.
 * Displays larger image, full details, and prominent price/quantity.
 *
 * @param {Object} product - Product data
 * @param {Function} onClick - Click handler
 */
export default function ProductCard({ product, onClick }) {
  // --- Progressive Image Loading ---
  const [imgSrc, setImgSrc] = useState(product.image);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    if (fallbackAttempt === 0) {
      setFallbackAttempt(1);
      setImageLoaded(false);
      setImgSrc(
        `https://res.cloudinary.com/dqtldfxeh/image/upload/products/${product.upc}`
      );
    } else if (fallbackAttempt === 1) {
      setFallbackAttempt(2);
      setImgSrc(
        "https://placehold.co/600x400/e2e8f0/94a3b8?text=Upload+\n+Image"
      );
      setImageLoaded(true);
    }
  };

  return (
    <section className="product-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <section className="flex gap-4">
        <div
          className="w-20 h-20 bg-gray-200  rounded-lg overflow-hidden flex-shrink-0 cursor-pointer relative"
          onClick={onClick}>
          {/* Loading animation */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
          )}
          <img
            src={imgSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover mix-blend-multiply ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-medium text-slate-900 dark:text-gray-100 truncate pr-2">
              {product.name}
            </h3>
            <span className="text-lg font-bold text-slate-900 dark:text-gray-100">
              ₱{product.price.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 mt-0.5">
            <p className="font-medium text-pink-500">{product.department}</p>
            <p>SKU: {product.sku}</p>
            <p>UPC: {product.upc}</p>
            {product.fixture && <p>Fixture: {product.fixture}</p>}
            {product.box && <p>Box: {product.box}</p>}
          </div>
        </div>
      </section>

      <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Quantity:
        </span>
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${getStatusColor(
              product.status
            )}`}></div>
          <span className="text-sm font-bold text-slate-900 dark:text-gray-100">
            {product.quantity} pcs
          </span>
        </div>
      </div>
    </section>
  );
}
