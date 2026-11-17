import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Plus,
  Users,
  ShieldCheck,
  User,
  Info,
  Mail,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";


const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", icon: Package, end: false, permission: "PRODUCT_VIEW" },
  { to: "/products/new", label: "Add Product", icon: Plus, end: true, permission: "PRODUCT_CREATE" },
  { to: "/users", label: "Users", icon: Users, end: false, permission: "USER_VIEW" },
  { to: "/roles", label: "Roles", icon: ShieldCheck, end: true, permission: "ROLE_MANAGE" },
  { to: "/profile", label: "Profile", icon: User, end: true },
  { to: "/about", label: "About", icon: Info, end: true },
  { to: "/contact", label: "Contact", icon: Mail, end: true },
];

function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const { pathname } = useLocation();
  const { hasPermission } = useAuth();

  
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const visibleLinks = links.filter(
    (link) => !link.permission || hasPermission(link.permission)
  );

  return (
    <>
      
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose}></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 md:static md:translate-x-0 ${
          collapsed ? "md:w-16" : "md:w-64"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
       
        <div className="flex items-center justify-between px-6 py-4 text-xl font-bold md:hidden">
          Menu
          <button onClick={onClose} aria-label="Close menu" className="text-2xl">
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {visibleLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              onClick={onClose} 
              className={({ isActive }) => {
                // "Products" should not stay highlighted on the Add Product page
                const active = isActive && !(to === "/products" && pathname === "/products/new");
                return `flex items-center gap-3 rounded-md px-3 py-2 ${
                  collapsed ? "md:justify-center md:px-2" : ""
                } ${
                  active
                    ? "bg-blue-600 font-semibold text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`;
              }}
            >
              <Icon size={20} className="shrink-0" />
              <span className={collapsed ? "md:hidden" : ""}>{label}</span>
            </NavLink>
          ))}
        </nav>

        
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden items-center gap-3 border-t border-gray-200 px-6 py-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 md:flex"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          <span className={collapsed ? "md:hidden" : ""}>Collapse</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;