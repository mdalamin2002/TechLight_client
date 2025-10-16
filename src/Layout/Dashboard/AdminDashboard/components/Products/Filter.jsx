import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {  X, ChevronDown } from "lucide-react";

const Filter = ({
  category,
  setSelectCategory,
  placeholder = "Select a category",
  showClearButton = true,
  className = ""
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    setSelectCategory(value);
  };

  const handleClearFilter = () => {
    setSelectedValue("");
    setSelectCategory("");
  };

  return (
    <div className={`relative ${className}`}>
      <Select
        value={selectedValue}
        onValueChange={handleValueChange}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="w-[180px] focus:outline-none text-foreground bg-card border border-border focus:ring-2 focus:ring-primary/50 rounded-xl shadow-sm">
          <div className="flex items-center justify-between w-full">
            <SelectValue placeholder={placeholder} />
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border border-border rounded-xl shadow-lg">
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2 text-sm font-medium">
              {/* <Filter className="h-4 w-4" /> */}
              Category
            </SelectLabel>
            {category?.map((c) => (
              <SelectItem key={c._id} value={c.category} className="rounded-md hover:bg-muted">
                {c.category.toUpperCase()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {showClearButton && selectedValue && (
        <button
          type="button"
          onClick={handleClearFilter}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};

export default Filter;
