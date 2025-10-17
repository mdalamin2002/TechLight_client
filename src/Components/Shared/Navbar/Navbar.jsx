import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Menu, X, Search, Lightbulb, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TechLightLogo from "../Logo/TechLightLogo";
import { Button } from "@/Components/ui/button";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

// Subcomponents
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import CategoryNav from "./CategoryNav";
import MobileBottomNav from "./MobileBottomNav";

export default function Navbar() {
  const { user, loading, logOutUser } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  const categories = [
    {
      title: "Mobiles & Tablets",
      items: ["Smartphones", "Tablets", "Mobile Accessories"],
    },
    {
      title: "Laptops & Computers",
      items: ["Laptops", "Desktops", "Keyboards & Mouse"],
    },
    {
      title: "Smart Watches",
      items: ["Smart Watches", "Fitness Bands"],
    },
    {
      title: "Audio Devices",
      items: ["Headphones", "Earbuds", "Speakers"],
    },
    {
      title: "Gaming Consoles",
      items: ["PlayStation & Xbox", "VR Headsets", "Accessories"],
    },
    {
      title: "Smart Home",
      items: ["Smart Lights", "Security Cameras", "Voice Assistants"],
    },
    {
      title: "Accessories",
      items: ["Power Banks", "Cables & Chargers", "Storage Devices"],
    },
  ];

  const handleRedirect = (path) => {
    if (!user) {
      navigate("/auth/login");
    } else {
      navigate(path);
    }
  };

  // Smart scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);





  return (
    <>
      {/* TOP NAVBAR */}
      <motion.header
        initial={false}
        animate={{ y: showNavbar ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm text-foreground"
      >
        {/* Main Top Bar */}
        <div className="border-b border-border/50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
            {/* LEFT: Menu + Logo */}
            <div className="flex items-center gap-3">
              {/* Categories Button - visible on <xl only */}
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

              {/* Logo */}
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
              {/* Mobile Search Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </Button>

              {/* Wishlist & Cart - Desktop */}
              <div className="flex items-center gap-1">
                {/* Wishlist */}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault(); // Link er default behavior stop
                    handleRedirect("/wishlist");
                  }}
                >
                  <Link to="/wishlist" className="flex items-center">
                    <div className="relative">
                      <Heart size={22} className="text-foreground" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                    <span className="hidden lg:inline">Wishlist</span>
                  </Link>
                </Button>

                {/* Cart */}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRedirect("/addToCart");
                  }}
                >
                  <Link to="/addToCart" className="flex items-center">
                    <div className="relative">
                      <ShoppingCart size={22} className="text-foreground" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    <span className="hidden lg:inline">Cart</span>
                  </Link>
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
        <CategoryNav categories={categories} />
      </motion.header>

      {/* Mobile Categories Drawer - <XL */}
      <MobileMenu 
        isOpen={isCategoriesOpen} 
        onClose={() => setIsCategoriesOpen(false)}
        categories={categories}
      />

      {/* Bottom Mobile Navbar */}
      <MobileBottomNav onWishlistClick={() => handleRedirect("/wishlist")} />
    </>
  );
}
