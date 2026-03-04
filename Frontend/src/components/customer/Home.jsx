import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const categories = [
    { name: "Electronics", slug: "electronics", icon: "💻", description: "Laptops, phones, gadgets & more", color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" },
    { name: "Fashion", slug: "fashion", icon: "👗", description: "Clothing, shoes & accessories", color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30" },
    { name: "Home & Living", slug: "home-living", icon: "🏠", description: "Furniture, decor & essentials", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30" },
    { name: "Books", slug: "books", icon: "📚", description: "Fiction, non-fiction & textbooks", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
    { name: "Sports", slug: "sports", icon: "⚽", description: "Equipment, gear & activewear", color: "from-red-500/20 to-orange-500/20", border: "border-red-500/30" },
    { name: "Beauty", slug: "beauty", icon: "✨", description: "Skincare, makeup & grooming", color: "from-purple-500/20 to-fuchsia-500/20", border: "border-purple-500/30" },
];

const features = [
    { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹500" },
    { icon: "🔄", title: "Easy Returns", desc: "7-day return policy" },
    { icon: "🔒", title: "Secure Payments", desc: "100% secure checkout" },
    { icon: "🎧", title: "24/7 Support", desc: "Always here to help" },
];

const Home = () => {
    const token = useSelector((state) => state.auth.token);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Animated background blobs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

                <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        Welcome to Complete Bazaar
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight mb-6">
                        Discover Products
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            You'll Love
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Shop from thousands of quality products at the best prices. From electronics to fashion, we've got everything you need.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/products"
                            className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold text-lg shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center gap-2"
                        >
                            Browse Products
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        {!token && (
                            <Link
                                to="/signup"
                                className="px-8 py-3.5 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 font-semibold text-lg transition-all duration-300"
                            >
                                Create Account
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="border-y border-slate-800 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f) => (
                            <div key={f.title} className="flex items-center gap-3">
                                <span className="text-2xl">{f.icon}</span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-200">{f.title}</p>
                                    <p className="text-xs text-slate-500">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-100 mb-3">Shop by Category</h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Explore our wide range of categories and find exactly what you're looking for.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((cat) => (
                        <Link
                            to={`/category/${cat.slug}`}
                            key={cat.name}
                            className={`group relative overflow-hidden bg-gradient-to-br ${cat.color} backdrop-blur-sm border ${cat.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg`}
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{cat.icon}</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-white transition-colors">{cat.name}</h3>
                                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{cat.description}</p>
                                </div>
                            </div>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="bg-slate-900/50 border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-100 mb-3">Why Choose Complete Bazaar?</h2>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            We make online shopping simple, safe, and enjoyable.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-7 text-center hover:border-indigo-500/30 transition-colors duration-300">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
                                <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-100 mb-2">Quality Products</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Every product goes through quality checks to ensure you get the best.</p>
                        </div>

                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-7 text-center hover:border-purple-500/30 transition-colors duration-300">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4">
                                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-100 mb-2">Best Prices</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Competitive pricing that saves you money on every purchase.</p>
                        </div>

                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-7 text-center hover:border-emerald-500/30 transition-colors duration-300">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-100 mb-2">Fast Delivery</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Quick and reliable delivery to get your orders to you on time.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-3xl p-10 sm:p-14 text-center">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="relative">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
                            Ready to Start Shopping?
                        </h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
                            Join thousands of happy customers and explore our collection of amazing products.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold text-lg shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
                        >
                            Explore Products
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
