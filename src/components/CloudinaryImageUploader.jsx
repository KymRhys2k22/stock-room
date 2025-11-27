import React, { useState } from "react";
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

/**
 * CloudinaryImageUploader Component
 *
 * CONFIGURATION:
 * 1. Set your CLOUDINARY_CLOUD_NAME below
 * 2. Set your CLOUDINARY_UPLOAD_PRESET (must be unsigned)
 * 3. Create an unsigned upload preset in Cloudinary Dashboard:
 *    Settings > Upload > Upload presets > Add upload preset > Set to "Unsigned"
 * CLOUDINARY_URL=cloudinary://584798137671192:ez88_02Cj9WmMtS4i2rwCP0tONg@dqtldfxeh
 */

const CLOUDINARY_CLOUD_NAME = "dqtldfxeh"; // TODO: Replace with your cloud name
const CLOUDINARY_UPLOAD_PRESET = "daisoimage"; // TODO: Replace with your unsigned preset
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function CloudinaryImageUploader() {
  const [sku, setSku] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle file selection and upload
   */
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (!sku.trim()) {
      setError("Please enter a SKU before uploading images");
      return;
    }

    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        setError(`${file.name} is not a valid image file`);
      }
      return isImage;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = validFiles.map((file, index) =>
        uploadToCloudinary(file, index)
      );

      const results = await Promise.all(uploadPromises);

      // Add new images to the list
      setUploadedImages((prev) => [...prev, ...results]);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  /**
   * Upload a single file to Cloudinary
   */
  const uploadToCloudinary = async (file, index) => {
    const formData = new FormData();

    // Generate public_id based on SKU and index
    const timestamp = Date.now();
    const publicId =
      uploadedImages.length === 0 && index === 0
        ? sku
        : `${sku}-${uploadedImages.length + index + 1}`;

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("public_id", publicId);
    formData.append("folder", "products"); // Optional: organize in a folder

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();

    return {
      id: data.public_id,
      url: data.secure_url,
      publicId: data.public_id,
      thumbnail: data.thumbnail_url || data.secure_url,
      createdAt: new Date().toISOString(),
    };
  };

  /**
   * Replace an existing image
   */
  const handleReplace = async (imageToReplace, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload with the same public_id to replace
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("public_id", imageToReplace.publicId);
      formData.append("folder", "products");
      formData.append("overwrite", "true"); // Overwrite existing image

      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Replace failed");
      }

      const data = await response.json();

      // Update the image in the list
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === imageToReplace.id
            ? {
                ...img,
                url: data.secure_url,
                thumbnail: data.thumbnail_url || data.secure_url,
                createdAt: new Date().toISOString(),
              }
            : img
        )
      );
    } catch (err) {
      setError(err.message || "Replace failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  /**
   * Remove an image from preview
   * Note: This only removes from UI, not from Cloudinary
   * To delete from Cloudinary, you need server-side API
   */
  const handleRemove = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  /**
   * Generate Cloudinary URL for a given SKU
   */
  const getCloudinaryUrl = (publicId) => {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.png`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Upload image of the UPC
        </h2>

        {/* SKU Input */}
        <div>
          <label
            htmlFor="sku"
            className="block text-sm font-medium text-gray-700 mb-2">
            Product SKU *
          </label>
          <input
            id="sku"
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Enter product SKU (e.g., ABC123)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Images will be saved as: {sku || "SKU"}.png, {sku || "SKU"}-1.png,
            etc.
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={!sku.trim() || uploading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                !sku.trim() || uploading
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                  : "border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400"
              }`}>
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-600 font-medium">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    Choose Images
                  </span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Configuration Warning */}
        {(CLOUDINARY_CLOUD_NAME === "your-cloud-name" ||
          CLOUDINARY_UPLOAD_PRESET === "your-upload-preset") && (
          <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Configuration Required
              </p>
              <p className="text-sm text-yellow-600">
                Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET at
                the top of this component.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Uploaded Images ({uploadedImages.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="relative group border border-gray-200 rounded-lg overflow-hidden">
                {/* Image Preview */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.publicId}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Info & Actions */}
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {image.publicId}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{image.url}</p>

                  <div className="flex gap-2">
                    {/* Replace Button */}
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleReplace(image, e)}
                        disabled={uploading}
                        className="hidden"
                      />
                      <div className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors text-center">
                        Replace
                      </div>
                    </label>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(image.id)}
                      disabled={uploading}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Remove
                    </button>
                  </div>
                </div>

                {/* Upload Success Indicator */}
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedImages.length === 0 && sku && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No images uploaded yet
          </h3>
          <p className="text-gray-500">
            Upload images for SKU:{" "}
            <span className="font-mono font-semibold">{sku}</span>
          </p>
        </div>
      )}
    </div>
  );
}
