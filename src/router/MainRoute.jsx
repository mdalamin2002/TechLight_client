import { createBrowserRouter } from "react-router";
import Home from "../pages/HomeLayoutPages/HomePage/Home";
import MainLayout from "../Layout/MainLayout/MainLayout";
import PrivacyPolicy from "../pages/HomeLayoutPages/PrivacyPolicyPage/PrivacyPolicy";
import Mobile from "../pages/HomeLayoutPages/AllProduct/Categories/Mobile/Mobile";
import DashboardLayout from "@/Layout/Dashboard/DashboardLayout";
import MainDashboard from "@/Layout/Dashboard/MainDashboard";
import AuthLayout from "@/Layout/MainLayout/authLayout/authLayout";
import Register from "@/pages/authentication/register/Register";
import Sellers from "@/Layout/Dashboard/AdminDashboard/components/Sellers";
import Products from "@/Layout/Dashboard/AdminDashboard/components/Products";
import Communication from "@/Layout/Dashboard/AdminDashboard/components/Communication/Communication";
import Settings from "@/Layout/Dashboard/AdminDashboard/components/Settings/Settings";
import Advanced from "@/Layout/Dashboard/AdminDashboard/components/Advanced/Advanced";
import Admin_Home from "@/Layout/Dashboard/AdminDashboard/components/Admin_Home/Admin_Home";
import { Reports } from "@/Layout/Dashboard/AdminDashboard/components/Reports_page/Reports";
import { ReturnsRefundsPolicy } from "@/pages/PolicyPages/ReturnsRefundsPolicy/ReturnsRefundsPolicy";
import { OrderTrackingPolicy } from "@/pages/PolicyPages/OrderTrackingPolicy/OrderTrackingPolicy";
import Login from "@/pages/authentication/Login/Login";
import TermsOfService from "@/pages/PolicyPages/Terms/TermsOfService";
import { FAQ } from "@/pages/PolicyPages/FAQ/FAQ";
import Profile from "@/Layout/Dashboard/UserDashboard/components/Profile/Profile";
import MyOrders from "@/Layout/Dashboard/UserDashboard/components/MyOrders/MyOrders";
import Wishlist from "@/Layout/Dashboard/UserDashboard/components/Wishlist/Wishlist";
import Cart from "@/Layout/Dashboard/UserDashboard/components/Cart/Cart";
import Addresses from "@/Layout/Dashboard/UserDashboard/components/Addresses/Addresses";
import ReturnsRefunds from "@/Layout/Dashboard/UserDashboard/components/ReturnsRefunds/ReturnsRefunds";
import Coupons from "@/Layout/Dashboard/AdminDashboard/components/Communication/components/Coupons";
import UserSettings from "@/Layout/Dashboard/UserDashboard/components/Settings/UserSettings";
import Finance from "../Layout/Dashboard/AdminDashboard/components/Finance/Finance";
import PaymentMethods from "../Layout/Dashboard/UserDashboard/components/PaymentMethods/PaymentMethods";
import Overview from "../Layout/Dashboard/UserDashboard/components/Overview/Overview";
import AllUsers from "../Layout/Dashboard/AdminDashboard/components/AllUsers/AllUsers";
import Orders from "../Layout/Dashboard/AdminDashboard/components/Orders/Orders";

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
        path: "/returns-refunds",
        Component: ReturnsRefundsPolicy,
      },
      {
        path: "/order-tracking",
        Component: OrderTrackingPolicy,
      },
      {
        path: "terms-service",
        Component: TermsOfService,
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
        element: <MainDashboard></MainDashboard>,
      },
      {
        path: "home",
        element: <Admin_Home></Admin_Home>,
      },
      {
        path: "users",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "sellers",
        element: <Sellers></Sellers>,
      },
      {
        path: "products",
        element: <Products></Products>,
      },
      {
        path: "orders",
        element: <Orders></Orders>,
      },
      {
        path: "finance",
        element: <Finance></Finance>,
      },
      {
        path: "communication",
        element: <Communication></Communication>,
      },
      {
        path: "reports",
        element: <Reports></Reports>,
      },
      {
        path: "settings",
        element: <Settings></Settings>,
      },
      {
        path: "advanced",
        element: <Advanced></Advanced>
      },
      // User Route
 {
      path: "overview",
      element: <Overview></Overview>
    },
 {
      path: "profile",
      element: <Profile></Profile>
    },
    {
      path: "Myorders",
      element: <MyOrders></MyOrders>
    },
    {
      path: "wishlist",
      element: <Wishlist></Wishlist>
    },
    {
      path: "cart",
      element: <Cart></Cart>
    },
    {
      path: "addresses",
      element: <Addresses></Addresses>
    },
    {
      path: "payment-methods",
      element: <PaymentMethods></PaymentMethods>
    },
    {
      path: "returns",
      element: <ReturnsRefunds></ReturnsRefunds>
    },
    {
      path: "Usersettings",
      element: <UserSettings></UserSettings>
    },
    ]
  }
]);

export default MainRoute;
