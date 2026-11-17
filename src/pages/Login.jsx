import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { readError, friendlyError } from "../utils/api";
import Input from "../components/Input";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  
  if (token) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(values) {
    setServerError("");
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "Login failed"));
      }
      const data = await response.json();
      login(data.token, data.user);
      toast.success("Logged in");
      navigate("/");
    } catch (err) {
      const message = friendlyError(err);
      setServerError(message); 
      toast.error(message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-sm flex-col gap-3 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 dark:text-gray-100"
      >
        <h1 className="text-center text-2xl font-bold">Log in to Smartmart</h1>

        {location.state?.registered && (
          <p className="rounded bg-green-100 p-2 text-center text-sm text-green-800">
            Account created. Please log in.
          </p>
        )}
        {serverError && (
          <p className="rounded bg-red-100 p-2 text-center text-sm text-red-700">
            {serverError}
          </p>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
        />

        <Button type="submit" loading={isSubmitting} loadingText="Logging in..." className="w-full">
          Log in
        </Button>

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