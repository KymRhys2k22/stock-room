import React from "react";
import CloudinaryImageUploader from "./components/CloudinaryImageUploader";
import Header from "./components/Header";
/**
 * UploadImage Component
 *
 * Page wrapper for the CloudinaryImageUploader.
 * Allows users to bulk upload images without associating them with specific products immediately.
 */
function UploadImage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-96">
      <Header
        headerText="Upload Image"
        title="Upload Image"
        sortOrder="default"
        setSortOrder={() => {}}
      />
      <CloudinaryImageUploader />
    </div>
  );
}

export default UploadImage;
