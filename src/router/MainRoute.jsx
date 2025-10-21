import { createBrowserRouter } from "react-router";
import Home from "../pages/HomeLayoutPages/HomePage/Home";
import MainLayout from "../Layout/MainLayout/MainLayout";
import PrivacyPolicy from "../pages/HomeLayoutPages/PrivacyPolicyPage/PrivacyPolicy";
import Mobile from "../pages/HomeLayoutPages/AllProduct/Categories/Mobile/Mobile";
import DashboardLayout from "@/Layout/Dashboard/DashboardLayout";
import MainDashboard from "@/Layout/Dashboard/MainDashboard";
import AuthLayout from "@/Layout/MainLayout/authLayout/authLayout";
import Register from "@/pages/authentication/register/Register";
import Login from "@/pages/authentication/Login/Login";

// Admin Dashboard
import Sellers from "@/Layout/Dashboard/AdminDashboard/components/Sellers";
import Products from "@/Layout/Dashboard/AdminDashboard/components/Products";
import Communication from "@/Layout/Dashboard/AdminDashboard/components/Communication/Communication";
import Settings from "@/Layout/Dashboard/AdminDashboard/components/Settings/Settings";
import Advanced from "@/Layout/Dashboard/AdminDashboard/components/Advanced/Advanced";
import Admin_Home from "@/Layout/Dashboard/AdminDashboard/components/Admin_Home/Admin_Home";
import { Reports } from "@/Layout/Dashboard/AdminDashboard/components/Reports_page/Reports";
import AllUsers from "@/Layout/Dashboard/AdminDashboard/components/AllUsers/AllUsers";
import Orders from "@/Layout/Dashboard/AdminDashboard/components/Orders/Orders";
import Finance from "@/Layout/Dashboard/AdminDashboard/components/Finance/Finance";
import AddToCart from "@/pages/AddToCart page/AddToCart";

// Moderator Dashboard
import { ModeratorOverview } from "@/Layout/Dashboard/ModeratorDashboard/components/ModeratorOverview/ModeratorOverview";
import { OrdersProducts } from "@/Layout/Dashboard/ModeratorDashboard/components/OrdersProducts/OrdersProducts";
import { UsersReviews } from "@/Layout/Dashboard/ModeratorDashboard/components/UsersReviews/UsersReviews";
import { SupportCommunication } from "@/Layout/Dashboard/ModeratorDashboard/components/SupportCommunication/SupportCommunication";
import ReportsAnalytics from "@/Layout/Dashboard/ModeratorDashboard/components/ReportsAnalytics/ReportsAnalytics";
import DeveloperNotes from "@/Layout/Dashboard/ModeratorDashboard/components/DeveloperNotes/DeveloperNotes";
import ModeratorSettings from "@/Layout/Dashboard/ModeratorDashboard/components/ModeratorSettings/ModeratorSettings";
import Payments from "@/Layout/Dashboard/ModeratorDashboard/components/Payments/Payments";
import Notifications from "@/Layout/Dashboard/ModeratorDashboard/components/Notifications/Notifications";

// User Dashboard
import Profile from "@/Layout/Dashboard/UserDashboard/components/Profile/Profile";
// import MyOrders from "@/Layout/Dashboard/UserDashboard/components/MyOrders/MyOrders";
import Cart from "@/Layout/Dashboard/UserDashboard/components/Cart/Cart";
import Addresses from "@/Layout/Dashboard/UserDashboard/components/Addresses/Addresses";
import ReturnsRefunds from "@/Layout/Dashboard/UserDashboard/components/ReturnsRefunds/ReturnsRefunds";
import UserSettings from "@/Layout/Dashboard/UserDashboard/components/Settings/UserSettings";
import PaymentMethods from "@/Layout/Dashboard/UserDashboard/components/PaymentMethods/PaymentMethods";
import Overview from "@/Layout/Dashboard/UserDashboard/components/Overview/Overview";
import Support from "@/Layout/Dashboard/UserDashboard/components/Support/Support";

