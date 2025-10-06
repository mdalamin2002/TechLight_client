import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

const Filter = ({ category, setSelectCategory }) => {
  return (
    <Select onValueChange={(value) => setSelectCategory(value)}>
      <SelectTrigger className="w-[180px] focus:outline-none text-black bg-input">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          {category?.map((c) => (
            <SelectItem key={c._id} value={c.category}>
              {c.category.toUpperCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Filter;
