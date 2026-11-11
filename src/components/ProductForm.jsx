import { useState } from "react";

const emptyForm = { name: "", category: "", price: "", qty: "" };

function formatName(name) {
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300";

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

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-8 flex w-full max-w-md flex-col gap-3 rounded-lg bg-white p-6 shadow-md"
    >
      <h2 className="text-center text-2xl font-bold">
        {editingProduct ? "Edit Product" : "Add Product"}
      </h2>

      <label className="flex flex-col gap-1 font-medium">
        Name
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          className={inputClass}
        />
      </label>
      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

      <label className="flex flex-col gap-1 font-medium">
        Category
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Cloth">Cloth</option>
          <option value="Food">Food</option>
          <option value="Beauty & fashion">Beauty & fashion</option>
        </select>
      </label>
      {errors.category && (
        <p className="text-sm text-red-600">{errors.category}</p>
      )}

      <label className="flex flex-col gap-1 font-medium">
        Price
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          onWheel={(e) => e.target.blur()}
          placeholder="Price"
          className={inputClass}
        />
      </label>
      {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}

      <label className="flex flex-col gap-1 font-medium">
        Quantity
        <input
          type="number"
          name="qty"
          value={form.qty}
          onChange={handleChange}
          onWheel={(e) => e.target.blur()}
          placeholder="Quantity"
          className={inputClass}
        />
      </label>
      {errors.qty && <p className="text-sm text-red-600">{errors.qty}</p>}

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {editingProduct ? "Update" : "Add"}
      </button>
      {editingProduct && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-md bg-gray-500 px-4 py-2.5 text-white transition hover:bg-gray-600"
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default ProductForm;