import React from "react";
import { EDU_BRANCHES } from "../data/EduBranches";

export default function EduBranchSelect({ careerId, onSelect }) {
  const branches = EDU_BRANCHES[careerId] || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Select Your Branch
      </h2>

      {branches.length === 0 && (
        <p className="text-gray-500">No branches available.</p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {branches.map((branch) => (
          <div
            key={branch.id}
            onClick={() => onSelect(branch.id)}
            className="p-4 bg-gray-100 rounded-xl shadow cursor-pointer
                       hover:bg-blue-100 hover:shadow-lg transition-all"
          >
            <p className="text-lg font-semibold text-gray-700">
              {branch.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
