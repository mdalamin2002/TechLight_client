import { Heart, ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-background text-foreground shadow-sm">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* LEFT - Logo */}
          <div className="flex-shrink-0 text-xl font-bold text-dark hover:text-accent">
            TechLight
          </div>

          {/* CENTER - Menu */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#" className="text-dark hover:text-accent">
              Home
            </a>
            <a href="#" className="text-dark hover:text-accent">
              About
            </a>
            <a href="#" className="text-dark hover:text-accent">
              Contact
            </a>
            <a href="#" className="text-dark hover:text-accent">
              Signup
            </a>
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
