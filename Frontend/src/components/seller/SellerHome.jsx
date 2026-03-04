import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSellerProdusts } from "../../store/slices/sellerSlice";

const SellerHome = () => {
    const { products, isLoading } = useSelector((state) => state.seller);
    const firstName = useSelector((state) => state.auth.firstName) || localStorage.getItem("firstName") || "Seller";
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSellerProdusts());
    }, []);

    const totalProducts = products.length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const inStock = products.filter((p) => p.stock > 5).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const avgRating = totalProducts > 0 ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / totalProducts).toFixed(1) : "0.0";
    const totalReviews = products.reduce((sum, p) => sum + (p.numReviews || 0), 0);

    const stats = [
        { label: "Total Products", value: totalProducts, icon: "📦", color: "from-indigo-500/20 to-purple-500/20", border: "border-indigo-500/30", textColor: "text-indigo-400" },
        { label: "In Stock", value: inStock, icon: "✅", color: "from-emerald-500/20 to-green-500/20", border: "border-emerald-500/30", textColor: "text-emerald-400" },
        { label: "Low Stock", value: lowStock, icon: "⚠️", color: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/30", textColor: "text-amber-400" },
        { label: "Out of Stock", value: outOfStock, icon: "❌", color: "from-red-500/20 to-rose-500/20", border: "border-red-500/30", textColor: "text-red-400" },
        { label: "Avg Rating", value: `${avgRating} ★`, icon: "⭐", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", textColor: "text-amber-400" },
        { label: "Total Reviews", value: totalReviews, icon: "💬", color: "from-cyan-500/20 to-teal-500/20", border: "border-cyan-500/30", textColor: "text-cyan-400" },
    ];

    const quickActions = [
        {
            title: "My Products",
            description: "View and manage all your listed products",
            icon: (
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            link: "/products",
            color: "from-indigo-500/10 to-purple-500/10",
            border: "border-indigo-500/20",
        },
        {
            title: "Add Product",
            description: "List a new product in your store",
            icon: (
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
            ),
            link: "/add-product",
            color: "from-emerald-500/10 to-green-500/10",
            border: "border-emerald-500/20",
        },
        {
            title: "My Profile",
            description: "Update your account details",
            icon: (
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            link: "/profile",
            color: "from-purple-500/10 to-pink-500/10",
            border: "border-purple-500/20",
        },
        {
            title: "Security",
            description: "Manage your password and account security",
            icon: (
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            link: "/security",
            color: "from-amber-500/10 to-orange-500/10",
            border: "border-amber-500/20",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Welcome Banner */}
                <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-3">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                            Seller Dashboard
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
                            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{firstName}</span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Here's an overview of your store performance.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border ${stat.border} rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300`}
                            >
                                <span className="text-2xl mb-1 block">{stat.icon}</span>
                                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Inventory Value */}
                {!isLoading && (
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-10">
                        <h2 className="text-lg font-semibold text-slate-200 mb-1">Total Inventory Value</h2>
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            ₹{totalValue.toLocaleString("en-IN")}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">Based on price × stock for all products</p>
                    </div>
                )}

                {/* Quick Actions */}
                <h2 className="text-xl font-bold text-slate-200 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            to={action.link}
                            className={`bg-gradient-to-br ${action.color} backdrop-blur-sm border ${action.border} rounded-xl p-5 hover:scale-[1.02] transition-all duration-300 group`}
                        >
                            <div className="mb-3">{action.icon}</div>
                            <h3 className="text-base font-semibold text-slate-200 mb-1 group-hover:text-white transition-colors">{action.title}</h3>
                            <p className="text-sm text-slate-400">{action.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerHome;
