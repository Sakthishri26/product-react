import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";


function UserForm({ user, roles, onSave, onCancel }) {
  const isEditing = Boolean(user);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isEditing
      ? { name: user.name, role: user.role?._id || "" }
      : { name: "", email: "", password: "", role: "" },
  });

  async function submit(values) {
    setServerError("");
    const message = await onSave(values);
    if (message) {
      setServerError(message); 
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-3">
      {serverError && (
        <p className="rounded bg-red-100 p-2 text-center text-sm text-red-700">{serverError}</p>
      )}

      <Input
        label="Name"
        placeholder="Full name"
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />

      {!isEditing && (
        <>
          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
        </>
      )}

      <Select
        label="Role"
        error={errors.role?.message}
        {...register("role", { required: "Please choose a role" })}
      >
        <option value="">Select role</option>
        {roles.map((r) => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </Select>

      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting} loadingText="Saving..." className="flex-1">
          {isEditing ? "Save changes" : "Create user"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default UserForm;