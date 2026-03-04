import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { placeOrder } from "../../../store/slices/customerSlice";

const CartSummary = ({ totalItems, totalPrice }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const shipping = totalPrice >= 500 ? 0 : 100;
    const gst = totalPrice * 0.18;
    const grandTotal = totalPrice + shipping + gst;

    return (
        <div className="lg:w-80">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-slate-100 mb-4">
                    Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-slate-400 text-sm">
                        <span>Items ({totalItems})</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-sm">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? "text-emerald-400" : ""}>
                            {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                        </span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-sm">
                        <span>GST (18%)</span>
                        <span>₹{gst.toFixed(2)}</span>
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-5">
                    <div className="flex justify-between">
                        <span className="text-lg font-semibold text-slate-100">Total</span>
                        <span className="text-xl font-bold text-indigo-400">₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer"
                >
                    Proceed to Checkout
                </button>

                <Link
                    to="/"
                    className="block text-center mt-3 text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200"
                >
                    ← Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default CartSummary;
