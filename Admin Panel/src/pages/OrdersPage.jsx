import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, updateOrderStatus } from "../store/slices/adminSlice";
import AdminLayout from "../components/AdminLayout";
import API_URL from "../config";

const statuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
const statusColors = {
    Confirmed: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    Processing: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    Shipped: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    Delivered: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    Cancelled: "text-red-400 bg-red-500/10 border-red-500/30",
};

const OrdersPage = () => {
    const dispatch = useDispatch();
    const adminToken = useSelector((s) => s.admin.adminToken);
    const { orders, ordersMeta } = useSelector((s) => s.admin);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async (p = page, f = statusFilter) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/orders?page=${p}&limit=15&status=${f}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const data = await res.json();
            if (res.ok) dispatch(setOrders(data));
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, [page, statusFilter]);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
        } catch { }
        setUpdatingId(null);
    };

    const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    return (
        <AdminLayout>
            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-white">Orders <span className="text-slate-500 text-lg font-normal">({ordersMeta.total})</span></h1>
                    <div className="flex gap-2 flex-wrap">
                        {["", ...statuses].map((s) => (
                            <button key={s || "all"} onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${statusFilter === s ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" : "text-slate-400 border-slate-700 hover:border-slate-600"}`}>
                                {s || "All"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/80">
                                    {["Order", "Customer", "Items", "Amount", "Payment", "Date", "Status"].map((h) => (
                                        <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {loading ? (
                                    <tr><td colSpan={7} className="text-center py-12 text-slate-500">Loading…</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-12 text-slate-500">No orders found.</td></tr>
                                ) : orders.map((order, idx) => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-5 py-3"><span className="text-slate-400 text-xs font-mono">#{String(ordersMeta.total - ((page - 1) * 15) - idx).padStart(4, "0")}</span></td>
                                        <td className="px-5 py-3">
                                            <p className="text-slate-200 font-medium text-sm">{order.customer?.firstName} {order.customer?.lastName}</p>
                                            <p className="text-slate-500 text-xs">{order.customer?.email}</p>
                                        </td>
                                        <td className="px-5 py-3 text-slate-400">{order.products?.length ?? 0} item{order.products?.length !== 1 ? "s" : ""}</td>
                                        <td className="px-5 py-3 text-indigo-400 font-semibold">₹{order.totalAmount?.toFixed(0)}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${order.paymentMethod === "Online" ? "text-blue-400 bg-blue-500/10 border-blue-500/30" : "text-amber-400 bg-amber-500/10 border-amber-500/30"}`}>
                                                {order.paymentMethod === "Online" ? "💳 Online" : "💵 COD"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-400 text-xs">{fmt(order.createdAt)}</td>
                                        <td className="px-5 py-3">
                                            <select value={order.status || "Confirmed"} onChange={(e) => handleStatusChange(order._id, e.target.value)} disabled={updatingId === order._id}
                                                className={`text-xs font-medium px-2 py-1.5 rounded-lg border bg-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50 ${statusColors[order.status || "Confirmed"]}`}
                                                style={{ colorScheme: "dark" }}>
                                                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {ordersMeta.pages > 1 && (
                        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-slate-700/50">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm disabled:opacity-40 cursor-pointer hover:bg-slate-600 transition-colors">← Prev</button>
                            <span className="text-slate-400 text-sm">Page {page} of {ordersMeta.pages}</span>
                            <button onClick={() => setPage(p => Math.min(ordersMeta.pages, p + 1))} disabled={page === ordersMeta.pages} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm disabled:opacity-40 cursor-pointer hover:bg-slate-600 transition-colors">Next →</button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrdersPage;
