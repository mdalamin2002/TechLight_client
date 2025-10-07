import React from "react";
import { ScaleLoader } from "react-spinners";

const GlobalLoading = () => {
  return (
    <div
      className={` min-h-screen
      flex
      flex-col
      justify-center
      items-center `}
    >
      <ScaleLoader size={100} color="#0071e3" />
    </div>
  );
};

export default GlobalLoading;
