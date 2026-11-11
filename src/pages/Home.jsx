import { useState, useEffect } from "react";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeatured() {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error("Server error " + response.status);
        }
        const data = await response.json();
        setFeatured(data.slice(0, 3));
      } catch (err) {
        setError("Can't load featured products.");
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  return (
    <div>
      <Banner
        title="Welcome to Smartmart"
        subtitle="Find the best products at the best prices."
      />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-6 text-center text-2xl font-bold">Featured Products</h2>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;