//seller dashboard
import SellerOverview from "@/Layout/Dashboard/SellerDashboard/components/SellerDashboardOverview/SellerOverview";
import MyProductsOrders from "@/Layout/Dashboard/SellerDashboard/components/MyProductsOrders/MyProductsOrders";
import MyProductsList from "@/Layout/Dashboard/SellerDashboard/components/MyProductsList/MyProductsList";
import SellerProfile from "@/Layout/Dashboard/SellerDashboard/components/SellerProfileSettings/components/SellerProfile";
import SellerSettings from "@/Layout/Dashboard/SellerDashboard/components/SellerProfileSettings/SellerSettings";
import AddNewProduct from "@/Layout/Dashboard/SellerDashboard/components/AddNewProduct/AddNewProduct";
import CouponManagement from "@/Layout/Dashboard/SellerDashboard/components/CouponManagement/CouponManagement";
import MyProductsEarnings from "@/Layout/Dashboard/SellerDashboard/components/MyProductsEarnings/MyProductsEarnings";
import ProductReviews from "@/Layout/Dashboard/SellerDashboard/components/ProductReviews/ProductReviews";
import EditProduct from "@/Layout/Dashboard/SellerDashboard/components/AddNewProduct/components/EditProduct";
import SalesAnalytics from "@/Layout/Dashboard/SellerDashboard/components/SalesAnalytics/SalesAnalytics";
import SupportHelp from "@/Layout/Dashboard/SellerDashboard/components/SupportHelp/SupportHelp";


