import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCustomerData, addToCart, toggleWishlist } from "../../store/slices/customerSlice";

const Wishlist = () => {
    const { products, cart, wishlist, isLoading } = useSelector((state) => state.customer);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchCustomerData());
        }
    }, []);

    const wishlistItems = products.filter((p) => wishlist && wishlist.includes(p._id));

    const handleRemoveFromWishlist = (productId) => {
        dispatch(toggleWishlist(productId));
    };

    const handleAddToCart = async (productId) => {
        if (!token) {
            navigate("/login");
            return;
        }
        await dispatch(addToCart(productId));
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(rating) ? "text-amber-400" : "text-slate-600"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    // Loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">Loading wishlist...</p>
                </div>
            </div>
        );
    }

    // Empty
    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 border border-slate-600 mb-5">
                            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-200 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                            Browse products and add items you love to your wishlist.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                        My Wishlist
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                    </p>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => {
                        const isInCart = cart && cart.includes(item._id);
                        return (
                            <div
                                key={item._id}
                                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl overflow-hidden hover:border-indigo-500/40 hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col"
                            >
                                {/* Image + Link */}
                                <Link to={`/product/${item._id}`} className="flex-grow flex flex-col">
                                    <div className="relative h-52 bg-slate-700/50 overflow-hidden flex-shrink-0">
                                        <img
                                            src={`http://localhost:3001/${item.imageUrl}`}
                                            alt={item.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Remove from wishlist */}
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleRemoveFromWishlist(item._id); }}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-all cursor-pointer z-10"
                                            title="Remove from wishlist"
                                        >
                                            <svg className="w-4.5 h-4.5 text-red-500 fill-red-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                        {/* Stock Badge */}
                                        <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${item.stock > 0 ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"}`}>
                                            {item.stock > 0 ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5 flex-grow flex flex-col">
                                        <h3 className="text-lg font-semibold text-slate-100 mb-1 truncate">{item.name}</h3>
                                        <p className="text-sm text-slate-400 mb-2">{item.brand}</p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex">{renderStars(item.rating)}</div>
                                            <span className="text-xs text-slate-500">({item.numReviews})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="pt-3 border-t border-slate-700/50 mt-auto">
                                            <span className="text-xl font-bold text-indigo-400">₹{item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Actions */}
                                <div className="px-5 pb-5 space-y-2">
                                    {!isInCart ? (
                                        <button
                                            onClick={() => handleAddToCart(item._id)}
                                            disabled={item.stock === 0}
                                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-medium shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                            </svg>
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <Link
                                            to="/cart"
                                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium shadow-lg transition-all duration-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Go to Cart
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item._id)}
                                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 text-sm font-medium transition-all duration-300 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
