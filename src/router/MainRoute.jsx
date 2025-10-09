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
import Warranty from "@/pages/PolicyPages/Warranty/Warranty";
// import FAQ from "@/pages/PolicyPages/FAQ/FAQ";
import TermsOfService from "@/pages/PolicyPages/Terms/TermsOfService";
import { FAQ } from "@/pages/PolicyPages/FAQ/FAQ";
import AllProduct from "@/pages/HomeLayoutPages/AllProduct/All Product page/AllProduct";
import ProductDetails from "@/pages/HomeLayoutPages/AllProduct/All Product page/ProductDetails/ProductDetails";
import AllUsers from "@/Layout/Dashboard/AdminDashboard/components/AllUsers/AllUsers";
import Orders from "@/Layout/Dashboard/AdminDashboard/components/Orders/Orders";
import Finance from "@/Layout/Dashboard/AdminDashboard/components/Finance/Finance";
import { ModeratorOverview } from "@/Layout/Dashboard/ModeratorDashboard/components/ModeratorOverview/ModeratorOverview";
import { OrdersProducts } from "@/Layout/Dashboard/ModeratorDashboard/components/OrdersProducts/OrdersProducts";
import { UsersReviews } from "@/Layout/Dashboard/ModeratorDashboard/components/UsersReviews/UsersReviews";
import { SupportCommunication } from "@/Layout/Dashboard/ModeratorDashboard/components/SupportCommunication/SupportCommunication";
import ReportsAnalytics from "@/Layout/Dashboard/ModeratorDashboard/components/ReportsAnalytics/ReportsAnalytics";
import DeveloperNotes from "@/Layout/Dashboard/ModeratorDashboard/components/DeveloperNotes/DeveloperNotes";

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
        path: "/allProduct",
        Component: AllProduct,
      },
      {
        path: "/allProduct/:id",
        Component: ProductDetails,
        loader: ({params}) => fetch(`http://localhost:5000/api/products/${params.id}`)
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
        path: "/warranty",
        Component: Warranty,
      },
      // {
      //   path: "faq",
      //   Component: FAQ,
      // },
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
        element: <Advanced></Advanced>,
      },
      {
        path: "moderator-overview",
        element: <ModeratorOverview></ModeratorOverview>
      },
      {
        path: "orders-products",
        element: <OrdersProducts></OrdersProducts>
      },
      {
        path: "users-reviews",
        element: <UsersReviews></UsersReviews>
      },
      {
        path: "support-communication",
        element: <SupportCommunication></SupportCommunication>
      },
      {
        path: "reports-analytics",
        element: <ReportsAnalytics></ReportsAnalytics>
      },
      {
        path: "developer-notes",
        element: <DeveloperNotes></DeveloperNotes>
      },
    ],
  },
]);

export default MainRoute;
