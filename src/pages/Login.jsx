import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

const API_URL = import.meta.env.VITE_API_URL;

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

function Login() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // already logged in? go to the dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Can't connect to server" : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:text-gray-100"
      >
        <h1 className="text-center text-2xl font-bold">Log in to Smartmart</h1>

        {location.state?.registered && (
          <p className="rounded bg-green-100 p-2 text-center text-sm text-green-800">
            Account created. Please log in.
          </p>
        )}
        {error && (
          <p className="rounded bg-red-100 p-2 text-center text-sm text-red-700">{error}</p>
        )}

        <label className="flex flex-col gap-1 font-medium">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 font-medium">
          Password
          <PasswordInput value={form.password} onChange={handleChange} className={inputClass} />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm">
          No account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;