import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStats } from "../store/slices/adminSlice";
import AdminLayout from "../components/AdminLayout";
import API_URL from "../config";

const statusColors = {
    Confirmed: "bg-indigo-500", Processing: "bg-amber-500",
    Shipped: "bg-blue-500", Delivered: "bg-emerald-500", Cancelled: "bg-red-500",
};
const statusBadge = {
    Confirmed: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    Processing: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    Shipped: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    Delivered: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    Cancelled: "text-red-400 bg-red-500/10 border-red-500/30",
};

const StatCard = ({ title, value, sub, icon, colorClass }) => (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>{icon}</div>
        </div>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        <p className="text-sm font-medium text-slate-300 mt-0.5">{title}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const adminToken = useSelector((s) => s.admin.adminToken);
    const stats = useSelector((s) => s.admin.stats);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });
                const data = await res.json();
                if (res.ok) dispatch(setStats(data));
            } catch { }
        };
        fetchStats();
    }, [adminToken]);

    const maxRevenue = stats?.monthlyRevenue
        ? Math.max(...stats.monthlyRevenue.map((m) => m.amount), 1)
        : 1;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Users" value={stats?.totalUsers ?? "—"} sub={`${stats?.customers ?? 0} customers · ${stats?.sellers ?? 0} sellers`} colorClass="bg-indigo-500/20 text-indigo-400"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    <StatCard title="Products" value={stats?.totalProducts ?? "—"} colorClass="bg-purple-500/20 text-purple-400"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                    />
                    <StatCard title="Total Orders" value={stats?.totalOrders ?? "—"} colorClass="bg-blue-500/20 text-blue-400"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                    />
                    <StatCard title="Total Revenue" value={stats ? `₹${stats.totalRevenue.toFixed(0)}` : "—"} sub="Excl. cancelled" colorClass="bg-emerald-500/20 text-emerald-400"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue chart */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-slate-300 mb-4">Revenue — Last 6 Months</h2>
                        {stats?.monthlyRevenue ? (
                            <div className="flex items-end gap-2 h-36">
                                {stats.monthlyRevenue.map((m) => (
                                    <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[10px] text-slate-500">{m.amount > 0 ? "₹" + (m.amount / 1000).toFixed(1) + "k" : "₹0"}</span>
                                        <div className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 min-h-[4px] transition-all duration-700" style={{ height: `${Math.max((m.amount / maxRevenue) * 100, 2)}%` }} />
                                        <span className="text-[10px] text-slate-500">{m.label}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="h-36 flex items-center justify-center text-slate-500 text-sm">Loading…</div>}
                    </div>

                    {/* Order status breakdown */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-slate-300 mb-4">Orders by Status</h2>
                        {stats?.statusCounts ? (
                            <div className="space-y-3">
                                {Object.entries(stats.statusCounts).map(([s, count]) => {
                                    const pct = stats.totalOrders > 0 ? ((count / stats.totalOrders) * 100).toFixed(0) : 0;
                                    return (
                                        <div key={s}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${statusBadge[s]}`}>{s}</span>
                                                <span className="text-slate-400">{count} ({pct}%)</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-700 rounded-full">
                                                <div className={`h-full rounded-full ${statusColors[s]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : <div className="h-36 flex items-center justify-center text-slate-500 text-sm">Loading…</div>}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
