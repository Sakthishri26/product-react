import { useState } from "react";

const emptyForm = { name: "", category: "", price: "", qty: "" };

function ProductForm({ editingProduct, onSave, onCancel }) {
  const [form, setForm] = useState(
    editingProduct
      ? {
          name: editingProduct.name,
          category: editingProduct.category || "",
          price: String(editingProduct.price),
          qty: String(editingProduct.qty),
        }
      : emptyForm
  );
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (form.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (form.category === "") {
      newErrors.category = "Please choose a category";
    }
    if (form.price === "" || Number(form.price) < 0) {
      newErrors.price = "Price must be 0 or more";
    }
    if (form.qty === "" || Number(form.qty) < 0) {
      newErrors.qty = "Quantity must be 0 or more";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const saved = await onSave({
      name: formatName(form.name),
      category: form.category,
      price: Number(form.price),
      qty: Number(form.qty),
    });

    if (saved) {
      setForm(emptyForm);
    }
  }

  function formatName(name) {
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

      <label>
        Name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
        />
      </label>
      {errors.name && <p className="error">{errors.name}</p>}

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Cloth">Cloth</option>
          <option value="Food">Food</option>
          <option value="Beauty & fashion">Beauty & fashion</option>
        </select>
      </label>
      {errors.category && <p className="error">{errors.category}</p>}

      <label>
        Price
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          onWheel={(e) => e.target.blur()}
          placeholder="Price"
        />
      </label>
      {errors.price && <p className="error">{errors.price}</p>}

      <label>
        Quantity
        <input
          type="number"
          name="qty"
          value={form.qty}
          onChange={handleChange}
          onWheel={(e) => e.target.blur()}
          placeholder="Quantity"
        />
      </label>
      {errors.qty && <p className="error">{errors.qty}</p>}

      <button type="submit">{editingProduct ? "Update" : "Add"}</button>
      {editingProduct && (
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default ProductForm;