// Policies
import { ReturnsRefundsPolicy } from "@/pages/PolicyPages/ReturnsRefundsPolicy/ReturnsRefundsPolicy";
import { OrderTrackingPolicy } from "@/pages/PolicyPages/OrderTrackingPolicy/OrderTrackingPolicy";
import TermsOfService from "@/pages/PolicyPages/Terms/TermsOfService";
import { FAQ } from "@/pages/PolicyPages/FAQ/FAQ";
import AddProduct from "@/Layout/Dashboard/AdminDashboard/components/Products/AddProduct";
import SupportChatPage from "@/pages/SupportChatPage/SupportChatPage";
import AllProduct from "@/pages/HomeLayoutPages/AllProduct/All Product page/AllProduct";
import ProductDetails from "@/pages/HomeLayoutPages/AllProduct/All Product page/ProductDetails/ProductDetails";
import Wishlists from "@/pages/Wishlist page/Wishlists";
import Wishlist from "@/Layout/Dashboard/UserDashboard/components/Wishlist/Wishlist";
import WarrantyPolicy from "@/pages/PolicyPages/Warranty/Warranty";
import PaymentSuccess from "@/pages/PaymentPages/PaymentSuccess";
import PaymentFail from "@/pages/PaymentPages/PaymentFail";
import PaymentCancel from "@/pages/PaymentPages/PaymentCancel";
import SupportManagement from "@/Layout/Dashboard/AdminDashboard/components/SupportManagement/SupportManagement";
import MyOrders from "@/Layout/Dashboard/UserDashboard/components/MyOrders/MyOrders";


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
        path: "/products/category/:category",
        Component: AllProduct,
      },
      {
        path: "/products/category/:category/:subcategory",
        Component: AllProduct,
      },
      {
        path: "/allProduct/:id",
        Component: ProductDetails,
        loader: ({ params }) =>
          fetch(
            `${import.meta.env.VITE_prod_baseURL}/products/details/${params.id}`
          ),
      },
      {
        path: "wishlist",
        Component: Wishlists,
      },
      {
        path: "addToCart",
        Component: AddToCart,
      },
      {
        path: "payment/success/:tranId",
        Component: PaymentSuccess,
      },
      {
        path: "payment/fail/:tranId",
        Component: PaymentFail,
      },
      {
        path: "payment/cancel/:tranId",
        Component: PaymentCancel,
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
        Component: WarrantyPolicy,
      },
      // {
      //   path: "faq",
      //   Component: FAQ,
      // },
      {
        path: "terms-service",
        Component: TermsOfService,
      },
      { index: true, Component: Home },
      { path: "/privacy_policy", Component: PrivacyPolicy },
      { path: "/mobile", Component: Mobile },
      { path: "/returns-refunds", Component: ReturnsRefundsPolicy },
      { path: "/order-tracking", Component: OrderTrackingPolicy },
      { path: "/terms-service", Component: TermsOfService },
      { path: "/faq", Component: FAQ },
      { path: "/support-chat/:conversationId", Component: SupportChatPage },
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
      { index: true, element: <MainDashboard></MainDashboard> },
      { path: "home", element: <Admin_Home></Admin_Home> },
      { path: "users", element: <AllUsers></AllUsers> },
      { path: "sellers", element: <Sellers></Sellers> },
      { path: "products", element: <Products></Products> },
      { path: "products/addProduct", element: <AddProduct></AddProduct> },
      { path: "orders", element: <Orders></Orders> },
      { path: "finance", element: <Finance></Finance> },
      { path: "communication", element: <Communication></Communication> },
      { path: "reports", element: <Reports></Reports> },
      { path: "settings", element: <Settings></Settings> },
      { path: "advanced", element: <Advanced></Advanced> },
      { path: "admin/support", element: <SupportManagement></SupportManagement> },

      // Moderator Routes
      {
        path: "moderator-overview",
        element: <ModeratorOverview></ModeratorOverview>,
      },
      { path: "orders-products", element: <OrdersProducts></OrdersProducts> },
      { path: "users-reviews", element: <UsersReviews></UsersReviews> },
      {
        path: "support-communication",
        element: <SupportCommunication></SupportCommunication>,
      },
      {
        path: "reports-analytics",
        element: <ReportsAnalytics></ReportsAnalytics>,
      },
      { path: "developer-notes", element: <DeveloperNotes></DeveloperNotes> },
      {
        path: "moderator-settings",
        element: <ModeratorSettings></ModeratorSettings>,
      },
      // Moderator Payment routes
      { path: "payments", element: <Payments></Payments> },

      { path: "notifications", element: <Notifications></Notifications> },

      //seller routes
      {path: "seller-overview", element: <SellerOverview/>},
      {path: "seller-products-orders", element: <MyProductsOrders/> },
      {path: "seller-products-list", element: <MyProductsList/> },
      {path: "seller-profile", element: <SellerProfile/> },
      {path: "seller-settings", element: <SellerSettings/> },
      {path: "seller-add-product", element: <AddNewProduct/>},
      {path: "seller-coupons", element: <CouponManagement/>},
      {path: "seller-earnings", element: <MyProductsEarnings/>},
      {path: "seller-products-reviews", element: <ProductReviews/>},
      {path: "seller-product-edit/:id", element: <EditProduct/>},
      {path: "sales-analytics", element: <SalesAnalytics/>},
      {path: "seller-support-help", element: <SupportHelp/>},

      // User Routes
      { path: "my-overview", element: <Overview></Overview> },
      { path: "my-profile", element: <Profile></Profile> },
      { path: "my-orders", element: <MyOrders></MyOrders> },
      { path: "my-wishlist", element: <Wishlist></Wishlist> },
      { path: "my-cart", element: <Cart></Cart> },
      { path: "my-addresses", element: <Addresses></Addresses> },
      {
        path: "my-payment-methods",
        element: <PaymentMethods></PaymentMethods>,
      },
      { path: "my-returns", element: <ReturnsRefunds></ReturnsRefunds> },
      { path: "my-settings", element: <UserSettings></UserSettings> },
      { path: "my-support", element: <Support></Support> },
    ],
  },
]);

export default MainRoute;
