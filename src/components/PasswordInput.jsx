import { useState } from "react";

function PasswordInput({ value, onChange, name = "password", placeholder = "Password", className }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} pr-16`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-0 px-3 text-sm text-blue-600 dark:text-blue-400"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export default PasswordInput;