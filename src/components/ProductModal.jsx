import React, { useState } from "react";
import { X } from "lucide-react";
import { getStatusColor } from "../utils/helpers";

export default function ProductModal({ product, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white/50 rounded-full p-1 transition-colors z-10"
          onClick={onClose}>
          <X className="w-6 h-6" />
        </button>

        <div className="h-64 bg-gray-200 flex items-center justify-center relative">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gray-300 animate-pulse"></div>
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover mix-blend-multiply p-4 transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400?text=Click+to+Upload+Image";
              setImageLoaded(true);
            }}
          />
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ₱{product.price.toFixed(2)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                SKU
              </p>
              <p className="text-base font-medium text-slate-900">
                {product.sku}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                UPC
              </p>
              <p className="text-base font-medium text-slate-900">
                {product.upc}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Department
              </p>
              <p className="text-base font-medium text-blue-600">
                {product.department}
              </p>
            </div>
            {product.fixture && (
              <div className="col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Fixture
                </p>
                <p className="text-base font-medium text-slate-900">
                  {product.fixture}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Stock Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    product.status
                  )}`}></div>
                <span className="text-base font-medium text-slate-900 capitalize">
                  {product.status === "green"
                    ? "In Stock"
                    : product.status === "yellow"
                    ? "Low Stock"
                    : "Out of Stock"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Quantity
              </p>
              <p className="text-xl font-bold text-slate-900">
                {product.quantity} pcs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
