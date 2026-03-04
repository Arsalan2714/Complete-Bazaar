import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, deleteProductLocal } from "../store/slices/adminSlice";
import AdminLayout from "../components/AdminLayout";
import API_URL from "../config";

const ProductsPage = () => {
    const dispatch = useDispatch();
    const adminToken = useSelector((s) => s.admin.adminToken);
    const { products, productsMeta } = useSelector((s) => s.admin);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchProducts = async (p = page, q = search) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/products?page=${p}&limit=15&search=${q}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const data = await res.json();
            if (res.ok) dispatch(setProducts(data));
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, [page]);

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProducts(1, search); };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product? This cannot be undone.")) return;
        setDeleteId(id);
        try {
            await fetch(`${API_URL}/api/admin/products/${id}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${adminToken}` },
            });
            dispatch(deleteProductLocal(id));
        } catch { }
        setDeleteId(null);
    };

    return (
        <AdminLayout>
            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-white">Products <span className="text-slate-500 text-lg font-normal">({productsMeta.total})</span></h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, brand, category…" className="px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64" />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium cursor-pointer transition-colors">Search</button>
                    </form>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/80">
                                    {["Product", "Category", "Price", "Stock", "Rating", "Seller", ""].map((h) => (
                                        <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {loading ? (
                                    <tr><td colSpan={7} className="text-center py-12 text-slate-500">Loading…</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-12 text-slate-500">No products found.</td></tr>
                                ) : products.map((p) => (
                                    <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-700/60 overflow-hidden flex-shrink-0">
                                                    <img src={`${API_URL}/${p.imageUrl}`} alt={p.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="text-slate-200 font-medium line-clamp-1 max-w-[160px]">{p.name}</p>
                                                    <p className="text-slate-500 text-xs">{p.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">{p.category}</span></td>
                                        <td className="px-5 py-3 text-indigo-400 font-semibold">₹{p.price.toFixed(0)}</td>
                                        <td className="px-5 py-3"><span className={`text-xs font-semibold ${p.stock > 10 ? "text-emerald-400" : p.stock > 0 ? "text-amber-400" : "text-red-400"}`}>{p.stock > 0 ? p.stock : "Out"}</span></td>
                                        <td className="px-5 py-3 text-slate-400">{p.rating} ⭐</td>
                                        <td className="px-5 py-3 text-slate-400 text-xs">{p.seller?.firstName} {p.seller?.lastName}</td>
                                        <td className="px-5 py-3">
                                            <button onClick={() => handleDelete(p._id)} disabled={deleteId === p._id} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {productsMeta.pages > 1 && (
                        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-slate-700/50">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm disabled:opacity-40 cursor-pointer hover:bg-slate-600 transition-colors">← Prev</button>
                            <span className="text-slate-400 text-sm">Page {page} of {productsMeta.pages}</span>
                            <button onClick={() => setPage(p => Math.min(productsMeta.pages, p + 1))} disabled={page === productsMeta.pages} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm disabled:opacity-40 cursor-pointer hover:bg-slate-600 transition-colors">Next →</button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProductsPage;
