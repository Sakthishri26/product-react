import { useState } from "react";

function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    qty: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
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

    console.log("Valid form:", form);
    setForm({ name: "", category: "", price: "", qty: "" });
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add Product</h2>

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
          placeholder="Quantity"
        />
      </label>
      {errors.qty && <p className="error">{errors.qty}</p>}

      <button type="submit">Add</button>
    </form>
  );
}

export default ProductForm;