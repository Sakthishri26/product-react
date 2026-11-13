import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/products", label: "Products", end: false },
  { to: "/products/new", label: "Add Product", end: true },
  { to: "/profile", label: "Profile", end: true },
];

function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose}></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-gray-200 bg-white transition-transform duration-200 dark:border-gray-700 dark:bg-gray-800 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 text-xl font-bold md:hidden">
          Menu
          <button onClick={onClose} aria-label="Close menu" className="text-2xl">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) => {
                const active =
                  isActive && !(link.to === "/products" && pathname === "/products/new");
                return `rounded-md px-4 py-2 ${
                  active
                    ? "bg-blue-600 font-semibold text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`;
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;