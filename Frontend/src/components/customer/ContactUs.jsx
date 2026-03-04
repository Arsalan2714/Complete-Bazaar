import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ContactUs = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const firstName = useSelector((state) => state.auth.firstName) || localStorage.getItem("firstName") || "";

    const [form, setForm] = useState({ name: firstName, email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app this would POST to a backend endpoint
        setSubmitted(true);
    };

    const inputClass = "w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Contact Us</h1>
                        <p className="text-slate-400 mt-0.5">We'd love to hear from you</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Email */}
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-200">Email Us</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-1">For general inquiries & support</p>
                            <a href="mailto:support@apnabazaar.com" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">support@apnabazaar.com</a>
                        </div>

                        {/* Phone */}
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-200">Call Us</h3>
                            </div>
                            <p className="text-sm text-slate-400 mb-1">Mon–Sat, 9 AM – 7 PM IST</p>
                            <a href="tel:+919876543210" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">+91 98765 43210</a>
                        </div>

                        {/* Address */}
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-200">Visit Us</h3>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Apna Bazaar HQ<br />
                                Andheri West, Mumbai<br />
                                Maharashtra 400058, India
                            </p>
                        </div>

                        {/* Response Time */}
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-200">Response Time</h3>
                            </div>
                            <p className="text-sm text-slate-400">We typically respond within <span className="text-cyan-400 font-medium">24 hours</span></p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 h-full">
                            {!submitted ? (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-semibold text-slate-100">Send a Message</h2>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Your Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Subject</label>
                                            <select
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                className={inputClass}
                                                required
                                            >
                                                <option value="" disabled>Select a topic</option>
                                                <option value="order">Order Issue</option>
                                                <option value="product">Product Inquiry</option>
                                                <option value="return">Return / Refund</option>
                                                <option value="account">Account Help</option>
                                                <option value="feedback">Feedback / Suggestion</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Message</label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                rows={5}
                                                className={`${inputClass} resize-none`}
                                                placeholder="Describe your question or concern in detail..."
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-100 mb-2">Message Sent!</h3>
                                    <p className="text-slate-400 text-sm mb-6 max-w-sm">
                                        Thank you for reaching out. Our team will get back to you within 24 hours at your email address.
                                    </p>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm({ name: firstName, email: "", subject: "", message: "" }); }}
                                        className="px-5 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-all cursor-pointer"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ Preview */}
                <div className="mt-8 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-100 mb-4">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { q: "How can I track my order?", a: "Go to Orders in your profile to see real-time tracking for all purchases." },
                            { q: "What is the return policy?", a: "You can initiate a return within 7 days of delivery for most products." },
                            { q: "How do I change my delivery address?", a: "Visit your Profile → Addresses to add, edit, or set a default delivery address." },
                            { q: "Is Cash on Delivery available?", a: "Yes! COD is available for all orders. You can also pay online via UPI or cards." },
                        ].map((faq, i) => (
                            <div key={i} className="p-4 rounded-xl bg-slate-700/20 border border-slate-700">
                                <p className="text-sm font-medium text-slate-200 mb-1.5">{faq.q}</p>
                                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
