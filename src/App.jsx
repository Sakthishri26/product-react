import { useState, useEffect } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import Footer from "./components/Footer";

const API_URL = import.meta.env.VITE_API_URL;


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error("Server error " + response.status);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Can't load products. Is the API server running?");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="app">
      <Header />
      <Banner
        title="Welcome to MyShop"
        subtitle="Find the best products at the best prices."
      />

      <ProductForm />

      <section className="products" id="products">
        <h2>Product Inventory</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && <ProductTable products={products} />}
      </section>

      <Footer />
    </div>
  );
}

export default App;