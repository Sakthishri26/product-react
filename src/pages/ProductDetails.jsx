import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetails() {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); 

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setStatus("");
      try {
        const response = await authFetch(`/products/${id}`);

        if (response.status === 404 || response.status === 400) {
          setStatus("notfound");
          return;
        }
        if (!response.ok) {
          throw new Error("Server error " + response.status);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setStatus("server");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, authFetch]);

  return (
    <section className="mx-auto max-w-lg px-4 py-10">
      <Link to="/products" className="mb-6 inline-block text-blue-600 hover:underline">
        ← Back to products
      </Link>

      {loading && <Spinner />}

      {!loading && status === "notfound" && (
        <p className="rounded-lg bg-red-100 p-6 text-center text-xl text-red-700">
          Product not found
        </p>
      )}

      {!loading && status === "server" && (
        <p className="rounded-lg bg-red-100 p-6 text-center text-xl text-red-700">
          Can't connect to server
        </p>
      )}

      {!loading && product && status === "" && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          <p className="mb-4 text-gray-500">{product.category || "No category"}</p>

          <p className="mb-4 text-3xl font-bold text-blue-600">
            ₹{Number(product.price).toFixed(2)}
          </p>

          <dl className="grid grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
            <dt className="font-medium">Quantity in stock</dt>
            <dd>{product.qty}</dd>
            <dt className="font-medium">Stock value</dt>
            <dd>₹{(product.price * product.qty).toFixed(2)}</dd>
          </dl>
        </div>
      )}
    </section>
  );
}

export default ProductDetails;