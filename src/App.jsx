import ProductFilters from "./components/ProductFilters"; 
import { useState , useEffect } from "react" ;
import Header from "./components/Header";
import Banner from "./components/Banner";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import Footer from "./components/Footer";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL is:", API_URL);

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  async function loadProducts() {
    try{
      const response= await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error("Server error " + response.status);
     }
     const data = await response.json();
     setProducts(data);
     setError("");
    } catch (err) {
      setError("Can't load products. Is the API server running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSave(product) {
    setActionError("");
    const isEditing = editingProduct !== null;
    const url = isEditing
      ? `${API_URL}/products/${editingProduct._id}`
      : `${API_URL}/products`;

    try{
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }
      setEditingProduct(null);
      await loadProducts();
      return true;
    } catch (err) {
      setActionError(
        err.message === "Failed to fetch" ? "Can't connect to server" : err.message
      );
      return false;
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) {
      return;
    }
    setActionError("");

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Delete failed");
      }
      await loadProducts();
    } catch (err) {
      setActionError(
        err.message === "Failed to fetch" ? "Can't connect to server" : err.message
      );
    }
  }

  function handleEdit(product) {
    setActionError("");
    setEditingProduct(product);
    window.scrollTo(0, 0);
  }

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((p) => categoryFilter === "All" || p.category === categoryFilter);
  const visibleProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });
  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="app">
      <Header />
      <Banner
        title="Welcome to Smartmart"
        subtitle="Find the best products at the best prices."/>

      <ProductForm
        key={editingProduct ? editingProduct._id : "new"}
        editingProduct={editingProduct}
        onSave={handleSave}
        onCancel={() => setEditingProduct(null)} />

      <section className="products" id="products">
        <h2>Product Inventory</h2>

        {actionError && <p className="error">{actionError}</p>}
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <>
            <ProductFilters
              search={search}
              onSearchChange={setSearch}
              category={categoryFilter}
              onCategoryChange={setCategoryFilter}
              categories={categories}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            <ProductTable
              products={visibleProducts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <p className="total">
              Total stock value: ₹{totalStockValue.toFixed(2)}
            </p>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default App;
    