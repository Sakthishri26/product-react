function ProductCard({ product }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-1 text-xl font-semibold">{product.name}</h3>
      <p className="mb-2 text-gray-500 dark:text-gray-400">
        {product.category || "-"}
      </p>
      <p className="mb-2 text-xl font-bold text-blue-600 dark:text-blue-400">
        ₹{Number(product.price).toFixed(2)}
      </p>
      <p className="text-gray-700 dark:text-gray-300">Quantity: {product.qty}</p>
    </div>
  );
}

export default ProductCard;