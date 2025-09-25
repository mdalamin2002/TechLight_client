import { createBrowserRouter } from "react-router";
import Home from "../pages/HomeLayoutPages/HomePage/Home";
import MainLayout from "../Layout/MainLayout/MainLayout";
import PrivacyPolicy from "../pages/HomeLayoutPages/PrivacyPolicyPage/PrivacyPolicy";
import Mobile from "../pages/HomeLayoutPages/AllProduct/Categories/Mobile/Mobile";
import Laptop from "../pages/HomeLayoutPages/AllProduct/Categories/Laptop/Laptop";
import { ReturnsRefundsPolicy } from "@/pages/PolicyPages/ReturnsRefundsPolicy/ReturnsRefundsPolicy";
import { OrderTrackingPolicy } from "@/pages/PolicyPages/OrderTrackingPolicy/OrderTrackingPolicy";

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
      {
        path: "/returns-refunds",
        Component: ReturnsRefundsPolicy,
      },
      {
        path: "/order-tracking",
        Component: OrderTrackingPolicy,
      },
    ],
  },
]);

export default MainRoute;
