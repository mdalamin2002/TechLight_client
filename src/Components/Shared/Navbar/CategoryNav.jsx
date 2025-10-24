import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";

export default function CategoryNav({ categories }) {
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const location = useLocation();

  const isActiveRoute = (route) => location.pathname === route;

  return (
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
              {/* Category Button */}
              <Button variant="ghost" size="sm" className="gap-2">
                <span>{category.title}</span>
                <ChevronDown size={14} />
              </Button>
              
              {/* Dropdown */}
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
                            `/${item?.toLowerCase().replace(/\s+/g, "-")}`
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
  );
}
