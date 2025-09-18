import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <header className="bg-background text-foreground shadow-sm">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-11/12 mx-auto flex justify-between items-center h-16">
          {/* LEFT - Logo */}
          <div className="flex-shrink-0 text-xl font-bold text-dark hover:text-accent">
            TechLight
          </div>

          {/* CENTER - Menu */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/" className="text-dark hover:text-accent">
              Home
            </Link>
            <Link to="/mobile" className="text-dark hover:text-accent">
              Mobile
            </Link>
            <Link to="/laptop" className="text-dark hover:text-accent">
              Laptop
            </Link>
            <Link to="/privacy_policy" className="text-dark hover:text-accent">
              PrivacyPolicy
            </Link>
          </nav>

          {/* RIGHT - Search + Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-dark hover:text-accent">
              <Heart size={20} />
            </button>
            <button className="text-dark hover:text-accent">
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
