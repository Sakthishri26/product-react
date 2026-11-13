function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

export default Spinner;