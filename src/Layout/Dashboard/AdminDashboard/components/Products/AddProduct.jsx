import { Input } from "@/Components/ui/input";
import { Card } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const AddProduct = () => {
  return (
    <div className="min-h-screen text-foreground p-6 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-foreground">Add New Product</h2>
      <form className="grid grid-cols-2 gap-5 w-full">
        <div className="w-full grid gap-4">
          <Card className="px-6">
            <h4 className="border-b -mt-4 text-center">Name and description</h4>
            <div>
              <Label className="mb-2">Product Name : </Label>
              <Input type="text" name="name" placeholder="Enter product name"></Input>
            </div>
            <div className="">
              <Label className="mb-2">Product Description</Label>
              <Textarea placeholder="Enter product description"></Textarea>
            </div>
          </Card>
          {/* //Category and subcategory */}
          <Card className={"px-6"}>
            <h4 className="border-b -mt-4 text-center">Category</h4>
            <div className="">
              <Label className="mb-2">Product Category : </Label>
              <Select className="w-full">
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adidas">Adidas</SelectItem>
                  <SelectItem value="Nike">Nike</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <Label className="mb-2">Product Sub Category : </Label>
              <Select className="w-full">
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select a Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adidas">Adidas</SelectItem>
                  <SelectItem value="Nike">Nike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
          <Card></Card>
        </div>
        <div className="w-full">
          <Card>
            <div className="space-y-2">
              <Label>Brand Name</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adidas">Adidas</SelectItem>
                  <SelectItem value="Nike">Nike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
          <Card></Card>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
