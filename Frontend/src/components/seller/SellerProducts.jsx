import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchSellerProdusts, deleteProduct } from "../../store/slices/sellerSlice";
import ErrorMessage from '../common/ErrorMessages'
import SellerProduct from "./SellerProduct";

const SellerProducts = () => {
    const { products, isLoading, errorMessage } = useSelector(
        (state) => state.seller
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        dispatch(fetchSellerProdusts());
    }, []);

    const handleEditProduct = (productId) => {
        navigate(`/edit-product/${productId}`);
    };

    const handleDeleteProduct = async (productId) => {
        const response = await fetch(`http://localhost:3001/api/seller/products/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            dispatch(deleteProduct(productId));
        } else {
            const data = await response.json();
            console.log(data);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">
                        Loading your products...
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
                        onClick={() => dispatch(fetchSellerProdusts())}
                        className="mt-6 px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Your Products
                        </h1>
                        <ErrorMessage errorMessage={errorMessage} />
                        <p className="text-slate-400 mt-1">
                            {products.length}{" "}
                            {products.length === 1 ? "product" : "products"} listed
                        </p>
                    </div>
                    <Link
                        to="/add-product"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Product
                    </Link>
                </div>

                {/* Empty State */}
                {products && products.length === 0 ? (
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
                            No products yet
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                            Start building your store by adding your first product.
                        </p>
                        <Link
                            to="/add-product"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <SellerProduct key={product._id} product={product} handleDeleteProduct={handleDeleteProduct} handleEditProduct={handleEditProduct} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerProducts;
