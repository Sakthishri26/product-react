import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

const emptyForm = { name: "", category: "", price: "", qty: "" };

function formatName(name) {
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}


function ProductForm({ editingProduct, onSave, onCancel }) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: editingProduct
      ? {
          name: editingProduct.name,
          category: editingProduct.category || "",
          price: String(editingProduct.price),
          qty: String(editingProduct.qty),
        }
      : emptyForm,
  });

  async function submit(values) {
    setServerError("");
    const message = await onSave({
      name: formatName(values.name),
      category: values.category,
      price: Number(values.price),
      qty: Number(values.qty),
    });

    if (message) {
      setServerError(message); 
    } else {
      reset(emptyForm);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="mx-auto my-6 flex w-full max-w-md flex-col gap-3 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
    >
      <h2 className="text-center text-2xl font-bold">
        {editingProduct ? "Edit Product" : "Add Product"}
      </h2>

      {serverError && (
        <p className="rounded bg-red-100 p-2 text-center text-sm text-red-700">
          {serverError}
        </p>
      )}

      <Input
        label="Name"
        placeholder="Product name"
        error={errors.name?.message}
        {...register("name", {
          required: "Name is required",
          validate: (v) => v.trim() !== "" || "Name is required",
        })}
      />

      <Select
        label="Category"
        error={errors.category?.message}
        {...register("category", { required: "Please choose a category" })}
      >
        <option value="">Select category</option>
        <option value="Electronics">Electronics</option>
        <option value="Books">Books</option>
        <option value="Cloth">Cloth</option>
        <option value="Food">Food</option>
        <option value="Beauty & fashion">Beauty & fashion</option>
      </Select>

      <Input
        label="Price"
        type="number"
        placeholder="Price"
        error={errors.price?.message}
        {...register("price", {
          required: "Price is required",
          min: { value: 0, message: "Price must be 0 or more" },
        })}
      />

      <Input
        label="Quantity"
        type="number"
        placeholder="Quantity"
        error={errors.qty?.message}
        {...register("qty", {
          required: "Quantity is required",
          min: { value: 0, message: "Quantity must be 0 or more" },
          validate: (v) => Number.isInteger(Number(v)) || "Quantity must be a whole number",
        })}
      />

      <Button type="submit" loading={isSubmitting} loadingText="Saving..." className="w-full">
        {editingProduct ? "Update" : "Add"}
      </Button>

      {editingProduct && (
        <Button type="button" variant="secondary" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      )}
    </form>
  );
}

export default ProductForm;