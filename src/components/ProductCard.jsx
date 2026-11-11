function ProductCard({ product }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg">
      <h3 className="mb-1 text-xl font-semibold">{product.name}</h3>
      <p className="mb-2 text-gray-500">{product.category || "-"}</p>
      <p className="mb-2 text-xl font-bold text-blue-600">
        ₹{Number(product.price).toFixed(2)}
      </p>
      <p className="text-gray-700">Quantity: {product.qty}</p>
    </div>
  );
}

export default ProductCard;