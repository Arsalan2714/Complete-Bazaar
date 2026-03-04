import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, deleteUserLocal } from "../store/slices/adminSlice";
import AdminLayout from "../components/AdminLayout";
import API_URL from "../config";

/* ── Edit User Modal ─────────────────────────────────────────── */
const EditModal = ({ user, adminToken, onClose, onSaved }) => {
    const [form, setForm] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        userType: user.userType || "customer",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${user._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update");
            onSaved(data.user);
            onClose();
        } catch (err) {
            setError(err.message);
        }
        setSaving(false);
    };

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            {/* Modal */}
            <div
                className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white">Edit User</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{user._id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "First Name", name: "firstName", type: "text" },
                        { label: "Last Name", name: "lastName", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Phone", name: "phone", type: "tel" },
                    ].map(({ label, name, type }) => (
                        <div key={name} className={name === "email" ? "col-span-2" : ""}>
                            <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                            />
                        </div>
                    ))}

                    {/* User Type */}
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1">User Type</label>
                        <select
                            name="userType"
                            value={form.userType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all cursor-pointer"
                            style={{ colorScheme: "dark" }}
                        >
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {saving ? (
                            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
                        ) : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Users Page ──────────────────────────────────────────────── */
const UsersPage = () => {
    const dispatch = useDispatch();
    const adminToken = useSelector((s) => s.admin.adminToken);
    const { users, usersMeta } = useSelector((s) => s.admin);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editUser, setEditUser] = useState(null); // user being edited

    const fetchUsers = async (p = page, q = search) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/users?page=${p}&limit=15&search=${q}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const data = await res.json();
            if (res.ok) dispatch(setUsers(data));
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, [page]);

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(1, search); };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        setDeleteId(id);
        try {
            await fetch(`${API_URL}/api/admin/users/${id}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${adminToken}` },
            });
            dispatch(deleteUserLocal(id));
        } catch { }
        setDeleteId(null);
    };

    // After a successful edit, update the row in-place via setUsers
    const handleUserSaved = (updatedUser) => {
        const updatedUsers = users.map((u) => (u._id === updatedUser._id ? updatedUser : u));
        dispatch(setUsers({ users: updatedUsers, total: usersMeta.total, pages: usersMeta.pages }));
    };

    return (
        <AdminLayout>
            {/* Edit modal */}
            {editUser && (
                <EditModal
                    user={editUser}
                    adminToken={adminToken}
                    onClose={() => setEditUser(null)}
                    onSaved={handleUserSaved}
                />
            )}

            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-white">
                        Users <span className="text-slate-500 text-lg font-normal">({usersMeta.total})</span>
                    </h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or email…"
                            className="px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-56"
                        />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium cursor-pointer transition-colors">
                            Search
                        </button>
                    </form>
                </div>

                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/80">
                                    {["Name", "Email", "Type", "Joined", "Orders", "Actions"].map((h) => (
                                        <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-12 text-slate-500">Loading…</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-12 text-slate-500">No users found.</td></tr>
                                ) : users.map((u) => (
                                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {u.firstName?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-slate-200 font-medium">{u.firstName} {u.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-400">{u.email}</td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.userType === "seller" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"}`}>
                                                {u.userType}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                                        <td className="px-5 py-3 text-slate-400">{u.orders?.length ?? 0}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                {/* Edit button */}
                                                <button
                                                    onClick={() => setEditUser(u)}
                                                    className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                {/* Delete button */}
                                                <button
                                                    onClick={() => handleDelete(u._id)}
                                                    disabled={deleteId === u._id}
                                                    className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {usersMeta.pages > 1 && (
                        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-slate-700/50">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm disabled:opacity-40 cursor-pointer hover:bg-slate-600 transition-colors">← Prev</button>
                            <span className="text-slate-400 text-sm">Page {page} of {usersMeta.pages}</span>
                            <button onClick={() => setPage(p => Math.min(usersMeta.pages, p + 1))} disabled={page === usersMeta.pages} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm disabled:opacity-40 cursor-pointer hover:bg-slate-600 transition-colors">Next →</button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UsersPage;
