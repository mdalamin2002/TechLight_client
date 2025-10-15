import React, { useMemo, useState } from "react";

/**
 * Simple, reusable local-only role switcher for development.
 * - Displays current role
 * - Cycles through roles on each click
 * - Calls optional onChange callback
 * - Shows alert confirmation
 */
const RoleSwitcher = ({
  roles = ["user", "admin", "developer"],
  initialRole = "user",
  onChange,
  className = "",
  buttonLabel = "Switch Role",
}) => {
  const normalizedRoles = useMemo(
    () => (Array.isArray(roles) && roles.length ? roles.map(String) : ["user", "admin", "developer"]),
    [roles]
  );

  const [currentRole, setCurrentRole] = useState(
    normalizedRoles.includes(String(initialRole)) ? String(initialRole) : normalizedRoles[0]
  );

  const handleClick = () => {
    const idx = normalizedRoles.indexOf(currentRole);
    const next = normalizedRoles[(idx + 1) % normalizedRoles.length];
    setCurrentRole(next);
    if (typeof onChange === "function") onChange(next);
    // Confirmation for quick dev feedback
    alert(`Role changed to: ${next}`);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-600">Current role:</span>
      <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm capitalize border">{currentRole}</span>
      <button
        type="button"
        onClick={handleClick}
        className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default RoleSwitcher;


