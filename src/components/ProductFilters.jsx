const fieldClass =
  "rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300";

function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="mb-5 flex flex-wrap justify-center gap-3">
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`${fieldClass} w-full sm:w-64`}
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={fieldClass}
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className={fieldClass}
      >
        <option value="default">Default order</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="qty-asc">Quantity: Low to High</option>
        <option value="qty-desc">Quantity: High to Low</option>
      </select>
    </div>
  );
}

export default ProductFilters;