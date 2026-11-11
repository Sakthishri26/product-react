import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function desktopClass({ isActive }) {
  return isActive
    ? "font-semibold text-blue-400 underline"
    : "hover:text-blue-400 hover:underline";
}

function mobileClass({ isActive }) {
  return isActive
    ? "rounded bg-gray-700 px-3 py-2 font-semibold text-blue-400"
    : "rounded px-3 py-2 hover:bg-gray-700";
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold">
          Smartmart
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={desktopClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="rounded p-2 text-2xl hover:bg-gray-700 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 px-6 pb-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={mobileClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;