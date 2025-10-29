import { Card, CardContent } from "@/Components/ui/card";
import FilledButton from "@/Components/Shared/Buttots/FilledButton";
import { MoveLeft, Save, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/Components/ui/button";
import { toast } from "react-toastify";
import { useState } from "react";

const FormHeading = ({
  formId = "addProductForm",
  saveButtonText = "Save Product"
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    navigate("");
  };

  const handleSaveNotification = () => {
    setIsSaving(true);
    toast.info("Saving product...", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });

    // Simulate save completion
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  return (
    <Card className="bg-card rounded-2xl md:p-4 shadow-lg border border-border/50 backdrop-blur-sm mb-5">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 ">
          <div className="flex gap-4 items-center mb-4 md:mb-0">
            <Button
              type="button"
              onClick={handleBack}
              className="cursor-pointer p-2 h-10 w-10 rounded-xl hover:bg-muted transition-colors"
              variant="outline"
              size="icon"
            >
              <MoveLeft className="h-5 w-5" />
            </Button>
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
                Add New Product
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in the details below to add a new product
              </p>
            </div>
          </div>

          <FilledButton
            type="submit"
            form={formId}
            className="px-6 py-3 rounded-xl flex items-center gap-2"
            onClick={handleSaveNotification}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {saveButtonText}
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </FilledButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormHeading;
