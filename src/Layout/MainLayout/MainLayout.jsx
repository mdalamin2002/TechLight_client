
import { Outlet, useLocation } from "react-router";
import Navbar from "../../Components/Shared/Navbar/Navbar";
import Footer from "../../Components/Shared/Footer/Footer";
import useAuth from "@/hooks/useAuth";
import GlobalLoading from "@/Components/Shared/Loading/GlobalLoading";



const MainLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();

  // Check if the current path is a support chat page
  const isSupportChatPage = location.pathname.startsWith('/support-chat');

    if(loading) return <GlobalLoading></GlobalLoading>

  return (
    <div className="bg-background">
      <Navbar />
      <div className="xl:mt-36 md:mt-32 mt-20">
        <Outlet />
      </div>
      {!isSupportChatPage && <Footer />}
    </div>
  );
};

export default MainLayout;
