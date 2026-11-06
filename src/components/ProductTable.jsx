import ProductRow from "./ProductRow";

function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
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