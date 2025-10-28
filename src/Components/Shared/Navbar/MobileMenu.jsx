import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";

export default function MobileMenu({ isOpen, onClose, categories }) {
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const location = useLocation();

  const toggleCategory = (index) => {
    setOpenCategoryIndex(openCategoryIndex === index ? null : index);
  };

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-16 w-80 max-w-[85vw] h-[calc(100vh-4rem)] bg-card border-r border-border shadow-2xl z-50 xl:hidden overflow-hidden"
          >
            <div className="h-full overflow-y-auto p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  All Categories
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X size={18} />
                </Button>
              </div>

              <div className="h-px bg-border mb-4" />

              {/* Categories Navigation */}
              <nav className="space-y-1">
                {categories.map((category, idx) => {
                  const isOpen = openCategoryIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border-b border-border/30 last:border-0"
                    >
                      {/* Category Title Button */}
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

                      {/* Category Items */}
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
                                to={`/products/category/${category.title.toLowerCase().replace(/\s+/g, "-")}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                className={`block w-full text-left text-sm py-2 px-3 rounded-lg hover:bg-muted transition-colors ${
                                  isActiveRoute(
                                    `/products/category/${category.title.toLowerCase().replace(/\s+/g, "-")}/${item.toLowerCase().replace(/\s+/g, "-")}`
                                  )
                                    ? "bg-primary/10 font-semibold"
                                    : ""
                                }`}
                                onClick={onClose}
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
  );
}
