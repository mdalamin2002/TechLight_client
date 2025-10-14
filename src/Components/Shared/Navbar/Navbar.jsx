import { useState, useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import TechLightLogo from "../Logo/TechLightLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import useAuth from "@/hooks/useAuth";
import GlobalLoading from "../Loading/GlobalLoading";
import { toast } from "react-toastify";
import { auth } from "@/firebase/firebase.init";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

export default function Navbar() {
  const location = useLocation();
  const { user, loading, logOutUser } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const profileRef = useRef(null);

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

  const handleLogout = () => {
    logOutUser(auth)
      .then(() => {
        toast.success("Logged out successfully!");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Failed to logout. Please try again.");
      });
    setProfileOpen(false);
  };

  const toggleCategory = (index) => {
    setOpenCategoryIndex(openCategoryIndex === index ? null : index);
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

  // Close profile dropdown on outside click (mobile)
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActiveRoute = (route) => location.pathname === route;

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
            <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-4">
              <div className="relative w-full group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
                  size={20}
                />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-12 pr-10 h-11 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
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

              <>
                {/* Desktop: hover dropdown */}
                <div className="block relative" ref={profileRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 px-2"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <img
                      src={"https://i.ibb.co.com/3mWYSkKt/image.png"}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
                    />
                    <ChevronDown size={16} className="hidden lg:block" />
                  </Button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                        onMouseEnter={() => setProfileOpen(true)}
                        onMouseLeave={() => setProfileOpen(false)}
                      >
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <UserCircle size={18} />
                            <span className="text-sm font-medium">Profile</span>
                          </Link>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <LayoutDashboard size={18} />
                            <span className="text-sm font-medium">
                              Dashboard
                            </span>
                          </Link>
                          <div className="my-1 h-px bg-border" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
              {!user && (
                <Button size="sm" asChild>
                  <Link to="/auth/register" className="gap-2">
                    <User size={18} />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </Button>
              )}
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
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    size={18}
                  />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-11 pr-10 rounded-xl"
                    autoFocus
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XL+ Categories Bar */}
        <div className="hidden xl:block border-b border-border/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-2 relative">
              {categories.map((category, idx) => (
                <div
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setOpenCategoryIndex(idx)}
                  onMouseLeave={() => setOpenCategoryIndex(null)}
                >
                  <Button variant="ghost" size="sm" className="gap-2">
                    <span>{category.title}</span>
                    <ChevronDown size={14} />
                  </Button>
                  <AnimatePresence>
                    {openCategoryIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-lg z-50"
                      >
                        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase px-3 py-2">
                          {category.title}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {category.items.map((item, i) => (
                          <Link
                            key={i}
                            to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted ${
                              isActiveRoute(
                                `/${item.toLowerCase().replace(/\s+/g, "-")}`
                              )
                                ? "bg-primary/10 font-semibold"
                                : ""
                            }`}
                          >
                            {item}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Categories Drawer - <XL */}
      <AnimatePresence>
        {isCategoriesOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setIsCategoriesOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-16 w-80 max-w-[85vw] h-[calc(100vh-4rem)] bg-card border-r border-border shadow-2xl z-50 xl:hidden overflow-hidden"
            >
              <div className="h-full overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground">
                    All Categories
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    <X size={18} />
                  </Button>
                </div>
                <div className="h-px bg-border mb-4" />
                <nav className="space-y-1">
                  {categories.map((category, idx) => {
                    const isOpen = openCategoryIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="border-b border-border/30 last:border-0"
                      >
                        <button
                          onClick={() => toggleCategory(idx)}
                          className="flex items-center justify-between w-full text-left py-3 px-3 rounded-lg hover:bg-muted transition-all duration-200 group"
                        >
                          <span className="flex items-center gap-3 font-medium text-foreground">
                            <span>{category.title}</span>
                          </span>
                          <ChevronRight
                            className={`w-4 h-4 text-primary transform transition-transform duration-300 ${
                              isOpen ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="pl-4 pb-2 space-y-1 overflow-hidden"
                            >
                              {category.items.map((item, i) => (
                                <Link
                                  key={i}
                                  to={`/${item
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                  className={`block w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-muted transition-colors ${
                                    isActiveRoute(
                                      `/${item
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`
                                    )
                                      ? "bg-primary/10 font-semibold"
                                      : ""
                                  }`}
                                  onClick={() => setIsCategoriesOpen(false)}
                                >
                                  {item}
                                </Link>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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
            onClick={() => handleRedirect("/wishlist")}
            variant="ghost"
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
    </>
  );
}
