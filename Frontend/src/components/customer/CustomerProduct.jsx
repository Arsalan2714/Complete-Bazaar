import { Link } from "react-router-dom";

const CustomerProduct = ({ product, cart, wishlist, handleAddToCart, handleRemoveFromCart, handleToggleWishlist }) => {
    const isInCart = cart && cart.includes(product._id);
    const isWishlisted = wishlist && wishlist.includes(product._id);
    // Star rating helper
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(rating) ? "text-amber-400" : "text-slate-600"
                        }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl overflow-hidden hover:border-indigo-500/40 hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col h-full">
            {/* Clickable area - image + info */}
            <Link to={`/product/${product._id}`} className="flex-grow flex flex-col">
                {/* Product Image */}
                <div className="relative h-52 bg-slate-700/50 overflow-hidden flex-shrink-0">
                    <img
                        src={`http://localhost:3001/${product.imageUrl}`}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Wishlist Heart */}
                    <button
                        onClick={(e) => { e.preventDefault(); handleToggleWishlist(product._id); }}
                        className="absolute top-3 right-12 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-sm flex items-center justify-center hover:bg-slate-900/80 transition-all cursor-pointer z-10"
                    >
                        <svg className={`w-4.5 h-4.5 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : "text-slate-300"}`} fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/80 text-white backdrop-blur-sm">
                        {product.category}
                    </span>
                    {/* Stock Badge */}
                    <span
                        className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${product.stock > 0
                            ? "bg-emerald-500/80 text-white"
                            : "bg-red-500/80 text-white"
                            }`}
                    >
                        {product.stock > 0
                            ? `In Stock`
                            : "Out of Stock"}
                    </span>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 truncate">
                        {product.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">{product.brand}</p>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-xs text-slate-500">
                            ({product.numReviews}{" "}
                            {product.numReviews === 1 ? "review" : "reviews"})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="pt-3 border-t border-slate-700/50 mt-auto">
                        <span className="text-xl font-bold text-indigo-400">
                            ₹{product.price.toFixed(2)}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Cart Button - outside the Link to prevent navigation */}
            <div className="px-5 pb-5">
                {isInCart ? (
                    <button
                        onClick={() => handleRemoveFromCart(product._id)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white text-sm font-medium shadow-lg hover:shadow-red-500/30 transition-all duration-300 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove from Cart
                    </button>
                ) : (
                    <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock === 0}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-medium shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomerProduct;
