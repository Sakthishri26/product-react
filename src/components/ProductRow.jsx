function ProductRow({ product, index, onEdit, onDelete }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{product.name}</td>
      <td>{product.category || "-"}</td>
      <td>₹{Number(product.price).toFixed(2)}</td>
      <td>{product.qty}</td>
      <td>
        <button className="edit-btn" onClick={() => onEdit(product)}>
          Edit
        </button>{" "}
        <button className="delete-btn" onClick={() => onDelete(product._id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ProductRow;