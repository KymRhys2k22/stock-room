import React, { useState } from "react";
import { getStatusColor } from "../utils/helpers";

/**
 * ImageGridView Component
 *
 * A simplified product card designed for the Grid View layout.
 * Visual-first representation of a product with essential info.
 * Includes progressive image loading and fallback logic.
 *
 * @param {Object} product - Product data object
 * @param {Function} onClick - Click handler to open product details
 */
export default function ImageGridView({ product, onClick }) {
  // --- State Management ---
  const [imgSrc, setImgSrc] = useState(product.image);
  const [fallbackAttempt, setFallbackAttempt] = useState(0); // 0=Primary, 1=Cloudinary, 2=Placeholder
  const [imageLoaded, setImageLoaded] = useState(false);

  /**
   * progressive image fallback handler
   * Tries alternative sources if the main image fails to load.
   */
  const handleImageError = () => {
    if (fallbackAttempt === 0) {
      // First fallback: try Cloudinary directly using UPC
      setFallbackAttempt(1);
      setImageLoaded(false);
      setImgSrc(
        `https://res.cloudinary.com/dqtldfxeh/image/upload/products/${product.upc}`
      );
    } else if (fallbackAttempt === 1) {
      // Second fallback: show "Upload Image" placeholder
      setFallbackAttempt(2);
      setImgSrc(
        "https://placehold.co/600x400/e2e8f0/94a3b8?text=Upload+\\n+Image"
      );
      setImageLoaded(true); // Placeholder is always "loaded"
    }
  };

  return (
    <div
      id="card"
      className="product-card opacity-80 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}>
      <div className="relative w-full aspect-square bg-gray-200">
        {/* Loading animation */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        )}
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover mix-blend-multiply transition-opacity ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
        />
      </div>
      <div className="p-3">
        <div className="flex  justify-between items-center">
          <h3 className="lg:text-sm text-xs font-medium text-slate-900 dark:text-gray-100 truncate">
            {product.name}
          </h3>
          <p
            className={`  ${
              product.box === "S"
                ? "dark:bg-pink-200 bg-pink-200 dark:text-pink-700 text-pink-700 text-sm px-2 py-1"
                : "dark:bg-gray-700 dark:text-white bg-gray-200 text-xs text-gray-700 px-1"
            }     text-center`}>
            {product.box === "S" ? (
              <span className="text-sm font-semibold">S</span>
            ) : (
              <>
                <span className="text-[0.6rem] font-semibold">BOX</span>
                <br />
                <span>{product.box}</span>
              </>
            )}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span
            className={`${
              product.price <= 68
                ? "animate-pulse text-red-500 dark:text-red-500 underline"
                : ""
            }text-lg font-bold text-slate-900 dark:text-gray-100 `}>
            ₱{product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${getStatusColor(
                product.status
              )}`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.quantity} pcs
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <p className="text-xs  text-gray-400">SKU: {product.sku}</p>
          <div className="text-right">
            <p className="text-xs text-pink-500 lg:text-gray-400">
              {product.fixture}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400  lg:text-xs">
            UPC: {product.upc}
          </p>
          <p className="hidden sm:block text-pink-500 lg:text-xs">
            <strong>
              {product.department.toLowerCase() === "outdoor & gms"
                ? "GMS"
                : product.department}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
