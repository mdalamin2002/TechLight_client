import React from "react";
import Reviews from "./Reviews";

const ProductTabs = ({ activeTab, setActiveTab, product }) => {
  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 bg-muted/30 p-1 rounded-lg mb-5">
        <button
          onClick={() => setActiveTab("specifications")}
          className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${
            activeTab === "specifications" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Specifications
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${
            activeTab === "reviews" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Reviews ({product.totalReviews})
        </button>
      </div>

      {/* Content */}
      {activeTab === "specifications" ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <tbody>
              {Object.entries(product.specifications).map(([key, value], idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-muted/20" : "bg-card"}>
                  <td className="py-4 px-6 font-semibold text-foreground w-1/3">{key}</td>
                  <td className="py-4 px-6 text-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-3">Description</h4>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>
      ) : (
        <Reviews product={product} />
      )}
    </>
  );
};

export default ProductTabs;
