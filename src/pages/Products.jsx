import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { readError, friendlyError } from "../utils/api";
import ProductForm from "../components/ProductForm";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ConfirmModal from "../components/ConfirmModal";
import Spinner from "../components/Spinner";

function Products() {
  const { authFetch, hasPermission } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  async function loadProducts() {
    try {
      const response = await authFetch("/products");
      if (!response.ok) {
        throw new Error(await readError(response, "Can't load products"));
      }
      setProducts(await response.json());
      setError("");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  
  async function handleSave(product) {
    try {
      const response = await authFetch(`/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "Request failed"));
      }
      toast.success("Product updated");
      setEditingProduct(null);
      await loadProducts();
      return null;
    } catch (err) {
      const message = friendlyError(err);
      toast.error(message); 
      return message;
    }
  }

  async function confirmDelete() {
    const id = deleteId;
    setDeleteId(null);

    try {
      const response = await authFetch(`/products/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(await readError(response, "Delete failed"));
      }
      toast.success("Product deleted");
      await loadProducts();
    } catch (err) {
      toast.error(friendlyError(err));
    }
  }

  function handleEdit(product) {
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

      <section className="mx-auto max-w-5xl text-center">
        <h1 className="mb-6 text-2xl font-bold">Products</h1>

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
              onDelete={setDeleteId}
              canEdit={hasPermission("PRODUCT_EDIT")}
              canDelete={hasPermission("PRODUCT_DELETE")}
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