import React from "react";

const TechLightLogo = ({
  size = 7,
  text = "TechLight",
  icon: Icon = null,
  overlayIcon: OverlayIcon = null,
  className = "",
  iconBgGradient = "from-cyan-500 to-blue-600",
  textGradient = "from-cyan-400 via-blue-400 to-purple-400",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Icon container */}
      <div className="relative">
        <div
          className={`relative flex justify-center items-center p-2 h-10 w-10 rounded-full bg-gradient-to-r ${iconBgGradient} shadow-md`}
        >
          {Icon && (
            <Icon className={`w-${size} h-${size} text-white`} fill="currentColor" />
          )}
          {OverlayIcon && (
            <OverlayIcon className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
          )}
        </div>
      </div>

      {/* Logo text */}
      <span
        className={`lg:block eagle-lake-regular hidden text-xl font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent`}
      >
        {text}
      </span>
    </div>
  );
};

export default TechLightLogo;
