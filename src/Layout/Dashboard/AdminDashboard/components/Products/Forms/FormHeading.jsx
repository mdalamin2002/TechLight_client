import { Card } from "@/Components/ui/card";
import FilledButton from "@/Components/Shared/Buttots/FilledButton";
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/Components/ui/button";

const FormHeading = () => {
  const navigate = useNavigate();
    return (
        <Card className="px-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-10 items-center">
            <Button type="button" onClick={()=>navigate("/dashboard/products")} className="cursor-pointer">
              <MoveLeft />
            </Button>
            <h3 className="text-3xl font-semibold text-foreground">Add New Product</h3>
          </div>

          <FilledButton type="submit" form="addProductForm" className="px-6">
            Save Product
          </FilledButton>
        </div>
      </Card>
    );
};

export default FormHeading;