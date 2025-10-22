import useAxiosSecure from "@/utils/useAxiosSecure";
import AddProductForm from "./Forms/AddProductForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const axiosSecure = useAxiosSecure();

  const handleProductSubmit = async (productData) => {
    console.log(productData);
    try {
      const res = await axiosSecure.post("/products", productData);
      if (res.data.insertedId) {
        toast.success("Product added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("Failed to add product. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header with stats */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Add New Product
              </h2>
            </div>
            <p className="text-muted-foreground">
              Create and add a new product to your inventory
            </p>
          </div>
        </div>
      </div>

      <AddProductForm onSubmitProduct={handleProductSubmit} />
    </div>
  );
};

export default AddProduct;
