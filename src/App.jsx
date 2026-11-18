import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

     
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products/new" element={<Navigate to="/products" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

         
          <Route element={<ProtectedRoute permission="PRODUCT_VIEW" />}>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
          </Route>
          <Route element={<ProtectedRoute permission="USER_VIEW" />}>
            <Route path="/users" element={<Users />} />
          </Route>
          <Route element={<ProtectedRoute permission="ROLE_MANAGE" />}>
            <Route path="/roles" element={<Roles />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;