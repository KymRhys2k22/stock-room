import React, { useState, useEffect } from "react";
import { Plus, X, Trash2, Save, Edit2, Loader2, Upload } from "lucide-react";

// REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzltjf-_WBUKxZ7Jrf4OJvdVJ6zjo0IlaLnhqlJnZAcujoydH8-pE73oQ-mRuM3LWmz/exec";
const DATA_URL =
  "https://opensheet.elk.sh/1sZuuC4o44rh-yRYaeeRFRo4HeOhMj6x6y4ux96D5nok/Master";

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' or 'update'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    upc: "",
    fixture: "",
    qty: "",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(DATA_URL);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill/Check if UPC+Fixture exists
    const currentUpc = name === "upc" ? value : formData.upc;
    const currentFixture = name === "fixture" ? value : formData.fixture;

    // CREATE MODE: Warn if duplicate
    if (mode === "create" && currentUpc && currentFixture) {
      const existing = items.find(
        (item) => item.UPC === currentUpc && item.FIXTURE === currentFixture
      );
      if (existing) {
        setMessage("This UPC is already in this Fixture. Switch to Update?");
      } else {
        setMessage("");
      }
    }

    // UPDATE/DELETE MODE: Auto-fill if UPC is typed and unique
    if (mode === "update" && name === "upc" && value) {
      const matches = items.filter((item) => item.UPC === value);
      if (matches.length === 1) {
        // Unique match found, auto-fill
        setFormData((prev) => ({
          ...prev,
          fixture: matches[0].FIXTURE || "",
          qty: matches[0].QTY || "",
        }));
        setMessage("Item found. Details auto-filled.");
      } else if (matches.length > 1) {
        setMessage(
          `Found ${matches.length} items with this UPC. Please specify Fixture.`
        );
      } else {
        setMessage("UPC not found in local list.");
      }
    }
  };

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const CLOUDINARY_CLOUD_NAME = "dqtldfxeh";
  const CLOUDINARY_UPLOAD_PRESET = "daisoimage";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!formData.upc) {
      setUploadError("Please enter a UPC first.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      uploadData.append("public_id", formData.upc);
      uploadData.append("folder", "products");

      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      setUploadSuccess("Image uploaded successfully!");
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (action) => {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
      alert("Please configure the APPS_SCRIPT_URL in FAB.jsx");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      // Use URLSearchParams for application/x-www-form-urlencoded
      // This is often more reliable for Apps Script than raw JSON
      const formDataParams = new URLSearchParams();
      formDataParams.append("action", action);
      formDataParams.append("upc", formData.upc);
      formDataParams.append("fixture", formData.fixture);
      formDataParams.append("qty", formData.qty);

      // Use no-cors if needed, but for JSON response we need cors.
      // Apps Script Web App should be deployed as "Anyone" to support CORS.
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: formDataParams,
      });

      const result = await res.json();

      if (result.status === "success") {
        setMessage(`Success: ${result.message}`);
        setFormData({ upc: "", fixture: "", qty: "" });
        setUploadSuccess(null); // Reset upload status
        if (action === "delete") setIsOpen(false);
        fetchData(); // Reload data
        // Optionally trigger a global reload if needed, but this component manages its own list for now
        // To update the main App list, we'd need a callback prop or context.
        // For now, we reload the page to reflect changes in the main list if desired:
        window.location.reload();
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setMessage("Network error or CORS issue. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (modeType = "create") => {
    setMode(modeType);
    setIsOpen(true);
    setMessage("");
    setFormData({ upc: "", fixture: "", qty: "" });
  };

  return (
    <>
      <button
        onClick={() => openModal("create")}
        className="fixed bottom-6 md:bottom-10 right-6 md:right-10 w-14 h-14 bg-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 z-40">
        <Plus className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {mode === "create" ? "Add New Item" : "Update / Delete Item"}
            </h2>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode("create")}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  mode === "create"
                    ? "bg-pink-100 text-pink-700 border border-pink-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                Create
              </button>
              <button
                onClick={() => setMode("update")}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  mode === "update"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                Update / Delete
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPC (Unique ID)
                </label>
                <input
                  type="text"
                  name="upc"
                  value={formData.upc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter UPC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fixture
                </label>
                <input
                  type="text"
                  name="fixture"
                  value={formData.fixture}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g. C1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="flex items-center gap-2">
                  <label
                    className={`flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                      !formData.upc ? "opacity-50 cursor-not-allowed" : ""
                    }`}>
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2 text-gray-500" />
                        <span>Upload Photo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading || !formData.upc}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadError && (
                  <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                )}
                {uploadSuccess && (
                  <p className="text-xs text-green-500 mt-1">{uploadSuccess}</p>
                )}
              </div>

              {message && (
                <div
                  className={`text-sm p-2 rounded ${
                    message.startsWith("Success")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {mode === "create" ? (
                  <button
                    onClick={() => handleSubmit("create")}
                    disabled={submitting || !formData.upc}
                    className="flex-1 bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors flex items-center justify-center disabled:opacity-50">
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" /> Create
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSubmit("update")}
                      disabled={
                        submitting || !formData.upc || !formData.fixture
                      }
                      className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50">
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4 mr-2" /> Update
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleSubmit("delete")}
                      disabled={
                        submitting || !formData.upc || !formData.fixture
                      }
                      className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50">
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
