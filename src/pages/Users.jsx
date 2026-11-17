import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { readError, friendlyError } from "../utils/api";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import UserForm from "../components/UserForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import ConfirmModal from "../components/ConfirmModal";

const jsonHeaders = { "Content-Type": "application/json" };
const smallBtn = "rounded px-3 py-1 text-sm text-white transition";

function Users() {
  const { user: me, authFetch, hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [editing, setEditing] = useState(null); 
  const [resetting, setResetting] = useState(null);
  const [disabling, setDisabling] = useState(null);

  async function loadData() {
    try {
      const usersResponse = await authFetch("/users");
      if (!usersResponse.ok) {
        throw new Error(await readError(usersResponse, "Can't load users"));
      }
      setUsers(await usersResponse.json());

     
      if (hasPermission("ROLE_MANAGE")) {
        const rolesResponse = await authFetch("/roles");
        if (rolesResponse.ok) {
          setRoles(await rolesResponse.json());
        }
      }
      setError("");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  
  async function send(path, method, body, successText) {
    try {
      const response = await authFetch(path, {
        method,
        headers: jsonHeaders,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "Request failed"));
      }
      toast.success(successText);
      await loadData();
      return null;
    } catch (err) {
      const message = friendlyError(err);
      toast.error(message);
      return message;
    }
  }

  async function saveUser(values) {
    const isNew = editing === "new";
    const message = await send(
      isNew ? "/users" : `/users/${editing._id}`,
      isNew ? "POST" : "PUT",
      values,
      isNew ? "User created" : "User updated"
    );
    if (!message) setEditing(null);
    return message;
  }

  async function resetPassword(newPassword) {
    const message = await send(
      `/users/${resetting._id}/reset-password`,
      "POST",
      { newPassword },
      "Password reset"
    );
    if (!message) setResetting(null);
    return message;
  }

  function setActive(u, active) {
    return send(`/users/${u._id}`, "PUT", { isActive: active }, active ? "User enabled" : "User disabled");
  }

  async function confirmDisable() {
    const u = disabling;
    setDisabling(null);
    await setActive(u, false);
  }

  const roleNames = [...new Set(users.map((u) => u.role?.name).filter(Boolean))];

  const visibleUsers = users
    .filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(search.trim().toLowerCase())
    )
    .filter((u) => roleFilter === "All" || u.role?.name === roleFilter);

  const fieldClass =
    "rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Users</h1>
        {hasPermission("USER_CREATE") && (
          <button
            onClick={() => setEditing("new")}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create user
          </button>
        )}
      </div>

      {loading && <Spinner />}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-4 flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className={`${fieldClass} w-full sm:w-64`}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={fieldClass}
            >
              <option value="All">All roles</option>
              {roleNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full min-w-[800px] bg-white text-left dark:bg-gray-800">
              <thead className="bg-gray-900 text-white dark:bg-black">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last login</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((u) => {
                  const isSelf = u._id === me?._id;
                  return (
                    <tr key={u._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.role?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            u.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        {isSelf ? (
                          <span className="text-sm text-gray-500">You</span>
                        ) : (
                          hasPermission("USER_EDIT") && (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setEditing(u)}
                                className={`${smallBtn} bg-blue-600 hover:bg-blue-700`}
                              >
                                Edit
                              </button>
                              {u.isActive ? (
                                <button
                                  onClick={() => setDisabling(u)}
                                  className={`${smallBtn} bg-red-600 hover:bg-red-700`}
                                >
                                  Disable
                                </button>
                              ) : (
                                <button
                                  onClick={() => setActive(u, true)}
                                  className={`${smallBtn} bg-green-600 hover:bg-green-700`}
                                >
                                  Enable
                                </button>
                              )}
                              <button
                                onClick={() => setResetting(u)}
                                className={`${smallBtn} bg-gray-600 hover:bg-gray-700`}
                              >
                                Reset password
                              </button>
                            </div>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {visibleUsers.length === 0 && (
            <p className="py-6 text-center text-gray-500">No users found.</p>
          )}
        </>
      )}

      {editing && (
        <Modal title={editing === "new" ? "Create user" : "Edit user"} onClose={() => setEditing(null)}>
          <UserForm
            user={editing === "new" ? null : editing}
            roles={roles}
            onSave={saveUser}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {resetting && (
        <Modal title={`Reset password for ${resetting.name}`} onClose={() => setResetting(null)}>
          <ResetPasswordForm onSave={resetPassword} onCancel={() => setResetting(null)} />
        </Modal>
      )}

      {disabling && (
        <ConfirmModal
          message={`${disabling.name} will no longer be able to log in.`}
          confirmLabel="Disable"
          onConfirm={confirmDisable}
          onCancel={() => setDisabling(null)}
        />
      )}
    </div>
  );
}

export default Users;