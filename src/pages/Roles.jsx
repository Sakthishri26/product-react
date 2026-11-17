import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { readError, friendlyError } from "../utils/api";
import Spinner from "../components/Spinner";

function Roles() {
  const { authFetch } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          authFetch("/roles"),
          authFetch("/roles/permissions"),
        ]);
        if (!rolesResponse.ok) {
          throw new Error(await readError(rolesResponse, "Can't load roles"));
        }
        if (!permissionsResponse.ok) {
          throw new Error(await readError(permissionsResponse, "Can't load permissions"));
        }
        setRoles(await rolesResponse.json());
        setPermissions(await permissionsResponse.json());
      } catch (err) {
        setError(friendlyError(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authFetch]);

  
  async function toggle(role, permission) {
    const next = role.permissions.includes(permission)
      ? role.permissions.filter((p) => p !== permission)
      : [...role.permissions, permission];

    setSaving(role._id + permission);
    try {
      const response = await authFetch(`/roles/${role._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: next }),
      });
      if (!response.ok) {
        throw new Error(await readError(response, "Update failed"));
      }
      const updated = await response.json();
      setRoles((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      toast.success("Role updated");
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setSaving("");
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-2xl font-bold">Roles and permissions</h1>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        Tick a box to give a role that permission. It is saved immediately.
      </p>

      {loading && <Spinner />}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full min-w-[500px] bg-white text-center dark:bg-gray-800">
            <thead className="bg-gray-900 text-white dark:bg-black">
              <tr>
                <th className="px-4 py-3 text-left">Permission</th>
                {roles.map((role) => (
                  <th key={role._id} className="px-4 py-3">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr
                  key={permission}
                  className="border-b border-gray-200 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-left font-mono text-sm">{permission}</td>
                  {roles.map((role) => (
                    <td key={role._id} className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={role.permissions.includes(permission)}
                        disabled={
                          saving === role._id + permission ||
                          (role.name === "Admin" && permission === "ROLE_MANAGE")
                        }
                        onChange={() => toggle(role, permission)}
                        aria-label={`${role.name} ${permission}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Roles;