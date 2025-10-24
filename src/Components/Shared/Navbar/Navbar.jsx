import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Percent,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  UserCircle,
  Lightbulb,
  Zap,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import TechLightLogo from "../Logo/TechLightLogo";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
// import { toast } from "react-toastify"; // Unused - managed in UserMenu
// import { auth } from "@/firebase/firebase.init"; // Unused - managed in UserMenu
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import axios from "axios";

// Subcomponents
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import CategoryNav from "./CategoryNav";
import MobileBottomNav from "./MobileBottomNav";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOutUser } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // const [profileOpen, setProfileOpen] = useState(false); // Unused - managed in UserMenu
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  // const [openCategoryIndex, setOpenCategoryIndex] = useState(null); // Unused - managed in MobileMenu
  const [shopMegaMenu, setShopMegaMenu] = useState([]);

  // const profileRef = useRef(null); // Unused - managed in UserMenu
  const API_URL = import.meta.env.VITE_prod_baseURL;

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const data = response.data;

        const formatted = data.map((cat) => ({
          title: cat.category,
          items: cat.subCategory || [],
        }));
        setShopMegaMenu(formatted);
      } catch (err) {
        console.error("Failed to fetch categories:", err);

        // fallback
        setShopMegaMenu([
          {
            title: "Smart Home",
            items: ["Security Cameras", "Smart Lights", "Voice Assistants"],
          },
          { title: "Mobile", items: ["Smartphones", "Tablets"] },
          { title: "Wearables", items: ["Fitness Bands", "Smart Watches"] },
          { title: "Audio", items: ["Headphones", "Earbuds", "Speakers"] },
          { title: "Gaming", items: ["PlayStation & Xbox", "VR Headsets"] },
          { title: "Computing", items: ["Desktops", "Keyboards", "Mouse"] },
          {
            title: "Accessories",
            items: ["Power Banks", "Cables & Chargers", "Storage Devices"],
          },
        ]);
      }
    };
    fetchCategories();
  }, [API_URL]);

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80)
        setShowNavbar(false);
      else setShowNavbar(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close profile dropdown on outside click
  // useEffect(() => {
  //   const handler = (e) => {
  //     if (profileRef.current && !profileRef.current.contains(e.target)) {
  //       setProfileOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handler);
  //   return () => document.removeEventListener("mousedown", handler);
  // }, []); // Unused - managed in UserMenu

  // const toggleCategory = (index) => {
  //   setOpenCategoryIndex(openCategoryIndex === index ? null : index);
  // }; // Unused - managed in MobileMenu

  const handleRedirect = (path) => {
    if (!user) navigate("/auth/login");
    else navigate(path);
  };

  // const handleLogout = () => {
  //   logOutUser(auth)
  //     .then(() => toast.success("Logged out successfully!"))
  //     .catch(() => toast.error("Failed to logout"));
  //   setProfileOpen(false);
  // }; // Unused - managed in UserMenu

  const isActiveRoute = (route) => location.pathname === route;
  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  return (
    <>
      {/* TOP NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm text-foreground"
        style={{
          transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Main Top Bar */}
        <div className="border-b border-border/50">
          <div className="container mx-auto h-16 flex items-center justify-between gap-4">
            {/* LEFT: Menu + Logo */}
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex xl:hidden items-center gap-2"
              >
                {isCategoriesOpen ? <X size={18} /> : <Menu size={18} />}
                <span className="text-sm font-medium hidden sm:inline">
                  Categories
                </span>
              </Button>

              <Link
                to="/"
                className="flex items-center p-2 hover:bg-primary/5 rounded-xl transition-all duration-300"
              >
                <TechLightLogo
                  icon={Lightbulb}
                  overlayIcon={Zap}
                  size={6}
                  text="TechLight"
                  iconBgGradient="from-primary to-accent"
                  textGradient="from-primary to-accent"
                />
              </Link>
            </div>

            {/* CENTER: Search Bar - Desktop/Tablet (md+) */}
            <div className="hidden md:flex flex-1 justify-center max-w-3xl mx-4">
              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </Button>

              {/* Wishlist & Cart */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRedirect("/wishlist")}
                  className="flex gap-2"
                >
                  <div className="relative">
                    <Heart size={22} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:inline">Wishlist</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRedirect("/addToCart")}
                  className="flex gap-2"
                >
                  <div className="relative">
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden lg:inline">Cart</span>
                </Button>
              </div>

              {/* Profile / Account */}
              <UserMenu user={user} logOutUser={logOutUser} />
            </div>
          </div>
        </div>

        {/* Mobile Search (Dropdown style) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-border overflow-hidden"
            >
              <div className="px-4 py-3">
                <SearchBar 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery}
                  isMobile={true}
                  autoFocus={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XL+ Categories Bar */}
        <CategoryNav categories={shopMegaMenu} />
      </header>

      {/* Mobile Categories Drawer - <XL */}
      <MobileMenu 
        isOpen={isCategoriesOpen} 
        onClose={() => setIsCategoriesOpen(false)}
        categories={shopMegaMenu}
      />

      {/* Bottom Mobile Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border shadow-lg z-40">
        <div className="grid grid-cols-3 gap-1 px-2 py-2">
          <Button
            variant="ghost"
            asChild
            className="flex-col h-auto py-2 gap-1"
          >
            <Link
              to="/offers"
              className={`flex flex-col items-center ${
                isActiveRoute("/offers") ? "text-primary" : ""
              }`}
            >
              <Percent size={20} />
              <span className="text-xs">Offers</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleRedirect("/wishlist")}
            className="flex-col h-auto py-2 gap-1"
          >
            <Heart size={20} />
            <span className="text-xs">Wishlist</span>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="flex-col h-auto py-2 gap-1"
          >
            <Link
              to="/profile"
              className={`flex flex-col items-center ${
                isActiveRoute("/profile") ? "text-primary" : ""
              }`}
            >
              <User size={20} />
              <span className="text-xs">Profile</span>
            </Link>
          </Button>
        </div>
      </nav>

      {/* Note: Duplicate mobile search removed - already rendered above in AnimatePresence */}
    </>
  );
}
