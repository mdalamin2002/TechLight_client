import React from "react";
import { FileDown } from "lucide-react";

export  const ExportButton = ({ onExport }) => (
  <button
    onClick={onExport}
    className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition"
  >
    <FileDown size={16} /> Export Report
  </button>
);
