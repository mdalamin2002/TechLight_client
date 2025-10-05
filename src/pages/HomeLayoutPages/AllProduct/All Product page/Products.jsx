import React from "react";
import AllProductCardShare from "@/Components/Shared/All Product/AllProductCardShare";

const Products = ({ products, viewMode, totalPages, currentPage, setCurrentPage }) => {
  return (
    <>
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 xs:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
            : "flex flex-col gap-3 sm:gap-4"
        }
      >
        {products.map((product) => (
          <AllProductCardShare
            key={product.id}
            {...product}
            buttonText="Add to Cart"
            buttonAction={() => alert(`Added ${product.name} to cart`)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-5 py-2.5 bg-card border border-border rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-foreground font-medium text-sm shadow-sm hover:shadow-md"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl transition-all font-semibold text-sm shadow-sm ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-110 border-2 border-primary"
                    : "bg-card border border-border text-foreground hover:bg-muted hover:scale-105"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 bg-card border border-border rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-foreground font-medium text-sm shadow-sm hover:shadow-md"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Products;
