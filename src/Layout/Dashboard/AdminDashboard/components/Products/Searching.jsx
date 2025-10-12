import { Search } from "lucide-react";
import React from "react";

const Searching = () => {
  return (
    <div className="flex items-center w-full md:w-1/2 bg-input border border-border rounded-lg px-3 py-2">
      <Search className="w-5 h-5 mr-2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search products..."
        className="bg-transparent outline-none text-foreground w-full placeholder:text-muted-foreground"
      />
    </div>
  );
};

export default Searching;
