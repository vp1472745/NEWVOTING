import React from "react";

const CandidateSidebar = ({ active, onNavigate }) => (
  <div className="w-50 bg-white shadow-md h-[60] p-6">
    <ul className="space-y-4">
      <li>
        <button
          className={`w-full text-left ${active === "profile" ? "font-bold text-blue-600" : ""}`}
          onClick={() => onNavigate("profile")}
        >
          Profile
        </button>
      </li>
      <li>
        <button
          className={`w-full text-left ${active === "edit" ? "font-bold text-blue-600" : ""}`}
          onClick={() => onNavigate("edit")}
        >
          Edit Profile
        </button>
      </li>
      <li>
        <button
          className={`w-full text-left ${active === "results" ? "font-bold text-blue-600" : ""}`}
          onClick={() => onNavigate("results")}
        >
          Results
        </button>
      </li>
    </ul>
  </div>
);

export default CandidateSidebar;