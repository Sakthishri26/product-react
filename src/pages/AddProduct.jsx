import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductForm from "../components/ProductForm";

function AddProduct() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState("");

  async function handleSave(product) {
    setActionError("");
    try {
      const response = await authFetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }
      navigate("/products");
      return true;
    } catch (err) {
      setActionError(
        err.message === "Failed to fetch" ? "Can't connect to server" : err.message
      );
      return false;
    }
  }

  return (
    <div>
      {actionError && <p className="text-center text-red-600">{actionError}</p>}
      <ProductForm editingProduct={null} onSave={handleSave} onCancel={() => {}} />
    </div>
  );
}

export default AddProduct;