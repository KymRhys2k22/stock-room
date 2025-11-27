import React from "react";
import CloudinaryImageUploader from "./components/CloudinaryImageUploader";

function UploadImage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-96">
      <CloudinaryImageUploader />
    </div>
  );
}

export default UploadImage;
