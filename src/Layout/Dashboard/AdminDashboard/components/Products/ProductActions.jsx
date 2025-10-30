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
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ProductActions = ({ productId, onAction }) => {
  const [position, setPosition] = useState("bottom");

  const handleAction = (action) => {
    switch (action) {
      case "Delete":
        Swal.fire({
          title: "Permanently Delete Product",
          text: "Are you sure you want to permanently delete this product? This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#5061fc",
          confirmButtonText: "Yes, permanently delete it",
          customClass: {
            popup: 'rounded-xl',
            header: 'rounded-t-xl',
          }
        }).then((result) => {
          if (result.isConfirmed) {
            toast.success("Product permanently deleted!");
            if (onAction) onAction("delete", productId);
          }
        });
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-muted">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border border-border">
        <DropdownMenuLabel className="text-sm font-medium">Product Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem
            value="Delete"
            onClick={() => handleAction("Delete")}
            className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-md hover:bg-muted text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Product</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductActions;
