import React, { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import RoleSwitcher from "@/Components/Shared/RoleSwitcher";

const roles = ["admin", "moderator", "user"];

const RoleManagement = () => {
  const axiosSecure = useAxiosSecure();
  const { user, logOutUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [bootstrapLoading, setBootstrapLoading] = useState(false);
  const [bootstrapMessage, setBootstrapMessage] = useState("");

  const currentEmail = user?.email || null;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosSecure.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole, targetEmail) => {
    setSavingId(userId);
    setError(null);
    try {
      await axiosSecure.patch(`/users/role/${userId}`, { newRole });
      await fetchUsers();
      if (currentEmail && targetEmail && currentEmail === targetEmail) {
        await logOutUser();
        window.location.href = "/auth/login";
      }
    } catch (e) {
      setError("Failed to update role");
    } finally {
      setSavingId(null);
    }
  };

  const bootstrapAdmin = async () => {
    setBootstrapLoading(true);
    setBootstrapMessage("");
    try {
      const res = await axiosSecure.post("/users/bootstrap/admin");
      if (res?.data?.success) {
        setBootstrapMessage("Admin created. You will be logged out to refresh permissions.");
        await fetchUsers();
        await logOutUser();
        window.location.href = "/auth/login";
      } else {
        setBootstrapMessage(res?.data?.message || "Bootstrap failed");
      }
    } catch (e) {
      setBootstrapMessage("Bootstrap failed");
    } finally {
      setBootstrapLoading(false);
    }
  };

  const hasAdmin = useMemo(() => users.some(u => (u.role || "").toLowerCase() === "admin"), [users]);

  const tableRows = useMemo(() => users, [users]);

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <div className="flex items-center gap-4">
          <RoleSwitcher initialRole="user" />
          {!hasAdmin && (
            <button
              type="button"
              onClick={bootstrapAdmin}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={bootstrapLoading}
            >
              {bootstrapLoading ? "Creating Admin…" : "Bootstrap Admin"}
            </button>
          )}
          <button
            onClick={fetchUsers}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {bootstrapMessage && (
        <div className="mb-4 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 bg-blue-50">{bootstrapMessage}</div>
      )}

      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg border border-red-300 text-red-700 bg-red-50">{error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Current Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((u, idx) => (
              <tr key={u._id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3">{u.name || "—"}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role || "user"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      defaultValue={u.role || "user"}
                      onChange={(e) => handleChangeRole(u._id, e.target.value, u.email)}
                      className="border rounded-lg px-3 py-2"
                      disabled={savingId === u._id}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r} className="capitalize">{r}</option>
                      ))}
                    </select>
                    {savingId === u._id && <span className="text-sm text-gray-500">Saving…</span>}
                  </div>
                </td>
              </tr>
            ))}
            {tableRows.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManagement;


