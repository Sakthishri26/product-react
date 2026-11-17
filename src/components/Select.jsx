import { forwardRef } from "react";

const Select = forwardRef(function Select({ label, error, children, ...props }, ref) {
  const color = error
    ? "border-red-500 focus:ring-red-300"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-300 dark:border-gray-600";

  return (
    <label className="flex flex-col gap-1 font-medium">
      {label}
      <select
        ref={ref}
        {...props}
        className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white ${color}`}
      >
        {children}
      </select>
      {error && <span className="text-sm font-normal text-red-600">{error}</span>}
    </label>
  );
});

export default Select;