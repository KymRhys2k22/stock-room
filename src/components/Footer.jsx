import React from "react";
export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-12 text-center text-gray-500">
      <h3 className="text-lg font-bold">
        © {currentYear} Kym Rhys Mallari. All rights reserved.
      </h3>{" "}
      <p className="text-sm">Stock Room Manage System version 23</p>
    </footer>
  );
}
