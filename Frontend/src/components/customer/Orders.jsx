import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCustomerData, cancelOrder, removeOrder } from "../../store/slices/customerSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Orders = () => {
    const { orders, isLoading } = useSelector((state) => state.customer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCustomerData());
    }, []);

    const handleCancelOrder = (orderId) => {
        dispatch(cancelOrder(orderId));
    };

    const handleRemoveOrder = (orderId) => {
        dispatch(removeOrder(orderId));
    };

    const handleDownloadInvoice = (order, orderNumber, uniqueProducts) => {
        const doc = new jsPDF();
        const pageW = doc.internal.pageSize.getWidth();

        // ── Header banner ──
        doc.setFillColor(79, 70, 229); // indigo-600
        doc.rect(0, 0, pageW, 28, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Complete Bazaar", 14, 12);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Your one-stop online marketplace", 14, 20);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("TAX INVOICE", pageW - 14, 16, { align: "right" });

        // ── Invoice meta ──
        doc.setTextColor(30, 41, 59); // slate-800
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const metaY = 36;
        doc.text(`Invoice No: INV-${orderNumber.toString().padStart(4, "0")}`, 14, metaY);
        doc.text(`Date: ${formatDate(order.createdAt)}`, 14, metaY + 6);
        doc.text(`Payment: ${order.paymentMethod === "Online" ? "Online (Razorpay)" : "Cash on Delivery"}`, 14, metaY + 12);
        doc.text(`Status: ${order.status || "Confirmed"}`, 14, metaY + 18);

        // ── Shipping address ──
        if (order.shippingAddress) {
            const a = order.shippingAddress;
            const addrX = pageW / 2 + 10;
            doc.setFont("helvetica", "bold");
            doc.text("Deliver To:", addrX, metaY);
            doc.setFont("helvetica", "normal");
            doc.text(a.fullName || "", addrX, metaY + 6);
            doc.text(a.addressLine1 || "", addrX, metaY + 12);
            if (a.addressLine2) doc.text(a.addressLine2, addrX, metaY + 18);
            doc.text(`${a.city || ""}, ${a.state || ""} - ${a.pincode || ""}`, addrX, metaY + (a.addressLine2 ? 24 : 18));
            doc.text(`Phone: ${a.phone || ""}`, addrX, metaY + (a.addressLine2 ? 30 : 24));
        }

        // ── Divider ──
        doc.setDrawColor(199, 210, 254); // indigo-200
        doc.line(14, 66, pageW - 14, 66);

        // ── Items table ──
        const rows = uniqueProducts.map((p, i) => [
            i + 1,
            p.name,
            p.brand || "-",
            p.quantity,
            `Rs. ${p.price.toFixed(2)}`,
            `Rs. ${(p.price * p.quantity).toFixed(2)}`,
        ]);

        autoTable(doc, {
            startY: 70,
            head: [["#", "Product", "Brand", "Qty", "Unit Price", "Total"]],
            body: rows,
            theme: "grid",
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 8, fontStyle: "bold" },
            bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
            alternateRowStyles: { fillColor: [238, 242, 255] }, // indigo-50
            columnStyles: {
                0: { cellWidth: 8 },
                1: { cellWidth: 60 },
                2: { cellWidth: 30 },
                3: { cellWidth: 12, halign: "center" },
                4: { cellWidth: 28, halign: "right" },
                5: { cellWidth: 28, halign: "right" },
            },
            margin: { left: 14, right: 14 },
        });

        // ── Totals ──
        const finalY = doc.lastAutoTable.finalY + 6;
        const subtotal = uniqueProducts.reduce((s, p) => s + p.price * p.quantity, 0);
        const shipping = subtotal >= 500 ? 0 : 100;
        const gst = subtotal * 0.18;

        const totalsX = pageW - 80;
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text("Subtotal:", totalsX, finalY);
        doc.text(`Rs. ${subtotal.toFixed(2)}`, pageW - 14, finalY, { align: "right" });
        doc.text("Shipping:", totalsX, finalY + 6);
        doc.text(shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`, pageW - 14, finalY + 6, { align: "right" });
        doc.text("GST (18%):", totalsX, finalY + 12);
        doc.text(`Rs. ${gst.toFixed(2)}`, pageW - 14, finalY + 12, { align: "right" });

        // Grand total box
        doc.setFillColor(79, 70, 229);
        doc.roundedRect(totalsX - 4, finalY + 17, pageW - totalsX - 10, 10, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("Grand Total:", totalsX, finalY + 23.5);
        doc.text(`Rs. ${order.totalAmount.toFixed(2)}`, pageW - 14, finalY + 23.5, { align: "right" });

        // ── Footer ──
        const footerY = doc.internal.pageSize.getHeight() - 14;
        doc.setDrawColor(199, 210, 254);
        doc.line(14, footerY - 4, pageW - 14, footerY - 4);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.text("Thank you for shopping with Complete Bazaar!", pageW / 2, footerY, { align: "center" });
        doc.text("This is a computer-generated invoice and does not require a signature.", pageW / 2, footerY + 5, { align: "center" });

        doc.save(`CompleteBazaar_Invoice_${orderNumber}.pdf`);
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">
                        Loading your orders...
                    </p>
                </div>
            </div>
        );
    }

    // No Orders
    if (!orders || orders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 border border-slate-600 mb-5">
                            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-200 mb-2">
                            No orders yet
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                            Start shopping and place your first order!
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

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Status badge styling
    const getStatusBadge = (status) => {
        if (status === "Cancelled") {
            return "bg-red-500/20 text-red-400 border-red-500/30";
        }
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    };

    // Payment method badge styling
    const getPaymentBadge = (method) => {
        if (method === "Online") {
            return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        }
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        My Orders
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {orders.length} {orders.length === 1 ? "order" : "orders"} placed
                    </p>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {[...orders].reverse().map((order, index) => {
                        // Group products with quantities
                        const groupedProducts = {};
                        order.products.forEach((product) => {
                            if (groupedProducts[product._id]) {
                                groupedProducts[product._id].quantity += 1;
                            } else {
                                groupedProducts[product._id] = { ...product, quantity: 1 };
                            }
                        });
                        const uniqueProducts = Object.values(groupedProducts);
                        const isCancelled = order.status === "Cancelled";

                        return (
                            <div
                                key={order._id || index}
                                className={`bg-slate-800/60 backdrop-blur-sm border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${isCancelled
                                    ? "border-red-500/30 opacity-75"
                                    : "border-slate-700 hover:border-indigo-500/30"
                                    }`}
                            >
                                {/* Order Header */}
                                <div className="px-6 py-4 border-b border-slate-700/50 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${isCancelled
                                            ? "bg-gradient-to-br from-red-500 to-rose-500"
                                            : "bg-gradient-to-br from-indigo-500 to-purple-500"
                                            }`}>
                                            #{orders.length - index}
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">Order placed</p>
                                            <p className="text-slate-200 text-sm font-medium">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm text-slate-400">Total</p>
                                            <p className={`text-xl font-bold ${isCancelled ? "text-slate-500 line-through" : "text-indigo-400"}`}>
                                                ₹{order.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(order.status || "Confirmed")}`}>
                                                {order.status || "Confirmed"}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPaymentBadge(order.paymentMethod)}`}>
                                                {order.paymentMethod === "Online" ? "💳 Online" : "💵 COD"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Products */}
                                <div className="p-6">
                                    <p className="text-sm text-slate-400 mb-3">
                                        {order.products.length} {order.products.length === 1 ? "item" : "items"}
                                    </p>
                                    <div className="space-y-3">
                                        {uniqueProducts.map((product) => (
                                            <div
                                                key={product._id}
                                                className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-700/30 border border-slate-700/50"
                                            >
                                                {/* Product Image */}
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-700/50 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={`http://localhost:3001/${product.imageUrl}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-slate-100 truncate">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-400">
                                                        {product.brand}
                                                    </p>
                                                </div>

                                                {/* Quantity + Price */}
                                                <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                                                    {product.quantity > 1 && (
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                                            ×{product.quantity}
                                                        </span>
                                                    )}
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-indigo-400">
                                                            ₹{(product.price * product.quantity).toFixed(2)}
                                                        </p>
                                                        {product.quantity > 1 && (
                                                            <p className="text-xs text-slate-500">
                                                                ₹{product.price.toFixed(2)} each
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Delivery Address */}
                                    {order.shippingAddress && (
                                        <div className="mt-4 p-4 rounded-xl bg-slate-700/20 border border-slate-700/50">
                                            <p className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Delivery Address
                                            </p>
                                            <p className="text-sm text-slate-200 font-medium">{order.shippingAddress.fullName}</p>
                                            <p className="text-sm text-slate-400">
                                                {order.shippingAddress.addressLine1}
                                                {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                            </p>
                                            {order.shippingAddress.landmark && (
                                                <p className="text-sm text-slate-500">Landmark: {order.shippingAddress.landmark}</p>
                                            )}
                                            <p className="text-sm text-slate-400 mt-1">📞 {order.shippingAddress.phone}</p>
                                        </div>
                                    )}

                                    {/* Actions: Download Invoice + Cancel/Remove */}
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                        {/* Download Invoice */}
                                        <button
                                            onClick={() => handleDownloadInvoice(order, orders.length - index, uniqueProducts)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/70 transition-all duration-200 text-sm font-medium cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download Invoice
                                        </button>

                                        {/* Cancel / Remove */}
                                        {order.status === "Confirmed" && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 text-sm font-medium cursor-pointer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel Order
                                            </button>
                                        )}
                                        {isCancelled && (
                                            <button
                                                onClick={() => handleRemoveOrder(order._id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200 text-sm font-medium cursor-pointer"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Orders;