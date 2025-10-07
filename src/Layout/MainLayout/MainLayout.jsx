
import { Outlet } from "react-router";
import Navbar from "../../Components/Shared/Navbar/Navbar";
import Footer from "../../Components/Shared/Footer/Footer";



const MainLayout = () => {

  return (
    <div className="bg-background">
      <Navbar />
      <div className="xl:mt-36 md:mt-22 mt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
