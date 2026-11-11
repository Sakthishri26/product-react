import { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ConfirmModal from "../components/ConfirmModal";

const API_URL = import.meta.env.VITE_API_URL;

function Products() {
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
      const response = await fetch(`${API_URL}/products`);
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

    try {
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

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    const id = deleteId;
    setDeleteId(null);
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
    if (sortBy === "qty-asc") return a.qty - b.qty;
    if (sortBy === "qty-desc") return b.qty - a.qty;
    return 0;
  });

  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="px-4 pb-10">
      <ProductForm
        key={editingProduct ? editingProduct._id : "new"}
        editingProduct={editingProduct}
        onSave={handleSave}
        onCancel={() => setEditingProduct(null)}
      />

      <section className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-2xl font-bold">Product Inventory</h2>

        {actionError && <p className="mb-3 text-red-600">{actionError}</p>}
        {loading && <p>Loading...</p>}
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
          message="Delete this product?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

export default Products;