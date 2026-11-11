import ProductRow from "./ProductRow";

function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="py-6 text-center text-gray-500">No products found.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl overflow-x-auto rounded-lg shadow-md">
      <table className="w-full min-w-[600px] border-collapse bg-white text-center">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <ProductRow
              key={p._id}
              product={p}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;