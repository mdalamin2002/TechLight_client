import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Settings } from "lucide-react";

const ProductActions = () => {
  const [position, setPosition] = useState("bottom");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="">
          <Settings></Settings>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-26">
        <DropdownMenuLabel>Product Action</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="Update">Update</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Discount</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Others</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductActions;
