import useAxiosSecure from "@/utils/useAxiosSecure";
import AddProductForm from "./Forms/AddProductForm";
import { toast } from "react-toastify";


const AddProduct = () => {
  const axiosSecure = useAxiosSecure();

  const handleProductSubmit = async (productData) => {
    console.log(productData);
    // try {
    //   const res = await axiosSecure.post("/api/products", productData);
    //   if (res.data.insertedId) {
    //     toast.success("Product added successfully!");
    //   }
    // } catch (error) {
    //   toast.error("Failed to add product");
    // }
  };

  return (
    <div className="min-h-screen text-foreground p-6">
      <AddProductForm onSubmitProduct={handleProductSubmit} />
    </div>
  );
};

export default AddProduct;
