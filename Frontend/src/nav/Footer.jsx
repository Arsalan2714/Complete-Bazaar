import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-block text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight mb-4">
                            Complete Bazaar
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-5">
                            Your one-stop destination for quality products at the best prices. Shop smart, shop Complete Bazaar.
                        </p>
                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all duration-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all duration-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all duration-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all duration-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Quick Links</h3>
                        <ul className="space-y-2.5">
                            <li><Link to="/" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Home</Link></li>
                            <li><Link to="/products" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Products</Link></li>
                            <li><Link to="/cart" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Cart</Link></li>
                            <li><Link to="/orders" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Orders</Link></li>
                            <li><Link to="/seller/signup" className="text-amber-400/80 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-500/50"></span>Sell with Apna Bazaar</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Customer Service</h3>
                        <ul className="space-y-2.5">
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Help Center</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Return Policy</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Shipping Info</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-600"></span>Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Get in Touch</h3>
                        <ul className="space-y-3 mb-5">
                            <li className="flex items-start gap-2.5 text-sm text-slate-400">
                                <svg className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                support@completebazaar.com
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-slate-400">
                                <svg className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +91 98765 43210
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-slate-400">
                                <svg className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Mumbai, Maharashtra, India
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Newsletter</h3>
                        <p className="text-slate-500 text-xs mb-3">Get updates on new products & deals.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
                            />
                            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-medium shadow-md hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods Bar */}
            <div className="border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Secure payments powered by trusted providers
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Payment method badges */}
                            {["Visa", "Mastercard", "UPI", "Net Banking", "COD"].map((method) => (
                                <span key={method} className="px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs font-medium">
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                        <p>© {currentYear} Complete Bazaar. All rights reserved.</p>
                        <p className="flex items-center gap-1">
                            Made with
                            <span className="text-red-400 animate-pulse">❤</span>
                            in India
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
