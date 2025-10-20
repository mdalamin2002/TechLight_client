import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CategorySidebar = ({ shopMegaMenu }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleCategoryClick = (category, item) => {
    const categoryPath = `/products/category/${category.toLowerCase().replace(/\s+/g, "-")}/${item.toLowerCase().replace(/\s+/g, "-")}`;
    navigate(categoryPath);
  };

  return (
    <motion.aside
      className="w-72 xl:w-80 bg-white dark:bg-card rounded-xl shadow-md border border-gray-200 dark:border-border/50 py-6.5 px-4 flex-shrink-0"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {shopMegaMenu.map((section, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="mb-3 border-b border-gray-100 dark:border-border/30 last:border-0"
            >
              <button
                onClick={() => toggleOpen(idx)}
                className="flex justify-between items-center w-full text-left text-gray-800 dark:text-foreground font-medium py-3 px-3 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <ChevronRight
                    className={`w-4 h-4 text-primary transform transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                  {section.title}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-8 pb-2 space-y-1 text-gray-600 dark:text-muted-foreground overflow-hidden"
                  >
                    {section.items.map((item, i) => (
                      <li key={i}>
                        <button
                          onClick={() => handleCategoryClick(section.title, item)}
                          className="w-full text-left text-sm py-1.5 px-2 rounded-md hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-all duration-200"
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default CategorySidebar;
