import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useState, useEffect } from "react";

const NavBar = () => {
    const { isLoggedIn, userType, firstName: reduxName } = useSelector((state) => state.auth);
    const firstName = reduxName || localStorage.getItem("firstName");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
        if (!location.pathname.startsWith("/products")) {
            setSearchQuery("");
            setSearchCategory("");
        }
    }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        const params = new URLSearchParams();
        if (q) params.set("search", q);
        if (searchCategory) params.set("category", searchCategory);
        if (q || searchCategory) navigate(`/products?${params.toString()}`);
        setMobileOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const navLinks = userType === "seller"
        ? [
            { to: "/add-product", label: "Add Product" },
            { to: "/products", label: "Products" },
        ]
        : [
            { to: "/products", label: "🛍️ Products" },
            { to: "/cart", label: "🛒 Cart" },
            { to: "/wishlist", label: "❤️ Wishlist" },
            { to: "/orders", label: "📝 Orders" },
        ];

    return (
        <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg sticky top-0 z-50">
            {/* ── Main bar ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">

                {/* Brand */}
                <Link
                    to="/"
                    className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight hover:from-indigo-300 hover:to-purple-300 transition-all duration-300 flex-shrink-0"
                >
                    Complete Bazaar
                </Link>

                {/* Desktop nav links */}
                <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
                    {navLinks.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* Search bar — desktop */}
                {userType !== "seller" && (
                    <form
                        onSubmit={handleSearch}
                        className="flex-1 max-w-2xl mx-2 hidden sm:flex items-center h-10 rounded-full bg-slate-800/80 border border-slate-600/60 hover:border-slate-500 focus-within:border-indigo-500/80 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all duration-200 overflow-hidden"
                    >
                        {/* Category Dropdown */}
                        <div className="relative flex-shrink-0 flex items-center h-full pl-3 pr-1">
                            <select
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                                className="appearance-none bg-transparent text-slate-300 text-xs font-semibold pr-5 h-full focus:outline-none cursor-pointer"
                                style={{ backgroundColor: "#1e293b", colorScheme: "dark" }}
                            >
                                <option value="">All</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home & Living">Home &amp; Living</option>
                                <option value="Books">Books</option>
                                <option value="Sports">Sports</option>
                                <option value="Beauty">Beauty</option>
                            </select>
                            <svg className="w-3 h-3 text-slate-500 absolute right-2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className="w-px h-5 bg-slate-600/80 flex-shrink-0" />

                        <div className="relative flex-1 h-full flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Escape" && setSearchQuery("")}
                                placeholder="Search products, brands…"
                                className="w-full h-full pl-3 pr-8 bg-transparent text-slate-200 text-sm placeholder-slate-500 focus:outline-none"
                            />
                            {searchQuery && (
                                <button type="button" onClick={() => setSearchQuery("")} className="absolute right-2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <button type="submit" className="flex-shrink-0 m-1 h-8 px-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white flex items-center gap-1.5 text-xs font-semibold shadow-md transition-all duration-200 cursor-pointer">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <span className="hidden md:inline">Search</span>
                        </button>
                    </form>
                )}

                {/* Right: Auth (desktop) */}
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0 ml-auto">
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
                                    {firstName ? firstName[0].toUpperCase() : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="hidden lg:block leading-tight">
                                    <p className="text-[11px] text-slate-400">Hello,</p>
                                    <p className="text-sm font-semibold text-slate-200">{firstName || "Account"}</p>
                                </div>
                            </Link>
                            <button onClick={handleLogout} className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200">Login</Link>
                            <Link to="/signup" className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200">Sign Up</Link>
                        </>
                    )}
                </div>

                {/* Hamburger (mobile) */}
                <button
                    onClick={() => setMobileOpen((o) => !o)}
                    className="sm:hidden ml-auto flex-shrink-0 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            {mobileOpen && (
                <div className="sm:hidden border-t border-slate-700/60 bg-slate-900/95 backdrop-blur-md px-4 pb-5 pt-3 space-y-1">

                    {/* Mobile search */}
                    {userType !== "seller" && (
                        <form onSubmit={handleSearch} className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                                <select
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    className="flex-shrink-0 bg-slate-800 border border-slate-600 text-slate-300 text-xs rounded-lg px-2 py-2 focus:outline-none cursor-pointer"
                                    style={{ colorScheme: "dark" }}
                                >
                                    <option value="">All</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home & Living">Home &amp; Living</option>
                                    <option value="Books">Books</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Beauty">Beauty</option>
                                </select>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products, brands…"
                                    className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold cursor-pointer">
                                Search
                            </button>
                        </form>
                    )}

                    {/* Nav links */}
                    {navLinks.map((l) => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className="block text-slate-300 hover:text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
                        >
                            {l.label}
                        </Link>
                    ))}

                    <div className="border-t border-slate-700/60 pt-3 mt-2 space-y-1">
                        {isLoggedIn ? (
                            <>
                                <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        {firstName ? firstName[0].toUpperCase() : "U"}
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Hello,</p>
                                        <p className="text-sm font-semibold text-slate-200">{firstName || "Account"}</p>
                                    </div>
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left text-slate-300 hover:text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-all cursor-pointer">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-slate-300 hover:text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-all">Login</Link>
                                <Link to="/signup" className="block text-center bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
