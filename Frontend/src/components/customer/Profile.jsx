import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const customerSections = [
    {
        title: "Your Orders",
        description: "Track, return, or buy things again",
        icon: (
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        link: "/orders",
        color: "from-amber-500/10 to-orange-500/10",
        border: "border-amber-500/20",
    },
    {
        title: "Your Cart",
        description: "View and manage your shopping cart",
        icon: (
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
        ),
        link: "/cart",
        color: "from-emerald-500/10 to-teal-500/10",
        border: "border-emerald-500/20",
    },
    {
        title: "Your Wishlist",
        description: "Products you've saved for later",
        icon: (
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        link: "/wishlist",
        color: "from-red-500/10 to-pink-500/10",
        border: "border-red-500/20",
    },
    {
        title: "Browse Products",
        description: "Explore our complete product catalog",
        icon: (
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        link: "/products",
        color: "from-indigo-500/10 to-purple-500/10",
        border: "border-indigo-500/20",
    },
    {
        title: "Login & Security",
        description: "Change password and manage account security",
        icon: (
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        link: "/security",
        color: "from-violet-500/10 to-fuchsia-500/10",
        border: "border-violet-500/20",
    },
    {
        title: "Contact Us",
        description: "Get help or share feedback with our team",
        icon: (
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
        link: "/contact",
        color: "from-cyan-500/10 to-teal-500/10",
        border: "border-cyan-500/20",
    },
];

const sellerSections = [
    {
        title: "Seller Dashboard",
        description: "View your store overview and analytics",
        icon: (
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        link: "/",
        color: "from-amber-500/10 to-orange-500/10",
        border: "border-amber-500/20",
    },
    {
        title: "My Products",
        description: "View and manage all your listed products",
        icon: (
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        link: "/products",
        color: "from-indigo-500/10 to-purple-500/10",
        border: "border-indigo-500/20",
    },
    {
        title: "Add Product",
        description: "List a new product in your store",
        icon: (
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
        ),
        link: "/add-product",
        color: "from-emerald-500/10 to-green-500/10",
        border: "border-emerald-500/20",
    },
    {
        title: "Login & Security",
        description: "Change password and manage account security",
        icon: (
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        link: "/security",
        color: "from-violet-500/10 to-fuchsia-500/10",
        border: "border-violet-500/20",
    },
    {
        title: "Contact Us",
        description: "Get help or share feedback with our team",
        icon: (
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
        link: "/contact",
        color: "from-cyan-500/10 to-teal-500/10",
        border: "border-cyan-500/20",
    },
];

const emptyAddr = { label: "Home", street: "", city: "", state: "", pincode: "", isDefault: false };

const Profile = () => {
    const { firstName: reduxName, userType, token } = useSelector((state) => state.auth);
    const firstName = reduxName || localStorage.getItem("firstName");

    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });

    // Address state
    const [addresses, setAddresses] = useState([]);
    const [showAddrForm, setShowAddrForm] = useState(false);
    const [editingAddrId, setEditingAddrId] = useState(null);
    const [addrForm, setAddrForm] = useState({ ...emptyAddr });
    const [addrSaving, setAddrSaving] = useState(false);

    useEffect(() => {
        if (!token) return;
        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/customer/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setProfile(data);
                    setForm({ firstName: data.firstName || "", lastName: data.lastName || "", phone: data.phone || "" });
                    setAddresses(data.addresses || []);
                }
            } catch (err) { /* ignore */ }
        };
        fetchProfile();
    }, [token]);

    const handleSaveProfile = async () => {
        setSaving(true);
        setSaveMsg("");
        try {
            const res = await fetch("http://localhost:3001/api/customer/profile", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setEditing(false);
                setSaveMsg("Profile updated successfully!");
                if (data.firstName) localStorage.setItem("firstName", data.firstName);
                setTimeout(() => setSaveMsg(""), 3000);
            } else {
                setSaveMsg(data.error || "Failed to update");
            }
        } catch (err) {
            setSaveMsg("Something went wrong");
        }
        setSaving(false);
    };

    const handleAddOrUpdateAddress = async () => {
        setAddrSaving(true);
        try {
            const isEdit = !!editingAddrId;
            const url = isEdit
                ? `http://localhost:3001/api/customer/address/${editingAddrId}`
                : "http://localhost:3001/api/customer/address";
            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(addrForm),
            });
            const data = await res.json();
            if (res.ok) {
                setAddresses(data);
                setShowAddrForm(false);
                setEditingAddrId(null);
                setAddrForm({ ...emptyAddr });
            }
        } catch (err) { /* ignore */ }
        setAddrSaving(false);
    };

    const handleDeleteAddress = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/customer/address/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) setAddresses(data);
        } catch (err) { /* ignore */ }
    };

    const startEditAddress = (addr) => {
        setEditingAddrId(addr._id);
        setAddrForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
        setShowAddrForm(true);
    };

    const inputClass = "w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-medium text-slate-400 mb-1.5";
    const valueClass = "text-slate-200 font-medium";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-5 mb-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
                        {firstName ? firstName[0].toUpperCase() : (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100">Your Account</h1>
                        <p className="text-slate-400 mt-0.5">
                            Hello, <span className="text-indigo-400 font-medium">{firstName || "User"}</span> · {userType === "seller" ? "Seller" : "Customer"}
                        </p>
                    </div>
                </div>

                {/* ======================== Personal Details ======================== */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-slate-100">Personal Details</h2>
                        </div>
                        {!editing ? (
                            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-all cursor-pointer">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setEditing(false); if (profile) setForm({ firstName: profile.firstName || "", lastName: profile.lastName || "", phone: profile.phone || "" }); }} className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-all cursor-pointer">Cancel</button>
                                <button onClick={handleSaveProfile} disabled={saving} className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-medium shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
                            </div>
                        )}
                    </div>

                    {saveMsg && (
                        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${saveMsg.includes("success") ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>{saveMsg}</div>
                    )}

                    {editing ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>First Name</label>
                                    <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} placeholder="First name" />
                                </div>
                                <div>
                                    <label className={labelClass}>Last Name</label>
                                    <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} placeholder="Last name" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <div className="px-4 py-2.5 rounded-lg bg-slate-700/30 border border-slate-700 text-slate-400 text-sm">{profile?.email || "—"} <span className="text-xs text-slate-500 ml-1">(cannot be changed)</span></div>
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number</label>
                                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="Phone number" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                            <div><p className={labelClass}>Full Name</p><p className={valueClass}>{profile?.firstName} {profile?.lastName}</p></div>
                            <div><p className={labelClass}>Email</p><p className={valueClass}>{profile?.email || "—"}</p></div>
                            <div><p className={labelClass}>Phone</p><p className={valueClass}>{profile?.phone || <span className="text-slate-500 italic">Not added</span>}</p></div>
                            <div><p className={labelClass}>Member Since</p><p className={valueClass}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"}</p></div>
                        </div>
                    )}
                </div>

                {/* ======================== Addresses ======================== */}
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-slate-100">Your Addresses</h2>
                        </div>
                        {!showAddrForm && (
                            <button
                                onClick={() => { setAddrForm({ ...emptyAddr }); setEditingAddrId(null); setShowAddrForm(true); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add Address
                            </button>
                        )}
                    </div>

                    {/* Address Form */}
                    {showAddrForm && (
                        <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-5 mb-6">
                            <h3 className="text-sm font-semibold text-slate-200 mb-4">{editingAddrId ? "Edit Address" : "Add New Address"}</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Label</label>
                                        <select value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} className={inputClass}>
                                            <option value="Home">🏠 Home</option>
                                            <option value="Work">🏢 Work</option>
                                            <option value="Other">📍 Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Pincode</label>
                                        <input type="text" value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} className={inputClass} placeholder="Pincode" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Street Address</label>
                                    <input type="text" value={addrForm.street} onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} className={inputClass} placeholder="House no., Building, Street" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>City</label>
                                        <input type="text" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className={inputClass} placeholder="City" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>State</label>
                                        <input type="text" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className={inputClass} placeholder="State" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })} className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                                        <span className="text-sm text-slate-300">Set as default address</span>
                                    </label>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <button onClick={handleAddOrUpdateAddress} disabled={addrSaving || !addrForm.street.trim()} className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm font-medium shadow-lg transition-all cursor-pointer disabled:opacity-50">
                                        {addrSaving ? "Saving..." : editingAddrId ? "Update Address" : "Save Address"}
                                    </button>
                                    <button onClick={() => { setShowAddrForm(false); setEditingAddrId(null); }} className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-all cursor-pointer">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Address List */}
                    {addresses.length === 0 && !showAddrForm ? (
                        <div className="text-center py-8">
                            <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-slate-400 mb-1">No addresses added yet</p>
                            <p className="text-sm text-slate-500">Add an address for faster checkout</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {addresses.map((addr) => (
                                <div key={addr._id} className={`relative flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${addr.isDefault ? "bg-cyan-500/5 border-cyan-500/30" : "bg-slate-700/20 border-slate-700"}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-sm font-semibold text-slate-200">
                                                {addr.label === "Home" ? "🏠" : addr.label === "Work" ? "🏢" : "📍"} {addr.label}
                                            </span>
                                            {addr.isDefault && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Default</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            {addr.street && <>{addr.street}<br /></>}
                                            {[addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => startEditAddress(addr)}
                                            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-indigo-400 transition-all cursor-pointer"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(addr._id)}
                                            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ======================== Quick Access ======================== */}
                <h2 className="text-xl font-semibold text-slate-100 mb-5">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {(userType === "seller" ? sellerSections : customerSections).map((section) => (
                        <Link
                            key={section.title}
                            to={section.link}
                            className={`group bg-gradient-to-br ${section.color} backdrop-blur-sm border ${section.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg flex items-start gap-4`}
                        >
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                {section.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors">{section.title}</h3>
                                <p className="text-sm text-slate-400 mt-0.5">{section.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
