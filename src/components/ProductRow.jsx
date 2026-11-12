import { Link } from "react-router-dom";
function ProductRow({ product, index, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-200 odd:bg-white even:bg-gray-100 hover:bg-blue-50">
      <td className="px-4 py-3">{index + 1}</td>
      <td className="px-4 py-3">
        <Link
          to={`/products/${product._id}`}
          className="font-medium text-blue-600 hover:underline"
     >
          {product.name}
      </Link>
    </td>
      <td className="px-4 py-3">{product.category || "-"}</td>
      <td className="px-4 py-3">₹{Number(product.price).toFixed(2)}</td>
      <td className="px-4 py-3">{product.qty}</td>
      <td className="px-4 py-3">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onEdit(product)}
            className="rounded bg-blue-600 px-3 py-1.5 text-white transition hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="rounded bg-red-600 px-3 py-1.5 text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ProductRow;