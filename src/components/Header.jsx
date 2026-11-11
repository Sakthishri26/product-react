import { useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#products", label: "Products" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold">Smartmart</div>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-blue-400 hover:underline"
            >
              {link.label}
            </a>
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
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2 hover:bg-gray-700"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;