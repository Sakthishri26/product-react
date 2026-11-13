import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ProductForm from "../components/ProductForm";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ConfirmModal from "../components/ConfirmModal";
import Spinner from "../components/Spinner";

function Products() {
  const { authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  async function loadProducts() {
    try {
      const response = await authFetch("/products");
      if (!response.ok) {
        throw new Error("Server error " + response.status);
      }
      setProducts(await response.json());
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
    try {
      const response = await authFetch(`/products/${editingProduct._id}`, {
        method: "PUT",
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

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    const id = deleteId;
    setDeleteId(null);
    setActionError("");

    try {
      const response = await authFetch(`/products/${id}`, { method: "DELETE" });
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
    if (sortBy === "qty-asc") return a.qty - b.qty;
    if (sortBy === "qty-desc") return b.qty - a.qty;
    return 0;
  });

  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div>
      {editingProduct && (
        <ProductForm
          key={editingProduct._id}
          editingProduct={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      <section className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-2xl font-bold">Products</h1>

        {actionError && <p className="mb-3 text-red-600">{actionError}</p>}
        {loading && <Spinner />}
        {error && <p className="text-red-600">{error}</p>}
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

            <p className="mt-4 text-xl font-bold">
              Total stock value: ₹{totalStockValue.toFixed(2)}
            </p>
          </>
        )}
      </section>

      {deleteId && (
        <ConfirmModal
          message="This will permanently delete the product."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

export default Products;