import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCustomerData, addToCart, removeFromCart, toggleWishlist } from "../../store/slices/customerSlice";
import CustomerProduct from "./CustomerProduct";

const categoryAliases = {
    "electronics": ["electronics"],
    "fashion": ["fashion", "clothing"],
    "home-living": ["home & living", "home"],
    "books": ["books"],
    "sports": ["sports"],
    "beauty": ["beauty", "other"],
};

const categoryDisplayNames = {
    "electronics": "Electronics",
    "fashion": "Fashion",
    "home-living": "Home & Living",
    "books": "Books",
    "sports": "Sports",
    "beauty": "Beauty",
};

const categoryEmojis = {
    "electronics": "💻",
    "fashion": "👗",
    "home-living": "🏠",
    "books": "📚",
    "sports": "⚽",
    "beauty": "✨",
};

const CategoryPage = () => {
    const { name } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const { products, cart, wishlist, isLoading } = useSelector((state) => state.customer);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchCustomerData());
        }
    }, []);

    const displayName = categoryDisplayNames[name] || name;
    const emoji = categoryEmojis[name] || "📦";
    const aliases = categoryAliases[name] || [name];

    const categoryProducts = products.filter((p) =>
        aliases.includes(p.category.toLowerCase())
    );

    const handleAddToCart = async (productId) => {
        if (!token) { navigate("/login"); return; }
        await dispatch(addToCart(productId));
        navigate("/cart");
    };

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleToggleWishlist = (productId) => {
        if (!token) { navigate("/login"); return; }
        dispatch(toggleWishlist(productId));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link to="/" className="hover:text-slate-300 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-slate-300 transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-slate-300">{displayName}</span>
                </div>

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-4xl">{emoji}</span>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {displayName}
                        </h1>
                        <p className="text-slate-400 mt-1">
                            {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"} available
                        </p>
                    </div>
                </div>

                {/* Products */}
                {categoryProducts.length === 0 ? (
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 border border-slate-600 mb-5">
                            <span className="text-4xl">{emoji}</span>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-200 mb-2">
                            No products in {displayName} yet
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                            Check back later for new products in this category.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                        >
                            Browse All Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryProducts.map((product) => (
                            <CustomerProduct
                                key={product._id}
                                product={product}
                                cart={cart}
                                wishlist={wishlist}
                                handleAddToCart={handleAddToCart}
                                handleRemoveFromCart={handleRemoveFromCart}
                                handleToggleWishlist={handleToggleWishlist}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
