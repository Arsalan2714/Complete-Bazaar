import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchCustomerData, addToCart, removeFromCart, toggleWishlist } from "../../store/slices/customerSlice";
import ErrorMessage from '../common/ErrorMessages'
import CustomerProduct from "./CustomerProduct";

const CustomerHome = () => {
    const { products, cart, wishlist, isLoading, errorMessage } = useSelector(
        (state) => state.customer
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category") || "";
    const searchQuery = searchParams.get("search") || "";

    // Map old DB category names to new display names
    const categoryAliases = {
        "Electronics": ["electronics"],
        "Fashion": ["fashion", "clothing"],
        "Home & Living": ["home & living", "home"],
        "Books": ["books"],
        "Sports": ["sports"],
        "Beauty": ["beauty", "other"],
    };

    const categoryFiltered = selectedCategory
        ? products.filter((p) => {
            const cat = p.category.toLowerCase();
            const selected = selectedCategory.toLowerCase();
            if (cat === selected) return true;
            const aliases = categoryAliases[selectedCategory] || [];
            return aliases.includes(cat);
        })
        : products;

    const filteredProducts = searchQuery
        ? categoryFiltered.filter((p) => {
            const q = searchQuery.toLowerCase();
            return (
                p.name?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q)
            );
        })
        : categoryFiltered;

    useEffect(() => {
        dispatch(fetchCustomerData());
    }, []);

    const handleAddToCart = async (productId) => {
        if (!token) {
            navigate("/login");
            return;
        }
        await dispatch(addToCart(productId));
        navigate("/cart");
    };

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleToggleWishlist = (productId) => {
        if (!token) {
            navigate("/login");
            return;
        }
        dispatch(toggleWishlist(productId));
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">
                        Loading products...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (errorMessage.length > 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <div className="bg-slate-800/60 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                        <svg
                            className="w-8 h-8 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">
                        Something went wrong
                    </h2>
                    {errorMessage.map((msg, i) => (
                        <p key={i} className="text-slate-400">
                            {msg}
                        </p>
                    ))}
                    <button
                        onClick={() => dispatch(fetchCustomerData())}
                        className="mt-6 px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Products loaded successfully
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {searchQuery
                                ? `Results for "${searchQuery}"`
                                : selectedCategory
                                    ? selectedCategory
                                    : "Browse Products"}
                        </h1>
                        <ErrorMessage errorMessage={errorMessage} />
                        <p className="text-slate-400 mt-1">
                            {filteredProducts.length}{" "}
                            {filteredProducts.length === 1 ? "product" : "products"} found
                        </p>
                    </div>
                    {(selectedCategory || searchQuery) && (
                        <button
                            onClick={() => setSearchParams({})}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 text-sm font-medium transition-all duration-200 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {filteredProducts && filteredProducts.length === 0 ? (
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 border border-slate-600 mb-5">
                            <svg
                                className="w-10 h-10 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-200 mb-2">
                            {selectedCategory ? `No products in "${selectedCategory}"` : "No products available"}
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                            {selectedCategory ? "Try a different category or browse all products." : "Check back later for new products from our sellers."}
                        </p>
                        {selectedCategory && (
                            <button
                                onClick={() => setSearchParams({})}
                                className="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-colors cursor-pointer"
                            >
                                Browse All Products
                            </button>
                        )}
                    </div>
                ) : selectedCategory ? (
                    /* Filtered: flat grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <CustomerProduct key={product._id} product={product} cart={cart} wishlist={wishlist} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} handleToggleWishlist={handleToggleWishlist} />
                        ))}
                    </div>
                ) : (
                    /* No filter: group by category */
                    <div className="space-y-12">
                        {Object.entries(
                            filteredProducts.reduce((acc, product) => {
                                const cat = product.category || "Uncategorized";
                                if (!acc[cat]) acc[cat] = [];
                                acc[cat].push(product);
                                return acc;
                            }, {})
                        ).map(([category, items]) => (
                            <div key={category}>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-xl font-bold text-slate-100">{category}</h2>
                                    <button
                                        onClick={() => setSearchParams({ category })}
                                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                                    >
                                        View all →
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {items.map((product) => (
                                        <CustomerProduct key={product._id} product={product} cart={cart} wishlist={wishlist} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} handleToggleWishlist={handleToggleWishlist} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerHome;
