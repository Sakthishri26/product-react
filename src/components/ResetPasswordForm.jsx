import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";

function ResetPasswordForm({ onSave, onCancel }) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { newPassword: "" } });

  async function submit(values) {
    setServerError("");
    const message = await onSave(values.newPassword);
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
        label="New password"
        type="password"
        placeholder="At least 6 characters"
        error={errors.newPassword?.message}
        {...register("newPassword", {
          required: "Password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        })}
      />
      <div className="flex gap-2">
        <Button type="submit" loading={isSubmitting} loadingText="Saving..." className="flex-1">
          Reset password
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ResetPasswordForm;