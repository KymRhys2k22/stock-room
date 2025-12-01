import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Save, Edit2, Loader2 } from "lucide-react";
import { getStatusColor } from "../utils/helpers";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function ProductModal({ product, onClose }) {
  const [imgSrc, setImgSrc] = useState(product?.image || "");
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // CRUD States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ fixture: "", qty: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const APPS_SCRIPT_URL_VITE = import.meta.env.VITE_APPS_SCRIPT_URL;
  console.log(APPS_SCRIPT_URL_VITE);
  const APPS_SCRIPT_URL = `https://script.google.com/macros/s/${APPS_SCRIPT_URL_VITE}/exec`;

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      setImgSrc(product.image);
      setFallbackAttempt(0);
      setImageLoaded(false);
      setUploadError(null);
      setIsEditing(false);
      setEditData({
        fixture: product.fixture || "",
        qty: product.quantity || "",
      });
      setMessage("");
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

  const handleUpdate = async () => {
    setSubmitting(true);
    setMessage("");

    try {
      const formDataParams = new URLSearchParams();
      formDataParams.append("action", "update");
      formDataParams.append("upc", product.upc);
      formDataParams.append("fixture", editData.fixture);
      formDataParams.append("qty", editData.qty);

      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: formDataParams,
      });

      const result = await res.json();

      if (result.status === "success") {
        setMessage("Updated successfully!");
        window.location.reload();
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage("Network error. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setSubmitting(true);
    setMessage("");

    try {
      const formDataParams = new URLSearchParams();
      formDataParams.append("action", "delete");
      formDataParams.append("upc", product.upc);
      formDataParams.append("fixture", product.fixture); // Use original fixture for delete lookup
      formDataParams.append("qty", product.quantity);

      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: formDataParams,
      });

      const result = await res.json();

      if (result.status === "success") {
        setMessage("Deleted successfully!");
        window.location.reload();
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage("Network error. Check console.");
    } finally {
      setSubmitting(false);
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
                <div className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
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
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-3xl font-bold text-pink-500 mt-2">
                ₱{product.price.toFixed(2)}
              </p>
            </div>
            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50">
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
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
              <p className="text-base font-medium text-pink-500">
                {product.department}
              </p>
            </div>

            {/* Editable Fields */}
            <div className="col-span-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Fixture
              </p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.fixture}
                  onChange={(e) =>
                    setEditData({ ...editData, fixture: e.target.value })
                  }
                  className="w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <p className="text-base font-medium text-slate-900">
                  {product.fixture}
                </p>
              )}
            </div>
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
              {isEditing ? (
                <input
                  type="number"
                  value={editData.qty}
                  onChange={(e) =>
                    setEditData({ ...editData, qty: e.target.value })
                  }
                  className="w-24 mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 text-right"
                />
              ) : (
                <p className="text-xl font-bold text-slate-900">
                  {product.quantity} pcs
                </p>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpdate}
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50">
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={submitting}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          )}

          {message && (
            <div
              className={`text-sm p-2 rounded mt-2 ${
                message.startsWith("Error") || message.startsWith("Network")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
