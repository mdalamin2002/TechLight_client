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
import { MoreVertical, Edit, Tag, MoreHorizontal, Archive, Trash2, Copy } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ProductActions = ({ productId, onAction }) => {
  const [position, setPosition] = useState("bottom");

  const handleAction = (action) => {
    switch (action) {
      case "Update":
        if (onAction) onAction("update", productId);
        break;
      case "Discount":
        Swal.fire({
          title: "Add Discount",
          html: `
            <div class="swal2-custom-form">
              <div class="mb-3">
                <label for="swal-input1" class="swal2-label">Discount Percentage</label>
                <input id="swal-input1" class="swal2-input" placeholder="Enter percentage">
              </div>
              <div class="mb-3">
                <label for="swal-input2" class="swal2-label">Discount Code (Optional)</label>
                <input id="swal-input2" class="swal2-input" placeholder="Enter code">
              </div>
              <div class="mb-3">
                <label for="swal-input3" class="swal2-label">Expiry Date</label>
                <input id="swal-input3" type="date" class="swal2-input">
              </div>
            </div>
          `,
          confirmButtonText: "Apply Discount",
          showCancelButton: true,
          focusConfirm: false,
          customClass: {
            popup: 'rounded-xl',
            header: 'rounded-t-xl',
          },
          preConfirm: () => {
            const percentage = document.getElementById("swal-input1").value;
            const code = document.getElementById("swal-input2").value;
            const expiryDate = document.getElementById("swal-input3").value;

            if (!percentage) {
              Swal.showValidationMessage("Please enter a discount percentage");
              return false;
            }

            if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
              Swal.showValidationMessage("Please enter a valid percentage (1-100)");
              return false;
            }

            return { percentage, code, expiryDate };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            toast.success(`Discount of ${result.value.percentage}% applied successfully!`);
            if (onAction) onAction("discount", productId, result.value);
          }
        });
        break;
      case "Archive":
        Swal.fire({
          title: "Archive Product",
          text: "Are you sure you want to archive this product? It will be hidden from the store but can be restored later.",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#5061fc",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, archive it",
          customClass: {
            popup: 'rounded-xl',
            header: 'rounded-t-xl',
          }
        }).then((result) => {
          if (result.isConfirmed) {
            toast.success("Product archived successfully!");
            if (onAction) onAction("archive", productId);
          }
        });
        break;
      case "Duplicate":
        Swal.fire({
          title: "Duplicate Product",
          text: "Are you sure you want to duplicate this product?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#5061fc",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, duplicate it",
          customClass: {
            popup: 'rounded-xl',
            header: 'rounded-t-xl',
          }
        }).then((result) => {
          if (result.isConfirmed) {
            toast.success("Product duplicated successfully!");
            if (onAction) onAction("duplicate", productId);
          }
        });
        break;
      case "Delete":
        Swal.fire({
          title: "Delete Product",
          text: "Are you sure you want to delete this product? This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#5061fc",
          confirmButtonText: "Yes, delete it",
          customClass: {
            popup: 'rounded-xl',
            header: 'rounded-t-xl',
          }
        }).then((result) => {
          if (result.isConfirmed) {
            toast.success("Product deleted successfully!");
            if (onAction) onAction("delete", productId);
          }
        });
        break;
      case "Others":
        if (onAction) onAction("others", productId);
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
            value="Update"
            onClick={() => handleAction("Update")}
            className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-md hover:bg-muted"
          >
            <Edit className="h-4 w-4 text-primary" />
            <span>Update Product</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Discount"
            onClick={() => handleAction("Discount")}
            className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-md hover:bg-muted"
          >
            <Tag className="h-4 w-4 text-green-600" />
            <span>Add Discount</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Archive"
            onClick={() => handleAction("Archive")}
            className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-md hover:bg-muted"
          >
            <Archive className="h-4 w-4 text-amber-600" />
            <span>Archive Product</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Duplicate"
            onClick={() => handleAction("Duplicate")}
            className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-md hover:bg-muted"
          >
            <Copy className="h-4 w-4 text-blue-600" />
            <span>Duplicate Product</span>
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
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
