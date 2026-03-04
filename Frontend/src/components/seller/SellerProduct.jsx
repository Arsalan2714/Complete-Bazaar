const SellerProduct = ({ product, handleEditProduct, handleDeleteProduct }) => {
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
            {/* Product Image */}
            <div className="relative h-52 bg-slate-700/50 overflow-hidden flex-shrink-0">
                <img
                    src={`http://localhost:3001/${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
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
                        ? `${product.stock} in stock`
                        : "Out of stock"}
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

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 mt-auto">
                    <span className="text-xl font-bold text-indigo-400">
                        ₹{product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button className="p-2 rounded-lg border border-slate-600 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer" onClick={() => handleEditProduct(product._id)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        {/* Delete Button */}
                        <button className="p-2 rounded-lg border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-200 cursor-pointer" onClick={() => handleDeleteProduct(product._id)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProduct;