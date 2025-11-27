import React from "react";
import { Plus } from "lucide-react";

export default function FAB() {
  return (
    <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 z-40">
      <Plus className="w-8 h-8" />
    </button>
  );
}
