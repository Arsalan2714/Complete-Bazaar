import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCustomerData, addToCart, removeFromCart } from "../../../store/slices/customerSlice";
import CartProducts from "./CartProducts";
import CartSummary from "./CartSummary";

const Cart = () => {
    const { products, cart, isLoading } = useSelector(
        (state) => state.customer
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchCustomerData());
        }
    }, []);

    // Group cart items by product ID with quantities
    const groupedCart = cart.reduce((acc, productId) => {
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
    }, {});

    // Map grouped cart to full product objects with quantity
    const cartItems = Object.entries(groupedCart)
        .map(([productId, quantity]) => {
            const product = products.find((p) => p._id === productId);
            return product ? { ...product, quantity } : null;
        })
        .filter(Boolean);

    // Calculate totals
    const totalItems = cart.length;
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleIncrease = (productId) => {
        dispatch(addToCart(productId));
    };

    const handleDecrease = (productId) => {
        dispatch(removeFromCart(productId));
    };


    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">
                        Loading your cart...
                    </p>
                </div>
            </div>
        );
    }

    // Empty Cart
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 border border-slate-600 mb-5">
                            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-200 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                            Browse products and add items to your cart.
                        </p>
                        <Link
                            to="/"
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Shopping Cart
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {cartItems.length} {cartItems.length === 1 ? "product" : "products"} · {totalItems} {totalItems === 1 ? "item" : "items"} total
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <CartProducts
                        cartItems={cartItems}
                        handleIncrease={handleIncrease}
                        handleDecrease={handleDecrease}
                    />
                    <CartSummary
                        totalItems={totalItems}
                        totalPrice={totalPrice}
                    />
                </div>
            </div>
        </div>
    );
};

export default Cart;
