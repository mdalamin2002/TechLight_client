import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../../Components/Shared/Navbar/Navbar";
import Footer from "../../Components/Shared/Footer/Footer";
import { useDispatch } from "react-redux";
import { checkAuthState } from "../../store/authSlice"; 

const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <div className="bg-background">
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
