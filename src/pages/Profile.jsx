import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white";
const cardClass = "rounded-lg bg-white p-6 shadow-md dark:bg-gray-800";

function Profile() {
  const { user, setUser, authFetch } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [nameMsg, setNameMsg] = useState({ text: "", error: false });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [passMsg, setPassMsg] = useState({ text: "", error: false });

  async function saveName(e) {
    e.preventDefault();
    try {
      const response = await authFetch("/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      setUser(data.user);
      setNameMsg({ text: "Name updated", error: false });
    } catch (err) {
      setNameMsg({ text: err.message, error: true });
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    try {
      const response = await authFetch("/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      setPasswords({ oldPassword: "", newPassword: "" });
      setPassMsg({ text: "Password changed", error: false });
    } catch (err) {
      setPassMsg({ text: err.message, error: true });
    }
  }

  function handlePasswordChange(e) {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <form onSubmit={saveName} className={`${cardClass} flex flex-col gap-3`}>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {user?.email} ({user?.role})
        </p>
        <label className="flex flex-col gap-1 font-medium">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>
        {nameMsg.text && (
          <p className={nameMsg.error ? "text-red-600" : "text-green-600"}>{nameMsg.text}</p>
        )}
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Save name
        </button>
      </form>

      <form onSubmit={changePassword} className={`${cardClass} flex flex-col gap-3`}>
        <h2 className="text-xl font-bold">Change password</h2>
        <PasswordInput
          name="oldPassword"
          value={passwords.oldPassword}
          onChange={handlePasswordChange}
          placeholder="Old password"
          className={inputClass}
        />
        <PasswordInput
          name="newPassword"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          placeholder="New password (6+ characters)"
          className={inputClass}
        />
        {passMsg.text && (
          <p className={passMsg.error ? "text-red-600" : "text-green-600"}>{passMsg.text}</p>
        )}
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Change password
        </button>
      </form>
    </div>
  );
}

export default Profile;