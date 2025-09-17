
import { Heart, ShoppingCart } from "lucide-react";
import { Input } from "../../ui/input";

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
            <Input
              type="text"
              placeholder="Search..."
              className="h-9 w-32 sm:w-48 bg-primary text-dark placeholder:text-subtext"
            />
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
