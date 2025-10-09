import { Card } from "@/Components/ui/card";
import OutlineButton from "@/Components/Shared/Buttots/OutlineButton";
import FilledButton from "@/Components/Shared/Buttots/FilledButton";
import { MoveLeft } from "lucide-react";
import { Navigate, useNavigate } from "react-router";

const FormHeading = () => {
  const navigate = useNavigate();
    return (
        <Card className="px-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-10 items-center">
            <OutlineButton type="button" onClick={()=>navigate(-10)} className="py-[6px] px-6">
              <MoveLeft />
            </OutlineButton>
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