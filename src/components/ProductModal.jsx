import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { getStatusColor } from "../utils/helpers";

const CLOUDINARY_CLOUD_NAME = "dqtldfxeh";
const CLOUDINARY_UPLOAD_PRESET = "daisoimage";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function ProductModal({ product, onClose }) {
  const [imgSrc, setImgSrc] = useState(product?.image || "");
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Reset image states when product changes
  useEffect(() => {
    if (product) {
      setImgSrc(product.image);
      setFallbackAttempt(0);
      setImageLoaded(false);
      setUploadError(null);
    }
  }, [product]);

  const handleImageError = () => {
    if (fallbackAttempt === 0) {
      // First fallback: try Cloudinary
      setFallbackAttempt(1);
      setImgSrc(
        `https://res.cloudinary.com/dqtldfxeh/image/upload/products/${product.upc}`
      );
    } else if (fallbackAttempt === 1) {
      // Second fallback: show placeholder
      setFallbackAttempt(2);
      setImgSrc("https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image");
      setImageLoaded(true); // Stop showing loading animation for placeholder
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("public_id", product.upc);
      formData.append("folder", "products");

      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();

      // Update image with the new uploaded URL
      setImgSrc(data.secure_url);
      setFallbackAttempt(1); // Set to Cloudinary fallback state
      setImageLoaded(false);
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

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
            src={imgSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain mix-blend-multiply"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />

          {/* Upload Button Overlay - shown when placeholder is displayed */}
          {fallbackAttempt === 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="font-medium">Upload Image</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
              {uploadError}
            </div>
          )}
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
