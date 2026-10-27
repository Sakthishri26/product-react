import { useState } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";

const products = [
  { id: 1, name: "Laptop", category: "Electronics", price: 50000, qty: 5 },
  { id: 2, name: "T-Shirt", category: "Cloth", price: 499, qty: 20 },
  { id: 3, name: "Novel Book", category: "Books", price: 350, qty: 12 },
  { id: 4, name: "Headphones", category: "Electronics", price: 1999, qty: 15 },
  { id: 5, name: "Rice 5kg", category: "Food", price: 420, qty: 40 },
  { id: 6, name: "Lipstick", category: "Beauty & fashion", price: 300, qty: 25 },
];

const categories = ["All", ...new Set(products.map((p) => p.category))];

function App() {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showProducts, setShowProducts] = useState(true);

  const visibleProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesName && matchesCategory;
  });

  return (
    <div className="app">
      <Header />
      <Banner
        title="Welcome to MyShop"
        subtitle="Find the best products at the best prices."
      />

      <section className="counter">
        <h2>Counter</h2>
        <div className="counter-box">
          <button onClick={() => setCount(count - 1)}>–</button>
          <span className="count">{count}</span>
          <button onClick={() => setCount(count + 1)}>+</button>
        </div>
      </section>

      <section className="products" id="products">
        <h2>Our Products</h2>

        <div className="controls">
  
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button onClick={() => setShowProducts(!showProducts)}>
            {showProducts ? "Hide products" : "Show products"}
          </button>
        </div>

        {showProducts && (
          <div className="product-list">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {showProducts && visibleProducts.length === 0 && (
          <p>No matching products found.</p>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default App;