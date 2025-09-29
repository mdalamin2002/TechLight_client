import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Percent, User, Search } from "lucide-react";
import { logoutUser } from "../../../store/authSlice";
import TechLightLogo from "../Logo/TechLightLogo";

export default function Navbar() {
  const dispatch = useDispatch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;
  const cartCount = 2;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Smart scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300
          ${showNavbar ? "translate-y-0" : "-translate-y-full"}
          bg-background/70 backdrop-blur-md shadow-sm text-foreground
        `}
      >
        <div className="container mx-auto md:px-0 px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            <TechLightLogo />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border border-border rounded-full px-4 py-2 text-sm bg-card text-card-foreground placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Icon */}
            <button
              className="md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" aria-label="Wishlist">
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative" aria-label="Shopping Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account/Profile */}
            {isLoggedIn ? (
              <div className="relative group">
                <img
                  src={user?.photoURL || "https://i.ibb.co/1tKbx3sx/avatar.jpg"}
                  alt="User"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
                <div className="absolute right-0 mt-2 w-40 bg-card text-card-foreground shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-muted"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-muted"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-muted"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth/register" className="text-sm font-medium">
                Account
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search (Dropdown style) */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-border rounded-full px-4 py-2 text-sm bg-card text-card-foreground placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary cursor-pointer"
                size={18}
              />
            </div>
          </div>
        )}
      </header>

      {/* Bottom Mobile Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-inner flex justify-around py-2 z-50 text-card-foreground">
        <Link
          to="/offers"
          className="flex flex-col items-center text-xs"
          aria-label="Offers"
        >
          <Percent size={20} />
          Offers
        </Link>
        <Link
          to="/wishlist"
          className="flex flex-col items-center text-xs"
          aria-label="Wishlist"
        >
          <Heart size={20} />
          Wishlist
        </Link>
        {isLoggedIn ? (
          <Link
            to="/profile"
            className="flex flex-col items-center text-xs"
            aria-label="Profile"
          >
            <User size={20} />
            Profile
          </Link>
        ) : (
          <Link
            to="/auth/register"
            className="flex flex-col items-center text-xs"
            aria-label="Account"
          >
            <User size={20} />
            Account
          </Link>
        )}
      </nav>
    </>
  );
}
