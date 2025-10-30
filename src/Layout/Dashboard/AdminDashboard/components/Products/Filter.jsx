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
import { X, ChevronDown } from "lucide-react";

const Filter = ({
  category,
  setSelectCategory,
  setStatusFilter, // Add this prop
  placeholder = "Select a category",
  showClearButton = true,
  className = ""
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // Add state for status
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    setSelectCategory(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setStatusFilter(value);
  };

  const handleClearFilter = () => {
    setSelectedValue("");
    setSelectedStatus("");
    setSelectCategory("");
    setStatusFilter("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        {/* Category Filter */}
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
                Category
              </SelectLabel>
              <SelectItem value="all" className="rounded-md hover:bg-muted">
                All Categories
              </SelectItem>
              {category?.map((c) => (
                <SelectItem key={c._id} value={c.category} className="rounded-md hover:bg-muted">
                  {c.category.toUpperCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={selectedStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px] focus:outline-none text-foreground bg-card border border-border focus:ring-2 focus:ring-primary/50 rounded-xl shadow-sm">
            <div className="flex items-center justify-between w-full">
              <SelectValue placeholder="Filter by status" />
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-card border border-border rounded-xl shadow-lg">
            <SelectGroup>
              <SelectLabel className="flex items-center gap-2 text-sm font-medium">
                Status
              </SelectLabel>
              <SelectItem value="all-status" className="rounded-md hover:bg-muted">
                All Statuses
              </SelectItem>
              <SelectItem value="pending" className="rounded-md hover:bg-muted">
                Pending
              </SelectItem>
              <SelectItem value="approved" className="rounded-md hover:bg-muted">
                Approved
              </SelectItem>
              <SelectItem value="rejected" className="rounded-md hover:bg-muted">
                Rejected
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {showClearButton && (selectedValue || selectedStatus) && (
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
