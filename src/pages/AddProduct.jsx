import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { readError, friendlyError } from "../utils/api";
import ProductForm from "../components/ProductForm";

function AddProduct() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  
  async function handleSave(product) {
    try {
      const response = await authFetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "Request failed"));
      }
      toast.success("Product added");
      navigate("/products");
      return null;
    } catch (err) {
      const message = friendlyError(err);
      toast.error(message);
      return message;
    }
  }

  return <ProductForm editingProduct={null} onSave={handleSave} onCancel={() => {}} />;
}

export default AddProduct;