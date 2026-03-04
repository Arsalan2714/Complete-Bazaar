const CartItems = ({ item, handleIncrease, handleDecrease }) => {
    return (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-4 flex flex-wrap items-center gap-4 hover:border-indigo-500/30 transition-all duration-300">
            {/* Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-700/50 rounded-xl overflow-hidden flex-shrink-0">
                <img
                    src={`http://localhost:3001/${item.imageUrl}`}
                    alt={item.name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-100 truncate">
                    {item.name}
                </h3>
                <p className="text-sm text-slate-400">{item.brand}</p>
                <p className="text-sm text-indigo-400 font-medium mt-1">
                    ₹{item.price.toFixed(2)} each
                </p>
            </div>

            {/* Quantity Controls + Subtotal — full-width row on mobile */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleDecrease(item._id)}
                        className="w-8 h-8 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer flex items-center justify-center text-lg font-bold"
                    >
                        −
                    </button>
                    <span className="w-8 text-center text-lg font-semibold text-slate-100">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => handleIncrease(item._id)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer flex items-center justify-center text-lg font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-600 disabled:hover:bg-transparent disabled:hover:text-slate-300"
                    >
                        +
                    </button>
                </div>

                {/* Subtotal */}
                <p className="text-lg sm:text-xl font-bold text-indigo-400">
                    ₹{(item.price * item.quantity).toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default CartItems;

