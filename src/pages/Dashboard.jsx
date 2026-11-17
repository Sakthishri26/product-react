import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readError, friendlyError } from "../utils/api";
import Spinner from "../components/Spinner";

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Dashboard() {
  const { user, authFetch, hasPermission } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await authFetch("/products");
        if (!response.ok) {
          throw new Error(await readError(response, "Can't load dashboard data"));
        }
        setProducts(await response.json());
      } catch (err) {
        setError(friendlyError(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authFetch]);

  const stockValue = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const lowStock = products.filter((p) => p.qty <= 5).length;

  
  const byCategory = Object.entries(
    products.reduce((acc, p) => {
      const key = p.category || "Other";
      acc[key] = (acc[key] || 0) + p.price * p.qty;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...byCategory.map(([, value]) => value), 1);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold">Welcome back, {user?.name}</h1>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        You are logged in as {user?.role}.
      </p>

      {loading && <Spinner />}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total products" value={products.length} />
            <StatCard label="Total stock value" value={`₹${stockValue.toFixed(2)}`} />
            <StatCard label="Low stock (5 or fewer)" value={lowStock} />
          </div>

          <div className="mt-6 rounded-lg bg-white p-5 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">Stock value by category</h2>
            <div className="flex flex-col gap-3">
              {byCategory.map(([category, value]) => (
                <div key={category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{category}</span>
                    <span>₹{value.toFixed(2)}</span>
                  </div>
                  <div className="h-3 rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-3 rounded bg-blue-600"
                      style={{ width: `${(value / max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {hasPermission("PRODUCT_CREATE") && (
        <Link
          to="/products/new"
          className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
        >
          Add a product
        </Link>
      )}
    </div>
  );
}

export default Dashboard;