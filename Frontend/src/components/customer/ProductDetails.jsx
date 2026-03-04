import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, toggleWishlist } from "../../store/slices/customerSlice";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const cart = useSelector((state) => state.customer.cart);
    const wishlist = useSelector((state) => state.customer.wishlist);
    const isWishlisted = wishlist && wishlist.includes(id);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [pincode, setPincode] = useState("");
    const [pincodeResult, setPincodeResult] = useState(null); // { available, area }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/products/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setProduct(data.product);
                } else {
                    setError(data.errorMessages || "Product not found");
                }
            } catch (err) {
                setError("Failed to load product. Please try again.");
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    // Fetch related products by category
    useEffect(() => {
        if (!product) return;
        const fetchRelated = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/products");
                const data = await res.json();
                if (res.ok) {
                    const related = data.products
                        .filter((p) => p.category === product.category && p._id !== product._id)
                        .slice(0, 8);
                    setRelatedProducts(related);
                }
            } catch (err) { /* ignore */ }
        };
        fetchRelated();
    }, [product]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/reviews/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setReviews(data.reviews);
                }
            } catch (err) { /* ignore */ }
        };
        fetchReviews();
    }, [id]);

    const isInCart = cart && cart.includes(id);
    const cartItemCount = cart ? cart.filter((pid) => pid === id).length : 0;

    const handleAddToCart = async () => {
        if (!token) {
            navigate("/login");
            return;
        }
        await dispatch(addToCart(id));
    };

    const handleRemoveFromCart = () => {
        dispatch(removeFromCart(id));
    };

    const handleBuyNow = async () => {
        if (!token) {
            navigate("/login");
            return;
        }
        if (!isInCart) {
            await dispatch(addToCart(id));
        }
        navigate("/checkout");
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
        const roundUp = rating - fullStars >= 0.75;
        const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars || (roundUp && i === fullStars + 1)) {
                stars.push(
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d={starPath} />
                    </svg>
                );
            } else if (hasHalf && i === fullStars + 1) {
                stars.push(
                    <svg key={i} className="w-5 h-5" viewBox="0 0 20 20">
                        <defs>
                            <clipPath id={`half-${i}`}>
                                <rect x="0" y="0" width="10" height="20" />
                            </clipPath>
                        </defs>
                        <path d={starPath} fill="#475569" />
                        <path d={starPath} fill="#fbbf24" clipPath={`url(#half-${i})`} />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d={starPath} />
                    </svg>
                );
            }
        }
        return stars;
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <div className="bg-slate-800/60 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-400 mb-2">Product Not Found</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <Link to="/products" className="px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-colors">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    const mrp = (product.price * 1.46).toFixed(0);
    const discount = Math.round(((mrp - product.price) / mrp) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    <Link to="/products" className="hover:text-indigo-400 transition-colors">Products</Link>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    <span className="text-slate-400 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left: Product Image */}
                    <div className="lg:w-2/5">
                        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden sticky top-24">
                            <div className="aspect-square bg-slate-700/30 flex items-center justify-center p-4">
                                <img
                                    src={`http://localhost:3001/${product.imageUrl}`}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Middle: Product Info */}
                    <div className="lg:w-2/5 space-y-5">
                        {/* Category & Brand */}
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {product.category}
                            </span>
                        </div>

                        {/* Name + Wishlist */}
                        <div className="flex items-start justify-between gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 leading-tight">
                                {product.name}
                            </h1>
                            <button
                                onClick={() => {
                                    if (!token) { navigate("/login"); return; }
                                    dispatch(toggleWishlist(id));
                                }}
                                className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center hover:bg-slate-700 transition-all cursor-pointer"
                            >
                                <svg className={`w-5 h-5 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : "text-slate-400"}`} fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Brand */}
                        <p className="text-slate-400 text-sm">
                            Brand: <span className="text-indigo-400 font-medium">{product.brand}</span>
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-sm font-bold text-emerald-400">{product.rating}</span>
                                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <div className="flex">{renderStars(product.rating)}</div>
                            <span className="text-sm text-slate-500">
                                ({product.numReviews} {product.numReviews === 1 ? "review" : "reviews"})
                            </span>
                        </div>

                        <div className="border-t border-slate-700 pt-5"></div>

                        {/* Price */}
                        <div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-sm text-red-400 font-medium">-{discount}%</span>
                                <span className="text-3xl font-bold text-slate-100">₹{product.price.toFixed(0)}</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                M.R.P.: <span className="line-through">₹{mrp}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">Inclusive of all taxes</p>
                        </div>

                        <div className="border-t border-slate-700 pt-5"></div>

                        {/* Features Strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { icon: "🚚", label: "Free Delivery" },
                                { icon: "🔄", label: "7 Day Returns" },
                                { icon: "🏪", label: "CB Delivered" },
                                { icon: "🔒", label: "Secure Payment" },
                            ].map((f) => (
                                <div key={f.label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                                    <span className="text-xl">{f.icon}</span>
                                    <span className="text-xs text-slate-400 text-center">{f.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-700 pt-5"></div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-200 mb-2 uppercase tracking-wider">About this product</h3>
                            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Seller */}
                        {product.seller && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>Sold by:</span>
                                <span className="text-slate-300 font-medium">{product.seller.firstName || "Complete Bazaar Seller"}</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Buy Box */}
                    <div className="lg:w-1/5">
                        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 sticky top-24 space-y-4">

                            {/* Price */}
                            <div>
                                <span className="text-2xl font-bold text-indigo-400">₹{product.price.toFixed(0)}</span>
                                <p className="text-xs text-emerald-400 mt-1">FREE Delivery</p>
                            </div>

                            {/* Stock */}
                            <p className={`text-sm font-semibold ${product.stock > 5 ? "text-emerald-400" : product.stock > 0 ? "text-amber-400" : "text-red-400"}`}>
                                {product.stock > 5
                                    ? "In Stock"
                                    : product.stock > 0
                                        ? `Only ${product.stock} left in stock`
                                        : "Out of Stock"}
                            </p>

                            {/* Quantity */}
                            {product.stock > 0 && (
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1.5">Quantity</label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                                    >
                                        {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Buttons */}
                            {product.stock > 0 && (
                                <div className="space-y-2.5">
                                    {isInCart ? (
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between bg-slate-700/30 rounded-lg px-3 py-2">
                                                <button
                                                    onClick={handleRemoveFromCart}
                                                    className="w-8 h-8 rounded-lg bg-slate-600 hover:bg-red-500/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                                                >−</button>
                                                <span className="text-slate-200 font-semibold">{cartItemCount}</span>
                                                <button
                                                    onClick={handleAddToCart}
                                                    disabled={cartItemCount >= product.stock}
                                                    className="w-8 h-8 rounded-lg bg-slate-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-600"
                                                >+</button>
                                            </div>
                                            <Link
                                                to="/cart"
                                                className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-semibold text-center shadow-lg transition-all duration-300"
                                            >
                                                Go to Cart
                                            </Link>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-semibold shadow-lg transition-all duration-300 cursor-pointer"
                                        >
                                            Add to Cart
                                        </button>
                                    )}

                                    <button
                                        onClick={handleBuyNow}
                                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-semibold shadow-lg transition-all duration-300 cursor-pointer"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            )}

                            {/* Payment Info */}
                            <div className="border-t border-slate-700 pt-3">
                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Secure transaction
                                </p>
                            </div>

                            {/* Pincode Delivery Check */}
                            <div className="border-t border-slate-700 pt-3">
                                <label className="text-xs text-slate-400 block mb-1.5">Check Delivery Availability</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setPincodeResult(null); }}
                                        placeholder="Enter 6-digit pincode"
                                        maxLength={6}
                                        className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        onClick={() => {
                                            const kolkataPincodes = {
                                                "700001": "BBD Bagh", "700002": "GPO Kolkata", "700003": "Princep Street",
                                                "700004": "Strand Road", "700005": "Kalighat", "700006": "Beniapukur",
                                                "700007": "Bowbazar", "700008": "Kidderpore", "700009": "Hastings",
                                                "700010": "Maidan", "700011": "Alipore", "700012": "Bhowanipore",
                                                "700013": "Park Street", "700014": "Ballygunge", "700015": "Gariahat",
                                                "700016": "Dhakuria", "700017": "Jadavpur", "700018": "Tollygunge",
                                                "700019": "Entally", "700020": "Tangra", "700021": "Topsia",
                                                "700022": "New Alipore", "700023": "Garden Reach", "700024": "Metiabruz",
                                                "700025": "Santoshpur", "700026": "Behala", "700027": "Sealdah",
                                                "700028": "Maniktala", "700029": "Belgachia", "700030": "Cossipore",
                                                "700031": "Bagbazar", "700032": "Baranagar", "700033": "Sodepur",
                                                "700034": "Dum Dum", "700035": "Lake Town", "700036": "Shyambazar",
                                                "700037": "Belgharia", "700038": "Kamarhati", "700039": "Dakshineswar",
                                                "700040": "Howrah", "700041": "Liluah", "700042": "Shibpur",
                                                "700043": "Bally", "700044": "Uttarpara", "700045": "Rishra",
                                                "700046": "Kasba", "700047": "Garia", "700048": "Narendrapur",
                                                "700049": "Sonarpur", "700050": "Baruipur", "700051": "Rajpur",
                                                "700052": "Jodhpur Park", "700053": "Regent Park", "700054": "VIP Nagar",
                                                "700055": "Ultadanga", "700056": "Phoolbagan", "700057": "CIT Road",
                                                "700058": "Baguiati", "700059": "Keshtopur", "700060": "Nager Bazar",
                                                "700064": "Madhyamgram", "700065": "Airport", "700066": "Rajarhat",
                                                "700067": "New Town", "700068": "Barasat", "700069": "Habra",
                                                "700070": "Hridaypur", "700071": "Salt Lake Sec V", "700072": "Salt Lake Sec III",
                                                "700073": "Mukundapur", "700074": "Patuli", "700075": "Picnic Garden",
                                                "700076": "Park Circus", "700077": "Bansdroni", "700078": "Thakurpukur",
                                                "700079": "Joka", "700080": "Taratala", "700082": "Maheshtala",
                                                "700084": "Budge Budge", "700086": "Salt Lake", "700091": "Sector V Salt Lake",
                                                "700094": "Rajarhat Gopalpur", "700097": "New Town Action Area",
                                                "700098": "Eco Park", "700099": "Newtown Kolkata",
                                                "700100": "South City", "700101": "EM Bypass", "700102": "Ruby",
                                                "700103": "Anandapur", "700104": "Science City", "700105": "Chingrighata",
                                                "700106": "Bantala", "700107": "Kamalgazi", "700108": "Narayantala",
                                                "700109": "Baghajatin", "700110": "Netaji Nagar", "700150": "Jatragachi",
                                                "700152": "Teghoria", "700153": "Haldiram", "700154": "Chinar Park",
                                                "700155": "Birati", "700156": "Dumdum Cantonment", "700157": "Nagerbazar",
                                            };
                                            if (pincode.length !== 6) {
                                                setPincodeResult({ available: false, message: "Please enter a valid 6-digit pincode" });
                                                return;
                                            }
                                            const area = kolkataPincodes[pincode];
                                            if (area) {
                                                setPincodeResult({ available: true, message: `Delivery available to ${area}, Kolkata` });
                                            } else {
                                                setPincodeResult({ available: false, message: "Sorry, delivery is not available at this pincode" });
                                            }
                                        }}
                                        disabled={pincode.length < 6}
                                        className="w-full py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Check
                                    </button>
                                </div>
                                {pincodeResult && (
                                    <div className={`mt-2 flex items-center gap-1.5 text-xs ${pincodeResult.available ? "text-emerald-400" : "text-red-400"}`}>
                                        {pincodeResult.available ? (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                        {pincodeResult.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-slate-100 mb-6">Ratings & Reviews</h2>

                    {/* Review Form */}
                    {token && !reviewSubmitted && !reviews.find(r => r.customer?._id === undefined) && (
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-slate-200 mb-4">Write a Review</h3>
                            {reviewError && (
                                <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                    {reviewError}
                                </div>
                            )}
                            {/* Star Selector */}
                            <div className="flex items-center gap-1 mb-4">
                                <span className="text-sm text-slate-400 mr-2">Your rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const activeRating = hoverRating || reviewRating;
                                    const isFull = activeRating >= star;
                                    const isHalf = !isFull && activeRating >= star - 0.5;
                                    const starPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => {
                                                // First click = half, second click on same = full
                                                if (reviewRating === star - 0.5) {
                                                    setReviewRating(star);
                                                } else if (reviewRating === star) {
                                                    setReviewRating(star - 0.5);
                                                } else {
                                                    setReviewRating(star - 0.5);
                                                }
                                            }}
                                            onMouseEnter={() => setHoverRating(star - 0.5)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="cursor-pointer transition-transform hover:scale-110"
                                        >
                                            {isFull ? (
                                                <svg className="w-7 h-7 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d={starPath} />
                                                </svg>
                                            ) : isHalf ? (
                                                <svg className="w-7 h-7" viewBox="0 0 20 20">
                                                    <defs>
                                                        <clipPath id={`sel-half-${star}`}>
                                                            <rect x="0" y="0" width="10" height="20" />
                                                        </clipPath>
                                                    </defs>
                                                    <path d={starPath} fill="#475569" />
                                                    <path d={starPath} fill="#fbbf24" clipPath={`url(#sel-half-${star})`} />
                                                </svg>
                                            ) : (
                                                <svg className="w-7 h-7 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d={starPath} />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                                {reviewRating > 0 && (
                                    <span className="text-sm text-amber-400 ml-2 font-medium">{reviewRating}/5</span>
                                )}
                            </div>
                            {/* Comment */}
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Share your experience with this product..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-4"
                            />
                            <button
                                onClick={async () => {
                                    if (reviewRating === 0) { setReviewError("Please select a rating"); return; }
                                    if (!reviewComment.trim()) { setReviewError("Please write a comment"); return; }
                                    setReviewError("");
                                    setSubmittingReview(true);
                                    try {
                                        const res = await fetch(`http://localhost:3001/api/customer/review/${id}`, {
                                            method: "POST",
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
                                        });
                                        const data = await res.json();
                                        if (res.status === 201) {
                                            setReviews((prev) => [data, ...prev]);
                                            setReviewSubmitted(true);
                                            // Update product rating & review count live
                                            setProduct((prev) => {
                                                const newCount = (prev.numReviews || 0) + 1;
                                                const oldTotal = (prev.rating || 0) * (prev.numReviews || 0);
                                                const newRating = Math.round(((oldTotal + reviewRating) / newCount) * 10) / 10;
                                                return { ...prev, rating: newRating, numReviews: newCount };
                                            });
                                            setReviewRating(0);
                                            setReviewComment("");
                                        } else {
                                            setReviewError(data.error || "Failed to submit review");
                                        }
                                    } catch (err) {
                                        setReviewError("Something went wrong. Please try again.");
                                    }
                                    setSubmittingReview(false);
                                }}
                                disabled={submittingReview}
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-medium shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer disabled:opacity-50"
                            >
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    )}

                    {reviewSubmitted && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                            ✅ Thank you! Your review has been submitted.
                        </div>
                    )}

                    {!token && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 text-sm">
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Log in</Link> to write a review.
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 text-center">
                            <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                {review.customer?.firstName?.[0] || "?"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-200">
                                                    {review.customer?.firstName} {review.customer?.lastName}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <svg key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-amber-400" : "text-slate-600"}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommendations */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-slate-100 mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((rp) => (
                                <Link
                                    key={rp._id}
                                    to={`/product/${rp._id}`}
                                    className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:border-indigo-500/40 hover:shadow-indigo-500/10 transition-all duration-300 group"
                                >
                                    <div className="h-40 bg-slate-700/30 overflow-hidden">
                                        <img
                                            src={`http://localhost:3001/${rp.imageUrl}`}
                                            alt={rp.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-semibold text-slate-200 truncate">{rp.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{rp.brand}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-base font-bold text-indigo-400">₹{rp.price.toFixed(0)}</span>
                                            <div className="flex items-center gap-0.5">
                                                <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-xs text-slate-500">{rp.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
