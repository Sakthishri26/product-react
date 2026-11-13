function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      className={`relative h-7 w-14 rounded-full transition-colors ${
        dark ? "bg-blue-600" : "bg-gray-400"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-gray-800 shadow transition-transform ${
          dark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {dark ? "☾" : "☀"}
      </span>
    </button>
  );
}

export default ThemeToggle;