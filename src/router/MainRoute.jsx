import { createBrowserRouter } from "react-router";
import Home from "../pages/HomeLayoutPages/HomePage/Home";
import MainLayout from "../Layout/MainLayout/MainLayout";
import PrivacyPolicy from "../pages/HomeLayoutPages/PrivacyPolicyPage/PrivacyPolicy";
import Mobile from "../pages/HomeLayoutPages/AllProduct/Categories/Mobile/Mobile";
import Laptop from "../pages/HomeLayoutPages/AllProduct/Categories/Laptop/Laptop";
import DashboardLayout from "@/Layout/Dashboard/DashboardLayout";
import MainDashboard from "@/Layout/Dashboard/MainDashboard";
import Login from "@/pages/authentication/Login/Login";
import AuthLayout from "@/Layout/MainLayout/authLayout/authLayout";
import Register from "@/pages/authentication/register/Register";
import AllUsers from "@/Layout/Dashboard/AdminDashboard/components/AllUsers";
import Sellers from "@/Layout/Dashboard/AdminDashboard/components/Sellers";
import Products from "@/Layout/Dashboard/AdminDashboard/components/Products";
import Orders from "@/Layout/Dashboard/AdminDashboard/components/Orders";
import Finance from "@/Layout/Dashboard/AdminDashboard/components/Finance/Finance";
import Communication from "@/Layout/Dashboard/AdminDashboard/components/Communication/Communication";
import Settings from "@/Layout/Dashboard/AdminDashboard/components/Settings/Settings";
import Advanced from "@/Layout/Dashboard/AdminDashboard/components/Advanced/Advanced";
import Admin_Home from "@/Layout/Dashboard/AdminDashboard/components/Admin_Home/Admin_Home";
import { Reports } from "@/Layout/Dashboard/AdminDashboard/components/Reports_page/Reports";

const MainRoute = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/privacy_policy",
        Component: PrivacyPolicy,
      },
      {
        path: "/mobile",
        Component: Mobile,
      },
      {
        path: "/laptop",
        Component: Laptop,
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        index: true,
        element: <MainDashboard></MainDashboard>
      },
      {
        path: "home",
        element: <Admin_Home></Admin_Home>
      },
      {
        path: "users",
        element: <AllUsers></AllUsers>
      },
      {
        path: "sellers",
        element: <Sellers></Sellers>
      },
      {
        path: "products",
        element: <Products></Products>
      },
      {
        path: "orders",
        element: <Orders></Orders>,
      },
      {
        path: "finance",
        element: <Finance></Finance>
      },
      {
        path: "communication",
        element: <Communication></Communication>
      },
      {
        path: "reports",
        element: <Reports></Reports>
      },
      {
        path: "settings",
        element: <Settings></Settings>
      },
      {
        path: "advanced",
        element: <Advanced></Advanced>
      }

    ]
  }
]);

export default MainRoute;