import React from "react";
import { Filter } from "lucide-react";

export default function Header({ title, headerText }) {
  const text = title;
  return (
    <header className="flex lg:px-96 items-center justify-between px-4 py-4 bg-gray-50 sticky top-0 z-10">
      <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
        <div className="w-4 h-0.5 bg-white mb-1"></div>
      </div>
      <h1 className="text-xl text-center font-bold text-slate-900">
        {headerText} {text}
      </h1>
      <Filter className="w-6 h-6 text-slate-900" />
    </header>
  );
}
