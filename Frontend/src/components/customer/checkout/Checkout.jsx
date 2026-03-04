import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCustomerData, placeOrder } from "../../../store/slices/customerSlice";

// Loads the Razorpay checkout.js script dynamically
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (document.getElementById("razorpay-script")) return resolve(true);
        const script = document.createElement("script");
        script.id = "razorpay-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const Checkout = () => {
    const { products, cart, isLoading } = useSelector((state) => state.customer);
    const token = useSelector((state) => state.auth.token);
    const { firstName, lastName, email } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddrId, setSelectedAddrId] = useState(null);
    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
    });
    const [errors, setErrors] = useState({});
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    useEffect(() => {
        if (!token) navigate("/login");
    }, [token]);

    useEffect(() => {
        if (products.length === 0) dispatch(fetchCustomerData());
    }, []);

    // Fetch saved addresses & auto-fill default
    useEffect(() => {
        if (!token) return;
        const fetchAddresses = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/customer/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok && data.addresses?.length > 0) {
                    setSavedAddresses(data.addresses);
                    const defaultAddr = data.addresses.find((a) => a.isDefault) || data.addresses[0];
                    fillFromSaved(defaultAddr, data.firstName, data.lastName, data.phone);
                    setSelectedAddrId(defaultAddr._id);
                }
            } catch (err) { /* ignore */ }
        };
        fetchAddresses();
    }, [token]);

    useEffect(() => {
        if (!isLoading && cart.length === 0) navigate("/cart");
    }, [cart, isLoading]);

    const fillFromSaved = (addr, fName, lName, phone) => {
        setAddress({
            fullName: `${fName || ""} ${lName || ""}`.trim(),
            phone: phone || "",
            addressLine1: addr.street || "",
            addressLine2: "",
            city: addr.city || "",
            state: addr.state || "",
            pincode: addr.pincode || "",
            landmark: "",
        });
        setErrors({});
    };

    const handleSelectAddress = (addr) => {
        setSelectedAddrId(addr._id);
        fillFromSaved(addr, address.fullName.split(" ")[0], address.fullName.split(" ").slice(1).join(" "), address.phone);
    };

    const handleNewAddress = () => {
        setSelectedAddrId(null);
        setAddress({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", landmark: "" });
        setErrors({});
    };

    // Group & calculate
    const groupedCart = cart.reduce((acc, productId) => {
        acc[productId] = (acc[productId] || 0) + 1;
        return acc;
    }, {});

    const cartItems = Object.entries(groupedCart)
        .map(([productId, quantity]) => {
            const product = products.find((p) => p._id === productId);
            return product ? { ...product, quantity } : null;
        })
        .filter(Boolean);

    const totalItems = cart.length;
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = totalPrice >= 500 ? 0 : 100;
    const gst = totalPrice * 0.18;
    const grandTotal = totalPrice + shipping + gst;

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!address.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!address.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(address.phone.trim())) newErrors.phone = "Enter a valid 10-digit phone number";
        if (!address.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
        if (!address.city.trim()) newErrors.city = "City is required";
        if (!address.state.trim()) newErrors.state = "State is required";
        if (!address.pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(address.pincode.trim())) newErrors.pincode = "Enter a valid 6-digit pincode";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validate()) return;
        setPaymentError("");

        if (paymentMethod === "Cash on Delivery") {
            await dispatch(placeOrder({ paymentMethod, shippingAddress: address }));
            navigate("/orders");
            return;
        }

        // ── Razorpay Online Payment ──
        setPaymentLoading(true);

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setPaymentError("Failed to load Razorpay. Check your internet connection.");
            setPaymentLoading(false);
            return;
        }

        // 1. Create Razorpay order on backend
        let rzpOrder;
        try {
            const res = await fetch("http://localhost:3001/api/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: grandTotal }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create payment order");
            rzpOrder = data;
        } catch (err) {
            setPaymentError(err.message);
            setPaymentLoading(false);
            return;
        }

        // 2. Open Razorpay modal
        const options = {
            key: rzpOrder.keyId,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency,
            name: "Complete Bazaar",
            description: "Order Payment",
            order_id: rzpOrder.orderId,
            prefill: {
                name: address.fullName,
                email: email || "",
                contact: address.phone,
            },
            theme: { color: "#6366f1" },
            handler: async (response) => {
                // 3. Verify payment & save order
                try {
                    const verifyRes = await fetch("http://localhost:3001/api/payment/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            shippingAddress: address,
                            grandTotal: grandTotal,
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");
                    // Refresh Redux with latest orders
                    dispatch(fetchCustomerData());
                    navigate("/orders");
                } catch (err) {
                    setPaymentError(err.message);
                    setPaymentLoading(false);
                }
            },
            modal: {
                ondismiss: () => {
                    setPaymentLoading(false);
                    setPaymentError("Payment was cancelled.");
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
            setPaymentError(`Payment failed: ${response.error.description}`);
            setPaymentLoading(false);
        });
        rzp.open();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">Loading checkout...</p>
                </div>
            </div>
        );
    }

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-xl bg-slate-700/50 border ${errors[field] ? "border-red-500/50" : "border-slate-600"
        } text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Checkout
                    </h1>
                    <p className="text-slate-400 mt-1">Fill in your delivery details to place the order</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Address Form + Payment */}
                    <div className="flex-1 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-6">
                            <h2 className="text-lg font-semibold text-slate-100 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Delivery Address
                            </h2>

                            {/* Saved Address Picker */}
                            {savedAddresses.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-sm text-slate-400 mb-3">Select a saved address</p>
                                    <div className="space-y-2">
                                        {savedAddresses.map((addr) => (
                                            <button
                                                key={addr._id}
                                                onClick={() => handleSelectAddress(addr)}
                                                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${selectedAddrId === addr._id
                                                    ? "border-indigo-500 bg-indigo-500/10"
                                                    : "border-slate-700 hover:border-slate-600 bg-slate-700/20"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-slate-200">
                                                        {addr.label === "Home" ? "🏠" : addr.label === "Work" ? "🏢" : "📍"} {addr.label}
                                                    </span>
                                                    {addr.isDefault && (
                                                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Default</span>
                                                    )}
                                                    {selectedAddrId === addr._id && (
                                                        <svg className="w-4 h-4 text-indigo-400 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    {addr.street}{addr.city ? `, ${addr.city}` : ""}{addr.state ? `, ${addr.state}` : ""}{addr.pincode ? ` - ${addr.pincode}` : ""}
                                                </p>
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleNewAddress}
                                            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2 ${selectedAddrId === null
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-slate-700 hover:border-slate-600 bg-slate-700/20"
                                                }`}
                                        >
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            <span className="text-sm text-slate-300">Enter a new address</span>
                                            {selectedAddrId === null && (
                                                <svg className="w-4 h-4 text-indigo-400 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name *</label>
                                    <input type="text" name="fullName" value={address.fullName} onChange={handleChange} placeholder="John Doe" className={inputClass("fullName")} />
                                    {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Phone Number *</label>
                                    <input type="tel" name="phone" value={address.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} className={inputClass("phone")} />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Address Line 1 *</label>
                                    <input type="text" name="addressLine1" value={address.addressLine1} onChange={handleChange} placeholder="House no., Building, Street" className={inputClass("addressLine1")} />
                                    {errors.addressLine1 && <p className="text-red-400 text-xs mt-1">{errors.addressLine1}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Address Line 2</label>
                                    <input type="text" name="addressLine2" value={address.addressLine2} onChange={handleChange} placeholder="Area, Colony (optional)" className={inputClass("addressLine2")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">City *</label>
                                    <input type="text" name="city" value={address.city} onChange={handleChange} placeholder="Mumbai" className={inputClass("city")} />
                                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">State *</label>
                                    <input type="text" name="state" value={address.state} onChange={handleChange} placeholder="Maharashtra" className={inputClass("state")} />
                                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Pincode *</label>
                                    <input type="text" name="pincode" value={address.pincode} onChange={handleChange} placeholder="400001" maxLength={6} className={inputClass("pincode")} />
                                    {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Landmark</label>
                                    <input type="text" name="landmark" value={address.landmark} onChange={handleChange} placeholder="Near park, opposite mall (optional)" className={inputClass("landmark")} />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-6">
                            <h2 className="text-lg font-semibold text-slate-100 mb-5 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Payment Method
                            </h2>
                            <div className="space-y-3">
                                {/* COD */}
                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${paymentMethod === "Cash on Delivery" ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:border-slate-600"}`}>
                                    <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === "Cash on Delivery"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-indigo-500" />
                                    <span className="text-2xl">💵</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">Cash on Delivery</p>
                                        <p className="text-xs text-slate-500">Pay when your order arrives</p>
                                    </div>
                                </label>

                                {/* Razorpay Online */}
                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${paymentMethod === "Online" ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:border-slate-600"}`}>
                                    <input type="radio" name="paymentMethod" value="Online" checked={paymentMethod === "Online"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-indigo-500" />
                                    <span className="text-2xl">💳</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-200">Online Payment</p>
                                        <p className="text-xs text-slate-500">UPI, Cards, Net Banking — powered by Razorpay</p>
                                    </div>
                                    {/* Razorpay badge */}
                                    <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#3395FF]/10 border border-[#3395FF]/30">
                                        <svg className="w-3 h-3 text-[#3395FF]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.5 3.5L13.7 20.5l-3-6.7-6.7-3L20.5 3.5z" />
                                        </svg>
                                        <span className="text-[10px] font-bold text-[#3395FF]">Razorpay</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:w-80">
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-slate-100 mb-4">Order Summary</h2>

                            {/* Items Preview */}
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-700/50 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={`http://localhost:3001/${item.imageUrl}`} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-200 truncate">{item.name}</p>
                                            <p className="text-xs text-slate-500">×{item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-indigo-400">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-700 pt-3 space-y-2 mb-4">
                                <div className="flex justify-between text-slate-400 text-sm">
                                    <span>Items ({totalItems})</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-sm">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-emerald-400" : ""}>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-sm">
                                    <span>GST (18%)</span>
                                    <span>₹{gst.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-700 pt-3 mb-5">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-slate-100">Total</span>
                                    <span className="text-xl font-bold text-indigo-400">₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment error */}
                            {paymentError && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {paymentError}
                                </div>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={paymentLoading}
                                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {paymentLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {paymentMethod === "Online" ? "💳 Pay ₹" + grandTotal.toFixed(0) : "Place Order"}
                                    </>
                                )}
                            </button>

                            <Link to="/cart" className="block text-center mt-3 text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                                ← Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
