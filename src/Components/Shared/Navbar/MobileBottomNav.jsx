import { Link, useLocation } from "react-router-dom";
import { Percent, Heart, User } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function MobileBottomNav({ onWishlistClick }) {
  const location = useLocation();

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border shadow-lg z-40">
      <div className="grid grid-cols-3 gap-1 px-2 py-2">
        {/* Offers */}
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

        {/* Wishlist */}
        <Button
          onClick={onWishlistClick}
          variant="ghost"
          className="flex-col h-auto py-2 gap-1"
        >
          <Heart size={20} />
          <span className="text-xs">Wishlist</span>
        </Button>

        {/* Profile */}
        <Button
          variant="ghost"
          asChild
          className="flex-col h-auto py-2 gap-1"
        >
          <Link
            to="/dashboard/profile"
            className={`flex flex-col items-center ${
              isActiveRoute("/dashboard/profile") ? "text-primary" : ""
            }`}
          >
            <User size={20} />
            <span className="text-xs">Profile</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
}
