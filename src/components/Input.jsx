import { forwardRef, useState } from "react";

const base =
  "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white";

const Input = forwardRef(function Input({ label, error, type = "text", ...props }, ref) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const color = error
    ? "border-red-500 focus:ring-red-300"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-300 dark:border-gray-600";

  return (
    <label className="flex flex-col gap-1 font-medium">
      {label}
      <div className="relative">
        <input
          ref={ref}
          type={isPassword && show ? "text" : type}
          onWheel={type === "number" ? (e) => e.target.blur() : undefined}
          {...props}
          className={`${base} ${color} ${isPassword ? "pr-16" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 px-3 text-sm font-normal text-blue-600 dark:text-blue-400"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <span className="text-sm font-normal text-red-600">{error}</span>}
    </label>
  );
});

export default Input;